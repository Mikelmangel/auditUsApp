-- questions_creative_es_other_cats_part2.sql

-- ============================================================
-- vinculos (100): poll=30, vs=10, scale=25, free=25, ranking=10
-- ============================================================

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuánto confías en {member_A} para pedirle un consejo importante? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto apoyo emocional sientes de {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto te importa la opinión de {member_A} sobre tus decisiones? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto tiempo dedicas a {member_A} comparado con otros amigos? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánta honestidad percibes en {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto respeto hay en tu relación con {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto disfrutarías compartiendo un viaje con {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánta lealtad esperas de {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto valoras las conversaciones profundas con {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto te diviertes con {member_A} en reuniones casuales? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuánta complicidad sientes con {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto admiras algo de {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánta paz te da hablar con {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto confías en que {member_A} te defendería? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto gozo te produce pasar tiempo con {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánta afinidad intelectual tienes con {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto te sientes cómodo siendo vulnerable con {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánta gratitud sientes hacia {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto te inspira {member_A} para ser mejor persona? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánta seguridad te da tu amistad con {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuánto valoras que {member_A} recuerde detalles sobre ti? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto tiempo llevarías sin ver a {member_A} antes de extrañarlo/a? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánta energía positiva percibes de {member_A}? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto te ha enseñado {member_A} sobre la vida? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto esperas que {member_A} te apoye en tus nuevos proyectos? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto te sientes escuchado/a por {member_A} cuando hablas? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Qué tan importante es {member_A} en tu vida actualmente? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto agradeces que {member_A} forme parte de tu vida? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto valoras que {member_A} sea auténtico/a contigo? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuánto te importa mantener esta amistad en el futuro? (1-10)', 'scale', 'vinculos', NULL, false, 2, 'es', '💛', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Quién es más probable que sea tu confidente en momentos difíciles? {member_A} vs {member_B}', 'vs', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Quién te hace reír más cuando estáis en un grupo grande? {member_A} vs {member_B}', 'vs', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Quién es más probable que te dé un consejo acertado? {member_A} vs {member_B}', 'vs', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Quién conoces hace más tiempo en tu grupo actual? {member_A} vs {member_B}', 'vs', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Quién tiene más probabilidad de organizar planes sorpresa? {member_A} vs {member_B}', 'vs', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Quién sería tu compañera de viaje ideal? {member_A} vs {member_B}', 'vs', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Quién es más probable que esté disponible a medianoche para hablar? {member_A} vs {member_B}', 'vs', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Quién admiras más por su manera de enfrentar problemas? {member_A} vs {member_B}', 'vs', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Quién tiene más probabilidad de ofrecerte ayuda sin que la pidas? {member_A} vs {member_B}', 'vs', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Quién tiene más probabilidad de ser tu amigo/a para siempre? {member_A} vs {member_B}', 'vs', 'vinculos', NULL, false, 2, 'es', '💛', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuál es el recuerdo más bonito que tienes con {member_A}? Cuéntalo en primera persona.', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('Describe una conversación que cambió tu perspectiva y tuvo a {member_A} como pivote.', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Qué momento vivido con {member_A} te define como persona hoy?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Qué harías si no pudieras ver más a {member_A} mañana?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cómo describirías tu amistad con {member_A} en tres palabras? Explica por qué elegiste cada una.', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Qué le dirías a {member_A} si supieras que es la última conversación que tendrán?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuál es el mayor sacrificio que has hecho por {member_A} y cómo te sentiste?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Qué situación incómoda entre ustedes dos se convirtió en un recuerdo valioso?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cómo se conocieron ustedes dos? Describe el momento exacto.', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Qué actividad hacen juntos que nunca se cansan de repetir?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuál es el consejo más valioso que {member_A} te ha dado alguna vez?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Qué has aprendido de {member_A} que no habrías aprendido de nadie más?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Qué cambiarías de tu relación con {member_A} si pudieras volver atrás?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuál es el regalo más significativo que has recibido de {member_A}?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Qué aventura pendiente sueñan juntos {member_A} y tú?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cómo reaccionó {member_A} la primera vez que hizo algo que te molestó?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Qué canción define你们的友谊 y por qué?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuál es el miedo más raro que {member_A} te ha confesado alguna vez?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Qué harian {member_A} y tú si se perdieran juntos en una ciudad desconocida?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuál es el momento más incómodo que han vivido juntos y cómo lo manejaron?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Qué secreto le has contado a {member_A} que nadie más sabe?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cómo imaginas tu vida dentro de 10 años sin la presencia de {member_A}?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Qué palabra usaría {member_A} para definir tu amistad y por qué?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Cuál es el hábito más irritante de {member_A} que secretamente te parece entrañable?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true),
('¿Qué evento marcó un antes y un después en su amistad?', 'free', 'vinculos', NULL, false, 2, 'es', '💛', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('Ordena a tus amigos según quién te hace reír más: el que hace reír más queda primero.', 'ranking', 'vinculos', NULL, false, 4, 'es', '💛', true),
('Ordena a tus amigos según quién te conoce mejor: el que te conoce mejor queda primero.', 'ranking', 'vinculos', NULL, false, 4, 'es', '💛', true),
('Ordena a tus amigos según la confianza para pedirles ayuda financiera: el más confiable queda primero.', 'ranking', 'vinculos', NULL, false, 4, 'es', '💛', true),
('Ordena a tus amigos según quién crees que durará más como amigo/a: el que durará más queda primero.', 'ranking', 'vinculos', NULL, false, 4, 'es', '💛', true),
('Ordena a tus amigos según quién te ha dado el mejor consejo alguna vez: el mejor Consejero queda primero.', 'ranking', 'vinculos', NULL, false, 4, 'es', '💛', true),
('Ordena a tus amigos según quién es más probable que sea tu roommate algún día: el más probable queda primero.', 'ranking', 'vinculos', NULL, false, 4, 'es', '💛', true),
('Ordena a tus amigos según quién es más probable que te envíe un mensaje de cumpleaños sin que se lo recuerdes: el más atento queda primero.', 'ranking', 'vinculos', NULL, false, 4, 'es', '💛', true),
('Ordena a tus amigos según quién tiene más probabilidad de ayudarte en una mudanza: el más servicial queda primero.', 'ranking', 'vinculos', NULL, false, 4, 'es', '💛', true),
('Ordena a tus amigos según quién es tu cómplice ideal para hacer planes improvisados: el más espontáneo queda primero.', 'ranking', 'vinculos', NULL, false, 4, 'es', '💛', true),
('Ordena a tus amigos según quién consideras tu mejor amigo/a verdadero/a: el mejor amigo/a queda primero.', 'ranking', 'vinculos', NULL, false, 4, 'es', '💛', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cada cuánto tiempo contactas con {member_A}?', 'poll', 'vinculos', ARRAY['Diariamente', 'Semanalmente', 'Mensualmente', 'Solo en ocasiones especiales'], false, 2, 'es', '💛', true),
('¿Cómo prefieres comunicarte con {member_A}?', 'poll', 'vinculos', ARRAY['En persona', 'Llamadas', 'Mensajes de texto', 'Videollamada'], false, 2, 'es', '💛', true),
('¿Cuántas horas a la semana pasas con {member_A}?', 'poll', 'vinculos', ARRAY['Menos de 2', 'Entre 2 y 5', 'Entre 5 y 10', 'Más de 10'], false, 2, 'es', '💛', true),
('¿De qué tema hablan más cuando se ven?', 'poll', 'vinculos', ARRAY['Trabajo o estudios', 'Relaciones personales', 'Planes futuros', 'Chismes y risas'], false, 2, 'es', '💛', true),
('¿Dónde suelen encontrarse principalmente?', 'poll', 'vinculos', ARRAY['Cafeterías o restaurantes', 'Casas uno del otro', 'Actividades al aire libre', 'Eventos sociales'], false, 2, 'es', '💛', true),
('¿Cuándo fue la última vez que vieron cara a cara?', 'poll', 'vinculos', ARRAY['Hace menos de una semana', 'Hace 1-2 semanas', 'Hace un mes', 'Hace más de un mes'], false, 2, 'es', '💛', true),
('¿Qué tipo de planes hacen juntos más frecuentemente?', 'poll', 'vinculos', ARRAY['Cenas o almuerzos', 'Actividades culturales', 'Deporte o naturaleza', 'Quedar en casa'], false, 2, 'es', '💛', true),
('¿Con qué frecuencia tienen conversaciones profundas?', 'poll', 'vinculos', ARRAY['Casi diarias', 'Una vez por semana', 'Una vez al mes', 'Rara vez'], false, 2, 'es', '💛', true),
('¿Qué tanto de tu vida personal conoce {member_A}?', 'poll', 'vinculos', ARRAY['Todo o casi todo', 'Muchas cosas', 'Algunas cosas', 'Poco o nada'], false, 2, 'es', '💛', true),
('¿Cuántos años lleva你们的友谊?', 'poll', 'vinculos', ARRAY['Menos de 1 año', 'Entre 1 y 3 años', 'Entre 3 y 10 años', 'Más de 10 años'], false, 2, 'es', '💛', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cómo describirías la dinámica de tu amistad con {member_A}?', 'poll', 'vinculos', ARRAY['Muy activa y divertida', 'Estable y tranquila', 'Intelectual y profunda', 'De apoyo mutuo'], false, 2, 'es', '💛', true),
('¿Qué tanto comparten en redes sociales?', 'poll', 'vinculos', ARRAY['Todo lo que hacemos', 'Solo momentos especiales', 'Casi nada', 'Nada en absoluto'], false, 2, 'es', '💛', true),
('¿Cuándo fue la última vez que tuvieron un conflicto?', 'poll', 'vinculos', ARRAY['Hace poco', 'Hace unos meses', 'Hace un año', 'Nunca hemos tenido'], false, 2, 'es', '💛', true),
('¿Qué papel tiene {member_A} en tu vida?', 'poll', 'vinculos', ARRAY['Amigo/a del alma', 'Confidente', 'Compañero/a de planes', 'Amigo/a valioso/a'], false, 2, 'es', '💛', true),
('¿Qué tan importante es {member_A} en tu día a día?', 'poll', 'vinculos', ARRAY['Imprescindible', 'Muy importante', 'Algo importante', 'Poco importante'], false, 2, 'es', '💛', true),
('¿Cuánto influenciaría perder a {member_A} en tu bienestar?', 'poll', 'vinculos', ARRAY['Afectaría mucho mi vida', 'Afectaría bastante', 'Afectaría algo', 'Apenas lo notaría'], false, 2, 'es', '💛', true),
('¿Con qué frecuencia se pelean?', 'poll', 'vinculos', ARRAY['Frecuentemente', 'A veces', 'Rara vez', 'Nunca'], false, 2, 'es', '💛', true),
('¿Cómo resuelven sus diferencias?', 'poll', 'vinculos', ARRAY['Hablándolo en persona', 'Por mensaje', 'Ignorándolo', 'Pidiendo disculpas'], false, 2, 'es', '💛', true),
('¿Qué esperas de {member_A} en el futuro?', 'poll', 'vinculos', ARRAY['Que sigamos siendo amigos', 'Que vivamos más aventuras', 'Que sea mi compañero de vejez', 'No tengo expectativas'], false, 2, 'es', '💛', true),
('¿Cómo reaccionarías si {member_A} se muda lejos?', 'poll', 'vinculos', ARRAY['Lo consideraría muy difícil', 'Mantendría contacto frecuente', 'Lo tomaría con normalidad', 'No me afectaría'], false, 2, 'es', '💛', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Qué tanto interactúas con {member_A} en redes sociales?', 'poll', 'vinculos', ARRAY['Damos like a todo', 'Commentamos frecuentemente', 'Rara vez interactuamos', 'No usamos redes'], false, 2, 'es', '💛', true),
('¿Cuánto tiempo de calidad dedicas a {member_A} cuando se ven?', 'poll', 'vinculos', ARRAY['Conversaciones largas', 'Un rato breve pero bueno', 'Solo lo justo', 'Depende del plan'], false, 2, 'es', '💛', true),
('¿Cómo te sientes después de pasar tiempo con {member_A}?', 'poll', 'vinculos', ARRAY['Muy contento/a', 'Contento/a', 'Neutral', 'Cansado/a'], false, 2, 'es', '💛', true),
('¿Cuánto respeto hay en tu relación con {member_A}?', 'poll', 'vinculos', ARRAY['Mucho respeto', 'Bastante respeto', 'Algo de respeto', 'Poco respeto'], false, 2, 'es', '💛', true),
('¿Qué tan honestos son el uno con el otro?', 'poll', 'vinculos', ARRAY['Totalmente honestos', 'Casi siempre honestos', 'A veces honestos', 'Poca honestidad'], false, 2, 'es', '💛', true),
('¿Qué tan seguido se dan sorpresas el uno al otro?', 'poll', 'vinculos', ARRAY['Frecuentemente', 'A veces', 'Rara vez', 'Nunca'], false, 2, 'es', '💛', true),
('¿Cuál es el tipo de plan que más disfrutan juntos?', 'poll', 'vinculos', ARRAY['Salir de fiesta', 'Quedar en casa', 'Viajar', 'Hacer deporte'], false, 2, 'es', '💛', true),
('¿Qué tan probable es que {member_A} sea tu amigo para siempre?', 'poll', 'vinculos', ARRAY['Muy probable', 'Bastante probable', 'Poco probable', 'Improbable'], false, 2, 'es', '💛', true),
('¿Cuántos grupos de amigos comparten ustedes dos?', 'poll', 'vinculos', ARRAY['Todos mis amigos', 'Muchos grupos', 'Algunos grupos', 'Ninguno'], false, 2, 'es', '💛', true),
('¿Cuánto valoras que {member_A} te corrija cuando te equivocas?', 'poll', 'vinculos', ARRAY['Mucho', 'Bastante', 'Algo', 'Poco'], false, 2, 'es', '💛', true);

-- ============================================================
-- eventos (100): poll=30, vs=25, free=10, ranking=35
-- ============================================================

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuándo fue el último evento social memorable que viviste con tu grupo?', 'poll', 'eventos', ARRAY['Hace menos de una semana', 'Hace 1-2 semanas', 'Hace un mes', 'Hace más de un mes'], false, 2, 'es', '🎉', true),
('¿Qué tipo de evento social prefieres?', 'poll', 'eventos', ARRAY['Fiesta', 'Cena elegante', 'Actividad al aire libre', 'Nocturno en local'], false, 2, 'es', '🎉', true),
('¿Con qué frecuencia organiza tu grupo eventos sociales?', 'poll', 'eventos', ARRAY['Semanalmente', 'Quincenalmente', 'Mensualmente', 'Solo en ocasiones'], false, 2, 'es', '🎉', true),
('¿Cuántas personas suelen asistir a los eventos de tu grupo?', 'poll', 'eventos', ARRAY['2-5', '6-10', '11-20', 'Más de 20'], false, 2, 'es', '🎉', true),
('¿Quién en tu grupo organiza mejor los eventos?', 'poll', 'eventos', ARRAY['Siempre hay un organizador fijo', 'Rota entre nosotros', 'Cada quien organiza lo suyo', 'No hay organización'], false, 2, 'es', '🎉', true),
('¿Qué actividad es más común en los eventos de tu grupo?', 'poll', 'eventos', ARRAY['Pasear y conversar', 'Fiestas y copas', 'Cenas y comida', 'Juegos y actividades'], false, 2, 'es', '🎉', true),
('¿Cuánto tiempo suele durar un evento de tu grupo?', 'poll', 'eventos', ARRAY['Menos de 2 horas', '2-4 horas', 'Toda la noche', 'Todo el día'], false, 2, 'es', '🎉', true),
('¿Dónde prefieren realizarse los eventos de tu grupo?', 'poll', 'eventos', ARRAY['En casas particulares', 'Bares y restaurantes', 'Espacios al aire libre', 'Lugares culturales'], false, 2, 'es', '🎉', true),
('¿Cuál fue el evento más divertido del último año?', 'poll', 'eventos', ARRAY['Una fiesta de cumpleaños', 'Un viaje juntos', 'Una cena especial', 'Un juego nocturno'], false, 2, 'es', '🎉', true),
('¿Qué tan spontáneos son los planes de tu grupo?', 'poll', 'eventos', ARRAY['Siempre improvisados', 'A veces planeados', 'Generalmente planeados', 'Siempre planeados'], false, 2, 'es', '🎉', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuánto gastas aproximadamente en los eventos de tu grupo?', 'poll', 'eventos', ARRAY['Menos de 20€', '20-50€', '50-100€', 'Más de 100€'], false, 2, 'es', '🎉', true),
('¿Qué tan a gusto te sientes en los eventos de tu grupo?', 'poll', 'eventos', ARRAY['Totalmente cómodo/a', 'Bastante cómodo/a', 'Algo incómodo/a', 'Incómodo/a'], false, 2, 'es', '🎉', true),
('¿Cuánto alcohol se consume típicamente en tus eventos?', 'poll', 'eventos', ARRAY['Nada', 'Poco (1-2 copas)', 'Moderado (3-5)', 'Mucho (más de 5)'], false, 2, 'es', '🎉', true),
('¿Cómo decides a qué eventos asistir?', 'poll', 'eventos', ARRAY['Siempre asisto', 'Asisto si puedo', 'Solo si me interesa', 'Rara vez asisto'], false, 2, 'es', '🎉', true),
('¿Quién es el alma de las fiestas de tu grupo?', 'poll', 'eventos', ARRAY['Siempre hay alguien fijo', 'Varía según el evento', 'Todos participan igual', 'Nadie lo es'], false, 2, 'es', '🎉', true),
('¿Qué prefieres: eventos grandes o íntimos?', 'poll', 'eventos', ARRAY['Muy íntimos (2-4)', 'Íntimos (5-8)', 'Medianos (9-15)', 'Grandes (más de 15)'], false, 2, 'es', '🎉', true),
('¿Cuánto te afecta cuando cancelan un evento a último momento?', 'poll', 'eventos', ARRAY['Mucho', 'Bastante', 'Algo', 'No me importa'], false, 2, 'es', '🎉', true),
('¿Qué papel juegas tú en la organización de eventos?', 'poll', 'eventos', ARRAY['Organizador/a activo/a', 'Colaboro a veces', 'Solo asisto', 'No me implico'], false, 2, 'es', '🎉', true),
('¿Qué tan importante es la música en tus eventos?', 'poll', 'eventos', ARRAY['Imprescindible', 'Muy importante', 'Algo importante', 'Irrelevante'], false, 2, 'es', '🎉', true),
('¿Cómo son los eventos de tu grupo: más formales o informales?', 'poll', 'eventos', ARRAY['Muy formales', 'Algo formales', 'Informales', 'Muy informales'], false, 2, 'es', '🎉', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuál es la temática más repetida en los eventos de tu grupo?', 'poll', 'eventos', ARRAY['Cumpleaños', 'Celebraciones varias', 'Sin ocasión especial', 'Festividades'], false, 2, 'es', '🎉', true),
('¿Cuánto tiempo de preparación necesitas antes de un evento?', 'poll', 'eventos', ARRAY['Menos de 30 minutos', '30-60 minutos', '1-2 horas', 'Más de 2 horas'], false, 2, 'es', '🎉', true),
('¿Qué sueles hacer antes de ir a un evento de tu grupo?', 'poll', 'eventos', ARRAY['Prepararme bien', 'Algo de arreglarse', 'Ir tal cual', 'Depende del evento'], false, 2, 'es', '🎉', true),
('¿Cuánto te diviertes en los eventos de tu grupo generalmente?', 'poll', 'eventos', ARRAY['Me divierto mucho', 'Me divierto bastante', 'Algo', 'No me divierto'], false, 2, 'es', '🎉', true),
('¿Qué tan necesario es tu grupo para tener una vida social satisfactoria?', 'poll', 'eventos', ARRAY['Imprescindible', 'Muy necesario', 'Algo necesario', 'No necesario'], false, 2, 'es', '🎉', true),
('¿Cada cuánto surge la idea de hacer algo sin que haya un plan concreto?', 'poll', 'eventos', ARRAY['Cada semana', 'Cada mes', 'Cada cierto tiempo', 'Nunca'], false, 2, 'es', '🎉', true),
('¿Cuánto estrés te genera organizar un evento para tu grupo?', 'poll', 'eventos', ARRAY['Mucho estrés', 'Algo de estrés', 'Poco estrés', 'Ninguno'], false, 2, 'es', '🎉', true),
('¿Cómo reaccionas si un evento no sale como esperabas?', 'poll', 'eventos', ARRAY['Lo disfruto de todas formas', 'Me defrauda', 'Me molesto', 'Lo paso mal'], false, 2, 'es', '🎉', true),
('¿Cuánto influye la gastronomía en tus eventos?', 'poll', 'eventos', ARRAY['Es el elemento central', 'Muy importante', 'Algo importante', 'Irrelevante'], false, 2, 'es', '🎉', true),
('¿Cuánto te埋怨 cuando cancelan un evento a último momento?', 'poll', 'eventos', ARRAY['Mucho', 'Bastante', 'Algo', 'No me importa'], false, 2, 'es', '🎉', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Quién es más probable que organice la próxima fiesta de cumpleaños? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que traiga alcohol a la reunión? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que se quede dormido/a en el evento? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que organice un viaje de última hora? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que prepare la mejor comida para el grupo? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que olvide el lugar de encuentro? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que proponga hacer algo diferente esta vez? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que sea el último en irse del evento? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que invite a alguien que nadie conoce? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que tenga que irse temprano? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Quién es más probable que se ponga a bailar sin que se lo pidan? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que fotgrafíe todo en redes sociales? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que inicie una conversación con un desconocido? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que organice un game night? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que prepare una playlist para el evento? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que decida dónde ir sin consultar al grupo? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que traiga a su pareja sin avisar? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que sea el centro de atención en un evento? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que derrame algo en la ropa de otro? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que haga un discurso emotivo sin que lo esperaban? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Quién es más probable que te salve de un momento incómodo? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que inicie el karaoke? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que sugiera ir a otro lugar después? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que te consiga el número de alguien que te gusta? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que sea el primero en llegar? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que llegue tarde pero con una buena excusa? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que cocine algo casero para compartir? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que proponga una actividad al aire libre? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que se quede dormido en el sofá de alguien? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que organice algo temático? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Quién es más probable que olvide su cartera y tenga que pedir dinero prestado? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que sea el alma de la fiesta desde que llega? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que inicie una conversación profunda a las 3 AM? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que te envíe fotos del evento al día siguiente? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Quién es más probable que haga un regalo inolvidable? {member_A} vs {member_B}', 'vs', 'eventos', NULL, false, 2, 'es', '🎉', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuál es el evento más memorable de tu vida social y por qué?', 'free', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Cómo planeabas eventos sociales antes de tener tu grupo actual?', 'free', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Cuál es tu mejor recuerdo de infancia relacionado con reuniones sociales?', 'free', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Cómo cambiarías los eventos de tu grupo si pudieras?', 'free', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Qué harías si no pudieras asistir a ningún evento social durante un mes?', 'free', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Cuál es el mejor consejo que alguien te dio sobre cómo ser un buen invitado?', 'free', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Cómo sería para ti la reunión social perfecta?', 'free', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Qué evento te generó más ansiedad y por qué?', 'free', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Cuál es la tendencia de eventos sociales más rara que has experimentado?', 'free', 'eventos', NULL, false, 2, 'es', '🎉', true),
('¿Qué harías si un evento se vuelve aburrido desde el principio?', 'free', 'eventos', NULL, false, 2, 'es', '🎉', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('Ordena a los presentes según quién es más probable que organice el próximo evento: el más organizado queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién se divierte más en una fiesta: el más divertido queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que llegue tarde: el más impuntual queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién traería mejor comida a una reunión: el mejor chef queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que proponga un plan diferente: el más creativo queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es el alma de la fiesta: el más carismático queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que olvide el evento: el más olvidado queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién gasta más en eventos sociales: el más gastador queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién pone mejor música: el mejor DJ queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que invite a gente extraña: el más integrador queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('Ordena a los presentes según quién limpia después de un evento: el más limpido queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que se emborrache primero: el más débil con el alcohol queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién cuenta chistes mejores: el más gracioso queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que inicie el karaoke: el más valiente queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que organice un viaje: el más viajado queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que llore en un evento: el más sensible queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que sorprenda a todos con su asistencia: el más inesperado queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién prepara los mejores detalles: el más detallista queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que sea el último en irse: el más resistente queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que se ponga a cocinar sin que se lo pidan: el más servicial queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('Ordena a los presentes según quién tiene más probabilidad de dar un discurso sin que lo pidan: el más elocuente queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que tenga que irse antes: el más ocupado queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que olvide su cartera: el más despistado queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que tome las mejores fotos: el más fotográfico queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que inicie un juego: el más lúdico queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que haga de mediador en un conflicto: el más neutral queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que traiga bebida de más: el más generoso queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que baile de forma vergonzosa: el más bailongo queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que cuente historias divertidas: el más narrativo queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que recuerde siempre el cumpleaños de todos: el más recordador queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('Ordena a los presentes según quién es más probable que te consiga el teléfono de alguien: el más atrevido queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que proponga hacer afterparty: el más nocturno queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que caiga rendido/a primero: el más soñoliento queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que se pierda de camino al sitio: el más perdido queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true),
('Ordena a los presentes según quién es más probable que sea el primero en proponer un brindis: el más atrevido queda primero.', 'ranking', 'eventos', NULL, false, 4, 'es', '🎉', true);

-- ============================================================
-- ia_custom (100): poll=15, vs=25, mc=15, scale=20, free=10, ranking=15
-- ============================================================

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuánto impactaría la IA en tu trabajo actual si se implementara mañana? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto confías en que la IA tome decisiones éticas? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto usas herramientas de IA en tu día a día? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto miedo te da que la IA supere a la inteligencia humana? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto crees que la IA mejorará la educación en el futuro? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto te preocupa que la IA elimine puestos de trabajo? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto crees que la IA debería estar regulada por los gobiernos? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto valoras la privacidad de tus datos frente a los servicios de IA? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto te gustaría que la IA te ayudara con tus decisiones personales? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto crees que la IA puede ser creativa? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuánto ha cambiado tu forma de trabajar desde que usas IA? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto confiarías en un diagnóstico médico hecho por IA? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto crees que la IA debería tener derechos legales? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto te importa que las respuestas de la IA sean imparciales? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto crees que la IA transformará la industria del entretenimiento? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto te sentirías cómodo/a siendo jurado de un caso donde la evidencia fue analizada por IA? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto impacto tendrá la IA en las relaciones humanas según tu experiencia? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto crees que la IA debería poder crear arte que se considere original? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto te preocupa que la IA sea usada para crear desinformación? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuánto crees que la IA cambiará la forma en que aprendemos idiomas? (1-10)', 'scale', 'ia_custom', NULL, false, 2, 'es', '🤖', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Quién debería regular la IA: empresas, gobiernos o organismos internacionales? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: que la IA te ayude a escribir o que lo haga ella sola? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuál prefieres: un asistente de IA perfecto pero sin alma, o imperfecto pero con personalidad? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué harías si un robot te quitara el trabajo que has tenido por 10 años? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué opción te genera más esperanza: medicina personalizada o educación accesible gracias a la IA? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: que la IA te conozca mejor que tú mismo o que tú conozcas mejor a la IA? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué sería más preocupante: que la IA tenga conciencia o que no la tenga nunca? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que censure contenidos dañinos o que sea totalmente libre? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: que la IA te reemplace en tareas domésticas o en tu trabajo profesional? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: un futuro con IA que trabaja para humanos o sin IA? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Qué prefieres: IA más rápida y torpe, o más lenta pero extremadamente precisa? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que simule ser humana o IA que admita claramente ser una máquina? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que te ayude a encontrar pareja o IA que te ayude a olvidarte de necesitar pareja? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: que tu banco use IA para detectar fraudes o que lo haga un humano? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que te recomiende qué comer o IA que te cocine directamente? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que escriba tu testamento o IA que gestione tus finanzas? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que te ayude a estudiar o IA que estudie por ti? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que diagnostique enfermedades mentales o IA que proporcione compañía emocional? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que sea tu profesor personal o IA que sea tu competidor en el mercado laboral? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: que la IA controle tu agenda o que simplemente te informe sobre tu disponibilidad? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Qué prefieres: IA que prediga cuándo morirás o que prediga cómo ser más feliz? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que te haga preguntas incómodas sobre tu vida o IA que siempre te dé la razón? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que clone la voz de alguien sin su permiso o IA que solo use voces autorizadas? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que escriba libros o IA que produzca películas? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que gobierne el mundo o IA que simplemente te sirva como herramienta? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que compita con artistas o IA que solo asista a artistas? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que analice tu ADN para predecir enfermedades o IA que analice tu comportamiento para predecir preferencias? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que sea tu terapeuta o IA que sea tu amigo/a? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que filtre las noticias que ves o IA que te muestre todas las noticias sin filtro? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que sea obligatoria en escuelas o IA que sea optativa? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Qué prefieres: IA que permita tomar decisiones más informadas o IA que permitan tomar decisiones más rápidas? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que te conecte con personas similares a ti o IA que te exponga a personas muy diferentes? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que juegue contigo o IA que juegue contra ti? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que haga preguntas filosóficas o IA que responda preguntas filosóficas? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué prefieres: IA que te motive para hacer ejercicio o IA que haga ejercicio por ti? {member_A} vs {member_B}', 'vs', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuál de estas aplicaciones de la IA te genera más esperanza? (mc)', 'mc', 'ia_custom', ARRAY['Medicina personalizada', 'Cambio climático', 'Educación accesible', 'Exploración espacial'], false, 2, 'es', '🤖', true),
('¿Cuál de estos riesgos de la IA te preocupa más? (mc)', 'mc', 'ia_custom', ARRAY['Pérdida de empleos', 'Armas autónomas', 'Desinformación', 'Pérdida de privacidad'], false, 2, 'es', '🤖', true),
('¿En qué área debería enfocarse principalmente el desarrollo de IA? (mc)', 'mc', 'ia_custom', ARRAY['Salud', 'Educación', 'Medio ambiente', 'Seguridad'], false, 2, 'es', '🤖', true),
('¿Qué cualidad humana debería priorizarse frente al avance de la IA? (mc)', 'mc', 'ia_custom', ARRAY['Empatía', 'Creatividad', 'Pensamiento crítico', 'Ética'], false, 2, 'es', '🤖', true),
('¿Qué prefieres que haga la IA con tu información personal? (mc)', 'mc', 'ia_custom', ARRAY['La almacene de forma segura', 'La elimine después de usar', 'Me pida permiso siempre', 'No la recopile'], false, 2, 'es', '🤖', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Qué tipo de contenido debería poder crear la IA? (mc)', 'mc', 'ia_custom', ARRAY['Texto y artículos', 'Imágenes y arte', 'Música y sonido', 'Vídeo y animación'], false, 2, 'es', '🤖', true),
('¿Cómo debería reaccionar la sociedad ante la IA que supera a los humanos en tareas cognitivas? (mc)', 'mc', 'ia_custom', ARRAY['Regulándola estrictamente', 'Aceptándola gradualmente', 'Prohibiéndola parcialmente', 'Fomentando su desarrollo'], false, 2, 'es', '🤖', true),
('¿Qué nivel de transparencia deberías exigir a las empresas de IA? (mc)', 'mc', 'ia_custom', ARRAY['Explicación completa', 'Explicación parcial', 'Resultado sin explicación', 'Da igual'], false, 2, 'es', '🤖', true),
('¿Qué prefieres en un asistente de IA? (mc)', 'mc', 'ia_custom', ARRAY['Que sea muy inteligente', 'Que sea muy seguro', 'Que sea muy económico', 'Que sea de código abierto'], false, 2, 'es', '🤖', true),
('¿Qué aspecto de la IA debería regularse primero? (mc)', 'mc', 'ia_custom', ARRAY['Privacidad de datos', 'Decisiones automatizadas', 'Contenido generado', 'Robots físicos'], false, 2, 'es', '🤖', true),
('¿Cuál debería ser el objetivo principal de la IA según tú? (mc)', 'mc', 'ia_custom', ARRAY['Mejorar la calidad de vida', 'Avanzar el conocimiento', 'Generar beneficios económicos', 'Resolver problemas globales'], false, 2, 'es', '🤖', true),
('¿Cómo te sientes sobre la IA en tu lugar de trabajo? (mc)', 'mc', 'ia_custom', ARRAY['Me amenaza', 'Me complementa', 'Me es indiferente', 'Depende del día'], false, 2, 'es', '🤖', true),
('¿Qué empresa de IA confías más y por qué? (mc)', 'mc', 'ia_custom', ARRAY['Google', 'Microsoft', 'OpenAI', 'Ninguna'], false, 2, 'es', '🤖', true),
('¿Qué prefieres que haga un gobierno con la IA? (mc)', 'mc', 'ia_custom', ARRAY['Invertir en investigación', 'Crear regulaciones estrictas', 'Crear una agencia reguladora', 'Fomentar la educación'], false, 2, 'es', '🤖', true),
('¿Qué situación te genera más curiosidad sobre la IA? (mc)', 'mc', 'ia_custom', ARRAY['Cómo aprende', 'Cómo genera creatividad', 'Cómo toma decisiones', 'Cómo evolucionará'], false, 2, 'es', '🤖', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuánto tiempo dedicas a aprender sobre IA cada mes? (poll)', 'poll', 'ia_custom', ARRAY['Ninguno', 'Menos de 1 hora', '1-5 horas', 'Más de 5 horas'], false, 2, 'es', '🤖', true),
('¿Cuánto pagarías por una suscripción a una herramienta de IA que usaras diariamente? (poll)', 'poll', 'ia_custom', ARRAY['Nada', 'Menos de 5€/mes', '5-15€/mes', 'Más de 15€/mes'], false, 2, 'es', '🤖', true),
('¿Cuántas herramientas de IA usas regularmente? (poll)', 'poll', 'ia_custom', ARRAY['Ninguna', '1-2', '3-5', 'Más de 5'], false, 2, 'es', '🤖', true),
('¿Cuánto ha mejorado tu productividad desde que usas IA? (poll)', 'poll', 'ia_custom', ARRAY['Nada', 'Algo (10-25%)', 'Bastante (25-50%)', 'Mucho (más de 50%)'], false, 2, 'es', '🤖', true),
('¿Con qué frecuencia interactúas con IA en tu vida diaria? (poll)', 'poll', 'ia_custom', ARRAY['Nunca', 'Pocas veces', 'Varias veces al día', 'Constantemente'], false, 2, 'es', '🤖', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuántas horas a la semana destinarias a formarte en IA si tu empresa te lo ofreciera gratis? (poll)', 'poll', 'ia_custom', ARRAY['Ninguna', '1-3 horas', '3-6 horas', 'Más de 6 horas'], false, 2, 'es', '🤖', true),
('¿Cuántos de tus conocidos usan herramientas de IA regularmente? (poll)', 'poll', 'ia_custom', ARRAY['Ninguno', 'Algunos (menos del 25%)', 'Muchos (25-50%)', 'La mayoría (más del 50%)'], false, 2, 'es', '🤖', true),
('¿Cuánto esperarías que tardara la IA en sustituir completamente un trabajo administrativo básico? (poll)', 'poll', 'ia_custom', ARRAY['Ya ha ocurrido', 'En 1-3 años', 'En 3-10 años', 'Nunca'], false, 2, 'es', '🤖', true),
('¿Cuántos artículos o noticias sobre IA consumes al mes? (poll)', 'poll', 'ia_custom', ARRAY['Ninguno', '1-3', '4-10', 'Más de 10'], false, 2, 'es', '🤖', true),
('¿Cuánto dinero has invertido en herramientas o formación relacionada con IA? (poll)', 'poll', 'ia_custom', ARRAY['Ninguno', 'Menos de 50€', '50-200€', 'Más de 200€'], false, 2, 'es', '🤖', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Cuántos cursos formales has completado sobre IA o temas relacionados? (poll)', 'poll', 'ia_custom', ARRAY['Ninguno', '1-2', '3-5', 'Más de 5'], false, 2, 'es', '🤖', true),
('¿Cuánto ha cambiado tu percepción de la IA en el último año? (poll)', 'poll', 'ia_custom', ARRAY['No ha cambiado', 'Algo más positiva', 'Mucho más positiva', 'Mucho más negativa'], false, 2, 'es', '🤖', true),
('¿Cuántas profesiones crees que la IA transformará significativamente en 5 años? (poll)', 'poll', 'ia_custom', ARRAY['Ninguna', 'Pocas (1-5)', 'Varias (6-15)', 'Muchas (más de 15)'], false, 2, 'es', '🤖', true),
('¿Cuánto impacto tendrá la IA en tu carrera profesional en los próximos 5 años? (poll)', 'poll', 'ia_custom', ARRAY['Ninguno', 'Algún impacto', 'Impacto moderado', 'Transformará mi campo'], false, 2, 'es', '🤖', true),
('¿Cuánto tiempo llevas usando herramientas de IA de forma regular? (poll)', 'poll', 'ia_custom', ARRAY['Menos de 6 meses', '6 meses - 1 año', '1-2 años', 'Más de 2 años'], false, 2, 'es', '🤖', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('¿Qué te gustaría que la IA hiciera por ti en tu día a día que aún no puede hacer?', 'free', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cómo sería un día perfecto asistido por IA?', 'free', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cuál es tu mayor miedo relacionado con la IA a largo plazo?', 'free', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cómo contarías a tus nietos lo que es vivir en la era de la IA?', 'free', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué conversación sobre IA te gustaría tener con alguien que no conoce esta tecnología?', 'free', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué problema personal resolverías primero con la ayuda de una IA avanzada?', 'free', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Cómo te sentirías si pudieras conversar con una versión digital de ti mismo/a?', 'free', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué aspecto de la IA te genera más curiosidad?', 'free', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Crees que la IA algún día podrá entender las emociones humanas? ¿Por qué?', 'free', 'ia_custom', NULL, false, 2, 'es', '🤖', true),
('¿Qué habilidad humana crees que la IA nunca podrá reemplazar completamente?', 'free', 'ia_custom', NULL, false, 2, 'es', '🤖', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('Ordena estas aplicaciones de IA según cuál te gustaría que avanzara más rápido: la más deseada queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true),
('Ordena estas habilidades humanas según cuál sobrevivirá mejor frente a la IA: la más resiliente queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true),
('Ordena estos miedos sobre la IA del menor al mayor: el menos preocupante queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true),
('Ordena estas industrias según cuál será más transformada por la IA en 10 años: la más impactada queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true),
('Ordena estos países según cuál liderará el desarrollo de IA: el líder queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true),
('Ordena estas herramientas de IA según cuál usas más frecuentemente: la más usada queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true),
('Ordena estos problemas globales según cuál tiene más probabilidad de ser resuelto por la IA: el más probable queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true),
('Ordena estas actividades según cuál delegarías más gustosamente a la IA: la más delegable queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true),
('Ordena estos sectores laborales según cuál será más seguro frente a la IA: el más seguro queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true),
('Ordena estas emociones humanas según cuál será más valiosa en un mundo con IA: la más valiosa queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true);

INSERT INTO public.questions (text, mode, category, options, is_anonymous, min_members, language, tags, is_active) VALUES
('Ordena estos debates éticos sobre IA del más urgente al menos urgente: el más urgente queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true),
('Ordena estos tipos de contenido digital según cuál será más difícil de distinguir si lo hizo una IA: el más difícil queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true),
('Ordena estos efectos de la IA en la educación del más positivo al más negativo: el más positivo queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true),
('Ordena estos campos donde la IA más necesita regulación del más urgente al menos urgente: el más urgente queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true),
('Ordena estas razones para usar IA del más convincente al menos convincente: el más convincente queda primero.', 'ranking', 'ia_custom', NULL, false, 4, 'es', '🤖', true);
