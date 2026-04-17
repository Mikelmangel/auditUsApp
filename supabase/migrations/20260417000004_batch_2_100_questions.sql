-- =====================================================
-- 20260417000004_batch_100_questions.sql
-- MVP Batch 1: 100 preguntas frescas para AuditUs
-- =====================================================

INSERT INTO public.questions (text, category, mode, is_active, min_members, options, tags) VALUES

-- HUMOR 😂
('¿Quién es más probable que se ría de un chiste malísimo de un profesor, {member_A} o {member_B}?', 'humor', 'vs', true, 2, NULL, '{"humor", "colegio"}'),
('Si tuviéramos que elegir a alguien para que nos represente en un concurso de baile regional, ¿quién sería nuestro ridículo delegado?', 'humor', 'poll', true, 3, NULL, '{"baile", "ridiculo"}'),
('Del 1 al 10, ¿cuánto crees que desafina {member_A} cantando en la ducha?', 'humor', 'scale', true, 2, NULL, '{"canto", "ducha"}'),
('¿Qué harías si te encuentras a tu ex vestido de botarga repartiendo volantes?', 'humor', 'free', true, 3, NULL, '{"ex", "situaciones"}'),
('Ordena al grupo desde el más probable de caerse en unas escaleras públicas hasta el más ninja.', 'humor', 'ranking', true, 4, NULL, '{"torpeza", "ninja"}'),
('Si {member_A} fuera un animal, ¿cuál sería?', 'humor', 'mc', true, 2, ARRAY['Un perezoso cansado', 'Un chihuahua histérico', 'Un gato juzgador', 'Un pato patoso'], '{"animales", "comparaciones"}'),
('¿Quién hace peores ruidos cuando come, {member_A} o {member_B}?', 'humor', 'vs', true, 2, NULL, '{"comida", "molestias"}'),
('¿Quién sobreviviría menos tiempo sin poder mirar su teléfono móvil?', 'humor', 'poll', true, 3, NULL, '{"movil", "adiccion"}'),
('Del 1 al 10, ¿cuánto miedo crees que le dan a {member_A} las cucarachas voladoras?', 'humor', 'scale', true, 2, NULL, '{"miedo", "insectos"}'),
('Cuenta el momento más humillante que nos ha pasado por culpa del alcohol.', 'humor', 'free', true, 2, NULL, '{"alcohol", "humillacion"}'),
('Ordena de quién tiene el fondo de pantalla más feo al más estético.', 'humor', 'ranking', true, 4, NULL, '{"movil", "estetica"}'),
('¿Con quién preferirías quedarte atrapado en un túnel de lavado, con {member_A} o con {member_B}?', 'humor', 'vs', true, 3, NULL, '{"situaciones", "absurdo"}'),
('¿Qué nombre le pondría {member_A} a su primer hijo si le obligaran a elegir sin pensarlo?', 'humor', 'free', true, 2, NULL, '{"nombres", "improvisacion"}'),

-- HABILIDADES 💪
('¿Quién es mejor montando muebles de IKEA, {member_A} o {member_B}?', 'habilidades', 'vs', true, 2, NULL, '{"manitas", "ikea"}'),
('Si estallara la tercera guerra mundial, ¿quién sería el primero en construir un refugio subterráneo?', 'habilidades', 'poll', true, 3, NULL, '{"supervivencia", "guerra"}'),
('Del 1 al 10, ¿cómo de bien crees que puedes aparcar en paralelo sin mirar los espejos?', 'habilidades', 'scale', true, 2, NULL, '{"coche", "habilidad"}'),
('Nombra una habilidad inútil que crees que tienes pero de la que estás orgulloso.', 'habilidades', 'free', true, 2, NULL, '{"habilidades", "inutil"}'),
('Ordena al grupo desde el peor cocinero de tortillas hasta el chef Michelin.', 'habilidades', 'ranking', true, 4, NULL, '{"cocina", "tortillas"}'),
('Si tuviéramos que participar en los Juegos Olímpicos, ¿en qué deporte lo harías?', 'habilidades', 'mc', true, 2, ARRAY['Lanzamiento de mando a distancia', 'Esconderse de las responsabilidades', 'Sprint hacia el buffet libre', 'Equitación con caballos de palo'], '{"deporte", "olimpiadas"}'),
('¿Quién aguanta más el picante extremo, {member_A} o {member_B}?', 'habilidades', 'vs', true, 2, NULL, '{"picante", "comida"}'),
('Si tuviéramos que atracar la casa de moneda y timbre, ¿quién sería el hacker?', 'habilidades', 'poll', true, 3, NULL, '{"atraco", "hacker"}'),
('Del 1 al 10, evalúa la capacidad de regatear precios de {member_A} en un mercadillo.', 'habilidades', 'scale', true, 2, NULL, '{"dinero", "regateo"}'),
('Si tuvieras que usar un arma blanca en el medievo, ¿cuál dominarías?', 'habilidades', 'mc', true, 2, ARRAY['Espada pesada', 'Arco y flecha', 'Una sarten de hierro fundido', 'Salir corriendo a la mínima'], '{"armas", "medievo"}'),

-- FUTURO 🔮
('¿Quién terminará viviendo en una granja rodeado de 20 perros, {member_A} o {member_B}?', 'futuro', 'vs', true, 2, NULL, '{"perros", "campo"}'),
('¿Quién será el primero en tener una crisis de los 40 y comprarse un coche deportivo?', 'futuro', 'poll', true, 3, NULL, '{"crisis", "coche"}'),
('Del 1 al 10, ¿cuánto miedo te da pensar en tener hijos?', 'futuro', 'scale', true, 2, NULL, '{"hijos", "futuro"}'),
('Describe cómo imaginas la boda de {member_A} dentro de unos años.', 'futuro', 'free', true, 2, NULL, '{"bodas", "futuro"}'),
('Ordena al grupo según quiénes serán los peores abuelos.', 'futuro', 'ranking', true, 4, NULL, '{"abuelos", "futuro"}'),
('En el año 2050, ¿qué parte de tu cuerpo dirás: "necesito que sea un robot porque ya no funciona"?', 'futuro', 'mc', true, 2, ARRAY['Las rodillas destrozadas', 'Mi espalda de 90 años', 'Mis ojos miopes', 'Mi memoria RAM'], '{"cuerpo", "cyborg"}'),
('¿Quién tardará más tiempo en independizarse económicamente, {member_A} o {member_B}?', 'futuro', 'vs', true, 2, NULL, '{"dinero", "independencia"}'),
('¿Quién será el primero en quedarse calvo/a o abusar del botox?', 'futuro', 'poll', true, 3, NULL, '{"estetica", "futuro"}'),

-- ATREVIDAS 🌶️ (is_anonymous=true)
('Si descubrieras que {member_A} tiene cuenta de OnlyFans, ¿te suscribirías en secreto?', 'atrevidas', 'vs', true, 2, NULL, '{"salseo", "online"}'),
('¿A quién del grupo ves más probable siendo infiel a su pareja y logrando esconderlo?', 'atrevidas', 'poll', true, 3, NULL, '{"salseo", "infidelidad"}'),
('Del 1 al 10, ¿cuánta tensión sexual no resuelta hay en este grupo en general?', 'atrevidas', 'scale', true, 3, NULL, '{"tension", "salseo"}'),
('Cuenta tu fetiche o rareza más extraña, pero descríbela sutilmente.', 'atrevidas', 'free', true, 3, NULL, '{"intimo", "secretos"}'),
('Ordena a las personas de la sala según lo "red flag" que son en una relación amorosa.', 'atrevidas', 'ranking', true, 4, NULL, '{"relaciones", "redflags"}'),
('¿Qué preferirías que nunca, jamás, nadie descubriese en tu historial de Google?', 'atrevidas', 'mc', true, 2, ARRAY['Búsquedas paranoicas sobre enfermedades', 'Búsquedas inapropiadas o "especiales"', 'Ex stalkeados nivel agente del FBI', 'Preguntas obvias y estúpidas'], '{"secretos", "historial"}'),
('¿Quién es más probable que intente robarle la pareja a su mejor amigo, {member_A} o {member_B}?', 'atrevidas', 'vs', true, 2, NULL, '{"salseo"}'),
('¿A quién le confiarías tus contraseñas si fueses a morir?', 'atrevidas', 'poll', true, 3, NULL, '{"confianza", "extremo"}'),
('Del 1 al 10, ¿cómo de "tóxico" crees que fuiste en tu última relación seria?', 'atrevidas', 'scale', true, 2, NULL, '{"toxicidad", "ex"}'),

-- HIPOTETICAS 🧠
('Si tuvieras que intercambiar cuerpos con {member_A} por 24 horas, ¿quién arruinaría más la vida del otro?', 'hipoteticas', 'vs', true, 2, NULL, '{"cuerpos", "caos"}'),
('Si tuviéramos que sacrificar a uno de nosotros para evitar el fin del mundo, ¿quién sería el elegido?', 'hipoteticas', 'poll', true, 3, NULL, '{"sacrificio", "amistad"}'),
('Del 1 al 10, ¿cuánto pánico sentirías si mañana despertaras en medio del océano?', 'hipoteticas', 'scale', true, 2, NULL, '{"miedo", "oceano"}'),
('Imagina que eres presidente del país. ¿Cuál sería tu primera ley absurda pero necesaria?', 'hipoteticas', 'free', true, 2, NULL, '{"politica", "absurdas"}'),
('Ordena al grupo desde el más probable de robar comida de la nevera en el trabajo hasta el que nunca lo haría.', 'hipoteticas', 'ranking', true, 4, NULL, '{"comida", "robo"}'),
('Si te diesen la oportunidad de conocer la fecha exacta de tu muerte, ¿la querrías saber?', 'hipoteticas', 'mc', true, 2, ARRAY['Sí, quiero organizarme bien la agenda', 'No, prefiero la sorpresa del final', 'Solo si puedo cambiarla a placer', 'Me daría un infarto del susto en un segundo'], '{"muerte", "filosofia"}'),
('¿Quién es más probable que sobreviva en los Juegos del Hambre: {member_A} o {member_B}?', 'hipoteticas', 'vs', true, 2, NULL, '{"supervivencia", "juegos"}'),

-- VINCULOS 💛
('¿Quién del grupo es el hombro perfecto en el que llorar en una crisis?', 'vinculos', 'poll', true, 3, NULL, '{"apoyo", "amistad"}'),
('¿Quién de los dos da peores consejos pero con mejor intención, {member_A} o {member_B}?', 'vinculos', 'vs', true, 2, NULL, '{"consejos", "amistad"}'),
('Del 1 al 10, ¿cómo evaluarías tu nivel de responsabilidad afectiva actual?', 'vinculos', 'scale', true, 2, NULL, '{"afecto", "responsabilidad"}'),
('Escribe lo primero que pensaste de {member_A} la primera vez que os cruzasteis.', 'vinculos', 'free', true, 2, NULL, '{"primeras_impresiones"}'),
('Ordena al grupo según su necesidad de recibir atención cuando cuenta un chiste (del más necesitado al más pasota).', 'vinculos', 'ranking', true, 4, NULL, '{"atencion", "chistes"}'),
('¿Cuál crees que es el mayor "defecto" perdonado de tu mejor amigo?', 'vinculos', 'mc', true, 2, ARRAY['Que es impuntual por naturaleza', 'Que nunca responde a los WhatsApp', 'Que es más terco que una mula', 'Que habla sin filtrar lo que dice'], '{"defectos", "amistad"}'),
('¿Quién olvidaría primero el cumpleaños de {member_A}, tú o {member_B}?', 'vinculos', 'vs', true, 2, NULL, '{"olvidos", "cumples"}'),
('¿A quién llamarías si necesitases 5000 euros para mañana mismo y estuvieras asustado?', 'vinculos', 'poll', true, 3, NULL, '{"dinero", "apuros"}'),

-- EVENTOS 🎉
('¿Quién la liaría más y haría el espectáculo si nos vamos de boda este mismo fin de semana, {member_A} o {member_B}?', 'eventos', 'vs', true, 2, NULL, '{"bodas", "descontrol"}'),
('¿Quién sería el más probable en irse sin despedirse a la francesa en una fiesta a las 3 de la mañana?', 'eventos', 'poll', true, 3, NULL, '{"fiestas", "despedidas"}'),
('Del 1 al 10, ¿cómo de intensa y espectacular quieres que sea la pedida de mano de tu boda?', 'eventos', 'scale', true, 2, NULL, '{"bodas", "pedida"}'),
('Si pudieras tener a cualquier cantante tocando en privado en tu próximo cumpleaños, ¿a quién llevarías?', 'eventos', 'free', true, 2, NULL, '{"musica", "conciertos"}'),
('Ordena al grupo desde el que es un peligro en Nochevieja hasta el que se acuesta a las 23:30.', 'eventos', 'ranking', true, 4, NULL, '{"nochevieja", "fiestas"}'),
('¿A qué tipo de evento nunca irías ni aunque te pagasen la entrada VIP?', 'eventos', 'mc', true, 2, ARRAY['Un concierto de música clásica', 'Una convención de política seria', 'A un festival de tecno barro', 'Un partido de curling'], '{"eventos", "rechazos"}'),
('¿Quién es de los dos bebe de forma más problemática en un evento elegante, {member_A} o {member_B}?', 'eventos', 'vs', true, 2, NULL, '{"alcohol", "eventos"}')

-- Añadimos más volumen a cada bloque
-- VOLUMEN EXTRA MEZCLADO
,('¿Quién ganaría corriendo los 100 metros lisos despúes de beber 3 cervezas, {member_A} o {member_B}?', 'habilidades', 'vs', true, 2, NULL, '{"deporte", "alcohol"}')
,('Si todos estuviéramos en una cárcel turca, ¿quién lloraría primero?', 'humor', 'poll', true, 3, NULL, '{"carcel", "lloros"}')
,('Del 1 al 10, ¿qué tan orgulloso estás de la carrera profesional que elegiste?', 'futuro', 'scale', true, 2, NULL, '{"orgullo", "trabajo"}')
,('Si el grupo se montara un podcast juntos mañana, ¿sobre qué puñetas acabaríamos discutiendo en el primer episodio?', 'humor', 'free', true, 3, NULL, '{"podcast", "discusion"}')
,('Ordena de más a menos a la persona con peor estilo vistiendo del grupo.', 'humor', 'ranking', true, 4, NULL, '{"estilo", "ropa"}')
,('Si la purga fuera real durante solo 12 horas, ¿qué sería lo primero que harías?', 'hipoteticas', 'mc', true, 2, ARRAY['Robar en el Corte Inglés', 'Hundirme en un búnker llorando', 'Hacer justicia con mis manos', 'Robar todos los billetes de un banco'], '{"purga", "caos"}')
,('¿Quién sería más capaz de salir con el hermano/hermana de {member_A} en secreto?', 'atrevidas', 'vs', true, 3, NULL, '{"hermanos", "traicion"}')
,('Del grupo, ¿quién crees que esconde el fetiche de asfixia más grande pero se hace el puritano?', 'atrevidas', 'poll', true, 3, NULL, '{"secretos", "fetiches"}')
,('Del 1 al 10, ¿cuánto crees que valoran tus padres realmente tu inteligencia?', 'vinculos', 'scale', true, 2, NULL, '{"padres", "inteligencia"}')
,('Cuenta algo que hiciste en la secundaria de lo cual prefieres no acordarte jamás.', 'humor', 'free', true, 2, NULL, '{"secundaria", "recuerdos"}')
,('Ordena de quién ganaría en una pelea física en un bar, del campeón al perdedor.', 'habilidades', 'ranking', true, 4, NULL, '{"pelea", "fuerza"}')
,('¿Qué comida comerías para siempre si solo pudieses escoger una?', 'habilidades', 'mc', true, 2, ARRAY['Tortilla de patatas con cebolla', 'Pizza con extra de todo y sin piña', 'Sushi variado', 'Hamburguesas llenas de queso cheddar'], '{"comida", "supervivencia"}')
,('¿A quién le confiarías conducir en una persecución contra la policía, a {member_A} o a {member_B}?', 'habilidades', 'vs', true, 2, NULL, '{"coches", "policia"}')
,('¿Quién tiene los peores gustos musicales cuando pone Spotify en el coche?', 'humor', 'poll', true, 3, NULL, '{"musica", "coches"}')
,('Del 1 al 10, evalúa el nivel de postureo de {member_A} en Instagram.', 'humor', 'scale', true, 2, NULL, '{"postureo", "instagram"}')
,('Mentira sobre tu vida amorosa que todos nos hemos intentado creer en algún momento.', 'vinculos', 'free', true, 2, NULL, '{"amor", "mentiras"}')
,('Ordena a la gente de este grupo de más a menos generoso cuando hay que pagar la cuenta del bar.', 'vinculos', 'ranking', true, 4, NULL, '{"dinero", "generosidad"}')
,('Si nos tocase la lotería colectivamente a todos mañana...', 'futuro', 'mc', true, 2, ARRAY['Compraríamos un chalet inmenso para todos vivir juntos', 'Acabaríamos a tortas por repartir el dinero', 'Nos olvidaríamos del trabajo en el mismo minuto', 'Lo invertiríamos e intentaríamos duplicarlo pero lo perderíamos'], '{"dinero", "loteria"}')
,('¿Quién lloraría primero viendo El Rey León, {member_A} o {member_B}?', 'vinculos', 'vs', true, 2, NULL, '{"sensibilidad", "lloros"}')
,('¿A quién preferirías dejarle encargado de tus hijos en caso de una catástrofe mundial?', 'vinculos', 'poll', true, 3, NULL, '{"confianza", "hijos"}')
,('Del 1 al 10, ¿cuánto odias que tardemos tanto en la app en elegir la próxima pregunta del juego?', 'humor', 'scale', true, 2, NULL, '{"app", "paciencia"}')
,('Di el nombre de alguien que ya no está en el grupo del que te alegras profundamente de no saber de él.', 'atrevidas', 'free', true, 3, NULL, '{"ex-amigos", "salseo"}')
,('Ordena al cuarto de quién huele mejor siempre a quién necesita desodorante.', 'humor', 'ranking', true, 4, NULL, '{"olores", "aseo"}')
,('Si mañana la gravedad desaparece de la tierra durante un segundo, ¿quién saldría peor parado?', 'hipoteticas', 'mc', true, 2, ARRAY['El que estaba volando en paracaídas', 'El gótico con botas pesadas de hierro', 'El oficinista concentrado', 'El perrito paseando'], '{"gravedad", "caos"}')
,('¿Quién de nosotros se pasaría horas debatiendo tonterías sobre política, {member_A} o {member_B}?', 'humor', 'vs', true, 2, NULL, '{"politica", "debate"}')
,('¿Quién tiene peor gusto a la hora de decidir el restaurante donde comer?', 'humor', 'poll', true, 3, NULL, '{"restaurantes", "critica"}')
,('Del 1 al 10, evalúa el estado actual de tu salud mental.', 'vinculos', 'scale', true, 2, NULL, '{"salud", "mente"}')
,('¿Qué secreto sabes de otra persona de aquí que juraste nunca sacar a la luz (cuéntalo discretamente)?', 'atrevidas', 'free', true, 3, NULL, '{"secretos", "traicion"}')
,('Ordena de más a menos probabilidades de ir la cárcel en un país extranjero.', 'futuro', 'ranking', true, 4, NULL, '{"carcel", "viajes"}')
,('Si pudieras aprender un idioma nuevo instantáneamente, ¿cuál sería?', 'habilidades', 'mc', true, 2, ARRAY['Japonés, solo para ver anime sin subtitulos', 'El ruso, para que te teman al hablar', 'Francés para impresionar románticamente', 'Latín, para invocar fantasmas en las iglesias'], '{"idiomas", "aprender"}')
,('¿A quién llevarías de copiloto en un rally extremo, a {member_A} o a {member_B}?', 'habilidades', 'vs', true, 2, NULL, '{"rally", "conducir"}')
,('¿Del grupo quién roba toallas en los hoteles sin ningún de remordimiento?', 'humor', 'poll', true, 3, NULL, '{"hoteles", "robos"}')
,('Del 1 al 10, ¿cuánto crees que {member_A} cambiaría si fuesen de la realeza británica?', 'hipoteticas', 'scale', true, 2, NULL, '{"realeza", "ego"}')
,('Dinos una excusa súper elaborada que usaste para no ir a un evento que te daba demasiada pereza.', 'eventos', 'free', true, 2, NULL, '{"excusas", "pereza"}')
,('Ordena la capacidad del grupo para mentir mirando directo a los ojos del más psicópata al más novato.', 'habilidades', 'ranking', true, 4, NULL, '{"mentiras", "psicopatas"}')
,('Si tuviesemos que asistir a un festival hoy mismo, ¿cuál sería tu vibra?', 'eventos', 'mc', true, 2, ARRAY['En primera de todo dándolo todo y sudando', 'Huyendo del ruido en la zona VIP', 'Buscando el sitio para comer un kebab tironero', 'Grabando vídeos de todo el escenario sin mirar'], '{"festivales", "vibra"}')
,('¿Quién será peor presidente del gobierno, {member_A} o {member_B}?', 'hipoteticas', 'vs', true, 2, NULL, '{"politica", "peores"}')
,('¿A quién no le fiarías ni cincuenta céntimos aunque te lo jure por su familia?', 'vinculos', 'poll', true, 3, NULL, '{"dinero", "desconfianza"}')
,('Del 1 al 10, evalúa el outfit de estilo ropero que trae hoy puesto {member_A}.', 'humor', 'scale', true, 2, NULL, '{"ropa", "estilo"}')
,('Cuéntanos la experiencia más fuerte o ridícula que has vivido en un probador de ropa.', 'humor', 'free', true, 2, NULL, '{"tiendas", "ropa"}')
,('Ordena de quién hace más drama por un resfriado a quién acude a Urgencias hasta por una uña rota.', 'humor', 'ranking', true, 4, NULL, '{"drama", "enfermedad"}')
,('Si pudieras borrar algo de tu pasado por completo...', 'futuro', 'mc', true, 2, ARRAY['Mi cuenta de fotolog o tuenti', 'A aquel chico/a que jugaba conmigo', 'El día que decidí cortarme así el pelo', 'Aquel resbalón épico delante de todo el mundo'], '{"pasado", "errores"}')
,('¿A quién sacrificarías si un asesino dice que o se va {member_A} o {member_B} o matan a todos?', 'atrevidas', 'vs', true, 3, NULL, '{"asesino", "lealtad"}')
,('¿Quién tarda más en prepararse y ducharse para salir de casa un sábado?', 'humor', 'poll', true, 3, NULL, '{"prepararse"}')
,('Del 1 al 10, ¿cómo de capaz te ves de ganar un combate contra un gorila de la plata?', 'habilidades', 'scale', true, 2, NULL, '{"gorila", "fuerza"}')
,('Si pudieses darle un consejo crítico a tu yo de hace 5 años, ¿qué le dirías con urgencia?', 'futuro', 'free', true, 2, NULL, '{"consejo", "pasado"}')
,('Ordena al grupo entero según cuántas fotos intimas tienen guardadas en su móvil.', 'atrevidas', 'ranking', true, 4, NULL, '{"fotos", "secretos"}')
,('¿En qué universo alternativo serías feliz?', 'hipoteticas', 'mc', true, 2, ARRAY['En uno donde comer tarta baje de peso', 'En uno donde dormir de dinero', 'En The Matrix pero con lujos VIP', 'En la tierra media combatiendo orcos'], '{"multiversos", "friki"}')
,('¿Cuál de los 2 es capaz de tragarse su orgullo para pedirte perdon: {member_A} o {member_B}?', 'vinculos', 'vs', true, 2, NULL, '{"orgullo", "perdon"}');
