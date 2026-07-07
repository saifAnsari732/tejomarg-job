import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Application from "@/models/Application";
import Job from "@/models/Job";
import User from "@/models/User";
import Company from "@/models/Company";
import { sendApplicationStatusEmail } from "@/lib/mailer";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "employer" && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden. Recruiter or Admin access only." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { status, note } = body;

    const allowedStatuses = ["applied", "shortlisted", "interview", "rejected", "hired"];

    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status specified. Must be: applied, shortlisted, interview, rejected, or hired." },
        { status: 400 }
      );
    }

    await dbConnect();

    // 1. Find Application
    const application = await Application.findById(id).populate("jobId");
    if (!application) {
      return NextResponse.json({ error: "Application record not found." }, { status: 404 });
    }

    const job = application.jobId as any;

    // 2. Ensure recruiter owns this job (if user is employer)
    if (user.role === "employer" && job.employerId.toString() !== user.id) {
      return NextResponse.json(
        { error: "Forbidden. You do not own the job posting associated with this application." },
        { status: 403 }
      );
    }

    // 3. Update status and append to history
    application.status = status;
    application.statusHistory.push({
      status,
      updatedAt: new Date(),
      note: note || `Status updated to ${status} by Recruiter.`,
    });

    await application.save();

    // 4. Send Email Notification to Candidate
    try {
      const candidate = await User.findById(application.candidateId);
      const company = await Company.findById(job.companyId);
      if (candidate) {
        await sendApplicationStatusEmail(
          candidate.email,
          candidate.name,
          job.title,
          status,
          company?.name || "Verified Employer"
        );
      }
    } catch (mailErr) {
      console.error("Nodemailer status trigger error (suppressed):", mailErr);
    }

    return NextResponse.json({
      message: "Application status updated successfully.",
      application,
    });
  } catch (error: any) {
    console.error("Application update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update application" }, { status: 550 });
  }
}
