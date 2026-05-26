import { NextResponse } from "next/server";
import { gemini } from "@/lib/gemini";

/**
 * POST /api/ai/question
 * Server-side AI question generation.
 * Keeps the Gemini API key secure (never sent to the client).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, groupName, memberNames, language } = body;

    if (!category || !groupName || !Array.isArray(memberNames)) {
      return NextResponse.json(
        { error: "Missing required fields: category, groupName, memberNames" },
        { status: 400 }
      );
    }

    const result = await gemini.generateQuestion(
      category,
      groupName,
      memberNames,
      language || "es"
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Question API Error:", error);
    return NextResponse.json(
      { error: error.message || "AI generation failed" },
      { status: 500 }
    );
  }
}
