import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Company from "@/models/Company";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "employer") {
      return NextResponse.json({ error: "Forbidden. Recruiter access only." }, { status: 403 });
    }

    await dbConnect();
    const company = await Company.findOne({ employerId: user.id }).lean();

    if (!company) {
      return NextResponse.json({ error: "Company profile not found" }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (error: any) {
    console.error("Company GET error:", error);
    return NextResponse.json({ error: "Failed to retrieve company profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "employer") {
      return NextResponse.json({ error: "Forbidden. Recruiter access only." }, { status: 403 });
    }

    const body = await req.json();
    const { name, logo, description, website, industry, location } = body;

    if (!name || !description || !industry || !location) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    await dbConnect();

    const updatedCompany = await Company.findOneAndUpdate(
      { employerId: user.id },
      {
        $set: {
          name,
          logo,
          description,
          website,
          industry,
          location,
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: "Company profile updated successfully.",
      company: updatedCompany,
    });
  } catch (error: any) {
    console.error("Company PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update company profile" }, { status: 550 });
  }
}
