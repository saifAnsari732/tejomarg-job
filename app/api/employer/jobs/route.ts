import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import Razorpay from "razorpay";

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

    // Find all jobs posted by this employer
    const jobsSnapshot = await db.collection("jobs")
      .where("employerId", "==", user.id)
      .get();
      
    const jobs = jobsSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        _id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date(data.createdAt || Date.now()).toISOString()
      };
    });

    // Sort in memory to avoid Firestore composite index requirement
    jobs.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    // Map through jobs to attach application counts
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job: any) => {
        const appsSnapshot = await db.collection("applications")
          .where("jobId", "==", job._id)
          .get();
        return {
          ...job,
          applicantCount: appsSnapshot.size,
        };
      })
    );

    return NextResponse.json({ jobs: jobsWithCounts });
  } catch (error: any) {
    console.error("Employer jobs GET error:", error);
    return NextResponse.json({ error: "Failed to retrieve posted jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "employer") {
      return NextResponse.json({ error: "Forbidden. Recruiter access only." }, { status: 403 });
    }

    // Check if company exists
    const companySnapshot = await db.collection("companies")
      .where("employerId", "==", user.id)
      .limit(1)
      .get();

    if (companySnapshot.empty) {
      return NextResponse.json(
        { error: "Please complete your company profile before posting a job." },
        { status: 400 }
      );
    }
    const company = { _id: companySnapshot.docs[0].id, ...companySnapshot.docs[0].data() } as any;

    const body = await req.json();
    const {
      title,
      description,
      skillsRequired,
      salaryMin,
      salaryMax,
      jobType,
      location,
      experienceLevel,
      openings,
      deadline,
      category,
    } = body;

    // Validation
    if (
      !title ||
      !description ||
      !skillsRequired ||
      !jobType ||
      !location ||
      !experienceLevel ||
      !deadline ||
      !category
    ) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    // Create Job (starts as pending and must be approved by admin)
    const newJobData = {
      employerId: user.id,
      companyId: company._id,
      title,
      description,
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired
        : skillsRequired.split(",").map((s: string) => s.trim()),
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
      jobType,
      location,
      experienceLevel,
      openings: openings ? parseInt(openings) : 1,
      deadline: new Date(deadline),
      category,
      isNightShift: body.isNightShift || false,
      workLocationType: body.workLocationType || "Work From Office",
      payType: body.payType || "Fixed Only",
      perks: Array.isArray(body.perks) ? body.perks : [],
      joiningFeeRequired: body.joiningFeeRequired || false,
      minEducation: body.minEducation || "Graduate",
      ageMin: body.ageMin ? parseInt(body.ageMin) : undefined,
      ageMax: body.ageMax ? parseInt(body.ageMax) : undefined,
      isWalkInInterview: body.isWalkInInterview || false,
      communicationPreference: body.communicationPreference || "Myself",
      pricingPlan: body.pricingPlan || "Classic",
      englishLevel: body.englishLevel || "Basic English",
      genderPreference: body.gender || "Both genders allowed",
      status: body.isDraft ? "draft" : "pending_payment", // Handle draft status
      createdAt: new Date(),
    };
    
    // Remove undefined values
    Object.keys(newJobData).forEach(key => (newJobData as any)[key] === undefined && delete (newJobData as any)[key]);

    const newJobRef = await db.collection("jobs").add(newJobData);
    const newJob = { _id: newJobRef.id, ...newJobData };

    // If it's just a draft, skip payment generation
    if (body.isDraft) {
      return NextResponse.json({
        message: "Draft saved successfully",
        jobId: newJobRef.id,
      });
    }

    // Calculate Price Based on Plan
    let amountInRupees = 10; // Default
    if (body.pricingPlan === "Classic") amountInRupees = 10;
    if (body.pricingPlan === "Premium") amountInRupees = 20;
    if (body.pricingPlan === "Premium AI") amountInRupees = 3;
    if (body.pricingPlan === "Super Premium") amountInRupees = 4;

    // Apply Coupon Discount if valid
    if (body.couponCode) {
      try {
        const normalizedCode = body.couponCode.toUpperCase().trim();
        const couponSnap = await db.collection("coupons")
          .where("code", "==", normalizedCode)
          .where("isActive", "==", true)
          .get();
          
        if (!couponSnap.empty) {
          const discountPercentage = couponSnap.docs[0].data().discountPercentage;
          amountInRupees = Math.max(1, Math.round(amountInRupees * (1 - discountPercentage / 100)));
        }
      } catch (err) {
        console.error("Error applying coupon in checkout:", err);
      }
    }

    const amountInPaise = amountInRupees * 100;

    // Initialize Razorpay
    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: "receipt_order_" + newJobRef.id,
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({
      message: "Order created successfully",
      jobId: newJobRef.id,
      orderId: order.id,
      amount: order.amount,
    });
  } catch (error: any) {
    console.error("Employer jobs POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to post job" }, { status: 550 });
  }
}
