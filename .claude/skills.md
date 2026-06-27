# Claude Code Skills — RCSI Prep Pro

Reference for Claude Code slash-command skills available in this project. Invoke any skill with `/skill-name` in a Claude Code session.

---

## Development & Testing

### `/run`
Start the dev server and open the app in a browser to visually confirm a feature works.

**When to use:** After implementing any UI change — quiz flow, flashcard flip, station overview tabs, dark mode toggle. Tests verify logic; this verifies the actual experience.

```
/run
```

### `/verify`
Run the app and observe specific behavior to confirm a fix or feature works end-to-end.

**When to use:** After fixing a bug (e.g., quiz score not saving, flashcard progress resetting). Confirms the golden path and regressions in nearby features.

```
/verify
```

---

## Code Quality

### `/code-review`
Review the current diff for correctness bugs, reuse opportunities, and efficiency issues.

**Effort levels:** `low` / `medium` (fewer, high-confidence findings) → `high` / `max` (broader, may include uncertain findings)

**When to use:** Before pushing a new station module, quiz engine change, or data-layer query. Pass `--fix` to auto-apply findings.

```
/code-review
/code-review --fix
```

### `/simplify`
Review changed code for reuse, simplification, and cleanup — then apply the fixes.

**When to use:** After adding a new page or component that may have copy-pasted patterns already abstracted elsewhere (e.g., flashcard components, station tabs).

```
/simplify
```

### `/security-review`
Security audit of all pending changes on the current branch.

**When to use:** Any time authentication, Supabase RLS queries, admin gating (`useIsAdmin`), or user-input handling is modified. Critical for the `/admin/import` flow and any new Supabase table access.

```
/security-review
```

---

## Research & Content

### `/deep-research`
Multi-source, fact-checked research report on any topic.

**When to use in this project:** Researching clinical content for new station modules. For example, before writing `src/data/sepsisContent.ts`, use this to gather accurate nursing protocols, assessment criteria, and RCSI exam priorities.

```
/deep-research "Sepsis management nursing assessment steps for RCSI OSCEs"
/deep-research "IV infusion nursing competencies and common errors"
```

### `/claude-api`
Reference for the Claude API — model IDs, pricing, streaming, tool use, caching.

**When to use:** If integrating AI-generated feedback into quiz results, or adding an AI tutor feature using the Anthropic SDK.

```
/claude-api
```

---

## Project Setup & Configuration

### `/session-start-hook`
Set up a `SessionStart` hook so the dev environment is ready at the start of every Claude Code web session (e.g., auto-run `npm install`, check `.env` exists).

**When to use:** Once, to wire up the project so Claude Code sessions start with a working environment.

```
/session-start-hook
```

### `/update-config`
Configure Claude Code settings (`settings.json`) — permissions, env vars, automated behaviors.

**When to use:** To allow specific npm commands without prompts, set `VITE_*` env vars, or add hooks (e.g., run `npm run lint` before every commit).

```
/update-config
```

### `/fewer-permission-prompts`
Scan recent transcripts and add an allowlist to `.claude/settings.json` for read-only Bash and MCP calls that kept triggering prompts.

**When to use:** After a few sessions, to smooth out repetitive `git status`, `npm run lint`, or file-read permission dialogs.

```
/fewer-permission-prompts
```

---

## Documentation

### `/init`
Initialize or regenerate `CLAUDE.md` from the current state of the codebase.

**When to use:** After a significant refactor — new stores, new route groups, new content modules — to keep `CLAUDE.md` accurate.

```
/init
```

### `/review`
Review a pull request — reads the diff, summarizes changes, flags issues.

**When to use:** When reviewing a contributor PR adding new question data, a station module, or a UI change.

```
/review
```

---

## Recurring Tasks

### `/loop`
Run a prompt or slash command on a recurring interval.

**When to use:** Polling a long-running Firebase import, watching for CI status, or periodically checking that the dev server is healthy.

```
/loop 5m /verify
```

---

## Quick Reference

| Skill | Best used for |
|-------|---------------|
| `/run` | Start dev server, check UI |
| `/verify` | Confirm a fix works end-to-end |
| `/code-review` | Bug + quality check before push |
| `/simplify` | Clean up after adding a module |
| `/security-review` | Auth, RLS, admin route changes |
| `/deep-research` | Clinical content for new modules |
| `/claude-api` | AI tutor / feedback feature work |
| `/session-start-hook` | One-time project setup |
| `/update-config` | Permissions, env vars, hooks |
| `/fewer-permission-prompts` | Reduce prompt friction |
| `/init` | Regenerate CLAUDE.md after refactors |
| `/review` | PR review |
| `/loop` | Recurring checks |
