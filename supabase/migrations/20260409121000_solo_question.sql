INSERT INTO public.questions (text, poll_type, category, language, min_members) VALUES
('¿Verdad que estar solo probando la app en el grupo de {group_name} es un poco triste?', 'pool', 'humor', 'es', 1),
('¿Quién es la única persona asombrosa que hay ahora mismo en el grupo?', 'pool', 'humor', 'es', 1)
ON CONFLICT DO NOTHING;
