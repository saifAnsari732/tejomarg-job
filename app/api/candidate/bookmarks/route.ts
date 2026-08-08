import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSession = session.user as any;
    
    const userDoc = await db.collection("users").doc(userSession.id).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const savedJobsIds = userDoc.data()?.savedJobs || [];
    
    // Fetch jobs manually since Firestore doesn't have "populate"
    const savedJobs = [];
    for (const jobId of savedJobsIds) {
      const jobDoc = await db.collection("jobs").doc(jobId).get();
      if (jobDoc.exists) {
        let companyData = null;
        const jobData = jobDoc.data();
        if (jobData?.companyId) {
          const compDoc = await db.collection("companies").doc(jobData.companyId).get();
          if (compDoc.exists) companyData = { _id: compDoc.id, ...compDoc.data() };
        }
        savedJobs.push({ _id: jobDoc.id, ...jobData, companyId: companyData });
      }
    }

    return NextResponse.json({ savedJobs });
  } catch (error: any) {
    console.error("Bookmarks GET error:", error);
    return NextResponse.json({ error: "Failed to retrieve saved jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const userSession = session.user as any;

    if (userSession.role !== "candidate") {
      return NextResponse.json({ error: "Only job seekers can bookmark jobs." }, { status: 403 });
    }

    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    // Verify job exists
    const jobDoc = await db.collection("jobs").doc(jobId).get();
    if (!jobDoc.exists) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }

    const userRef = db.collection("users").doc(userSession.id);
    const userDoc = await userRef.get();
    const savedJobs = userDoc.data()?.savedJobs || [];
    const isBookmarked = savedJobs.includes(jobId);

    if (isBookmarked) {
      // Remove bookmark
      await userRef.update({
        savedJobs: FieldValue.arrayRemove(jobId)
      });
      return NextResponse.json({ bookmarked: false, message: "Job removed from bookmarks." });
    } else {
      // Add bookmark
      await userRef.update({
        savedJobs: FieldValue.arrayUnion(jobId)
      });
      return NextResponse.json({ bookmarked: true, message: "Job saved to bookmarks." });
    }
  } catch (error: any) {
    console.error("Bookmarks POST error:", error);
    return NextResponse.json({ error: "Failed to update bookmarks" }, { status: 500 });
  }
}
