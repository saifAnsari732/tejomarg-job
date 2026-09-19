"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag, Truck, Megaphone, Laptop, Briefcase, Car, TrendingUp, Users, Wrench, Activity, Flame, Sparkles } from "lucide-react";

export default function TrendingRoles() {
  const roles = [
    { name: "Retail / Counter Sales", openings: "1,490 openings", avgSalary: "₹2.5 - 5 LPA", icon: ShoppingBag, color: "from-rose-500 to-pink-600", badgeBg: "bg-rose-50 border-rose-100 text-rose-700" },
    { name: "Logistics / Warehouse", openings: "1,337 openings", avgSalary: "₹3.0 - 6 LPA", icon: Truck, color: "from-blue-500 to-indigo-600", badgeBg: "bg-blue-50 border-blue-100 text-blue-700" },
    { name: "Marketing & Growth", openings: "995 openings", avgSalary: "₹4.5 - 12 LPA", icon: Megaphone, color: "from-sky-500 to-cyan-600", badgeBg: "bg-sky-50 border-sky-100 text-sky-700" },
    { name: "Back Office Operations", openings: "936 openings", avgSalary: "₹3.2 - 7 LPA", icon: Briefcase, color: "from-indigo-500 to-purple-600", badgeBg: "bg-indigo-50 border-indigo-100 text-indigo-700" },
    { name: "Business Operations", openings: "684 openings", avgSalary: "₹5.0 - 14 LPA", icon: TrendingUp, color: "from-emerald-500 to-teal-600", badgeBg: "bg-emerald-50 border-emerald-100 text-emerald-700" },
    { name: "Driver / Logistics", openings: "677 openings", avgSalary: "₹2.8 - 5.5 LPA", icon: Car, color: "from-amber-500 to-orange-600", badgeBg: "bg-amber-50 border-amber-100 text-amber-700" },
    { name: "Digital Marketing & SEO", openings: "625 openings", avgSalary: "₹4.0 - 10 LPA", icon: Laptop, color: "from-cyan-500 to-teal-600", badgeBg: "bg-cyan-50 border-cyan-100 text-cyan-700" },
    { name: "Human Resources (HR)", openings: "617 openings", avgSalary: "₹4.2 - 11 LPA", icon: Users, color: "from-pink-500 to-rose-600", badgeBg: "bg-pink-50 border-pink-100 text-pink-700" },
    { name: "Field Technician", openings: "556 openings", avgSalary: "₹3.0 - 6.5 LPA", icon: Wrench, color: "from-slate-600 to-slate-800", badgeBg: "bg-slate-100 border-slate-200 text-slate-700" },
    { name: "Lab & Diagnostics", openings: "128 openings", avgSalary: "₹3.5 - 8 LPA", icon: Activity, color: "from-violet-500 to-purple-600", badgeBg: "bg-violet-50 border-violet-100 text-violet-700" },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-emerald-50/30 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-emerald-100/40 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Flame className="w-4 h-4 text-emerald-600 animate-bounce" />
            HIGH DEMAND CAREERS
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">Job Roles</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium">
            Explore top hiring categories with direct HR contact and verified openings across India.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, i) => (
            <Link
              key={i}
              href={`/jobs?search=${encodeURIComponent(role.name.split('/')[0].trim())}`}
              className="group relative rounded-3xl p-6 bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.12)] hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between overflow-hidden"
            >
              {/* Left Accent Bar on Hover */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${role.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

              <div className="flex items-center gap-4">
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                  <role.icon className="w-7 h-7" />
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {role.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${role.badgeBg}`}>
                      {role.openings}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {role.avgSalary}
                    </span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center text-slate-400 transition-all shrink-0 ml-2">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>

            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Explore All 50+ In-Demand Roles
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
