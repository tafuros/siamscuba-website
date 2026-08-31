// Vercel serverless function (Node runtime): GET /api/rates
//
// Display-only FX rates, base THB. The shop charges in Thai Baht and nothing
// here ever changes that - see src/lib/currency.ts for the full rule. This
// endpoint exists so the site can show an INDICATIVE second number next to a
// Baht price tag without every visitor's browser calling a third-party API.
//
// WHY AN ENDPOINT AND NOT A CLIENT-SIDE FETCH
// Three reasons, in order of weight:
//   1. Cache. The response is CDN-cached by Vercel (see CACHE_CONTROL), so the
//      upstream provider is hit a handful of times a day IN TOTAL, not once per
//      visitor. Free FX tiers have request ceilings; this makes traffic
//      irrelevant to them. Same mechanism already used for /api/info.json.
//   2. Failover. Two independent providers, tried in order, on the server. A
//      browser doing this would double its own latency on every miss.
//   3. Content-blockers. A direct call to an FX domain is exactly the shape
//      tracker blockers kill; a same-origin /api/rates is not.
//
// WHY NO CRON AND NO STORAGE
// stale-while-revalidate does the whole job: the CDN keeps serving the last
// good copy while it refreshes in the background, so a visitor never waits on
// the upstream and a provider outage degrades to slightly stale numbers rather
// than to no numbers. Rates for a display converter do not need to be fresher
// than this - both providers only publish once a day anyway.
//
// getRates is exported so vite.config.ts can serve the identical logic on the
// dev + preview servers without `vercel dev` (same pattern as api/pulse.ts).

import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * The currencies the site offers. Kept deliberately short - this list is
 * rendered in a dropdown on a phone, and every extra row costs more than the
 * long tail is worth. Chosen to cover the site's four languages plus the dive
 * market: en -> USD/GBP, he -> ILS, es + fr -> EUR, and AUD for the Australian
 * traffic Koh Tao gets year-round.
 *
 * MUST stay in sync with DISPLAY_CURRENCIES in src/lib/currency.ts. The test
 * src/test/currency.test.ts asserts that, so a currency added on one side and
 * forgotten on the other fails CI instead of silently rendering a blank rate.
 */
export const RATE_SYMBOLS = ["USD", "EUR", "GBP", "ILS", "AUD"] as const;

export type RateSymbol = (typeof RATE_SYMBOLS)[number];

export type RatesPayload = {
  /** Always "THB". The base is not configurable - it is what the shop charges. */
  base: "THB";
  /** 1 THB expressed in each currency. */
  rates: Record<RateSymbol, number>;
  /** ISO date the upstream published these rates. */
  date: string;
  /** Which provider answered, for debugging a suspicious number. */
  source: "ecb" | "erapi";
};

// 6h fresh, then a full day of serving-while-revalidating. Both providers
// publish daily, so a shorter max-age would only add cache misses, and a longer
// stale window keeps prices rendering through a provider outage.
const CACHE_CONTROL = "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400";

const UPSTREAM_TIMEOUT_MS = 4000;

const fetchJson = async (url: string): Promise<unknown> => {
  // AbortSignal.timeout would be terser but is not available on every runtime
  // this file has to survive (it is also loaded by the Vite dev server).
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`upstream_${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Reject anything that is not a usable positive, finite rate.
 *
 * A provider that returns null, 0, or a string for one symbol would otherwise
 * render "≈ $0" or "≈ $NaN" on a price tag, which is worse than showing no
 * conversion at all. One bad symbol fails the whole provider so the fallback
 * gets its turn.
 */
const readRates = (raw: unknown): Record<RateSymbol, number> => {
  const table = (raw ?? {}) as Record<string, unknown>;
  const out = {} as Record<RateSymbol, number>;
  for (const symbol of RATE_SYMBOLS) {
    const value = table[symbol];
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
      throw new Error(`bad_rate:${symbol}`);
    }
    out[symbol] = value;
  }
  return out;
};

/**
 * Primary: the ECB reference rates via Frankfurter. Open data, no key, no
 * attribution requirement, and the rates are the ones European banks quote.
 *
 * The ECB does not publish on weekends or Target holidays, so `date` can be up
 * to three days old. That is correct behaviour, not staleness to work around -
 * it is the last real published rate.
 */
const fromEcb = async (): Promise<RatesPayload> => {
  const data = (await fetchJson(
    `https://api.frankfurter.dev/v1/latest?base=THB&symbols=${RATE_SYMBOLS.join(",")}`,
  )) as { date?: string; rates?: unknown };
  return {
    base: "THB",
    rates: readRates(data.rates),
    date: typeof data.date === "string" ? data.date : new Date().toISOString().slice(0, 10),
    source: "ecb",
  };
};

/**
 * Fallback: exchangerate-api's open endpoint. No key, updates daily, and
 * covers 160 currencies - so it also answers on a day the ECB feed is down.
 */
const fromErApi = async (): Promise<RatesPayload> => {
  const data = (await fetchJson("https://open.er-api.com/v6/latest/THB")) as {
    result?: string;
    rates?: unknown;
    time_last_update_utc?: string;
  };
  if (data.result !== "success") throw new Error("erapi_not_success");
  const published = data.time_last_update_utc ? new Date(data.time_last_update_utc) : new Date();
  return {
    base: "THB",
    rates: readRates(data.rates),
    date: (Number.isNaN(published.getTime()) ? new Date() : published).toISOString().slice(0, 10),
    source: "erapi",
  };
};

/**
 * Rates from the first provider that answers with a complete, sane table.
 *
 * Throws when BOTH fail. There is deliberately no hardcoded fallback table: a
 * baked-in rate would be silently wrong forever, and a wrong conversion on a
 * price is worse than no conversion. The client hides the currency picker
 * entirely when this endpoint gives it nothing.
 */
export async function getRates(): Promise<RatesPayload> {
  try {
    return await fromEcb();
  } catch (ecbErr) {
    try {
      return await fromErApi();
    } catch (erErr) {
      const detail = [ecbErr, erErr]
        .map((e) => (e instanceof Error ? e.message : String(e)))
        .join(" / ");
      throw new Error(`all_providers_failed: ${detail}`);
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "method_not_allowed" }));
  }
  try {
    const rates = await getRates();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", CACHE_CONTROL);
    return res.end(JSON.stringify(rates));
  } catch (err) {
    console.error("[/api/rates]", err instanceof Error ? err.message : String(err));
    res.statusCode = 502;
    // Short negative cache: an outage should not stampede the providers, but it
    // also must not pin a failure in the CDN for hours after they recover.
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=120");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify({ error: "rates_unavailable" }));
  }
}
