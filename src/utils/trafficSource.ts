/**
 * Referrer classification for Microsoft Clarity.
 *
 * WHY THIS EXISTS. Clarity's own Referrer panel and its "Referring site" filter
 * do not agree: the panel lists `l.wl.co` with 14 sessions over 30 days, but
 * filtering on that exact value returns 0 sessions. So the referrer data is
 * visible but not selectable, which makes it useless for the two questions we
 * actually have - "how much traffic really comes from WhatsApp?" and "show me
 * everything EXCEPT the referrer spam".
 *
 * Classifying on our side and sending the result as a Clarity custom tag fixes
 * both: the tag lands in Clarity's "Custom filters" section, where it IS
 * selectable and excludable, with a small closed vocabulary instead of a long
 * tail of raw hostnames.
 *
 * `l.wl.co` is WhatsApp's own link shortener (it 302s to whatsapp.com), so it
 * is real, high-intent traffic from Nemo and the shop's conversations - it must
 * never be swept up with the spam.
 *
 * THE RAW REFERRER IS NEVER SENT. Only one of the fixed labels below leaves the
 * browser, so a referrer carrying a query string (which can hold anything a
 * third party chose to put there) cannot reach Clarity through this path.
 */

export type TrafficSource =
  | "whatsapp"
  | "ai_assistant"
  | "search"
  | "social"
  | "referral_spam"
  | "internal"
  | "referral"
  | "direct";

/**
 * Domains that appeared as referrers but serve none of our content and do not
 * link to us. Verified 2026-08-14 by fetching each one: `infotopstream.com`
 * returned 405KB of HTML with zero occurrences of "siamscuba", "Koh Tao",
 * "scuba" or "diving"; `uplayying.com` did not respond; `lsmagazineimg.com`
 * returned 403. That is the referrer-spam signature - a bot hits the site with
 * a forged Referer header so the domain shows up in our analytics.
 */
const SPAM_DOMAINS = [
  "infotopstream.com",
  "uplayying.com",
  "lsmagazineimg.com",
];

/** WhatsApp, including `l.wl.co` (its link shortener) and the wa.me short form. */
const WHATSAPP_DOMAINS = ["whatsapp.com", "wa.me", "l.wl.co"];

/**
 * AI assistants. Checked BEFORE search, because `gemini.google.com` and
 * `aistudio.google.com` would otherwise be filed as Google search.
 */
const AI_DOMAINS = [
  "claude.ai",
  "chatgpt.com",
  "openai.com",
  "perplexity.ai",
  "copilot.microsoft.com",
  "gemini.google.com",
  "aistudio.google.com",
];

const SOCIAL_DOMAINS = [
  "instagram.com",
  "facebook.com",
  "fb.com",
  "tiktok.com",
  "youtube.com",
  "reddit.com",
  "linkedin.com",
  "pinterest.com",
  "t.co",
  "twitter.com",
  "x.com",
];

const SEARCH_DOMAINS = [
  "bing.com",
  "duckduckgo.com",
  "yahoo.com",
  "yandex.com",
  "yandex.ru",
  "baidu.com",
  "ecosia.org",
  "qwant.com",
  "naver.com",
];

const INTERNAL_DOMAINS = ["siamscuba.com"];

/**
 * Android surfaces report a package name, not a URL.
 *
 * A Map, NOT an object literal. Plain-object lookup falls through to
 * Object.prototype, so a referrer whose hostname is `constructor`, `toString`,
 * `valueOf` or `hasOwnProperty` - all valid hostnames that `new URL()` parses
 * happily - returned a native function. That is truthy, so it escaped this
 * function as if it were a TrafficSource and would have been handed to
 * Clarity, breaking the one guarantee this module makes: that only a fixed
 * label ever leaves the browser. A Map has no prototype chain to fall through.
 */
const APP_PACKAGE_SOURCES = new Map<string, TrafficSource>([
  ["com.google.android.googlequicksearchbox", "search"],
  ["com.google.android.gm", "referral"],
  ["com.instagram.android", "social"],
  ["com.facebook.katana", "social"],
  ["com.whatsapp", "whatsapp"],
]);

/** `a.b.example.com` matches `example.com`, but `notexample.com` does not. */
function hostMatches(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

/**
 * Google search spans dozens of country TLDs (google.co.th, google.de, ...),
 * so it is matched by shape rather than by listing them.
 */
function isGoogleSearch(host: string): boolean {
  return /(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$/.test(host);
}

/** Lower-cased hostname with any leading `www.`, or "" when unparseable. */
function hostOf(referrer: string): string {
  const raw = referrer.trim();
  if (!raw) return "";
  try {
    return new URL(raw).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    // Not a URL - Android referrers arrive as bare package names.
    return raw.toLowerCase().replace(/^www\./, "");
  }
}

/**
 * Classify a referrer into one of the fixed labels.
 *
 * @param referrer   `document.referrer`, or "" for a direct visit.
 * @param currentHost `location.hostname`, so same-site navigation is "internal"
 *                    on preview and production alike rather than only on the
 *                    hard-coded apex.
 */
export function classifyReferrer(
  referrer: string | null | undefined,
  currentHost?: string,
): TrafficSource {
  const host = hostOf(referrer ?? "");
  if (!host) return "direct";

  const pkg = APP_PACKAGE_SOURCES.get(host);
  if (pkg) return pkg;

  const self = (currentHost ?? "").toLowerCase().replace(/^www\./, "");
  if (self && hostMatches(host, self)) return "internal";
  if (INTERNAL_DOMAINS.some((d) => hostMatches(host, d))) return "internal";

  // Spam first: a spam domain must never be rescued by a later, looser rule.
  if (SPAM_DOMAINS.some((d) => hostMatches(host, d))) return "referral_spam";
  if (WHATSAPP_DOMAINS.some((d) => hostMatches(host, d))) return "whatsapp";
  if (AI_DOMAINS.some((d) => hostMatches(host, d))) return "ai_assistant";
  if (SOCIAL_DOMAINS.some((d) => hostMatches(host, d))) return "social";
  if (SEARCH_DOMAINS.some((d) => hostMatches(host, d))) return "search";
  if (isGoogleSearch(host)) return "search";

  return "referral";
}
