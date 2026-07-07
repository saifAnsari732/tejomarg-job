import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Job from "@/models/Job";
import Application from "@/models/Application";
import User from "@/models/User";
import { sendRecruiterAppliedEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const user = session.user as any;

    if (user.role !== "candidate") {
      return NextResponse.json({ error: "Only job seekers can apply for jobs." }, { status: 403 });
    }

    const { jobId, resumeUrl, coverLetter } = await req.json();

    if (!jobId || !resumeUrl) {
      return NextResponse.json({ error: "Job ID and resume URL are required." }, { status: 400 });
    }

    await dbConnect();

    // 1. Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job posting not found." }, { status: 444 });
    }

    if (job.status !== "active") {
      return NextResponse.json(
        { error: "This job listing is no longer accepting applications." },
        { status: 400 }
      );
    }

    // 2. Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      candidateId: user.id,
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this job." },
        { status: 400 }
      );
    }

    // 3. Create Application
    const newApplication = await Application.create({
      jobId,
      candidateId: user.id,
      resumeUrl,
      coverLetter,
      status: "applied",
    });

    // 4. Send Email Notification to Recruiter
    try {
      const recruiter = await User.findById(job.employerId);
      if (recruiter) {
        await sendRecruiterAppliedEmail(
          recruiter.email,
          recruiter.name,
          user.name || "A candidate",
          job.title
        );
      }
    } catch (mailErr) {
      console.error("Nodemailer trigger error (suppressed):", mailErr);
    }

    return NextResponse.json(
      { message: "Application submitted successfully.", application: newApplication },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Application post error:", error);
    return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 });
  }
}
