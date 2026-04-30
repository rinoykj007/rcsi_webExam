# Architecture

## Overview

RCSI Prep Pro is a client-side React SPA backed by Supabase. There is no custom API server — all data access goes through the Supabase JS client directly from the browser.

```
Browser (React SPA)
    │
    ├─── Supabase Auth (email/password, Google OAuth)
    ├─── Supabase Database (PostgreSQL via PostgREST)
    └─── Supabase Storage (avatars — future)
```

## Frontend Layer

### Routing

React Router v6. All routes defined in `src/App.tsx`.

| Path | Component | Auth Required |
|------|-----------|:---:|
| `/` | `Splash` | No |
| `/login` | `Login` | No |
| `/signup` | `Signup` | No |
| `/forgot-password` | `ForgotPassword` | No |
| `/reset-password` | `ResetPassword` | No |
| `/home` | `Home` | Yes |
| `/progress` | `Progress` | Yes |
| `/schedule` | `Schedule` | Yes |
| `/station/:topicId` | `StationOverview` | Yes |
| `/quiz/:topicId` | `Quiz` | Yes |
| `/modules/infection-control` | `InfectionControl` | Yes |
| `/modules/acute-management` | `AcuteManagement` | Yes |
| `/modules/acute-management/:condition` | `AcuteCondition` | Yes |
| `/admin/import` | `ImportData` | Yes + Admin |

Protected routes wrap with `<ProtectedRoute>`. The admin import page additionally checks `useIsAdmin()`.

### State Architecture

```
┌─────────────────────────────────────────┐
│              Zustand Stores             │
│                                         │
│  useAuthStore          useProgressStore │
│  ─────────────         ──────────────── │
│  user                  topicScores      │
│  session               loadProgress()   │
│  profile               recordResult()   │
│  init()                                 │
│  signIn() / signOut()                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         TanStack Query Cache            │
│  (questions, flashcards, glossary,      │
│   scheduled tasks, weekly goals)        │
└─────────────────────────────────────────┘
```

**Zustand** manages auth session and quiz progress (low-frequency, global).
**TanStack Query** manages all server data (high-frequency, cacheable, per-user).

### Component Hierarchy

```
App.tsx
└── DashboardLayout (authenticated pages)
    ├── Sidebar
    └── <Outlet>
        ├── Home
        ├── Progress
        ├── Schedule
        ├── StationOverview
        │   └── GlossarySection
        ├── Quiz
        └── modules/...
```

### Data Flow — Quiz

```
Quiz.tsx
  │
  ├── useQuery → lib/data.ts:fetchQuestions(topicId)
  │               └── supabase.from('questions').select(...)
  │               └── fallback: data/questions.ts static bank
  │
  ├── Local state: currentIndex, answers, timer, mode
  │
  └── onComplete → useProgressStore.recordResult(topicId, correct, total)
                    └── supabase.upsert('topic_progress', ...)
```

### Data Flow — Progress Dashboard

```
Progress.tsx
  │
  ├── useProgressStore.topicScores (Zustand)
  │
  ├── useQuery → lib/data.ts:fetchFlashcardProgress(userId)
  │
  └── useQuery → lib/data.ts:fetchWeeklyGoal(userId)
```

## Backend Layer (Supabase)

### Authentication

- Supabase Auth handles sessions, JWTs, and OAuth.
- On sign-in, a `profiles` row is upserted for the user.
- Session is persisted in localStorage and auto-refreshed.

### Row-Level Security

All tables have RLS enabled. Key policies:

| Table | Read | Write |
|-------|------|-------|
| `questions` | Authenticated users | Admin only |
| `flashcards` | Authenticated users | Admin only |
| `glossary` | Authenticated users | Admin only |
| `topic_progress` | Own rows only | Own rows only |
| `flashcard_progress` | Own rows only | Own rows only |
| `scheduled_tasks` | Own rows only | Own rows only |
| `weekly_goals` | Own rows only | Own rows only |
| `profiles` | Own row only | Own row only |
| `user_roles` | Own row only | Admin only |

### Static Fallback

`src/data/questions.ts` serves as an offline/seed question bank. The quiz page falls back to it if Supabase returns zero questions for a topic.

## Key Design Decisions

**No custom backend** — Supabase PostgREST + RLS is sufficient for this app's query complexity and security requirements. Adding a custom API server is not needed.

**Zustand over Context** — Auth and progress are accessed by many components. Zustand avoids prop drilling and Context re-render issues.

**TanStack Query for server data** — Handles caching, loading/error states, and refetch on window focus automatically.

**shadcn/ui** — Provides accessible, unstyled Radix primitives styled with Tailwind. Preferred over external component libraries to keep bundle size low and customization high.

**Static question fallback** — Ensures the quiz is usable even when Supabase is unavailable or the database hasn't been seeded yet.
