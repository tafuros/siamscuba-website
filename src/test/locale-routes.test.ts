// Locale twins used by the language switcher (src/lib/localeRoutes.ts).
//
// The switcher navigates to whatever this table returns, so a path that is not
// a real route in routes.tsx becomes a hard 404 on Vercel (localhost serves
// index.html for everything and would never catch it - see AGENTS.md).
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  HOME_HREFLANG_ALTERNATES,
  LOCALE_FAMILIES,
  hreflangAlternatesFor,
  languageGuidePath,
  localizedPath,
} from "../lib/localeRoutes";

const routesSrc = readFileSync(resolve(__dirname, "../routes.tsx"), "utf8");

/** routes.tsx declares child paths without the leading slash ("es/fun-dives"). */
const routeExists = (path: string) =>
  path === "/" ? true : routesSrc.includes(`path: "${path.slice(1)}"`);

describe("every locale-family path is a real route", () => {
  for (const family of LOCALE_FAMILIES) {
    for (const [lang, path] of Object.entries(family)) {
      it(`${lang} -> ${path}`, () => {
        expect(
          routeExists(path),
          `${path} is in LOCALE_FAMILIES but has no matching route in src/routes.tsx - ` +
            `the language switcher would send visitors to a 404.`,
        ).toBe(true);
      });
    }
  }
});

describe("localizedPath", () => {
  // REGRESSION 2026-08-30. /he and /es are standalone guide ARTICLES, not
  // translations of the homepage, so the switcher must never jump there from
  // "/" - the homepage renders every language itself. Ben hit this as "tapping
  // Hebrew opens a Koh Tao diving explainer instead of translating the page".
  it("never navigates away from the self-translating homepage", () => {
    expect(localizedPath("/", "he")).toBeNull();
    expect(localizedPath("/", "es")).toBeNull();
    expect(localizedPath("/", "en")).toBeNull();
    expect(localizedPath("/", "fr")).toBeNull();
  });

  // ...but the guides CAN'T translate themselves (hardcoded single-language
  // copy), so leaving one for the homepage stays the right escape hatch. The
  // rule keys off the SOURCE page, which is what makes this asymmetric.
  it("maps a language landing back to the homepage for English", () => {
    expect(localizedPath("/es", "en")).toBe("/");
    expect(localizedPath("/he", "en")).toBe("/");
    expect(localizedPath("/es", "he")).toBe("/he");
  });

  it("maps landers across locales", () => {
    expect(localizedPath("/fun-dives", "es")).toBe("/es/fun-dives");
    expect(localizedPath("/es/fun-dives", "he")).toBe("/he/fun-dives");
    expect(localizedPath("/he/open-water-course", "es")).toBe("/es/open-water-course");
    expect(localizedPath("/es/sail-rock-diving", "en")).toBe("/sail-rock-diving");
  });

  it("tolerates a trailing slash", () => {
    expect(localizedPath("/es/fun-dives/", "en")).toBe("/fun-dives");
  });

  // French only exists for fun-dives. Returning null keeps the switcher on the
  // current page instead of inventing /fr/open-water-course.
  it("returns null when the target language has no twin", () => {
    expect(localizedPath("/", "fr")).toBeNull();
    expect(localizedPath("/open-water-course", "fr")).toBeNull();
    expect(localizedPath("/fun-dives", "fr")).toBe("/fr/fun-dives");
  });

  it("returns null for pages that translate themselves in place", () => {
    expect(localizedPath("/dive-sites", "es")).toBeNull();
    expect(localizedPath("/blog/koh-tao-taxi-app", "es")).toBeNull();
    expect(localizedPath("/fun-dive-booking", "he")).toBeNull();
  });
});

// The guides stopped being the switcher's destination on 2026-08-30, so the
// footer link is now their ONLY internal inbound link. If it silently stops
// rendering they are orphaned from the link graph exactly like the campaign
// landers were.
describe("languageGuidePath", () => {
  it("offers each guide to the language it was written for", () => {
    expect(languageGuidePath("he")).toBe("/he");
    expect(languageGuidePath("es")).toBe("/es");
  });

  it("has nothing to offer English and French - there is no such guide", () => {
    expect(languageGuidePath("en")).toBeNull();
    expect(languageGuidePath("fr")).toBeNull();
  });

  it("is rendered by the footer, or the guides go orphaned", () => {
    const footer = readFileSync(resolve(__dirname, "../components/Footer.tsx"), "utf8");
    expect(footer.includes("languageGuidePath")).toBe(true);
    expect(footer.includes('t("nav_language_guide")')).toBe(true);
  });
});

// Same wrong assumption as the switcher's, in a second place: the hotel
// mini-site's "visit the dive centre" CTAs sent Hebrew and Spanish readers to
// the guide articles instead of the dive centre. "/" is the only correct answer
// in every language - it is the multilingual homepage, and /fr does not exist.
describe("hotel dive-centre link", () => {
  it("points at the multilingual homepage, never a locale prefix", () => {
    const hotel = readFileSync(resolve(__dirname, "../data/hotel.ts"), "utf8");
    expect(/export const DIVE_SITE_HOME_PATH = "\/";/.test(hotel)).toBe(true);
    const content = readFileSync(
      resolve(__dirname, "../components/hotel/HotelContent.tsx"),
      "utf8",
    );
    expect(content.includes("DIVE_SITE_HOME_PATH")).toBe(true);
    expect(content.includes("diveSiteHomePath")).toBe(false);
  });
});

// hreflang is only honoured when it is RECIPROCAL. /es originally declared
// alternates while "/" and /he declared none, so Google discarded the lot and
// the Spanish landing read as duplicate content instead of a translation.
describe("homepage hreflang cluster", () => {
  it("covers all three languages as absolute URLs", () => {
    expect(HOME_HREFLANG_ALTERNATES).toEqual({
      en: "https://siamscuba.com/",
      he: "https://siamscuba.com/he",
      es: "https://siamscuba.com/es",
    });
  });

  it("is identical from every member of the cluster", () => {
    expect(hreflangAlternatesFor("/he")).toEqual(HOME_HREFLANG_ALTERNATES);
    expect(hreflangAlternatesFor("/es")).toEqual(HOME_HREFLANG_ALTERNATES);
    expect(hreflangAlternatesFor("/es/")).toEqual(HOME_HREFLANG_ALTERNATES);
  });

  // The switcher no longer routes between "/", /he and /es, but they remain one
  // hreflang cluster - that is an SEO annotation about language targeting, not
  // a claim that the switcher can move between them.
  it("survives the self-translating-homepage rule", () => {
    expect(hreflangAlternatesFor("/")).toEqual(HOME_HREFLANG_ALTERNATES);
    expect(localizedPath("/", "he")).toBeNull();
  });

  it("is undefined for pages with no locale twins", () => {
    expect(hreflangAlternatesFor("/dive-sites")).toBeUndefined();
    expect(hreflangAlternatesFor("/blog")).toBeUndefined();
  });

  // The derivation only pays off if all three pages actually consume it. A page
  // that hand-rolls its own object (or drops the prop) breaks reciprocity
  // without breaking anything a unit test would otherwise notice.
  const CLUSTER_PAGES = ["Index.tsx", "HebrewLanding.tsx", "SpanishLanding.tsx"];
  for (const page of CLUSTER_PAGES) {
    it(`${page} passes the shared cluster to <Seo>`, () => {
      const src = readFileSync(resolve(__dirname, "../pages", page), "utf8");
      expect(
        /hreflangAlternates=\{[^}]*HOME_HREFLANG_ALTERNATES/.test(src),
        `${page} must pass HOME_HREFLANG_ALTERNATES to <Seo hreflangAlternates>. ` +
          `Hand-written alternates drift and Google drops non-reciprocal hreflang.`,
      ).toBe(true);
    });
  }
});
