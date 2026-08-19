// The dead end Ben hit on the preview: same date for check-in and check-out ->
// a generic "something went wrong, message us on WhatsApp". These drive the
// real sheet and assert the guest now gets a specific line beside the date
// fields, in the page's own language, and that nothing is sent - no request,
// no hold, no money.
//
// Like bookingRouting.render.test.tsx this drives react-dom directly rather
// than @testing-library/react: that package's peer `@testing-library/dom` is
// not installed, and AGENTS.md forbids this agent from installing on its own.
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act } from "react-dom/test-utils";
import { createRoot, type Root } from "react-dom/client";
import BookingRequestForm from "@/components/hotel/BookingRequestForm";
import { HOTEL_COPY, HOTEL_ROOMS, HOTEL_MAX_NIGHTS } from "@/data/hotel";
import { bangkokToday } from "@/lib/hotelBookingErrors";
import type { Language } from "@/i18n/translations";

// Without this React logs "not configured to support act(...)" on every render.
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const ROOM = HOTEL_ROOMS.find((r) => !r.soldOut)!;
const LANGS: Language[] = ["en", "he", "es", "fr"];

let container: HTMLDivElement;
let root: Root;
let fetchSpy: ReturnType<typeof vi.fn>;

/** React tracks its own value on controlled inputs - go through the setter. */
function setValue(el: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set!;
  setter.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

const el = <T extends HTMLElement>(selector: string) =>
  document.querySelector<T>(selector) as T;

const dateInputs = () => ({
  checkIn: el<HTMLInputElement>(`#ci-${ROOM.slug}`),
  checkOut: el<HTMLInputElement>(`#co-${ROOM.slug}`),
});

const bodyText = () => document.body.textContent ?? "";

function openSheet(lang: Language) {
  act(() => {
    root.render(
      <BookingRequestForm
        room={ROOM}
        copy={HOTEL_COPY[lang]}
        lang={lang}
        open
        onOpenChange={() => {}}
      />,
    );
  });
}

function submitWithDates(checkIn: string, checkOut: string) {
  const { checkIn: ci, checkOut: co } = dateInputs();
  act(() => {
    setValue(ci, checkIn);
    setValue(co, checkOut);
    setValue(el<HTMLInputElement>(`#n-${ROOM.slug}`), "Test Guest");
    setValue(el<HTMLInputElement>(`#e-${ROOM.slug}`), "guest@example.com");
  });
  act(() => {
    el<HTMLFormElement>("form").dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
  });
}

/** Let the submit handler's awaited fetch settle. */
async function settle() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  fetchSpy = vi.fn();
  vi.stubGlobal("fetch", fetchSpy);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("booking sheet - a same-day range is fixable, not a dead end", () => {
  it.each(LANGS)("%s: names the fix and sends nothing", (lang) => {
    openSheet(lang);
    submitWithDates("2026-09-01", "2026-09-01");

    expect(bodyText()).toContain(HOTEL_COPY[lang].bookErrDateOrder);
    // the generic "message us on WhatsApp" line must NOT be what they see
    expect(bodyText()).not.toContain(HOTEL_COPY[lang].bookError);
    // nothing left the browser: no request, no hold, no money
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("renders the message next to the date fields, wired for screen readers", () => {
    openSheet("en");
    submitWithDates("2026-09-01", "2026-09-01");

    const alert = el(`#dates-err-${ROOM.slug}`);
    expect(alert).toBeTruthy();
    expect(alert.textContent).toBe(HOTEL_COPY.en.bookErrDateOrder);
    expect(dateInputs().checkOut.getAttribute("aria-describedby")).toBe(`dates-err-${ROOM.slug}`);
    expect(dateInputs().checkOut.getAttribute("aria-invalid")).toBe("true");
  });

  it("says the same thing for a backwards range", () => {
    openSheet("en");
    submitWithDates("2026-09-04", "2026-09-01");
    expect(bodyText()).toContain(HOTEL_COPY.en.bookErrDateOrder);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("names the night cap instead of failing generically", () => {
    openSheet("en");
    submitWithDates("2026-09-01", "2026-10-15");
    expect(bodyText()).toContain(HOTEL_COPY.en.bookErrMaxNights(HOTEL_MAX_NIGHTS));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("clears the message as soon as the guest edits a date", () => {
    openSheet("en");
    submitWithDates("2026-09-01", "2026-09-01");
    expect(bodyText()).toContain(HOTEL_COPY.en.bookErrDateOrder);

    act(() => setValue(dateInputs().checkOut, "2026-09-03"));
    expect(bodyText()).not.toContain(HOTEL_COPY.en.bookErrDateOrder);
  });

  it("offers Bangkok's today as the earliest check-in, not the browser's UTC day", () => {
    openSheet("en");
    expect(dateInputs().checkIn.min).toBe(bangkokToday());
  });

  it("lets a valid range through to the API", async () => {
    fetchSpy.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    openSheet("en");
    submitWithDates("2026-09-01", "2026-09-04");
    await settle();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(String(fetchSpy.mock.calls[0][0])).toContain("action=hold");
  });
});

describe("booking sheet - server rejections get named too", () => {
  const rejectWith = (error: string, status = 400) =>
    fetchSpy.mockResolvedValue({ ok: false, status, json: async () => ({ error }) });

  it("maps invalid_email onto the email line, not the generic one", async () => {
    rejectWith("invalid_email");
    openSheet("en");
    submitWithDates("2026-09-01", "2026-09-04");
    await settle();
    expect(bodyText()).toContain(HOTEL_COPY.en.bookErrEmail);
    expect(bodyText()).not.toContain(HOTEL_COPY.en.bookError);
  });

  it("maps invalid_guests onto its own line", async () => {
    rejectWith("invalid_guests");
    openSheet("es");
    submitWithDates("2026-09-01", "2026-09-04");
    await settle();
    expect(bodyText()).toContain(HOTEL_COPY.es.bookErrGuests(6));
  });

  it("maps rate_limited onto its own line", async () => {
    rejectWith("rate_limited", 429);
    openSheet("he");
    submitWithDates("2026-09-01", "2026-09-04");
    await settle();
    expect(bodyText()).toContain(HOTEL_COPY.he.bookErrRate);
  });

  it("puts a server-side date rejection back beside the date fields", async () => {
    rejectWith("checkin_in_past");
    openSheet("fr");
    submitWithDates("2026-09-01", "2026-09-04");
    await settle();
    expect(el(`#dates-err-${ROOM.slug}`).textContent).toBe(HOTEL_COPY.fr.bookErrDatePast);
  });

  it("keeps the generic fallback for a provider failure", async () => {
    rejectWith("hold_failed", 502);
    openSheet("en");
    submitWithDates("2026-09-01", "2026-09-04");
    await settle();
    expect(bodyText()).toContain(HOTEL_COPY.en.bookError);
  });

  it("keeps the generic fallback when the network drops", async () => {
    fetchSpy.mockRejectedValue(new Error("offline"));
    openSheet("fr");
    submitWithDates("2026-09-01", "2026-09-04");
    await settle();
    expect(bodyText()).toContain(HOTEL_COPY.fr.bookError);
  });
});
