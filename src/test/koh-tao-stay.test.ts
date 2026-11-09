import { describe, it, expect, beforeEach } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  STAY_SECTIONS,
  STAY_WHATSAPP_PREFILL,
  stayWhatsAppUrl,
} from "@/lib/kohTaoStay";
import { trackStayMapClick, trackStayWhatsAppClick } from "@/utils/tracking";

const places = STAY_SECTIONS.flatMap((s) => s.places);

describe("stay guide tracking", () => {
  beforeEach(() => {
    window.dataLayer = [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  });

  const entries = () => window.dataLayer as Array<Record<string, unknown>>;

  it.each([
    ["stay_map_click", trackStayMapClick],
    ["stay_whatsapp_click", trackStayWhatsAppClick],
  ] as const)("%s reaches the dataLayer exactly once, with no other path", (name, track) => {
    track({ place_name: "Alfredo Resort", section: "center" });
    expect(entries()).toHaveLength(1);
    expect(entries()[0]).toMatchObject({
      event: name,
      place_name: "Alfredo Resort",
      section: "center",
    });
  });
});

describe("stay guide content", () => {
  it("has the 11 briefed places, each with a Google Maps link and a real image", () => {
    expect(places).toHaveLength(11);
    for (const place of places) {
      expect(place.mapUrl).toMatch(/^https:\/\/maps\.app\.goo\.gl\//);
      expect(existsSync(resolve(__dirname, "../../public", place.image.slice(1)))).toBe(true);
    }
  });

  it("offers WhatsApp only for the two places that gave a number", () => {
    expect(places.filter((p) => p.whatsapp).map((p) => p.name)).toEqual([
      "Alfredo Resort",
      "Cape Shark Pool Villas",
    ]);
  });

  it("carries the English referral prefill", () => {
    const url = new URL(stayWhatsAppUrl("66987084374"));
    expect(url.pathname).toBe("/66987084374");
    expect(url.searchParams.get("text")).toBe(STAY_WHATSAPP_PREFILL);
  });

  it("uses no em or en dashes", () => {
    expect(JSON.stringify(STAY_SECTIONS)).not.toMatch(/[–—]/);
  });
});
