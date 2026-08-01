// Siam Scuba has NO swimming pool. Confined-water training happens in shallow,
// sheltered sea. See reference_siam_scuba_no_pool.
//
// Until 2026-08 the campaign landers, the course pages and the blog advertised
// "pool practice" in three languages, for a facility that does not exist. This
// test stops it coming back.
//
// This is a FACTUAL guard, not a positioning one. The site does not argue about
// the absence of a pool anywhere (that framing was dropped 2026-08-01); it just
// states, positively, that training starts in the sea. So the word "pool" is
// simply never allowed to describe something we offer.
import { describe, it, expect } from "vitest";
import { LANDER_COPY, type Lang, type Offer } from "../lib/landerCopy";
import { courseDetails } from "../i18n/courseDetails";
import { translations } from "../i18n/translations";
import { COURSE_SEO } from "../lib/courseSeoData";
import { blogPosts } from "../data/blogPosts";

/** Phrases that would claim we train people in a pool, per language. */
const FORBIDDEN: RegExp[] = [
  // EN
  /\bpool practice\b/i,
  /\bpool training\b/i,
  /\bpool session\b/i,
  /\bin (?:the|our|a) pool\b/i,
  /\bpool \/ confined/i,
  /\bpool-based\b/i,
  /\btheory and pool\b/i,
  // ES
  /\bprácticas en piscina\b/i,
  /\bsesión en piscina\b/i,
  /\bsesión de piscina\b/i,
  /\bentrenamiento en piscina\b/i,
  /\bteoría \+ piscina\b/i,
  /\bteoría y piscina\b/i,
  /\ben (?:la|una) piscina\b/i,
  /\ba la piscina\b/i,
  // HE - "in the pool" / "pool practice"
  /תרגול בבריכה/,
  /אימון בבריכה/,
  /מפגש בבריכה/,
  /בבריכה/,
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

function assertNoPoolClaims(source: unknown, label: string) {
  for (const text of collectStrings(source)) {
    for (const pattern of FORBIDDEN) {
      expect(
        pattern.test(text),
        `${label}: "${text}" matches ${pattern} - Siam Scuba has no pool. See reference_siam_scuba_no_pool.`,
      ).toBe(false);
    }
  }
}

const OFFERS = Object.keys(LANDER_COPY) as Offer[];
const LANGS: Lang[] = ["en", "es", "he"];

describe("no lander claims we train in a swimming pool", () => {
  for (const offer of OFFERS) {
    for (const lang of LANGS) {
      it(`${offer}/${lang}`, () => {
        assertNoPoolClaims(LANDER_COPY[offer][lang], `${offer}/${lang}`);
      });
    }
  }
});

// The landers are not the only surface that got this wrong: the course pages,
// the UI strings, the course SEO descriptions and the blog all claimed a pool
// too. Guard them at the same time or the claim just moves house.
describe("no site copy outside the landers claims a pool either", () => {
  it("course details (en/he/es)", () => assertNoPoolClaims(courseDetails, "courseDetails"));
  it("UI translations", () => assertNoPoolClaims(translations, "translations"));
  it("course SEO titles + descriptions", () => assertNoPoolClaims(COURSE_SEO, "courseSeoData"));

  for (const post of blogPosts) {
    it(`blog: ${post.slug}`, () => assertNoPoolClaims(post, `blog/${post.slug}`));
  }
});
