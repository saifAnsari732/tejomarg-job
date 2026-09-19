import { NextRequest, NextResponse } from "next/server";

// This route is deprecated. OTP verification is now handled by:
// 1. Client-side: Firebase confirmationResult.confirm(otp)
// 2. Server-side: NextAuth authorize() verifies Firebase idToken via Identity Toolkit API
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { message: "OTP verification is now handled by Firebase Phone Auth. This endpoint is deprecated." },
    { status: 410 }
  );
}
