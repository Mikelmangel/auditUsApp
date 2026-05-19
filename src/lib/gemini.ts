import { GoogleGenerativeAI } from "@google/generative-ai";

// Server-only: NEVER use NEXT_PUBLIC_ prefix for API keys
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const gemini = {
  async generateSummary(period: string, groupName: string, data: any): Promise<string> {
    if (!apiKey) {
      return "Configura la API Key de Gemini para activar las auditorías.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Build human-readable context from structured data
    const { members = [], polls = [], nudges = [] } = data ?? {};

    const pollsText = polls.length === 0
      ? 'Sin encuestas hoy.'
      : polls.map((p: any, i: number) => {
          const resultLine = p.results?.length > 0
            ? p.results.map((r: any) => `${r.name} (${r.votes} voto${r.votes !== 1 ? 's' : ''})`).join(', ')
            : 'sin votos registrados';
          const nonVotersLine = p.nonVoters?.length > 0
            ? `No votaron: ${p.nonVoters.join(', ')}`
            : 'Participación completa ✓';
          const commentsLine = p.comments?.length > 0
            ? `Comentarios: ${p.comments.map((c: any) => `"${c.content}" (${c.author})`).join(' | ')}`
            : '';
          return [
            `${i + 1}. "${p.question}" [${p.type ?? 'poll'}]`,
            `   Participación: ${p.voters?.length ?? 0}/${members.length} (${p.participationPct ?? 0}%)`,
            `   Resultados: ${resultLine}`,
            `   ${nonVotersLine}`,
            commentsLine ? `   ${commentsLine}` : '',
          ].filter(Boolean).join('\n');
        }).join('\n\n');

    const nudgesText = nudges.length === 0
      ? 'Ningún zumbido — todos respondieron por voluntad propia.'
      : nudges.map((n: any) => `• ${n.sender} zumbó a ${n.receiver}`).join('\n');

    const prompt = `Eres el "Auditor Oficial" de "${groupName}", un jurado sarcástico y divertido al estilo reality show.

━━━ DATOS DEL DÍA ━━━
Miembros del grupo (${members.length}): ${members.join(', ')}

📊 ENCUESTAS (${polls.length}):
${pollsText}

🔔 ZUMBIDOS:
${nudgesText}
━━━━━━━━━━━━━━━━━━━━━

Genera el informe de auditoría en Markdown. Sigue esta estructura EXACTA:

## 📋 ESTADO DEL GRUPO
Una o dos frases sobre el ambiente general del día. Cita datos reales (participación, número de encuestas).

## 🏆 PROTAGONISTA DEL DÍA
Quién recibió más votos en total entre todas las encuestas. Nombra a la persona, di cuántos votos, añade un comentario gracioso.

## 😴 VERGÜENZA DEL DÍA
Quién participó menos (no votó en más encuestas). Si todos votaron en todo, celébralo con sarcasmo positivo.

## 🔔 ZUMBIDOS
Si hubo zumbidos, menciona a los "morosos" que necesitaron recordatorio. Si no hubo, celebra la autodisciplina.

## 🔮 VEREDICTO FINAL
Predicción irónica o consejo para mañana. Máximo 2 frases.

REGLAS:
- Usa los nombres REALES de los datos. No inventes ni supongas nada.
- Tono: sarcástico, humor amistoso tipo roast, como un presentador de reality.
- Máximo 280 palabras en total.
- Emojis con moderación (solo los de los encabezados más 1-2 extra máximo).`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (e) {
      console.error("Gemini Error:", e);
      return "Hubo un error al auditar este grupo. La IA está de resaca o el modelo no está disponible.";
    }
  },
  async generateQuestion(category: string, groupName: string, members: string[], language: string): Promise<{ text: string; mode: string }> {
    if (!apiKey) {
      throw new Error("API Key missing");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
      Actúa como el motor de IA de AuditUs, una app social de encuestas entre amigos.
      Tu tarea es generar UNA pregunta divertida, picante o curiosa para el grupo "${groupName}".
      
      Datos del grupo:
      - Miembros: ${members.join(", ")}
      - Categoría solicitada: ${category}
      - Idioma: ${language}
      
      Reglas:
      1. Usa los placeholders {member_A} y {member_B} para referirte a miembros del grupo. No uses sus nombres reales en la pregunta final, usa los placeholders.
      2. La pregunta debe ser original y encajar en la categoría "${category}".
      3. Tipos de dinámica (mode): 
         - "poll": Elegir a uno entre todos (ej: "¿Quién es más probable que...?")
         - "vs": Duelo entre {member_A} y {member_B}.
         - "free": Pregunta abierta para escribir texto.
      4. Responde ÚNICAMENTE con un JSON válido: {"text": "la pregunta con placeholders", "mode": "poll/vs/free"}
      5. Sé creativo y atrevido, pero no ofensivo.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      // Clean markdown if present
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error("Gemini Question Error:", e);
      return { 
        text: language === 'es' 
          ? "¿Quién de {group_name} es más probable que sea un robot camuflado?" 
          : "Who in {group_name} is most likely to be a robot in disguise?", 
        mode: "poll" 
      };
    }
  }
};
