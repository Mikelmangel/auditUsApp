-- =====================================================
-- SEED: 100 PREGUNTAS DINÁMICAS PARA AUDITUS (ESPAÑOL)
-- Actualizado: schema con question_mode + question_category
-- Placeholders: {member_A}, {member_B}, {group_name}, {member_count}
-- =====================================================

TRUNCATE public.questions RESTART IDENTITY CASCADE;

INSERT INTO public.questions (text, mode, category, is_anonymous, min_members, language, tags, is_active) VALUES

-- =====================================================
-- GENERAL → humor
-- =====================================================
('¿Quién de {group_name} es más probable que se haga famoso en internet?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién sobreviviría más tiempo en una isla desierta?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién tiene más posibilidades de convertirse en millonario?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿A quién llamarías primero en una emergencia a las 3am?', 'poll', 'vinculos', false, 2, 'es', ARRAY['💛'], true),
('¿Quién de {group_name} tiene más secretos?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién sería el mejor líder si tuvierais que fundar un país?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿A quién elegirías para trabajar contigo en un proyecto importante?', 'poll', 'vinculos', false, 2, 'es', ARRAY['💛'], true),
('¿Quién tiene la vida más organizada del grupo?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién de {group_name} es el alma de las fiestas?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién sería el primero en rendirse en un reality de supervivencia?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),

-- =====================================================
-- HUMOR
-- =====================================================
('¿Quién se quedaría dormido en su propia boda?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién acabaría comprando algo inútil en una teletienda a las 4am?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién olvidaría el nombre de su pareja en un momento importante?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién de {group_name} lloraría viendo un anuncio de comida para perros?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién intentaría negociar con un pingüino?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién usaría "el perro se comió mis deberes" como excusa siendo adulto?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién coleccionaría cucharas de todo el mundo y presumiría de ello?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién sería el primero en creer en un bulo de WhatsApp?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién de {group_name} añadiría piña a la pizza y lo defendería con la vida?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién sería el primero en perderse en IKEA y no salir hasta el día siguiente?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),

-- =====================================================
-- SKILLS → habilidades
-- =====================================================
('¿Quién sería mejor chef con ingredientes aleatorios?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién aprendería a hablar otro idioma más rápido?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién de {group_name} escribiría el mejor libro?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién se haría multimillonario si empezara una startup mañana?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién sería el mejor negociador en una subasta?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién sobreviviría mejor viviendo sin internet durante un mes?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién sería el mejor aventurero recorriendo el mundo en solitario?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién ganaría en un hackathon de 24 horas?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién de {group_name} sería mejor piloto en una carrera?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién montaría el negocio más exitoso con solo 100€?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),

-- =====================================================
-- SOCIAL → humor
-- =====================================================
('¿Quién de {group_name} es el que más drama genera sin querer?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién es el más difícil de convencer para salir de casa?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién llegaría tarde a su propio funeral?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿A quién le cuesta más decir "no" a la gente?', 'poll', 'vinculos', false, 2, 'es', ARRAY['💛'], true),
('¿Quién de {group_name} tiene el teléfono más lleno de capturas de pantalla?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién sería el más popular en un grupo nuevo de desconocidos?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién organizaría el mejor plan espontáneo?', 'poll', 'eventos', false, 2, 'es', ARRAY['🎉'], true),
('¿Quién de {group_name} es el mejor guardando secretos?', 'poll', 'vinculos', false, 2, 'es', ARRAY['💛'], true),
('¿Quién daría el mejor consejo en una situación difícil?', 'poll', 'vinculos', false, 2, 'es', ARRAY['💛'], true),
('¿Quién tiene más probabilidades de hacerse amigo del camarero?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),

-- =====================================================
-- MONEY → humor
-- =====================================================
('¿Quién gastaría una herencia en 48 horas?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién de {group_name} tiene más ahorros sin que se note?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién invertiría en la criptomoneda más absurda del mercado?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién sería el más tacaño a la hora de pagar en un grupo?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién de {group_name} donaría más dinero en un momento de necesidad?', 'poll', 'vinculos', false, 2, 'es', ARRAY['💛'], true),

-- =====================================================
-- ADVENTURE → eventos
-- =====================================================
('¿Quién se apuntaría primero a un salto en paracaídas?', 'poll', 'eventos', false, 2, 'es', ARRAY['🎉'], true),
('¿Quién de {group_name} haría el viaje más extremo sin planificarlo?', 'poll', 'eventos', false, 2, 'es', ARRAY['🎉'], true),
('¿Quién sobreviviría una noche en un bosque sin móvil?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién se atrevería a comer insectos por dinero?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién de {group_name} se perdería en una ciudad extranjera y lo pasaría genial igualmente?', 'poll', 'eventos', false, 2, 'es', ARRAY['🎉'], true),

-- =====================================================
-- DEEP → vinculos
-- =====================================================
('¿Quién de {group_name} cambiará más el mundo en los próximos 10 años?', 'poll', 'futuro', false, 2, 'es', ARRAY['🔮'], true),
('¿Quién está más en paz consigo mismo/a?', 'poll', 'vinculos', false, 2, 'es', ARRAY['💛'], true),
('¿Quién de {group_name} tiene la inteligencia emocional más alta?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién sería el mejor padre/madre del grupo?', 'poll', 'vinculos', false, 2, 'es', ARRAY['💛'], true),
('¿Quién de {group_name} ha madurado más en el último año?', 'poll', 'vinculos', false, 2, 'es', ARRAY['💛'], true),

-- =====================================================
-- VS CHALLENGE → hipoteticas
-- =====================================================
('¿Quién ganaría en un debate sin preparación: {member_A} o {member_B}?', 'vs', 'hipoteticas', false, 2, 'es', ARRAY['🧠'], true),
('¿Quién sobreviviría más tiempo en el desierto: {member_A} o {member_B}?', 'vs', 'hipoteticas', false, 2, 'es', ARRAY['🧠'], true),
('Batalla de chistes: ¿{member_A} o {member_B}?', 'vs', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién conduciría mejor bajo presión: {member_A} o {member_B}?', 'vs', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién ganaría en un concurso de cocina: {member_A} o {member_B}?', 'vs', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién convencería antes a un desconocido de algo absurdo: {member_A} o {member_B}?', 'vs', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién sería mejor jefe/a: {member_A} o {member_B}?', 'vs', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién de los dos tiene más estilo: {member_A} o {member_B}?', 'vs', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién sería mejor en un escape room: {member_A} o {member_B}?', 'vs', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('Rap battle imaginaria: ¿{member_A} o {member_B}?', 'vs', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién impresionaría más en una primera cita: {member_A} o {member_B}?', 'vs', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién ganaría una maratón si entrenara 6 meses: {member_A} o {member_B}?', 'vs', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién conseguiría más seguidores en TikTok en una semana: {member_A} o {member_B}?', 'vs', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién pagaría la cena más probable: {member_A} o {member_B}?', 'vs', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién sería mejor como compañero de piso: {member_A} o {member_B}?', 'vs', 'vinculos', false, 2, 'es', ARRAY['💛'], true),

-- =====================================================
-- GROUP DYNAMICS → humor
-- =====================================================
('¿Cuántos años sobreviviría {group_name} como equipo en una apocalipsis zombie?', 'poll', 'humor', false, 3, 'es', ARRAY['😂'], true),
('Si {group_name} fuera un programa de TV, ¿quién sería el protagonista?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién sería el espía de {group_name} si hubiera un topo infiltrado?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('Si {group_name} montara una empresa juntos, ¿quién sería el CEO?', 'poll', 'habilidades', false, 2, 'es', ARRAY['💪'], true),
('¿Quién representaría mejor a {group_name} en Las Olimpiadas?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién abandona la isla primero si {group_name} estuviera en Supervivientes?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién sería el juez más temido si {group_name} tuviera un tribunal?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién de {group_name} cambiaría el nombre del grupo sin decírselo a nadie?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién screenshottearía esta misma encuesta y la mandaría fuera del grupo?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Quién de {group_name} organizaría la mejor quedada y quién la haría imposible?', 'poll', 'eventos', false, 3, 'es', ARRAY['🎉'], true),

-- =====================================================
-- BOOLEAN → poll
-- =====================================================
('¿Podría {group_name} convencer a {member_A} de que se tiñera el pelo?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('Si {member_A} organizara un plan sorpresa para {group_name}, ¿vendría todo el mundo?', 'poll', 'humor', false, 2, 'es', ARRAY['😂'], true),
('¿Sobreviviría {group_name} a 7 días de acampada sin móvil?', 'poll', 'eventos', false, 3, 'es', ARRAY['🎉'], true),
('¿Se conocerán todos los miembros de {group_name} dentro de 10 años?', 'poll', 'vinculos', false, 2, 'es', ARRAY['💛'], true),
('¿Podría {member_A} guardar un secreto del grupo durante más de una semana?', 'poll', 'vinculos', false, 2, 'es', ARRAY['💛'], true),

-- =====================================================
-- RANKED
-- =====================================================
('¿En qué orden se quedarían sin batería del móvil los miembros de {group_name}?', 'ranking', 'humor', false, 3, 'es', ARRAY['😂'], true),
('Ordena a los miembros de {group_name} por probabilidad de volverse virales en redes', 'ranking', 'humor', false, 3, 'es', ARRAY['😂'], true),
('¿Quién terminaría antes una lista de tareas? Ordena a los miembros de {group_name}', 'ranking', 'habilidades', false, 3, 'es', ARRAY['💪'], true),
('Ordena a los miembros de {group_name} de más a menos probable que lleguen tarde', 'ranking', 'humor', false, 3, 'es', ARRAY['😂'], true),
('¿Quién de {group_name} duraría más en Gran Hermano? Ordénalos', 'ranking', 'humor', false, 3, 'es', ARRAY['😂'], true);
