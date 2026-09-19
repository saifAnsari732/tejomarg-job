import React from "react";
import Link from "next/link";
import { Building2, MapPin, Briefcase, Wallet, ChevronRight, CheckCircle2 } from "lucide-react";

interface JobCardProps {
  job: any;
}

export default function JobCard({ job }: JobCardProps) {
  const companyName = job.companyId?.name || "Verified Employer";
  const logo = job.companyId?.logo;

  const formatSalary = () => {
    const min = parseFloat(job.salaryMin);
    const max = parseFloat(job.salaryMax);
    if (!isNaN(min) && !isNaN(max) && min > 0 && max > 0) {
      if (min >= 100000 || max >= 100000) {
        return `₹${(min / 100000).toFixed(1)} - ${(max / 100000).toFixed(1)} Lakhs`;
      }
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    }
    if (job.salary && job.salary !== "Not Disclosed") return job.salary;
    return null;
  };

  const salaryDisplay = formatSalary();

  return (
    <Link href={`/jobs/${job._id}`} className="block group">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-[0_12px_30px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-all duration-300 p-5 sm:p-6 relative overflow-hidden">
        
        {/* Subtle hover gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="flex gap-4 min-w-0">
            {/* Company Logo */}
            <div className="shrink-0 w-14 h-14 rounded-2xl border border-slate-100 dark:border-slate-700 p-2 flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-300">
              {logo ? (
                <img src={logo} alt={companyName} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>

            {/* Job Information */}
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1">
                  {companyName}
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="flex items-center text-slate-500 dark:text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                  {job.location || "Multiple Locations"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="hidden sm:flex shrink-0 items-center">
            <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md group-hover:shadow-lg transition-all duration-300">
              View Job <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        {/* Feature Tags & Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-5 relative z-10 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200/60 dark:border-emerald-800/40">
            {job.jobType || "Full-time"}
          </span>
          
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200/60 dark:border-slate-600">
            {job.experienceLevel || "Entry Level"}
          </span>

          {salaryDisplay && (
            <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200/60 dark:border-teal-800/40 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              {salaryDisplay}
            </span>
          )}
        </div>

      </div>
    </Link>
  );
}
