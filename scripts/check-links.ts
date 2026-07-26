/**
 * Site-wide internal link checker - run AFTER `bun run build`.
 *
 * Why not a dev server: `vite preview` serves index.html for ANY path, so every
 * URL returns 200 and dead links are invisible. That is how a `/courses` link
 * (a route that does not exist) reached production on 2026-07-26. Vercel does
 * NOT fall back - unmatched paths hard-404 - so the only faithful check is to
 * resolve each link against the files the build actually emitted.
 *
 * Models Vercel's static resolution with `cleanUrls: true`:
 *   /              -> dist/index.html
 *   /open-water    -> dist/open-water.html  (or dist/open-water/index.html)
 *   /blog/x.webp   -> dist/blog/x.webp      (literal asset)
 * Paths listed as `redirects` sources in vercel.json are treated as valid.
 *
 * Usage: bun run scripts/check-links.ts [distDir]
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const DIST = resolve(process.argv[2] ?? "dist");
const ROOT = resolve(import.meta.dir, "..");

function walk(dir: string, filter: (f: string) => boolean): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(path, filter));
    else if (filter(entry.name)) out.push(path);
  }
  return out;
}

/** Sources declared in vercel.json redirects - valid destinations for a link. */
function redirectSources(): Set<string> {
  const set = new Set<string>();
  try {
    const cfg = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));
    for (const r of cfg.redirects ?? []) {
      if (typeof r.source === "string") set.add(r.source.split(/[#?]/)[0]);
    }
  } catch {
    /* no vercel.json - nothing to add */
  }
  return set;
}

/** Does Vercel have something to serve at this path? */
function resolves(path: string, redirects: Set<string>): boolean {
  if (redirects.has(path)) return true;

  const clean = path.replace(/\/+$/, "") || "/";
  if (clean === "/") return existsSync(join(DIST, "index.html"));

  const rel = clean.replace(/^\//, "");
  const candidates = [
    join(DIST, rel), // literal file: /sitemap.xml, /blog/a.webp
    join(DIST, `${rel}.html`), // cleanUrls: /open-water -> open-water.html
    join(DIST, rel, "index.html"), // directory index
  ];
  return candidates.some((c) => existsSync(c) && statSync(c).isFile());
}

const htmlFiles = walk(DIST, (f) => f.endsWith(".html"));
if (htmlFiles.length === 0) {
  console.error(`[check-links] no HTML found in ${DIST} - did the build run?`);
  process.exit(1);
}

const redirects = redirectSources();
const HREF = /(?:href|src)="(\/[^"]*)"/g;
// Framework/asset noise and non-navigational protocols we never want to resolve.
const SKIP = /^\/(assets|_|@)/;

const broken = new Map<string, Set<string>>(); // link -> pages containing it
let linksChecked = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const page = "/" + relative(DIST, file).replace(/\.html$/, "").replace(/\/?index$/, "");

  for (const m of html.matchAll(HREF)) {
    const raw = m[1];
    if (SKIP.test(raw)) continue;
    const path = raw.split(/[#?]/)[0];
    if (!path || path === "/") continue;

    linksChecked++;
    if (!resolves(path, redirects)) {
      if (!broken.has(path)) broken.set(path, new Set());
      broken.get(path)!.add(page || "/");
    }
  }
}

console.log(
  `[check-links] checked ${linksChecked} internal links across ${htmlFiles.length} pages`,
);

if (broken.size === 0) {
  console.log("[check-links] no dead internal links.");
  process.exit(0);
}

console.error(`\n[check-links] ${broken.size} dead internal link(s):\n`);
for (const [link, pages] of [...broken].sort()) {
  const list = [...pages].sort();
  const shown = list.slice(0, 6).join(", ");
  const more = list.length > 6 ? ` (+${list.length - 6} more)` : "";
  console.error(`  ${link}\n      on: ${shown}${more}`);
}
console.error("");
process.exit(1);
