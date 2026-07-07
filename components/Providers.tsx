"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-700 shadow-lg",
          duration: 4000,
        }}
      />
      {children}
    </SessionProvider>
  );
}
