"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function JobPrepBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    {
      title: "Software Engineer",
      company: "Tesla",
      companyInitial: "T",
      companyColor: "bg-red-600",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
      bgGradient: "from-blue-900 via-blue-900 to-slate-900",
      time: "5 min AI Interview"
    },
    {
      title: "Product Manager",
      company: "Google",
      companyInitial: "G",
      companyColor: "bg-blue-600",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
      bgGradient: "from-slate-900 via-sky-900 to-slate-900",
      time: "10 min AI Interview"
    },
    {
      title: "UX Designer",
      company: "Apple",
      companyInitial: "A",
      companyColor: "bg-slate-800",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop",
      bgGradient: "from-blue-900 via-fuchsia-900 to-sky-900",
      time: "7 min AI Interview"
    }
  ];

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((p) => (p + 1) % slides.length);
  };
  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((p) => (p === 0 ? slides.length - 1 : p - 1));
  };

  const current = slides[currentSlide];

  const slideVariants: any = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeIn" }
    })
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#020617] rounded-[2rem] p-8 lg:p-14 flex flex-col lg:flex-row items-center justify-between border border-white/5 relative overflow-hidden shadow-2xl group animate-fade-in-up">
          
          {/* Animated Background Gradients inside Banner */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-500/30 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sky-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-sky-500/30 transition-colors duration-700"></div>

          {/* Left Side Content (Desktop) / Top Content (Mobile) */}
          <div className="lg:w-1/2 z-10 flex flex-col items-center lg:items-start text-center lg:text-left mb-14 lg:mb-0 space-y-5 lg:space-y-8">
            
            <div className="flex flex-col items-center lg:flex-row lg:gap-5">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center p-0.5 shadow-lg shadow-blue-500/20 mb-3 lg:mb-0 animate-pulse-slow">
                <div className="w-full h-full bg-[#020617] rounded-[10px] lg:rounded-xl flex items-center justify-center">
                  <Cpu className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400" />
                </div>
              </div>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight">AI Job Prep</h2>
            </div>
            
            <div className="flex items-center justify-center w-full">
              <div className="h-px bg-white/10 w-8 lg:hidden mr-3"></div>
              <p className="text-xs sm:text-sm lg:text-xl font-bold text-slate-300 lg:text-slate-300 leading-relaxed tracking-wider uppercase lg:normal-case max-w-[200px] lg:max-w-md">
                Ace your next interview with our cutting-edge AI Coach.
              </p>
              <div className="h-px bg-white/10 w-8 lg:hidden ml-3"></div>
            </div>
            
            <Link 
              href="/resume-tools/job-prep"
              className="hidden lg:inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] mt-6"
            >
              Start Practice Session <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>

          {/* Right Side Carousel Graphic */}
          <div className="lg:w-1/2 relative z-10 flex justify-center lg:justify-end items-center h-[380px] lg:h-[400px]">
            
            {/* Background Cards (Stacked effect) */}
            <div className="absolute right-[50%] translate-x-[50%] lg:translate-x-0 lg:right-20 w-[240px] h-[320px] bg-white/5 rounded-3xl border border-white/5 shadow-2xl scale-90 opacity-40 backdrop-blur-md"></div>
            <div className="absolute right-[50%] translate-x-[50%] lg:translate-x-0 lg:right-10 w-[260px] h-[340px] bg-white/10 rounded-3xl border border-white/10 shadow-2xl scale-95 opacity-60 backdrop-blur-md"></div>
            
            {/* Slider Container */}
            <div className="relative w-[280px] sm:w-[300px] h-[380px] flex items-center justify-center z-20">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div 
                   key={currentSlide}
                   custom={direction}
                   variants={slideVariants}
                   initial="enter"
                   animate="center"
                   exit="exit"
                   className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${current.bgGradient} overflow-hidden shadow-2xl border border-white/10 flex flex-col items-center p-8 text-center`}
                >
                  {/* Graphic background */}
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col h-full w-full justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold text-2xl leading-tight">{current.title}</h3>
                      <div className="flex items-center justify-center mt-3 text-white gap-2 font-bold bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm mx-auto w-max text-sm">
                        <span className={`w-4 h-4 ${current.companyColor} text-white flex items-center justify-center rounded-full text-[9px]`}>{current.companyInitial}</span>
                        {current.company}
                      </div>
                    </div>

                    <div className="mt-6 w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 mx-auto shadow-2xl shadow-black/50">
                       <img 
                          src={current.image} 
                          alt="Candidate"
                          className="w-full h-full object-cover"
                       />
                    </div>

                    <div className="w-full mt-6">
                      <button className="w-full py-3.5 bg-white/10 hover:bg-white/20 transition-colors text-white font-bold rounded-xl text-sm shadow-lg mb-3 border border-white/10 backdrop-blur-md">
                        Start Mock Interview
                      </button>
                      <p className="text-xs text-blue-300 font-semibold">{current.time}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel arrows */}
              <button 
                onClick={prevSlide}
                className="absolute -left-5 sm:-left-6 lg:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#020617]/80 hover:bg-white/20 border border-white/10 transition-colors backdrop-blur-md text-white flex items-center justify-center z-30 cursor-pointer shadow-xl"
              >
                <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6 rotate-180" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute -right-5 sm:-right-6 lg:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#020617]/80 hover:bg-white/20 border border-white/10 transition-colors backdrop-blur-md text-white flex items-center justify-center z-30 cursor-pointer shadow-xl"
              >
                <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Button at Bottom */}
          <div className="lg:hidden w-full flex justify-center mt-12 relative z-20">
            <Link 
              href="/resume-tools/job-prep"
              className="inline-flex items-center justify-center px-8 py-3.5 w-full max-w-[280px] bg-gradient-to-r from-blue-600 to-sky-600 text-white font-bold rounded-full transition-colors text-sm shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            >
              Start Practice Session <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
}
