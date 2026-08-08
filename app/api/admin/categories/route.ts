import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access only." }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, icon } = body;

    if (!name || !slug || !icon) {
      return NextResponse.json({ error: "Name, slug, and icon are required." }, { status: 450 });
    }

    const categoriesRef = db.collection("categories");
    
    // Check if exists
    const nameQuery = await categoriesRef.where("name", "==", name).get();
    const slugQuery = await categoriesRef.where("slug", "==", slug).get();

    if (!nameQuery.empty || !slugQuery.empty) {
      return NextResponse.json(
        { error: "A category with this name or slug already exists." },
        { status: 400 }
      );
    }

    const categoryData = { name, slug, icon, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const docRef = await categoriesRef.add(categoryData);

    const newCategory = { _id: docRef.id, ...categoryData };

    return NextResponse.json({
      message: "Category created successfully.",
      category: newCategory,
    });
  } catch (error: any) {
    console.error("Admin category POST error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
