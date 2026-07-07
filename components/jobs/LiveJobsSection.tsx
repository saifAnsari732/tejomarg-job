"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Loader2, ExternalLink, MapPin, Building2, Clock,
  Wifi, ChevronLeft, ChevronRight, AlertCircle, Briefcase,
  BadgeCheck, RefreshCw, Globe, Zap
} from "lucide-react";
import toast from "react-hot-toast";

interface LiveJob {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
  type: string;
  isRemote: boolean;
  salary: string;
  description: string;
  applyUrl: string;
  postedAt: string | null;
  source: string;
}

const DATE_FILTERS = [
  { label: "Any Time", value: "all" },
  { label: "Today",    value: "today" },
  { label: "3 Days",   value: "3days" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function typeColor(type: string) {
  switch (type) {
    case "FULLTIME": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "PARTTIME": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "CONTRACT": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "INTERN":   return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    default:         return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
  }
}

function typeLabel(type: string) {
  switch (type) {
    case "FULLTIME": return "Full Time";
    case "PARTTIME": return "Part Time";
    case "CONTRACT": return "Contract";
    case "INTERN":   return "Internship";
    default:         return type;
  }
}

interface Props {
  initialQuery?: string;
  initialLocation?: string;
}

export default function LiveJobsSection({ initialQuery = "Developer", initialLocation = "India" }: Props) {
  const [jobs,       setJobs]       = useState<LiveJob[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [status,     setStatus]     = useState<"live" | "mock" | "error" | "idle">("idle");
  const [page,       setPage]       = useState(1);
  const [datePosted, setDatePosted] = useState("month");
  const [empType,    setEmpType]    = useState("");

  const fetchJobs = useCallback(async (pg: number, dp: string, et: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: initialQuery,
        location: initialLocation,
        page: String(pg),
        datePosted: dp,
        empType: et,
      });
      const res  = await fetch(`/api/jobs/live?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setJobs(data.jobs  || []);
      setStatus(data.status || "live");
    } catch (err: any) {
      toast.error("Could not load live jobs.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }, [initialQuery, initialLocation]);

  useEffect(() => {
    fetchJobs(1, datePosted, empType);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, initialLocation]);

  const handleDateFilter = (val: string) => {
    setDatePosted(val);
    setPage(1);
    fetchJobs(1, val, empType);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchJobs(newPage, datePosted, empType);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Top bar: status badge + date filter chips + refresh */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
        {/* Live / Mock badge */}
        <div className="flex items-center gap-1.5 mr-2">
          <Zap className="h-3.5 w-3.5 text-yellow-500" />
          {status === "live" ? (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Results
            </span>
          ) : status === "mock" ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Demo Mode
            </span>
          ) : null}
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-600" />

        {/* Date filters */}
        <div className="flex flex-wrap gap-1.5">
          {DATE_FILTERS.map(d => (
            <button
              key={d.value}
              onClick={() => handleDateFilter(d.value)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                datePosted === d.value
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-400 bg-transparent"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => fetchJobs(page, datePosted, empType)}
          title="Refresh"
          className="ml-auto p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Source note */}
      {status === "mock" && (
        <div className="flex items-start gap-2.5 text-[11px] bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-3.5 py-3">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-700 dark:text-amber-400">Demo data shown — Real jobs ke liye:</p>
            <p className="text-amber-600 dark:text-amber-500 mt-0.5">
              1. RapidAPI par{" "}
              <a href="https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch" target="_blank" rel="noopener noreferrer"
                className="underline font-bold hover:text-amber-800">
                JSearch API subscribe karo (Free plan)
              </a>
              {" "}→ 2. Apna API key <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">.env.local</code> mein paste karo → 3. Server restart karo
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
          <p className="text-xs font-semibold text-slate-400">
            Fetching live jobs from Indeed, LinkedIn…
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && status === "error" && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Could not load live jobs</p>
          <button onClick={() => fetchJobs(page, datePosted, empType)}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">Try again</button>
        </div>
      )}

      {/* Empty */}
      {!loading && status !== "error" && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Briefcase className="h-8 w-8 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No live jobs found</p>
          <p className="text-xs text-slate-400">Try different keywords or remove filters.</p>
        </div>
      )}

      {/* Job Cards */}
      {!loading && jobs.length > 0 && (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id}
              className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all overflow-hidden">

              <div className="flex items-start gap-3 p-4">
                {/* Logo / Initial */}
                <Link href={`/jobs/live/${encodeURIComponent(job.id)}`} className="shrink-0">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                    {job.companyLogo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-base font-black text-blue-600 dark:text-blue-400">{job.company.charAt(0)}</span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <Link href={`/jobs/live/${encodeURIComponent(job.id)}`} className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{job.company}</span>
                        {job.source !== "Mock Data" && (
                          <BadgeCheck className="h-3 w-3 text-blue-400" title="Verified" />
                        )}
                      </div>
                    </Link>

                    <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all shadow-sm shadow-blue-500/20">
                      Apply <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-2.5 mt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" /> {job.location}
                    </span>
                    {job.isRemote && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <Wifi className="h-3 w-3" /> Remote
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${typeColor(job.type)}`}>
                      {typeLabel(job.type)}
                    </span>
                    {job.salary !== "Not Disclosed" && (
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        💰 {job.salary}
                      </span>
                    )}
                    <span className="flex items-center gap-1 ml-auto">
                      <Clock className="h-3 w-3" /> {timeAgo(job.postedAt)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  {/* Footer row */}
                  <div className="flex items-center justify-between mt-2.5">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-slate-300 dark:text-slate-600">
                      via {job.source}
                    </p>
                    <Link href={`/jobs/live/${encodeURIComponent(job.id)}`}
                      className="text-[11px] font-bold text-blue-500 hover:text-blue-700 hover:underline transition-colors">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && jobs.length > 0 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-400 transition-all cursor-pointer">
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <span className="text-xs font-bold text-slate-500 px-2">Page {page}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800 hover:border-blue-400 transition-all cursor-pointer">
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
