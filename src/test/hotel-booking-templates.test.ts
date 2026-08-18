import { describe, it, expect } from "vitest";
import { buildEmail, renderTemplate, type Lang } from "../../api/hotel-booking";

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
  ref: "HB-test1234-abcd",
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
