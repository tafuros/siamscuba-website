/**
 * Sync campaign budgets in Google Ads to match scripts/campaign-data.ts.
 *
 * Reads each of the 3 campaigns from the live account, finds its attached
 * budget, and updates the amount to match `dailyBudgetThb` in campaign-data.ts.
 *
 * Run: bun run scripts/sync-budgets.ts
 *
 * Flags: --dry-run     Print planned operations only.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { CAMPAIGNS } from "./campaign-data";

const ENV_FILE = join(import.meta.dir, "..", ".env.local");
const DRY_RUN = process.argv.includes("--dry-run");

if (!existsSync(ENV_FILE)) {
  console.error(".env.local not found.");
  process.exit(1);
}

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

const targetNames = CAMPAIGNS.map((c) => c.name);

console.log(`Querying current budgets for: ${targetNames.join(", ")}\n`);

const rows: any[] = await customer.query(`
  SELECT campaign.name, campaign_budget.resource_name, campaign_budget.amount_micros
  FROM campaign
  WHERE campaign.name IN ('${targetNames.join("','")}')
`);

const updates: { campaign_budget_resource: string; new_micros: number; campaign_name: string; old_thb: number; new_thb: number }[] = [];

for (const c of CAMPAIGNS) {
  const row = rows.find((r) => r.campaign.name === c.name);
  if (!row) {
    console.error(`Campaign "${c.name}" not found in account.`);
    continue;
  }
  const currentMicros = Number(row.campaign_budget.amount_micros);
  const newMicros = c.dailyBudgetThb * 1_000_000;
  const oldThb = currentMicros / 1_000_000;
  if (currentMicros === newMicros) {
    console.log(`SKIP "${c.name}": already at ${oldThb} THB/day`);
    continue;
  }
  updates.push({
    campaign_budget_resource: row.campaign_budget.resource_name,
    new_micros: newMicros,
    campaign_name: c.name,
    old_thb: oldThb,
    new_thb: c.dailyBudgetThb,
  });
  console.log(`PLAN "${c.name}": ${oldThb} -> ${c.dailyBudgetThb} THB/day (${row.campaign_budget.resource_name})`);
}

if (updates.length === 0) {
  console.log("\nNo changes needed.");
  process.exit(0);
}

if (DRY_RUN) {
  console.log("\nDRY RUN - no changes applied.");
  process.exit(0);
}

const ops = updates.map((u) => ({
  resource_name: u.campaign_budget_resource,
  amount_micros: u.new_micros,
}));

console.log(`\nApplying ${ops.length} budget update(s)...`);
const res = await customer.campaignBudgets.update(ops);
console.log(`Updated ${res.results.length} budget(s).`);
for (const u of updates) {
  console.log(`  - ${u.campaign_name}: ${u.old_thb} -> ${u.new_thb} THB/day`);
}
