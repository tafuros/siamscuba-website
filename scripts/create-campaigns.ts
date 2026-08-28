/**
 * Create the 3 SiamScuba Search campaigns (Paused) in Google Ads via the API.
 *
 * Reads campaign data from scripts/campaign-data.ts.
 * Reads credentials from .env.local.
 *
 * Modes:
 *   --dry-run     Print planned operations only, no network calls
 *   --mode=create Default; refuses to run if a campaign with the same name already exists
 *   --mode=skip   Skip campaigns/budgets/ad-groups/keywords/RSAs/sets that already exist
 *
 * Run order after .env.local is fully populated:
 *   bun run scripts/create-campaigns.ts --dry-run     # sanity check
 *   bun run scripts/create-campaigns.ts                # live
 *   bun run scripts/verify-campaigns.ts                # confirm
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import {
  AD_GROUPS,
  CALLOUTS,
  CAMPAIGNS,
  KEYWORDS,
  NEGATIVES,
  NEGATIVE_SHARED_SET_NAME,
  RSAS,
  SITELINKS,
  SNIPPET_COURSES,
  SNIPPET_SERVICES,
  type RSA,
} from "./campaign-data";

const ROOT = join(import.meta.dir, "..");
const ENV_FILE = join(ROOT, ".env.local");

// ---------- args ----------

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const MODE = (args.find((a) => a.startsWith("--mode="))?.slice("--mode=".length) ?? "create") as "create" | "skip";

// ---------- env ----------

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

const REQUIRED_ENV = [
  "GOOGLE_ADS_DEVELOPER_TOKEN",
  "GOOGLE_ADS_CLIENT_ID",
  "GOOGLE_ADS_CLIENT_SECRET",
  "GOOGLE_ADS_REFRESH_TOKEN",
  "GOOGLE_ADS_CUSTOMER_ID",
  "GOOGLE_ADS_LOGIN_CUSTOMER_ID",
];

if (!DRY_RUN) {
  const missing = REQUIRED_ENV.filter((k) => !env[k]);
  if (missing.length) {
    console.error(`Missing env vars in .env.local: ${missing.join(", ")}`);
    console.error("See docs/google-ads-dev-token-application.md.");
    process.exit(1);
  }
}

// ---------- dry-run mode (no API client needed) ----------

if (DRY_RUN) {
  console.log("DRY RUN - no API calls will be made.\n");
  console.log("Operations that would be issued:\n");

  // Budgets + Campaigns
  for (const c of CAMPAIGNS) {
    console.log(`CREATE CampaignBudget: name="${c.name} budget", amount=${c.dailyBudgetThb} THB/day (${c.dailyBudgetThb * 1_000_000} micros), DAILY, STANDARD`);
    console.log(`CREATE Campaign: name="${c.name}", type=SEARCH, status=PAUSED, bidding=MAXIMIZE_CONVERSIONS, networks=[google_search, search_partners], display=OFF`);
  }
  console.log("");

  // Ad groups + keywords + RSAs
  for (const g of AD_GROUPS) {
    console.log(`CREATE AdGroup: name="${g.adGroup}", campaign="${g.campaign}", type=SEARCH_STANDARD, status=PAUSED, cpc_bid=10 THB (placeholder, ignored by MaxConv)`);
    const kws = KEYWORDS[g.adGroup];
    for (const k of kws.phrase) console.log(`  CREATE Keyword (Phrase): "${k}"`);
    for (const k of kws.exact)  console.log(`  CREATE Keyword (Exact):  "${k}"`);
    const rsa = RSAS.find((r) => r.adGroup === g.adGroup);
    if (rsa) {
      console.log(`  CREATE RSA: ${rsa.headlines.length} headlines, ${rsa.descriptions.length} descriptions, paths=${rsa.path1}/${rsa.path2}, final_url=${g.finalUrl}`);
    }
  }
  console.log("");

  // Shared negative list
  console.log(`CREATE SharedSet: name="${NEGATIVE_SHARED_SET_NAME}", type=NEGATIVE_KEYWORDS`);
  for (const n of NEGATIVES) console.log(`  CREATE SharedCriterion (Phrase, negative): "${n}"`);
  for (const c of CAMPAIGNS) console.log(`  LINK SharedSet -> campaign "${c.name}"`);
  console.log("");

  // Assets
  for (const s of SITELINKS) console.log(`CREATE Asset (Sitelink): "${s.text}" -> ${s.url}`);
  for (const c of CALLOUTS)  console.log(`CREATE Asset (Callout): "${c}"`);
  console.log(`CREATE Asset (StructuredSnippet Courses): ${SNIPPET_COURSES.join(", ")}`);
  console.log(`CREATE Asset (StructuredSnippet Service catalog): ${SNIPPET_SERVICES.join(", ")}`);
  for (const c of CAMPAIGNS) console.log(`  LINK 4 sitelinks + 8 callouts + 2 snippets -> campaign "${c.name}"`);
  console.log("");

  // Summary counters
  const totalKeywords = AD_GROUPS.reduce((sum, g) => {
    const k = KEYWORDS[g.adGroup];
    return sum + k.phrase.length + k.exact.length;
  }, 0);
  console.log("Summary:");
  console.log(`  ${CAMPAIGNS.length} campaigns + budgets`);
  console.log(`  ${AD_GROUPS.length} ad groups`);
  console.log(`  ${totalKeywords} keywords`);
  console.log(`  ${RSAS.length} RSAs`);
  console.log(`  1 shared negative list (${NEGATIVES.length} terms) linked to ${CAMPAIGNS.length} campaigns`);
  console.log(`  ${SITELINKS.length} sitelinks + ${CALLOUTS.length} callouts + 2 structured snippets linked to ${CAMPAIGNS.length} campaigns`);
  process.exit(0);
}

// ---------- live mode ----------

// Lazy import to avoid loading the heavy SDK in --dry-run.
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

console.log(`Connected to customer ${env.GOOGLE_ADS_CUSTOMER_ID} (via MCC ${env.GOOGLE_ADS_LOGIN_CUSTOMER_ID}).`);
console.log(`Mode: ${MODE}\n`);

const CAMPAIGN_NAMES = CAMPAIGNS.map((c) => c.name);

// Existence check.
const existingCampaigns: { resource_name: string; name: string; id: string }[] = await customer.query(`
  SELECT campaign.resource_name, campaign.name, campaign.id
  FROM campaign
  WHERE campaign.name IN ('${CAMPAIGN_NAMES.join("','")}')
    AND campaign.status != 'REMOVED'
`).then((rows: any[]) => rows.map((r) => ({
  resource_name: r.campaign.resource_name,
  name: r.campaign.name,
  id: String(r.campaign.id),
})));

if (existingCampaigns.length > 0) {
  console.log(`Found ${existingCampaigns.length} pre-existing campaign(s) with our target names:`);
  for (const c of existingCampaigns) console.log(`  - ${c.name} (${c.id})`);
  if (MODE === "create") {
    console.error("\nMode=create refuses to proceed when target campaigns already exist.");
    console.error("Use --mode=skip to skip already-existing entities, or delete them in the UI first.");
    process.exit(1);
  }
}

const existingNames = new Set(existingCampaigns.map((c) => c.name));

// ---------- helpers ----------

const thbToMicros = (thb: number) => thb * 1_000_000;

// Map our string status to the API enum.
const PAUSED = enums.CampaignStatus.PAUSED;
const ENABLED_CRIT = enums.AdGroupCriterionStatus.ENABLED;
const ENABLED_AD = enums.AdGroupAdStatus.ENABLED;
const AG_PAUSED = enums.AdGroupStatus.PAUSED;
const KW_PHRASE = enums.KeywordMatchType.PHRASE;
const KW_EXACT = enums.KeywordMatchType.EXACT;

// ---------- create budgets + campaigns ----------

const campaignResources: Record<string, string> = {}; // campaignName -> resource_name

for (const c of CAMPAIGNS) {
  if (existingNames.has(c.name)) {
    const e = existingCampaigns.find((x) => x.name === c.name)!;
    campaignResources[c.name] = e.resource_name;
    console.log(`SKIP campaign "${c.name}" (already exists, id=${e.id})`);
    continue;
  }

  const { results: [budget] } = await customer.campaignBudgets.create([{
    name: `${c.name} budget`,
    amount_micros: thbToMicros(c.dailyBudgetThb),
    delivery_method: enums.BudgetDeliveryMethod.STANDARD,
    explicitly_shared: false,
  }]);
  console.log(`CREATED CampaignBudget "${c.name} budget" -> ${budget.resource_name}`);

  const { results: [campaign] } = await customer.campaigns.create([{
    name: c.name,
    status: PAUSED,
    advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
    campaign_budget: budget.resource_name,
    maximize_conversions: {},
    network_settings: {
      target_google_search: true,
      target_search_network: true,
      target_content_network: false,
      target_partner_search_network: false,
    },
    contains_eu_political_advertising: enums.EuPoliticalAdvertisingStatus.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING,
  }]);
  campaignResources[c.name] = campaign.resource_name;
  console.log(`CREATED Campaign "${c.name}" -> ${campaign.resource_name}`);
}

// ---------- ad groups + keywords + RSAs ----------

const adGroupResources: Record<string, string> = {}; // adGroupName -> resource_name

// Look up existing ad groups in our 3 campaigns (in case of partial prior run).
const existingAdGroups = await customer.query(`
  SELECT ad_group.resource_name, ad_group.name, ad_group.campaign
  FROM ad_group
  WHERE ad_group.name IN ('${AD_GROUPS.map((g) => g.adGroup).join("','")}')
    AND ad_group.status != 'REMOVED'
    AND campaign.status != 'REMOVED'
`).then((rows: any[]) => rows.map((r) => ({
  resource_name: r.ad_group.resource_name,
  name: r.ad_group.name,
})));
const existingAdGroupNames = new Set(existingAdGroups.map((a) => a.name));

for (const g of AD_GROUPS) {
  if (existingAdGroupNames.has(g.adGroup) && MODE === "skip") {
    const e = existingAdGroups.find((a) => a.name === g.adGroup)!;
    adGroupResources[g.adGroup] = e.resource_name;
    console.log(`SKIP ad group "${g.adGroup}" (already exists)`);
    continue;
  }

  const campaignResource = campaignResources[g.campaign];
  if (!campaignResource) {
    throw new Error(`No campaign resource for ${g.campaign}; cannot create ad group ${g.adGroup}.`);
  }

  const { results: [ag] } = await customer.adGroups.create([{
    name: g.adGroup,
    campaign: campaignResource,
    type: enums.AdGroupType.SEARCH_STANDARD,
    status: AG_PAUSED,
    cpc_bid_micros: thbToMicros(10),
  }]);
  adGroupResources[g.adGroup] = ag.resource_name;
  console.log(`CREATED AdGroup "${g.adGroup}" -> ${ag.resource_name}`);

  // Keywords for this ad group.
  const kws = KEYWORDS[g.adGroup];
  const kwOps = [
    ...kws.phrase.map((k) => ({
      ad_group: ag.resource_name,
      status: ENABLED_CRIT,
      keyword: { text: k, match_type: KW_PHRASE },
    })),
    ...kws.exact.map((k) => ({
      ad_group: ag.resource_name,
      status: ENABLED_CRIT,
      keyword: { text: k, match_type: KW_EXACT },
    })),
  ];
  if (kwOps.length) {
    await customer.adGroupCriteria.create(kwOps);
    console.log(`  + ${kwOps.length} keywords`);
  }

  // RSA for this ad group.
  const rsa = RSAS.find((r) => r.adGroup === g.adGroup);
  if (rsa) {
    await customer.adGroupAds.create([{
      ad_group: ag.resource_name,
      status: ENABLED_AD,
      ad: {
        final_urls: [g.finalUrl],
        responsive_search_ad: {
          headlines: rsa.headlines.map((text) => ({ text })),
          descriptions: rsa.descriptions.map((text) => ({ text })),
          path1: rsa.path1 ?? "",
          path2: rsa.path2 ?? "",
        },
      },
    }]);
    console.log(`  + 1 RSA (${rsa.headlines.length} headlines, ${rsa.descriptions.length} descriptions)`);
  }
}

// ---------- shared negative keyword list ----------

let sharedSetResource: string | null = null;

const existingSets = await customer.query(`
  SELECT shared_set.resource_name, shared_set.name, shared_set.type
  FROM shared_set
  WHERE shared_set.name = '${NEGATIVE_SHARED_SET_NAME}' AND shared_set.type = 'NEGATIVE_KEYWORDS'
`).then((rows: any[]) => rows.map((r) => r.shared_set.resource_name as string));

if (existingSets.length > 0) {
  sharedSetResource = existingSets[0];
  console.log(`\nSKIP SharedSet "${NEGATIVE_SHARED_SET_NAME}" (already exists)`);
} else {
  const { results: [set] } = await customer.sharedSets.create([{
    name: NEGATIVE_SHARED_SET_NAME,
    type: enums.SharedSetType.NEGATIVE_KEYWORDS,
  }]);
  sharedSetResource = set.resource_name;
  console.log(`\nCREATED SharedSet "${NEGATIVE_SHARED_SET_NAME}" -> ${set.resource_name}`);

  await customer.sharedCriteria.create(
    NEGATIVES.map((n) => ({
      shared_set: set.resource_name,
      keyword: { text: n, match_type: KW_PHRASE },
    }))
  );
  console.log(`  + ${NEGATIVES.length} negative criteria`);
}

// Link shared set to each of our campaigns (idempotent: link only if not present).
const existingLinks = await customer.query(`
  SELECT campaign_shared_set.shared_set, campaign_shared_set.campaign
  FROM campaign_shared_set
  WHERE campaign_shared_set.shared_set = '${sharedSetResource}'
`).then((rows: any[]) => new Set(rows.map((r) => r.campaign_shared_set.campaign as string)));

const linkOps = Object.values(campaignResources)
  .filter((res) => !existingLinks.has(res))
  .map((campaign) => ({ campaign, shared_set: sharedSetResource! }));

if (linkOps.length) {
  await customer.campaignSharedSets.create(linkOps);
  console.log(`  + linked SharedSet to ${linkOps.length} campaign(s)`);
} else {
  console.log("  SharedSet already linked to all 3 campaigns");
}

// ---------- assets (sitelinks / callouts / structured snippets) ----------

const assetResources: { sitelinks: string[]; callouts: string[]; snippets: string[] } = {
  sitelinks: [],
  callouts: [],
  snippets: [],
};

console.log("\nCreating account-level assets...");

// Sitelinks
for (const s of SITELINKS) {
  const { results: [asset] } = await customer.assets.create([{
    sitelink_asset: {
      link_text: s.text,
      description1: s.d1,
      description2: s.d2,
    },
    final_urls: [s.url],
  }]);
  assetResources.sitelinks.push(asset.resource_name);
  console.log(`  CREATED Sitelink asset "${s.text}" -> ${asset.resource_name}`);
}

// Callouts
for (const c of CALLOUTS) {
  const { results: [asset] } = await customer.assets.create([{
    callout_asset: { callout_text: c },
  }]);
  assetResources.callouts.push(asset.resource_name);
}
console.log(`  + ${CALLOUTS.length} Callout assets`);

// Structured snippets
const { results: [coursesAsset] } = await customer.assets.create([{
  structured_snippet_asset: {
    header: "Courses",
    values: SNIPPET_COURSES,
  },
}]);
assetResources.snippets.push(coursesAsset.resource_name);

const { results: [servicesAsset] } = await customer.assets.create([{
  structured_snippet_asset: {
    header: "Service catalog",
    values: SNIPPET_SERVICES,
  },
}]);
assetResources.snippets.push(servicesAsset.resource_name);

console.log(`  + 2 Structured snippet assets (Courses, Service catalog)`);

// Link all assets to all 3 campaigns
const campaignAssetOps: { campaign: string; asset: string; field_type: number }[] = [];
for (const campaignRes of Object.values(campaignResources)) {
  for (const a of assetResources.sitelinks) {
    campaignAssetOps.push({ campaign: campaignRes, asset: a, field_type: enums.AssetFieldType.SITELINK });
  }
  for (const a of assetResources.callouts) {
    campaignAssetOps.push({ campaign: campaignRes, asset: a, field_type: enums.AssetFieldType.CALLOUT });
  }
  for (const a of assetResources.snippets) {
    campaignAssetOps.push({ campaign: campaignRes, asset: a, field_type: enums.AssetFieldType.STRUCTURED_SNIPPET });
  }
}

if (campaignAssetOps.length) {
  await customer.campaignAssets.create(campaignAssetOps);
  console.log(`  + linked ${campaignAssetOps.length} campaign-asset relations`);
}

// ---------- summary ----------

console.log("\n=== Summary ===");
console.log(`Campaigns created/linked: ${Object.keys(campaignResources).length}`);
console.log(`Ad groups created/linked: ${Object.keys(adGroupResources).length}`);

const totalKw = AD_GROUPS.reduce((s, g) => s + KEYWORDS[g.adGroup].phrase.length + KEYWORDS[g.adGroup].exact.length, 0);
console.log(`Keywords: ${totalKw}`);
console.log(`RSAs: ${RSAS.length}`);
console.log(`Shared negative list: ${NEGATIVES.length} terms`);
console.log(`Assets: ${SITELINKS.length} sitelinks + ${CALLOUTS.length} callouts + 2 snippets`);
console.log("\nNext: bun run scripts/verify-campaigns.ts");
