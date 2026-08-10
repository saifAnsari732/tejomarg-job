import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import CompaniesList from "@/components/admin/CompaniesList";

async function getCompanies() {
  try {
    const snapshot = await db.collection("companies").orderBy("createdAt", "desc").get();
    const companies = snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));
    return JSON.parse(JSON.stringify(companies));
  } catch (error) {
    console.error("Error loading companies list:", error);
    return [];
  }
}

export default async function AdminManageCompaniesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const companies = await getCompanies();

  return <CompaniesList initialCompanies={companies} />;
}
export const dynamic = "force-dynamic";
