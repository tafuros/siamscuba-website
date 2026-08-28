/** READ-ONLY: report geo targeting, languages, and audience targeting per campaign. */
import { readFileSync } from "node:fs";
const env: Record<string,string> = {};
for (const l of readFileSync(".env.local","utf8").split("\n")) { const m=l.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/); if(m) env[m[1]]=m[2].replace(/^["']|["']$/g,""); }
const { GoogleAdsApi } = await import("google-ads-api");
const client = new GoogleAdsApi({ client_id:env.GOOGLE_ADS_CLIENT_ID, client_secret:env.GOOGLE_ADS_CLIENT_SECRET, developer_token:env.GOOGLE_ADS_DEVELOPER_TOKEN });
const customer = client.Customer({ customer_id:env.GOOGLE_ADS_CUSTOMER_ID, login_customer_id:env.GOOGLE_ADS_LOGIN_CUSTOMER_ID, refresh_token:env.GOOGLE_ADS_REFRESH_TOKEN });

// 1) LOCATIONS (campaign level)
const locs = await customer.query(`
  SELECT campaign.name, campaign_criterion.location.geo_target_constant, campaign_criterion.negative
  FROM campaign_criterion
  WHERE campaign.name LIKE 'SiamScuba_Search_%' AND campaign_criterion.type = 'LOCATION'
`);
const geoIds = [...new Set((locs as any[]).map(r => r.campaign_criterion.location.geo_target_constant).filter(Boolean))];
const geoNames: Record<string,string> = {};
if (geoIds.length) {
  const inList = geoIds.map(x => `'${x}'`).join(",");
  const g = await customer.query(`SELECT geo_target_constant.resource_name, geo_target_constant.name, geo_target_constant.country_code, geo_target_constant.target_type FROM geo_target_constant WHERE geo_target_constant.resource_name IN (${inList})`);
  for (const r of g as any[]) geoNames[r.geo_target_constant.resource_name] = `${r.geo_target_constant.name} (${r.geo_target_constant.country_code}, ${r.geo_target_constant.target_type})`;
}
console.log("=== GEO TARGETING (by campaign) ===");
const byCamp: Record<string,string[]> = {};
for (const r of locs as any[]) {
  const c = r.campaign.name; byCamp[c] = byCamp[c]||[];
  const nm = geoNames[r.campaign_criterion.location.geo_target_constant] ?? r.campaign_criterion.location.geo_target_constant;
  byCamp[c].push((r.campaign_criterion.negative ? "EXCLUDE " : "") + nm);
}
for (const c of Object.keys(byCamp).sort()) console.log(`  ${c}:\n     ${byCamp[c].join("\n     ")}`);

// 2) LANGUAGES
const langs = await customer.query(`
  SELECT campaign.name, campaign_criterion.language.language_constant
  FROM campaign_criterion
  WHERE campaign.name LIKE 'SiamScuba_Search_%' AND campaign_criterion.type = 'LANGUAGE'
`);
const langIds = [...new Set((langs as any[]).map(r=>r.campaign_criterion.language.language_constant).filter(Boolean))];
const langNames: Record<string,string> = {};
if (langIds.length) {
  const inList = langIds.map(x=>`'${x}'`).join(",");
  const lg = await customer.query(`SELECT language_constant.resource_name, language_constant.name, language_constant.code FROM language_constant WHERE language_constant.resource_name IN (${inList})`);
  for (const r of lg as any[]) langNames[r.language_constant.resource_name] = `${r.language_constant.name} (${r.language_constant.code})`;
}
console.log("\n=== LANGUAGE TARGETING (by campaign) ===");
const lbyCamp: Record<string,string[]> = {};
for (const r of langs as any[]) { const c=r.campaign.name; lbyCamp[c]=lbyCamp[c]||[]; lbyCamp[c].push(langNames[r.campaign_criterion.language.language_constant] ?? r.campaign_criterion.language.language_constant); }
for (const c of Object.keys(lbyCamp).sort()) console.log(`  ${c}: ${lbyCamp[c].join(", ")}`);

// 3) AUDIENCES (campaign + ad group level)
console.log("\n=== AUDIENCE TARGETING ===");
const ca = await customer.query(`
  SELECT campaign.name, campaign_criterion.type
  FROM campaign_criterion
  WHERE campaign.name LIKE 'SiamScuba_Search_%'
    AND campaign_criterion.type IN ('USER_LIST','USER_INTEREST','CUSTOM_AUDIENCE','COMBINED_AUDIENCE','AGE_RANGE','GENDER','INCOME_RANGE')
`);
const aga = await customer.query(`
  SELECT campaign.name, ad_group.name, ad_group_criterion.type
  FROM ad_group_criterion
  WHERE campaign.name LIKE 'SiamScuba_Search_%'
    AND ad_group_criterion.type IN ('USER_LIST','USER_INTEREST','CUSTOM_AUDIENCE','COMBINED_AUDIENCE','AGE_RANGE','GENDER','INCOME_RANGE')
`);
const allAud = [...(ca as any[]).map(r=>`campaign ${r.campaign.name}: ${r.campaign_criterion.type}`),
                ...(aga as any[]).map(r=>`adgroup ${r.ad_group.name}: ${r.ad_group_criterion.type}`)];
if (!allAud.length) console.log("  (none) - no audience/demographic targeting applied. Keyword-only targeting.");
else for (const a of [...new Set(allAud)]) console.log("  "+a);
console.log("\n=== end (read-only) ===");
