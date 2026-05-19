import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const secret =
    req.headers.get("x-cron-secret") ??
    new URL(req.url).searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: games } = await supabase
    .from("survival_games")
    .select("id, group_id, phase")
    .eq("status", "active")
    .eq("round_processed", false)
    .not("round_deadline", "is", null)
    .lt("round_deadline", new Date().toISOString());

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.auditus.fun";
  const processed: string[] = [];
  const errors: string[] = [];

  for (const game of games ?? []) {
    try {
      const res = await fetch(
        `${baseUrl}/api/groups/${game.group_id}/survival/process-round`,
        { method: "POST" }
      );
      if (res.ok) {
        processed.push(game.id);
      } else {
        const body = await res.json().catch(() => ({}));
        errors.push(`${game.id}: ${body.error ?? res.status}`);
      }
    } catch (e: any) {
      errors.push(`${game.id}: ${e.message}`);
    }
  }

  return NextResponse.json({ processed: processed.length, errors });
}
