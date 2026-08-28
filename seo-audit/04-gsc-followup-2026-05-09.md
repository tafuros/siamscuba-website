# GSC Follow-up — 2026-05-09

Continuation of the SEO project after Phase A shipped (see `HANDOFF.md`). Captures the state of Google Search Console one day after the Phase A deployment, surfaces legacy-URL cleanup needed, and tracks indexing requests.

## What I did

1. Re-submitted `https://siamscuba.com/sitemap.xml` (last accepted: 2026-05-08, status: Success). Note: Google still only reports 14 of 33 URLs discovered — fresh re-submission should expand that over the coming days.
2. Requested indexing on the 10 SEO-priority URLs via URL Inspection.
3. Captured drilldowns for the four largest "not indexed" categories.

Screenshot of the Pages report: `gsc-pages-report-2026-05-09.png`.

## Indexing-request results (10 URLs)

| URL | Pre-request status |
|-----|---|
| `/` | URL is on Google ✅ |
| `/open-water` | URL is on Google ✅ |
| `/fun-dive-booking` | URL is on Google ✅ (also appears in "Discovered – not indexed", probably stale row) |
| `/discover-scuba` | URL is on Google ✅ |
| `/advanced-open-water` | URL is on Google ✅ |
| `/rescue-diver` | URL is on Google ✅ |
| `/divemaster` | URL is **not** on Google ⚠️ |
| `/blog` | URL is **not** on Google ⚠️ |
| `/blog/padi-vs-ssi-koh-tao` | URL is **not** on Google ⚠️ |
| `/blog/koh-tao-dive-sites-guide` | URL is **not** on Google ⚠️ |

All 10 added to Google's priority crawl queue.

## Pages report — current category counts

| Category | URLs | Source |
|---|---|---|
| Crawled – currently not indexed | 137 | `_data/gsc-2026-05-09/crawled-not-indexed.txt` |
| Soft 404 | 65 | `_data/gsc-2026-05-09/soft-404.txt` |
| Page with redirect | 38 | `_data/gsc-2026-05-09/page-with-redirect.txt` |
| Alternate page with proper canonical | 12 | (expected — hreflang variants) |
| Discovered – currently not indexed | 10 | `_data/gsc-2026-05-09/discovered-not-indexed.txt` |
| Not found (404) | 10 | `_data/gsc-2026-05-09/not-found-404.txt` |
| Excluded by 'noindex' tag | 9 | (expected — privacy/terms/data-deletion) |
| Duplicate, Google chose different canonical | 4 | |
| Duplicate without user-selected canonical | 3 | |
| Indexed, though blocked by robots.txt | 2 | |
| Blocked by robots.txt | 1 | |

## Discovered – currently not indexed (the salvageable ones)

These are 10 NEW-site URLs Google saw in the sitemap but hasn't crawled yet. The indexing requests above should fix this:

```
/blog
/blog/best-dishes-koh-tao
/blog/best-restaurants-koh-tao
/blog/best-snorkeling-spots-non-divers
/blog/koh-tao-dive-sites-guide
/blog/koh-tao-nightlife-guide
/blog/padi-divemaster-koh-tao
/blog/things-to-do-besides-diving
/blog/top-beaches-viewpoints-koh-tao
/fun-dive-booking
```

8/10 are blog posts from Phase A — the SEO content investment is on the cusp of going live. Expect these to get indexed in 1–2 weeks given the priority requests.

## Crawled – currently not indexed (137 URLs — categorization)

100% legacy WordPress URLs from the previous siamscuba.com. None are content the new site cares about.

| Pattern | Count | Example |
|---|---|---|
| Legacy query params (`?add-to-cart=`, `?remove_item=`, `?orderby=`, `?wpnonce=`) | 78 | `/cart/?remove_item=...&_wpnonce=...` |
| `http://` (non-HTTPS) | 13 | `http://siamscuba.com/...` |
| `/product/*` (legacy WooCommerce product pages) | 12 | `/product/padi-open-water-diver/` |
| `/tag/*` (WP tags) | 8 | `/tag/koh-tao/` |
| `/category/*` (WP categories) | 7 | `/category/uncategorized/` |
| `/shop/*` | 5 | `/shop/padi-courses/...` |
| `/portfolio/*` (legacy theme portfolio entries) | 5 | `/portfolio/granular-e-commerce/` |
| `/product-category/*` | 3 | `/product-category/padi-courses/` |
| `/edwin-the-fish/*` (legacy blog) | 3 | |
| Other legacy paths | 3 | `/laventure-divemaster/` etc. |

Live test confirms the new site already returns **HTTP 404** for all of these (cleanUrls + react-router catches unknown routes). So this is a **stale-data issue** — Google last crawled these as 200 OK from the old WP install. Once Google re-crawls them as 404, they'll move out of "Crawled – not indexed" into "Not found (404)" and eventually drop from the index.

**No action needed** — this will resolve itself as Google's crawler revisits these URLs. The sitemap re-submission today helps that timeline.

## Soft 404 (65 URLs)

Same story as above — all legacy WordPress URLs. Live testing shows the new site returns 404. These are stale from before Phase A shipped. One non-legacy-shaped URL stands out:

- `https://siamscuba.com/contact-us` — this looks like a real route someone is linking to, but the new site has no `/contact-us` page. Either:
  - Add `/contact-us` redirect → `/` (or wherever contact info lives), OR
  - Confirm the new site has a contact page and update internal links.

## Not found (404) — 10 URLs

All legacy old-site URLs being correctly served as 404. One is just `/index.php` (WordPress entry point). Nothing to fix.

## Page with redirect (38 URLs)

These redirect correctly today (mostly old http:// → new https://, www → apex, or trailing-slash dropped). No action needed.

## Recommended next steps

In priority order:

1. **Wait 1–2 weeks** and re-check the Pages report. Expect:
   - "Discovered – not indexed" → 0 (or close), with the 8 blog posts now indexed.
   - "Crawled – not indexed" to drop sharply as Google re-crawls and sees real 404s.
   - "Soft 404" to drop sharply for the same reason.
   - "Indexed pages" to rise from 29 toward ~33–35.

2. **Decide on `/contact-us`** — either redirect or leave as 404. (The old site had `/contact-us/` redirected. The non-trailing-slash version slips through.)

3. **Optional:** add `Disallow: /cart/`, `Disallow: /shop/`, `Disallow: /product/`, `Disallow: /product-category/`, `Disallow: /tag/`, `Disallow: /category/`, `Disallow: /portfolio/` to `robots.txt`. This would speed up the cleanup by telling Google not to bother re-crawling them. But it's not strictly necessary — the 404s will eventually do the same job. Skip unless we see the categories aren't shrinking after 2 weeks.

4. **`/zero-to-hero-dive-master-internship/`** appeared in the GSC Overview as "lost 100% of impressions." It's currently in "Page with redirect" — confirm where it redirects to (probably `/divemaster`) and that the destination has the relevant DM-internship content.

5. **Sitemap discovery gap** — Google reports 14 of 33 URLs discovered. After today's re-submission this should grow. If it stalls at <33 in a week, investigate whether some URLs in the sitemap return errors during fetch or are caught by canonical conflicts.
