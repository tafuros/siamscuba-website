# Blog Page Redesign + 8-Post SEO Batch — Plan

**Date:** 2026-05-09
**Status:** Draft — awaiting Ben's review before any code changes
**Origin:** Resumes the work paused on 2026-04-29 (per memory `project_website_seo_keyword_recycling.md`)

---

## Why this work, in one sentence

The 8 SEO posts only convert traffic into bookings if (a) the blog page itself is presentable enough to rank and retain readers, and (b) the posts cross-link into the 15 course landing pages — otherwise the SEO keywords drive traffic to a dead-end article and never reach the booking funnel.

So: redesign the blog **shell** first (architecture + data model + cross-linking slots), then write the 8 posts into the new shell.

---

## Current state (from scout)

- Blog is data-driven: every post is an entry in `src/data/blogPosts.ts` (single TS file, no MDX).
- 11 posts exist today across 5 surface categories (Diving / Food / Beaches / Activities / Nightlife).
- `/blog` index = hero + category filter buttons + 3-col grid of `<BlogCard />`.
- `/blog/<slug>` = hero image, sectioned body, single CTA → `/fun-dive-booking`. Article schema + Seo component already wired.
- **Zero cross-linking** between courses and blog posts in either direction. `CourseDetailDialog` has no blog references; course landing pages (`CoursePage.tsx`) have no "Related blog" slot.
- Course pages delegate to `Index courseOverride={…}` — generic wrapper.

---

## What "redesign" means here (and what it doesn't)

**In scope:**
- Information architecture: how posts are organized, how related content surfaces
- Data model additions: `relatedCourses`, `relatedBlogSlugs`, `featured`, `tags`, `readingTime`
- Internal-link surfaces: post → courses, course → posts, post → post
- Index-page UX: featured strip, search/tag filters, post grouping
- Post-page UX: ToC for long posts, related courses block, related posts block, sticky/repeat CTA

**Out of scope (deferred):**
- Visual identity overhaul (colors, fonts, photography style) — keep existing
- Switching to MDX or a CMS — keep TS data structure
- Comments, social sharing widgets, newsletter signup — separate decision
- Hebrew localization for course pages — separate Hebrew-landing track

---

## Plan in 5 phases

### Phase 1 — Data model additions (small, safe, ships first)

Extend `BlogPost` interface in `src/data/blogPosts.ts`:

```
relatedCourses?: string[]   // course slugs, e.g. ["open-water", "advanced-open-water"]
relatedBlogSlugs?: string[] // sibling-post slugs
featured?: boolean          // pin to featured strip on index
tags?: string[]             // finer than category, used for suggestion algorithm
readingTime?: number        // minutes; auto-calc fallback if missing
```

Update existing 11 posts with sensible defaults. No visible UI change yet — this is groundwork.

### Phase 2 — Blog index redesign

Layout (top → bottom):
1. Hero — keep title/subtitle, simplify to one line
2. **Featured strip** — 1 large + 2 small posts, only if at least 1 `featured: true` post exists
3. Category filter — same 5 buttons, but add **"Diving" as explicit chip** (currently Diving is implicit; explicit chip lets users isolate the dive content)
4. Optional **tag pills** below category filter for finer cuts (e.g. "PADI", "Wrecks", "Beginner")
5. Posts grid — 3-col, but order by `featured DESC, date DESC`
6. End-of-grid CTA — "See all dive courses" → `/courses` or homepage `#courses`

Key call: keep the category filter client-side (already works, no SSR change).

### Phase 3 — Blog post redesign

For each `/blog/<slug>` page, add:

1. **Reading time + word count** in the byline row.
2. **ToC** auto-generated from section headings, sticky on desktop ≥1024px, collapsible on mobile. Only render if post has ≥4 sections.
3. **Mid-article CTA** — between section 3 and section 4, an inline "Book your dive" card.
4. **Related courses block** — at end of article, before the existing CTA. Source: `relatedCourses` field. Layout: 2–3 small cards linking to `/<courseSlug>`. This is **the highest-leverage SEO move** because it injects a contextual internal link from blog → money pages.
5. **Related posts block** — 3 cards. Source: `relatedBlogSlugs` (manual) with fallback to "same category, most recent 3."
6. Keep the existing big `/fun-dive-booking` CTA at the very bottom.

### Phase 4 — Course → blog cross-linking

On each course landing page (`/<courseSlug>`):
- Find or create a section near the bottom (above footer) called "Read more on the blog" / "From the blog".
- Render 2–3 post cards based on a new `coursePosts` map (separate file) or by querying `blogPosts.filter(p => p.relatedCourses?.includes(slug))`.
- Add this slot inside the `Index` component when `courseOverride` is set.

This closes the loop: blog posts link to courses, course pages link back to posts → Google sees a connected content graph instead of orphan articles.

### Phase 5 — 8 new SEO posts

Once the shell ships (phases 1–4), write the 8 posts. Each lands as a new entry in `blogPosts.ts` with all the new fields populated.

Keyword targets (from 2026-04-29 plan):

| # | Slug | Lang | Primary keyword | Maps to course |
|---|------|------|---|---|
| 1 | `aow-koh-tao-guide` | EN | advanced open water koh tao / aow koh tao | `/advanced-open-water` |
| 2 | `padi-idc-koh-tao` | EN | padi idc koh tao | `/idc` |
| 3 | `koh-tao-diving-cost-guide` | EN | koh tao diving cost / how much does diving cost koh tao | `/discover-scuba`, `/open-water`, `/advanced-open-water`, `/divemaster` |
| 4 | `best-time-to-dive-koh-tao` | EN | best time to dive koh tao / koh tao diving season | all courses |
| 5 | `padi-open-water-koh-tao-complete-guide` | EN | open water koh tao | `/open-water` (longer/different angle than the existing "what to expect" post) |
| 6 | `divemaster-koh-tao-internship-deep-dive` | EN | divemaster koh tao | `/divemaster` (longer/different angle than the existing post) |
| 7 | `curso-buceo-koh-tao-open-water-en-espanol` | ES | curso buceo Koh Tao | `/open-water` |
| 8 | `divemaster-koh-tao-en-espanol` | ES | divemaster Koh Tao español | `/divemaster` |

Course-card facts already gathered (per memory):
- OW: 11,000 THB / 2.5 days / 4:1 ratio / two private boats Supannakong & SawSiam
- AOW: 10,000 THB / 2 days / 30m
- DM: 38,500 THB / 4–8 weeks / free internship
- IDC: price-on-request / 5 Star IDC Centre

Each post: 1,500–2,500 words, 4–7 sections, hero image, ≥3 internal links to courses, 2–3 to other posts, full schema. Ben writes voice/tone-checks; Claude can draft.

---

## Sequencing & PRs

I'd ship this as small PRs, one per phase, all to `main` since Vercel auto-deploys main:

1. **PR 1** — Phase 1 (data model + backfill existing posts). No UI change. Safe.
2. **PR 2** — Phase 2 (blog index redesign). Visible. Ben reviews on `localhost:5173` before merge.
3. **PR 3** — Phase 3 (post page redesign). Visible. Same review gate.
4. **PR 4** — Phase 4 (course → blog cross-linking). Visible.
5. **PRs 5–12** — one PR per new post, drafts I send to Ben in markdown for voice review before he OKs landing them in `blogPosts.ts`.

**Per project memory** ("Always preview local build before deploy"), every visible-change PR runs through `bun run dev` → manual scroll-through → Ben's "looks good" before push.

---

## Open decisions for Ben before I start

1. **Featured posts:** which existing posts (if any) should be `featured: true` on the new index? Default suggestion: `padi-vs-ssi-koh-tao` + `koh-tao-dive-sites-guide` + the new `koh-tao-diving-cost-guide` once it exists.

2. **Tags vs categories:** stay with 5 categories only, or add a tag layer (PADI / Wrecks / Beginner / Pro / etc.)? My take: **add tags** — they unlock the "related posts" suggestion and let you write more posts per course without bloating the category filter. Cost: 30 min to backfill.

3. **CTA destination from blog posts:** stick with the single `/fun-dive-booking` CTA, or route by post topic (e.g. divemaster post → `/divemaster`)? My take: **route by topic**, which is what `relatedCourses` enables — first item in the array becomes the primary CTA target.

4. **Spanish posts:** do you want the Spanish posts on the same `/blog/<slug>` route, or under `/es/blog/<slug>`? `/es/` is cleaner for hreflang and matches the existing `es` locale in your hreflang basic setup. Cost: small route addition. My take: **`/es/blog/<slug>`**.

5. **Order:** Phase 1 (data model) ships first regardless. Are you OK with me executing Phases 2–4 before any new content (Phase 5), or do you want a content sample first to make sure the shell fits the content?

---

## What I'll do next, pending answers

Once you OK the plan (or amend it), I'll start with Phase 1 — small, invisible, safe to ship. We'll review the design questions in Phase 2 with the actual `localhost:5173` view, not mockups.
