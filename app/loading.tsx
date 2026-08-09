import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-slate-50/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center min-h-screen space-y-8">
      
      {/* Brand Logo Wrapper */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl shadow-xl shadow-indigo-500/10 border border-slate-100 flex items-center justify-center p-4">
        <img 
          src="/job1.png" 
          alt="Loading..." 
          className="w-full h-full object-contain animate-pulse"
          style={{ animationDuration: '2s' }}
        />
      </div>

      {/* Spinner and Text */}
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
        <span className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
          Please wait
        </span>
      </div>

    </div>
  );
}
