import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { 
  BarChart3, 
  PlusSquare, 
  Briefcase, 
  Building, 
  CreditCard, 
  ChevronRight, 
  Headset 
} from "lucide-react";

export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <>{children}</>;
  }

  if ((session.user as any)?.role === "candidate") {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col md:flex-row gap-8">
        {/* Employer Sidebar */}
        <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 h-fit space-y-2 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
            <span className="text-[10px] uppercase text-blue-500 font-extrabold tracking-wider block mb-1">Employer Panel</span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Recruiter Hub</h2>
          </div>

          <nav className="space-y-1.5">
            <Link
              href="/employer"
              className="group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-350 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <BarChart3 className="h-4 w-4" strokeWidth={2.5} />
                </div>
                <span>Recruiter Stats</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
            </Link>

            <Link
              href="/employer/post-job"
              className="group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-350 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <PlusSquare className="h-4 w-4" strokeWidth={2.5} />
                </div>
                <span>Post a Job</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
            </Link>

            <Link
              href="/employer/manage-jobs"
              className="group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-350 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <Briefcase className="h-4 w-4" strokeWidth={2.5} />
                </div>
                <span>Manage Jobs</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
            </Link>

            <Link
              href="/employer/profile"
              className="group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-350 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <Building className="h-4 w-4" strokeWidth={2.5} />
                </div>
                <span>Company Profile</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
            </Link>

            <Link
              href="/employer/payment-history"
              className="group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-350 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <CreditCard className="h-4 w-4" strokeWidth={2.5} />
                </div>
                <span>Payment History</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
            </Link>

            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-700">
              <a
                href="https://wa.me/919651111303?text=Hi%20Tejomarg%20Employer%20Support"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#25D366]/10 to-[#128C7E]/5 text-[#128C7E] hover:from-[#25D366]/20 hover:to-[#128C7E]/10 transition-all border border-[#25D366]/30 shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-[#25D366]/20 text-[#128C7E] rounded-lg group-hover:scale-110 transition-transform">
                    <Headset className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  <span>Help & Support</span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#25D366]" />
              </a>
            </div>
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
