import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Job from "@/models/Job";
import Company from "@/models/Company";
import User from "@/models/User";
import Application from "@/models/Application";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JobDetailActions from "@/components/jobs/JobDetailActions";
import SimilarJobs from "@/components/jobs/SimilarJobs";
import {
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  ChevronLeft,
  Users,
  Globe,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    await dbConnect();
    const job = await Job.findById(id).populate("companyId").lean();
    if (!job) {
      return {
        title: "Job Not Found | Tejomarg Job Portal",
      };
    }
    const companyName = (job.companyId as any)?.name || "Verified Employer";
    return {
      title: `${job.title} at ${companyName} | Tejomarg Job`,
      description: `Apply for the ${job.title} position at ${companyName}. Requirements: ${job.skillsRequired.join(", ")}. Find more careers on Tejomarg Job Portal.`,
    };
  } catch (error) {
    return { title: "Job Opportunity | Tejomarg Job Portal" };
  }
}

async function getJobDetails(jobId: string) {
  try {
    await dbConnect();
    
    // Force company model registration
    const _dummyCompany = Company.schema;

    const jobRaw = await Job.findById(jobId).populate("companyId").lean();
    if (!jobRaw) return { job: null, similarJobs: [] };

    const job = JSON.parse(JSON.stringify(jobRaw));

    // Fetch similar jobs (same category, different ID)
    const similarRaw = await Job.find({ _id: { $ne: jobId }, category: job.category, status: "active" })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("companyId")
      .lean();
    
    const similarJobs = JSON.parse(JSON.stringify(similarRaw));

    return { job, similarJobs };
  } catch (error) {
    console.error("Error fetching job details:", error);
    return { job: null, similarJobs: [] };
  }
}

async function getCandidateStatus(jobId: string, userId?: string) {
  if (!userId) return { alreadyApplied: false, resumeUrl: "" };

  try {
    await dbConnect();
    
    // Check if already applied
    const app = await Application.findOne({ jobId, candidateId: userId }).lean();
    
    // Check profile resume
    const user = await User.findById(userId).select("candidateProfile.resumeUrl").lean();

    return {
      alreadyApplied: !!app,
      resumeUrl: user?.candidateProfile?.resumeUrl || "",
    };
  } catch (error) {
    console.error("Error getting candidate status:", error);
    return { alreadyApplied: false, resumeUrl: "" };
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { job, similarJobs } = await getJobDetails(id);

  if (!job) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  
  const { alreadyApplied, resumeUrl } = await getCandidateStatus(id, user?.id);
  const company = job.companyId as any;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to search listings
          </Link>
        </div>

        {/* Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Job Description & Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              
              {/* Header Info: Logo on left, details on right */}
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Logo */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 border border-slate-100 rounded-lg flex items-center justify-center p-2 shadow-sm overflow-hidden bg-white">
                  {company?.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="h-8 w-8 text-slate-300" />
                  )}
                </div>
                
                {/* Titles and Badges */}
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {job.title}
                  </h1>
                  <p className="text-sm font-semibold text-slate-600 mt-1">
                    {company?.name || "Verified Employer"}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-slate-500 font-medium">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.salaryMin && job.salaryMax
                        ? `₹${(job.salaryMin / 100000).toFixed(1)} - ${(job.salaryMax / 100000).toFixed(1)} Lakhs`
                        : "Not disclosed"}
                    </span>
                  </div>
                  
                  {/* Badges row */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                      <Building2 className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                      Work from Office
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                      <div className="h-3.5 w-3.5 rounded-full bg-slate-400 text-white flex items-center justify-center mr-1.5 text-[8px]">F</div>
                      {job.jobType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                      <Briefcase className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                      {job.experienceLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <JobDetailActions
                  jobId={job._id}
                  jobTitle={job.title}
                  companyName={company?.name || "Verified Employer"}
                  isLoggedIn={!!user}
                  userRole={user?.role}
                  alreadyApplied={alreadyApplied}
                  profileResumeUrl={resumeUrl}
                />
              </div>

              <hr className="border-slate-100" />

              {/* Job Description */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Job Description
                </h3>
                <div className="text-slate-650 dark:text-slate-350 text-sm leading-relaxed space-y-4 whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              {/* Skills Required */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Skills Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-xl text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Apply & Company Details Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Dream Job Banner */}
            <div className="bg-orange-50/50 rounded-xl border border-orange-100 p-5 text-center shadow-sm relative overflow-hidden">
              <h3 className="text-[15px] font-bold text-slate-800 mb-5">Get your dream job in 2 simple steps:</h3>
              <div className="flex justify-between items-center relative z-10 max-w-[240px] mx-auto">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 text-orange-600">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 max-w-[60px] leading-tight">Apply for job</span>
                </div>
                
                <div className="h-0.5 w-8 bg-orange-200 -mt-6"></div>
                
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 text-red-500">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 max-w-[60px] leading-tight">Schedule interview</span>
                </div>
                
                <div className="h-0.5 w-8 bg-orange-200 -mt-6"></div>
                
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 text-indigo-500">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 max-w-[60px] leading-tight">Get hired</span>
                </div>
              </div>
            </div>

            {/* Similar Jobs List Widget */}
            <SimilarJobs jobs={similarJobs} />

            {/* Company Info Card */}
            {company && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                  About the Company
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed line-clamp-4">
                  {company.description}
                </p>

                <div className="space-y-2 text-xs font-semibold text-slate-500">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-slate-400" />
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    ) : (
                      "No website listed"
                    )}
                  </div>
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-slate-400" />
                    <span>Industry: {company.industry}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    <span>HQ: {company.location}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
export const dynamic = "force-dynamic";
