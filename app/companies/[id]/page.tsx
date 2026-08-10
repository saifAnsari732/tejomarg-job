import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebaseAdmin";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Building2, MapPin, Globe, Briefcase, ChevronRight, CheckCircle2, IndianRupee } from "lucide-react";

interface CompanyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CompanyPageProps) {
  const { id } = await params;
  try {
    const companySnap = await db.collection("companies").doc(id).get();
    if (!companySnap.exists) return { title: "Company Not Found | Tejomarg Job Portal" };
    const company = companySnap.data();
    return {
      title: `${company?.name} Profile & Jobs | Tejomarg Job`,
      description: company?.description?.slice(0, 160),
    };
  } catch (error) {
    return { title: "Company Profile | Tejomarg Job Portal" };
  }
}

async function getCompanyData(companyId: string) {
  try {
    const compSnap = await db.collection("companies").doc(companyId).get();
    if (!compSnap.exists) return null;
    const company = { _id: compSnap.id, ...compSnap.data() };

    // Fetch active jobs for this company
    const jobsSnap = await db.collection("jobs").where("companyId", "==", companyId).where("status", "==", "active").get();
    const jobs = jobsSnap.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

    jobs.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return {
      company: JSON.parse(JSON.stringify(company)),
      jobs: JSON.parse(JSON.stringify(jobs)),
    };
  } catch (error) {
    console.error("Error loading company details:", error);
    return null;
  }
}

const formatSalary = (amount: number) => {
  if (!amount) return "";
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

export default async function CompanyDetailPage({ params }: CompanyPageProps) {
  const { id } = await params;
  const data = await getCompanyData(id);

  if (!data) {
    notFound();
  }

  const { company, jobs } = data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-blue-500/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full pb-20">
        {/* Dynamic Hero Banner */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-800" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
          {/* Decorative Orbs */}
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-blue-400/30 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full bg-purple-400/20 blur-[120px] pointer-events-none" />
        </div>

        {/* Profile Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-32 relative z-10">
          
          {/* Glassmorphic Company Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 dark:border-slate-700/50 p-6 md:p-10 shadow-2xl shadow-indigo-900/10 mb-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
              
              {/* Logo Wrapper */}
              <div className="relative shrink-0 -mt-16 md:-mt-20">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white dark:bg-slate-900 p-2 shadow-xl border border-slate-100 dark:border-slate-700">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-blue-500">
                      <Building2 className="h-16 w-16 opacity-50" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Core Details */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {company.name}
                  </h1>
                  {company.isVerified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 shadow-sm mx-auto md:mx-0">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                    <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                    {company.location || "Location not specified"}
                  </div>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                    <Building2 className="h-4 w-4 mr-2 text-indigo-500" />
                    {company.industry || "Industry not specified"}
                  </div>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-xl text-blue-600 transition-colors"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      {company.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700/50">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-1 bg-indigo-600 rounded-full mr-3"></span>
                About the Company
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed whitespace-pre-line pl-11">
                {company.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Current Openings */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Current Openings <span className="text-indigo-600 text-2xl">({jobs.length})</span>
              </h2>
            </div>

            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job: any) => {
                  const hasSalary = job.salaryMin && job.salaryMax;
                  return (
                    <div
                      key={job._id}
                      className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 flex flex-col justify-between hover:border-indigo-200 dark:hover:border-indigo-800/60 hover:shadow-2xl hover:shadow-indigo-900/5 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Subtle hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-black tracking-wider uppercase">
                            {job.jobType}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                          <Link href={`/jobs/${job._id}`}>{job.title}</Link>
                        </h3>
                        <p className="text-sm text-slate-500 font-bold mt-2 flex items-center">
                          <MapPin className="h-4 w-4 mr-1 opacity-70" /> {job.location}
                        </p>
                        <p className="text-[15px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-4 leading-relaxed font-medium">
                          {job.description}
                        </p>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center relative z-10">
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest block mb-1">
                            Estimated Pay
                          </span>
                          <span className="text-lg font-black text-slate-800 dark:text-white flex items-center">
                            {hasSalary ? (
                              <>
                                <IndianRupee className="h-4 w-4 mr-0.5 text-slate-400" />
                                {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}
                              </>
                            ) : (
                              "Undisclosed"
                            )}
                          </span>
                        </div>
                        
                        <Link
                          href={`/jobs/${job._id}`}
                          className="bg-slate-900 dark:bg-white hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white dark:text-slate-900 hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center group/btn shadow-md hover:shadow-lg hover:shadow-indigo-500/30"
                        >
                          <span>Apply Now</span>
                          <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Open Positions</h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto">
                  This company is not currently hiring on our platform. Check back later for new opportunities!
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
export const dynamic = "force-dynamic";
