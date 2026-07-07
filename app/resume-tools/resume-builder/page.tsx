"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  Plus, Trash2, Download, Layout, ArrowLeft, Sparkles, 
  ChevronDown, ChevronUp, FileText, Phone, Mail, MapPin, 
  Loader2, Award, Globe, Edit3, CheckCircle2
} from "lucide-react";

interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  year: string;
}

export default function ResumeBuilderPage() {
  const [loadingAi, setLoadingAi] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"david" | "classic" | "can" | "minimal" | "creative">("david");
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // Accordion Section States
  const [openSection, setOpenSection] = useState<string>("personal");

  // Form Field States
  const [name, setName] = useState("Saifuddin Ansari");
  const [email, setEmail] = useState("ansarisaifuddin732@gmail.com");
  const [mobile, setMobile] = useState("9985228899");
  const [city, setCity] = useState("Lucknow, UP");
  const [preferredRole, setPreferredRole] = useState("Full-stack Developer");
  const [summary, setSummary] = useState("Experienced developer skilled in building responsive web applications and backend architectures. Capable of leading product iterations and deploying full-scale projects.");
  const [photoUrl, setPhotoUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop"); // placeholder candidate photo

  // Handler for custom photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        toast.success("Profile photo uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const [experience, setExperience] = useState<Experience[]>([
    {
      company: "Eco Kisan Agro",
      role: "Full-stack Developer",
      duration: "Mar 2024 - Present",
      description: "Designed, developed, and deployed agricultural e-commerce platforms using Next.js, Node.js, and MongoDB."
    },
    {
      company: "code.sata",
      role: "Junior Front End Developer",
      duration: "Feb 2023 - Sep 2023",
      description: "Implemented pixel-perfect user interfaces and integrated REST APIs using React and Tailwind CSS."
    }
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      school: "Maharishi University of Information Technology",
      degree: "BCA, Mobile Application and Web Technology",
      year: "2023 - 2026"
    }
  ]);

  const [skillsText, setSkillsText] = useState("React Development, Next.js, Node.js, JavaScript, MongoDB, API Gateways, Express.js");
  const [certificationsText, setCertificationsText] = useState("Web Development (CWD), NextJS Advanced Certification");
  const [languagesText, setLanguagesText] = useState("English, Hindi");

  // AI Assistant: Generate Professional Summary
  const handleAiSummary = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cover-letter",
          jobDescription: `Professional Resume Summary for a ${preferredRole} role. Include these key skills: ${skillsText}. Write a brief, punchy 2-sentence summary.`,
          userDetails: { name, experience: preferredRole, skills: skillsText }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Clean the cover letter style response into a summary
      let cleanedSummary = data.result
        .replace(/Dear Hiring Team,?/gi, "")
        .replace(/Best regards,[\s\S]*/gi, "")
        .replace(/I am writing to express.*/gi, "")
        .trim();

      if (cleanedSummary.length > 250) {
        cleanedSummary = cleanedSummary.substring(0, 240) + "...";
      }

      setSummary(cleanedSummary);
      toast.success("AI Summary written!");
    } catch (err: any) {
      toast.error("Failed to generate AI summary, using default helper.");
      setSummary(`Motivated ${preferredRole} specializing in ${skillsText.split(',')[0]} and ${skillsText.split(',')[1] || "modern architectures"}. Experienced in writing clean code and shipping production-grade applications.`);
    } finally {
      setLoadingAi(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  return (
    <div className="bg-slate-100 min-h-screen -mt-6 pt-6 -mx-4 px-4 sm:-mx-8 sm:px-8 pb-12 text-sm relative z-10">
      
      {/* Stylesheet specifically to handle printing A4 cleanly */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-sheet, #resume-sheet * {
            visibility: visible;
          }
          #resume-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Templates Selector Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative">
            <h2 className="text-xl font-black text-slate-900 mb-6">Choose your resume template</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                {
                  id: "david",
                  name: "David Adler",
                  desc: "Clean side header with blue visual cues",
                },
                {
                  id: "classic",
                  name: "Classic Centered",
                  desc: "Timeless traditional corporate look",
                },
                {
                  id: "can",
                  name: "Can Aksu (2-Column)",
                  desc: "Sleek blue sidebar with skills value indicators",
                },
                {
                  id: "minimal",
                  name: "Minimalist Elegant",
                  desc: "Modern high-fashion clean typographic style",
                },
                {
                  id: "creative",
                  name: "Creative Modern",
                  desc: "Gradient banner header with custom profile grid",
                }
              ].map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setSelectedTemplate(tpl.id as any);
                    setShowTemplatesModal(false);
                    toast.success(`Swapped to ${tpl.name} template!`);
                  }}
                  className={`border-2 rounded-xl p-3 text-left transition-all flex flex-col justify-between h-52 ${
                    selectedTemplate === tpl.id 
                      ? "border-emerald-600 bg-emerald-50/30" 
                      : "border-slate-200 hover:border-slate-350"
                  }`}
                >
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-[11px] leading-tight">{tpl.name}</h4>
                    <p className="text-[9px] text-slate-500 mt-1 leading-tight h-6 overflow-hidden">{tpl.desc}</p>
                  </div>
                  <div className="h-20 w-full bg-slate-100 rounded-lg mt-2 border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-[9px] shadow-inner p-1 select-none">
                    {tpl.id === "david" && (
                      <div className="w-full h-full bg-white rounded border border-slate-200 p-1.5 flex flex-col gap-1 overflow-hidden">
                        <div className="flex justify-between items-center border-b pb-0.5 border-slate-100">
                          <div className="w-8 h-1 bg-slate-900 rounded-sm"></div>
                          <div className="w-6 h-0.5 bg-slate-300 rounded-sm"></div>
                        </div>
                        <div className="flex gap-1 items-start mt-0.5">
                          <div className="w-0.5 h-10 bg-emerald-500 shrink-0"></div>
                          <div className="flex-1 space-y-0.5">
                            <div className="w-full h-0.5 bg-slate-200 rounded-sm"></div>
                            <div className="w-4/5 h-0.5 bg-slate-200 rounded-sm"></div>
                            <div className="w-3/5 h-0.5 bg-slate-100 rounded-sm"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {tpl.id === "classic" && (
                      <div className="w-full h-full bg-white rounded border border-slate-200 p-1.5 flex flex-col items-center gap-1 overflow-hidden">
                        <div className="w-10 h-1.5 bg-slate-900 rounded-sm mt-0.5"></div>
                        <div className="w-14 h-0.5 bg-slate-300 rounded-sm"></div>
                        <div className="w-full border-t border-slate-150 my-0.5"></div>
                        <div className="w-4/5 h-0.5 bg-slate-200 rounded-sm"></div>
                        <div className="w-full h-0.5 bg-slate-150 rounded-sm"></div>
                        <div className="w-3/5 h-0.5 bg-slate-150 rounded-sm"></div>
                      </div>
                    )}
                    {tpl.id === "can" && (
                      <div className="w-full h-full bg-white rounded border border-slate-200 flex overflow-hidden">
                        <div className="w-1/3 bg-slate-905 p-1 flex flex-col items-center gap-1 shrink-0">
                          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                          <div className="w-5 h-0.5 bg-slate-400 rounded-sm"></div>
                          <div className="w-4 h-0.5 bg-slate-500 rounded-sm"></div>
                        </div>
                        <div className="flex-1 p-1 space-y-0.5">
                          <div className="w-10 h-1 bg-slate-800 rounded-sm"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded-sm"></div>
                          <div className="w-4/5 h-0.5 bg-slate-200 rounded-sm"></div>
                        </div>
                      </div>
                    )}
                    {tpl.id === "minimal" && (
                      <div className="w-full h-full bg-white rounded border border-slate-200 p-1.5 flex flex-col gap-1 overflow-hidden justify-between">
                        <div className="flex justify-between items-center">
                          <div className="w-6 h-1.5 bg-slate-800 rounded-sm"></div>
                          <div className="w-8 h-0.5 bg-slate-300 rounded-sm"></div>
                        </div>
                        <div className="space-y-0.5">
                          <div className="w-full h-0.5 bg-slate-100 rounded-sm"></div>
                          <div className="w-full h-0.5 bg-slate-100 rounded-sm"></div>
                        </div>
                        <div className="flex justify-between gap-1 pt-1 border-t border-slate-100">
                          <div className="w-6 h-0.5 bg-slate-200 rounded-sm"></div>
                          <div className="w-6 h-0.5 bg-slate-200 rounded-sm"></div>
                        </div>
                      </div>
                    )}
                    {tpl.id === "creative" && (
                      <div className="w-full h-full bg-white rounded border border-slate-200 p-1 flex flex-col gap-0.5 overflow-hidden">
                        <div className="bg-slate-900 rounded p-0.5 flex justify-between items-center shrink-0">
                          <div className="space-y-0.5">
                            <div className="w-6 h-1 bg-white rounded-sm"></div>
                            <div className="w-4 h-0.5 bg-blue-300 rounded-sm"></div>
                          </div>
                          <div className="w-2 h-2 bg-slate-700 rounded-sm"></div>
                        </div>
                        <div className="flex gap-1 flex-1 mt-0.5">
                          <div className="flex-1 space-y-0.5">
                            <div className="w-full h-0.5 bg-slate-200 rounded-sm"></div>
                            <div className="w-4/5 h-0.5 bg-slate-200 rounded-sm"></div>
                          </div>
                          <div className="w-1/3 bg-slate-50 border border-slate-100 p-0.5 rounded space-y-0.5 shrink-0">
                            <div className="w-full h-0.5 bg-slate-300 rounded-sm"></div>
                            <div className="w-full h-0.5 bg-slate-350 rounded-sm"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowTemplatesModal(false)}
              className="absolute top-4 right-4 font-bold text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top bar controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-200 p-4 rounded-xl shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
              <ArrowLeft className="h-4 w-4 text-slate-500" />
            </Link>
            <div>
              <h1 className="font-black text-slate-900 text-lg leading-tight">{name || "Untitled Resume"}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">TejoMarg AI Resume Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setShowTemplatesModal(true)}
              className="flex-1 sm:flex-initial bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Layout className="h-4 w-4" /> Templates
            </button>
            <button 
              onClick={handlePrint}
              className="flex-1 sm:flex-initial bg-[#208f60] hover:bg-[#1a7650] text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDE: Input Form Accordions */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 1. Personal Information */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleSection("personal")}
                className="w-full p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors"
              >
                <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-400" /> Personal Information
                </span>
                {openSection === "personal" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {openSection === "personal" && (
                <div className="p-4 border-t border-slate-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-transparent font-semibold" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Preferred Role</label>
                      <input type="text" value={preferredRole} onChange={e => setPreferredRole(e.target.value)} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-transparent font-semibold" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Email Address</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-transparent font-semibold" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Mobile Number</label>
                      <input type="text" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-transparent font-semibold" />
                    </div>
                    
                    {/* Profile Photo Upload */}
                    <div className="col-span-2 flex items-center gap-4 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <img src={photoUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-white" />
                      <div className="flex-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Profile Picture</label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload} 
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" 
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Current City & State</label>
                      <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-transparent font-semibold" />
                    </div>
                    <div className="col-span-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Professional Summary</label>
                        <button 
                          type="button"
                          onClick={handleAiSummary}
                          disabled={loadingAi}
                          className="text-emerald-600 hover:text-emerald-700 font-bold text-[10px] flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded cursor-pointer disabled:opacity-50"
                        >
                          {loadingAi ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                          <span>Write with AI</span>
                        </button>
                      </div>
                      <textarea 
                        rows={3} 
                        value={summary} 
                        onChange={e => setSummary(e.target.value)} 
                        className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-transparent font-semibold resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Work Experience */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleSection("experience")}
                className="w-full p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors"
              >
                <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Award className="h-4 w-4 text-slate-400" /> Work Experience
                </span>
                {openSection === "experience" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {openSection === "experience" && (
                <div className="p-4 border-t border-slate-100 space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-2 p-3 bg-slate-50 border border-slate-150 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Experience #{idx + 1}</span>
                        <button 
                          onClick={() => setExperience(experience.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 p-0.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Job Title" value={exp.role} onChange={e => {
                          const updated = [...experience];
                          updated[idx].role = e.target.value;
                          setExperience(updated);
                        }} className="border p-1.5 text-xs bg-white rounded" />
                        <input type="text" placeholder="Company Name" value={exp.company} onChange={e => {
                          const updated = [...experience];
                          updated[idx].company = e.target.value;
                          setExperience(updated);
                        }} className="border p-1.5 text-xs bg-white rounded" />
                        <input type="text" placeholder="Duration (e.g. 2024 - Present)" value={exp.duration} onChange={e => {
                          const updated = [...experience];
                          updated[idx].duration = e.target.value;
                          setExperience(updated);
                        }} className="border p-1.5 text-xs bg-white rounded col-span-2" />
                        <textarea placeholder="Description of key tasks..." value={exp.description} onChange={e => {
                          const updated = [...experience];
                          updated[idx].description = e.target.value;
                          setExperience(updated);
                        }} className="border p-1.5 text-xs bg-white rounded col-span-2 resize-none" rows={2} />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setExperience([...experience, { company: "", role: "", duration: "", description: "" }])}
                    className="w-full py-2 border border-dashed border-emerald-500 rounded text-emerald-600 hover:bg-emerald-50/20 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Experience Row
                  </button>
                </div>
              )}
            </div>

            {/* 3. Education */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleSection("education")}
                className="w-full p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors"
              >
                <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-400" /> Education History
                </span>
                {openSection === "education" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {openSection === "education" && (
                <div className="p-4 border-t border-slate-100 space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="space-y-2 p-3 bg-slate-50 border border-slate-150 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Education #{idx + 1}</span>
                        <button 
                          onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 p-0.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Degree / Course" value={edu.degree} onChange={e => {
                          const updated = [...education];
                          updated[idx].degree = e.target.value;
                          setEducation(updated);
                        }} className="border p-1.5 text-xs bg-white rounded" />
                        <input type="text" placeholder="School / University" value={edu.school} onChange={e => {
                          const updated = [...education];
                          updated[idx].school = e.target.value;
                          setEducation(updated);
                        }} className="border p-1.5 text-xs bg-white rounded" />
                        <input type="text" placeholder="Graduation Year (e.g. 2023 - 2026)" value={edu.year} onChange={e => {
                          const updated = [...education];
                          updated[idx].year = e.target.value;
                          setEducation(updated);
                        }} className="border p-1.5 text-xs bg-white rounded col-span-2" />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setEducation([...education, { school: "", degree: "", year: "" }])}
                    className="w-full py-2 border border-dashed border-emerald-500 rounded text-emerald-600 hover:bg-emerald-50/20 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Education Row
                  </button>
                </div>
              )}
            </div>

            {/* 4. Skills & Extras */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleSection("skills")}
                className="w-full p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors"
              >
                <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-400" /> Skills & Details
                </span>
                {openSection === "skills" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {openSection === "skills" && (
                <div className="p-4 border-t border-slate-100 space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Technical Skills (comma separated)</label>
                    <input type="text" value={skillsText} onChange={e => setSkillsText(e.target.value)} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-transparent font-semibold" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Certifications (comma separated)</label>
                    <input type="text" value={certificationsText} onChange={e => setCertificationsText(e.target.value)} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-transparent font-semibold" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Languages (comma separated)</label>
                    <input type="text" value={languagesText} onChange={e => setLanguagesText(e.target.value)} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-transparent font-semibold" />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDE: Live A4 sheet Preview */}
          <div className="lg:col-span-7 flex justify-center">
            
            <div 
              id="resume-sheet"
              className="w-full max-w-[595px] min-h-[842px] bg-white border border-slate-300 rounded-xl p-8 sm:p-10 shadow-lg text-slate-800 flex flex-col justify-between font-sans scale-[0.95] sm:scale-100 origin-top"
            >
              {/* Dynamic render depending on selected template */}
              {selectedTemplate === "david" && (
                <div className="space-y-6">
                  {/* Header Column Style */}
                  <div className="flex justify-between items-start border-b pb-6 border-slate-100">
                    <div className="flex items-start gap-4">
                      {photoUrl && (
                        <img src={photoUrl} alt={name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none">{name}</h2>
                        <p className="text-sm font-bold text-emerald-600">{preferredRole}</p>
                        <p className="text-[11px] text-slate-500 italic max-w-[280px] pt-1">{summary}</p>
                      </div>
                    </div>

                    <div className="text-right space-y-1 text-[11px] text-slate-500 font-semibold shrink-0">
                      <p className="flex items-center justify-end gap-1"><Mail className="h-3 w-3 text-slate-450" /> {email}</p>
                      <p className="flex items-center justify-end gap-1"><Phone className="h-3 w-3 text-slate-450" /> {mobile}</p>
                      <p className="flex items-center justify-end gap-1"><MapPin className="h-3 w-3 text-slate-450" /> {city}</p>
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b pb-1">Work Experience</h3>
                    <div className="space-y-4 pl-4 border-l border-slate-200">
                      {experience.map((exp, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-emerald-600"></div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-extrabold text-xs text-slate-900">{exp.role} <span className="text-slate-400 font-normal">at</span> {exp.company}</h4>
                            <span className="text-[10px] font-bold text-slate-400">{exp.duration}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b pb-1">Education</h3>
                    <div className="space-y-3 pl-4 border-l border-slate-200">
                      {education.map((edu, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-slate-300"></div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-extrabold text-xs text-slate-900">{edu.degree}</h4>
                            <span className="text-[10px] font-bold text-slate-400">{edu.year}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{edu.school}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b pb-1">Skills & Tools</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skillsText.split(",").map((s, i) => (
                        <span key={i} className="text-[9px] bg-slate-100 font-semibold px-2 py-0.5 rounded text-slate-600">{s.trim()}</span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications & Languages */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase font-bold text-slate-400">Certifications</h4>
                      <ul className="list-disc list-inside text-[10px] text-slate-600 font-medium space-y-1">
                        {certificationsText.split(",").map((c, i) => (
                          <li key={i}>{c.trim()}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase font-bold text-slate-400">Languages</h4>
                      <div className="flex flex-wrap gap-1">
                        {languagesText.split(",").map((l, i) => (
                          <span key={i} className="text-[9px] border border-slate-200 px-2 py-0.5 rounded text-slate-500 font-semibold">{l.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {selectedTemplate === "classic" && (
                <div className="space-y-6 text-center">
                  {/* Traditional centered header */}
                  <div className="border-b-2 border-slate-900 pb-4 space-y-2">
                    {photoUrl && (
                      <img src={photoUrl} alt={name} className="w-16 h-16 rounded-full mx-auto object-cover border border-slate-350 shadow-sm" />
                    )}
                    <h2 className="font-extrabold text-3xl text-slate-950 tracking-wide uppercase">{name}</h2>
                    <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">{preferredRole}</p>
                    <div className="flex justify-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">
                      <span>{email}</span>
                      <span>•</span>
                      <span>{mobile}</span>
                      <span>•</span>
                      <span>{city}</span>
                    </div>
                  </div>

                  {/* Profile Summary */}
                  <div className="space-y-2 text-left">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest border-b pb-1 border-slate-200">Professional Summary</h3>
                    <p className="text-[11px] text-slate-650 leading-relaxed font-serif italic">{summary}</p>
                  </div>

                  {/* Experience */}
                  <div className="space-y-3 text-left">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest border-b pb-1 border-slate-200">Employment History</h3>
                    <div className="space-y-4">
                      {experience.map((exp, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-baseline font-bold text-xs">
                            <span className="text-slate-900">{exp.role} — {exp.company}</span>
                            <span className="text-[10px] text-slate-500">{exp.duration}</span>
                          </div>
                          <p className="text-[10px] text-slate-600 leading-normal">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-3 text-left">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest border-b pb-1 border-slate-200">Education</h3>
                    <div className="space-y-3">
                      {education.map((edu, i) => (
                        <div key={i} className="space-y-0.5">
                          <div className="flex justify-between items-baseline font-bold text-xs">
                            <span className="text-slate-900">{edu.degree}</span>
                            <span className="text-[10px] text-slate-500">{edu.year}</span>
                          </div>
                          <p className="text-[10px] text-slate-600">{edu.school}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2 text-left">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest border-b pb-1 border-slate-200">Key Skillsets</h3>
                    <p className="text-[10px] text-slate-600 font-semibold leading-relaxed">{skillsText}</p>
                  </div>

                  {/* Footing note */}
                  <div className="text-[9px] text-slate-400 italic pt-6 border-t border-slate-100">
                    References available upon request.
                  </div>
                </div>
              )}

              {selectedTemplate === "can" && (
                <div className="grid grid-cols-12 gap-6 min-h-[740px]">
                  
                  {/* Left Column - Deep Slate blue background effect */}
                  <div className="col-span-4 bg-slate-900 text-white rounded-xl p-4 flex flex-col justify-between space-y-6 select-none -m-4">
                    <div className="space-y-6">
                      
                      {/* Photo & Name */}
                      <div className="text-center space-y-3">
                        <img src={photoUrl} alt={name} className="w-16 h-16 rounded-full border-2 border-emerald-500 mx-auto object-cover shadow-inner" />
                        <div>
                          <h2 className="font-extrabold text-base tracking-tight text-white leading-tight">{name}</h2>
                          <p className="text-[10px] font-bold text-emerald-400 mt-0.5">{preferredRole}</p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="space-y-2 text-[10px] text-slate-300 font-semibold border-t border-slate-800 pt-4">
                        <p className="truncate">Email: {email}</p>
                        <p>Phone: {mobile}</p>
                        <p>Loc: {city}</p>
                      </div>

                      {/* Skills value meters */}
                      <div className="space-y-3 border-t border-slate-800 pt-4">
                        <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Skills</h4>
                        <div className="space-y-2">
                          {skillsText.split(",").slice(0, 5).map((s, i) => (
                            <div key={i} className="space-y-1">
                              <span className="text-[9px] text-slate-200 block font-semibold">{s.trim()}</span>
                              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${90 - (i * 8)}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Footer info */}
                    <div className="text-[8px] text-slate-500 border-t border-slate-800 pt-2 text-center">
                      TejoMarg CV Builder
                    </div>
                  </div>

                  {/* Right Column - Contents */}
                  <div className="col-span-8 space-y-6 pl-4">
                    
                    {/* Summary */}
                    <div className="space-y-2">
                      <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b pb-1">About Me</h3>
                      <p className="text-[10px] text-slate-650 leading-relaxed font-semibold">{summary}</p>
                    </div>

                    {/* Experience */}
                    <div className="space-y-3">
                      <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b pb-1">Experience</h3>
                      <div className="space-y-4">
                        {experience.map((exp, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-baseline font-bold text-xs">
                              <span className="text-slate-900">{exp.role} <span className="font-normal text-slate-500">at</span> {exp.company}</span>
                              <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">{exp.duration}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-normal">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="space-y-3">
                      <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b pb-1">Education</h3>
                      <div className="space-y-3">
                        {education.map((edu, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-baseline font-bold text-xs">
                              <span className="text-slate-900">{edu.degree}</span>
                              <span className="text-[9px] text-slate-400">{edu.year}</span>
                            </div>
                            <p className="text-[10px] text-slate-500">{edu.school}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="space-y-2">
                      <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b pb-1">Certifications</h3>
                      <ul className="list-disc list-inside text-[10px] text-slate-600 font-semibold space-y-1">
                        {certificationsText.split(",").map((c, i) => (
                          <li key={i}>{c.trim()}</li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>
              )}

              {selectedTemplate === "minimal" && (
                <div className="space-y-5 text-slate-800">
                  <div className="flex justify-between items-center border-b pb-4 border-slate-200">
                    <div className="flex items-center gap-3">
                      {photoUrl && (
                        <img src={photoUrl} alt={name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                      )}
                      <div>
                        <h2 className="font-light text-2xl tracking-wide text-slate-900">{name}</h2>
                        <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">{preferredRole}</p>
                      </div>
                    </div>
                    <div className="text-right text-[9px] text-slate-500 space-y-0.5">
                      <p>{email} | {mobile}</p>
                      <p>{city}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-relaxed border-b pb-3 border-slate-100">{summary}</p>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-slate-800 mb-2">Experience</h3>
                      <div className="space-y-3">
                        {experience.map((exp, i) => (
                          <div key={i} className="text-[10px]">
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>{exp.role} — {exp.company}</span>
                              <span className="font-normal text-slate-400">{exp.duration}</span>
                            </div>
                            <p className="text-slate-500 mt-0.5 leading-normal">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-slate-800 mb-2">Education</h3>
                      <div className="space-y-2">
                        {education.map((edu, i) => (
                          <div key={i} className="text-[10px] flex justify-between">
                            <div>
                              <span className="font-bold text-slate-900">{edu.degree}</span>, <span className="text-slate-500">{edu.school}</span>
                            </div>
                            <span className="text-slate-400">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div>
                        <h4 className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Skills</h4>
                        <p className="text-[10px] text-slate-600 font-medium">{skillsText}</p>
                      </div>
                      <div>
                        <h4 className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Certifications</h4>
                        <p className="text-[10px] text-slate-600 font-medium">{certificationsText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "creative" && (
                <div className="space-y-5">
                  {/* Top Header Card */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-xl -m-4 mb-4 flex items-center justify-between shadow-md">
                    <div className="space-y-1">
                      <h2 className="font-black text-2xl tracking-tight text-white">{name}</h2>
                      <p className="text-xs font-bold text-emerald-450 uppercase tracking-widest">{preferredRole}</p>
                      <p className="text-[10px] text-slate-300 max-w-sm pt-1 leading-normal">{summary}</p>
                    </div>
                    {photoUrl && (
                      <img src={photoUrl} alt={name} className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-md shrink-0 ml-4" />
                    )}
                  </div>

                  {/* Two Column Grid */}
                  <div className="grid grid-cols-12 gap-5 pt-2">
                    {/* Left Column (Main details) */}
                    <div className="col-span-8 space-y-4">
                      <div>
                        <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-2 border-b pb-1">Experience</h3>
                        <div className="space-y-3">
                          {experience.map((exp, i) => (
                            <div key={i} className="text-[10px] space-y-0.5">
                              <h4 className="font-extrabold text-slate-900">{exp.role} at <span className="text-emerald-600">{exp.company}</span></h4>
                              <p className="text-[9px] text-slate-400 font-bold">{exp.duration}</p>
                              <p className="text-slate-500 leading-normal">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-2 border-b pb-1">Education</h3>
                        <div className="space-y-2">
                          {education.map((edu, i) => (
                            <div key={i} className="text-[10px]">
                              <div className="flex justify-between font-bold text-slate-900">
                                <span>{edu.degree}</span>
                                <span className="text-[9px] text-slate-400">{edu.year}</span>
                              </div>
                              <p className="text-slate-500">{edu.school}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column (Sidebar details) */}
                    <div className="col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 -m-2">
                      <div className="text-[10px] space-y-1.5 font-semibold text-slate-600 border-b pb-3">
                        <h4 className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Contact</h4>
                        <p className="truncate">📧 {email}</p>
                        <p>📞 {mobile}</p>
                        <p>📍 {city}</p>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {skillsText.split(",").map((s, i) => (
                            <span key={i} className="text-[8px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-semibold">{s.trim()}</span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Languages</h4>
                        <p className="text-[9px] text-slate-600 font-bold">{languagesText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
