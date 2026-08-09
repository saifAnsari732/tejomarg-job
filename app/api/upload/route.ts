import { NextResponse } from "next/server";
import { storageAdmin } from "@/lib/firebaseAdmin";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    // Validate file extension (for safety, e.g. pdf, png, jpg, jpeg)
    const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg"];
    const fileExtension = path.extname(file.name).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: PDF, PNG, JPG, JPEG" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate clean unique filename
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${sanitizedFilename}`;
    
    // Upload to Firebase Storage
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tejomart-trade.firebasestorage.app";
    const bucket = storageAdmin.bucket(bucketName);
    const fileRef = bucket.file(`uploads/${filename}`);
    
    await fileRef.save(buffer, {
      metadata: { 
        contentType: file.type,
      },
    });

    // Make the file publicly accessible
    await fileRef.makePublic();

    // Construct the public URL
    const fileUrl = `https://storage.googleapis.com/${bucketName}/uploads/${filename}`;

    return NextResponse.json({ 
      url: fileUrl,
      name: file.name,
      size: file.size
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: "Failed to upload file. Please try again." }, { status: 500 });
  }
}
