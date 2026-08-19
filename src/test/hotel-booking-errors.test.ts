import { describe, it, expect } from "vitest";
import {
  bangkokToday,
  bookingErrorMessage,
  validateStayDates,
  type BookingErrorCode,
} from "@/lib/hotelBookingErrors";
import { HOTEL_COPY, HOTEL_MAX_GUESTS, HOTEL_MAX_NIGHTS } from "@/data/hotel";
import { MAX_GUESTS, MAX_NIGHTS, validateRequest } from "../../api/hotel-booking";
import type { Language } from "@/i18n/translations";

/**
 * A guest who picks the same date twice used to get "something went wrong -
 * message us on WhatsApp". These tests pin the replacement: a specific, fixable
 * line in the page's own language, and a client check that fires before any
 * request or hold. The server still rejects everything it rejected before -
 * `validateRequest` is exercised here too, from the same table.
 */

const LANGS: Language[] = ["en", "he", "es", "fr"];
const NOW = Date.parse("2026-08-18T12:00:00Z"); // Bangkok "today" = 2026-08-18
const TODAY = bangkokToday(NOW);

describe("bangkokToday", () => {
  it("uses Bangkok's day, not the browser's UTC day", () => {
    // 23:30 UTC is already tomorrow in Bangkok - a guest booking from Europe
    // must not be offered a date the server counts as the past.
    expect(bangkokToday(Date.parse("2026-08-18T23:30:00Z"))).toBe("2026-08-19");
    expect(bangkokToday(Date.parse("2026-08-18T12:00:00Z"))).toBe("2026-08-18");
  });
});

describe("validateStayDates - caught on the client, before any hold", () => {
  it("accepts a normal stay", () => {
    expect(validateStayDates("2026-09-01", "2026-09-04", TODAY)).toBeNull();
  });

  it("rejects the same day for check-in and check-out", () => {
    expect(validateStayDates("2026-09-01", "2026-09-01", TODAY)).toBe("checkout_not_after_checkin");
  });

  it("rejects a backwards range", () => {
    expect(validateStayDates("2026-09-04", "2026-09-01", TODAY)).toBe("checkout_not_after_checkin");
  });

  it("rejects a check-in in the past", () => {
    expect(validateStayDates("2026-08-10", "2026-08-20", TODAY)).toBe("checkin_in_past");
  });

  it("accepts exactly one night and exactly the maximum", () => {
    expect(validateStayDates("2026-09-01", "2026-09-02", TODAY)).toBeNull();
    const co = new Date(Date.parse("2026-09-01T00:00:00Z") + HOTEL_MAX_NIGHTS * 86_400_000)
      .toISOString()
      .slice(0, 10);
    expect(validateStayDates("2026-09-01", co, TODAY)).toBeNull();
  });

  it("rejects one night over the maximum", () => {
    const co = new Date(Date.parse("2026-09-01T00:00:00Z") + (HOTEL_MAX_NIGHTS + 1) * 86_400_000)
      .toISOString()
      .slice(0, 10);
    expect(validateStayDates("2026-09-01", co, TODAY)).toBe("stay_too_long");
  });

  it("rejects malformed dates", () => {
    expect(validateStayDates("01/09/2026", "2026-09-04", TODAY)).toBe("invalid_dates");
    expect(validateStayDates("", "", TODAY)).toBe("invalid_dates");
  });
});

describe("client limits mirror the server", () => {
  it("keeps HOTEL_MAX_NIGHTS / HOTEL_MAX_GUESTS in step with the API", () => {
    expect(HOTEL_MAX_NIGHTS).toBe(MAX_NIGHTS);
    expect(HOTEL_MAX_GUESTS).toBe(MAX_GUESTS);
  });
});

/**
 * Rejections the SERVER produces, and the code each one now carries. Every code
 * here has to map to a specific message - that is the whole point of the fix.
 */
const SERVER_CASES: [string, Record<string, unknown>, BookingErrorCode][] = [
  ["same-day range", { checkIn: "2026-09-01", checkOut: "2026-09-01" }, "checkout_not_after_checkin"],
  ["backwards range", { checkIn: "2026-09-04", checkOut: "2026-09-01" }, "checkout_not_after_checkin"],
  ["past check-in", { checkIn: "2026-08-10", checkOut: "2026-08-20" }, "checkin_in_past"],
  ["over the night cap", { checkIn: "2026-09-01", checkOut: "2026-10-15" }, "stay_too_long"],
  ["garbage date", { checkIn: "01/09/2026" }, "invalid_dates"],
  ["too many guests", { guests: 7 }, "invalid_guests"],
  ["zero guests", { guests: 0 }, "invalid_guests"],
  ["missing name", { name: "" }, "invalid_name"],
  ["bad email", { email: "not-an-email" }, "invalid_email"],
  ["oversized notes", { notes: "x".repeat(301) }, "invalid_notes"],
  ["unknown room", { room: "presidential-suite" }, "invalid_room"],
];

const validBody = () => ({
  room: "garden-bungalow",
  checkIn: "2026-09-01",
  checkOut: "2026-09-04",
  guests: 2,
  name: "Test Guest",
  email: "guest@example.com",
  lang: "en",
});

describe("server codes the sheet can explain", () => {
  it.each(SERVER_CASES)("validateRequest returns %s -> its own code", (_label, patch, code) => {
    const out = validateRequest({ ...validBody(), ...patch }, NOW);
    expect(out.ok).toBe(false);
    expect(out.ok === false && out.error).toBe(code);
  });

  it.each(SERVER_CASES)("%s never falls through to the generic message", (_label, patch, _code) => {
    const out = validateRequest({ ...validBody(), ...patch }, NOW);
    const error = out.ok === false ? out.error : "";
    for (const lang of LANGS) {
      const copy = HOTEL_COPY[lang];
      const mapped = bookingErrorMessage(error, copy);
      expect(mapped.message).not.toBe(copy.bookError);
      expect(mapped.message.length).toBeGreaterThan(10);
    }
  });

  it("keeps date problems next to the date fields and the rest under the form", () => {
    const copy = HOTEL_COPY.en;
    expect(bookingErrorMessage("checkout_not_after_checkin", copy).scope).toBe("dates");
    expect(bookingErrorMessage("checkin_in_past", copy).scope).toBe("dates");
    expect(bookingErrorMessage("stay_too_long", copy).scope).toBe("dates");
    expect(bookingErrorMessage("invalid_dates", copy).scope).toBe("dates");
    expect(bookingErrorMessage("invalid_guests", copy).scope).toBe("form");
    expect(bookingErrorMessage("invalid_email", copy).scope).toBe("form");
    expect(bookingErrorMessage("rate_limited", copy).scope).toBe("form");
  });

  it("leaves genuinely unexpected failures on the generic fallback", () => {
    const copy = HOTEL_COPY.en;
    for (const code of ["hold_failed", "hold_not_authorized", "email_failed", "payload_too_large", "too_fast", null, undefined, ""]) {
      const mapped = bookingErrorMessage(code, copy);
      expect(mapped.message).toBe(copy.bookError);
      expect(mapped.scope).toBe("form");
    }
  });
});

describe("the new copy exists in all four languages", () => {
  const CODES: BookingErrorCode[] = [
    "invalid_dates",
    "checkin_in_past",
    "checkout_not_after_checkin",
    "stay_too_long",
    "invalid_guests",
    "invalid_name",
    "invalid_email",
    "invalid_notes",
    "invalid_room",
    "rate_limited",
  ];

  it.each(LANGS)("%s has a distinct, non-empty message for every code", (lang) => {
    const copy = HOTEL_COPY[lang];
    const seen = new Set<string>();
    for (const code of CODES) {
      const { message } = bookingErrorMessage(code, copy);
      expect(message.trim().length).toBeGreaterThan(10);
      expect(message).not.toBe(copy.bookError);
      expect(seen.has(message)).toBe(false);
      seen.add(message);
    }
  });

  it("says exactly the right thing about a same-day range", () => {
    expect(bookingErrorMessage("checkout_not_after_checkin", HOTEL_COPY.en).message).toBe(
      "Check-out must be at least one night after check-in.",
    );
    expect(bookingErrorMessage("checkout_not_after_checkin", HOTEL_COPY.he).message).toBe(
      "הצ'ק-אאוט חייב להיות לפחות לילה אחד אחרי הצ'ק-אין.",
    );
    expect(bookingErrorMessage("checkout_not_after_checkin", HOTEL_COPY.es).message).toBe(
      "La salida debe ser al menos una noche después de la entrada.",
    );
    expect(bookingErrorMessage("checkout_not_after_checkin", HOTEL_COPY.fr).message).toBe(
      "Le départ doit être au moins une nuit après l'arrivée.",
    );
  });

  it("quotes the real limits, so the numbers cannot drift from the server", () => {
    for (const lang of LANGS) {
      expect(bookingErrorMessage("stay_too_long", HOTEL_COPY[lang]).message).toContain(
        String(MAX_NIGHTS),
      );
      expect(bookingErrorMessage("invalid_guests", HOTEL_COPY[lang]).message).toContain(
        String(MAX_GUESTS),
      );
    }
  });

  it("never uses an em-dash (house style is the short hyphen)", () => {
    for (const lang of LANGS) {
      const copy = HOTEL_COPY[lang];
      for (const code of CODES) {
        expect(bookingErrorMessage(code, copy).message).not.toMatch(/[—–]/);
      }
    }
  });
});
