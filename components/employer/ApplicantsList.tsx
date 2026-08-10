"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FileText, ExternalLink, Check, X, Calendar, User, Eye, Loader2, ArrowLeft, Mail, Phone, MapPin, DollarSign, Briefcase, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  candidateProfile: {
    skills: string[];
    expectedSalary: number;
    preferredLocation: string;
    resumeUrl: string;
    bio?: string;
  };
}

interface Application {
  _id: string;
  candidateId: Candidate;
  coverLetter?: string;
  status: "applied" | "shortlisted" | "interview" | "rejected" | "hired";
  createdAt: string;
}

interface ApplicantsListProps {
  initialApplications: Application[];
  jobTitle: string;
}

export default function ApplicantsList({ initialApplications, jobTitle }: ApplicantsListProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleStatusChange = async (appId: string, nextStatus: string) => {
    setUpdatingId(appId);
    try {
      const res = await fetch(`/api/employer/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          note: `Recruiter moved application to status: ${nextStatus}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      toast.success(`Candidate status updated to ${nextStatus}!`);
      setApplications(
        applications.map((app) => (app._id === appId ? { ...app, status: data.application.status } : app))
      );
      if (selectedApp && selectedApp._id === appId) {
        setSelectedApp({ ...selectedApp, status: data.application.status as any });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update applicant status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      applied: "bg-blue-100/50 text-blue-700 border-blue-200",
      shortlisted: "bg-purple-100/50 text-purple-700 border-purple-200",
      interview: "bg-amber-100/50 text-amber-700 border-amber-200",
      rejected: "bg-rose-100/50 text-rose-700 border-rose-200",
      hired: "bg-emerald-100/50 text-emerald-700 border-emerald-200",
    };
    return `inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-wide uppercase border ${badges[status] || badges.applied}`;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Applicants Report", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Job Title: ${jobTitle}`, 14, 30);
    doc.text(`Total Applicants: ${applications.length}`, 14, 36);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 42);

    const tableColumn = ["Candidate Name", "Email", "Phone", "Location", "Applied Date", "Status"];
    const tableRows: any[] = [];

    applications.forEach(app => {
      const c = app.candidateId;
      const profile = c?.candidateProfile || {};
      const appData = [
        c.name || "N/A",
        c.email || "N/A",
        c.phone || "N/A",
        profile.preferredLocation || "N/A",
        new Date(app.createdAt).toLocaleDateString(),
        app.status.toUpperCase()
      ];
      tableRows.push(appData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229] }, // Indigo 600
    });

    doc.save(`Applicants_${jobTitle.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 p-8 rounded-3xl border border-indigo-500/30 shadow-2xl shadow-indigo-900/20 flex flex-col sm:flex-row sm:items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <Link href="/employer/manage-jobs" className="inline-flex items-center text-indigo-200 hover:text-white transition-colors text-sm font-bold mb-4 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Jobs
          </Link>
          <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">Applicants Dashboard</h1>
          <p className="text-indigo-100 font-medium mt-2 text-sm sm:text-base flex items-center gap-2">
            Reviewing candidates for <span className="text-white font-bold px-3 py-1 bg-white/20 rounded-lg shadow-inner">{jobTitle}</span>
          </p>
        </div>
        <div className="relative z-10 mt-6 sm:mt-0 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl shadow-lg">
            <div className="text-4xl font-black text-white drop-shadow-sm">{applications.length}</div>
            <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mt-1">Total Applicants</div>
          </div>
          
          <button 
            onClick={exportToPDF}
            className="flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-4 rounded-2xl font-black text-sm shadow-xl transition-all border border-indigo-100"
          >
            <Download className="h-5 w-5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Candidate List - Card View */}
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const c = app.candidateId;
            const profile = c?.candidateProfile || {};
            
            if (!c) return null;

            return (
              <div 
                key={app._id} 
                className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/20 hover:shadow-xl hover:border-indigo-200 hover:ring-4 hover:ring-indigo-50/50 transition-all group cursor-pointer overflow-hidden flex flex-col md:flex-row"
                onClick={() => setSelectedApp(app)}
              >
                {/* Left Side: Avatar & Basic Info */}
                <div className="p-6 flex items-center gap-6 flex-1 bg-slate-50/50">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-700 flex items-center justify-center font-black text-xl shadow-inner border border-indigo-200/50 shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-black text-slate-900 text-xl group-hover:text-indigo-600 transition-colors truncate">{c.name}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" /> {c.email}</span>
                      {c.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" /> {c.phone}</span>}
                    </div>
                  </div>
                </div>

                {/* Middle Side: Status */}
                <div className="p-6 md:border-l border-slate-100 flex flex-col justify-center bg-white min-w-[200px]">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase tracking-widest">Status</span>
                      <span className={getStatusBadge(app.status)}>{app.status}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase tracking-widest">Applied</span>
                      <span className="font-bold text-slate-700">{new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div className="p-6 flex flex-wrap items-center justify-end bg-slate-50/30 border-t md:border-t-0 md:border-l border-slate-100 gap-3" onClick={(e) => e.stopPropagation()}>
                  
                  {c.phone && (
                    <a
                      href={`tel:${c.phone}`}
                      className="p-3 bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 rounded-2xl transition-all shadow-sm flex items-center justify-center font-bold text-sm gap-2"
                      title="Call Candidate"
                    >
                      <Phone className="h-5 w-5" /> <span className="md:hidden lg:inline">Call</span>
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedApp(app)}
                    className="p-3 bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 rounded-2xl transition-all shadow-sm flex items-center justify-center font-bold text-sm gap-2"
                    title="View Full Profile"
                  >
                    <Eye className="h-5 w-5" /> <span className="md:hidden lg:inline">View</span>
                  </button>
                  
                  {updatingId === app._id ? (
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm"><Loader2 className="h-5 w-5 animate-spin text-indigo-500" /></div>
                  ) : (
                    app.status === "applied" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(app._id, "shortlisted")}
                          className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-2xl transition-all border border-emerald-200 shadow-sm flex items-center gap-2 font-bold text-sm"
                          title="Shortlist Candidate"
                        >
                          <Check className="h-5 w-5" /> <span className="md:hidden lg:inline">Shortlist</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(app._id, "rejected")}
                          className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-2xl transition-all border border-rose-200 shadow-sm flex items-center gap-2 font-bold text-sm"
                          title="Reject Candidate"
                        >
                          <X className="h-5 w-5" /> <span className="md:hidden lg:inline">Reject</span>
                        </button>
                      </>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/20 py-24 px-6 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-100">
            <User className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">No applicants yet</h3>
          <p className="text-slate-500 font-medium mt-3 max-w-md mx-auto leading-relaxed">
            Your job posting is live! Once candidates start applying for this position, their profiles will appear here for you to review.
          </p>
        </div>
      )}

      {/* Candidate Details Modal */}
      {selectedApp && (() => {
        const c = selectedApp.candidateId;
        const profile = c.candidateProfile || {};
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedApp(null)}></div>
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-900 px-8 py-8 border-b border-indigo-800 flex items-start justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-400 to-blue-500 text-white flex items-center justify-center font-black text-4xl shadow-xl shadow-indigo-500/40 border border-white/20">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">{c.name}</h2>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="text-sm font-bold text-indigo-200 hover:text-white transition-colors flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                          <Mail className="h-4 w-4" /> {c.email}
                        </a>
                      )}
                      {c.phone && (
                        <a href={`tel:${c.phone}`} className="text-sm font-bold text-indigo-200 hover:text-white transition-colors flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                          <Phone className="h-4 w-4" /> {c.phone}
                        </a>
                      )}
                      <div className="text-sm font-bold text-indigo-200 flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                        <MapPin className="h-4 w-4" /> {profile.preferredLocation || "Any Location"}
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedApp(null)} className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors relative z-10">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Col - Overview */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-5">
                      <h3 className="text-[11px] font-black uppercase text-indigo-500 tracking-widest">Application Details</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Current Status</p>
                          <span className={getStatusBadge(selectedApp.status)}>{selectedApp.status}</span>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><DollarSign className="h-3 w-3" /> Expected Salary</p>
                          <p className="text-lg font-black text-slate-800">{profile.expectedSalary ? `₹${profile.expectedSalary.toLocaleString()}/yr` : "Negotiable"}</p>
                        </div>
                      </div>
                    </div>

                    {profile.resumeUrl && (
                      <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-500/30">
                        <FileText className="h-5 w-5" /> VIEW FULL RESUME
                      </a>
                    )}
                  </div>

                  {/* Right Col - Details */}
                  <div className="md:col-span-2 space-y-6">
                    {selectedApp.coverLetter && (
                      <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50 shadow-sm relative">
                        <div className="absolute top-6 left-0 w-1.5 h-10 bg-indigo-500 rounded-r-2xl"></div>
                        <h3 className="text-sm font-black text-indigo-900 mb-3 flex items-center gap-2 ml-2"><FileText className="h-4 w-4 text-indigo-500" /> Cover Letter</h3>
                        <p className="text-indigo-800/80 text-sm leading-relaxed whitespace-pre-line italic ml-2 bg-white/60 p-4 rounded-2xl border border-indigo-100/30">"{selectedApp.coverLetter}"</p>
                      </div>
                    )}
                    
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
                      <h3 className="text-sm font-black text-slate-900 mb-5 flex items-center gap-2"><Briefcase className="h-4 w-4 text-slate-400" /> Professional Skills</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {profile.skills?.length > 0 ? (
                          profile.skills.map((skill: string) => (
                            <span key={skill} className="px-4 py-2 bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 shadow-sm">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-sm font-medium bg-slate-50 px-4 py-2 rounded-xl">No skills listed.</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
                      <h3 className="text-sm font-black text-slate-900 mb-5 flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Moderation Actions</h3>
                      <div className="flex flex-wrap gap-4">
                        {updatingId === selectedApp._id ? (
                          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-6 py-4 rounded-2xl"><Loader2 className="h-5 w-5 animate-spin" /> Updating Status...</div>
                        ) : (
                          <>
                            {selectedApp.status === "applied" && (
                              <>
                                <button onClick={() => handleStatusChange(selectedApp._id, "shortlisted")} className="flex-1 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-700 hover:shadow-md hover:shadow-emerald-500/10 font-black text-sm rounded-2xl transition-all border border-emerald-200 flex justify-center items-center gap-2"><Check className="h-4 w-4" /> Shortlist</button>
                                <button onClick={() => handleStatusChange(selectedApp._id, "rejected")} className="flex-1 py-4 bg-gradient-to-r from-rose-50 to-rose-100/50 text-rose-700 hover:shadow-md hover:shadow-rose-500/10 font-black text-sm rounded-2xl transition-all border border-rose-200 flex justify-center items-center gap-2"><X className="h-4 w-4" /> Reject</button>
                              </>
                            )}
                            {selectedApp.status === "shortlisted" && (
                              <button onClick={() => handleStatusChange(selectedApp._id, "interview")} className="flex-1 py-4 bg-gradient-to-r from-amber-50 to-amber-100/50 text-amber-700 hover:shadow-md hover:shadow-amber-500/10 font-black text-sm rounded-2xl transition-all border border-amber-200 flex items-center justify-center gap-2"><Calendar className="h-4 w-4" /> Schedule Interview</button>
                            )}
                            {selectedApp.status === "interview" && (
                              <>
                                <button onClick={() => handleStatusChange(selectedApp._id, "hired")} className="flex-1 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-indigo-700 hover:shadow-md hover:shadow-indigo-500/10 font-black text-sm rounded-2xl transition-all border border-indigo-200">Mark as Hired</button>
                                <button onClick={() => handleStatusChange(selectedApp._id, "rejected")} className="flex-1 py-4 bg-gradient-to-r from-rose-50 to-rose-100/50 text-rose-700 hover:shadow-md hover:shadow-rose-500/10 font-black text-sm rounded-2xl transition-all border border-rose-200 flex justify-center items-center gap-2"><X className="h-4 w-4" /> Reject</button>
                              </>
                            )}
                            {(selectedApp.status === "hired" || selectedApp.status === "rejected") && (
                              <div className="w-full text-center p-4 bg-slate-50 rounded-2xl text-slate-500 font-bold text-sm border border-slate-200/60">
                                This candidate has been {selectedApp.status}.
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
