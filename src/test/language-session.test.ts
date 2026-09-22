import { describe, expect, it } from "vitest";
import { initialLanguageFor } from "@/i18n/LanguageContext";

// Which language an unprefixed page adopts on a FRESH page load.
// session = sessionStorage "siam-lang-session" (this visit), saved = localStorage "siam-lang".
describe("initialLanguageFor", () => {
  it("Ben's bug: on /es, a full load to /#courses stays Spanish despite an old saved Hebrew", () => {
    expect(initialLanguageFor("es", "he")).toBe("es");
  });

  it("this visit's language outranks the saved one in every direction", () => {
    expect(initialLanguageFor("fr", "es")).toBe("fr");
    expect(initialLanguageFor("en", "he")).toBe("en");
  });

  it("a new visit (no session yet) falls back to the saved choice", () => {
    expect(initialLanguageFor(null, "he")).toBe("he");
  });

  it("nothing known -> null (page keeps its SSG English)", () => {
    expect(initialLanguageFor(null, null)).toBeNull();
    expect(initialLanguageFor("xx", "yy")).toBeNull();
  });
});
