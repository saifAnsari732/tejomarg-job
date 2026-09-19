"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { 
  Upload, FileText, Plus, Trash2, Loader2, Save, MapPin, 
  Building2, Briefcase, Mail, Phone, Calendar, User as UserIcon, 
  Home, ChevronRight, Edit2, Check, X, GraduationCap, Languages, 
  Camera, ExternalLink, Award, Sparkles, Globe, Clock, IndianRupee, 
  ShieldCheck, Zap, AlertCircle
} from "lucide-react";
import { TagInput } from "@/components/ui/TagInput";

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string;
  skills: string; // comma separated for this UI
  industry?: string;
}

interface EducationItem {
  school: string;
  degree: string;
  year: string;
}

interface CertificationItem {
  name: string;
  imageUrl?: string;
}

export default function CandidateProfilePage() {
  const { update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Profile data states
  const [avatarUrl, setAvatarUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [homeTown, setHomeTown] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [totalExperience, setTotalExperience] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("0");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [highestEducation, setHighestEducation] = useState("");
  const [schoolMedium, setSchoolMedium] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [spokenEnglishLevel, setSpokenEnglishLevel] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [preferredJobTitles, setPreferredJobTitles] = useState<string[]>([]);

  // Section Editing toggles
  const [editBasic, setEditBasic] = useState(false);
  const [editWork, setEditWork] = useState(false);
  const [editSingle, setEditSingle] = useState(false);
  const [editEdu, setEditEdu] = useState(false);
  const [editSkills, setEditSkills] = useState(false);
  const [editCert, setEditCert] = useState(false);
  const [editLang, setEditLang] = useState(false);
  const [editOther, setEditOther] = useState(false);

  // Temporary edit states
  const [tempBasic, setTempBasic] = useState({ name: "", mobile: "", dob: "", gender: "", homeTown: "", currentLocation: "" });
  const [tempSingle, setTempSingle] = useState({ totalExperience: "", expectedSalary: "0", noticePeriod: "" });
  const [tempEdu, setTempEdu] = useState({ highestEducation: "", schoolMedium: "" });
  const [tempSkillsText, setTempSkillsText] = useState("");
  const [tempLanguagesText, setTempLanguagesText] = useState("");
  const [tempPreferredRolesText, setTempPreferredRolesText] = useState("");

  // Calculate Profile Completeness
  const calculateCompleteness = () => {
    let score = 0;
    if (name) score += 15;
    if (mobile) score += 15;
    if (currentLocation) score += 10;
    if (highestEducation || education.length > 0) score += 15;
    if (skills.length > 0) score += 15;
    if (experience.length > 0 || totalExperience) score += 15;
    if (resumeUrl) score += 15;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  // Fetch initial profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/candidate/profile");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load profile");
        }

        const u = data.user;
        setName(u.name || "");
        setEmail(u.email || "");
        
        const cp = u.candidateProfile || {};
        setMobile(cp.mobile || "");
        setDob(cp.dob || "");
        setGender(cp.gender || "");
        setHomeTown(cp.homeTown || "");
        setCurrentLocation(cp.preferredLocation || "");
        setTotalExperience(cp.totalExperience || "");
        setExpectedSalary(cp.expectedSalary?.toString() || "0");
        setNoticePeriod(cp.noticePeriod || "");
        setHighestEducation(cp.highestEducation || "");
        setSchoolMedium(cp.schoolMedium || "");
        setSkills(cp.skills || []);
        setExperience(cp.experience || []);
        setEducation(cp.education || []);
        setCertifications(cp.certifications || []);
        setLanguages(cp.languages || []);
        setSpokenEnglishLevel(cp.spokenEnglishLevel || "");
        setResumeUrl(cp.resumeUrl || "");
        setAvatarUrl(cp.avatarUrl || "");
        setPreferredJobTitles(cp.preferredJobTitles || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to retrieve profile data");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // Save specific section
  const handleSave = async (sectionPayload: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/candidate/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          expectedSalary,
          preferredLocation: currentLocation,
          skills,
          experience,
          education,
          resumeUrl,
          mobile,
          dob,
          gender,
          homeTown,
          totalExperience,
          noticePeriod,
          highestEducation,
          schoolMedium,
          certifications,
          languages,
          spokenEnglishLevel,
          preferredJobTitles,
          ...sectionPayload
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update state locally
      if (sectionPayload.name !== undefined) setName(sectionPayload.name);
      if (sectionPayload.mobile !== undefined) setMobile(sectionPayload.mobile);
      if (sectionPayload.dob !== undefined) setDob(sectionPayload.dob);
      if (sectionPayload.gender !== undefined) setGender(sectionPayload.gender);
      if (sectionPayload.homeTown !== undefined) setHomeTown(sectionPayload.homeTown);
      if (sectionPayload.preferredLocation !== undefined) setCurrentLocation(sectionPayload.preferredLocation);
      if (sectionPayload.totalExperience !== undefined) setTotalExperience(sectionPayload.totalExperience);
      if (sectionPayload.expectedSalary !== undefined) setExpectedSalary(sectionPayload.expectedSalary);
      if (sectionPayload.noticePeriod !== undefined) setNoticePeriod(sectionPayload.noticePeriod);
      if (sectionPayload.highestEducation !== undefined) setHighestEducation(sectionPayload.highestEducation);
      if (sectionPayload.schoolMedium !== undefined) setSchoolMedium(sectionPayload.schoolMedium);
      if (sectionPayload.skills !== undefined) setSkills(sectionPayload.skills);
      if (sectionPayload.experience !== undefined) setExperience(sectionPayload.experience);
      if (sectionPayload.education !== undefined) setEducation(sectionPayload.education);
      if (sectionPayload.certifications !== undefined) setCertifications(sectionPayload.certifications);
      if (sectionPayload.languages !== undefined) setLanguages(sectionPayload.languages);
      if (sectionPayload.spokenEnglishLevel !== undefined) setSpokenEnglishLevel(sectionPayload.spokenEnglishLevel);
      if (sectionPayload.preferredJobTitles !== undefined) setPreferredJobTitles(sectionPayload.preferredJobTitles);

      // Update NextAuth session so Navbar and Sidebar reflect changes instantly
      if (sectionPayload.name !== undefined || sectionPayload.avatarUrl !== undefined) {
        await update({
          name: sectionPayload.name !== undefined ? sectionPayload.name : name,
          picture: sectionPayload.avatarUrl !== undefined ? sectionPayload.avatarUrl : avatarUrl,
        });
      }

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Upload Resume
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        setResumeUrl(data.url);
        
        const payload: any = { resumeUrl: data.url };
        
        if (data.parsedData) {
          const pd = data.parsedData;
          if (pd.name) payload.name = pd.name;
          if (pd.mobile) payload.mobile = pd.mobile;
          if (pd.highestEducation) payload.highestEducation = pd.highestEducation;
          if (pd.totalExperience) payload.totalExperience = pd.totalExperience;
          if (pd.currentLocation) payload.preferredLocation = pd.currentLocation;
          if (pd.skills) payload.skills = typeof pd.skills === 'string' ? pd.skills.split(',').map((s: string) => s.trim()) : pd.skills;
          if (pd.experience && Array.isArray(pd.experience)) payload.experience = pd.experience;
          if (pd.education && Array.isArray(pd.education)) payload.education = pd.education;
          
          toast.success("AI successfully extracted details from your resume!");
        }

        await handleSave(payload);
        if (!data.parsedData) {
          toast.success("Resume uploaded successfully!");
        }
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setAvatarUrl(data.url);
        await handleSave({ avatarUrl: data.url });
        toast.success("Profile picture updated!");
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 gap-2 bg-slate-50 min-h-screen">
        <Loader2 className="animate-spin h-6 w-6 text-indigo-600" />
        <span className="font-semibold">Loading candidate profile...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-900 min-h-screen -mt-6 pt-6 -mx-4 px-4 sm:-mx-8 sm:px-8 text-sm selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-16">
        
        {/* LEFT COLUMN: Sticky Info & Activities */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          
          {/* Main User Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative">
            
            {/* Header Banner */}
            <div className="h-32 bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 relative overflow-hidden">
              <div className="absolute top-[-50%] right-[-20%] w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-[-50%] left-[-20%] w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <button 
                onClick={() => {
                  if (editBasic) {
                    handleSave({
                      name: tempBasic.name,
                      mobile: tempBasic.mobile,
                      dob: tempBasic.dob,
                      gender: tempBasic.gender,
                      homeTown: tempBasic.homeTown,
                      preferredLocation: tempBasic.currentLocation
                    });
                    setEditBasic(false);
                  } else {
                    setTempBasic({ name, mobile, dob, gender, homeTown, currentLocation });
                    setEditBasic(true);
                  }
                }}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 bg-white/10 backdrop-blur-md rounded-xl transition-all z-10 border border-white/20 shadow-md"
                title={editBasic ? "Save Changes" : "Edit Basic Details"}
              >
                {editBasic ? <Check className="h-4 w-4 text-emerald-400" /> : <Edit2 className="h-4 w-4" />}
              </button>
            </div>

            <div className="px-6 pb-6 relative -mt-14">
              {/* Avatar & Top Identity */}
              <div className="flex flex-col items-start gap-4">
                <div className="relative w-24 h-24 rounded-full ring-4 ring-white dark:ring-slate-800 bg-slate-100 dark:bg-slate-700 shadow-xl flex items-center justify-center overflow-hidden group">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-tr from-indigo-600 to-blue-500">
                      {name.split(" ").map(n => n[0]).join("").toUpperCase() || "C"}
                    </span>
                  )}
                  {/* Avatar Upload Overlay */}
                  <label className="absolute inset-0 bg-slate-900/60 hidden group-hover:flex flex-col items-center justify-center cursor-pointer text-white transition-all backdrop-blur-xs">
                    {uploadingAvatar ? <Loader2 className="animate-spin h-5 w-5" /> : <Camera className="h-6 w-6 text-cyan-300" />}
                    <span className="text-[9px] font-bold mt-1">Change</span>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
                
                <div className="w-full">
                  <h2 className="font-extrabold text-slate-900 dark:text-white text-2xl leading-tight tracking-tight">{name || "Candidate"}</h2>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
                      <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                      {experience[0]?.role ? `${experience[0].role}` : "Fresher"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {currentLocation || "Location Unspecified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Completeness Bar */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-slate-50 to-blue-50/50 dark:from-slate-750 dark:to-slate-800 border border-indigo-100/60 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-amber-500 fill-amber-500" /> Profile Strength
                  </span>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{completeness}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 via-blue-500 to-emerald-400 rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
                {completeness < 100 && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    💡 Tip: {resumeUrl ? "Add skills & education to reach 100%" : "Upload resume to boost profile strength"}
                  </p>
                )}
              </div>

              <hr className="border-slate-100 dark:border-slate-750 my-6" />

              {/* Basic Details List */}
              {editBasic ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                    <input type="text" value={tempBasic.name} onChange={e => setTempBasic({...tempBasic, name: e.target.value})} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Mobile Number</label>
                    <input type="text" value={tempBasic.mobile} onChange={e => setTempBasic({...tempBasic, mobile: e.target.value})} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Date of Birth</label>
                      <input type="text" placeholder="DD/MM/YYYY" value={tempBasic.dob} onChange={e => setTempBasic({...tempBasic, dob: e.target.value})} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Gender</label>
                      <select value={tempBasic.gender} onChange={e => setTempBasic({...tempBasic, gender: e.target.value})} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Current Location</label>
                    <input type="text" value={tempBasic.currentLocation} onChange={e => setTempBasic({...tempBasic, currentLocation: e.target.value})} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Home Town</label>
                    <input type="text" value={tempBasic.homeTown} onChange={e => setTempBasic({...tempBasic, homeTown: e.target.value})} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-750">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Email ID</span>
                    <span className="text-slate-900 dark:text-white font-bold text-xs break-all flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      {email}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-750">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Mobile</span>
                    <span className="text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {mobile || "Not set"}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-750">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Date of Birth</span>
                    <span className="text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      {dob || "Not set"}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-750">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Gender</span>
                    <span className="text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5">
                      <UserIcon className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                      {gender || "Not set"}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-750">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Location</span>
                    <span className="text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {currentLocation || "Not set"}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-750">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Home Town</span>
                    <span className="text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5 truncate">
                      <Home className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      {homeTown || "Not set"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activities Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">My Activities</h3>
            <Link 
              href="/candidate" 
              className="flex items-center justify-between border border-slate-100 dark:border-slate-700 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 hover:bg-white hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
            >
              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">My Applications</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Track active jobs applied & interviews</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        {/* RIGHT COLUMN: Bio Sections & Cards */}
        <div className="lg:col-span-8 space-y-6">

          {/* Top Quick Stats Row (Experience, Salary, Notice Period) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
            <button 
              onClick={() => {
                if (editSingle) {
                  handleSave({
                    totalExperience: tempSingle.totalExperience,
                    expectedSalary: tempSingle.expectedSalary,
                    noticePeriod: tempSingle.noticePeriod
                  });
                  setEditSingle(false);
                } else {
                  setTempSingle({ totalExperience, expectedSalary, noticePeriod });
                  setEditSingle(true);
                }
              }}
              className="absolute -top-3 right-0 text-indigo-600 dark:text-indigo-400 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md z-10 hover:scale-105 transition-transform"
              title="Edit Key Metrics"
            >
              {editSingle ? <Check className="h-4 w-4 text-emerald-500" /> : <Edit2 className="h-4 w-4" />}
            </button>

            {editSingle ? (
              <div className="col-span-3 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xl">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Total Experience</label>
                  <input type="text" placeholder="e.g. 2 Years / Fresher" value={tempSingle.totalExperience} onChange={e => setTempSingle({...tempSingle, totalExperience: e.target.value})} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Monthly Salary (₹)</label>
                  <input type="number" placeholder="25000" value={tempSingle.expectedSalary} onChange={e => setTempSingle({...tempSingle, expectedSalary: e.target.value})} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Notice Period</label>
                  <input type="text" placeholder="e.g. Immediate / 15 days" value={tempSingle.noticePeriod} onChange={e => setTempSingle({...tempSingle, noticePeriod: e.target.value})} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 dark:text-white" />
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Total Experience</span>
                    <span className="text-slate-900 dark:text-white font-extrabold text-base mt-0.5 block">{totalExperience || "Fresher"}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    <IndianRupee className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Expected Salary</span>
                    <span className="text-slate-900 dark:text-white font-extrabold text-base mt-0.5 block">₹ {parseInt(expectedSalary || "0").toLocaleString()} / mo</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Notice Period</span>
                    <span className="text-slate-900 dark:text-white font-extrabold text-base mt-0.5 block">{noticePeriod || "Immediate"}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Work Experience Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                Work Experience
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const newExp = [...experience, { company: "", role: "", duration: "", description: "", skills: "" }];
                    setExperience(newExp);
                    setEditWork(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950 dark:text-indigo-400 transition-all shadow-xs"
                >
                  <Plus className="h-4 w-4" /> Add Experience
                </button>
                <button 
                  onClick={() => {
                    if (editWork) {
                      handleSave({ experience });
                      setEditWork(false);
                    } else {
                      setEditWork(true);
                    }
                  }}
                  className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-all"
                >
                  {editWork ? <Check className="h-4 w-4 text-emerald-500" /> : <Edit2 className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {experience.length > 0 ? (
              <div className="space-y-6 relative pl-6 border-l-2 border-indigo-100 dark:border-indigo-900/50">
                {experience.map((exp, idx) => (
                  <div key={idx} className="relative space-y-3">
                    {/* Timeline Connector Dot */}
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-4 border-indigo-600 shadow-sm" />

                    {editWork ? (
                      <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Job Title / Role</label>
                            <input type="text" value={exp.role} onChange={e => {
                              const updated = [...experience];
                              updated[idx].role = e.target.value;
                              setExperience(updated);
                            }} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 dark:text-white" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Company Name</label>
                            <input type="text" value={exp.company} onChange={e => {
                              const updated = [...experience];
                              updated[idx].company = e.target.value;
                              setExperience(updated);
                            }} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 dark:text-white" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Duration</label>
                            <input type="text" placeholder="e.g. Mar 2024 - Present" value={exp.duration} onChange={e => {
                              const updated = [...experience];
                              updated[idx].duration = e.target.value;
                              setExperience(updated);
                            }} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 dark:text-white" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Skills Used</label>
                            <TagInput 
                              tags={exp.skills ? exp.skills.split(",").map(s => s.trim()).filter(Boolean) : []} 
                              onChange={(newTags) => {
                                const updated = [...experience];
                                updated[idx].skills = newTags.join(", ");
                                setExperience(updated);
                              }} 
                              placeholder="Add skill..."
                              suggestions={["React", "Node.js", "JavaScript", "TypeScript", "Python", "Java", "C++", "SQL", "MongoDB", "AWS", "Docker"]}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Key Responsibilities / Description</label>
                          <textarea value={exp.description} onChange={e => {
                            const updated = [...experience];
                            updated[idx].description = e.target.value;
                            setExperience(updated);
                          }} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 dark:text-white" rows={2} />
                        </div>
                        <button onClick={() => {
                          setExperience(experience.filter((_, i) => i !== idx));
                        }} className="text-rose-600 hover:text-rose-700 text-xs font-extrabold flex items-center gap-1.5 pt-1">
                          <Trash2 className="h-4 w-4" /> Remove Experience
                        </button>
                      </div>
                    ) : (
                      <div className="bg-slate-50/80 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-750 hover:bg-white transition-all space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">{exp.role}</h4>
                            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{exp.company}</p>
                          </div>
                          <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/50">
                            {exp.duration}
                          </span>
                        </div>
                        
                        {exp.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            {exp.description}
                          </p>
                        )}

                        {exp.skills && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {exp.skills.split(",").map((s, i) => (
                              <span key={i} className="text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300">
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-750">
                <Briefcase className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No work experience listed yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Add your past jobs, internships, or freelance work to highlight your expertise.</p>
              </div>
            )}
          </div>

          {/* Education Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                Education Qualification
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const newEdu = [...education, { school: "", degree: "", year: "" }];
                    setEducation(newEdu);
                    setEditEdu(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-950 dark:text-blue-400 transition-all shadow-xs"
                >
                  <Plus className="h-4 w-4" /> Add Education
                </button>
                <button 
                  onClick={() => {
                    if (editEdu) {
                      handleSave({ 
                        highestEducation: tempEdu.highestEducation,
                        schoolMedium: tempEdu.schoolMedium,
                        education
                      });
                      setEditEdu(false);
                    } else {
                      setTempEdu({ highestEducation, schoolMedium });
                      setEditEdu(true);
                    }
                  }}
                  className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-all"
                >
                  {editEdu ? <Check className="h-4 w-4 text-emerald-500" /> : <Edit2 className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {editEdu ? (
              <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Highest Education</label>
                    <input type="text" placeholder="e.g. B.Tech / Graduate" value={tempEdu.highestEducation} onChange={e => setTempEdu({...tempEdu, highestEducation: e.target.value})} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">School Medium</label>
                    <input type="text" placeholder="e.g. English / Hindi" value={tempEdu.schoolMedium} onChange={e => setTempEdu({...tempEdu, schoolMedium: e.target.value})} className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 dark:text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/60 to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-blue-100 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider">Highest Education</span>
                    <p className="text-slate-900 dark:text-white font-extrabold text-base mt-0.5">{highestEducation || "Graduate"}</p>
                  </div>
                  <GraduationCap className="h-6 w-6 text-blue-500 opacity-80" />
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-indigo-100 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider">School Medium</span>
                    <p className="text-slate-900 dark:text-white font-extrabold text-base mt-0.5">{schoolMedium || "English"}</p>
                  </div>
                  <Languages className="h-6 w-6 text-indigo-500 opacity-80" />
                </div>
              </div>
            )}

            {education.length > 0 ? (
              <div className="space-y-4 pl-6 border-l-2 border-blue-100 dark:border-blue-900/50">
                {education.map((edu, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-4 border-blue-500 shadow-sm" />

                    {editEdu ? (
                      <div className="space-y-3 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input type="text" placeholder="Degree / Stream" value={edu.degree} onChange={e => {
                            const updated = [...education];
                            updated[idx].degree = e.target.value;
                            setEducation(updated);
                          }} className="border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800" />
                          <input type="text" placeholder="School / University" value={edu.school} onChange={e => {
                            const updated = [...education];
                            updated[idx].school = e.target.value;
                            setEducation(updated);
                          }} className="border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800" />
                          <input type="text" placeholder="Batch / Year" value={edu.year} onChange={e => {
                            const updated = [...education];
                            updated[idx].year = e.target.value;
                            setEducation(updated);
                          }} className="border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800" />
                        </div>
                        <button onClick={() => {
                          setEducation(education.filter((_, i) => i !== idx));
                        }} className="text-rose-600 hover:text-rose-700 text-xs font-bold">Remove Qualification</button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-750 flex justify-between items-center">
                        <div>
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{edu.degree}</h4>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">{edu.school}</p>
                        </div>
                        <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full">
                          {edu.year}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-750">
                <GraduationCap className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No education qualifications specified</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Add your degrees, diplomas, or certifications to show academic qualifications.</p>
              </div>
            )}
          </div>

          {/* Professional Skills Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4 relative">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                Key Professional Skills
              </h3>
              <button 
                onClick={() => {
                  if (editSkills) {
                    const items = tempSkillsText.split(",").map(t => t.trim()).filter(t => t.length > 0);
                    handleSave({ skills: items });
                    setEditSkills(false);
                  } else {
                    setTempSkillsText(skills.join(", "));
                    setEditSkills(true);
                  }
                }}
                className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-all"
              >
                {editSkills ? <Check className="h-4 w-4 text-emerald-500" /> : <Edit2 className="h-4 w-4" />}
              </button>
            </div>
            
            {editSkills ? (
              <div className="space-y-3 pt-2">
                <TagInput 
                  tags={tempSkillsText ? tempSkillsText.split(",").map(s => s.trim()).filter(Boolean) : []}
                  onChange={(newTags) => setTempSkillsText(newTags.join(", "))}
                  placeholder="e.g. React, Node.js, Excel, Sales"
                  suggestions={["React", "Node.js", "JavaScript", "TypeScript", "Python", "Java", "C++", "SQL", "MongoDB", "AWS", "Docker", "Figma", "Excel", "Marketing", "Sales"]}
                />
              </div>
            ) : (
              <div className="pt-2">
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {skills.map((s, idx) => (
                      <span 
                        key={idx} 
                        className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-100/80 dark:border-indigo-800 px-4 py-2 rounded-xl font-extrabold text-xs shadow-xs hover:scale-105 transition-transform cursor-default"
                      >
                        ⚡ {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-750">
                    <Sparkles className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No professional skills saved yet</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Add your core technical or domain skills to get noticed by recruiters.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Certifications Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4 relative">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <Award className="h-5 w-5" />
                </div>
                Certifications & Badges
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const newCert = [...certifications, { name: "" }];
                    setCertifications(newCert);
                    setEditCert(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white dark:bg-purple-950 dark:text-purple-400 transition-all shadow-xs"
                >
                  <Plus className="h-4 w-4" /> Add Certificate
                </button>
                <button 
                  onClick={() => {
                    if (editCert) {
                      handleSave({ certifications });
                      setEditCert(false);
                    } else {
                      setEditCert(true);
                    }
                  }}
                  className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-all"
                >
                  {editCert ? <Check className="h-4 w-4 text-emerald-500" /> : <Edit2 className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {certifications.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col justify-between space-y-3">
                    {editCert ? (
                      <div className="space-y-3">
                        <div className="flex gap-2 items-center">
                          <input type="text" value={cert.name} onChange={e => {
                            const updated = [...certifications];
                            updated[idx].name = e.target.value;
                            setCertifications(updated);
                          }} className="flex-1 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-semibold bg-white dark:bg-slate-800" placeholder="Certificate Title" />
                          <button onClick={() => {
                            setCertifications(certifications.filter((_, i) => i !== idx));
                          }} className="text-rose-500 hover:text-rose-700 bg-rose-50 p-2 rounded-xl">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border shadow-xs flex items-center gap-1.5 transition-colors">
                            <Upload className="h-3.5 w-3.5 text-indigo-600" />
                            {cert.imageUrl ? "Replace Image" : "Upload Proof"}
                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const formData = new FormData();
                                formData.append("file", e.target.files[0]);
                                toast.loading("Uploading...", { id: "upload-cert" });
                                try {
                                  const res = await fetch("/api/upload", { method: "POST", body: formData });
                                  const data = await res.json();
                                  if (!res.ok) throw new Error(data.error);
                                  const updated = [...certifications];
                                  updated[idx].imageUrl = data.url;
                                  setCertifications(updated);
                                  toast.success("Uploaded!", { id: "upload-cert" });
                                } catch (err: any) {
                                  toast.error(err.message, { id: "upload-cert" });
                                }
                              }
                            }} />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                            <Award className="h-5 w-5" />
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-white text-sm">{cert.name}</span>
                        </div>
                        {cert.imageUrl && (
                          <a href={cert.imageUrl} target="_blank" rel="noreferrer" className="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 p-2 rounded-xl border border-purple-100 dark:border-purple-800 flex items-center gap-1.5 text-xs font-bold">
                            <ExternalLink className="h-4 w-4" /> View
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-750">
                <Award className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No certifications uploaded yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Upload certificates or achievements to validate your skill set.</p>
              </div>
            )}
          </div>

          {/* Languages Known & Spoken English */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Languages */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4 relative">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-500" /> Languages Known
                </h3>
                <button 
                  onClick={() => {
                    if (editLang) {
                      const items = tempLanguagesText.split(",").map(t => t.trim()).filter(t => t.length > 0);
                      handleSave({ languages: items });
                      setEditLang(false);
                    } else {
                      setTempLanguagesText(languages.join(", "));
                      setEditLang(true);
                    }
                  }}
                  className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-all"
                >
                  {editLang ? <Check className="h-4 w-4 text-emerald-500" /> : <Edit2 className="h-4 w-4" />}
                </button>
              </div>
              
              {editLang ? (
                <input type="text" value={tempLanguagesText} onChange={e => setTempLanguagesText(e.target.value)} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-900" placeholder="English, Hindi, etc." />
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {languages.length > 0 ? (
                    languages.map((l, i) => (
                      <span key={i} className="text-xs bg-slate-100 dark:bg-slate-700 font-extrabold px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-200">
                        🌐 {l}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">Not specified yet.</span>
                  )}
                </div>
              )}
            </div>

            {/* Spoken English Verification */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" /> Spoken English
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Having verified English speaking proficiency helps recruiters prioritize your profile for top roles.</p>
              
              <div className="flex items-center justify-between border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-3 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Verification Pending
                </span>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-1.5 font-extrabold transition-all shadow-md shadow-emerald-600/20">
                  Verify Now
                </button>
              </div>
            </div>

          </div>

          {/* Featured Resume Upload Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden border border-indigo-800/50">
            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-white text-xl">Resume Document</h3>
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider shadow-sm flex items-center gap-1 uppercase">
                    <Sparkles className="w-3 h-3 fill-slate-950" />
                    AI Auto-Fill
                  </span>
                </div>
                <p className="text-xs text-indigo-200/80 font-medium">Upload your latest PDF resume. Our AI will automatically parse and enrich your profile.</p>
              </div>

              <input type="file" accept=".pdf" id="resume-file-input" onChange={handleResumeUpload} disabled={uploading} className="hidden" />
              <label 
                htmlFor="resume-file-input" 
                className="shrink-0 flex items-center gap-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-extrabold text-xs px-5 py-3 rounded-2xl cursor-pointer shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span>{uploading ? "Extracting Details..." : "Upload PDF Resume"}</span>
              </label>
            </div>

            <div className="mt-6 relative z-10">
              {resumeUrl ? (
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-indigo-500/30 rounded-xl text-cyan-300">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-extrabold text-white text-sm">Uploaded Resume.pdf</p>
                      <p className="text-[10px] text-indigo-200/80 font-medium">PDF Document Format</p>
                    </div>
                  </div>
                  <a 
                    href={resumeUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="bg-white text-slate-900 font-extrabold text-xs px-4 py-2 rounded-xl hover:bg-slate-100 transition-all shadow-md flex items-center gap-1.5"
                  >
                    <ExternalLink className="h-4 w-4 text-indigo-600" /> View PDF
                  </a>
                </div>
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-indigo-400/40 rounded-2xl bg-white/5">
                  <FileText className="h-10 w-10 text-indigo-300/60 mx-auto mb-2" />
                  <p className="text-xs text-indigo-200 font-medium">No resume attached yet. Upload a PDF to complete your profile.</p>
                </div>
              )}
            </div>
          </div>

          {/* Preferred Roles */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4 relative">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                Preferred Job Roles
              </h3>
              <button 
                onClick={() => {
                  if (editOther) {
                    const items = tempPreferredRolesText.split(",").map(t => t.trim()).filter(t => t.length > 0);
                    handleSave({ preferredJobTitles: items });
                    setEditOther(false);
                  } else {
                    setTempPreferredRolesText(preferredJobTitles.join(", "));
                    setEditOther(true);
                  }
                }}
                className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-all"
              >
                {editOther ? <Check className="h-4 w-4 text-emerald-500" /> : <Edit2 className="h-4 w-4" />}
              </button>
            </div>

            {editOther ? (
              <input type="text" value={tempPreferredRolesText} onChange={e => setTempPreferredRolesText(e.target.value)} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-semibold bg-slate-50 dark:bg-slate-900 dark:text-white" placeholder="e.g. Software Engineer, Product Manager" />
            ) : (
              <div className="space-y-2">
                {preferredJobTitles.length > 0 ? (
                  preferredJobTitles.map((role, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3.5 border border-slate-100 dark:border-slate-700 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 hover:bg-white transition-all">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">🎯 {role}</span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-750">
                    <p className="text-xs font-medium text-slate-400">No preferred job roles specified yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
