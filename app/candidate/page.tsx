import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Application from "@/models/Application";
import Job from "@/models/Job";
import Company from "@/models/Company";
import { Building2, ChevronRight, Phone, MessageCircle, AlertCircle, Inbox, Clock, MapPin, Wallet } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

async function getApplications(userId: string) {
  try {
    await dbConnect();
    
    // Register Company and Job schemas for populate
    const _dummyJob = Job.schema;
    const _dummyCompany = Company.schema;

    const apps = await Application.find({ candidateId: userId })
      .populate({
        path: "jobId",
        populate: { path: "companyId" },
      })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(apps));
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

export default async function CandidateDashboardPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const applications = await getApplications(user?.id);
  const sp = await searchParams;

  const currentTab = sp.tab === "invites" ? "invites" : "applied";

  // Filter applications based on tab
  const displayedApps = applications.filter((app: any) => {
    if (currentTab === "invites") {
      return app.status === "interview";
    }
    // 'applied' tab shows everything else (or all if you want)
    // Actually, usually "Applied jobs" shows everything, but let's say it shows non-rejected/non-interview if we wanted.
    // For simplicity, let's say "Applied jobs" shows ALL applications for now, or everything except 'interview'.
    return app.status !== "interview";
  });

  return (
    <div className="bg-slate-50 min-h-screen -mt-6 pt-6 -mx-4 px-4 sm:-mx-8 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Applications</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8">
            <Link
              href="?tab=applied"
              className={`pb-4 px-1 border-b-4 font-bold text-[15px] transition-colors ${
                currentTab === "applied"
                  ? "border-[#208f60] text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Applied jobs
            </Link>
            <Link
              href="?tab=invites"
              className={`pb-4 px-1 border-b-4 font-bold text-[15px] transition-colors ${
                currentTab === "invites"
                  ? "border-[#208f60] text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Interview Invites
            </Link>
          </nav>
        </div>

        {/* Stats Sub-header */}
        <div className="flex items-center text-slate-500 text-sm font-medium">
          {displayedApps.length} {currentTab === "invites" ? "interview invites" : "applied jobs"}
          <AlertCircle className="h-4 w-4 ml-1.5 text-slate-400" />
        </div>

        {/* Applications Grid */}
        {displayedApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {displayedApps.map((app: any) => {
              const job = app.jobId;
              const company = job?.companyId;

              if (!job) return null;

              // Determine UI state based on application status
              const isRejected = app.status === "rejected";
              const isInterview = app.status === "interview";
              
              // In this mockup, if not rejected, it looks like an active/success state
              // We'll show the green timeline box for anything not rejected.
              
              const timeAgo = formatDistanceToNow(new Date(app.createdAt), { addSuffix: true });

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Top: Job & Company Info */}
                  <div className="p-5 pb-4 border-b border-slate-50 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        {company?.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-10 h-10 object-contain shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg leading-tight flex items-center group">
                            <Link href={`/jobs/${job._id}`} className="hover:text-blue-600 transition-colors">
                              {job.title}
                            </Link>
                          </h3>
                          <p className="text-sm font-medium text-slate-500 mt-0.5">
                            {company?.name || "Verified Employer"}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-emerald-600 shrink-0" />
                    </div>

                    <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-semibold">
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-2 text-slate-400 shrink-0" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Wallet className="h-3.5 w-3.5 mr-2 text-slate-400 shrink-0" />
                        {job.salaryMin && job.salaryMax
                          ? `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()} monthly *`
                          : "Salary not disclosed"}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Timeline Status Block */}
                  <div className="px-5 py-4">
                    {!isRejected ? (
                      /* Active / Positive State (Green Tint) */
                      <div className="bg-[#f0f9f5] border border-[#a2d8c3] rounded-lg p-4 relative">
                        {/* Timeline Graphic */}
                        <div className="absolute left-[26px] top-[30px] bottom-[50px] w-0.5 bg-[#208f60] z-0"></div>
                        
                        {/* Step 1 */}
                        <div className="flex items-start gap-3 relative z-10 mb-4">
                          <div className="w-5 h-5 rounded-full bg-white border-[5px] border-[#208f60] shrink-0 mt-0.5"></div>
                          <span className="font-bold text-slate-900 text-sm">Job Applied</span>
                        </div>
                        
                        {/* Step 2 */}
                        <div className="flex gap-3 relative z-10">
                          <div className="w-5 h-5 rounded-full bg-white border-[5px] border-[#208f60] shrink-0 mt-0.5"></div>
                          <div className="w-full">
                            <span className="font-bold text-[#145a3c] text-sm block mb-3">
                              Talk to {company?.name || "Company"}'s HR
                            </span>
                            
                            {/* HR Card inside timeline */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="#522b77"/>
                                  <path d="M18.706 20.447C18.6738 20.479 18.6366 20.5057 18.5956 20.5258C18.5546 20.5459 18.5105 20.5591 18.465 20.565L17.965 20.647C17.7818 20.6775 17.5957 20.6931 17.409 20.6931H6.591C6.40428 20.6931 6.21822 20.6775 6.035 20.647L5.535 20.565C5.48946 20.5591 5.44535 20.5459 5.40439 20.5258C5.36342 20.5057 5.32616 20.479 5.294 20.447C4.69741 19.8517 4.29808 19.102 4.14445 18.2863C3.99081 17.4705 4.09033 16.6231 4.431 15.845C4.77166 15.0669 5.34005 14.3904 6.07185 13.8931C6.80365 13.3959 7.67 13.0984 8.575 13.033L9.575 12.961C10.3756 12.9038 11.1824 12.9038 11.983 12.961L12.983 13.033C13.888 13.0984 14.7543 13.3959 15.4861 13.8931C16.2179 14.3904 16.7863 15.0669 17.127 15.845C17.4677 16.6231 17.5672 17.4705 17.4135 18.2863C17.2599 19.102 16.8606 19.8517 16.264 20.447H18.706Z" fill="#522b77"/>
                                </svg>
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 text-sm">Sonal Srivastava</p>
                                <p className="text-[11px] font-medium text-slate-600 mt-0.5 leading-tight">Introduce yourself and know the next steps</p>
                              </div>
                            </div>
                            
                            {/* HR Buttons */}
                            <div className="flex gap-3">
                              <a href="tel:+919876543210" className="flex-1 bg-[#208f60] hover:bg-[#1a7650] text-white font-bold text-sm py-2 px-3 rounded flex items-center justify-center transition-colors">
                                <Phone className="h-3.5 w-3.5 mr-2" /> Call HR
                              </a>
                              <a href="https://wa.me/919876543210?text=Hi%20HR,%20I%20have%20applied%20for%20the%20job%20at%20your%20company." target="_blank" rel="noreferrer" className="flex-1 border border-[#208f60] text-[#208f60] bg-white hover:bg-[#f0f9f5] font-bold text-sm py-2 px-3 rounded flex items-center justify-center transition-colors">
                                <MessageCircle className="h-3.5 w-3.5 mr-2" /> Whatsapp HR
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Rejected / Not Shortlisted State (Gray Tint) */
                      <div className="bg-slate-100 rounded-lg p-4 relative">
                        {/* Timeline Graphic */}
                        <div className="absolute left-[26px] top-[30px] bottom-[20px] w-0.5 bg-slate-300 z-0"></div>
                        
                        {/* Step 1 */}
                        <div className="flex items-start gap-3 relative z-10 mb-4">
                          <div className="w-5 h-5 rounded-full bg-slate-400 border-[3px] border-white shrink-0 mt-0.5 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-white"></span>
                          </div>
                          <span className="font-bold text-slate-800 text-sm">Job Applied</span>
                        </div>
                        
                        {/* Step 2 */}
                        <div className="flex gap-3 relative z-10">
                          <div className="w-5 h-5 rounded-full bg-white border-[5px] border-slate-400 shrink-0 mt-0.5"></div>
                          <div className="w-full">
                            <span className="font-bold text-slate-700 text-sm block mb-1">
                              Your application did not get shortlisted for the next round
                            </span>
                            <span className="text-xs text-slate-600 font-medium">Please apply to other jobs.</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-4 border-t border-slate-100 flex justify-between items-center bg-white mt-auto">
                    <span className="text-xs font-semibold text-slate-400">{timeAgo}</span>
                    <button className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1 fill-current" /> Report
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl py-16 px-6 text-center shadow-sm">
            <Inbox className="h-16 w-16 mx-auto text-slate-300" />
            <h3 className="text-xl font-bold text-slate-900 mt-4">No {currentTab === "invites" ? "interview invites" : "applications"} yet</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              You haven't {currentTab === "invites" ? "received any invites" : "submitted any applications"}. Click browse below to explore opportunities.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center px-6 py-2.5 bg-[#208f60] hover:bg-[#1a7650] text-white font-bold rounded-lg transition-colors mt-6"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
