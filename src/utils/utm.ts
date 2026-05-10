export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  firstTouch?: number;
}

const STORAGE_KEY = "siam_utm";
const KEYS: (keyof UtmParams)[] = ["source", "medium", "campaign", "content", "term"];

// First-touch wins: scoped to sessionStorage so a new tab is correctly attributed.
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
  if (sessionStorage.getItem(STORAGE_KEY)) return;
  found.firstTouch = Date.now();
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}

export function clearStoredUtm(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
