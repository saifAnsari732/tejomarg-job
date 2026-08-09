import { NextResponse } from "next/server";
import { storageAdmin } from "@/lib/firebaseAdmin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";

// Fix for pdf-parse default export error in Next.js
const pdfParseModule = require("pdf-parse");
const pdfParse = typeof pdfParseModule === "function" ? pdfParseModule : pdfParseModule.default;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg"];
    const fileExtension = path.extname(file.name).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: PDF, PNG, JPG, JPEG" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // AI Parsing (Only for PDFs)
    let parsedData = null;
    if (fileExtension === ".pdf" && process.env.GEMINI_API_KEY) {
      try {
        const pdfData = await pdfParse(buffer);
        const text = pdfData.text;

        const prompt = `
          Extract the following information from this resume text. Return ONLY a pure JSON object, without any markdown formatting or \`\`\`json wrappers. 
          If a field is not found, leave it as an empty string.

          Fields required:
          - name: string
          - mobile: string (just the number)
          - email: string
          - skills: string (comma separated list of professional skills)
          - highestEducation: string (e.g., Graduate, Post Graduate, Class 12, etc.)
          - totalExperience: string (e.g., Fresher, 1 Year, 2 Years, etc.)
          - currentLocation: string (city name)
          
          Resume Text:
          ${text.substring(0, 15000)}
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Clean JSON from potential markdown wrappers
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleanedJson);
      } catch (parseError) {
        console.error("Resume parsing error:", parseError);
        // Continue upload even if parsing fails
      }
    }

    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${sanitizedFilename}`;
    
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tejomart-trade.firebasestorage.app";
    const bucket = storageAdmin.bucket(bucketName);
    const fileRef = bucket.file(`uploads/${filename}`);
    
    await fileRef.save(buffer, {
      metadata: { 
        contentType: file.type,
      },
    });

    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(`uploads/${filename}`)}?alt=media`;

    return NextResponse.json({ 
      url: fileUrl,
      name: file.name,
      size: file.size,
      parsedData
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: "Failed to upload file. Please try again." }, { status: 500 });
  }
}
