import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query      = searchParams.get("query")      || "Software Developer";
  const location   = searchParams.get("location")   || "India";
  const page       = searchParams.get("page")        || "1";
  const datePosted = searchParams.get("datePosted")  || "month";
  const empType    = searchParams.get("empType")     || "";

  const apiKey = process.env.JSEARCH_API_KEY;

  // ── Mock fallback when key is absent or placeholder ──────────────────────
  if (!apiKey || apiKey === "your_rapidapi_key_here") {
    return NextResponse.json({
      status: "mock",
      total: 8,
      jobs: getMockJobs(query, location),
    });
  }

  try {
    // Using Remotive for ultra-fast response (~300ms)
    const res = await fetch(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=15`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({
        status: "mock",
        total: 8,
        jobs: getMockJobs(query, location),
      });
    }

    const raw = await res.json();
    let jobs = (raw.jobs || []).map(normalizeRemotiveJob);
    
    // Limit to 10
    jobs = jobs.slice(0, 10);

    return NextResponse.json({
      status: "live",
      total: jobs.length,
      jobs: jobs.length > 0 ? jobs : getMockJobs(query, location),
    });
  } catch (err: any) {
    console.error("Remotive fetch error:", err);
    return NextResponse.json({
      status: "mock",
      total: 8,
      jobs: getMockJobs(query, location),
    });
  }
}

// ── Normalizer: map Remotive response shape to our UI shape ────────────────
function normalizeRemotiveJob(j: any) {
  return {
    id:            String(j.id),
    title:         j.title,
    company:       j.company_name,
    companyLogo:   j.company_logo || null,
    location:      j.candidate_required_location || "Remote",
    type:          "FULLTIME",
    isRemote:      true,
    salary:        j.salary || "Not Disclosed",
    description:   (j.description || "").replace(/<[^>]+>/g, '').slice(0, 300) + "…",
    applyUrl:      j.url,
    postedAt:      j.publication_date || null,
    source:        "Remotive",
  };
}

// ── Normalizer: map JSearch response shape to our UI shape ────────────────
function normalizeJob(j: any) {
  return {
    id:            j.job_id,
    title:         j.job_title,
    company:       j.employer_name,
    companyLogo:   j.employer_logo || null,
    location:      j.job_city
                     ? `${j.job_city}, ${j.job_country}`
                     : j.job_country || "Remote",
    type:          j.job_employment_type || "FULLTIME",
    isRemote:      j.job_is_remote ?? false,
    salary:        formatSalary(j),
    description:   j.job_description?.slice(0, 300) + "…" || "",
    applyUrl:      j.job_apply_link,
    postedAt:      j.job_posted_at_datetime_utc || null,
    source:        j.job_publisher || "Indeed",
  };
}

function formatSalary(j: any): string {
  if (!j.job_min_salary && !j.job_max_salary) return "Not Disclosed";
  const currency = j.job_salary_currency || "USD";
  const period   = j.job_salary_period || "YEAR";
  const min = j.job_min_salary ? `${currency} ${Number(j.job_min_salary).toLocaleString()}` : "";
  const max = j.job_max_salary ? `${currency} ${Number(j.job_max_salary).toLocaleString()}` : "";
  const range = [min, max].filter(Boolean).join(" – ");
  return `${range} / ${period.toLowerCase()}`;
}

// ── Mock data (shown when API key is not configured) ──────────────────────
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
    {
      id: "mock-5",
      title: `Lead ${query}`,
      company: "Tata Consultancy Services",
      companyLogo: null,
      location: "Mumbai, India",
      type: "FULLTIME",
      isRemote: false,
      salary: "INR 22,00,000 – 32,00,000 / year",
      description: "Lead engineering teams at TCS. Manage architecture decisions, mentor junior engineers, and deliver mission-critical solutions for global clients.",
      applyUrl: "https://careers.tcs.com",
      postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Mock Data",
    },
    {
      id: "mock-6",
      title: `Contract ${query}`,
      company: "Accenture India",
      companyLogo: null,
      location: "Pune, India",
      type: "CONTRACT",
      isRemote: true,
      salary: "INR 60,000 – 90,000 / month",
      description: "6-month contract engagement with possible extension. Work with Fortune 500 clients on digital transformation initiatives.",
      applyUrl: "https://www.accenture.com/in-en/careers",
      postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Mock Data",
    },
    {
      id: "mock-7",
      title: `${query} – Startup`,
      company: "Zepto",
      companyLogo: null,
      location: "Mumbai, India",
      type: "FULLTIME",
      isRemote: false,
      salary: "INR 15,00,000 – 25,00,000 / year",
      description: "Fast-paced environment at a unicorn startup. Build systems that handle millions of daily orders across 10-minute grocery delivery.",
      applyUrl: "https://www.zepto.com/careers",
      postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Mock Data",
    },
    {
      id: "mock-8",
      title: `Part-time ${query}`,
      company: "Meesho",
      companyLogo: null,
      location: "Bangalore, India",
      type: "PARTTIME",
      isRemote: true,
      salary: "INR 30,000 – 50,000 / month",
      description: "Part-time remote role with flexible hours. Contribute to Meesho's social commerce platform and help empower millions of entrepreneurs.",
      applyUrl: "https://meesho.io/jobs",
      postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Mock Data",
    },
  ];
}
