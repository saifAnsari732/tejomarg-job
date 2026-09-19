import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-slate-50/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center min-h-screen">
      <style>{`
        @keyframes spring-zoom {
          0%, 100% { transform: scale(0.9); }
          50% { transform: scale(1.15); }
        }
        .animate-spring-zoom {
          animation: spring-zoom 1.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
        }
      `}</style>

      {/* Brand Logo Wrapper */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center animate-spring-zoom">
        <img 
          src="/job1.png" 
          alt="Loading..." 
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
