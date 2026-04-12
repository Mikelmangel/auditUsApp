-- Banco de Preguntas Dinámicas AuditUs
-- Se insertan diferentes tipos de encuestas (pool, vs, boolean) usando placeholders ({member_A}, {member_B}, {group_name})

INSERT INTO public.questions (text, poll_type, category, language, min_members) VALUES
-- TIPO POOL (Elige a un miembro de todo el grupo) ----------
('¿Quién de {group_name} sobreviviría primero en un apocalipsis zombie?', 'pool', 'survival', 'es', 2),
('¿Quién es el más probable que se case antes?', 'pool', 'romance', 'es', 2),
('Si {group_name} atracara un banco, ¿quién sería el cerebro de la operación?', 'pool', 'skills', 'es', 3),
('¿Quién acabaría millonario pero volvería a arruinarse en una semana?', 'pool', 'money', 'es', 2),
('¿Quién tiene más probabilidades de olvidar el cumpleaños de su madre?', 'pool', 'social', 'es', 2),
('¿Quién se colaría en una boda de famosos sin que le pillen?', 'pool', 'adventure', 'es', 2),
('¿Quién sería el peor compañero de piso de {group_name}?', 'pool', 'social', 'es', 2),
('¿Quién es más propenso/a a contestar un mensaje a las de 3 semanas diciendo "jaja sí"?', 'pool', 'social', 'es', 2),
('¿A quién le confiarías las contraseñas de tus redes sociales?', 'pool', 'deep', 'es', 2),
('¿Quién tiene el historial de búsquedas de Google más perturbador?', 'pool', 'humor', 'es', 2),
('Si tuviéramos que formar una secta en {group_name}, ¿quién sería el líder supremo?', 'pool', 'group_dynamics', 'es', 3),
('¿Quién fingiría su propia muerte para evitar ir a trabajar?', 'pool', 'humor', 'es', 2),
('¿Quién sería la primera víctima en una película de terror?', 'pool', 'survival', 'es', 2),
('¿Quién ganaría un concurso de beber la mayor cantidad de cerveza en 5 minutos?', 'pool', 'skills', 'es', 2),
('¿Quién es el más probable a acabar en una relación tóxica (de nuevo)?', 'pool', 'romance', 'es', 2),

-- TIPO VS (Solo {member_A} vs {member_B}) ----------
('Pelea a muerte en un callejón sin armas: ¿{member_A} o {member_B}?', 'vs', 'vs_challenge', 'es', 2),
('¿A quién le prestarías dinero si supieras que NUNCA te lo va a devolver: a {member_A} o a {member_B}?', 'vs', 'money', 'es', 2),
('¿Quién tardará más en independizarse: {member_A} o {member_B}?', 'vs', 'social', 'es', 2),
('Si pudieras borrar el pasado de uno de los dos: ¿{member_A} o {member_B}?', 'vs', 'deep', 'es', 2),
('¿Quién miente con más naturalidad: {member_A} o {member_B}?', 'vs', 'skills', 'es', 2),
('¿Quién aguantaría más tiempo viviendo en un bosque de forma salvaje: {member_A} o {member_B}?', 'vs', 'survival', 'es', 2),
('Duelo de baile bochornoso en público: ¿Quién da más vergüenza ajena, {member_A} o {member_B}?', 'vs', 'vs_challenge', 'es', 2),
('Si el barco se hunde en medio del océano: ¿Salvas a {member_A} o a {member_B}?', 'vs', 'deep', 'es', 2),
('¿Quién sería mejor presidente de la nación o alcalde: {member_A} o {member_B}?', 'vs', 'group_dynamics', 'es', 2),
('¿De quién crees que te podrias enamorar más fácil si no lo conocieras: de {member_A} o de {member_B}?', 'vs', 'romance', 'es', 2),

-- TIPO BOOLEAN (Es / No es) - Usamos pool en base de datos pero el texto de la pregunta genera un sí/no ----------
-- (Nota: Para encuestas de tipo boolean, la UI genera los botones Sí/No y el ID objetivo es el perfil en sí de la victima)
('¿Pensáis sincéramente que {member_A} tiene un lado narcisista oculto?', 'pool', 'deep', 'es', 2),
('¿Lloraría {member_A} si tiene que dormir solo/a en medio de un cementerio una noche entera?', 'pool', 'survival', 'es', 2),
('¿Sería {member_A} capaz de gastarse todos sus ahorros en un casino en menos de dos horas?', 'pool', 'money', 'es', 2),
('Con la mano en el corazón: ¿Crees que {member_A} ha tenido envidia alguna vez en secreto de {member_B}?', 'pool', 'group_dynamics', 'es', 2),
('¿Crees que {member_A} dejaría tirado/a a {member_B} si le ofrecen a cambio un millón de euros?', 'pool', 'money', 'es', 2),
('¿Podría {member_A} ganar en una pelea callejera con un mapache salvaje furioso?', 'pool', 'humor', 'es', 2),
('¿Te atreverías a dejar tu mochila abierta, con tu móvil sin bloquear, sola con {member_A}?', 'pool', 'social', 'es', 2),

-- TIPO RANKED (Todos contra todos, estilo "Elige") ----------
('Elige a la persona con el mejor sentido del humor de {group_name}', 'pool', 'humor', 'es', 3),
('Elige al que peor viste de {group_name}', 'pool', 'social', 'es', 3),
('¿Quién tiene peor gusto musical en {group_name} con diferencia?', 'pool', 'social', 'es', 3),
('¿Quién de aquí sería el villano traidor al final de una película de acción?', 'pool', 'adventure', 'es', 3),
('¿Quién ganaría El Juego del Calamar si participase todo {group_name}?', 'pool', 'survival', 'es', 3),
('¿Quién es el que más se queja por el grupo de WhatsApp?', 'pool', 'social', 'es', 3),
('Si cayera una bomba atómica, ¿quién sería el primero en salir corriendo y esconderse solo?', 'pool', 'survival', 'es', 3),
('¿Quién es el "Papá" o la "Mamá" técnica oficial de {group_name}?', 'pool', 'group_dynamics', 'es', 3),

-- MÁS PREGUNTAS SURTIDAS ----------
('¿Quién sería arrestado por piratería informática?', 'pool', 'skills', 'es', 2),
('¿A quién acudirías para esconder un cadáver sin que te hiciera un montón de preguntas incómodas?', 'pool', 'adventure', 'es', 2),
('¿Quién pasaría más vergüenza intentando encender una barbacoa y quemando las salchichas delante de todo {group_name}?', 'pool', 'humor', 'es', 2),
('¿Quién tiene o tendría el Instagram de su perro más cuidado que el suyo propio?', 'pool', 'social', 'es', 2),
('Misterio de Asesinato: ¿{member_A} es el asesino o lo es {member_B}?', 'vs', 'vs_challenge', 'es', 2),
('¿Si le quitaran el internet un mes, quién de aquí perdería la cabeza primero?', 'pool', 'survival', 'es', 2)
ON CONFLICT DO NOTHING;
