// Referrer classification + the Clarity tag built on it.
//
// Two things are load-bearing here:
//   1. `l.wl.co` is WhatsApp's link shortener, so it must classify as WhatsApp
//      and never as spam - it is real conversation traffic from Nemo and the
//      shop, and lumping it in with the junk would delete the exact number we
//      set out to measure.
//   2. The raw referrer must never reach Clarity. Only one of the eight fixed
//      labels may leave the browser, because a referrer can carry a query
//      string that a third party chose the contents of.
import { describe, it, expect, beforeEach, vi } from "vitest";
import { classifyReferrer } from "../utils/trafficSource";
import { tagTrafficSource, __resetTrafficSourceTag } from "../utils/tracking";

const SITE = "siamscuba.com";

describe("classifyReferrer", () => {
  it("treats WhatsApp's l.wl.co shortener as WhatsApp, not spam or referral", () => {
    expect(classifyReferrer("https://l.wl.co/l?u=https://siamscuba.com", SITE)).toBe("whatsapp");
  });

  it.each([
    ["https://wa.me/66825068898", "wa.me short link"],
    ["https://web.whatsapp.com/", "web client"],
    ["https://api.whatsapp.com/send?phone=123", "api link"],
    ["android-app://com.whatsapp", "android app"],
  ])("classifies %s as whatsapp (%s)", (referrer) => {
    expect(classifyReferrer(referrer, SITE)).toBe("whatsapp");
  });

  it.each([
    "https://cntravel.infotopstream.com/",
    "https://japan.uplayying.com/x",
    "https://contents.lsmagazineimg.com/",
  ])("classifies the verified spam domain %s as referral_spam", (referrer) => {
    expect(classifyReferrer(referrer, SITE)).toBe("referral_spam");
  });

  it("does not let a spam domain be rescued by a looser later rule", () => {
    // Ordering guard: spam is checked before the search/social/referral rules.
    expect(classifyReferrer("https://google.infotopstream.com/", SITE)).toBe("referral_spam");
  });

  it.each([
    ["https://www.google.com/", "google.com"],
    ["https://www.google.co.th/", "country TLD"],
    ["https://www.google.de/search?q=koh+tao", "another country TLD"],
    ["https://www.bing.com/", "bing"],
    ["https://duckduckgo.com/", "ddg"],
  ])("classifies %s as search (%s)", (referrer) => {
    expect(classifyReferrer(referrer, SITE)).toBe("search");
  });

  it.each([
    ["https://claude.ai/", "claude"],
    ["https://chatgpt.com/", "chatgpt"],
    ["https://www.perplexity.ai/", "perplexity"],
  ])("classifies %s as ai_assistant (%s)", (referrer) => {
    expect(classifyReferrer(referrer, SITE)).toBe("ai_assistant");
  });

  it("files Gemini as an AI assistant even though it sits on google.com", () => {
    // AI is checked before search, otherwise this would read as Google search.
    expect(classifyReferrer("https://gemini.google.com/app", SITE)).toBe("ai_assistant");
  });

  it.each([
    ["https://l.instagram.com/", "instagram redirect"],
    ["https://www.facebook.com/", "facebook"],
    ["https://t.co/abc", "twitter shortener"],
  ])("classifies %s as social (%s)", (referrer) => {
    expect(classifyReferrer(referrer, SITE)).toBe("social");
  });

  it("classifies same-site navigation as internal", () => {
    expect(classifyReferrer("https://siamscuba.com/fun-dives", SITE)).toBe("internal");
    expect(classifyReferrer("https://www.siamscuba.com/", SITE)).toBe("internal");
  });

  it("treats the current host as internal on a preview deployment too", () => {
    expect(classifyReferrer("https://siam-website-abc.vercel.app/x", "siam-website-abc.vercel.app"))
      .toBe("internal");
  });

  it("maps Android package referrers, which are not URLs", () => {
    expect(classifyReferrer("com.google.android.googlequicksearchbox", SITE)).toBe("search");
    expect(classifyReferrer("com.instagram.android", SITE)).toBe("social");
  });

  it.each([["", "empty"], [null, "null"], [undefined, "undefined"], ["   ", "whitespace"]])(
    "treats a %s referrer as direct (%s)",
    (referrer) => {
      expect(classifyReferrer(referrer as string | null | undefined, SITE)).toBe("direct");
    },
  );

  it("falls back to referral for an ordinary unknown site", () => {
    expect(classifyReferrer("https://tripadvisor.com/x", SITE)).toBe("referral");
  });

  it("does not match a domain that merely ends with the same letters", () => {
    // "notwhatsapp.com" must not match "whatsapp.com".
    expect(classifyReferrer("https://notwhatsapp.com/", SITE)).toBe("referral");
    expect(classifyReferrer("https://fakegoogle.com/", SITE)).toBe("referral");
  });
});

describe("tagTrafficSource - what reaches Clarity", () => {
  const setReferrer = (value: string) =>
    Object.defineProperty(document, "referrer", { value, configurable: true });

  beforeEach(() => {
    __resetTrafficSourceTag();
    vi.useFakeTimers();
    window.clarity = vi.fn();
  });

  it("sends the label as a Clarity custom tag", () => {
    setReferrer("https://l.wl.co/l?u=x");
    tagTrafficSource();
    expect(window.clarity).toHaveBeenCalledWith("set", "traffic_source", "whatsapp");
  });

  it("never sends the raw referrer, only the label", () => {
    // A referrer can carry an arbitrary query string. None of it may pass.
    setReferrer("https://evil.example.com/?leak=diver@example.com&token=secret");
    tagTrafficSource();
    const args = (window.clarity as unknown as { mock: { calls: unknown[][] } }).mock.calls[0];
    expect(args).toEqual(["set", "traffic_source", "referral"]);
    expect(JSON.stringify(args)).not.toContain("diver@example.com");
    expect(JSON.stringify(args)).not.toContain("secret");
    expect(JSON.stringify(args)).not.toContain("evil.example.com");
  });

  it("tags only once per page session", () => {
    setReferrer("https://www.google.com/");
    tagTrafficSource();
    tagTrafficSource();
    tagTrafficSource();
    expect(window.clarity).toHaveBeenCalledTimes(1);
  });

  it("waits for the lazily-loaded Clarity and then tags", () => {
    setReferrer("https://claude.ai/");
    delete (window as { clarity?: unknown }).clarity;
    tagTrafficSource();

    vi.advanceTimersByTime(3000);
    const late = vi.fn();
    window.clarity = late;
    vi.advanceTimersByTime(2000);

    expect(late).toHaveBeenCalledWith("set", "traffic_source", "ai_assistant");
  });

  it("gives up quietly if the visitor never triggers the Clarity load", () => {
    setReferrer("https://www.google.com/");
    delete (window as { clarity?: unknown }).clarity;
    expect(() => {
      tagTrafficSource();
      vi.advanceTimersByTime(60_000);
    }).not.toThrow();
  });
});
