# AuditUs — Gemini / Antigravity Project Rules

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS v4 + Framer Motion (animaciones premium)
- **Backend / DB**: Supabase (Auth + PostgreSQL + Storage + Realtime)
- **Mobile**: Capacitor v8 (Android wrapper sobre Next.js)
- **AI**: Google Generative AI (`@google/generative-ai`) — modelo Gemini
- **Deployment**: Vercel (`vercel --prod`) + GitHub Actions (cron jobs)
- **Notifications**: Web Push (`web-push`)

---

## Reglas del Proyecto

### Base de Datos — Supabase
- Siempre que crees o modifiques archivos en `supabase/migrations/`, es **obligatorio** recordar al usuario que ejecute `supabase db push` o lo aplique desde el panel de Supabase.
- Las políticas RLS deben evitar recursión infinita. Usar `auth.uid()` directamente; nunca subconsultas que referencien la misma tabla en la política.
- Usar `security definer` solo cuando sea estrictamente necesario y documentarlo con un comentario SQL.
- El cliente de Supabase en el servidor: `createServerComponentClient` o `createRouteHandlerClient`. En el cliente: `createClientComponentClient`.

### Frontend — Next.js / React
- Usar App Router exclusivamente. Nunca Pages Router.
- Separar claramente Server Components (fetch de datos, sin interactividad) de Client Components (hooks, eventos, estado local).
- Marcar `'use client'` solo donde haya interactividad real — no por defecto.
- Preferir `import type` para los tipos cuando no se necesitan en runtime.
- Componentes en `src/components/`, páginas en `src/app/`.

### UI / UX — Diseño Premium
- **Aesthetic First**: Mantener siempre un diseño premium, dark-mode por defecto, moderno y minimalista.
- Usar Framer Motion para transiciones y micro-animaciones. Evitar CSS puro para animaciones complejas.
- Paleta monocromática con acentos vibrantes definidos en `globals.css` como CSS variables.
- No usar colores planos (red-500, blue-500). Usar valores personalizados calibrados con HSL.
- Tipografía: `Inter` o `Outfit` desde Google Fonts. Nunca fuentes del sistema por defecto.
- Cada interfaz debe causar impresto visual inmediato — si parece básica, no está lista.

### Mobile — Capacitor
- El build mobile se ejecuta con `npm run build:mobile` (`CAPACITOR_BUILD=true next build && npx cap sync android`).
- Usar `@capacitor/haptics` para feedback táctil en acciones importantes.
- Comprobar `Capacitor.isNativePlatform()` antes de invocar cualquier API nativa.

### Despliegue
- Producción: `vercel --prod` o `npm run deploy`.
- Preview: `vercel --yes` o `npm run deploy:preview`.
- Variables de entorno sensibles: nunca en código fuente. Usar `.env.local` (local) y Vercel Environment Variables (producción).

### GitHub Actions
- Los cron jobs (resúmenes de auditorías, preguntas automáticas) se definen en `.github/workflows/`.
- El `CRON_SECRET` debe estar como GitHub Secret **y** como Vercel Environment Variable.
- Al crear o modificar cualquier workflow, recordar al usuario que sincronice los secrets en ambos lados.

---

## Skills Instalados

| Skill | Fuente | Propósito |
|---|---|---|
| `find-skills` | vercel-labs/skills | Descubrir e instalar nuevos skills |
| `vercel-react-best-practices` | vercel-labs/agent-skills | Patrones React/Next.js de Vercel |
| `web-design-guidelines` | vercel-labs/agent-skills | Guías de diseño web moderno |
| `vercel-composition-patterns` | vercel-labs/agent-skills | Composición de componentes Next.js |
| `next-best-practices` | vercel-labs/next-skills | Best practices específicas de Next.js |
| `deploy-to-vercel` | vercel-labs/agent-skills | Flujo de despliegue en Vercel |
| `frontend-design` | anthropics/skills | Diseño frontend de alta calidad |
| `ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill | UX/UI avanzado y accesibilidad |
| `supabase` | supabase/agent-skills | Integración completa con Supabase |
| `supabase-postgres-best-practices` | supabase/agent-skills | PostgreSQL + RLS + migraciones |
| `building-native-ui` | expo/skills | UI nativa para Capacitor/mobile |
| `github-actions-docs` | xixu-me/skills | Documentación y workflows de CI/CD |

---

## Comandos Frecuentes

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Deploy a Vercel (producción)
npm run deploy

# Aplicar migraciones de Supabase
supabase db push

# Build mobile (Android)
npm run build:mobile
```
