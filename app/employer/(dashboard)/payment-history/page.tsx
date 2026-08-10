"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Receipt, ArrowUpRight, Search, FileText } from "lucide-react";
import { toast } from "sonner";

export default function PaymentHistoryPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/employer/jobs");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Filter only jobs that have a payment ID or order ID (paid jobs)
      const paidJobs = data.jobs.filter((j: any) => j.paymentId || j.paymentOrderId);
      setJobs(paidJobs);
    } catch (err: any) {
      toast.error(err.message || "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (plan: string) => {
    if (plan === "Premium") return 20;
    if (plan === "Premium AI") return 3;
    if (plan === "Super Premium") return 4;
    return 10;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track all your transaction records and invoices.</p>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Payment ID..." 
            className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
          />
        </div>
      </div>

      <div className="p-0">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-slate-50 dark:bg-slate-750/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Transactions Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              You haven't made any payments for job postings yet. Your payment history will appear here once you publish a paid job.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6 md:pl-8 font-semibold">Transaction Details</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 pr-6 md:pr-8 font-semibold text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/50 transition-colors">
                    <td className="p-4 pl-6 md:pl-8">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{job.title}</div>
                      <div className="text-xs text-slate-500 mt-1 font-mono flex items-center gap-2">
                        {job.paymentId ? `Pay ID: ${job.paymentId}` : `Order ID: ${job.paymentOrderId}`}
                        <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-sans font-bold text-[10px]">{job.pricingPlan}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                      {new Date(job.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                      ₹{getPrice(job.pricingPlan)}.00
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Successful
                      </span>
                    </td>
                    <td className="p-4 pr-6 md:pr-8 text-right">
                      <button className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
