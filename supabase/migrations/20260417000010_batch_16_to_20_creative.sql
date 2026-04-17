-- =====================================================
-- 20260417000010_batch_16_to_20_creative.sql
-- MVP Batches 16 a 20 - Creatividad Desatada Parte 4
-- =====================================================

INSERT INTO public.questions (text, category, mode, is_active, min_members, options, tags) VALUES

-- HIPOTETICAS EXTREMAS
('Si todos perdiésemos la capacidad de mentir para siempre, ¿quién acabaría sin amigos ni familia en 24 horas?', 'hipoteticas', 'poll', true, 3, NULL, '{"sinceridad", "aislamiento"}'),
('Ordena al grupo según qué tan rápido se convertirían en tiranos si de repente les dan un pequeño país insular para gobernar.', 'hipoteticas', 'ranking', true, 4, NULL, '{"dictadura", "poder"}'),
('Si te obligaran a sustituir permanentemente una de tus manos por un utensilio de cocina, ¿qué eliges?', 'hipoteticas', 'mc', true, 2, ARRAY['Un batidor de varillas para dar masajes exóticos', 'Una espátula antiadherente para abofetear', 'Un cuchillo jamonero (me aíslo de la sociedad)', 'Un exprimidor de limones para ser el alma de las fiestas'], '{"cuerpo", "cocina"}'),
('Imagina que eres un NPC de un videojuego barato. ¿Cuál es tu frase que repites en bucle cuando alguien pasa cerca?', 'hipoteticas', 'free', true, 2, NULL, '{"videojuegos", "npc"}'),
('Del 1 al 10, evalúa lo seguro que estás de que podrías luchar y vencer a un ganso salvaje enfurecido.', 'hipoteticas', 'scale', true, 2, NULL, '{"animales", "lucha"}'),
('¿Quién es más probable que intente acariciar a un animal salvaje altamente venenoso porque "le ha mirado con dulzura", {member_A} o {member_B}?', 'hipoteticas', 'vs', true, 2, NULL, '{"animales", "muerte"}'),

-- HUMOR / COTIDIANIDAD ABSURDA
('¿Quién tiene peor historial de haber comprado una absoluta tontería carísima por verla a las 3 AM en un anuncio de TikTok?', 'humor', 'poll', true, 3, NULL, '{"compras", "tiktok"}'),
('Del 1 al 10, califica secretamente el estilismo global del grupo: del "vamos siempre monísimos" al "tenemos ropa del 2008".', 'humor', 'scale', true, 2, NULL, '{"moda", "estilo"}'),
('Confiesa algo incomprensible que haces a solas en tu casa y que nadie de aquí sabía.', 'humor', 'free', true, 3, NULL, '{"secretos", "rareza"}'),
('Ordena al grupo entero desde el que usa peor las funciones básicas del móvil hasta el que podría hackear la NASA (pero le da pereza).', 'humor', 'ranking', true, 4, NULL, '{"tecnologia", "torpes"}'),
('Estás en una primera cita. ¿Qué red flag imperdonable hace que te vayas fingiendo una llamada médica?', 'humor', 'mc', true, 2, ARRAY['Mastican haciendo ruido de lavadora industrial', 'Tratan mal al camarero (cárcel directa)', 'No conocen el humor irónico y se toman todo fatal', 'Llevan Crocs con calcetines fuera de casa'], '{"citas", "redflags"}'),
('¿Quien tiene más papeletas para que le timen comprando en Wallapop un ladrillo en vez de un iPhone, {member_A} o {member_B}?', 'humor', 'vs', true, 3, NULL, '{"estafas", "inocencia"}'),

-- ATREVIDAS ANÓNIMAS (is_anonymous = true por trigger de backend)
('¿Quién del grupo crees que es el mayor "simulador de productividad", que parece que hace mil cosas pero en el fondo nunca hace nada?', 'atrevidas', 'poll', true, 3, NULL, '{"vagos", "apariencias"}'),
('Seamos honestos, del 1 al 10, ¿lo mucho que falseaste tu currículum en tu primer trabajo decente?', 'atrevidas', 'scale', true, 2, NULL, '{"trabajo", "mentiras"}'),
('Escribe el peor consejo amoroso tóxico que le hayas dado a alguien del grupo sabiendo que no le iba a salir bien.', 'atrevidas', 'free', true, 3, NULL, '{"amor", "toxico"}'),
('Ordena al grupo según su necesidad de ser validado constantemente en redes sociales (del más yonki al pasota total).', 'atrevidas', 'ranking', true, 4, NULL, '{"redes", "dependencia"}'),
('Te cruzas a tu ex por la calle con su nueva y reluciente pareja. Tú estás en chándal manchado.', 'atrevidas', 'mc', true, 2, ARRAY['Huyo hacia el portal más cercano y me mimetizo', 'Paso con la cabeza alta como si el chándal fuera Gucci', 'Les saludo efusivamente solo para incomodarles', 'Me tiro al suelo fingiendo un desmayo letal'], '{"ex", "situaciones"}'),
('¿Quién crees que se pasaría más rápido a una plataforma tipo OnlyFans si perdiese su trabajo mañana mismo, {member_A} o {member_B}?', 'atrevidas', 'vs', true, 2, NULL, '{"desesperacion", "dinero"}'),

-- EVENTOS Y CELEBRACIONES CAÓTICAS
('Toda la mesa pide la cuenta para pagar entre todos. ¿Quién empieza a escudriñar el ticket haciendo cuentas raras para ahorrarse 2 euros?', 'eventos', 'poll', true, 3, NULL, '{"dinero", "restaurantes"}'),
('Del 1 al 10, ¿cuánto sueles arrepentirte al día siguiente de las cosas que enviaste por WhatsApp a las 4 de la mañana?', 'eventos', 'scale', true, 2, NULL, '{"noche", "arrepentimiento"}'),
('Describe tu peor técnica de ligue que has usado en una discoteca y misteriosamente te funcionó.', 'eventos', 'free', true, 2, NULL, '{"ligar", "noche"}'),
('Organizamos un concurso de cocina. Ordena al grupo desde el que ganaría con estrella Michelin hasta el que nos intoxicaría a todos.', 'eventos', 'ranking', true, 4, NULL, '{"cocina", "veneno"}'),
('¿Qué harías si uno del grupo aparece borracho en tu casa sin avisar el día antes de tu boda?', 'eventos', 'mc', true, 2, ARRAY['Lo escondo en el armario y no digo nada a nadie', 'Le hago un exorcismo a base de café negro ardiendo', 'Grabo un vídeo para chantajearle el resto de su vida', 'Le pido que se duerma en la bañera y finjo no verle'], '{"bodas", "caos"}'),
('¿A quién confiarías para desatascarte el baño antes de que llegue tu acompañante en una cita en tu casa, a {member_A} o a {member_B}?', 'eventos', 'vs', true, 2, NULL, '{"urgencias", "asquerosidad"}'),

-- HABILIDADES (O LA AUSENCIA DE ELLAS)
('Si decidiésemos atracar un banco mañana, ¿quién presionaría el botón de alarma de seguridad sin querer antes de empezar?', 'habilidades', 'poll', true, 3, NULL, '{"robos", "torpeza"}'),
('Del 1 al 10, evalúa lo seguro de ti mismo que te sientes al volante cuando llevas el coche lleno de gente juzgando.', 'habilidades', 'scale', true, 2, NULL, '{"coches", "presion"}'),
('¿Cuál consideras que es tu mayor superpoder cotidiano y absurdo (ej. "calculo perfectamente la cantidad de espaguetis")?', 'habilidades', 'free', true, 2, NULL, '{"talentos", "absurdez"}'),
('Alguien se ha metido a pelear contigo en el bar. Ordena a tus amigos de quién te defendería a puños a quién fingiría mirar el móvil intensamente.', 'habilidades', 'ranking', true, 4, NULL, '{"lucha", "lealtad"}'),
('¿Qué técnica usas para aprender el nombre de alguien tras olvidarlo a los 2 minutos de conocerlo?', 'habilidades', 'mc', true, 2, ARRAY['Asumirlo y preguntarlo 40 veces hasta que se enfade', 'Le llamo "tío/a" "colega" o "crack" de por vida', 'Le busco furtivamente en el Instagram de otros', 'Espero a que alguien más llegue y le salude por su nombre'], '{"memoria", "social"}')

-- Extra Filler Random (Porque 30 son mejores que 29)
,('¿Quién sobreviviría más tiempo si lo dejamos abandonado en medio de Siberia en invierno, {member_A} con abrigos infinitos o {member_B} con tres botellas de vodka?', 'habilidades', 'vs', true, 2, NULL, '{"supervivencia", "rusia"}')
,('¿A quién de este grupo designarías como tu abogado defensor si la condena es a cadena perpetua?', 'futuro', 'poll', true, 3, NULL, '{"juicios", "confianza"}');
