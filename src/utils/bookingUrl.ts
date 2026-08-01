import { getStoredUtm, getStoredGclid } from "@/utils/utm";

// The DiveOS customer wizard, embedded as a cross-origin iframe on
// /fun-dive-booking. Cross-origin means it CANNOT read this site's
// sessionStorage - attribution only reaches it via the iframe's query string,
// which is what this builder produces.
export const LEAD_FORM_URL = "https://dash.siamscuba.com/dive/ben";

// The public self-serve booking wizard, built by the diveos agent for the paid
// campaigns. This is the CTA target for the campaign landers - a full-page
// wizard on a different host, so attribution can only reach it on the URL.
//
// NOT /dive/shop: that slug is the office walk-in form and must never receive
// paid traffic.
export const WEB_WIZARD_URL = "https://dash.siamscuba.com/dive/web";

/** Params that carry paid-traffic attribution, in the order we emit them. */
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export interface BookingUrlOptions {
  /** Wizard base URL. Defaults to the public web wizard. */
  baseUrl?: string;
  /**
   * Trip preselect used only when the incoming URL does not already carry one
   * (an explicit ?product= on the page URL is a deliberate override and wins).
   */
  product?: string;
  date?: string;
  /**
   * Read first-touch UTMs/gclid from sessionStorage. Must be false for the
   * server render and the first client render of any SSG page - see
   * components/BookNowLink.tsx for why.
   */
  includeStored?: boolean;
}

/**
 * Build a wizard URL carrying every attribution param we hold.
 *
 * Sources, in precedence order:
 *   1. explicit params on the incoming URL  (a deliberate override)
 *   2. first-touch utm params + gclid in sessionStorage (captured on the landing page
 *      by App.tsx -> utils/utm.ts, which is what makes attribution survive
 *      in-site navigation: lander -> course page -> CTA)
 *   3. the caller's product/date preselect
 *
 * Passthrough of stored first-touch values is ON BY DEFAULT; callers opt out
 * with ?utm_passthrough=0. It used to be opt-in via ?utm_passthrough=1, which
 * only the landers set - every generic CTA silently dropped the gclid, and
 * DiveOS recorded 390 leads all-time with zero attribution. Defaulting to ON
 * means a newly added CTA cannot regress attribution by forgetting a param.
 *
 * Emitted contract (all params optional, flat, string-valued):
 *   product, date, utm_source, utm_medium, utm_campaign, utm_content,
 *   utm_term, gclid
 * `utm_passthrough` is a caller-side control flag and is never forwarded.
 */
export function buildBookingUrl(search: string, options: BookingUrlOptions = {}): string {
  const { baseUrl = WEB_WIZARD_URL, product, date, includeStored = true } = options;
  const incoming = new URLSearchParams(search);
  const out = new URLSearchParams();

  const incomingProduct = incoming.get("product") || product;
  if (incomingProduct) out.set("product", incomingProduct);
  const incomingDate = incoming.get("date") || date;
  if (incomingDate) out.set("date", incomingDate);

  // Explicit utm_* / gclid present on the incoming URL win.
  for (const [key, value] of incoming.entries()) {
    if (key.startsWith("utm_") && key !== "utm_passthrough" && value) {
      out.set(key, value);
    }
  }
  const incomingGclid = incoming.get("gclid");
  if (incomingGclid) out.set("gclid", incomingGclid);

  // Backfill from first-touch storage unless explicitly opted out, without
  // clobbering explicit values already set above. The landers still send
  // utm_passthrough=1; that is now a no-op that documents intent.
  if (includeStored && incoming.get("utm_passthrough") !== "0") {
    const utm = getStoredUtm();
    const stored: Record<string, string | undefined> = {
      utm_source: utm.source,
      utm_medium: utm.medium,
      utm_campaign: utm.campaign,
      utm_content: utm.content,
      utm_term: utm.term,
    };
    for (const key of UTM_KEYS) {
      const value = stored[key];
      if (value && !out.has(key)) out.set(key, value);
    }
    const storedGclid = getStoredGclid();
    if (storedGclid && !out.has("gclid")) out.set("gclid", storedGclid);
  }

  const qs = out.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
}

/**
 * Build the src for the DiveOS wizard iframe on /fun-dive-booking.
 * Thin alias over buildBookingUrl pinned to the legacy embedded form.
 */
export function buildWizardIframeSrc(search: string, baseUrl = LEAD_FORM_URL): string {
  return buildBookingUrl(search, { baseUrl });
}

/**
 * Append the current attribution params to an INTERNAL path so a click-through
 * (lander -> course page) keeps them visible on the URL.
 *
 * sessionStorage first-touch already survives in-site navigation, so this is
 * belt-and-braces - it matters when the visitor opens an internal link in a NEW
 * TAB, which starts a fresh sessionStorage and would otherwise arrive
 * unattributed.
 */
export function withAttribution(path: string, search: string): string {
  const incoming = new URLSearchParams(search);
  const out = new URLSearchParams();
  for (const key of UTM_KEYS) {
    const value = incoming.get(key);
    if (value) out.set(key, value);
  }
  const gclid = incoming.get("gclid");
  if (gclid) out.set("gclid", gclid);

  const qs = out.toString();
  if (!qs) return path;
  return path.includes("?") ? `${path}&${qs}` : `${path}?${qs}`;
}
