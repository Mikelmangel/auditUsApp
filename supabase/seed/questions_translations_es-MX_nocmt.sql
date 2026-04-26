INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active)
VALUES
('{member_A} vs {member_B}: ¿Quién sobreviviría menos tiempo en un festival de música sin agua?', 'vs', 'humor', NULL, false, 2, 'es-MX', ARRAY['😂']::text[], true),
('{member_A} vs {member_B}: ¿Quién pediría instrucciones en vez de usar el GPS aunque estuviera perdido?', 'poll', 'humor', NULL, false, 2, 'es-MX', '😂'),
('{member_A} vs {member_B}: ¿Qué tan buena es {member_A} planificando viajes sin improvisar nada? (1-10)', 'scale', 'habilidades', NULL, false, 2, 'es-MX', ARRAY['💪']::text[], true),
('{member_A} vs {member_B}: ¿Quién sería mejor DJ en una fiesta sin ensayar?', 'vs', 'habilidades', NULL, false, 2, 'es-MX', '💪'),
('{member_A} vs {member_B}: ¿Quién vivirá en otro país antes de los 40?', 'vs', 'futuro', NULL, false, 2, 'es-MX', ARRAY['🔮']::text[], true),
('{member_A} vs {member_B}: ¿Quién del grupo ganará un concurso donde no esperaba participar?', 'poll', 'futuro', NULL, false, 2, 'es-MX', '🔮'),
('{member_A} vs {member_B}: ¿A quién le has mentido más veces sin que lo descubriera?', 'vs', 'atrevidas', NULL, true, 2, 'es-MX', ARRAY['🌶️']::text[], true),
('¿Cuál es tu opinión más impopular sobre algo que todos parecen pensar diferente?', 'free', 'atrevidas', NULL, true, 1, 'es-MX', '🌶️'),
('{member_A} vs {member_B}: ¿Quién sobreviviría 1 mes en una isla con un gato y 3 libros?', 'vs', 'hipoteticas', NULL, false, 2, 'es-MX', ARRAY['🧠']::text[], true),
('{member_A} vs {member_B}: ¿Quién resolvería una situación de crisis con más creatividad?', 'vs', 'hipoteticas', NULL, false, 2, 'es-MX', '🧠'),
('{member_A} vs {member_B}: ¿Quién del grupo te conoce mejor que nadie?', 'poll', 'vinculos', NULL, false, 2, 'es-MX', ARRAY['💛']::text[], true),
('{member_A} vs {member_B}: Del 1 al 10, ¿cuánto crees que aportas tú al grupo?', 'scale', 'vinculos', NULL, false, 2, 'es-MX', '💛'),
('{member_A} vs {member_B}: ¿Quién elegiría el destino de vacaciones más caótico?', 'vs', 'eventos', NULL, false, 2, 'es-MX', ARRAY['🎉']::text[], true),
('{member_A} vs {member_B}: ¿Quién del grupo propone siempre planes distintos a los demás?', 'poll', 'eventos', NULL, false, 2, 'es-MX', '🎉'),
('{member_A} vs {member_B}: ¿Quién sería mejor presentador de podcast sobre IA?', 'vs', 'ia_custom', NULL, false, 2, 'es-MX', ARRAY['🤖']::text[], true),
('{member_A} vs {member_B}: ¿Quién confiaría en una IA para elegir su futuro laboral?', 'vs', 'ia_custom', NULL, false, 2, 'es-MX', '🤖'),
('¿Quién de {group_name} es más probable que se haga famoso en internet?', 'poll', 'humor', NULL, false, 2, 'es-MX', ARRAY['😂']::text[], true);
