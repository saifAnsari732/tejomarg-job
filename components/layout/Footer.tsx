import Link from "next/link";
import { Briefcase, Globe, ChevronDown } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-1/2 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src="/job1.png" alt="Tejomarg Icon" className="h-10 w-auto object-contain shrink-0 brightness-125" />
              <img src="/job2.png" alt="Tejomarg Text" className="h-32 -my-12 -ml-6 w-auto object-contain shrink-0 invert brightness-0 pointer-events-none" />
            </div>
            <p className="text-sm text-slate-400 pr-4 leading-relaxed">
              India's #1 Job Platform. Connecting talent with the best opportunities across the nation with AI-powered precision.
            </p>
          </div>

          {/* Candidates */}
          <div>
            <h3 className="font-bold text-slate-200 mb-6 tracking-wide">For Candidates</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/jobs" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronDown className="h-3 w-3 -rotate-90 opacity-50" /> Browse Jobs</Link></li>
              <li><Link href="/resume-tools/job-prep" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronDown className="h-3 w-3 -rotate-90 opacity-50" /> Job Prep <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">NEW</span></Link></li>
              <li><Link href="/resume-tools/resume-builder" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronDown className="h-3 w-3 -rotate-90 opacity-50" /> Resume Builder</Link></li>
              <li><Link href="/candidate" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronDown className="h-3 w-3 -rotate-90 opacity-50" /> Candidate Dashboard</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="font-bold text-slate-200 mb-6 tracking-wide">For Employers</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/employer/post-job" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronDown className="h-3 w-3 -rotate-90 opacity-50" /> Post a Job</Link></li>
              <li><Link href="/employer" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronDown className="h-3 w-3 -rotate-90 opacity-50" /> Employer Dashboard</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronDown className="h-3 w-3 -rotate-90 opacity-50" /> Pricing Plans</Link></li>
              <li><Link href="/employer-guidelines" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronDown className="h-3 w-3 -rotate-90 opacity-50" /> Hiring Guidelines</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-slate-200 mb-6 tracking-wide">Company</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronDown className="h-3 w-3 -rotate-90 opacity-50" /> About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronDown className="h-3 w-3 -rotate-90 opacity-50" /> Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronDown className="h-3 w-3 -rotate-90 opacity-50" /> Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronDown className="h-3 w-3 -rotate-90 opacity-50" /> Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-8"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Tejomarg Job Portal. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-500">
             <Link href="#" className="hover:text-blue-400 transition-colors text-sm font-medium">Facebook</Link>
             <Link href="#" className="hover:text-blue-400 transition-colors text-sm font-medium">Twitter</Link>
             <Link href="#" className="hover:text-blue-400 transition-colors text-sm font-medium">LinkedIn</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
