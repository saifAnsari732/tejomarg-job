import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    
    // Check if coupon exists
    const docRef = db.collection("coupons").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    const updates: any = {};
    if (body.isActive !== undefined) updates.isActive = body.isActive;
    
    await docRef.update(updates);

    return NextResponse.json({ message: "Coupon updated successfully" });
  } catch (error: any) {
    console.error("Admin coupons PATCH error:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    
    const docRef = db.collection("coupons").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error: any) {
    console.error("Admin coupons DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
