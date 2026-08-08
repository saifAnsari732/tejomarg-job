import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "employer" && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const jobDoc = await db.collection("jobs").doc(id).get();
    if (!jobDoc.exists) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }
    const job = { _id: jobDoc.id, ...jobDoc.data() } as any;

    if (user.role === "employer" && job.employerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized to edit this job posting" }, { status: 403 });
    }

    // Update fields dynamically
    const fieldsToUpdate = [
      "title",
      "description",
      "skillsRequired",
      "salaryMin",
      "salaryMax",
      "jobType",
      "location",
      "experienceLevel",
      "openings",
      "deadline",
      "category",
      "status", // Can toggle "active" / "closed"
    ];

    fieldsToUpdate.forEach((field) => {
      if (body[field] !== undefined) {
        if (field === "skillsRequired" && typeof body[field] === "string") {
          job[field] = body[field].split(",").map((s: string) => s.trim());
        } else if (field === "deadline") {
          job[field] = new Date(body[field]);
        } else {
          job[field] = body[field];
        }
      }
    });

    const { _id, ...updateData } = job;
    await db.collection("jobs").doc(id).update(updateData);

    return NextResponse.json({ message: "Job listing updated successfully.", job });
  } catch (error: any) {
    console.error("Job edit error:", error);
    return NextResponse.json({ error: error.message || "Failed to update job posting" }, { status: 550 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "employer" && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const jobDoc = await db.collection("jobs").doc(id).get();
    if (!jobDoc.exists) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }
    const job = jobDoc.data() as any;

    if (user.role === "employer" && job.employerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized to delete this job posting" }, { status: 403 });
    }

    await db.collection("jobs").doc(id).delete();

    return NextResponse.json({ message: "Job listing deleted successfully." });
  } catch (error: any) {
    console.error("Job delete error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete job posting" }, { status: 550 });
  }
}
