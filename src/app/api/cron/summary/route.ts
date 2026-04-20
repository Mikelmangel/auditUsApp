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

        if (stats && stats.length > 0) {
          // --- BEGIN SURVIVAL ELIMINATION LOGIC ---
          const activeGame = await survivalService.getActiveGame(group.id).catch(() => null);
          let eliminatedUser: string | null = null;

          if (activeGame) {
            const voteCounts: Record<string, number> = {};
            stats.forEach(poll => {
              poll.votes?.forEach((v: any) => {
                voteCounts[v.target_id] = (voteCounts[v.target_id] || 0) + 1;
              });
            });

            let maxVotes = 0;
            Object.entries(voteCounts).forEach(([userId, count]) => {
              const participant = activeGame.participants.find((p: any) => p.profile_id === userId);
              if (participant && !participant.is_eliminated && count > maxVotes) {
                maxVotes = count;
                eliminatedUser = userId;
              }
            });

            if (eliminatedUser) {
              await survivalService.eliminateParticipant(activeGame.id, eliminatedUser);

              const remaining = activeGame.participants.filter((p: any) => !p.is_eliminated && p.profile_id !== eliminatedUser);
              if (remaining.length <= 1) {
                await survivalService.finishGame(activeGame.id);
              }
            }
          }
          // --- END SURVIVAL LOGIC ---

          const extraContext = eliminatedUser ? `\n\nATENCIÓN MODO SUPERVIVENCIA: Hemos eliminado a un participante hoy debido a que recibió la mayoría de los votos. Destaca este evento dramático.` : "";

          const auditContent = await gemini.generateSummary("Hoy", group.name, stats);
          await summaryService.createSummary(group.id, "daily", auditContent + extraContext, stats);

          results.push({ groupId: group.id, status: 'success' });
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
