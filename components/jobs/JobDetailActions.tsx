"use client";

import React, { useState } from "react";
import Link from "next/link";
import ApplyModal from "./ApplyModal";
import { CheckCircle, LogIn, ChevronRight, Briefcase, Share2 } from "lucide-react";

interface JobDetailActionsProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  isLoggedIn: boolean;
  userRole?: string;
  alreadyApplied: boolean;
  profileResumeUrl?: string;
}

export default function JobDetailActions({
  jobId,
  jobTitle,
  companyName,
  isLoggedIn,
  userRole,
  alreadyApplied,
  profileResumeUrl,
}: JobDetailActionsProps) {
  const [showModal, setShowModal] = useState(false);
  const [applied, setApplied] = useState(alreadyApplied);

  const handleApplySuccess = () => {
    setApplied(true);
    setShowModal(false);
  };

  const ShareButton = () => (
    <button className="flex items-center justify-center border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-lg font-bold text-sm transition-colors shrink-0">
      <Share2 className="h-4 w-4 mr-2" /> Share
    </button>
  );

  // 1. Unauthenticated state
  if (!isLoggedIn) {
    return (
      <div className="flex gap-4">
        <Link
          href={`/login?callbackUrl=/jobs/${jobId}`}
          className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2"
        >
          <LogIn className="h-4 w-4" />
          <span>Log in to Apply</span>
        </Link>
        <ShareButton />
      </div>
    );
  }

  // 2. Already Applied state
  if (applied) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          <div className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg p-3 flex items-center justify-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span className="font-bold text-sm">Applied Successfully</span>
          </div>
          <ShareButton />
        </div>
        <Link 
          href="/candidate" 
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-2.5 rounded-lg font-bold text-sm transition-colors flex justify-center items-center shadow-sm"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Track your Application
        </Link>
      </div>
    );
  }

  // 3. Admin / Employer roles (cannot apply)
  if (userRole && userRole !== "candidate") {
    return (
      <div className="flex gap-4">
        <div className="flex-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg p-3 text-center text-xs font-semibold flex items-center justify-center">
          Logged in as <span className="capitalize text-emerald-700 font-bold mx-1">{userRole}</span>. Candidates only.
        </div>
        <ShareButton />
      </div>
    );
  }

  // 4. Candidate state (can apply)
  return (
    <>
      <div className="flex gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Apply Now</span> <ChevronRight className="h-4 w-4" />
        </button>
        <ShareButton />
      </div>

      {showModal && (
        <ApplyModal
          jobId={jobId}
          jobTitle={jobTitle}
          companyName={companyName}
          profileResumeUrl={profileResumeUrl}
          onClose={() => setShowModal(false)}
          onSuccess={handleApplySuccess}
        />
      )}
    </>
  );
}
