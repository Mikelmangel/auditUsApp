import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const gemini = {
  async generateSummary(period: string, groupName: string, data: any): Promise<string> {
    if (!apiKey) {
      return "Configura la API Key de Gemini para activar las auditorías.";
    }

    // El usuario especificó gemini-2.5-flash-lite
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
  }
};
