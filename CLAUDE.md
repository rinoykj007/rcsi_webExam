# RCSI Prep Pro — Claude Code Instructions

## Project Overview

RCSI Prep Pro is a React + TypeScript + Supabase nursing exam preparation web app. Students use it to practice 14 clinical assessment stations via quizzes, flashcards, and study modules.
check this website for more info https://www.rcsi.com/dublin/about/faculty-of-nursing-and-midwifery/education/overseas-aptitude-test/preparation#panele96714bff84d4485995a110c8bb64ab3
The RCSI Faculty of Nursing and Midwifery (FNM) Aptitude Test is a specialized evaluation for internationally trained nurses who want to register and practice in the Republic of Ireland.  Here is a breakdown of what the exam is, its core purpose, and its strategic aims.What is the RCSI Exam?Administered by the Royal College of Surgeons in Ireland (RCSI) on behalf of the Nursing and Midwifery Board of Ireland (NMBI), this exam acts as a assessment gateway. When an overseas nurse applies for registration, the NMBI reviews their qualifications. If there are minor gaps between the applicant's training and Irish education standards, the NMBI issues a decision letter requiring a "compensation measure."  The RCSI Aptitude Test is one of the two pathways to fulfill this requirement (the other being a workplace-based Adaptation and Assessment Programme).  The exam is conducted over two separate parts in Dublin:  Part 1 (Theory Test): A 3-hour, supervised online exam consisting of 150 Multiple Choice Questions (MCQs). Candidates must achieve a minimum score of 50% to pass.  Part 2 (Practical Test): An OSCE (Objective Structured Clinical Examination) consisting of 14 to 20 simulated clinical stations. Each station lasts 10 minutes, where candidates perform specific tasks on mannequins or actors. You must demonstrate competence in all tested clinical competencies to pass.  Purpose of the ExamThe primary purpose of the RCSI Aptitude Test is to assess whether an internationally trained nurse possesses the equivalent knowledge, clinical skills, and professional attributes required of a newly qualified, registered general (or psychiatric) nurse in Ireland.  Instead of evaluating your ability to work in one specific hospital or specialized department, it measures your readiness to safely step into the broader Irish healthcare system as an accountable, independent practitioner
Day 1 (Theory): A 3-hour, 150-question Multiple Choice Question (MCQ) exam covering general nursing knowledge, professional code of conduct, and Irish healthcare protocols.  Day 2 (Practical): An OSCE (Objective Structured Clinical Examination) consisting of 14 to 20 practical stations (using mannequins or actors) where you are tested on clinical skills like medication preparation, infection control, blood transfusion administration, and wound care.  


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

