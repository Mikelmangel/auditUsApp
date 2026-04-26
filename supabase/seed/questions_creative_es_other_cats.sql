-- questions_creative_es_other_cats.sql
-- 300 creative Spanish questions for habilidades, futuro, hipoteticas

-- ============================================================
-- HABILIDADES (💪) - 100 questions
-- poll=25, vs=25, mc=15, scale=20, free=5, ranking=10
-- ============================================================

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- HABILIDADES poll (1-10)
('¿Quién es la persona más organizada del grupo?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién manejoría mejor una crisis financiera?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién tiene más facilidad para aprender idiomas?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién sería mejor chef profesional?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién tiene más talento artístico natural?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién se adaptaría mejor a vivir en otro país?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién tiene más capacidad de liderazgo natural?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién sería mejor empresario?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién tiene más paciencia para enseñar?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién sería mejor profesor?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién tiene más habilidad para negociar?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién sería mejor psicólogo?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién tiene más capacidad de multitarea?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién destacaría más en un reality show?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién tiene más iniciativa para emprender?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién sería mejor representando al grupo en público?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién tiene mejor memoria para nombres?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién sería mejor guía turístico?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién tiene más habilidad con las manualidades?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién destacaría más en un debate?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién sería mejor mediador en conflictos?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién tiene más capacidad de improvisación?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién sería mejor diplomático?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién tiene más habilidad para decorar?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Quién sería mejor coordinador de eventos?', 'poll', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- HABILIDADES vs (1-15)
('{member_A} vs {member_B}: ¿Quién es más bueno resolviendo problemas técnicos?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tiene más creatividad?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién trabaja más rápido bajo presión?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién es más puntual?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tiene mejor voz para cantar?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién es más ágil mentalmente?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tiene más energía para proyectos largos?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién es mejor siguiendo instrucciones?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tiene más visión de futuro?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién se enfoca mejor en los detalles?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tiene más carisma?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién es más metódico?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién aprende más rápido cosas nuevas?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tiene más resistencia al estrés?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién es más eficiente trabajando solo?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tiene mejor capacidad de análisis?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién es más decidido?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tiene más paciencia en general?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería mejor jugando al ajedrez?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tiene mejor sentido del humor?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién es más analítico al tomar decisiones?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tiene más autodisciplina?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién es mejor delegando tareas?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tiene más intuición?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién es más competitivo?', 'vs', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- HABILIDADES mc (1-10)
('¿En qué habilidad destacarían más como grupo?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Planificación de viajes", "Organización de fiestas", "Proyectos creativos", "Resolución de conflictos"]', NOW()),
('¿Qué habilidad práctica debería aprender el grupo juntos?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Cocina", "Primeros auxilios", "Finanzas personales", "Reparaciones del hogar"]', NOW()),
('Si pudieran desarrollar una habilidad sobrehumana, ¿cuál sería?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Telepatía", "Volar", "Invisibilidad", "Control del tiempo"]', NOW()),
('¿Qué habilidad te gustaría mejorar significativamente?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Hablar en público", "Gestionar el dinero", "Cocinar", "Habilidades sociales"]', NOW()),
('¿Cuál es la habilidad más infravalorada en general?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Escuchar activamente", "Cocinar bien", "Escribir claramente", "Negociar"]', NOW()),
('¿Qué habilidad te ayudaría más en tu carrera?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Comunicación", "Liderazgo", "Pensamiento crítico", "Gestión del tiempo"]', NOW()),
('¿De qué habilidad dependería más en un apocalipsis zombie?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Supervivencia", "Combate cuerpo a cuerpo", "Primeros auxilios", "Busca de recursos"]', NOW()),
('¿Qué habilidad te hace sentir más seguro?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Conducir", "Nadar", "Autodefensa", "Primeros auxilios"]', NOW()),
('¿Qué habilidad podría salvar una relación?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Escuchar sin interrumpir", "Pedir perdón", "Comunicar sentimientos", "Comprometerte"]', NOW()),
('¿Qué habilidad es más importante para emprender?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Ventas", "Gestión financiera", "Marketing", "Liderazgo de equipos"]', NOW()),
('¿Qué habilidad te gustaría haber aprendido de joven?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Tocar un instrumento", "Un idioma", "Dibujar", "Programación"]', NOW()),
('¿Cuál es la habilidad más difícil de enseñar?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Empatía", "Creatividad", "Intuición de negocios", "Carisma"]', NOW()),
('¿Qué habilidad combina mejor con tu personalidad?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Escritura creativa", "Diseño gráfico", "Fotografía", "Gestión de redes sociales"]', NOW()),
('¿Qué habilidad mejoraría tu calidad de vida notablemente?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Cocinar delicioso", "Organización del hogar", "Gestión del estrés", "Dormir mejor"]', NOW()),
('¿Qué habilidad sería más útil en un desierto?', 'mc', 'habilidades', '["💪"]', true, 'es', 0, '["Encontrar agua", "Orientación", "Fabricar herramientas", "Resistencia al calor"]', NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- HABILIDADES scale (1-20)
('¿Cuánto contribuye cada uno al grupo en términos de organización? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de creatividad tiene el grupo en general? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de motivación hay en el grupo actualmente? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de confianza hay entre los miembros? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de comunicación tiene el grupo? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de compromiso tienen los miembros? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de diversión hay en las reuniones del grupo? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de productividad tiene el grupo? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de apoyo emocional hay en el grupo? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de innovación aporta el grupo? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de planificación tiene el grupo? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de armonía hay en el grupo? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de flexibilidad tiene el grupo? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de implicación hay en las decisiones grupales? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de lealtad hay en el grupo? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de sinergia genera el grupo? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de resolución de conflictos tiene el grupo? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de celebración de logros tiene el grupo? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de adaptación a cambios tiene el grupo? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Cuánto nivel de sentimiento de pertenencia hay? (1-10)', 'scale', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- HABILIDADES free (1-5)
('Cuéntame sobre una habilidad que aprendiste por pura curiosidad y terminó siendo útil.', 'free', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('Describe un momento en que tu instinto te salvó de cometer un error.', 'free', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Qué habilidad dominas que muy poca gente sabe que tienes?', 'free', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('Cuéntame sobre algo que intentaste aprender pero tuviste que abandonar. ¿Por qué?', 'free', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW()),
('¿Qué habilidad te gustaría enseñarle a alguien del grupo? ¿A quién y por qué?', 'free', 'habilidades', '["💪"]', true, 'es', 0, NULL, NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- HABILIDADES ranking (1-10)
('Ordena a los miembros por quién sería mejor líder en una emergencia.', 'ranking', 'habilidades', '["💪"]', true, 'es', 4, NULL, NOW()),
('Ordena a los miembros por quién tiene más habilidades sociales.', 'ranking', 'habilidades', '["💪"]', true, 'es', 4, NULL, NOW()),
('Ordena a los miembros por quién es más trabajador.', 'ranking', 'habilidades', '["💪"]', true, 'es', 4, NULL, NOW()),
('Ordena a los miembros por quién aporta más ideas creativas.', 'ranking', 'habilidades', '["💪"]', true, 'es', 4, NULL, NOW()),
('Ordena a los miembros por quién es más fiable.', 'ranking', 'habilidades', '["💪"]', true, 'es', 4, NULL, NOW()),
('Ordena a los miembros por quién mantiene mejor la calma bajo presión.', 'ranking', 'habilidades', '["💪"]', true, 'es', 4, NULL, NOW()),
('Ordena a los miembros por quién es más organizado.', 'ranking', 'habilidades', '["💪"]', true, 'es', 4, NULL, NOW()),
('Ordena a los miembros por quién tiene más iniciativa.', 'ranking', 'habilidades', '["💪"]', true, 'es', 4, NULL, NOW()),
('Ordena a los miembros por quién se adapta más rápido a nuevos entornos.', 'ranking', 'habilidades', '["💪"]', true, 'es', 4, NULL, NOW()),
('Ordena a los miembros por quién tendría más éxito en una entrevista de trabajo.', 'ranking', 'habilidades', '["💪"]', true, 'es', 4, NULL, NOW());

-- ============================================================
-- FUTURO (🔮) - 100 questions
-- poll=30, vs=30, mc=10, scale=0, free=15, ranking=15
-- ============================================================

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- FUTURO poll (1-15)
('¿Quién será el primero en cambiar de carrera?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién se mudará más lejos en los próximos 5 años?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién tendrá la vida más interesante a los 40?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién será el primero en tener hijos?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién tendrá más éxito financiero a largo plazo?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién seguirá manteniendo contacto con el grupo en 10 años?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién se jubilará antes?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién viajará a más países en su vida?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién escribirá un libro algún día?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién se volverá famoso?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién tendrá una vida más tranquila?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién tomará riesgos más grandes en la vida?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién será más feliz a largo plazo?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién tendrá más nietos?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién vivirá más años?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién será el primero en alcanzar un sueño importante?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién tendrá la casa más impresionante?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién dominará más idiomas?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién será más conocido en su campo?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién tendrá más mascotas en su vida?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién se convertirá en mentor de otros?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién tendrá más historias que contar?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién cambiará más como persona?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién tendrá más suerte en la vida?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién dejará más huella en el mundo?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién se convertirá en chef profesional?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién tendrá un negocio propio exitoso?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién se mudará al extranjero?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién alcanzará la paz interior primero?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Quién vivirá la vida más auténtica?', 'poll', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- FUTURO vs (1-15)
('{member_A} vs {member_B}: ¿Quién tendrá más dinero a los 50?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién será más feliz en el futuro?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién realizará sus sueños primero?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tendrá una familia más grande?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién vivirá más aventuras?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tendrá más influencia en otros?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién se reinventará más veces?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tendrá mejor salud a largo plazo?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién será más respetado?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tendrá más recuerdos memorables?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién envejecerá con más gracia?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién encontrará su pasión antes?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tendrá más éxito en sus relaciones?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién será más generoso con su tiempo?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién dejará un legado más importante?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tendrá más confianza en sí mismo?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién se mudará a un lugar más exótico?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tendrá más tiempo libre?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién será más feliz?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tendrá una vida más inesperada?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tendrá más amigos?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién logrará la fama primero?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tendrá más conocimiento?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién viajará más?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién será más sabio?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tendrá más impacto social?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién escribirá un best seller?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién aparecerá en noticias algún día?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tendrá más suerte en el amor?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién realizará el sueño más grande?', 'vs', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- FUTURO mc (1-10)
('¿Qué predicción es más probable para el grupo?', 'mc', 'futuro', '["🔮"]', true, 'es', 0, '["Seguiremos siendo amigos íntimos", "Nos alejaremos gradualmente", "Perdimos el contacto pero nos reencontraremos", "Seremos como familia"]', NOW()),
('¿En qué mes del año nos esperaban buenas noticias?', 'mc', 'futuro', '["🔮"]', true, 'es', 0, '["Enero - nuevas oportunidades", "Marzo - cambio positivo", "Junio - viaje memorable", "Septiembre - crecimiento personal"]', NOW()),
('¿Qué evento es más probable que ocurra primero?', 'mc', 'futuro', '["🔮"]', true, 'es', 0, '["Un miembro se casará", "Alguien cambiará de carrera", "Haremos un viaje juntos", "Alguien tendrá un bebé"]', NOW()),
('¿Qué futuro le espera al grupo como unidad?', 'mc', 'futuro', '["🔮"]', true, 'es', 0, '["Se fortalezca con los años", "Se reduzca a un grupo pequeño", "Se expandirá con nuevos miembros", "Se transformará en algo diferente"]', NOW()),
('¿Cuál será la mayor aventura del grupo?', 'mc', 'futuro', '["🔮"]', true, 'es', 0, '["Viaje internacional sorpresa", "Proyecto empresarial conjunto", "Aventura extrema juntos", "Crisis que superaremos juntos"]', NOW()),
('¿Qué predicción se cumplirá primero?', 'mc', 'futuro', '["🔮"]', true, 'es', 0, '["Alguien recibirá una promoción", "Haremos nuevas incorporaciones al grupo", "Viajaremos al extranjero juntos", "Alguien encontrará el amor"]', NOW()),
('¿Cómo será el grupo dentro de 10 años?', 'mc', 'futuro', '["🔮"]', true, 'es', 0, '["Más unido que nunca", "Perfectamente igual", "Completamente diferente", "Mitológicos y legendarios"]', NOW()),
('¿Qué desafío enfrentará el grupo?', 'mc', 'futuro', '["🔮"]', true, 'es', 0, '["Una pérdida importante", "Un cambio de vida de un miembro clave", "Una traición o decepción", "Una mudanza que separa"]', NOW()),
('¿Qué predicción sobre nosotros es más loca pero posible?', 'mc', 'futuro', '["🔮"]', true, 'es', 0, '["Seremos roommates en una mansión", "Crearemos una empresa exitosa", "Estrellas de un reality show", "Venceremos en un concurso juntos"]', NOW()),
('¿Qué futuro le espera al más exitoso de nosotros?', 'mc', 'futuro', '["🔮"]', true, 'es', 0, '["Poderoso empresarial", "Famoso artista", "Líder comunitario", "Filántropo anónimo"]', NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- FUTURO free (1-15)
('¿Cuál es tu mayor esperanza para los próximos 5 años?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Qué temes que pueda pasar en el futuro?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Dónde te ves viviendo a los 50 años?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Qué habrías hecho diferente en tu vida si supieras lo que sabes ahora?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Qué legado quieres dejar cuando ya no estés?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Cuál es tu mayor sueños que crees que cumplirás?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Qué habrías hecho que nunca pensaste que harías?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Qué parte de tu vida actual crees que será muy diferente en 10 años?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Qué arrepentimientos tendrías al final de tu vida?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Qué nuevo aparecerá en tu vida?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Cuál es la mayor aventura que te gustaría vivir?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Qué te gustaría hacer antes de morir?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Cómo será un día perfecto en tu vida ideal?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Qué nuevos pasatiempos tendrás?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW()),
('¿Qué serías capaz de hacer por tus sueños?', 'free', 'futuro', '["🔮"]', true, 'es', 0, NULL, NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- FUTURO ranking (1-15)
('Ordena a los miembros por quién realizará sus sueños primero.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién tendrá más dinero a los 40.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién será más feliz a largo plazo.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién tendrá la vida más aventurera.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién tendrá una familia más grande.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién se mudará más lejos.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién alcanzará la fama primero.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién tendrá más éxito profesional.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién será más saludable.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién viajará más que todos.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién tendrá más nietos.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién dejará más huella.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién vivirá más años.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién será el más exitoso.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién tendrá más historias que contar.', 'ranking', 'futuro', '["🔮"]', true, 'es', 4, NULL, NOW());

-- ============================================================
-- HIPOTETICAS (🧠) - 100 questions
-- poll=0, vs=35, mc=25, scale=0, free=25, ranking=15
-- ============================================================

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- HIPOTETICAS vs (1-20)
('{member_A} vs {member_B}: ¿Quién sobreviviría más tiempo en una isla desierta?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería elegido para liderar una misión a Marte?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sobreviviría a una película de terror?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería mejor agente secreto?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién ganaría en un concurso de comer?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería el último en ser eliminado en Los últimos supervivientes?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sobreviviría al apocalipsis zombie?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería el mejor personaje en una comedia?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería el villano en una película?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién ganaría en un duelo de bromas?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién tendría más éxito en una isla tropical?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería el primero en morir en una película de horror?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sobreviviría en la Edad Media?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería mejor padre/madre?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sobreviviría más tiempo sin tecnología?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería el mejor impostor?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién ganaría un reality show?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién ganaría en una batalla de rap?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería el mejor detective?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sobreviviría en un planeta alienígena?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería el mejor rey/reina?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién ganaría en un maratón de películas?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sobreviviría si el mundo se acabara mañana?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería el mejor pirata?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién ganaría en un talent show?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería el mejor espía?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sobreviviría en un naufragio?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería el mejor superhéroe?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién ganaría en un combate de Wrestling?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sobreviviría en una tormenta de nieve?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería el mejor mago?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería el primero en rendirse en un reto?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sobreviviría en el desierto?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sería el mejor Sommelier del grupo?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('{member_A} vs {member_B}: ¿Quién sobreviviría más tiempo en una tormenta de arena?', 'vs', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- HIPOTETICAS mc (1-15)
('¿Te atreverías a saltar en paracaídas?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Sin dudarlo", "Con mucho miedo pero sí", "Probablemente no", "Nunca en la vida"]', NOW()),
('¿Qué harías si ganaras la lotería?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Lo donaría todo", "Viajaría por el mundo", "Invertíría en negocios", "Cambiaría mi vida radicalmente"]', NOW()),
('¿Qué preferirías ser capaz de hacer?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Volar", "Invisibilidad", "Leer la mente", "Viajar en el tiempo"]', NOW()),
('¿Si pudieras cenar con cualquier persona histórica?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Leonardo da Vinci", "Cleopatra", "Albert Einstein", "Nikola Tesla"]', NOW()),
('¿Qué situación podrías enfrentar por amor?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Mudarte a otro país", "Dejar tu trabajo", "Romper con tu familia", "Cambiar de ciudad"]', NOW()),
('¿Qué preferirías perder?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Tu teléfono", "Tu memoria", "Tu dinero", "Tu vista"]', NOW()),
('¿En qué época histórica vivirías?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Renacimiento", "Años 80", "Futuro distante", "Edad Media"]', NOW()),
('¿Qué riesgo tomarías sin dudarlo?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Emprender un negocio", "Irse de viaje solo", "Confesar un secreto", "Darle un giro a su vida"]', NOW()),
('¿Qué dilema ético elegirías?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Mentir para salvar a alguien", "Decir la verdad y hacer daño", "Callar y dejar que pase", "Buscar una tercera opción"]', NOW()),
('¿Qué superpoder tendrías en una guerra zombie?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Superfuerza", "Velocidad", "Invisibilidad", "Curación rápida"]', NOW()),
('¿Qué cambiarías de tu pasado si pudieras?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Una decisión importante", "Una relación fallida", "Una oportunidad perdida", "Un mensaje que no enviaste"]', NOW()),
('¿Qué personaje de ficción serías?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Harry Potter", "Sherlock Holmes", "Wonder Woman", "Tony Stark"]', NOW()),
('¿Qué harías si fueras invisible por un día?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Espiar a famosos", "Entrar en lugares prohibidos", "Ayudar a personas", "Vivir sin ser visto"]', NOW()),
('¿Qué vida paralela tendrías?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Estrella de cine", "Científico loco", "Pirata", "Monje"]', NOW()),
('¿Qué preferirías que fuera real?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Magia", "Extraterrestres", "Viajes en el tiempo", "Telepatía"]', NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- HIPOTETICAS mc (16-25)
('¿Qué situación te haría perder la cabeza?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Infidelidad", "Traición de un amigo", "Perder todo mi dinero", "Una enfermedad"]', NOW()),
('¿Qué preferirías tener: dinero o amor?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Dinero ilimitado", "Amor verdadero", "Ambos equilibrado", "Ninguno"]', NOW()),
('¿Qué harías si tu mejor ami fuera el presidente?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Pedirle trabajo", "Darle consejos", "Mantener distancia", "Apoyarlo desde fuera"]', NOW()),
('¿Qué trabajo tendrías en una sociedad ideal?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Artista", "Científico", "Médico", "Profesor"]', NOW()),
('¿Qué harías si te cae una condena?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Escribir un libro", "Ejercitarte", "Estudiar", "Meditar"]', NOW()),
('¿Si pudieras desirle algo a tu yo del pasado?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Sé más valiente", "Ahorra más dinero", "Disfruta más", "Todo está bien"]', NOW()),
('¿Qué harías si despertaras en otro cuerpo?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Intentar volver", "Explorar la nueva vida", "Buscar una cura", "Aceptarlo"]', NOW()),
('¿Qué película de tu vida noverías?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Comedia", "Drama", "Terror", "Romance"]', NOW()),
('¿Qué cambiarías en ti mismo?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Ser más alto", "Ser más bello", "Ser más inteligente", "Todo"]', NOW()),
('¿Qué harías si no existieran redes sociales?', 'mc', 'hipoteticas', '["🧠"]', true, 'es', 0, '["Leer más", "Salir más", "Aprender algo nuevo", "Volverte loco"]', NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- HIPOTETICAS free (1-15)
('¿Qué harías si descubrieras que tu vida es un sueño?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Cómo actuarías si pudieras detener el tiempo por un momento cada día?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué nuevo habrías hecho si no tuviste miedo?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué arrepentimientos tendrías al final de tu vida?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué harías si fueras el último humano en la Tierra?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué mensaje mandarías a los humanos del futuro?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué harías diferente si pudieras empezar de nuevo?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Cómo sería tu vida si hubieras nacido en otro país?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué pasaría si no existiera el dinero?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué harías si pudieras revivir un día de tu vida?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué haría diferente si fuera inmortal?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué nuevo verías en ti mismo?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Cómo ayudarías al mundo si tuvieras poderes?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué temes más en un escenario hipotético?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué haría única tu versión de ti en un multiverso?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- HIPOTETICAS free (16-25)
('¿Qué harías si tu equipo pudiera tener un superpoder colectivo?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué escenario de ciencia ficción te gustaría que fuera real?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué harías diferente si supieras que nadie te juzga?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué nuevo verías en 100 años?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué mensaje tendrías para tu yo de 80 años?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué haría que fueras verdaderamente feliz en un mundo ideal?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué nuevo pasaría si pudieras leer mentes?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué miedo superarías primero?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué diferente harías si no tuvieras hijos?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW()),
('¿Qué haría única tu vida si vivieras en otro planeta?', 'free', 'hipoteticas', '["🧠"]', true, 'es', 0, NULL, NOW());

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
-- HIPOTETICAS ranking (1-15)
('Ordena a los miembros por quién sobreviviría más tiempo en una isla desierta.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién sería el mejor líder en un apocalipsis.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién sería más adaptable a los cambios.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién sería más fuerte emocionalmente en una crisis.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién tendría más éxito en otro siglo.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién sería mejor en una supervivencia urbana.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién mantendría la calma en una emergencia.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién sería el mejor héroe en apuros.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién se adaptation más rápido al cambio.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién sería mejor en un mundo sin tecnología.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién tendría la mejor historia para contar.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién sería más peligroso en una situación extrema.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién sería mejor organizador en el caos.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién tendría más probabilidades de sobrevivir en la prehistoria.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW()),
('Ordena por quién sería el más creativo resolviendo problemas imposibles.', 'ranking', 'hipoteticas', '["🧠"]', true, 'es', 4, NULL, NOW());;
