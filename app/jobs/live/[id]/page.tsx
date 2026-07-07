"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, MapPin, Building2, Clock, Briefcase, ExternalLink,
  Wifi, CheckCircle, Star, Globe, BadgeCheck, Loader2, AlertCircle,
  BookOpen, Award, Zap, GraduationCap, Gift, ChevronRight
} from "lucide-react";

interface JobDetail {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  companyWebsite: string | null;
  location: string;
  type: string;
  isRemote: boolean;
  salary: string;
  description: string;
  highlights: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
  applyUrl: string;
  postedAt: string | null;
  requiredSkills: string[];
  source: string;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Recently posted";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 7) return `Posted ${days} days ago`;
  return `Posted ${Math.floor(days / 7)} weeks ago`;
}

function typeLabel(type: string) {
  const map: Record<string, string> = { FULLTIME: "Full Time", PARTTIME: "Part Time", CONTRACT: "Contract", INTERN: "Internship" };
  return map[type] || type;
}

function typeColor(type: string) {
  const map: Record<string, string> = {
    FULLTIME: "bg-emerald-100 text-emerald-700 border-emerald-200",
    PARTTIME: "bg-blue-100 text-blue-700 border-blue-200",
    CONTRACT: "bg-amber-100 text-amber-700 border-amber-200",
    INTERN:   "bg-purple-100 text-purple-700 border-purple-200",
  };
  return map[type] || "bg-slate-100 text-slate-600 border-slate-200";
}

export default function LiveJobDetailPage() {
  const params  = useParams();
  const id      = params?.id as string;
  const [job,     setJob]     = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status,  setStatus]  = useState<"live"|"mock"|"error">("live");

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`/api/jobs/live/${encodeURIComponent(id)}`);
        const data = await res.json();
        if (!res.ok) throw new Error("Failed");
        setJob(data.job);
        setStatus(data.status);
      } catch {
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm font-semibold text-slate-400">Loading job details…</p>
      </div>
    </div>
  );

  if (status === "error" || !job) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center gap-4">
      <AlertCircle className="h-12 w-12 text-red-400" />
      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Could not load job details</p>
      <Link href="/jobs" className="text-xs font-bold text-blue-600 hover:underline">← Back to Jobs</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

      {/* ── Top Nav Bar ─────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/jobs"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Jobs
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            <Link href="/jobs" className="hover:text-slate-600">Jobs</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600 dark:text-slate-300 font-bold truncate max-w-48">{job.title}</span>
          </div>
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-500/20">
            Apply Now <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Left / Main Column ───────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Hero Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center border border-slate-100 dark:border-slate-700 overflow-hidden">
                {job.companyLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {job.company.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{job.title}</h1>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{job.company}</span>
                      {job.source !== "Mock Data" && (
                        <span title="Verified" className="flex items-center">
                          <BadgeCheck className="h-3.5 w-3.5 text-blue-400" />
                        </span>
                      )}
                    </div>
                  </div>
                  {status === "mock" && (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-600 border border-amber-200 px-2 py-1 rounded-full">
                      Demo
                    </span>
                  )}
                </div>

                {/* Meta chips */}
                <div className="flex flex-wrap items-center gap-2.5 mt-4">
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3.5 w-3.5 shrink-0" /> {job.location}
                  </span>
                  {job.isRemote && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <Wifi className="h-3.5 w-3.5" /> Remote
                    </span>
                  )}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${typeColor(job.type)}`}>
                    {typeLabel(job.type)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" /> {timeAgo(job.postedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="font-extrabold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" /> Job Description
            </h2>
            <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Responsibilities */}
          {job.highlights?.Responsibilities && job.highlights.Responsibilities.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-500" /> Responsibilities
              </h2>
              <ul className="space-y-2.5">
                {job.highlights.Responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {job.highlights?.Qualifications && job.highlights.Qualifications.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-500" /> Qualifications & Requirements
              </h2>
              <ul className="space-y-2.5">
                {job.highlights.Qualifications.map((q, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <Award className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.highlights?.Benefits && job.highlights.Benefits.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                <Gift className="h-4 w-4 text-pink-500" /> Benefits & Perks
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.highlights.Benefits.map((b, i) => (
                  <span key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800 text-pink-700 dark:text-pink-400 text-xs font-semibold rounded-xl">
                    <Star className="h-3 w-3" /> {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right Sidebar ────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Apply CTA Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-lg shadow-blue-500/20 text-white space-y-4">
            <div>
              <p className="text-xs font-bold text-blue-200 uppercase tracking-wider">Ready to apply?</p>
              <h3 className="text-lg font-black mt-1">{job.title}</h3>
              <p className="text-sm text-blue-200 mt-0.5">{job.company}</p>
            </div>
            {job.salary !== "Not Disclosed" && (
              <div className="bg-white/15 rounded-xl px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Salary</p>
                <p className="text-sm font-black mt-0.5">💰 {job.salary}</p>
              </div>
            )}
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white text-blue-700 font-extrabold text-sm rounded-2xl hover:bg-blue-50 transition-colors shadow-sm">
              Apply Now <ExternalLink className="h-4 w-4" />
            </a>
            {job.companyWebsite && (
              <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition-colors border border-white/20">
                <Globe className="h-3.5 w-3.5" /> Visit Company Website
              </a>
            )}
          </div>

          {/* Job Overview */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Job Overview</h3>
            <div className="space-y-3">
              {[
                { icon: Briefcase,  label: "Job Type",  value: typeLabel(job.type) },
                { icon: MapPin,     label: "Location",  value: job.location },
                { icon: Wifi,       label: "Remote",    value: job.isRemote ? "Yes – Fully Remote" : "No – On-site" },
                { icon: Clock,      label: "Posted",    value: timeAgo(job.postedAt) },
                { icon: Zap,        label: "Source",    value: job.source },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-700 shrink-0">
                    <Icon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{label}</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, i) => (
                  <span key={i}
                    className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-[11px] font-bold rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to Jobs */}
          <Link href="/jobs"
            className="flex items-center justify-center gap-2 w-full py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-all">
            <ArrowLeft className="h-4 w-4" /> Back to All Jobs
          </Link>
        </div>

      </div>
    </div>
  );
}
