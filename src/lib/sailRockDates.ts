import { useEffect, useState } from "react";
import { SAIL_ROCK_WEEKDAY } from "@/data/sailRockDay";

// Sail Rock sails once a week, on the weekday named in src/data/sailRockDay.ts.
// That constant is the single source of truth for every "upcoming departures"
// UI on the site AND for the homepage week board, so the two can no longer
// disagree.
//
// It used to be a fixed 3-day cadence anchored to 2026-03-15, which stopped
// being true on 2026-09-10 when the boat moved to one weekly day trip. The
// board and the lander then quoted different departure days on the same site.
// If the cadence ever goes back to "every N days", the shape to restore is a
// step in days off an anchor - see git history for the old implementation.
//
// HYDRATION CONTRACT: all departure Dates are UTC midnights and all math /
// formatting is done in UTC. The first render (SSG *and* client hydration)
// computes "today" from the build-day stamp baked into both bundles, so the
// hydrated HTML always matches the static HTML; useUpcomingSailRockDates then
// refreshes to the visitor's real "today" in an effect. Formatting must use
// timeZone: "UTC" - viewer-local formatting made the same instant render as a
// different calendar day for negative-UTC-offset visitors (Americas), which
// was a hydration text mismatch (React #418/#425/#423) on every page showing
// departures.

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

/** The visitor's calendar day as a UTC midnight (matches the departure frame). */
function localTodayAsUtcMidnight(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

/**
 * The next `count` Sail Rock departures on or after `from` (a UTC-midnight
 * Date), rolling forward automatically. When `from` IS the sailing weekday it
 * counts as the next departure - the boat has not left yet at midnight.
 * No manual date upkeep. Defaults to the visitor's local calendar day.
 */
export function getUpcomingSailRockDates(count: number, from: Date = localTodayAsUtcMidnight()): Date[] {
  const daysAhead = (SAIL_ROCK_WEEKDAY - from.getUTCDay() + 7) % 7;
  const first = from.getTime() + daysAhead * DAY_MS;
  return Array.from({ length: count }, (_, i) => new Date(first + i * WEEK_MS));
}

/**
 * Hydration-safe upcoming departures: first render uses the build-day stamp
 * (identical in SSG output and client bundle, so hydration matches even when
 * the deployed build is days old), then refreshes to the visitor's real
 * "today" after mount.
 */
export function useUpcomingSailRockDates(count: number): Date[] {
  const [dates, setDates] = useState<Date[]>(() =>
    getUpcomingSailRockDates(count, new Date(`${__SSG_BUILD_DATE__}T00:00:00Z`)),
  );
  useEffect(() => {
    setDates(getUpcomingSailRockDates(count));
  }, [count]);
  return dates;
}

/** ISO yyyy-MM-dd of a UTC-midnight departure Date. */
export function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
