# ARCHITECTURE.md — Global Path

Target architecture for turning the front-end prototype into a real product.
Covers roadmap steps 3–6 (backend, real AI, persistence/auth, program DB).
Read together with `CLAUDE.md`. Update this file as the system evolves.

---

## 1. The shape of it

Three layers, one hard security boundary:

```
Browser (React + Vite)  ──►  Your API server (Node + Express)  ──►  Anthropic API
        public                holds the secret key                  (Claude Sonnet)
                                       │
                                       ▼
                                  PostgreSQL
                              (users · programs · apps)
```

The browser NEVER talks to Anthropic directly and NEVER holds any secret.
Every AI call is proxied through our server.

**AI request flow:**
1. Browser → `POST /api/advisor/chat` with the message history + auth cookie.
2. Server authenticates the user, reads profile + relevant programs from Postgres,
   builds the system prompt server-side.
3. Server calls the Anthropic API using `ANTHROPIC_API_KEY` (env var, server only).
4. Server streams Claude's reply back to the browser over SSE (live typing).

---

## 2. Recommended stack

- **Frontend:** keep React 19 + Vite (already built). Add a thin API client.
- **Backend:** Node + Express (same language as the frontend; minimal, well-known).
  Fastify is an acceptable alternative — do not mix both.
- **Database + Auth:** Supabase (managed PostgreSQL + Auth + file storage + Row
  Level Security). Knocks out roadmap step 5 too. Alternative if you want DB only:
  Neon (serverless Postgres) + your own auth.
- **AI:** `@anthropic-ai/sdk` on the server. Model: `claude-sonnet-4-6`.
- **Hosting:** frontend on Vercel/Netlify (static). Backend on Railway / Render /
  Fly.io. DB on Supabase. Keep frontend and backend as separate deployables.

Do not add other frameworks (Tailwind, Next.js, an ORM-of-the-week) without a
deliberate reason — each one is a maintenance cost for a solo founder.

---

## 3. Critical security rules (non-negotiable)

1. `ANTHROPIC_API_KEY` lives ONLY in the backend environment. Never in React,
   never in the repo, never in a `VITE_*` variable (those ship to the browser).
2. Every AI endpoint is auth-protected AND rate-limited per user — otherwise one
   user can run up an unbounded Anthropic bill.
3. The server builds the prompt/context from the DB. Never trust the client to
   send "who am I" or "which programs" — look it up server-side from the session.
4. Secrets come from environment variables (`.env` locally, the host's secret
   manager in production). `.env` is git-ignored.
5. CORS on the backend allows only your frontend origin(s).

---

## 4. Database schema (the moat — design multi-country from day one)

Relational fits this data. Every program/deadline row carries `source_country`
and `target_country` so the same schema serves Kazakhstan→Italy today and any
corridor later. Italy is data, not structure.

Core tables:

```
users
  id (uuid, pk)            -- or use Supabase auth.users
  email, created_at

profiles                   -- single source of truth for the student
  user_id (fk users)
  full_name
  source_country           -- e.g. 'KZ'
  target_country           -- e.g. 'IT'  (nullable until chosen)
  field                    -- e.g. 'engineering'
  degree_level             -- 'bachelor' | 'master'
  gpa, gpa_scale           -- store raw + scale, convert on read
  language, language_level -- e.g. 'en', 'B2'
  budget_monthly_eur
  updated_at

universities
  id (pk)
  name, country, city
  website, qs_rank (nullable)

programs                   -- the maintained asset
  id (pk)
  university_id (fk)
  name
  degree_level
  field
  language                 -- language of instruction
  target_country           -- denormalized for fast filtering
  tuition_min_eur, tuition_max_eur
  ielts_min (nullable), gpa_min (nullable)
  source_url, last_verified_at   -- provenance: prove the data is fresh

intakes                    -- deadlines change yearly — keep them separate
  id (pk)
  program_id (fk)
  year
  season                   -- 'fall' | 'spring'
  opens_at, closes_at

scholarships
  id (pk)
  target_country
  name                     -- e.g. 'DSU'
  amount_min_eur, amount_max_eur
  covers                   -- 'tuition' | 'living' | 'both'
  source_url, last_verified_at

applications               -- the student's kanban tracker
  id (pk)
  user_id (fk), program_id (fk)
  status                   -- 'planning'|'in_progress'|'submitted'|'admitted'|'rejected'
  notes, updated_at

documents
  id (pk)
  user_id (fk)
  type                     -- 'transcript'|'passport'|'dov'|'motivation_letter'...
  status                   -- 'missing'|'uploaded'|'verified'
  file_url (nullable)

chat_messages              -- AI Advisor history
  id (pk)
  user_id (fk)
  role                     -- 'user' | 'assistant'
  content
  created_at
```

`last_verified_at` columns exist on purpose: an always-fresh, provenance-tracked
program/deadline database is the defensible asset. Build the habit of verifying.

---

## 5. Backend folder structure

```
server/
  src/
    index.js               # express app, CORS, JSON, route mounting
    env.js                 # reads + validates env vars on boot
    db.js                  # postgres / supabase client
    middleware/
      auth.js              # verifies session -> req.user
      rateLimit.js         # per-user limit on AI endpoints
    routes/
      advisor.js           # POST /api/advisor/chat (streams)
      programs.js          # GET /api/programs (filter by profile)
      profile.js           # GET/PUT /api/profile
      applications.js      # CRUD for the tracker
    services/
      anthropic.js         # the ONLY file that imports the AI SDK + key
      prompt.js            # builds system prompt from profile + programs
  .env                     # ANTHROPIC_API_KEY, DATABASE_URL... (git-ignored)
  package.json
```

Keep `services/anthropic.js` as the single place the API key is touched. Nothing
else imports it. Easy to audit, easy to keep safe.

---

## 6. The secure AI proxy (starter code)

`server/src/services/anthropic.js` — the only file with the key:

```js
import Anthropic from '@anthropic-ai/sdk';

// Key read from the environment, server-side only. Never shipped to the browser.
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export function streamAdvisorReply({ system, messages, onText, onEnd, onError }) {
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system,
    messages, // [{ role: 'user'|'assistant', content: '...' }, ...]
  });
  stream.on('text', onText);
  stream.on('end', onEnd);
  stream.on('error', onError);
  return stream;
}
```

`server/src/routes/advisor.js` — auth-protected, rate-limited, streams via SSE:

```js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { getProfile, getRelevantPrograms } from '../db.js';
import { buildSystemPrompt } from '../services/prompt.js';
import { streamAdvisorReply } from '../services/anthropic.js';

const router = Router();

router.post('/chat', requireAuth, rateLimit, async (req, res) => {
  const userId = req.user.id;                 // from the session, NOT the client
  const { messages } = req.body;              // chat history from the client

  // Build context server-side so the client can't spoof it
  const profile = await getProfile(userId);
  const programs = await getRelevantPrograms(profile);
  const system = buildSystemPrompt(profile, programs);

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  streamAdvisorReply({
    system,
    messages,
    onText: (delta) => res.write(`data: ${JSON.stringify({ delta })}\n\n`),
    onEnd:  ()      => { res.write('data: [DONE]\n\n'); res.end(); },
    onError:()      => { res.write(`data: ${JSON.stringify({ error: true })}\n\n`); res.end(); },
  });

  req.on('close', () => res.end()); // client navigated away
});

export default router;
```

Note: persist the user message and the final assistant reply to `chat_messages`
so history survives a refresh (roadmap step 5).

---

## 7. Frontend: consuming the stream

Replace the stub in `AIAdvisor.jsx` with a call to the backend. The key never
appears here — this code only talks to your own server.

```js
export async function sendToAdvisor(messages, onDelta) {
  const res = await fetch('/api/advisor/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',            // send the auth cookie
    body: JSON.stringify({ messages }),
  });
  if (!res.ok || !res.body) throw new Error('advisor request failed');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';
    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;
      const evt = JSON.parse(data);
      if (evt.delta) onDelta(evt.delta);  // append to the live message
    }
  }
}
```

In dev, set a Vite proxy so `/api` reaches the backend (avoids CORS pain):

```js
// vite.config.js
export default {
  server: { proxy: { '/api': 'http://localhost:3001' } },
};
```

---

## 8. Environment variables

Backend `.env` (git-ignored, never committed):
```
ANTHROPIC_API_KEY=sk-ant-...     # server only
DATABASE_URL=postgres://...      # or SUPABASE_URL + SUPABASE_SERVICE_KEY
FRONTEND_ORIGIN=http://localhost:5173
PORT=3001
```

Frontend: it needs NO Anthropic key. The only frontend env vars are public things
like the API base URL. Never put a secret in a `VITE_*` variable — Vite inlines
those into the browser bundle.

---

## 9. Build order (maps to the CLAUDE.md roadmap)

1. Stand up the Express server with `/api/health` and the Vite dev proxy.
2. Add Supabase: tables from §4, the `db.js` client, auth middleware.
3. Build `/api/advisor/chat` (§6) and wire `AIAdvisor.jsx` to it (§7) — remove
   the stub. First real AI feature, end to end.
4. Persist chat + profile. Replace the rest of the mock data with DB reads.
5. Seed and start maintaining the `programs` / `intakes` / `scholarships` tables —
   the moat. Add `last_verified_at` discipline.
6. Layer the remaining AI features (essay analyst, chances) on the same proxy
   pattern — one shared `services/anthropic.js`, never a second key location.

Do one step at a time. Plan, confirm, implement, commit.
