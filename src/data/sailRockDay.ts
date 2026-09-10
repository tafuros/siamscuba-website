/**
 * WHICH DAY THE SAIL ROCK BOAT SAILS - the one knob for the whole site.
 *
 * Sail Rock moves. When it does, change the two constants below and every
 * surface follows: the homepage week board, the /sail-rock lander's "upcoming
 * departures" list, the deep-link date the lander sends to the booking wizard.
 * Nothing else needs touching - that is the entire point of this file.
 *
 * Before this existed the day lived in three places that disagreed: the board
 * put Sail Rock on Mon/Wed/Sat, the lander computed "every 3 days" off a March
 * anchor, and the copy said both. A visitor could read two different answers on
 * two pages of the same site.
 *
 * Translated copy ("every Sunday") is the one thing this cannot drive - the
 * strings live in src/i18n/translations.ts (sail_banner_title) and
 * src/lib/landerCopy.ts (heroSubhead, departuresLabel). Grep for SAIL_ROCK_DAY
 * there: each of those lines carries a pointer back here.
 *
 * A DiveOS-side editor that can move the day without a deploy is planned - see
 * the website HQ board. Until then this file is the source of truth.
 */

/** 0 = Sunday ... 6 = Saturday. Matches Date#getUTCDay(). */
export const SAIL_ROCK_WEEKDAY = 0;

/** The matching `ScheduleDay.key` on the homepage board. Keep the two in step. */
export const SAIL_ROCK_DAY_KEY = "sunday";
