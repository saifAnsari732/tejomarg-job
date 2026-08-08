import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobId } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    
    // Verify the signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: "Transaction is not legit!" }, { status: 400 });
    }

    // Mark Job as Active in Firestore
    await db.collection("jobs").doc(jobId).update({
      status: "active",
      paymentId: razorpay_payment_id,
      paymentOrderId: razorpay_order_id,
      paymentDate: new Date(),
    });

    return NextResponse.json({
      message: "Payment successful, job is now active",
      success: true,
    });
  } catch (error: any) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
