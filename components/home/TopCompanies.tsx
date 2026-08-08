"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TopCompanies() {
  const partners = [
    {
      name: "Bajaj Allianz Life",
      color: "text-[#004e9a]",
      bg: "bg-blue-50",
      logoText: (
        <div className="flex items-center text-xl shrink-0 select-none">
          <span className="font-extrabold tracking-tight">B</span>
          <span className="font-bold tracking-tight">ajaj </span>
          <span className="font-extrabold tracking-tight ml-1">A</span>
          <span className="font-bold tracking-tight">llianz</span>
        </div>
      )
    },
    {
      name: "Paytm",
      color: "text-[#002e6e]",
      bg: "bg-sky-50",
      logoText: (
        <div className="flex items-center text-2xl shrink-0 select-none">
          <span className="font-black italic tracking-tighter">Pay</span>
          <span className="font-black italic tracking-tighter text-[#00b9f5]">tm</span>
        </div>
      )
    },
    {
      name: "Zomato",
      color: "text-[#cb202d]",
      bg: "bg-red-50",
      logoText: (
        <div className="flex items-center text-2xl shrink-0 select-none">
          <span className="font-black italic tracking-tighter">zomato</span>
        </div>
      )
    },
    {
      name: "Swiggy",
      color: "text-[#fc8019]",
      bg: "bg-orange-50",
      logoText: (
        <div className="flex items-center text-xl shrink-0 select-none">
          <span className="font-bold tracking-tighter uppercase">Swiggy</span>
        </div>
      )
    },
    {
      name: "Kotak Mahindra Bank",
      color: "text-[#ed1c24]",
      bg: "bg-rose-50",
      logoText: (
        <div className="flex items-center text-xl shrink-0 select-none">
          <span className="font-black tracking-tight text-2xl mb-1">∞</span>
          <span className="font-black tracking-tight ml-1">kotak</span>
        </div>
      )
    }
  ];

  // Duplicate for seamless infinite marquee
  const marqueeItems = [...partners, ...partners, ...partners];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center justify-center"
        >
          <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>TRUSTED BY TOP CLIENT PARTNERS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl leading-tight">
            Join the teams that are <span className="relative whitespace-nowrap"><span className="relative z-10 text-blue-600">shaping the future</span><span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 -z-10 -rotate-1"></span></span>
          </h2>
        </motion.div>
      </div>

      {/* Infinite Animated Slider - Clean & Light */}
      <div className="relative w-full overflow-hidden flex py-8 bg-slate-50/50 border-y border-slate-100">
        {/* Gradient Masks for smooth fading edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

        <motion.div 
          className="flex space-x-12 whitespace-nowrap px-8 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
        >
          {marqueeItems.map((partner, idx) => (
            <div 
              key={idx} 
              className="group flex items-center space-x-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500 cursor-pointer min-w-max"
            >
              <div className={`px-6 h-16 rounded-2xl ${partner.bg} ${partner.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                {partner.logoText}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-16 text-center">
        <Link 
          href="/jobs" 
          className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-blue-600 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 group"
        >
          Explore Opportunities 
          <motion.span 
            className="ml-2 inline-block"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </Link>
      </div>

    </section>
  );
}
