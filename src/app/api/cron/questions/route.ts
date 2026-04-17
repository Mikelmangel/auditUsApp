import { NextResponse } from "next/server";
import { groupService, pollService, questionService } from "@/lib/services";
import { supabase } from "@/lib/supabase";

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
        const count = await pollService.getTodaysPollCount(group.id);
        if (count < 3) {
          const members = await groupService.getGroupMembers(group.id);
          // Necesitamos al menos 2 miembros para la mayoría de preguntas
          if (members.length < 2) {
            results.push({ groupId: group.id, status: 'not_enough_members' });
            continue;
          }

          const q = await questionService.getRandomQuestion(group.id, members.length);
          
          if (q) {
            const shuffled = [...members].sort(() => Math.random() - 0.5);
            const rendered = questionService.renderQuestion(q.text, {
              groupName: group.name,
              memberA: shuffled[0]?.profiles?.username,
              memberB: shuffled[1]?.profiles?.username,
              memberCount: members.length,
            });
            
            // Usamos el creador del grupo como autor de la encuesta del sistema
            await pollService.createPoll(group.id, rendered, group.created_by, q.mode);
            await supabase.from("group_poll_history").insert([{ group_id: group.id, question_id: q.id }]);
            results.push({ groupId: group.id, status: 'created' });
          } else {
            results.push({ groupId: group.id, status: 'no_questions_available' });
          }
        } else {
          results.push({ groupId: group.id, status: 'limit_reached' });
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
