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
    const { isVerified } = body;

    if (isVerified === undefined) {
      return NextResponse.json({ error: "Missing verification parameters" }, { status: 400 });
    }

    const docRef = db.collection("companies").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Company profile not found" }, { status: 404 });
    }

    await docRef.update({ isVerified });

    const companyData = docSnap.data() || {};
    const updatedCompany = { _id: id, ...companyData, isVerified };

    return NextResponse.json({
      message: `Company profile has been ${isVerified ? "verified" : "unverified"}.`,
      company: updatedCompany,
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

    const docRef = db.collection("companies").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Company profile not found" }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ message: "Company profile deleted successfully." });
  } catch (error: any) {
    console.error("Admin company DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete company profile" }, { status: 550 });
  }
}
