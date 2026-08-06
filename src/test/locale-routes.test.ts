// Locale twins used by the language switcher (src/lib/localeRoutes.ts).
//
// The switcher navigates to whatever this table returns, so a path that is not
// a real route in routes.tsx becomes a hard 404 on Vercel (localhost serves
// index.html for everything and would never catch it - see AGENTS.md).
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { LOCALE_FAMILIES, localizedPath } from "../lib/localeRoutes";

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
  it("maps the homepage to the language landings", () => {
    expect(localizedPath("/", "es")).toBe("/es");
    expect(localizedPath("/", "he")).toBe("/he");
    expect(localizedPath("/", "en")).toBe("/");
  });

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
