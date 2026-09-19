import { NextRequest, NextResponse } from "next/server";

// This route is deprecated. OTP is now sent via Firebase Phone Auth (client-side).
// Firebase SDK handles SMS delivery directly — no server-side OTP generation needed.
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { message: "OTP is now handled by Firebase Phone Auth. This endpoint is deprecated." },
    { status: 410 }
  );
}
