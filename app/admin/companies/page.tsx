import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Company from "@/models/Company";
import CompaniesList from "@/components/admin/CompaniesList";

async function getCompanies() {
  try {
    await dbConnect();
    const companies = await Company.find({}).sort({ createdAt: -1 }).lean();
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
