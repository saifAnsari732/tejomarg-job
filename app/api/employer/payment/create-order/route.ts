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
    let amountInRupees = 199; // Default for Basic
    if (job.pricingPlan === "Standard") amountInRupees = 399;
    if (job.pricingPlan === "Premium") amountInRupees = 499;
    if (job.pricingPlan === "Enterprise") amountInRupees = 599;

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

    // Check if Razorpay keys are configured
    const key_id = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").replace(/['"]/g, '').trim();
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").replace(/['"]/g, '').trim();

    console.log("DEBUG: Razorpay Initialization");
    console.log("key_id:", key_id.substring(0, 5) + "..." + key_id.substring(key_id.length - 3));
    console.log("key_secret:", key_secret.substring(0, 3) + "..." + key_secret.substring(key_secret.length - 2));

    if (!key_id || !key_secret) {
      return NextResponse.json({ error: "Razorpay keys are missing from server configuration" }, { status: 500 });
    }

    // Initialize Razorpay
    const instance = new Razorpay({
      key_id,
      key_secret,
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
    
    // Extract Razorpay specific error if available
    const errorMessage = error?.error?.description || error?.message || "Failed to create payment order";
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
