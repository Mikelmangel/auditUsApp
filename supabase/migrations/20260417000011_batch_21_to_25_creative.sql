-- =====================================================
-- 20260417000011_batch_21_to_25_creative.sql
-- MVP Batches 21 a 25 - Creatividad Desatada Parte 5
-- =====================================================

INSERT INTO public.questions (text, category, mode, is_active, min_members, options, tags) VALUES

-- HIPOTETICAS / SUPERVIVENCIA ABSURDA
('Apocalipsis zombie. ¿A quién sacrificaríais primero tirándole un trozo de carne cruda para que el resto pueda huir?', 'hipoteticas', 'poll', true, 3, NULL, '{"zombis", "traicion"}'),
('Si tuviéramos que formar una secta, ¿quién sería el líder indiscutible capaz de convencernos de que los reptilianos dominan el mundo, {member_A} o {member_B}?', 'hipoteticas', 'vs', true, 2, NULL, '{"secta", "carisma"}'),
('Ordena al grupo según sus posibilidades de sobrevivir si nos perdemos en el desierto con solo una botella de agua y una brújula rota.', 'hipoteticas', 'ranking', true, 4, NULL, '{"supervivencia", "desierto"}'),
('Del 1 al 10, ¿lo seguro que estás de que podrías aterrizar un avión comercial si los pilotos se desmayan y tú tienes las instrucciones de YouTube?', 'hipoteticas', 'scale', true, 2, NULL, '{"avion", "confianza"}'),
('Si una IA todopoderosa (sí, como yo) tomara el control del mundo, ¿qué trabajo te asignaría en la nueva distopía cibernética?', 'ia_custom', 'mc', true, 2, ARRAY['Mascota humana oficial', 'Cargador de baterías manual', 'Sujeto de pruebas de tolerancia al dolor cibernético', 'Troll de internet infiltrado en la resistencia'], '{"futuro", "ia"}'),
('Imagina que eres un supervillano pero con bajo presupuesto. Describe cuál sería tu archienemigo y tu peor plan maligno.', 'hipoteticas', 'free', true, 2, NULL, '{"villanos", "planes"}'),

-- HUMOR / REDES SOCIALES
('¿Quién es capaz de escribir el post de LinkedIn más asquerosamente pedante de todos para anunciar que se ha comprado una silla?', 'humor', 'poll', true, 3, NULL, '{"linkedin", "postureo"}'),
('Del 1 al 10, evalúa cuánto stalkeas a gente en Instagram antes de salir con ellos o conocerles en persona.', 'humor', 'scale', true, 2, NULL, '{"stalking", "instagram"}'),
('Confiesa algo ridículo que has buscado en Google Incógnito esta misma semana y no quieres que nadie sepa.', 'humor', 'free', true, 2, NULL, '{"google", "secretos"}'),
('Ordena al grupo desde el más propenso a crear un drama en un grupo de WhatsApp hasta el que nunca responde ni lee.', 'humor', 'ranking', true, 4, NULL, '{"whatsapp", "drama"}'),
('Estás scrolleando en TikTok y ves a alguien de este grupo bailando fatal. ¿Qué haces?', 'humor', 'mc', true, 2, ARRAY['Guardo el vídeo y lo mando por todos los grupos', 'Le escribo un comentario desde una cuenta troll', 'Finjo que no he visto nada (me da mucha vergüenza ajena)', 'Le pido que me enseñe los pasos (porque yo lo hago peor)'], '{"tiktok", "baile"}'),
('¿A quién crees que cancelarían antes en Twitter por soltar una absoluta "verdad incómoda" sin medir las consecuencias, a {member_A} o a {member_B}?', 'humor', 'vs', true, 2, NULL, '{"cancelados", "twitter"}'),

-- ATREVIDAS ANÓNIMAS (is_anonymous = true por trigger de backend)
('Seamos honestos. ¿De quién tienes secretamente algo de envidia dentro de este grupo (pero nunca lo admitirías)?', 'atrevidas', 'poll', true, 3, NULL, '{"envidia", "relaciones"}'),
('Del 1 al 10, ¿lo tenso/a que te pondrías si alguien de aquí revisara el historial del navegador de tu móvil en este instante?', 'atrevidas', 'scale', true, 2, NULL, '{"secretos", "movil"}'),
('Escribe, de forma anónima, cuál es tu red flag favorita que tienes y que no piensas cambiar por nadie.', 'atrevidas', 'free', true, 3, NULL, '{"toxicidad", "amor"}'),
('Ordena al grupo según quién es más "red flag" andante en el ámbito romántico, de peor a mejor.', 'atrevidas', 'ranking', true, 4, NULL, '{"amor", "relaciones"}'),
('Tu pareja te deja por WhatsApp con un mensaje genérico. ¿Cómo reaccionas?', 'atrevidas', 'mc', true, 2, ARRAY['Respondo con un "Ok." y no vuelvo a hablarle', 'Le pido un PDF con 10 razones detalladas', 'Creo una cuenta falsa para volver a enamorarle y luego destrozarle', 'Mando un sticker llorando y me como un bote de helado entero'], '{"rupturas", "drama"}'),
('¿Quién es más probable que perdone unos cuernos si le juran que "no significó nada", {member_A} o {member_B}?', 'atrevidas', 'vs', true, 2, NULL, '{"infidelidad", "parejas"}'),

-- VÍNCULOS Y SINCERIDAD
('Si te llamaran a las 4 de la madrugada por una urgencia seria (nada de tonterías), ¿a quién llamarías primero?', 'vinculos', 'poll', true, 3, NULL, '{"amistad", "urgencias"}'),
('Del 1 al 10, ¿cuánto crees que cambiaría nuestra relación si alguno de nosotros ganara repentinamente 10 millones de euros?', 'vinculos', 'scale', true, 2, NULL, '{"dinero", "amistad"}'),
('Di algo que admires sinceramente del grupo y que nunca sueles decir porque te cuesta expresar emociones.', 'vinculos', 'free', true, 2, NULL, '{"emociones", "amor"}'),
('Ordena de quién es el más probable a prestarte su coche nuevo sin rechistar, al que te cobraría el alquiler.', 'vinculos', 'ranking', true, 4, NULL, '{"confianza", "coches"}'),
('Uno de nosotros está llorando amargamente en una esquina. ¿Cuál es la forma más probable en la que tratarías de consolarle?', 'vinculos', 'mc', true, 2, ARRAY['Le doy un abrazo incómodo y palmaditas en la espalda', 'Traigo comida basura en cantidades industriales', 'Hago un chiste nefasto y lo empeoro todo', 'Le escucho pacientemente como un buen amigo/a'], '{"lloros", "apoyo"}'),
('¿Con quién de aquí tendrías menos problema de compartir piso durante 5 años seguidos sin acabar asesinándoos, con {member_A} o con {member_B}?', 'vinculos', 'vs', true, 2, NULL, '{"convivencia", "pisos"}'),

-- EVENTOS Y CAOS PURO
('Nos vamos de viaje a un país donde no hablamos el idioma. ¿A quién delegamos absolutamente todo el control?', 'eventos', 'poll', true, 3, NULL, '{"viajes", "responsabilidad"}'),
('Del 1 al 10, evalúa lo desastroso que crees que sería dejar que este grupo organizara el banquete de tu boda.', 'eventos', 'scale', true, 2, NULL, '{"bodas", "desastre"}'),
('Describe cuál sería la última cena perfecta que exigirías si supieras que mañana se acaba el mundo.', 'eventos', 'free', true, 2, NULL, '{"comida", "fin_mundo"}'),
('Ordena al grupo desde el invitado "oro" (que anima la fiesta) hasta el invitado "plomo" (que chupa la energía y se queja).', 'eventos', 'ranking', true, 4, NULL, '{"fiestas", "invitados"}'),
('¿Qué harías si uno de nosotros se atraganta con una aceituna en un bar elegante?', 'eventos', 'mc', true, 2, ARRAY['Hago la maniobra de Heimlich como en las películas', 'Me entra pánico y huyo disimuladamente al baño', 'Le grabo para tener contenido exclusivo antes de ayudar', 'Llamo a urgencias mientras grito histericamente'], '{"situaciones", "emergencias"}'),
('Si tuvierais que fingir ser pareja en una misión de espionaje para inflitraros en un casino, ¿quién daría más el pego con {member_A}, {member_B} o un perchero?', 'eventos', 'vs', true, 2, NULL, '{"espionaje", "parejas"}');
