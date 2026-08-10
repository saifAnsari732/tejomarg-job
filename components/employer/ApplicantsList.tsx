"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FileText, ExternalLink, Check, X, Calendar, User, Eye, Loader2, ArrowLeft, Mail, Phone, MapPin, DollarSign, Briefcase } from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <Link href="/employer/manage-jobs" className="inline-flex items-center text-indigo-300 hover:text-white transition-colors text-sm font-bold mb-4">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Jobs
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight">Applicants Dashboard</h1>
          <p className="text-indigo-200 font-medium mt-2 text-sm sm:text-base">
            Reviewing candidates for: <span className="text-white font-bold px-2 py-1 bg-white/10 rounded-lg ml-1">{jobTitle}</span>
          </p>
        </div>
        <div className="relative z-10 mt-6 sm:mt-0 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[140px]">
          <div className="text-4xl font-black text-white">{applications.length}</div>
          <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider mt-1">Total Applicants</div>
        </div>
      </div>

      {/* Candidate List */}
      {applications.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-xs font-black uppercase tracking-widest">
                  <th className="px-8 py-5">Candidate</th>
                  <th className="px-8 py-5">Skills Match</th>
                  <th className="px-8 py-5">Applied Date</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => {
                  const c = app.candidateId;
                  const profile = c?.candidateProfile || {};
                  
                  if (!c) return null;

                  return (
                    <tr key={app._id} className="hover:bg-indigo-50/30 transition-all group cursor-pointer" onClick={() => setSelectedApp(app)}>
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-700 flex items-center justify-center font-black text-lg shadow-inner border border-indigo-200/50">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">{c.name}</h4>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <Mail className="h-3 w-3 text-slate-400" /> {c.email}
                            </p>
                            <div className="flex items-center space-x-3 text-[11px] font-bold text-slate-400 uppercase mt-2">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {profile.preferredLocation || "Any"}</span>
                              <span className="flex items-center gap-1 text-emerald-600"><DollarSign className="h-3 w-3" /> {profile.expectedSalary ? `${(profile.expectedSalary/1000).toFixed(0)}k/yr` : "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                          {profile.skills?.slice(0, 3).map((skill) => (
                            <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200">
                              {skill}
                            </span>
                          ))}
                          {profile.skills?.length > 3 && (
                            <span className="px-2 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-lg border border-slate-200 border-dashed">
                              +{profile.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-8 py-5 text-sm font-semibold text-slate-600">
                        {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>

                      <td className="px-8 py-5">
                        <span className={getStatusBadge(app.status)}></span>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2.5 bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 rounded-xl transition-all shadow-sm flex items-center justify-center font-bold text-xs gap-1.5"
                          >
                            <Eye className="h-4 w-4" /> View
                          </button>
                          
                          {updatingId === app._id ? (
                            <div className="p-2.5"><Loader2 className="h-4 w-4 animate-spin text-indigo-500" /></div>
                          ) : (
                            app.status === "applied" && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(app._id, "shortlisted")}
                                  className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-xl transition-colors shadow-sm"
                                  title="Shortlist Candidate"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(app._id, "rejected")}
                                  className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-xl transition-colors shadow-sm"
                                  title="Reject Candidate"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-b border-slate-100 flex items-start justify-between">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/30">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{c.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <a href={`mailto:${c.email}`} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5"><Mail className="h-4 w-4" /> {c.email}</a>
                      {c.phone && <a href={`tel:${c.phone}`} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5"><Phone className="h-4 w-4" /> {c.phone}</a>}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedApp(null)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Col - Overview */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Candidate Overview</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><MapPin className="h-4 w-4 text-indigo-500" /></div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Location</p>
                            <p className="text-sm font-bold text-slate-800">{profile.preferredLocation || "Not specified"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><DollarSign className="h-4 w-4 text-emerald-500" /></div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Expected Salary</p>
                            <p className="text-sm font-bold text-slate-800">{profile.expectedSalary ? `₹${profile.expectedSalary.toLocaleString()}/yr` : "Negotiable"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><Briefcase className="h-4 w-4 text-purple-500" /></div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Current Status</p>
                            <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {profile.resumeUrl && (
                      <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-lg shadow-slate-900/20">
                        <FileText className="h-5 w-5" /> View Full Resume
                      </a>
                    )}
                  </div>

                  {/* Right Col - Details */}
                  <div className="md:col-span-2 space-y-6">
                    {selectedApp.coverLetter && (
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 rounded-l-2xl"></div>
                        <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-indigo-500" /> Cover Letter</h3>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line italic">"{selectedApp.coverLetter}"</p>
                      </div>
                    )}
                    
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="text-sm font-black text-slate-800 mb-4">Professional Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills?.length > 0 ? (
                          profile.skills.map((skill: string) => (
                            <span key={skill} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-100">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-sm font-medium">No skills listed.</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="text-sm font-black text-slate-800 mb-3">Moderation Actions</h3>
                      <div className="flex flex-wrap gap-3">
                        {updatingId === selectedApp._id ? (
                          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm"><Loader2 className="h-5 w-5 animate-spin" /> Updating...</div>
                        ) : (
                          <>
                            {selectedApp.status === "applied" && (
                              <>
                                <button onClick={() => handleStatusChange(selectedApp._id, "shortlisted")} className="flex-1 py-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 font-black text-sm rounded-xl transition-colors border border-emerald-200">Shortlist</button>
                                <button onClick={() => handleStatusChange(selectedApp._id, "rejected")} className="flex-1 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-black text-sm rounded-xl transition-colors border border-rose-200">Reject</button>
                              </>
                            )}
                            {selectedApp.status === "shortlisted" && (
                              <button onClick={() => handleStatusChange(selectedApp._id, "interview")} className="flex-1 py-3 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 font-black text-sm rounded-xl transition-colors border border-amber-200 flex items-center justify-center gap-2"><Calendar className="h-4 w-4" /> Schedule Interview</button>
                            )}
                            {selectedApp.status === "interview" && (
                              <>
                                <button onClick={() => handleStatusChange(selectedApp._id, "hired")} className="flex-1 py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 font-black text-sm rounded-xl transition-colors border border-indigo-200">Mark as Hired</button>
                                <button onClick={() => handleStatusChange(selectedApp._id, "rejected")} className="flex-1 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-black text-sm rounded-xl transition-colors border border-rose-200">Reject</button>
                              </>
                            )}
                            {(selectedApp.status === "hired" || selectedApp.status === "rejected") && (
                              <div className="w-full text-center p-3 bg-slate-50 rounded-xl text-slate-500 font-bold text-sm border border-slate-100">
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
