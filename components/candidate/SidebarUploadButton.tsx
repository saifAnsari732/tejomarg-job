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

        // Prepare payload with resume URL
        const payload: any = { resumeUrl: data.url };

        // Auto-fill from AI Parse
        if (data.parsedData) {
          const pd = data.parsedData;
          if (pd.name) payload.name = pd.name;
          if (pd.mobile) payload.mobile = pd.mobile;
          if (pd.highestEducation) payload.highestEducation = pd.highestEducation;
          if (pd.totalExperience) payload.totalExperience = pd.totalExperience;
          if (pd.currentLocation) payload.preferredLocation = pd.currentLocation;
          if (pd.skills) payload.skills = typeof pd.skills === 'string' ? pd.skills.split(',').map((s: string) => s.trim()) : pd.skills;
          if (pd.experience && Array.isArray(pd.experience)) payload.experience = pd.experience;
          if (pd.education && Array.isArray(pd.education)) payload.education = pd.education;
        }

        // Save URL and AI data to profile
        const saveRes = await fetch("/api/candidate/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!saveRes.ok) throw new Error("Failed to save resume to profile");
        
        if (data.parsedData) {
          toast.success("AI successfully extracted details from your resume!");
          // Reload page to reflect AI changes if not using strict state management for everything
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast.success("Resume uploaded successfully!");
        }
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <label className="relative w-full flex flex-col items-center justify-center gap-1.5 bg-gradient-to-r from-[#2e2f8c] to-[#4a4bbd] hover:from-[#232470] hover:to-[#3b3c99] text-white py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer overflow-hidden group">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
      
      <div className="flex items-center gap-2 relative z-10">
        {uploading ? <Loader2 className="w-5 h-5 animate-spin text-purple-200" /> : <Upload className="w-5 h-5 text-purple-200 group-hover:-translate-y-1 transition-transform" />}
        <span className="text-sm font-bold tracking-wide">{uploading ? "Analyzing Resume..." : "Upload Resume"}</span>
      </div>
      
      <div className="relative z-10 flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
        <span className="text-[9px] font-black uppercase tracking-widest text-purple-100">AI Auto-Fill</span>
        <svg className="w-3 h-3 text-yellow-300 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
      </div>

      <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
    </label>
  );
}
