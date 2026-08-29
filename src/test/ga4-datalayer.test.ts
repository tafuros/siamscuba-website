import { describe, it, expect, beforeEach } from "vitest";
import {
  trackGenerateLead,
  trackWhatsAppClick,
  trackPurchase,
  trackBookingPayLater,
  trackWhatsAppFastPathClick,
  trackBookNowClick,
} from "@/utils/tracking";

// Simulates the browser console check: a lead / whatsapp / purchase / pay-later
// action must push a clean {event:...} object onto window.dataLayer so GTM can
// relay it to GA4 (G-5WHV1MM0DR). gtag is stubbed so the Ads path is inert;
// Meta needs no stub - it is itself a dataLayer push (event: "meta_event").
describe("GA4 dataLayer relay", () => {
  beforeEach(() => {
    window.dataLayer = [];
    window.gtag = () => {};
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

// ── Regression: the gtag-shim double-fire (found live 2026-08-29) ────────────
// index.html defines `function gtag(){dataLayer.push(arguments)}`. GTM's gtag
// interop turns an `arguments` push of ["event", name, params] into a GTM event
// named `name`, so a bare gtag("event","purchase",…) fires the SAME Custom Event
// trigger as dataLayer.push({event:"purchase"}). While tracking.ts did both, every
// GA4 tag in container GTM-TN3SM66Q fired twice per user action (GA4 property
// 527567742 recorded 2x whatsapp_fastpath_click and 4x whatsapp_click).
//
// These tests use the REAL shim, not a no-op stub, so a reintroduced bare
// gtag("event", <name>) is caught here instead of in production.
describe("no GTM double-fire via the gtag shim", () => {
  beforeEach(() => {
    window.dataLayer = [];
    // Faithful reproduction of index.html's shim.
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer as unknown[]).push(arguments);
    };
  });

  /** Every event name GTM would see, from BOTH push shapes. */
  const gtmEventNames = (): string[] => {
    const out: string[] = [];
    for (const entry of window.dataLayer as unknown[]) {
      if (!entry) continue;
      const rec = entry as Record<string, unknown>;
      // gtag arguments push: ["event", <name>, <params>]
      if (rec[0] === "event" && typeof rec[1] === "string") {
        out.push(rec[1] as string);
        continue;
      }
      if (typeof rec.event === "string") out.push(rec.event);
    }
    return out;
  };

  const countOf = (name: string) => gtmEventNames().filter((n) => n === name).length;

  it("whatsapp_click fires exactly once", () => {
    trackWhatsAppClick({ location: "navbar", url: "https://wa.me/x" });
    expect(countOf("whatsapp_click")).toBe(1);
  });

  it("whatsapp_fastpath_click fires exactly once", () => {
    trackWhatsAppFastPathClick({ product: "SAILROCK", date: "2026-09-01" });
    expect(countOf("whatsapp_fastpath_click")).toBe(1);
  });

  it("generate_lead fires exactly once", () => {
    trackGenerateLead({ form_name: "booking_wizard", product: "OW" });
    expect(countOf("generate_lead")).toBe(1);
  });

  it("purchase fires exactly once", () => {
    trackPurchase({ transaction_id: "T1", value: 2600, item_name: "Dive Booking" });
    expect(countOf("purchase")).toBe(1);
  });

  it("booking_pay_later fires exactly once", () => {
    trackBookingPayLater({ transaction_id: "T2", product: "OW" });
    expect(countOf("booking_pay_later")).toBe(1);
  });

  it("book_now_click fires exactly once", () => {
    trackBookNowClick({ location: "hero", product: "OW", url: "https://dash/x" });
    expect(countOf("book_now_click")).toBe(1);
  });

  // The Google Ads conversions must survive the de-duplication: they are a
  // SEPARATE gtag("event","conversion",{send_to:"AW-…/label"}) call, and the
  // container has no trigger on "conversion", so they cost no GA4 event.
  it("keeps the Google Ads send_to conversion ping on purchase", () => {
    trackPurchase({ transaction_id: "T3", value: 1000 });
    const sendTos = (window.dataLayer as unknown[])
      .map((e) => (e as Record<string, unknown>)?.[2] as Record<string, unknown> | undefined)
      .filter((p) => p && typeof p.send_to === "string")
      .map((p) => p!.send_to as string);
    expect(sendTos.some((v) => v.startsWith("AW-18357382437/"))).toBe(true);
  });

  it("keeps the Google Ads send_to conversion ping on booking_pay_later", () => {
    trackBookingPayLater({ transaction_id: "T4" });
    const sendTos = (window.dataLayer as unknown[])
      .map((e) => (e as Record<string, unknown>)?.[2] as Record<string, unknown> | undefined)
      .filter((p) => p && typeof p.send_to === "string")
      .map((p) => p!.send_to as string);
    expect(sendTos.some((v) => v.startsWith("AW-18357382437/"))).toBe(true);
  });
});
