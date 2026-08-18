import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { HOTEL_INFO, HOTEL_ROOMS, HOTEL_WHATSAPP_NUMBER } from "@/data/hotel";

// api/_hotel-data.json is GENERATED from src/data/hotel.ts by
// scripts/build-hotel-data.ts and read at runtime by the booking engine
// (api/hotel-booking.ts). If someone edits hotel.ts (price change, room
// reopening after renovation, new room) without re-running the script, the
// booking emails and validation would silently disagree with the site.
// This test is the tripwire: it fails CI until `bun scripts/build-hotel-data.ts`
// is re-run and the JSON recommitted.

const data = JSON.parse(
  readFileSync(resolve(__dirname, "../../api/_hotel-data.json"), "utf-8"),
);

describe("api/_hotel-data.json stays in sync with src/data/hotel.ts", () => {
  it("has exactly the same room slugs", () => {
    expect(Object.keys(data.rooms).sort()).toEqual(HOTEL_ROOMS.map((r) => r.slug).sort());
  });

  it.each(HOTEL_ROOMS.map((r) => [r.slug, r] as const))(
    "room %s matches (price, unit, sleeps, soldOut, names)",
    (_slug, room) => {
      const j = data.rooms[room.slug];
      expect(j.price).toBe(room.pricePerNight);
      expect(j.priceUnit).toBe(room.priceUnit ?? "night");
      expect(j.sleeps).toBe(room.sleeps);
      expect(j.soldOut).toBe(room.soldOut === true);
      expect(j.name).toEqual(room.name);
    },
  );

  it("hotel info matches", () => {
    expect(data.hotel.name).toBe(HOTEL_INFO.name);
    expect(data.hotel.address).toBe(HOTEL_INFO.address);
    expect(data.hotel.checkIn).toBe(HOTEL_INFO.checkIn);
    expect(data.hotel.checkOut).toBe(HOTEL_INFO.checkOut);
    expect(data.hotel.mapsUrl).toBe(HOTEL_INFO.mapsUrl);
    expect(data.hotel.whatsapp).toBe(HOTEL_WHATSAPP_NUMBER);
  });

  it("ships all 3 email templates x 4 languages", () => {
    for (const kind of ["provisional", "final", "decline"]) {
      for (const lang of ["en", "he", "es", "fr"]) {
        const tpl = data.emails[kind]?.[lang];
        expect(tpl?.subject, `${kind}/${lang} subject`).toBeTruthy();
        expect(tpl?.html, `${kind}/${lang} html`).toBeTruthy();
      }
    }
  });
});
