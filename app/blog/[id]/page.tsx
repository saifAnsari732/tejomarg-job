"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Share2, Sparkles, CheckCircle2, Bookmark, BookOpen, ChevronRight } from "lucide-react";
import { sampleBlogPosts } from "../page";

export default function BlogDetailPage() {
  const params = useParams();
  const postId = params.id as string;

  const post = sampleBlogPosts.find(p => p.id === postId) || sampleBlogPosts[0];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:border-emerald-400 transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>
          <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
            {post.category}
          </span>
        </div>

        {/* Article Header */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
            <span>•</span>
            <span>Published on {post.date}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {post.title}
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400" />
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{post.author.name}</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{post.author.role}</p>
              </div>
            </div>

            <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-600 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Article Image Banner */}
        <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Main Body Content */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
          
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-2">1. Understanding How ATS Parsers Analyze Resumes</h2>
          <p>
            Applicant Tracking Systems (ATS) scan submitted resumes by parsing plain text into structured fields: Contact Information, Work Experience, Education, and Skills. If your resume uses complex multi-column tables or non-standard graphics, essential details might be silently dropped before an HR manager ever opens your profile.
          </p>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-5 rounded-2xl text-xs sm:text-sm text-emerald-900 dark:text-emerald-300 font-semibold space-y-2">
            <p className="font-black uppercase tracking-wider flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" /> Pro Tip:
            </p>
            <p>
              Use clean single or structured two-column layouts, standard section headings (Work Experience, Skills, Education), and export as standard PDF/Word formats to maintain 100% parsing accuracy.
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-4">2. Aligning Keywords with Job Descriptions</h2>
          <p>
            Review the targeted job description carefully. Extract primary technical skills (e.g., <em>Next.js, Redux, Tailwind CSS, REST APIs</em>) and weave them naturally into your experience bullet points with quantifiable impact metrics.
          </p>

          <ul className="space-y-3 font-semibold text-slate-800 dark:text-slate-200">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Quantify accomplishments: Use numbers, percentages, and performance boosts (e.g., "Improved page load speed by 40%").</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Tailor job titles: Ensure your past role titles align with standard industry terminology.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Run AI Resume Checks: Use Tejomarg's AI Resume Checker to verify your keyword match index before applying.</span>
            </li>
          </ul>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <Link
              href="/resume-tools/resume-checker"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition-all"
            >
              Test Your Resume with AI Checker <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
