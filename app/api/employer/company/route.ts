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

    const user = session.user as any;
    if (user.role !== "employer") {
      return NextResponse.json({ error: "Forbidden. Recruiter access only." }, { status: 403 });
    }

    const snapshot = await db.collection("companies").where("employerId", "==", user.id).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Company profile not found" }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    return NextResponse.json({ company: { _id: doc.id, ...doc.data() } });
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
    const { name, logo, description, website, industry, location, employerName, billingEmail, contactNumber } = body;

    if (!name || !description || !industry || !location) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    const snapshot = await db.collection("companies").where("employerId", "==", user.id).limit(1).get();
    
    let companyId;
    let updatedData = {
      name,
      logo,
      description,
      website,
      industry,
      location,
      employerName: employerName || "",
      billingEmail: billingEmail || "",
      contactNumber: contactNumber || "",
      employerId: user.id,
      updatedAt: new Date().toISOString()
    };

    if (snapshot.empty) {
      updatedData = { ...updatedData, createdAt: new Date().toISOString() } as any;
      const ref = await db.collection("companies").add(updatedData);
      companyId = ref.id;
    } else {
      companyId = snapshot.docs[0].id;
      await db.collection("companies").doc(companyId).update(updatedData);
    }

    return NextResponse.json({
      message: "Company profile updated successfully.",
      company: { _id: companyId, ...updatedData },
    });
  } catch (error: any) {
    console.error("Company PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update company profile" }, { status: 500 });
  }
}
