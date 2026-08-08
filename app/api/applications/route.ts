import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
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

    // 1. Check if job exists and is active
    const jobDoc = await db.collection("jobs").doc(jobId).get();
    if (!jobDoc.exists) {
      return NextResponse.json({ error: "Job posting not found." }, { status: 444 });
    }
    
    const jobData = jobDoc.data()!;

    if (jobData.status !== "active") {
      return NextResponse.json(
        { error: "This job listing is no longer accepting applications." },
        { status: 400 }
      );
    }

    // 2. Check if already applied
    const existingSnapshot = await db.collection("applications")
      .where("jobId", "==", jobId)
      .where("candidateId", "==", user.id)
      .limit(1).get();

    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { error: "You have already applied for this job." },
        { status: 400 }
      );
    }

    // 3. Create Application
    const newAppData = {
      jobId,
      candidateId: user.id,
      resumeUrl,
      coverLetter,
      status: "applied",
      createdAt: new Date().toISOString()
    };
    const appRef = await db.collection("applications").add(newAppData);

    // 4. Send Email Notification to Recruiter
    try {
      if (jobData.employerId) {
        const recruiterDoc = await db.collection("users").doc(jobData.employerId).get();
        if (recruiterDoc.exists) {
          const recruiterData = recruiterDoc.data()!;
          if (recruiterData.email) {
            await sendRecruiterAppliedEmail(
              recruiterData.email,
              recruiterData.name,
              user.name || "A candidate",
              jobData.title
            );
          }
        }
      }
    } catch (mailErr) {
      console.error("Nodemailer trigger error (suppressed):", mailErr);
    }

    return NextResponse.json(
      { message: "Application submitted successfully.", application: { _id: appRef.id, ...newAppData } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Application post error:", error);
    return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 });
  }
}
