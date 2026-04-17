-- =====================================================
-- 20260417000007_batch_5_to_6_mass_questions.sql
-- MVP Batches 5 y 6
-- =====================================================

INSERT INTO public.questions (text, category, mode, is_active, min_members, options, tags) VALUES

-- HUMOR 😂 
('¿Quién del grupo es más capaz de ofenderse por un meme inofensivo?', 'humor', 'poll', true, 3, NULL, '{"memes", "piel_fina"}'),
('Si tuviésemos que hacer un sacrificio a un volcán para que apruebes, ¿a quién tiramos?', 'humor', 'poll', true, 3, NULL, '{"volcan", "sacrificio"}'),
('¿Del 1 al 10, cómo de pesada eres pidiendo que te saquen fotos para Instagram?', 'humor', 'scale', true, 2, NULL, '{"fotos", "influencer"}'),
('Ordena al grupo entero del más capaz de comer de la basura al menos capaz.', 'humor', 'ranking', true, 4, NULL, '{"hambre", "basura"}'),
('¿A quién llevarías a tu programa infantil favorito si pudieras enchufarlo, a {member_A} o a {member_B}?', 'humor', 'vs', true, 2, NULL, '{"tele", "infantil"}'),
('Escribe el peor nombre que le pondrías a un restaurante familiar.', 'humor', 'free', true, 2, NULL, '{"inventos", "comida"}'),
('¿Qué pasaría si descubres que tu psicólogo filtra tus traumas en Twitter?', 'humor', 'mc', true, 2, ARRAY['Lo denuncio', 'Me abro un hilo dando contexto', 'Lloro', 'No voy más pero se lo pago'], '{"paranoia", "psicologia"}'),

-- HABILIDADES 💪
('¿Quién es el más propenso a quemar la cocina haciendo macarrones con queso?', 'habilidades', 'poll', true, 3, NULL, '{"cocina", "fuego"}'),
('Del 1 al 10, ¿lo capaz que te ves de hackear la cuenta de Netflix de tu ex?', 'habilidades', 'scale', true, 2, NULL, '{"hackers", "ex"}'),
('Ordena de quién es el mejor jugando al Mario Kart al más nefasto conduciendo píxeles.', 'habilidades', 'ranking', true, 4, NULL, '{"videojuegos", "mario_kart"}'),
('¿Quién sobreviviría antes si de la nada nos atacan ninjas, {member_A} o {member_B}?', 'habilidades', 'vs', true, 2, NULL, '{"ninjas", "supervivencia"}'),
('Si estuvieras en el paro y sin ahorros, ¿qué negocio turbio montarías de urgencia?', 'habilidades', 'free', true, 2, NULL, '{"dinero", "negocio"}'),
('Si te dejan en medio del mar, ¿qué herramienta inútil elegirías?', 'habilidades', 'mc', true, 2, ARRAY['Un mando de la tele universal', 'Una zapatilla crocs rota', 'Una tostadora impermeable', 'Un diccionario de francés'], '{"supervivencia", "inutil"}'),

-- ATREVIDAS 🌶️
('¿A quién ves más probable poniéndole los cuernos a su pareja virtual en los Sims?', 'atrevidas', 'poll', true, 3, NULL, '{"sims", "cuernos"}'),
('Del 1 al 10, ¿lo tentado que has estado en los últimos meses de volver a escrbir a un "casi algo"?', 'atrevidas', 'scale', true, 2, NULL, '{"tentacion", "ex"}'),
('Ordena de quién es el más experto ocultando relaciones secretas al más bocazas.', 'atrevidas', 'ranking', true, 4, NULL, '{"secretos", "amor"}'),
('¿Cuál crees que es la mentira que {member_A} cuenta con más naturalidad?', 'atrevidas', 'free', true, 2, NULL, '{"mentiras", "intuicion"}'),
('Si tuvieras permiso de cometer un crimen de bajo nivel sin consecuencias, ¿qué harías?', 'atrevidas', 'mc', true, 2, ARRAY['Robarle a una corporación millonaria', 'Entrar a mirar la casa del vecino', 'Aparcar en minusválidos por siempre', 'Hackear instagrams ajenos'], '{"redflags", "delitos"}'),
('¿A quién preferirías besar si el mundo dependiera de ello o nos morimos todos, a {member_A} o a {member_B}?', 'atrevidas', 'vs', true, 2, NULL, '{"besos", "suprvivencia"}'),

-- EVENTOS 🎉
('¿Quién es más probable de emborracharse antes de que llegue siquiera la tarta, {member_A} o {member_B}?', 'eventos', 'vs', true, 2, NULL, '{"alcohol", "fiesta"}'),
('¿A quién hay que confiscarle el móvil después de 3 copas?', 'eventos', 'poll', true, 3, NULL, '{"movil", "peligro"}'),
('Del 1 al 10, evalúa cuánto soportas el ruido de masificaciones de gente.', 'eventos', 'scale', true, 2, NULL, '{"ruido", "paciencia"}'),
('Ordena al grupo entero según lo bien que bailan reggaetón hasta el que es un palo de madera.', 'eventos', 'ranking', true, 4, NULL, '{"baile", "meneo"}'),
('Dinos una canción que SIEMPRE logras colar en en las playlists colectivas.', 'eventos', 'free', true, 2, NULL, '{"musica", "spotify"}'),
('Cumples años en cuarentena obligatoria, ¿qué haces?', 'eventos', 'mc', true, 2, ARRAY['Monto un botellón virtual vía Zoom deprimente', 'Fingo que no es mi cumpleaños y lloro', 'Compro tarta masiva solo para mi', 'Obligo a mi familia a adorarme'], '{"cumpleaños", "crisis"}'),

-- FUTURO 🔮
('¿Quién se gastará sus ahorros en la enésima criptomonedas y se arruinará?', 'futuro', 'poll', true, 3, NULL, '{"criptos", "arruinados"}'),
('Del 1 al 10, ¿puntuación de cuánto piensas que trabajas para el futuro o vives al día?', 'futuro', 'scale', true, 2, NULL, '{"futuro", "finanzas"}'),
('Ordena de quién será el primero en tener un segundo hijo al último de todos nosotros.', 'futuro', 'ranking', true, 4, NULL, '{"hijos", "futuro"}'),
('¿Quién morirá rico pero muy muy solo, {member_A} o {member_B}?', 'futuro', 'vs', true, 2, NULL, '{"dinero", "soledad"}'),
('Si pudieras ver 5 minutos exactos del año 2035, ¿qué buscarías ver en Google?', 'futuro', 'free', true, 2, NULL, '{"maquina_tiempo", "busquedas"}'),
('En el mañana no hay agua en España, ¿qué beberemos?', 'futuro', 'mc', true, 2, ARRAY['Coca Cola rancia de contrabando', 'Agua de mar salada sin filtrar', 'Nuestra propia orina destilada a lo Bear Grylls', 'No beberemos, moriremos tristes'], '{"escasedad", "distopia"}'),

-- HIPOTETICAS 🧠
('¿Quién del grupo si se volviera invisible se pondría directamente a robar?', 'hipoteticas', 'poll', true, 3, NULL, '{"invisible", "robo"}'),
('Del 1 al 10, el pánico de despertar atrapado en Corea del Norte.', 'hipoteticas', 'scale', true, 2, NULL, '{"viajes", "panico"}'),
('Ordena de quién sobreviviría más en una película de slasher americano al que muere al abrir la puerta al inicio.', 'hipoteticas', 'ranking', true, 4, NULL, '{"slasher", "cine"}'),
('Si tuvieras que pelear a muerte contra 10 patos gigantes o 1 caballo de tamaño pato, ¿qué eliges?', 'hipoteticas', 'free', true, 2, NULL, '{"pelea", "animales"}'),
('¿A quién elegirías como compinche secreto de asesinatos, a {member_A} o a {member_B}?', 'hipoteticas', 'vs', true, 2, NULL, '{"crimen", "compinche"}'),
('Si despertaras mañana en el cuerpo de tu madre...', 'hipoteticas', 'mc', true, 2, ARRAY['Miro su cuenta del banco directo', 'Llamo a mis tías para el salseo máximo', 'Me vuelvo a dormir a ver si se arregla', 'Actúo natural para no asustar a nadie'], '{"cuerpos", "madre"}'),

-- VINCULOS 💛
('¿Quién del grupo te ha dado el mejor consejo de vida que aún aplicas?', 'vinculos', 'poll', true, 3, NULL, '{"consejos", "paternidad"}'),
('Del 1 al 10, puntúa lo rencoroso que sueles ser con los errores del grupo.', 'vinculos', 'scale', true, 2, NULL, '{"rencor", "amistad"}'),
('Escribe el recuerdo colectivo en el que todos lloramos o nos abrazamos mucho.', 'vinculos', 'free', true, 3, NULL, '{"recuerdos", "emocional"}'),
('Ordena desde la persona en la que ciegamente confias a morir a la que confias poco.', 'vinculos', 'ranking', true, 4, NULL, '{"confianza"}'),
('Si me casara este finde, el regalo que te compraría sería...', 'vinculos', 'mc', true, 2, ARRAY['Dinero suelto en un sobre por pereza', 'Un viaje pagado para ti', 'No compraría nada importante pero iría de gratis', 'Un set gourmet aburrido y generico'], '{"regalos", "bodas"}'),
('¿A quién preferirías que perdonen una deuda mortal, a {member_A} o a {member_B}?', 'vinculos', 'vs', true, 2, NULL, '{"sacrificio", "amistad"}')

-- Extra Mixed filler
,('¿A quién preferirías tener persiguiéndote para siempre: un caracol asesino indestructible o {member_A} en un día malo?', 'humor', 'vs', true, 2, NULL, '{"caracol", "asesinos"}')
,('¿Quién tarda menos de 10 segundos en perdonarte si haces algo fatal?', 'vinculos', 'poll', true, 3, NULL, '{"perdon", "rapidez"}')
,('Del 1 al 10, ¿lo mucho que te quejas del calor extremo verano?', 'humor', 'scale', true, 2, NULL, '{"clima", "quejas"}')
,('¿Si fueras Dios durante 10 minutos, a qué animal extinto devolverías a la vida?', 'hipoteticas', 'free', true, 2, NULL, '{"animales", "dios"}')
,('Ordena de más ruidoso masticando a insonoro.', 'humor', 'ranking', true, 4, NULL, '{"ruidos", "comida"}')
,('¿Prefieres vivir 100 años sin poder reír nunca o 2 años más pero súper hiperfeliz?', 'hipoteticas', 'mc', true, 2, ARRAY['100 años amargado y sin sonreir', 'Solo 2 años y morirme con la mejor sonrisa del mundo'], '{"dilema"}');
