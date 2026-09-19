"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function CandidateLogoutButton() {
  return (
    <button
      onClick={async () => {
        await signOut({ redirect: false });
        window.location.replace("/");
      }}
      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer text-left"
    >
      <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" /> Logout
    </button>
  );
}
