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
    <Link href={`/jobs/${job._id}`} className="block">
      <div className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 p-5">
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 min-w-0">
            {/* Logo */}
            <div className="shrink-0 w-12 h-12 rounded-lg border border-slate-100 p-1 flex items-center justify-center bg-white shadow-sm overflow-hidden">
              {logo ? (
                <img src={logo} alt={companyName} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-6 h-6 text-slate-300" />
              )}
            </div>

            {/* Info */}
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <div className="text-sm font-medium text-slate-600 mt-1 flex items-center gap-1.5 flex-wrap">
                <span>{companyName}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center text-slate-500">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {job.location}
                </span>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="hidden sm:block shrink-0">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
              View Job <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
            {job.jobType}
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
            {job.experienceLevel}
          </span>
          {(job.salaryMin || job.salaryMax) && (
            <span className="px-2.5 py-1 rounded bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
              ₹{(job.salaryMin / 100000).toFixed(1)} - {(job.salaryMax / 100000).toFixed(1)}L
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
