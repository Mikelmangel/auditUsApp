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
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const BATCH_SIZE = 50; 
const TOTAL_NEEDED = 3000;
const CATEGORIES = ['humor', 'habilidades', 'futuro', 'atrevidas', 'hipoteticas', 'vinculos', 'eventos'];

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateBatch(category: string, batchSize: number): Promise<any[]> {
    const prompt = `
Eres el guionista principal de AuditUs, una app social donde grupos de amigos votan en minijuegos y responden dilemas.
Genera EXACTAMENTE ${batchSize} preguntas totalmente únicas, creativas y diferentes para la categoría "${category}".
Evita repetir temas. Sé original. 

Usa los placeholders: {member_A}, {member_B} o {group_name} DÓNDE aplique.
Modos: 'vs', 'poll', 'mc', 'scale', 'free', 'ranking'. 

Devuelve SÓLO Y ESTRICTAMENTE un ARRAY JSON sin markdown.
Ejemplo:
[{"text": "¿Quién ganaría en un concurso de comer perritos calientes, {member_A} o {member_B}?", "mode": "vs", "category": "${category}", "options": null}]
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
    console.log(`🚀 Iniciando generación masiva de ${TOTAL_NEEDED} preguntas AuditUs MVP...`);
    const outputFile = path.join(process.cwd(), "supabase", "migrations", "20260417000003_massive_3000_seed.sql");
    
    // Header for SQL
    fs.writeFileSync(outputFile, `-- Seed generado automáticamente\nINSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members) VALUES\n`);

    let totalGenerated = 0;
    let isFirst = true;
    
    while (totalGenerated < TOTAL_NEEDED) {
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        console.log(`⏳ Generando batch de ${BATCH_SIZE} para la categoría: ${category}... (${totalGenerated}/${TOTAL_NEEDED})`);
        
        const questionsChunk = await generateBatch(category, BATCH_SIZE);
        
        if (questionsChunk.length > 0) {
            let sqlChunk = "";
            for (const q of questionsChunk) {
                if (!q.text || !q.mode || !q.category) continue;
                
                let textSafe = q.text.replace(/'/g, "''");
                let optionsSafe = q.options && Array.isArray(q.options) 
                  ? `ARRAY['${q.options.map((o:any) => o.replace(/'/g, "''")).join("','")}']` 
                  : "NULL";
                let isAnon = q.category === 'atrevidas' ? 'true' : 'false';
                
                const prefix = isFirst ? "" : ",\n";
                sqlChunk += `${prefix}('${textSafe}', '${q.mode}', '${q.category}', ${optionsSafe}, ${isAnon}, 2)`;
                isFirst = false;
                totalGenerated++;
            }
            
            fs.appendFileSync(outputFile, sqlChunk);
            console.log(`✅ ¡Éxito! Van ${totalGenerated} agregadas al archivo SQL.`);
        }
        
        // Rate limiting cooldown (Gemini free tier compliance)
        await wait(3000); 
    }
    
    // Closer
    fs.appendFileSync(outputFile, ";\n");
    console.log(`\n🎉 COMPLETADO. Tienes tus ${totalGenerated} preguntas en: ${outputFile}`);
    console.log(`Ahora puedes abrir Supabase y ejecutar ese archivo allí.`);
}

main();
