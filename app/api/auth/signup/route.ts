import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Company from "@/models/Company";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required." },
        { status: 400 }
      );
    }

    if (!["candidate", "employer"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified. Must be 'candidate' or 'employer'." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      candidateProfile: role === "candidate" ? {
        skills: [],
        experience: [],
        education: [],
        resumeUrl: "",
        avatarUrl: "",
        expectedSalary: 0,
        preferredLocation: "",
      } : undefined,
    });

    // If role is employer, create a stub Company profile
    if (role === "employer") {
      await Company.create({
        employerId: newUser._id,
        name: `${name}'s Company`,
        description: "Click 'Edit Profile' to add a detailed description of your company.",
        industry: "Information Technology",
        location: "Remote",
        logo: "",
        website: "",
        isVerified: false,
      });
    }

    return NextResponse.json(
      { message: "Account created successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
