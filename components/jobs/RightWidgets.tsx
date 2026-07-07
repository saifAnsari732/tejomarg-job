"use client";

import React from "react";
import Link from "next/link";
import { FileText, ChevronRight, Star } from "lucide-react";
import { useSession } from "next-auth/react";

export default function RightWidgets() {
  const { data: session } = useSession();
  const user = session?.user;

  // Derive initials
  const name = user?.name || "Candidate Name";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 hidden lg:block">
      {/* Profile Widget */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#413946] text-white flex items-center justify-center text-2xl font-bold mb-3">
          {initials}
        </div>
        <h3 className="text-lg font-bold text-slate-800">{name}</h3>
        <p className="text-sm text-slate-500 font-medium mt-1">Full-stack Developer</p>
        <p className="text-sm text-slate-500 font-medium mb-4">Your Company</p>
        <Link
          href="/candidate/profile"
          className="w-full py-2 px-4 border border-emerald-600 text-emerald-700 font-semibold rounded-md hover:bg-emerald-50 transition-colors"
        >
          Update profile
        </Link>
      </div>

      {/* Track Applications Widget */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 shadow-sm border border-emerald-200/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-700 shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-sm text-emerald-800 font-medium">Track your</p>
            <p className="text-emerald-900 font-bold">Job Applications</p>
          </div>
        </div>
        <Link
          href="/candidate"
          className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Track <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Promo Banner Widget */}
      <div className="bg-gradient-to-b from-purple-50 to-white rounded-xl border border-purple-200 p-5 shadow-sm relative overflow-hidden">
        <h3 className="text-lg font-extrabold text-indigo-900 mb-4">Download Our App</h3>
        <ul className="space-y-3 mb-6 text-sm font-medium text-slate-700">
          <li className="flex items-start">
            <span className="mr-2 text-indigo-900 font-bold">•</span>
            Unlimited job applications
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-indigo-900 font-bold">•</span>
            Connect with HRs, directly
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-indigo-900 font-bold">•</span>
            Track your Applications
          </li>
        </ul>
        <div className="flex items-center gap-1 font-bold text-indigo-900">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          4.7
        </div>
        
        {/* Decorative graphic (phone mockup representation) */}
        <div className="absolute -bottom-8 -right-4 w-24 h-32 bg-slate-900 rounded-2xl border-4 border-slate-800 rotate-12 shadow-xl opacity-90 flex items-start justify-center pt-2 overflow-hidden">
           <div className="w-16 h-20 bg-indigo-600 rounded"></div>
        </div>
      </div>
    </div>
  );
}
