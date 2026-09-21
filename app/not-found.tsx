import React from "react";
import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 text-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Search className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">
          404 Error
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed font-medium">
          The page you are looking for doesn't exist, was moved, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all"
          >
            <Search className="w-4 h-4" />
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
