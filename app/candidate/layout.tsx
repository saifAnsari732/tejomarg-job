import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { FileText, User, Bookmark, ChevronRight } from "lucide-react";

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col md:flex-row gap-8">
        {/* Candidate Sidebar */}
        <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 h-fit space-y-2 shadow-sm">
          <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block">Workspace</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">Job Seeker Portal</h2>
          </div>
          
          <nav className="space-y-1">
            <Link
              href="/candidate"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="h-5 w-5 text-slate-400" />
                <span>My Applications</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/candidate/profile"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <User className="h-5 w-5 text-slate-400" />
                <span>My Profile</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/candidate/bookmarks"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <Bookmark className="h-5 w-5 text-slate-400" />
                <span>Saved Jobs</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          </nav>
        </aside>

        {/* Candidate Dashboard Workspace */}
        <section className="flex-1 min-w-0">
          {children}
        </section>
      </div>
      <Footer />
    </>
  );
}
