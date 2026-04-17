-- =====================================================
-- 20260417000005_batch_3_150_questions.sql
-- MVP Batch 3: ¡Seguimos sumando contenido!
-- =====================================================

INSERT INTO public.questions (text, category, mode, is_active, min_members, options, tags) VALUES

-- HABILIDADES
('Ordena al grupo de quién sobreviviría más en una isla desierta a quién moriría el primer día.', 'habilidades', 'ranking', true, 4, NULL, '{"supervivencia"}'),
('Si estuvierais en un concurso de talentos, ¿quién haría el ridículo más espantoso?', 'humor', 'poll', true, 3, NULL, '{"talento", "ridiculo"}'),
('Del 1 al 10, ¿cómo de capaz te ves de mentir a la policía sin ponerte nervioso?', 'atrevidas', 'scale', true, 2, NULL, '{"mentiras", "policia"}'),
('Si solo pudieras tener una de estas habilidades inútiles, ¿cuál elegirías?', 'habilidades', 'mc', true, 2, ARRAY['Hablar con las palomas', 'Convertir el agua en cerveza tibia', 'Saber siempre quién se ha tirado un pedo', 'Poder dormir con los ojos abiertos'], '{"superpoderes"}'),
('¿Quién es más inútil montando una tienda de campaña, {member_A} o {member_B}?', 'habilidades', 'vs', true, 2, NULL, '{"acampada", "torpeza"}'),

-- HUMOR
('¿A quién le dejarías tu tarjeta de crédito sin límite durante 24 horas?', 'vinculos', 'poll', true, 3, NULL, '{"dinero", "confianza"}'),
('Del 1 al 10, ¿cómo evaluarías el peinado con el que solías ir en tu adolescencia?', 'humor', 'scale', true, 2, NULL, '{"estilo", "pasado"}'),
('Escribe el peor insulto infantil (como "cara de moco") que se te ocurra.', 'humor', 'free', true, 2, NULL, '{"insultos", "infancia"}'),
('Ordena de más a menos a la persona que más tarda en pillar un chiste de doble sentido.', 'humor', 'ranking', true, 4, NULL, '{"chistes", "lentos"}'),
('¿Qué harías si te encuentras a tu jefe/profesor en Tinder?', 'humor', 'mc', true, 2, ARRAY['Le doy "Super Like" para ver qué pasa', 'Lo bloqueo instantáneamente', 'Hago captura para el grupo', 'Borro mi cuenta y me mudo de país'], '{"tinder", "incomodo"}'),
('¿Quién se caería primero cruzando un charco, {member_A} o {member_B}?', 'humor', 'vs', true, 2, NULL, '{"torpeza"}'),

-- FUTURO
('¿Quién crees que se retirará antes y se irá a vivir a la playa?', 'futuro', 'poll', true, 3, NULL, '{"retiro", "vida"}'),
('Del 1 al 10, evalúa el nivel de fe que tienes en el futuro de la humanidad.', 'futuro', 'scale', true, 2, NULL, '{"humanidad", "filosofia"}'),
('¿Qué invento absurdo crees que se pondrá de moda en el año 2060?', 'futuro', 'free', true, 2, NULL, '{"inventos", "ciencia"}'),
('Ordena de quién terminará con más gatos viviendo en su casa de viejo.', 'futuro', 'ranking', true, 4, NULL, '{"gatos", "vejez"}'),
('Si en el futuro solo se pudiese usar una red social, ¿cuál salvarías?', 'futuro', 'mc', true, 2, ARRAY['Twitter / X (Para pelearse)', 'Instagram (Por el postureo)', 'TikTok (Por los memes rotos)', 'LinkedIn (Solo mentalidad de tiburón)'], '{"redes_sociales"}'),
('¿Quién mantendrá más pelo a los 50 años, {member_A} o {member_B}?', 'futuro', 'vs', true, 2, NULL, '{"edad", "aspecto"}'),

-- HIPOTETICAS / DILEMAS
('¿Quién sería el primero en traicionar al grupo si le ofrecieran un millón de euros?', 'hipoteticas', 'poll', true, 3, NULL, '{"traicion", "dinero"}'),
('Del 1 al 10, ¿hasta qué punto perdonarías a un amigo que se lió accidentalmente con tu ex?', 'vinculos', 'scale', true, 2, NULL, '{"perdon", "ex"}'),
('¿A qué época de la historia viajarías solo para quejarte de no tener WiFi?', 'hipoteticas', 'free', true, 2, NULL, '{"historia", "viajes"}'),
('Ordena de quién sobreviviría más a un secuestro hasta quién negociaría mal y lo matarían rápido.', 'hipoteticas', 'ranking', true, 4, NULL, '{"secuestro", "crimen"}'),
('Si fueses a reencarnar en un villano de una película, ¿cuál serías?', 'hipoteticas', 'mc', true, 2, ARRAY['Darth Vader (Trágico y asmático)', 'Voldemort (Sin nariz, pero poderoso)', 'El Joker (Para liarla sin motivo)', 'Thanos (Por el control total)'], '{"villanos", "cine"}'),
('¿Quién sobreviviría más tiempo si estuviera perdido en un desierto, {member_A} o {member_B}?', 'hipoteticas', 'vs', true, 2, NULL, '{"desierto", "supervivencia"}'),

-- ATREVIDAS / SALSEO (is_anonymous = true en trigger)
('¿Quién del grupo crees que tiene más fetiches raros que no cuenta?', 'atrevidas', 'poll', true, 3, NULL, '{"fetiches", "secretos"}'),
('Del 1 al 10, ¿lo tóxico/celoso que puede llegar a ser el ex más pesado de {member_A}?', 'atrevidas', 'scale', true, 2, NULL, '{"ex", "toxicidad"}'),
('Confiesa algo que robaste cuando eras pequeño sin que nadie se enterase nunca.', 'atrevidas', 'free', true, 3, NULL, '{"robo", "confesiones"}'),
('Ordena de quién se enamora más rápido a quién tiene el corazón de hielo absoluto.', 'vinculos', 'ranking', true, 4, NULL, '{"amor", "corazon"}'),
('Si tuvieras que enseñar el historial de tu móvil ahora mismo a tu madre, ¿qué harías?', 'atrevidas', 'mc', true, 2, ARRAY['Se lo enseño, no oculto nada', 'Le quito el móvil de las manos violentamente', 'Salgo corriendo sin mirar atrás', 'Lo tiro directamente por la ventana'], '{"movil", "secretos"}'),
('¿Quién es más probable que termine teniendo una aventura amorosa escondida, {member_A} o {member_B}?', 'atrevidas', 'vs', true, 2, NULL, '{"engaños", "salseo"}'),
('¿Quién besa peor del grupo según los rumores (o tu intuición)?', 'atrevidas', 'poll', true, 3, NULL, '{"besos", "rumores"}'),

-- EVENTOS
('¿Quién sería capaz de beberse hasta el agua de los floreros en la próxima fiesta?', 'eventos', 'poll', true, 3, NULL, '{"alcohol", "fiesta"}'),
('Del 1 al 10, predecir el desastre que supondría si nos vamos juntos de viaje un mes entero.', 'eventos', 'scale', true, 3, NULL, '{"viajes", "desastre"}'),
('Describe cuál sería la última cena perfecta antes de que el mundo acabe mañana.', 'eventos', 'free', true, 2, NULL, '{"cena", "comida"}'),
('Ordena de quién es el mejor anfitrión de casa a quién ni siquiera ofrece un vaso de agua.', 'eventos', 'ranking', true, 4, NULL, '{"anfitrion", "invitados"}'),
('Para la despedida de soltero/a de ti o del grupo, ¿dónde nos vamos?', 'eventos', 'mc', true, 2, ARRAY['Las Vegas a perder la dignidad', 'Ibiza de fiesta 48 horas seguidas', 'A una cabaña rural relajante', 'A un viaje cultural por Europa'], '{"despedidas", "viajes"}'),
('¿Quién de los dos tiene peor aguante bailando de madrugada, {member_A} o {member_B}?', 'eventos', 'vs', true, 2, NULL, '{"baile", "resistencia"}'),

-- HUMOR / RANDOM BULK
('¿Quién usaría a escondidas los cepillos de dientes del resto si se le olvida el suyo?', 'humor', 'poll', true, 3, NULL, '{"asqueroso", "secretos"}'),
('Del 1 al 10, el nivel de paciencia que hay que tener para discutir contigo.', 'vinculos', 'scale', true, 2, NULL, '{"discusiones", "paciencia"}'),
('Si un genio malvado convirtiera a {member_A} en un objeto inanimado, ¿cuál sería?', 'humor', 'free', true, 2, NULL, '{"magia", "absurdo"}'),
('Ordena de quién duerme más horas seguidas como un oso a quién duerme como un vampiro.', 'humor', 'ranking', true, 4, NULL, '{"sueño", "dormir"}'),
('Si te diesen la pastilla roja de Matrix, pero al tomarla descubres que la realidad es que somos Sims, ¿qué harías?', 'hipoteticas', 'mc', true, 2, ARRAY['Miro al cielo a ver si veo el cursor gigante', 'Dejo de trabajar, total no importa', 'Intento hackear el juego para tener dinero infinito', 'Le ruego a mi jugador que no me quite la escalera de la piscina'], '{"matrix", "filosofia"}'),
('¿Quién es más probable que hable solo por la calle pareciendo un psicópata, {member_A} o {member_B}?', 'humor', 'vs', true, 2, NULL, '{"locura"}'),

-- VINCULOS
('¿Quién del grupo sería capaz de guardar un secreto de estado sin decírselo ni a su perro?', 'vinculos', 'poll', true, 3, NULL, '{"secretos", "amistad"}'),
('Del 1 al 10, ¿lo mucho que tardan las personas de este grupo en contestar tus mensajes urgentes?', 'vinculos', 'scale', true, 3, NULL, '{"mensajes", "whatsapp"}'),
('Nombra una frase mítica o latiguillo que repita demasiado alguien de este grupo.', 'humor', 'free', true, 3, NULL, '{"frases", "colegas"}'),
('Ordena a la gente de este grupo según a quién le pedirías consejo para superar una ruptura amorosa.', 'vinculos', 'ranking', true, 4, NULL, '{"rupturas", "consejos"}'),
('¿Qué plan prefieres para un domingo aburrido lluvioso?', 'vinculos', 'mc', true, 2, ARRAY['Manta, peli y pedir comida gigante', 'Ir al cine y evadirse', 'Ponerse a ordenar toda la casa como un maniaco', 'Dormir todo el día cancelando cualquier compromiso'], '{"domingos", "planes"}'),
('¿A quién preferirías confiarle tu mascota si te vas 1 mes fuera, a {member_A} o a {member_B}?', 'vinculos', 'vs', true, 2, NULL, '{"mascotas", "confianza"}');
