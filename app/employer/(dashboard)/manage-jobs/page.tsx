"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Briefcase, Users, Eye, Trash2, Edit2, AlertCircle, ToggleLeft, ToggleRight, Loader2, Plus, CreditCard } from "lucide-react";
import Script from "next/script";

interface JobItem {
  _id: string;
  title: string;
  status: "pending" | "pending_payment" | "active" | "closed" | "draft";
  jobType: string;
  location: string;
  openings: number;
  applicantCount: number;
  category: string;
  experienceRequired: string;
  salaryMin: number;
  salaryMax: number;
  createdAt: string;
  paymentId?: string;
  paymentOrderId?: string;
  pricingPlan?: string;
}

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function loadJobs() {
    try {
      const res = await fetch("/api/employer/jobs");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load jobs");
      }
      setJobs(data.jobs || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to retrieve jobs list");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  const handleStatusToggle = async (job: JobItem) => {
    if (job.status === "pending") {
      toast.error("Pending jobs require Admin review before they can be activated.");
      return;
    }

    const nextStatus = job.status === "active" ? "closed" : "active";
    setTogglingId(job._id);

    try {
      const res = await fetch(`/api/employer/jobs/${job._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to toggle status");
      }

      toast.success(`Job marked as ${nextStatus}!`);
      // Update local state
      setJobs(jobs.map((j) => (j._id === job._id ? { ...j, status: nextStatus } : j)));
    } catch (err: any) {
      toast.error(err.message || "Failed to change job status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/employer/jobs/${jobId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete job");
      }

      toast.success("Job posting deleted successfully.");
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete job");
    }
  };

  const handlePayAndPublish = async (jobId: string) => {
    setTogglingId(jobId);
    try {
      const res = await fetch("/api/employer/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate payment order");

      const { orderId, amount, pricingPlan } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: amount.toString(), 
        currency: "INR",
        name: "Tejomarg Job Portal",
        description: `Payment for ${pricingPlan || 'Job'} Post`,
        image: "https://www.tejomarg.com/favicon.ico",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/employer/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                jobId: jobId,
              }),
            });
            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok) {
              toast.success("Payment successful! Your job is now active.");
              loadJobs(); // Reload to update status
            } else {
              throw new Error(verifyData.error || "Payment verification failed");
            }
          } catch (e: any) {
            toast.error(e.message || "Something went wrong verifying the payment");
          }
        },
        prefill: {
          name: "Employer",
          email: "employer@example.com",
        },
        theme: {
          color: "#208f60",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        toast.error("Payment Failed: " + response.error.description);
      });
      rzp1.open();

    } catch (err: any) {
      toast.error(err.message || "Failed to process payment");
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-505 gap-2">
        <Loader2 className="animate-spin h-6 w-6" />
        <span>Loading your jobs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Manage Posted Jobs</h1>
          <p className="text-sm text-slate-550 mt-1">
            Monitor, edit, close, or review applicants for roles you've published.
          </p>
        </div>
        <Link
          href="/employer/post-job"
          className="bg-blue-605 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Post a Job</span>
        </Link>
      </div>

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              {/* Left Column: Job Info */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-650 transition-colors">
                    {job.title}
                  </h3>
                  
                  {/* Status Badge */}
                  {job.status === "active" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-900/20">
                      Active
                    </span>
                  )}
                  {job.status === "pending" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-955/10 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-100/50 dark:border-amber-900/20">
                      Pending Approval
                    </span>
                  )}
                  {job.status === "pending_payment" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-100">
                      Pending Payment
                    </span>
                  )}
                  {job.status === "draft" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                      Draft
                    </span>
                  )}
                  {job.status === "closed" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-655 dark:text-slate-400 text-xs font-semibold border border-slate-200/50 dark:border-slate-700">
                      Closed
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs text-slate-500 font-semibold">
                  <span className="flex items-center">
                    <Briefcase className="h-3.5 w-3.5 mr-1 text-slate-400" />
                    {job.jobType}
                  </span>
                  <span className="flex items-center">
                    <span className="text-slate-400 mr-1">📍</span> {job.location}
                  </span>
                  <span className="flex items-center">
                    <span className="text-slate-400 mr-1">📂</span> {job.category || "General"}
                  </span>
                  <span className="flex items-center">
                    <span className="text-slate-400 mr-1">💼</span> {job.experienceRequired}
                  </span>
                  <span className="flex items-center">
                    <span className="text-slate-400 mr-1">₹</span> {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <span className="text-slate-400 mr-1">👥</span> Openings: {job.openings}
                  </span>
                  <span className="flex items-center text-slate-400">
                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Payment History Details */}
                {(job.paymentId || job.pricingPlan || job.paymentOrderId) && (
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-750 text-[11px] text-slate-500">
                    {job.pricingPlan && (
                      <span className="flex items-center text-blue-700 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                        Plan: {job.pricingPlan}
                      </span>
                    )}
                    {job.paymentId && (
                      <span className="flex items-center font-mono">
                        Payment ID: {job.paymentId}
                      </span>
                    )}
                    {job.paymentOrderId && (
                      <span className="flex items-center font-mono">
                        Order ID: {job.paymentOrderId}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Middle Column: Stats */}
              <div className="flex items-center space-x-8 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-750">
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{job.applicantCount}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Applicants</p>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-slate-150 dark:border-slate-700">
                {/* View Applicants button */}
                <Link
                  href={`/employer/jobs/${job._id}/applicants`}
                  className="px-4 py-2 bg-slate-50 dark:bg-slate-750 text-slate-705 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1.5"
                >
                  <Users className="h-4 w-4" />
                  <span>Applicants</span>
                </Link>

                {/* Status Toggle toggle */}
                <button
                  onClick={() => handleStatusToggle(job)}
                  disabled={togglingId === job._id}
                  className={`p-2 border rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                    job.status === "active"
                      ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                      : job.status === "closed"
                      ? "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-500"
                      : "border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed text-slate-350"
                  }`}
                  title={job.status === "active" ? "Mark as Closed" : job.status === "closed" ? "Mark as Active" : "Pending Moderation"}
                >
                  {togglingId === job._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : job.status === "active" ? (
                    <ToggleRight className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-slate-400" />
                  )}
                </button>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(job._id)}
                  className="p-2 border border-slate-200 dark:border-slate-700 hover:border-rose-200 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-455 text-slate-500 rounded-xl transition-colors cursor-pointer"
                  title="Delete Job Posting"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>

                {/* Pay Now Button for Drafts / Pending Payment */}
                {(job.status === "draft" || job.status === "pending_payment") && (
                  <button
                    onClick={() => handlePayAndPublish(job._id)}
                    disabled={togglingId === job._id}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center space-x-1.5 ml-2"
                  >
                    {togglingId === job._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                    <span>Pay & Publish</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl py-16 px-6 text-center shadow-sm">
          <Briefcase className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-655" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4">No jobs posted yet</h3>
          <p className="text-sm text-slate-550 mt-2 max-w-sm mx-auto">
            Get started by posting your first job opening to reach thousands of prospective candidates.
          </p>
          <Link
            href="/employer/post-job"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 mt-6"
          >
            Post a Job
          </Link>
        </div>
      )}
    </div>
  );
}
