// Guards the two SILENT failure modes in the lander -> DiveOS booking handoff.
//
// Neither of these throws, logs, or renders differently when it breaks. The
// only symptom is worse conversion on a product that is actively spending ad
// budget, which is exactly the kind of bug that survives for months.
//
//   1. A ?product= code that is not in the DiveOS catalog. The customer wizard
//      resolves it with `courses.find(c => c.code === productParam)` and simply
//      does nothing when that misses. `owd` shipped as "OWD" - the real code is
//      "OW" - so the Open Water preselect never worked.
//   2. A lander whose primary CTA is WhatsApp, which means no postMessage
//      conversion signal at all. `aow` was in that state while being the
//      second-biggest earner in the business.
import { describe, it, expect } from "vitest";
import {
  WIZARD_PRODUCT,
  TRIP_CARD_PRODUCT,
  DIVEOS_COURSE_CODES,
  usesBookingWrapper,
} from "../lib/landerBooking";
import { LANDER_COPY, type Offer } from "../lib/landerCopy";

const OFFERS = Object.keys(LANDER_COPY) as Offer[];

describe("lander -> DiveOS product codes", () => {
  it("every preselected code is a real DiveOS Course.code", () => {
    const known = new Set<string>(DIVEOS_COURSE_CODES);
    for (const [offer, code] of Object.entries(WIZARD_PRODUCT)) {
      expect(known, `offer "${offer}" preselects unknown code "${code}"`).toContain(
        code,
      );
    }
  });

  it("codes are exact - no lowercase, padding or PADI-style suffixes", () => {
    // "OWD"/"AOWD" are the PADI certification abbreviations and read as correct,
    // which is precisely why the wrong one shipped. DiveOS uses "OW"/"AOW".
    for (const [offer, code] of Object.entries(WIZARD_PRODUCT)) {
      expect(code, `offer "${offer}"`).toBe(code!.trim());
      expect(code, `offer "${offer}"`).toBe(code!.toUpperCase());
    }
    expect(Object.values(WIZARD_PRODUCT)).not.toContain("OWD");
    expect(Object.values(WIZARD_PRODUCT)).not.toContain("AOWD");
  });

  it("the three course landers each preselect their own course", () => {
    expect(WIZARD_PRODUCT.owd).toBe("OW");
    expect(WIZARD_PRODUCT.aow).toBe("AOW");
    expect(WIZARD_PRODUCT.dsd).toBe("DSD");
  });
});

describe("homepage trip cards -> DiveOS product codes", () => {
  // Same silent failure as the landers: an unknown code makes the wizard's
  // `courses.find` miss, the preselect quietly does nothing, and the customer
  // is asked to choose the trip they already chose on the card.
  it("every trip-card code is a real DiveOS Course.code", () => {
    const known = new Set<string>(DIVEOS_COURSE_CODES);
    for (const [card, code] of Object.entries(TRIP_CARD_PRODUCT)) {
      expect(known, `trip card "${card}" preselects unknown code "${code}"`).toContain(
        code,
      );
    }
  });

  it("codes are exact - no lowercase or padding", () => {
    for (const [card, code] of Object.entries(TRIP_CARD_PRODUCT)) {
      expect(code, `trip card "${card}"`).toBe(code.trim());
      expect(code, `trip card "${card}"`).toBe(code.toUpperCase());
    }
  });

  it("Sail Rock and the fun dives preselect different products", () => {
    // Morning and Afternoon share "FD" on purpose - they are one product that
    // differs by departure time - but the flagship must not collapse into it.
    expect(TRIP_CARD_PRODUCT.funDive).toBe("FD");
    expect(TRIP_CARD_PRODUCT.sailRock).toBe("SAILROCK");
    expect(TRIP_CARD_PRODUCT.funDive).not.toBe(TRIP_CARD_PRODUCT.sailRock);
  });
});

describe("lander booking CTAs", () => {
  it("every offer carrying a product preselect routes through the wrapper", () => {
    // A preselect is pointless if the CTA never opens the wizard.
    for (const offer of Object.keys(WIZARD_PRODUCT) as Offer[]) {
      expect(usesBookingWrapper(offer), `offer "${offer}"`).toBe(true);
    }
  });

  it("the paid course landers all have a booking CTA", () => {
    // These take campaign budget. WhatsApp-only means no conversion signal.
    for (const offer of ["owd", "aow", "dsd", "fun-dive"] as Offer[]) {
      expect(usesBookingWrapper(offer), `offer "${offer}" has no booking CTA`).toBe(
        true,
      );
    }
  });

  it("a booking-wrapper lander never labels its primary CTA as WhatsApp", () => {
    // ctaPrimary renders as the booking link and ctaSecondary as the green
    // WhatsApp button. Both OW and AOW kept "Chat on WhatsApp" as ctaPrimary
    // after moving onto the wrapper, so the main button lied about where it went.
    for (const offer of OFFERS) {
      if (!usesBookingWrapper(offer)) continue;
      for (const lang of ["en", "es", "he"] as const) {
        const { ctaPrimary } = LANDER_COPY[offer][lang];
        expect(
          ctaPrimary.toLowerCase(),
          `${offer}/${lang} primary CTA opens the booking wizard but says "${ctaPrimary}"`,
        ).not.toContain("whatsapp");
      }
    }
  });
});
