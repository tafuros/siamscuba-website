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

// BEN'S ROUTING RULE (2026-08-01): "every product that arrives through the
// campaigns goes through the same process. If it doesn't come from a campaign it
// stays normal on the familiar link on the site - /fun-dive-booking."
//
// This is BUSINESS logic, not tracking. /dive/web is the zero-commission "Web"
// identity. Routing an organic lead there silently takes an instructor's
// commission away, so the predicate must stay narrow in one direction and
// complete in the other.
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

  it("ORGANIC IS NOT CAMPAIGN TRAFFIC - these must never reach /dive/web", () => {
    // Each of these has real attribution but cost us nothing, so the booking
    // must keep normal instructor/commission handling.
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
      "?utm_source=google&utm_medium=cpc&utm_campaign=ow-koh-tao&utm_content=learn-to-dive-rsa&utm_term=learn+to+dive&gclid=Cj0KCQjw_ADHESIVE123&product=OWD";
    const url = new URL(buildWizardIframeSrc(adClick));

    expect(url.origin + url.pathname).toBe(WEB_WIZARD_URL);
    expect(Object.fromEntries(url.searchParams.entries())).toEqual({
      product: "OWD",
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

  it("ORGANIC: an untagged visitor keeps the UNCHANGED /dive/ben behaviour", () => {
    expect(buildWizardIframeSrc("")).toBe(LEAD_FORM_URL);
  });

  it("ORGANIC: a product preselect alone does not make it paid traffic", () => {
    // Every generic CTA on the site (navbar, course cards, dive-site pages)
    // lands here. None of them may strip an instructor's commission.
    const url = new URL(buildWizardIframeSrc("?product=DSD&date=2026-06-22"));
    expect(url.origin + url.pathname).toBe(LEAD_FORM_URL);
    expect(url.searchParams.get("product")).toBe("DSD");
    expect(url.searchParams.get("date")).toBe("2026-06-22");
  });

  it("ORGANIC: real non-paid attribution still routes to /dive/ben, params intact", () => {
    seedOrganicFirstTouch();
    const url = new URL(buildWizardIframeSrc(""));
    expect(url.origin + url.pathname).toBe(LEAD_FORM_URL);
    // The attribution still travels - we just don't change the booking identity.
    expect(url.searchParams.get("utm_source")).toBe("tripadvisor");
    expect(url.searchParams.get("utm_medium")).toBe("referral");
  });

  it("never routes to /dive/web without carrying attribution with it", () => {
    // The invariant that makes the whole thing safe: the destination and the
    // params are decided from the same inputs under the same opt-out, so a
    // visitor can never land on the paid wizard as an anonymous lead.
    for (const search of ["", "?gclid=ABC", "?utm_medium=cpc", "?utm_passthrough=0"]) {
      for (const includeStored of [true, false]) {
        for (const seed of [seedFirstTouch, seedOrganicFirstTouch, () => {}]) {
          sessionStorage.clear();
          seed();
          const url = buildWizardIframeSrc(search, { includeStored });
          if (url.startsWith(WEB_WIZARD_URL)) {
            const params = new URL(url).searchParams;
            expect(
              Boolean(params.get("gclid") || params.get("utm_medium")),
              `${url} reached the paid wizard with no attribution`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it("HYDRATION: the storage-free render is deterministic AND organic", () => {
    // vite-react-ssg prerenders this page. If the first client render consulted
    // sessionStorage it would be a prop mismatch, and React keeps the SERVER
    // attribute on mismatch - silently serving the wrong wizard AND an
    // unattributed link. FunDiveBookingPage ties includeStored to `mounted`.
    seedFirstTouch();
    expect(buildWizardIframeSrc("", { includeStored: false })).toBe(LEAD_FORM_URL);
  });

  it("the opt-out suppresses the destination switch, not just the params", () => {
    seedFirstTouch();
    expect(buildWizardIframeSrc("?utm_passthrough=0")).toBe(LEAD_FORM_URL);
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
    const url = new URL(buildBookingUrl(adClick, { product: "OWD" }));

    expect(url.origin + url.pathname).toBe(WEB_WIZARD_URL);
    expect(Object.fromEntries(url.searchParams.entries())).toEqual({
      product: "OWD",
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
