import React from "react";
import Link from "next/link";
import { MapPin, Building2, Wallet, ChevronRight } from "lucide-react";

interface SimilarJobsProps {
  jobs: any[];
}

export default function SimilarJobs({ jobs }: SimilarJobsProps) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mt-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Similar jobs</h3>
      
      <div className="space-y-4">
        {jobs.map((job) => (
          <Link key={job._id} href={`/jobs/${job._id}`} className="block group border-b border-slate-100 last:border-0 pb-4 last:pb-0">
            <div className="flex items-start gap-3">
              {/* Mini Logo */}
              <div className="w-10 h-10 rounded border border-slate-100 bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm p-0.5">
                {job.companyId?.logo ? (
                  <img src={job.companyId.logo} alt="company" className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="h-5 w-5 text-slate-300" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 pr-4">
                    {job.title}
                  </h4>
                  <ChevronRight className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                </div>
                
                <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                  {job.companyId?.name || "Verified Employer"}
                </p>
                
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mt-2">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </div>
                
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mt-1">
                  <Wallet className="h-3 w-3" />
                  {job.salaryMin && job.salaryMax
                    ? "Disclosed"
                    : "Not disclosed"}
                </div>
                
                <div className="flex items-center gap-1.5 mt-2 overflow-x-hidden">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-50 text-slate-600 border border-slate-100 whitespace-nowrap">
                    <Building2 className="h-2.5 w-2.5 mr-1 text-slate-400" />
                    Work from Office
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-50 text-slate-600 border border-slate-100 whitespace-nowrap">
                    {job.jobType}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {jobs.length > 3 && (
        <div className="mt-4 text-center">
          <Link href="/jobs" className="text-emerald-600 text-sm font-semibold hover:text-emerald-700 flex items-center justify-center">
            Show more <ChevronRight className="h-4 w-4 ml-1 rotate-90" />
          </Link>
        </div>
      )}
    </div>
  );
}
