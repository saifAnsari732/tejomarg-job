import React from "react";
import Link from "next/link";
import { db } from "@/lib/firebaseAdmin";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FilterSidebar from "@/components/jobs/FilterSidebar";
import JobCard from "@/components/jobs/JobCard";
import LiveJobsSection from "@/components/jobs/LiveJobsSection";
import { ChevronLeft, ChevronRight, Inbox, Zap, Database, Search, Briefcase, MapPin, Sparkles, Filter } from "lucide-react";

interface SearchParams {
  search?: string;
  location?: string;
  category?: string;
  department?: string;
  jobType?: string;
  workMode?: string;
  workType?: string;
  workShift?: string;
  experience?: string;
  minSalary?: string;
  datePosted?: string;
  education?: string;
  englishLevel?: string;
  gender?: string;
  sort?: string;
  page?: string;
}

async function getJobsData(filters: SearchParams) {
  try {
    const catSnap = await db.collection("categories").get();
    const categories = catSnap.docs.map(d => ({ _id: d.id, ...d.data() }));

    const jobsSnap = await db.collection("jobs").where("status", "==", "active").get();
    let jobs = jobsSnap.docs.map(doc => ({ _id: doc.id, ...doc.data() as any }));

    if (filters.search) {
      const q = filters.search.toLowerCase();
      jobs = jobs.filter(j => 
        (j.title || "").toLowerCase().includes(q) ||
        (j.description || "").toLowerCase().includes(q) ||
        ((j.skillsRequired || []).some((s: string) => s.toLowerCase().includes(q)))
      );
    }
    
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      jobs = jobs.filter(j => (j.location || "").toLowerCase().includes(loc));
    }

    const deptFilters: string[] = [];
    if (filters.category) deptFilters.push(...filters.category.split(","));
    if (filters.department) deptFilters.push(...filters.department.split(","));
    if (deptFilters.length > 0) {
      jobs = jobs.filter(j => deptFilters.includes(j.category));
    }

    const typeFilters: string[] = [];
    if (filters.jobType) typeFilters.push(...filters.jobType.split(","));
    if (filters.workType) typeFilters.push(...filters.workType.split(","));
    const mappedTypes = typeFilters.map(t =>
      t === "Full time" ? "Full-time" : t === "Part time" ? "Part-time" : t
    );
    let workModes: string[] = [];
    if (filters.workMode) {
      workModes = filters.workMode.split(",");
      if (workModes.includes("Work from home")) {
        mappedTypes.push("Remote");
      }
    }
    if (mappedTypes.length > 0) {
      jobs = jobs.filter(j => mappedTypes.includes(j.jobType));
    }

    if (filters.experience) {
      const exp = parseInt(filters.experience);
      if (!isNaN(exp)) jobs = jobs.filter(j => (j.experienceYears || 0) <= exp);
    }
    if (filters.minSalary) {
      const sal = parseInt(filters.minSalary);
      if (!isNaN(sal) && sal > 0) jobs = jobs.filter(j => (j.salaryMax || 0) >= sal);
    }
    if (filters.education) {
      const edu = filters.education.split(",");
      jobs = jobs.filter(j => edu.includes(j.highestEducation));
    }
    if (filters.workShift) {
      const shift = filters.workShift.split(",");
      jobs = jobs.filter(j => shift.includes(j.workShift));
    }
    if (filters.englishLevel) {
      const eng = filters.englishLevel.split(",");
      jobs = jobs.filter(j => eng.includes(j.englishLevel));
    }
    if (filters.gender) {
      const gen = filters.gender.split(",");
      jobs = jobs.filter(j => gen.includes(j.genderPreference));
    }

    if (filters.datePosted && filters.datePosted !== "All") {
      const now = new Date();
      const pastDate = new Date();
      if (filters.datePosted === "Last 24 hours") pastDate.setDate(now.getDate() - 1);
      else if (filters.datePosted === "Last 3 days") pastDate.setDate(now.getDate() - 3);
      else if (filters.datePosted === "Last 7 days") pastDate.setDate(now.getDate() - 7);
      
      jobs = jobs.filter(j => {
        const d = j.createdAt?.toDate ? j.createdAt.toDate() : new Date(j.createdAt || 0);
        return d >= pastDate;
      });
    }

    // Sort
    if (filters.sort === "Salary - High to low") {
      jobs.sort((a, b) => (parseFloat(b.salaryMax) || 0) - (parseFloat(a.salaryMax) || 0));
    } else {
      jobs.sort((a, b) => {
         const dA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
         const dB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
         return dB - dA;
      });
    }

    const totalJobs = jobs.length;
    const page  = parseInt(filters.page || "1");
    const limit = 10;
    const skip  = (page - 1) * limit;
    const totalPages = Math.ceil(totalJobs / limit) || 1;

    jobs = jobs.slice(skip, skip + limit);

    // populate company
    jobs = await Promise.all(jobs.map(async (j) => {
       if (j.companyId) {
          const compSnap = await db.collection("companies").doc(j.companyId).get();
          if (compSnap.exists) j.companyId = { _id: compSnap.id, ...compSnap.data() };
       }
       return j;
    }));

    return {
      categories: JSON.parse(JSON.stringify(categories)),
      jobs: JSON.parse(JSON.stringify(jobs)),
      pagination: { currentPage: page, totalPages, totalJobs },
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { categories: [], jobs: [], pagination: { currentPage: 1, totalPages: 1, totalJobs: 0 } };
  }
}

export default async function BrowseJobsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = await searchParams;
  const { categories, jobs, pagination } = await getJobsData(resolvedParams);

  const currentFilters = {
    search:       resolvedParams.search       || "",
    location:     resolvedParams.location     || "",
    category:     resolvedParams.category     || "",
    department:   resolvedParams.department   || "",
    jobType:      resolvedParams.jobType      || "",
    workMode:     resolvedParams.workMode     || "",
    workType:     resolvedParams.workType     || "",
    workShift:    resolvedParams.workShift    || "",
    experience:   resolvedParams.experience   || "0",
    minSalary:    resolvedParams.minSalary    || "0",
    datePosted:   resolvedParams.datePosted   || "All",
    education:    resolvedParams.education    || "",
    englishLevel: resolvedParams.englishLevel || "",
    gender:       resolvedParams.gender       || "",
    sort:         resolvedParams.sort         || "Relevant",
  };

  const getPageLink = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([k, v]) => { if (v && v !== "0" && v !== "All") params.set(k, v); });
    params.set("page", page.toString());
    return `/jobs?${params.toString()}`;
  };

  const getSortLink = (sortVal: string) => {
    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([k, v]) => { if (v && v !== "0" && v !== "All") params.set(k, v); });
    params.set("sort", sortVal);
    params.set("page", "1");
    return `/jobs?${params.toString()}`;
  };

  const liveQuery    = currentFilters.search   || "Software Developer";
  const liveLocation = currentFilters.location || "India";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans selection:bg-emerald-500/30">
      <Navbar />
      
      {/* Premium Hero Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 w-full">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 border border-emerald-500/20 p-8 sm:p-12 text-white shadow-2xl overflow-hidden">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              VERIFIED OPPORTUNITIES PORTAL
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Find Your Next{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Dream Career
              </span>
            </h1>

            <p className="text-emerald-100/80 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
              Explore thousands of verified openings across top tech companies, MNCs, and fast-growing Indian startups.
            </p>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 backdrop-blur-md">
                💼 {pagination.totalJobs > 0 ? `${pagination.totalJobs}+ Active Jobs` : "50,000+ Opportunities"}
              </span>
              <span className="bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 backdrop-blur-md">
                ⚡ Direct HR Responses
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ── Left: Filter Sidebar ─────────────────────────────── */}
          <div className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-24">
            <FilterSidebar categories={categories} initialFilters={currentFilters} />
          </div>

          {/* ── Right: Jobs List ──────────────────────────────────── */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Section Header */}
            <div className="bg-white dark:bg-slate-800 p-4 sm:px-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                  {jobs.length > 0 ? "Recommended Jobs" : "All Jobs"}
                </h2>
                <span className="text-[10px] uppercase font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                  Portal & Live Feed
                </span>
              </div>

              {/* Sort controls */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sort by:</span>
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700">
                  <Link href={getSortLink("latest")}
                    className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all duration-200 ${
                      currentFilters.sort === "latest"
                        ? "bg-emerald-500 text-slate-950 shadow-sm font-extrabold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}>
                    Latest
                  </Link>
                  <Link href={getSortLink("Salary - High to low")}
                    className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all duration-200 ${
                      currentFilters.sort === "Salary - High to low"
                        ? "bg-emerald-500 text-slate-950 shadow-sm font-extrabold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}>
                    Salary
                  </Link>
                </div>
              </div>
            </div>

            {/* Job Cards List */}
            <div className="space-y-4">
              {/* 1. Portal Jobs */}
              {jobs.map((job: any) => <JobCard key={job._id} job={job} />)}

              {/* Pagination */}
              {jobs.length > 0 && pagination.totalPages > 1 && (
                <div className="flex justify-between items-center py-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Page <span className="font-bold text-slate-900 dark:text-white">{pagination.currentPage}</span> of <span className="font-bold text-slate-900 dark:text-white">{pagination.totalPages}</span>
                  </span>
                  <div className="flex gap-2">
                    {pagination.currentPage > 1 ? (
                      <Link href={getPageLink(pagination.currentPage - 1)}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-xs font-bold text-slate-700 dark:text-slate-200">
                        Previous
                      </Link>
                    ) : (
                      <button disabled className="px-4 py-2 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-300 dark:text-slate-600 text-xs font-bold">
                        Previous
                      </button>
                    )}
                    {pagination.currentPage < pagination.totalPages ? (
                      <Link href={getPageLink(pagination.currentPage + 1)}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-xs font-bold text-slate-700 dark:text-slate-200">
                        Next
                      </Link>
                    ) : (
                      <button disabled className="px-4 py-2 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-300 dark:text-slate-600 text-xs font-bold">
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 2. Live Jobs Section */}
              <LiveJobsSection
                initialQuery={liveQuery}
                initialLocation={liveLocation}
              />
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const dynamic = "force-dynamic";
