"use client";

import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  rating: number;
  image: string;
  text: string;
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Shiwangi Singla",
      role: "Software Engineer",
      company: "Wipro",
      location: "Punjab",
      rating: 5,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
      text: "Thanks Tejomarg for helping me find my dream tech job without hassle. Freshers and experienced devs both get direct HR responses within 24 hours!",
    },
    {
      id: 2,
      name: "Deepak Yadav",
      role: "Operations Lead",
      company: "Kisan Choice",
      location: "Uttar Pradesh",
      rating: 5,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      text: "Taste reminds me of traditional homemade support! The placement assistance was super responsive and guided me through every interview round.",
    },
    {
      id: 3,
      name: "Vikash Singh",
      role: "Business Support Specialist",
      company: "Eco Kisan",
      location: "Bihar",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      text: "Business support is very good. Team is extremely responsive. I applied on Tejomarg and got shortlisted by 3 top companies in the first week!",
    },
    {
      id: 4,
      name: "Ram Shakal Singh",
      role: "Senior Consultant",
      company: "TM24 Groups",
      location: "Uttar Pradesh",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      text: "Tejomarg's mustard-clean process feels truly authentic. Every job match is 100% verified with direct contact details of genuine recruiters.",
    },
    {
      id: 5,
      name: "Prabhash Yadav",
      role: "Data Analyst",
      company: "Kisan Agro",
      location: "Bihar",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
      text: "It is definitely a great platform with correct job details. Applied with 1-click and got scheduled for direct technical round instantly!",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-teal-950 via-emerald-950 to-slate-950 text-white relative overflow-hidden select-none">
      {/* Background Orbs & Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
            <Quote className="w-3.5 h-3.5 text-emerald-400" /> Real stories and testimonials
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase mb-4 text-slate-100">
            WHAT OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">CLIENTS SAY</span>
          </h2>
          <p className="text-emerald-100/80 text-base sm:text-lg font-medium">
            Real feedback from our trusted network, job seekers, and partner families across India.
          </p>

          {/* Rating Summary Pill */}
          <div className="mt-6 inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2.5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current drop-shadow" />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-200 border-l border-white/20 pl-4">
              Over <strong className="text-emerald-300">5 Crore+</strong> candidates & recruiters placed
            </span>
          </div>
        </div>

        {/* 3D Perspective Card Carousel */}
        <div className="relative h-[480px] sm:h-[440px] w-full flex items-center justify-center perspective-[1200px]">
          
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
            {testimonials.map((t, idx) => {
              const offset = idx - activeIndex;
              const isCenter = offset === 0;
              const isLeft = offset === -1 || (activeIndex === 0 && idx === testimonials.length - 1);
              const isRight = offset === 1 || (activeIndex === testimonials.length - 1 && idx === 0);
              const isVisible = isCenter || isLeft || isRight;

              if (!isVisible) return null;

              let styleTransform = "";
              let zIndex = 10;
              let opacity = 0.4;
              let scale = 0.85;

              if (isCenter) {
                styleTransform = "translateX(0%) rotateY(0deg) translateZ(0px)";
                zIndex = 30;
                opacity = 1;
                scale = 1.05;
              } else if (isLeft) {
                styleTransform = "translateX(-65%) rotateY(18deg) translateZ(-100px)";
                zIndex = 20;
                opacity = 0.65;
                scale = 0.88;
              } else if (isRight) {
                styleTransform = "translateX(65%) rotateY(-18deg) translateZ(-100px)";
                zIndex = 20;
                opacity = 0.65;
                scale = 0.88;
              }

              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveIndex(idx);
                  }}
                  className={`absolute w-[290px] sm:w-[350px] transition-all duration-700 ease-out cursor-pointer transform-gpu ${
                    isCenter ? "shadow-[0_25px_60px_-15px_rgba(16,185,129,0.3)]" : "hover:opacity-90"
                  }`}
                  style={{
                    transform: styleTransform + ` scale(${scale})`,
                    zIndex: zIndex,
                    opacity: opacity,
                  }}
                >
                  <div className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
                    isCenter 
                      ? "bg-gradient-to-b from-teal-800 to-emerald-900 border-emerald-400/40 text-white" 
                      : "bg-slate-900/90 border-slate-700/60 text-slate-300 backdrop-blur-md"
                  }`}>

                    {/* Top Quote Icon & Rating */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 tracking-wider">
                        PLACED
                      </span>
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-sm sm:text-base leading-relaxed mb-8 font-medium italic min-h-[90px]">
                      "{t.text}"
                    </p>

                    {/* User Profile Footer */}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <div className="relative shrink-0">
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 text-white">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-white text-base truncate">{t.name}</h4>
                        <p className="text-xs text-emerald-300/90 truncate font-semibold">{t.role} • {t.company}</p>
                        <p className="text-[11px] text-slate-400 font-medium truncate">{t.location}</p>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-40 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-110 active:scale-95"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-40 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-110 active:scale-95"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Carousel Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-8 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                  : "w-2.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
