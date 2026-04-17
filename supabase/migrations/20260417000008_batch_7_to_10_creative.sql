-- =====================================================
-- 20260417000008_batch_7_to_10_creative.sql
-- MVP Batches 7 a 10 - 100% Custom y Creatividad Pura
-- =====================================================

INSERT INTO public.questions (text, category, mode, is_active, min_members, options, tags) VALUES

-- HIPOTETICAS / ABSURDO COMPLETO
('Si tuvieras que defenderte de un ataque alienígena usando solo objetos de tu cuarto, ¿quién de nosotros moriría primero?', 'hipoteticas', 'poll', true, 3, NULL, '{"aliens", "defensa"}'),
('Imagina que eres un NPC (personaje no jugable) en un videojuego, ¿cuál sería tu frase repetitiva?', 'hipoteticas', 'free', true, 2, NULL, '{"gaming", "npc"}'),
('¿Qué harías si te levantas un día y descubres que entiendes lo que dicen los perros pero ellos son extremadamente maleducados?', 'hipoteticas', 'mc', true, 2, ARRAY['Insultarles yo también en su idioma', 'Irme a vivir con los gatos', 'Ignorar a todos los perros del mundo', 'Buscarme la vida dando terapia canina'], '{"perros", "animales"}'),
('Del 1 al 10, evalúa lo rápido que perderías la cabeza si te prohibieran usar emojis para siempre.', 'hipoteticas', 'scale', true, 2, NULL, '{"emojis", "locura"}'),
('Ordena al grupo entero según lo bien que sobrevivirían siendo monjes budistas aislados en una montaña.', 'hipoteticas', 'ranking', true, 4, NULL, '{"monjes", "aislamiento"}'),
('Si tuviéramos que elegir a alguien del grupo para infiltrarse en un cartel de la mafia, ¿a quién mandamos?', 'hipoteticas', 'poll', true, 3, NULL, '{"mafia", "infiltrados"}'),
('¿A quién elegirías para que te acompañe a investigar ruidos extraños en un bosque de noche, a {member_A} o a {member_B}?', 'hipoteticas', 'vs', true, 3, NULL, '{"miedo", "bosque"}'),

-- HUMOR CÍNICO
('¿Quién es capaz de soltar un "Te lo dije" en pleno funeral de forma inapropiada?', 'humor', 'poll', true, 3, NULL, '{"cinismo", "funeral"}'),
('Del 1 al 10, ¿lo mucho que te disgusta la gente que aplaude cuando el avión aterriza?', 'humor', 'scale', true, 2, NULL, '{"aviones", "manias"}'),
('Cuenta la peor compra basura que has hecho por Amazon de madrugada.', 'humor', 'free', true, 2, NULL, '{"compras", "amazon"}'),
('Ordena al grupo desde el que tiene el humor más negro y sucio al más políticamente correcto.', 'humor', 'ranking', true, 4, NULL, '{"humor_negro", "correccion"}'),
('Si de repente nos patrocinara Red Bull, ¿qué evento estúpido nos harían hacer en directo?', 'humor', 'mc', true, 2, ARRAY['Saltar de un puente atados con goma de mascar', 'Conducir un carrito de supermercado por un barranco', 'Volar disfrazados de pollo usando petardos', 'Pelea de barro en gravedad cero'], '{"locuras", "redbull"}'),
('¿Quién hace la peor cara de asco cuando le ofrecen un cubata barato, {member_A} o {member_B}?', 'humor', 'vs', true, 2, NULL, '{"alcohol", "sibaritas"}'),

-- ATREVIDAS Y SECRETOS (is_anonymous = true en trigger)
('¿Quién del grupo crees que tiene la fantasía de ser mantenido/a por un sugar daddy o sugar mommy?', 'atrevidas', 'poll', true, 3, NULL, '{"sugar", "dinero"}'),
('Del 1 al 10, ¿cuánta guerra sucia crees que hiciste para ligarte a tu última pareja o ligue?', 'atrevidas', 'scale', true, 2, NULL, '{"ligar", "estrategia"}'),
('Confiesa una opinión horriblemente superficial que tienes sobre el aspecto físico que no quieres admitir en público.', 'atrevidas', 'free', true, 3, NULL, '{"superficial", "confesiones"}'),
('Ordena de quién es el más experto ocultando relaciones secretas al más bocazas.', 'atrevidas', 'ranking', true, 4, NULL, '{"secretos", "amor"}'),
('Si encontraras el diario personal de uno de nosotros en la mesa abierto, ¿lo leerías?', 'atrevidas', 'mc', true, 2, ARRAY['¡Obvio, quiero todo el chisme!', 'Solo leo la página que está abierta', 'Cierro el diario por respeto inmediatamente', 'Lo guardo y le chantajeo'], '{"diario", "etica"}'),
('¿Quién es más probable que termine teniendo una aventura amorosa escondida en la oficina, {member_A} o {member_B}?', 'atrevidas', 'vs', true, 2, NULL, '{"oficina", "engaños"}'),

-- VINCULOS DE AMISTAD 
('¿Quién de nosotros sería el más probable en donar un riñón para salvar a otro del grupo?', 'vinculos', 'poll', true, 3, NULL, '{"amistad", "sacrificio"}'),
('Del 1 al 10, ¿cuánto crees que valoras la amistad real por encima del éxito profesional en tu vida?', 'vinculos', 'scale', true, 2, NULL, '{"valores", "vida"}'),
('Nombra una vez en la que {member_A} te haya salvado la vida (literal o metafóricamente) sin darse cuenta.', 'vinculos', 'free', true, 3, NULL, '{"profundo", "gracias"}'),
('Ordena de quién da los abrazos más cálidos a quién te abraza como si fueras un puercoespín.', 'vinculos', 'ranking', true, 4, NULL, '{"abrazos", "fisico"}'),
('Si tu coche se queda tirado a 300 kilómetros de casa un martes, ¿a quién del grupo vas a intentar despertar?', 'vinculos', 'mc', true, 2, ARRAY['Llamo a la grúa, paso de molestar', 'A cualquiera de aquí a ver si suena la flauta', 'Llamo directo al del grupo que tenga un coche fiable', 'Duermo en el coche y ya si eso mañana soluciono'], '{"emergencias", "amistad"}'),
('¿Quién es mejor recordando pequeños detalles de las historias que le cuentas, {member_A} o {member_B}?', 'vinculos', 'vs', true, 2, NULL, '{"memoria", "escuchar"}'),

-- HABILIDADES EXTREMAS
('¿Quién de nosotros duraría menos en La Isla de las Tentaciones sin liarla parda?', 'habilidades', 'poll', true, 3, NULL, '{"tv", "tentaciones"}'),
('Del 1 al 10, tu capacidad para soportar un vídeo ASMR de gente masticando sin estallar de rabia.', 'habilidades', 'scale', true, 2, NULL, '{"asmr", "misofonia"}'),
('Dinos tu estrategia exacta para salir victorioso si hay un 2x1 furioso en las rebajas del Zara.', 'habilidades', 'free', true, 2, NULL, '{"rebajas", "estrategia"}'),
('Ordena al grupo entero desde el que es un conductor de rally profesional a la amenaza pública al volante.', 'habilidades', 'ranking', true, 4, NULL, '{"coches", "manejar"}'),
('Si te enfrentas a un cocodrilo en un pantano ciego, ¿con qué te defiendes?', 'habilidades', 'mc', true, 2, ARRAY['Lo amenazo con mi bolso de piel sintética', 'Grito con fuerza para intimidar', 'Hago la estatua a ver si no me huele', 'Le pego un puñetazo en el morro a la desesperada'], '{"cocodrilos", "supervivencia"}'),
('¿Quién es capaz de escribir por el móvil más rápido sin mirar la pantalla, {member_A} o {member_B}?', 'habilidades', 'vs', true, 2, NULL, '{"velocidad", "movil"}'),

-- FUTURO INCIERTO
('¿Quién del grupo acabará creyendo fervientemente en la astrología profunda o en las energías cósmicas dentro de 10 años?', 'futuro', 'poll', true, 3, NULL, '{"astrologia", "creencias"}'),
('Del 1 al 10, ¿las ganas que tienes de que llegue el día en el que todos usemos coches voladores?', 'futuro', 'scale', true, 2, NULL, '{"coches_voladores"}'),
('Dinos una moda actual que dentro de veinte años la gente verá como algo súper cringe.', 'futuro', 'free', true, 2, NULL, '{"modas", "cringe"}'),
('Ordena de quién se tatuará antes un nombre del que se arrepienta en 5 años a quién jamás se tatuará.', 'futuro', 'ranking', true, 4, NULL, '{"tatuajes", "arrepentimiento"}'),
('En 2050, el dinero ya no vale nada. ¿Qué utilizaríamos en nuestro grupo como moneda de cambio principal?', 'futuro', 'mc', true, 2, ARRAY['Memes impresos en papel brillante', 'Nudes criptográficos', 'Tapas de cerveza recicladas', 'Favores de transporte'], '{"dinero", "distopia"}'),
('¿Quién se quedará sordo antes por escuchar música técnica al máximo en los cascos, {member_A} o {member_B}?', 'futuro', 'vs', true, 2, NULL, '{"musica", "consecuencias"}'),

-- EVENTOS DESASTRE 
('¿Quién es el mítico miembro del grupo que aparece a una barbacoa y no trae absolutamente nada para aportar?', 'eventos', 'poll', true, 3, NULL, '{"barbacoa", "gorrones"}'),
('Del 1 al 10, ¿cuánto odias tener que ser tú siempre el que organiza cuándo y dónde quedamos?', 'eventos', 'scale', true, 2, NULL, '{"organizar", "quejas"}'),
('¿Qué pasaría en una cena familiar tuya si un día llevas a alguien que conociste el día antes como si fuera tu pareja de 3 años?', 'eventos', 'free', true, 2, NULL, '{"familia", "mentiras"}'),
('Ordena al grupo entero de mejor a peor en mantener una cara seria cuando otro está siendo regañado.', 'eventos', 'ranking', true, 4, NULL, '{"seriedad", "risa"}'),
('Vamos a un festival e improvisamente empieza a llover torrencialmente. ¿Cúal es tu reacción instintiva?', 'eventos', 'mc', true, 2, ARRAY['Me quito la camiseta y me baño en barro', 'Pillo el primer taxi que vea y me largo del país', 'Lloro por el dineral tirado en mi outfit nuevo', 'Me compro un poncho a 20 euros a un vendedor dudoso'], '{"lluvia", "festivales"}'),
('¿A quién preferirías organizar su despedida de soltero por su alta flexibilidad, a {member_A} o a {member_B}?', 'eventos', 'vs', true, 3, NULL, '{"despedidas", "organizar"}');
