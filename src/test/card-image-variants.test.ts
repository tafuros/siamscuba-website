import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { cardSrcSet } from "@/lib/cardImage";

// Every photo cardSrcSet advertises must have its -640 and -960 siblings in
// /public, or the lander card silently shows a broken image on phones.
describe("card image variants", () => {
  const listed = [
    "/dive-sites/chumphon-pinnacle.webp",
    "/dive-sites/sail-rock.webp",
    "/dive-sites/twins.webp",
    "/blog/whale-shark-koh-tao.webp",
  ];

  it.each(listed)("%s has every file its srcSet names", (src) => {
    const set = cardSrcSet(src);
    expect(set).toBeDefined();
    for (const entry of set!.split(",")) {
      const url = entry.trim().split(" ")[0];
      expect(existsSync(resolve(__dirname, "../../public", `.${url}`)), url).toBe(true);
    }
  });

  it("returns undefined for photos without variants (plain src, no srcSet)", () => {
    expect(cardSrcSet("/dive-sites/unknown.webp")).toBeUndefined();
  });
});
