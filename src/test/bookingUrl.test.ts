// Attribution contract for the DiveOS wizard iframe (src/utils/bookingUrl.ts).
// Regression guard: DiveOS recorded 390 leads all-time with zero gclid/utm
// because passthrough was opt-in and only the landers opted in.
import { describe, it, expect, beforeEach } from "vitest";
import {
  buildBookingUrl,
  buildWizardIframeSrc,
  withAttribution,
  LEAD_FORM_URL,
  WEB_WIZARD_URL,
} from "../utils/bookingUrl";

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

// The campaign landers hand off to the DiveOS web wizard on ANOTHER HOST, so a
// dropped param here is attribution lost at the click - roughly 30,000 THB/month
// of Google Ads spend that cannot be measured.
describe("buildBookingUrl - handoff to the DiveOS web wizard", () => {
  beforeEach(() => sessionStorage.clear());

  it("targets /dive/web by default, never the /dive/shop walk-in form", () => {
    expect(WEB_WIZARD_URL).toBe("https://dash.siamscuba.com/dive/web");
    expect(buildBookingUrl("")).toBe(WEB_WIZARD_URL);
    expect(buildBookingUrl("")).not.toContain("/dive/shop");
  });

  it("forwards a full real ad query string across the host boundary", () => {
    const adClick =
      "?utm_source=google&utm_medium=cpc&utm_campaign=ow-koh-tao&utm_content=no-pool-rsa&utm_term=learn+to+dive&gclid=Cj0KCQjw_ADHESIVE123";
    const url = new URL(buildBookingUrl(adClick, { product: "OWD" }));

    expect(url.origin + url.pathname).toBe(WEB_WIZARD_URL);
    expect(Object.fromEntries(url.searchParams.entries())).toEqual({
      product: "OWD",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "ow-koh-tao",
      utm_content: "no-pool-rsa",
      // "+" in a query string decodes to a space - Google sends keywords this way.
      utm_term: "learn to dive",
      gclid: "Cj0KCQjw_ADHESIVE123",
    });
  });

  it("survives in-site navigation: params reach the CTA from storage alone", () => {
    // Visitor lands on /no-pool?gclid=..., clicks through to /open-water-course
    // (clean URL), then hits Book. The CTA sees NO query string at all.
    seedFirstTouch();
    const p = paramsOf(buildBookingUrl("", { product: "OWD" }));
    expect(p.gclid).toBe("GCL_ABC123");
    expect(p.utm_source).toBe("google");
    expect(p.product).toBe("OWD");
  });

  it("lets an explicit URL product override the CTA's preselect", () => {
    expect(paramsOf(buildBookingUrl("?product=DSD", { product: "OWD" })).product).toBe("DSD");
  });

  it("omits stored attribution for the SSG/first-client render", () => {
    seedFirstTouch();
    // BookNowLink renders this href on the server and on the first client
    // render; reading sessionStorage there is a hydration mismatch, and React
    // keeps the SERVER attribute on mismatch - silently unattributing the link.
    expect(buildBookingUrl("", { product: "OWD", includeStored: false })).toBe(
      `${WEB_WIZARD_URL}?product=OWD`,
    );
  });
});

describe("withAttribution - internal navigation", () => {
  it("carries utm params and gclid onto an internal path", () => {
    const href = withAttribution(
      "/open-water-course",
      "?utm_source=google&gclid=ABC&irrelevant=1",
    );
    const url = new URL(href, "https://siamscuba.com");
    expect(url.pathname).toBe("/open-water-course");
    expect(url.searchParams.get("utm_source")).toBe("google");
    expect(url.searchParams.get("gclid")).toBe("ABC");
    // Only attribution travels - unrelated params are not smeared across the site.
    expect(url.searchParams.get("irrelevant")).toBeNull();
  });

  it("leaves a path untouched when there is nothing to attribute", () => {
    expect(withAttribution("/open-water-course", "")).toBe("/open-water-course");
  });

  it("appends rather than clobbering an existing query string", () => {
    expect(withAttribution("/fun-dives?product=FUN", "?gclid=ABC")).toBe(
      "/fun-dives?product=FUN&gclid=ABC",
    );
  });
});
