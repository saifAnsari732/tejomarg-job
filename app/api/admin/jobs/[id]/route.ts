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
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access only." }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    const allowedStatuses = ["active", "closed", "pending"];

    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status code" }, { status: 400 });
    }

    const docRef = db.collection("jobs").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }

    await docRef.update({ status });

    const jobData = docSnap.data() || {};
    const updatedJob = { _id: id, ...jobData, status };

    return NextResponse.json({
      message: `Job posting marked as ${status} successfully.`,
      job: updatedJob,
    });
  } catch (error: any) {
    console.error("Admin job PUT error:", error);
    return NextResponse.json({ error: "Failed to update job status" }, { status: 500 });
  }
}
