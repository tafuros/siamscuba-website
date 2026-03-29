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
  "dpv": "Underwater Scooter (DPV)",
  "sidemount": "Sidemount Diving",
  "uw-photography": "UW Photography & Videography",
};

// Reverse map: dialogKey -> slug
export const COURSE_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_TO_COURSE).map(([slug, key]) => [key, slug])
);
