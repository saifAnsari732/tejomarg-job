"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, FileText, CheckCircle, AlertCircle, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FeedbackData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string;
}

export default function ResumeCheckerPage() {
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

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

      setFeedback(data);
      toast.success("Resume review completed!");
    } catch (err: any) {
      toast.error(err.message || "Failed to connect to AI server");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-650 bg-red-50 border-red-200";
  };

  return (
    <div className="bg-slate-50 min-h-screen -mt-6 pt-6 -mx-4 px-4 sm:-mx-8 sm:px-8 pb-12 text-sm">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Link & Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors text-xs font-bold gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Powered by Gemini AI
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-2">
          <h1 className="text-2xl font-black text-slate-900 leading-none">AI Resume Checker</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Upload your resume details and get instant matching scores, key strengths, weaknesses, and direct recommendations on matching your target job.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Inputs Column */}
          <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm border-b pb-2 border-slate-100">Scan Input</h3>
            
            <form onSubmit={handleCheck} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Resume Details / Text</label>
                <textarea 
                  required 
                  rows={6}
                  value={resumeText} 
                  onChange={e => setResumeText(e.target.value)} 
                  placeholder="Paste your resume text, bio details, education history, and skills list here..." 
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 bg-transparent text-slate-800 font-semibold resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Job Description</label>
                <textarea 
                  required 
                  rows={4}
                  value={jobDescription} 
                  onChange={e => setJobDescription(e.target.value)} 
                  placeholder="Paste the description of the job you want to scan your resume against..." 
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 bg-transparent text-slate-800 font-semibold resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#208f60] hover:bg-[#1a7650] text-white py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Scan & Match
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Feedback Outputs Column */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm min-h-[300px] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="border-b pb-2 border-slate-100">
                <h3 className="font-extrabold text-slate-800 text-sm">AI Scan Feedback</h3>
              </div>

              {feedback ? (
                <div className="space-y-6">
                  {/* Score Indicator */}
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full border-2 font-black text-xl flex items-center justify-center ${getScoreColor(feedback.score)} shadow-sm`}>
                      {feedback.score}%
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-850 text-sm leading-none">Job Match Score</h4>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Based on technical mapping index</p>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">Key Strengths</h4>
                    <div className="space-y-1.5">
                      {feedback.strengths.map((str, i) => (
                        <div key={i} className="flex gap-2 items-start text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weaknesses */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">Gaps & Weaknesses</h4>
                    <div className="space-y-1.5">
                      {feedback.weaknesses.map((weak, i) => (
                        <div key={i} className="flex gap-2 items-start text-xs sm:text-sm font-semibold text-slate-700">
                          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{weak}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-1">
                    <h4 className="font-bold text-slate-800 text-xs">AI Recommendations</h4>
                    <p className="text-slate-650 text-xs sm:text-sm leading-relaxed font-semibold">{feedback.recommendations}</p>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <FileText className="h-10 w-10 text-slate-350 stroke-1 mb-2" />
                  <p className="text-xs">Submit details to analyze your resume matching metrics.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
