"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown, Sparkles, Briefcase, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HeroSection() {
  const router = useRouter();

  const [searchVal, setSearchVal] = useState("");
  const [locationVal, setLocationVal] = useState("");
  const [debouncedSearchVal, setDebouncedSearchVal] = useState("");
  const [debouncedLocationVal, setDebouncedLocationVal] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchVal(searchVal);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchVal]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocationVal(locationVal);
    }, 300);
    return () => clearTimeout(timer);
  }, [locationVal]);

  const jobSuggestions = [
    "Software Engineer", "Frontend Developer", "UI/UX Designer", "Product Manager",
    "Data Scientist", "Marketing Executive", "Sales Manager", "HR Executive"
  ];

  const locationSuggestions = [
    "Bengaluru", "Mumbai", "Delhi NCR", "Pune", "Hyderabad", "Chennai", "Remote"
  ];

  const filteredJobSuggestions = jobSuggestions.filter((item) =>
    item.toLowerCase().includes(debouncedSearchVal.toLowerCase())
  );
  const filteredLocationSuggestions = locationSuggestions.filter((item) =>
    item.toLowerCase().includes(debouncedLocationVal.toLowerCase())
  );

  const showSearch = showSearchSuggestions && searchVal.trim() !== "" && filteredJobSuggestions.length > 0;
  const showLocation = showLocationSuggestions && locationVal.trim() !== "" && filteredLocationSuggestions.length > 0;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchVal) params.set("search", searchVal);
    if (locationVal) params.set("location", locationVal);
    router.push(`/jobs?${params.toString()}`);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative w-full pt-12 md:pt-24 pb-20 md:pb-32 overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50 min-h-[90vh] flex flex-col justify-center">
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 flex flex-col items-center text-center w-full">
        
        {/* Top Label */}
        <motion.div 
          variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-blue-50/80 backdrop-blur-md border border-blue-100 mb-8 shadow-sm max-w-full overflow-hidden"
        >
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="text-blue-700 text-[10px] sm:text-xs md:text-sm font-bold tracking-wide uppercase truncate">Over 50 Lakh+ Opportunities Live</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight w-full break-words"
        >
          Find Your Dream Job <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 animate-gradient-x" style={{ backgroundSize: '200% 200%' }}>With Tejomarg JOB</span>
        </motion.h1>
        
        <motion.p 
          variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-600 text-sm sm:text-lg max-w-2xl mb-8 leading-relaxed font-medium px-2 w-full"
        >
        </motion.p>

        {/* Feature Highlights */}
        <motion.div 
          variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-12 text-sm sm:text-base text-slate-600 font-semibold"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            100% Free for Candidates
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sky-500"></div>
            Direct HR Contact
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            Verified Companies
          </div>
        </motion.div>

        {/* Search Bar - Glassmorphism */}
        <motion.div 
          variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-4xl relative z-40"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-center bg-white md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200 p-2 md:p-3 space-y-3 md:space-y-0 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_40px_rgb(79,70,229,0.12)] hover:border-blue-200">
            
            {/* Search Job */}
            <div className="flex items-center flex-1 px-4 py-3 w-full relative group">
              <Search className="h-6 w-6 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                value={searchVal}
                onChange={(e) => { setSearchVal(e.target.value); setShowSearchSuggestions(true); }}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                placeholder="Job title, skills, or company" 
                className="w-full pl-3 pr-2 py-1 bg-transparent border-none text-slate-900 placeholder-slate-400 text-[16px] outline-none focus:ring-0 font-medium"
              />
              {showSearch && (
                <div className="absolute left-0 right-0 top-full mt-4 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden">
                  {filteredJobSuggestions.map((item) => (
                    <button
                      key={item} type="button" onClick={() => { setSearchVal(item); setShowSearchSuggestions(false); }}
                      className="w-full text-left px-5 py-3.5 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors border-b border-slate-100 last:border-none"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden md:block w-px h-10 bg-slate-200"></div>

            {/* Location */}
            <div className="flex items-center flex-1 px-4 py-3 w-full relative group">
              <MapPin className="h-6 w-6 text-sky-400 group-focus-within:text-sky-600 transition-colors" />
              <input 
                type="text" 
                value={locationVal}
                onChange={(e) => { setLocationVal(e.target.value); setShowLocationSuggestions(true); }}
                onFocus={() => setShowLocationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                placeholder="City or 'Remote'" 
                className="w-full pl-3 pr-2 py-1 bg-transparent border-none text-slate-900 placeholder-slate-400 text-[16px] outline-none focus:ring-0 font-medium"
              />
              {showLocation && (
                <div className="absolute left-0 right-0 top-full mt-4 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden">
                  {filteredLocationSuggestions.map((item) => (
                    <button
                      key={item} type="button" onClick={() => { setLocationVal(item); setShowLocationSuggestions(false); }}
                      className="w-full text-left px-5 py-3.5 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors border-b border-slate-100 last:border-none"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="w-full md:w-auto mt-2 md:mt-0">
              <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold py-4 md:py-3.5 px-10 rounded-xl md:rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 whitespace-nowrap text-[16px]">
                Search Jobs
              </button>
            </div>
          </form>
        </motion.div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="text-slate-500 font-medium mr-1">Popular:</span>
          {["Software Engineer", "Product Manager", "Data Scientist", "UI/UX Designer"].map((tag) => (
            <button key={tag} onClick={() => { setSearchVal(tag); setShowSearchSuggestions(false); }} className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors shadow-sm font-medium text-[13px]">
              {tag}
            </button>
          ))}
        </div>

        {/* Trusted By Marquee */}
        <div className="w-full mt-28 pt-10 border-t border-slate-200 relative z-20">
          <p className="text-slate-400 text-sm font-bold mb-8 uppercase tracking-widest">Trusted by industry leaders</p>
          <div className="relative max-w-full overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
            
            <div className="inline-flex animate-marquee whitespace-nowrap">
              <div className="flex items-center gap-16 px-8">
                <BrandLogos />
              </div>
              <div className="flex items-center gap-16 px-8">
                <BrandLogos />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function BrandLogos() {
  const partners = [
    "11.png",
    "2 (1).png",
    "3.png",
    "4.png",
    "5 (1).png",
    "5.png",
    "6.png",
    "TM24 png.png",
    "eco-kisan.webp"
  ];

  return (
    <>
      {partners.map((img, idx) => (
        <div key={idx} className="relative h-12 sm:h-16 w-32 sm:w-40 flex items-center justify-center">
          <img 
            src={`/partner-image/${img}`} 
            alt={`Partner ${idx + 1}`} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ))}
    </>
  );
}
