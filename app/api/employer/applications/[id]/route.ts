import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
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

    // 1. Find Application
    const appDoc = await db.collection("applications").doc(id).get();
    if (!appDoc.exists) {
      return NextResponse.json({ error: "Application record not found." }, { status: 404 });
    }
    const applicationData = appDoc.data() as any;

    const jobDoc = await db.collection("jobs").doc(applicationData.jobId).get();
    const job = jobDoc.data() as any;

    // 2. Ensure recruiter owns this job (if user is employer)
    if (user.role === "employer" && job?.employerId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden. You do not own the job posting associated with this application." },
        { status: 403 }
      );
    }

    // 3. Update status and append to history
    const updatedStatusHistory = [
      ...(applicationData.statusHistory || []),
      {
        status,
        updatedAt: new Date(),
        note: note || `Status updated to ${status} by Recruiter.`,
      }
    ];

    await db.collection("applications").doc(id).update({
      status,
      statusHistory: updatedStatusHistory
    });

    const application = {
      _id: id,
      ...applicationData,
      status,
      statusHistory: updatedStatusHistory
    };

    // 4. Send Email Notification to Candidate
    try {
      const candidateDoc = await db.collection("users").doc(applicationData.candidateId).get();
      let companyName = "Verified Employer";
      if (job?.companyId) {
        const companyDoc = await db.collection("companies").doc(job.companyId).get();
        if (companyDoc.exists) {
          companyName = companyDoc.data()?.name || companyName;
        }
      }
      
      if (candidateDoc.exists) {
        const candidate = candidateDoc.data() as any;
        await sendApplicationStatusEmail(
          candidate.email,
          candidate.name,
          job?.title || "Job Application",
          status,
          companyName
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
