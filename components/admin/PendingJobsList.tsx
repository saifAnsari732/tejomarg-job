"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Check, X, Building2, MapPin, Briefcase, Calendar, Info, Loader2, Inbox } from "lucide-react";

interface Company {
  name: string;
  logo?: string;
  industry: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  salaryMin?: number;
  salaryMax?: number;
  jobType: string;
  location: string;
  experienceLevel: string;
  openings: number;
  deadline: string;
  companyId: Company;
}

interface PendingJobsListProps {
  initialJobs: Job[];
}

export default function PendingJobsList({ initialJobs }: PendingJobsListProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleModeration = async (jobId: string, nextStatus: "active" | "closed") => {
    setUpdatingId(jobId);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      toast.success(
        nextStatus === "active" ? "Job posting approved & is now live!" : "Job posting rejected."
      );
      // Remove from pending list
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch (err: any) {
      toast.error(err.message || "Failed to moderate job posting");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Moderate Job Postings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review and audit newly posted job listings before releasing them live.
        </p>
      </div>

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => {
            const company = job.companyId;
            const isExpanded = expandedId === job._id;

            return (
              <div
                key={job._id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-105 dark:border-slate-700 p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow gap-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    {company?.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100 mt-0.5"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-105 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                        <Building2 className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-905 dark:text-white text-base">{job.title}</h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        Posted by: <span className="text-blue-605 font-bold">{company?.name || "Verified Recruiter"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : job._id)}
                      className={`p-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-500 transition-colors cursor-pointer ${
                        isExpanded ? "bg-slate-100 text-slate-700" : "border-slate-205"
                      }`}
                      title="Inspect Description Details"
                    >
                      <Info className="h-4 w-4" />
                    </button>

                    {updatingId === job._id ? (
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400 mx-2" />
                    ) : (
                      <>
                        <button
                          onClick={() => handleModeration(job._id, "active")}
                          className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-650 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/10 cursor-pointer flex items-center gap-1"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleModeration(job._id, "closed")}
                          className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Subtext info */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 font-semibold border-t border-slate-50 pt-3">
                  <span className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    {job.experienceLevel}
                  </span>
                  <span>Job Type: {job.jobType}</span>
                  <span>Est Salary: ${job.salaryMin?.toLocaleString() || 0} - ${job.salaryMax?.toLocaleString() || 0}/yr</span>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 p-5 rounded-xl border border-slate-100 dark:border-slate-750 space-y-4 animate-fade-in">
                    <div>
                      <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-1">Description:</h4>
                      <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">
                        {job.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs uppercase text-slate-405 tracking-wider mb-1.5">Required Skills:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {job.skillsRequired.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded text-xs font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl py-16 px-6 text-center shadow-sm">
          <Inbox className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-650" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4">No jobs to moderate</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            All submitted job postings have been reviewed. Recruiter postings requiring verification will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}
