import Link from "next/link";
import { Briefcase, Globe, ChevronDown } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-600 py-20 border-t border-slate-200 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-1/2 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src="/job1.png" alt="Tejomarg Icon" className="h-12 w-auto object-contain shrink-0" />
              <img src="/job2.png" alt="Tejomarg Text" className="h-40 -my-16 -ml-8 w-auto object-contain shrink-0 mix-blend-multiply pointer-events-none" />
            </div>
            <p className="text-base text-slate-500 pr-4 leading-relaxed font-medium">
              India's #1 Job Platform. Connecting talent with the best opportunities across the nation with AI-powered precision.
            </p>
          </div>

          {/* Candidates */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-6 tracking-wide">For Candidates</h3>
            <ul className="space-y-4 text-base text-slate-500 font-medium">
              <li><Link href="/jobs" className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronDown className="h-4 w-4 -rotate-90 text-blue-400" /> Browse Jobs</Link></li>
              <li><Link href="/resume-tools/job-prep" className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronDown className="h-4 w-4 -rotate-90 text-blue-400" /> Job Prep <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded-full ml-1">NEW</span></Link></li>
              <li><Link href="/resume-tools/resume-builder" className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronDown className="h-4 w-4 -rotate-90 text-blue-400" /> Resume Builder</Link></li>
              <li><Link href="/candidate" className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronDown className="h-4 w-4 -rotate-90 text-blue-400" /> Candidate Dashboard</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-6 tracking-wide">For Employers</h3>
            <ul className="space-y-4 text-base text-slate-500 font-medium">
              <li><Link href="/employer/post-job" className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronDown className="h-4 w-4 -rotate-90 text-blue-400" /> Post a Job</Link></li>
              <li><Link href="/employer" className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronDown className="h-4 w-4 -rotate-90 text-blue-400" /> Employer Dashboard</Link></li>
              <li><Link href="/pricing" prefetch={false} className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronDown className="h-4 w-4 -rotate-90 text-blue-400" /> Pricing Plans</Link></li>
              <li><Link href="/employer-guidelines" prefetch={false} className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronDown className="h-4 w-4 -rotate-90 text-blue-400" /> Hiring Guidelines</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-6 tracking-wide">Company</h3>
            <ul className="space-y-4 text-base text-slate-500 font-medium">
              <li><Link href="/about" prefetch={false} className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronDown className="h-4 w-4 -rotate-90 text-blue-400" /> About Us</Link></li>
              <li><Link href="/contact" prefetch={false} className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronDown className="h-4 w-4 -rotate-90 text-blue-400" /> Contact Us</Link></li>
              <li><Link href="/privacy" prefetch={false} className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronDown className="h-4 w-4 -rotate-90 text-blue-400" /> Privacy Policy</Link></li>
              <li><Link href="/terms" prefetch={false} className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronDown className="h-4 w-4 -rotate-90 text-blue-400" /> Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="w-full h-px bg-slate-200 mb-8"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-base text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Tejomarg Job Portal. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-500">
             <Link href="#" className="hover:text-blue-600 transition-colors text-base font-medium">Facebook</Link>
             <Link href="#" className="hover:text-blue-600 transition-colors text-base font-medium">Twitter</Link>
             <Link href="#" className="hover:text-blue-600 transition-colors text-base font-medium">LinkedIn</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
