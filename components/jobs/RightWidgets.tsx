"use client";

import React from "react";
import Link from "next/link";
import { FileText, ChevronRight, Star, Sparkles, Smartphone } from "lucide-react";
import { useSession } from "next-auth/react";

export default function RightWidgets() {
  const { data: session } = useSession();
  const user = session?.user;

  const name = user?.name || "Welcome Back";
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <div className="space-y-5 hidden lg:block">
      {/* Professional Profile Widget */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-xl font-bold mb-3">
          {initials}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{name}</h3>
        <p className="text-sm text-slate-500 font-medium mb-5">Candidate Dashboard</p>
        
        <Link
          href="/candidate/profile"
          className="w-full py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          Update Profile
        </Link>
      </div>

      {/* Track Applications Widget */}
      <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-white rounded-lg text-emerald-600 shadow-sm border border-emerald-50">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Track your</p>
            <p className="text-emerald-900 font-bold text-base">Applications</p>
          </div>
        </div>
        <Link
          href="/candidate"
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          View Dashboard <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* App Promo Widget */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-indigo-950">Get the App</h3>
        </div>
        
        <ul className="space-y-2 mb-5 text-sm font-medium text-slate-700">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> One-click apply
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Direct HR chat
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Instant alerts
          </li>
        </ul>
        
        <div className="flex items-center justify-between pt-3 border-t border-indigo-200/50">
          <div className="flex items-center gap-1 font-bold text-slate-800 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            4.9
          </div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">iOS & Android</span>
        </div>
      </div>
    </div>
  );
}
