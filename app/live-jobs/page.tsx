"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search, MapPin, Briefcase, Building2, Clock, ExternalLink,
  Wifi, Loader2, AlertCircle, ChevronLeft, ChevronRight,
  Globe, Zap, RefreshCw, ArrowLeft, BadgeCheck, Sparkles, CheckCircle2
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
    case "FULLTIME":  return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
    case "PARTTIME":  return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
    case "CONTRACT":  return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
    case "INTERN":    return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
    default:          return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
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
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-16 font-sans">

      {/* Hero Header Banner */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-4">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 border border-emerald-500/20 p-8 sm:p-12 text-white shadow-2xl overflow-hidden space-y-6">
          
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/15 text-white">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-2xl sm:text-3xl tracking-tight">Live Real-Time Job Feed</h1>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <p className="text-xs text-emerald-100/80 font-semibold">
                  Aggregated live job listings from top Indian companies & remote global portals
                </p>
              </div>
            </div>

            <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider self-start sm:self-auto backdrop-blur-md">
              LIVE API SYNC 🟢
            </span>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 relative z-10 pt-2">
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={inputQ}
                onChange={e => setInputQ(e.target.value)}
                placeholder="Job title, skill, or company name..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-xs font-semibold bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur shadow-inner"
              />
            </div>

            <div className="sm:col-span-4 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={inputL}
                onChange={e => setInputL(e.target.value)}
                placeholder="Location (e.g. Bangalore / Remote)"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-xs font-semibold bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="sm:col-span-2 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Search className="h-4 w-4" /> Search
            </button>
          </form>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 pt-4 space-y-6">

        {/* Filter Chips Bar */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-4 rounded-2xl shadow-sm flex flex-wrap items-center gap-3">
          
          {/* Employment Type Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {JOB_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => handleFilterChange("empType", t.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
                  empType === t.value
                    ? "bg-emerald-500 border-emerald-500 text-slate-950 shadow-md"
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* Date Posted Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {DATE_FILTERS.map(d => (
              <button
                key={d.value}
                onClick={() => handleFilterChange("datePosted", d.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
                  datePosted === d.value
                    ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-950 shadow-md"
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <button
              onClick={() => fetchJobs(query, location, page)}
              title="Refresh Feed"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results Counter */}
        {!loading && jobs.length > 0 && (
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-emerald-500" />
              Showing <strong className="text-slate-900 dark:text-white">{jobs.length}</strong> live jobs for
              <strong className="text-slate-900 dark:text-white"> "{query}"</strong> in
              <strong className="text-slate-900 dark:text-white"> {location}</strong>
            </span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Fetching live job feed...</h4>
            <p className="text-xs text-slate-400 max-w-xs">Connecting to real-time employer APIs and live job indexes.</p>
          </div>
        )}

        {/* Error State */}
        {!loading && status === "error" && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Could not load live job feed</h4>
            <button onClick={() => fetchJobs(query, location, page)}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && status !== "error" && jobs.length === 0 && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
            <Briefcase className="h-10 w-10 text-slate-400" />
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">No live jobs found for this search</h4>
            <p className="text-xs text-slate-400">Try adjusting your job title keyword or location filter.</p>
          </div>
        )}

        {/* Job Cards */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map(job => (
              <div key={job.id}
                className="group bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300">

                <div className="flex items-start gap-4">
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm p-1.5">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{job.company.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </a>

                  {/* Job Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{job.company}</span>
                          {job.source !== "Mock Data" && (
                            <span title="Verified listing" className="flex items-center">
                              <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                            </span>
                          )}
                        </div>
                      </a>

                      {/* Apply Now CTA */}
                      <a href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer">
                        Apply Now <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        {job.location}
                      </span>

                      {job.isRemote && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                          <Wifi className="h-3 w-3" /> Remote
                        </span>
                      )}

                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${typeColor(job.type)}`}>
                        {typeLabel(job.type)}
                      </span>

                      {job.salary && job.salary !== "Not Disclosed" && (
                        <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-750 px-2.5 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700">
                          💰 {job.salary}
                        </span>
                      )}

                      <span className="flex items-center gap-1 ml-auto text-[11px] text-slate-400 font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {timeAgo(job.postedAt)}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {job.description}
                    </p>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && jobs.length > 0 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:border-emerald-400 transition-all cursor-pointer">
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">
              Page {page}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800 hover:border-emerald-400 transition-all cursor-pointer">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
