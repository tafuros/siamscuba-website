import type { Language } from "@/i18n/translations";

/**
 * Locale twins: which URL serves the same content in each language.
 *
 * WHY THIS FILE EXISTS
 * The language switcher used to call setLanguage() only. That flips the in-app
 * `t()` strings but never changes the URL, so every locale-prefixed route
 * (/he, /es, /es/open-water-course, /fr/fun-dives ...) was unreachable through
 * the UI - you could only land on one from an ad or a direct link. This table
 * gives the switcher a destination.
 *
 * INVARIANT: every path listed here MUST be a real route in src/routes.tsx.
 * Vercel hard-404s unmatched paths (localhost does not - see AGENTS.md), so a
 * typo here ships a dead link. `src/test/locale-routes.test.ts` asserts each
 * entry against routes.tsx, so a stale row fails CI instead of production.
 *
 * A language is simply absent from a family when that translation does not
 * exist (e.g. French only has /fr/fun-dives). Absent means "do not navigate" -
 * see localizedPath below.
 */
export const LOCALE_FAMILIES: Partial<Record<Language, string>>[] = [
  // Homepage / language landing pages. "/" is the multilingual homepage, so it
  // doubles as the English + French destination.
  { en: "/", he: "/he", es: "/es" },
  { en: "/discover-scuba-diving", es: "/es/discover-scuba-diving", he: "/he/discover-scuba-diving" },
  { en: "/open-water-course", es: "/es/open-water-course", he: "/he/open-water-course" },
  {
    en: "/advanced-open-water-course",
    es: "/es/advanced-open-water-course",
    he: "/he/advanced-open-water-course",
  },
  { en: "/fun-dives", es: "/es/fun-dives", he: "/he/fun-dives", fr: "/fr/fun-dives" },
  { en: "/sail-rock-diving", es: "/es/sail-rock-diving", he: "/he/sail-rock-diving" },
  {
    en: "/conservation",
    he: "/he/conservation",
    es: "/es/conservation",
    fr: "/fr/conservation",
  },
  { en: "/hotel", he: "/he/hotel", es: "/es/hotel", fr: "/fr/hotel" },
  { en: "/go-pro", he: "/he/go-pro", es: "/es/go-pro", fr: "/fr/go-pro" },
];

const SITE_URL = "https://siamscuba.com";

/** Strip a trailing slash so "/es/fun-dives/" matches "/es/fun-dives". */
const normalize = (pathname: string) =>
  pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

/** The locale family `pathname` belongs to, or undefined when it has no twins. */
const familyFor = (pathname: string) => {
  const current = normalize(pathname);
  return LOCALE_FAMILIES.find((f) => Object.values(f).some((path) => path === current));
};

/**
 * Absolute hreflang alternates for the locale family `pathname` belongs to, or
 * undefined when the page has no twins (Seo omits the tags entirely on
 * undefined, which is the correct answer for a single-URL multilingual page).
 *
 * WHY THIS IS DERIVED AND NOT WRITTEN OUT PER PAGE
 * hreflang only works when it is RECIPROCAL: Google discards the annotation
 * unless every page in a cluster points at every other page in it, itself
 * included. /es shipped with a hand-written alternates object while "/" and
 * /he declared nothing, so the tags did nothing at all. Deriving all three
 * from the single LOCALE_FAMILIES row makes the cluster reciprocal by
 * construction - one page cannot drift out of it - and those paths are already
 * asserted against routes.tsx by src/test/locale-routes.test.ts, so an
 * alternate can never point at a URL that Vercel would 404.
 */
export function hreflangAlternatesFor(
  pathname: string
): Partial<Record<Language, string>> | undefined {
  const family = familyFor(pathname);
  if (!family) return undefined;
  const alternates: Partial<Record<Language, string>> = {};
  for (const [lang, path] of Object.entries(family) as [Language, string][]) {
    alternates[lang] = `${SITE_URL}${path}`;
  }
  return alternates;
}

/**
 * The "/" + /he + /es cluster, shared by Index, HebrewLanding and
 * SpanishLanding so all three emit the identical set.
 *
 * The sitemap declares the same cluster for the same three URLs
 * (scripts/generate-sitemap.ts). Keep them in step: Google treats an HTML
 * annotation that disagrees with the sitemap one as an error and drops both.
 */
export const HOME_HREFLANG_ALTERNATES = hreflangAlternatesFor("/");

/**
 * The URL that serves the current page in `lang`, or null when no such page
 * exists.
 *
 * null is the honest answer for most of the site: /dive-sites, /blog, the
 * course pages and the booking flow are single URLs that translate themselves
 * through the i18n context, and the Spanish blog posts have their own slugs
 * rather than translated twins. The switcher treats null as "stay here and just
 * switch the language" - which is correct for those pages, and is why this
 * returns null instead of guessing a path that would 404 on Vercel.
 */
export function localizedPath(pathname: string, lang: Language): string | null {
  const family = familyFor(pathname);
  if (!family) return null;
  return family[lang] ?? null;
}
