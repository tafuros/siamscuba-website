// URL locale-prefix -> language derivation (src/i18n/LanguageContext.tsx).
// Real prefixes per src/routes.tsx: /es/*, /he + /he/*, /fr/*.
import { describe, it, expect } from "vitest";
import { pathLanguage } from "../i18n/LanguageContext";

describe("pathLanguage", () => {
  it("detects real locale prefixes", () => {
    expect(pathLanguage("/es/fun-dives")).toBe("es");
    expect(pathLanguage("/es/blog/mejores-sitios")).toBe("es");
    expect(pathLanguage("/he")).toBe("he");
    expect(pathLanguage("/he/open-water-course")).toBe("he");
    expect(pathLanguage("/fr/fun-dives")).toBe("fr");
  });

  it("returns null on unprefixed pages", () => {
    expect(pathLanguage("/")).toBeNull();
    expect(pathLanguage("/fun-dive-booking")).toBeNull();
    expect(pathLanguage("/blog/koh-tao-diving-cost-guide")).toBeNull();
  });

  it("does not false-match slugs that merely start with a locale code", () => {
    expect(pathLanguage("/freediving")).toBeNull(); // NOT fr
    expect(pathLanguage("/hebrew-guide")).toBeNull(); // NOT he
    expect(pathLanguage("/estonia")).toBeNull(); // NOT es
  });
});
