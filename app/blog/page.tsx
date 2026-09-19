"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, BookOpen, Clock, User, Sparkles, ChevronRight, 
  ArrowLeft, Tag, Flame, CheckCircle2, Share2, TrendingUp, Filter
} from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: "Resume Tips" | "Interview Hacks" | "Career Growth" | "AI Tools";
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  featured?: boolean;
}

export const sampleBlogPosts: BlogPost[] = [
  {
    id: "how-to-beat-ats-resume-scanner",
    title: "10 Proven Strategies to Beat ATS Resume Scanners in 2026",
    excerpt: "Learn how Applicant Tracking Systems parse your CV and how to format your skills and experience to guarantee top ranking for HR screeners.",
    category: "Resume Tips",
    readTime: "5 min read",
    date: "Sep 15, 2026",
    author: {
      name: "Priya Sharma",
      role: "Lead Talent Strategist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
    },
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop",
    featured: true
  },
  {
    id: "master-ai-mock-interviews",
    title: "How to Ace Tech Interviews Using AI Mock Practice",
    excerpt: "Discover how practicing with AI interview coaches can help you build confidence, refine system design answers, and score 95%+ in technical rounds.",
    category: "Interview Hacks",
    readTime: "7 min read",
    date: "Sep 12, 2026",
    author: {
      name: "Rahul Verma",
      role: "Senior Engineering Manager",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
    },
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
    featured: true
  },
  {
    id: "high-paying-tech-skills-india",
    title: "Top 7 High-Paying Tech Skills in Demand Across India",
    excerpt: "From Next.js and AI Prompt Engineering to Cloud Security, explore the most lucrative tech domains hiring in Bangalore, Mumbai, and NCR.",
    category: "Career Growth",
    readTime: "6 min read",
    date: "Sep 10, 2026",
    author: {
      name: "Amit Patel",
      role: "Career Advisor",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop"
    },
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop"
  },
  {
    id: "write-effective-cover-letter",
    title: "The Ultimate Guide to Writing AI-Assisted Cover Letters",
    excerpt: "Stop sending generic cover letters. Learn how tailored letters customized to job descriptions double your interview callback rates.",
    category: "AI Tools",
    readTime: "4 min read",
    date: "Sep 08, 2026",
    author: {
      name: "Shiwangi Singla",
      role: "Tech Recruiter",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop"
    },
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop"
  },
  {
    id: "salary-negotiation-guide-freshers",
    title: "Salary Negotiation 101: How Freshers Can Negotiate Higher Pay",
    excerpt: "Essential tips and script templates for discussing compensation, ESOPs, and joining bonuses with HR managers respectfully.",
    category: "Career Growth",
    readTime: "5 min read",
    date: "Sep 05, 2026",
    author: {
      name: "Vikash Singh",
      role: "HR Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop"
  },
  {
    id: "remote-job-search-tactics",
    title: "How to Land High-Paying Remote Global Jobs from India",
    excerpt: "Step-by-step framework to find asynchronous remote roles in US, European, and SEA startups with USD/Euro pay packages.",
    category: "Interview Hacks",
    readTime: "8 min read",
    date: "Sep 01, 2026",
    author: {
      name: "Priya Sharma",
      role: "Lead Talent Strategist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
    },
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
  }
];

export default function BlogHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Resume Tips", "Interview Hacks", "Career Growth", "AI Tools"];

  const filteredPosts = sampleBlogPosts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = sampleBlogPosts.filter(p => p.featured);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Hero Section */}
        <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 border border-emerald-500/20 rounded-[2.5rem] p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-3xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              TEJOMARG CAREER & AI BLOG
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Actionable Advice to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Accelerate Your Career
              </span>
            </h1>

            <p className="text-emerald-100/80 text-base sm:text-lg font-medium leading-relaxed">
              Expert resume guides, interview breakdown strategies, salary negotiation insights, and AI tools to land your dream job faster.
            </p>

            {/* Search Input Bar */}
            <div className="relative max-w-xl pt-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles on ATS, resumes, interviews..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm font-semibold backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Featured Posts Carousel/Banner */}
        {activeCategory === "All" && !searchQuery && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-extrabold tracking-tight">Featured Guides</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group relative bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-60 w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full object-cover border border-emerald-400" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{post.author.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{post.author.role}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Article <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6 border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-emerald-500 text-slate-950 shadow-md scale-105"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            Showing {filteredPosts.length} Articles
          </span>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-emerald-400 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-700/60 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={post.author.avatar} alt={post.author.name} className="w-7 h-7 rounded-full object-cover border border-emerald-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{post.author.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No articles found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search query or selecting a different category.</p>
          </div>
        )}

        {/* Newsletter Subscription Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 sm:p-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">Get Weekly Career Insights</h3>
            <p className="text-xs sm:text-sm font-semibold opacity-90">Subscribe to receive fresh resume templates, interview questions, and tech job trends.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="px-4 py-3 rounded-2xl bg-white text-slate-900 text-xs font-bold placeholder-slate-400 focus:outline-none w-full md:w-64 shadow-md"
            />
            <button className="px-6 py-3 bg-slate-950 text-white font-extrabold text-xs rounded-2xl shadow-xl hover:bg-slate-900 transition-all shrink-0">
              Subscribe
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
