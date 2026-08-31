import type { RateSymbol } from "../../api/rates";

/**
 * Display-only currency conversion. THB is the price; everything else is a hint.
 *
 * THE ONE RULE THIS FILE EXISTS TO ENFORCE
 * Siam Scuba charges in Thai Baht. A converted number is a courtesy for a
 * visitor doing mental arithmetic, never a price we offer. So a conversion
 * ALWAYS appears NEXT TO the Baht figure, never instead of it, and always
 * carries the "≈" marker. `formatConverted` cannot produce a bare foreign
 * amount - the component that renders it is what pairs the two.
 *
 * FOUR SURFACES THAT MUST STAY IN BAHT, WHATEVER THE VISITOR PICKS
 *   1. schema.org / JSON-LD `offers` (index.html, landerCopy, funDiveCopy,
 *      diveScheduleBoard, hotel). Google requires the price to be the
 *      transaction currency; publishing a converted one advertises a price we
 *      do not honour.
 *   2. PayPal in api/hotel-booking.ts (HOLD_CURRENCY = "THB"). Real money.
 *   3. GA4 / Ads / Meta events in src/utils/tracking.ts, which all carry
 *      currency: "THB". Converting there corrupts revenue reporting and, via
 *      Smart Bidding, real ad spend.
 *   4. The Nemo chatbot, whose prompt (api/chat.ts) explicitly forbids
 *      converting currency. That rule stays: the bot quotes THE PRICE, this
 *      picker shows AN ESTIMATE, and the two only agree because the Baht
 *      figure is always on screen.
 *
 * WHAT IS AND IS NOT CONVERTED IN THE UI
 * Only structured numeric prices - the price TAGS (course cards, the dive
 * board, hotel rooms, the trip pages, lander price blocks). Prose keeps Baht:
 * roughly 400 price mentions live inside sentences across four languages with
 * four different unit spellings (THB, ฿, באט, בת) and three digit separators
 * (12,000 / 12.000 / 12 000). No regex sweep survives that, and a converter
 * that mangles one sentence in Spanish is worse than one that never touches
 * prose at all.
 */

export const BASE_CURRENCY = "THB" as const;

export type CurrencyCode = typeof BASE_CURRENCY | RateSymbol;

export type CurrencyDef = {
  code: CurrencyCode;
  symbol: string;
  /** Locale used for digit grouping, so 12,000 / 12.000 / 12 000 come out right. */
  locale: string;
  /** English name, shown next to the symbol in the picker. */
  label: string;
};

/**
 * The picker's contents, base first.
 *
 * MUST stay in sync with RATE_SYMBOLS in api/rates.ts - src/test/currency.test.ts
 * asserts it both ways, so adding a currency in one place and forgetting the
 * other fails CI rather than rendering an empty rate on a live price tag.
 */
export const DISPLAY_CURRENCIES: CurrencyDef[] = [
  { code: "THB", symbol: "฿", locale: "en-US", label: "Thai Baht" },
  { code: "USD", symbol: "$", locale: "en-US", label: "US Dollar" },
  { code: "EUR", symbol: "€", locale: "de-DE", label: "Euro" },
  { code: "GBP", symbol: "£", locale: "en-GB", label: "British Pound" },
  { code: "ILS", symbol: "₪", locale: "he-IL", label: "Israeli Shekel" },
  { code: "AUD", symbol: "A$", locale: "en-AU", label: "Australian Dollar" },
];

export const isCurrencyCode = (value: unknown): value is CurrencyCode =>
  typeof value === "string" && DISPLAY_CURRENCIES.some((c) => c.code === value);

export const currencyDef = (code: CurrencyCode): CurrencyDef =>
  DISPLAY_CURRENCIES.find((c) => c.code === code) ?? DISPLAY_CURRENCIES[0];

/** Rate table as served by /api/rates: 1 THB expressed in each currency. */
export type RateTable = Partial<Record<RateSymbol, number>>;

/**
 * Round a converted amount to something a human reads as an estimate.
 *
 * Precision here would be a lie - the rate is a daily reference rate, the
 * visitor's bank will not match it, and "$362.63" reads like a quote we are
 * standing behind. So the number is rounded HARDER the larger it gets:
 * a 12,000 THB course shows ≈ $360, not ≈ $363. The one exception is small
 * amounts, where rounding to the nearest 10 would swallow the whole figure.
 */
export const roundEstimate = (amount: number): number => {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  if (amount < 10) return Math.round(amount * 10) / 10; // 4.2
  if (amount < 100) return Math.round(amount); // 63
  if (amount < 1000) return Math.round(amount / 10) * 10; // 360
  return Math.round(amount / 100) * 100; // 1,100
};

/** The Baht price itself, formatted for `locale`. Never converted. */
export const formatBaht = (thb: number, locale = "en-US"): string =>
  `฿${thb.toLocaleString(locale)}`;

/**
 * The indicative line, e.g. "≈ $360". Returns null when it must not be shown:
 * the visitor is on Baht, the rate is missing, or the input is not a real
 * amount. Callers render nothing on null - a price tag with no estimate is
 * correct, a price tag with a broken estimate is not.
 */
export const formatConverted = (
  thb: number,
  code: CurrencyCode,
  rates: RateTable | null,
): string | null => {
  if (code === BASE_CURRENCY) return null;
  if (!rates || !Number.isFinite(thb) || thb <= 0) return null;
  const rate = rates[code as RateSymbol];
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) return null;
  const def = currencyDef(code);
  const value = roundEstimate(thb * rate);
  if (value <= 0) return null;
  return `≈ ${def.symbol}${value.toLocaleString(def.locale)}`;
};
