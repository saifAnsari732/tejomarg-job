"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSearchClient from "./HeroSearchClient";
import AnimatedHeroTextGSAP from "./AnimatedHeroTextGSAP";

// Register only once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Single fast stagger for all hero elements — no delay on first element
      gsap.fromTo(
        ".hero-animate",
        { opacity: 0, y: 32, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08, // 80ms between each element = very fast
          clearProps: "filter", // clean up after animation for perf
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full pt-12 md:pt-24 pb-20 md:pb-32 overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-teal-50 min-h-[90vh] flex flex-col justify-center"
    >
     

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 flex flex-col items-center text-center w-full">

        {/* Top Label */}
        <div className="hero-animate mb-8" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-slate-100/90 backdrop-blur-md border border-slate-200 shadow-sm max-w-full overflow-hidden">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="text-slate-900 text-[10px] sm:text-xs md:text-sm font-extrabold tracking-wide uppercase truncate">Over 50 Lakh+ Opportunities Live</span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="hero-animate w-full" style={{ opacity: 0 }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-950 leading-tight mb-6 tracking-tight w-full flex flex-col items-center overflow-visible">
            <div className="flex flex-col md:flex-row justify-center items-center md:gap-x-4 w-full overflow-visible">
              <span className="shrink-0 whitespace-nowrap text-slate-950">Find Your</span>
              <AnimatedHeroTextGSAP />
            </div>
            <span className="mt-2 md:mt-4 whitespace-nowrap text-[0.85em] text-slate-950">With Tejomarg JOB</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className="hero-animate text-slate-700 text-sm sm:text-lg max-w-2xl mb-8 leading-relaxed font-semibold px-2 w-full mx-auto"
          style={{ opacity: 0 }}
        >
          Join thousands of professionals who have accelerated their careers.
          Discover opportunities that match your skills, values, and ambitions in just a few clicks.
        </p>

        {/* Feature Highlights */}
        <div
          className="hero-animate flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-12 text-sm sm:text-base text-slate-800 font-bold"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            100% Free for Candidates
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            Direct HR Contact
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            Verified Companies
          </div>
        </div>

        {/* Search Bar */}
        <div className="hero-animate w-full max-w-4xl relative z-40" style={{ opacity: 0 }}>
          <HeroSearchClient />
        </div>

        {/* Popular Tags */}
        <div
          className="hero-animate flex flex-wrap items-center justify-center gap-3 mt-8 text-sm"
          style={{ opacity: 0 }}
        >
          <span className="text-slate-900 font-extrabold mr-1 uppercase tracking-wider text-[11px]">Popular Searches:</span>
          {["Software Engineer", "Product Manager", "Data Scientist", "UI/UX Designer"].map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 bg-white backdrop-blur-md border border-slate-200 rounded-full text-slate-800 hover:text-slate-950 hover:border-slate-400 hover:bg-slate-50 transition-colors shadow-sm font-bold text-[13px] cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Trusted By Marquee */}
        <div className="w-full mt-28 pt-10 border-t border-slate-200 relative z-20">
          <p className="text-slate-800 text-sm font-black mb-8 uppercase tracking-widest">Trusted by industry leaders</p>
          <div className="relative max-w-full overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-teal-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-teal-50 to-transparent z-10 pointer-events-none"></div>
            <div className="inline-flex animate-marquee whitespace-nowrap">
              <div className="flex items-center gap-6 sm:gap-8 md:gap-10 px-4"><BrandLogos /></div>
              <div className="flex items-center gap-6 sm:gap-8 md:gap-10 px-4"><BrandLogos /></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function BrandLogos() {
  const partners = ["11.png", "2 (1).png", "3.png", "4.png", "5 (1).png", "5.png", "6.png", "TM24 png.png", "eco-kisan.webp"];
  return (
    <>
      {partners.map((img, idx) => (
        <div key={idx} className="relative h-16 sm:h-20 md:h-24 w-36 sm:w-48 md:w-56 flex items-center justify-center p-2">
          <img src={`/partner-image/${img}`} alt={`Partner ${idx + 1}`} className="max-h-full max-w-full object-contain filter drop-shadow-sm hover:scale-105 transition-transform duration-200" loading="lazy" decoding="async" />
        </div>
      ))}
    </>
  );
}
