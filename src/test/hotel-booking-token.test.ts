import { describe, it, expect } from "vitest";
import {
  signToken,
  verifyToken,
  makeRef,
  type TokenPayload,
} from "../../api/hotel-booking";

const KEY = "test-secret";
const NOW = Date.parse("2026-08-18T12:00:00Z");

const payload: TokenPayload = {
  typ: "decide",
  ref: "HB-test1234-abcd",
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
});

describe("makeRef", () => {
  it("matches the HB-<base36 ts>-<4 chars> format", () => {
    const ref = makeRef(NOW);
    expect(ref).toMatch(/^HB-[0-9a-z]+-[0-9a-z]{4}$/);
    expect(ref.startsWith(`HB-${NOW.toString(36)}-`)).toBe(true);
  });

  it("produces distinct refs at the same timestamp (random suffix)", () => {
    const refs = new Set(Array.from({ length: 50 }, () => makeRef(NOW)));
    expect(refs.size).toBeGreaterThan(1);
  });
});
