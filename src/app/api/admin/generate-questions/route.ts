import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// Hardcoded for now unless configured in .env
const ADMIN_SECRET = process.env.ADMIN_SECRET || "auditus-secret-2026";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${ADMIN_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    const body = await request.json();
    const count = parseInt(body.count) || 10;
    const category = body.category || "humor";

    // Build the AI Prompt
    const prompt = `
Eres el guionista principal de AuditUs, una app social donde grupos de amigos votan en minijuegos.
Genera exactamente ${count} preguntas para la categoría "${category}".
Usa obligatoriamente los placeholders: {member_A}, {member_B} o {group_name} si la pregunta lo requiere, pero NO todos los modos los necesitan. 
No uses placeholders inventados, SOLO {member_A}, {member_B} y {group_name}.

Los modos disponibles son: 
- 'vs' (1 vs 1, SIEMPRE usar {member_A} y {member_B}). Ej: "¿Quién ganaría una pelea, {member_A} o {member_B}?"
- 'poll' (todos pueden ser votados). Ej: "¿Quién es más probable que termine en la cárcel?"
- 'mc' (multiple choice, requiere opciones fijas en el array "options": ["A", "B", "C", "D"]). Ej: "Si estuviésemos perdidos en la selva, ¿qué construiríamos primero?"
- 'scale' (escala 1 a 10). Ej: "¿Del 1 al 10, cómo evaluarías el estilo de {member_A} al vestir?"
- 'free' (respuesta libre). Ej: "¿Cuál es vuestra anécdota favorita del peor viaje que hemos hecho?"
- 'ranking' (ordenamiento del grupo). Ej: "Ordena a los participantes del más callado al más fiestero."

El nivel de las preguntas debe ser divertido, conversacional, moderno (español de España) y amigable pero con "salseo" (picante lúdico).

DEVUELVE ÚNICA Y EXCLUSIVAMENTE UN ARRAY JSON VÁLIDO CON ESTA ESTRUCTURA DE typescript (NO añadas \`\`\`json ni texto extra):
[
  {
    "text": "¿Quién es más ordenado, {member_A} o {member_B}?",
    "mode": "vs",
    "category": "${category}",
    "options": null,
    "is_anonymous": false,
    "min_members": 2,
    "tags": ["casual"]
  }
]

Recuerda: si el modo es 'mc', el campo 'options' debe ser un array de 3 a 5 strings cortos, de lo contrario 'null'. Si category es 'atrevidas', 'is_anonymous' debe ser true.
`;

    // Initialize Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean potential markdown blocks
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) cleanedText = cleanedText.slice(7);
    if (cleanedText.startsWith('```')) cleanedText = cleanedText.slice(3);
    if (cleanedText.endsWith('```')) cleanedText = cleanedText.slice(0, -3);
    cleanedText = cleanedText.trim();

    let questions;
    try {
      questions = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse JSON", cleanedText);
      return NextResponse.json({ error: "AI returned invalid JSON", raw: cleanedText }, { status: 500 });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "AI did not return an array" }, { status: 500 });
    }

    // Insert into Supabase
    // We strictly need service_role_key because questions table doesn't have INSERT RLS policy for anon.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json({ 
        warning: "SUPABASE_SERVICE_ROLE_KEY missing, couldn't insert into DB. You must configure this environment variable.", 
        dryRunData: questions 
      }, { status: 200 });
    }

    const supaAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      serviceRoleKey
    );

    const { data, error } = await supaAdmin.from('questions').insert(questions).select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Database insertion failed", details: error }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      insertedCount: data.length,
      category_requested: category,
      sample: data[0]
    });

  } catch (error: any) {
    console.error("Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
