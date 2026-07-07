import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Job from "@/models/Job";
import Company from "@/models/Company";
import Application from "@/models/Application";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "employer") {
      return NextResponse.json({ error: "Forbidden. Recruiter access only." }, { status: 403 });
    }

    await dbConnect();
    
    // Find all jobs posted by this employer
    const jobs = await Job.find({ employerId: user.id }).sort({ createdAt: -1 }).lean();

    // Map through jobs to attach application counts
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job: any) => {
        const applicantCount = await Application.countDocuments({ jobId: job._id });
        return {
          ...job,
          applicantCount,
        };
      })
    );

    return NextResponse.json({ jobs: jobsWithCounts });
  } catch (error: any) {
    console.error("Employer jobs GET error:", error);
    return NextResponse.json({ error: "Failed to retrieve posted jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "employer") {
      return NextResponse.json({ error: "Forbidden. Recruiter access only." }, { status: 403 });
    }

    await dbConnect();

    // Check if company exists
    const company = await Company.findOne({ employerId: user.id });
    if (!company) {
      return NextResponse.json(
        { error: "Please complete your company profile before posting a job." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      skillsRequired,
      salaryMin,
      salaryMax,
      jobType,
      location,
      experienceLevel,
      openings,
      deadline,
      category,
    } = body;

    // Validation
    if (
      !title ||
      !description ||
      !skillsRequired ||
      !jobType ||
      !location ||
      !experienceLevel ||
      !deadline ||
      !category
    ) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    // Create Job (starts as pending and must be approved by admin)
    const newJob = await Job.create({
      employerId: user.id,
      companyId: company._id,
      title,
      description,
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired
        : skillsRequired.split(",").map((s: string) => s.trim()),
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
      jobType,
      location,
      experienceLevel,
      openings: openings ? parseInt(openings) : 1,
      deadline: new Date(deadline),
      category,
      status: "pending", // Moderate
    });

    return NextResponse.json({
      message: "Job posting submitted. It is pending admin approval.",
      job: newJob,
    });
  } catch (error: any) {
    console.error("Employer jobs POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to post job" }, { status: 550 });
  }
}
