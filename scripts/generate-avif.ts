// Generates AVIF copies of the hero turtle image at the same resolutions
// as the existing WebP variants. AVIF is ~25% smaller than WebP at similar
// quality, so the AVIF source in the <picture> shaves real LCP weight on
// browsers that support it (~95% globally).
//
// Run on demand: `bun run scripts/generate-avif.ts` (also wired into the
// `bun run build` step via package.json prebuild).

import sharp from "sharp";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

interface Job {
  source: string;
  out: string;
  width: number;
}

const jobs: Job[] = [
  { source: "public/hero/turtle-1920.jpg", out: "public/hero/turtle-768.avif", width: 768 },
  { source: "public/hero/turtle-1920.jpg", out: "public/hero/turtle-1280.avif", width: 1280 },
  { source: "public/hero/turtle-1920.jpg", out: "public/hero/turtle-1920.avif", width: 1920 },
];

async function run(job: Job) {
  const srcPath = resolve(process.cwd(), job.source);
  const outPath = resolve(process.cwd(), job.out);
  if (!existsSync(srcPath)) {
    console.warn(`[avif] source missing: ${srcPath}`);
    return;
  }
  await sharp(srcPath)
    .resize({ width: job.width })
    .avif({ quality: 60, effort: 6 })
    .toFile(outPath);
  console.log(`[avif] wrote ${job.out}`);
}

await Promise.all(jobs.map(run));
