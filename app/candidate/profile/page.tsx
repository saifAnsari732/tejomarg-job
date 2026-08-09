"use client";

import { useSession } from "next-auth/react";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { 
  Upload, FileText, Plus, Trash2, Loader2, Save, MapPin, 
  Building2, Briefcase, Mail, Phone, Calendar, User as UserIcon, 
  Home, ChevronRight, Edit2, Check, X, GraduationCap, Languages, MessageSquare, Camera
} from "lucide-react";

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

      toast.success("Profile section updated successfully!");
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
        <span className="font-semibold">Loading profile information...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen -mt-6 pt-6 -mx-4 px-4 sm:-mx-8 sm:px-8 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-12">
        
        {/* LEFT COLUMN: Sticky Info & Activities */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
            {/* Banner */}
            <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 relative">
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
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-1.5 bg-white/10 backdrop-blur-md rounded transition-all z-10"
              >
                {editBasic ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </button>
            </div>

            <div className="px-5 pb-5 relative -mt-12">
              {/* Initials/Avatar & Top Bio */}
              <div className="flex flex-col gap-3">
                <div className="relative w-24 h-24 rounded-full border-4 border-white bg-slate-100 shadow-sm flex items-center justify-center overflow-hidden group">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-extrabold text-slate-400">{name.split(" ").map(n => n[0]).join("").toUpperCase() || "C"}</span>
                  )}
                  {/* Hover Overlay */}
                  <label className="absolute inset-0 bg-black/50 hidden group-hover:flex flex-col items-center justify-center cursor-pointer text-white transition-all">
                    {uploadingAvatar ? <Loader2 className="animate-spin h-5 w-5" /> : <Camera className="h-6 w-6" />}
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
                
                <div className="mt-1">
                  <h2 className="font-extrabold text-slate-900 text-xl leading-tight">{name}</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 shrink-0 text-indigo-400" />
                    {experience[0]?.role ? `${experience[0].role} at ${experience[0].company}` : "Fresher"}
                  </p>
                  <p className="text-sm text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 shrink-0 text-indigo-400" />
                    {currentLocation || "Location unspecified"}
                  </p>
                </div>
              </div>

            <hr className="border-slate-100 my-5" />

            {/* Details Grid */}
            {editBasic ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                  <input type="text" value={tempBasic.name} onChange={e => setTempBasic({...tempBasic, name: e.target.value})} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Mobile</label>
                  <input type="text" value={tempBasic.mobile} onChange={e => setTempBasic({...tempBasic, mobile: e.target.value})} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Date of Birth</label>
                  <input type="text" placeholder="DD/MM/YYYY" value={tempBasic.dob} onChange={e => setTempBasic({...tempBasic, dob: e.target.value})} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Gender</label>
                  <select value={tempBasic.gender} onChange={e => setTempBasic({...tempBasic, gender: e.target.value})} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1 text-xs">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Current Location</label>
                  <input type="text" value={tempBasic.currentLocation} onChange={e => setTempBasic({...tempBasic, currentLocation: e.target.value})} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Home Town</label>
                  <input type="text" value={tempBasic.homeTown} onChange={e => setTempBasic({...tempBasic, homeTown: e.target.value})} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1 text-xs" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 text-sm">
                <div className="space-y-1.5">
                  <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Email ID</span>
                  <span className="text-slate-900 font-bold break-all leading-tight flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    {email}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Mobile Number</span>
                  <span className="text-slate-900 font-bold flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    {mobile || "Not specified"}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Date of Birth</span>
                  <span className="text-slate-900 font-bold flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    {dob || "Not specified"}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Gender</span>
                  <span className="text-slate-900 font-bold flex items-center gap-1.5">
                    <UserIcon className="h-4 w-4 text-slate-400 shrink-0" />
                    {gender || "Not specified"}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Current Location</span>
                  <span className="text-slate-900 font-bold flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    {currentLocation || "Not specified"}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Home Town</span>
                  <span className="text-slate-900 font-bold flex items-center gap-1.5">
                    <Home className="h-4 w-4 text-slate-400 shrink-0" />
                    {homeTown || "Not specified"}
                  </span>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Activities Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">My Activities</h3>
            <Link 
              href="/candidate" 
              className="flex items-center justify-between border border-slate-200 hover:border-indigo-250 p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100/50 transition-all text-left"
            >
              <div className="flex gap-3 items-start">
                <FileText className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">My Applications</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Check all your jobs applied and interview invites here</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </Link>
          </div>

        </div>

        {/* RIGHT COLUMN: Bio Sections Accordion */}
        <div className="lg:col-span-8 space-y-6">

          {/* Work Experience */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative">
            <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
              <h3 className="font-extrabold text-slate-900 text-[15px]">Work Experience</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const newExp = [...experience, { company: "", role: "", duration: "", description: "", skills: "" }];
                    setExperience(newExp);
                    setEditWork(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
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
                  className="text-indigo-605 text-xs font-bold p-1 bg-indigo-50 rounded"
                >
                  {editWork ? <Check className="h-4 w-4" /> : <Edit2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {experience.length > 0 ? (
              <div className="space-y-6 relative pl-5 border-l border-slate-200">
                {experience.map((exp, idx) => (
                  <div key={idx} className="relative space-y-2">
                    {/* Timeline dot */}
                    <div className="absolute -left-[26px] top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-100 border-2 border-indigo-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                    </div>

                    {editWork ? (
                      <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-100">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Job Title / Role</label>
                            <input type="text" value={exp.role} onChange={e => {
                              const updated = [...experience];
                              updated[idx].role = e.target.value;
                              setExperience(updated);
                            }} className="w-full mt-0.5 border border-slate-200 rounded px-2 py-1 text-xs" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Company</label>
                            <input type="text" value={exp.company} onChange={e => {
                              const updated = [...experience];
                              updated[idx].company = e.target.value;
                              setExperience(updated);
                            }} className="w-full mt-0.5 border border-slate-200 rounded px-2 py-1 text-xs" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Duration</label>
                            <input type="text" placeholder="e.g. Mar 2024 - Present" value={exp.duration} onChange={e => {
                              const updated = [...experience];
                              updated[idx].duration = e.target.value;
                              setExperience(updated);
                            }} className="w-full mt-0.5 border border-slate-200 rounded px-2 py-1 text-xs" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Skills Used</label>
                            <input type="text" placeholder="React, Node.js" value={exp.skills} onChange={e => {
                              const updated = [...experience];
                              updated[idx].skills = e.target.value;
                              setExperience(updated);
                            }} className="w-full mt-0.5 border border-slate-200 rounded px-2 py-1 text-xs" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                          <textarea value={exp.description} onChange={e => {
                            const updated = [...experience];
                            updated[idx].description = e.target.value;
                            setExperience(updated);
                          }} className="w-full mt-0.5 border border-slate-200 rounded px-2 py-1 text-xs" rows={2} />
                        </div>
                        <button onClick={() => {
                          setExperience(experience.filter((_, i) => i !== idx));
                        }} className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1">
                          <Trash2 className="h-3.5 w-3.5" /> Delete Experience
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{exp.role}</h4>
                            <p className="text-xs font-bold text-slate-500">{exp.company}</p>
                          </div>
                          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{exp.duration}</span>
                        </div>
                        
                        {exp.description && (
                          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded text-xs text-slate-600 leading-relaxed">
                            {exp.description}
                          </div>
                        )}

                        {exp.skills && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {exp.skills.split(",").map((s, i) => (
                              <span key={i} className="text-[10px] bg-slate-100 font-semibold px-2 py-0.5 rounded text-slate-600">{s.trim()}</span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 font-medium text-sm text-slate-500">
                No work experience listed yet.
              </div>
            )}
          </div>

          {/* Experience, Salary, Notice Period Single Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
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
              className="absolute -top-3 right-0 text-indigo-650 p-1.5 bg-white border border-slate-200 rounded shadow-sm z-10"
            >
              {editSingle ? <Check className="h-4 w-4 text-indigo-600" /> : <Edit2 className="h-3.5 w-3.5" />}
            </button>

            {editSingle ? (
              <div className="col-span-3 bg-white p-5 rounded-xl border border-slate-200 grid grid-cols-3 gap-4 shadow-sm">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Years of Experience</label>
                  <input type="text" placeholder="e.g. 1 year" value={tempSingle.totalExperience} onChange={e => setTempSingle({...tempSingle, totalExperience: e.target.value})} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Monthly Salary (₹)</label>
                  <input type="number" placeholder="20000" value={tempSingle.expectedSalary} onChange={e => setTempSingle({...tempSingle, expectedSalary: e.target.value})} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Notice Period</label>
                  <input type="text" placeholder="e.g. 15 days" value={tempSingle.noticePeriod} onChange={e => setTempSingle({...tempSingle, noticePeriod: e.target.value})} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1 text-xs" />
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm overflow-hidden">
                  <div className="overflow-hidden pr-2">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider truncate">Total Experience</span>
                    <span className="text-slate-900 font-bold text-sm mt-1 block truncate">{totalExperience || "Fresher"}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-350 shrink-0" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm overflow-hidden">
                  <div className="overflow-hidden pr-2">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider truncate">Monthly Salary</span>
                    <span className="text-slate-900 font-bold text-sm mt-1 block truncate">₹ {parseInt(expectedSalary).toLocaleString()}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-350 shrink-0" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm overflow-hidden">
                  <div className="overflow-hidden pr-2">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider truncate">Notice Period</span>
                    <span className="text-slate-900 font-bold text-sm mt-1 block truncate">{noticePeriod || "Immediate"}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-350 shrink-0" />
                </div>
              </>
            )}
          </div>

          {/* Education */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
              <h3 className="font-extrabold text-slate-900 text-[15px]">Education</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const newEdu = [...education, { school: "", degree: "", year: "" }];
                    setEducation(newEdu);
                    setEditEdu(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
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
                  className="text-indigo-650 p-1 bg-indigo-50 rounded"
                >
                  {editEdu ? <Check className="h-4 w-4" /> : <Edit2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {editEdu ? (
              <div className="space-y-4 mb-4 bg-slate-50 p-4 border rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Highest Education</label>
                    <input type="text" placeholder="e.g. Graduate" value={tempEdu.highestEducation} onChange={e => setTempEdu({...tempEdu, highestEducation: e.target.value})} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">School Medium</label>
                    <input type="text" placeholder="e.g. English, Hindi" value={tempEdu.schoolMedium} onChange={e => setTempEdu({...tempEdu, schoolMedium: e.target.value})} className="w-full mt-0.5 border border-slate-200 rounded px-2.5 py-1 text-xs" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold mb-5 border-b border-slate-50 pb-4">
                <div className="flex justify-between items-center bg-slate-50 border p-3 rounded-lg hover:border-slate-350 cursor-pointer">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Highest education</span>
                    <p className="text-slate-800 font-bold mt-0.5">{highestEducation || "Graduate"}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex justify-between items-center bg-slate-50 border p-3 rounded-lg hover:border-slate-350 cursor-pointer">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">School medium</span>
                    <p className="text-slate-800 font-bold mt-0.5">{schoolMedium || "English"}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}

            {education.length > 0 ? (
              <div className="space-y-4 pl-4 border-l-2 border-dashed border-slate-200">
                {education.map((edu, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></div>

                    {editEdu ? (
                      <div className="space-y-2 bg-white p-3 border rounded shadow-sm">
                        <div className="grid grid-cols-3 gap-3">
                          <input type="text" placeholder="Degree / Stream" value={edu.degree} onChange={e => {
                            const updated = [...education];
                            updated[idx].degree = e.target.value;
                            setEducation(updated);
                          }} className="border rounded p-1 text-xs" />
                          <input type="text" placeholder="School / University" value={edu.school} onChange={e => {
                            const updated = [...education];
                            updated[idx].school = e.target.value;
                            setEducation(updated);
                          }} className="border rounded p-1 text-xs" />
                          <input type="text" placeholder="Batch / Year" value={edu.year} onChange={e => {
                            const updated = [...education];
                            updated[idx].year = e.target.value;
                            setEducation(updated);
                          }} className="border rounded p-1 text-xs" />
                        </div>
                        <button onClick={() => {
                          setEducation(education.filter((_, i) => i !== idx));
                        }} className="text-red-600 hover:text-red-700 text-xs font-bold">Delete Record</button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-extrabold text-slate-900 text-xs">{edu.degree}</h4>
                        <p className="text-[11px] font-bold text-slate-500">{edu.school}</p>
                        <span className="text-[10px] text-slate-400 font-bold block">{edu.year}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 text-sm font-medium text-slate-500">No education qualifications specified.</div>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative">
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
              className="absolute top-4 right-4 text-indigo-650 p-1 bg-indigo-50 rounded"
            >
              {editSkills ? <Check className="h-4 w-4" /> : <Edit2 className="h-3.5 w-3.5" />}
            </button>
            
            <h3 className="font-extrabold text-slate-900 text-[15px] mb-4">Skills</h3>
            
            {editSkills ? (
              <div className="space-y-2">
                <textarea 
                  value={tempSkillsText} 
                  onChange={e => setTempSkillsText(e.target.value)} 
                  className="w-full border border-slate-200 rounded p-2 text-xs" 
                  rows={3} 
                  placeholder="React, Node.js, CSS, Excel"
                />
                <p className="text-[10px] text-slate-400">Comma-separated list of skills.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((s, idx) => (
                    <span key={idx} className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">{s}</span>
                  ))
                ) : (
                  <span className="text-sm font-medium text-slate-500">No professional skills saved.</span>
                )}
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative">
            <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
              <h3 className="font-extrabold text-slate-900 text-[15px]">Certifications</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const newCert = [...certifications, { name: "" }];
                    setCertifications(newCert);
                    setEditCert(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
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
                  className="text-indigo-650 p-1 bg-indigo-50 rounded"
                >
                  {editCert ? <Check className="h-4 w-4" /> : <Edit2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {certifications.length > 0 ? (
              <div className="space-y-3">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 border rounded-lg">
                    {editCert ? (
                      <div className="flex-1 flex gap-2 items-center">
                        <input type="text" value={cert.name} onChange={e => {
                          const updated = [...certifications];
                          updated[idx].name = e.target.value;
                          setCertifications(updated);
                        }} className="flex-1 border rounded p-1 text-xs bg-white" placeholder="Certification Name" />
                        <button onClick={() => {
                          setCertifications(certifications.filter((_, i) => i !== idx));
                        }} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-slate-800 text-xs">{cert.name}</span>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 text-sm font-medium text-slate-500">No certifications uploaded.</div>
            )}
          </div>

          {/* Languages Known & Spoken English */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Languages */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative">
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
                className="absolute top-4 right-4 text-indigo-650 p-1 bg-indigo-50 rounded"
              >
                {editLang ? <Check className="h-4 w-4" /> : <Edit2 className="h-3.5 w-3.5" />}
              </button>
              
              <h3 className="font-extrabold text-slate-900 text-sm mb-3">Languages known</h3>
              {editLang ? (
                <input type="text" value={tempLanguagesText} onChange={e => setTempLanguagesText(e.target.value)} className="w-full border rounded p-1 text-xs" placeholder="English, Hindi" />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {languages.length > 0 ? (
                    languages.map((l, i) => (
                      <span key={i} className="text-xs bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-600">{l}</span>
                    ))
                  ) : (
                    <span className="text-sm font-medium text-slate-500">Not specified.</span>
                  )}
                </div>
              )}
            </div>

            {/* Spoken English */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm">Spoken English</h3>
              <p className="text-[10px] text-slate-500 leading-tight">Having the required level of English speaking proficiency will help you find jobs at top companies.</p>
              
              <div className="flex items-center justify-between border border-indigo-500 rounded p-2.5 bg-indigo-50 text-indigo-700 font-bold text-xs">
                <span>Verification Pending</span>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3 py-1 transition-all">Verify now</button>
              </div>
            </div>

          </div>

          {/* Resume Upload Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
              <svg className="w-24 h-24 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            </div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="font-extrabold text-slate-900 text-[15px] flex items-center gap-1.5">
                  Resume
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider shadow-sm flex items-center gap-1">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                    AI Auto-Fill
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">Upload your resume and our AI will automatically fill your profile details.</p>
              </div>
              <input type="file" accept=".pdf" id="resume-file-input" onChange={handleResumeUpload} disabled={uploading} className="hidden" />
              <label htmlFor="resume-file-input" className="group flex items-center gap-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-650 hover:text-white cursor-pointer px-3 py-1.5 rounded-lg transition-all shadow-sm">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />}
                <span className="text-xs font-bold">{uploading ? "Analyzing..." : "Upload"}</span>
              </label>
            </div>

            {resumeUrl ? (
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm">
                  <FileText className="h-8 w-8 text-indigo-650 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 truncate">Uploaded Resume</p>
                    <p className="text-[10px] text-slate-400">PDF document format</p>
                  </div>
                </div>
                <a 
                  href={resumeUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-1.5 rounded transition-all"
                >
                  View PDF
                </a>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
                {uploading ? (
                  <Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" />
                ) : (
                  <FileText className="h-8 w-8 text-slate-350 mx-auto" />
                )}
                <p className="text-xs text-slate-500 mt-2">Attach your PDF format resume document here.</p>
              </div>
            )}
          </div>

          {/* Preferred Roles & Other preferences */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative">
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
              className="absolute top-4 right-4 text-indigo-650 p-1 bg-indigo-50 rounded"
            >
              {editOther ? <Check className="h-4 w-4" /> : <Edit2 className="h-3.5 w-3.5" />}
            </button>
            
            <h3 className="font-extrabold text-slate-900 text-[15px] mb-4">Preferred Job Titles / Roles</h3>
            {editOther ? (
              <input type="text" value={tempPreferredRolesText} onChange={e => setTempPreferredRolesText(e.target.value)} className="w-full border rounded p-1.5 text-xs bg-white" placeholder="Full-stack Developer, Software Engineer" />
            ) : (
              <div className="space-y-2">
                {preferredJobTitles.length > 0 ? (
                  preferredJobTitles.map((role, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 border rounded-lg bg-slate-50 hover:bg-slate-100/30 cursor-pointer">
                      <span className="font-semibold text-slate-700 text-xs">{role}</span>
                      <ChevronRight className="h-4 w-4 text-slate-450" />
                    </div>
                  ))
                ) : (
                  <span className="text-sm font-medium text-slate-500">No job titles selected.</span>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
