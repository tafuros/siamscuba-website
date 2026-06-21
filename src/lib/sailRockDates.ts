import { addDays, startOfDay, isBefore } from "date-fns";

// Sail Rock departs on a fixed 3-day cadence. This anchor + step is the single
// source of truth for every "upcoming departures" UI on the site (DiveSchedule
// strip, Sail Rock lander) so the dates never drift between surfaces.
export const SAIL_ROCK_FIRST = new Date("2026-03-15"); // first departure (anchor)
export const SAIL_ROCK_STEP_DAYS = 3;

/**
 * Returns the next `count` Sail Rock departure dates on or after today,
 * rolling forward automatically off the fixed anchor. No manual date upkeep.
 */
export function getUpcomingSailRockDates(count: number): Date[] {
  const today = startOfDay(new Date());
  const dates: Date[] = [];
  let d = new Date(SAIL_ROCK_FIRST);
  while (isBefore(d, today)) {
    d = addDays(d, SAIL_ROCK_STEP_DAYS);
  }
  for (let i = 0; i < count; i++) {
    dates.push(new Date(d));
    d = addDays(d, SAIL_ROCK_STEP_DAYS);
  }
  return dates;
}

/** ISO yyyy-MM-dd in LOCAL time (avoids the UTC off-by-one of toISOString). */
export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
