# RCSI Prep Pro — Codex Instructions

## Project Overview

RCSI Prep Pro is a React + TypeScript + Supabase nursing exam preparation web app. Students use it to practice 14 clinical assessment stations via quizzes, flashcards, and study modules.

## Commands

```bash
npm run dev          # Dev server on :8080
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Vitest (run once)
npm run test:watch   # Vitest watch mode
```

## Path Aliases

`@/*` maps to `./src/*` — always use this for imports within `src/`.

## Key Directories

- `src/pages/` — Route components (one file per page)
- `src/components/ui/` — shadcn/ui components; prefer these over writing raw HTML
- `src/stores/` — Zustand stores (useAuthStore, useProgressStore)
- `src/integrations/supabase/` — Supabase client and auto-generated DB types
- `src/lib/data.ts` — All Supabase query functions
- `src/data/topics.ts` — 14 station definitions (id, label, color, description)
- `src/data/questions.ts` — Static question bank (fallback when DB unavailable)

## Supabase

- Client: `src/integrations/supabase/client.ts`
- Types: `src/integrations/supabase/types.ts` (auto-generated — do not edit manually)
- All DB queries go in `src/lib/data.ts`
- Authentication is managed by `src/stores/useAuthStore.ts`
- RLS is enabled — queries respect the logged-in user context

## State Management

- **Auth state** (`useAuthStore`): user, session, profile. Call `init()` once on app mount.
- **Progress state** (`useProgressStore`): per-topic quiz scores. Call `loadProgress(userId)` after login.
- Server state (questions, flashcards, schedules) uses TanStack Query — wrap in `useQuery`/`useMutation`.

## UI Conventions

- Use Tailwind utility classes; avoid custom CSS unless adding design tokens.
- RCSI color tokens are defined in `tailwind.config.ts`: `rcsi-navy`, `rcsi-green`, `rcsi-mint`, `rcsi-lavender`, `rcsi-peach`, `rcsi-purple`.
- Dark mode uses `next-themes`; use `dark:` Tailwind variants.
- Animations: use Framer Motion `motion.*` components; page-level transitions already in `App.tsx`.
- Toasts: use `sonner` (`toast.success`, `toast.error`) for user feedback.

## Forms

Use React Hook Form + Zod. Define a Zod schema, pass it to `zodResolver`, connect with `useForm`.

## Testing

Tests live in `src/test/`. Use Vitest + `@testing-library/react`. Mock Supabase client when needed.

## Admin Features

Admin pages are under `src/pages/admin/`. Gate with `useIsAdmin` hook. Admin role is stored in `user_roles` table.

## Adding a New Station Module

1. Create `src/pages/modules/MyModule.tsx`
2. Add a route in `App.tsx`
3. Update `studyModuleRoute()` in `src/data/topics.ts` to return the new route for the topic id
4. Replace the `ModulePlaceholder` component with the real content

## Adding Questions

Questions can be added via:
- The admin import page (`/admin/import`) using static seed data from `src/data/questions.ts`
- Direct Supabase SQL inserts following the `questions` table schema

## Environment

Requires `.env` with:
```
VITE_SUPABASE_URL
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_PUBLISHABLE_KEY
```
## Task Rules
- **Do not modify existing files or codes** 

