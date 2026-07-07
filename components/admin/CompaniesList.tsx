"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Building2, ShieldCheck, ShieldAlert, Trash2, Globe, MapPin, Loader2, Search } from "lucide-react";

interface CompanyItem {
  _id: string;
  name: string;
  logo?: string;
  location: string;
  industry: string;
  website?: string;
  isVerified: boolean;
  createdAt: string;
}

interface CompaniesListProps {
  initialCompanies: CompanyItem[];
}

export default function CompaniesList({ initialCompanies }: CompaniesListProps) {
  const [companies, setCompanies] = useState<CompanyItem[]>(initialCompanies);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleVerify = async (company: CompanyItem) => {
    const nextVerifyState = !company.isVerified;
    setUpdatingId(company._id);

    try {
      const res = await fetch(`/api/admin/companies/${company._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: nextVerifyState }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      toast.success(
        nextVerifyState ? "Company profile verified successfully!" : "Company profile unverified."
      );
      setCompanies(
        companies.map((c) => (c._id === company._id ? { ...c, isVerified: nextVerifyState } : c))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle verification");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (companyId: string) => {
    if (!confirm("Are you sure you want to delete this company profile? This action is permanent!")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/companies/${companyId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete company");
      }

      toast.success("Company profile deleted successfully.");
      setCompanies(companies.filter((c) => c._id !== companyId));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete company profile");
    }
  };

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Verify Companies</h1>
          <p className="text-sm text-slate-550 mt-1">
            Audit employer accounts, issue verification badges, or delete profiles.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-405" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {filteredCompanies.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-450 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Company details</th>
                  <th className="px-6 py-4">Industry HQ</th>
                  <th className="px-6 py-4">Verification Status</th>
                  <th className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                {filteredCompanies.map((company) => (
                  <tr key={company._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition-colors">
                    {/* Company info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                            <Building2 className="h-5 w-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate">
                            <Link href={`/companies/${company._id}`} className="hover:underline">
                              {company.name}
                            </Link>
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                            {company.website ? (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:underline text-blue-600 inline-flex items-center gap-0.5"
                              >
                                <Globe className="h-3 w-3" />
                                <span>Website</span>
                              </a>
                            ) : (
                              "No website listed"
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Industry HQ */}
                    <td className="px-6 py-4">
                      <div className="text-slate-900 dark:text-white font-medium">{company.industry}</div>
                      <div className="text-xs text-slate-450 dark:text-slate-400 flex items-center mt-0.5">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                        {company.location}
                      </div>
                    </td>

                    {/* Verification Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {company.isVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-150">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-150">
                          Unverified
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        {updatingId === company._id ? (
                          <Loader2 className="h-5 w-5 animate-spin text-slate-400 mx-2" />
                        ) : (
                          <>
                            {/* Toggle verify */}
                            <button
                              onClick={() => handleToggleVerify(company)}
                              className={`p-2 border rounded-xl transition-colors cursor-pointer flex items-center justify-center ${
                                company.isVerified
                                  ? "border-amber-250 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  : "border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                              title={company.isVerified ? "Revoke Verification" : "Verify Company Profile"}
                            >
                              {company.isVerified ? (
                                <ShieldAlert className="h-4.5 w-4.5" />
                              ) : (
                                <ShieldCheck className="h-4.5 w-4.5" />
                              )}
                            </button>

                            {/* Delete Company */}
                            <button
                              onClick={() => handleDelete(company._id)}
                              className="p-2 border border-slate-205 dark:border-slate-700 hover:border-rose-205 hover:bg-rose-50/50 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                              title="Delete Company Profile"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl py-16 px-6 text-center shadow-sm">
          <Building2 className="h-16 w-16 mx-auto text-slate-350" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4">No companies found</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            We couldn't find any registered companies matching your search terms.
          </p>
        </div>
      )}
    </div>
  );
}
