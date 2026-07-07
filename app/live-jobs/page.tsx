"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search, MapPin, Briefcase, Building2, Clock, ExternalLink,
  Wifi, WifiOff, Loader2, AlertCircle, ChevronLeft, ChevronRight,
  Filter, X, Globe, Zap, RefreshCw, ArrowLeft, Star, BadgeCheck
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

const JOB_TYPES = [
  { label: "All Types", value: "" },
  { label: "Full Time",  value: "FULLTIME" },
  { label: "Part Time",  value: "PARTTIME" },
  { label: "Contract",   value: "CONTRACT" },
  { label: "Internship", value: "INTERN" },
];

const DATE_FILTERS = [
  { label: "Any Time",    value: "all" },
  { label: "Today",       value: "today" },
  { label: "3 Days",      value: "3days" },
  { label: "This Week",   value: "week" },
  { label: "This Month",  value: "month" },
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
    case "FULLTIME":  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";
    case "PARTTIME":  return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
    case "CONTRACT":  return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400";
    case "INTERN":    return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400";
    default:          return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
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

export default function LiveJobsPage() {
  const [query,      setQuery]      = useState("React Developer");
  const [location,   setLocation]   = useState("India");
  const [empType,    setEmpType]    = useState("");
  const [datePosted, setDatePosted] = useState("month");
  const [page,       setPage]       = useState(1);

  const [jobs,       setJobs]       = useState<LiveJob[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [total,      setTotal]      = useState(0);
  const [status,     setStatus]     = useState<"idle"|"live"|"mock"|"error">("idle");
  const [inputQ,     setInputQ]     = useState("React Developer");
  const [inputL,     setInputL]     = useState("India");
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = useCallback(async (q: string, loc: string, pg: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: q, location: loc, page: String(pg),
        datePosted, empType,
      });
      const res  = await fetch(`/api/jobs/live?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch jobs");
      setJobs(data.jobs  || []);
      setTotal(data.total || 0);
      setStatus(data.status || "live");
    } catch (err: any) {
      toast.error(err.message || "Could not load jobs.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }, [datePosted, empType]);

  // Load on mount
  useEffect(() => {
    fetchJobs(query, location, page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputQ);
    setLocation(inputL);
    setPage(1);
    fetchJobs(inputQ, inputL, 1);
  };

  const handleFilterChange = (key: "empType" | "datePosted", value: string) => {
    if (key === "empType")    setEmpType(value);
    if (key === "datePosted") setDatePosted(value);
    setPage(1);
    // Re-fetch with updated filter immediately
    const nextEmpType    = key === "empType"    ? value : empType;
    const nextDatePosted = key === "datePosted" ? value : datePosted;
    setTimeout(() => fetchJobsWithFilters(query, location, 1, nextEmpType, nextDatePosted), 0);
  };

  const fetchJobsWithFilters = async (q: string, loc: string, pg: number, et: string, dp: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ query: q, location: loc, page: String(pg), datePosted: dp, empType: et });
      const res  = await fetch(`/api/jobs/live?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setStatus(data.status || "live");
    } catch (err: any) {
      toast.error(err.message || "Could not filter jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchJobs(query, location, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-16">

      {/* ── Hero Header ──────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-5">

          {/* Back + Title */}
          <div className="flex items-center gap-3">
            <Link href="/"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-white">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <h1 className="text-xl font-black text-white tracking-tight">Live Job Search</h1>
                {status === "live" && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live
                  </span>
                )}
                {status === "mock" && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-300 font-medium">
                {status === "mock" ? "Add JSEARCH_API_KEY to .env.local for real listings" : "Powered by JSearch · Indeed · LinkedIn · Glassdoor"}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={inputQ}
                onChange={e => setInputQ(e.target.value)}
                placeholder="Job title, skill, or company…"
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm font-semibold bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 backdrop-blur"
              />
            </div>
            <div className="relative sm:w-52">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={inputL}
                onChange={e => setInputL(e.target.value)}
                placeholder="Location (e.g. Bangalore)"
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm font-semibold bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 backdrop-blur"
              />
            </div>
            <button type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20 cursor-pointer whitespace-nowrap">
              <Search className="h-4 w-4" /> Search Jobs
            </button>
          </form>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pt-6 space-y-5">

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Employment Type chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {JOB_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => handleFilterChange("empType", t.value)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                  empType === t.value
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Date Posted chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {DATE_FILTERS.map(d => (
              <button
                key={d.value}
                onClick={() => handleFilterChange("datePosted", d.value)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                  datePosted === d.value
                    ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900 shadow-sm"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-500"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <button
              onClick={() => fetchJobs(query, location, page)}
              title="Refresh"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results count */}
        {!loading && jobs.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Globe className="h-3.5 w-3.5" />
            <span>
              Showing <strong className="text-slate-700 dark:text-slate-300">{jobs.length}</strong> jobs for
              <strong className="text-slate-700 dark:text-slate-300"> "{query}"</strong> in
              <strong className="text-slate-700 dark:text-slate-300"> {location}</strong>
            </span>
            {status === "mock" && (
              <span className="ml-2 text-amber-500 font-semibold">
                · Demo data (add API key for real results)
              </span>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Fetching live jobs from Indeed, LinkedIn…
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && status === "error" && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Could not load jobs</p>
            <button onClick={() => fetchJobs(query, location, page)}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && status !== "error" && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <Briefcase className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              No jobs found for this search.
            </p>
            <p className="text-xs text-slate-400">Try a different keyword or location.</p>
          </div>
        )}

        {/* Job Cards Grid */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map(job => (
              <div key={job.id}
                className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all">

                <div className="flex items-start gap-4">
                  {/* Company Logo / Initials */}
                  <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                    {job.companyLogo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                        {job.company.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h2 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {job.title}
                        </h2>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{job.company}</span>
                          {job.source !== "Mock Data" && (
                            <span title="Verified listing" className="flex items-center">
                              <BadgeCheck className="h-3 w-3 text-blue-400" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Apply button */}
                      <a href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
                        Apply Now <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {job.location}
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
                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          💰 {job.salary}
                        </span>
                      )}

                      <span className="flex items-center gap-1 ml-auto">
                        <Clock className="h-3 w-3" />
                        {timeAgo(job.postedAt)}
                      </span>
                    </div>

                    {/* Description snippet */}
                    <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {job.description}
                    </p>

                    {/* Source badge */}
                    <div className="mt-2">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-slate-300 dark:text-slate-600">
                        via {job.source}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && jobs.length > 0 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-400 transition-all cursor-pointer">
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">
              Page {page}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800 hover:border-blue-400 transition-all cursor-pointer">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
