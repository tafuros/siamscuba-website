/**
 * Enable (un-pause) the SiamScuba Search campaigns.
 *
 * Run: bun run scripts/enable-campaigns.ts                 # all 3
 *      bun run scripts/enable-campaigns.ts DSD             # only names containing "DSD"
 *      bun run scripts/enable-campaigns.ts --dry-run
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { CAMPAIGNS } from "./campaign-data";

const ROOT = join(import.meta.dir, "..");
const ENV_FILE = join(ROOT, ".env.local");
const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");
const filter = argv.find((a) => !a.startsWith("--"));

function loadEnv(): Record<string, string> {
  if (!existsSync(ENV_FILE)) { console.error(".env.local not found"); process.exit(1); }
  const out: Record<string, string> = {};
  for (const line of readFileSync(ENV_FILE, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}
const env = loadEnv();

const names = CAMPAIGNS.map((c) => c.name).filter((n) => !filter || n.includes(filter));

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

const rows: any[] = await customer.query(`
  SELECT campaign.resource_name, campaign.name, campaign.status
  FROM campaign
  WHERE campaign.name IN ('${names.join("','")}') AND campaign.status != 'REMOVED'
`);

for (const r of rows) {
  console.log(`${DRY_RUN ? "WOULD ENABLE" : "ENABLE"}: ${r.campaign.name} (was status=${r.campaign.status})`);
  if (!DRY_RUN) {
    await customer.campaigns.update([{
      resource_name: r.campaign.resource_name,
      status: enums.CampaignStatus.ENABLED,
    }]);
  }
}

// Ad groups are staged PAUSED by create-campaigns; a campaign only serves when its
// ad groups are ENABLED too. Enable every (non-removed) ad group in these campaigns.
const enabledCampaignNames = rows.map((r: any) => r.campaign.name);
if (enabledCampaignNames.length) {
  const ags: any[] = await customer.query(`
    SELECT ad_group.resource_name, ad_group.name, ad_group.status, campaign.name
    FROM ad_group
    WHERE campaign.name IN ('${enabledCampaignNames.join("','")}')
      AND ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'
  `);
  console.log(`\n${DRY_RUN ? "WOULD ENABLE" : "ENABLE"} ${ags.length} ad group(s).`);
  if (!DRY_RUN && ags.length) {
    await customer.adGroups.update(ags.map((a) => ({
      resource_name: a.ad_group.resource_name,
      status: enums.AdGroupStatus.ENABLED,
    })));
  }
}
console.log(DRY_RUN ? "\nDry run - no changes." : "\nEnabled. Campaigns + ad groups are now LIVE and will start serving.");
