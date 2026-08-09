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
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 relative overflow-hidden">
      {/* Subtle Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* ── Top Nav Bar ─────────────────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-md dark:bg-slate-800/80 border-b border-slate-200/60 dark:border-slate-700 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <Link href="/jobs"
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Jobs
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/jobs" className="hover:text-slate-600">Jobs</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700 font-bold truncate max-w-[300px]">{job.title}</span>
          </div>
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-full transition-all shadow-md hover:shadow-indigo-500/25">
            Apply Now <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">

        {/* ── Left / Main Column ───────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Hero Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="shrink-0 w-20 h-20 rounded-2xl bg-white shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center p-2 overflow-hidden">
                {job.companyLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-3xl font-black text-indigo-600 dark:text-blue-400">
                    {job.company.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 mt-1">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">{job.title}</h1>
                    <div className="flex items-center gap-2 mt-3">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span className="text-base font-bold text-indigo-600">{job.company}</span>
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
                <div className="flex flex-wrap items-center gap-3 mt-5">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" /> {job.location}
                  </span>
                  {job.isRemote && (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <Wifi className="h-4 w-4" /> Remote
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${typeColor(job.type)}`}>
                    {typeLabel(job.type)}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                    <Clock className="h-4 w-4 text-slate-400" /> {timeAgo(job.postedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="font-black text-slate-900 text-xl mb-6 flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-indigo-500" /> Job Description
            </h2>
            <div className="text-base text-slate-600 leading-loose whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Responsibilities */}
          {job.highlights?.Responsibilities && job.highlights.Responsibilities.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="font-black text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-2.5">
                <Briefcase className="h-5 w-5 text-blue-500" /> Responsibilities
              </h2>
              <ul className="space-y-4">
                {job.highlights.Responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-slate-600 dark:text-slate-400">
                    <CheckCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {job.highlights?.Qualifications && job.highlights.Qualifications.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="font-black text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-2.5">
                <GraduationCap className="h-5 w-5 text-emerald-500" /> Qualifications & Requirements
              </h2>
              <ul className="space-y-4">
                {job.highlights.Qualifications.map((q, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-slate-600 dark:text-slate-400">
                    <Award className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.highlights?.Benefits && job.highlights.Benefits.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="font-black text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-2.5">
                <Gift className="h-5 w-5 text-rose-500" /> Benefits & Perks
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.highlights.Benefits.map((b, i) => (
                  <span key={i}
                    className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm font-semibold rounded-xl">
                    <Star className="h-4 w-4" /> {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right Sidebar ────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Apply CTA Card */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-t-4 border-t-indigo-600 space-y-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-2">Ready to apply?</p>
              <h3 className="text-xl font-black text-slate-900">{job.title}</h3>
              <p className="text-base text-slate-500 font-medium mt-1">{job.company}</p>
            </div>
            {job.salary !== "Not Disclosed" && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 relative z-10">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Expected Salary</p>
                <p className="text-lg font-black text-emerald-600">💰 {job.salary}</p>
              </div>
            )}
            <div className="space-y-3 relative z-10">
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black text-base rounded-2xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all">
                Apply Now <ExternalLink className="h-4 w-4" />
              </a>
              {job.companyWebsite && (
                <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-slate-50 text-slate-600 font-bold text-sm rounded-2xl transition-colors border border-slate-200">
                  <Globe className="h-4 w-4" /> Visit Website
                </a>
              )}
            </div>
          </div>

          {/* Job Overview */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
            <h3 className="font-black text-slate-900 dark:text-white text-lg">Job Overview</h3>
            <div className="space-y-4">
              {[
                { icon: Briefcase,  label: "Job Type",  value: typeLabel(job.type) },
                { icon: MapPin,     label: "Location",  value: job.location },
                { icon: Wifi,       label: "Remote",    value: job.isRemote ? "Yes – Fully Remote" : "No – On-site" },
                { icon: Clock,      label: "Posted",    value: timeAgo(job.postedAt) },
                { icon: Zap,        label: "Source",    value: job.source },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 shrink-0 border border-slate-100">
                    <Icon className="h-4 w-4 text-indigo-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">{label}</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="font-black text-slate-900 dark:text-white text-lg mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2.5">
                {job.requiredSkills.map((skill, i) => (
                  <span key={i}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 text-xs font-bold rounded-xl transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to Jobs */}
          <Link href="/jobs"
            className="flex items-center justify-center gap-2 w-full py-4 border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-400 font-bold text-sm rounded-2xl hover:border-indigo-400 hover:text-indigo-600 transition-all">
            <ArrowLeft className="h-4 w-4" /> Back to All Jobs
          </Link>
        </div>

      </div>
    </div>
  );
}
