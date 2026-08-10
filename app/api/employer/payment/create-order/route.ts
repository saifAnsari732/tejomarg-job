import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    // Fetch the job
    const jobDoc = await db.collection("jobs").doc(jobId).get();
    if (!jobDoc.exists) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const job = jobDoc.data() as any;

    // Calculate Price Based on Plan
    let amountInRupees = 1; // Default
    if (job.pricingPlan === "Classic") amountInRupees = 1;
    if (job.pricingPlan === "Premium") amountInRupees = 20;
    if (job.pricingPlan === "Premium AI") amountInRupees = 3;
    if (job.pricingPlan === "Super Premium") amountInRupees = 4;

    // Apply Coupon Discount if saved on job
    if (job.couponCode) {
      try {
        const normalizedCode = job.couponCode.toUpperCase().trim();
        const couponSnap = await db.collection("coupons")
          .where("code", "==", normalizedCode)
          .where("isActive", "==", true)
          .get();
          
        if (!couponSnap.empty) {
          const discountPercentage = couponSnap.docs[0].data().discountPercentage;
          amountInRupees = Math.max(1, Math.round(amountInRupees * (1 - discountPercentage / 100)));
        }
      } catch (err) {
        console.error("Error applying coupon in create-order:", err);
      }
    }

    const amountInPaise = amountInRupees * 100;

    // Initialize Razorpay
    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: "receipt_order_" + jobId,
    };

    const order = await instance.orders.create(options);

    // Update job status to pending_payment
    await db.collection("jobs").doc(jobId).update({
      status: "pending_payment",
    });

    return NextResponse.json({
      message: "Order created successfully",
      jobId: jobId,
      orderId: order.id,
      amount: order.amount,
      pricingPlan: job.pricingPlan
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
