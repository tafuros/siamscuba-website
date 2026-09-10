/**
 * The weekly dive schedule - single source of truth for the homepage board.
 *
 * Every value here came from Ben (schedule round, 2026-09-10, superseding the
 * 2026-08-17 worksheet). Do not "improve" a time, a price or a site name from
 * memory. Where a fact was not confirmed it is simply not stated - an absent
 * line is better than a wrong one.
 *
 * WHAT CHANGED ON 2026-09-10, and why the shape of this file changed with it:
 * the schedule stopped varying by weekday. Morning and afternoon fun dives now
 * run every single day, off the same site rotation, and the only day-specific
 * thing left is the Sail Rock day trip. So sites moved off the day and onto the
 * trip (`divePlan`), and the week is GENERATED from one constant rather than
 * hand-written seven times - see src/data/sailRockDay.ts. Seven hand-written
 * days is seven chances to leave one of them stale.
 *
 * The retired `sail-rock-half-day` (3,800, min 4) and the three-days-a-week
 * `three-site-day-trip` are gone: both collapsed into `sail-rock-day-trip`.
 */

import { SAIL_ROCK_DAY_KEY } from "./sailRockDay";

/** Dive sites that have their own page - the rest render as plain text. */
const SITE_PAGES: Record<string, string> = {
  "Chumphon Pinnacle": "chumphon-pinnacle",
  "Sail Rock": "sail-rock",
  Twins: "twins",
};

export type TripId =
  | "morning-fun-dive"
  | "afternoon-fun-dive"
  | "sail-rock-day-trip"
  | "night-dive"
  | "snorkeling";

export interface TripSite {
  name: string;
  /** Free-text qualifier shown after the name, e.g. "wreck". */
  note?: string;
}

/**
 * One dive of a trip. `sites` with several entries means a rotation the crew
 * picks from on the day - not several dives. `freeText` covers the case where
 * the rotation is not a closed list we are willing to name.
 */
export interface DiveLeg {
  label: string;
  sites?: TripSite[];
  freeText?: string;
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
  /**
   * Named sites on the compact board card. Kept ON the card, not only in the
   * panel: real site names are what the page ranks for, and the ones with their
   * own page become internal links from every day of the week.
   */
  boardSites: TripSite[];
  /** Muted tail after the card's site list, e.g. "+ more island reefs". */
  boardMore?: string;
  /** Per-dive plan, shown in the detail panel. Empty for trips with no dives. */
  divePlan: DiveLeg[];
  /** Renders the card in the warm accent - reserved for the week's flagship. */
  flagship?: boolean;
  includes: string[];
}

export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ScheduleDay {
  /** Stable id, also the anchor/DOM key. */
  key: DayKey;
  /** Full weekday name - indexable text, not an abbreviation. */
  label: string;
  short: string;
  /** Trips sailing that day, in the order they should read on the board. */
  slots: TripId[];
}

const CHUMPHON: TripSite = { name: "Chumphon Pinnacle" };
const SOUTHWEST: TripSite = { name: "Southwest Pinnacle" };
const SAIL_ROCK: TripSite = { name: "Sail Rock" };
const SHARK_ISLAND: TripSite = { name: "Shark Island" };
const WHITE_ROCK: TripSite = { name: "White Rock" };
const JAPANESE_GARDENS: TripSite = { name: "Japanese Gardens" };
const TWINS: TripSite = { name: "Twins" };
const GREEN_ROCK: TripSite = { name: "Green Rock" };
const MANGO_BAY: TripSite = { name: "Mango Bay" };
const SATTAKUT: TripSite = { name: "HTMS Sattakut", note: "wreck" };
const SUPHAIRIN: TripSite = { name: "HTMS Suphairin", note: "wreck" };

/**
 * The reefs and wrecks the second morning dive and both afternoon dives rotate
 * through. Every name here is one the site already claims elsewhere (blog,
 * funDiveCopy, the old board) - nothing invented, and Ben confirmed on
 * 2026-09-10 that the boat dives all of them.
 */
const ISLAND_ROTATION: TripSite[] = [
  WHITE_ROCK,
  JAPANESE_GARDENS,
  TWINS,
  GREEN_ROCK,
  MANGO_BAY,
  SHARK_ISLAND,
  SATTAKUT,
  SUPHAIRIN,
];

const FUN_DIVE_INCLUDES = [
  "2 guided dives with a professional instructor",
  "Full diving equipment",
  "Full air tank (180-200 bar)",
  "Fresh pineapple on the boat",
  "Dive insurance",
  "Photography add-on available",
];

export const trips: Record<TripId, Trip> = {
  "morning-fun-dive": {
    id: "morning-fun-dive",
    name: "Morning Fun Dive",
    tagline: "One of the big pinnacles at first light, then a second site - back before lunch",
    meet: "05:50",
    back: "11:00",
    dives: 2,
    priceThb: 2000,
    level: "Open Water and up - Advanced recommended for the deep pinnacles",
    productCode: "FD",
    trackingSlot: "board_morning_fun_dive",
    boardSites: [CHUMPHON, SOUTHWEST, SHARK_ISLAND],
    boardMore: "+ a reef or wreck",
    divePlan: [
      {
        label: "Dive 1",
        sites: [CHUMPHON, SOUTHWEST, SHARK_ISLAND],
        freeText: "whichever of the three the morning's conditions favour",
      },
      {
        label: "Dive 2",
        sites: ISLAND_ROTATION,
        freeText: "chosen on the day",
      },
    ],
    includes: FUN_DIVE_INCLUDES,
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
    boardSites: [WHITE_ROCK, JAPANESE_GARDENS, TWINS],
    boardMore: "+ more island reefs",
    divePlan: [
      { label: "Dive 1", sites: ISLAND_ROTATION, freeText: "the rotation changes daily" },
      { label: "Dive 2", sites: ISLAND_ROTATION, freeText: "a second site, picked to suit the conditions" },
    ],
    includes: FUN_DIVE_INCLUDES,
  },
  "sail-rock-day-trip": {
    id: "sail-rock-day-trip",
    name: "Sail Rock Day Trip",
    tagline: "A full day on the boat - two dives at Sail Rock plus Shark Island, meals on board",
    meet: "06:30",
    back: "16:00",
    dives: 3,
    priceThb: 4000,
    level: "Open Water and up - Advanced recommended",
    // Carried over from the 3-site day trip this replaced (confirmed 2026-08-17).
    // Ben has not re-confirmed it for the weekly trip - see the website HQ board.
    minDivers: 10,
    productCode: "SAILROCK",
    trackingSlot: "board_sail_rock_day_trip",
    boardSites: [SAIL_ROCK, SAIL_ROCK, SHARK_ISLAND],
    flagship: true,
    divePlan: [
      { label: "Dive 1", sites: [SAIL_ROCK] },
      { label: "Dive 2", sites: [SAIL_ROCK] },
      { label: "Dive 3", sites: [SHARK_ISLAND] },
    ],
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
    boardSites: [],
    divePlan: [{ label: "Dive 1", sites: ISLAND_ROTATION, freeText: "chosen on the day" }],
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
    boardSites: [],
    divePlan: [],
    includes: [
      "Snorkelling equipment and float",
      "Boat trip",
      "Snacks and fresh fruit on board",
    ],
  },
};

/** Runs every single day of the week, Sail Rock day included. */
const EVERY_DAY: TripId[] = ["morning-fun-dive", "afternoon-fun-dive"];

const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

/**
 * The week, generated. The Sail Rock day gets the flagship trip on top of the
 * two that run daily; every other day is the same two. Moving the boat is one
 * edit in src/data/sailRockDay.ts, not seven edits here.
 */
export const weeklySchedule: ScheduleDay[] = DAYS.map(({ key, label, short }) => ({
  key,
  label,
  short,
  slots: key === SAIL_ROCK_DAY_KEY ? (["sail-rock-day-trip", ...EVERY_DAY] as TripId[]) : EVERY_DAY,
}));

/** Trips that aren't tied to a weekday and get their own row under the board. */
export const alsoEveryDay: TripId[] = ["night-dive", "snorkeling"];

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
    "sail-rock-day-trip",
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
