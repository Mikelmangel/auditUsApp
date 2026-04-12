# AuditUs - Claude Project Rules

- **Supabase Migrations**: Siempre que se cree una nueva migración en el directorio `supabase/migrations`, recuerda al usuario que debe ejecutarla en su panel de Supabase o a través del CLI (`supabase db push`) para que los cambios en la base de datos se apliquen correctamente.
- **Despliegue en Vercel**: Si los cambios deben verse en producción, recuerda al usuario ejecutar `vercel --prod`.
- **GitHub Secrets**: Las automatizaciones (preguntas/resúmenes) se gestionan desde GitHub Actions. Es vital mantener sincronizado el `CRON_SECRET` en GitHub Secrets.
- **Aesthetic First**: Mantener siempre un diseño premium y moderno en todas las interfaces, siguiendo las mejores prácticas de UI/UX.
