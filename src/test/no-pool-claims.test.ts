// Siam Scuba has NO swimming pool. Confined-water training happens in shallow,
// sheltered sea. That is both a fact and the single strongest differentiator in
// the business - Master Divers also has no pool but never says so, Ban's
// advertises five, and Big Blue/Roctopus sell pool training as an upgrade.
//
// Until 2026-08 the campaign landers advertised "pool practice" in three
// languages, which was factually wrong AND handed away the one claim nobody
// else on the island makes. This test stops it coming back.
//
// The word "pool" is allowed ONLY as an explicit contrast ("we have no pool",
// "not a pool"). It is never allowed to describe something we offer.
import { describe, it, expect } from "vitest";
import { LANDER_COPY, type Lang, type Offer } from "../lib/landerCopy";
import { NO_POOL_COPY, type NoPoolLang } from "../lib/noPoolCopy";

/** Phrases that would claim we train people in a pool, per language. */
const FORBIDDEN: RegExp[] = [
  // EN
  /\bpool practice\b/i,
  /\bpool training\b/i,
  /\bpool session\b/i,
  /\bin (?:the|our) pool\b/i,
  /\bpool \/ confined/i,
  // ES
  /\bprácticas en piscina\b/i,
  /\bsesión en piscina\b/i,
  /\bentrenamiento en piscina\b/i,
  /\bteoría \+ piscina\b/i,
  // HE - "in the pool" / "pool practice"
  /תרגול בבריכה/,
  /אימון בבריכה/,
  /מפגש בבריכה/,
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

const OFFERS = Object.keys(LANDER_COPY) as Offer[];
const LANGS: Lang[] = ["en", "es", "he"];

describe("no lander claims we train in a swimming pool", () => {
  for (const offer of OFFERS) {
    for (const lang of LANGS) {
      it(`${offer}/${lang}`, () => {
        for (const text of collectStrings(LANDER_COPY[offer][lang])) {
          for (const pattern of FORBIDDEN) {
            expect(
              pattern.test(text),
              `"${text}" matches ${pattern} - Siam Scuba has no pool. See reference_siam_scuba_no_pool.`,
            ).toBe(false);
          }
        }
      });
    }
  }
});

describe("the /no-pool page makes the argument in every language", () => {
  const langs: NoPoolLang[] = ["en", "es", "he"];

  for (const lang of langs) {
    it(`${lang}: states the no-pool claim and does not sell pool training`, () => {
      const copy = NO_POOL_COPY[lang];
      const all = collectStrings(copy);

      for (const text of all) {
        for (const pattern of FORBIDDEN) {
          expect(pattern.test(text), `"${text}" matches ${pattern}`).toBe(false);
        }
      }

      // The contrast word must be present - that IS the page.
      const joined = all.join(" ").toLowerCase();
      const contrastWord = { en: "pool", es: "piscina", he: "בריכה" }[lang];
      expect(joined).toContain(contrastWord);

      // And it must route on to the booking-capable course landers.
      expect(copy.courses.length).toBeGreaterThanOrEqual(3);
      for (const course of copy.courses) {
        expect(course.path.startsWith("/")).toBe(true);
        expect(course.product).toMatch(/^[A-Z]+$/);
      }
    });
  }

  it("localises the course links to the matching language prefix", () => {
    for (const course of NO_POOL_COPY.es.courses) expect(course.path.startsWith("/es/")).toBe(true);
    for (const course of NO_POOL_COPY.he.courses) expect(course.path.startsWith("/he/")).toBe(true);
    for (const course of NO_POOL_COPY.en.courses) expect(course.path).not.toMatch(/^\/(es|he)\//);
  });
});

describe("entry-level landers link to the no-pool argument", () => {
  const cases: [Offer, Lang, string][] = [
    ["owd", "en", "/no-pool"],
    ["owd", "es", "/es/no-pool"],
    ["owd", "he", "/he/no-pool"],
    ["dsd", "en", "/no-pool"],
    ["dsd", "es", "/es/no-pool"],
    ["dsd", "he", "/he/no-pool"],
  ];

  for (const [offer, lang, path] of cases) {
    it(`${offer}/${lang} -> ${path}`, () => {
      expect(LANDER_COPY[offer][lang].noPoolNote?.linkPath).toBe(path);
    });
  }
});
