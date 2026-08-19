import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  processRequest,
  signToken,
  __resetStateForTests,
} from "../../api/hotel-booking";

// All of these run fully OFFLINE: with RESEND_API_KEY / HOTEL_NOTIFY_* unset
// the engine is in log-only email mode and skips the n8n calls, and with
// PAYPAL_* unset the hold provider is the simulated one, so no network is
// touched. HOTEL_BOOKING_SECRET is pinned for deterministic tokens.

const NOW = Date.parse("2026-08-18T12:00:00Z"); // Bangkok "today" = 2026-08-18
const SECRET = "test-secret";

let ipCounter = 0;
const nextIp = () => `10.0.0.${++ipCounter}`;

const validBody = () => ({
  room: "garden-bungalow",
  checkIn: "2026-09-01",
  checkOut: "2026-09-04",
  guests: 2,
  name: "Test Guest",
  email: `guest${++ipCounter}@example.com`,
  lang: "en",
  openedAt: NOW - 10_000,
});

/** Stage 1a - validate and open the hold. */
const create = (body: Record<string, unknown>, ip = nextIp()) =>
  processRequest({ method: "POST", query: { action: "hold" }, body, ip, now: NOW });

/** Stage 1a + 1b - the full path a guest who actually pays takes. */
async function createAndPay(body: Record<string, unknown>, ip = nextIp()) {
  const held = JSON.parse((await create(body, ip)).body);
  if (!held.holdToken) return { held, confirmed: held };
  const out = await processRequest({
    method: "POST",
    query: { action: "confirm-hold" },
    body: { holdToken: held.holdToken, orderId: held.orderId },
    ip,
    now: NOW,
  });
  return { held, confirmed: JSON.parse(out.body), status: out.status };
}

beforeEach(() => {
  vi.stubEnv("HOTEL_BOOKING_SECRET", SECRET);
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("HOTEL_NOTIFY_URL", "");
  vi.stubEnv("HOTEL_NOTIFY_TOKEN", "");
  vi.stubEnv("PAYPAL_CLIENT_ID", "");
  vi.stubEnv("PAYPAL_SECRET", "");
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  __resetStateForTests();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("create request - happy path (log-only mode)", () => {
  it("accepts a valid request and returns a ref", async () => {
    const { confirmed, status } = await createAndPay(validBody());
    expect(status).toBe(200);
    expect(confirmed.ok).toBe(true);
    expect(confirmed.ref).toMatch(/^SH-\d{4}-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{4}$/);
    expect(confirmed.emailMode).toBe("log");
  });

  it("keeps the ref issued at hold time all the way to the confirmed request", async () => {
    const { held, confirmed } = await createAndPay(validBody());
    expect(held.ref).toMatch(/^SH-/);
    expect(confirmed.ref).toBe(held.ref);
  });

  it("logs the provisional email and the requested event with a decideUrl", async () => {
    const logs: string[] = [];
    (console.log as ReturnType<typeof vi.fn>).mockImplementation((...args: unknown[]) => {
      logs.push(args.map(String).join(" "));
    });
    const { status } = await createAndPay(validBody());
    expect(status).toBe(200);
    const emailLog = logs.find((l) => l.includes("EMAIL (log-only mode)"));
    expect(emailLog).toBeTruthy();
    expect(emailLog).toContain("hotel@siamscuba.com");
    const notifyLog = logs.find((l) => l.includes('"event":"requested"'));
    expect(notifyLog).toBeTruthy();
    expect(notifyLog).toContain("https://siamscuba.com/api/hotel-booking?t=");
  });
});

describe("create request - anti-abuse", () => {
  it("honeypot: filled website field fakes a success and sends nothing", async () => {
    const logs: string[] = [];
    (console.log as ReturnType<typeof vi.fn>).mockImplementation((...args: unknown[]) => {
      logs.push(args.map(String).join(" "));
    });
    // Right through to confirm: the decoy hold must stay indistinguishable
    // from a real one and still create nothing.
    const { held, confirmed } = await createAndPay({ ...validBody(), website: "https://spam.example" });
    expect(held.ok).toBe(true);
    expect(held.ref).toMatch(/^SH-/);
    expect(confirmed.ok).toBe(true);
    expect(logs.some((l) => l.includes("EMAIL"))).toBe(false);
    expect(logs.some((l) => l.includes('"event":"requested"'))).toBe(false);
    expect(logs.some((l) => l.includes("HOLD (simulated mode) authorized"))).toBe(false);
  });

  it("rejects submits faster than 2s after form open", async () => {
    const out = await create({ ...validBody(), openedAt: NOW - 500 });
    expect(out.status).toBe(400);
    expect(JSON.parse(out.body).error).toBe("too_fast");
  });

  it("rejects a missing openedAt", async () => {
    const body = validBody() as Record<string, unknown>;
    delete body.openedAt;
    const out = await create(body);
    expect(out.status).toBe(400);
    expect(JSON.parse(out.body).error).toBe("too_fast");
  });

  it("dedupes the same email within the window - same ref, once", async () => {
    const body = validBody();
    const first = await createAndPay(body);
    const second = await createAndPay(body);
    expect(second.confirmed.ref).toBe(first.confirmed.ref);
    expect(second.confirmed.duplicate).toBe(true);
  });

  it("rate limits a bursting IP", async () => {
    const ip = nextIp();
    let limited = 0;
    for (let i = 0; i < 12; i++) {
      const out = await create({ ...validBody(), email: `burst${i}@example.com` }, ip);
      if (out.status === 429) limited++;
    }
    expect(limited).toBeGreaterThan(0);
  });
});

describe("create request - validation", () => {
  const cases: [string, Record<string, unknown>, string][] = [
    ["unknown room", { room: "presidential-suite" }, "invalid_room"],
    ["sold-out room", { room: "superior-room" }, "invalid_room"],
    ["check-in in the past", { checkIn: "2026-08-10", checkOut: "2026-08-20" }, "invalid_dates"],
    ["check-out not after check-in", { checkIn: "2026-09-01", checkOut: "2026-09-01" }, "invalid_dates"],
    ["check-out before check-in", { checkIn: "2026-09-04", checkOut: "2026-09-01" }, "invalid_dates"],
    ["more than 30 nights", { checkIn: "2026-09-01", checkOut: "2026-10-15" }, "invalid_dates"],
    ["garbage date", { checkIn: "01/09/2026" }, "invalid_dates"],
    ["zero guests", { guests: 0 }, "invalid_guests"],
    ["too many guests", { guests: 7 }, "invalid_guests"],
    ["fractional guests", { guests: 2.5 }, "invalid_guests"],
    ["missing name", { name: "" }, "invalid_name"],
    ["bad email", { email: "not-an-email" }, "invalid_email"],
    ["oversized notes", { notes: "x".repeat(301) }, "invalid_notes"],
    ["unsupported lang", { lang: "de" }, "invalid_lang"],
  ];

  it.each(cases)("rejects %s", async (_label, patch, error) => {
    const out = await create({ ...validBody(), ...patch });
    expect(out.status).toBe(400);
    expect(JSON.parse(out.body).error).toBe(error);
  });

  it("rejects non-POST/GET methods and unknown actions", async () => {
    expect((await processRequest({ method: "DELETE", query: {}, body: {}, ip: nextIp(), now: NOW })).status).toBe(405);
    expect(
      (await processRequest({ method: "POST", query: { t: "x.y", action: "explode" }, body: {}, ip: nextIp(), now: NOW }))
        .status,
    ).toBe(400);
    expect((await processRequest({ method: "GET", query: {}, body: {}, ip: nextIp(), now: NOW })).status).toBe(400);
  });
});

describe("decision + registration flow (offline, log mode)", () => {
  // Deliberately a LEGACY HB- ref: tokens issued before the SH-MMDD-XXXX
  // format must keep opening and deciding normally.
  const decideToken = () =>
    signToken(
      {
        typ: "decide",
        ref: "HB-flow0001-test",
        room: "divers-dorm",
        checkIn: "2026-09-01",
        checkOut: "2026-09-03",
        guests: 1,
        name: "Flow Tester",
        email: "flow@example.com",
        lang: "fr",
        exp: NOW + 86_400_000,
      },
      SECRET,
    );

  it("GET renders the read-only decision page", async () => {
    const out = await processRequest({
      method: "GET",
      query: { t: decideToken() },
      body: {},
      ip: nextIp(),
      now: NOW,
    });
    expect(out.status).toBe(200);
    expect(out.contentType).toContain("text/html");
    expect(out.body).toContain("Divers Dorm");
    expect(out.body).toContain("action=approve");
    expect(out.body).toContain("action=decline");
    expect(out.body).toContain("Flow Tester");
    // the reference is its own emphasized block, not a line in the summary
    expect(out.body).toContain('<div class="ref">HB-flow0001-test</div>');
    expect(out.body).toContain('class="reflabel"');
  });

  it("GET with an expired token renders the expired page (410)", async () => {
    const expired = signToken(
      { typ: "decide", ref: "HB-x-y", room: "divers-dorm", checkIn: "2026-08-01", checkOut: "2026-08-02", guests: 1, name: "X", email: "x@example.com", lang: "en", exp: NOW - 1 },
      SECRET,
    );
    const out = await processRequest({ method: "GET", query: { t: expired }, body: {}, ip: nextIp(), now: NOW });
    expect(out.status).toBe(410);
    expect(out.body).toContain("expired");
  });

  it("POST approve emails the final confirmation with a working register link", async () => {
    const logs: string[] = [];
    (console.log as ReturnType<typeof vi.fn>).mockImplementation((...args: unknown[]) => {
      logs.push(args.map(String).join(" "));
    });
    const out = await processRequest({
      method: "POST",
      query: { t: decideToken(), action: "approve" },
      body: {},
      ip: nextIp(),
      now: NOW,
    });
    expect(out.status).toBe(200);
    expect(out.body).toContain("guest emailed");
    expect(out.body).toContain('<div class="ref">HB-flow0001-test</div>');

    const emailLog = logs.find((l) => l.includes("EMAIL (log-only mode)"));
    expect(emailLog).toBeTruthy();
    const m = emailLog!.match(/https:\/\/siamscuba\.com\/hotel\/book\?ref=([A-Za-z0-9_.-]+)/);
    expect(m).toBeTruthy();

    // the guest token from the email verifies and completes registration
    const reg = await processRequest({
      method: "POST",
      query: { action: "register" },
      body: { token: m![1], details: { arrivalTime: "15:00", ferry: "Lomprayah", nationality: "French", requests: "" } },
      ip: nextIp(),
      now: NOW,
    });
    expect(reg.status).toBe(200);
    expect(JSON.parse(reg.body).ok).toBe(true);
    expect(logs.some((l) => l.includes('"event":"registration_completed"'))).toBe(true);
  });

  it("POST decline includes Ben's alternative in the email", async () => {
    const logs: string[] = [];
    (console.log as ReturnType<typeof vi.fn>).mockImplementation((...args: unknown[]) => {
      logs.push(args.map(String).join(" "));
    });
    const out = await processRequest({
      method: "POST",
      query: { t: decideToken(), action: "decline" },
      body: { alternative: "Garden Bungalow same dates" },
      ip: nextIp(),
      now: NOW,
    });
    expect(out.status).toBe(200);
    const emailLog = logs.find((l) => l.includes("EMAIL (log-only mode)"));
    expect(emailLog).toContain("Garden Bungalow same dates");
    expect(logs.some((l) => l.includes('"event":"declined"'))).toBe(true);
  });

  it("register rejects a decide-token (wrong typ) and bad tokens", async () => {
    const wrongTyp = await processRequest({
      method: "POST",
      query: { action: "register" },
      body: { token: decideToken(), details: {} },
      ip: nextIp(),
      now: NOW,
    });
    expect(wrongTyp.status).toBe(400);
    const junk = await processRequest({
      method: "POST",
      query: { action: "register" },
      body: { token: "abc.def", details: {} },
      ip: nextIp(),
      now: NOW,
    });
    expect(junk.status).toBe(400);
  });
});
