"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, FileText, Copy, Sparkles, ArrowLeft, Download, CheckCircle2, Zap, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function CoverLetterGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("Saifuddin Ansari");
  const [experience, setExperience] = useState("Full-stack Developer");
  const [skills, setSkills] = useState("React, Next.js, Node.js, MongoDB, Tailwind CSS");
  const [tone, setTone] = useState<"Professional" | "Persuasive" | "Executive" | "Creative">("Professional");
  const [jobDescription, setJobDescription] = useState(`We are seeking a Full-Stack Developer to build scalable e-commerce and web platforms using Next.js, React, Node.js, and MongoDB. The ideal candidate will have strong frontend skills, REST API experience, and a focus on site performance optimization.`);
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
          jobDescription: `${jobDescription}\nNote: Write in a ${tone} tone.`,
          userDetails: { name, experience, skills },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate cover letter");
      }

      setGeneratedLetter(data.result);
      toast.success("AI Cover Letter Generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to connect to AI server");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast.success("Cover letter copied to clipboard!");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cover Letter - ${name}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; line-height: 1.6; color: #333; }
              h1 { font-size: 20px; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
              p { white-space: pre-wrap; font-size: 14px; }
            </style>
          </head>
          <body>
            <h1>Cover Letter for ${experience}</h1>
            <p>${generatedLetter}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
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
                <h1 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">AI Cover Letter Generator</h1>
                <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  GEMINI AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Generate tailored, high-converting cover letters customized to your target job description.
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Input Form Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base border-b pb-3 border-slate-100 dark:border-slate-700 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" /> Candidate & Job Input
            </h3>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. Saifuddin Ansari" 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Current Job / Preferred Role</label>
                <input 
                  type="text" 
                  required 
                  value={experience} 
                  onChange={e => setExperience(e.target.value)} 
                  placeholder="e.g. Full-stack Developer" 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Key Technical Skills</label>
                <input 
                  type="text" 
                  required 
                  value={skills} 
                  onChange={e => setSkills(e.target.value)} 
                  placeholder="e.g. React, Next.js, MongoDB" 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Tone Selection */}
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">AI Tone of Voice</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Professional", "Persuasive", "Executive", "Creative"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`py-2 text-[11px] font-extrabold rounded-xl border transition-all ${
                        tone === t
                          ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-md"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Target Job Description</label>
                <textarea 
                  required 
                  rows={4}
                  value={jobDescription} 
                  onChange={e => setJobDescription(e.target.value)} 
                  placeholder="Paste the description of the job you are applying to..." 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none leading-relaxed"
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
                    Writing Custom Cover Letter...
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

          {/* Generated Letter Output Paper */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-6 sm:p-8 rounded-2xl shadow-sm min-h-[500px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-700 gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Generated Cover Letter Canvas</h3>
                {generatedLetter && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={copyToClipboard}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-all cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" /> Print / Export
                    </button>
                  </div>
                )}
              </div>

              {generatedLetter ? (
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner max-h-[520px] overflow-y-auto">
                  {generatedLetter}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-center space-y-3">
                  <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 stroke-1" />
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Cover Letter Generated Yet</h4>
                  <p className="text-xs max-w-xs text-slate-500 dark:text-slate-400">
                    Fill in your details on the left and click "Generate Cover Letter" to receive a tailored letter.
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
