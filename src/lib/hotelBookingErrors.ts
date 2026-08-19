/**
 * Turning a hotel-booking failure into something the guest can act on.
 *
 * The booking sheet used to show one generic "something went wrong - message us
 * on WhatsApp" for every rejection, which made a two-second fix (same date for
 * check-in and check-out) look like a broken site. Two pieces live here:
 *
 *   1. `validateStayDates` - the date rules run on the client BEFORE any
 *      request or hold, so the guest is corrected instantly and no money is
 *      touched. It returns the same codes the API returns, on purpose.
 *   2. `bookingErrorMessage` - maps an API error code onto specific copy and
 *      says where it belongs (next to the date fields, or in the form-level
 *      slot). Anything unmapped falls back to `copy.bookError`.
 *
 * This never relaxes anything: api/hotel-booking.ts `validateRequest` remains
 * the authority and re-checks every one of these. The client only pre-empts the
 * round trip and explains the outcome.
 */

import { HOTEL_MAX_GUESTS, HOTEL_MAX_NIGHTS, type HotelCopy } from "@/data/hotel";

/** Codes shared with `validateRequest` in api/hotel-booking.ts. */
export type BookingErrorCode =
  | "invalid_dates"
  | "checkin_in_past"
  | "checkout_not_after_checkin"
  | "stay_too_long"
  | "invalid_guests"
  | "invalid_name"
  | "invalid_email"
  | "invalid_notes"
  | "invalid_room"
  | "rate_limited";

/** Where the message is rendered - beside the date pair, or under the form. */
export type BookingErrorScope = "dates" | "form";

export interface BookingErrorMessage {
  scope: BookingErrorScope;
  message: string;
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

/** The hotel is in Thailand, so "today" is Bangkok's, matching the server. */
export function bangkokToday(now: number = Date.now()): string {
  return new Date(now + 7 * 3_600_000).toISOString().slice(0, 10);
}

/**
 * Same-day, backwards and over-long stays, caught before the request is sent.
 * Returns null when the range is fine.
 */
export function validateStayDates(
  checkIn: string,
  checkOut: string,
  today: string = bangkokToday(),
): BookingErrorCode | null {
  if (!ISO_DATE_RE.test(checkIn) || !ISO_DATE_RE.test(checkOut)) return "invalid_dates";
  const ci = Date.parse(`${checkIn}T00:00:00Z`);
  const co = Date.parse(`${checkOut}T00:00:00Z`);
  if (!Number.isFinite(ci) || !Number.isFinite(co)) return "invalid_dates";
  if (checkIn < today) return "checkin_in_past";
  const nights = Math.round((co - ci) / DAY_MS);
  if (nights < 1) return "checkout_not_after_checkin";
  if (nights > HOTEL_MAX_NIGHTS) return "stay_too_long";
  return null;
}

const SCOPES: Record<BookingErrorCode, BookingErrorScope> = {
  invalid_dates: "dates",
  checkin_in_past: "dates",
  checkout_not_after_checkin: "dates",
  stay_too_long: "dates",
  invalid_guests: "form",
  invalid_name: "form",
  invalid_email: "form",
  invalid_notes: "form",
  invalid_room: "form",
  rate_limited: "form",
};

function copyFor(code: BookingErrorCode, copy: HotelCopy): string {
  switch (code) {
    case "invalid_dates":
      return copy.bookErrDatesInvalid;
    case "checkin_in_past":
      return copy.bookErrDatePast;
    case "checkout_not_after_checkin":
      return copy.bookErrDateOrder;
    case "stay_too_long":
      return copy.bookErrMaxNights(HOTEL_MAX_NIGHTS);
    case "invalid_guests":
      return copy.bookErrGuests(HOTEL_MAX_GUESTS);
    case "invalid_name":
      return copy.bookErrName;
    case "invalid_email":
      return copy.bookErrEmail;
    case "invalid_notes":
      return copy.bookErrNotes;
    case "invalid_room":
      return copy.bookErrRoom;
    case "rate_limited":
      return copy.bookErrRate;
  }
}

/**
 * Unmapped codes (hold_failed, hold_not_authorized, email_failed, too_fast,
 * payload_too_large, a dropped connection) stay on the generic fallback - they
 * are genuinely not the guest's to fix, and "too_fast" must not coach bots.
 */
export function bookingErrorMessage(
  code: string | null | undefined,
  copy: HotelCopy,
): BookingErrorMessage {
  if (code && code in SCOPES) {
    const known = code as BookingErrorCode;
    return { scope: SCOPES[known], message: copyFor(known, copy) };
  }
  return { scope: "form", message: copy.bookError };
}
