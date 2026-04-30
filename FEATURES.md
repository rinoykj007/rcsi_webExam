# Features & Roadmap

## Implemented

### Authentication
- [x] Email/password sign-up and login
- [x] Google OAuth sign-in
- [x] Forgot password / reset password flow
- [x] Persistent session (localStorage, auto-refresh)
- [x] User profile (name, avatar)
- [x] Admin role system

### Quiz Engine
- [x] MCQ format (4 options per question)
- [x] Practice mode (untimed, instant feedback)
- [x] Exam mode (10-minute timer per station)
- [x] Mock exam mode (30-minute timer)
- [x] Explanations/rationales after each answer
- [x] Question shuffling
- [x] Score summary with grade (Distinction / Merit / Pass / Fail)
- [x] Confetti celebration on 70%+ score
- [x] Per-topic score recording to database

### Study Stations (14 Total)
- [x] Infection Control
- [x] Fundamentals of Nursing
- [x] ISBAR Communication
- [x] Sepsis Management
- [x] Death & Dying
- [x] Wound Dressing
- [x] IV Infusion
- [x] Chest Infection
- [x] Oral Drug Administration
- [x] NOK Discussion
- [x] Older Person Care
- [x] Chronic Disease Management
- [x] Teaching Session
- [x] Acute Management

### Flashcards
- [x] Flip-card UI per station
- [x] Mark card as "known"
- [x] Per-user mastery tracking in database

### Glossary
- [x] Station-specific terminology
- [x] Accessible via StationOverview tabs

### Progress Dashboard
- [x] Overall accuracy donut chart
- [x] Per-station performance breakdown
- [x] Activity heatmap (days studied)
- [x] Flashcard mastery summary
- [x] Weekly goal setting (sessions per week)

### Study Scheduler
- [x] Calendar view
- [x] Add / edit / delete scheduled tasks
- [x] Task types: Quiz, Practice, Study Module, Flashcards
- [x] Task completion tracking
- [x] Color-coded task categories

### Study Modules (Deep Dives)
- [x] Infection Control module
- [x] Acute Management module (DKA, UTI, Delirium, Stoma, Compartment Syndrome)
- [ ] Fundamentals of Nursing module
- [ ] ISBAR Communication module
- [ ] Sepsis Management module
- [ ] Wound Dressing module
- [ ] IV Infusion module
- [ ] Oral Drug Administration module
- [ ] All other station modules

### Admin
- [x] Bulk import questions from static seed data
- [x] Bulk import flashcards
- [x] Clear existing data option
- [x] Self-grant admin role (first-time setup)

### UI / UX
- [x] Dark / light mode toggle
- [x] Responsive mobile-first layout
- [x] Sidebar navigation
- [x] Framer Motion page transitions
- [x] Toast notifications (success / error)
- [x] RCSI custom color system

---

## Planned / Not Started

### High Priority
- [ ] Study module content for remaining 12 stations
- [ ] Offline support / PWA capabilities
- [ ] Push notifications for scheduled study reminders
- [ ] Leaderboard / class comparison (optional, privacy-sensitive)

### Medium Priority
- [ ] Question reporting (flag incorrect/outdated questions)
- [ ] Bookmarked/saved questions
- [ ] Notes per question
- [ ] Spaced repetition algorithm for flashcards
- [ ] Export progress report (PDF)

### Low Priority
- [ ] Multi-language support
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] E2E tests (Playwright or Cypress)
- [ ] Custom quiz builder (pick topics + question count)

---

## Known Issues / Tech Debt

- `tsconfig.json` has relaxed type checking (`noImplicitAny: false`) — tighten incrementally
- Study modules for most stations show `ModulePlaceholder` — need real content
- Test coverage is minimal — only a placeholder test exists
- Supabase migrations are not yet committed to `supabase/migrations/`
- No `.env.example` file exists (should be added)
