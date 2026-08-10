import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function GET() {
  try {
    const key_id = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").replace(/['"]/g, '').trim();
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").replace(/['"]/g, '').trim();
    
    const instance = new Razorpay({
      key_id,
      key_secret,
    });
    
    const order = await instance.orders.create({
      amount: 19900,
      currency: "INR",
      receipt: "test_receipt_123"
    });
    
    return NextResponse.json({
      success: true,
      order,
      debug: {
        key_id_preview: key_id.substring(0, 10) + "...",
        key_secret_length: key_secret.length,
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.error?.description || error.message || error,
      raw_error: error,
      debug: {
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret_raw_length: process.env.RAZORPAY_KEY_SECRET?.length,
      }
    });
  }
}
