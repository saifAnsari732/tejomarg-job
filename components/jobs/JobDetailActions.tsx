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
  whatsappNumber?: string;
  isExternal?: boolean;
  applyUrl?: string;
}

export default function JobDetailActions({
  jobId,
  jobTitle,
  companyName,
  isLoggedIn,
  userRole,
  alreadyApplied,
  profileResumeUrl,
  whatsappNumber,
  isExternal,
  applyUrl,
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

  const WhatsappButton = () => {
    if (!whatsappNumber) return null;
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi, I would like to apply for the ${jobTitle} position at ${companyName}.`);
    return (
      <a 
        href={`https://wa.me/${cleanNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="h-5 w-5">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
        <span>Apply via WhatsApp</span>
      </a>
    );
  };

  // 1. Unauthenticated state
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-3">
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
        {whatsappNumber && (
          <div className="flex gap-4 mt-1">
            <WhatsappButton />
          </div>
        )}
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
      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          {isExternal && applyUrl ? (
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Apply Externally</span> <ChevronRight className="h-4 w-4" />
            </a>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Apply Now</span> <ChevronRight className="h-4 w-4" />
            </button>
          )}
          <ShareButton />
        </div>
        {whatsappNumber && (
          <div className="flex gap-4 mt-1">
            <WhatsappButton />
          </div>
        )}
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
