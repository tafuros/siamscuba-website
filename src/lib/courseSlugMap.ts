// Maps clean URL slugs to dialogKey values
export const SLUG_TO_COURSE: Record<string, string> = {
  "discover-scuba": "Discover Scuba Diving",
  "open-water": "Open Water Diver",
  "bubble-maker": "Bubble Maker",
  "scuba-review": "Scuba Review",
  "advanced-open-water": "Advanced Open Water",
  "rescue-diver": "Rescue Diver",
  "efr": "Emergency First Response (EFR)",
  "divemaster": "Divemaster",
  "idc": "IDC (Instructor Course)",
  "peak-performance-buoyancy": "Peak Performance Buoyancy",
  "wreck-diving": "Wreck Diving",
  "deep-diving": "Deep Diving",
  "night-dive": "Night Dive",
  "dpv": "Underwater Scooter (DPV)",
  "sidemount": "Sidemount Diving",
  "self-reliant-diver": "Self-Reliant Diver",
  "uw-photography": "UW Photography & Videography",
};

// Reverse map: dialogKey -> slug
export const COURSE_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_TO_COURSE).map(([slug, key]) => [key, slug])
);

/**
 * Where a course slug should LINK to. /divemaster 301s to the full lander
 * (vercel.json, 2026-11-03), so links skip the redirect hop.
 */
const COURSE_PATH_OVERRIDE: Record<string, string> = {
  divemaster: "/divemaster-course",
  // 301 since 2026-11-03: the homepage-with-dialog copy competed with the real lander.
  "advanced-open-water": "/advanced-open-water-course",
};
export const coursePath = (slug: string) => COURSE_PATH_OVERRIDE[slug] ?? `/${slug}`;
/** Course slugs that 301 to a lander: never prerendered, never in the sitemap. */
export const REDIRECTED_COURSE_SLUGS: readonly string[] = Object.keys(COURSE_PATH_OVERRIDE);
