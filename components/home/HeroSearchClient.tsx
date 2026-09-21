"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Sparkles } from "lucide-react";
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
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row md:items-center bg-white dark:bg-slate-900 rounded-2xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200 dark:border-slate-800 p-2 sm:p-2.5 space-y-2 md:space-y-0 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(59,130,246,0.12)] hover:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 w-full relative z-40"
    >
      {/* Search Job Field */}
      <div className="flex items-center flex-1 px-3 py-2 sm:py-2.5 relative group">
        <Search className="h-5 w-5 text-blue-500 shrink-0 mr-3 transition-colors group-focus-within:text-blue-600" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
            setShowSearchSuggestions(true);
          }}
          onFocus={() => setShowSearchSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
          placeholder="Job title, skills, or company"
          className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base outline-none focus:ring-0 font-medium truncate"
        />

        {showSearch && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] z-50 overflow-hidden">
            {filteredJobSuggestions.map((item) => (
              <button
                key={item}
                type="button"
                onMouseDown={() => {
                  setSearchVal(item);
                  setShowSearchSuggestions(false);
                }}
                className="w-full text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-none flex items-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hairline Divider for Mobile */}
      <div className="block md:hidden border-b border-slate-100 dark:border-slate-800 mx-2"></div>

      {/* Vertical Divider for Desktop */}
      <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-800 shrink-0 mx-1"></div>

      {/* Location Field */}
      <div className="flex items-center flex-1 px-3 py-2 sm:py-2.5 relative group">
        <MapPin className="h-5 w-5 text-sky-500 shrink-0 mr-3 transition-colors group-focus-within:text-sky-600" />
        <input
          type="text"
          value={locationVal}
          onChange={(e) => {
            setLocationVal(e.target.value);
            setShowLocationSuggestions(true);
          }}
          onFocus={() => setShowLocationSuggestions(true)}
          onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
          placeholder="City or 'Remote'"
          className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base outline-none focus:ring-0 font-medium truncate"
        />

        {showLocation && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] z-50 overflow-hidden">
            {filteredLocationSuggestions.map((item) => (
              <button
                key={item}
                type="button"
                onMouseDown={() => {
                  setLocationVal(item);
                  setShowLocationSuggestions(false);
                }}
                className="w-full text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-none flex items-center gap-2.5"
              >
                <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="w-full md:w-auto pt-1 md:pt-0">
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl md:rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99] text-base flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
          <span>Search Jobs</span>
        </button>
      </div>
    </form>
  );
}

