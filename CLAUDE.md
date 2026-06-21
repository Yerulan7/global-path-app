# CLAUDE.md — Global Path

Project context for Claude Code. Read this fully before making changes.
Keep this file updated as the architecture evolves.

---

## 1. What this product is

**Global Path** is a platform that helps students apply to universities abroad —
matching programs, checking documents, drafting essays, estimating admission
chances, planning budgets, and guiding them through the bureaucracy
(scholarships, visas, document legalization).

**Current focus corridor:** Kazakhstan/Central Asia → Italy
(DSU scholarship, ISEE, Universitaly, Dichiarazione di Valore, student visa D).

**Vision:** multi-country. The name is "Global Path" on purpose. But we LAUNCH
on one corridor we know best and expand later. See §7.

**Honest current state:** this repo is a **front-end prototype**. The UI is built
and the design is good, but there is **no backend, no real AI, no database, no
auth, and no persistence**. Everything is hardcoded mock data. The job now is to
turn this skin into a real product without throwing away the design.

---

## 2. Tech stack (actual, do not change without asking)

- **React 19.2** (function components + hooks only)
- **Vite 8** (dev server on port 5173)
- **react-router-dom 7.18** (routing)
- **CSS Modules** (`*.module.css`) — one module per component/page
- **Design tokens** in `src/tokens.css` (imported once in `App.jsx`)
- **JavaScript, not TypeScript** (see §8 — migrating to TS is on the roadmap)
- **ESLint 10** (`npm run lint` must pass before any commit)

Scripts: `npm run dev` / `npm run build` / `npm run lint` / `npm run preview`.

**Do not add new dependencies, CSS frameworks (Tailwind, MUI, etc.), or change
the build setup unless explicitly asked.** The design system is hand-built and
intentional — preserve it.

---

## 3. Project structure

```
src/
  main.jsx              # entry
  App.jsx               # router + route table (imports tokens.css)
  tokens.css            # design tokens — SINGLE source of truth for styling
  index.css            # base/global styles
  components/           # reusable UI: AppShell, Badge, Button, Card, Nav, StatBar
  pages/                # one folder-less file per route + its .module.css
  assets/               # images
.claude/launch.json     # Claude Code launch config (dev on :5173)
```

Routes (defined in `App.jsx`, all wrapped in `<AppShell/>`):
`/` Home · `/advisor` AI Advisor · `/documents` Document Check ·
`/essay` Essay Analyst · `/chances` My Chances · `/budget` Budget Planner ·
`/journey` My Journey · `/settings` Settings · `*` → redirect to `/`.

---

## 4. Design system — follow it strictly

All styling goes through CSS variables in `src/tokens.css`. **Never hardcode
colors, fonts, radii, or shadows in component CSS — always use the tokens.**

- Palette: paper background (`--bg-paper`), pine green accent (`--accent-pine`),
  terracotta (`--accent-terracotta`), olive, warm "ink" text scale.
- Fonts: `--font-serif` = Newsreader (headings/editorial),
  `--font-sans` = Hanken Grotesk (UI/body).
- Radii/shadows/lines are all tokenized (`--radius-card`, `--shadow-card`, etc.).
- Aesthetic = warm, editorial, "paper" feel. NOT a generic SaaS/Tailwind look.
  Keep it that way.

If a new color/size is genuinely needed, add a token to `tokens.css` first, then
reference it — do not inline it.

---

## 5. Coding conventions

- Function components + hooks. Default export per file.
- One CSS Module per component/page; import as `styles` and use `styles.x`.
- Keep components small and presentational. Logic/data stays out of JSX.
- **Stable `key` props.** Do NOT use array index as `key` for dynamic lists
  (chat messages, results, etc.) — use a stable id. (There is an existing
  `key={i}` in `AIAdvisor.jsx`; fix when touched.)
- Match existing formatting (2-space indent, single quotes, semicolons).
- `npm run lint` must pass. No unused vars, no dead code left behind.
- Small, focused commits with clear messages. Show a plan for large changes
  before writing code.

---

## 6. CRITICAL rules — do not violate

1. **NEVER put the Anthropic API key (or any secret) in the frontend.**
   React code ships to the browser; any key there is public and will be stolen.
   All AI calls go: React → **our backend** → Anthropic API. The key lives only
   on the server, in env vars, never committed. This is non-negotiable.

2. **No fake "AI" presented as real.** Right now `AIAdvisor.jsx` returns a
   hardcoded stub ("in a real integration this would call the Claude API").
   That's fine as a placeholder, but never ship mock output styled to look like
   a genuine AI/admission result to real users.

3. **Single source of truth for the user profile.** Currently the user is
   hardcoded as "Ivan Kozlov" in `AppShell.jsx`, while `AIAdvisor.jsx`
   independently hardcodes "GPA 4.8 / Turin / Engineering". These must come from
   ONE shared profile (context/store + later the backend), not be duplicated.

4. **Multi-country from the data model up.** Even while we only have Italy
   content, model data as `{ sourceCountry, targetCountry, ... }` — never hardcode
   "Italy"/"DSU" into shared components or schemas. Italy is data, not structure.

5. **Don't break the design system** (see §4) and **don't add deps** (see §2)
   without asking.

---

## 7. Roadmap — build order (turn the prototype into a product)

Do these roughly in order. Keep each step small and reviewable.

1. **Extract mock data** out of page files into `src/data/` modules (typed
   shapes, multi-country fields). Pages import from there. No behavior change yet.
2. **Shared profile state** — a profile context/store consumed by `AppShell`,
   `AIAdvisor`, and every page. Kill the duplicated/inconsistent hardcoded users.
3. **Backend service** (separate from this Vite app) — start with one endpoint
   that proxies the AI Advisor chat to the Anthropic API server-side.
4. **Wire AI Advisor** to the real backend endpoint (streaming if possible).
   Remove the stub reply.
5. **Persistence + auth** — real user accounts, save profile/essays/applications.
6. **Program database** — the real moat: programs, deadlines, requirements,
   scholarships, kept up to date. This is the most valuable and most tedious part.
7. **TypeScript migration** before the codebase grows further (see §8).

When asked to "build the platform," do NOT attempt all of this at once. Pick the
current step, plan it, confirm, implement, commit.

---

## 8. Known gaps / tech debt (be aware, fix when relevant)

- No backend, no DB, no auth, no persistence (everything resets on refresh).
- All data is hardcoded mock data inside page files.
- No TypeScript — fine for a prototype, but plan the TS migration before scaling.
- No tests, no error boundaries.
- `key={i}` anti-pattern in `AIAdvisor.jsx`.
- Nav badge counts (`Document Check: 2`, `My Journey: 2`) are hardcoded in
  `AppShell.jsx` — should be derived from real state.
- "Global Path" branding but content is Italy-only — intended for now (§7), but
  keep components country-agnostic.

---

## 9. How to work with me (Claude Code) on this repo

- Read this file and the relevant existing files before editing.
- For anything non-trivial, propose a short plan first, then implement.
- Reuse existing components and tokens; match the established style.
- After changes: ensure `npm run lint` passes and the dev server still runs.
- If a request conflicts with §6 (security/secrets) — stop and flag it.
- Update this CLAUDE.md when the architecture meaningfully changes.
