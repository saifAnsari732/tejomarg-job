"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Building2, Star, ShieldCheck, Zap } from "lucide-react";

export default function EmployerCTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl">
          {/* Animated Background Mesh */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center p-8 sm:p-12 lg:p-16">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-start"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-md border border-white/10">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>FOR EMPLOYERS & RECRUITERS</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                Hire the top <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">1% talent</span> faster.
              </h2>
              
              <p className="text-slate-300 text-lg sm:text-xl mb-10 max-w-lg leading-relaxed">
                Skip the noise. Access a curated pool of 5 Crore+ verified professionals ready to make an impact at your company today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link 
                  href="/employer/post-job" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-blue-50 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] group"
                >
                  Start Hiring Now
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="inline-flex items-center justify-center px-6 py-4 text-white font-medium">
                  <ShieldCheck className="w-5 h-5 mr-2 text-emerald-400" />
                  No credit card required
                </div>
              </div>
            </motion.div>

            {/* Right Side: Floating Talent Cards */}
            <div className="relative h-[400px] w-full hidden sm:flex items-center justify-center lg:justify-end pr-0 lg:pr-10">
              
              {/* Card 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 50, rotate: -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: -5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute z-10 left-10 lg:left-0 top-10 w-[260px] bg-white rounded-2xl p-5 shadow-2xl border border-slate-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" className="w-14 h-14 rounded-full object-cover" alt="Talent" />
                  <div>
                    <h4 className="text-slate-900 font-bold">Priya Sharma</h4>
                    <p className="text-blue-600 font-medium text-sm">Product Manager</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">Agile</span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">SaaS</span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">B2B</span>
                </div>
              </motion.div>

              {/* Card 2 (Center) */}
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: -20, scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute z-30 w-[280px] bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center shadow-lg">
                  <Star className="w-3 h-3 mr-1 fill-white" /> Top 1% Match
                </div>
                <div className="flex items-center gap-4 mb-5">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900" alt="Talent" />
                  <div>
                    <h4 className="text-white font-bold text-lg">Rahul Verma</h4>
                    <p className="text-sky-400 font-medium text-sm">Senior Developer</p>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-colors">
                  View Profile
                </button>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 50, rotate: 5 }}
                whileInView={{ opacity: 1, y: 30, rotate: 5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute z-20 right-0 top-20 w-[250px] bg-white rounded-2xl p-5 shadow-2xl border border-slate-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" className="w-12 h-12 rounded-full object-cover" alt="Talent" />
                  <div>
                    <h4 className="text-slate-900 font-bold">Amit Patel</h4>
                    <p className="text-blue-600 font-medium text-xs">UX Designer</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Zap className="w-4 h-4 text-amber-500" /> Available Immediately
                </div>
              </motion.div>
              
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
