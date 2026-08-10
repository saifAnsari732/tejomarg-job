"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Tag, Percent } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New coupon state
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState<number | "">("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCoupons(data.coupons || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || newDiscount === "" || newDiscount < 1 || newDiscount > 100) {
      toast.error("Please enter a valid code and a discount between 1 and 100.");
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCode.trim(),
          discountPercentage: Number(newDiscount)
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(data.message);
      setCoupons([data.coupon, ...coupons]);
      setNewCode("");
      setNewDiscount("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create coupon");
    } finally {
      setIsCreating(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setCoupons(coupons.map(c => c._id === id ? { ...c, isActive: !currentStatus } : c));
      
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Coupon status updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
      // Revert optimistic update
      setCoupons(coupons.map(c => c._id === id ? { ...c, isActive: currentStatus } : c));
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon? This cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success("Coupon deleted");
      setCoupons(coupons.filter(c => c._id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete coupon");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-500" />
            Discount Coupons
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage employer discount codes</p>
        </div>
      </div>

      <div className="p-6">
        {/* Create Form */}
        <form onSubmit={handleCreateCoupon} className="bg-indigo-50/50 dark:bg-slate-900/30 rounded-xl p-5 border border-indigo-100 dark:border-slate-700 mb-8 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:flex-1 space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Coupon Code</label>
            <input 
              type="text" 
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="e.g. DIWALI50" 
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
          <div className="w-full md:w-48 space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Discount %</label>
            <div className="relative">
              <input 
                type="number" 
                min="1" max="100"
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value ? Number(e.target.value) : "")}
                placeholder="50" 
                className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isCreating}
            className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Create Coupon
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <Tag className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No coupons found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 text-sm">
              Create your first discount coupon using the form above to share with employers.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6">Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {coupon.code}
                    </td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                      {coupon.discountPercentage}% OFF
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(coupon.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => toggleStatus(coupon._id, coupon.isActive)}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                          coupon.isActive 
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={() => deleteCoupon(coupon._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
