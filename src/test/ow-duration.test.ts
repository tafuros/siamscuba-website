// Open Water is 2.5 days. Confirmed by Ben 2026-08-01.
//
// This guard exists because the site shipped BOTH answers at once: the lander
// said 2.5 days (duration P2DT12H) while the homepage Course schema said "3-4
// days" / P4D, the chatbot said "3-day course", and four blog posts said 3
// days. An ad promising 2.5 days pointed at a page whose own structured data
// said 4 is a conversion leak and a rich-result mismatch Google can flag.
//
// Scope note: this pins SIAM SCUBA's Koh Tao Open Water course only. General
// "on Koh Tao courses typically run 3-4 days" statements are a different claim
// and are deliberately not asserted here - see the allowlist below. The Phuket
// operation (components/phuket/) is a separate product and is out of scope.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { LANDER_COPY } from "../lib/landerCopy";
import { translations } from "../i18n/translations";

const root = resolve(__dirname, "../..");
const read = (p: string) => readFileSync(resolve(root, p), "utf8");

/** ISO 8601 for 2 days + 12 hours. The single canonical machine-readable form. */
const OW_ISO_DURATION = "P2DT12H";
/** The canonical human-readable form, per language. */
const OW_HUMAN = { en: "2.5 days", es: "2,5 días", he: "2.5 ימים" };

describe("Open Water duration - structured data agrees everywhere", () => {
  it("the homepage Course schema says 2.5 days, not 3-4 / P4D", () => {
    const html = read("index.html");
    // Isolate the Open Water ListItem so a P4D belonging to Rescue Diver
    // (legitimately longer) cannot mask or trigger a failure here.
    const start = html.indexOf('"name": "PADI Open Water Diver"');
    expect(start, "PADI Open Water Diver schema block not found").toBeGreaterThan(-1);
    const block = html.slice(start, html.indexOf("ListItem", start + 1));

    expect(block).toContain(OW_ISO_DURATION);
    expect(block).not.toContain("P4D");
    expect(block).not.toContain("P3D");
    expect(block).not.toContain("3-4 days");
    // The same block advertised 11,000 THB - the AOW price - alongside the
    // wrong duration. Open Water is 12,000.
    expect(block).toContain('"price": "12000"');
  });

  it("the lander JSON-LD duration matches the homepage", () => {
    const source = read("src/lib/landerCopy.ts");
    expect(source).toContain(`owd: { price: "12000", currency: "THB", duration: "${OW_ISO_DURATION}" }`);
  });

  it("the public info.json API says 2.5 days", () => {
    const info = JSON.parse(read("public/api/info.json")) as unknown;
    // Walk the doc rather than assuming its shape - this file is hand-edited
    // and its nesting has moved before.
    const findOwd = (node: unknown): Record<string, unknown> | null => {
      if (Array.isArray(node)) {
        for (const child of node) {
          const hit = findOwd(child);
          if (hit) return hit;
        }
        return null;
      }
      if (node && typeof node === "object") {
        const obj = node as Record<string, unknown>;
        if (obj.id === "owd") return obj;
        for (const value of Object.values(obj)) {
          const hit = findOwd(value);
          if (hit) return hit;
        }
      }
      return null;
    };

    const owd = findOwd(info);
    expect(owd, 'no course with id "owd" in public/api/info.json').not.toBeNull();
    expect(owd!.duration).toBe("2.5 days");
  });
});

describe("Open Water duration - visible copy agrees with the schema", () => {
  for (const lang of ["en", "es", "he"] as const) {
    it(`the ${lang} lander states ${OW_HUMAN[lang]}`, () => {
      const blob = JSON.stringify(LANDER_COPY.owd[lang]);
      expect(blob).toContain(OW_HUMAN[lang]);
    });
  }

  it("the shared duration translation key is 2.5 days in every language", () => {
    // dur_2_5_days feeds the Open Water card in CoursesSection.
    const values = Object.values(translations as Record<string, Record<string, string>>)
      .map((t) => t.dur_2_5_days)
      .filter(Boolean);
    expect(values.length).toBeGreaterThanOrEqual(3);
    for (const v of values) expect(v).toMatch(/2[.,]5/);
  });

  it("the chatbot prompt does not offer a 3-day Open Water course", () => {
    const prompt = read("api/chat.ts");
    expect(prompt).not.toMatch(/3-day course/);
    expect(prompt).toMatch(/2\.5-day course/);
  });
});

// The partner rate sheet going to the Bangkok Hebrew travel agencies prices
// Open Water at 12,000 THB with a 1,200 THB commission. If an agent quotes
// 12,000 and the customer finds a lower number on siamscuba.com, Siam loses the
// argument and the margin. The homepage Course schema really did advertise
// 11,000 (the AOW price) until 2026-08-01, so this is not hypothetical.
describe("Open Water price is 12,000 THB on every surface", () => {
  const OW_PRICE = "12,000";

  for (const lang of ["en", "es", "he"] as const) {
    it(`the ${lang} lander prices it at ${OW_PRICE} THB`, () => {
      const blob = JSON.stringify(LANDER_COPY.owd[lang]);
      expect(blob).toContain(OW_PRICE);
      // 11,000 is Advanced Open Water and Rescue Diver. It must never appear
      // on the Open Water lander in any language.
      expect(blob, `${lang} OW lander shows 11,000 - that is the AOW price`).not.toContain(
        "11,000",
      );
    });
  }

  it("the Hebrew guide page and Hebrew blog post both say 12,000", () => {
    // /he is the page the Hebrew campaign (phase 2) would point at.
    expect(read("src/pages/HebrewLanding.tsx")).toContain("12,000");
    const he = read("src/data/blogPosts.ts");
    expect(he).toContain("קורס Open Water Diver ב-Siam Scuba עולה 12,000");
  });

  it("the WhatsApp prefill quotes 12,000 in every language", () => {
    const wa = read("src/utils/whatsapp.ts");
    const owdBlock = wa.slice(wa.indexOf("owd: {"), wa.indexOf("aow: {"));
    expect(owdBlock).toContain("12,000 THB");
    expect(owdBlock).not.toContain("11,000");
  });
});

describe("Open Water duration - blog posts do not contradict the landers", () => {
  // Statements about Koh Tao / the PADI standard in general, rather than about
  // Siam Scuba's own course. Left as written on purpose; listed here so the
  // scan below stays honest about what it is NOT checking.
  const GENERAL_KOH_TAO_CLAIMS = [
    "On Koh Tao, the full Open Water course typically takes 3", // padi-vs-ssi-koh-tao
    "On Koh Tao, the course typically takes 3 to 4 days", // ...what-to-expect
  ];

  it("no blog post says Siam Scuba's Open Water course is 3 days", () => {
    const source = read("src/data/blogPosts.ts");
    const offenders = [
      "PADI Open Water Diver: ฿12,000 - 3 days",
      "Standard: 3 days on the island",
      "Most students do 3 days",
      "you've just spent 3 days getting comfortable",
      "dura 3 días",
    ].filter((phrase) => source.toLowerCase().includes(phrase.toLowerCase()));

    expect(offenders, `blogPosts.ts still claims a 3-day Open Water course`).toEqual([]);
  });

  it("the general Koh Tao statements are still present and untouched", () => {
    // If one of these disappears, someone "fixed" a claim that was never wrong.
    // That is a content decision for Ben, not a silent edit - hence the guard.
    const source = read("src/data/blogPosts.ts");
    for (const claim of GENERAL_KOH_TAO_CLAIMS) {
      expect(source, `general Koh Tao claim went missing: "${claim}"`).toContain(claim);
    }
  });
});
