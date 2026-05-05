
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey)

const NEW_QUESTIONS = [
  // --- SPANISH NEW QUESTIONS (Free/Open-Ended) ---
  { text: "¿Cuál es el hábito más extraño que tiene {member_A}?", category: "humor", mode: "free", language: "es", min_members: 2, is_anonymous: false, tags: ["😂"] },
  { text: "Si {member_A} fuera un animal, ¿cuál sería y por qué?", category: "humor", mode: "free", language: "es", min_members: 2, is_anonymous: false, tags: ["😂"] },
  { text: "¿Qué es lo primero que haría {member_A} si fuera invisible por un día?", category: "hipoteticas", mode: "free", language: "es", min_members: 2, is_anonymous: false, tags: ["🧠"] },
  { text: "¿Qué canción define perfectamente la personalidad de {member_A}?", category: "vinculos", mode: "free", language: "es", min_members: 2, is_anonymous: false, tags: ["💛"] },
  { text: "¿Cuál sería el título de la biografía de {member_A}?", category: "humor", mode: "free", language: "es", min_members: 2, is_anonymous: false, tags: ["😂"] },
  { text: "Si {member_A} tuviera un superpoder inútil, ¿cuál sería?", category: "hipoteticas", mode: "free", language: "es", min_members: 2, is_anonymous: false, tags: ["🧠"] },
  { text: "¿Qué es lo más aventurero que ha hecho {member_A} según el grupo?", category: "eventos", mode: "free", language: "es", min_members: 2, is_anonymous: false, tags: ["🎉"] },
  { text: "¿Dónde crees que estará {member_A} dentro de 10 años?", category: "futuro", mode: "free", language: "es", min_members: 2, is_anonymous: false, tags: ["🔮"] },
  
  // --- ENGLISH NEW QUESTIONS (Standard Modes) ---
  { text: "Who in {group_name} would survive a zombie apocalypse for the longest?", category: "habilidades", mode: "poll", language: "en", min_members: 2, is_anonymous: false, tags: ["💪"] },
  { text: "Who is most likely to win a Nobel Prize?", category: "habilidades", mode: "poll", language: "en", min_members: 2, is_anonymous: false, tags: ["💪"] },
  { text: "Who would be the first to get married?", category: "futuro", mode: "poll", language: "en", min_members: 2, is_anonymous: false, tags: ["🔮"] },
  { text: "Who is the best listener in the group?", category: "vinculos", mode: "poll", language: "en", min_members: 2, is_anonymous: false, tags: ["💛"] },
  { text: "Who in {group_name} is the most likely to become a billionaire?", category: "futuro", mode: "poll", language: "en", min_members: 2, is_anonymous: false, tags: ["🔮"] },
  { text: "Who would win in a fight: {member_A} or {member_B}?", category: "habilidades", mode: "vs", language: "en", min_members: 2, is_anonymous: false, tags: ["💪"] },
  { text: "Who is more likely to stay calm in an emergency: {member_A} or {member_B}?", category: "habilidades", mode: "vs", language: "en", min_members: 2, is_anonymous: false, tags: ["💪"] },
  { text: "Rank members of {group_name} by their cooking skills", category: "habilidades", mode: "ranking", language: "en", min_members: 4, is_anonymous: false, tags: ["💪"] },
  
  // --- ENGLISH NEW QUESTIONS (Free/Open-Ended) ---
  { text: "What is {member_A}'s weirdest habit?", category: "humor", mode: "free", language: "en", min_members: 2, is_anonymous: false, tags: ["😂"] },
  { text: "If {member_A} was an animal, which one would they be?", category: "humor", mode: "free", language: "en", min_members: 2, is_anonymous: false, tags: ["😂"] },
  { text: "What would be the first thing {member_A} does if they won the lottery?", category: "hipoteticas", mode: "free", language: "en", min_members: 2, is_anonymous: false, tags: ["🧠"] },
  { text: "What song perfectly defines {member_A}'s personality?", category: "vinculos", mode: "free", language: "en", min_members: 2, is_anonymous: false, tags: ["💛"] },
  { text: "What would be the title of {member_A}'s biography?", category: "humor", mode: "free", language: "en", min_members: 2, is_anonymous: false, tags: ["😂"] },
  { text: "If {member_A} had a useless superpower, what would it be?", category: "hipoteticas", mode: "free", language: "en", min_members: 2, is_anonymous: false, tags: ["🧠"] },
  { text: "What's the most adventurous thing {member_A} has ever done?", category: "eventos", mode: "free", language: "en", min_members: 2, is_anonymous: false, tags: ["🎉"] },
  { text: "Where do you see {member_A} in 10 years?", category: "futuro", mode: "free", language: "en", min_members: 2, is_anonymous: false, tags: ["🔮"] },
];

async function expandDb() {
  // 1. Fetch all Spanish questions to translate
  const { data: esQuestions, error: fetchErr } = await supabase
    .from('questions')
    .select('*')
    .eq('language', 'es');

  if (fetchErr || !esQuestions) {
    console.error('Error fetching ES questions:', fetchErr);
    return;
  }

  console.log(`Found ${esQuestions.length} Spanish questions. Translating...`);

  // 2. Simple translation map for the templates (manual to ensure quality)
  const translations: Record<string, string> = {
    "¿Quién de {group_name} es más probable que termine en la cárcel?": "Who in {group_name} is most likely to end up in jail?",
    "¿Quién sería el primero en llorar viendo una película de Disney?": "Who would be the first to cry watching a Disney movie?",
    "¿Quién es más probable que se olvide del cumpleaños de su mejor amigo?": "Who is most likely to forget their best friend's birthday?",
    "¿Quién ganaría en un debate: {member_A} o {member_B}?": "Who would win in a debate: {member_A} or {member_B}?",
    "¿Quién de {group_name} es el más 'influencer'?": "Who in {group_name} is the most 'influencer'?",
    "¿Quién es más probable que se haga rico con un negocio absurdo?": "Who is most likely to get rich with an absurd business?",
    "¿Quién de {group_name} es más probable que sobreviva a un apocalipsis zombie?": "Who in {group_name} is most likely to survive a zombie apocalypse?",
    "¿Quién es más probable que se ría en el momento menos oportuno?": "Who is most likely to laugh at the most inappropriate moment?",
    "¿Quién de {group_name} es el más 'Drama Queen/King'?": "Who in {group_name} is the biggest 'Drama Queen/King'?",
    "¿Quién es más probable que se mude a otro país sin avisar?": "Who is most likely to move to another country without telling anyone?",
    "¿Quién sería el mejor presidente del gobierno?": "Who would be the best president?",
    "¿Quién de {group_name} es más probable que sea un agente secreto en secreto?": "Who in {group_name} is most likely to be a secret agent in secret?",
    "¿Quién es más probable que gane un concurso de talentos?": "Who is most likely to win a talent show?",
    "¿Quién de {group_name} es el más fiestero?": "Who in {group_name} is the biggest party animal?",
    "¿Quién es más probable que se gaste todo su sueldo en un día?": "Who is most likely to spend their entire salary in one day?",
    "¿Quién de {group_name} es más probable que sea el primero en casarse?": "Who in {group_name} is most likely to be the first to get married?",
    "¿Quién es más probable que se quede dormido en una cita?": "Who is most likely to fall asleep on a date?",
    "¿Quién de {group_name} es el más impuntual?": "Who in {group_name} is the most unpunctual?",
    "¿Quién es más probable que se convierta en un meme viral?": "Who is most likely to become a viral meme?",
    "¿Quién de {group_name} es el más competitivo?": "Who in {group_name} is the most competitive?",
    "¿Quién es más probable que se pierda yendo al baño?": "Who is most likely to get lost on the way to the bathroom?",
    "¿Quién de {group_name} es el más 'geek'?": "Who in {group_name} is the most 'geek'?",
    "¿Quién es más probable que sobreviva solo en una isla desierta?": "Who is most likely to survive alone on a deserted island?",
    "¿Quién de {group_name} es el más propenso a creer en teorías de la conspiración?": "Who in {group_name} is most likely to believe in conspiracy theories?",
    "¿Quién es más probable que se ría con su propio chiste antes de terminarlo?": "Who is most likely to laugh at their own joke before finishing it?",
    "¿Quién de {group_name} es el más 'workaholic'?": "Who in {group_name} is the most 'workaholic'?",
    "¿Quién es más probable que se olvide donde aparcó el coche?": "Who is most likely to forget where they parked the car?",
    "¿Quién de {group_name} es el más 'postureo'?": "Who in {group_name} is the most 'poseur'?",
    "¿Quién es más probable que sea abducido por extraterrestres y no le importe?": "Who is most likely to be abducted by aliens and not care?",
    "¿Quién de {group_name} es el más 'foodie'?": "Who in {group_name} is the biggest 'foodie'?",
    "¿Quién es más probable que se equivoque de grupo de WhatsApp con un mensaje comprometido?": "Who is most likely to send an embarrassing message to the wrong WhatsApp group?",
    "¿Quién de {group_name} es el más 'fitness'?": "Who in {group_name} is the most 'fitness'?",
    "¿Quién es más probable que gane un premio Oscar?": "Who is most likely to win an Oscar?",
    "¿Quién de {group_name} es el más 'chill'?": "Who in {group_name} is the most 'chill'?",
    "¿Quién es más probable que se haga un tatuaje del que se arrepienta?": "Who is most likely to get a tattoo they regret?",
    "¿Quién de {group_name} es el más ahorrador?": "Who in {group_name} is the biggest saver?",
    "¿Quién es más probable que se convierta en ermitaño?": "Who is most likely to become a hermit?",
    "¿Quién de {group_name} es el más 'fashion'?": "Who in {group_name} is the most 'fashion'?",
    "¿Quién es más probable que se ría en un funeral?": "Who is most likely to laugh at a funeral?",
    "¿Quién de {group_name} es el más valiente?": "Who in {group_name} is the bravest?",
    "¿Quién es más probable que se convierta en una celebridad?": "Who is most likely to become a celebrity?",
    "¿Quién de {group_name} es el más despistado?": "Who in {group_name} is the most absent-minded?",
    "¿Quién es más probable que gane la lotería y la pierda en un mes?": "Who is most likely to win the lottery and lose it all in a month?",
    "¿Quién de {group_name} es el más romántico?": "Who in {group_name} is the most romantic?",
    "¿Quién es más probable que se convierta en un villano de película?": "Who is most likely to become a movie villain?",
    "¿Quién de {group_name} es el más 'hater'?": "Who in {group_name} is the biggest 'hater'?",
    "¿Quién es más probable que se haga famoso por algo ridículo?": "Who is most likely to become famous for something ridiculous?",
    "¿Quién de {group_name} es el más madrugador?": "Who in {group_name} is the earliest riser?",
    "¿Quién es más probable que se convierta en un gurú espiritual?": "Who is most likely to become a spiritual guru?",
    "¿Quién de {group_name} es el más 'teky'?": "Who in {group_name} is the most 'techie'?",
    "¿Quién es más probable que se mude a Marte?": "Who is most likely to move to Mars?",
    "¿Quién de {group_name} es el más noctámbulo?": "Who in {group_name} is the most nocturnal?",
    "¿Quién es más probable que se convierta en un detective famoso?": "Who is most likely to become a famous detective?",
    "¿Quién de {group_name} es el más deportista?": "Who in {group_name} is the most athletic?",
    "¿Quién es más probable que se convierta en un chef de 3 estrellas Michelin?": "Who is most likely to become a 3-star Michelin chef?",
    "¿Quién de {group_name} es el más cinéfilo?": "Who in {group_name} is the most cinephile?",
    "¿Quién es más probable que se convierta en un influencer de viajes?": "Who is most likely to become a travel influencer?",
    "¿Quién de {group_name} es el más melómano?": "Who in {group_name} is the most music-loving?",
    "¿Quién es más probable que gane una partida de póker faroleando?": "Who is most likely to win a poker game by bluffing?",
    "¿Quién de {group_name} es el más gracioso?": "Who in {group_name} is the funniest?",
    "¿Quién es más probable que se convierta en un autor de best-sellers?": "Who is most likely to become a best-selling author?",
    "¿Quién de {group_name} es el más inteligente?": "Who in {group_name} is the most intelligent?",
    "¿Quién es más probable que se convierta en un inventor famoso?": "Who is most likely to become a famous inventor?",
    "¿Quién de {group_name} es el más sociable?": "Who in {group_name} is the most sociable?",
    "¿Quién es más probable que se convierta en un aventurero extremo?": "Who is most likely to become an extreme adventurer?",
    "¿Quién de {group_name} es el más creativo?": "Who in {group_name} is the most creative?",
    "¿Quién es más probable que se convierta en un genio de Silicon Valley?": "Who is most likely to become a Silicon Valley genius?",
    "¿Quién de {group_name} es el más tranquilo?": "Who in {group_name} is the calmest?",
    "¿Quién es más probable que se convierta en un filántropo millonario?": "Who is most likely to become a billionaire philanthropist?",
    "¿Quién de {group_name} es el más organizado?": "Who in {group_name} is the most organized?",
    "¿Quién de {group_name} es el más 'rebelde'?": "Who in {group_name} is the most 'rebel'?",
    "¿Quién es más probable que se convierta en un hacker ético?": "Who is most likely to become an ethical hacker?",
    "¿Quién de {group_name} es el más 'old school'?": "Who in {group_name} is the most 'old school'?",
    "¿Quién es más probable que se convierta en un coleccionista de cosas raras?": "Who is most likely to become a collector of rare things?",
    "¿Quién de {group_name} es el más 'zen'?": "Who in {group_name} is the most 'zen'?",
    "¿Quién es más probable que se convierta en un activista famoso?": "Who is most likely to become a famous activist?",
    "¿Quién de {group_name} es el más 'urban'?": "Who in {group_name} is the most 'urban'?",
    "¿Quién es más probable que se convierta en un fotógrafo de National Geographic?": "Who is most likely to become a National Geographic photographer?",
    "¿Quién de {group_name} es el más 'indie'?": "Who in {group_name} is the most 'indie'?",
    "¿Quién es más probable que se convierta en un nómada digital?": "Who is most likely to become a digital nomad?",
    "¿Quién de {group_name} es el más 'minimalista'?": "Who in {group_name} is the most 'minimalist'?",
    "¿Quién es más probable que se convierta en un crítico gastronómico temido?": "Who is most likely to become a feared food critic?",
    "¿Quién de {group_name} es el más 'gamer'?": "Who in {group_name} is the most 'gamer'?",
    "¿Quién es más probable que se convierta en un streamer famoso?": "Who is most likely to become a famous streamer?",
    "¿Quién de {group_name} es el más 'cultureta'?": "Who in {group_name} is the most 'cultured'?",
    "¿Quién es más probable que se convierta en un experto en vinos?": "Who is most likely to become a wine expert?",
    "¿Quién de {group_name} es el más 'seriéfilo'?": "Who in {group_name} is the most 'series-loving'?",
    "¿Quién es más probable que se convierta en un director de cine de culto?": "Who is most likely to become a cult movie director?",
    "¿Quién de {group_name} es el más 'cocinillas'?": "Who in {group_name} is the best cook?",
    "¿Quién de {group_name} es más probable que sea el primero en tener hijos?": "Who in {group_name} is most likely to be the first to have children?",
    "¿Quién de {group_name} sobreviviría más tiempo en una isla desierta?": "Who in {group_name} would survive the longest on a deserted island?",
    "¿Quién de {group_name} es más probable que sea un alien disfrazado de humano?": "Who in {group_name} is most likely to be an alien disguised as a human?",
    "¿Quién de {group_name} añadiría piña a la pizza y lo defendería con la vida?": "Who in {group_name} would add pineapple to pizza and defend it with their life?",
    "¿Quién sería el primero en perderse en IKEA y no salir hasta el día siguiente?": "Who would be the first to get lost in IKEA and not come out until the next day?",
    "¿En qué orden se quedarían sin batería del móvil los miembros de {group_name}?": "In what order would the members of {group_name} run out of phone battery?",
    "Ordena a los miembros de {group_name} por probabilidad de volverse virales en redes": "Rank the members of {group_name} by their likelihood of going viral on social media",
    "¿Quién terminaría antes una lista de tareas? Ordena a los miembros de {group_name}": "Who would finish a to-do list first? Rank the members of {group_name}",
    "Ordena a los miembros de {group_name} de más a menos probable que lleguen tarde": "Rank the members of {group_name} from most to least likely to be late",
    "¿Quién de {group_name} duraría más en Gran Hermano? Ordénalos": "Who in {group_name} would last the longest on Big Brother? Rank them"
  };

  const enQuestions = esQuestions.map(q => ({
    text: translations[q.text] || q.text, // Fallback to original if not mapped
    category: q.category,
    mode: q.mode,
    language: 'en',
    min_members: q.min_members,
    is_active: true,
    is_anonymous: q.is_anonymous,
    tags: q.tags
  }));

  // 3. Combine translations and brand new questions
  const allToInsert = [...enQuestions, ...NEW_QUESTIONS];

  console.log(`Inserting ${allToInsert.length} new questions...`);

  // 4. Batch insert
  const { error: insertErr } = await supabase
    .from('questions')
    .insert(allToInsert);

  if (insertErr) {
    console.error('Error inserting questions:', insertErr);
  } else {
    console.log('Successfully expanded the database!');
  }
}

expandDb();
