/**
 * READ-ONLY Google Ads status report for Siam Scuba.
 * Pulls campaign status, bidding strategy, daily budget, last-30-day metrics,
 * and conversion-action recording status. Performs NO mutations.
 *
 * Run: bun run scripts/status-report.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ENV_FILE = join(import.meta.dir, "..", ".env.local");
if (!existsSync(ENV_FILE)) { console.error(".env.local not found."); process.exit(1); }
const env: Record<string, string> = {};
for (const line of readFileSync(ENV_FILE, "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const { GoogleAdsApi } = await import("google-ads-api");
const client = new GoogleAdsApi({
  client_id: env.GOOGLE_ADS_CLIENT_ID,
  client_secret: env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: env.GOOGLE_ADS_DEVELOPER_TOKEN,
});
const customer = client.Customer({
  customer_id: env.GOOGLE_ADS_CUSTOMER_ID,
  login_customer_id: env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
  refresh_token: env.GOOGLE_ADS_REFRESH_TOKEN,
});

const STATUS: Record<string, string> = { "2": "ENABLED", "3": "PAUSED", "4": "REMOVED" };
const thb = (micros: number) => (Number(micros || 0) / 1e6).toFixed(2);

console.log(`\n=== Siam Scuba Google Ads · account ${env.GOOGLE_ADS_CUSTOMER_ID} ===\n`);

// 1) Settings: status, bidding strategy, budget
const settings = await customer.query(`
  SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type,
         campaign.bidding_strategy_type, campaign_budget.amount_micros
  FROM campaign
  WHERE campaign.status != 'REMOVED'
  ORDER BY campaign.name
`);

console.log("CAMPAIGN SETTINGS");
for (const r of settings as any[]) {
  console.log(
    `  • ${r.campaign.name}\n` +
    `      status=${STATUS[String(r.campaign.status)] ?? r.campaign.status}` +
    ` · channel=${r.campaign.advertising_channel_type}` +
    ` · bidding=${r.campaign.bidding_strategy_type}` +
    ` · budget=THB ${thb(r.campaign_budget?.amount_micros)}/day`
  );
}

// 2) Metrics last 30 days
const metrics = await customer.query(`
  SELECT campaign.name, metrics.impressions, metrics.clicks,
         metrics.cost_micros, metrics.conversions
  FROM campaign
  WHERE segments.date DURING LAST_30_DAYS AND campaign.status != 'REMOVED'
  ORDER BY campaign.name
`);
console.log("\nLAST 30 DAYS");
if (!(metrics as any[]).length) console.log("  (no rows / no serving)");
for (const r of metrics as any[]) {
  console.log(
    `  • ${r.campaign.name}: impr=${r.metrics.impressions}` +
    ` · clicks=${r.metrics.clicks} · cost=THB ${thb(r.metrics.cost_micros)}` +
    ` · conv=${r.metrics.conversions}`
  );
}

// 3) Conversion actions - are they recording?
const conv = await customer.query(`
  SELECT conversion_action.name, conversion_action.status,
         conversion_action.type, conversion_action.category
  FROM conversion_action
  WHERE conversion_action.status != 'REMOVED'
  ORDER BY conversion_action.name
`);
console.log("\nCONVERSION ACTIONS");
for (const r of conv as any[]) {
  console.log(`  • ${r.conversion_action.name}: status=${r.conversion_action.status} · type=${r.conversion_action.type}`);
}
console.log("\n=== end (read-only, no changes made) ===\n");
