# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Backend / DB**: Supabase (Auth + PostgreSQL + Realtime) — single client in `src/lib/supabase.ts`
- **Mobile**: Capacitor v8 (Android wrapper; `CAPACITOR_BUILD=true` switches Next.js to static export)
- **AI**: Google Generative AI (`@google/generative-ai`) — Gemini, see `src/lib/gemini.ts`
- **Deployment**: Vercel + GitHub Actions cron jobs

## Commands

```bash
npm run dev          # local dev (Turbopack enabled)
npm run build        # production build
npm run lint         # ESLint
npm run deploy       # vercel --prod --yes
npm run deploy:preview  # vercel --yes (preview URL)
npm run build:mobile # static export + cap sync android (Capacitor)
supabase db push     # apply migrations — always remind user after migration changes
```

## Architecture

### Data Layer — `src/lib/services.ts`
All Supabase queries are centralised here as typed service objects: `profileService`, `groupService`, `pollService`, `commentService`, `summaryService`, `questionService`, `nudgeService`, `survivalService`. Pages import from this file, not from `src/lib/supabase.ts` directly.

`QuestionMode` union (`'vs' | 'poll' | 'mc' | 'scale' | 'free' | 'ranking' | 'pool' | 'boolean' | 'ranked'`) and all domain types (`Poll`, `Question`, `Group`, etc.) live in this file — import types from here.

### Routing — `src/app/`
All pages are **Client Components** (`'use client'`) because they depend on `useAuth`. Route structure:
- `/` — group list / home
- `/groups/[id]` — group detail + poll launch
- `/poll/[id]` — active poll voting
- `/explore`, `/leaderboard`, `/profile` — social/gamification screens
- `/api/groups/[id]/audit` — Gemini AI summary endpoint
- `/api/cron/summary` — GitHub Actions cron target (protected by `CRON_SECRET`)
- `/auth/callback` — Supabase OAuth callback

### Components — `src/components/`
- `ui.tsx` — shared primitives (`BottomNav`, `Avatar`, `EmptyState`, `LoadingScreen`, `SectionTitle`)
- `NativeProvider.tsx` — Capacitor platform detection wrapper
- `NudgeListener.tsx` — Supabase Realtime subscription for nudge notifications
- `onboarding-carousel.tsx` — first-run flow
- `PageTransition.tsx` — Framer Motion page wrapper

### Mobile build
`next.config.ts` detects `CAPACITOR_BUILD=true` and switches to `output: "export"` with `trailingSlash: true` and unoptimized images. Never use Next.js server features (API routes, middleware) in code paths that run during the mobile build.

### Database / Migrations
Migrations live in `supabase/migrations/` ordered by timestamp. The authoritative schema snapshot is `supabase/schema.sql`. After any migration file change, run `supabase db push`. RLS policies must use `auth.uid()` directly — never subqueries referencing the same table (causes recursion).

### Gamification
`pollService.castVote` updates streak (`current_streak`) and adds 10 points inline after inserting a vote. Prediction resolution adds 50 points to winners. Keep point logic here, not in the DB.

### AI Summaries
`src/app/api/groups/[id]/audit/route.ts` calls Gemini to generate group audit summaries. The cron job at `/api/cron/summary` is triggered by GitHub Actions (`.github/workflows/automated-audits.yml`) and requires `CRON_SECRET` header.

## Key Conventions

- App Router only — never Pages Router.
- `'use client'` on any component using hooks or events. Server Components only when no interactivity.
- UI: dark-mode first, Framer Motion for animations, Tailwind CSS v4 custom values via CSS variables in `globals.css` — no raw Tailwind color names like `red-500`.
- `cn()` from `src/lib/utils.ts` for conditional class merging (`clsx` + `tailwind-merge`).
- Supabase client: `createClient` singleton in `src/lib/supabase.ts` — used in both client and server contexts. For Route Handlers use the same singleton (project does not use `auth-helpers` server variants).
- Questions use template placeholders `{member_A}`, `{member_B}`, `{group_name}`, `{member_count}` resolved at poll creation via `questionService.renderQuestion`.
