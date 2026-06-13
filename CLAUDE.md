# RCSI Prep Pro — Claude Code Instructions

## Project Overview

RCSI Prep Pro is a React + TypeScript + Supabase + Firebase nursing exam preparation web app. Students practice 14 clinical assessment stations via quizzes, flashcards, and deep-dive study modules. The data layer uses Firebase as primary source, Supabase as cache/persistence, and static local files as final fallback.

---

## Commands

```bash
npm run dev          # Dev server on :8080
npm run build        # Production build
npm run build:dev    # Development build (includes source maps)
npm run lint         # ESLint check
npm run preview      # Preview production build locally
npm run test         # Vitest (run once)
npm run test:watch   # Vitest watch mode
```

---

## Path Aliases

`@/*` maps to `./src/*` — always use this for imports within `src/`.

---

## Key Directories

```
src/
├── pages/              # Route components (29 files)
│   ├── admin/          # Admin-only pages (gated by useIsAdmin)
│   ├── modules/        # Deep-dive station study modules
│   ├── practical/      # Practical station views (overview/steps/cards/quiz/compare)
│   └── station/        # Standard station views (overview/steps/cards/quiz/compare)
├── components/
│   ├── ui/             # shadcn/ui components — always prefer over raw HTML
│   ├── layout/         # DashboardLayout, Sidebar
│   ├── station/        # Flashcard, Step, Timeline components
│   └── animations/     # FadeIn, PageEnter, ScaleIn, StaggerContainer, LoadingSpinner
├── stores/             # Zustand stores (useAuthStore, useProgressStore, useRewardsStore)
├── integrations/
│   └── supabase/       # client.ts + types.ts (auto-generated — never edit types.ts manually)
├── lib/
│   ├── data.ts         # All DB query functions (Firebase → Supabase → local fallback)
│   ├── firebase.ts     # Firebase/Firestore client config
│   ├── quiz.ts         # Quiz utilities: grade(), shuffle(), formatTime()
│   └── utils.ts        # General utilities (cn, etc.)
├── data/
│   ├── topics.ts       # 14 station definitions + getTopicById() + studyModuleRoute()
│   ├── questions.ts    # Static question bank (fallback only — ~5 questions per topic)
│   ├── infectionControlContent.ts  # Full content for Infection Control module
│   ├── fonContent.ts               # Fundamentals of Nursing content
│   └── isbarContent.ts             # ISBAR Communication content
├── hooks/
│   ├── useIsAdmin.ts   # Checks user_roles table; gate admin pages with this
│   ├── useTheme.ts     # next-themes wrapper
│   ├── use-mobile.tsx  # Responsive breakpoint hook
│   └── use-toast.ts    # Toast hook (from shadcn)
└── test/
    ├── setup.ts
    └── example.test.ts
```

---

## Routing Structure

Routes are defined in `src/App.tsx`. All protected routes require authentication (wrapped in `ProtectedRoute`).

| Path | Component | Notes |
|------|-----------|-------|
| `/login` | Login | Email/password + Google OAuth |
| `/signup` | Signup | |
| `/forgot-password` | ForgotPassword | |
| `/reset-password` | ResetPassword | |
| `/` | Home | Dashboard — protected |
| `/progress` | Progress | Analytics dashboard |
| `/schedule` | Schedule | Calendar + event scheduler |
| `/question-bank` | QuestionBank | Browse all questions |
| `/quiz/mock` | Quiz | 30-min timed mock exam (all topics) |
| `/quiz/:topicId` | Quiz | Topic-specific quiz |
| `/station/:topicId` | StationOverview | Standard station |
| `/station/:topicId/steps` | StationSteps | |
| `/station/:topicId/cards` | StationCards | Flashcards |
| `/station/:topicId/quiz` | StationQuiz | |
| `/station/:topicId/compare` | StationCompare | |
| `/screens/practical/:topicId/*` | Practical* | Practical view variants |
| `/screens/infection-control` | InfectionControl | Deep-dive module |
| `/screens/fon` | FundamentalsOfNursing | Deep-dive module |
| `/screens/isbar` | ISBARCommunication | Deep-dive module |
| `/screens/acuteManagement` | AcuteManagement | Index |
| `/screens/acuteManagement/:conditionId` | AcuteCondition | |
| `/admin/import` | ImportData | Admin only |
| `/~oauth/*` | — | Supabase PKCE internal |

---

## 14 Clinical Stations

Defined in `src/data/topics.ts`:

| `id` | Label | `station_id` |
|------|-------|-------------|
| `infection_control` | Infection Control | 1 |
| `fundamentals` | Fundamentals of Nursing | 2 |
| `isbar` | ISBAR Communication | 3 |
| `sepsis` | Sepsis Management | 4 |
| `death_dying` | Death & Dying | 5 |
| `wound_dressing` | Wound Dressing | 6 |
| `iv_infusion` | IV Infusion | 7 |
| `chest_infection` | Chest Infection | 8 |
| `oral_drug` | Oral Drug Administration | 9 |
| `nok_discussion` | NOK Discussion | 10 |
| `older_person` | Older Person Care | 11 |
| `chronic_disease` | Chronic Disease | 12 |
| `teaching` | Teaching Session | 13 |
| `acute_management` | Acute Management | 14 |

Helper functions in `topics.ts`:
- `getTopicById(id)` — returns Topic or undefined
- `studyModuleRoute(topicId)` — returns the deep-dive `/screens/*` path for that topic

---

## Data Layer — Firebase → Supabase → Local

All query functions live in `src/lib/data.ts`. The hierarchy is:

1. **Firebase** (primary) — Firestore project `rcsiexam`, collection `questions/{topicId}/items`. Has 200+ questions across all 14 topics.
2. **Supabase** (secondary) — `questions` table. Used when Firebase is unavailable or for cached writes.
3. **Local static** (fallback) — `src/data/questions.ts`. ~5 placeholder questions per topic for dev/demo.

Key functions:

```typescript
fetchQuestions(topicId: string): Promise<Question[]>
fetchAllQuestions(limit?: number): Promise<Question[]>   // shuffled, used for mock exam
fetchStationOverview(stationId: number): Promise<StationOverviewData | null>
fetchFlashcards(topicId: string): Promise<DbFlashcard[]>
markFlashcardKnown(userId, flashcardId, known: boolean): Promise<void>
fetchUserFlashcardProgress(userId: string): Promise<FlashcardProgress[]>
fetchGlossary(topicId: string): Promise<GlossaryTerm[]>
```

---

## Supabase

- Client: `src/integrations/supabase/client.ts`
- Types: `src/integrations/supabase/types.ts` — **auto-generated, never edit manually**
- RLS is enabled — all queries run in the context of the logged-in user

**Database Tables:**

| Table | Purpose |
|-------|---------|
| `profiles` | User display name, avatar |
| `user_roles` | `role` column — `admin` for admin access |
| `questions` | MCQ bank (topic_id, tag, question, options[], correct, explanation) |
| `flashcards` | topic_id, front, back |
| `flashcard_progress` | user_id, flashcard_id, known, reviewed_at |
| `glossary` | topic_id, term, definition |
| `topic_progress` | user_id, topic_id, correct, total, last_studied |
| `user_rewards` | user_id, total_points, badges (JSON) |
| `weekly_goals` | user_id, sessions_per_week |
| `scheduled_tasks` | user_id, title, scheduled_date, completed, icon, color, duration_min |
| `station_overviews` | Cached station content |

---

## State Management

Three Zustand stores; TanStack Query for server state.

### useAuthStore (`src/stores/useAuthStore.ts`)
- State: `user`, `session`, `profile`, `loading`
- Call `init()` once on app mount — sets up Supabase auth listener
- Methods: `signIn(email, password)`, `signUp(email, password, name)`, `signOut()`
- Syncs profile from `profiles` table on sign-in; handles Google OAuth metadata

### useProgressStore (`src/stores/useProgressStore.ts`)
- State: `performance: Record<topicId, { correct, total, last_studied }>`
- Call `load(userId)` after login
- `recordResult(userId, topicId, correct, total)` — upserts to `topic_progress`
- Getters: `totalCorrect()`, `totalAnswered()`, `overallPct()`

### useRewardsStore (`src/stores/useRewardsStore.ts`)
- State: `totalPoints`, `badges: Badge[]`
- Call `load(userId)` after login
- `addPoints(userId, points)` — 10 pts per correct answer
- `awardBadge(userId, badgeId)` — static badge definitions (first_quiz, perfect_score, streak_3, per-topic mastery at 80%+, module completion)
- `hasBadge(badgeId)` — for conditional UI

**Server state** (questions, flashcards, schedules) — wrap calls from `src/lib/data.ts` in `useQuery`/`useMutation` from TanStack Query.

---

## UI Conventions

- Use Tailwind utility classes; avoid custom CSS unless adding design tokens.
- RCSI color tokens in `tailwind.config.ts`:
  - `rcsi-navy`, `rcsi-green`, `rcsi-mint`
  - `rcsi-lavender`, `rcsi-lavender-light`
  - `rcsi-yellow`, `rcsi-peach`
  - `rcsi-purple`, `rcsi-purple-soft`
- Font families: `font-sans` (Inter) and `font-display` (Plus Jakarta Sans)
- Dark mode via `next-themes`; use `dark:` Tailwind variants everywhere
- Animations: use `motion.*` from Framer Motion; page-level transitions already in `App.tsx`
  - Primitives in `src/components/animations/`: `FadeIn`, `PageEnter`, `ScaleIn`, `StaggerContainer`
- Toasts: `toast.success()` / `toast.error()` from `sonner`
- Layout: `DashboardLayout` wraps all protected pages; mobile uses bottom nav, desktop uses sidebar

---

## Forms

Use React Hook Form + Zod:
1. Define a Zod schema
2. Pass to `zodResolver`
3. Connect with `useForm`
4. Use `<Form>`, `<FormField>`, `<FormItem>` from `src/components/ui/form.tsx`

---

## Testing

Tests live in `src/test/`. Use Vitest + `@testing-library/react`.

- Mock Supabase client when testing components that query the DB
- Config: `vitest.config.ts`
- Environment: jsdom

---

## Admin Features

Admin pages under `src/pages/admin/`. Gate with `useIsAdmin` hook — checks `user_roles` table for `role = 'admin'`.

**ImportData page (`/admin/import`):**
- Firebase bulk import — pulls 200+ questions from Firestore into Supabase `questions` table; optional wipe before import; real-time progress log
- Local seed import — seeds placeholder questions from `src/data/questions.ts`
- Flashcard seeding — seeds 6 flashcards per topic (from inline `FLASHCARD_SEED` in the page)
- "Grant me admin" button for first-time setup

---

## Adding a New Station Module

1. Create `src/pages/modules/MyModule.tsx` (copy `ModulePlaceholder.tsx` as starter)
2. Add content data in `src/data/myModuleContent.ts` following the pattern of `infectionControlContent.ts`
3. Add a route in `App.tsx` under the protected routes
4. Update `studyModuleRoute()` in `src/data/topics.ts` to return the new route for the topic id

Currently implemented modules:
- `InfectionControl` → `/screens/infection-control`
- `FundamentalsOfNursing` → `/screens/fon`
- `ISBARCommunication` → `/screens/isbar`
- `AcuteManagement` / `AcuteCondition` → `/screens/acuteManagement`
- All other topics → `ModulePlaceholder`

---

## Adding Questions

Questions can be added via:
- The admin import page (`/admin/import`) — Firebase sync (200+ questions) or local seed
- Direct Supabase SQL inserts following the `questions` table schema
- Firebase Firestore — add to `questions/{topicId}/items` collection in the `rcsiexam` project

**Question shape:**
```typescript
interface Question {
  id: string;
  topicId: string;
  tag: string;              // e.g. "Hand Hygiene"
  question: string;
  options: { key: "A"|"B"|"C"|"D"; text: string }[];
  correct: number;          // 0-based index
  explanation: string;
  image_url?: string | null;
}
```

---

## Environment

Requires `.env` with:
```
VITE_SUPABASE_URL
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_PUBLISHABLE_KEY
```

Firebase config is hardcoded in `src/lib/firebase.ts` (public API keys, not secrets).

---

## Build & Tooling

- **Bundler:** Vite 5 + `@vitejs/plugin-react-swc` (SWC for fast TS compilation)
- **Dev server:** `localhost:8080`, `host: "::"`, HMR overlay disabled
- **Lovable integration:** `componentTagger()` plugin active in development mode only
- **TypeScript:** `noImplicitAny: false`, `strictNullChecks: false`, `skipLibCheck: true` — the codebase is pragmatically typed
- **Path alias:** `@` → `./src` in both Vite and TSConfig
