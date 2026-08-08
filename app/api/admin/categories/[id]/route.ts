import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";

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

    const docRef = db.collection("categories").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await docRef.update({ name, slug, icon });

    const categoryData = docSnap.data() || {};
    const updatedCategory = { _id: id, ...categoryData, name, slug, icon };

    return NextResponse.json({
      message: "Category updated successfully.",
      category: updatedCategory,
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

    const docRef = db.collection("categories").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ message: "Category deleted successfully." });
  } catch (error: any) {
    console.error("Admin category DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 550 });
  }
}
