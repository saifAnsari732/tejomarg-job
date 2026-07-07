"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Bookmark, Loader2 } from "lucide-react";

interface BookmarkButtonProps {
  jobId: string;
  initialBookmarked: boolean;
  onToggle?: (newStatus: boolean) => void;
  className?: string;
}

export default function BookmarkButton({
  jobId,
  initialBookmarked,
  onToggle,
  className = "",
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      const res = await fetch("/api/candidate/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update bookmark");
      }

      const newStatus = data.bookmarked;
      setBookmarked(newStatus);
      toast.success(data.message || "Bookmarks updated!");
      
      if (onToggle) {
        onToggle(newStatus);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save job. Are you logged in as a candidate?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer group flex items-center justify-center shrink-0 disabled:opacity-50 ${className}`}
      title={bookmarked ? "Remove from Saved Jobs" : "Save Job for Later"}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
      ) : (
        <Bookmark
          className={`h-4 w-4 transition-colors ${
            bookmarked
              ? "text-blue-600 fill-blue-600"
              : "text-slate-400 group-hover:text-slate-650"
          }`}
        />
      )}
    </button>
  );
}
