import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import { Briefcase, Users, FileText, CheckCircle, Clock, Plus, ArrowRight, UserPlus } from "lucide-react";

async function getEmployerDashboardData(userId: string) {
  try {
    const jobsSnap = await db.collection("jobs").where("employerId", "==", userId).get();
    const jobs = jobsSnap.docs.map(doc => ({ _id: doc.id, ...doc.data() as any }));
    const jobIds = jobs.map((j) => j._id);

    // 2. Count stats
    const activeJobs = jobs.filter((j) => j.status === "active").length;
    const pendingJobs = jobs.filter((j) => j.status === "pending").length;
    const closedJobs = jobs.filter((j) => j.status === "closed").length;

    let totalApplicationsCount = 0;
    let latestApplicationsRaw: any[] = [];
    
    if (jobIds.length > 0) {
       const chunkedJobIds = [];
       for (let i = 0; i < jobIds.length; i += 10) {
         chunkedJobIds.push(jobIds.slice(i, i + 10));
       }
       
       let allApps: any[] = [];
       for (const chunk of chunkedJobIds) {
         const snap = await db.collection("applications").where("jobId", "in", chunk).get();
         allApps = allApps.concat(snap.docs.map(doc => ({ _id: doc.id, ...doc.data() as any })));
       }
       
       totalApplicationsCount = allApps.length;
       
       allApps.sort((a, b) => {
         const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
         const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
         return dateB - dateA;
       });
       
       const top5 = allApps.slice(0, 5);
       
       latestApplicationsRaw = await Promise.all(top5.map(async (app) => {
          let jobData = jobs.find(j => j._id === app.jobId);
          let candidate = null;
          if (app.candidateId) {
             const cSnap = await db.collection("users").doc(app.candidateId).get();
             if (cSnap.exists) {
                const cData = cSnap.data() as any;
                candidate = { _id: cSnap.id, name: cData.name, email: cData.email };
             }
          }
          return {
             ...app,
             jobId: jobData ? { _id: jobData._id, title: jobData.title } : app.jobId,
             candidateId: candidate || app.candidateId
          };
       }));
    }

    return {
      stats: {
        totalJobs: jobs.length,
        activeJobs,
        pendingJobs,
        closedJobs,
        totalApplicationsCount,
      },
      latestApplications: JSON.parse(JSON.stringify(latestApplicationsRaw)),
    };
  } catch (error) {
    console.error("Error loading recruiter stats:", error);
    return {
      stats: { totalJobs: 0, activeJobs: 0, pendingJobs: 0, closedJobs: 0, totalApplicationsCount: 0 },
      latestApplications: [],
    };
  }
}

const statusColors: Record<string, string> = {
  applied: "bg-blue-50 text-blue-700 border-blue-105",
  shortlisted: "bg-purple-50 text-purple-700 border-purple-105",
  interview: "bg-amber-50 text-amber-700 border-amber-105",
  rejected: "bg-rose-50 text-rose-700 border-rose-105",
  hired: "bg-emerald-50 text-emerald-700 border-emerald-105",
};

export default async function EmployerDashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const { stats, latestApplications } = await getEmployerDashboardData(user?.id);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-905 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's an overview of your active job listings and candidate pipelines.
          </p>
        </div>
        <Link
          href="/employer/post-job"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Post a Job</span>
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Jobs */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.activeJobs}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Active Jobs</p>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.pendingJobs}</p>
            <p className="text-xs text-slate-450 font-bold uppercase tracking-wider mt-0.5">Pending Approval</p>
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalApplicationsCount}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Applicants</p>
          </div>
        </div>

        {/* Closed Roles */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-750 text-slate-500 dark:text-slate-400 rounded-xl shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.closedJobs}</p>
            <p className="text-xs text-slate-450 font-bold uppercase tracking-wider mt-0.5">Closed Positions</p>
          </div>
        </div>
      </div>

      {/* Recents Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Applications</h3>
          <Link
            href="/employer/manage-jobs"
            className="text-xs font-bold text-blue-600 hover:text-blue-500 flex items-center group"
          >
            <span>Manage postings</span>
            <ArrowRight className="h-4.5 w-4.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {latestApplications.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
            {latestApplications.map((app: any) => {
              const candidate = app.candidateId;
              const job = app.jobId;
              const badgeStyle = statusColors[app.status] || statusColors.applied;

              if (!candidate || !job) return null;

              return (
                <div key={app._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {candidate.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{candidate.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Applied for: <span className="text-slate-700 dark:text-slate-300 font-semibold">{job.title}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border capitalize ${badgeStyle}`}>
                      {app.status}
                    </span>
                    <Link
                      href={`/employer/jobs/${job._id}/applicants`}
                      className="p-1.5 text-slate-400 hover:text-slate-655 dark:hover:text-slate-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-lg transition-colors"
                      title="View Applicant Profile"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 text-sm">
            <Users className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <span>No applications received yet. Active jobs will generate applications here.</span>
          </div>
        )}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
