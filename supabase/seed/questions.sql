-- =====================================================
-- SEED: 100 PREGUNTAS DINÁMICAS PARA AUDITUS
-- Tipos: pool, vs, boolean, ranked
-- Categorías: general, humor, romance, skills, survival,
--             money, social, adventure, deep, vs_challenge, group_dynamics
--
-- Placeholders disponibles:
--   {member_A}    → nombre de un miembro aleatorio
--   {member_B}    → nombre de otro miembro diferente
--   {group_name}  → nombre del grupo
--   {member_count}→ número total de miembros
-- =====================================================

TRUNCATE public.questions RESTART IDENTITY CASCADE;

INSERT INTO public.questions (text, poll_type, category, min_members) VALUES

-- =====================================================
-- GENERAL - POOL (votar por cualquier miembro)
-- =====================================================
('¿Quién de {group_name} es más probable que se haga famoso en internet?', 'pool', 'general', 2),
('¿Quién sobreviviría más tiempo en una isla desierta?', 'pool', 'general', 2),
('¿Quién tiene más posibilidades de convertirse en millonario?', 'pool', 'general', 2),
('¿A quién llamarías primero en una emergencia a las 3am?', 'pool', 'general', 2),
('¿Quién de {group_name} tiene más secretos?', 'pool', 'general', 2),
('¿Quién sería el mejor líder si tuvierais que fundar un país?', 'pool', 'general', 2),
('¿A quién elegirías para trabajar contigo en un proyecto importante?', 'pool', 'general', 2),
('¿Quién tiene la vida más organizada del grupo?', 'pool', 'general', 2),
('¿Quién de {group_name} es el alma de las fiestas?', 'pool', 'general', 2),
('¿Quién sería el primero en rendirse en un reality de supervivencia?', 'pool', 'general', 2),

-- =====================================================
-- HUMOR
-- =====================================================
('¿Quién se quedaría dormido en su propia boda?', 'pool', 'humor', 2),
('¿Quién acabaría comprando algo inútil en una teletienda a las 4am?', 'pool', 'humor', 2),
('¿Quién olvidaría el nombre de su pareja en un momento importante?', 'pool', 'humor', 2),
('¿Quién de {group_name} lloraría viendo un anuncio de comida para perros?', 'pool', 'humor', 2),
('¿Quién intentaría negociar con un pingüino?', 'pool', 'humor', 2),
('¿Quién usaría "el perro se comió mis deberes" como excusa siendo adulto?', 'pool', 'humor', 2),
('¿Quién coleccionaría cucharas de todo el mundo y presumiría de ello?', 'pool', 'humor', 2),
('¿Quién sería el primero en creer en un bulo de WhatsApp?', 'pool', 'humor', 2),
('¿Quién de {group_name} añadiría piña a la pizza y lo defendería con la vida?', 'pool', 'humor', 2),
('¿Quién sería el primero en perderse en IKEA y no salir hasta el día siguiente?', 'pool', 'humor', 2),

-- =====================================================
-- SKILLS / HABILIDADES
-- =====================================================
('¿Quién sería mejor chef con ingredientes aleatorios?', 'pool', 'skills', 2),
('¿Quién aprendería a hablar otro idioma más rápido?', 'pool', 'skills', 2),
('¿Quién de {group_name} escribiría el mejor libro?', 'pool', 'skills', 2),
('¿Quién se haría multimillonario si empezara una startup mañana?', 'pool', 'skills', 2),
('¿Quién sería el mejor negociador en una subasta?', 'pool', 'skills', 2),
('¿Quién sobreviviría mejor viviendo sin internet durante un mes?', 'pool', 'skills', 2),
('¿Quién sería el mejor aventurero recorriendo el mundo en solitario?', 'pool', 'skills', 2),
('¿Quién ganaría en un hackathon de 24 horas?', 'pool', 'skills', 2),
('¿Quién de {group_name} sería mejor piloto en una carrera?', 'pool', 'skills', 2),
('¿Quién montaría el negocio más exitoso con solo 100€?', 'pool', 'skills', 2),

-- =====================================================
-- SOCIAL / DINÁMICAS DE GRUPO
-- =====================================================
('¿Quién de {group_name} es el que más drama genera sin querer?', 'pool', 'social', 2),
('¿Quién es el más difícil de convencer para salir de casa?', 'pool', 'social', 2),
('¿Quién llegaría tarde a su propio funeral?', 'pool', 'social', 2),
('¿A quién le cuesta más decir "no" a la gente?', 'pool', 'social', 2),
('¿Quién de {group_name} tiene el teléfono más lleno de capturas de pantalla de conversaciones?', 'pool', 'social', 2),
('¿Quién sería el más popular en un grupo nuevo de desconocidos?', 'pool', 'social', 2),
('¿Quién organizaría el mejor plan espontáneo?', 'pool', 'social', 2),
('¿Quién de {group_name} es el mejor guardando secretos?', 'pool', 'social', 2),
('¿Quién daría el mejor consejo en una situación difícil?', 'pool', 'social', 2),
('¿Quién tiene más probabilidades de hacerse amigo del camarero?', 'pool', 'social', 2),

-- =====================================================
-- MONEY / DINERO
-- =====================================================
('¿Quién gastaría una herencia en 48 horas?', 'pool', 'money', 2),
('¿Quién de {group_name} tiene más ahorros sin que se note?', 'pool', 'money', 2),
('¿Quién invertiría en la criptomoneda más absurda del mercado?', 'pool', 'money', 2),
('¿Quién sería el más tacaño a la hora de pagar en un grupo?', 'pool', 'money', 2),
('¿Quién de {group_name} donaría más dinero en un momento de necesidad?', 'pool', 'money', 2),

-- =====================================================
-- ADVENTURE / AVENTURA
-- =====================================================
('¿Quién se apuntaría primero a un salto en paracaídas?', 'pool', 'adventure', 2),
('¿Quién de {group_name} haría el viaje más extremo sin planificarlo?', 'pool', 'adventure', 2),
('¿Quién sobreviviría una noche en un bosque sin móvil?', 'pool', 'adventure', 2),
('¿Quién se atrevería a comer insectos por dinero?', 'pool', 'adventure', 2),
('¿Quién de {group_name} se perdería en una ciudad extranjera y lo pasaría genial igualmente?', 'pool', 'adventure', 2),

-- =====================================================
-- DEEP / REFLEXIVAS
-- =====================================================
('¿Quién de {group_name} cambiará más el mundo en los próximos 10 años?', 'pool', 'deep', 2),
('¿Quién está más en paz consigo mismo/a?', 'pool', 'deep', 2),
('¿Quién de {group_name} tiene la inteligencia emocional más alta?', 'pool', 'deep', 2),
('¿Quién sería el mejor padre/madre del grupo?', 'pool', 'deep', 2),
('¿Quién de {group_name} ha madurado más en el último año?', 'pool', 'deep', 2),

-- =====================================================
-- VS CHALLENGE — Batallas entre {member_A} vs {member_B}
-- =====================================================
('¿Quién ganaría en un debate sin preparación: {member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('¿Quién sobreviviría más tiempo en el desierto: {member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('Batalla de chistes: ¿{member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('¿Quién conduciría mejor bajo presión: {member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('¿Quién ganaría en un concurso de cocina: {member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('¿Quién convencería antes a un desconocido de algo absurdo: {member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('¿Quién sería mejor jefe/a: {member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('¿Quién de los dos tiene más estilo: {member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('¿Quién sería mejor en un escape room: {member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('Rap battle imaginaria: ¿{member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('¿Quién impresionaría más en una primera cita: {member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('¿Quién ganaría una maratón si entrenara 6 meses: {member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('¿Quién conseguiría más seguidores en TikTok en una semana: {member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('¿Quién pagaría la cena más probable: {member_A} o {member_B}?', 'vs', 'vs_challenge', 2),
('¿Quién sería mejor como compañero de piso: {member_A} o {member_B}?', 'vs', 'vs_challenge', 2),

-- =====================================================
-- GROUP DYNAMICS — Preguntas sobre el grupo como entidad
-- =====================================================
('¿Cuántos años sobreviviría {group_name} como equipo en una apocalipsis zombie?', 'pool', 'group_dynamics', 3),
('Si {group_name} fuera un programa de TV, ¿quién sería el protagonista?', 'pool', 'group_dynamics', 3),
('¿Quién sería el espía de {group_name} si hubiera un topo infiltrado?', 'pool', 'group_dynamics', 3),
('Si {group_name} montara una empresa juntos, ¿quién sería el CEO?', 'pool', 'group_dynamics', 3),
('¿Quién representaría mejor a {group_name} en Las Olimpiadas?', 'pool', 'group_dynamics', 3),
('¿Quién abandona la isla primero si {group_name} estuviera en Supervivientes?', 'pool', 'group_dynamics', 3),
('¿Quién sería el juez más temido si {group_name} tuviera un tribunal?', 'pool', 'group_dynamics', 3),
('¿Quién de {group_name} cambiaría el nombre del grupo sin decírselo a nadie?', 'pool', 'group_dynamics', 2),
('¿Quién screenshottearía esta misma encuesta y la mandaría fuera del grupo?', 'pool', 'group_dynamics', 2),
('¿Quién de {group_name} organizaría la mejor quedada y quién la haría imposible?', 'pool', 'group_dynamics', 3),

-- =====================================================
-- BOOLEAN (Sí/No)
-- =====================================================
('¿Podría {group_name} convencer a {member_A} de que se tiñera el pelo?', 'boolean', 'humor', 2),
('Si {member_A} organizara un plan sorpresa para {group_name}, ¿vendría todo el mundo?', 'boolean', 'group_dynamics', 2),
('¿Sobreviviría {group_name} a 7 días de acampada sin móvil?', 'boolean', 'adventure', 3),
('¿Se conocerán todos los miembros de {group_name} dentro de 10 años?', 'boolean', 'deep', 2),
('¿Podría {member_A} guardar un secreto del grupo durante más de una semana?', 'boolean', 'social', 2),

-- =====================================================
-- RANKED — Ordena miembros (requiere lógica especial en UI)
-- =====================================================
('¿En qué orden se quedarían sin batería del móvil los miembros de {group_name}?', 'ranked', 'humor', 3),
('Ordena a los miembros de {group_name} por probabilidad de volverse virales en redes', 'ranked', 'general', 3),
('¿Quién terminaría antes una lista de tareas? Ordena a los miembros de {group_name}', 'ranked', 'skills', 3),
('Ordena a los miembros de {group_name} de más a menos probable que lleguen tarde', 'ranked', 'social', 3),
('¿Quién de {group_name} duraría más en Gran Hermano? Ordénalos', 'ranked', 'group_dynamics', 3);

