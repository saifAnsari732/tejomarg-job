import React from "react";
import Link from "next/link";
import dbConnect from "@/lib/dbConnect";
import Job from "@/models/Job";
import Company from "@/models/Company";
import Category from "@/models/Category";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FilterSidebar from "@/components/jobs/FilterSidebar";
import JobCard from "@/components/jobs/JobCard";
import RightWidgets from "@/components/jobs/RightWidgets";
import LiveJobsSection from "@/components/jobs/LiveJobsSection";
import { ChevronLeft, ChevronRight, Inbox, Zap, Database } from "lucide-react";

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
    await dbConnect();
    // Force-register Company schema so Job.populate("companyId") works
    void Company;
    const categories = await Category.find({}).lean();
    const query: any = { status: "active" };

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
        { skillsRequired: { $regex: filters.search, $options: "i" } },
      ];
    }
    if (filters.location) query.location = { $regex: filters.location, $options: "i" };

    const deptFilters: string[] = [];
    if (filters.category)   deptFilters.push(...filters.category.split(","));
    if (filters.department) deptFilters.push(...filters.department.split(","));
    if (deptFilters.length > 0) query.category = { $in: deptFilters };

    const typeFilters: string[] = [];
    if (filters.jobType)  typeFilters.push(...filters.jobType.split(","));
    if (filters.workType) typeFilters.push(...filters.workType.split(","));
    const mappedTypes = typeFilters.map(t =>
      t === "Full time" ? "Full-time" : t === "Part time" ? "Part-time" : t
    );
    if (mappedTypes.length > 0) query.jobType = { $in: mappedTypes };

    if (filters.workMode) {
      const modes = filters.workMode.split(",");
      if (modes.includes("Work from home")) {
        if (!query.jobType) query.jobType = {};
        query.jobType.$in = [...(query.jobType.$in || []), "Remote"];
      }
    }

    if (filters.experience) {
      const exp = parseInt(filters.experience);
      if (!isNaN(exp)) query.experienceYears = { $lte: exp };
    }
    if (filters.minSalary) {
      const sal = parseInt(filters.minSalary);
      if (!isNaN(sal) && sal > 0) query.salaryMax = { $gte: sal };
    }
    if (filters.education)    query.highestEducation = { $in: filters.education.split(",") };
    if (filters.workShift)    query.workShift        = { $in: filters.workShift.split(",") };
    if (filters.englishLevel) query.englishLevel     = { $in: filters.englishLevel.split(",") };
    if (filters.gender)       query.genderPreference = { $in: filters.gender.split(",") };

    if (filters.datePosted && filters.datePosted !== "All") {
      const now = new Date();
      const pastDate = new Date();
      if (filters.datePosted === "Last 24 hours") pastDate.setDate(now.getDate() - 1);
      else if (filters.datePosted === "Last 3 days") pastDate.setDate(now.getDate() - 3);
      else if (filters.datePosted === "Last 7 days") pastDate.setDate(now.getDate() - 7);
      query.createdAt = { $gte: pastDate };
    }

    let sortOptions: any = { createdAt: -1 };
    if (filters.sort === "Salary - High to low") sortOptions = { salaryMax: -1 };

    const page  = parseInt(filters.page || "1");
    const limit = 10;
    const skip  = (page - 1) * limit;

    const totalJobs = await Job.countDocuments(query);
    const rawJobs   = await Job.find(query).sort(sortOptions).skip(skip).limit(limit).populate("companyId").lean();
    const jobs      = JSON.parse(JSON.stringify(rawJobs));
    const totalPages = Math.ceil(totalJobs / limit) || 1;

    return {
      categories: JSON.parse(JSON.stringify(categories)),
      jobs,
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
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 bg-slate-50/50">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── Left: Filter Sidebar ─────────────────────────────── */}
          <div className="lg:col-span-3">
            <FilterSidebar categories={categories} initialFilters={currentFilters} />
          </div>

          {/* ── Center: Both sections stacked ───────────────────── */}
          <div className="lg:col-span-6 space-y-8">

            {/* ═══════════════════════════════════════════════════
                SECTION 1 — PORTAL JOBS (MongoDB)
            ═══════════════════════════════════════════════════ */}
            <div className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-900 dark:bg-slate-700">
                    <Database className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Portal Jobs
                  </h2>
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                    {pagination.totalJobs} found
                  </span>
                </div>

                {/* Sort controls */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Sort:</span>
                  <div className="flex rounded-xl bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 gap-0.5">
                    <Link href={getSortLink("latest")}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        currentFilters.sort === "latest"
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}>
                      Latest
                    </Link>
                    <Link href={getSortLink("salary-desc")}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        currentFilters.sort === "salary-desc"
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}>
                      High Salary
                    </Link>
                  </div>
                </div>
              </div>

              {/* Portal Job Cards */}
              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job: any) => <JobCard key={job._id} job={job} />)}

                  {pagination.totalPages > 1 && (
                    <div className="flex justify-between items-center bg-white dark:bg-slate-800 px-5 py-3.5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                      <span className="text-xs text-slate-500">
                        Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong>
                      </span>
                      <div className="flex gap-2">
                        {pagination.currentPage > 1 ? (
                          <Link href={getPageLink(pagination.currentPage - 1)}
                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                            <ChevronLeft className="h-4 w-4 text-slate-500" />
                          </Link>
                        ) : (
                          <button disabled className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl opacity-40">
                            <ChevronLeft className="h-4 w-4 text-slate-300" />
                          </button>
                        )}
                        {pagination.currentPage < pagination.totalPages ? (
                          <Link href={getPageLink(pagination.currentPage + 1)}
                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                            <ChevronRight className="h-4 w-4 text-slate-500" />
                          </Link>
                        ) : (
                          <button disabled className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl opacity-40">
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 py-10 px-6 text-center">
                  <Inbox className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-3">No portal jobs found</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    No employer has posted jobs matching these filters yet. Check live listings below.
                  </p>
                  <Link href="/jobs"
                    className="inline-flex mt-4 px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-colors">
                    Clear Filters
                  </Link>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center">
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-sm shadow-blue-500/20">
                  <Zap className="h-3 w-3" />
                  Live Jobs from Indeed · LinkedIn · Glassdoor
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════
                SECTION 2 — LIVE JOBS (JSearch / Indeed)
            ═══════════════════════════════════════════════════ */}
            <div className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-600">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Live Jobs
                </h2>
                <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">
                  Real-time · Indeed
                </span>
              </div>

              <LiveJobsSection
                initialQuery={liveQuery}
                initialLocation={liveLocation}
              />
            </div>

          </div>

          {/* ── Right: Widgets ───────────────────────────────────── */}
          <div className="lg:col-span-3">
            <RightWidgets />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const dynamic = "force-dynamic";
