"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Briefcase, Menu, X, User, LogOut, LayoutDashboard, ChevronDown, ChevronRight, FileText, Search, BookOpen } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const user = session?.user as any;
  const isLoggedIn = status === "authenticated";

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "employer") return "/employer/post-job";
    return "/candidate";
  };

  const navLinks = [
    { name: "Browse Jobs", href: "/jobs" },
  ];

  if (isLoggedIn) {
    if (user?.role === "candidate") {
      navLinks.push(
        { name: "My Applications", href: "/candidate" },
        { name: "Saved Jobs", href: "/candidate/bookmarks" }
      );
    } else if (user?.role === "employer") {
      navLinks.push(
        { name: "Post a Job", href: "/employer/post-job" }
      );
    } else if (user?.role === "admin") {
      navLinks.push(
        { name: "Moderate Jobs", href: "/admin/jobs" },
        { name: "Categories", href: "/admin/categories" }
      );
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-600 dark:text-slate-400 p-1 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            
            <Link href="/" className="flex items-center gap-3">
              {/* Icon Logo */}
              <img src="/job1.png" alt="Tejomarg Icon" className="h-10 w-auto object-contain shrink-0" />
              
              {/* Text Logo */}
              <img src="/job2.png" alt="Tejomarg Text" className="hidden sm:block h-28 -my-10 -ml-5 w-auto object-contain shrink-0 mix-blend-multiply pointer-events-none" />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-6 items-center">
            {user?.role !== "employer" && (
              <>
                {/* Jobs Dropdown */}
            <div className="relative group py-4">
              <Link href="/jobs" className="text-slate-700 hover:text-indigo-600 text-sm font-bold flex items-center gap-1">
                Jobs <ChevronDown className="h-4 w-4 text-slate-400 group-hover:rotate-180 transition-transform" />
              </Link>
              
              {/* Dropdown Menu */}
              <div className="absolute left-0 top-full hidden group-hover:flex bg-white border border-slate-200/60 shadow-xl rounded-2xl p-6 gap-6 z-50 w-[440px] transition-all">
                {/* Column 1 */}
                <div className="flex-1 space-y-3.5">
                  {[
                    { label: "Work From Home Jobs", href: "/jobs?workMode=Work+from+home" },
                    { label: "Part Time Jobs", href: "/jobs?workType=Part+time" },
                    { label: "Freshers Jobs", href: "/jobs?experience=0" },
                    { label: "Jobs for women", href: "/jobs?gender=Female" },
                    { label: "Full Time Jobs", href: "/jobs?workType=Full+time" },
                    { label: "Night Shift Jobs", href: "/jobs?workShift=Night+shift" }
                  ].map(item => (
                    <Link key={item.href} href={item.href} className="block text-slate-500 hover:text-indigo-600 text-sm font-semibold transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
                
                {/* Divider */}
                <div className="w-px bg-slate-100"></div>
                
                {/* Column 2 */}
                <div className="flex-1 space-y-3.5">
                  {[
                    { label: "Jobs in Mumbai", href: "/jobs?location=Mumbai" },
                    { label: "Jobs in Bangalore", href: "/jobs?location=Bangalore" },
                    { label: "IT & Software Jobs", href: "/jobs?department=IT+%26+Software" },
                    { label: "Graduate Jobs", href: "/jobs?education=Graduate" },
                    { label: "Explore All Jobs", href: "/jobs" }
                  ].map(item => (
                    <Link key={item.label} href={item.href} className="flex justify-between items-center text-slate-500 hover:text-indigo-600 text-sm font-semibold transition-colors">
                      <span>{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-indigo-500" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/resume-tools/job-prep" className="text-slate-700 hover:text-indigo-600 text-sm font-bold flex items-center">
              Job Prep <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded ml-1.5 tracking-wider leading-none">NEW</span>
            </Link>
            

            {/* Resume Tools Dropdown */}
            <div className="relative group py-4">
              <span className="text-slate-700 hover:text-indigo-600 text-sm font-bold flex items-center gap-1 cursor-pointer">
                Resume Tools <ChevronDown className="h-4 w-4 text-slate-400 group-hover:rotate-180 transition-transform" />
              </span>
              
              {/* Dropdown Menu */}
              <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-slate-200/60 shadow-xl rounded-2xl p-4 z-50 w-[300px] space-y-3.5">
                {[
                  { 
                    label: "AI Resume builder", 
                    desc: "Create your best resume using AI", 
                    href: "/resume-tools/resume-builder",
                    icon: <FileText className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  },
                  { 
                    label: "AI Resume checker", 
                    desc: "Get instant resume feedback", 
                    href: "/resume-tools/resume-checker",
                    icon: <Search className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  },
                  { 
                    label: "AI Cover letter generator", 
                    desc: "Stand out and get hired faster", 
                    href: "/resume-tools/cover-letter",
                    icon: <Briefcase className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  },
                  { 
                    label: "Blog", 
                    desc: "Guidance for securing your dream job", 
                    href: "/jobs",
                    icon: <BookOpen className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  }
                ].map(item => (
                  <Link key={item.label} href={item.href} className="flex gap-3 hover:bg-slate-50 p-2 rounded-lg transition-all text-left">
                    {item.icon}
                    <div>
                      <h4 className="font-bold text-slate-800 text-[13px] leading-tight">{item.label}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            </>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2 md:space-x-6">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 p-1 md:p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all focus:outline-none cursor-pointer"
                >
                  <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs md:text-base">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline-block text-sm font-bold max-w-[120px] truncate text-slate-700 pr-1">
                    {user?.name}
                  </span>
                </button>

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-100 shadow-xl py-2 z-20 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user?.email}
                        </p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-extrabold tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {user?.role}
                        </span>
                      </div>
                      
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>

                      {user?.role === "candidate" && (
                        <Link
                          href="/candidate/profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="h-4 w-4 mr-2" />
                          My Profile
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/employer/login"
                  className="text-xs md:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Employer Login
                </Link>
                <Link
                  href="/login"
                  className="text-xs md:text-sm font-bold text-white bg-[#208f60] hover:bg-[#1a7650] px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all"
                >
                  Candidate Login
                </Link>
              </>
            )}
          </div>


        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-xl text-base font-semibold transition-colors ${
                pathname === link.href
                  ? "text-blue-600 bg-blue-50/50 dark:bg-blue-950/10"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isLoggedIn ? (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 space-y-1">
              <div className="px-3 pb-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>

              <Link
                href={getDashboardLink()}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
              >
                Dashboard
              </Link>

              {user?.role === "candidate" && (
                <Link
                  href="/candidate/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  My Profile
                </Link>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full text-left block px-3 py-2 rounded-xl text-base font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/10 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 grid grid-cols-2 gap-4">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex justify-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="flex justify-center py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
