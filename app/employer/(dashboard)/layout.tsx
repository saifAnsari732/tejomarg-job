import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { LayoutDashboard, FilePlus2, Briefcase, Building2, ChevronRight } from "lucide-react";

export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  // We can't access headers/pathname easily in layout, but we should not block the layout for auth pages if they exist here.
  // Actually, the login/signup pages are inside `app/employer/login` which uses this layout.
  // If we redirect them to login while they are on login, it causes a loop.
  // We will let the individual pages handle auth if needed, or check a custom property.
  // For now, if no session, just return children without the sidebar, because it's probably login/signup page.
  if (!session) {
    return <>{children}</>;
  }

  // If candidate tries to access employer area, redirect to home
  if ((session.user as any)?.role === "candidate") {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col md:flex-row gap-8">
        {/* Employer Sidebar */}
        <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 h-fit space-y-2 shadow-sm">
          <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block">Employer Panel</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">Recruiter Hub</h2>
          </div>

          <nav className="space-y-1">
            <Link
              href="/employer"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <LayoutDashboard className="h-5 w-5 text-slate-400" />
                <span>Recruiter Stats</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/employer/post-job"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <FilePlus2 className="h-5 w-5 text-slate-400" />
                <span>Post a Job</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/employer/manage-jobs"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-650 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <Briefcase className="h-5 w-5 text-slate-400" />
                <span>Manage Jobs</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/employer/profile"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <Building2 className="h-5 w-5 text-slate-400" />
                <span>Company Profile</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link
              href="/employer/payment-history"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span>Payment History</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          </nav>
        </aside>

        {/* Employer Dashboard Workspace */}
        <section className="flex-1 min-w-0">
          {children}
        </section>
      </div>
      <Footer />
    </>
  );
}
