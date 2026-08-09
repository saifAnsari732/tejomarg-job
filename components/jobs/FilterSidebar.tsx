"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Filter, ChevronUp, ChevronDown, X, Search, CheckCircle2 } from "lucide-react";

interface FilterSidebarProps {
  categories: Array<{ name: string; slug: string }>;
  initialFilters: {
    search: string;
    location: string;
    category: string;
    department: string;
    jobType: string;
    workMode: string;
    workType: string;
    workShift: string;
    experience: string;
    minSalary: string;
    datePosted: string;
    education: string;
    englishLevel: string;
    gender: string;
    sort: string;
  };
}

export default function FilterSidebar({ categories, initialFilters }: FilterSidebarProps) {
  const router = useRouter();
  
  const [filters, setFilters] = useState(initialFilters);
  const [expanded, setExpanded] = useState({
    experience: true,
    datePosted: true,
    salary: true,
    education: true,
    workMode: true,
    workType: true,
    workShift: true,
    department: true,
    englishLevel: true,
    gender: true,
    sortBy: true,
  });

  const [deptSearch, setDeptSearch] = useState("");
  
  // Mobile Modal State
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<string>("datePosted");

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Sync to URL
  const applyFilters = (updatedFilters = filters) => {
    const params = new URLSearchParams();
    
    Object.entries(updatedFilters).forEach(([key, val]) => {
      if (val && val !== "0" && val !== "All" && val !== "Relevant") {
        params.set(key, val);
      }
    });

    params.set("page", "1");
    router.push(`/jobs?${params.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    const cleared = {
      search: filters.search,
      location: filters.location,
      category: "", department: "", jobType: "", workMode: "",
      workType: "", workShift: "", experience: "0", minSalary: "0",
      datePosted: "All", education: "", englishLevel: "", gender: "", sort: "Relevant"
    };
    setFilters(cleared);
    applyFilters(cleared);
  };

  const handleRemoveChip = (key: keyof typeof filters, valToRemove?: string) => {
    if (!valToRemove) {
      const resetVal = (key === "experience" || key === "minSalary") ? "0" : (key === "datePosted") ? "All" : (key === "sort") ? "Relevant" : "";
      const newFilters = { ...filters, [key]: resetVal };
      setFilters(newFilters);
      applyFilters(newFilters);
      return;
    }
    const current = filters[key] ? filters[key].split(",") : [];
    const newArr = current.filter(v => v !== valToRemove);
    const newFilters = { ...filters, [key]: newArr.join(",") };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleCheckbox = (key: keyof typeof filters, value: string) => {
    let current = filters[key] ? filters[key].split(",") : [];
    if (current.includes(value)) {
      current = current.filter(v => v !== value);
    } else {
      current.push(value);
    }
    const newFilters = { ...filters, [key]: current.join(",") };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleRadio = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Derive Active Chips
  const activeChips: { key: keyof typeof filters; val: string; display: string }[] = [];
  if (filters.experience && filters.experience !== "0") activeChips.push({ key: "experience", val: filters.experience, display: `${filters.experience} yrs` });
  if (filters.minSalary && filters.minSalary !== "0") activeChips.push({ key: "minSalary", val: filters.minSalary, display: `₹${parseInt(filters.minSalary)/100000}L+` });
  if (filters.datePosted && filters.datePosted !== "All") activeChips.push({ key: "datePosted", val: filters.datePosted, display: filters.datePosted });
  if (filters.sort && filters.sort !== "Relevant") activeChips.push({ key: "sort", val: filters.sort, display: filters.sort });
  
  ["education", "workMode", "workType", "workShift", "department", "englishLevel", "gender"].forEach((k) => {
    const key = k as keyof typeof filters;
    if (filters[key]) {
      filters[key].split(",").forEach(val => {
        activeChips.push({ key, val, display: val });
      });
    }
  });

  const filterOptions = {
    datePosted: ["All", "Last 24 hours", "Last 3 days", "Last 7 days"],
    education: ["10 or Below 10th", "12th Pass", "Diploma", "ITI", "Graduate", "Post Graduate"],
    workMode: ["Work from office", "Work from home", "Field job"],
    workType: ["Full Time", "Part Time", "Contract", "Internship"],
    workShift: ["Day shift", "Night shift"],
    englishLevel: ["No English", "Basic English", "Good English", "Fluent English"],
    gender: ["Male", "Female", "Any"],
    sortBy: ["Relevant", "Latest", "High Salary"]
  };

  const mobileTabs = [
    { id: "datePosted", label: "Date posted" },
    { id: "salary", label: "Salary" },
    { id: "experience", label: "Experience" },
    { id: "workMode", label: "Work mode" },
    { id: "workType", label: "Work type" },
    { id: "workShift", label: "Work shift" },
    { id: "department", label: "Department" },
    { id: "education", label: "Education" },
    { id: "englishLevel", label: "English level" },
    { id: "gender", label: "Gender" },
    { id: "sortBy", label: "Sort by" },
  ];

  return (
    <>
      {/* =========================================
          MOBILE VIEW: Quick Chips Row
      ========================================= */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button onClick={() => { setIsMobileModalOpen(true); setMobileTab("datePosted"); }} className="shrink-0 p-2 border border-slate-200 rounded-full bg-white flex items-center justify-center">
          <Filter className="h-4 w-4 text-slate-700" />
        </button>
        {activeChips.length > 0 && (
          <div className="shrink-0 flex items-center gap-2 mr-2 border-r border-slate-300 pr-2">
            {activeChips.map((chip, idx) => (
              <div key={idx} className="flex items-center gap-1 px-3 py-1.5 border border-indigo-600 bg-indigo-50 rounded-full text-xs text-indigo-700 font-semibold">
                {chip.display}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveChip(chip.key, chip.key === "experience" || chip.key === "minSalary" || chip.key === "datePosted" || chip.key === "sort" ? undefined : chip.val)} />
              </div>
            ))}
          </div>
        )}
        <button onClick={() => { setIsMobileModalOpen(true); setMobileTab("datePosted"); }} className="shrink-0 px-3 py-1.5 border border-slate-200 rounded-full bg-white text-xs text-slate-700 flex items-center gap-1">
          Date posted <ChevronDown className="h-3 w-3" />
        </button>
        <button onClick={() => { setIsMobileModalOpen(true); setMobileTab("salary"); }} className="shrink-0 px-3 py-1.5 border border-slate-200 rounded-full bg-white text-xs text-slate-700 flex items-center gap-1">
          Salary <ChevronDown className="h-3 w-3" />
        </button>
        <button onClick={() => { setIsMobileModalOpen(true); setMobileTab("workMode"); }} className="shrink-0 px-3 py-1.5 border border-slate-200 rounded-full bg-white text-xs text-slate-700 flex items-center gap-1">
          Work mode <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* =========================================
          MOBILE VIEW: Bottom Sheet Modal
      ========================================= */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/50 lg:hidden" onClick={() => setIsMobileModalOpen(false)}>
          <div className="mt-auto h-[85vh] bg-white rounded-t-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-200" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Filters</h3>
              <button onClick={() => setIsMobileModalOpen(false)} className="p-1.5 bg-slate-100 rounded-full">
                <X className="h-4 w-4 text-slate-600" />
              </button>
            </div>
            
            {/* Modal Body: Dual Pane */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Tabs */}
              <div className="w-[120px] shrink-0 bg-slate-100/50 overflow-y-auto border-r border-slate-100 pb-20 custom-scrollbar">
                {mobileTabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setMobileTab(tab.id)} 
                    className={`w-full text-left p-4 text-[11px] font-bold transition-colors ${mobileTab === tab.id ? 'bg-white border-l-4 border-indigo-600 text-indigo-800' : 'text-slate-600 border-l-4 border-transparent hover:bg-slate-100'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Right Content */}
              <div className="flex-1 p-4 overflow-y-auto bg-white pb-20 custom-scrollbar">
                {mobileTab === "datePosted" && (
                  <div className="space-y-4">
                    {filterOptions.datePosted.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" checked={filters.datePosted === opt || (!filters.datePosted && opt === "All")} onChange={() => handleRadio("datePosted", opt)} className="appearance-none w-4 h-4 border border-slate-300 rounded-full checked:border-indigo-600 checked:border-[4px] transition-all" />
                        <span className="text-xs text-slate-700 font-semibold">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {mobileTab === "sortBy" && (
                  <div className="space-y-4">
                    {filterOptions.sortBy.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" checked={filters.sort === opt || (!filters.sort && opt === "Relevant")} onChange={() => handleRadio("sort", opt)} className="appearance-none w-4 h-4 border border-slate-300 rounded-full checked:border-indigo-600 checked:border-[4px] transition-all" />
                        <span className="text-xs text-slate-700 font-semibold">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {mobileTab === "salary" && (
                  <div className="pt-2">
                    <p className="text-[11px] text-slate-500 mb-6 font-semibold">Minimum monthly salary</p>
                    <div className="relative pt-1 px-1">
                      <div className="absolute -top-4 left-[calc(var(--val)*0.6%)] bg-indigo-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded -translate-x-1/2" style={{ "--val": parseInt(filters.minSalary || "0") / 1000 } as any}>
                        ₹{(parseInt(filters.minSalary || "0") / 1000)}k
                      </div>
                      <input
                        type="range" min="0" max="150000" step="10000"
                        value={filters.minSalary || "0"}
                        onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                        className="w-full h-1 bg-indigo-100/50 rounded-lg appearance-none cursor-pointer accent-indigo-700"
                      />
                      <div className="flex justify-between mt-3">
                        <span className="text-[10px] font-bold text-slate-500">0</span>
                        <span className="text-[10px] font-bold text-slate-500">1.5 Lakhs</span>
                      </div>
                    </div>
                  </div>
                )}
                {mobileTab === "experience" && (
                  <div className="pt-2">
                    <p className="text-[11px] text-slate-500 mb-6 font-semibold">Your work experience</p>
                    <div className="relative pt-1 px-1">
                      <div className="absolute -top-4 left-[calc(var(--val)*3.1%)] bg-indigo-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded -translate-x-1/2" style={{ "--val": parseInt(filters.experience || "0") } as any}>
                        {filters.experience || "0"}
                      </div>
                      <input
                        type="range" min="0" max="31" step="1"
                        value={filters.experience || "0"}
                        onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                        className="w-full h-1 bg-indigo-100/50 rounded-lg appearance-none cursor-pointer accent-indigo-700"
                      />
                      <div className="flex justify-between mt-3">
                        <span className="text-[10px] font-bold text-slate-500">0 years</span>
                        <span className="text-[10px] font-bold text-slate-500">31 years</span>
                      </div>
                    </div>
                  </div>
                )}
                {mobileTab === "department" && (
                  <div>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input type="text" placeholder="Search department..." value={deptSearch} onChange={(e) => setDeptSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-4">
                      {categories.filter(c => c.name.toLowerCase().includes(deptSearch.toLowerCase())).map((cat) => (
                        <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={filters.department?.split(",").includes(cat.name)} onChange={() => handleCheckbox("department", cat.name)} className="appearance-none w-4 h-4 border border-slate-300 rounded flex-shrink-0 checked:bg-indigo-600 checked:border-indigo-600 transition-colors cursor-pointer flex items-center justify-center after:content-[''] after:w-1 after:h-2 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:hidden checked:after:block after:-mt-0.5" />
                          <span className="text-xs text-slate-700 font-semibold group-hover:text-slate-900 leading-snug">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {["education", "workMode", "workType", "workShift", "englishLevel", "gender"].includes(mobileTab) && (
                  <div className="space-y-4">
                    {filterOptions[mobileTab as keyof typeof filterOptions].map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={filters[mobileTab as keyof typeof filters]?.split(",").includes(opt)} onChange={() => handleCheckbox(mobileTab as keyof typeof filters, opt)} className="appearance-none w-4 h-4 border border-slate-300 rounded flex-shrink-0 checked:bg-indigo-600 checked:border-indigo-600 transition-colors cursor-pointer flex items-center justify-center after:content-[''] after:w-1 after:h-2 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:hidden checked:after:block after:-mt-0.5" />
                        <span className="text-xs text-slate-700 font-semibold group-hover:text-slate-900 leading-snug">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
              <button onClick={handleClearAll} className="text-indigo-700 font-bold text-sm w-1/2 text-center py-2.5">Clear Filters</button>
              <button onClick={() => setIsMobileModalOpen(false)} className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm w-1/2 py-2.5 rounded-xl transition-colors shadow-sm">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          DESKTOP VIEW: Sidebar
      ========================================= */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm p-0 w-full overflow-hidden text-sm relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-slate-900 font-bold">
            <Filter className="h-4 w-4" />
            <span>Filters ({activeChips.length})</span>
          </div>
          {activeChips.length > 0 && (
            <button onClick={handleClearAll} className="text-blue-600 text-xs font-bold hover:underline">
              Clear all
            </button>
          )}
        </div>

        {/* Active Chips */}
        {activeChips.length > 0 && (
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2">
            {activeChips.map((chip, idx) => (
              <div key={idx} className="inline-flex items-center bg-white border border-blue-600 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {chip.display}
                <button onClick={() => handleRemoveChip(chip.key, chip.key === "experience" || chip.key === "minSalary" || chip.key === "datePosted" || chip.key === "sort" ? undefined : chip.val)} className="ml-1.5 focus:outline-none">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="p-5 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Experience Slider */}
          <div>
            <button onClick={() => toggleSection("experience")} className="flex justify-between items-center w-full font-bold text-slate-800 mb-2">
              Experience <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 rounded-full ml-2">1</span>
              {expanded.experience ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            {expanded.experience && (
              <div className="pt-2 pb-1">
                <p className="text-xs text-slate-500 mb-4">Your work experience</p>
                <div className="relative pt-1 px-1">
                  {/* Tooltip for slider */}
                  <div className="absolute -top-3 left-[calc(var(--val)*3.1%)] bg-[indigo-600] text-white text-[10px] font-bold px-1.5 rounded -translate-x-1/2" style={{ "--val": parseInt(filters.experience || "0") } as any}>
                    {filters.experience || "0"}
                  </div>
                  <input
                    type="range" min="0" max="31" step="1"
                    value={filters.experience || "0"}
                    onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                    onMouseUp={() => applyFilters()}
                    className="w-full h-1 bg-indigo-100/50 rounded-lg appearance-none cursor-pointer accent-[indigo-600]"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-slate-600">0 years</span>
                    <span className="text-xs text-slate-600">31 years</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <hr className="border-slate-100" />

          {/* Date Posted (Radio) */}
          <div>
            <button onClick={() => toggleSection("datePosted")} className="flex justify-between items-center w-full font-bold text-slate-800 mb-3">
              Date posted
              {expanded.datePosted ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            {expanded.datePosted && (
              <div className="space-y-3">
                {filterOptions.datePosted.map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" checked={filters.datePosted === opt || (!filters.datePosted && opt === "All")} onChange={() => handleRadio("datePosted", opt)} className="appearance-none w-3.5 h-3.5 border border-slate-300 rounded-full checked:border-[indigo-600] checked:border-[3px] transition-all cursor-pointer" />
                    <span className="text-xs text-slate-600 group-hover:text-slate-900">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <hr className="border-slate-100" />

          {/* Salary Slider */}
          <div>
            <button onClick={() => toggleSection("salary")} className="flex justify-between items-center w-full font-bold text-slate-800 mb-2">
              Salary
              {expanded.salary ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            {expanded.salary && (
              <div className="pt-2 pb-1">
                <p className="text-xs text-slate-500 mb-4">Minimum monthly salary</p>
                <div className="relative pt-1 px-1">
                  {/* Tooltip for slider */}
                  <div className="absolute -top-3 left-[calc(var(--val)*0.6%)] bg-[indigo-600] text-white text-[10px] font-bold px-1.5 rounded -translate-x-1/2" style={{ "--val": parseInt(filters.minSalary || "0") / 1000 } as any}>
                    ₹{(parseInt(filters.minSalary || "0") / 1000)}k
                  </div>
                  <input
                    type="range" min="0" max="150000" step="10000"
                    value={filters.minSalary || "0"}
                    onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                    onMouseUp={() => applyFilters()}
                    className="w-full h-1 bg-indigo-100/50 rounded-lg appearance-none cursor-pointer accent-[indigo-600]"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-slate-600">0</span>
                    <span className="text-xs text-slate-600">1.5 Lakhs</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <hr className="border-slate-100" />

          {/* Education */}
          <div>
            <button onClick={() => toggleSection("education")} className="flex justify-between items-center w-full font-bold text-slate-800 mb-2">
              Highest education
              {expanded.education ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            {expanded.education && (
              <div className="pt-2">
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">Select your highest education level to see all eligible jobs</p>
                <div className="space-y-3">
                  {filterOptions.education.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={filters.education?.split(",").includes(opt)} onChange={() => handleCheckbox("education", opt)} className="appearance-none w-3.5 h-3.5 border border-slate-300 rounded flex-shrink-0 checked:bg-[indigo-600] checked:border-[indigo-600] transition-colors cursor-pointer flex items-center justify-center after:content-[''] after:w-1.5 after:h-2 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:hidden checked:after:block after:-mt-0.5" />
                      <span className="text-xs text-slate-600 group-hover:text-slate-900 leading-snug">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <hr className="border-slate-100" />

          {/* Common Checkbox Sections */}
          {[
            { key: "workMode", label: "Work Mode", options: filterOptions.workMode },
            { key: "workType", label: "Work Type", options: filterOptions.workType },
            { key: "workShift", label: "Work Shift", options: filterOptions.workShift },
          ].map(({ key, label, options }) => (
            <div key={key}>
              <button onClick={() => toggleSection(key as keyof typeof expanded)} className="flex justify-between items-center w-full font-bold text-slate-800 mb-3">
                {label}
                {expanded[key as keyof typeof expanded] ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </button>
              {expanded[key as keyof typeof expanded] && (
                <div className="space-y-3">
                  {options.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={filters[key as keyof typeof filters]?.split(",").includes(opt)} onChange={() => handleCheckbox(key as keyof typeof filters, opt)} className="appearance-none w-3.5 h-3.5 border border-slate-300 rounded flex-shrink-0 checked:bg-[indigo-600] checked:border-[indigo-600] transition-colors cursor-pointer flex items-center justify-center after:content-[''] after:w-1.5 after:h-2 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:hidden checked:after:block after:-mt-0.5" />
                      <span className="text-xs text-slate-600 group-hover:text-slate-900 leading-snug">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
              <hr className="border-slate-100 mt-6" />
            </div>
          ))}

          {/* Department / Category with Search */}
          <div>
            <button onClick={() => toggleSection("department")} className="flex justify-between items-center w-full font-bold text-slate-800 mb-3">
              Department
              {expanded.department ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            {expanded.department && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input type="text" placeholder="Search department..." value={deptSearch} onChange={(e) => setDeptSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {categories.filter(c => c.name.toLowerCase().includes(deptSearch.toLowerCase())).map((cat) => (
                    <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={filters.department?.split(",").includes(cat.name)} onChange={() => handleCheckbox("department", cat.name)} className="appearance-none w-3.5 h-3.5 border border-slate-300 rounded flex-shrink-0 checked:bg-[indigo-600] checked:border-[indigo-600] transition-colors cursor-pointer flex items-center justify-center after:content-[''] after:w-1.5 after:h-2 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:hidden checked:after:block after:-mt-0.5" />
                      <span className="text-xs text-slate-600 group-hover:text-slate-900 leading-snug">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <hr className="border-slate-100" />

          {/* Remaining Common Checkboxes */}
          {[
            { key: "englishLevel", label: "English level", options: filterOptions.englishLevel },
            { key: "gender", label: "Gender", options: filterOptions.gender },
          ].map(({ key, label, options }) => (
            <div key={key}>
              <button onClick={() => toggleSection(key as keyof typeof expanded)} className="flex justify-between items-center w-full font-bold text-slate-800 mb-3">
                {label}
                {expanded[key as keyof typeof expanded] ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </button>
              {expanded[key as keyof typeof expanded] && (
                <div className="space-y-3">
                  {options.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={filters[key as keyof typeof filters]?.split(",").includes(opt)} onChange={() => handleCheckbox(key as keyof typeof filters, opt)} className="appearance-none w-3.5 h-3.5 border border-slate-300 rounded flex-shrink-0 checked:bg-[indigo-600] checked:border-[indigo-600] transition-colors cursor-pointer flex items-center justify-center after:content-[''] after:w-1.5 after:h-2 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:hidden checked:after:block after:-mt-0.5" />
                      <span className="text-xs text-slate-600 group-hover:text-slate-900 leading-snug">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
              {key !== "gender" && <hr className="border-slate-100 mt-6" />}
            </div>
          ))}

        </div>
      </div>
    </>
  );
}
