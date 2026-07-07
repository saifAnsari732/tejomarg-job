import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ error: "Failed to retrieve categories" }, { status: 500 });
  }
}
