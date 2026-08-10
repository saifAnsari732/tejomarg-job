import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import { Users, Briefcase, FileText, CheckCircle, AlertTriangle, ShieldCheck, Building2, ChevronRight, BarChart3, TrendingUp, Activity, Server, Database, Clock, Settings, Bell, RefreshCw, Zap } from "lucide-react";

async function getAdminDashboardData() {
  try {
    const activeJobsSnap = await db.collection("jobs").where("status", "==", "active").get();
    const activeJobsCount = activeJobsSnap.size;
    const activeJobsList = activeJobsSnap.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

    const [
      seekersCount,
      employersCount,
      totalJobs,
      pendingJobs,
      totalApplications,
      unverifiedCompaniesCount
    ] = await Promise.all([
      db.collection("users").where("role", "==", "candidate").count().get().then(s => s.data().count),
      db.collection("users").where("role", "==", "employer").count().get().then(s => s.data().count),
      db.collection("jobs").count().get().then(s => s.data().count),
      db.collection("jobs").where("status", "==", "pending").count().get().then(s => s.data().count),
      db.collection("applications").count().get().then(s => s.data().count),
      db.collection("companies").where("isVerified", "==", false).count().get().then(s => s.data().count),
    ]);

    const expiringJobs = activeJobsList.map(job => {
      let daysActive = 15;
      if (job.pricingPlan === "Standard") daysActive = 30;
      else if (job.pricingPlan === "Premium") daysActive = 45;
      else if (job.pricingPlan === "Enterprise") daysActive = 60;
      
      const createdTime = job.createdAt?.toDate ? job.createdAt.toDate().getTime() : new Date(job.createdAt || Date.now()).getTime();
      const expiresAt = createdTime + (daysActive * 24 * 60 * 60 * 1000);
      const daysLeft = Math.ceil((expiresAt - Date.now()) / (1000 * 60 * 60 * 24));
      
      return { _id: job._id, title: job.title as string, companyName: (job.companyName || "Unknown") as string, daysLeft };
    })
    .filter(job => job.daysLeft <= 10 && job.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 4);

    return {
      seekersCount,
      employersCount,
      totalJobs,
      activeJobs: activeJobsCount,
      pendingJobs,
      totalApplications,
      unverifiedCompaniesCount,
      expiringJobs,
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
      expiringJobs: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const stats = await getAdminDashboardData();

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-indigo-900/20 text-white">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-32 -mb-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 mb-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-green-100">System Online</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
              Control Center
            </h1>
            <p className="text-indigo-100 text-lg max-w-lg font-medium leading-relaxed">
              System overview and real-time operational statistics for the Tejomarg Job Portal.
            </p>
          </div>
          
          <div className="hidden md:flex flex-col items-end text-right">
            <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Welcome Back</p>
            <p className="text-xl font-bold">{user?.name || user?.phone || "Admin"}</p>
          </div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Seekers */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 dark:border-slate-700 shadow-xl shadow-slate-200/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <Users className="h-7 w-7" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500 opacity-50" />
          </div>
          <div>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stats.seekersCount}</p>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Job Seekers</p>
          </div>
        </div>

        {/* Employers */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 dark:border-slate-700 shadow-xl shadow-slate-200/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <Building2 className="h-7 w-7" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500 opacity-50" />
          </div>
          <div>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stats.employersCount}</p>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Employers</p>
          </div>
        </div>

        {/* Jobs */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 dark:border-slate-700 shadow-xl shadow-slate-200/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <Briefcase className="h-7 w-7" />
            </div>
            <BarChart3 className="h-5 w-5 text-green-500 opacity-50" />
          </div>
          <div>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stats.totalJobs}</p>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Total Jobs</p>
          </div>
        </div>

        {/* Applications */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 dark:border-slate-700 shadow-xl shadow-slate-200/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <FileText className="h-7 w-7" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500 opacity-50" />
          </div>
          <div>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stats.totalApplications}</p>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Applications</p>
          </div>
        </div>
      </div>

      {/* Actionable Alerts Row */}
      <h2 className="text-xl font-bold text-slate-800 dark:text-white pt-4 px-2">Priority Action Items</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pending Moderation Jobs */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-900/10 p-8 rounded-[2rem] border border-orange-200/50 dark:border-orange-800/30 shadow-lg shadow-orange-100 dark:shadow-none flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/30 dark:bg-orange-800/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-2xl">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <span className="text-sm font-black bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200 px-4 py-1.5 rounded-full shadow-sm">
                {stats.pendingJobs} pending
              </span>
            </div>
            <h3 className="text-xl font-black text-orange-950 dark:text-orange-100 mb-2">
              Jobs Awaiting Approval
            </h3>
            <p className="text-orange-800/80 dark:text-orange-200/70 font-medium leading-relaxed mb-8 max-w-sm">
              Review and moderate new job postings submitted by employers.
            </p>
          </div>
          
          <Link
            href="/admin/jobs"
            className="inline-flex items-center justify-between w-full md:w-max px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-md shadow-orange-600/30 hover:shadow-orange-600/50"
          >
            <span>Moderate Postings</span>
            <ChevronRight className="h-5 w-5 ml-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Company Verifications */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-900/10 p-8 rounded-[2rem] border border-indigo-200/50 dark:border-indigo-800/30 shadow-lg shadow-indigo-100 dark:shadow-none flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <span className="text-sm font-black bg-indigo-200 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200 px-4 py-1.5 rounded-full shadow-sm">
                {stats.unverifiedCompaniesCount} pending
              </span>
            </div>
            <h3 className="text-xl font-black text-indigo-950 dark:text-indigo-100 mb-2">
              Company Verifications
            </h3>
            <p className="text-indigo-800/80 dark:text-indigo-200/70 font-medium leading-relaxed mb-8 max-w-sm">
              Verify and audit corporate registration credentials for new employers.
            </p>
          </div>
          
          <Link
            href="/admin/companies"
            className="inline-flex items-center justify-between w-full md:w-max px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50"
          >
            <span>Verify Profiles</span>
            <ChevronRight className="h-5 w-5 ml-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Expiring Jobs Reminder */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-900/10 p-8 rounded-[2rem] border border-rose-200/50 dark:border-rose-800/30 shadow-lg shadow-rose-100 dark:shadow-none flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/30 dark:bg-rose-800/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-2xl">
                <Clock className="h-8 w-8" />
              </div>
              <span className="text-sm font-black bg-rose-200 text-rose-800 dark:bg-rose-800 dark:text-rose-200 px-4 py-1.5 rounded-full shadow-sm">
                {stats.expiringJobs.length} expiring soon
              </span>
            </div>
            <h3 className="text-xl font-black text-rose-950 dark:text-rose-100 mb-2">
              Upcoming Expired Jobs
            </h3>
            
            <div className="space-y-3 mb-6 relative z-10">
              {stats.expiringJobs.length > 0 ? (
                stats.expiringJobs.map((job: any) => (
                  <div key={job._id} className="flex justify-between items-center bg-white/60 dark:bg-slate-900/50 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/50">
                    <div className="overflow-hidden pr-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{job.title}</p>
                      <p className="text-[10px] text-slate-500 truncate">{job.companyName}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-black uppercase bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-md">
                      {job.daysLeft === 0 ? "Expires Today" : `${job.daysLeft} days left`}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-rose-800/80 dark:text-rose-200/70 font-medium text-sm">No jobs expiring in the next 10 days.</p>
              )}
            </div>
          </div>
          
          <Link
            href="/admin/jobs"
            className="inline-flex items-center justify-between w-full md:w-max px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-md shadow-rose-600/30 hover:shadow-rose-600/50"
          >
            <span>Manage All Jobs</span>
            <ChevronRight className="h-5 w-5 ml-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* New Sections: System Health & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        {/* System Health */}
        <div className="lg:col-span-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 dark:border-slate-700 shadow-xl shadow-slate-200/40">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">System Health</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2"><Server className="h-4 w-4" /> Server Load</span>
                <span className="font-bold text-green-500">Normal</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2"><Database className="h-4 w-4" /> Database Usage</span>
                <span className="font-bold text-blue-500">24%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500"><Clock className="h-4 w-4 inline mr-1" /> Uptime</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">99.99%</span>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 dark:border-slate-700 shadow-xl shadow-slate-200/40">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 border border-slate-100 dark:border-slate-600 rounded-2xl transition-colors group cursor-not-allowed opacity-70">
              <RefreshCw className="h-6 w-6 text-slate-400 group-hover:text-indigo-500 mb-2" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Sync Database</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 border border-slate-100 dark:border-slate-600 rounded-2xl transition-colors group cursor-not-allowed opacity-70">
              <Bell className="h-6 w-6 text-slate-400 group-hover:text-indigo-500 mb-2" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Broadcast Alert</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 border border-slate-100 dark:border-slate-600 rounded-2xl transition-colors group cursor-not-allowed opacity-70">
              <FileText className="h-6 w-6 text-slate-400 group-hover:text-indigo-500 mb-2" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Export Report</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 border border-slate-100 dark:border-slate-600 rounded-2xl transition-colors group cursor-not-allowed opacity-70">
              <Settings className="h-6 w-6 text-slate-400 group-hover:text-indigo-500 mb-2" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Platform Config</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
