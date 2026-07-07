"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, Upload, FileText, Loader2, CheckCircle } from "lucide-react";

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  profileResumeUrl?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplyModal({
  jobId,
  jobTitle,
  companyName,
  profileResumeUrl,
  onClose,
  onSuccess,
}: ApplyModalProps) {
  const [resumeOption, setResumeOption] = useState<"profile" | "custom">(
    profileResumeUrl ? "profile" : "custom"
  );
  const [coverLetter, setCoverLetter] = useState("");
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalResumeUrl = profileResumeUrl;

      // 1. Upload custom resume if selected
      if (resumeOption === "custom") {
        if (!customFile) {
          throw new Error("Please select a resume file to upload");
        }

        const formData = new FormData();
        formData.append("file", customFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Failed to upload resume");
        }

        finalResumeUrl = uploadData.url;
      }

      if (!finalResumeUrl) {
        throw new Error("A resume is required to apply for this job.");
      }

      // 2. Submit application
      const applyRes = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          resumeUrl: finalResumeUrl,
          coverLetter,
        }),
      });

      const applyData = await applyRes.json();
      if (!applyRes.ok) {
        throw new Error(applyData.error || "Failed to submit application");
      }

      toast.success("Application submitted successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-700 mx-4 z-10 animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Apply for Role</h3>
            <p className="text-xs font-semibold text-slate-550 dark:text-slate-400 mt-1">
              {jobTitle} at <span className="text-blue-600 font-bold">{companyName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Resume Option */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Resume
            </label>
            
            <div className="space-y-2">
              {profileResumeUrl && (
                <label className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  resumeOption === "profile"
                    ? "border-blue-600 bg-blue-50/30 dark:bg-blue-950/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="resumeOption"
                    value="profile"
                    checked={resumeOption === "profile"}
                    onChange={() => setResumeOption("profile")}
                    className="sr-only"
                  />
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Use Saved Resume</p>
                    <p className="text-xs text-slate-500">Your profile resume will be attached.</p>
                  </div>
                  {resumeOption === "profile" && <CheckCircle className="h-5 w-5 text-blue-600" />}
                </label>
              )}

              <label className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                resumeOption === "custom"
                  ? "border-blue-600 bg-blue-50/30 dark:bg-blue-950/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
              }`}>
                <input
                  type="radio"
                  name="resumeOption"
                  value="custom"
                  checked={resumeOption === "custom"}
                  onChange={() => setResumeOption("custom")}
                  className="sr-only"
                />
                <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Upload New Resume</p>
                  <p className="text-xs text-slate-500">Upload a fresh PDF file specifically for this application.</p>
                </div>
                {resumeOption === "custom" && <CheckCircle className="h-5 w-5 text-blue-600" />}
              </label>
            </div>
          </div>

          {/* Custom File Upload Input */}
          {resumeOption === "custom" && (
            <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 text-center">
              <input
                type="file"
                accept=".pdf"
                id="resume-file"
                onChange={handleFileChange}
                className="hidden"
                required={resumeOption === "custom"}
              />
              <label htmlFor="resume-file" className="cursor-pointer block space-y-2">
                <Upload className="h-8 w-8 mx-auto text-slate-400" />
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {customFile ? customFile.name : "Click to select a PDF resume"}
                </div>
                <div className="text-xs text-slate-400">
                  {customFile ? `${(customFile.size / 1024).toFixed(0)} KB` : "Max file size: 5MB (PDF only)"}
                </div>
              </label>
            </div>
          )}

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cover Letter (Optional)
            </label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain why you are a great fit for this position..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Submit/Cancel */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
