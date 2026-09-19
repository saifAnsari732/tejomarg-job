"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, CheckSquare, Bookmark, User, FileText, HelpCircle } from "lucide-react";
import SidebarUploadButton from "@/components/candidate/SidebarUploadButton";
import CandidateLogoutButton from "@/components/candidate/CandidateLogoutButton";

interface CandidateSidebarProps {
  user: {
    name?: string;
    email?: string;
    image?: string;
  } | null;
}

export default function CandidateSidebar({ user }: CandidateSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Find Jobs",
      href: "/jobs",
      icon: Search,
      isActive: pathname === "/jobs",
    },
    {
      label: "Applied",
      href: "/candidate",
      icon: CheckSquare,
      isActive: pathname === "/candidate",
    },
    {
      label: "Saved",
      href: "/candidate/bookmarks",
      icon: Bookmark,
      isActive: pathname === "/candidate/bookmarks",
    },
    {
      label: "Profile",
      href: "/candidate/profile",
      icon: User,
      isActive: pathname === "/candidate/profile",
    },
    {
      label: "Resume",
      href: "/resume-tools/resume-builder",
      icon: FileText,
      isActive: pathname.startsWith("/resume-tools"),
    },
  ];

  return (
    <aside className="w-[260px] shrink-0 bg-[#f8f9fc] border-r border-slate-200 flex flex-col justify-between hidden md:flex h-full">
      <div className="p-6">
        {/* User Profile Header */}
        <div className="flex items-center gap-3 mb-8">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-slate-300 flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm">
              <span className="text-sm font-bold text-slate-600">{user?.name?.charAt(0) || "U"}</span>
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-[#2a2a72] text-sm truncate">{user?.name || "Candidate"}</h3>
            <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{user?.email || "candidate@example.com"}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  item.isActive
                    ? "bg-[#2e2f8c] text-white shadow-md hover:bg-[#232470]"
                    : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${item.isActive ? "text-indigo-200" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 space-y-5">
        <SidebarUploadButton />
        <div className="pt-5 border-t border-slate-200 space-y-2">
          <Link
            href="/support"
            prefetch={false}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <HelpCircle className="w-4 h-4" /> Help Center
          </Link>
          <CandidateLogoutButton />
        </div>
      </div>
    </aside>
  );
}
