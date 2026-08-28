# GSC: what changed since 2026-05-09

Captured 2026-05-18 via GSC MCP (URL Inspection API). Property `sc-domain:siamscuba.com`.

> The Search Console API does **not** expose the Coverage report category lists
> (the manual exports in `gsc-2026-05-09/`). This diff re-inspects representative
> URLs from each baseline category via the URL Inspection API.

## TL;DR

The deploy-side fixes are correct, but a **host-canonical contradiction is
actively blocking indexing of real pages**. That is the headline finding — it
is new and more urgent than the legacy-WP cleanup.

## Top finding (NEW) — non-www serves a 307 to www

- Sitemap, `<link rel=canonical>`, and `SITE_URL` in `src/components/Seo.tsx`
  all declare **non-www** `https://siamscuba.com`.
- The live host **307-redirects** (TEMPORARY) `siamscuba.com` -> `www.siamscuba.com`,
  which is where 200 is actually served.
- Google therefore reports the sitemap-declared URLs as **"Redirect error"** and
  will not consolidate signals onto the www target (307 = temporary, not canonical).

Impact observed:
- `/fun-dive-booking` (money page) -> **Redirect error**, not indexed.
- `/blog` -> **Redirect error**, not indexed.
- `/` and `/blog/koh-tao-dive-sites-guide` are still indexed (grandfathered from
  earlier crawls) but sit on the same broken canonical setup.

**FIXED & CONFIRMED 2026-05-18** (Vercel Domains, no code change — codebase was
already non-www-consistent): `siamscuba.com` set to Production (serves direct,
200, 0 hops); `www.siamscuba.com` set to **308 Permanent Redirect →
siamscuba.com**. `http://` also 308 → https apex. Verified live.

**RESOLVED**: after the fix + Ben's manual "Request Indexing", Google recrawled
on 2026-05-17. GSC URL Inspection now returns for BOTH:
- `/fun-dive-booking` → **Submitted and indexed**, Review snippets
- `/blog` → **Submitted and indexed**, Breadcrumbs + Review snippets
The "Redirect error" is gone. (Recovery was faster than the typical 1-3 day
lag.) An automated launchd re-check is scheduled 2026-05-20 as a stability
re-confirmation; see `seo-audit/scripts/gsc-recheck.sh`.

## Wins since 05-09

- **`/blog/koh-tao-dive-sites-guide`**: was in `discovered-not-indexed` ->
  now **Submitted and indexed** with Breadcrumbs + Review-snippet rich results.
- **`/our-island-koh-tao/`**, **`/shop/padi-courses/`**: were soft-404 /
  crawled-not-indexed -> now **dropped from Google's index** ("URL unknown").
- **`/zero-to-hero-dive-master-internship/`**: now a clean 301 -> `/divemaster`
  (vercel.json), recrawled 2026-05-13.
- **Landers** (`/discover-scuba-diving`, `/he/open-water-course`): "URL unknown
  to Google" - correctly hidden from organic (commit d1860c3). Working as intended.
- Sitemap: Valid, 42 URLs, 0 errors/warnings, downloaded 2026-05-17 (no landers).

## Unchanged / expected lag

Legacy WP URLs still show stale states (Soft 404 / Page with redirect /
Crawled-not-indexed) because Google has **not recrawled them since the robots.txt
unblock** (commit 38f5989). Last-crawled dates predate the unblock. This is the
expected lag noted in the prior handoff - they should clear on recrawl.

- `/shop/padi-courses/padi-open-water-diver/` - Soft 404 (crawled 05-07)
- `/product-category/padi-courses/` - Soft 404 (crawled 05-07)
- `/shop/fun-diving/fun-dives/` - Soft 404 (crawled 05-06)
- `/shop/padi-courses/padi-emergency-oxygen-provider/` - Crawled-not-indexed (03-12, very stale)
- `/the-wreck-htms-sattukut/`, `/accommodation-koh-tao/` - Page with redirect (05-04)

## Still pending (separate, from prior handoff)

- Part B: `google-site-verification` placeholder in `index.html` (needs Ben's code).
- The 2 "Indexed though blocked by robots.txt" URLs - none surfaced in this
  sampled set; need a full coverage export (manual) to enumerate, or inspect the
  specific URLs once known.
