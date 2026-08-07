import { describe, it, expect } from "vitest";
import { resolveAction, needsLocation } from "@/components/EntryGate/gateMachine";

// The gate's routing matrix, locked. These seven outcomes are a product
// decision (Ben, 2026-07-13), not an implementation detail - the funnel broke
// twice in one day by drifting from them, so they get a tripwire.
//
//   beginner              -> no location step at all -> homepage
//   certified / fun dives -> Koh Tao      -> /fun-dives      (localized)
//                         -> Koh Phangan  -> /sail-rock-diving (localized)
//                         -> Similan      -> /similan
//   certified / training  -> Koh Tao      -> homepage (the courses live there)
//                         -> Koh Phangan  -> homepage
//                         -> Similan      -> /similan
//   conservation          -> no location step at all -> /conservation

describe("entry gate - location step", () => {
  it("never asks a total beginner where to dive", () => {
    // Critical: a beginner must never even SEE Similan - it is a
    // certified-diver arena. Skipping the step is how that is guaranteed.
    expect(needsLocation("beginner")).toBe(false);
  });

  it("asks both certified levels where to dive", () => {
    expect(needsLocation("funDives")).toBe(true);
    expect(needsLocation("training")).toBe(true);
  });

  it("never asks the conservation visitor where to dive", () => {
    // The conservation page is the same answer for every island, so the
    // question would be friction with a single outcome.
    expect(needsLocation("conservation")).toBe(false);
  });
});

describe("entry gate - conservation", () => {
  it("goes straight to the conservation page", () => {
    expect(resolveAction("conservation", null, "en")).toEqual({
      type: "navigate",
      path: "/conservation",
    });
  });

  it("routes he/es/fr to their own conservation twin", () => {
    // All four twins shipped 2026-08-07. Every path asserted here is also
    // checked against routes.tsx by locale-routes.test.ts, so a typo cannot
    // reach production as a Vercel hard-404.
    expect(resolveAction("conservation", null, "he")).toEqual({
      type: "navigate",
      path: "/he/conservation",
    });
    expect(resolveAction("conservation", null, "es")).toEqual({
      type: "navigate",
      path: "/es/conservation",
    });
    expect(resolveAction("conservation", null, "fr")).toEqual({
      type: "navigate",
      path: "/fr/conservation",
    });
  });
});

describe("entry gate - certified + fun dives", () => {
  it("sends Koh Tao to the fun-dive lander", () => {
    expect(resolveAction("funDives", "kohTao", "en")).toEqual({
      type: "navigate",
      path: "/fun-dives",
    });
  });

  it("sends Koh Phangan to Sail Rock", () => {
    expect(resolveAction("funDives", "kohPhangan", "en")).toEqual({
      type: "navigate",
      path: "/sail-rock-diving",
    });
  });

  it("sends Similan to the Similan page", () => {
    expect(resolveAction("funDives", "similan", "en")).toEqual({
      type: "navigate",
      path: "/similan",
    });
  });
});

describe("entry gate - certified + keep training", () => {
  it("sends Similan to the Similan page, exactly like a fun-diver", () => {
    // Regression: this used to dump training divers on the homepage. Asking for
    // Similan and landing on Koh Tao answers a question nobody asked.
    expect(resolveAction("training", "similan", "en")).toEqual({
      type: "navigate",
      path: "/similan",
    });
  });

  it("sends Koh Tao to the homepage, NOT the fun-dive lander", () => {
    expect(resolveAction("training", "kohTao", "en")).toEqual({ type: "enter-site" });
  });

  it("sends Koh Phangan to the homepage, NOT Sail Rock", () => {
    // Sail Rock is a fun-dive lander; someone here to keep training wants the
    // courses, which live on the homepage.
    expect(resolveAction("training", "kohPhangan", "en")).toEqual({ type: "enter-site" });
  });
});

describe("entry gate - beginner", () => {
  it("lands on the homepage with no location", () => {
    expect(resolveAction("beginner", null, "en")).toEqual({ type: "enter-site" });
  });
});

describe("entry gate - localized landers", () => {
  it("routes he/es/fr fun-divers to their own fun-dive lander", () => {
    expect(resolveAction("funDives", "kohTao", "he")).toEqual({
      type: "navigate",
      path: "/he/fun-dives",
    });
    expect(resolveAction("funDives", "kohTao", "es")).toEqual({
      type: "navigate",
      path: "/es/fun-dives",
    });
    expect(resolveAction("funDives", "kohTao", "fr")).toEqual({
      type: "navigate",
      path: "/fr/fun-dives",
    });
  });

  it("routes he/es to the localized Sail Rock lander", () => {
    expect(resolveAction("funDives", "kohPhangan", "he")).toEqual({
      type: "navigate",
      path: "/he/sail-rock-diving",
    });
  });

  it("falls back to the English lander when no localized route exists", () => {
    // Sail Rock has no French page - a French visitor must still land on a
    // real page, not a 404.
    expect(resolveAction("funDives", "kohPhangan", "fr")).toEqual({
      type: "navigate",
      path: "/sail-rock-diving",
    });
  });
});
