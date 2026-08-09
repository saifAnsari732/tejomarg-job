"use client";

import React, { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SidebarUploadButton() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Upload to cloud storage
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        // Save URL to profile
        const saveRes = await fetch("/api/candidate/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeUrl: data.url }),
        });
        
        if (!saveRes.ok) throw new Error("Failed to save resume to profile");
        
        toast.success("Resume uploaded successfully!");
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <label className="w-full flex items-center justify-center gap-2 bg-[#2e2f8c] hover:bg-[#232470] text-white py-3 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
      {uploading ? "Uploading..." : "Upload Resume"}
      <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
    </label>
  );
}
