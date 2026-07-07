import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

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

    await dbConnect();

    // Check if exists
    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return NextResponse.json(
        { error: "A category with this name or slug already exists." },
        { status: 400 }
      );
    }

    const newCategory = await Category.create({ name, slug, icon });

    return NextResponse.json({
      message: "Category created successfully.",
      category: newCategory,
    });
  } catch (error: any) {
    console.error("Admin category POST error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
