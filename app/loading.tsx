import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center min-h-screen">
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated Background Glow */}
        <div className="absolute w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute w-24 h-24 bg-sky-400/30 rounded-full blur-xl animate-ping opacity-75" style={{ animationDuration: '2s' }}></div>
        
        {/* Brand Logo (Teardrop) */}
        <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 animate-bounce" style={{ animationDuration: '2s' }}>
          <img 
            src="/job1.png" 
            alt="Tejomarg Loading..." 
            className="w-full h-full object-contain filter drop-shadow-2xl"
          />
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
          <span className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">Loading</span>
        </div>
      </div>
    </div>
  );
}
