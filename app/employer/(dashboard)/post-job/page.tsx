"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Plus, ArrowLeft, Check, CheckCircle2, Circle, Eye, Edit2, Sparkles } from "lucide-react";
import Script from "next/script";

export default function PostJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const [categories, setCategories] = useState<Array<{ name: string; slug: string }>>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [currentStep, setCurrentStep] = useState(0); // 0 is initial choice, 1-5 are wizard steps

  // Form State matching all screenshot fields
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    jobType: "Full Time",
    isNightShift: false,
    workLocationType: "Work From Office",
    location: "",
    payType: "Fixed Only",
    salaryMin: "",
    salaryMax: "",
    perks: [] as string[],
    joiningFeeRequired: false,
    minEducation: "Graduate",
    englishLevel: "Basic English",
    experienceRequired: "Any",
    experienceYears: "0",
    gender: "Both genders allowed",
    ageMin: "",
    ageMax: "",
    description: "",
    isWalkInInterview: false,
    communicationPreference: "Yes, to myself",
    pricingPlan: "Basic",
    openings: "1",
    deadline: "",
    skillsRequired: "General",
  });

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (res.ok) {
          // The API returns an array directly, not an object with a categories property
          const cats = Array.isArray(data) ? data : (data.categories || []);
          setCategories(cats);
          if (cats.length > 0) {
            setFormData((prev) => ({ ...prev, category: cats[0].slug }));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCats(false);
      }
    }
    loadCategories();
  }, []);

  // Load existing job for editing
  useEffect(() => {
    if (editId) {
      const loadJob = async () => {
        try {
          const res = await fetch(`/api/employer/jobs/${editId}`);
          if (res.ok) {
            const data = await res.json();
            setFormData(prev => ({
              ...prev,
              ...data,
              skillsRequired: Array.isArray(data.skillsRequired) ? data.skillsRequired.join(", ") : (data.skillsRequired || prev.skillsRequired),
              deadline: (() => {
                if (!data.deadline) return prev.deadline;
                try {
                  const ts = data.deadline._seconds ? data.deadline._seconds * 1000 : data.deadline;
                  const date = new Date(ts);
                  if (isNaN(date.getTime())) return prev.deadline;
                  return date.toISOString().split('T')[0];
                } catch {
                  return prev.deadline;
                }
              })()
            }));
          }
        } catch (err) {
          console.error("Failed to load job for editing", err);
        }
      };
      loadJob();
    }
  }, [editId]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handlePillSelect = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const togglePerk = (perk: string) => {
    setFormData((prev) => {
      if (prev.perks.includes(perk)) {
        return { ...prev, perks: prev.perks.filter((p) => p !== perk) };
      }
      return { ...prev, perks: [...prev.perks, perk] };
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await fetch(`/api/coupons/verify?code=${encodeURIComponent(couponCode)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setAppliedDiscount(data.discountPercentage);
      toast.success(`Coupon applied! ${data.discountPercentage}% discount.`);
    } catch (err: any) {
      toast.error(err.message || "Invalid or inactive coupon");
      setAppliedDiscount(0);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.title) {
      toast.error("Please enter a Job Title first to generate AI content.");
      return;
    }
    
    setIsGeneratingAI(true);
    const loadingToast = toast.loading("Generating description and skills with AI...");
    
    try {
      const res = await fetch("/api/employer/ai/generate-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          experienceRequired: formData.experienceRequired,
          jobType: formData.jobType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFormData(prev => ({
        ...prev,
        description: data.description || prev.description,
        skillsRequired: data.skills || prev.skillsRequired,
      }));
      
      // Clear manual input if any
      setSkillInput("");

      toast.success("AI Generation complete!", { id: loadingToast });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate AI content", { id: loadingToast });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getBasePrice = (plan: string) => {
    if (plan === "Enterprise") return 599;
    if (plan === "Premium") return 499;
    if (plan === "Standard") return 399;
    return 199;
  };

  const getFinalPrice = (plan: string) => {
    const base = getBasePrice(plan);
    if (appliedDiscount > 0) {
      const discounted = Math.max(1, Math.round(base * (1 - appliedDiscount / 100)));
      return discounted;
    }
    return base;
  };

  const handleSubmit = async () => {
    setSaving(true);
    const payload = {
      ...formData,
      experienceLevel: formData.experienceRequired === "Fresher Only" ? "Entry-level" : "Mid-level",
      couponCode: appliedDiscount > 0 ? couponCode : undefined,
    };

    try {
      if (editId) {
        // Edit mode
        const res = await fetch(`/api/employer/jobs/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update job");

        toast.success("Job updated successfully!");
        router.push("/employer/dashboard");
        return;
      }

      // Create new job
      const res = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post job");

      if (payload.isDraft) {
        toast.success("Job saved as draft");
        router.push("/employer/dashboard");
        return;
      }

      const { orderId, jobId, amount } = data;

      // Handle Razorpay Payment
      const options = {
        key: (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").replace(/['"]/g, '').trim(), // Clean the Key ID
        amount: amount.toString(), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Tejomarg Job Portal",
        description: `Payment for ${formData.pricingPlan} Job Post`,
        image: "https://www.tejomarg.com/favicon.ico", // Or local logo path
        order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyRes = await fetch("/api/employer/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                jobId: jobId,
              }),
            });
            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok) {
              toast.success("Payment successful! Your job is now active.");
              router.push("/employer/dashboard"); // Redirect to dashboard
            } else {
              throw new Error(verifyData.error || "Payment verification failed");
            }
          } catch (e: any) {
            toast.error(e.message || "Something went wrong verifying the payment");
          }
        },
        prefill: {
          name: "Employer",
          email: "employer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#208f60", // Green matching the site
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        toast.error("Payment Failed: " + response.error.description);
      });
      rzp1.open();
      
    } catch (err: any) {
      toast.error(err.message || "Failed to submit job");
    } finally {
      setSaving(false);
    }
  };

  const handleNextStep1 = () => {
    if (!formData.title || !formData.category || !formData.location) {
      toast.error("Please fill in all required fields (Job Title, Category, Location)");
      return;
    }
    setCurrentStep(2);
  };

  const handleNextStep2 = () => {
    if (!formData.description || !formData.skillsRequired) {
      toast.error("Please provide Job Description and Skills");
      return;
    }
    if (formData.experienceRequired === "Experienced Only" && (!formData.experienceYears || parseInt(formData.experienceYears) <= 0)) {
      toast.error("Please specify the minimum years of experience");
      return;
    }
    setCurrentStep(3);
  };

  const handleNextStep3 = () => {
    if (!formData.deadline || !formData.openings) {
      toast.error("Please specify Application Deadline and Openings");
      return;
    }
    setCurrentStep(4);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        experienceLevel: formData.experienceRequired === "Fresher Only" ? "Entry-level" : "Mid-level",
        isDraft: true,
      };

      const res = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save draft");

      toast.success("Job saved as draft successfully!");
      router.push("/employer/manage-jobs");
    } catch (err: any) {
      toast.error(err.message || "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  // UI Components
  const Pill = ({ label, name, value, currentVal, onClick }: any) => (
    <button
      type="button"
      onClick={() => onClick ? onClick() : handlePillSelect(name, value || label)}
      className={`px-5 py-2 text-sm font-semibold rounded-full border transition-all ${
        currentVal === (value || label)
          ? "border-[#208f60] bg-emerald-50 text-[#208f60]"
          : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
      }`}
    >
      {label}
    </button>
  );

  const MultiPill = ({ label, selected, onClick }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-full border flex items-center gap-1 transition-all ${
        selected
          ? "border-[#208f60] bg-emerald-50 text-[#208f60]"
          : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
      }`}
    >
      {label} {selected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-slate-400" />}
    </button>
  );

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (newSkill) {
        const currentSkills = formData.skillsRequired.split(",").map(s => s.trim()).filter(s => s);
        if (!currentSkills.includes(newSkill)) {
          setFormData({ ...formData, skillsRequired: [...currentSkills, newSkill].join(", ") });
        }
        setSkillInput("");
      }
    } else if (e.key === "Backspace" && !skillInput) {
      // Remove last skill on backspace if input is empty
      e.preventDefault();
      const currentSkills = formData.skillsRequired.split(",").map(s => s.trim()).filter(s => s);
      if (currentSkills.length > 0) {
        currentSkills.pop();
        setFormData({ ...formData, skillsRequired: currentSkills.join(", ") });
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = formData.skillsRequired.split(",").map(s => s.trim()).filter(s => s);
    const updatedSkills = currentSkills.filter(s => s !== skillToRemove);
    setFormData({ ...formData, skillsRequired: updatedSkills.join(", ") });
  };

  const steps = [
    "Job details",
    "Candidate requirements",
    "Interviewer information",
    "Job preview",
    "Publish job"
  ];

  const renderProgressBar = () => (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto mb-8 relative">
      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 -z-10"></div>
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isActive = currentStep === stepNum;
        const isPast = currentStep > stepNum;
        return (
          <div key={idx} className="flex flex-col items-center gap-2 bg-slate-50 px-2 z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                isActive
                  ? "bg-[#208f60] text-white border-[#208f60]"
                  : isPast
                  ? "bg-emerald-100 text-[#208f60] border-emerald-100"
                  : "bg-slate-200 text-slate-500 border-slate-200"
              }`}
            >
              {isPast ? <Check className="w-4 h-4" /> : stepNum}
            </div>
            <span className={`text-xs font-semibold ${isActive || isPast ? "text-slate-800" : "text-slate-400"}`}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 -m-6 lg:-m-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {currentStep > 0 && renderProgressBar()}

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200">
        
        {/* STEP 0: Initial Choice */}
        {currentStep === 0 && (
          <div className="p-12 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-10">Post your first job</h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              <div className="w-full max-w-sm border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Start with blank form</h3>
                <p className="text-sm text-slate-500 mb-8 h-10">Use our blank form to create your job and fill manually</p>
                <button onClick={() => setCurrentStep(1)} className="w-full border border-slate-300 text-slate-700 font-bold py-2.5 rounded-lg hover:bg-slate-50">
                  Start with blank form
                </button>
              </div>
              <div className="text-slate-400 font-medium">OR</div>
              <div className="w-full max-w-sm border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Edit2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Use a template</h3>
                <p className="text-sm text-slate-500 mb-8 h-10">Use templates made by experts to save time.</p>
                <button onClick={() => setCurrentStep(1)} className="w-full bg-[#208f60] text-white font-bold py-2.5 rounded-lg hover:bg-[#1a7650]">
                  Use a template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Job Details */}
        {currentStep === 1 && (
          <div>
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Job details</h2>
              <p className="text-xs text-slate-500 mt-1">We use this information to find the best candidates for the job.</p>
            </div>
            
            <div className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job title / Designation <span className="text-red-500">*</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Eg. Accountant" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#208f60]" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Category <span className="text-red-500">*</span></label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#208f60] bg-white">
                  {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Type of Job <span className="text-red-500">*</span></label>
                <div className="flex gap-3 flex-wrap">
                  <Pill label="Full Time" name="jobType" currentVal={formData.jobType} />
                  <Pill label="Part Time" name="jobType" currentVal={formData.jobType} />
                  <Pill label="Both (Full-Time And Part-Time)" name="jobType" currentVal={formData.jobType} />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <input type="checkbox" id="nightShift" name="isNightShift" checked={formData.isNightShift} onChange={handleChange} className="w-4 h-4 text-[#208f60]" />
                  <label htmlFor="nightShift" className="text-sm text-slate-600 font-medium">This is a night shift job</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Work location type <span className="text-red-500">*</span></label>
                <div className="flex gap-3 flex-wrap">
                  <Pill label="Work From Office" name="workLocationType" currentVal={formData.workLocationType} />
                  <Pill label="Work From Home" name="workLocationType" currentVal={formData.workLocationType} />
                  <Pill label="Field Job" name="workLocationType" currentVal={formData.workLocationType} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Location <span className="text-red-500">*</span></label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Eg. Delhi" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#208f60]" />
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Compensation</h3>
                <p className="text-xs text-slate-500 mb-6">Job postings with right salary & incentives will help you find the right candidates.</p>
                
                <label className="block text-sm font-semibold text-slate-700 mb-3">What is the pay type? <span className="text-red-500">*</span></label>
                <div className="flex gap-3 flex-wrap mb-6">
                  <Pill label="Fixed Only" name="payType" currentVal={formData.payType} />
                  <Pill label="Fixed + Incentive" name="payType" currentVal={formData.payType} />
                  <Pill label="Incentive Only" name="payType" currentVal={formData.payType} />
                </div>

                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Min Salary</label>
                    <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} placeholder="₹" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#208f60]" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Max Salary</label>
                    <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} placeholder="₹" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#208f60]" />
                  </div>
                </div>

                <label className="block text-sm font-semibold text-slate-700 mb-3">Do you offer any additional perks ?</label>
                <div className="flex gap-3 flex-wrap mb-6">
                  {["Flexible Working Hours", "Weekly Payout", "Overtime Pay", "Joining Bonus", "Annual Bonus", "PF", "Health Insurance"].map(p => (
                    <MultiPill key={p} label={p} selected={formData.perks.includes(p)} onClick={() => togglePerk(p)} />
                  ))}
                </div>
                
                <label className="block text-sm font-semibold text-slate-700 mb-3">Is there any joining fee or deposit required from the candidate? <span className="text-red-500">*</span></label>
                <div className="flex gap-3">
                  <Pill label="Yes" name="joiningFeeRequired" value={true} currentVal={formData.joiningFeeRequired} onClick={() => handlePillSelect("joiningFeeRequired", true)} />
                  <Pill label="No" name="joiningFeeRequired" value={false} currentVal={formData.joiningFeeRequired} onClick={() => handlePillSelect("joiningFeeRequired", false)} />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button onClick={handleNextStep1} className="bg-[#208f60] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#1a7650]">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Candidate Requirements */}
        {currentStep === 2 && (
          <div>
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Candidate requirements</h2>
              <p className="text-xs text-slate-500 mt-1">We'll use these requirement details to make your job visible to the right candidates.</p>
            </div>
            
            <div className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Minimum Education <span className="text-red-500">*</span></label>
                <div className="flex gap-3 flex-wrap">
                  {["10th Or Below 10th", "12th Pass", "Diploma", "ITI", "Graduate", "Post Graduate"].map(ed => (
                    <Pill key={ed} label={ed} name="minEducation" currentVal={formData.minEducation} />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">English level required <span className="text-red-500">*</span></label>
                <div className="flex gap-3 flex-wrap">
                  {["No English", "Basic English", "Good English"].map(lvl => (
                    <Pill key={lvl} label={lvl} name="englishLevel" currentVal={formData.englishLevel} />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Total experience required <span className="text-red-500">*</span></label>
                <div className="flex gap-3 flex-wrap mb-4">
                  {["Any", "Experienced Only", "Fresher Only"].map(exp => (
                    <Pill key={exp} label={exp} name="experienceRequired" currentVal={formData.experienceRequired} />
                  ))}
                </div>
                {formData.experienceRequired === "Experienced Only" && (
                   <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} placeholder="Minimum years" className="w-48 p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#208f60]" />
                )}
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-slate-700">Job Description <span className="text-red-500">*</span></label>
                  <button 
                    onClick={handleGenerateAI} 
                    disabled={isGeneratingAI}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    {isGeneratingAI ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    Generate with AI
                  </button>
                </div>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows={5} 
                  placeholder="Enter the job description, including the main responsibilities and tasks..."
                  className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:border-[#208f60] resize-none" 
                />
              </div>

              <div className="pt-6 border-t border-slate-100">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Skills Required <span className="text-slate-400 font-normal ml-1">(Type a skill and press Enter or Comma)</span> <span className="text-red-500">*</span></label>
                <div className="w-full p-2 border border-slate-300 rounded-lg focus-within:border-[#208f60] bg-white flex flex-wrap gap-2 items-center min-h-[56px]">
                  {formData.skillsRequired.split(",").map(s => s.trim()).filter(s => s).map((skill, index) => (
                    <span key={index} className="flex items-center gap-1 bg-emerald-50 text-[#208f60] border border-emerald-200 px-3 py-1.5 rounded-md text-sm font-medium">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 text-emerald-600 focus:outline-none">
                        &times;
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text"
                    value={skillInput} 
                    onChange={(e) => setSkillInput(e.target.value)} 
                    onKeyDown={handleSkillKeyDown}
                    placeholder={formData.skillsRequired ? "Add more..." : "e.g. React, Communication, Sales"}
                    className="flex-1 min-w-[150px] p-2 outline-none bg-transparent" 
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-between">
              <button onClick={() => setCurrentStep(1)} className="border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-bold hover:bg-slate-50">Back</button>
              <button onClick={handleNextStep2} className="bg-[#208f60] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#1a7650]">Continue</button>
            </div>
          </div>
        )}

        {/* STEP 3: Interviewer info */}
        {currentStep === 3 && (
          <div>
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Interviewer information</h2>
            </div>
            
            <div className="p-8 space-y-8">
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Interview method and address</h3>
                <p className="text-xs text-slate-500 mb-4">Let candidates know how interview will be conducted.</p>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Is this a walk-in interview? <span className="text-red-500">*</span></label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="isWalkIn" checked={formData.isWalkInInterview === true} onChange={() => handlePillSelect("isWalkInInterview", true)} className="w-5 h-5 text-[#208f60]" />
                    <span className="text-slate-700 font-medium">Yes</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="isWalkIn" checked={formData.isWalkInInterview === false} onChange={() => handlePillSelect("isWalkInInterview", false)} className="w-5 h-5 text-[#208f60]" />
                    <span className="text-slate-700 font-medium">No</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4">Communication Preferences</h3>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Do you want candidates to contact you via Call / Whatsapp after they apply? <span className="text-red-500">*</span></label>
                <div className="space-y-3">
                  {["Yes, to myself", "Yes, to other recruiter", "No, I will contact candidates first"].map(pref => (
                     <label key={pref} className="flex items-center gap-3 cursor-pointer">
                       <input type="radio" checked={formData.communicationPreference === pref} onChange={() => handlePillSelect("communicationPreference", pref)} className="w-5 h-5 text-[#208f60]" />
                       <span className="text-slate-700 font-medium">{pref}</span>
                     </label>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Application Deadline & Openings <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#208f60]" />
                  </div>
                  <div className="flex-1">
                    <input type="number" name="openings" value={formData.openings} onChange={handleChange} placeholder="Openings (eg. 5)" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#208f60]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-between">
              <button onClick={() => setCurrentStep(2)} className="border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-bold hover:bg-slate-50">Back</button>
              <button onClick={handleNextStep3} className="bg-[#208f60] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#1a7650]">Continue</button>
            </div>
          </div>
        )}

        {/* STEP 4: Preview */}
        {currentStep === 4 && (
          <div>
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Job preview</h2>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2 flex justify-between items-center">Job Details <Edit2 className="w-4 h-4 text-blue-500 cursor-pointer" onClick={()=>setCurrentStep(1)} /></h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-slate-500">Job title</div><div className="font-medium text-slate-800">{formData.title || "Not specified"}</div>
                  <div className="text-slate-500">Job type</div><div className="font-medium text-slate-800">{formData.jobType} {formData.isNightShift && "| Night shift"}</div>
                  <div className="text-slate-500">Work type</div><div className="font-medium text-slate-800">{formData.workLocationType}</div>
                  <div className="text-slate-500">Location</div><div className="font-medium text-slate-800">{formData.location || "Not specified"}</div>
                  <div className="text-slate-500">Salary</div><div className="font-medium text-slate-800">₹{formData.salaryMin} - ₹{formData.salaryMax} ({formData.payType})</div>
                  <div className="text-slate-500">Perks</div><div className="font-medium text-slate-800">{formData.perks.join(", ") || "None"}</div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2 flex justify-between items-center">Candidate Requirements <Edit2 className="w-4 h-4 text-blue-500 cursor-pointer" onClick={()=>setCurrentStep(2)} /></h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-slate-500">Education</div><div className="font-medium text-slate-800">{formData.minEducation}</div>
                  <div className="text-slate-500">Experience</div><div className="font-medium text-slate-800">{formData.experienceRequired} {formData.experienceRequired === "Experienced Only" && `(${formData.experienceYears}+ years)`}</div>
                  <div className="text-slate-500">English</div><div className="font-medium text-slate-800">{formData.englishLevel}</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-between">
              <button onClick={() => setCurrentStep(3)} className="border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-bold hover:bg-slate-50">Back</button>
              <button onClick={() => setCurrentStep(5)} className="bg-[#208f60] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#1a7650]">Continue to Plans</button>
            </div>
          </div>
        )}

        {/* STEP 5: Pricing Plans */}
        {currentStep === 5 && (
          <div>
            <div className="p-6 border-b border-slate-100 text-center">
              <h2 className="text-2xl font-bold text-slate-800">Choose a job basis your hiring needs</h2>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Plan 1: Basic */}
                <div 
                  onClick={() => handlePillSelect("pricingPlan", "Basic")}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all bg-white relative ${formData.pricingPlan === "Basic" ? "border-blue-600 shadow-xl scale-105 z-10" : "border-slate-200 hover:border-blue-300"}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700">Basic Job</h3>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.pricingPlan === "Basic" ? "border-blue-600" : "border-slate-300"}`}>
                      {formData.pricingPlan === "Basic" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-800 mb-6">₹199</div>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Job active for 15 days</li>
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Standard visibility</li>
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Email notifications</li>
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Basic support</li>
                  </ul>
                </div>

                {/* Plan 2: Standard */}
                <div 
                  onClick={() => handlePillSelect("pricingPlan", "Standard")}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all bg-white relative ${formData.pricingPlan === "Standard" ? "border-blue-600 shadow-xl scale-105 z-10" : "border-slate-200 hover:border-blue-300"}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700">Standard Job</h3>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.pricingPlan === "Standard" ? "border-blue-600" : "border-slate-300"}`}>
                      {formData.pricingPlan === "Standard" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-800 mb-6">₹399</div>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Job active for 30 days</li>
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Higher visibility</li>
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> WhatsApp notifications</li>
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Priority email support</li>
                  </ul>
                </div>

                {/* Plan 3: Premium */}
                <div 
                  onClick={() => handlePillSelect("pricingPlan", "Premium")}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all bg-white relative ${formData.pricingPlan === "Premium" ? "border-blue-600 shadow-xl scale-105 z-10" : "border-slate-200 hover:border-blue-300"}`}
                >
                  <div className="absolute -top-4 inset-x-0 bg-blue-800 text-white text-[10px] font-bold text-center py-1 rounded-t-lg uppercase tracking-wider">Most Popular</div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700">Premium Job</h3>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.pricingPlan === "Premium" ? "border-blue-600" : "border-slate-300"}`}>
                      {formData.pricingPlan === "Premium" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-3xl font-black text-slate-800">₹499</span>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Job active for 45 days</li>
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Top-tier visibility</li>
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> WhatsApp notifications</li>
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Dedicated account manager</li>
                  </ul>
                </div>

                {/* Plan 4: Enterprise */}
                <div 
                  onClick={() => handlePillSelect("pricingPlan", "Enterprise")}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all bg-white relative ${formData.pricingPlan === "Enterprise" ? "border-blue-600 shadow-xl scale-105 z-10" : "border-slate-200 hover:border-blue-300"}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700">Enterprise Job 🚀</h3>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.pricingPlan === "Enterprise" ? "border-blue-600" : "border-slate-300"}`}>
                      {formData.pricingPlan === "Enterprise" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-800 mb-6">₹599</div>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Job active for 60 days</li>
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Maximum sticky visibility</li>
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> 2x Priority WhatsApp notifications</li>
                    <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Custom recruitment solutions</li>
                  </ul>
                </div>

              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex flex-col md:flex-row justify-between bg-slate-50 rounded-b-xl items-center gap-4">
              <button onClick={() => setCurrentStep(4)} className="border border-slate-300 text-slate-700 bg-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-50 w-full md:w-auto">Back</button>
              
              <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <input 
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon Code"
                    className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm w-full md:w-40 font-mono outline-none focus:ring-2 focus:ring-[#208f60]"
                    disabled={appliedDiscount > 0}
                  />
                  {appliedDiscount > 0 ? (
                    <button onClick={() => {setAppliedDiscount(0); setCouponCode("");}} className="px-4 py-2.5 bg-red-100 text-red-600 font-bold rounded-lg text-sm hover:bg-red-200">Remove</button>
                  ) : (
                    <button onClick={handleApplyCoupon} disabled={applyingCoupon || !couponCode} className="px-4 py-2.5 bg-slate-800 text-white font-bold rounded-lg text-sm hover:bg-slate-700 disabled:opacity-50 min-w-[80px]">
                      {applyingCoupon ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Apply"}
                    </button>
                  )}
                </div>
                
                <button onClick={handleSaveDraft} disabled={saving} className="border border-[#208f60] text-[#208f60] bg-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-colors w-full md:w-auto">
                  Save to Draft
                </button>
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-slate-500 font-semibold">Total Amount</div>
                  <div className="text-xl font-black text-slate-800 flex items-center gap-2">
                    {appliedDiscount > 0 && (
                      <span className="text-sm line-through text-slate-400">₹{getBasePrice(formData.pricingPlan)}</span>
                    )}
                    <span>₹{getFinalPrice(formData.pricingPlan)}</span>
                  </div>
                </div>
                <button onClick={handleSubmit} disabled={saving} className="bg-[#208f60] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#1a7650] flex items-center gap-2">
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                  {editId ? "Save Changes" : "Pay & Publish"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
