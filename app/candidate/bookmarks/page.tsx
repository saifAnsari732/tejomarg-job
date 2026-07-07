import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Company from "@/models/Company";
import Job from "@/models/Job";
import SavedJobsList from "@/components/candidate/SavedJobsList";

async function getSavedJobs(userId: string) {
  try {
    await dbConnect();
    
    // Register Company model for deep population
    const _dummyCompany = Company.schema;
    const _dummyJob = Job.schema;

    const user = await User.findById(userId)
      .populate({
        path: "savedJobs",
        populate: { path: "companyId" },
      })
      .lean();

    if (!user) return [];

    return JSON.parse(JSON.stringify(user.savedJobs || []));
  } catch (error) {
    console.error("Error loading saved jobs:", error);
    return [];
  }
}

export default async function CandidateBookmarksPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const savedJobs = await getSavedJobs(user?.id);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Saved Jobs</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review or apply for positions you bookmarked.
        </p>
      </div>

      <SavedJobsList initialJobs={savedJobs} />
    </div>
  );
}
export const dynamic = "force-dynamic";
