import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Job from "@/models/Job";
import Company from "@/models/Company";
import PendingJobsList from "@/components/admin/PendingJobsList";

async function getPendingJobs() {
  try {
    await dbConnect();
    
    // Register Company schema for populating
    const _dummyCompany = Company.schema;

    const jobs = await Job.find({ status: "pending" })
      .populate("companyId", "name logo industry")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(jobs));
  } catch (error) {
    console.error("Error loading pending jobs:", error);
    return [];
  }
}

export default async function AdminModerateJobsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const pendingJobs = await getPendingJobs();

  return <PendingJobsList initialJobs={pendingJobs} />;
}
export const dynamic = "force-dynamic";
