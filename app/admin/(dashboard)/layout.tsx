import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { LayoutDashboard, CheckSquare, Users, Building2, FolderTree, ChevronRight } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col md:flex-row gap-8">
        {/* Admin Sidebar */}
        <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 h-fit space-y-2 shadow-sm">
          <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block">Admin Panel</span>
            <h2 className="text-lg font-bold text-slate-905 dark:text-white mt-0.5">Control Center</h2>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <LayoutDashboard className="h-5 w-5 text-slate-400" />
                <span>Dashboard Stats</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/admin/jobs"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <CheckSquare className="h-5 w-5 text-slate-400" />
                <span>Moderate Jobs</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <Users className="h-5 w-5 text-slate-400" />
                <span>Manage Users</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/admin/companies"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <Building2 className="h-5 w-5 text-slate-400" />
                <span>Verify Companies</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <FolderTree className="h-5 w-5 text-slate-400" />
                <span>Categories</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/admin/coupons"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                <span>Discount Coupons</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          </nav>
        </aside>

        {/* Admin Dashboard Workspace */}
        <section className="flex-1 min-w-0">
          {children}
        </section>
      </div>
      <Footer />
    </>
  );
}
