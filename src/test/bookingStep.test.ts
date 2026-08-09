/**
 * Booking wizard step funnel - trip-first semantics (DiveOS deploy 2026-07-08).
 *
 * Guards the SIAM_BOOKING_STEP -> analytics mapping: the wizard posts bare
 * step numbers 1-7 and dashboards must receive readable step NAMES. If DiveOS
 * reorders the wizard again, BOOKING_STEP_NAMES is the single map to update
 * and this test is the tripwire.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { BOOKING_STEP_NAMES, trackBookingStep } from "@/utils/tracking";

// The canonical trip-first order. SIAM_BOOKING_LEAD fires at step 2 (contact).
const EXPECTED_ORDER: Record<number, string> = {
  1: "trip",
  2: "contact",
  3: "personal",
  4: "medical",
  5: "waiver",
  6: "accommodation",
  7: "review",
};

describe("BOOKING_STEP_NAMES", () => {
  it("maps all 7 trip-first steps to the canonical names", () => {
    expect(BOOKING_STEP_NAMES).toEqual(EXPECTED_ORDER);
  });
});

describe("trackBookingStep", () => {
  const gtagCalls: unknown[][] = [];
  const fbqCalls: unknown[][] = [];
  const clarityCalls: unknown[][] = [];

  beforeEach(() => {
    gtagCalls.length = 0;
    fbqCalls.length = 0;
    clarityCalls.length = 0;
    window.dataLayer = [];
    window.gtag = (...args: unknown[]) => void gtagCalls.push(args);
    window.fbq = (...args: unknown[]) => void fbqCalls.push(args);
    window.clarity = (...args: unknown[]) => void clarityCalls.push(args);
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends step_number AND step_name on every surface for steps 1-7", () => {
    for (let step = 1; step <= 7; step++) {
      trackBookingStep({ step, direction: "forward" });
    }

    // dataLayer (GTM)
    const pushed = (window.dataLayer ?? []) as Array<Record<string, unknown>>;
    expect(pushed).toHaveLength(7);
    pushed.forEach((entry, i) => {
      expect(entry.event).toBe("booking_step");
      expect(entry.step_number).toBe(i + 1);
      expect(entry.step_name).toBe(EXPECTED_ORDER[i + 1]);
    });

    // gtag (GA4) - booking_step events only, never a conversion send_to
    expect(gtagCalls).toHaveLength(7);
    gtagCalls.forEach((call, i) => {
      expect(call[0]).toBe("event");
      expect(call[1]).toBe("booking_step");
      const params = call[2] as Record<string, unknown>;
      expect(params.step_number).toBe(i + 1);
      expect(params.step_name).toBe(EXPECTED_ORDER[i + 1]);
      expect(params.send_to).toBeUndefined();
    });

    // Clarity - one named event per step
    expect(clarityCalls.map((c) => c[1])).toEqual(
      Object.values(EXPECTED_ORDER).map((name) => `booking_step_${name}`),
    );

    // Meta - paired custom event
    expect(fbqCalls).toHaveLength(7);
    expect((fbqCalls[1][2] as Record<string, unknown>).step_name).toBe("contact");
  });

  it("passes the back direction through to the dataLayer", () => {
    trackBookingStep({ step: 3, direction: "back" });
    const entry = (window.dataLayer as Array<Record<string, unknown>>)[0];
    expect(entry.direction).toBe("back");
    expect(entry.step_name).toBe("personal");
  });

  it("falls back to step_<n> for out-of-map indices instead of throwing", () => {
    trackBookingStep({ step: 9 });
    const entry = (window.dataLayer as Array<Record<string, unknown>>)[0];
    expect(entry.step_name).toBe("step_9");
  });
});
