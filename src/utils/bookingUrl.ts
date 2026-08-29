import {
  getStoredUtm,
  getStoredClickIds,
  hasStoredClickId,
  CLICK_ID_NAMES,
} from "@/utils/utm";

// Ben's personal instructor lead form. RETIRED as the embed target on
// 2026-08-24 (Ben's ruling - see buildWizardIframeSrc): organic iframe
// bookings now go to /dive/web too, so DiveOS derives `web_direct` instead of
// attributing them to instructor Ben. Kept exported so the tests can assert
// the embed never routes here anymore. Deliberate personal /dive/<slug>
// instructor/affiliate links elsewhere are NOT covered by that ruling.
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

/**
 * Google click ids, in the order we emit them.
 *
 * `wbraid`/`gbraid` are the iOS/privacy-safe forms: a click that carries one
 * has NO gclid, so forwarding gclid alone loses the whole iPhone half of a
 * campaign. DiveOS already accepts and classifies all three
 * (backend leadFormUrl.ts FORWARDED_PARAMS + leadSource.ts isPaidAttribution).
 */
const CLICK_ID_PARAMS = CLICK_ID_NAMES;

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
  for (const name of CLICK_ID_PARAMS) {
    const value = incoming.get(name);
    if (value) out.set(name, value);
  }

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
    const clickIds = getStoredClickIds();
    for (const name of CLICK_ID_PARAMS) {
      const value = clickIds[name];
      if (value && !out.has(name)) out.set(name, value);
    }
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
 * This is a BUSINESS decision, not a tracking one. It used to select which
 * DiveOS identity takes the booking (see buildWizardIframeSrc) - since Ben's
 * 2026-08-24 ruling both sides of that split default to /dive/web, so today
 * the predicate only distinguishes the two base-url overrides in tests. It
 * stays deliberately narrow anyway - a Google click id, or an explicitly paid
 * utm_medium, nothing else - so a future re-split inherits a correct boundary.
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

  if (CLICK_ID_PARAMS.some((name) => incoming.get(name))) return true;
  const medium = incoming.get("utm_medium");
  if (medium && PAID_MEDIUMS.has(medium.trim().toLowerCase())) return true;

  if (!includeStored) return false;
  if (hasStoredClickId()) return true;
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
 * BEN'S ROUTING RULE (2026-08-01, amended 2026-08-24): every product that
 * arrives through a paid campaign goes through the same process. Originally
 * anything that did NOT come from a campaign stayed on the familiar
 * /dive/ben link; Ben ruled on 2026-08-24 that organic embed traffic must
 * stop being attributed to instructor Ben, so it now targets /dive/web too
 * and DiveOS derives `web_direct` for it.
 *
 *   campaign traffic -> WEB_WIZARD_URL  (/dive/web, the zero-commission "Web"
 *                                        identity built for paid traffic -
 *                                        UNCHANGED by the 2026-08-24 ruling)
 *   everything else  -> WEB_WIZARD_URL  (/dive/web since 2026-08-24;
 *                                        previously LEAD_FORM_URL /dive/ben)
 *
 * Only the iframe's src flips. The visitor is on /fun-dive-booking either way,
 * so the postMessage -> generate_lead / Purchase tracking in
 * pages/FunDiveBookingPage.tsx keeps working for BOTH paths. That is the whole
 * reason Open Water moved off its direct dash.siamscuba.com link onto this
 * wrapper: a 12,000 THB product taking paid traffic had no client-side
 * conversion signal at all.
 *
 * COMMISSION NOTE: sending an organic lead to /dive/web strips an
 * instructor's commission. This warning used to guard the organic side of the
 * split; Ben ruled it EXPLICITLY on 2026-08-24 - the instructor in question
 * is Ben himself, and organic embed bookings should derive `web_direct` in
 * DiveOS, not `instructor`. The ruling covers ONLY this embed's default:
 * deliberate personal /dive/<slug> instructor/affiliate links stay untouched.
 *
 * The storage opt-out (?utm_passthrough=0) suppresses the stored-value half of
 * the decision as well as the passthrough itself, so the two can never
 * disagree - a visitor classified as campaign traffic always carries the
 * attribution that classified them.
 */
export function buildWizardIframeSrc(
  search: string,
  options: WizardIframeOptions = {},
): string {
  const {
    includeStored = true,
    campaignBaseUrl = WEB_WIZARD_URL,
    organicBaseUrl = WEB_WIZARD_URL,
    ...rest
  } = options;

  const optedOut = new URLSearchParams(search).get("utm_passthrough") === "0";
  const consultStorage = includeStored && !optedOut;

  const baseUrl = isCampaignTraffic(search, { includeStored: consultStorage })
    ? campaignBaseUrl
    : organicBaseUrl;

  return buildBookingUrl(search, { ...rest, baseUrl, includeStored });
}

export interface WithAttributionOptions {
  /**
   * Backfill from first-touch storage. MUST be false for the server render and
   * the first client render of any SSG page - see components/BookNowLink.tsx
   * and hooks/useAttributedPath.ts for the hydration trap.
   */
  includeStored?: boolean;
}

/**
 * Append the current attribution params to an INTERNAL path so a click-through
 * (lander -> course page -> booking) keeps them visible on the URL.
 *
 * WHY IT MATTERS. Opening an internal CTA in a NEW TAB starts a fresh
 * sessionStorage, and the destination page's own URL carries nothing - so the
 * visit lands unattributed and DiveOS reads a paid click as organic. The
 * localStorage mirror added alongside this (utils/utm.ts) covers most of that
 * case now, but the URL is the only carrier that survives storage being
 * blocked entirely, and it is what makes the attribution visible in analytics
 * for the destination page view.
 *
 * Sources match buildBookingUrl: explicit params on the current URL win, then
 * first-touch storage backfills. Click ids are forwarded as a trio, since an
 * iOS click carries wbraid/gbraid and no gclid at all.
 */
export function withAttribution(
  path: string,
  search: string,
  options: WithAttributionOptions = {},
): string {
  const { includeStored = true } = options;
  const incoming = new URLSearchParams(search);
  const out = new URLSearchParams();
  for (const key of UTM_KEYS) {
    const value = incoming.get(key);
    if (value) out.set(key, value);
  }
  for (const name of CLICK_ID_PARAMS) {
    const value = incoming.get(name);
    if (value) out.set(name, value);
  }

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
    const clickIds = getStoredClickIds();
    for (const name of CLICK_ID_PARAMS) {
      const value = clickIds[name];
      if (value && !out.has(name)) out.set(name, value);
    }
  }

  const qs = out.toString();
  if (!qs) return path;
  return path.includes("?") ? `${path}&${qs}` : `${path}?${qs}`;
}
