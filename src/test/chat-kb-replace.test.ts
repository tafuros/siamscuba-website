// REPLACE semantics for DiveOS KB overrides (api/chat.ts): an override whose
// `source` exactly matches a base-KB record must DROP that record from the
// cached base block, while the override text rides in the uncached corrections
// block. Cache constraint: the base block may depend only on the SET of
// overridden sources, never on override text.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { systemBlocks } from "../../api/chat";

const kb = JSON.parse(readFileSync(join(process.cwd(), "api/_kb.json"), "utf8")) as {
  source: string;
  text: string;
}[];
const someSource = kb[0].source;

const baseText = (blocks: ReturnType<typeof systemBlocks>) => blocks[1].text;
const correctionsText = (blocks: ReturnType<typeof systemBlocks>) => blocks[2]?.text ?? "";

describe("KB override REPLACE semantics", () => {
  it("no overrides (failure-open) -> full base KB, no corrections block", () => {
    const blocks = systemBlocks("en", []);
    expect(blocks).toHaveLength(2);
    expect(blocks[1].cache_control).toEqual({ type: "ephemeral" });
    expect(baseText(blocks)).toContain(`### ${someSource}`);
  });

  it("override matching a base source drops it from the base and carries it in corrections", () => {
    const blocks = systemBlocks("en", [{ source: someSource, text: "CORRECTED FACT" }]);
    expect(baseText(blocks)).not.toContain(`### ${someSource}`);
    expect(correctionsText(blocks)).toContain(`### ${someSource}`);
    expect(correctionsText(blocks)).toContain("CORRECTED FACT");
    // Only the matched record is dropped - the rest of the base survives.
    expect(baseText(blocks)).toContain(`### ${kb[1].source}`);
  });

  it("base block depends only on the source SET, not override text (cache stability)", () => {
    const a = systemBlocks("en", [{ source: someSource, text: "version one" }]);
    const b = systemBlocks("en", [{ source: someSource, text: "version two, edited" }]);
    expect(baseText(a)).toBe(baseText(b)); // identical (memoized) cached prefix
    expect(correctionsText(a)).not.toBe(correctionsText(b));
  });

  it("non-matching override source leaves the base untouched (pure addition)", () => {
    const blocks = systemBlocks("en", [{ source: "lead-handling", text: "push the form" }]);
    expect(baseText(blocks)).toBe(baseText(systemBlocks("en", [])));
    expect(correctionsText(blocks)).toContain("lead-handling");
  });

  it("lang-scoped override only replaces for its own lang", () => {
    const override = [{ source: someSource, text: "עובדה", lang: "he" }];
    expect(baseText(systemBlocks("he", override))).not.toContain(`### ${someSource}`);
    expect(baseText(systemBlocks("en", override))).toContain(`### ${someSource}`);
    expect(correctionsText(systemBlocks("en", override))).toBe("");
  });
});
