import { getStoredUtm, getStoredGclid } from "@/utils/utm";

// The DiveOS customer wizard, embedded as a cross-origin iframe on
// /fun-dive-booking. Cross-origin means it CANNOT read this site's
// sessionStorage - attribution only reaches it via the iframe's query string,
// which is what this builder produces.
export const LEAD_FORM_URL = "https://dash.siamscuba.com/dive/ben";

/**
 * Build the wizard iframe src from the booking page's own query string plus
 * first-touch attribution held in sessionStorage.
 *
 * Precedence: explicit params on the incoming URL always win over stored
 * first-touch values (an explicit ?utm_source=x is a deliberate override).
 *
 * Passthrough of stored first-touch UTMs/gclid is ON BY DEFAULT. Callers may
 * opt out with ?utm_passthrough=0. It was previously opt-in via
 * ?utm_passthrough=1, which only the landers set - every generic CTA linking to
 * a bare /fun-dive-booking silently dropped the gclid, and DiveOS recorded 390
 * leads all-time with zero attribution. Defaulting to ON means a newly added
 * CTA cannot regress attribution by forgetting a magic param.
 *
 * Emitted contract (all params optional, flat, string-valued):
 *   product, date, utm_source, utm_medium, utm_campaign, utm_content,
 *   utm_term, gclid
 * `utm_passthrough` is a parent-side control flag and is never forwarded.
 */
export function buildWizardIframeSrc(search: string, baseUrl = LEAD_FORM_URL): string {
  const incoming = new URLSearchParams(search);
  const out = new URLSearchParams();

  const product = incoming.get("product");
  if (product) out.set("product", product);
  const date = incoming.get("date");
  if (date) out.set("date", date);

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
  if (incoming.get("utm_passthrough") !== "0") {
    const utm = getStoredUtm();
    const utmMap: Record<string, string | undefined> = {
      utm_source: utm.source,
      utm_medium: utm.medium,
      utm_campaign: utm.campaign,
      utm_content: utm.content,
      utm_term: utm.term,
    };
    for (const [key, value] of Object.entries(utmMap)) {
      if (value && !out.has(key)) out.set(key, value);
    }
    const storedGclid = getStoredGclid();
    if (storedGclid && !out.has("gclid")) out.set("gclid", storedGclid);
  }

  const qs = out.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
}
