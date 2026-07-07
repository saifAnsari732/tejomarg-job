import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Company from "@/models/Company";

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
    const { isVerified } = body;

    if (isVerified === undefined) {
      return NextResponse.json({ error: "Missing verification parameters" }, { status: 400 });
    }

    await dbConnect();

    const company = await Company.findByIdAndUpdate(
      id,
      { $set: { isVerified } },
      { new: true }
    );

    if (!company) {
      return NextResponse.json({ error: "Company profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: `Company profile has been ${isVerified ? "verified" : "unverified"}.`,
      company,
    });
  } catch (error: any) {
    console.error("Admin company PUT error:", error);
    return NextResponse.json({ error: "Failed to update company verification status" }, { status: 550 });
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
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access only." }, { status: 403 });
    }

    await dbConnect();

    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return NextResponse.json({ error: "Company profile not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Company profile deleted successfully." });
  } catch (error: any) {
    console.error("Admin company DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete company profile" }, { status: 550 });
  }
}
