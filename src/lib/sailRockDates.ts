import { useEffect, useState } from "react";

// Sail Rock departs on a fixed 3-day cadence. This anchor + step is the single
// source of truth for every "upcoming departures" UI on the site (DiveSchedule
// strip, Sail Rock lander) so the dates never drift between surfaces.
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
export const SAIL_ROCK_FIRST = new Date("2026-03-15"); // first departure (anchor, UTC midnight)
export const SAIL_ROCK_STEP_DAYS = 3;

const DAY_MS = 24 * 60 * 60 * 1000;
const STEP_MS = SAIL_ROCK_STEP_DAYS * DAY_MS;

/** The visitor's calendar day as a UTC midnight (matches the anchor's frame). */
function localTodayAsUtcMidnight(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

/**
 * Returns the next `count` Sail Rock departure dates on or after `from`
 * (a UTC-midnight Date), rolling forward automatically off the fixed anchor.
 * No manual date upkeep. Defaults to the visitor's local calendar day.
 */
export function getUpcomingSailRockDates(count: number, from: Date = localTodayAsUtcMidnight()): Date[] {
  const elapsed = from.getTime() - SAIL_ROCK_FIRST.getTime();
  const stepsPassed = elapsed > 0 ? Math.ceil(elapsed / STEP_MS) : 0;
  const dates: Date[] = [];
  for (let i = 0; i < count; i++) {
    dates.push(new Date(SAIL_ROCK_FIRST.getTime() + (stepsPassed + i) * STEP_MS));
  }
  return dates;
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
