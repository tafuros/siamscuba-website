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

**Never push straight to `main`.** `main` is production - the push IS the deploy.
Work on a branch and let Ben review the Vercel **preview** deployment.

```
1. Branch off main:      git checkout -b feat/<thing> origin/main
2. Edit code
3. Verify locally:       bun run test && bunx tsc --noEmit && bun run build
                         bun run check:links      # dead internal links
4. Push the branch:      git push -u origin feat/<thing>
                         -> Vercel builds a PREVIEW URL for the branch
5. Verify the preview:   bun run check:preview     # automated, see below
   Then Ben reviews it visually (not localhost - see the trap below)
6. Run /deploy-check, get Ben's explicit go-ahead
7. Merge to main -> Vercel deploys prod (~1-3 min)
8. Verify on https://siamscuba.com (open ONCE via claude-in-chrome)
```

CI (`.github/workflows/ci.yml`) runs on every PR and on main, and **all of it
blocks**: typecheck, tests, lint, production build, dead-link check, and an
invariant guard asserting `vercel.json` keeps the SPA rewrites block and
`index.html` keeps the GTM/Ads tags.

The lint error baseline was cleaned to **0** on 2026-07-26 (from 23), so any new
error fails CI. 11 `react-refresh/only-export-components` warnings remain by
design - unavoidable in files exporting both a component and helpers - and
eslint exits 0 on warnings. Keep it at zero errors; don't reintroduce
`continue-on-error`.

### Checking previews unattended

Preview deployments sit behind Vercel **Deployment Protection (SSO)**, so a plain
`curl` gets a 302 to `vercel.com/sso-api`. `bun run check:preview` gets past that
using the project's *Protection Bypass for Automation* secret.

```bash
bun run check:preview                 # resolves the preview URL for the current branch
bun run check:preview <preview-url>   # a specific deployment
PROD=1 bun run check:preview          # production (needs no secret)
```

It asserts routing/status, that unmatched URLs hard-404 with the branded page,
that the `/es/blog/*` posts resolve, that the GTM/Ads tags survived the build,
and that the sitemap serves. Non-zero exit on any failure, so it is CI-usable.

**One-time setup** (Ben, in his own terminal - the value must never enter a Claude
session, a repo file, or a task board):

1. Vercel → project **siam-website** → Settings → **Deployment Protection** →
   *Protection Bypass for Automation* → **Generate**, then copy the value.
2. Store it in the Keychain:
   ```bash
   security add-generic-password -a tafuros -s VERCEL_AUTOMATION_BYPASS_SECRET -w
   ```
   (`-w` with no value prompts silently; add `-U` to rotate an existing entry.)

The script pipes the secret straight from the Keychain into a curl config on
stdin, so it never appears in `argv` (i.e. not visible to `ps`), in a shell
variable, or in output. Do not add any `echo` of the value. Do **not** disable
Deployment Protection as a shortcut.

### TRAP: localhost cannot tell you whether a route exists

`vite preview` (and `bun run dev`) serve `index.html` for **any** path, so every
URL returns 200 locally - including routes that do not exist. Vercel does the
opposite: unmatched paths **hard-404**. A `/courses` link shipped to production
on 2026-07-26 because it passed local review this way.

So: never verify links or routes with curl against localhost. Use
`bun run check:links` (resolves links against the emitted `dist/` files, the
same way Vercel does) plus the `blog-internal-links` unit test, and do visual
review on a Vercel preview URL.

Related gotchas:
- There is **no `/courses` route.** The courses list is the homepage `#courses`
  section; individual course pages resolve through the `:courseSlug` catch-all
  (`SLUG_TO_COURSE` in `src/lib/courseSlugMap.ts`).
- Spanish blog posts exist **only** at `/es/blog/<slug>`. Always build blog links
  with `blogPostPath(post)` from `src/data/blogPosts.ts`, never by interpolating
  the slug.
- Unmatched URLs are served `dist/404.html`, emitted by the `path: "404"` route
  in `routes.tsx`. Keep that route above `:courseSlug`.

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
