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
  if (job.createdAt) {
    const d = job.createdAt.toDate ? job.createdAt.toDate() : new Date(job.createdAt);
    if (!isNaN(d.getTime())) {
      dateString = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }
  
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Print Header */}
        <div className="bg-slate-900 text-white p-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight">INVOICE</h1>
            <p className="text-slate-400 mt-1">Receipt for Job Posting</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-blue-400 tracking-tighter">TEJOMARG</div>
            <p className="text-sm text-slate-400 font-medium">India's #1 Job Platform</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="p-8">
          <div className="flex justify-between pb-8 border-b border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
              <h3 className="text-lg font-bold text-slate-800">{company?.companyName || job.companyName || "Employer"}</h3>
              {employer?.name && <p className="text-slate-600 mt-1 font-medium">{employer.name}</p>}
              <p className="text-slate-500 mt-0.5 text-sm">{employer?.email || job.email || "No Email Provided"}</p>
              {company?.address && <p className="text-slate-500 mt-0.5 text-sm max-w-[250px]">{company.address}</p>}
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Invoice Details</p>
              <p className="text-slate-800 font-medium"><span className="text-slate-500">Invoice No:</span> INV-{id.substring(0, 8).toUpperCase()}</p>
              <p className="text-slate-800 font-medium mt-1"><span className="text-slate-500">Date:</span> {dateString}</p>
              <p className="text-slate-800 font-medium mt-1"><span className="text-slate-500">Payment ID:</span> {job.paymentId || job.paymentOrderId}</p>
              <p className="text-emerald-600 font-bold mt-1 bg-emerald-50 inline-block px-2 py-0.5 rounded text-sm">PAID</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-sm font-bold text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="pb-3 text-sm font-bold text-slate-400 uppercase tracking-wider text-center">Plan</th>
                  <th className="pb-3 text-sm font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4">
                    <p className="font-bold text-slate-800">{job.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">Job Posting Fee</p>
                  </td>
                  <td className="py-4 text-center">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-sm font-bold">{job.pricingPlan}</span>
                  </td>
                  <td className="py-4 text-right font-bold text-slate-800">
                    ₹{basePrice}.00
                  </td>
                </tr>
                {job.couponCode && (
                  <tr>
                    <td className="py-4" colSpan={2}>
                      <p className="font-bold text-slate-800">Discount Applied</p>
                      <p className="text-sm text-slate-500 mt-0.5">Coupon: <span className="font-mono bg-slate-100 px-1 rounded">{job.couponCode}</span></p>
                    </td>
                    <td className="py-4 text-right font-bold text-emerald-600">
                      (Discounted)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer & Totals */}
          <div className="mt-8 pt-8 border-t border-slate-200 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">₹{basePrice}.00</span>
              </div>
              <div className="flex justify-between py-2 text-slate-500 border-b border-slate-100">
                <span>Tax (0%)</span>
                <span className="font-bold text-slate-800">₹0.00</span>
              </div>
              <div className="flex justify-between py-4 text-lg">
                <span className="font-black text-slate-800">Total Paid</span>
                <span className="font-black text-blue-600">
                   Paid
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center text-sm text-slate-400">
            <p>Thank you for doing business with Tejomarg Job Portal.</p>
            <p className="mt-1">For any queries, please contact support@tejomargjob.com</p>
          </div>
        </div>

        {/* Print Button (Hidden when printing) */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 text-center print:hidden">
          <PrintButton />
        </div>
      </div>
    </div>
  );
}
