// WHERE TRAINING HAPPENS - a factual guard, scoped per course.
//
// The facts (confirmed by Ben, 2026-08-01):
//   - Siam Scuba HAS its own swimming pool.
//   - The PADI Open Water course DOES include a pool day. Day 1 is theory +
//     pool, then four ocean dives. In Hebrew that course is sold as
//     "כוכב ראשון" - the Israeli nickname for PADI Open Water, NOT a separate
//     CMAS 1-star product (the site says so itself in the blog post
//     `kokhav-rishon-koh-tao`).
//   - Discover Scuba and every other course are sea-only. For DSD that is a
//     real selling point: your first breath happens in the sea, on a reef.
//
// HISTORY, so this does not swing back a third time. An earlier pass asserted
// the shop had NO pool and rewrote every "pool" mention on the site into
// "shallow sheltered sea". That was wrong for Open Water and made accurate copy
// inaccurate. The guard that enforced it would have blocked anyone from ever
// describing the Open Water course correctly again - a test that enforces a
// falsehood is worse than no test at all.
//
// So this file now guards BOTH directions:
//   1. Non-OW courses must not claim pool training (DSD's sea-only story is a
//      differentiator and must not silently regress).
//   2. Open Water copy MUST still mention the pool, so the "correction" cannot
//      be reapplied by a future agent pattern-matching on the word "pool".
import { describe, it, expect } from "vitest";
import { LANDER_COPY, type Lang, type Offer } from "../lib/landerCopy";
import { courseDetails } from "../i18n/courseDetails";
import { translations } from "../i18n/translations";
import { COURSE_SEO } from "../lib/courseSeoData";
import { blogPosts } from "../data/blogPosts";

/**
 * Phrases that claim we train people in a swimming pool.
 *
 * Deliberately phrase-level, not the bare word "pool": the site legitimately
 * talks about resort "pool parties" (nightlife guide) and the taxi app's
 * "driver pool", and neither is a training claim.
 */
const POOL_CLAIM: RegExp[] = [
  // EN
  /\bpool practice\b/i,
  /\bpool training\b/i,
  /\bpool session\b/i,
  /\bin (?:the|our|a) pool\b/i,
  /\bto the pool\b/i,
  /\bpool \/ confined/i,
  /\bpool-based\b/i,
  /\btheory and pool\b/i,
  /\bpool safety drills\b/i,
  // ES
  /\bprácticas en piscina\b/i,
  /\bsesión en piscina\b/i,
  /\bsesión de piscina\b/i,
  /\bentrenamiento en piscina\b/i,
  /\bteoría \+ piscina\b/i,
  /\bteoría y piscina\b/i,
  /\ben (?:la|una) piscina\b/i,
  /\ba la piscina\b/i,
  /\bde seguridad en piscina\b/i,
  // FR
  /\ben piscine\b/i,
  /\bà la piscine\b/i,
  /\bdans (?:la|une) piscine\b/i,
  // HE
  /תרגול בבריכה/,
  /אימון בבריכה/,
  /מפגש בבריכה/,
  /בבריכה/,
  /לבריכה/,
  /מפגש בריכה/,
];

/**
 * The ONE course that legitimately trains in the pool. Keyed differently in
 * each source, hence three constants rather than one.
 */
const OW_OFFER: Offer = "owd";
const OW_COURSE_DETAIL_KEY = "Open Water Diver";
const OW_SEO_SLUG = "open-water";

/**
 * UNCONFIRMED - awaiting Ben, do not enforce either way yet.
 *
 * Ben's ruling was "Open Water uses the pool, every other course is sea-only".
 * These two are the courses where that is least plausible and where the copy is
 * currently self-contradictory across languages, so the guard abstains rather
 * than freezing a guess into a test:
 *
 *   - IDC: the French copy still says "Jour 1 après-midi : piscine" while
 *     en/he/es were rewritten to "confined water" by the bad sweep. Teaching a
 *     skill circuit in a pool is the industry norm.
 *   - Bubble Maker: a kids' scuba intro. Its EN SEO description was rewritten
 *     from "pool-based" to "in shallow sheltered sea".
 *
 * Once Ben confirms, delete the entry and either restore the pool wording or
 * finish removing it in every language.
 */
const UNCONFIRMED_COURSE_DETAIL_KEYS = new Set(["IDC (Instructor Course)"]);
const UNCONFIRMED_SEO_SLUGS = new Set(["bubble-maker"]);

/**
 * Names that mark a string as being ABOUT a non-pool course. Used for the
 * free-prose sources (blog posts, UI strings) where copy is not keyed by
 * course, so "is this a pool claim about DSD?" has to be answered by
 * co-occurrence rather than by structure.
 */
const NON_POOL_COURSE_MARKERS: RegExp[] = [
  /\bdiscover scuba\b/i,
  /\bDSD\b/,
  /\btry dive\b/i,
  /\bbubble maker\b/i,
  /\bscuba review\b/i,
  /\bfun dive\b/i,
  /\bdescubre el buceo\b/i,
  /\bbautismo\b/i,
  /צלילת היכרות/,
  /באבל מייקר/,
];

/** Walk every string in a copy object. */
function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((v) => collectStrings(v, out));
  }
  return out;
}

function firstPoolClaim(text: string): RegExp | null {
  return POOL_CLAIM.find((pattern) => pattern.test(text)) ?? null;
}

/** Nothing in this copy may claim pool training. For non-OW courses only. */
function assertNoPoolClaims(source: unknown, label: string) {
  for (const text of collectStrings(source)) {
    const match = firstPoolClaim(text);
    expect(
      match,
      `${label}: "${text}" matches ${match} - only the Open Water course trains in the pool. ` +
        `Every other course is sea-only. See the header of this file.`,
    ).toBeNull();
  }
}

/** At least one string here must mention the pool. For OW copy only. */
function assertMentionsPool(source: unknown, label: string) {
  const found = collectStrings(source).some((text) => firstPoolClaim(text) !== null);
  expect(
    found,
    `${label}: the Open Water copy no longer mentions the pool. OW day 1 IS in the ` +
      `pool - do not "correct" it to sheltered sea. See the header of this file.`,
  ).toBe(true);
}

const LANGS: Lang[] = ["en", "es", "he"];

// ── 1. Non-OW courses must stay sea-only ─────────────────────────────────────

describe("no non-Open-Water lander claims pool training", () => {
  const guarded = (Object.keys(LANDER_COPY) as Offer[]).filter((o) => o !== OW_OFFER);
  for (const offer of guarded) {
    for (const lang of LANGS) {
      it(`${offer}/${lang}`, () => {
        assertNoPoolClaims(LANDER_COPY[offer][lang], `${offer}/${lang}`);
      });
    }
  }
});

describe("no non-Open-Water course detail claims pool training", () => {
  for (const [lang, courses] of Object.entries(courseDetails)) {
    for (const [courseName, detail] of Object.entries(courses)) {
      if (courseName === OW_COURSE_DETAIL_KEY) continue;
      if (UNCONFIRMED_COURSE_DETAIL_KEYS.has(courseName)) continue;
      it(`${lang}/${courseName}`, () => {
        assertNoPoolClaims(detail, `courseDetails/${lang}/${courseName}`);
      });
    }
  }
});

describe("no non-Open-Water course SEO claims pool training", () => {
  for (const [slug, seo] of Object.entries(COURSE_SEO)) {
    if (slug === OW_SEO_SLUG) continue;
    if (UNCONFIRMED_SEO_SLUGS.has(slug)) continue;
    it(slug, () => assertNoPoolClaims(seo, `courseSeoData/${slug}`));
  }
});

// Free prose: the copy is not keyed by course, so a pool claim only counts as a
// violation when the SAME string also names a course that does not use the pool.
// This is what catches "PADI Bubble Maker: pool-based intro" while leaving the
// Open Water blog posts free to describe day 1 accurately.
describe("free prose never attaches a pool to a non-pool course", () => {
  const check = (text: string, label: string) => {
    const pool = firstPoolClaim(text);
    if (!pool) return;
    const marker = NON_POOL_COURSE_MARKERS.find((m) => m.test(text));
    expect(
      marker,
      `${label}: "${text}" claims pool training (${pool}) for ${marker} - ` +
        `that course is sea-only. Only Open Water uses the pool.`,
    ).toBeUndefined();
  };

  it("UI translations", () => {
    for (const text of collectStrings(translations)) check(text, "translations");
  });

  for (const post of blogPosts) {
    it(`blog: ${post.slug}`, () => {
      for (const text of collectStrings(post)) check(text, `blog/${post.slug}`);
    });
  }
});

// ── 2. Open Water copy must KEEP its pool day ────────────────────────────────
// The inverse guard. Without this, the next agent that greps for "pool" and
// "corrects" it hits a green test suite.

describe("Open Water copy still says the pool day exists", () => {
  for (const lang of LANGS) {
    it(`lander owd/${lang}`, () => {
      assertMentionsPool(LANDER_COPY[OW_OFFER][lang], `owd/${lang}`);
    });
  }

  for (const [lang, courses] of Object.entries(courseDetails)) {
    const detail = courses[OW_COURSE_DETAIL_KEY];
    if (!detail) continue;
    it(`courseDetails ${lang}/${OW_COURSE_DETAIL_KEY}`, () => {
      assertMentionsPool(detail, `courseDetails/${lang}`);
    });
  }
});
