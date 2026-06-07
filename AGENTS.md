# Siam Scuba Website — Agent Rules

This is the public marketing website for Siam Scuba. Lives at https://siamscuba.com.

---

## Tech Stack

- **Framework**: Vite 5 + React 18 + TypeScript
- **Styling**: Tailwind CSS 3 + shadcn/ui (Radix UI primitives)
- **State/Data**: TanStack Query
- **Routing**: React Router DOM 6
- **Animation**: Framer Motion
- **3D**: Three.js + React Three Fiber + Drei
- **Backend**: Supabase (auth, DB, storage)
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner
- **Booking**: the live Fun Dive flow is a DiveOS iframe (dash.siamscuba.com); the site has no backend/DB of its own
- **Package Manager**: **bun** (not npm — use bun.lockb, not package-lock.json)

---

## Commands

- `bun install` — install dependencies
- `bun run dev` — start dev server at http://localhost:5173
- `bun run build` — production build to `dist/`
- `bun run lint` — ESLint check
- `bun run test` — Vitest tests

The web-dev agent is allowed to run dev/build/lint autonomously to verify changes.
The web-dev agent must NOT run install commands without approval.

---

## File Structure (key folders)

```
src/
├── components/     ← shadcn/ui components + custom components
├── pages/          ← route components (Home, Courses, Boats, etc.)
├── hooks/          ← custom React hooks
├── lib/            ← utilities, Supabase client
├── integrations/   ← third-party service wrappers
└── App.tsx         ← root + router
public/             ← static assets (images, videos, favicons)
index.html          ← entry point - CONTAINS Google Tag Manager + Google Ads tags
```

---

## CRITICAL: Things NOT to break

### 1. Google Tag Manager + Google Ads
`index.html` contains analytics tracking:
- GTM container: `GTM-TN3SM66Q`
- Google Ads conversion: `AW-18050429438`
- Conversion event for `booking-confirmed`: `AW-18050429438/9d1fCLb625gcEP7jjp9D`

NEVER remove or modify these tags. They power live business tracking.

### 2. Environment variables
The site ships with publishable values only; secrets live in `.env.local` (gitignored) and in Vercel.
- Do NOT commit `.env` changes that would break Vercel deploys
- If adding new env vars, remind Ben to add them to Vercel Dashboard -> Settings -> Environment Variables
- (Supabase was removed 2026-06-07 - the site uses no DB/auth/storage; booking is a DiveOS iframe.)

### 3. SEO basics
- `index.html` contains meta tags (title, description, Open Graph)
- Do NOT remove these unless explicitly redesigning SEO

### 4. Routing
- Vercel needs `vercel.json` for SPA routing if it doesn't exist already
- All routes must fall back to `index.html` (handled automatically by Vercel for Vite)

---

## Deploy Workflow

```
1. Edit code locally
2. Test with: bun run dev → check http://localhost:5173
3. Optional: bun run lint and bun run build (catches issues before push)
4. git add + git commit + git push
5. Vercel auto-deploys main branch within ~60 seconds
6. Verify on https://siamscuba.com
```

If a deploy fails:
- Check Vercel Dashboard → Deployments → click failed deploy → see build logs
- Common causes: missing env var, TS error, broken import

---

## Style Conventions

- **Components**: PascalCase, one component per file
- **Hooks**: `use` prefix, camelCase
- **Tailwind**: prefer utility classes over custom CSS
- **Imports**: absolute paths via `@/` alias when possible
- **Comments**: only when explaining WHY, not WHAT (code should be self-documenting)

---

## Languages

The site supports English (default) and Hebrew. When adding text:
- Add both translations
- Check existing i18n setup in `src/` before adding raw strings

---

## When in doubt

Ask Ben. Better to clarify than to ship a guess.
