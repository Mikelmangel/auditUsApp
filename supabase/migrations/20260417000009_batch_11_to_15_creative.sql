-- =====================================================
-- 20260417000009_batch_11_to_15_creative.sql
-- MVP Batches 11 a 15 - Full Creatividad Desatada
-- =====================================================

INSERT INTO public.questions (text, category, mode, is_active, min_members, options, tags) VALUES

-- HIPOTETICAS / SUPERVIVENCIA ABSURDA
('Si un hechicero malvado te obligara a escuchar la misma canción sin parar el resto de tu vida o perder un brazo, ¿qué canción eliges?', 'hipoteticas', 'free', true, 2, NULL, '{"canciones", "maldiciones"}'),
('Ordena al grupo entero según su probabilidad de unirse voluntariamente a una secta si les ofrecen Wi-Fi gratis y comida rica.', 'hipoteticas', 'ranking', true, 4, NULL, '{"sectas", "supervivencia"}'),
('Si nos quedásemos encerrados en un Ikea durante 5 años, ¿quién acabaría autoproclamándose Rey de los Muebles?', 'hipoteticas', 'poll', true, 3, NULL, '{"Ikea", "encierro"}'),
('Del 1 al 10, evalúa tus posibilidades hipotéticas de aterrizar un avión de pasajeros si el piloto y copiloto se desmayan mágicamente.', 'hipoteticas', 'scale', true, 2, NULL, '{"aviones", "panico"}'),
('¿A quién prefieres tener como presidente del gobierno del país, a {member_A} con poder absoluto o a {member_B} con un consejo de simios?', 'hipoteticas', 'vs', true, 3, NULL, '{"politica", "absurdo"}'),
('Imagina que eres un superhéroe cuyo poder es increíblemente específico e inútil para la lucha. ¿Cuál sería?', 'hipoteticas', 'mc', true, 2, ARRAY['Hacer que el pan tostado nunca caiga por el lado de la mantequilla', 'Saber siempre el WiFi de cualquier bar sin preguntar', 'Poder cambiar el canal de la tele solo con parpadear', 'Nunca mancharte la camisa cuando comes espaguetis'], '{"superpoderes", "inutilidad"}'),

-- HUMOR / SALSEO LIGERO
('¿Quién del grupo tardaría más en notar que todos nos hemos puesto de acuerdo para ignorarle durante 24 horas?', 'humor', 'poll', true, 3, NULL, '{"ignorar", "broma"}'),
('Del 1 al 10, ¿cuánto miedo te da que tu madre encuentre tu cuenta oculta de Twitter (o similar)?', 'humor', 'scale', true, 2, NULL, '{"redes", "familia"}'),
('Ordena al grupo de quién tiene la foto de perfil del DNI/pasaporte más favorecedora a quién parece un criminal buscado.', 'humor', 'ranking', true, 4, NULL, '{"fotos", "feudal"}'),
('Describe creativamente y en 5 palabras o menos el olor habitual de la habitación de tu adolescencia.', 'humor', 'free', true, 2, NULL, '{"olor", "adolescencia"}'),
('¿A quién escogerías para ir a comprarte ropa y cambiarte de estilo obligatoriamente, a {member_A} o a {member_B}?', 'humor', 'vs', true, 3, NULL, '{"ropa", "estilo"}'),
('Estás en el dentista y repentinamente te dice "Ups" mientras tienes la boca llena de herramientas. ¿Qué piensas reaccionar?', 'humor', 'mc', true, 2, ARRAY['Muerdo fuerte por instinto y le arranco un dedo', 'Lloro por dentro y asumo que moriré desangrado', 'Me levanto, escupo todo y huyo por la ventana', 'Pago 500 euros y no pregunto jamás qué ha pasado'], '{"dentista", "panico"}'),

-- ATREVIDAS / SECRETOS CRUDOS (is_anonymous = true via triggers)
('¿Quién del grupo dirías que suele revisar las "mejores amigas" (Close Friends) de la gente buscando validación?', 'atrevidas', 'poll', true, 3, NULL, '{"instagram", "validación"}'),
('Del 1 al 10, ¿lo mucho que secretamente disfrutas cuando el plan grupal se cancela porque a ti te daba pereza ir?', 'atrevidas', 'scale', true, 2, NULL, '{"pereza", "planes"}'),
('Confiesa un nombre ficticio y patético que le hayas puesto alguna vez a alguien en tus contactos de Whatsapp para disimular.', 'atrevidas', 'free', true, 3, NULL, '{"contactos", "secretos"}'),
('Ordena al grupo desde el miembro con el que tendrías un hijo en un mundo post-apocalíptico hasta con el que preferirías extinguirte.', 'atrevidas', 'ranking', true, 4, NULL, '{"hijos", "apocalipsis"}'),
('Si encontraras una bolsa con 50.000 euros en efectivo perdida de tu mejor amigo de la infancia...', 'atrevidas', 'mc', true, 2, ARRAY['Le doy 25.000 y digo que solo había la mitad', 'Se lo devuelvo todo por culpa cristiana', 'Me mudo de país sin decir ni adiós', 'Invierto el dinero y si sale mal lloro'], '{"dinero", "traicion"}'),
('¿Quién crees que usaría una IA para escribirle sus votos matrimoniales, {member_A} o {member_B}?', 'humor', 'vs', true, 2, NULL, '{"ia", "vagos"}'),

-- EVENTOS Y SOCIAL
('Organizamos un plan sorpresa de fin de semana súper caro. ¿Quién es el que intenta salirse diciendo que "ya tenía otro compromiso familiar falso"?', 'eventos', 'poll', true, 3, NULL, '{"excusas", "dinero"}'),
('Del 1 al 10, evalúa lo odioso que eres cuando tienes resaca el domingo y la gente a tu alrededor habla alto.', 'eventos', 'scale', true, 2, NULL, '{"resaca", "humor"}'),
('Cuenta qué fue lo  más extraño que presenciaste en una boda a la que fuiste invitado.', 'eventos', 'free', true, 2, NULL, '{"bodas", "bizarro"}'),
('Ordena al grupo entero según lo rápido que se cansan de socializar y piden un Uber a su casa (del que antes se va al que cierra bares).', 'eventos', 'ranking', true, 4, NULL, '{"fiesta", "cansancio"}'),
('Si te dejan elegir la temática obligatoria de nuestra próxima fiesta grupal en casa, ¿cuál impondrías tiránicamente?', 'eventos', 'mc', true, 2, ARRAY['Fiesta de pijamas tristes, todos obligados a llorar', 'Torneo nacional de Monopoly con sangre real y dinero de verdad', 'Fiesta "Vístete como nuestro peor ex"', 'Fiesta de 2 horas máximo, luego todos fuera de mi casa'], '{"fiestas", "imposiciones"}'),
('¿A quién prefieres sentar a tu lado en un vuelo transatlántico de 10 horas, a {member_A} que no para de hablar o a {member_B} que roba tu apoyabrazos?', 'eventos', 'vs', true, 3, NULL, '{"viajes", "molestias"}'),

-- FUTURO Y DISTOPÍAS
('¿Quién será el primero de nosotros en estar convencido de que la Tierra es plana tras ver tres documentales dudosos en YouTube?', 'futuro', 'poll', true, 3, NULL, '{"conspiraciones", "locura"}'),
('Del 1 al 10, ¿lo convencido que estás de que las máquinas tomarán tu trabajo en la próxima década?', 'futuro', 'scale', true, 2, NULL, '{"ia", "desempleo"}'),
('Escribe el epitafio que te gustaría tener en tu lápida en el año 2120.', 'futuro', 'free', true, 2, NULL, '{"epitafio", "muerte"}'),
('Ordena al grupo según quién será el más tacaño y gruñón cuando todos tengamos 75 años.', 'futuro', 'ranking', true, 4, NULL, '{"ancianos", "dinero"}'),
('En un futuro donde la comida real es ilegal y comemos píldoras grises, descubres tráfico de jamón serrano.', 'futuro', 'mc', true, 2, ARRAY['Denuncio a la policía para subir puntos de ciudadano', 'Me convierto en El Padrino de los embutidos clandestinos', 'Hago un asalto armado para probar un bocado', 'Lloro masticando mi píldora triste y paso de lios'], '{"comida", "futuro"}'),
('¿Quién es más probable que intente vender una colección nefasta de NFTs a sus amigos y arruinarlos, {member_A} o {member_B}?', 'futuro', 'vs', true, 2, NULL, '{"cripto", "estafas"}'),

-- HABILIDADES
('¿Quién de aquí sería el primero en morir si nos sueltan en la Antigua Roma sin tecnología?', 'habilidades', 'poll', true, 3, NULL, '{"historia", "supervivencia"}'),
('Del 1 al 10, tu nivel de habilidad para montar un mueble sueco sin mirar absolutamente nunca las instrucciones.', 'habilidades', 'scale', true, 2, NULL, '{"muebles", "orgullo"}'),
('¿Qué técnica milenaria o excusa barata usas para ganar desesperadamente una discusión cuando sabes positivamente que no tienes la razón?', 'habilidades', 'free', true, 2, NULL, '{"discusiones", "tecnicas"}'),
('Ordena de quién es mejor ocultando que ha bebido demasiado frente a la autoridad competente a quién se delata solo saludando.', 'habilidades', 'ranking', true, 4, NULL, '{"borrachos", "actuacion"}'),
('Tenemos que escapar de la cárcel del condado de máxima seguridad. ¿Cuál es tu papel esencial en la fuga?', 'habilidades', 'mc', true, 2, ARRAY['El genio maestro que hace el mapa tatuado en su espalda', 'El seductor que engaña a los guardias de la puerta', 'La fuerza bruta para picar paredes 10 años', 'El desgraciado descartable que servirá de distracción fatal'], '{"prision", "escape"}'),
('¿Quién miente mejor mirando fijamente al fondo de los ojos, {member_A} o {member_B}?', 'habilidades', 'vs', true, 2, NULL, '{"mentiras", "ojos"}'),

-- VÍNCULOS
('¿Quién del grupo es el que mejor sabe darte el espacio vital cuando realmente notas que quieres estar solo?', 'vinculos', 'poll', true, 3, NULL, '{"empatia", "espacio"}'),
('Del 1 al 10, ¿hasta qué punto confías en tu capacidad instintiva para saber cuándo un amigo de la sala está triste sin que diga nada?', 'vinculos', 'scale', true, 2, NULL, '{"intuicion", "empatia"}'),
('Nombra una "red flag" gigante de un miembro del grupo a la cual decidiste ignorar conscientemente por amor puro.', 'vinculos', 'free', true, 3, NULL, '{"redflags", "amistad"}'),
('Ordena a tus amigos aquí presentes desde al que le confiarías criar a tus hijos tras morir, hasta al que acabarían en la cárcel si lo hiciera.', 'vinculos', 'ranking', true, 4, NULL, '{"confianza", "hijos"}'),
('Dos amigos del grupo están peleados a muerte desde hace meses. ¿Cómo reaccionas ante ambos?', 'vinculos', 'mc', true, 2, ARRAY['Hago malabares imposibles fingiendo neutralidad en secreto con ambos', 'Escojo bando en 5 minutos en base a un chisme sin contexto', 'Los encierro juntos en una habitación y no abro hasta que corra sangre', 'Abandono a ambos para no absorber mal karma'], '{"peleas", "amigos"}')

-- Extra Filler Random
,('¿A quién preferirías confiarle las contraseñas de todos tus bancos en tu lecho de muerte, a {member_A} o a {member_B}?', 'vinculos', 'vs', true, 3, NULL, '{"bancos", "muerte"}')
,('Si nos persiguiese un león en el zoológico, ¿quién del grupo le pondría la zancadilla al resto para poder salvar su propia vida?', 'humor', 'poll', true, 3, NULL, '{"traicion", "supervivencia"}')
,('Ordena a la gente de este grupo de la más derrochadora a la más rata parda con el dinero grupal.', 'habilidades', 'ranking', true, 4, NULL, '{"dinero", "finanzas"}')
,('¿Quién crees sinceramente que ganaría una pelea a muerte en el barro pero con traje de gala, {member_A} o {member_B}?', 'hipoteticas', 'vs', true, 2, NULL, '{"pelea", "barro"}');
