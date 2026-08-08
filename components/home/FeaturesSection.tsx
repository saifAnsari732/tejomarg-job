"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Target, MousePointerClick, Zap } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Cpu,
      title: "AI Resume Parsing",
      description: "Upload your CV once and our AI instantly extracts your skills and experience to build your perfect profile.",
      color: "from-blue-500 to-sky-400",
      bg: "bg-blue-50"
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description: "Stop scrolling endlessly. Get curated job recommendations tailored exactly to your unique skillset.",
      color: "from-purple-500 to-pink-400",
      bg: "bg-purple-50"
    },
    {
      icon: MousePointerClick,
      title: "One-Click Apply",
      description: "Say goodbye to long repetitive application forms. Apply to your dream companies with a single click.",
      color: "from-emerald-500 to-teal-400",
      bg: "bg-emerald-50"
    },
    {
      icon: Zap,
      title: "Instant Fast-Track",
      description: "Top candidates get instantly highlighted to recruiters, fast-tracking your interview process.",
      color: "from-orange-500 to-amber-400",
      bg: "bg-orange-50"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-blue-100">
              <Zap className="w-4 h-4" />
              <span>POWERED BY AI</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              Your career, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">supercharged</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium">
              We have completely reimagined the job search process to be faster, smarter, and stress-free. Let technology do the heavy lifting for you.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group rounded-[2rem] p-8 bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-slate-800" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-sm">
                  {feature.description}
                </p>
              </div>

              {/* Bottom decorative line */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`}></div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
