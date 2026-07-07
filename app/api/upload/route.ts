import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
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

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate clean unique filename
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${sanitizedFilename}`;
    const filePath = path.join(uploadDir, filename);
    
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;

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
