// Step-funnel contract for the DiveOS wizard iframe (src/utils/tracking.ts).
//
// This is the PII guard, not just a feature test. Microsoft Clarity is
// deliberately not installed on dash.siamscuba.com, because the booking wizard
// collects a PADI medical questionnaire whose answers are encoded in element
// classNames - and Clarity masks text but replays classes and stylesheets, so
// no masking setting can protect them. The step event is the whole substitute:
// the wizard tells the parent WHICH step it reached and nothing else.
//
// So the load-bearing assertion here is the negative one - that nothing except
// one of the nine known step ids can ever reach window.clarity(), no matter
// what a future change on the DiveOS side starts putting in the message.
import { describe, it, expect, beforeEach, vi } from "vitest";
import { trackWizardStep, __resetWizardStepTracking } from "../utils/tracking";

const clarityCalls = (): unknown[][] =>
  (window.clarity as unknown as { mock: { calls: unknown[][] } }).mock.calls;

beforeEach(() => {
  __resetWizardStepTracking();
  window.clarity = vi.fn();
});

describe("trackWizardStep - what it reports", () => {
  it("fires one Clarity event per numbered step", () => {
    expect(trackWizardStep(2)).toBe(true);
    expect(trackWizardStep(4)).toBe(true);
    expect(clarityCalls()).toEqual([
      ["event", "wizard_step_2"],
      ["event", "wizard_step_4"],
    ]);
  });

  it("accepts the two non-numeric steps the wizard emits", () => {
    trackWizardStep("payment");
    trackWizardStep("done");
    expect(clarityCalls()).toEqual([
      ["event", "wizard_step_payment"],
      ["event", "wizard_step_done"],
    ]);
  });

  it("accepts a numeric step sent as a string (wire format is not guaranteed)", () => {
    expect(trackWizardStep("7")).toBe(true);
    expect(clarityCalls()).toEqual([["event", "wizard_step_7"]]);
  });

  it("reports each step at most once per page session", () => {
    // A visitor stepping back and forth must not re-report steps already reached.
    expect(trackWizardStep(3)).toBe(true);
    expect(trackWizardStep(4)).toBe(true);
    expect(trackWizardStep(3)).toBe(false);
    expect(trackWizardStep(4)).toBe(false);
    expect(clarityCalls()).toHaveLength(2);
  });

  it("emits at most nine events even under a flood", () => {
    for (let i = 0; i < 200; i++) {
      trackWizardStep((i % 7) + 1);
      trackWizardStep("payment");
      trackWizardStep("done");
    }
    expect(clarityCalls()).toHaveLength(9);
  });
});

describe("trackWizardStep - what it must never report", () => {
  // Each of these is a field the wizard actually holds. None may pass.
  const forbidden: Array<[string, unknown]> = [
    ["an email address", "diver@example.com"],
    ["a phone number", "+972501234567"],
    ["a customer name", "Ben Avivi"],
    ["a date of birth", "1990-04-17"],
    ["a medical answer", "medical:q3=yes"],
    ["a medical flag", true],
    ["a passport number", "K1234567"],
    ["a product code", "SAILROCK"],
    ["a price", 12000],
    ["an object payload", { step: 4, email: "diver@example.com" }],
    ["an array payload", [4, "diver@example.com"]],
    ["a step-shaped injection", "4; email=diver@example.com"],
    ["an unknown step name", "medical"],
    ["an out-of-range step", 99],
    ["a zero step", 0],
    ["a negative step", -1],
    ["null", null],
    ["undefined", undefined],
    ["an empty string", ""],
  ];

  for (const [label, payload] of forbidden) {
    it(`drops ${label}`, () => {
      expect(trackWizardStep(payload)).toBe(false);
      expect(window.clarity).not.toHaveBeenCalled();
    });
  }

  it("never passes anything but the literal step id to Clarity", () => {
    // Fire every valid step, then assert the full argument list is exactly the
    // nine expected events - no extra arguments, no interpolated values.
    for (const s of [1, 2, 3, 4, 5, 6, 7, "payment", "done"]) trackWizardStep(s);
    expect(clarityCalls()).toEqual([
      ["event", "wizard_step_1"],
      ["event", "wizard_step_2"],
      ["event", "wizard_step_3"],
      ["event", "wizard_step_4"],
      ["event", "wizard_step_5"],
      ["event", "wizard_step_6"],
      ["event", "wizard_step_7"],
      ["event", "wizard_step_payment"],
      ["event", "wizard_step_done"],
    ]);
  });

  it("does not throw when Clarity has not loaded yet", () => {
    delete (window as { clarity?: unknown }).clarity;
    expect(() => trackWizardStep(2)).not.toThrow();
  });
});
