import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSession = session.user as any;
    
    await dbConnect();
    const user = await User.findById(userSession.id).select("-password").lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to retrieve profile data" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSession = session.user as any;
    const body = await req.json();

    const { 
      name, expectedSalary, preferredLocation, skills, experience, education, resumeUrl, avatarUrl,
      mobile, dob, gender, homeTown, totalExperience, noticePeriod, highestEducation, schoolMedium,
      furtherEducationPrefs, certifications, languages, spokenEnglishLevel, preferredJobTitles
    } = body;

    await dbConnect();
    
    // Update User and candidateProfile subdocument
    const updatedUser = await User.findByIdAndUpdate(
      userSession.id,
      {
        $set: {
          name,
          "candidateProfile.skills": skills,
          "candidateProfile.expectedSalary": expectedSalary ? parseInt(expectedSalary) : 0,
          "candidateProfile.preferredLocation": preferredLocation,
          "candidateProfile.experience": experience || [],
          "candidateProfile.education": education || [],
          "candidateProfile.resumeUrl": resumeUrl,
          "candidateProfile.avatarUrl": avatarUrl,
          "candidateProfile.mobile": mobile,
          "candidateProfile.dob": dob,
          "candidateProfile.gender": gender,
          "candidateProfile.homeTown": homeTown,
          "candidateProfile.totalExperience": totalExperience,
          "candidateProfile.noticePeriod": noticePeriod,
          "candidateProfile.highestEducation": highestEducation,
          "candidateProfile.schoolMedium": schoolMedium,
          "candidateProfile.furtherEducationPrefs": furtherEducationPrefs || [],
          "candidateProfile.certifications": certifications || [],
          "candidateProfile.languages": languages || [],
          "candidateProfile.spokenEnglishLevel": spokenEnglishLevel,
          "candidateProfile.preferredJobTitles": preferredJobTitles || [],
        },
      },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile data" }, { status: 500 });
  }
}
