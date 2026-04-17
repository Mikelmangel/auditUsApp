-- =====================================================
-- 20260417000006_batch_4_100_questions.sql
-- MVP Batch 4: Generado a petición directa
-- =====================================================

INSERT INTO public.questions (text, category, mode, is_active, min_members, options, tags) VALUES

-- HABILIDADES
('Del 1 al 10, ¿lo bien que aparcas en la calle cuando tienes a 5 coches esperando detrás?', 'habilidades', 'scale', true, 2, NULL, '{"coche", "presion"}'),
('Si hubiera que desconcertar una bomba y faltan 10 segundos, ¿a quién confiarías cortar el cable?', 'habilidades', 'poll', true, 3, NULL, '{"bomba", "presion"}'),
('Ordena al grupo entero de mejor a peor nadador en alta mar.', 'habilidades', 'ranking', true, 4, NULL, '{"nadar", "mar"}'),
('¿Quién es mejor pintando o dibujando algo realista, {member_A} o {member_B}?', 'habilidades', 'vs', true, 2, NULL, '{"arte", "dibujo"}'),
('Si tuviéramos que formar una banda de rock y no sabes tocar, ¿qué harías?', 'habilidades', 'mc', true, 2, ARRAY['Tocar el triángulo', 'Ser el manager corrupto', 'Fingir que toco la guitarra eléctrica', 'Ser el grupi pesado'], '{"musica", "talentos"}'),

-- HUMOR
('¿Quién hace la peor voz intentando imitar un acento extranjero?', 'humor', 'poll', true, 3, NULL, '{"acentos", "implicacion"}'),
('Del 1 al 10, ¿cuánto crees que aburres a los taxistas cuando intentas darles charla?', 'humor', 'scale', true, 2, NULL, '{"taxi", "charlas"}'),
('Cuenta el sueño más estúpido o sin sentido que hayas tenido en la última semana.', 'humor', 'free', true, 2, NULL, '{"sueños", "absurdo"}'),
('Ordena al grupo desde el que tiene la risa más pegadiza hasta el que parece que se ahoga.', 'humor', 'ranking', true, 4, NULL, '{"risa", "humor"}'),
('Si te cayeras en directo en la televisión nacional, ¿cómo reaccionarías?', 'humor', 'mc', true, 2, ARRAY['Haciendo crola y disimulando', 'Llorando histéricamente', 'Levantándome y gritando "¡Ta-da!"', 'Me hago el muerto para salir del paso'], '{"verguenza", "caidas"}'),
('¿Quién es más probable que se pierda caminando con el Google Maps encendido en la mano, {member_A} o {member_B}?', 'humor', 'vs', true, 2, NULL, '{"mapas", "perderse"}'),

-- ATREVIDAS
('¿Quién del grupo crees que stalkea obsesivamente a las nuevas conquistas de sus ex?', 'atrevidas', 'poll', true, 3, NULL, '{"stalker", "ex"}'),
('Del 1 al 10, ¿cuánto te has arrepentido de tu último lío amoroso?', 'atrevidas', 'scale', true, 2, NULL, '{"arrepentimiento", "amor"}'),
('Confiesa algo que juzgas muchísimo en los demás pero que tú haces en secreto.', 'atrevidas', 'free', true, 3, NULL, '{"hipocresia", "secretos"}'),
('Ordena a la gente de esta sala del más propenso a ghostear al que no lo haría ni a su peor enemigo.', 'atrevidas', 'ranking', true, 4, NULL, '{"ghosting", "redes"}'),
('Si te dijesen que la persona que te gusta está grabando un reality, ¿qué harías?', 'atrevidas', 'mc', true, 2, ARRAY['Me presento al casting para arruinárselo', 'Hago campaña en twitter para que le expulsen', 'Lo ignoro', 'Consumo el programa en secreto como un loco'], '{"celos", "reality"}'),
('¿Quién es más dramático montando una escena de celos sin sentido, {member_A} o {member_B}?', 'atrevidas', 'vs', true, 2, NULL, '{"drama", "celos"}'),

-- EVENTOS
('¿Quién sería el único en llegar de corbata a una fiesta hawaiana por no leer la invitación?', 'eventos', 'poll', true, 3, NULL, '{"fiestas", "despistado"}'),
('Del 1 al 10, evalúa el nivel de ansiedad que te produce organizar algo para más de 10 personas.', 'eventos', 'scale', true, 2, NULL, '{"ansiedad", "organizar"}'),
('Escribe la peor excusa que has usado para escaparte de un cumpleaños.', 'eventos', 'free', true, 2, NULL, '{"excusas", "cumples"}'),
('Ordena al grupo de quién es el mejor Dj controlando la música del coche al conductor más dictador musical.', 'eventos', 'ranking', true, 4, NULL, '{"musica", "coches"}'),
('Para tu próximo cumpleaños te regalan la posibilidad de cancelar todas tus deudas o un viaje al espacio.', 'eventos', 'mc', true, 2, ARRAY['¡Me voy al espacio!', 'Cancelo mis deudas económicas sin pensar', 'Vendo el viaje espacial en Wallapop', 'Huyo del planeta'], '{"regalos", "espacio"}'),
('¿Quién bebe más despacio en la primera ronda en un bar, {member_A} o {member_B}?', 'eventos', 'vs', true, 2, NULL, '{"alcohol", "ritmo"}'),

-- FUTURO
('¿Quién terminará trabajando en algo que odia pero cobrando una barbaridad?', 'futuro', 'poll', true, 3, NULL, '{"trabajo", "dinero"}'),
('Del 1 al 10, evalúa qué tan preparado estás para la crisis económica que vendrá.', 'futuro', 'scale', true, 2, NULL, '{"economia", "crisis"}'),
('¿Dónde te imaginas en exactamente 3.650 días?', 'futuro', 'free', true, 2, NULL, '{"futuro_lejano"}'),
('Ordena de quién terminará teniendo más operaciones estéticas a quién envejecerá al natural por pereza.', 'futuro', 'ranking', true, 4, NULL, '{"estetica", "operaciones"}'),
('Si en el año 2040 las IA gobernasen el mundo de forma benevolente, ¿qué rol tomarías?', 'futuro', 'mc', true, 2, ARRAY['Miembro de la resistencia anti-IA', 'Me someto y dejo de trabajar', 'Político para negociar con ellas', 'Adiestrador de robots limpieza'], '{"ia", "rebelion"}'),
('¿Quién perderá antes las llaves de su primera casa propia, {member_A} o {member_B}?', 'futuro', 'vs', true, 2, NULL, '{"casa", "perdidas"}'),

-- HIPOTETICAS / DILEMAS
('¿Quién del grupo, si fuese un supervillano, usaría su poder exclusivamente para saltarse colas?', 'hipoteticas', 'poll', true, 3, NULL, '{"poderes", "colar"}'),
('Del 1 al 10, ¿lo mucho que te volverías loco si vivieses en "El Show de Truman" y lo descubrieses hoy?', 'hipoteticas', 'scale', true, 2, NULL, '{"paranoia", "truman"}'),
('Si estuvieses atrapado en una película de terror, ¿cómo morirías?', 'hipoteticas', 'free', true, 2, NULL, '{"terror", "cine"}'),
('Ordena de quién es el más probable de robar comida de una fiesta de desconocidos al más civilizado.', 'hipoteticas', 'ranking', true, 4, NULL, '{"comida", "robo"}'),
('¿Qué superpoder te haría la vida más fácil en tu último trabajo?', 'hipoteticas', 'mc', true, 2, ARRAY['Pausar el tiempo para dormir más en el baño', 'Leer la mente del jefe para darle la razón', 'Teletransporte para no pisar el transporte público', 'Invisibilidad para evitar reuniones aburridas'], '{"poderes", "oficina"}'),
('¿A quién preferirías confiarle el rescate de tu mascota si hay un incendio, a {member_A} o a {member_B}?', 'hipoteticas', 'vs', true, 2, NULL, '{"mascotas", "salvar"}'),

-- VINCULOS
('¿Quién del grupo es más protector como un hermano mayor?', 'vinculos', 'poll', true, 3, NULL, '{"proteccion", "amistad"}'),
('Del 1 al 10, evalúa cuánto soportas el contacto físico de extraños.', 'vinculos', 'scale', true, 2, NULL, '{"tacto", "social"}'),
('Confiesa algo bonito que suelas pensar de alguien de aquí pero que nunca se lo has dicho porque suena cursi.', 'vinculos', 'free', true, 3, NULL, '{"afecto", "confesion"}'),
('Ordena a la gente de este grupo de la más independiente hasta el más dependiente en sus problemas diarios.', 'vinculos', 'ranking', true, 4, NULL, '{"independencia", "apego"}'),
('¿Qué tipo de amigo sueles ser cuando hay un dramón general hercúleo en Whatsapp?', 'vinculos', 'mc', true, 2, ARRAY['El que envía audios de 5 minutos', 'El mediador pacifista que nadie escucha', 'Pone "JAJAJA" mientras arde el chat', 'Pone el teléfono en Modo Avión'], '{"drama", "whatsapp"}'),
('¿Quién recordaría con más exactitud el día en que nos conocimos, {member_A} o {member_B}?', 'vinculos', 'vs', true, 2, NULL, '{"memoria", "amistad"}');
