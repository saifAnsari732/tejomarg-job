"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";

export default function HeroBackgroundClient() {
  return (
    <>
      {/* Background Animated Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-300/30 rounded-full blur-[120px] mix-blend-multiply pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-300/30 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"
      />
      
      {/* Floating Badges (Desktop Only) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
        transition={{ opacity: { duration: 0.8 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
        className="hidden lg:flex absolute left-[5%] top-[25%] bg-white/90 backdrop-blur-xl px-5 py-4 rounded-2xl items-center gap-4 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] z-20"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <p className="text-slate-900 text-sm font-bold">Match Found</p>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Senior UI Designer</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0, y: [0, -20, 0] }}
        transition={{ opacity: { duration: 0.8, delay: 0.3 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
        className="hidden lg:flex absolute right-[5%] top-[40%] bg-white/90 backdrop-blur-xl px-5 py-4 rounded-2xl items-center gap-4 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] z-20"
      >
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Zap className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-slate-900 text-sm font-bold">Fast Response</p>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Usually replies in 2h</p>
        </div>
      </motion.div>
    </>
  );
}
