"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Users, Building2, FolderTree, ChevronRight, ShieldCheck, Ticket } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard Stats", href: "/admin", icon: LayoutDashboard },
  { name: "Moderate Jobs", href: "/admin/jobs", icon: CheckSquare },
  { name: "Manage Users", href: "/admin/users", icon: Users },
  { name: "Verify Companies", href: "/admin/companies", icon: Building2 },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Discount Coupons", href: "/admin/coupons", icon: Ticket },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-72 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-slate-700/50 p-6 h-fit shadow-2xl shadow-slate-200/50 dark:shadow-none sticky top-24 z-20">
      <div className="pb-6 mb-4 border-b border-slate-100 dark:border-slate-800/50 flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-3">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <span className="text-[10px] uppercase text-indigo-500 font-extrabold tracking-widest block mb-1">Admin Panel</span>
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Control Center</h2>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group overflow-hidden ${
                isActive 
                  ? "text-white bg-indigo-600 shadow-md shadow-indigo-500/25" 
                  : "text-slate-600 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-bg" 
                  className="absolute inset-0 bg-indigo-600" 
                  initial={false} 
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center space-x-3">
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"}`} />
                <span>{item.name}</span>
              </div>
              <ChevronRight className={`relative z-10 h-4 w-4 transition-transform duration-300 ${isActive ? "text-white/70" : "text-slate-300 group-hover:translate-x-1"}`} />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
