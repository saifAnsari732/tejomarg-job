import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const apiKey = process.env.JSEARCH_API_KEY;

  // ── Mock job detail fallback ─────────────────────────────────────────────
  if (!apiKey || apiKey === "your_rapidapi_key_here" || id.startsWith("mock-")) {
    return NextResponse.json({ status: "mock", job: getMockDetail(id) });
  }

  try {
    const res = await fetch(
      `https://jsearch.p.rapidapi.com/job-details?job_id=${encodeURIComponent(id)}&country=IN`,
      {
        headers: {
          "X-RapidAPI-Key":  apiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("JSearch job-details error:", res.status, err);
      return NextResponse.json({ status: "mock", job: getMockDetail(id) });
    }

    const raw = await res.json();
    const j   = raw.data?.[0];

    if (!j) {
      return NextResponse.json({ status: "mock", job: getMockDetail(id) });
    }

    return NextResponse.json({
      status: "live",
      job: {
        id:              j.job_id,
        title:           j.job_title,
        company:         j.employer_name,
        companyLogo:     j.employer_logo || null,
        companyWebsite:  j.employer_website || null,
        location:        j.job_city ? `${j.job_city}, ${j.job_country}` : j.job_country || "Remote",
        type:            j.job_employment_type || "FULLTIME",
        isRemote:        j.job_is_remote ?? false,
        salary:          formatSalary(j),
        description:     j.job_description || "",
        highlights:      j.job_highlights || {},
        applyUrl:        j.job_apply_link,
        postedAt:        j.job_posted_at_datetime_utc || null,
        expiresAt:       j.job_offer_expiration_datetime_utc || null,
        source:          j.job_publisher || "Indeed",
        requiredExperience: j.job_required_experience || {},
        requiredEducation:  j.job_required_education  || {},
        requiredSkills:     j.job_required_skills     || [],
        benefits:           j.job_benefits            || null,
        googleJobsUrl:      j.job_google_link         || null,
      },
    });
  } catch (err: any) {
    console.error("JSearch job-details fetch error:", err);
    return NextResponse.json({ status: "mock", job: getMockDetail(id) });
  }
}

function formatSalary(j: any): string {
  if (!j.job_min_salary && !j.job_max_salary) return "Not Disclosed";
  const currency = j.job_salary_currency || "USD";
  const period   = j.job_salary_period   || "YEAR";
  const min = j.job_min_salary ? `${currency} ${Number(j.job_min_salary).toLocaleString()}` : "";
  const max = j.job_max_salary ? `${currency} ${Number(j.job_max_salary).toLocaleString()}` : "";
  return `${[min, max].filter(Boolean).join(" – ")} / ${period.toLowerCase()}`;
}

function getMockDetail(id: string) {
  const mockDetails: Record<string, any> = {
    "mock-1": {
      id: "mock-1", title: "Software Developer – Senior Role", company: "Infosys Ltd",
      companyLogo: null, companyWebsite: "https://www.infosys.com",
      location: "Bangalore, India", type: "FULLTIME", isRemote: false,
      salary: "INR 12,00,000 – 18,00,000 / year",
      description: `We are looking for a Senior Software Developer to join our growing engineering team at Infosys Ltd.

As a Senior Developer, you will work closely with cross-functional teams to design, develop, and maintain high-quality software applications. You will be involved in all stages of the software development lifecycle — from initial requirements gathering through to deployment and ongoing support.

Your primary responsibilities will include architecting scalable backend services, building responsive frontend interfaces, writing clean and maintainable code, and mentoring junior developers.

We value engineers who are curious, collaborative, and committed to continuous learning. If you thrive in fast-paced environments and enjoy solving complex problems, we'd love to hear from you.`,
      highlights: {
        Qualifications: ["Bachelor's degree in Computer Science or related field", "5+ years of software development experience", "Strong proficiency in Java, Python, or Node.js", "Experience with cloud platforms (AWS, Azure, or GCP)", "Familiarity with microservices architecture"],
        Responsibilities: ["Design and develop scalable software solutions", "Collaborate with product and design teams to define features", "Review code and mentor junior developers", "Write unit and integration tests", "Participate in agile ceremonies"],
        Benefits: ["Competitive salary", "Health insurance", "Annual bonus", "Remote work flexibility", "Learning & development budget"],
      },
      applyUrl: "https://www.infosys.com/careers", postedAt: new Date(Date.now() - 2*86400000).toISOString(),
      requiredSkills: ["Java", "Spring Boot", "Microservices", "AWS", "Docker", "Kubernetes"],
      source: "Mock Data",
    },
    "mock-2": {
      id: "mock-2", title: "Junior Software Developer", company: "Wipro Technologies",
      companyLogo: null, companyWebsite: "https://careers.wipro.com",
      location: "Hyderabad, India", type: "FULLTIME", isRemote: false,
      salary: "INR 5,00,000 – 8,00,000 / year",
      description: `Wipro Technologies is seeking a motivated Junior Software Developer to join our dynamic team in Hyderabad.

This is an excellent opportunity for fresh graduates and junior professionals to kickstart their careers in software engineering. You will work alongside experienced engineers and gain hands-on exposure to modern frameworks, development tools, and agile methodologies.

You will contribute to building and maintaining web applications, participate in code reviews, and develop your skills in a supportive and collaborative environment. We provide structured onboarding, mentoring, and a clear path for career growth.`,
      highlights: {
        Qualifications: ["B.E/B.Tech in Computer Science, IT, or related field", "0-2 years of experience", "Knowledge of any one programming language (Java, Python, JavaScript)", "Basic understanding of databases and SQL"],
        Responsibilities: ["Develop and maintain web application features", "Write clean, well-documented code", "Participate in daily standups and sprint planning", "Learn and adapt to new technologies quickly"],
        Benefits: ["Medical insurance", "Performance bonus", "Training programs", "Flexible working hours"],
      },
      applyUrl: "https://careers.wipro.com", postedAt: new Date(Date.now() - 1*86400000).toISOString(),
      requiredSkills: ["JavaScript", "HTML", "CSS", "SQL", "Git"],
      source: "Mock Data",
    },
    "mock-3": {
      id: "mock-3", title: "Remote Software Developer", company: "Razorpay",
      companyLogo: null, companyWebsite: "https://razorpay.com/jobs",
      location: "Remote, India", type: "FULLTIME", isRemote: true,
      salary: "INR 20,00,000 – 30,00,000 / year",
      description: `Razorpay is India's leading payment gateway and financial services company, trusted by over 8 million businesses. We are looking for talented Remote Software Developers to join our engineering team.

At Razorpay, you will work on financial infrastructure that processes billions of rupees in transactions every month. Our engineering culture values ownership, speed, and high-quality code.

As a remote engineer, you'll collaborate with distributed teams across India, attend virtual standups, and contribute to one of India's most impactful fintech products. We offer a fully remote work setup with flexible hours.`,
      highlights: {
        Qualifications: ["3+ years of software development experience", "Strong knowledge of React, Node.js, or Go", "Experience with payment systems is a plus", "Excellent communication skills for remote collaboration"],
        Responsibilities: ["Build and maintain payment processing APIs", "Optimize for performance at scale", "Work with product managers to define technical requirements", "Participate in on-call rotations"],
        Benefits: ["Fully remote work", "Stock options (ESOPs)", "Health & wellness benefits", "Home office allowance", "Unlimited PTO policy"],
      },
      applyUrl: "https://razorpay.com/jobs", postedAt: new Date(Date.now() - 3*86400000).toISOString(),
      requiredSkills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Redis", "Kafka"],
      source: "Mock Data",
    },
  };

  return mockDetails[id] || {
    id, title: "Software Developer", company: "Tech Company",
    companyLogo: null, companyWebsite: null,
    location: "India", type: "FULLTIME", isRemote: false,
    salary: "Not Disclosed",
    description: "Exciting opportunity to work with a leading technology company. Join a passionate team building innovative solutions.",
    highlights: {
      Qualifications: ["Bachelor's degree in relevant field", "2+ years of experience"],
      Responsibilities: ["Develop software solutions", "Collaborate with team members", "Write clean code"],
      Benefits: ["Competitive salary", "Health insurance"],
    },
    applyUrl: "#", postedAt: new Date().toISOString(),
    requiredSkills: ["Programming", "Problem Solving", "Communication"],
    source: "Mock Data",
  };
}
