"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Cpu, Sparkles, Bot, Mic, CheckCircle2, Award, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function JobPrepBanner() {
  const [activeTab, setActiveTab] = useState(0);

  const roles = [
    { title: "Software Engineer", company: "Tesla / Google", score: "96%", time: "5 Min Session" },
    { title: "Product Manager", company: "Amazon / Flipkart", score: "94%", time: "8 Min Session" },
    { title: "Data Analyst", company: "TCS / Infosys", score: "98%", time: "6 Min Session" },
  ];

  const currentRole = roles[activeTab];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main AI Job Prep Container */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 border border-emerald-500/20 p-8 sm:p-12 lg:p-16 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.15)] overflow-hidden">
          
          {/* Glowing Ambient Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* AI Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <Bot className="w-4 h-4 text-emerald-400" />
                AI-POWERED INTERVIEW COACH
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
                Ace Your Next Interview with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Tejomarg AI
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-emerald-100/80 text-base sm:text-lg mb-8 max-w-xl leading-relaxed font-medium">
                Practice real-world technical and HR interview questions. Get real-time AI feedback on your answers, confidence score, and voice delivery.
              </p>

              {/* Feature Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-10">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 backdrop-blur-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Instant Feedback
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 backdrop-blur-sm">
                  <Award className="w-4 h-4 text-teal-400 shrink-0" />
                  Top 500+ Question Bank
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 backdrop-blur-sm">
                  <Mic className="w-4 h-4 text-cyan-400 shrink-0" />
                  100% Free Practice
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href="/resume-tools/job-prep"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold text-base shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
                >
                  Start Practice Session
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

            {/* Right Column: Interactive Mock Interview Preview Card */}
            <div className="lg:col-span-5 w-full">
              
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                
                {/* Top Live Bar */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">AI Recruiter Live</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-400/20">
                    {currentRole.score} Match Rate
                  </span>
                </div>

                {/* Role Switcher Tabs */}
                <div className="flex items-center gap-2 mb-6 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                  {roles.map((r, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(idx)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                        activeTab === idx
                          ? "bg-emerald-500 text-slate-950 shadow-md"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {r.title.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {/* Live Question Card Mockup */}
                <div className="bg-slate-950/80 rounded-2xl p-5 border border-white/10 mb-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                    <span>Target Role: {currentRole.title}</span>
                    <span>{currentRole.company}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 leading-relaxed">
                    "Explain a challenging technical obstacle you faced recently and how you resolved it."
                  </p>
                  
                  {/* Voice waveform simulation */}
                  <div className="flex items-center gap-1.5 pt-2">
                    <Mic className="w-4 h-4 text-emerald-400 mr-2" />
                    {[40, 75, 30, 90, 60, 100, 45, 80, 50, 35].map((height, i) => (
                      <span
                        key={i}
                        style={{ height: `${height * 0.25}px` }}
                        className="w-1 bg-emerald-400 rounded-full animate-pulse"
                      ></span>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <Link
                  href="/resume-tools/job-prep"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 backdrop-blur-md transition-all group-hover:border-emerald-400/40"
                >
                  <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                  Launch Live Mock Interview
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
