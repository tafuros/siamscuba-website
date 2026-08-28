/**
 * Apply geo targeting to the 3 SiamScuba Search campaigns (per blueprint §3, union
 * of all language geos since the campaigns are per-offer with mixed-language ad groups).
 *
 * - Koh Tao + 50 km proximity (people already here)
 * - 14 source-market countries (EN: TH/SG/MY/AU/UK/US/DE/NL, ES: ES/MX/AR/CO/CL, HE: IL)
 * - positive_geo_target_type = PRESENCE_OR_INTEREST (captures pre-trip researchers)
 *
 * Idempotent: skips a campaign that already has location criteria.
 *
 * Run: bun run scripts/set-geo-targeting.ts --dry-run
 *      bun run scripts/set-geo-targeting.ts
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { CAMPAIGNS } from "./campaign-data";

const ROOT = join(import.meta.dir, "..");
const ENV_FILE = join(ROOT, ".env.local");
const DRY_RUN = process.argv.includes("--dry-run");

function loadEnv(): Record<string, string> {
  if (!existsSync(ENV_FILE)) { console.error(`.env.local not found`); process.exit(1); }
  const out: Record<string, string> = {};
  for (const line of readFileSync(ENV_FILE, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}
const env = loadEnv();

// Google geo target constant IDs (stable).
const COUNTRIES: Record<string, number> = {
  Thailand: 2764, Singapore: 2702, Malaysia: 2458, Australia: 2036,
  "United Kingdom": 2826, "United States": 2840, Germany: 2276, Netherlands: 2528,
  Spain: 2724, Mexico: 2484, Argentina: 2032, Colombia: 2170, Chile: 2152, Israel: 2376,
};
// Koh Tao centre.
const KOH_TAO = { lat: 10.0956, lng: 99.8405, radiusKm: 50 };

const names = CAMPAIGNS.map((c) => c.name);

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

console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}\n`);

const camps: any[] = await customer.query(`
  SELECT campaign.resource_name, campaign.name
  FROM campaign
  WHERE campaign.name IN ('${names.join("','")}') AND campaign.status != 'REMOVED'
`);

for (const row of camps) {
  const campaign = row.campaign.resource_name;
  const name = row.campaign.name;

  const existing: any[] = await customer.query(`
    SELECT campaign_criterion.criterion_id, campaign_criterion.type
    FROM campaign_criterion
    WHERE campaign_criterion.campaign = '${campaign}'
      AND campaign_criterion.type = 'LOCATION'
      AND campaign_criterion.status != 'REMOVED'
  `);
  if (existing.length > 0) {
    console.log(`SKIP ${name} - already has ${existing.length} location criteria.`);
    continue;
  }

  const ops = [
    ...Object.entries(COUNTRIES).map(([, id]) => ({
      campaign,
      location: { geo_target_constant: `geoTargetConstants/${id}` },
    })),
    {
      campaign,
      proximity: {
        geo_point: {
          longitude_in_micro_degrees: Math.round(KOH_TAO.lng * 1_000_000),
          latitude_in_micro_degrees: Math.round(KOH_TAO.lat * 1_000_000),
        },
        radius: KOH_TAO.radiusKm,
        radius_units: enums.ProximityRadiusUnits.KILOMETERS,
      },
    },
  ];

  console.log(`${name}: ${Object.keys(COUNTRIES).length} countries + Koh Tao ${KOH_TAO.radiusKm}km proximity`);

  if (!DRY_RUN) {
    await customer.campaigns.update([{
      resource_name: campaign,
      geo_target_type_setting: {
        positive_geo_target_type: enums.PositiveGeoTargetType.PRESENCE_OR_INTEREST,
        negative_geo_target_type: enums.NegativeGeoTargetType.PRESENCE,
      },
    }]);
    await customer.campaignCriteria.create(ops);
    console.log(`  applied (${ops.length} criteria) + PRESENCE_OR_INTEREST`);
  }
}

console.log(`\n${DRY_RUN ? "Dry run complete - no changes." : "Geo targeting applied."}`);
