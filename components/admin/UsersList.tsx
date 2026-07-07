"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { User, Trash2, Ban, ShieldAlert, Loader2, Search, Users } from "lucide-react";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  createdAt: string;
}

interface UsersListProps {
  initialUsers: UserItem[];
}

export default function UsersList({ initialUsers }: UsersListProps) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleBlock = async (user: UserItem) => {
    const nextBlockedState = !user.isBlocked;
    setUpdatingId(user._id);

    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: nextBlockedState }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      toast.success(
        nextBlockedState ? "User account suspended." : "User account restored."
      );
      setUsers(
        users.map((u) => (u._id === user._id ? { ...u, isBlocked: nextBlockedState } : u))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to change user status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? All profile records and job applications linked to this user will be orphaned or deleted. This action is permanent!")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      toast.success("User account deleted successfully.");
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user account");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Manage Job Seekers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor registration metrics, suspend profiles, or delete job seeker accounts.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-450 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/35 text-blue-650 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate">{user.name}</h4>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isBlocked ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-150">
                          Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-150">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        {updatingId === user._id ? (
                          <Loader2 className="h-5 w-5 animate-spin text-slate-400 mx-2" />
                        ) : (
                          <>
                            {/* Toggle Suspend */}
                            <button
                              onClick={() => handleToggleBlock(user)}
                              className={`p-2 border rounded-xl transition-colors cursor-pointer flex items-center justify-center ${
                                user.isBlocked
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                              }`}
                              title={user.isBlocked ? "Unsuspend User Account" : "Suspend User Account"}
                            >
                              {user.isBlocked ? <Users className="h-4.5 w-4.5" /> : <Ban className="h-4.5 w-4.5" />}
                            </button>

                            {/* Delete User */}
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-2 border border-slate-200 dark:border-slate-700 hover:border-rose-200 hover:bg-rose-50/50 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                              title="Delete User Permanently"
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
          <User className="h-16 w-16 mx-auto text-slate-350" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4">No candidates found</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            We couldn't find any registered candidates matching your search term.
          </p>
        </div>
      )}
    </div>
  );
}
