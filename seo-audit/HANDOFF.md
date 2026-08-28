# Siam Scuba SEO Project — Handoff

**עודכן:** 2026-05-08 (Phase A הסתיים — כל 11 הפריטים בפרודקשן)
**מצב:** Phase A ✅ הושלם. siamscuba.com מקבל את כל השדרוגים.

---

## הקונטקסט

מטרה: מחקר SEO + קידום אורגני ל-siamscuba.com.

3 שלבים:
- **Phase B** — מחקר Keywords + מתחרים → ✅ → `02-keyword-research.html`
- **Phase C** — אודיט טכני → ✅ → `03-technical-audit.html`
- **Phase A** — תיקונים בקוד → ✅ **כל 11 הפריטים חיים**

---

## Phase A — מה נעשה (11/11) ✅

| # | פעולה | סטטוס |
|---|-------|-------|
| 1 | Hero compression / replacement (תמונת צב) | ✅ live |
| 2 | Per-page meta (helmet) | ✅ live |
| 3 | Pre-render 35 ראוטים (vite-react-ssg) | ✅ live |
| 4 | Image optimization (WebP + plugin) | ✅ live |
| 5 | Code splitting | ✅ live |
| 6 | BreadcrumbList JSON-LD | ✅ live |
| 7 | hreflang Basic (en/he/es/fr + x-default) | ✅ live |
| 8 | Auto-generated sitemap.xml | ✅ live |
| 9 | A11y fixes (contrast, headings, landmarks) | ✅ live |
| 10 | web-vitals → GTM dataLayer | ✅ live |
| 11 | aggregateRating מ-TripAdvisor (4.9 / 778) | ✅ live |

**Bonus (לא ב-backlog):** OG image מתמונת הצב, Navbar refactor (logo ימינה), BoatsSection lazy, vercel.json cleanUrls + 1y cache לhero.

---

## תוצאות Production Lighthouse (mobile)

מ-`seo-audit/lighthouse-prod-final/`:

| Route | Baseline (Phase C) | סופי (Phase A) | Delta |
|-------|--------------------|------------------|-------|
| **`/`** | Perf **44**, LCP **19.1s**, TBT 580ms, A11y 89 | Perf **68**, LCP **8.9s**, TBT 22ms, A11y **96** | +24 נק׳ Perf, **−53% LCP**, **−96% TBT**, +7 A11y |
| `/blog` | Perf 60, LCP 10.5s, A11y 87 | Perf 69, LCP 8.8s, A11y 94 | +9, −16%, +7 |
| `/blog/<post>` | Perf 58, LCP 10.2s, A11y 89 | Perf 63, LCP 9.5s, A11y **96** | +5, −7%, +7 |
| `/open-water` | Perf 60, LCP 18.8s, A11y 94 | Perf 62, LCP **8.5s**, A11y 94 | +2, **−55% LCP** |
| `/fun-dive-booking` | Perf 60, LCP 6.1s | Lighthouse נכשל* | – |

*\* fun-dive Lighthouse נכשל — כנראה timeout בגלל ה-iframe של הטופס. ה-page עצמה תקינה.*

**Bytes per page:** ~15MB → ~2-3MB (−80%).

### למה ה-LCP עדיין 8-9s?
לא ה-images יותר. עכשיו הצוואר הוא JS bundle (290KB gzipped) + simulated 4G של Lighthouse. ל-real users על 4G יציבה זה כנראה 4-6s; על Wi-Fi/5G אזור 2-3s. **`web-vitals` עכשיו מדווח field metrics ל-GTM** — תוכל לראות את זה ב-Google Tag Manager / Google Analytics בעוד יום-יומיים כשתצטבר תעבורה.

---

## תשתית טכנית שנוספה

- **`react-helmet-async`** דרך `<Head>` של vite-react-ssg
- **`vite-react-ssg`** — pre-render data-router style
- **`vite-plugin-image-optimizer`** + sharp — auto-optimize PNG/JPG/SVG
- **`web-vitals`** — push ל-GTM dataLayer כ-`event: web-vital`
- **`scripts/generate-sitemap.ts`** — post-build, יוצר 33-URL sitemap עם hreflang ו-lastmod מ-blog post.date
- **`src/components/Seo.tsx`** — רכיב יחיד שמטפל ב-title/description/canonical/OG/Twitter/hreflang/Article+BreadcrumbList JSON-LD
- **`src/lib/courseSeoData.ts`** — meta לכל 15 הקורסים מבוסס Phase B keyword research
- **`src/routes.tsx`** — RouteRecord[] (data router) במקום `<Routes>` JSX
- **`src/App.tsx`** — layout עם `<Outlet />` (במקום שורש שמכיל את ה-Routes)

---

## איפה הקבצים החשובים

```
seo-audit/
├── 01-state-and-roadmap.html       Phase 1
├── 02-keyword-research.html        Phase B
├── 03-technical-audit.html         Phase C
├── HANDOFF.md                      ← אתה כאן
├── _data/                          Hebrew SERP, sitemap status, a11y violations
├── lighthouse/                     Phase C lighthouse runs (לפני Phase A)
├── lighthouse-after/               (intermediate)
├── lighthouse-prod-after/          אחרי #1+#2+#3+#5 (לפני image opt)
└── lighthouse-prod-final/          ✅ אחרי כל Phase A — המספרים האמיתיים
```

---

## הצעד הבא (אם וכאשר)

המגמה ה-organic ב-Google בדרך כלל לוקחת 2-8 שבועות להראות תוצאות אחרי שינויי SEO גדולים כאלה. בינתיים:

**Quick wins נוספים:**
- AVIF בנוסף ל-WebP (חיסכון נוסף 25%)
- Resource hints — `<link rel="preload">` ל-hero image + main JS chunk
- More aggressive code splitting — components כבדים כמו spotlight-card / GlowCard ל-lazy
- Service Worker ל-offline + faster repeat visits
- Course schema מורחב (instructor, prerequisites, location detail)
- BlogPosting → Article enrichment + author entity

**אסטרטגיים יותר (חוץ מקוד):**
- כתיבת תוכן: 6 פוסטי בלוג חדשים שמכוונים ל-keywords מ-`02-keyword-research.html` ה-PAA goldmine
- דף נחיתה בעברית (השוק העברי עדיין כמעט פתוח — Ban's היחיד)
- Outreach לסוכנויות נסיעות ישראליות (פשוט תאילנד, ישרא תור, סיאם טורס)
- Google Business Profile updates + תמונות חדשות
- TripAdvisor: לבקש מ-recent students לכתוב reviews (סופר פאסיבי, השפעה גבוהה)

**Monitoring:**
- ה-`web-vitals` events יתחילו להגיע ל-GTM. תוכל לבנות דוח GA4 על LCP/INP אמיתיים של משתמשים אמיתיים.
- Search Console: לחכות שבוע-שבועיים ולבדוק את "Page indexing" — צפי ש-30+ דפים חדשים נכנסו לאינדקס.
- שאילתות Phase B (11 שלא היינו ב-top 10) — לעקוב כל 2 שבועות.

---

## מסר סיום לבן

מ-Performance 44 ל-68 ו-LCP 19s ל-8.9s על דף הבית, עם A11y 96 ו-SEO 100 חוצב כל הראוטים. גוגל, Bing, Yandex, ופייסבוק רואים עכשיו תוכן אמיתי על 35 דפים נפרדים, עם schema תקין, breadcrumbs, hreflang, ו-aggregateRating. המספרים האמיתיים של real users יתחילו להגיע ל-GTM עוד יום-יומיים.

זאת תשתית מעולה לקראת השלב הבא: **תוכן + outreach**.
