export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  firstTouch?: number;
}

/** Google click ids. A paid click carries exactly ONE of these, never several. */
export type ClickIdName = "gclid" | "wbraid" | "gbraid";

export type ClickIds = Partial<Record<ClickIdName, string>>;

const STORAGE_KEY = "siam_utm";

/**
 * Storage keys for the three click ids.
 *
 * `gclid` is the classic Google Ads click id. `wbraid` (web-to-app) and
 * `gbraid` (app-to-web) are its iOS/privacy-safe counterparts: when Google
 * cannot set a gclid it sends one of these INSTEAD, so a click carrying a
 * wbraid has no gclid at all. Reading only `gclid` therefore files every
 * iPhone ad click as organic - which is exactly the leak that makes the club
 * pay a commission on an ad it already bought.
 *
 * DiveOS already treats all three as paid markers (backend isPaidAttribution)
 * and already forwards all three through its own redirect hop
 * (backend leadFormUrl.ts FORWARDED_PARAMS), so the classification works
 * end-to-end the moment this site stops dropping them.
 */
const CLICK_ID_KEYS: Record<ClickIdName, string> = {
  gclid: "siam_gclid",
  wbraid: "siam_wbraid",
  gbraid: "siam_gbraid",
};

export const CLICK_ID_NAMES = Object.keys(CLICK_ID_KEYS) as ClickIdName[];

const KEYS: (keyof UtmParams)[] = ["source", "medium", "campaign", "content", "term"];

/**
 * How long the localStorage mirror stays valid, in ms.
 *
 * 30 days = Google Ads' default click-attribution window, so the site holds an
 * ad click for exactly as long as Google is still willing to credit it.
 */
export const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Suffix for the long-term (TTL-stamped) localStorage mirror of a session key. */
const LT_SUFFIX = "_lt";

/**
 * WHY THERE ARE TWO STORES.
 *
 * Attribution used to live in sessionStorage ONLY, which dies with the tab. A
 * visitor who clicked an ad on Monday and came back to book on Wednesday
 * arrived carrying nothing, so the booking was recorded as organic - and since
 * organic bookings pay a commission, the club paid for a lead its own ad spend
 * had already bought.
 *
 * So sessionStorage is mirrored into localStorage with a TTL:
 *
 *   sessionStorage  - unchanged, raw values, authoritative for THIS tab.
 *   localStorage    - `<key>_lt`, a JSON envelope {v, e} carrying an expiry.
 *
 * The two formats are deliberately different and live under different key
 * names, so a value can never be read out of the wrong store by accident, and
 * a visitor mid-session when this shipped keeps the session value they already
 * had.
 *
 * EVERY access is wrapped: Safari private mode throws on the mere act of
 * touching storage, and an attribution read must never be able to break a
 * booking.
 */
interface Envelope {
  /** The stored value. */
  v: unknown;
  /** Expiry, epoch ms. */
  e: number;
}

function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* private mode, or quota - attribution is never worth throwing over */
  }
}

/** Read the mirror, honouring the TTL. An expired entry is dropped on sight. */
function readMirror(key: string): unknown {
  try {
    const raw = localStorage.getItem(key + LT_SUFFIX);
    if (!raw) return null;
    const env = JSON.parse(raw) as Envelope | null;
    if (!env || typeof env.e !== "number") return null;
    if (Date.now() > env.e) {
      try {
        localStorage.removeItem(key + LT_SUFFIX);
      } catch {
        /* ignore */
      }
      return null;
    }
    return env.v ?? null;
  } catch {
    return null;
  }
}

function writeMirror(key: string, value: unknown): void {
  try {
    const env: Envelope = { v: value, e: Date.now() + ATTRIBUTION_TTL_MS };
    localStorage.setItem(key + LT_SUFFIX, JSON.stringify(env));
  } catch {
    /* ignore */
  }
}

function clearBoth(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  try {
    localStorage.removeItem(key + LT_SUFFIX);
  } catch {
    /* ignore */
  }
}

/**
 * Capture the click ids off the landing URL.
 *
 * FIRST-TOUCH RULE. The gate is SESSION-scoped, not mirror-scoped:
 *   - a click id already held for THIS tab is never overwritten (unchanged
 *     behaviour - first touch wins for the whole visit);
 *   - a visit that carries NO click id never overwrites anything, so returning
 *     traffic keeps whatever the mirror still holds;
 *   - a TAGGED visit in a fresh session is a genuinely new ad click, so it
 *     becomes the new first touch and refreshes the 30-day window. Anything
 *     else would let a 29-day-old click mask the ad that actually paid for
 *     today's visit.
 */
export function captureClickIdsFromUrl(): void {
  if (typeof window === "undefined") return;
  const sp = new URLSearchParams(window.location.search);

  const found: ClickIds = {};
  let any = false;
  for (const name of CLICK_ID_NAMES) {
    const v = sp.get(name);
    if (v) {
      found[name] = v;
      any = true;
    }
  }
  if (!any) return;

  // One gate for the trio: a single click produces a single id, so if this tab
  // already holds any of them the click has already been captured.
  for (const name of CLICK_ID_NAMES) {
    if (readSession(CLICK_ID_KEYS[name])) return;
  }

  for (const name of CLICK_ID_NAMES) {
    const value = found[name];
    if (!value) continue;
    writeSession(CLICK_ID_KEYS[name], value);
    writeMirror(CLICK_ID_KEYS[name], value);
  }
}

/** Every click id we still hold: this tab first, then the non-expired mirror. */
export function getStoredClickIds(): ClickIds {
  if (typeof window === "undefined") return {};
  const out: ClickIds = {};
  for (const name of CLICK_ID_NAMES) {
    const key = CLICK_ID_KEYS[name];
    const session = readSession(key);
    if (session) {
      out[name] = session;
      continue;
    }
    const mirrored = readMirror(key);
    if (typeof mirrored === "string" && mirrored) out[name] = mirrored;
  }
  return out;
}

export function getStoredGclid(): string | null {
  return getStoredClickIds().gclid ?? null;
}

/** True when we hold any Google click id - i.e. this visitor cost money. */
export function hasStoredClickId(): boolean {
  const ids = getStoredClickIds();
  return CLICK_ID_NAMES.some((name) => Boolean(ids[name]));
}

/**
 * Capture the first-touch UTMs off the landing URL.
 *
 * Same first-touch rule as the click ids above: session-scoped gate, untagged
 * visits never overwrite, a tagged visit in a fresh session starts a new
 * first touch and refreshes the mirror's 30-day window.
 */
export function captureUtmFromUrl(): void {
  if (typeof window === "undefined") return;
  const sp = new URLSearchParams(window.location.search);
  const found: UtmParams = {};
  let any = false;
  for (const k of KEYS) {
    const v = sp.get(`utm_${k}`);
    if (v) {
      (found as Record<string, string>)[k] = v;
      any = true;
    }
  }
  if (!any) return;
  if (readSession(STORAGE_KEY)) return;
  found.firstTouch = Date.now();
  writeSession(STORAGE_KEY, JSON.stringify(found));
  writeMirror(STORAGE_KEY, found);
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  const raw = readSession(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as UtmParams;
    } catch {
      /* fall through to the mirror */
    }
  }
  const mirrored = readMirror(STORAGE_KEY);
  if (mirrored && typeof mirrored === "object") return mirrored as UtmParams;
  return {};
}

/** Drop every stored attribution value, in both stores. */
export function clearStoredUtm(): void {
  if (typeof window === "undefined") return;
  clearBoth(STORAGE_KEY);
  for (const name of CLICK_ID_NAMES) clearBoth(CLICK_ID_KEYS[name]);
}
