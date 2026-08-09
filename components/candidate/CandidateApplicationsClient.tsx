"use client";

import React, { useState } from "react";
import { Search, ChevronRight, Briefcase, MapPin, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface CandidateApplicationsClientProps {
  applications: any[];
}

export default function CandidateApplicationsClient({ applications }: CandidateApplicationsClientProps) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(applications.length > 0 ? applications[0]._id : null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = applications.filter((app) => {
    const title = app.jobId?.title?.toLowerCase() || "";
    const company = app.jobId?.companyId?.name?.toLowerCase() || "";
    const q = searchQuery.toLowerCase();
    return title.includes(q) || company.includes(q);
  });

  const selectedApp = applications.find((a) => a._id === selectedAppId);
  const job = selectedApp?.jobId;
  const company = job?.companyId;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "rejected":
        return { label: "Rejected", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" };
      case "interview":
        return { label: "Shortlisted", bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-500" };
      case "review":
        return { label: "Under Review", bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" };
      default:
        return { label: "Applied", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" };
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-8 py-6 border-b border-slate-100 shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2a2a72]">My Applications</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Track and manage your active job applications.</p>
        </div>
        <div className="mt-4 sm:mt-0 relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#2e2f8c]/20 focus:border-[#2e2f8c] outline-none transition-all placeholder:font-normal"
          />
        </div>
      </div>

      {/* Content Split */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left List Pane */}
        <div className="flex-1 overflow-y-auto border-r border-slate-100 p-8 hide-scrollbar">
          
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Job Title & Company</div>
              <div className="col-span-3">Applied Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            {/* Table Body */}
            {filteredApps.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const sJob = app.jobId;
                  const sCompany = sJob?.companyId;
                  const isSelected = selectedAppId === app._id;
                  const statusConf = getStatusConfig(app.status);
                  const appliedDate = app.createdAt?.toDate ? app.createdAt.toDate() : new Date(app.createdAt || 0);

                  return (
                    <div 
                      key={app._id}
                      onClick={() => setSelectedAppId(app._id)}
                      className={`grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer transition-colors ${
                        isSelected ? "bg-[#f8f9fc]" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="col-span-5 flex items-center gap-4">
                        {sCompany?.logo ? (
                          <div className="w-10 h-10 rounded bg-white border border-slate-100 p-1 flex items-center justify-center shrink-0 shadow-sm">
                            <img src={sCompany.logo} alt={sCompany.name} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded bg-[#f8f9fc] border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className={`font-bold truncate ${isSelected ? "text-[#2e2f8c]" : "text-slate-900"}`}>
                            {sJob?.title || "Job Title"}
                          </h4>
                          <p className="text-sm font-medium text-slate-500 truncate mt-0.5">{sCompany?.name || "Company"}</p>
                        </div>
                      </div>
                      
                      <div className="col-span-3 text-sm font-medium text-slate-600">
                        {format(appliedDate, "MMM dd, yyyy")}
                      </div>

                      <div className="col-span-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${statusConf.bg} ${statusConf.text}`}>
                          {statusConf.label}
                        </span>
                      </div>

                      <div className="col-span-2 text-right">
                        <span className="text-sm font-bold text-[#2e2f8c] hover:underline">View Details</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm font-medium">
                No applications found.
              </div>
            )}
          </div>
        </div>

        {/* Right Details Pane */}
        {selectedApp && job && (
          <div className="w-[380px] shrink-0 bg-[#f8f9fc] overflow-y-auto hide-scrollbar p-6 border-l border-slate-100">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              
              {/* Job Header */}
              <div className="flex gap-4 items-start mb-6">
                {company?.logo ? (
                   <div className="w-12 h-12 rounded-lg bg-white border border-slate-100 p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                     <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                   </div>
                 ) : (
                   <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                     <Briefcase className="w-5 h-5 text-slate-400" />
                   </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{job.title}</h3>
                  <div className="text-sm font-medium text-slate-500 mt-1 flex flex-wrap gap-1">
                    <span>{company?.name}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                  {job.jobType || "Full-time"}
                </span>
                {(job.salaryMin || job.salaryMax) && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                    ${((job.salaryMin||0)/1000).toFixed(0)}k - ${((job.salaryMax||0)/1000).toFixed(0)}k
                  </span>
                )}
              </div>

              {/* Timeline Section */}
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Application Timeline</h4>
              
              <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
                
                {/* Step 1: Applied */}
                <div className="relative z-10">
                  <div className="absolute -left-8 bg-white p-1 rounded-full">
                    <div className="w-4 h-4 rounded-full bg-[#2e2f8c] border-2 border-[#2e2f8c]"></div>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Application Submitted</h5>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      {format(selectedApp.createdAt?.toDate ? selectedApp.createdAt.toDate() : new Date(selectedApp.createdAt || 0), "MMM dd, yyyy, hh:mm a")}
                    </p>
                  </div>
                </div>

                {/* Step 2: Under Review */}
                <div className="relative z-10">
                  <div className="absolute -left-8 bg-[#f8f9fc] p-0.5 rounded-full ring-2 ring-[#2e2f8c]">
                    <div className="w-4 h-4 rounded-full bg-white border-4 border-[#2e2f8c]"></div>
                  </div>
                  <div className="bg-[#f4f5fa] rounded-lg p-3 -mt-3 ml-2 border border-[#e2e4f0]">
                    <div className="flex justify-between items-center mb-1">
                      <h5 className="text-sm font-bold text-[#2e2f8c]">Under Review</h5>
                      <span className="text-[10px] font-bold bg-[#e0e2f5] text-[#2e2f8c] px-2 py-0.5 rounded">Current</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                      Your profile is being evaluated by the hiring team.
                    </p>
                  </div>
                </div>

                {/* Step 3: Shortlisted */}
                <div className="relative z-10">
                  <div className="absolute -left-8 bg-white p-1 rounded-full">
                    <div className="w-4 h-4 rounded-full bg-slate-200 border-2 border-slate-200"></div>
                  </div>
                  <div className="opacity-50">
                    <h5 className="text-sm font-bold text-slate-900">Shortlisted</h5>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Pending evaluation</p>
                  </div>
                </div>

                {/* Step 4: Interview */}
                <div className="relative z-10">
                  <div className="absolute -left-8 bg-white p-1 rounded-full">
                    <div className="w-4 h-4 rounded-full bg-slate-200 border-2 border-slate-200"></div>
                  </div>
                  <div className="opacity-50">
                    <h5 className="text-sm font-bold text-slate-900">Interview</h5>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Pending shortlisting</p>
                  </div>
                </div>

              </div>

              {/* Action */}
              <div className="mt-10 pt-6 border-t border-slate-100">
                <button className="w-full flex items-center justify-center gap-2 border-2 border-[#2e2f8c] text-[#2e2f8c] hover:bg-[#2e2f8c] hover:text-white py-2.5 rounded-xl text-sm font-bold transition-colors">
                  <Briefcase className="w-4 h-4" /> Follow Up
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
