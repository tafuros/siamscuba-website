import type { WhereKey } from "./gateContent";
import type { WhatsAppTopic } from "@/utils/whatsapp";

// Phase-A outcome of the funnel. "enter-site" closes the gate onto the existing
// homepage (Koh Tao + scuba). Every other branch hands the lead to WhatsApp/Nemo
// with a context-appropriate prefilled message; the real destination pages are
// phase B.
export type GateAction =
  | { type: "enter-site" }
  | { type: "navigate"; path: string }
  | { type: "whatsapp"; topic: WhatsAppTopic };

// branch -> answer key -> action
const ACTIONS: Record<WhereKey, Record<string, GateAction>> = {
  kohTao: {
    scuba: { type: "enter-site" },
    // Freediving -> curated Siam Freediving page (Kaizen courses, re-branded).
    freediving: { type: "navigate", path: "/freediving" },
  },
  kohPhangan: {
    licensed: { type: "whatsapp", topic: "kp-licensed" },
    beginner: { type: "whatsapp", topic: "kp-beginner" },
  },
  similan: {
    // Safari -> curated Siam Similans liveaboard page. Day dives -> Phuket day-dives page.
    safari: { type: "navigate", path: "/similan?type=safari" },
    dayDives: { type: "navigate", path: "/phuket-diving" },
  },
};

export function resolveAction(where: WhereKey, answer: string): GateAction {
  return ACTIONS[where]?.[answer] ?? { type: "enter-site" };
}

export type GateStep = "welcome" | "where" | "branch";

export interface GateState {
  step: GateStep;
  where: WhereKey | null;
}

export type GateEvent =
  | { type: "PICK_LANGUAGE" }
  | { type: "PICK_WHERE"; where: WhereKey }
  | { type: "BACK" }
  // Back to the welcome step - used when the gate is reopened manually
  // (navbar compass / footer link) after a previous run-through.
  | { type: "RESET" };

export const initialGateState: GateState = { step: "welcome", where: null };

export function gateReducer(state: GateState, event: GateEvent): GateState {
  switch (event.type) {
    case "PICK_LANGUAGE":
      return { ...state, step: "where" };
    case "PICK_WHERE":
      return { step: "branch", where: event.where };
    case "BACK":
      if (state.step === "branch") return { step: "where", where: null };
      if (state.step === "where") return { step: "welcome", where: null };
      return state;
    case "RESET":
      return initialGateState;
    default:
      return state;
  }
}
