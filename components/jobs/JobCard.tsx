import React from "react";
import Link from "next/link";
import { Building2, MapPin, Briefcase, Wallet, ChevronRight } from "lucide-react";

interface JobCardProps {
  job: any;
}

export default function JobCard({ job }: JobCardProps) {
  const companyName = job.companyId?.name || "Verified Employer";
  const logo = job.companyId?.logo;

  return (
    <Link href={`/jobs/${job._id}`} className="block group">
      <div className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 sm:p-6 relative overflow-hidden">
        {/* Subtle hover gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 min-w-0">
            {/* Logo */}
            <div className="shrink-0 w-14 h-14 rounded-xl border border-slate-100 p-2 flex items-center justify-center bg-white shadow-sm overflow-hidden z-10 group-hover:scale-105 transition-transform duration-300">
              {logo ? (
                <img src={logo} alt={companyName} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-7 h-7 text-indigo-200" />
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 z-10">
              <h3 className="text-lg font-extrabold text-indigo-900 group-hover:text-indigo-700 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <div className="text-sm font-semibold text-slate-500 mt-1.5 flex items-center gap-2 flex-wrap">
                <span className="text-slate-700">{companyName}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center text-slate-500">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {job.location}
                </span>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="hidden sm:flex shrink-0 items-center z-10">
            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300">
              View Job <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-5 z-10 relative">
          <span className="px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100/50 shadow-sm">
            {job.jobType}
          </span>
          <span className="px-3 py-1.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100/50 shadow-sm">
            {job.experienceLevel || "Entry Level"}
          </span>
          {(job.salaryMin || job.salaryMax) && (
            <span className="px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100/50 shadow-sm flex items-center gap-1">
              <Wallet className="w-3 h-3" />
              ₹{(job.salaryMin / 100000).toFixed(1)} - {(job.salaryMax / 100000).toFixed(1)}L
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
