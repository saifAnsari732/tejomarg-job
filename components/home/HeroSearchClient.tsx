"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSearchClient() {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const [locationVal, setLocationVal] = useState("");
  const [debouncedSearchVal, setDebouncedSearchVal] = useState("");
  const [debouncedLocationVal, setDebouncedLocationVal] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchVal(searchVal), 300);
    return () => clearTimeout(timer);
  }, [searchVal]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedLocationVal(locationVal), 300);
    return () => clearTimeout(timer);
  }, [locationVal]);

  const jobSuggestions = [
    "Software Engineer", "Frontend Developer", "UI/UX Designer", "Product Manager",
    "Data Scientist", "Marketing Executive", "Sales Manager", "HR Executive"
  ];

  const locationSuggestions = [
    "Bengaluru", "Mumbai", "Delhi NCR", "Pune", "Hyderabad", "Chennai", "Remote"
  ];

  const filteredJobSuggestions = jobSuggestions.filter((item) =>
    item.toLowerCase().includes(debouncedSearchVal.toLowerCase())
  );
  const filteredLocationSuggestions = locationSuggestions.filter((item) =>
    item.toLowerCase().includes(debouncedLocationVal.toLowerCase())
  );

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
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-center bg-white md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200 p-2 md:p-3 space-y-3 md:space-y-0 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_40px_rgb(79,70,229,0.15)] hover:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-400 w-full relative z-40">
      
      {/* Search Job */}
      <div className="flex items-center flex-1 px-4 py-3 w-full relative group">
        <Search className="h-6 w-6 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
        <input 
          type="text" 
          value={searchVal}
          onChange={(e) => { setSearchVal(e.target.value); setShowSearchSuggestions(true); }}
          onFocus={() => setShowSearchSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
          placeholder="Job title, skills, or company" 
          className="w-full pl-3 pr-2 py-1 bg-transparent border-none text-slate-900 placeholder-slate-400 text-[16px] outline-none focus:ring-0 font-medium"
        />
        {showSearch && (
          <div className="absolute left-0 right-0 top-full mt-4 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden">
            {filteredJobSuggestions.map((item) => (
              <button
                key={item} type="button" onMouseDown={() => { setSearchVal(item); setShowSearchSuggestions(false); }}
                className="w-full text-left px-5 py-3.5 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors border-b border-slate-100 last:border-none"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:block w-px h-10 bg-slate-200"></div>

      {/* Location */}
      <div className="flex items-center flex-1 px-4 py-3 w-full relative group">
        <MapPin className="h-6 w-6 text-sky-400 group-focus-within:text-sky-600 transition-colors" />
        <input 
          type="text" 
          value={locationVal}
          onChange={(e) => { setLocationVal(e.target.value); setShowLocationSuggestions(true); }}
          onFocus={() => setShowLocationSuggestions(true)}
          onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
          placeholder="City or 'Remote'" 
          className="w-full pl-3 pr-2 py-1 bg-transparent border-none text-slate-900 placeholder-slate-400 text-[16px] outline-none focus:ring-0 font-medium"
        />
        {showLocation && (
          <div className="absolute left-0 right-0 top-full mt-4 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden">
            {filteredLocationSuggestions.map((item) => (
              <button
                key={item} type="button" onMouseDown={() => { setLocationVal(item); setShowLocationSuggestions(false); }}
                className="w-full text-left px-5 py-3.5 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors border-b border-slate-100 last:border-none"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="w-full md:w-auto mt-2 md:mt-0">
        <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold py-4 md:py-3.5 px-10 rounded-xl md:rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 whitespace-nowrap text-[16px]">
          Search Jobs
        </button>
      </div>
    </form>
  );
}
