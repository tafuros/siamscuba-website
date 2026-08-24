import { describe, it, expect } from "vitest";
import {
  buildWhatsAppLink,
  normalizeLang,
  CONSERVATION_WHATSAPP_NUMBER,
  type PrefillLang,
  type WhatsAppTopic,
} from "@/utils/whatsapp";
import { FUN_DIVE_COPY } from "@/lib/funDiveCopy";

/**
 * Nemo routes leads on the WORDING of the prefilled WhatsApp message - there is
 * no [ref:] tag any more (removed 01510da, 2026-05-31). Between that removal and
 * 2026-08-24 nothing asserted the wording, so TAG_TO_TARGET matched nothing and
 * every lead from every page fell into one bucket for three months.
 *
 * These tests are the guard that makes that silent failure loud.
 */

const LANGS: PrefillLang[] = ["en", "he", "es", "fr"];

/** The words Nemo matches on, per topic per language. Keep in sync with Nemo. */
const MUST_CONTAIN: Partial<Record<WhatsAppTopic, Record<PrefillLang, string>>> = {
  owd: { en: "the Open Water course", he: "קורס Open Water", es: "el curso Open Water", fr: "le cours Open Water" },
  aow: {
    en: "the Advanced Open Water course",
    he: "קורס Advanced Open Water",
    es: "el curso Advanced Open Water",
    fr: "le cours Advanced Open Water",
  },
  rescue: { en: "the Rescue Diver course", he: "קורס Rescue Diver", es: "el curso Rescue Diver", fr: "le cours Rescue Diver" },
  dm: { en: "the Divemaster course", he: "קורס Divemaster", es: "el curso Divemaster", fr: "le cours Divemaster" },
  idc: { en: "the IDC instructor course", he: "קורס מדריכים IDC", es: "el curso de instructor IDC", fr: "le cours d'instructeur IDC" },
  dsd: { en: "a Discover Scuba dive", he: "צלילת היכרות", es: "un bautismo de buceo", fr: "un baptême de plongée" },
  "fun-dive": { en: "fun diving", he: "צלילות כיף", es: "buceo recreativo", fr: "la plongée loisir" },
  refresher: { en: "a refresher dive", he: "צלילת רענון", es: "un repaso", fr: "une remise à niveau" },
  general: { en: "diving in Koh Tao", he: "צלילה בקוטאו", es: "buceo en Koh Tao", fr: "la plongée à Koh Tao" },
};

const decode = (href: string) => decodeURIComponent(href.split("?text=")[1]);

describe("Nemo routing words survive into the prefill", () => {
  for (const [topic, byLang] of Object.entries(MUST_CONTAIN)) {
    for (const lang of LANGS) {
      it(`${topic} / ${lang} carries "${byLang[lang]}"`, () => {
        const text = decode(buildWhatsAppLink({ topic: topic as WhatsAppTopic, lang }));
        expect(text).toContain(byLang[lang]);
      });
    }
  }

  // The exact bug that made this necessary: Nemo tests "Advanced Open Water"
  // BEFORE plain "Open Water", so aow must keep both words intact.
  it('aow keeps the full "Advanced Open Water" phrase in every language', () => {
    for (const lang of LANGS) {
      expect(decode(buildWhatsAppLink({ topic: "aow", lang }))).toContain("Advanced Open Water");
    }
  });

  it("PADI course names stay in Latin script in Hebrew", () => {
    for (const [topic, needle] of [["owd", "Open Water"], ["rescue", "Rescue Diver"], ["dm", "Divemaster"]] as const) {
      expect(decode(buildWhatsAppLink({ topic, lang: "he" }))).toContain(needle);
    }
  });
});

describe("nothing machine-looking is ever appended", () => {
  const topics: WhatsAppTopic[] = [
    "general", "dsd", "owd", "aow", "rescue", "dm", "idc", "fun-dive",
    "koh-tao", "refresher", "kp-licensed", "kp-beginner",
    "similan-safari", "similan-daytrip", "conservation",
  ];
  for (const topic of topics) {
    for (const lang of LANGS) {
      it(`${topic} / ${lang} has no tag or attribution line`, () => {
        const text = decode(buildWhatsAppLink({ topic, lang }));
        expect(text).not.toMatch(/\[ref:/);
        expect(text).not.toMatch(/\[[a-z]+:/i);
        expect(text).not.toContain("\n");
        expect(text.trim()).toBe(text);
      });
    }
  }
});

describe("French is no longer collapsed to English", () => {
  it("normalizeLang preserves fr", () => {
    expect(normalizeLang("fr")).toBe("fr");
  });
  it("a French visitor gets a French sentence, not the English one", () => {
    const fr = decode(buildWhatsAppLink({ topic: "owd", lang: "fr" }));
    const en = decode(buildWhatsAppLink({ topic: "owd", lang: "en" }));
    expect(fr).not.toBe(en);
    expect(fr).toContain("Bonjour Nemo");
  });
});

describe("conservation stays human - it goes to Paul, not Nemo", () => {
  for (const lang of LANGS) {
    it(`${lang} conservation prefill never greets the bot`, () => {
      const href = buildWhatsAppLink({ topic: "conservation", lang });
      expect(href).toContain(CONSERVATION_WHATSAPP_NUMBER);
      const text = decode(href);
      expect(text).not.toContain("Nemo");
      expect(text).not.toContain("נמו");
    });
  }
  it("the per-course variant also avoids the bot name", () => {
    const text = decode(
      buildWhatsAppLink({ topic: "conservation", lang: "en", courseName: "Coral Restoration" }),
    );
    expect(text).toContain("Coral Restoration");
    expect(text).not.toContain("Nemo");
  });
});

describe("the /fun-dives lander carries the same sentence", () => {
  const expected: Record<string, string> = {
    en: "fun diving", he: "צלילות כיף", es: "buceo recreativo", fr: "la plongée loisir",
  };
  for (const lang of LANGS) {
    it(`${lang} lander waMessage is routable`, () => {
      const msg = FUN_DIVE_COPY[lang].waMessage;
      expect(msg).toContain(expected[lang]);
      expect(msg).not.toMatch(/\[ref:/);
    });
  }
});
