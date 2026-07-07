"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, FileText, Copy, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CoverLetterGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !experience || !skills || !jobDescription) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setGeneratedLetter("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cover-letter",
          jobDescription,
          userDetails: { name, experience, skills },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate cover letter");
      }

      setGeneratedLetter(data.result);
      toast.success("Cover letter generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to connect to AI server");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast.success("Copied to clipboard!");
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
          <h1 className="text-2xl font-black text-slate-900 leading-none">AI Cover Letter Generator</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Stand out from the crowd with a professional, personalized cover letter custom-written for your target job description.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Form Column */}
          <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm border-b pb-2 border-slate-100">Your Details</h3>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. Saifuddin Ansari" 
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 bg-transparent text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Current Job / Role</label>
                <input 
                  type="text" 
                  required 
                  value={experience} 
                  onChange={e => setExperience(e.target.value)} 
                  placeholder="e.g. Full-stack Developer" 
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 bg-transparent text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Key Tech Skills</label>
                <input 
                  type="text" 
                  required 
                  value={skills} 
                  onChange={e => setSkills(e.target.value)} 
                  placeholder="e.g. React, Next.js, MongoDB" 
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 bg-transparent text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Job Description</label>
                <textarea 
                  required 
                  rows={4}
                  value={jobDescription} 
                  onChange={e => setJobDescription(e.target.value)} 
                  placeholder="Paste the requirements or description of the job you are applying to..." 
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
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Cover Letter
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Letter Output Column */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm min-h-[300px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2 border-slate-100">
                <h3 className="font-extrabold text-slate-800 text-sm">Generated Letter</h3>
                {generatedLetter && (
                  <button 
                    onClick={copyToClipboard}
                    className="text-emerald-600 hover:text-emerald-700 font-bold text-xs flex items-center gap-1 px-2.5 py-1 bg-emerald-50 rounded transition-all cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy Text
                  </button>
                )}
              </div>

              {generatedLetter ? (
                <div className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap font-sans bg-slate-50/50 p-4 border border-slate-100 rounded-xl max-h-[420px] overflow-y-auto">
                  {generatedLetter}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <FileText className="h-10 w-10 text-slate-350 stroke-1 mb-2" />
                  <p className="text-xs">Your customized cover letter will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
