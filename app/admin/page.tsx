import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import { Users, Briefcase, FileText, CheckCircle, AlertTriangle, ShieldCheck, Building2, ChevronRight } from "lucide-react";

async function getAdminDashboardData() {
  try {
    const [
      seekersCount,
      employersCount,
      totalJobs,
      activeJobs,
      pendingJobs,
      totalApplications,
      unverifiedCompaniesCount
    ] = await Promise.all([
      db.collection("users").where("role", "==", "candidate").count().get().then(s => s.data().count),
      db.collection("users").where("role", "==", "employer").count().get().then(s => s.data().count),
      db.collection("jobs").count().get().then(s => s.data().count),
      db.collection("jobs").where("status", "==", "active").count().get().then(s => s.data().count),
      db.collection("jobs").where("status", "==", "pending").count().get().then(s => s.data().count),
      db.collection("applications").count().get().then(s => s.data().count),
      db.collection("companies").where("isVerified", "==", false).count().get().then(s => s.data().count),
    ]);

    return {
      seekersCount,
      employersCount,
      totalJobs,
      activeJobs,
      pendingJobs,
      totalApplications,
      unverifiedCompaniesCount,
    };
  } catch (error) {
    console.error("Error loading admin stats:", error);
    return {
      seekersCount: 0,
      employersCount: 0,
      totalJobs: 0,
      activeJobs: 0,
      pendingJobs: 0,
      totalApplications: 0,
      unverifiedCompaniesCount: 0,
    };
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const stats = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      {/* Admin Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-905 dark:text-white">Admin Control Center</h1>
          <p className="text-sm text-slate-500 mt-1">
            System overview and operational statistics for the Tejomarg Job Portal.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Seekers */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.seekersCount}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Job Seekers</p>
          </div>
        </div>

        {/* Employers */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-605 dark:text-purple-400 rounded-xl shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.employersCount}</p>
            <p className="text-xs text-slate-450 font-bold uppercase tracking-wider mt-0.5">Employers</p>
          </div>
        </div>

        {/* Jobs */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalJobs}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Total Jobs</p>
          </div>
        </div>

        {/* Applications */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalApplications}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Applications</p>
          </div>
        </div>
      </div>

      {/* Moderation Alerts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Moderation Jobs */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Jobs Awaiting Approval</span>
            </h3>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {stats.pendingJobs} pending
            </span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Review and moderate new job postings submitted by employers before they are visible to candidates.
          </p>
          <Link
            href="/admin/jobs"
            className="inline-flex items-center text-sm font-semibold text-blue-650 hover:text-blue-500 group pt-2"
          >
            <span>Moderate job postings</span>
            <ChevronRight className="h-4.5 w-4.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Company Verifications */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              <span>Company Verification Requests</span>
            </h3>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {stats.unverifiedCompaniesCount} pending
            </span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Verify and audit corporate registration credentials for new employer accounts to ensure trust.
          </p>
          <Link
            href="/admin/companies"
            className="inline-flex items-center text-sm font-semibold text-blue-650 hover:text-blue-500 group pt-2"
          >
            <span>Verify employer profiles</span>
            <ChevronRight className="h-4.5 w-4.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
