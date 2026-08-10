import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, experienceRequired, jobType } = body;

    if (!title) {
      return NextResponse.json({ error: "Job title is required to generate description" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI Service is not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert HR recruiter. 
Generate a professional job description and a list of required skills for the following job posting:
Title: ${title}
Category: ${category || "General"}
Experience: ${experienceRequired || "Any"}
Type: ${jobType || "Full Time"}

Please format your response strictly as a JSON object with two keys:
1. "description": A detailed, professional job description (around 3-4 paragraphs or bullet points). You can use basic markdown or plain text.
2. "skills": A comma-separated string of the most relevant 5-8 skills required for this role.

Return ONLY the raw JSON object, without any markdown formatting blocks like \`\`\`json.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Sometimes the model might wrap in markdown despite instructions, so we clean it
      const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsedData = JSON.parse(cleanedText);
      return NextResponse.json(parsedData);
    } catch (parseErr) {
      console.error("Failed to parse Gemini output:", text);
      return NextResponse.json({ error: "Failed to generate structured data from AI" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong during AI generation" },
      { status: 500 }
    );
  }
}
