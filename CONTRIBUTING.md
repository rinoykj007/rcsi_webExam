# Contributing

## Development Setup

```bash
git clone <repo-url>
cd rcsi-prep-pro-main
npm install
cp .env.example .env   # fill in Supabase credentials
npm run dev
```

App runs on `http://localhost:8080`.

## Code Conventions

### TypeScript

- Strict mode is relaxed (`noImplicitAny: false`) but prefer explicit types for function signatures and exported values.
- Always use the `@/*` path alias for imports from `src/`. Never use relative `../../` paths.

```ts
// Good
import { fetchQuestions } from '@/lib/data'

// Bad
import { fetchQuestions } from '../../lib/data'
```

### Components

- One component per file. File name matches the component name (PascalCase).
- Use shadcn/ui components from `src/components/ui/` wherever possible — don't write raw `<input>` or `<button>` HTML.
- Keep pages lean: data-fetching and logic in hooks/stores, rendering in the component.
- Prefer named exports over default for components used across multiple files.

### Styling

- Tailwind utility classes only. No new `.css` files unless adding design tokens.
- Use RCSI color tokens: `rcsi-navy`, `rcsi-green`, `rcsi-mint`, `rcsi-lavender`, `rcsi-peach`, `rcsi-purple`.
- Always add `dark:` variants when using background or text colors.

### State

- Global/cross-page state → Zustand store in `src/stores/`
- Server data → TanStack Query (`useQuery` / `useMutation`)
- Local UI state → `useState` / `useReducer` inside the component

### Forms

Use React Hook Form + Zod. Define schema first, then wire to `useForm`.

```ts
const schema = z.object({ email: z.string().email() })
const form = useForm({ resolver: zodResolver(schema) })
```

### Supabase Queries

All Supabase queries live in `src/lib/data.ts`. Do not call `supabase` directly from page components.

## Adding Features

### New Page

1. Create `src/pages/MyPage.tsx`
2. Add a route in `src/App.tsx` (wrap with `<ProtectedRoute>` if auth required)
3. Add a sidebar link in `src/components/layout/Sidebar.tsx` if it's a primary nav item

### New Study Module

1. Create `src/pages/modules/MyModule.tsx`
2. Add a route in `src/App.tsx`
3. Update `studyModuleRoute()` in `src/data/topics.ts` to return the route for the relevant topic id

### New Supabase Table

1. Write a migration SQL file in `supabase/migrations/`
2. Run `npx supabase db push`
3. Regenerate types: `npx supabase gen types typescript --project-id <id> > src/integrations/supabase/types.ts`
4. Add query functions to `src/lib/data.ts`

### New UI Component

- If it's a general-purpose primitive, add it to `src/components/ui/`
- If it's domain-specific (e.g., quiz card), add it to `src/components/`
- If it's used only in one page, keep it in that page file until it needs reuse

## Testing

```bash
npm run test         # run once
npm run test:watch   # watch mode
```

- Unit tests for pure logic (quiz utilities, data transformations) in `src/test/`
- Component tests with `@testing-library/react` for interactive UI
- Mock Supabase client in tests — don't hit the real database

## Pull Request Process

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Run `npm run lint` and fix any errors before committing
3. Run `npm run test` and ensure all tests pass
4. Open a PR with a clear description of what changed and why
5. Link any related issues

## Environment Variables

Never commit `.env`. Add new variables to `.env.example` with a placeholder value.

All Vite env vars must be prefixed with `VITE_` to be accessible in the browser.
