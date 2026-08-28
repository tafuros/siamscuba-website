/**
 * Generate Google Ads Editor bulk-import files for the 2026-W22 launch.
 *
 * Source of truth: scripts/campaign-data.ts (typed) + docs/google-ads-blueprint.md (strategy).
 *
 * Run: bun run scripts/generate-google-ads-bulk.ts
 * Outputs: docs/campaigns/google-ads-2026-w22/*.tsv + combined-bulk.csv + validation-report.md
 */

import { writeFileSync, mkdirSync } from "node:fs";
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
} from "./campaign-data";

const OUT_DIR = join(import.meta.dir, "..", "docs", "campaigns", "google-ads-2026-w22");
mkdirSync(OUT_DIR, { recursive: true });

const tsv = (rows: (string | number)[][]) =>
  rows.map((r) => r.map((c) => String(c).replace(/\t/g, " ").replace(/\n/g, " ")).join("\t")).join("\n") + "\n";

const write = (name: string, body: string) => {
  writeFileSync(join(OUT_DIR, name), body, "utf8");
  console.log(`wrote ${name} (${body.length} bytes)`);
};

// ---------- Campaigns TSV ----------

{
  const rows: (string | number)[][] = [];
  rows.push([
    "Campaign", "Campaign type", "Status", "Budget", "Budget type",
    "Bid strategy type", "Networks", "Languages", "Locations",
    "Start date", "End date", "Ad rotation",
  ]);
  for (const c of CAMPAIGNS) {
    rows.push([
      c.name, "Search", "Paused",
      c.dailyBudgetThb, "Daily",
      "Maximize conversions",
      "Google search;Search partners",
      "All",
      "see-§3-blueprint",
      "", "", "Optimize",
    ]);
  }
  write("01-campaigns.tsv", tsv(rows));
}

// ---------- Ad groups TSV ----------

{
  const rows: (string | number)[][] = [];
  rows.push(["Campaign", "Ad group", "Status", "Default max CPC", "Final URL"]);
  for (const g of AD_GROUPS) {
    rows.push([g.campaign, g.adGroup, "Paused", "10", g.finalUrl]);
  }
  write("02-ad-groups.tsv", tsv(rows));
}

// ---------- Keywords TSV ----------

{
  const rows: (string | number)[][] = [];
  rows.push(["Campaign", "Ad group", "Keyword", "Match type", "Status"]);
  for (const g of AD_GROUPS) {
    const kws = KEYWORDS[g.adGroup];
    for (const k of kws.phrase) rows.push([g.campaign, g.adGroup, k, "Phrase", "Enabled"]);
    for (const k of kws.exact)  rows.push([g.campaign, g.adGroup, k, "Exact",  "Enabled"]);
  }
  write("03-keywords.tsv", tsv(rows));
}

// ---------- Negative keywords (shared list) TSV ----------

{
  const rows: (string | number)[][] = [];
  rows.push(["Shared set", "Keyword", "Match type"]);
  for (const n of NEGATIVES) {
    rows.push([NEGATIVE_SHARED_SET_NAME, n, "Phrase"]);
  }
  write("04-negative-keywords-shared-list.tsv", tsv(rows));
}

// ---------- Responsive search ads TSV ----------

{
  const headers = ["Campaign", "Ad group", "Ad type"];
  for (let i = 1; i <= 15; i++) headers.push(`Headline ${i}`);
  for (let i = 1; i <= 4;  i++) headers.push(`Description ${i}`);
  headers.push("Final URL", "Path 1", "Path 2");
  const rows: (string | number)[][] = [headers];
  for (const r of RSAS) {
    const g = AD_GROUPS.find((a) => a.adGroup === r.adGroup)!;
    const row: (string | number)[] = [g.campaign, g.adGroup, "Responsive search ad"];
    for (let i = 0; i < 15; i++) row.push(r.headlines[i] ?? "");
    for (let i = 0; i < 4;  i++) row.push(r.descriptions[i] ?? "");
    row.push(g.finalUrl, r.path1 ?? "", r.path2 ?? "");
    rows.push(row);
  }
  write("05-rsas.tsv", tsv(rows));
}

// ---------- Sitelinks / callouts / structured snippets TSV ----------

{
  const rows: (string | number)[][] = [];
  rows.push(["Asset type", "Field 1", "Field 2", "Field 3", "Field 4"]);
  for (const s of SITELINKS) {
    rows.push(["Sitelink", s.text, s.d1, s.d2, s.url]);
  }
  for (const c of CALLOUTS) {
    rows.push(["Callout", c, "", "", ""]);
  }
  rows.push(["Structured snippet (Courses)", SNIPPET_COURSES.join(";"), "", "", ""]);
  rows.push(["Structured snippet (Service catalog)", SNIPPET_SERVICES.join(";"), "", "", ""]);
  write("06-assets.tsv", tsv(rows));
}

// ---------- Combined CSV for Google Ads web Bulk Uploads ----------

{
  const headers = [
    "Action", "Row Type",
    "Campaign", "Campaign Type", "Campaign Status", "Budget", "Budget Type",
    "Bid Strategy Type", "Networks", "Languages",
    "Ad Group", "Ad Group Status", "Max CPC",
    "Keyword", "Match Type", "Criterion Status",
    "Ad Type",
    "Headline 1", "Headline 2", "Headline 3", "Headline 4", "Headline 5",
    "Headline 6", "Headline 7", "Headline 8", "Headline 9", "Headline 10",
    "Headline 11", "Headline 12", "Headline 13", "Headline 14", "Headline 15",
    "Description 1", "Description 2", "Description 3", "Description 4",
    "Final URL", "Path 1", "Path 2",
  ];
  const rows: (string | number)[][] = [headers];

  const blank = headers.map(() => "");
  const fill = (overrides: Record<string, string | number>) => {
    const row = [...blank];
    for (const [k, v] of Object.entries(overrides)) {
      const idx = headers.indexOf(k);
      if (idx === -1) throw new Error(`Unknown column: ${k}`);
      row[idx] = String(v);
    }
    return row;
  };

  for (const c of CAMPAIGNS) {
    rows.push(fill({
      "Action": "Add",
      "Row Type": "Campaign",
      "Campaign": c.name,
      "Campaign Type": "Search",
      "Campaign Status": "Paused",
      "Budget": c.dailyBudgetThb,
      "Budget Type": "Daily",
      "Bid Strategy Type": "Maximize Conversions",
      "Networks": "Google search;Search partners",
      "Languages": "All",
    }));
  }

  for (const g of AD_GROUPS) {
    rows.push(fill({
      "Action": "Add",
      "Row Type": "Ad Group",
      "Campaign": g.campaign,
      "Ad Group": g.adGroup,
      "Ad Group Status": "Paused",
      "Max CPC": "10",
    }));
  }

  for (const g of AD_GROUPS) {
    const kws = KEYWORDS[g.adGroup];
    for (const k of kws.phrase) {
      rows.push(fill({
        "Action": "Add",
        "Row Type": "Keyword",
        "Campaign": g.campaign,
        "Ad Group": g.adGroup,
        "Keyword": k,
        "Match Type": "Phrase",
        "Criterion Status": "Enabled",
      }));
    }
    for (const k of kws.exact) {
      rows.push(fill({
        "Action": "Add",
        "Row Type": "Keyword",
        "Campaign": g.campaign,
        "Ad Group": g.adGroup,
        "Keyword": k,
        "Match Type": "Exact",
        "Criterion Status": "Enabled",
      }));
    }
  }

  for (const r of RSAS) {
    const g = AD_GROUPS.find((a) => a.adGroup === r.adGroup)!;
    const overrides: Record<string, string> = {
      "Action": "Add",
      "Row Type": "Responsive Search Ad",
      "Campaign": g.campaign,
      "Ad Group": g.adGroup,
      "Ad Type": "Responsive search ad",
      "Final URL": g.finalUrl,
      "Path 1": r.path1 ?? "",
      "Path 2": r.path2 ?? "",
    };
    for (let i = 0; i < 15; i++) {
      overrides[`Headline ${i + 1}`] = r.headlines[i] ?? "";
    }
    for (let i = 0; i < 4; i++) {
      overrides[`Description ${i + 1}`] = r.descriptions[i] ?? "";
    }
    rows.push(fill(overrides));
  }

  const csv = rows.map((row) =>
    row.map((cell) => {
      const s = String(cell);
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    }).join(",")
  ).join("\n") + "\n";

  write("combined-bulk.csv", csv);
}

// ---------- Validation (blueprint §6 character limits) ----------

const HEADLINE_LIMIT = 30;
const DESC_LIMIT = 90;
const PATH_LIMIT = 15;
const SITELINK_TEXT_LIMIT = 25;
const SITELINK_DESC_LIMIT = 35;
const CALLOUT_LIMIT = 25;
const SNIPPET_VALUE_LIMIT = 25;

const issues: string[] = [];

function check(label: string, value: string, limit: number) {
  const len = [...value].length;
  if (len > limit) {
    issues.push(`OVERFLOW (${len}/${limit}): ${label} = "${value}"`);
  }
}

for (const r of RSAS) {
  r.headlines.forEach((h, i) => check(`${r.adGroup} H${i + 1}`, h, HEADLINE_LIMIT));
  r.descriptions.forEach((d, i) => check(`${r.adGroup} D${i + 1}`, d, DESC_LIMIT));
  if (r.path1) check(`${r.adGroup} Path1`, r.path1, PATH_LIMIT);
  if (r.path2) check(`${r.adGroup} Path2`, r.path2, PATH_LIMIT);
}
for (const s of SITELINKS) {
  check(`Sitelink text "${s.text}"`, s.text, SITELINK_TEXT_LIMIT);
  check(`Sitelink D1 "${s.d1}"`, s.d1, SITELINK_DESC_LIMIT);
  check(`Sitelink D2 "${s.d2}"`, s.d2, SITELINK_DESC_LIMIT);
}
for (const c of CALLOUTS) check(`Callout "${c}"`, c, CALLOUT_LIMIT);
for (const v of [...SNIPPET_COURSES, ...SNIPPET_SERVICES]) check(`Snippet "${v}"`, v, SNIPPET_VALUE_LIMIT);

const report = [
  `# Google Ads bulk-import validation`,
  ``,
  `Generated: ${new Date().toISOString()}`,
  ``,
  `**Limits (Google Ads policy):**`,
  `- Headline: ${HEADLINE_LIMIT} chars`,
  `- Description: ${DESC_LIMIT} chars`,
  `- Path: ${PATH_LIMIT} chars`,
  `- Sitelink text: ${SITELINK_TEXT_LIMIT} chars`,
  `- Sitelink description: ${SITELINK_DESC_LIMIT} chars`,
  `- Callout: ${CALLOUT_LIMIT} chars`,
  `- Structured snippet value: ${SNIPPET_VALUE_LIMIT} chars`,
  ``,
  `## Issues (${issues.length})`,
  ``,
  issues.length === 0 ? "All assets within character limits." : issues.map((i) => `- ${i}`).join("\n"),
  ``,
].join("\n");
write("validation-report.md", report);

console.log(`\nDone. ${issues.length} validation issue(s).`);
if (issues.length > 0) {
  console.log("See validation-report.md for details.");
}
