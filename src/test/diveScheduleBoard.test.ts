import { describe, it, expect } from "vitest";
import { nextDateFor, tripBookingPath, trips } from "@/data/diveScheduleBoard";

// "Book this day" on the weekly board (2026-10-02) preselects the trip AND the
// next date of the chosen weekday in the DiveOS wizard. Dates are Koh Tao time.

describe("nextDateFor", () => {
  // 2026-10-05 02:00 UTC = Monday 09:00 in Koh Tao (UTC+7).
  const mondayMorningBkk = new Date("2026-10-05T02:00:00Z");

  it("returns today when today is that weekday", () => {
    expect(nextDateFor("monday", mondayMorningBkk)).toBe("2026-10-05");
  });

  it("returns the next occurrence later in the week", () => {
    expect(nextDateFor("wednesday", mondayMorningBkk)).toBe("2026-10-07");
    expect(nextDateFor("sunday", mondayMorningBkk)).toBe("2026-10-11");
  });

  it("uses Koh Tao's date, not UTC's, around midnight", () => {
    // 2026-10-04 20:00 UTC is already Monday 03:00 in Koh Tao.
    expect(nextDateFor("monday", new Date("2026-10-04T20:00:00Z"))).toBe("2026-10-05");
  });

  it("skips to next week once today's boat has left", () => {
    // Monday 09:00 Koh Tao: the 05:50 morning trip is gone, the 11:00 one is not.
    expect(nextDateFor("monday", mondayMorningBkk, "05:50")).toBe("2026-10-12");
    expect(nextDateFor("monday", mondayMorningBkk, "11:00")).toBe("2026-10-05");
    // A non-clock meet time ("45 minutes before sunset") never pushes the date.
    expect(nextDateFor("monday", mondayMorningBkk, "45 minutes before sunset")).toBe("2026-10-05");
  });

  it("returns undefined for an unknown key", () => {
    expect(nextDateFor("someday", mondayMorningBkk)).toBeUndefined();
  });
});

describe("tripBookingPath", () => {
  it("adds the date when given", () => {
    expect(tripBookingPath(trips["morning-fun-dive"], "2026-10-07")).toBe(
      "/fun-dive-booking?product=FD&date=2026-10-07",
    );
  });

  it("keeps the product-only link without a date", () => {
    expect(tripBookingPath(trips["sail-rock-day-trip"])).toBe("/fun-dive-booking?product=SAILROCK");
  });
});
