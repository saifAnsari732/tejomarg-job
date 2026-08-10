import React from "react";
import { db } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import PrintButton from "@/components/ui/PrintButton";

// Next.js 15+ requires params to be treated as a Promise
export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const doc = await db.collection("jobs").doc(id).get();
  if (!doc.exists) {
    notFound();
  }

  const job = doc.data() as any;

  // Only show invoice for paid jobs
  if (!job.paymentId && !job.paymentOrderId) {
    notFound();
  }

  // Fetch employer and company details
  let employer = null;
  let company = null;
  if (job.employerId) {
    try {
      const userDoc = await db.collection("users").doc(job.employerId).get();
      if (userDoc.exists) employer = userDoc.data();
      
      const companySnap = await db.collection("companies").where("userId", "==", job.employerId).get();
      if (!companySnap.empty) company = companySnap.docs[0].data();
    } catch (err) {
      console.error("Failed to fetch employer details:", err);
    }
  }

  const getBasePrice = (plan: string) => {
    if (plan === "Premium") return 20;
    if (plan === "Premium AI") return 3;
    if (plan === "Super Premium") return 4;
    return 10;
  };

  const basePrice = getBasePrice(job.pricingPlan || "Classic");
  let discountAmount = 0;
  let finalPrice = basePrice;
  
  // Format date safely
  let dateString = "Invalid Date";
  let timeString = "";
  if (job.createdAt) {
    const d = job.createdAt.toDate ? job.createdAt.toDate() : new Date(job.createdAt);
    if (!isNaN(d.getTime())) {
      dateString = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      timeString = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  }
  
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-indigo-900/5 border border-indigo-100 overflow-hidden">
        {/* Print Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
          
          <div className="relative z-10 mb-6 sm:mb-0">
            <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">INVOICE</h1>
            <p className="text-indigo-200 mt-1.5 font-medium tracking-wide">Receipt for Job Posting</p>
          </div>
          <div className="text-left sm:text-right relative z-10">
            <div className="flex items-center sm:justify-end gap-3">
              {/* Logo Box */}
              <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center p-1.5">
                <svg className="w-full h-full text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div className="text-2xl font-black text-white tracking-tighter">TELEMEDIA</div>
            </div>
            <p className="text-sm text-indigo-200 font-medium mt-2">TELEMEDIA NETWORK PVT LTD</p>
            <p className="text-xs text-indigo-300/80 mt-0.5">Operating Tejomarg - India's Premium Job Platform</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="p-10">
          <div className="flex flex-col sm:flex-row justify-between pb-10 border-b border-indigo-50 gap-8">
            <div className="flex-1">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">Billed To</p>
              <h3 className="text-xl font-black text-slate-800">{company?.name || job.companyName || "Employer"}</h3>
              <div className="mt-2 space-y-1">
                {(company?.employerName || employer?.name) && (
                  <p className="text-slate-600 font-medium flex items-center gap-2">
                    <span className="w-4 text-center text-indigo-300">👤</span> {company?.employerName || employer?.name}
                  </p>
                )}
                {(company?.billingEmail || employer?.email || job.email) && (
                  <p className="text-slate-500 text-sm flex items-center gap-2">
                    <span className="w-4 text-center text-indigo-300">✉️</span> {company?.billingEmail || employer?.email || job.email}
                  </p>
                )}
                {(company?.contactNumber) && (
                  <p className="text-slate-500 text-sm flex items-center gap-2">
                    <span className="w-4 text-center text-indigo-300">📞</span> {company.contactNumber}
                  </p>
                )}
                {company?.location && (
                  <p className="text-slate-500 text-sm max-w-[250px] flex items-start gap-2 mt-2">
                    <span className="w-4 text-center text-indigo-300 mt-0.5">📍</span> {company.location}
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-left sm:text-right bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50 min-w-[240px]">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">Invoice Details</p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice Number</p>
                  <p className="text-slate-800 font-bold font-mono">INV-{id.substring(0, 8).toUpperCase()}</p>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</p>
                  <p className="text-slate-800 font-medium">{dateString} <span className="text-slate-400 ml-1">{timeString}</span></p>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment ID</p>
                  <p className="text-slate-800 font-mono text-sm">{job.paymentId || job.paymentOrderId}</p>
                </div>
                
                <div className="pt-2">
                  <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-black px-3 py-1 rounded-full text-xs shadow-sm shadow-emerald-500/20 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    PAID SUCCESS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-10">
            <div className="rounded-xl border border-indigo-50 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-indigo-50/50">
                  <tr>
                    <th className="py-4 px-5 text-xs font-black text-indigo-800 uppercase tracking-widest">Description</th>
                    <th className="py-4 px-5 text-xs font-black text-indigo-800 uppercase tracking-widest text-center">Plan</th>
                    <th className="py-4 px-5 text-xs font-black text-indigo-800 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50/50 bg-white">
                  <tr>
                    <td className="py-5 px-5">
                      <p className="font-bold text-slate-800 text-lg">{job.title}</p>
                      <p className="text-sm text-slate-500 mt-1">Platform Job Posting Fee</p>
                    </td>
                    <td className="py-5 px-5 text-center">
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">{job.pricingPlan}</span>
                    </td>
                    <td className="py-5 px-5 text-right font-black text-slate-800 text-lg">
                      ₹{basePrice}.00
                    </td>
                  </tr>
                  {job.couponCode && (
                    <tr className="bg-emerald-50/30">
                      <td className="py-4 px-5" colSpan={2}>
                        <p className="font-bold text-emerald-800 flex items-center gap-2">
                          <span className="text-emerald-500">🏷️</span> Discount Applied
                        </p>
                        <p className="text-sm text-emerald-600/80 mt-1">Coupon code: <span className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded font-bold text-emerald-700">{job.couponCode}</span></p>
                      </td>
                      <td className="py-4 px-5 text-right font-black text-emerald-600 text-lg">
                        - (Discounted)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer & Totals */}
          <div className="mt-8 flex justify-end">
            <div className="w-full sm:w-72 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex justify-between py-2 text-slate-500 text-sm font-medium">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">₹{basePrice}.00</span>
              </div>
              <div className="flex justify-between py-2 text-slate-500 text-sm font-medium border-b border-slate-200/60 pb-4">
                <span>Tax (0%)</span>
                <span className="font-bold text-slate-800">₹0.00</span>
              </div>
              <div className="flex justify-between pt-4 pb-2 text-xl">
                <span className="font-black text-slate-800">Total Paid</span>
                <span className="font-black text-indigo-600">
                   Paid
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center text-sm">
            <p className="text-slate-500 font-medium">Thank you for doing business with Telemedia Network Pvt Ltd.</p>
            <p className="mt-1 text-slate-400">For any billing queries, please contact <span className="text-indigo-500 font-medium">billing@telemedianetwork.com</span></p>
          </div>
        </div>

        {/* Print Button (Hidden when printing) */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 text-center print:hidden flex justify-center">
          <PrintButton />
        </div>
      </div>
    </div>
  );
}
