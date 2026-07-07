import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Job from "@/models/Job";

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

    await dbConnect();

    const job = await Job.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!job) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: `Job posting marked as ${status} successfully.`,
      job,
    });
  } catch (error: any) {
    console.error("Admin job PUT error:", error);
    return NextResponse.json({ error: "Failed to update job status" }, { status: 500 });
  }
}
