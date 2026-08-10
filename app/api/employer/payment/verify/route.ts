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

    const secret = (process.env.RAZORPAY_KEY_SECRET || "").replace(/['"]/g, '').trim();
    
    // Verify the signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: "Transaction is not legit!" }, { status: 400 });
    }

    // Mark Job as Active in Firestore
    const paymentDate = new Date();
    await db.collection("jobs").doc(jobId).update({
      status: "active",
      paymentId: razorpay_payment_id,
      paymentOrderId: razorpay_order_id,
      paymentDate: paymentDate,
    });

    // Send Invoice Email
    try {
      const jobDoc = await db.collection("jobs").doc(jobId).get();
      if (jobDoc.exists) {
        const job = jobDoc.data() as any;
        
        let employerName = "Employer";
        let companyName = job.companyName || "Company";
        let billingEmail = job.email || "";
        
        if (job.employerId) {
          const userDoc = await db.collection("users").doc(job.employerId).get();
          if (userDoc.exists) employerName = userDoc.data()?.name || employerName;
          
          const companySnap = await db.collection("companies").where("employerId", "==", job.employerId).limit(1).get();
          if (!companySnap.empty) {
            const c = companySnap.docs[0].data();
            companyName = c.name || companyName;
            employerName = c.employerName || employerName;
            billingEmail = c.billingEmail || billingEmail;
          }
        }

        if (billingEmail) {
          const getBasePrice = (plan: string) => {
            if (plan === "Premium") return 20;
            if (plan === "Premium AI") return 3;
            if (plan === "Super Premium") return 4;
            return 10;
          };
          
          const basePrice = getBasePrice(job.pricingPlan || "Classic");
          
          const dateString = paymentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
          const timeString = paymentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

          const { sendInvoiceEmail } = await import("@/lib/emailService");
          
          await sendInvoiceEmail({
            invoiceId: jobId.substring(0, 8).toUpperCase(),
            date: `${dateString} ${timeString}`,
            employerName,
            companyName,
            billingEmail,
            jobTitle: job.title,
            plan: job.pricingPlan || "Classic",
            amount: basePrice,
            paymentId: razorpay_payment_id,
            couponCode: job.couponCode,
            jobId: jobId,
          });
        }
      }
    } catch (emailErr) {
      console.error("Failed to send invoice email:", emailErr);
      // We don't fail the verification request if email fails
    }

    return NextResponse.json({
      message: "Payment successful, job is now active",
      success: true,
    });
  } catch (error: any) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
