import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Job from "@/models/Job";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSession = session.user as any;

    await dbConnect();
    const user = await User.findById(userSession.id)
      .populate({
        path: "savedJobs",
        populate: { path: "companyId" },
      })
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ savedJobs: user.savedJobs || [] });
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

    await dbConnect();

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }

    const user = await User.findById(userSession.id);
    const isBookmarked = user.savedJobs.includes(jobId);

    if (isBookmarked) {
      // Remove bookmark
      await User.findByIdAndUpdate(userSession.id, {
        $pull: { savedJobs: jobId },
      });
      return NextResponse.json({ bookmarked: false, message: "Job removed from bookmarks." });
    } else {
      // Add bookmark
      await User.findByIdAndUpdate(userSession.id, {
        $addToSet: { savedJobs: jobId },
      });
      return NextResponse.json({ bookmarked: true, message: "Job saved to bookmarks." });
    }
  } catch (error: any) {
    console.error("Bookmarks POST error:", error);
    return NextResponse.json({ error: "Failed to update bookmarks" }, { status: 550 });
  }
}
