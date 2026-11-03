// Every internal booking CTA must report book_now_click (Ben 2026-11-03: "a
// critical moment, we learn a lot about the marketing from it"). Before this,
// only the schedule board, course cards and the floating button tracked - the
// navbar, every lander hero/sticky/closing CTA, the blog and the chat did not,
// so GA4 never saw most "Book now" clicks.
//
// Drives react-dom directly (no @testing-library - see bookingRouting.render).
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act } from "react-dom/test-utils";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const trackBookNowClick = vi.fn();
vi.mock("../utils/tracking", () => ({ trackBookNowClick: (...a: unknown[]) => trackBookNowClick(...a) }));

import BookingLink from "../components/BookingLink";

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  trackBookNowClick.mockReset();
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

const click = () => {
  const a = host.querySelector("a")!;
  act(() => {
    a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
};

describe("BookingLink reports book_now_click", () => {
  it("fires once with the slot and the product read off the path", () => {
    act(() =>
      root.render(
        <MemoryRouter>
          <BookingLink to="/fun-dive-booking?product=OW&utm_passthrough=1" trackLocation="hero">
            Book
          </BookingLink>
        </MemoryRouter>,
      ),
    );
    click();
    expect(trackBookNowClick).toHaveBeenCalledTimes(1);
    expect(trackBookNowClick.mock.calls[0][0]).toMatchObject({ location: "hero", product: "OW" });
  });

  it("an explicit trackProduct wins, and the caller's own onClick still runs", () => {
    const own = vi.fn();
    act(() =>
      root.render(
        <MemoryRouter>
          <BookingLink to="/fun-dive-booking" trackLocation="chat_nudge" trackProduct="FD" onClick={own}>
            Book
          </BookingLink>
        </MemoryRouter>,
      ),
    );
    click();
    expect(trackBookNowClick).toHaveBeenCalledTimes(1);
    expect(trackBookNowClick.mock.calls[0][0]).toMatchObject({ location: "chat_nudge", product: "FD" });
    expect(own).toHaveBeenCalledTimes(1);
  });
});
