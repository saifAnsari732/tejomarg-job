import React from "react";
import Navbar from "@/components/layout/Navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import Link from "next/link";
import { Search, CheckSquare, Bookmark, FileText, Upload, HelpCircle, LogOut } from "lucide-react";
import SidebarUploadButton from "@/components/candidate/SidebarUploadButton";

export default async function CandidateLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  let user = session?.user as any;

  // Always fetch fresh user data for the layout to ensure name/avatar syncs perfectly
  if (user?.id) {
    try {
      const doc = await db.collection("users").doc(user.id).get();
      if (doc.exists) {
        const dbUser = doc.data();
        user = {
          ...user,
          name: dbUser?.name || user.name,
          image: dbUser?.candidateProfile?.avatarUrl || user.image,
        };
      }
    } catch (e) {
      console.error("Layout fetch error:", e);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white font-sans overflow-hidden">
      <div className="shrink-0 border-b border-slate-200 shadow-sm z-20 bg-white">
         <Navbar userOverride={user} />
      </div>
      
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar */}
        <aside className="w-[260px] shrink-0 bg-[#f8f9fc] border-r border-slate-200 flex flex-col justify-between hidden md:flex h-full">
          <div className="p-6">
            {/* User Profile */}
            <div className="flex items-center gap-3 mb-8">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm" />
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
              <Link href="/jobs" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 transition-all">
                <Search className="w-5 h-5 text-slate-400" /> Find Jobs
              </Link>
              {/* Active State matches screenshot (Dark Indigo) */}
              <Link href="/candidate" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-[#2e2f8c] text-white transition-all shadow-md hover:bg-[#232470]">
                <CheckSquare className="w-5 h-5 text-indigo-200" /> Applied
              </Link>
              <Link href="/candidate/bookmarks" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 transition-all">
                <Bookmark className="w-5 h-5 text-slate-400" /> Saved
              </Link>
              <Link href="/candidate/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 transition-all">
                <FileText className="w-5 h-5 text-slate-400" /> Resume
              </Link>
            </nav>
          </div>

          <div className="p-6 space-y-5">
            <SidebarUploadButton />
            <div className="pt-5 border-t border-slate-200 space-y-2">
              <Link href="/support" prefetch={false} className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                <HelpCircle className="w-4 h-4" /> Help Center
              </Link>
              <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto bg-white flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
