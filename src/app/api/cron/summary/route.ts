import { NextResponse } from "next/server";
import { groupService, summaryService, survivalService } from "@/lib/services";
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
        const stats = await summaryService.getSummaryStats(group.id);
        
        // Solo generamos si hay al menos una encuesta hoy
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

            // Find highest voted user who is a participant and not already eliminated
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
              
              // Check for winner
              const remaining = activeGame.participants.filter((p: any) => !p.is_eliminated && p.profile_id !== eliminatedUser);
              if (remaining.length <= 1) {
                await survivalService.finishGame(activeGame.id);
                // We could add points here later
              }
            }
          }
          // --- END SURVIVAL LOGIC ---

          // Modificamos el contexto de Gemini para que sepa si alguien cayó
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
