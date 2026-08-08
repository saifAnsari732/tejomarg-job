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
    const { isBlocked } = body;

    if (isBlocked === undefined) {
      return NextResponse.json({ error: "Missing blocked state parameters" }, { status: 400 });
    }

    // Prevent blocking oneself
    if (id === user.id) {
      return NextResponse.json({ error: "Cannot suspend your own admin account." }, { status: 400 });
    }

    const docRef = db.collection("users").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await docRef.update({ isBlocked });

    const userData = docSnap.data() || {};
    const targetUser = { _id: id, ...userData, isBlocked };

    return NextResponse.json({
      message: `User account has been ${isBlocked ? "suspended" : "restored"}.`,
      user: targetUser,
    });
  } catch (error: any) {
    console.error("Admin user PUT error:", error);
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 });
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

    // Prevent deleting oneself
    if (id === user.id) {
      return NextResponse.json({ error: "Cannot delete your own admin account." }, { status: 400 });
    }

    const docRef = db.collection("users").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ message: "User account deleted successfully." });
  } catch (error: any) {
    console.error("Admin user DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete user account" }, { status: 500 });
  }
}
