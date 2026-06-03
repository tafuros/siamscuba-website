// Builds the knowledge base bundled into the website chat API (api/chat.ts).
// Emits api/_kb.json — the same {source, text} records the WhatsApp Nemo uses,
// committed to the repo so the Vercel serverless function bundles it at deploy.
// Run with bun:  bun scripts/build-chat-kb.ts   (also runs as part of `bun run build`)

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { extractKbRecords, summarizeBySource } from "./lib/extract-kb";

const records = extractKbRecords();
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../api/_kb.json");
writeFileSync(OUT, JSON.stringify(records));
console.log(`wrote ${records.length} records → ${OUT}`);
summarizeBySource(records);
