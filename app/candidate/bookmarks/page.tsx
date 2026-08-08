import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import SavedJobsList from "@/components/candidate/SavedJobsList";

async function getSavedJobs(userId: string) {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return [];
    
    const savedJobIds = userDoc.data()?.savedJobs || [];
    if (!savedJobIds.length) return [];
    
    const savedJobs = await Promise.all(savedJobIds.map(async (jobId: string) => {
      const jobSnap = await db.collection("jobs").doc(jobId).get();
      if (!jobSnap.exists) return null;
      
      const jobData = jobSnap.data() as any;
      let companyData = null;
      if (jobData.companyId) {
         const compSnap = await db.collection("companies").doc(jobData.companyId).get();
         if (compSnap.exists) {
            companyData = { _id: compSnap.id, ...compSnap.data() };
         }
      }
      return { _id: jobSnap.id, ...jobData, companyId: companyData || jobData.companyId };
    }));
    
    return JSON.parse(JSON.stringify(savedJobs.filter(Boolean)));
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
