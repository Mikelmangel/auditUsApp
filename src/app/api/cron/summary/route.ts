import { NextResponse } from "next/server";
import { groupService, summaryService, survivalService, pollService } from "@/lib/services";
import { gemini } from "@/lib/gemini";

export async function GET(request: Request) {
  // Verificación de seguridad básica para Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const groups = await groupService.getAllGroups();
    const results = [];

    for (const group of groups) {
      try {
        // Cerrar siempre todas las encuestas activas, independientemente de si hay stats hoy
        await pollService.closeActivePolls(group.id);

        const stats = await summaryService.getSummaryStats(group.id);

        // ── BATTLE ROYALE ELIMINATION LOGIC ──
        let battleRoyaleContext = "";
        const activeGame = await survivalService.getActiveGame(group.id).catch(() => null);

        if (activeGame) {
          try {
            let eliminatedId: string | null = null;

            if (activeGame.phase === 'final_duel') {
              // Process final duel
              const winnerId = await survivalService.processFinalDuel(activeGame.id);
              if (winnerId) {
                const winner = activeGame.participants.find(p => p.profile_id === winnerId);
                const winnerName = winner?.profiles?.username || 'desconocido';
                battleRoyaleContext = `\n\n🏆 BATTLE ROYALE FINALIZADO: ¡${winnerName} ha ganado el Battle Royale! Es el último superviviente. Celebra este evento épico con máximo dramatismo.`;
              }
            } else if (activeGame.phase === 'voting') {
              // Process normal round elimination
              const result = await survivalService.processRoundElimination(activeGame.id);
              eliminatedId = result.eliminatedId;

              if (eliminatedId) {
                const eliminated = activeGame.participants.find(p => p.profile_id === eliminatedId);
                const eliminatedName = eliminated?.profiles?.username || 'desconocido';
                const alive = activeGame.participants.filter(p => !p.is_eliminated && p.profile_id !== eliminatedId);

                if (result.isFinished) {
                  const winner = alive[0];
                  const winnerName = winner?.profiles?.username || 'desconocido';
                  battleRoyaleContext = `\n\n🏆 BATTLE ROYALE FINALIZADO: ${eliminatedName} fue eliminado y ¡${winnerName} es el CAMPEÓN! Celebra con máximo dramatismo.`;
                } else if (alive.length === 2) {
                  battleRoyaleContext = `\n\n⚔️ BATTLE ROYALE — DUELO FINAL: ${eliminatedName} fue eliminado en la Ronda ${activeGame.current_round}. Quedan solo 2 supervivientes: ${alive.map(a => a.profiles?.username).join(' vs ')}. ¡El duelo final comienza mañana!`;
                } else {
                  battleRoyaleContext = `\n\n💀 BATTLE ROYALE — Ronda ${activeGame.current_round}: ${eliminatedName} ha sido eliminado por votación popular. Quedan ${alive.length} supervivientes. Destaca este momento dramático.`;
                }
              } else {
                battleRoyaleContext = `\n\n⚔️ BATTLE ROYALE — Ronda ${activeGame.current_round}: Nadie recibió votos, no hubo eliminación. La tensión crece...`;
              }
            }
          } catch (brError: any) {
            console.error(`Battle Royale error for group ${group.id}:`, brError.message);
          }
        }
        // ── END BATTLE ROYALE LOGIC ──

        if (stats && stats.length > 0) {
          const auditContent = await gemini.generateSummary("Hoy", group.name, stats);
          await summaryService.createSummary(group.id, "daily", auditContent + battleRoyaleContext, stats);
          results.push({ groupId: group.id, status: 'success' });
        } else if (battleRoyaleContext) {
          // Even without polls, generate a summary if Battle Royale events happened
          const brSummary = `## ⚔️ Battle Royale Update\n${battleRoyaleContext.trim()}`;
          await summaryService.createSummary(group.id, "daily", brSummary, {});
          results.push({ groupId: group.id, status: 'battle_royale_only' });
        } else {
          results.push({ groupId: group.id, status: 'no_data_for_today' });
        }
      } catch (e: any) {
        results.push({ groupId: group.id, status: 'error', error: e.message });
      }
    }

    return NextResponse.json({ success: true, processed: results.length, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

