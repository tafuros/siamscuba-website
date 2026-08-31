// Display-only currency conversion (src/lib/currency.ts, api/rates.ts).
//
// The stakes here are not cosmetic. The site's whole promise is that the Baht
// figure is the price; a converted number that replaces it, rounds to zero, or
// renders as NaN turns a courtesy into a misquote. These tests pin the rules
// that keep that from happening.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  BASE_CURRENCY,
  DISPLAY_CURRENCIES,
  currencyDef,
  formatBaht,
  formatConverted,
  isCurrencyCode,
  roundEstimate,
} from "../lib/currency";
import { RATE_SYMBOLS } from "../../api/rates";
import {
  DSD_FIRST_DIVE_THB,
  DSD_SECOND_DIVE_THB,
} from "../components/CoursesSection";

const RATES = { USD: 0.030253, EUR: 0.026033, GBP: 0.02231, ILS: 0.09036, AUD: 0.042125 };

describe("the currency list", () => {
  it("leads with the base currency", () => {
    expect(DISPLAY_CURRENCIES[0].code).toBe(BASE_CURRENCY);
  });

  // The picker and the endpoint are two files that must agree. A currency added
  // to one and forgotten in the other renders a row that silently converts
  // nothing, so this fails CI instead of shipping.
  it("matches RATE_SYMBOLS in api/rates.ts exactly", () => {
    const pickerNonBase = DISPLAY_CURRENCIES.map((c) => c.code)
      .filter((c) => c !== BASE_CURRENCY)
      .sort();
    expect(pickerNonBase).toEqual([...RATE_SYMBOLS].sort());
  });

  it("gives every currency a symbol and a grouping locale", () => {
    for (const def of DISPLAY_CURRENCIES) {
      expect(def.symbol.length, `${def.code} has no symbol`).toBeGreaterThan(0);
      expect(def.locale, `${def.code} has no locale`).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
    }
  });

  it("recognises its own codes and rejects anything else", () => {
    expect(isCurrencyCode("USD")).toBe(true);
    expect(isCurrencyCode("THB")).toBe(true);
    expect(isCurrencyCode("XYZ")).toBe(false);
    expect(isCurrencyCode(null)).toBe(false);
    expect(currencyDef("THB").symbol).toBe("฿");
  });
});

describe("roundEstimate", () => {
  // Precision would be dishonest: the rate is a daily reference rate and the
  // visitor's bank will not match it. The number has to LOOK like an estimate.
  it("rounds harder as the amount grows", () => {
    expect(roundEstimate(4.23)).toBe(4.2);
    expect(roundEstimate(63.4)).toBe(63);
    expect(roundEstimate(362.63)).toBe(360);
    expect(roundEstimate(1084.3)).toBe(1100);
  });

  it("never returns a negative or non-finite amount", () => {
    expect(roundEstimate(0)).toBe(0);
    expect(roundEstimate(-5)).toBe(0);
    expect(roundEstimate(Number.NaN)).toBe(0);
    expect(roundEstimate(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("formatConverted", () => {
  it("converts a course price to a rounded estimate", () => {
    expect(formatConverted(12000, "USD", RATES)).toBe("≈ $360");
    expect(formatConverted(12000, "ILS", RATES)).toBe("≈ ₪1,100");
  });

  it("groups digits by the CURRENCY's own locale", () => {
    // German grouping for the euro: 12,000 THB is about 310 EUR, but a 38,500
    // THB divemaster course crosses into four digits where the separator shows.
    expect(formatConverted(38500, "EUR", RATES)).toBe("≈ €1.000");
  });

  // THE CORE RULE: this function cannot produce a bare foreign amount when the
  // visitor is on Baht. The Baht figure is the price and needs no companion.
  it("returns null on the base currency", () => {
    expect(formatConverted(12000, "THB", RATES)).toBeNull();
  });

  // Every one of these would otherwise render "≈ $NaN", "≈ $0" or "≈ $undefined"
  // on a live price tag. Showing nothing is the correct answer to all of them.
  it("returns null rather than a broken estimate", () => {
    expect(formatConverted(12000, "USD", null)).toBeNull();
    expect(formatConverted(12000, "USD", {})).toBeNull();
    expect(formatConverted(12000, "USD", { USD: 0 })).toBeNull();
    expect(formatConverted(12000, "USD", { USD: Number.NaN })).toBeNull();
    expect(formatConverted(0, "USD", RATES)).toBeNull();
    expect(formatConverted(-100, "USD", RATES)).toBeNull();
    expect(formatConverted(Number.NaN, "USD", RATES)).toBeNull();
  });

  it("always marks the number as an approximation", () => {
    for (const def of DISPLAY_CURRENCIES.filter((c) => c.code !== BASE_CURRENCY)) {
      const out = formatConverted(12000, def.code, RATES);
      expect(out, `${def.code} produced no estimate`).toBeTruthy();
      expect(out!.startsWith("≈ "), `${def.code} is missing the ≈ marker`).toBe(true);
    }
  });
});

describe("formatBaht", () => {
  it("keeps the Baht symbol and groups by the reading language", () => {
    expect(formatBaht(12000, "en-US")).toBe("฿12,000");
    expect(formatBaht(12000, "de-DE")).toBe("฿12.000");
  });
});

// The Discover Scuba bullet is now composed from numbers so both of its prices
// convert, while hl_dsd_dives stays in translations.ts purely to keep feeding
// Nemo's knowledge base (extract-kb.ts flattens every translation string, and
// deleting copy has silently stripped facts from the bot before). Two sources
// for the same two numbers is a drift risk - this turns it into a CI failure.
describe("the Discover Scuba bullet and Nemo's copy agree", () => {
  const translations = readFileSync(
    resolve(__dirname, "..", "i18n", "translations.ts"),
    "utf8",
  );

  it("hl_dsd_dives still exists in all four languages, for the KB", () => {
    const hits = translations.match(/hl_dsd_dives: "/g) ?? [];
    expect(
      hits.length,
      "hl_dsd_dives feeds Nemo via extract-kb.ts - keep it even though no component renders it",
    ).toBe(4);
  });

  it("every hl_dsd_dives string quotes the same two prices the card renders", () => {
    const lines = translations
      .split("\n")
      // `hl_dsd_dives: "` excludes the `hl_dsd_dives: string;` interface line.
      .filter((l) => l.includes('hl_dsd_dives: "'));
    expect(lines).toHaveLength(4);
    for (const line of lines) {
      // Baht amounts, any separator: 2,600 / 2.600 / 2 600
      const amounts = (line.match(/[\d][\d.,\u00a0 ]*\d/g) ?? []).map((n) =>
        Number(n.replace(/[.,\u00a0 ]/g, "")),
      );
      expect(amounts, `drifted: ${line.trim()}`).toContain(DSD_FIRST_DIVE_THB);
      expect(amounts, `drifted: ${line.trim()}`).toContain(DSD_SECOND_DIVE_THB);
    }
  });
});

// The four surfaces from the rule at the top of src/lib/currency.ts. A future
// refactor that "helpfully" routes one of these through the converter would
// publish a price the shop does not honour, corrupt ad bidding, or take the
// wrong amount of real money.
describe("surfaces that must stay in Baht", () => {
  const read = (rel: string) => readFileSync(resolve(__dirname, "..", "..", rel), "utf8");

  it("analytics events still hardcode THB", () => {
    const tracking = read("src/utils/tracking.ts");
    expect(tracking.includes('currency: "THB"')).toBe(true);
    expect(tracking.includes("useCurrency"), "tracking must not read the display currency").toBe(
      false,
    );
  });

  it("the PayPal hold is still charged in THB", () => {
    expect(read("api/hotel-booking.ts").includes('HOLD_CURRENCY = "THB"')).toBe(true);
  });

  it("JSON-LD offers still declare THB", () => {
    expect(read("src/lib/funDiveCopy.ts").includes('priceCurrency: "THB"')).toBe(true);
    expect(read("src/data/diveScheduleBoard.ts").includes('priceCurrency: "THB"')).toBe(true);
    expect(read("index.html").includes('"priceCurrency": "THB"')).toBe(true);
  });

  it("the Nemo prompt still forbids the bot from converting currency", () => {
    // The bot quotes THE PRICE; the picker shows AN ESTIMATE. They only stay
    // consistent because the bot never converts and the UI never hides the Baht.
    expect(read("api/chat.ts")).toMatch(/NEVER convert to shekels, dollars or euros/);
  });
});
