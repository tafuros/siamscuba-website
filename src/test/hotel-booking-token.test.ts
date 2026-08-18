import { describe, it, expect } from "vitest";
import {
  signToken,
  verifyToken,
  makeRef,
  REF_ALPHABET,
  type TokenPayload,
} from "../../api/hotel-booking";

const KEY = "test-secret";
const NOW = Date.parse("2026-08-18T12:00:00Z");

const payload: TokenPayload = {
  typ: "decide",
  ref: "SH-0818-K7M2",
  room: "garden-bungalow",
  checkIn: "2026-09-01",
  checkOut: "2026-09-04",
  guests: 2,
  name: "Test Guest",
  email: "guest@example.com",
  lang: "en",
  exp: NOW + 86_400_000,
};

describe("hotel booking tokens", () => {
  it("round-trips sign -> verify", () => {
    const token = signToken(payload, KEY);
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    const v = verifyToken(token, KEY, NOW);
    expect(v.ok).toBe(true);
    if (v.ok) expect(v.payload).toEqual(payload);
  });

  it("rejects a tampered payload", () => {
    const token = signToken(payload, KEY);
    const [p, sig] = token.split(".");
    const forged = Buffer.from(
      JSON.stringify({ ...payload, room: "sea-front-bungalow" }),
      "utf8",
    ).toString("base64url");
    const v = verifyToken(`${forged}.${sig}`, KEY, NOW);
    expect(v).toEqual({ ok: false, reason: "invalid" });
    // and the original payload half with a truncated signature also fails
    expect(verifyToken(`${p}.${sig.slice(0, -2)}xx`, KEY, NOW).ok).toBe(false);
  });

  it("rejects a token signed with a different secret", () => {
    const token = signToken(payload, "other-secret");
    expect(verifyToken(token, KEY, NOW)).toEqual({ ok: false, reason: "invalid" });
  });

  it("rejects an expired token with a distinct reason", () => {
    const token = signToken({ ...payload, exp: NOW - 1000 }, KEY);
    expect(verifyToken(token, KEY, NOW)).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects garbage tokens without throwing", () => {
    for (const junk of ["", "abc", "a.b.c", "!!!.???", "onlypayload."]) {
      const v = verifyToken(junk, KEY, NOW);
      expect(v.ok).toBe(false);
    }
  });

  // Refs issued before the SH-MMDD-XXXX format live on inside tokens that are
  // still in guests' inboxes - opening one must keep working.
  it("still verifies a token carrying a legacy HB- reference", () => {
    const legacy = { ...payload, ref: "HB-msypmni4-kdno" };
    const v = verifyToken(signToken(legacy, KEY), KEY, NOW);
    expect(v.ok).toBe(true);
    if (v.ok) expect(v.payload.ref).toBe("HB-msypmni4-kdno");
  });
});

const REF_RE = /^SH-\d{4}-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{4}$/;

describe("makeRef", () => {
  it("matches the SH-MMDD-XXXX format", () => {
    const ref = makeRef(NOW);
    expect(ref).toMatch(REF_RE);
    expect(ref).toHaveLength(12);
    expect(ref).toBe(ref.toUpperCase());
  });

  it("dates the ref by the day in Koh Tao (UTC+7)", () => {
    expect(makeRef(NOW).slice(0, 8)).toBe("SH-0818-");
    // 18:00 UTC on 5 Jan is already the 6th at the hotel
    expect(makeRef(Date.parse("2026-01-05T18:00:00Z")).slice(0, 8)).toBe("SH-0106-");
  });

  it("draws the tail only from the unambiguous alphabet", () => {
    expect(REF_ALPHABET).toBe("23456789ABCDEFGHJKMNPQRSTVWXYZ");
    const tails = Array.from({ length: 300 }, () => makeRef(NOW).slice(-4));
    for (const tail of tails) {
      for (const ch of tail) expect(REF_ALPHABET).toContain(ch);
    }
    // never the look-alikes: 0/O, 1/I/L, U
    expect(tails.join("")).not.toMatch(/[01OILU]/);
  });

  it("produces distinct refs at the same timestamp (random suffix)", () => {
    const refs = new Set(Array.from({ length: 50 }, () => makeRef(NOW)));
    expect(refs.size).toBeGreaterThan(1);
  });
});
