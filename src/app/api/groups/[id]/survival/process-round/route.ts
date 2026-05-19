import { NextResponse } from "next/server";
import { survivalService } from "@/lib/services";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params;

    const game = await survivalService.getActiveGame(groupId);
    if (!game || game.status !== "active") {
      return NextResponse.json({ error: "No active game" }, { status: 400 });
    }

    if (game.round_processed) {
      return NextResponse.json({ error: "Round already processed" }, { status: 409 });
    }

    let result: { eliminatedId?: string | null; winnerId?: string | null; isFinished: boolean };

    if (game.phase === "final_duel") {
      const winnerId = await survivalService.processFinalDuel(game.id);
      result = { winnerId, isFinished: true };
    } else {
      result = await survivalService.processRoundElimination(game.id);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("process-round error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
