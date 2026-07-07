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
      <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all duration-300 relative group">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="w-12 h-12 rounded-lg border border-slate-100 bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm p-1">
            {logo ? (
              <img src={logo} alt={companyName} className="w-full h-full object-contain" />
            ) : (
              <Building2 className="h-6 w-6 text-slate-300" />
            )}
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex justify-between items-start pr-6">
              <h2 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                {job.title}
              </h2>
              {/* Chevron icon on far right */}
              <ChevronRight className="absolute right-5 top-5 h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
            
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              {companyName}
            </p>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-3">
              <span className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {job.location}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-2">
              <span className="flex items-center">
                <Wallet className="h-3.5 w-3.5 mr-1" />
                {job.salaryMin && job.salaryMax
                  ? `₹${(job.salaryMin / 100000).toFixed(1)} - ${(job.salaryMax / 100000).toFixed(1)} Lakhs`
                  : "Not disclosed"}
              </span>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                <Building2 className="h-3 w-3 mr-1.5 text-slate-400" />
                Work from Office
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                <div className="h-3 w-3 rounded-full bg-slate-400 text-white flex items-center justify-center mr-1.5 text-[8px]">F</div>
                {job.jobType}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                <Briefcase className="h-3 w-3 mr-1.5 text-slate-400" />
                {job.experienceLevel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
