import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

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

    await dbConnect();

    // Prevent blocking oneself
    if (id === user.id) {
      return NextResponse.json({ error: "Cannot suspend your own admin account." }, { status: 400 });
    }

    const targetUser = await User.findByIdAndUpdate(
      id,
      { $set: { isBlocked } },
      { new: true }
    );

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    await dbConnect();

    // Prevent deleting oneself
    if (id === user.id) {
      return NextResponse.json({ error: "Cannot delete your own admin account." }, { status: 400 });
    }

    const targetUser = await User.findByIdAndDelete(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User account deleted successfully." });
  } catch (error: any) {
    console.error("Admin user DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete user account" }, { status: 500 });
  }
}
