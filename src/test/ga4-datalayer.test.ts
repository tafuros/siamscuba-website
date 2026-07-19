import { describe, it, expect, beforeEach } from "vitest";
import {
  trackGenerateLead,
  trackWhatsAppClick,
  trackPurchase,
  trackBookingPayLater,
} from "@/utils/tracking";

// Simulates the browser console check: a lead / whatsapp / purchase / pay-later
// action must push a clean {event:...} object onto window.dataLayer so GTM can
// relay it to GA4 (G-5WHV1MM0DR). gtag/fbq are stubbed so the Ads path is inert.
describe("GA4 dataLayer relay", () => {
  beforeEach(() => {
    window.dataLayer = [];
    window.gtag = () => {};
    window.fbq = () => {};
  });

  const events = () =>
    (window.dataLayer as Array<Record<string, unknown>>).filter((e) => e && e.event);

  it("generate_lead pushes to dataLayer", () => {
    trackGenerateLead({ form_name: "fun_dive_booking", product: "SAILROCK" });
    const e = events().find((x) => x.event === "generate_lead");
    expect(e).toBeTruthy();
    expect(e).toMatchObject({ form_name: "fun_dive_booking", product: "SAILROCK", currency: "THB" });
  });

  it("whatsapp_click pushes to dataLayer", () => {
    trackWhatsAppClick({ location: "hero_cta", url: "https://wa.me/x" });
    const e = events().find((x) => x.event === "whatsapp_click");
    expect(e).toBeTruthy();
    expect(e).toMatchObject({ location: "hero_cta" });
  });

  it("purchase pushes with value + transaction_id", () => {
    trackPurchase({ transaction_id: "T1", value: 2600, item_name: "Discover Scuba" });
    const e = events().find((x) => x.event === "purchase");
    expect(e).toMatchObject({ transaction_id: "T1", value: 2600, currency: "THB" });
  });

  it("booking_pay_later pushes to dataLayer", () => {
    trackBookingPayLater({ transaction_id: "T2", product: "OPENWATER" });
    const e = events().find((x) => x.event === "booking_pay_later");
    expect(e).toMatchObject({ transaction_id: "T2", product: "OPENWATER" });
  });

  it("drops undefined params so payload stays clean", () => {
    trackWhatsAppClick({ location: "footer" });
    const e = events().find((x) => x.event === "whatsapp_click") as Record<string, unknown>;
    expect("url" in e).toBe(false);
  });
});
