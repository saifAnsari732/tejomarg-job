import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSession = session.user as any;
    
    const docRef = db.collection("users").doc(userSession.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: { _id: doc.id, ...doc.data() } });
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

    const docRef = db.collection("users").doc(userSession.id);
    
    const updateData = {
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
    };
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => (updateData as any)[key] === undefined && delete (updateData as any)[key]);

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: { _id: updatedDoc.id, ...updatedDoc.data() },
    });
  } catch (error: any) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile data" }, { status: 500 });
  }
}
