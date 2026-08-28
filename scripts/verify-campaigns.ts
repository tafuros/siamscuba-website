/**
 * Verify the 3 SiamScuba campaigns exist in Google Ads with the expected
 * shape: 3 campaigns Paused, 9 ad groups Paused, 88 keywords, 9 RSAs,
 * 1 shared negative list linked to all 3, sitelinks/callouts/snippets present.
 *
 * Run: bun run scripts/verify-campaigns.ts
 *
 * Exits non-zero if any expected entity is missing.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import {
  AD_GROUPS,
  CALLOUTS,
  CAMPAIGNS,
  KEYWORDS,
  NEGATIVE_SHARED_SET_NAME,
  RSAS,
  SITELINKS,
} from "./campaign-data";

const ENV_FILE = join(import.meta.dir, "..", ".env.local");

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

const CAMPAIGN_NAMES = CAMPAIGNS.map((c) => c.name);
const failures: string[] = [];

function fail(msg: string) {
  failures.push(msg);
  console.log(`  ✗ ${msg}`);
}

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

console.log("Querying campaigns...");
const campaignRows: any[] = await customer.query(`
  SELECT campaign.id, campaign.name, campaign.status, campaign_budget.amount_micros
  FROM campaign
  WHERE campaign.name IN ('${CAMPAIGN_NAMES.join("','")}')
`);

for (const expected of CAMPAIGNS) {
  const found = campaignRows.find((r) => r.campaign.name === expected.name);
  if (!found) {
    fail(`Campaign missing: ${expected.name}`);
    continue;
  }
  ok(`Campaign present: ${expected.name} (id=${found.campaign.id}, status=${found.campaign.status})`);
  if (String(found.campaign.status) !== "3" /* PAUSED */) {
    fail(`Campaign ${expected.name} status is ${found.campaign.status}, expected PAUSED(3)`);
  }
  const expectedMicros = expected.dailyBudgetThb * 1_000_000;
  if (Number(found.campaign_budget.amount_micros) !== expectedMicros) {
    fail(`Campaign ${expected.name} budget=${found.campaign_budget.amount_micros} micros, expected ${expectedMicros}`);
  }
}

console.log("\nQuerying ad groups...");
const adGroupRows: any[] = await customer.query(`
  SELECT ad_group.id, ad_group.name, ad_group.status, campaign.name
  FROM ad_group
  WHERE campaign.name IN ('${CAMPAIGN_NAMES.join("','")}')
`);

for (const expected of AD_GROUPS) {
  const found = adGroupRows.find((r) => r.ad_group.name === expected.adGroup && r.campaign.name === expected.campaign);
  if (!found) {
    fail(`AdGroup missing: ${expected.adGroup} (under ${expected.campaign})`);
    continue;
  }
  ok(`AdGroup present: ${expected.adGroup}`);
}

console.log("\nQuerying keywords...");
const kwRows: any[] = await customer.query(`
  SELECT ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type
  FROM keyword_view
  WHERE campaign.name IN ('${CAMPAIGN_NAMES.join("','")}')
`);

let totalExpectedKw = 0;
for (const g of AD_GROUPS) {
  const kw = KEYWORDS[g.adGroup];
  const expectedCount = kw.phrase.length + kw.exact.length;
  totalExpectedKw += expectedCount;
  const found = kwRows.filter((r) => r.ad_group.name === g.adGroup);
  if (found.length !== expectedCount) {
    fail(`AdGroup ${g.adGroup}: ${found.length} keywords, expected ${expectedCount}`);
  } else {
    ok(`${g.adGroup}: ${found.length}/${expectedCount} keywords`);
  }
}
console.log(`  Total keywords in account: ${kwRows.length} (expected ${totalExpectedKw})`);

console.log("\nQuerying RSAs...");
const rsaRows: any[] = await customer.query(`
  SELECT ad_group.name, ad_group_ad.ad.responsive_search_ad.headlines, ad_group_ad.ad.responsive_search_ad.descriptions
  FROM ad_group_ad
  WHERE campaign.name IN ('${CAMPAIGN_NAMES.join("','")}')
    AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'
`);

for (const r of RSAS) {
  const found = rsaRows.find((row) => row.ad_group.name === r.adGroup);
  if (!found) {
    fail(`RSA missing for ${r.adGroup}`);
    continue;
  }
  const hc = found.ad_group_ad.ad.responsive_search_ad.headlines?.length ?? 0;
  const dc = found.ad_group_ad.ad.responsive_search_ad.descriptions?.length ?? 0;
  if (hc !== r.headlines.length || dc !== r.descriptions.length) {
    fail(`RSA ${r.adGroup}: ${hc} headlines / ${dc} descriptions, expected ${r.headlines.length} / ${r.descriptions.length}`);
  } else {
    ok(`RSA ${r.adGroup}: ${hc} headlines / ${dc} descriptions`);
  }
}

console.log("\nQuerying shared negative list...");
const setRows: any[] = await customer.query(`
  SELECT shared_set.resource_name, shared_set.name, shared_set.member_count
  FROM shared_set
  WHERE shared_set.name = '${NEGATIVE_SHARED_SET_NAME}' AND shared_set.type = 'NEGATIVE_KEYWORDS'
`);
if (setRows.length === 0) {
  fail(`SharedSet "${NEGATIVE_SHARED_SET_NAME}" not found`);
} else {
  ok(`SharedSet present: "${NEGATIVE_SHARED_SET_NAME}" with ${setRows[0].shared_set.member_count} criteria`);
  const setResource = setRows[0].shared_set.resource_name;
  const linkRows: any[] = await customer.query(`
    SELECT campaign.name, campaign_shared_set.shared_set
    FROM campaign_shared_set
    WHERE campaign_shared_set.shared_set = '${setResource}'
  `);
  for (const c of CAMPAIGNS) {
    const linked = linkRows.some((r) => r.campaign.name === c.name);
    if (linked) ok(`SharedSet linked to ${c.name}`);
    else fail(`SharedSet NOT linked to ${c.name}`);
  }
}

console.log("\nQuerying assets (sitelinks/callouts/snippets)...");
const sitelinkRows: any[] = await customer.query(`
  SELECT asset.sitelink_asset.link_text
  FROM asset
  WHERE asset.type = 'SITELINK'
`);
const sitelinkTexts = new Set(sitelinkRows.map((r) => r.asset.sitelink_asset.link_text));
for (const s of SITELINKS) {
  if (sitelinkTexts.has(s.text)) ok(`Sitelink present: "${s.text}"`);
  else fail(`Sitelink missing: "${s.text}"`);
}

const calloutRows: any[] = await customer.query(`
  SELECT asset.callout_asset.callout_text
  FROM asset
  WHERE asset.type = 'CALLOUT'
`);
const calloutTexts = new Set(calloutRows.map((r) => r.asset.callout_asset.callout_text));
for (const c of CALLOUTS) {
  if (calloutTexts.has(c)) ok(`Callout present: "${c}"`);
  else fail(`Callout missing: "${c}"`);
}

console.log("\n=== Result ===");
if (failures.length === 0) {
  console.log("All checks passed.");
  process.exit(0);
} else {
  console.log(`${failures.length} failure(s):`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(2);
}
