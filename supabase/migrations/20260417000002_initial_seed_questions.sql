-- =====================================================
-- 20260417000002_initial_seed_questions.sql
-- Seed inicial masivo con preguntas autogeneradas por IA
-- =====================================================

-- NOTA: Se asume que los enums question_category y question_mode existen.

INSERT INTO public.questions (text, category, mode, is_active, min_members, options, tags) VALUES
-- CATEGORIA: HUMOR 😂
('¿Quién es más probable que se tropiece en una calle plana, {member_A} o {member_B}?', 'humor', 'vs', true, 2, NULL, '{"casual"}'),
('¿Quién de nosotros se ríe en los momentos más inapropiados en público?', 'humor', 'poll', true, 3, NULL, '{"casual", "publico"}'),
('Si estuvieras obligado a tatuarte algo estúpido que elija tu grupo en la frente, ¿qué crees que sería?', 'humor', 'mc', true, 3, ARRAY['Un código de barras', 'Mi propio nombre mal escrito', 'Un meme caducado', 'Un emoji de payaso'], '{"hipotetico", "tatuajes"}'),
('Del 1 al 10, ¿cómo de mala es tu suerte habitualmente?', 'humor', 'scale', true, 2, NULL, '{"suerte", "vida"}'),
('¿Cuál es la anécdota más vergonzosa que recuerdas de la primera vez que salimos de fiesta?', 'humor', 'free', true, 3, NULL, '{"fiesta", "historia"}'),
('Ordena al grupo de el más propenso a crear un incendio cocinando al que menos.', 'humor', 'ranking', true, 4, NULL, '{"cocina", "desastre"}'),
('Si hiciéramos un reality show sobre nuestras vidas, ¿quién sería el primero en ser expulsado por aburrido?', 'humor', 'poll', true, 3, NULL, '{"reality", "tv"}'),
('En una pelea de gallos de rap improvisado, ¿quién pasaría más vergüenza, {member_A} o {member_B}?', 'humor', 'vs', true, 3, NULL, '{"musica", "rap"}'),

-- CATEGORIA: HABILIDADES 💪
('¿Del 1 al 10, cómo evaluarías tu capacidad para mentir sin que nadie se dé cuenta?', 'habilidades', 'scale', true, 3, NULL, '{"mentiras", "social"}'),
('En un apocalipsis zombie, ¿quién de nosotros sería el líder del escuadrón?', 'habilidades', 'poll', true, 3, NULL, '{"supervivencia", "liderazgo"}'),
('¿Quién es mejor arreglando cosas en casa sin llamar a un profesional, {member_A} o {member_B}?', 'habilidades', 'vs', true, 2, NULL, '{"manitas"}'),
('Ordena al grupo según su habilidad para salir de un escape room (del más rápido al más lento).', 'habilidades', 'ranking', true, 4, NULL, '{"escape_room", "inteligencia"}'),
('Del 1 al 10, ¿cómo de preparado te sientes para presentarte a MasterChef ahora mismo?', 'habilidades', 'scale', true, 2, NULL, '{"cocina", "tv"}'),
('¿Quién es más probable que sobreviva un año viviendo completamente en la naturaleza?', 'habilidades', 'poll', true, 3, NULL, '{"supervivencia", "naturaleza"}'),

-- CATEGORIA: FUTURO 🔮
('¿Quién crees que terminará siendo misteriosamente millonario en los próximos 10 años?', 'futuro', 'poll', true, 3, NULL, '{"dinero"}'),
('Si tuviéramos que apostar todo nuestro dinero a que uno de nosotros funda una secta, ¿quién sería?', 'futuro', 'poll', true, 3, NULL, '{"secta", "locura"}'),
('De aquí a 5 años, ¿dónde te ves viviendo?', 'futuro', 'mc', true, 2, ARRAY['En mi casa actual', 'En otro país muy lejano', 'En otra ciudad de mi país', 'Perdido en un bosque'], '{"vida", "viajes"}'),
('¿Quién se casará primero, {member_A} o {member_B}?', 'futuro', 'vs', true, 2, NULL, '{"amor", "bodas"}'),
('¿Del 1 al 10, cuánto crees que cambiará tecnológicamente el mundo de aquí a 2030?', 'futuro', 'scale', true, 2, NULL, '{"tecnologia"}'),
('Adivina el futuro: Describe cómo y de qué trabajará tu mejor amigo en 15 años.', 'futuro', 'free', true, 3, NULL, '{"trabajo", "imaginacion"}'),

-- CATEGORIA: ATREVIDAS 🌶️ (Nota: Force_anon devolverá is_anonymous = true a nivel BBDD)
('¿Quién de nosotros tiene los peores gustos a la hora de buscar pareja?', 'atrevidas', 'poll', true, 3, NULL, '{"parejas", "amor"}'),
('Escribe el secreto más oscuro que no le contarías a nadie en este cuarto o a la cuenta de 3 todos pierden.', 'atrevidas', 'free', true, 3, NULL, '{"secretos"}'),
('Si la única forma de salvar al grupo fuera besar a uno, ¿quién besaría a quién?', 'atrevidas', 'poll', true, 3, NULL, '{"salseo"}'),
('Confiesa: ¿Cuál es la mayor estupidez que has hecho por atraer la atención de alguien que te gustaba?', 'atrevidas', 'free', true, 3, NULL, '{"confesiones", "amor"}'),
('¿Quién de los dos es probablemente más celoso/a en secreto, {member_A} o {member_B}?', 'atrevidas', 'vs', true, 2, NULL, '{"celos", "salseo"}'),
('En una fiesta, ¿quién es más probable que se despierte al día siguiente en otra ciudad sin saber cómo?', 'atrevidas', 'poll', true, 3, NULL, '{"fiesta", "desfase"}'),

-- CATEGORIA: HIPOTETICAS 🧠
('Si pudieras pulsar un botón para ser billonario, pero pierdes 5 años de vida al hacerlo, ¿lo pulsas?', 'hipoteticas', 'mc', true, 2, ARRAY['¡Sí, sin dudarlo!', 'Ni loco, mi tiempo vale más', 'Solo si se lo puedo dar a mi familia', 'Solo si no tengo que trabajar más'], '{"filosofia", "dinero"}'),
('Si los extraterrestres invadieran la Tierra y tú fueras el embajador, ¿qué canción les pondrías primero?', 'hipoteticas', 'free', true, 2, NULL, '{"musica", "aliens"}'),
('Estás atrapado en un ascensor por 24 horas y solo puedes estar con uno. ¿A quién prefieres: a {member_A} o a {member_B}?', 'hipoteticas', 'vs', true, 3, NULL, '{"supervivencia", "sociabilidad"}'),
('Si todos nosotros fuéramos personajes de un videojuego, ¿cuál de nosotros sería el jefe final oculto?', 'hipoteticas', 'poll', true, 3, NULL, '{"gaming", "roles"}'),
('Imagina que eres un superhéroe. ¿Qué vehículo ridículo usarías para patrullar la ciudad?', 'hipoteticas', 'mc', true, 2, ARRAY['Un triciclo a motor', 'Un patinete con forma de pato', 'Un cohete que funciona a pedales', 'Una roomba gigante voladora'], '{"vehiculos", "superheroes"}'),
('Si tuvieras que sobrevivir en una isla desierta, ¿quién crees que perdería la cabeza primero?', 'hipoteticas', 'poll', true, 3, NULL, '{"supervivencia", "locura"}'),

-- CATEGORIA: VINCULOS 💛
('Del 1 al 10, ¿cómo evaluarías tu capacidad para mantener las amistades a distancia?', 'vinculos', 'scale', true, 2, NULL, '{"distancia", "amistad"}'),
('Ordena al grupo desde el más cariñoso o de "contacto físico" al más frío y distante.', 'vinculos', 'ranking', true, 4, NULL, '{"afecto", "personalidad"}'),
('¿Qué cosa específica que hace alguien en el grupo te molesta secretamente pero la aguantas por amistad?', 'vinculos', 'free', true, 3, NULL, '{"sinceridad", "roces"}'),
('¿Quién es el corazón y el alma del grupo, la persona que más une a todos?', 'vinculos', 'poll', true, 3, NULL, '{"emotivo", "union"}'),
('Si tuvieras que llamar a alguien del grupo a las 4 AM para que te saque de un apuro legal grave, ¿a quién llamarías?', 'vinculos', 'poll', true, 3, NULL, '{"confianza", "crisis"}'),
('¿Quién es mejor dando consejos de vida cuando estás en un momento horrible, {member_A} o {member_B}?', 'vinculos', 'vs', true, 3, NULL, '{"consejos", "apoyo"}'),

-- CATEGORIA: EVENTOS 🎉
('Ordena al grupo del que necesita más horas de sueño después de un evento, al que parece estar siempre despierto.', 'eventos', 'ranking', true, 4, NULL, '{"energia", "fiesta"}'),
('Del 1 al 10, ¿cuánto sueles estresarte el día antes de celebrar tu cumpleaños?', 'eventos', 'scale', true, 2, NULL, '{"cumpleaños", "estres"}'),
('En tu evento o boda ideal, ¿cuál sería la temática obligatoria para los invitados?', 'eventos', 'mc', true, 2, ARRAY['Todos de blanco puro', 'Disfraces ridículos obligatorios', 'Super elegante de gala, rollo James Bond', 'Temática años 80/90 retro'], '{"bodas", "ideas"}'),
('¿Quién sería más capaz de arruinar una boda tirando la tarta nupcial sin querer, {member_A} o {member_B}?', 'eventos', 'vs', true, 2, NULL, '{"desastre", "bodas"}'),
('¿Si hiciéramos un viaje de grupo a Las Vegas mañana mismo, quién sería el que gastaría el presupuesto primero?', 'eventos', 'poll', true, 3, NULL, '{"viajes", "dinero"}');
