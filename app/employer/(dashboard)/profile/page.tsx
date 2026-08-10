"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Upload, Building2, Globe, MapPin, Loader2, Save } from "lucide-react";
import { useSession } from "next-auth/react";

export default function EmployerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Fetch company details
  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await fetch("/api/employer/company");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load company");
        }

        const c = data.company;
        setName(c.name || "");
        setLogo(c.logo || "");
        setDescription(c.description || "");
        setWebsite(c.website || "");
        setIndustry(c.industry || "");
        setLocation(c.location || "");
        setEmployerName(c.employerName || "");
        setBillingEmail(c.billingEmail || "");
        setContactNumber(c.contactNumber || "");
        setIsVerified(c.isVerified || false);
      } catch (err: any) {
        toast.error(err.message || "Failed to retrieve company data");
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, []);

  // Handle Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        setLogo(data.url);
        toast.success("Logo uploaded successfully!");
      } catch (err: any) {
        toast.error(err.message || "Logo upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  const { update } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/employer/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          logo,
          description,
          website,
          industry,
          location,
          employerName,
          billingEmail,
          contactNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save company");
      }

      // Update session dynamically
      if (employerName || logo) {
        await update({ name: employerName, companyLogo: logo });
      }

      toast.success("Company profile saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save company");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="animate-spin h-6 w-6" />
        <span>Loading company profile details...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Company Profile</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your company information shown to prospective job seekers.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Save Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Logo & Verification */}
        <div className="lg:col-span-1 space-y-6">
          {/* Logo Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-center space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-105 dark:border-slate-700">
              Corporate Identity
            </h2>

            <div className="relative w-32 h-32 mx-auto rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
              {logo ? (
                <img src={logo} alt="Company Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-slate-400" />
              )}
            </div>

            <div className="pt-2">
              <input
                type="file"
                accept="image/*"
                id="logo-upload"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <label
                htmlFor="logo-upload"
                className={`w-full flex items-center justify-center py-2 border border-slate-200 dark:border-slate-700 hover:border-slate-350 rounded-xl font-bold text-xs cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100/50 transition-colors ${
                  uploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2 text-slate-500" />
                    Upload Logo Image
                  </>
                )}
              </label>
            </div>

            {/* Status Alert */}
            <div className="pt-2">
              {isVerified ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border border-emerald-250 dark:border-emerald-900/30 rounded-xl text-xs font-bold">
                  ✓ Verified Account
                </div>
              ) : (
                <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/20 rounded-xl text-xs font-medium">
                  ⏳ Verification Pending
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Company details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4 mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-105 dark:border-slate-700">
              Billing & Contact Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Employer Full Name
                </label>
                <input
                  type="text"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Billing Email (For Invoices)
                </label>
                <input
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  placeholder="e.g. accounts@company.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-105 dark:border-slate-700">
              Corporate Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  HQ Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Chicago, IL"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. https://acme.com"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Industry Sector
                </label>
                <input
                  type="text"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. E-Commerce, Healthcare"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Company Description
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give a brief summary of the company culture, mission, and products..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
