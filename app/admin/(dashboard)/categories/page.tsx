import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import CategoriesList from "@/components/admin/CategoriesList";

async function getCategories() {
  try {
    const snapshot = await db.collection("categories").orderBy("name").get();
    const categories = snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));
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
