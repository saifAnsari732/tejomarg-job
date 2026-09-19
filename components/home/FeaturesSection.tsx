"use client";

import React, { useEffect, useRef } from "react";
import { Cpu, Target, MousePointerClick, Zap, Sparkles, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Cpu,
      title: "AI Resume Parsing",
      description: "Upload your CV once and our AI instantly extracts your skills and experience to build a recruiter-ready profile.",
      tag: " 10s Fast Setup",
      gradient: "from-blue-500 via-indigo-500 to-purple-600",
      glowColor: "shadow-indigo-500/20",
      accentBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description: "Stop scrolling endlessly. Get curated job recommendations matched precisely to your unique skillset and location.",
      tag: "99% Precision",
      gradient: "from-emerald-500 via-teal-500 to-cyan-600",
      glowColor: "shadow-emerald-500/20",
      accentBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      icon: MousePointerClick,
      title: "One-Click Apply",
      description: "Say goodbye to repetitive application forms. Submit your application directly to recruiters with a single click.",
      tag: " 1-Tap Submission",
      gradient: "from-purple-500 via-pink-500 to-rose-600",
      glowColor: "shadow-purple-500/20",
      accentBg: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      icon: Zap,
      title: "Instant Fast-Track",
      description: "Top candidates get highlighted directly at the top of HR dashboards for fast-tracked interview calls.",
      tag: " Direct HR Access",
      gradient: "from-amber-500 via-orange-500 to-red-600",
      glowColor: "shadow-amber-500/20",
      accentBg: "bg-amber-50 text-amber-700 border-amber-100",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none none" },
        }
      );

      // Cards stagger reveal
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".feature-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: cardsRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-100/30 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Heading */}
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-20" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-200 shadow-sm">
          
            <span>POWERED BY AI PRECISION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Your career,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
              supercharged
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            We have completely reimagined the job search process to be faster, smarter, and stress-free. Let technology do the heavy lifting for you.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="feature-card group relative rounded-[2rem] p-8 bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] hover:border-emerald-300 hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
              style={{ opacity: 0 }}
            >
              {/* Top Accent Gradient Bar on Hover */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-t-[2rem]`}></div>

              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg ${feature.glowColor} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${feature.accentBg}`}>
                    {feature.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                  {feature.title}
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </h3>

                {/* Description */}
                <p className="text-slate-500 leading-relaxed font-medium text-sm">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Subtle Pill */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Learn how it works</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:animate-ping"></span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
