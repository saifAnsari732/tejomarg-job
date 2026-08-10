import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import UsersList from "@/components/admin/UsersList";

async function getCandidates() {
  try {
    const snapshot = await db.collection("users").where("role", "==", "candidate").get();
    let candidates = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        _id: doc.id,
        name: data.name || "Unknown Candidate",
        email: data.email || "",
        phone: data.phone || "",
        isBlocked: data.isBlocked,
        createdAt: data.createdAt
      };
    });

    candidates.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

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
