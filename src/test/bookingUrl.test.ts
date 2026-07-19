// Attribution contract for the DiveOS wizard iframe (src/utils/bookingUrl.ts).
// Regression guard: DiveOS recorded 390 leads all-time with zero gclid/utm
// because passthrough was opt-in and only the landers opted in.
import { describe, it, expect, beforeEach } from "vitest";
import { buildWizardIframeSrc, LEAD_FORM_URL } from "../utils/bookingUrl";

const seedFirstTouch = () => {
  sessionStorage.setItem(
    "siam_utm",
    JSON.stringify({
      source: "google",
      medium: "cpc",
      campaign: "fun-dives-th",
      firstTouch: 1,
    }),
  );
  sessionStorage.setItem("siam_gclid", "GCL_ABC123");
};

const paramsOf = (url: string) =>
  Object.fromEntries(new URL(url).searchParams.entries());

describe("buildWizardIframeSrc", () => {
  beforeEach(() => sessionStorage.clear());

  it("THE BUG: a bare CTA (no utm_passthrough) still forwards first-touch attribution", () => {
    seedFirstTouch();
    expect(paramsOf(buildWizardIframeSrc(""))).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "fun-dives-th",
      gclid: "GCL_ABC123",
    });
  });

  it("keeps the landers working - utm_passthrough=1 behaves identically", () => {
    seedFirstTouch();
    expect(paramsOf(buildWizardIframeSrc("?utm_passthrough=1"))).toEqual(
      paramsOf(buildWizardIframeSrc("")),
    );
  });

  it("never forwards the utm_passthrough control flag itself", () => {
    seedFirstTouch();
    for (const search of ["?utm_passthrough=1", "?utm_passthrough=0"]) {
      expect(buildWizardIframeSrc(search)).not.toContain("utm_passthrough");
    }
  });

  it("honours an explicit opt-out", () => {
    seedFirstTouch();
    expect(buildWizardIframeSrc("?utm_passthrough=0")).toBe(LEAD_FORM_URL);
  });

  it("explicit URL params win over stored first-touch values", () => {
    seedFirstTouch();
    const p = paramsOf(
      buildWizardIframeSrc("?utm_source=meta&gclid=FRESH&utm_passthrough=1"),
    );
    expect(p.utm_source).toBe("meta");
    expect(p.gclid).toBe("FRESH");
    // Unset params still backfill from storage rather than being dropped.
    expect(p.utm_medium).toBe("cpc");
  });

  it("carries the Sail Rock lander's product/date preselect alongside attribution", () => {
    seedFirstTouch();
    const p = paramsOf(
      buildWizardIframeSrc("?product=SAILROCK&date=2026-06-22&utm_passthrough=1"),
    );
    expect(p.product).toBe("SAILROCK");
    expect(p.date).toBe("2026-06-22");
    expect(p.gclid).toBe("GCL_ABC123");
  });

  it("emits no query string at all when there is nothing to attribute", () => {
    expect(buildWizardIframeSrc("")).toBe(LEAD_FORM_URL);
  });

  it("does not duplicate params when a value appears both explicitly and in storage", () => {
    seedFirstTouch();
    const url = buildWizardIframeSrc("?utm_source=meta");
    expect(url.match(/utm_source=/g)).toHaveLength(1);
  });
});
