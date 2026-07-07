import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Company from "@/models/Company";
import Job from "@/models/Job";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Building2, MapPin, Globe, Briefcase, ChevronRight } from "lucide-react";

interface CompanyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CompanyPageProps) {
  const { id } = await params;
  try {
    await dbConnect();
    const company = await Company.findById(id).lean();
    if (!company) return { title: "Company Not Found | Tejomarg Job Portal" };
    return {
      title: `${company.name} Profile & Jobs | Tejomarg Job`,
      description: company.description.slice(0, 160),
    };
  } catch (error) {
    return { title: "Company Profile | Tejomarg Job Portal" };
  }
}

async function getCompanyData(companyId: string) {
  try {
    await dbConnect();
    const company = await Company.findById(companyId).lean();
    if (!company) return null;

    // Fetch active jobs for this company
    const jobs = await Job.find({ companyId, status: "active" }).sort({ createdAt: -1 }).lean();

    return {
      company: JSON.parse(JSON.stringify(company)),
      jobs: JSON.parse(JSON.stringify(jobs)),
    };
  } catch (error) {
    console.error("Error loading company details:", error);
    return null;
  }
}

export default async function CompanyDetailPage({ params }: CompanyPageProps) {
  const { id } = await params;
  const data = await getCompanyData(id);

  if (!data) {
    notFound();
  }

  const { company, jobs } = data;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Company Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-24 h-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Building2 className="h-12 w-12" />
              </div>
            )}
            
            <div className="space-y-3 flex-1">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{company.name}</h1>
                <span className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/20">
                  Verified Company
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-slate-500 font-semibold">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                  <span>{company.location}</span>
                </div>
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1 text-slate-400" />
                  <span>{company.industry}</span>
                </div>
                {company.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1 text-slate-400" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website.replace("https://", "").replace("http://", "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">About the Company</h3>
            <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed whitespace-pre-line">
              {company.description}
            </p>
          </div>
        </div>

        {/* Active Openings */}
        <div className="mt-10 space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Current Openings ({jobs.length})
          </h2>

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job: any) => (
                <div
                  key={job._id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3 border border-emerald-150 dark:border-emerald-900/20">
                      {job.jobType}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                      <Link href={`/jobs/${job._id}`}>{job.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">HQ: {job.location}</p>
                    <p className="text-sm text-slate-650 dark:text-slate-350 line-clamp-2 mt-3">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Estimated Salary</span>
                      <span className="text-sm font-extrabold text-slate-850 dark:text-white">
                        {job.salaryMin && job.salaryMax
                          ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
                          : "Undisclosed"}
                      </span>
                    </div>
                    
                    <Link
                      href={`/jobs/${job._id}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center group"
                    >
                      <span>Apply details</span>
                      <ChevronRight className="h-4 w-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-12 text-center text-slate-500 text-sm">
              <Briefcase className="h-10 w-10 mx-auto text-slate-300 mb-2" />
              <span>No open positions available for this company at the moment.</span>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
export const dynamic = "force-dynamic";
