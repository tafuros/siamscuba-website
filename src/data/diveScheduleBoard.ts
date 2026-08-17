/**
 * The weekly dive schedule - single source of truth for the homepage board.
 *
 * Every value here came from Ben (worksheet round, 2026-08-17). Do not "improve"
 * a time, a price or a site name from memory: the old DiveSchedule component
 * carried a 06:00 meet and an invented per-dive timeline that had drifted from
 * both info.json and reality. Where a fact was not confirmed it is simply not
 * stated - an absent line is better than a wrong one.
 *
 * Two deliberate omissions, both waiting on a coordinated DiveOS session:
 *  - `sail-rock-half-day` has no product code. Its 3,800 price has no matching
 *    entry in the DiveOS catalogue, and preselecting SAILROCK would open the
 *    wizard showing 4,000. Sending no product is the honest degrade: the wizard
 *    opens on its own chooser instead of quoting a price we'd have to walk back.
 *  - `three-site-day-trip` reuses SAILROCK because the price matches; confirm
 *    whether the 3-site trip is a separate catalogue item.
 */

/** Dive sites that have their own page - the rest render as plain text. */
const SITE_PAGES: Record<string, string> = {
  "Chumphon Pinnacle": "chumphon-pinnacle",
  "Sail Rock": "sail-rock",
  Twins: "twins",
};

export type TripId =
  | "morning-fun-dive"
  | "afternoon-fun-dive"
  | "sail-rock-half-day"
  | "three-site-day-trip"
  | "night-dive"
  | "snorkeling";

export interface TripSite {
  name: string;
  /** Free-text qualifier shown after the name, e.g. "wreck". */
  note?: string;
}

export interface Trip {
  id: TripId;
  name: string;
  /** One line under the title in the detail panel. */
  tagline: string;
  meet: string;
  back: string;
  dives: number;
  priceThb: number;
  level: string;
  /** Trip only sails once this many divers are booked; below it, full refund. */
  minDivers?: number;
  /** DiveOS catalogue code for the booking wizard. Omit to open the chooser. */
  productCode?: string;
  /** Analytics slot name for book_now_click. */
  trackingSlot: string;
  includes: string[];
}

export interface DaySlot {
  tripId: TripId;
  /** The sites usually dived in this slot. Conditions can change them. */
  sites: TripSite[];
}

export interface ScheduleDay {
  /** Stable id, also the anchor/DOM key. */
  key: string;
  /** Full weekday name - indexable text, not an abbreviation. */
  label: string;
  short: string;
  slots: DaySlot[];
}

export const trips: Record<TripId, Trip> = {
  "morning-fun-dive": {
    id: "morning-fun-dive",
    name: "Morning Fun Dive",
    tagline: "Two dives on the deep pinnacles, back before lunch",
    meet: "05:50",
    back: "11:00",
    dives: 2,
    priceThb: 2000,
    level: "Open Water and up - Advanced recommended for the deep pinnacles",
    productCode: "FD",
    trackingSlot: "board_morning_fun_dive",
    includes: [
      "2 guided dives with a professional instructor",
      "Full diving equipment",
      "Full air tank (180-200 bar)",
      "Fresh pineapple on the boat",
      "Dive insurance",
      "Photography add-on available",
    ],
  },
  "afternoon-fun-dive": {
    id: "afternoon-fun-dive",
    name: "Afternoon Fun Dive",
    tagline: "Two dives on the reefs around Koh Tao - sites change daily",
    meet: "11:00",
    back: "16:00",
    dives: 2,
    priceThb: 2000,
    level: "Open Water and up",
    productCode: "FD",
    trackingSlot: "board_afternoon_fun_dive",
    includes: [
      "2 guided dives with a professional instructor",
      "Full diving equipment",
      "Full air tank (180-200 bar)",
      "Fresh pineapple on the boat",
      "Dive insurance",
      "Photography add-on available",
    ],
  },
  "sail-rock-half-day": {
    id: "sail-rock-half-day",
    name: "Sail Rock Half-Day",
    tagline: "Two dives on the best pinnacle in the Gulf of Thailand",
    meet: "10:00",
    back: "18:00",
    dives: 2,
    priceThb: 3800,
    level: "Open Water and up - Advanced recommended",
    minDivers: 4,
    trackingSlot: "board_sail_rock_half_day",
    includes: [
      "2 guided dives at Sail Rock",
      "Full diving equipment",
      "Lunch on the boat",
      "Dive insurance",
    ],
  },
  "three-site-day-trip": {
    id: "three-site-day-trip",
    name: "3-Site Day Trip",
    tagline: "A full day on the boat - three dives, breakfast and Thai lunch",
    meet: "07:00",
    back: "17:00",
    dives: 3,
    priceThb: 4000,
    level: "Open Water and up - Advanced recommended",
    minDivers: 10,
    productCode: "SAILROCK",
    trackingSlot: "board_three_site_day_trip",
    includes: [
      "3 guided dives",
      "Full diving equipment",
      "Breakfast on the boat",
      "Thai buffet lunch",
      "Coffee, tea and cookies",
      "Fresh fruit",
      "Dive insurance",
    ],
  },
  "night-dive": {
    id: "night-dive",
    name: "Night Dive",
    tagline: "One guided dive after dark, when the reef changes shift",
    meet: "45 minutes before sunset",
    back: "20:15",
    dives: 1,
    priceThb: 1300,
    level: "Open Water and up",
    productCode: "NIGHT DIVE",
    trackingSlot: "board_night_dive",
    includes: [
      "1 guided night dive with a professional instructor",
      "Full diving equipment",
      "Dive light",
      "Dive insurance",
    ],
  },
  snorkeling: {
    id: "snorkeling",
    name: "Snorkelling",
    tagline: "Join the dive boat and take the reef from the surface",
    meet: "11:00",
    back: "16:00",
    dives: 0,
    priceThb: 500,
    level: "No certification needed",
    trackingSlot: "board_snorkeling",
    includes: [
      "Snorkelling equipment and float",
      "Boat trip",
      "Snacks and fresh fruit on board",
    ],
  },
};

const CHUMPHON: TripSite = { name: "Chumphon Pinnacle" };
const SOUTHWEST: TripSite = { name: "Southwest Pinnacle" };
const SAIL_ROCK: TripSite = { name: "Sail Rock" };
const SHARK_ISLAND: TripSite = { name: "Shark Island" };

export const weeklySchedule: ScheduleDay[] = [
  {
    key: "monday",
    label: "Monday",
    short: "Mon",
    slots: [{ tripId: "three-site-day-trip", sites: [SOUTHWEST, SAIL_ROCK, SHARK_ISLAND] }],
  },
  {
    key: "tuesday",
    label: "Tuesday",
    short: "Tue",
    slots: [
      { tripId: "morning-fun-dive", sites: [CHUMPHON, { name: "HTMS Suphairin", note: "wreck" }] },
      { tripId: "sail-rock-half-day", sites: [SAIL_ROCK, SAIL_ROCK] },
    ],
  },
  {
    key: "wednesday",
    label: "Wednesday",
    short: "Wed",
    slots: [{ tripId: "three-site-day-trip", sites: [SOUTHWEST, { name: "Samran" }, SAIL_ROCK] }],
  },
  {
    key: "thursday",
    label: "Thursday",
    short: "Thu",
    slots: [
      { tripId: "morning-fun-dive", sites: [CHUMPHON, { name: "Green Rock" }] },
      { tripId: "sail-rock-half-day", sites: [SAIL_ROCK, SAIL_ROCK] },
    ],
  },
  {
    key: "friday",
    label: "Friday",
    short: "Fri",
    slots: [
      { tripId: "morning-fun-dive", sites: [CHUMPHON, { name: "HTMS Suphairin", note: "wreck" }] },
      { tripId: "sail-rock-half-day", sites: [SAIL_ROCK, SAIL_ROCK] },
    ],
  },
  {
    key: "saturday",
    label: "Saturday",
    short: "Sat",
    slots: [{ tripId: "three-site-day-trip", sites: [SOUTHWEST, SAIL_ROCK, SHARK_ISLAND] }],
  },
  {
    key: "sunday",
    label: "Sunday",
    short: "Sun",
    slots: [
      { tripId: "morning-fun-dive", sites: [CHUMPHON, { name: "HTMS Sattakut", note: "wreck" }] },
      { tripId: "sail-rock-half-day", sites: [SAIL_ROCK, SAIL_ROCK] },
    ],
  },
];

/** Runs every day alongside the board, so it gets its own row rather than 7 cells. */
export const alsoEveryDay: TripId[] = ["afternoon-fun-dive", "night-dive", "snorkeling"];

/** Path to a dive site's page, or null when we don't have one. */
export function diveSitePath(siteName: string): string | null {
  const slug = SITE_PAGES[siteName];
  return slug ? `/dive-sites/${slug}` : null;
}

/** Booking URL for a trip. No product code -> the wizard's own chooser. */
export function tripBookingPath(trip: Trip): string {
  return trip.productCode
    ? `/fun-dive-booking?product=${encodeURIComponent(trip.productCode)}`
    : "/fun-dive-booking";
}

/**
 * The board as structured data: one ItemList of TouristTrip offers.
 *
 * Mirrors the pattern the homepage already uses for courses (ItemList of Course
 * + Offer in index.html) rather than inventing a second shape. Prices are the
 * same constants the UI renders, so the two can't drift.
 */
export function buildScheduleJsonLd(siteUrl = "https://siamscuba.com") {
  const ordered: TripId[] = [
    "morning-fun-dive",
    "afternoon-fun-dive",
    "sail-rock-half-day",
    "three-site-day-trip",
    "night-dive",
    "snorkeling",
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Daily dive trips - Siam Scuba, Koh Tao",
    itemListElement: ordered.map((id, i) => {
      const trip = trips[id];
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristTrip",
          name: trip.name,
          description: trip.tagline,
          provider: { "@type": "Organization", "@id": `${siteUrl}/#organization` },
          offers: {
            "@type": "Offer",
            price: String(trip.priceThb),
            priceCurrency: "THB",
            availability: "https://schema.org/InStock",
            url: `${siteUrl}${tripBookingPath(trip)}`,
          },
        },
      };
    }),
  };
}

export const SCHEDULE_NOTES = {
  weather:
    "Dive sites shown are the usual plan for each day. Conditions on the morning can change them - the crew picks the best site on the day.",
  season: "The schedule runs year-round, weather permitting.",
  refund: (min: number) =>
    `Sails with a minimum of ${min} divers. If the trip doesn't fill, you get a full refund.`,
} as const;
