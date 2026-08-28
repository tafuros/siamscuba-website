/**
 * Remove the 3 SiamScuba Search campaigns + their budgets, for a clean rebuild.
 *
 * Only touches campaigns whose name is exactly in scripts/campaign-data.ts CAMPAIGNS.
 * Other campaigns in the account are never queried or modified.
 *
 * Modes:
 *   --dry-run   List what would be removed; no mutations.
 *   (default)   Remove campaigns, then their budgets.
 *
 * Run:
 *   bun run scripts/delete-campaigns.ts --dry-run
 *   bun run scripts/delete-campaigns.ts
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { CAMPAIGNS } from "./campaign-data";

const ROOT = join(import.meta.dir, "..");
const ENV_FILE = join(ROOT, ".env.local");
const DRY_RUN = process.argv.includes("--dry-run");

function loadEnv(): Record<string, string> {
  if (!existsSync(ENV_FILE)) {
    console.error(`.env.local not found at ${ENV_FILE}`);
    process.exit(1);
  }
  const out: Record<string, string> = {};
  for (const line of readFileSync(ENV_FILE, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = loadEnv();
const filter = process.argv.slice(2).find((a) => !a.startsWith("--"));
const names = CAMPAIGNS.map((c) => c.name).filter((n) => !filter || n.includes(filter));

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

console.log(`Connected to customer ${env.GOOGLE_ADS_CUSTOMER_ID} (via MCC ${env.GOOGLE_ADS_LOGIN_CUSTOMER_ID}).`);
console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE REMOVE"}\n`);

const rows: any[] = await customer.query(`
  SELECT campaign.resource_name, campaign.name, campaign.id, campaign.status, campaign.campaign_budget
  FROM campaign
  WHERE campaign.name IN ('${names.join("','")}') AND campaign.status != 'REMOVED'
`);

if (rows.length === 0) {
  console.log("No matching campaigns found - nothing to remove. (Account is already clean.)");
  process.exit(0);
}

const campaignResources: string[] = [];
const budgetResources: string[] = [];

for (const r of rows) {
  const status = r.campaign.status; // 2 = ENABLED, 3 = PAUSED, 4 = REMOVED (enum)
  console.log(`  - ${r.campaign.name} (id=${r.campaign.id}, status=${status})`);
  campaignResources.push(r.campaign.resource_name);
  if (r.campaign.campaign_budget) budgetResources.push(r.campaign.campaign_budget);
}

if (DRY_RUN) {
  console.log(`\nWould remove ${campaignResources.length} campaign(s) and ${budgetResources.length} budget(s). No changes made.`);
  process.exit(0);
}

console.log(`\nRemoving ${campaignResources.length} campaign(s)...`);
await customer.campaigns.remove(campaignResources);
console.log("  campaigns removed.");

if (budgetResources.length) {
  console.log(`Removing ${budgetResources.length} budget(s)...`);
  await customer.campaignBudgets.remove(budgetResources);
  console.log("  budgets removed.");
}

console.log("\nDone. Account is ready for a clean rebuild (bun run scripts/create-campaigns.ts).");
