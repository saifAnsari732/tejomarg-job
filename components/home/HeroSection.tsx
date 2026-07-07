"use client";

import React from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

export default function HeroSection() {
  const router = useRouter();

  const [searchVal, setSearchVal] = useState("");
  const [locationVal, setLocationVal] = useState("");
  const [debouncedSearchVal, setDebouncedSearchVal] = useState("");
  const [debouncedLocationVal, setDebouncedLocationVal] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Debouncing Search Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchVal(searchVal);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchVal]);

  // Debouncing Location Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocationVal(locationVal);
    }, 300);
    return () => clearTimeout(timer);
  }, [locationVal]);

  const jobSuggestions = [
    // Tech & Design
    "Full-stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Software Engineer",
    "Mobile App Developer",
    "Android Developer",
    "iOS Developer",
    "UI/UX Designer",
    "Graphic Designer",
    "Web Developer",
    "Python Developer",
    "Java Developer",
    // Office, Admin & Data
    "Office Assistant",
    "Receptionist",
    "Data Entry Operator",
    "Admin Executive",
    "Executive Assistant",
    // Sales, Marketing & Customer Support
    "Telecaller",
    "Customer Support Executive",
    "BPO Executive",
    "Sales Executive",
    "Business Development Associate",
    "Marketing Executive",
    "Digital Marketing Specialist",
    "Social Media Manager",
    "SEO Executive",
    // Field & Logistics
    "Delivery Boy",
    "Delivery Partner",
    "Driver",
    "Field Sales Executive",
    "Logistics Executive",
    // Creative
    "Content Writer",
    "Video Editor",
    "Photographer",
    // HR & Management
    "HR Executive",
    "Recruiter",
    "Operations Manager",
    // Finance & Accounts
    "Accountant",
    "Finance Executive",
    "Accounts Manager",
    // Education & Others
    "Teacher",
    "Tutor",
    "Cook",
    "Chef",
    "Waiter",
    "Housekeeping Staff",
    "Security Guard",
    "Beautician"
  ];

  const locationSuggestions = [
    // Uttar Pradesh
    "Lucknow",
    "Noida",
    "Greater Noida",
    "Ghaziabad",
    "Kanpur",
    "Varanasi",
    "Agra",
    "Meerut",
    "Allahabad (Prayagraj)",
    "Bareilly",
    "Gorakhpur",
    "Aligarh",
    "Jhansi",
    "Moradabad",
    // Delhi NCR & Haryana
    "Delhi NCR",
    "Gurgaon (Gurugram)",
    "Faridabad",
    "Panipat",
    "Ambala",
    // Maharashtra
    "Mumbai",
    "Pune",
    "Thane",
    "Navi Mumbai",
    "Nagpur",
    "Nashik",
    "Aurangabad",
    // Karnataka
    "Bengaluru (Bangalore)",
    "Mysore",
    "Mangalore",
    "Hubli",
    // Telangana & Andhra Pradesh
    "Hyderabad",
    "Visakhapatnam",
    "Vijayawada",
    // Tamil Nadu
    "Chennai",
    "Coimbatore",
    "Madurai",
    // Kerala
    "Kochi",
    "Trivandrum",
    // West Bengal & East India
    "Kolkata",
    "Bhubaneswar",
    "Guwahati",
    "Patna",
    "Ranchi",
    "Muzaffarpur",
    // Rajasthan
    "Jaipur",
    "Udaipur",
    "Jodhpur",
    "Kota",
    // Gujarat
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    // Madhya Pradesh & Chhattisgarh
    "Indore",
    "Bhopal",
    "Gwalior",
    "Raipur",
    "Bilaspur",
    // Punjab & Chandigarh
    "Chandigarh",
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    // Uttarakhand
    "Dehradun",
    "Haridwar"
  ];

  const filteredJobSuggestions = jobSuggestions.filter((item) =>
    item.toLowerCase().includes(debouncedSearchVal.toLowerCase())
  );

  const filteredLocationSuggestions = locationSuggestions.filter((item) =>
    item.toLowerCase().includes(debouncedLocationVal.toLowerCase())
  );

  // Show dropdown only if user has typed something and matching suggestions exist
  const showSearch = showSearchSuggestions && searchVal.trim() !== "" && filteredJobSuggestions.length > 0;
  const showLocation = showLocationSuggestions && locationVal.trim() !== "" && filteredLocationSuggestions.length > 0;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchVal) params.set("search", searchVal);
    if (locationVal) params.set("location", locationVal);
    
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="bg-slate-50 relative pt-12 pb-20 overflow-hidden">
      {/* Background Gradient matching the screenshot's faint pink/purple aura on left */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left Content */}
        <div className="lg:w-[60%] pt-10">
          <h3 className="text-emerald-600 font-bold tracking-widest text-sm uppercase mb-4">
            INDIA'S #1 JOB PLATFORM
          </h3>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
            Your job search ends here
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl mb-10">
            Discover 50 lakh+ career opportunities
          </p>

          {/* Search Bar */}
          <div className="bg-white p-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-12 max-w-4xl border border-slate-100 relative z-30">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              <div className="flex items-center flex-1 px-4 py-3 w-full relative">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  name="search"
                  value={searchVal}
                  onChange={(e) => {
                    setSearchVal(e.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                  placeholder="Search jobs by 'title'" 
                  className="w-full pl-3 pr-2 py-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-sm md:text-base outline-none"
                />
                
                {showSearch && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {filteredJobSuggestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setSearchVal(item);
                          setShowSearchSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border-b border-slate-100 last:border-none transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center flex-1 px-4 py-3 w-full cursor-pointer group relative">
                <BriefcaseIcon className="h-5 w-5 text-slate-400 shrink-0" />
                <select className="w-full pl-3 pr-8 py-1 bg-transparent border-none focus:ring-0 text-slate-800 text-sm md:text-base outline-none appearance-none cursor-pointer">
                  <option value="">Your Experience</option>
                  <option value="Entry-level">0-2 Years</option>
                  <option value="Mid-level">2-5 Years</option>
                  <option value="Senior">5+ Years</option>
                </select>
                <ChevronDown className="h-4 w-4 text-slate-400 absolute right-4 group-hover:text-slate-600 transition-colors pointer-events-none" />
              </div>

              <div className="flex items-center flex-1 px-4 py-3 w-full relative">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  name="location"
                  value={locationVal}
                  onChange={(e) => {
                    setLocationVal(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                  placeholder="Search for an area or city" 
                  className="w-full pl-3 pr-2 py-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-sm md:text-base outline-none"
                />
                
                {showLocation && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {filteredLocationSuggestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setLocationVal(item);
                          setShowLocationSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border-b border-slate-100 last:border-none transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-2 py-2 w-full md:w-auto">
                <button type="submit" className="w-full bg-[#208f60] hover:bg-[#1a7650] text-white font-bold py-3 px-8 rounded-lg transition-colors whitespace-nowrap">
                  Search jobs
                </button>
              </div>

            </form>
          </div>

          {/* Trusted By & Proud To Support */}
          <div className="space-y-8">
            <div>
              <p className="text-slate-800 font-bold text-sm mb-4">Proud to Support</p>
              <div className="flex items-center gap-6">
                <div className="text-slate-500 text-xs font-bold flex items-center border border-slate-200 px-3 py-1.5 bg-white rounded shadow-sm">
                  <span className="w-4 h-4 bg-orange-500 rounded-full inline-block mr-2"></span> Ministry of Labour
                </div>
                <div className="text-slate-500 text-xs font-bold flex items-center border border-slate-200 px-3 py-1.5 bg-white rounded shadow-sm">
                  <span className="w-4 h-4 bg-emerald-500 rounded-full inline-block mr-2"></span> Startup India
                </div>
              </div>
            </div>

            <div>
              <p className="text-slate-800 font-bold text-sm mb-4">Trusted by 1000+ enterprises and 7 lakh+ MSMEs for hiring</p>
              <div className="flex flex-wrap items-center gap-6 opacity-70 grayscale">
                <span className="text-xl font-black tracking-tighter">asket</span>
                <span className="text-xl font-black text-blue-800">HDFC BANK</span>
                <span className="text-xl font-black text-orange-600">SWIGGY</span>
                <span className="text-xl font-black">Uber</span>
                <span className="text-xl font-black">Urban Company</span>
                <span className="text-xl font-black text-red-600">Z</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content (Image) */}
        <div className="hidden lg:block lg:w-[45%] relative">
           <img 
              src="/hero-man.jpg" 
              alt="Professional job seeker" 
              className="w-full max-w-[480px] mx-auto object-contain z-10 relative"
           />
        </div>

      </div>
    </section>
  );
}

// Inline Briefcase icon since we didn't import it at the top
function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
