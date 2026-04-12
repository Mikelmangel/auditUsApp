# AuditUs - Gemini/Antigravity Project Rules

- **Recordatorio de Migraciones**: Siempre que realices cambios en el esquema de la base de datos o crees archivos en `supabase/migrations`, es obligatorio incluir un recordatorio para que el usuario ejecute la migración mediante `supabase db push` o en el panel de Supabase.
- **Despliegue en Vercel**: Si los cambios deben verse en producción, recuerda al usuario ejecutar `vercel --prod`.
- **GitHub Secrets**: Las automatizaciones (preguntas/resúmenes) se gestionan desde GitHub Actions. Es vital añadir el `CRON_SECRET` en los Secrets del repositorio de GitHub para que las tareas programadas funcionen.
- **Aesthetic First**: Mantener siempre un diseño premium y moderno en todas las interfaces, siguiendo las mejores prácticas de UI/UX.
