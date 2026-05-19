import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { summaryService } from "@/lib/services";
import { gemini } from "@/lib/gemini";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params;

    // Verify authenticated user
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: { user }, error: authError } = await adminSupabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify user is admin or creator of the group
    const { data: membership } = await adminSupabase
      .from("group_members")
      .select("role")
      .eq("group_id", groupId)
      .eq("profile_id", user.id)
      .single();

    if (!membership || !["admin", "creator"].includes(membership.role)) {
      return NextResponse.json({ error: "Solo los admins pueden generar el informe." }, { status: 403 });
    }

    // One summary per day
    const alreadyExists = await summaryService.hasTodaySummary(groupId);
    if (alreadyExists) {
      return NextResponse.json({ error: "Ya se generó el informe de hoy. Vuelve mañana." }, { status: 409 });
    }

    const body = await request.json();
    const { groupName } = body;

    const stats = await summaryService.getSummaryStats(groupId);
    const auditContent = await gemini.generateSummary("Hoy", groupName, stats);
    const newSummary = await summaryService.createSummary(groupId, "daily", auditContent, stats);

    return NextResponse.json(newSummary);
  } catch (error: any) {
    console.error("Audit API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
