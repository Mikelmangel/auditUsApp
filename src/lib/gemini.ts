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
    
    const prompt = `
      Actúa como un "Auditor" sarcástico pero perspicaz para un grupo social llamado AuditUs.
      Tu tarea es analizar los resultados de las encuestas y comentarios del periodo "${period}" para el grupo "${groupName}" y generar un resumen tipo "Auditoría".
      
      Reglas:
      1. Tono: Divertido, un poco "roast", muy social y moderno. Usa jerga joven y emojis.
      2. Estructura: 
         - Un titular llamativo (ej: "ESTADO DE EMERGENCIA: CAOS TOTAL").
         - Resumen del estado emocional/dinámica del grupo.
         - El "Protagonista" o "Villano" (basado en quién recibió más votos o menciones).
         - Una predicción o consejo irónico para el próximo periodo.
      3. Sé conciso pero impactante.
      4. Formato: Markdown (usa negritas, listas y bloques de cita).
      
      Datos del periodo:
      ${JSON.stringify(data, null, 2)}
    `;

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
