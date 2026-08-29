// Attribution STORAGE contract (src/utils/utm.ts).
//
// Regression guard for the biggest attribution leak found in the 2026-08-29
// "source vs commission" audit: attribution lived in sessionStorage ONLY, which
// dies with the tab. A visitor who clicked an ad on Monday and came back to
// book on Wednesday arrived carrying nothing, so DiveOS recorded the booking as
// organic - and an organic booking is the one the club pays a commission on.
// The club would pay for a lead its own ad spend had already bought.
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  captureUtmFromUrl,
  captureClickIdsFromUrl,
  getStoredUtm,
  getStoredClickIds,
  getStoredGclid,
  hasStoredClickId,
  clearStoredUtm,
  ATTRIBUTION_TTL_MS,
} from "../utils/utm";

/** Point window.location.search at a landing URL, the way a real visit would. */
const land = (search: string) => {
  Object.defineProperty(window, "location", {
    writable: true,
    configurable: true,
    value: { ...window.location, search },
  });
};

/** Everything a tab close destroys: sessionStorage. localStorage survives. */
const closeTheTab = () => sessionStorage.clear();

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  land("");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("the mirror survives the tab", () => {
  it("THE BUG: a click today is still there in a new tab tomorrow", () => {
    land("?gclid=GCL_MONDAY&utm_source=google&utm_medium=cpc");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    closeTheTab();
    land(""); // Wednesday, typed the domain straight in - no params at all.

    expect(getStoredGclid()).toBe("GCL_MONDAY");
    expect(getStoredUtm().source).toBe("google");
    expect(getStoredUtm().medium).toBe("cpc");
    expect(hasStoredClickId()).toBe(true);
  });

  it("writes the mirror under its own _lt key, never over the session format", () => {
    land("?gclid=GCL_1&utm_source=google");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    // sessionStorage keeps the raw shape it always had, so a visitor who was
    // mid-session when this shipped is unaffected.
    expect(sessionStorage.getItem("siam_gclid")).toBe("GCL_1");
    expect(JSON.parse(sessionStorage.getItem("siam_utm")!).source).toBe("google");

    // localStorage holds a TTL-stamped envelope under a distinct key.
    const env = JSON.parse(localStorage.getItem("siam_gclid_lt")!);
    expect(env.v).toBe("GCL_1");
    expect(typeof env.e).toBe("number");
  });
});

describe("TTL expiry - 30 days, Google's click-attribution window", () => {
  it("a mirrored click is still readable one day before it expires", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    land("?gclid=GCL_OLD&utm_source=google&utm_medium=cpc");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    closeTheTab();
    land("");
    vi.setSystemTime(Date.now() + ATTRIBUTION_TTL_MS - 24 * 60 * 60 * 1000);

    expect(getStoredGclid()).toBe("GCL_OLD");
    expect(getStoredUtm().source).toBe("google");
  });

  it("past the window it is gone - we stop claiming a click Google no longer credits", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    land("?gclid=GCL_STALE&utm_source=google&utm_medium=cpc");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    closeTheTab();
    land("");
    vi.setSystemTime(Date.now() + ATTRIBUTION_TTL_MS + 1);

    expect(getStoredGclid()).toBeNull();
    expect(hasStoredClickId()).toBe(false);
    expect(getStoredUtm()).toEqual({});
  });

  it("an expired entry is purged from localStorage on read, not left to rot", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    land("?gclid=GCL_STALE");
    captureClickIdsFromUrl();
    closeTheTab();

    vi.setSystemTime(Date.now() + ATTRIBUTION_TTL_MS + 1);
    getStoredClickIds();

    expect(localStorage.getItem("siam_gclid_lt")).toBeNull();
  });

  it("a corrupt or unstamped mirror entry is ignored, never thrown over", () => {
    localStorage.setItem("siam_gclid_lt", "not json at all");
    localStorage.setItem("siam_utm_lt", JSON.stringify({ v: { source: "x" } })); // no expiry
    expect(getStoredGclid()).toBeNull();
    expect(getStoredUtm()).toEqual({});
  });
});

describe("first-touch wins", () => {
  it("a later UNTAGGED visit never overwrites what we hold", () => {
    land("?gclid=GCL_FIRST&utm_source=google&utm_medium=cpc&utm_campaign=fun-dives");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    // Same tab, navigates on to a bare in-site page.
    land("");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    expect(getStoredGclid()).toBe("GCL_FIRST");
    expect(getStoredUtm().campaign).toBe("fun-dives");

    // And across a tab close, still untagged.
    closeTheTab();
    land("");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    expect(getStoredGclid()).toBe("GCL_FIRST");
    expect(getStoredUtm().campaign).toBe("fun-dives");
  });

  it("within one session the first touch beats a later TAGGED visit", () => {
    land("?gclid=GCL_FIRST&utm_source=google&utm_medium=cpc");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    land("?gclid=GCL_SECOND&utm_source=meta&utm_medium=paid_social");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    expect(getStoredGclid()).toBe("GCL_FIRST");
    expect(getStoredUtm().source).toBe("google");
  });

  it("a NEW session with a fresh ad click starts a new first touch", () => {
    // Otherwise a 29-day-old click would mask the ad that actually paid for
    // today's visit, and the wrong campaign would be credited.
    land("?gclid=GCL_OLD&utm_source=google&utm_medium=cpc");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    closeTheTab();
    land("?gclid=GCL_NEW&utm_source=google&utm_medium=cpc&utm_campaign=new-push");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    expect(getStoredGclid()).toBe("GCL_NEW");
    expect(getStoredUtm().campaign).toBe("new-push");
  });

  it("clearStoredUtm empties BOTH stores - a stale mirror cannot resurrect", () => {
    land("?gclid=GCL_1&wbraid=WB_1&utm_source=google");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    clearStoredUtm();

    expect(getStoredClickIds()).toEqual({});
    expect(getStoredUtm()).toEqual({});
    expect(localStorage.getItem("siam_gclid_lt")).toBeNull();
    expect(localStorage.getItem("siam_wbraid_lt")).toBeNull();
    expect(localStorage.getItem("siam_utm_lt")).toBeNull();
  });
});

describe("wbraid / gbraid - the iOS clicks that carry no gclid", () => {
  it("captures wbraid and mirrors it like any other click id", () => {
    land("?wbraid=WB_123&utm_source=google&utm_medium=cpc");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    expect(getStoredClickIds().wbraid).toBe("WB_123");
    expect(hasStoredClickId()).toBe(true);
    // There is no gclid on such a click - that is the whole point.
    expect(getStoredGclid()).toBeNull();

    closeTheTab();
    land("");
    expect(getStoredClickIds().wbraid).toBe("WB_123");
  });

  it("captures gbraid too", () => {
    land("?gbraid=GB_456");
    captureClickIdsFromUrl();
    expect(getStoredClickIds().gbraid).toBe("GB_456");
    expect(hasStoredClickId()).toBe(true);
  });

  it("the trio shares one first-touch gate - a click yields exactly one id", () => {
    land("?wbraid=WB_FIRST");
    captureClickIdsFromUrl();

    // A later in-session page somehow carrying a gclid must not be treated as
    // a second, additional click.
    land("?gclid=GCL_LATER");
    captureClickIdsFromUrl();

    expect(getStoredClickIds()).toEqual({ wbraid: "WB_FIRST" });
  });

  it("holds nothing when the visit is genuinely organic", () => {
    land("?utm_source=tripadvisor&utm_medium=referral");
    captureUtmFromUrl();
    captureClickIdsFromUrl();

    expect(hasStoredClickId()).toBe(false);
    expect(getStoredClickIds()).toEqual({});
    expect(getStoredUtm().source).toBe("tripadvisor");
  });
});

// A throw here must never be able to break a booking, so every access is
// wrapped. Safari private mode throws on the mere act of touching storage.
describe("storage that throws - Safari private mode", () => {
  const boom = () => {
    throw new Error("SecurityError: storage is disabled");
  };

  it("a throwing sessionStorage AND localStorage never break capture or read", () => {
    const spies = [window.sessionStorage, window.localStorage].flatMap((s) => [
      vi.spyOn(s, "getItem").mockImplementation(boom),
      vi.spyOn(s, "setItem").mockImplementation(boom),
      vi.spyOn(s, "removeItem").mockImplementation(boom),
    ]);

    land("?gclid=GCL_1&utm_source=google");
    expect(() => captureUtmFromUrl()).not.toThrow();
    expect(() => captureClickIdsFromUrl()).not.toThrow();
    expect(() => getStoredUtm()).not.toThrow();
    expect(() => getStoredClickIds()).not.toThrow();
    expect(() => hasStoredClickId()).not.toThrow();
    expect(() => clearStoredUtm()).not.toThrow();

    expect(getStoredUtm()).toEqual({});
    expect(getStoredGclid()).toBeNull();
    expect(hasStoredClickId()).toBe(false);

    spies.forEach((s) => s.mockRestore());
  });

  it("a missing localStorage entirely still leaves sessionStorage working", () => {
    const saved = window.localStorage;
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    land("?gclid=GCL_1&utm_source=google&utm_medium=cpc");
    expect(() => captureUtmFromUrl()).not.toThrow();
    expect(() => captureClickIdsFromUrl()).not.toThrow();
    expect(getStoredGclid()).toBe("GCL_1");
    expect(getStoredUtm().source).toBe("google");

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      writable: true,
      value: saved,
    });
  });
});
