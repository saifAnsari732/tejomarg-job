import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Company from "@/models/Company";
import Job from "@/models/Job";
import Category from "@/models/Category";
import Application from "@/models/Application";

export async function GET() {
  try {
    await dbConnect();

    // 1. Clear database
    await User.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Category.deleteMany({});
    await Application.deleteMany({});

    // 2. Hash passwords
    const hashedPassword = await bcrypt.hash("password123", 12);

    // 3. Create Users
    const admin = await User.create({
      name: "Platform Admin",
      email: "admin@tejomarg.com",
      password: hashedPassword,
      role: "admin",
    });

    const employer1 = await User.create({
      name: "Alice Johnson",
      email: "employer@tejomarg.com",
      password: hashedPassword,
      role: "employer",
    });

    const employer2 = await User.create({
      name: "Bob Smith",
      email: "google_recruiter@tejomarg.com",
      password: hashedPassword,
      role: "employer",
    });

    const candidate = await User.create({
      name: "Jane Doe",
      email: "candidate@tejomarg.com",
      password: hashedPassword,
      role: "candidate",
      candidateProfile: {
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
        experience: [
          {
            company: "Tech Solutions Inc.",
            role: "Frontend Developer",
            duration: "Jun 2022 - Present",
            description: "Developed and maintained React dashboards, optimized page loading speeds by 40%.",
          },
        ],
        education: [
          {
            school: "State Engineering College",
            degree: "Bachelor of Technology in Computer Science",
            year: "2022",
          },
        ],
        resumeUrl: "/uploads/mock-resume.pdf",
        avatarUrl: "",
        expectedSalary: 85000,
        preferredLocation: "Remote",
      },
    });

    // 4. Create Companies
    const company1 = await Company.create({
      employerId: employer1._id,
      name: "Acme Corporation",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=80",
      description: "Acme Corporation is a leading provider of innovative hardware and software systems.",
      website: "https://acme.example.com",
      industry: "Information Technology",
      location: "San Francisco, CA (Hybrid)",
      isVerified: true,
    });

    const company2 = await Company.create({
      employerId: employer2._id,
      name: "Google Recruits",
      logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&h=150&fit=crop&q=80",
      description: "Google Recruits is a premier technology agency hiring for top tech leaders.",
      website: "https://google.com",
      industry: "Technology Services",
      location: "Mountain View, CA (Remote)",
      isVerified: true,
    });

    // 5. Create Categories
    const categories = await Category.insertMany([
      { name: "Software Development", slug: "software-development", icon: "Laptop" },
      { name: "UI/UX Design", slug: "design", icon: "Palette" },
      { name: "Marketing & Sales", slug: "marketing", icon: "Megaphone" },
      { name: "Finance & Accounting", slug: "finance", icon: "Coins" },
      { name: "Customer Support", slug: "support", icon: "Headphones" },
      { name: "Human Resources", slug: "hr", icon: "Users" },
    ]);

    // 6. Create Jobs
    const jobs = await Job.insertMany([
      {
        employerId: employer1._id,
        companyId: company1._id,
        title: "Senior Full-Stack Engineer (Next.js & Node)",
        description: "We are looking for a Senior Full-Stack Engineer experienced in building fast, scalable applications using Next.js 14/15, Tailwind, and Node.js. You will lead a small team of engineers and work closely with product managers to deliver features.",
        skillsRequired: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
        salaryMin: 90000,
        salaryMax: 130000,
        jobType: "Remote",
        location: "Remote (USA/Canada)",
        experienceLevel: "Senior",
        openings: 2,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: "active",
        category: "software-development",
      },
      {
        employerId: employer1._id,
        companyId: company1._id,
        title: "Frontend UI Developer (React)",
        description: "Join our design system team to craft beautiful, responsive component libraries using React, Radix, and Tailwind CSS. Attention to detail and knowledge of web accessibility standards are key.",
        skillsRequired: ["React", "TypeScript", "Tailwind CSS", "Figma"],
        salaryMin: 60000,
        salaryMax: 85000,
        jobType: "Full-time",
        location: "San Francisco, CA",
        experienceLevel: "Mid-level",
        openings: 1,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        status: "active",
        category: "software-development",
      },
      {
        employerId: employer2._id,
        companyId: company2._id,
        title: "Lead Product Designer",
        description: "Google Recruits is hiring a Lead Product Designer to guide the user experience design of our next-gen cloud portal. You will create user flows, wireframes, and high-fidelity mockups.",
        skillsRequired: ["Figma", "UI/UX Design", "Wireframing", "Prototyping"],
        salaryMin: 110000,
        salaryMax: 150000,
        jobType: "Remote",
        location: "Remote (Global)",
        experienceLevel: "Senior",
        openings: 1,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: "active",
        category: "design",
      },
      {
        employerId: employer1._id,
        companyId: company1._id,
        title: "Digital Marketing Specialist",
        description: "We are seeking a Digital Marketing Specialist to manage SEO, SEM, and social media campaigns. Ideal candidate has a track record of driving organic growth.",
        skillsRequired: ["SEO", "Google Analytics", "Content Writing", "Copywriting"],
        salaryMin: 50000,
        salaryMax: 70000,
        jobType: "Full-time",
        location: "Austin, TX (Hybrid)",
        experienceLevel: "Mid-level",
        openings: 1,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: "pending", // Admin needs to approve
        category: "marketing",
      },
    ]);

    // 7. Create Application
    await Application.create({
      jobId: jobs[0]._id,
      candidateId: candidate._id,
      resumeUrl: "/uploads/mock-resume.pdf",
      coverLetter: "I would love to apply for the Senior Full-Stack role. I have extensive experience with Next.js and MongoDB.",
      status: "applied",
    });

    return NextResponse.json({
      message: "Database seeded successfully!",
      accounts: {
        admin: "admin@tejomarg.com (password123)",
        employer: "employer@tejomarg.com (password123)",
        candidate: "candidate@tejomarg.com (password123)",
      },
      stats: {
        categories: categories.length,
        jobs: jobs.length,
        users: 4,
        companies: 2,
      },
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
