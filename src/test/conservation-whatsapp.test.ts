import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildWhatsAppLink,
  WHATSAPP_NUMBER,
  CONSERVATION_WHATSAPP_NUMBER,
} from "@/utils/whatsapp";

// The /conservation page is the ONE page whose WhatsApp buttons must not reach
// the shop's shared inbox: conservation enquiries go straight to Paul, who owns
// the programme and wrote the page (Ben, 2026-08-07).
//
// This is exactly the kind of deliberate-looking-like-a-bug detail that a future
// session "fixes" back to the +66 shop number while tidying up, so it gets a
// tripwire rather than a comment.

const PAUL = "447467160704";
const SHOP = "66825068898";

describe("conservation WhatsApp routing", () => {
  it("keeps Paul's number and the shop number distinct", () => {
    expect(CONSERVATION_WHATSAPP_NUMBER).toBe(PAUL);
    expect(WHATSAPP_NUMBER).toBe(SHOP);
    expect(CONSERVATION_WHATSAPP_NUMBER).not.toBe(WHATSAPP_NUMBER);
  });

  it("builds a wa.me link to Paul when the override is passed", () => {
    const href = buildWhatsAppLink({
      offer: "general",
      lang: "en",
      number: CONSERVATION_WHATSAPP_NUMBER,
    });
    expect(href.startsWith(`https://wa.me/${PAUL}?text=`)).toBe(true);
    expect(href).not.toContain(SHOP);
  });

  it("still defaults every other caller to the shop number", () => {
    // The override must be opt-in. If this ever fails, some refactor has
    // repointed the whole site at one person's phone.
    expect(buildWhatsAppLink({ offer: "general", lang: "en" })).toContain(SHOP);
    expect(buildWhatsAppLink({ offer: "owd", lang: "he" })).toContain(SHOP);
    expect(buildWhatsAppLink()).toContain(SHOP);
  });

  it("wires the conservation page itself to Paul, not the shop", () => {
    const src = readFileSync(
      resolve(__dirname, "../pages/ConservationPage.tsx"),
      "utf-8",
    );
    // One link builder on the page, and it carries the override.
    expect(src).toContain("CONSERVATION_WHATSAPP_NUMBER");
    expect(src).toMatch(/number:\s*CONSERVATION_WHATSAPP_NUMBER/);
    // No hard-coded wa.me/<shop> slipped in alongside it.
    expect(src).not.toContain(SHOP);
  });
});
