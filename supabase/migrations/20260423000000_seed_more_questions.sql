-- 20260423000000_seed_more_questions.sql
-- 150+ preguntas nuevas (total ~250+ con las existentes)
-- Categorías: humor, habilidades, futuro, atrevidas, hipoteticas, vinculos, eventos, ia_custom
-- Modos: vs, poll, mc, scale, free, ranking, boolean, pool

-- ── 😂 HUMOR ──────────────────────────────────────────────────────────────────

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, tags) VALUES
('{member_A} vs {member_B}: ¿Quién sobreviviría menos tiempo en un festival de música sin agua?', 'vs', 'humor', NULL, false, 2, ARRAY['😂']),
('¿Quién del grupo mandaría un audio de 5 minutos a las 3AM solo para decir "nada"?', 'poll', 'humor', NULL, false, 2, ARRAY['😂']),
('¿Cuál es la confesión más absurda que {member_A} ha dado en una primera cita?', 'mc', 'humor', ARRAY['Que su comida favorita es cereal con agua', 'Que tiene un peluche de su ex', 'Que fuma solo en el coche', 'Que duerme con la luz encendida'], false, 2, ARRAY['😂']),
('{member_A} vs {member_B}: ¿Quién lloraría viendo una serie sobre perros robot?', 'vs', 'humor', NULL, false, 2, ARRAY['😂']),
('¿Quién usaría un disfraz ridículo solo para evitar una conversación?', 'poll', 'humor', NULL, false, 2, ARRAY['😂']),
('¿Qué haría {member_A} si despertara y todos en su casa tuviesen la misma canción como tono de llamada?', 'mc', 'humor', ARRAY['Grabar un documental sobre ello', 'Cambiar de casa inmediatamente', 'Poner la canción como himno familiar', 'Huir corriendo del país'], false, 2, ARRAY['😂']),
('{member_A} vs {member_B}: ¿Quién gastaría 200€ en un viaje solo para probar la comida de un restaurante específico?', 'vs', 'humor', NULL, false, 2, ARRAY['😂']),
('¿Quién del grupo sería incapaz de tirar una moneda y no intentar recuperarla del suelo?', 'poll', 'humor', NULL, false, 2, ARRAY['😂']),
('¿Cuál sería el título de la película de la vida de {member_A}?', 'mc', 'humor', ARRAY['Mañana será peor', 'Objetivo: sobrevivir', 'De cero a meme en 3 segundos', 'Lo intenté, fallé, me rendí'], false, 2, ARRAY['😂']),
('{member_A} vs {member_B}: ¿Quién olvidaría su propio nombre bajo presión?', 'vs', 'humor', NULL, false, 2, ARRAY['😂']),
('¿Quién del grupo tiene la playlist más caótica imaginable?', 'poll', 'humor', NULL, false, 2, ARRAY['😂']),
('¿Qué accesorio nunca faltaría en el outfit de {member_A} aunque no pegue con nada?', 'mc', 'humor', ARRAY['Gafas de sol indoors', 'Un gorro de marinero', 'Zapatillas de vestir con calcetines', 'Una bufanda en pleno julio'], false, 2, ARRAY['😂']),
('{member_A} vs {member_B}: ¿Quién escribiría un email de dimisión por WhatsApp?', 'vs', 'humor', NULL, false, 2, ARRAY['😂']),
('¿Quién tardaría más de 30 segundos en abrir un frasco de mermelada?', 'poll', 'humor', NULL, false, 2, ARRAY['😂']),
('¿Cuál sería la habilidad menos útil que {member_A} dominaría en un reality de supervivencia?', 'mc', 'humor', ARRAY['Hacer nudos decorativos', 'Memorizar diálogos de Friends', 'Planchar con una tapa', 'Cantar el tiempo en 12 idiomas'], false, 2, ARRAY['😂']),
('{member_A} vs {member_B}: ¿Quién sería el primero en rendirse en un escape room?', 'vs', 'humor', NULL, false, 2, ARRAY['😂']),
('¿Quién del grupo tiene la peor suerte con los vecinos ruidosos?', 'poll', 'humor', NULL, false, 2, ARRAY['😂']),
('¿Qué haría {member_A} si su perro le respondiera con frases completas un día?', 'mc', 'humor', ARRAY['Llamar a un canal de YouTube', 'Huir de casa', 'Grabar un podcast canino', 'Fingir que no pasa nada'], false, 2, ARRAY['😂']),
('{member_A} vs {member_B}: ¿Quién mezclaría café con ketchup "por probar"?', 'vs', 'humor', NULL, false, 2, ARRAY['😂']),
('¿Quién pediría instrucciones en vez de usar el GPS aunque estuviera perdido?', 'poll', 'humor', NULL, false, 2, ARRAY['😂']);

-- ── 💪 HABILIDADES ────────────────────────────────────────────────────────────

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, tags) VALUES
('¿Qué tan buena es {member_A} planificando viajes sin improvisar nada? (1-10)', 'scale', 'habilidades', NULL, false, 2, ARRAY['💪']),
('Ordena al grupo de MAYOR a MENOR capacidad para assembly de muebles sin manuales.', 'ranking', 'habilidades', NULL, false, 4, ARRAY['💪']),
('{member_A} vs {member_B}: ¿Quién sobreviviría haciendo un discurso sin papel en 5 minutos?', 'vs', 'habilidades', NULL, false, 2, ARRAY['💪']),
('Del 1 al 10, ¿cuánto aguanta la paciencia de {member_A} con tareas administrativas?', 'scale', 'habilidades', NULL, false, 2, ARRAY['💪']),
('{member_A} vs {member_B}: ¿Quién ganaría en un concurso de cocina con un libro de recetas y 1 hora?', 'vs', 'habilidades', NULL, false, 2, ARRAY['💪']),
('Ordena al grupo según quién sería mejor guía turístico improvisado.', 'ranking', 'habilidades', NULL, false, 4, ARRAY['💪']),
('¿Qué tan bueno es {member_A} manteniendo un secreto durante más de una semana? (1-10)', 'scale', 'habilidades', NULL, false, 2, ARRAY['💪']),
('{member_A} vs {member_B}: ¿Quién sería mejor bailarín de fiesta improvisada?', 'vs', 'habilidades', NULL, false, 2, ARRAY['💪']),
('Ordena de MEJOR a PEOR en hacer amigos en 5 minutos en un evento nuevo.', 'ranking', 'habilidades', NULL, false, 4, ARRAY['💪']),
('{member_A} vs {member_B}: ¿Quién manejaría mejor una crisis financiera personal?', 'vs', 'habilidades', NULL, false, 2, ARRAY['💪']),
('Del 1 al 10, ¿qué tan bien negocia {member_A} cuando compra algo caro?', 'scale', 'habilidades', NULL, false, 2, ARRAY['💪']),
('{member_A} vs {member_B}: ¿Quién sería mejor enfermero de emergencia en un viaje?', 'vs', 'habilidades', NULL, false, 2, ARRAY['💪']),
('Ordena al grupo según capacidad para dormir en un sitio incómodo.', 'ranking', 'habilidades', NULL, false, 4, ARRAY['💪']),
('¿Qué tan organizada tiene {member_A} la bandeja de entrada del móvil? (1-10)', 'scale', 'habilidades', NULL, false, 2, ARRAY['💪']),
('{member_A} vs {member_B}: ¿Quién arreglaría un grifo goteando antes de que alguien más lo note?', 'vs', 'habilidades', NULL, false, 2, ARRAY['💪']),
('Ordena de MAYOR a MENOR habilidad para aprender un idioma en 3 meses.', 'ranking', 'habilidades', NULL, false, 4, ARRAY['💪']),
('{member_A} vs {member_B}: ¿Quién ganaría en un debate sobre un tema random que no controla?', 'vs', 'habilidades', NULL, false, 2, ARRAY['💪']),
('Del 1 al 10, ¿qué tan rápidamente resuelve {member_A} problemas técnicos?', 'scale', 'habilidades', NULL, false, 2, ARRAY['💪']),
('Ordena al grupo según capacidad para mantener la calma en un atasco.', 'ranking', 'habilidades', NULL, false, 4, ARRAY['💪']),
('{member_A} vs {member_B}: ¿Quién sería mejor DJ en una fiesta sin Ensayar?', 'vs', 'habilidades', NULL, false, 2, ARRAY['💪']);

-- ── 🔮 FUTURO ─────────────────────────────────────────────────────────────────

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, tags) VALUES
('{member_A} vs {member_B}: ¿Quién vivirá en otro país antes de los 40?', 'vs', 'futuro', NULL, false, 2, ARRAY['🔮']),
('¿Quién del grupo tendrá hijos (o más hijos) primero?', 'poll', 'futuro', NULL, false, 2, ARRAY['🔮']),
('{member_A} vs {member_B}: ¿Quién se comprará un coche que no necesita?', 'vs', 'futuro', NULL, false, 2, ARRAY['🔮']),
('¿Quién será el primero en jubilarse anticipadamente?', 'poll', 'futuro', NULL, false, 2, ARRAY['🔮']),
('{member_A} vs {member_B}: ¿Quién escribirá un libro autobiográfico algún día?', 'vs', 'futuro', NULL, false, 2, ARRAY['🔮']),
('¿Quién del grupo se someterá a una cirugía estética sin necesidad médica?', 'poll', 'futuro', NULL, false, 2, ARRAY['🔮']),
('{member_A} vs {member_B}: ¿Quién tendrá una mansión antes de jubilarse?', 'vs', 'futuro', NULL, false, 2, ARRAY['🔮']),
('¿Quién será mencionado en medios de comunicación algún día?', 'poll', 'futuro', NULL, false, 2, ARRAY['🔮']),
('{member_A} vs {member_B}: ¿Quién se convertirá en influencer por accidente?', 'vs', 'futuro', NULL, false, 2, ARRAY['🔮']),
('¿Quién del grupo vivirá en una casa inteligente completa en 10 años?', 'poll', 'futuro', NULL, false, 2, ARRAY['🔮']),
('{member_A} vs {member_B}: ¿Quién adoptará un animal exótico antes de los 50?', 'vs', 'futuro', NULL, false, 2, ARRAY['🔮']),
('¿Quién del grupo renunciará a su trabajo para emprender sin plan B?', 'poll', 'futuro', NULL, false, 2, ARRAY['🔮']),
('{member_A} vs {member_B}: ¿Quién tendrá una historia de amor que dará que hablar?', 'vs', 'futuro', NULL, false, 2, ARRAY['🔮']),
('¿Quién se hará famoso/a por algo completamente inesperado?', 'poll', 'futuro', NULL, false, 2, ARRAY['🔮']),
('{member_A} vs {member_B}: ¿Quién vivirá más de 90 años?', 'vs', 'futuro', NULL, false, 2, ARRAY['🔮']),
('¿Quién del grupo tendrá un jardín hidropónico en su apartamento?', 'poll', 'futuro', NULL, false, 2, ARRAY['🔮']),
('{member_A} vs {member_B}: ¿Quién creará una aplicación que se vuelva viral?', 'vs', 'futuro', NULL, false, 2, ARRAY['🔮']),
('¿Quién será el primero en instalar paneles solares en su casa?', 'poll', 'futuro', NULL, false, 2, ARRAY['🔮']),
('{member_A} vs {member_B}: ¿Quién aparecerá en un documental sobre sus propios logros?', 'vs', 'futuro', NULL, false, 2, ARRAY['🔮']),
('¿Quién del grupo ganará un concurso donde no esperaba participar?', 'poll', 'futuro', NULL, false, 2, ARRAY['🔮']);

-- ── 🌶️ ATREVIDAS (anonymous) ──────────────────────────────────────────────────

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, tags) VALUES
('{member_A} vs {member_B}: ¿A quién le has mentido más veces sin que lo descubriera?', 'vs', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('Confiesa algo que nunca admitirías en voz alta.', 'free', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('{member_A} vs {member_B}: ¿Quién ha sentido celos de algo ridículo recentemente?', 'vs', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('¿Cuál es tu mayor miedo que nadie de aquí sepa?', 'free', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('{member_A} vs {member_B}: ¿Quién ha sentido atracción por alguien incompatible completamente?', 'vs', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('¿Qué harías si encontraras 500€ en un billete en la calle y nadie te viera?', 'free', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('{member_A} vs {member_B}: ¿Quién es más probable que haya espiado a su/su ex en redes?', 'vs', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('¿Alguna vez has fingido no ver a alguien para evitar saludar?', 'free', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('{member_A} vs {member_B}: ¿Quién ha dicho "te quiero" sin sentirlo realmente?', 'vs', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('¿Cuál es el secreto que guardarías incluso bajo tortura?', 'free', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('{member_A} vs {member_B}: ¿Quién ha sentido envidia de un amigo cercano por algo material?', 'vs', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('¿Qué comida has mezclado que nadie sabe y es un crimen culinario?', 'free', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('{member_A} vs {member_B}: ¿Quién es más probable que haya hecho algo ilegal por error?', 'vs', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('¿Cuál es la última mentira que le dijiste a tus padres?', 'free', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('{member_A} vs {member_B}: ¿Quién del grupo ha tenido un encuentro cercano que no contó?', 'vs', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('¿Qué es lo más oscuro que has buscado en internet a las 2AM?', 'free', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('{member_A} vs {member_B}: ¿Quién ha hecho algo vergonzoso por presión social?', 'vs', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('¿A quién del grupo le has guardado rencor y nunca se lo has dicho?', 'free', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('{member_A} vs {member_B}: ¿Quién cree que su vida amorosa sería un desastre en Netflix?', 'vs', 'atrevidas', NULL, true, 2, ARRAY['🌶️']),
('¿Cuál es tu opinión más impopular sobre algo que todos parecen pensar diferente?', 'free', 'atrevidas', NULL, true, 2, ARRAY['🌶️']);

-- ── 🧠 HIPOTÉTICAS ────────────────────────────────────────────────────────────

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, tags) VALUES
('{member_A} vs {member_B}: ¿Quién sobreviviría 1 mes en una isla con un gato y 3 libros?', 'vs', 'hipoteticas', NULL, false, 2, ARRAY['🧠']),
('Si pudieras borrar una emoción de tu vida para siempre, ¿cuál elegirías?', 'mc', 'hipoteticas', ARRAY['La tristeza', 'El miedo', 'La envidia', 'La vergüenza'], false, 2, ARRAY['🧠']),
('¿Qué haría {member_A} si pudiera comunicarse solo con emojis durante una semana?', 'mc', 'hipoteticas', ARRAY['Lo intentaría 2 días y renunciaría', 'Lo haría todo el mes por aburrimiento', 'Lo usaría para troll a sus amigos', 'Lo adoptaría como lenguaje oficial'], false, 2, ARRAY['🧠']),
('{member_A} vs {member_B}: ¿Quién sería el último humano en morir en un apocalipsis zombie?', 'vs', 'hipoteticas', NULL, false, 2, ARRAY['🧠']),
('Si pudieras vivir un día en el cuerpo de alguien del grupo, ¿quién elegirías y por qué?', 'free', 'hipoteticas', NULL, false, 2, ARRAY['🧠']),
('¿Qué的想法 tendrías si despertaras y pudieras aprender cualquier habilidad instantáneamente?', 'mc', 'hipoteticas', ARRAY['Dominar piano en un día', 'Hablar 10 idiomas fluidamente', 'Cocinar como un chef Michelin', 'Luchar como artista marcial'], false, 2, ARRAY['🧠']),
('{member_A} vs {member_B}: ¿Quién sería el primero en explorar un planeta nuevo?', 'vs', 'hipoteticas', NULL, false, 2, ARRAY['🧠']),
('¿Qué harías si tu mejor amigo se convirtiera en tu enemigo por una pelea absurda?', 'free', 'hipoteticas', NULL, false, 2, ARRAY['🧠']),
('Si el tiempo se pudiera manipular, ¿qué momento pasado te gustaría revivir?', 'mc', 'hipoteticas', ARRAY['Un día perfecto sin razón', 'Un momento que no aprovechaste', 'Un momento de risa con amigos', 'Un momento que cambió todo'], false, 2, ARRAY['🧠']),
('{member_A} vs {member_B}: ¿Quién sería el mejor espía en una reunión de adultos aburridos?', 'vs', 'hipoteticas', NULL, false, 2, ARRAY['🧠']),
('¿Qué harías si pudieras hacerte invisible por 24 horas?', 'free', 'hipoteticas', NULL, false, 2, ARRAY['🧠']),
('{member_A} vs {member_B}: ¿Quién ganaría en un juego de estrategia contra un genio?', 'vs', 'hipoteticas', NULL, false, 2, ARRAY['🧠']),
('Si pudieras tener una conversación de 1 hora con tu yo de 10 años, ¿qué le dirías?', 'mc', 'hipoteticas', ARRAY['Invierte en acciones tecnológicas', 'Sé más valiente con tus amigos', 'Los problemas pequeños no importan', 'Disfruta más sin culpa'], false, 2, ARRAY['🧠']),
('{member_A} vs {member_B}: ¿Quién sería el primero en rendirse en un juego de rol realista?', 'vs', 'hipoteticas', NULL, false, 2, ARRAY['🧠']),
('Si pudieras elegir ser el personaje de cualquier película por una semana, ¿cuál serías?', 'free', 'hipoteticas', NULL, false, 2, ARRAY['🧠']),
('{member_A} vs {member_B}: ¿Quién sobreviviría en un reality donde nadie puede dormir?', 'vs', 'hipoteticas', NULL, false, 2, ARRAY['🧠']),
('¿Qué harías si encontraras un portal a cualquier momento histórico?', 'mc', 'hipoteticas', ARRAY['Ir a ver a dinosaurios', 'Asistir a un concierto legendario', 'Conocer a alguna civilización perdida', 'Prevenir un error histórico'], false, 2, ARRAY['🧠']),
('{member_A} vs {member_B}: ¿Quién sería un mejor líder en una misión a Marte?', 'vs', 'hipoteticas', NULL, false, 2, ARRAY['🧠']),
('¿Cuál sería tu superpoder y cuál sería tu identidad secreta?', 'free', 'hipoteticas', NULL, false, 2, ARRAY['🧠']),
('{member_A} vs {member_B}: ¿Quién resolvería una situación de crisis con más creatividad?', 'vs', 'hipoteticas', NULL, false, 2, ARRAY['🧠']);

-- ── 💛 VÍNCULOS ────────────────────────────────────────────────────────────────

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, tags) VALUES
('¿Quién del grupo te conoce mejor que nadie?', 'poll', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Qué nota del 1 al 10 le das a la relación de confianza con {member_A}?', 'scale', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Cuál ha sido el momento más cómico que has vivido con alguien de este grupo?', 'free', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Quién del grupo ha sido tu mejor apoyo en un momento difícil?', 'poll', 'vinculos', NULL, false, 2, ARRAY['💛']),
('Del 1 al 10, ¿cuánto contribuido este grupo a tu bienestar emocional?', 'scale', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Qué cualidad de {member_A} admiras más y nunca le has dicho?', 'free', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Quién es la primera persona que llamarías para compartir una buena noticia?', 'poll', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Qué tan importante es para {member_A} mantener contacto con amigos de hace años? (1-10)', 'scale', 'vinculos', NULL, false, 2, ARRAY['💛']),
('Describe la mejor tradición que tiene este grupo.', 'free', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Quién del grupo ha demostrado ser incondicional sin pedir nada a cambio?', 'poll', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Del 1 al 10, qué tan cómodo/a te sientes siendo vulnerable aquí?', 'scale', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Qué cambiarías de tu relación con {member_A} si pudieras?', 'free', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Quién del grupo es más probable que te preste su coche sin hacer preguntas?', 'poll', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Qué nivel de honestidad tiene {member_A} contigo? (1-10)', 'scale', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Cuál ha sido el sacrificio más grande que alguien de este grupo ha hecho por otro?', 'free', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Quién del grupo se comunicaría contigo a las 4AM si supiera que tienes un problema?', 'poll', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Qué tan genuino crees que es el interés de {member_A} cuando pregunta cómo estás? (1-10)', 'scale', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Qué momento definiría nuestra amistad si tuviéramos que resumirla en 1 foto?', 'free', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Quién del grupo ha estado presente en tus peores días sin juzgarte?', 'poll', 'vinculos', NULL, false, 2, ARRAY['💛']),
('¿Del 1 al 10, cuánto crees que aportas tú al grupo?', 'scale', 'vinculos', NULL, false, 2, ARRAY['💛']);

-- ── 🎉 EVENTOS ────────────────────────────────────────────────────────────────

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, tags) VALUES
('{member_A} vs {member_B}: ¿Quién elegiría el destino de vacaciones más caótico?', 'vs', 'eventos', NULL, false, 2, ARRAY['🎉']),
('¿Quién se perdería el after de una fiesta por quedarse dormido?', 'poll', 'eventos', NULL, false, 2, ARRAY['🎉']),
('Ordena al grupo según quién tarda más en prepararse para salir.', 'ranking', 'eventos', NULL, false, 4, ARRAY['🎉']),
('{member_A} vs {member_B}: ¿Quién sería el primero en dejar la fiesta para "hacer algo productivo"?', 'vs', 'eventos', NULL, false, 2, ARRAY['🎉']),
('¿Quién es el alma de la fiesta según el grupo?', 'poll', 'eventos', NULL, false, 2, ARRAY['🎉']),
('Ordena de MEJOR a PEOR organizador de quedadas de emergencia.', 'ranking', 'eventos', NULL, false, 4, ARRAY['🎉']),
('{member_A} vs {member_B}: ¿Quién es más probable que olvide la cartera en una cena?', 'vs', 'eventos', NULL, false, 2, ARRAY['🎉']),
('¿Quién sería el que haría la lista de reproducción para un road trip?', 'poll', 'eventos', NULL, false, 2, ARRAY['🎉']),
('Ordena al grupo según capacidad para acordar dónde comer sin pelear.', 'ranking', 'eventos', NULL, false, 4, ARRAY['🎉']),
('{member_A} vs {member_B}: ¿Quién llegaría tarde a su propia boda por quedarse viendo una serie?', 'vs', 'eventos', NULL, false, 2, ARRAY['🎉']),
('¿Quién es el primero en quedarse dormido en karaoke?', 'poll', 'eventos', NULL, false, 2, ARRAY['🎉']),
('Ordena al grupo según quién se apunta primero a planes nuevos.', 'ranking', 'eventos', NULL, false, 4, ARRAY['🎉']),
('{member_A} vs {member_B}: ¿Quién elegiría un plan tranquilo en vez de una fiesta masiva?', 'vs', 'eventos', NULL, false, 2, ARRAY['🎉']),
('¿Quién del grupo es el responsable de recordar los cumples de todos?', 'poll', 'eventos', NULL, false, 2, ARRAY['🎉']),
('Ordena al grupo de MÁS a MENOS probable que se quede dormido en el cine.', 'ranking', 'eventos', NULL, false, 4, ARRAY['🎉']),
('{member_A} vs {member_B}: ¿Quién organizaría una sorpresa party sin filtro?', 'vs', 'eventos', NULL, false, 2, ARRAY['🎉']),
('¿Quién sugeriría siempre el plan más ambicioso y luego no ayuda a ejecutarlo?', 'poll', 'eventos', NULL, false, 2, ARRAY['🎉']),
('Ordena al grupo según quién organiza mejor reuniones virtuales.', 'ranking', 'eventos', NULL, false, 4, ARRAY['🎉']),
('{member_A} vs {member_B}: ¿Quién sería el mejor MC en un evento grupal?', 'vs', 'eventos', NULL, false, 2, ARRAY['🎉']),
('¿Quién del grupo propone siempre planes distintos a los demás?', 'poll', 'eventos', NULL, false, 2, ARRAY['🎉']);

-- ── 🤖 IA_CUSTOM ──────────────────────────────────────────────────────────────

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, tags) VALUES
('{member_A} vs {member_B}: ¿Quién sería mejor presentador de podcast sobre IA?', 'vs', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('¿Cuánto dependes de la IA para decisiones cotidianas? (1-10)', 'scale', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('¿Qué tarea diaria substituirías por una IA si fuera perfecta?', 'mc', 'ia_custom', ARRAY['Responder emails', 'Planificar comidas', 'Organizar agenda', 'Hacer ejercicio'], false, 2, ARRAY['🤖']),
('{member_A} vs {member_B}: ¿Quién adaptaría mejor su vida a un mundo con IA general?', 'vs', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('¿Qué habilidades humanas serían irremplazables para {member_A}? (1-10)', 'scale', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('Ordena al grupo de MÁS a MENOS probable que trabaje remotamente con IA en 2030.', 'ranking', 'ia_custom', NULL, false, 4, ARRAY['🤖']),
('{member_A} vs {member_B}: ¿Quién escribiría código más limpio que una IA en 5 años?', 'vs', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('¿Qué peligro de la IA te preocupa más?', 'mc', 'ia_custom', ARRAY['Pérdida de empleo', 'Deepfakes y desinformación', 'Pérdida de privacidad', 'Decisiones automatizadas sin ética'], false, 2, ARRAY['🤖']),
('{member_A} vs {member_B}: ¿Quién usaría un chip cerebral para mejorar su memoria?', 'vs', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('¿Cuánto tardarías en acostumbrarte a un compañero de piso robot? (1-10)', 'scale', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('Ordena al grupo según quién más usaría IA para encontrar pareja.', 'ranking', 'ia_custom', NULL, false, 4, ARRAY['🤖']),
('{member_A} vs {member_B}: ¿Quién reemplazaría sus mejores decisiones a una IA?', 'vs', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('¿Qué aplicación de IA cambiaría tu vida si existiera hoy?', 'free', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('{member_A} vs {member_B}: ¿Quién discutiría éticamente con una IA avanzada por diversión?', 'vs', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('¿Qué nivel de confianza le tienes a la IA con tus datos personales? (1-10)', 'scale', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('¿Quién del grupo crearía un twin digital de sí mismo/a?', 'poll', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('{member_A} vs {member_B}: ¿Quién sería el primero en jubilarse porque una IA hace su trabajo?', 'vs', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('¿Cuánto cambiaría la IA la forma en que aprendes cosas nuevas? (1-10)', 'scale', 'ia_custom', NULL, false, 2, ARRAY['🤖']),
('Ordena al grupo según quién se llevaría mejor con un asistente de IA.', 'ranking', 'ia_custom', NULL, false, 4, ARRAY['🤖']),
('{member_A} vs {member_B}: ¿Quién confiaría en una IA para elegir su futuro laboral?', 'vs', 'ia_custom', NULL, false, 2, ARRAY['🤖']);