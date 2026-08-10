import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const couponsSnapshot = await db.collection("coupons").orderBy("createdAt", "desc").get();
    
    const coupons = couponsSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        _id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date(data.createdAt || Date.now()).toISOString()
      };
    });

    return NextResponse.json({ coupons });
  } catch (error: any) {
    console.error("Admin coupons GET error:", error);
    return NextResponse.json({ error: "Failed to retrieve coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { code, discountPercentage, isActive } = body;

    if (!code || typeof discountPercentage !== "number") {
      return NextResponse.json({ error: "Code and valid discount percentage are required" }, { status: 400 });
    }

    if (discountPercentage < 1 || discountPercentage > 100) {
      return NextResponse.json({ error: "Discount percentage must be between 1 and 100" }, { status: 400 });
    }

    // Check if code already exists (case-insensitive checking ideally, but we'll store as uppercase)
    const normalizedCode = code.toUpperCase().trim();
    const existing = await db.collection("coupons").where("code", "==", normalizedCode).get();
    
    if (!existing.empty) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }

    const newCoupon = {
      code: normalizedCode,
      discountPercentage,
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
    };

    const docRef = await db.collection("coupons").add(newCoupon);

    return NextResponse.json({ 
      message: "Coupon created successfully", 
      coupon: { _id: docRef.id, ...newCoupon, createdAt: newCoupon.createdAt.toISOString() }
    });
  } catch (error: any) {
    console.error("Admin coupons POST error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
