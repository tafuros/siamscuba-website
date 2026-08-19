import { describe, it, expect } from "vitest";
import { buildEmail, formatDecidedAt, renderTemplate, type Lang } from "../../api/hotel-booking";

const LANGS: Lang[] = ["en", "he", "es", "fr"];
const KINDS = ["provisional", "final", "decline"] as const;

const req = {
  room: "garden-bungalow",
  checkIn: "2026-09-01",
  checkOut: "2026-09-04",
  nights: 3,
  guests: 2,
  name: "Test Guest",
  email: "guest@example.com",
  lang: "en" as Lang,
  ref: "SH-0818-K7M2",
};

describe("renderTemplate", () => {
  it("interpolates and HTML-escapes values", () => {
    expect(renderTemplate("Hi {{name}}!", { name: '<b>&"x"</b>' })).toBe(
      "Hi &lt;b&gt;&amp;&quot;x&quot;&lt;/b&gt;!",
    );
  });

  it("keeps sections only when the value is non-empty", () => {
    const tpl = "a{{#alt}} [{{alt}}] {{/alt}}b";
    expect(renderTemplate(tpl, { alt: "yes" })).toBe("a [yes] b");
    expect(renderTemplate(tpl, { alt: "" })).toBe("ab");
    expect(renderTemplate(tpl, {})).toBe("ab");
  });
});

describe("email templates - all kinds x all languages", () => {
  for (const kind of KINDS) {
    for (const lang of LANGS) {
      it(`${kind}/${lang} renders fully with no leftover placeholders`, () => {
        const { subject, html } = buildEmail(kind, lang, req, {
          registerUrl: "https://siamscuba.com/hotel/book?ref=tok",
          alternative: kind === "decline" ? "Another room" : undefined,
        });
        expect(subject.length).toBeGreaterThan(5);
        expect(subject).toContain(req.ref);
        expect(html).not.toMatch(/\{\{/);
        expect(html).toContain(req.ref);
        // localized room name from the data file, not the slug
        expect(html).not.toContain("garden-bungalow");
        if (lang === "he") expect(html).toContain('dir="rtl"');
        else expect(html).not.toContain('dir="rtl"');
      });
    }
  }

  it("final email carries the register link, times, address and price", () => {
    const { html } = buildEmail("final", "en", req, {
      registerUrl: "https://siamscuba.com/hotel/book?ref=tok123",
    });
    expect(html).toContain("https://siamscuba.com/hotel/book?ref=tok123");
    expect(html).toContain("14:00");
    expect(html).toContain("11:00");
    expect(html).toContain("Sairee Beach");
    expect(html).toContain("฿2,370"); // garden-bungalow price from _hotel-data.json
    expect(html).toContain("3,000 THB");
  });

  it("dorm price renders per bed", () => {
    const { html } = buildEmail("final", "en", { ...req, room: "divers-dorm" }, { registerUrl: "x" });
    expect(html).toContain("฿500");
    expect(html).toContain("/ bed / night");
  });

  it("decline email includes the alternative only when given", () => {
    const withAlt = buildEmail("decline", "en", req, { alternative: "Sea Front for the same dates" });
    expect(withAlt.html).toContain("Sea Front for the same dates");
    const withoutAlt = buildEmail("decline", "en", req, {});
    expect(withoutAlt.html).not.toContain("instead");
    expect(withoutAlt.html).toContain("wa.me/66825068898");
  });

  it("shows the reference as its own highlighted band, not inline text", () => {
    for (const lang of LANGS) {
      const { html, subject } = buildEmail("provisional", lang, { ...req, lang }, {});
      // the band: bordered, tinted, large and letter-spaced, forced LTR
      expect(html).toContain("border:1.5px solid #cfe0ee");
      expect(html).toMatch(
        /<div dir="ltr" style="font-family:[^"]*monospace;font-size:24px;font-weight:700;letter-spacing:0\.16em;[^"]*">SH-0818-K7M2<\/div>/,
      );
      // no more "(ref ...)" parenthetical anywhere
      expect(html).not.toContain(`(${req.ref})`);
      // and the subject carries the ref in the new format
      expect(subject).toContain(`· ${req.ref}`);
    }
  });

  it("labels the reference band in the guest's language", () => {
    const labels: Record<Lang, string> = {
      en: "Your reference",
      he: "מספר הבקשה שלך",
      es: "Tu referencia",
      fr: "Votre référence",
    };
    for (const lang of LANGS) {
      const { html } = buildEmail("final", lang, { ...req, lang }, { registerUrl: "x" });
      expect(html).toContain(labels[lang]);
    }
  });

  // The money wording is the part a guest can hold us to, so every language is
  // checked for the same three truths rather than only English.
  describe("the 1,000 THB hold reads honestly in all four languages", () => {
    const heldNow: Record<Lang, string> = {
      en: "is being held on your card - not charged",
      he: "מוקפאים בכרטיס שלכם - לא נגבו",
      es: "quedan retenidos en tu tarjeta, no cobrados",
      fr: "sont bloqués sur votre carte, pas débités",
    };
    // Bolded and amount-carrying, so it cannot accidentally match the
    // "Nothing has been charged" line of the opposite variant.
    const charged: Record<Lang, string> = {
      en: "<strong>฿1,000 has been charged</strong>",
      he: "<strong>฿1,000 נגבו</strong>",
      es: "<strong>Se han cobrado ฿1.000</strong>",
      fr: "<strong>฿1 000 ont été débités</strong>",
    };
    /** The amount as the guest's own locale groups it. */
    const amount: Record<Lang, string> = {
      en: "฿1,000",
      he: "฿1,000",
      es: "฿1.000",
      fr: "฿1 000",
    };
    const notCharged: Record<Lang, string> = {
      en: "Nothing has been charged",
      he: "לא נגבה שום תשלום",
      es: "No se ha cobrado nada",
      fr: "Rien n'a été débité",
    };
    const releasedWord: Record<Lang, string> = {
      en: "has been released",
      he: "שוחררה",
      es: "ha sido liberada",
      fr: "a été levé",
    };

    it.each(LANGS)("%s provisional says the money is held, not taken", (lang) => {
      const { html } = buildEmail("provisional", lang, { ...req, lang });
      expect(html).toContain(amount[lang]);
      expect(html).toContain(heldNow[lang]);
    });

    it.each(LANGS)("%s final credits a captured hold against the bill", (lang) => {
      const { html } = buildEmail("final", lang, { ...req, lang }, { registerUrl: "x", prepaid: true });
      expect(html).toContain(amount[lang]);
      expect(html).toContain(charged[lang]);
      expect(html).not.toContain(notCharged[lang]);
      // still a separate security deposit at check-in, unchanged
      expect(html).toMatch(/3[,.\s]000/);
    });

    it.each(LANGS)("%s final says nothing was charged when no hold was captured", (lang) => {
      const { html } = buildEmail("final", lang, { ...req, lang }, { registerUrl: "x", prepaid: false });
      expect(html).toContain(notCharged[lang]);
      expect(html).not.toContain(charged[lang]);
    });

    it.each(LANGS)("%s decline says the hold was released", (lang) => {
      const { html } = buildEmail("decline", lang, { ...req, lang }, { released: true });
      expect(html).toContain(amount[lang]);
      expect(html).toContain(releasedWord[lang]);
      // and points back at the hotel page for other dates / rooms
      expect(html).toContain("/hotel");
    });

    it.each(LANGS)("%s decline claims no release when there was no hold", (lang) => {
      const { html } = buildEmail("decline", lang, { ...req, lang }, { released: false });
      expect(html).not.toContain(releasedWord[lang]);
    });

    it("never calls the prepayment a refundable deposit", () => {
      for (const lang of LANGS) {
        const { html } = buildEmail("final", lang, { ...req, lang }, { registerUrl: "x", prepaid: true });
        expect(html.toLowerCase()).not.toMatch(/refundable (deposit|hold)/);
      }
    });
  });

  it("escapes hostile guest input", () => {
    const { html } = buildEmail("provisional", "en", { ...req, name: '<script>alert(1)</script>' });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("pluralizes nights per language", () => {
    const one = buildEmail("provisional", "en", { ...req, nights: 1 });
    expect(one.html).toContain("1 night");
    expect(one.html).not.toContain("1 nights");
    const he = buildEmail("provisional", "he", { ...req, nights: 3 });
    expect(he.html).toContain("3 לילות");
  });
});

// The decided page once showed "approved at unknown time" for every repeat tap:
// the workflow returns the instant as `at`, the engine read `decidedAt`.
describe("formatDecidedAt", () => {
  it("renders the instant in Koh Tao time", () => {
    // 02:36 UTC is 09:36 in Asia/Bangkok
    expect(formatDecidedAt("2026-08-19T02:36:58.967Z")).toContain("09:36");
    expect(formatDecidedAt("2026-08-19T02:36:58.967Z")).toContain("19 Aug");
  });

  it("falls back instead of printing an empty or broken time", () => {
    expect(formatDecidedAt(undefined)).toBe("an earlier time");
    expect(formatDecidedAt("not-a-date")).toBe("an earlier time");
  });
});
