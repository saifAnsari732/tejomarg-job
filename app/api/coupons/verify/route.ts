import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const normalizedCode = code.toUpperCase().trim();
    const snapshot = await db.collection("coupons")
      .where("code", "==", normalizedCode)
      .where("isActive", "==", true)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 404 });
    }

    const coupon = snapshot.docs[0].data();

    return NextResponse.json({
      message: "Coupon applied successfully",
      discountPercentage: coupon.discountPercentage,
      code: coupon.code
    });
  } catch (error: any) {
    console.error("Coupon verification error:", error);
    return NextResponse.json({ error: "Failed to verify coupon" }, { status: 500 });
  }
}
