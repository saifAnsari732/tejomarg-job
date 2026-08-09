import React from "react";
import Link from "next/link";
import {
  ExternalLink, MapPin, Building2, Clock,
  Wifi, AlertCircle, BadgeCheck, Zap, ChevronRight
} from "lucide-react";

interface Props {
  initialQuery?: string;
  initialLocation?: string;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function typeColor(type: string) {
  switch (type) {
    case "FULLTIME": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "PARTTIME": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "CONTRACT": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "INTERN":   return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    default:         return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
  }
}

function typeLabel(type: string) {
  switch (type) {
    case "FULLTIME": return "Full Time";
    case "PARTTIME": return "Part Time";
    case "CONTRACT": return "Contract";
    case "INTERN":   return "Internship";
    default:         return type;
  }
}

function getMockJobs(query: string, location: string) {
  return [
    {
      id: "mock-1",
      title: `${query} – Senior Role`,
      company: "Infosys Ltd",
      companyLogo: null,
      location: `Bangalore, ${location}`,
      type: "FULLTIME",
      isRemote: false,
      salary: "INR 12,00,000 – 18,00,000 / year",
      description: "Work with cutting-edge technologies to build scalable enterprise solutions. You will collaborate with cross-functional teams and deliver high-quality software products.",
      applyUrl: "https://www.infosys.com/careers",
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Mock Data",
    },
    {
      id: "mock-2",
      title: `Junior ${query}`,
      company: "Wipro Technologies",
      companyLogo: null,
      location: `Hyderabad, ${location}`,
      type: "FULLTIME",
      isRemote: false,
      salary: "INR 5,00,000 – 8,00,000 / year",
      description: "Exciting opportunity for freshers and junior professionals. Hands-on experience with modern frameworks and agile development processes.",
      applyUrl: "https://careers.wipro.com",
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Mock Data",
    },
    {
      id: "mock-3",
      title: `Remote ${query}`,
      company: "Razorpay",
      companyLogo: null,
      location: "Remote, India",
      type: "FULLTIME",
      isRemote: true,
      salary: "INR 20,00,000 – 30,00,000 / year",
      description: "Join India's leading fintech startup. Work fully remote and build financial infrastructure used by millions of businesses across India.",
      applyUrl: "https://razorpay.com/jobs",
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Mock Data",
    },
    {
      id: "mock-4",
      title: `${query} Intern`,
      company: "Swiggy",
      companyLogo: null,
      location: "Bangalore, India",
      type: "INTERN",
      isRemote: false,
      salary: "INR 25,000 – 40,000 / month",
      description: "6-month internship program at one of India's top startups. Gain real-world experience in a high-growth engineering team.",
      applyUrl: "https://careers.swiggy.com",
      postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Mock Data",
    },
  ];
}

export default async function LiveJobsSection({ initialQuery = "Developer", initialLocation = "India" }: Props) {
  let jobs: any[] = [];
  let isMock = false;

  try {
    const res = await fetch(
      `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(initialQuery || "jobs")}%20in%20${encodeURIComponent(initialLocation || "India")}&page=1&num_pages=5&date_posted=month`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.JSEARCH_API_KEY || "",
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
        cache: "no-store",
      }
    );
    
    if (res.ok) {
      const raw = await res.json();
      const fetchedJobs = raw.data?.jobs || raw.data || [];
      jobs = fetchedJobs.map((j: any) => ({
        id: j.job_id || j.slug || String(Math.random()),
        title: j.job_title || j.title,
        company: j.employer_name || j.company_name,
        companyLogo: j.employer_logo || j.company_logo || null,
        location: j.job_city ? `${j.job_city}, ${j.job_country}` : (j.location || "Remote"),
        type: j.job_employment_type ? (j.job_employment_type === "FULLTIME" ? "FULLTIME" : "CONTRACT") : "FULLTIME",
        isRemote: j.job_is_remote ?? false,
        salary: j.job_min_salary ? `$${j.job_min_salary}k - $${j.job_max_salary}k` : "Not Disclosed",
        description: (j.job_description || j.description || "").replace(/<[^>]+>/g, '').slice(0, 300) + "…",
        applyUrl: j.job_apply_link || j.url || "#",
        postedAt: j.job_posted_at_datetime_utc || (j.created_at ? new Date(j.created_at * 1000).toISOString() : null),
        source: "Indeed/LinkedIn (JSearch)",
      })).slice(0, 50);
    } else {
      isMock = true;
    }
  } catch (err) {
    isMock = true;
  }

  // Fallback to mock data if JSearch fails or API key is missing
  if (isMock || jobs.length === 0) {
    isMock = true;
    jobs = getMockJobs(initialQuery, initialLocation);
  }

  return (
    <div className="w-full">
      {/* Error State */}

      
      {/* No Jobs State */}
      {!isMock && jobs.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8 text-center shadow-sm">
           <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-3" />
           <h3 className="font-bold text-slate-700 dark:text-slate-300">No live jobs found</h3>
           <p className="text-sm text-slate-500 mt-1">Try adjusting your filters.</p>
        </div>
      )}

      {/* Job Cards */}
      {jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job: any) => (
            <div key={job.id}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 sm:p-6 relative overflow-hidden">
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 min-w-0">
                  {/* Logo */}
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 z-10">
                    <div className="w-14 h-14 rounded-xl border border-slate-100 p-2 flex items-center justify-center bg-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="w-7 h-7 text-indigo-200" />
                      )}
                    </div>
                  </a>

                  {/* Info */}
                  <div className="min-w-0 z-10">
                    <Link href={`/jobs/live/${job.id}`}>
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                    </Link>
                    <div className="text-sm font-semibold text-slate-500 mt-1.5 flex items-center gap-2 flex-wrap">
                      <span className="text-slate-700">{job.company}</span>
                      {job.source !== "Mock Data" && (
                        <span title="Verified">
                          <BadgeCheck className="w-4 h-4 text-indigo-500" />
                        </span>
                      )}
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center text-slate-500">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Apply Button (Desktop) */}
                <div className="hidden sm:flex shrink-0 items-center z-10">
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-blue-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-md transition-all duration-300">
                    Apply <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Tags & Salary */}
              <div className="flex flex-wrap items-center gap-2 mt-5 z-10 relative">
                <span className="px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100/50 shadow-sm">
                  {typeLabel(job.type)}
                </span>
                {job.isRemote && (
                  <span className="px-3 py-1.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100/50 shadow-sm flex items-center">
                    <Wifi className="w-3 h-3 mr-1" /> Remote
                  </span>
                )}
                {job.salary !== "Not Disclosed" && (
                  <span className="px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100/50 shadow-sm flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {job.salary}
                  </span>
                )}
              </div>

              {/* Description Snippet */}
              <p className="mt-4 text-sm text-slate-500 leading-relaxed line-clamp-2">
                {job.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 z-10 relative">
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {timeAgo(job.postedAt)}
                  </span>
                  <span className="uppercase tracking-wider">{job.source}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                    className="sm:hidden text-indigo-600 font-bold text-sm">
                    Apply
                  </a>
                  <Link href={`/jobs/live/${job.id}`}
                    className="text-sm font-bold text-slate-600 hover:text-indigo-600 flex items-center transition-colors">
                    View Details <ChevronRight className="w-4 h-4 ml-0.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
