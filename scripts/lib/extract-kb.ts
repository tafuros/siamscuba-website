// Shared knowledge-base extractor for both Nemo surfaces:
//   - scripts/extract-content-for-nemo.ts  → /tmp/kb-content.json (WhatsApp n8n bot)
//   - scripts/build-chat-kb.ts             → api/_kb.json          (website chat widget)
// Reads the structured data files (blogPosts, diveSites, translations, landerCopy)
// and returns a flat list of {source, text} records.

import { blogPosts, blogPostPath } from "@/data/blogPosts";
import { diveSites } from "@/data/diveSites";
import { translations } from "@/i18n/translations";
import { LANDER_COPY } from "@/lib/landerCopy";

export type KbRecord = { source: string; text: string };

export function extractKbRecords(): KbRecord[] {
  const records: KbRecord[] = [];

  // ── blog posts: one record per section per post ────────────────────────────
  // Paragraphs may carry minimal inline markup (see BlogRichText); strip it so
  // the chatbot reads clean prose instead of "[label](https://…)".
  const stripInline = (s: string) =>
    s
      .replace(/\[([^\]\n]+)\]\((?:https?:\/\/|\/|mailto:|tel:)[^)\s]+\)/g, "$1")
      .replace(/\*\*([^*\n]+)\*\*/g, "$1");

  for (const post of blogPosts) {
    const slugUrl = blogPostPath(post);
    const header = `${post.title}\n${post.excerpt ?? ""}`.trim();
    records.push({ source: `${slugUrl}#header`, text: header });
    for (let i = 0; i < (post.sections?.length ?? 0); i++) {
      const s = post.sections[i];
      const parts = [s.heading, ...(s.paragraphs ?? [])].filter(Boolean).map(stripInline);
      // Fold table rows in as "label: value" so fares are answerable too.
      if (s.table?.rows?.length) {
        for (const row of s.table.rows as string[][]) {
          if (row.length) parts.push(row.map(stripInline).join(": "));
        }
      }
      if (parts.length) records.push({ source: `${slugUrl}#s${i}`, text: parts.join("\n\n") });
    }
  }

  // ── dive sites ─────────────────────────────────────────────────────────────
  for (const site of diveSites as unknown as Record<string, unknown>[]) {
    const slug = site.slug ?? site.id ?? site.name?.toLowerCase().replace(/\s+/g, "-");
    const lines: string[] = [];
    for (const [k, v] of Object.entries(site)) {
      if (typeof v === "string" && v.length > 4) lines.push(`${k}: ${v}`);
      else if (Array.isArray(v) && v.every(x => typeof x === "string")) lines.push(`${k}: ${(v as string[]).join("; ")}`);
      else if (Array.isArray(v) && v.every(x => x && typeof x === "object")) {
        lines.push(`${k}:`);
        for (const o of v as Record<string, unknown>[]) {
          const inner = Object.entries(o).filter(([_, val]) => typeof val === "string").map(([kk, vv]) => `  ${kk}: ${vv}`).join("\n");
          if (inner) lines.push(inner);
        }
      }
    }
    records.push({ source: `/dive-sites/${slug}`, text: lines.join("\n") });
  }

  // ── translations: flatten leaf strings, group keys by topical prefix ───────
  const flatten = (obj: unknown, prefix = ""): Array<[string, string]> => {
    const out: Array<[string, string]> = [];
    for (const [k, v] of Object.entries((obj ?? {}) as Record<string, unknown>)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "string") out.push([key, v]);
      else if (Array.isArray(v) && v.every(x => typeof x === "string")) out.push([key, (v as string[]).join("\n")]);
      else if (v && typeof v === "object") out.push(...flatten(v, key));
    }
    return out;
  };

  for (const [lang, dict] of Object.entries(translations as Record<string, unknown>)) {
    const groups: { [topic: string]: string[] } = {};
    for (const [k, v] of flatten(dict)) {
      if (!v || v.length < 4) continue;
      const topic = k.split("_")[0] || "misc";
      (groups[topic] ||= []).push(`${k}: ${v}`);
    }
    for (const [topic, lines] of Object.entries(groups)) {
      records.push({ source: `translations:${lang}:${topic}`, text: lines.join("\n") });
    }
  }

  // ── lander copy: per-offer per-language, all string fields concatenated ────
  for (const [offer, byLang] of Object.entries(LANDER_COPY as Record<string, unknown>)) {
    for (const [lang, copy] of Object.entries(byLang as Record<string, unknown>)) {
      const parts: string[] = [];
      const walk = (v: unknown) => {
        if (typeof v === "string") parts.push(v);
        else if (Array.isArray(v)) v.forEach(walk);
        else if (v && typeof v === "object") Object.values(v).forEach(walk);
      };
      walk(copy);
      records.push({ source: `lander:${offer}:${lang}`, text: parts.join("\n") });
    }
  }

  return records;
}

export function summarizeBySource(records: KbRecord[]): void {
  const bySrc: { [k: string]: number } = {};
  for (const r of records) bySrc[r.source.split(/[:#]/)[0]] = (bySrc[r.source.split(/[:#]/)[0]] || 0) + 1;
  console.log("by source prefix:");
  for (const [k, v] of Object.entries(bySrc).sort((a, b) => b[1] - a[1])) console.log(`  ${v.toString().padStart(4)}  ${k}`);
}
