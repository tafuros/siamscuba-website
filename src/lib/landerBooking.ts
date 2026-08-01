import type { Offer } from "@/lib/landerCopy";

/**
 * Which DiveOS product each campaign lander preselects, and which landers send
 * their primary CTA through the /fun-dive-booking wrapper.
 *
 * This lives outside CampaignLander.tsx so it can be asserted directly. The two
 * bugs it exists to prevent were both SILENT - nothing threw, nothing logged,
 * and the only symptom was money quietly converting worse:
 *
 *   1. A product code that is not in the DiveOS catalog. The wizard resolves
 *      ?product= with a strict equality match and ignores anything it cannot
 *      find, so a typo just yields an empty first activity. `owd` shipped as
 *      "OWD" (real code: "OW") and nobody could see it.
 *   2. A lander with no booking CTA at all. `aow` had both buttons pointing at
 *      WhatsApp - on the second-biggest earner in the business.
 */

/**
 * Exact `Course.code` values from the DiveOS catalog.
 *
 * Source of truth: GET https://dash.siamscuba.com/api/leads/courses-public
 * Any value here MUST appear in DIVEOS_COURSE_CODES below.
 *
 * Offers with no entry open the wizard without a preselect - correct for the
 * dive-site trips, where the departure is chosen inside the wizard.
 */
export const WIZARD_PRODUCT: Partial<Record<Offer, string>> = {
  owd: "OW",
  aow: "AOW",
  dsd: "DSD",
};

/**
 * The live DiveOS course codes, snapshotted 2026-08-01 so the guard test can run
 * offline (CI has no access to the dashboard).
 *
 * To refresh:
 *   curl -s https://dash.siamscuba.com/api/leads/courses-public | jq -r '.data[].code'
 *
 * A code disappearing from DiveOS is a real breakage - the preselect goes back
 * to being a silent no-op - so the test failing on a stale snapshot is the
 * point, not a nuisance.
 */
export const DIVEOS_COURSE_CODES = [
  "ADV",
  "AOW",
  "DEEP",
  "DM",
  "DSD",
  "DSD ED",
  "EFR",
  "FD",
  "GENERAL",
  "IDC",
  "NIGHT DIVE",
  "NITROX",
  "OW",
  "RES",
  "SAILROCK",
  "SIMILAN",
  "SIMILAN_ANDAMAN7",
  "SIMILAN_RICHELIEU5",
  "SIMILAN_SOUTH4",
  "SNK",
  "SR",
  "SR POOL",
  "WRECK",
] as const;

/**
 * Landers whose PRIMARY CTA routes through /fun-dive-booking, where the
 * postMessage -> generate_lead / Purchase tracking lives. Anything false here
 * has WhatsApp as its primary CTA and therefore no client-side conversion
 * signal, so paid traffic cannot be optimised against it.
 */
export function usesBookingWrapper(offer: Offer): boolean {
  return (
    offer === "fun-dive" ||
    offer === "koh-tao" ||
    offer === "dsd" ||
    offer === "owd" ||
    offer === "aow"
  );
}
