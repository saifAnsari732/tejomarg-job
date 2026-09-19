"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Building2, Star, ShieldCheck, Zap, Users, Sparkles, CheckCircle2 } from "lucide-react";

export default function EmployerCTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Card Container */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 border border-emerald-500/20 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.15)] overflow-hidden">
          
          {/* Background Ambient Mesh */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center p-8 sm:p-12 lg:p-16">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 flex flex-col items-start text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>FOR EMPLOYERS & RECRUITERS</span>
              </div>
              
              {/* Headline */}
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] mb-6 tracking-tight">
                Hire the top{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  1% talent
                </span>{" "}
                faster.
              </h2>
              
              {/* Description */}
              <p className="text-emerald-100/80 text-base sm:text-lg mb-8 max-w-lg leading-relaxed font-medium">
                Skip the noise. Access a curated pool of 5 Crore+ verified professionals. AI skill match algorithms deliver candidate shortlists in under 24 hours.
              </p>

              {/* Value Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 w-full mb-10 border-y border-white/10 py-6">
                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-white">24h</h4>
                  <p className="text-xs text-emerald-300/80 font-medium mt-1">Avg Shortlist Time</p>
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-white">98%</h4>
                  <p className="text-xs text-emerald-300/80 font-medium mt-1">Skill Match Rate</p>
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-white">5 Cr+</h4>
                  <p className="text-xs text-emerald-300/80 font-medium mt-1">Verified Candidates</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link 
                  href="/employer/post-job" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-extrabold text-base rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)] hover:scale-105 transition-all group"
                >
                  Start Hiring Now
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="inline-flex items-center text-xs font-semibold text-emerald-300/90 gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  No credit card required
                </div>
              </div>
            </motion.div>

            {/* Right Side: Overlapping Interactive Talent Cards */}
            <div className="lg:col-span-5 relative h-[420px] w-full hidden sm:flex items-center justify-center">
              
              {/* Card 1: Left Card */}
              <motion.div 
                initial={{ opacity: 0, y: 50, rotate: -6 }}
                whileInView={{ opacity: 1, y: 0, rotate: -6 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute z-10 -left-4 top-8 w-[250px] bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400" alt="Talent" />
                  <div>
                    <h4 className="text-white font-bold text-sm">Priya Sharma</h4>
                    <p className="text-emerald-400 font-medium text-xs">Product Lead</p>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded-md text-[10px] font-semibold border border-emerald-500/20">Agile</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded-md text-[10px] font-semibold border border-emerald-500/20">SaaS</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded-md text-[10px] font-semibold border border-emerald-500/20">B2B</span>
                </div>
              </motion.div>

              {/* Card 2: Center Highlighted Card */}
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: -10, scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute z-30 w-[270px] bg-gradient-to-b from-teal-900 to-emerald-950 border border-emerald-400/40 rounded-3xl p-6 shadow-[0_20px_50px_rgba(16,185,129,0.3)]"
              >
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center shadow-lg uppercase tracking-wider">
                  <Star className="w-3 h-3 mr-1 fill-slate-950" /> Top 1% Match
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-md" alt="Talent" />
                  <div>
                    <h4 className="text-white font-bold text-base">Rahul Verma</h4>
                    <p className="text-emerald-300 font-semibold text-xs">Senior Full-Stack Dev</p>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-3 mb-4 text-[11px] text-slate-200 border border-white/5 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Experience:</span>
                    <span className="font-bold text-emerald-300">6+ Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tech Stack:</span>
                    <span className="font-bold text-white">React, Node, Python</span>
                  </div>
                </div>

                <Link
                  href="/employer/post-job"
                  className="w-full flex items-center justify-center py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold transition-all shadow-md"
                >
                  Schedule Interview
                </Link>
              </motion.div>

              {/* Card 3: Right Card */}
              <motion.div 
                initial={{ opacity: 0, y: 50, rotate: 6 }}
                whileInView={{ opacity: 1, y: 20, rotate: 6 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute z-20 -right-4 top-16 w-[240px] bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400" alt="Talent" />
                  <div>
                    <h4 className="text-white font-bold text-sm">Amit Patel</h4>
                    <p className="text-cyan-400 font-medium text-xs">UX Specialist</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <Zap className="w-3.5 h-3.5 fill-current" /> Available Immediately
                </div>
              </motion.div>
              
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}
