import React from "react";
import Link from "next/link";
import { ChevronRight, Cpu } from "lucide-react";

export default function JobPrepBanner() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-emerald-50 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between border border-emerald-100 relative overflow-hidden">
          
          {/* Left Side Content */}
          <div className="lg:w-1/2 z-10 space-y-6 mb-12 lg:mb-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-200 flex items-center justify-center p-1 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                <span className="font-extrabold text-2xl text-emerald-600">ai</span>
              </div>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-emerald-800">Job Prep</h2>
            <p className="text-xl lg:text-2xl font-bold text-slate-800 leading-snug max-w-sm">
              Practice interviews with Free AI Interview Coach
            </p>
            
            <Link 
              href="/resume-tools/job-prep"
              className="inline-flex items-center px-6 py-3 bg-[#208f60] hover:bg-[#1a7650] text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
            >
              Practice with AI Coach <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>

          {/* Right Side Carousel Graphic */}
          <div className="lg:w-1/2 relative z-10 flex justify-center lg:justify-end items-center h-[350px]">
            
            {/* Background Cards (Stacked effect) */}
            <div className="absolute right-[50%] translate-x-[50%] lg:translate-x-0 lg:right-20 w-[240px] h-[300px] bg-slate-800 rounded-2xl border border-slate-700 shadow-xl scale-90 opacity-60"></div>
            <div className="absolute right-[50%] translate-x-[50%] lg:translate-x-0 lg:right-10 w-[260px] h-[320px] bg-slate-900 rounded-2xl border border-slate-700 shadow-xl scale-95 opacity-80"></div>
            
            {/* Front Main Card */}
            <div className="relative w-[280px] h-[350px] rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-emerald-900 overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col items-center p-6 text-center">
              {/* Graphic background */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent"></div>
              
              <div className="relative z-10 flex flex-col h-full w-full justify-between items-center">
                <div>
                  <h3 className="text-white font-bold text-xl leading-tight">Software Engineer</h3>
                  <div className="flex items-center justify-center mt-2 text-white gap-2 font-bold">
                    <span className="w-5 h-5 bg-red-600 text-white flex items-center justify-center rounded-sm text-[10px]">T</span>
                    Tesla
                  </div>
                </div>

                <div className="mt-4 w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 mx-auto">
                   <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop" 
                      alt="Candidate"
                      className="w-full h-full object-cover"
                   />
                </div>

                <div className="w-full mt-4">
                  <button className="w-full py-2.5 bg-[#208f60] text-white font-bold rounded-lg text-sm shadow-lg mb-2">
                    Practice Interview
                  </button>
                  <p className="text-[10px] text-slate-300 font-semibold">5 min AI Interview</p>
                </div>
              </div>
            </div>

            {/* Carousel arrows */}
            <button className="absolute left-[10%] lg:left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur text-white flex items-center justify-center">
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            <button className="absolute right-[10%] lg:-right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur text-white flex items-center justify-center">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}
