import React from "react";
import Navbar from "@/components/layout/Navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";

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
        <CandidateSidebar user={user} />

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto bg-white flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
