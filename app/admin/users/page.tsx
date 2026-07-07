import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import UsersList from "@/components/admin/UsersList";

async function getCandidates() {
  try {
    await dbConnect();
    const candidates = await User.find({ role: "candidate" })
      .select("name email isBlocked createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(candidates));
  } catch (error) {
    console.error("Error loading candidate users:", error);
    return [];
  }
}

export default async function AdminManageUsersPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const candidates = await getCandidates();

  return <UsersList initialUsers={candidates} />;
}
export const dynamic = "force-dynamic";
