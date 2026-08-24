// Attribution contract for the DiveOS wizard iframe (src/utils/bookingUrl.ts).
// Regression guard: DiveOS recorded 390 leads all-time with zero gclid/utm
// because passthrough was opt-in and only the landers opted in.
import { describe, it, expect, beforeEach } from "vitest";
import {
  buildBookingUrl,
  buildWizardIframeSrc,
  isCampaignTraffic,
  withAttribution,
  LEAD_FORM_URL,
  WEB_WIZARD_URL,
} from "../utils/bookingUrl";

/** A paid Google click that has already been captured first-touch. */
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

/** An UNPAID first touch: real referral attribution, no campaign spend. */
const seedOrganicFirstTouch = () => {
  sessionStorage.setItem(
    "siam_utm",
    JSON.stringify({
      source: "tripadvisor",
      medium: "referral",
      campaign: "listing",
      firstTouch: 1,
    }),
  );
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
    expect(buildWizardIframeSrc("?utm_passthrough=0")).toBe(WEB_WIZARD_URL);
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
    expect(buildWizardIframeSrc("")).toBe(WEB_WIZARD_URL);
  });

  it("does not duplicate params when a value appears both explicitly and in storage", () => {
    seedFirstTouch();
    const url = buildWizardIframeSrc("?utm_source=meta");
    expect(url.match(/utm_source=/g)).toHaveLength(1);
  });
});

// BEN'S ROUTING RULE (2026-08-01, amended 2026-08-24): every product that
// arrives through the campaigns goes through the same process - and since
// Ben's 2026-08-24 ruling, organic embed traffic goes to /dive/web as well,
// so DiveOS derives web_direct for it instead of attributing the booking to
// instructor Ben (/dive/ben, the pre-ruling organic target).
//
// The paid/organic predicate no longer flips the production destination, but
// it must stay narrow-and-complete anyway: it documents the paid boundary a
// future re-split would inherit, and the tests below pin it.
describe("isCampaignTraffic - who counts as paid traffic", () => {
  beforeEach(() => sessionStorage.clear());

  it("a gclid on the URL is campaign traffic", () => {
    expect(isCampaignTraffic("?gclid=Cj0KCQ")).toBe(true);
  });

  for (const medium of ["cpc", "ppc", "paidsearch", "paid_social"]) {
    it(`utm_medium=${medium} is campaign traffic`, () => {
      expect(isCampaignTraffic(`?utm_medium=${medium}`)).toBe(true);
    });
  }

  it("is case- and whitespace-insensitive on utm_medium", () => {
    expect(isCampaignTraffic("?utm_medium=CPC")).toBe(true);
    expect(isCampaignTraffic("?utm_medium=%20Paid_Social%20")).toBe(true);
  });

  it("ORGANIC IS NOT CAMPAIGN TRAFFIC - the paid boundary stays narrow", () => {
    // Each of these has real attribution but cost us nothing. They still
    // reach /dive/web (2026-08-24 ruling), but must never be CLASSIFIED paid.
    for (const search of [
      "",
      "?utm_source=google&utm_medium=organic",
      "?utm_source=tripadvisor&utm_medium=referral",
      "?utm_source=newsletter&utm_medium=email",
      "?utm_source=instagram&utm_medium=social",
      "?utm_medium=qr",
      "?product=FUN&date=2026-06-22",
    ]) {
      expect(isCampaignTraffic(search), `"${search}" must be organic`).toBe(false);
    }
  });

  it("survives in-site navigation via first-touch storage", () => {
    // Ad click lands on the lander, visitor clicks to a course page, then to
    // /fun-dive-booking - whose own URL carries nothing at all.
    seedFirstTouch();
    expect(isCampaignTraffic("")).toBe(true);
  });

  it("a stored ORGANIC first touch stays organic", () => {
    seedOrganicFirstTouch();
    expect(isCampaignTraffic("")).toBe(false);
  });

  it("ignores storage when the caller opts out (the SSG/first-render case)", () => {
    seedFirstTouch();
    expect(isCampaignTraffic("", { includeStored: false })).toBe(false);
    // ...but an explicit param on the URL is still honoured, because the server
    // render has no query string either way.
    expect(isCampaignTraffic("?gclid=X", { includeStored: false })).toBe(true);
  });
});

describe("buildWizardIframeSrc - conditional booking destination", () => {
  beforeEach(() => sessionStorage.clear());

  it("CAMPAIGN: a tagged visitor reaches /dive/web with the full query string intact", () => {
    const adClick =
      "?utm_source=google&utm_medium=cpc&utm_campaign=ow-koh-tao&utm_content=learn-to-dive-rsa&utm_term=learn+to+dive&gclid=Cj0KCQjw_ADHESIVE123&product=OW";
    const url = new URL(buildWizardIframeSrc(adClick));

    expect(url.origin + url.pathname).toBe(WEB_WIZARD_URL);
    expect(Object.fromEntries(url.searchParams.entries())).toEqual({
      product: "OW",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "ow-koh-tao",
      utm_content: "learn-to-dive-rsa",
      utm_term: "learn to dive",
      gclid: "Cj0KCQjw_ADHESIVE123",
    });
  });

  it("CAMPAIGN: a gclid alone is enough, even with no utm params", () => {
    expect(buildWizardIframeSrc("?gclid=ABC")).toBe(`${WEB_WIZARD_URL}?gclid=ABC`);
  });

  it("CAMPAIGN: reached from storage after in-site navigation, params carried too", () => {
    seedFirstTouch();
    const url = new URL(buildWizardIframeSrc(""));
    expect(url.origin + url.pathname).toBe(WEB_WIZARD_URL);
    expect(url.searchParams.get("gclid")).toBe("GCL_ABC123");
    expect(url.searchParams.get("utm_medium")).toBe("cpc");
  });

  it("ORGANIC: an untagged visitor now gets /dive/web too (2026-08-24 ruling)", () => {
    // Ben ruled 2026-08-24: organic embed bookings derive web_direct in
    // DiveOS, not instructor. /dive/ben is retired as the embed target.
    expect(buildWizardIframeSrc("")).toBe(WEB_WIZARD_URL);
    expect(buildWizardIframeSrc("")).not.toContain(LEAD_FORM_URL);
  });

  it("ORGANIC: a product preselect rides along to /dive/web", () => {
    // Every generic CTA on the site (navbar, course cards, dive-site pages)
    // lands here.
    const url = new URL(buildWizardIframeSrc("?product=DSD&date=2026-06-22"));
    expect(url.origin + url.pathname).toBe(WEB_WIZARD_URL);
    expect(url.searchParams.get("product")).toBe("DSD");
    expect(url.searchParams.get("date")).toBe("2026-06-22");
  });

  it("ORGANIC: real non-paid attribution reaches /dive/web with params intact", () => {
    seedOrganicFirstTouch();
    const url = new URL(buildWizardIframeSrc(""));
    expect(url.origin + url.pathname).toBe(WEB_WIZARD_URL);
    // The attribution still travels with the booking.
    expect(url.searchParams.get("utm_source")).toBe("tripadvisor");
    expect(url.searchParams.get("utm_medium")).toBe("referral");
  });

  it("the embed NEVER routes to /dive/ben anymore (2026-08-24 ruling)", () => {
    for (const search of ["", "?gclid=ABC", "?utm_medium=cpc", "?utm_passthrough=0", "?product=DSD"]) {
      for (const includeStored of [true, false]) {
        for (const seed of [seedFirstTouch, seedOrganicFirstTouch, () => {}]) {
          sessionStorage.clear();
          seed();
          const url = buildWizardIframeSrc(search, { includeStored });
          expect(url.startsWith(WEB_WIZARD_URL), `${url} left /dive/web`).toBe(true);
        }
      }
    }
  });

  it("CAMPAIGN traffic never reaches the wizard without its attribution", () => {
    // The invariant that keeps paid measurement safe: the destination and the
    // params are decided from the same inputs under the same opt-out, so a
    // PAID visitor always arrives carrying the signal that classified them.
    for (const search of ["?gclid=ABC", "?utm_medium=cpc"]) {
      for (const includeStored of [true, false]) {
        const url = new URL(buildWizardIframeSrc(search, { includeStored }));
        expect(
          Boolean(url.searchParams.get("gclid") || url.searchParams.get("utm_medium")),
          `${url} reached the wizard with no attribution`,
        ).toBe(true);
      }
    }
    // ...and via storage alone (in-site navigation), when storage is consulted.
    sessionStorage.clear();
    seedFirstTouch();
    const url = new URL(buildWizardIframeSrc(""));
    expect(url.searchParams.get("gclid")).toBe("GCL_ABC123");
  });

  it("HYDRATION: the storage-free render is deterministic", () => {
    // vite-react-ssg prerenders this page. If the first client render consulted
    // sessionStorage it would be a prop mismatch, and React keeps the SERVER
    // attribute on mismatch - silently serving an unattributed link.
    // FunDiveBookingPage ties includeStored to `mounted`.
    seedFirstTouch();
    expect(buildWizardIframeSrc("", { includeStored: false })).toBe(WEB_WIZARD_URL);
  });

  it("the opt-out strips the params but keeps the /dive/web destination", () => {
    seedFirstTouch();
    expect(buildWizardIframeSrc("?utm_passthrough=0")).toBe(WEB_WIZARD_URL);
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
      "?utm_source=google&utm_medium=cpc&utm_campaign=ow-koh-tao&utm_content=learn-to-dive-rsa&utm_term=learn+to+dive&gclid=Cj0KCQjw_ADHESIVE123";
    const url = new URL(buildBookingUrl(adClick, { product: "OW" }));

    expect(url.origin + url.pathname).toBe(WEB_WIZARD_URL);
    expect(Object.fromEntries(url.searchParams.entries())).toEqual({
      product: "OW",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "ow-koh-tao",
      utm_content: "learn-to-dive-rsa",
      // "+" in a query string decodes to a space - Google sends keywords this way.
      utm_term: "learn to dive",
      gclid: "Cj0KCQjw_ADHESIVE123",
    });
  });

  it("survives in-site navigation: params reach the CTA from storage alone", () => {
    // Visitor lands on /open-water-course?gclid=..., clicks through to another
    // page (clean URL) and back, then hits Book. The CTA sees NO query string.
    seedFirstTouch();
    const p = paramsOf(buildBookingUrl("", { product: "OW" }));
    expect(p.gclid).toBe("GCL_ABC123");
    expect(p.utm_source).toBe("google");
    expect(p.product).toBe("OW");
  });

  it("lets an explicit URL product override the CTA's preselect", () => {
    expect(paramsOf(buildBookingUrl("?product=DSD", { product: "OW" })).product).toBe("DSD");
  });

  it("omits stored attribution for the SSG/first-client render", () => {
    seedFirstTouch();
    // BookNowLink renders this href on the server and on the first client
    // render; reading sessionStorage there is a hydration mismatch, and React
    // keeps the SERVER attribute on mismatch - silently unattributing the link.
    expect(buildBookingUrl("", { product: "OW", includeStored: false })).toBe(
      `${WEB_WIZARD_URL}?product=OW`,
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
