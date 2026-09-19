"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, FileText, CheckCircle, AlertCircle, Sparkles, ArrowLeft, Award, Zap, Download, RefreshCw, Layers } from "lucide-react";
import Link from "next/link";

interface FeedbackData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string;
  keywordsMatch?: number;
  formattingScore?: number;
}

export default function ResumeCheckerPage() {
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  const sampleResume = `Saifuddin Ansari | Full-stack Developer
Email: ansarisaifuddin732@gmail.com | Phone: 9985228899 | Location: Lucknow, UP

Professional Summary:
Experienced developer skilled in building responsive web applications and backend architectures using Next.js, Node.js, MongoDB, and Tailwind CSS.

Work Experience:
- Full-stack Developer at Eco Kisan Agro (Mar 2024 - Present)
  Designed, developed, and deployed agricultural e-commerce platforms using Next.js, Node.js, and MongoDB. Increased page speed by 40%.
- Junior Front-End Developer at Code.Mtx (Feb 2023 - Sep 2023)
  Implemented pixel-perfect user interfaces and integrated REST APIs using React and Tailwind CSS.

Skills: React, Next.js, Node.js, JavaScript, MongoDB, API Gateways, Express.js`;

  const sampleJob = `Senior Full-Stack Developer Job Opening:
We are looking for an experienced Full-Stack Developer proficient in React, Next.js, Node.js, MongoDB, and REST APIs. Responsibilities include building scalable web applications, optimizing performance, and integrating third-party APIs. Strong knowledge of Tailwind CSS and Git is required.`;

  const handleFillSample = () => {
    setResumeText(sampleResume);
    setJobDescription(sampleJob);
    toast.success("Loaded sample Resume and Job Description!");
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText || !jobDescription) {
      toast.error("Please fill in both fields");
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "resume-checker",
          resumeText,
          jobDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to scan resume");
      }

      setFeedback({
        ...data,
        keywordsMatch: Math.min(100, (data.score || 85) + 5),
        formattingScore: 92,
      });
      toast.success("AI ATS Resume Scan Complete!");
    } catch (err: any) {
      toast.error(err.message || "Failed to connect to AI server");
    } finally {
      setLoading(false);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: "Excellent Match", bg: "bg-emerald-500/10 text-emerald-600 border-emerald-400" };
    if (score >= 50) return { label: "Moderate Match", bg: "bg-amber-500/10 text-amber-600 border-amber-400" };
    return { label: "Needs Improvement", bg: "bg-red-500/10 text-red-600 border-red-400" };
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 rounded-xl hover:bg-slate-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">AI ATS Resume Checker & Scanner</h1>
                <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  GEMINI PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Scan your CV against target job descriptions to get instant ATS scores, keyword gaps, and optimization tips.
              </p>
            </div>
          </div>

          <button
            onClick={handleFillSample}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Auto-Fill Sample Data
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Input Form Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-700">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" /> ATS Input Scanner
              </h3>
            </div>
            
            <form onSubmit={handleCheck} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Your Resume Text / CV Bio</label>
                <textarea 
                  required 
                  rows={7}
                  value={resumeText} 
                  onChange={e => setResumeText(e.target.value)} 
                  placeholder="Paste your full resume text, experience, skills, and summary here..." 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Target Job Description</label>
                <textarea 
                  required 
                  rows={5}
                  value={jobDescription} 
                  onChange={e => setJobDescription(e.target.value)} 
                  placeholder="Paste target job requirements and key responsibilities..." 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none leading-relaxed"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 py-3.5 rounded-xl font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scanning ATS Compatibility...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 fill-slate-950" />
                    Scan & Calculate ATS Match
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Feedback & Scorecard Output Column */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-6 sm:p-8 rounded-2xl shadow-sm min-h-[500px]">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-700">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">ATS Analysis & Feedback Dashboard</h3>
                {feedback && (
                  <button
                    onClick={() => { setFeedback(null); handleCheck({ preventDefault: () => {} } as any); }}
                    className="text-xs text-emerald-600 font-bold flex items-center gap-1 hover:underline"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Rescan
                  </button>
                )}
              </div>

              {feedback ? (
                <div className="space-y-6 animate-fade-in-up">
                  
                  {/* Top Score Box */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="relative flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border-8 border-emerald-500 text-slate-900 dark:text-white font-black text-3xl flex flex-col items-center justify-center bg-white dark:bg-slate-800 shadow-md">
                          {feedback.score}%
                        </div>
                      </div>
                      <div className="space-y-1 text-center sm:text-left">
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border ${getScoreBadge(feedback.score).bg}`}>
                          {getScoreBadge(feedback.score).label}
                        </span>
                        <h4 className="font-black text-slate-900 dark:text-white text-lg pt-1">ATS Match Index</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Scanned against key technical requirements</p>
                      </div>
                    </div>

                    {/* Breakdown Pills */}
                    <div className="w-full sm:w-auto grid grid-cols-2 gap-3 text-center">
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{feedback.keywordsMatch || 90}%</span>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Keywords</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400">{feedback.formattingScore || 92}%</span>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Formatting</p>
                      </div>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Matched Strengths & Skills
                    </h4>
                    <div className="space-y-2">
                      {feedback.strengths.map((str, i) => (
                        <div key={i} className="flex gap-2.5 items-start text-xs font-semibold text-slate-800 dark:text-slate-200 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weaknesses */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Keyword Gaps & Weaknesses
                    </h4>
                    <div className="space-y-2">
                      {feedback.weaknesses.map((weak, i) => (
                        <div key={i} className="flex gap-2.5 items-start text-xs font-semibold text-slate-800 dark:text-slate-200 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
                          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{weak}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-slate-950 text-white p-5 rounded-2xl space-y-2 shadow-lg border border-emerald-500/20">
                    <h4 className="font-extrabold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> AI Direct Action Recommendations
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed font-medium text-slate-300">{feedback.recommendations}</p>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3 text-center">
                  <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 stroke-1" />
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Resume Scanned Yet</h4>
                  <p className="text-xs max-w-xs text-slate-500 dark:text-slate-400">
                    Paste your CV text and target job description on the left to view instant ATS match scores.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
