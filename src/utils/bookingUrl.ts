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

/**
 * utm_medium values that mean "this visitor cost us money".
 *
 * Lower-cased on comparison. Google Ads auto-tagging sends `cpc`; the Meta and
 * manual-tagged campaigns use the other three. Anything else - organic, direct,
 * referral, email, the walk-in QR codes - is NOT campaign traffic.
 */
const PAID_MEDIUMS = new Set(["cpc", "ppc", "paidsearch", "paid_social"]);

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

export interface CampaignTrafficOptions {
  /**
   * Consult first-touch sessionStorage. Must be false anywhere the answer is
   * rendered on the server or on the first client render - see buildBookingUrl.
   */
  includeStored?: boolean;
}

/**
 * Did this visitor arrive from a PAID campaign?
 *
 * This is a BUSINESS decision, not a tracking one. It selects which DiveOS
 * identity takes the booking (see buildWizardIframeSrc), which decides whether
 * an instructor earns commission on it. Widening this predicate takes
 * commission away from organic leads, so it stays deliberately narrow:
 * a Google click id, or an explicitly paid utm_medium. Nothing else.
 *
 * Both signals are read from the incoming URL first and then, unless the caller
 * opts out, from the first-touch sessionStorage capture (App.tsx ->
 * utils/utm.ts). The storage read is what makes the decision survive in-site
 * navigation: ad click -> lander -> course page -> /fun-dive-booking, where the
 * booking page's own URL carries nothing at all.
 */
export function isCampaignTraffic(
  search: string,
  options: CampaignTrafficOptions = {},
): boolean {
  const { includeStored = true } = options;
  const incoming = new URLSearchParams(search);

  if (incoming.get("gclid")) return true;
  const medium = incoming.get("utm_medium");
  if (medium && PAID_MEDIUMS.has(medium.trim().toLowerCase())) return true;

  if (!includeStored) return false;
  if (getStoredGclid()) return true;
  const storedMedium = getStoredUtm().medium;
  return Boolean(storedMedium && PAID_MEDIUMS.has(storedMedium.trim().toLowerCase()));
}

export interface WizardIframeOptions extends BookingUrlOptions {
  /** Override the campaign-traffic target. Tests only. */
  campaignBaseUrl?: string;
  /** Override the organic target. Tests only. */
  organicBaseUrl?: string;
}

/**
 * Build the src for the DiveOS wizard iframe on /fun-dive-booking.
 *
 * BEN'S ROUTING RULE (2026-08-01): every product that arrives through a paid
 * campaign goes through the same process. Anything that did not come from a
 * campaign stays on the familiar link the site has always used.
 *
 *   campaign traffic -> WEB_WIZARD_URL  (/dive/web, the zero-commission "Web"
 *                                        identity built for paid traffic)
 *   everything else  -> LEAD_FORM_URL   (/dive/ben, UNCHANGED - normal
 *                                        instructor/commission handling)
 *
 * Only the iframe's src flips. The visitor is on /fun-dive-booking either way,
 * so the postMessage -> generate_lead / Purchase tracking in
 * pages/FunDiveBookingPage.tsx keeps working for BOTH paths. That is the whole
 * reason Open Water moved off its direct dash.siamscuba.com link onto this
 * wrapper: a 12,000 THB product taking paid traffic had no client-side
 * conversion signal at all.
 *
 * Do NOT widen the campaign side to "has any utm_source" or similar. Sending an
 * organic lead to /dive/web silently strips an instructor's commission.
 *
 * The storage opt-out (?utm_passthrough=0) suppresses the stored-value half of
 * the decision as well as the passthrough itself, so the two can never
 * disagree - which would otherwise route a visitor to the paid wizard carrying
 * no attribution at all, the worst of both outcomes.
 */
export function buildWizardIframeSrc(
  search: string,
  options: WizardIframeOptions = {},
): string {
  const {
    includeStored = true,
    campaignBaseUrl = WEB_WIZARD_URL,
    organicBaseUrl = LEAD_FORM_URL,
    ...rest
  } = options;

  const optedOut = new URLSearchParams(search).get("utm_passthrough") === "0";
  const consultStorage = includeStored && !optedOut;

  const baseUrl = isCampaignTraffic(search, { includeStored: consultStorage })
    ? campaignBaseUrl
    : organicBaseUrl;

  return buildBookingUrl(search, { ...rest, baseUrl, includeStored });
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
