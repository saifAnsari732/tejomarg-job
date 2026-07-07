"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { FolderTree, Laptop, Palette, Megaphone, Coins, Headphones, Users, Plus, Trash2, Loader2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
}

interface CategoriesListProps {
  initialCategories: Category[];
}

const availableIcons = ["Laptop", "Palette", "Megaphone", "Coins", "Headphones", "Users"];
const iconMap: Record<string, React.ComponentType<any>> = {
  Laptop,
  Palette,
  Megaphone,
  Coins,
  Headphones,
  Users,
};

export default function CategoriesList({ initialCategories }: CategoriesListProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("Laptop");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error("Please enter a name and slug");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, icon }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      toast.success("Category added successfully!");
      setCategories([...categories, data.category]);
      setName("");
      setSlug("");
      setIcon("Laptop");
    } catch (err: any) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (catId: string) => {
    if (!confirm("Are you sure you want to delete this category? Jobs already posted in this category will keep their tags but the category index will be lost.")) {
      return;
    }

    setDeletingId(catId);
    try {
      const res = await fetch(`/api/admin/categories/${catId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      toast.success("Category deleted successfully.");
      setCategories(categories.filter((c) => c._id !== catId));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  // Autogenerate slug on name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Manage Categories</h1>
        <p className="text-sm text-slate-500 mt-1">
          Add, configure, or remove classification sectors used across the job portal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Categories List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-blue-600" />
              <span>Registered Sectors ({categories.length})</span>
            </h2>

            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const IconComp = iconMap[cat.icon] || Laptop;
                  return (
                    <div
                      key={cat._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{cat.name}</h4>
                          <p className="text-xs text-slate-400 font-semibold">{cat.slug}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(cat._id)}
                        disabled={deletingId === cat._id}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        {deletingId === cat._id ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          <Trash2 className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-sm">
                No sectors registered. Use the configuration form to create categories.
              </div>
            )}
          </div>
        </div>

        {/* Right column: Create category form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-905 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-700">
              Create Sector
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Graphic Design"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-505 uppercase tracking-wider mb-1">
                  Custom Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. graphic-design"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Lucide Display Icon
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableIcons.map((ic) => {
                    const TargetIcon = iconMap[ic] || Laptop;
                    return (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setIcon(ic)}
                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-all ${
                          icon === ic
                            ? "border-blue-600 bg-blue-50/50 text-blue-600"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-350"
                        }`}
                      >
                        <TargetIcon className="h-5 w-5" />
                        <span className="text-[10px] mt-1 font-semibold">{ic}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>Add Category</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
