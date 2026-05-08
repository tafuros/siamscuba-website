// Ping IndexNow (Bing/Yandex/etc.) with all sitemap URLs after each deploy.
// Faster discovery than waiting for crawlers to find updates.
//
// Setup: a file at https://siamscuba.com/<KEY>.txt must exist and contain the same key.
// We host it from public/<KEY>.txt.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE_HOST = "siamscuba.com";
const KEY = "fae21198a0054825ba1c17b61719c41c";
const KEY_LOCATION = `https://${SITE_HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

function extractUrls(sitemapXml: string): string[] {
  const matches = sitemapXml.match(/<loc>([^<]+)<\/loc>/g) ?? [];
  return matches.map((m) => m.replace(/<\/?loc>/g, ""));
}

async function main() {
  const sitemapPath = resolve(process.cwd(), "dist", "sitemap.xml");
  const sitemap = readFileSync(sitemapPath, "utf8");
  const urls = extractUrls(sitemap);
  if (urls.length === 0) {
    console.log("[indexnow] no URLs in sitemap, skipping");
    return;
  }

  const body = {
    host: SITE_HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  console.log(`[indexnow] POST ${urls.length} URLs -> ${res.status} ${res.statusText}`);
  if (!res.ok && res.status !== 202) {
    const txt = await res.text().catch(() => "");
    console.warn(`[indexnow] response body: ${txt.slice(0, 200)}`);
  }
}

main().catch((err) => {
  console.error("[indexnow] failed:", err);
  // Do not fail the deploy if IndexNow is down — it's not critical.
});
