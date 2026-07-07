"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookmarkButton from "../jobs/BookmarkButton";
import { Building2, MapPin, Briefcase, ChevronRight, Inbox } from "lucide-react";

export default function SavedJobsList({ initialJobs }: { initialJobs: any[] }) {
  const router = useRouter();

  if (initialJobs.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-16 px-6 text-center shadow-sm">
        <Inbox className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4">No saved jobs</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
          You haven't bookmarked any job postings yet. Keep browsing to find opportunities you like.
        </p>
        <Link
          href="/jobs"
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 mt-6"
        >
          Explore Open Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {initialJobs.map((job) => {
        const company = job.companyId;
        return (
          <div
            key={job._id}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4 flex-1">
              {company?.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-700 mt-0.5"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <Building2 className="h-6 w-6" />
                </div>
              )}
              
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Link href={`/jobs/${job._id}`}>{job.title}</Link>
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {company?.name || "Verified Company"}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-500 font-semibold">
                  <span className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-slate-450" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <Briefcase className="h-3.5 w-3.5 mr-1 text-slate-455" />
                    {job.experienceLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100 dark:border-slate-700">
              <BookmarkButton
                jobId={job._id}
                initialBookmarked={true}
                onToggle={() => router.refresh()}
              />
              <Link
                href={`/jobs/${job._id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center"
              >
                <span>Details</span>
                <ChevronRight className="h-4.5 w-4.5 ml-0.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
