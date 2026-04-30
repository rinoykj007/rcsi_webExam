# Database

RCSI Prep Pro uses Supabase (PostgreSQL). All migrations live in `supabase/migrations/`.

## Tables

### `profiles`

Stores public user information. Auto-created on first sign-in.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | FK → `auth.users.id` |
| `name` | `text` | Display name |
| `avatar_url` | `text` | Profile picture URL |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

### `questions`

Quiz question bank. Seeded via admin import page.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `topic_id` | `text` | Matches topic id from `src/data/topics.ts` |
| `tag` | `text` | Subtopic label |
| `question` | `text` | Question stem |
| `options` | `text[]` | Array of 4 answer choices |
| `correct` | `int4` | Index of correct option (0-3) |
| `explanation` | `text` | Rationale shown after answering |
| `image_url` | `text` | Optional image URL |

### `topic_progress`

Tracks per-user quiz performance per station. Upserted after each quiz.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `auth.users.id` |
| `topic_id` | `text` | Station id |
| `correct_count` | `int4` | Cumulative correct answers |
| `total_count` | `int4` | Cumulative questions answered |
| `last_studied` | `timestamptz` | Last quiz completion time |

Unique constraint on `(user_id, topic_id)`.

### `flashcards`

Study flashcards per station. Seeded via admin import page.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `topic_id` | `text` | Station id |
| `front` | `text` | Question/prompt side |
| `back` | `text` | Answer side |
| `created_at` | `timestamptz` | |

### `flashcard_progress`

Tracks whether a user has marked each flashcard as "known".

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `auth.users.id` |
| `flashcard_id` | `uuid` | FK → `flashcards.id` |
| `known` | `bool` | User marked as mastered |
| `reviewed_at` | `timestamptz` | Last review time |

Unique constraint on `(user_id, flashcard_id)`.

### `glossary`

Station-specific terminology definitions.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `topic_id` | `text` | Station id |
| `term` | `text` | Glossary term |
| `definition` | `text` | Plain-text definition |

### `scheduled_tasks`

User's study schedule entries shown on the Schedule calendar.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `auth.users.id` |
| `title` | `text` | Task name |
| `icon` | `text` | Emoji or icon string |
| `color` | `text` | Tailwind color class |
| `scheduled_date` | `date` | Calendar date |
| `time` | `text` | Time string (e.g. "09:00") |
| `duration` | `int4` | Duration in minutes |
| `route` | `text` | App route to navigate to |
| `completed` | `bool` | Completion status |

### `weekly_goals`

Per-user weekly study targets.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `auth.users.id` (unique) |
| `sessions_per_week` | `int4` | Target number of sessions |
| `updated_at` | `timestamptz` | |

### `user_roles`

Role assignments for admin access control.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `auth.users.id` |
| `role` | `enum` | `'admin'` or `'user'` |

## Row-Level Security

RLS is enabled on all tables. The general pattern:

```sql
-- Users can only read/write their own rows
CREATE POLICY "user_owns_row" ON topic_progress
  USING (auth.uid() = user_id);

-- Questions are readable by all authenticated users
CREATE POLICY "authenticated_read" ON questions
  FOR SELECT USING (auth.role() = 'authenticated');
```

## Seeding Data

Use the admin import page at `/admin/import` to bulk-load:
- Questions from `src/data/questions.ts`
- Flashcards from static seed data

To grant yourself admin access for the first time:
1. Sign in to the app
2. Navigate to `/admin/import`
3. Click "Grant Admin Access" (available when no admin exists)

## Type Generation

Supabase types in `src/integrations/supabase/types.ts` are auto-generated. To regenerate after schema changes:

```bash
npx supabase gen types typescript --project-id <project-id> > src/integrations/supabase/types.ts
```

Do not edit `types.ts` manually.
