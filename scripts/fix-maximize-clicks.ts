/**
 * ONE-TIME authorized change (Ben approved 2026-06-04):
 * Switch the 3 SiamScuba Search campaigns from Target CPA -> Maximize Clicks
 * with a max CPC bid ceiling of THB 30. Does NOT touch the "spanish" PMax.
 *
 * Run: bun run scripts/fix-maximize-clicks.ts
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

const { GoogleAdsApi, enums } = await import("google-ads-api");
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

const CPC_CEILING_MICROS = 30 * 1_000_000; // THB 30

const rows = await customer.query(`
  SELECT campaign.id, campaign.name, campaign.bidding_strategy_type
  FROM campaign
  WHERE campaign.advertising_channel_type = 'SEARCH'
    AND campaign.status != 'REMOVED'
    AND campaign.name LIKE 'SiamScuba_Search_%'
  ORDER BY campaign.name
`);

console.log(`Found ${ (rows as any[]).length } Search campaigns to update:\n`);
const updates = (rows as any[]).map((r) => {
  console.log(`  before: ${r.campaign.name} · bidding_type=${r.campaign.bidding_strategy_type}`);
  return {
    resource_name: `customers/${env.GOOGLE_ADS_CUSTOMER_ID}/campaigns/${r.campaign.id}`,
    target_spend: { cpc_bid_ceiling_micros: CPC_CEILING_MICROS },
  };
});

console.log("\nApplying Maximize Clicks (cpc ceiling THB 30)...");
const res = await customer.campaigns.update(updates);
console.log("  mutate result:", JSON.stringify(res?.results?.map((x: any) => x.resource_name) ?? res));

const after = await customer.query(`
  SELECT campaign.name, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, campaign.status
  FROM campaign
  WHERE campaign.advertising_channel_type = 'SEARCH'
    AND campaign.status != 'REMOVED'
    AND campaign.name LIKE 'SiamScuba_Search_%'
  ORDER BY campaign.name
`);
console.log("\nAFTER (15 = MAXIMIZE_CLICKS / TARGET_SPEND):");
for (const r of after as any[]) {
  const ceil = r.campaign.target_spend?.cpc_bid_ceiling_micros;
  console.log(`  • ${r.campaign.name}: bidding_type=${r.campaign.bidding_strategy_type} · cpc_ceiling=THB ${(Number(ceil||0)/1e6).toFixed(2)}`);
}
console.log("\n=== done ===");
