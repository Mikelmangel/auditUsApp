import { NextResponse } from "next/server";
import { summaryService } from "@/lib/services";
import { gemini } from "@/lib/gemini";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { groupName, period = "Hoy" } = body;

    const stats = await summaryService.getSummaryStats(id);
    const auditContent = await gemini.generateSummary(period, groupName, stats);
    const newSummary = await summaryService.createSummary(id, "daily", auditContent, stats);

    return NextResponse.json(newSummary);
  } catch (error: any) {
    console.error("Audit API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
