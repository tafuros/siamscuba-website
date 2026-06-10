// Vercel serverless function (Node runtime): GET /api/pulse
// Read-only Google Ads "business pulse" for Siam Scuba (customer 9777858115).
// Consumed by Ben's morning-briefing / the Tafuros Ops MCP server so the
// Google Ads refresh token lives only here + in Vercel, not on local machines.
//
// Auth: header `x-pulse-secret` must equal process.env.PULSE_READ_SECRET.
//   - 503 if PULSE_READ_SECRET is unset (endpoint not configured)
//   - 401 on missing / mismatched header
//
// Runtime note: this MUST run on the Vercel Node runtime (NOT Edge/Deno) -
// google-ads-api uses gRPC + Node built-ins. google-ads-api is a real
// `dependencies` entry, so Vercel traces and bundles it (same mechanism that
// ships @anthropic-ai/sdk in api/chat.ts).
//
// getPulse is exported so the Vite dev middleware (vite.config.ts) can reuse the
// exact same logic locally without `vercel dev`.

import type { VercelRequest, VercelResponse } from "@vercel/node";

const CUSTOMER_ID = "9777858115"; // Siam Scuba Google Ads account

export type PulseBucket = { cost: number; clicks: number; conv: number };
export type Pulse = {
  yesterday: PulseBucket;
  last7d: PulseBucket;
  currency: "THB";
  generated_at: string;
};

type Creds = {
  client_id?: string;
  client_secret?: string;
  developer_token?: string;
  customer_id?: string;
  login_customer_id?: string;
  refresh_token?: string;
};

// Resolve the 6 Google Ads creds from the given env bag (process.env in prod,
// Vite's loaded env in dev). CUSTOMER_ID is hard-pinned to the Siam Scuba
// account but falls back to the env value if present.
function creds(env: Record<string, string | undefined>): Creds {
  return {
    client_id: env.GOOGLE_ADS_CLIENT_ID,
    client_secret: env.GOOGLE_ADS_CLIENT_SECRET,
    developer_token: env.GOOGLE_ADS_DEVELOPER_TOKEN,
    customer_id: env.GOOGLE_ADS_CUSTOMER_ID || CUSTOMER_ID,
    login_customer_id: env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    refresh_token: env.GOOGLE_ADS_REFRESH_TOKEN,
  };
}

function missingCreds(c: Creds): string[] {
  return Object.entries({
    GOOGLE_ADS_CLIENT_ID: c.client_id,
    GOOGLE_ADS_CLIENT_SECRET: c.client_secret,
    GOOGLE_ADS_DEVELOPER_TOKEN: c.developer_token,
    GOOGLE_ADS_CUSTOMER_ID: c.customer_id,
    GOOGLE_ADS_LOGIN_CUSTOMER_ID: c.login_customer_id,
    GOOGLE_ADS_REFRESH_TOKEN: c.refresh_token,
  })
    .filter(([, v]) => !v)
    .map(([k]) => k);
}

// Pull + sum spend/clicks/conversions for one date range. cost_micros / 1e6 = THB.
// Dynamic import keeps the heavy gRPC client off the module-load path until a
// real (authorized) request comes in.
export async function getPulse(
  env: Record<string, string | undefined>,
): Promise<Pulse> {
  const c = creds(env);
  const missing = missingCreds(c);
  if (missing.length) {
    throw new Error(`missing_creds:${missing.join(",")}`);
  }

  const { GoogleAdsApi } = await import("google-ads-api");
  const client = new GoogleAdsApi({
    client_id: c.client_id!,
    client_secret: c.client_secret!,
    developer_token: c.developer_token!,
  });
  const customer = client.Customer({
    customer_id: c.customer_id!,
    login_customer_id: c.login_customer_id!,
    refresh_token: c.refresh_token!,
  });

  async function bucket(range: "YESTERDAY" | "LAST_7_DAYS"): Promise<PulseBucket> {
    const rows = await customer.query(`
      SELECT metrics.clicks, metrics.cost_micros, metrics.conversions
      FROM campaign
      WHERE segments.date DURING ${range} AND campaign.status != 'REMOVED'
    `);
    let cost = 0;
    let clicks = 0;
    let conv = 0;
    for (const r of rows as any[]) {
      cost += Number(r.metrics?.cost_micros || 0);
      clicks += Number(r.metrics?.clicks || 0);
      conv += Number(r.metrics?.conversions || 0);
    }
    return {
      cost: Math.round((cost / 1e6) * 100) / 100,
      clicks,
      conv: Math.round(conv * 100) / 100,
    };
  }

  const [yesterday, last7d] = await Promise.all([
    bucket("YESTERDAY"),
    bucket("LAST_7_DAYS"),
  ]);

  return {
    yesterday,
    last7d,
    currency: "THB",
    generated_at: new Date().toISOString(),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const secret = process.env.PULSE_READ_SECRET;
  if (!secret) {
    // Endpoint not configured - fail closed.
    return res.status(503).json({ error: "pulse_not_configured" });
  }

  const provided = req.headers["x-pulse-secret"];
  const got = Array.isArray(provided) ? provided[0] : provided;
  if (got !== secret) {
    return res.status(401).json({ error: "unauthorized" });
  }

  try {
    const pulse = await getPulse(process.env);
    // Read-only data; let the briefing cache briefly, never let a CDN serve it
    // to anyone without the secret.
    res.setHeader("Cache-Control", "private, max-age=300");
    return res.status(200).json(pulse);
  } catch (err: any) {
    const msg = err?.message || String(err);
    console.error("[api/pulse]", msg);
    if (msg.startsWith("missing_creds:")) {
      return res.status(503).json({ error: "pulse_not_configured" });
    }
    return res.status(502).json({ error: "pulse_upstream_failed" });
  }
}
