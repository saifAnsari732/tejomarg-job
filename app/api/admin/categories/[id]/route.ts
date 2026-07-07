import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    await dbConnect();

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: { name, slug, icon } },
      { new: true }
    );

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Category updated successfully.",
      category,
    });
  } catch (error: any) {
    console.error("Admin category PUT error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access only." }, { status: 403 });
    }

    await dbConnect();

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully." });
  } catch (error: any) {
    console.error("Admin category DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 550 });
  }
}
