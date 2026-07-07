"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PlusCircle, Loader2, Save, ArrowLeft } from "lucide-react";

export default function PostJobPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Array<{ name: string; slug: string }>>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    jobType: "Full-time",
    experienceLevel: "Entry-level",
    location: "",
    salaryMin: "",
    salaryMax: "",
    openings: "1",
    deadline: "",
    skillsRequired: "",
    description: "",
  });

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (res.ok) {
          setCategories(data.categories || []);
          if (data.categories?.length > 0) {
            setFormData((prev) => ({ ...prev, category: data.categories[0].slug }));
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to post job");
      }

      toast.success("Job posted successfully! Pending admin approval.");
      router.push("/employer/manage-jobs");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Post a New Job</h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill out the details below to publish a position. Note that jobs undergo admin moderation before going live.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Job Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loadingCats}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
              >
                {loadingCats ? (
                  <option>Loading categories...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Job Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
              >
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Austin, TX (Hybrid) or Remote"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Min Salary */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Min Salary ($/yr)
              </label>
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder="e.g. 50000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>

            {/* Max Salary */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Max Salary ($/yr)
              </label>
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder="e.g. 80000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>

            {/* Openings */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Number of Openings
              </label>
              <input
                type="number"
                name="openings"
                required
                value={formData.openings}
                onChange={handleChange}
                min="1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>

            {/* Application Deadline */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Application Deadline
              </label>
              <input
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Skills Required (comma separated)
            </label>
            <input
              type="text"
              name="skillsRequired"
              required
              value={formData.skillsRequired}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, TypeScript, REST APIs"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Separate distinct tags with commas. These are key targets for user profile matching index.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Full Job Description
            </label>
            <textarea
              name="description"
              required
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job duties, daily routines, team details, and employee benefits..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => router.push("/employer/manage-jobs")}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-350 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <PlusCircle className="h-4 w-4" />
              )}
              <span>Post Job Opening</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
