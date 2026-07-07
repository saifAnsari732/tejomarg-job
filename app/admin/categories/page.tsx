import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import CategoriesList from "@/components/admin/CategoriesList";

async function getCategories() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error loading categories list:", error);
    return [];
  }
}

export default async function AdminManageCategoriesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const categories = await getCategories();

  return <CategoriesList initialCategories={categories} />;
}
export const dynamic = "force-dynamic";
