// script: src/scripts/generate-3k.ts
// Para ejecutar de forma local: npx tsx src/scripts/generate-3k.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";
import 'dotenv/config'; // Esto leerá .env local

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERROR: Necesitas configurar GEMINI_API_KEY en tu entorno o fichero .env.local para correr esto.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.1-flash" });

const BATCH_SIZE = 50; 
const CATEGORIES_DATA = {
    humor: { emoji: '😂', modes: ['vs', 'poll', 'mc'], desc: 'Preguntas ligeras y absurdas para reír sin tensión' },
    habilidades: { emoji: '💪', modes: ['vs', 'ranking', 'scale'], desc: 'Quién es mejor en algo concreto del grupo' },
    futuro: { emoji: '🔮', modes: ['poll', 'vs'], desc: 'Predicciones sobre el grupo a largo plazo' },
    atrevidas: { emoji: '🌶️', modes: ['vs', 'free'], desc: 'Solo en modo anónimo. Verdades incómodas.', is_anon: true },
    hipoteticas: { emoji: '🧠', modes: ['mc', 'vs', 'free'], desc: 'Situaciones imposibles o extremas' },
    vinculos: { emoji: '💛', modes: ['poll', 'scale', 'free'], desc: 'Refuerza la conexión emocional del grupo' },
    eventos: { emoji: '🎉', modes: ['vs', 'poll', 'ranking'], desc: 'Temáticas por contexto: viaje, cumple, año nuevo' },
    ia_custom: { emoji: '🤖', modes: ['vs', 'poll', 'mc', 'scale', 'free', 'ranking'], desc: 'Generadas con el contexto único del grupo' }
};

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

interface Question {
    text: string;
    mode: string;
    category: string;
    options: string[] | null;
    tags?: string[];
}

async function generateBatch(category: string, batchSize: number): Promise<Question[]> {
    const cat = CATEGORIES_DATA[category as keyof typeof CATEGORIES_DATA];
    const prompt = `
Eres el guionista principal de AuditUs, una app social premium de "Infinite Sophistication" (monocromo, elegante).
Genera EXACTAMENTE ${batchSize} preguntas ÚNICAS y CREATIVAS para la categoría "${category}" (${cat.emoji}).
Descripción de la categoría: ${cat.desc}

REGLAS DE MODO ESTRICTAS PARA ESTA CATEGORÍA:
- Solo usa estos modos: ${cat.modes.join(', ')}

ESPECIFICACIONES POR MODO:
- 'vs': Obligatorio usar {member_A} y {member_B}. Dilemas de elección entre dos personas.
- 'poll': Pregunta abierta sobre "quién del grupo...". 
- 'mc' (Multiple Choice): Genera EXACTAMENTE 4 opciones de texto divertidas. NO menciones nombres de personas en las opciones.
- 'scale' (Escala): Preguntas puntuables del 1 al 10 (ej: ¿Qué tan X es {member_A}?). Añade etiquetas de escala en la pregunta si es necesario.
- 'free' (Libre): Preguntas que inciten a contar un secreto, una opinión o una anécdota corta.
- 'ranking': Preguntas que impliquen ordenar a TODO el grupo de más a menos algo.

PLACEHOLDERS:
- {member_A}, {member_B}, {group_name}.

CALIDAD: Evita clichés. Sé ingenioso, algo atrevido pero elegante.
Si es categoría 'atrevidas', sé picante pero nunca vulgar.

Devuelve un ARRAY JSON:
[{"text": "...", "mode": "...", "category": "${category}", "options": ["...", "...", "...", "..."] | null, "tags": ["${cat.emoji}", "..."]}]
`;

    try {
        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        if (text.startsWith('```json')) text = text.slice(7);
        if (text.startsWith('```')) text = text.slice(3);
        if (text.endsWith('```')) text = text.slice(0, -3);
        
        return JSON.parse(text.trim());
    } catch (e: any) {
        console.error(`Error generando batch para ${category}:`, e.message);
        return [];
    }
}

async function main() {
    const CATEGORIES = Object.keys(CATEGORIES_DATA);
    const TOTAL_QUESTIONS = parseInt(process.env.GEN_COUNT || "3000");
    const PER_FILE = 300;
    
    console.log(`🚀 Iniciando generación de ${TOTAL_QUESTIONS} preguntas AuditUs.`);
    
    let totalGenerated = 0;
    let fileIndex = 1;
    let isFirstInFile = true;
    let currentOutputFile = "";

    const openNewFile = (index: number) => {
        const filePath = path.join(process.cwd(), "supabase", "migrations", `seed_strict_batch${index}.sql`);
        fs.writeFileSync(filePath, `-- BATCH ${index} - STRICT SPEC\nINSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, tags) VALUES\n`);
        isFirstInFile = true;
        return filePath;
    };

    currentOutputFile = openNewFile(fileIndex);

    while (totalGenerated < TOTAL_QUESTIONS) {
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        console.log(`⏳ [Archivo ${fileIndex}] Generando batch de ${BATCH_SIZE} para: ${category}... (${totalGenerated}/${TOTAL_QUESTIONS})`);
        
        const questionsChunk = await generateBatch(category, BATCH_SIZE);
        
        if (questionsChunk.length > 0) {
            let sqlChunk = "";
            for (const q of questionsChunk) {
                if (!q.text || !q.mode || !q.category) continue;
                
                const catData = CATEGORIES_DATA[q.category as keyof typeof CATEGORIES_DATA];
                let textSafe = q.text.replace(/'/g, "''");
                let optionsSafe = q.options && Array.isArray(q.options) 
                  ? `ARRAY['${q.options.map((o:any) => o.replace(/'/g, "''")).join("','")}']` 
                  : "NULL";
                let isAnon = (catData as any)?.is_anon ? 'true' : 'false';
                let minMemb = q.mode === 'ranking' ? 4 : 2;
                let tagsSafe = q.tags && Array.isArray(q.tags)
                  ? `ARRAY['${q.tags.map((t:any) => t.replace(/'/g, "''")).join("','")}']`
                  : `ARRAY['${catData?.emoji || ''}']`;
                
                const prefix = isFirstInFile ? "" : ",\n";
                sqlChunk += `${prefix}('${textSafe}', '${q.mode}', '${q.category}', ${optionsSafe}, ${isAnon}, ${minMemb}, ${tagsSafe})`;

                isFirstInFile = false;
                totalGenerated++;

                // Check if we need to rotate file
                if (totalGenerated % PER_FILE === 0 && totalGenerated < TOTAL_QUESTIONS) {
                    fs.appendFileSync(currentOutputFile, sqlChunk + ";\n");
                    sqlChunk = "";
                    fileIndex++;
                    currentOutputFile = openNewFile(fileIndex);
                }
            }
            
            if (sqlChunk) fs.appendFileSync(currentOutputFile, sqlChunk);
            console.log(`✅ ¡Éxito! Van ${totalGenerated} registradas.`);
        }
        
        await wait(2000); 
    }
    
    fs.appendFileSync(currentOutputFile, ";\n");
    console.log(`\n🎉 COMPLETADO. Tienes ${fileIndex} archivos en: supabase/migrations/seed_strict_batch*.sql`);
}

main();
