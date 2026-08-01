// End-to-end proof of BEN'S ROUTING RULE at the component level.
//
// bookingUrl.test.ts proves the pure builder picks the right destination. This
// file proves the PAGE actually renders that destination into the iframe - the
// hop where this has broken before. Two failure modes are covered:
//
//   1. Wrong destination: a paid visitor served /dive/ben (commission handling
//      applied to a campaign lead) or an organic visitor served /dive/web
//      (an instructor silently loses commission on their own lead).
//   2. Hydration: the page is prerendered by vite-react-ssg. Reading
//      sessionStorage on the first client render is a prop mismatch, and React
//      keeps the SERVER attribute on mismatch - which would serve an
//      unattributed link forever, with no error anywhere.
//
// This drives react-dom directly rather than @testing-library/react: that
// package's peer `@testing-library/dom` is not installed, and AGENTS.md forbids
// this agent from running installs on its own. createRoot + act is enough here -
// we only need the mounted DOM and the server string.
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act } from "react-dom/test-utils";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { LEAD_FORM_URL, WEB_WIZARD_URL } from "../utils/bookingUrl";

// Tells React this is an act()-aware environment (@testing-library/react would
// normally set this for us).
declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// vite-react-ssg's <Head> has no DOM implementation under test.
vi.mock("vite-react-ssg", () => ({
  Head: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));
// Keep the assertions on routing, not on analytics side effects or on the
// WhatsApp strip's i18n context.
vi.mock("../utils/tracking", () => ({
  trackGenerateLead: vi.fn(),
  trackPurchase: vi.fn(),
  trackBookingPayLater: vi.fn(),
  trackWhatsAppFastPathClick: vi.fn(),
}));
vi.mock("../components/WhatsAppFastPathStrip", () => ({ default: () => null }));

const { default: FunDiveBookingPage } = await import("../pages/FunDiveBookingPage");

const IFRAME_TITLE = "Siam Scuba Booking Form";

const page = (search: string) => (
  <MemoryRouter initialEntries={[`/fun-dive-booking${search}`]}>
    <FunDiveBookingPage />
  </MemoryRouter>
);

let container: HTMLDivElement;
let root: Root;

/** Mount the page and return the wizard iframe's src. */
const wizardSrc = (search: string): URL => {
  act(() => {
    root.render(page(search));
  });
  const frame = container.querySelector<HTMLIFrameElement>(
    `iframe[title="${IFRAME_TITLE}"]`,
  );
  if (!frame) throw new Error("booking wizard iframe never mounted");
  return new URL(frame.src);
};

describe("booking page routing - campaign vs organic", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("CAMPAIGN: a tagged visitor's iframe points at /dive/web, query string intact", () => {
    const src = wizardSrc(
      "?utm_source=google&utm_medium=cpc&utm_campaign=ow-koh-tao&gclid=Cj0KCQ&product=OWD",
    );

    expect(src.origin + src.pathname).toBe(WEB_WIZARD_URL);
    expect(src.searchParams.get("gclid")).toBe("Cj0KCQ");
    expect(src.searchParams.get("utm_source")).toBe("google");
    expect(src.searchParams.get("utm_medium")).toBe("cpc");
    expect(src.searchParams.get("utm_campaign")).toBe("ow-koh-tao");
    expect(src.searchParams.get("product")).toBe("OWD");
  });

  it("CAMPAIGN: first-touch storage alone still routes to /dive/web", () => {
    // The realistic path: the ad click landed on a lander, the visitor browsed,
    // and /fun-dive-booking's own URL carries nothing.
    sessionStorage.setItem(
      "siam_utm",
      JSON.stringify({ source: "google", medium: "cpc", campaign: "dsd-th" }),
    );
    sessionStorage.setItem("siam_gclid", "GCL_STORED");

    const src = wizardSrc("");
    expect(src.origin + src.pathname).toBe(WEB_WIZARD_URL);
    expect(src.searchParams.get("gclid")).toBe("GCL_STORED");
  });

  it("ORGANIC: an untagged visitor gets the UNCHANGED /dive/ben iframe", () => {
    expect(wizardSrc("").href).toBe(LEAD_FORM_URL);
  });

  it("ORGANIC: a plain product preselect does not switch wizards", () => {
    const src = wizardSrc("?product=DSD");
    expect(src.origin + src.pathname).toBe(LEAD_FORM_URL);
    expect(src.searchParams.get("product")).toBe("DSD");
  });

  it("ORGANIC: referral traffic keeps its attribution but not the paid wizard", () => {
    const src = wizardSrc("?utm_source=tripadvisor&utm_medium=referral");
    expect(src.origin + src.pathname).toBe(LEAD_FORM_URL);
    expect(src.searchParams.get("utm_source")).toBe("tripadvisor");
  });

  it("HYDRATION: the prerendered markup contains no wizard iframe at all", () => {
    // This is the exact HTML vite-react-ssg emits. It must not contain an
    // iframe, because the server cannot know the query string or the storage:
    // any src baked in here is the one React would KEEP on mismatch.
    sessionStorage.setItem("siam_gclid", "GCL_STORED");
    const html = renderToString(page("?gclid=Cj0KCQ&utm_medium=cpc"));

    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("dash.siamscuba.com");
  });
});
