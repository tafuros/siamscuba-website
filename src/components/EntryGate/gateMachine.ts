import type { LevelKey, LocationKey } from "./gateContent";
import type { Language } from "@/i18n/translations";

// Outcome of the funnel. "enter-site" closes the gate onto the homepage
// (Koh Tao + scuba - the page that was always beneath). "navigate" hands the
// visitor to a dedicated scuba lander. There are no WhatsApp exits any more:
// the gate qualifies, the landers convert.
export type GateAction =
  | { type: "enter-site" }
  | { type: "navigate"; path: string };

// Which levels actually need the location question. A total beginner only ever
// learns with us on Koh Tao, so asking is friction with a single answer - and
// Similan/Phuket is a certified-diver arena we must NOT show them. Certified
// divers (fun or training) do get asked.
export const LEVELS_WITH_LOCATION: readonly LevelKey[] = ["funDives", "training"];

export const needsLocation = (level: LevelKey): boolean =>
  LEVELS_WITH_LOCATION.includes(level);

// Localized variants of the landers. Anything missing for a language falls back
// to the English route (which is what the site does everywhere else).
const localized = (base: string, lang: Language, langs: readonly Language[]): string =>
  lang !== "en" && langs.includes(lang) ? `/${lang}${base}` : base;

const FUN_DIVES_LANGS: readonly Language[] = ["es", "he", "fr"];
const SAIL_ROCK_LANGS: readonly Language[] = ["es", "he"];

/**
 * level (+ location) -> where the visitor lands.
 *
 * Similan is the one location whose page serves BOTH certified levels, so it
 * always wins: a diver who asked for Similan gets the Similan page, whether
 * they came to fun-dive or to keep training. Dropping them on the Koh Tao
 * homepage would answer a question they did not ask.
 *
 * Koh Tao and Koh Phangan are level-dependent, because our landers there are
 * fun-dive landers: only a fun-diver wants them. A diver who came to keep
 * TRAINING gets the homepage instead - that is where the courses live, and it
 * is the right answer for both islands (Ben, 2026-07-13).
 */
export function resolveAction(
  level: LevelKey,
  location: LocationKey | null,
  lang: Language,
): GateAction {
  // Similan: same destination for both certified levels.
  if (location === "similan") return { type: "navigate", path: "/similan" };

  // Koh Tao / Koh Phangan: the fun-dive landers only serve fun-divers.
  // Continuing-training divers go to the homepage (the courses).
  if (level === "funDives") {
    if (location === "kohTao") {
      return { type: "navigate", path: localized("/fun-dives", lang, FUN_DIVES_LANGS) };
    }
    if (location === "kohPhangan") {
      return {
        type: "navigate",
        path: localized("/sail-rock-diving", lang, SAIL_ROCK_LANGS),
      };
    }
  }

  // beginner (no location asked), and training + Koh Tao / Koh Phangan.
  return { type: "enter-site" };
}

export type GateStep = "welcome" | "level" | "location";

export interface GateState {
  step: GateStep;
  level: LevelKey | null;
}

export type GateEvent =
  | { type: "PICK_LANGUAGE" }
  | { type: "PICK_LEVEL"; level: LevelKey }
  | { type: "BACK" }
  // Back to the welcome step - used when the gate is reopened manually
  // (navbar compass / footer link) after a previous run-through.
  | { type: "RESET" };

export const initialGateState: GateState = { step: "welcome", level: null };

export function gateReducer(state: GateState, event: GateEvent): GateState {
  switch (event.type) {
    case "PICK_LANGUAGE":
      return { ...state, step: "level" };
    case "PICK_LEVEL":
      // Levels that skip the location step never reach "location" - the caller
      // resolves them straight to an action, so the state stays on "level".
      return needsLocation(event.level)
        ? { step: "location", level: event.level }
        : { ...state, level: event.level };
    case "BACK":
      if (state.step === "location") return { step: "level", level: null };
      if (state.step === "level") return { step: "welcome", level: null };
      return state;
    case "RESET":
      return initialGateState;
    default:
      return state;
  }
}
