"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FileText, ExternalLink, ChevronDown, Check, X, Calendar, User, Eye, Loader2, ArrowLeft } from "lucide-react";

interface Candidate {
  _id: string;
  name: string;
  email: string;
  candidateProfile: {
    skills: string[];
    expectedSalary: number;
    preferredLocation: string;
    resumeUrl: string;
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
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

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
      // Update local state
      setApplications(
        applications.map((app) => (app._id === appId ? { ...app, status: data.application.status } : app))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update applicant status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      applied: "bg-blue-50 text-blue-750 border-blue-150",
      shortlisted: "bg-purple-50 text-purple-750 border-purple-150",
      interview: "bg-amber-50 text-amber-750 border-amber-150",
      rejected: "bg-rose-50 text-rose-750 border-rose-150",
      hired: "bg-emerald-50 text-emerald-755 border-emerald-150",
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${badges[status] || badges.applied}`;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Applicants Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Reviewing candidates for: <span className="text-blue-600 font-bold">{jobTitle}</span>
          </p>
        </div>
      </div>

      {applications.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-450 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Candidate Details</th>
                  <th className="px-6 py-4">Skills</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                {applications.map((app) => {
                  const c = app.candidateId;
                  const profile = c?.candidateProfile || {};
                  const isExpanded = expandedAppId === app._id;

                  if (!c) return null;

                  return (
                    <React.Fragment key={app._id}>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition-colors">
                        {/* Name & Contact */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-905 dark:text-white truncate">{c.name}</h4>
                              <p className="text-xs text-slate-450 dark:text-slate-400 truncate mt-0.5">{c.email}</p>
                              
                              {/* Location / Salary */}
                              <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold uppercase mt-1">
                                <span>{profile.preferredLocation || "Anywhere"}</span>
                                <span>&bull;</span>
                                <span>${profile.expectedSalary?.toLocaleString() || 0}/yr</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Skills */}
                        <td className="px-6 py-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {profile.skills?.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-750 dark:text-slate-300 text-xs rounded"
                              >
                                {skill}
                              </span>
                            ))}
                            {profile.skills?.length > 3 && (
                              <span className="text-[10px] text-slate-400 font-bold self-center ml-1">
                                +{profile.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Applied Date */}
                        <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(app.status)}></span>
                        </td>

                        {/* Action buttons */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Expand cover letter button */}
                            {app.coverLetter && (
                              <button
                                onClick={() => setExpandedAppId(isExpanded ? null : app._id)}
                                className={`p-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer ${
                                  isExpanded
                                    ? "bg-slate-100 dark:bg-slate-700 text-slate-800"
                                    : "border-slate-200 dark:border-slate-700 text-slate-500"
                                }`}
                                title="View Cover Letter"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}

                            {/* View Resume */}
                            <a
                              href={profile.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 rounded-xl transition-colors flex items-center justify-center"
                              title="Download/Open Resume"
                            >
                              <FileText className="h-4 w-4" />
                            </a>

                            {/* Actions Dropdown buttons */}
                            {updatingId === app._id ? (
                              <Loader2 className="h-5 w-5 animate-spin text-slate-400 mx-2" />
                            ) : (
                              <>
                                {app.status === "applied" && (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(app._id, "shortlisted")}
                                      className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl transition-colors cursor-pointer"
                                      title="Shortlist Candidate"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(app._id, "rejected")}
                                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-750 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                                      title="Reject Candidate"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </>
                                )}

                                {app.status === "shortlisted" && (
                                  <button
                                    onClick={() => handleStatusChange(app._id, "interview")}
                                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-250 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                                  >
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>Schedule Interview</span>
                                  </button>
                                )}

                                {app.status === "interview" && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleStatusChange(app._id, "hired")}
                                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-250 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                      Offer Hire
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(app._id, "rejected")}
                                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-750 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                                      title="Reject Candidate"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Cover Letter Block */}
                      {isExpanded && app.coverLetter && (
                        <tr className="bg-slate-50/50 dark:bg-slate-900/20">
                          <td colSpan={5} className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-750">
                              <h5 className="font-bold text-slate-850 dark:text-slate-205 text-xs mb-1 uppercase tracking-wider">
                                Cover Letter / Candidate Message:
                              </h5>
                              <p className="text-sm text-slate-655 dark:text-slate-350 italic whitespace-pre-line leading-relaxed">
                                "{app.coverLetter}"
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl py-16 px-6 text-center shadow-sm">
          <User className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-650" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4">No applicants yet</h3>
          <p className="text-sm text-slate-550 mt-2 max-w-sm mx-auto">
            No candidates have applied for this job posting yet. Once candidates click apply, they will show up here.
          </p>
          <Link
            href="/employer/manage-jobs"
            className="inline-flex items-center px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-750 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl text-sm font-semibold mt-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Job Listings</span>
          </Link>
        </div>
      )}
    </div>
  );
}
