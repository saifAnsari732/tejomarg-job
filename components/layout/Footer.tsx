import Link from "next/link";
import { Briefcase, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-white">Tejomarg Job</span>
            </div>
            <p className="text-sm">
              Connecting brilliant talent with leading companies worldwide. Find full-time, part-time, remote, or internship roles.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-500 transition-colors" title="Website">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Candidates Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">For Candidates</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/candidate" className="hover:text-white transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link href="/candidate/profile" className="hover:text-white transition-colors">
                  Build Resume Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/employer/post-job" className="hover:text-white transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/employer" className="hover:text-white transition-colors">
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/signup?role=employer" className="hover:text-white transition-colors">
                  Employer Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Tejomarg Job Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
