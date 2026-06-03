// Shared knowledge-base extractor for both Nemo surfaces:
//   - scripts/extract-content-for-nemo.ts  → /tmp/kb-content.json (WhatsApp n8n bot)
//   - scripts/build-chat-kb.ts             → api/_kb.json          (website chat widget)
// Reads the structured data files (blogPosts, diveSites, translations, landerCopy)
// and returns a flat list of {source, text} records.

import { blogPosts } from "@/data/blogPosts";
import { diveSites } from "@/data/diveSites";
import { translations } from "@/i18n/translations";
import { LANDER_COPY } from "@/lib/landerCopy";

export type KbRecord = { source: string; text: string };

export function extractKbRecords(): KbRecord[] {
  const records: KbRecord[] = [];

  // ── blog posts: one record per section per post ────────────────────────────
  for (const post of blogPosts as any[]) {
    const lang = post.language ?? "en";
    const slugUrl = lang === "es" ? `/es/blog/${post.slug}` : `/blog/${post.slug}`;
    const header = `${post.title}\n${post.excerpt ?? ""}`.trim();
    records.push({ source: `${slugUrl}#header`, text: header });
    for (let i = 0; i < (post.sections?.length ?? 0); i++) {
      const s = post.sections[i];
      const parts = [s.heading, ...(s.paragraphs ?? [])].filter(Boolean);
      if (parts.length) records.push({ source: `${slugUrl}#s${i}`, text: parts.join("\n\n") });
    }
  }

  // ── dive sites ─────────────────────────────────────────────────────────────
  for (const site of diveSites as any[]) {
    const slug = site.slug ?? site.id ?? site.name?.toLowerCase().replace(/\s+/g, "-");
    const lines: string[] = [];
    for (const [k, v] of Object.entries(site)) {
      if (typeof v === "string" && v.length > 4) lines.push(`${k}: ${v}`);
      else if (Array.isArray(v) && v.every(x => typeof x === "string")) lines.push(`${k}: ${(v as string[]).join("; ")}`);
      else if (Array.isArray(v) && v.every(x => x && typeof x === "object")) {
        lines.push(`${k}:`);
        for (const o of v as any[]) {
          const inner = Object.entries(o).filter(([_, val]) => typeof val === "string").map(([kk, vv]) => `  ${kk}: ${vv}`).join("\n");
          if (inner) lines.push(inner);
        }
      }
    }
    records.push({ source: `/dive-sites/${slug}`, text: lines.join("\n") });
  }

  // ── translations: flatten leaf strings, group keys by topical prefix ───────
  const flatten = (obj: any, prefix = ""): Array<[string, string]> => {
    const out: Array<[string, string]> = [];
    for (const [k, v] of Object.entries(obj ?? {})) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "string") out.push([key, v]);
      else if (Array.isArray(v) && v.every(x => typeof x === "string")) out.push([key, (v as string[]).join("\n")]);
      else if (v && typeof v === "object") out.push(...flatten(v, key));
    }
    return out;
  };

  for (const [lang, dict] of Object.entries(translations as any)) {
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
  for (const [offer, byLang] of Object.entries(LANDER_COPY as any)) {
    for (const [lang, copy] of Object.entries(byLang as any)) {
      const parts: string[] = [];
      const walk = (v: any) => {
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
