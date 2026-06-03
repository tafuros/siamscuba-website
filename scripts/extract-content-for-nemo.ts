// Extracts content from siamscuba.com source for the Nemo RAG KB (WhatsApp n8n bot).
// Emits /tmp/kb-content.json — a flat list of {source, text} records.
// Run with bun:  bun scripts/extract-content-for-nemo.ts
// Extraction logic is shared with the website chat widget — see scripts/lib/extract-kb.ts.

import { writeFileSync } from "node:fs";
import { extractKbRecords, summarizeBySource } from "./lib/extract-kb";

const records = extractKbRecords();
const OUT = "/tmp/kb-content.json";
writeFileSync(OUT, JSON.stringify(records, null, 2));
console.log(`wrote ${records.length} records → ${OUT}`);
summarizeBySource(records);
