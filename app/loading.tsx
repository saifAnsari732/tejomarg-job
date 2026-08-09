import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-slate-50/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center min-h-screen">
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Sleek Outer Ring */}
        <div className="absolute inset-0 -m-8">
          <div className="w-full h-full rounded-full border-4 border-indigo-100/50 border-t-indigo-600 animate-spin" style={{ animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Brand Logo */}
        <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full shadow-xl flex items-center justify-center p-3">
          <img 
            src="/job1.png" 
            alt="Tejomarg Loading..." 
            className="w-full h-full object-contain animate-pulse"
            style={{ animationDuration: '2s' }}
          />
        </div>

        {/* Loading Text */}
        <div className="mt-12 flex flex-col items-center">
          <span className="text-sm font-extrabold tracking-[0.25em] text-indigo-900/70 uppercase">
            Loading
            <span className="inline-flex ml-1 w-4">
              <span className="animate-[ping_1.5s_infinite_0ms] opacity-75">.</span>
              <span className="animate-[ping_1.5s_infinite_200ms] opacity-75">.</span>
              <span className="animate-[ping_1.5s_infinite_400ms] opacity-75">.</span>
            </span>
          </span>
        </div>
        
      </div>
    </div>
  );
}
