import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  processRequest,
  signToken,
  verifyToken,
  classifyPaypalError,
  getHoldProvider,
  __resetStateForTests,
  __setSimulatedHoldState,
  HOLD_AMOUNT,
  HOLD_CURRENCY,
  type Lang,
} from "../../api/hotel-booking";

// The 1,000 THB availability hold. Everything here runs OFFLINE: PAYPAL_* unset
// puts the engine in SIMULATED hold mode (authorize/capture/void are logged, not
// called), RESEND_API_KEY unset keeps emails in log mode, and HOTEL_NOTIFY_*
// unset logs the n8n events instead of posting them. Assertions therefore read
// the console, which is exactly what a tester on a preview deployment sees.

const NOW = Date.parse("2026-08-18T12:00:00Z"); // Bangkok "today" = 2026-08-18
const SECRET = "test-secret";

let n = 0;
const nextIp = () => `10.9.0.${++n}`;

const validBody = () => ({
  room: "garden-bungalow",
  checkIn: "2026-09-01",
  checkOut: "2026-09-04",
  guests: 2,
  name: "Hold Tester",
  email: `hold${++n}@example.com`,
  lang: "en" as Lang,
  openedAt: NOW - 10_000,
});

let logs: string[] = [];
const captureLogs = () => {
  logs = [];
  const sink = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
  (console.log as ReturnType<typeof vi.fn>).mockImplementation(sink);
  (console.error as ReturnType<typeof vi.fn>).mockImplementation(sink);
};
const logged = (needle: string) => logs.filter((l) => l.includes(needle));

beforeEach(() => {
  vi.stubEnv("HOTEL_BOOKING_SECRET", SECRET);
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("HOTEL_NOTIFY_URL", "");
  vi.stubEnv("HOTEL_NOTIFY_TOKEN", "");
  vi.stubEnv("PAYPAL_CLIENT_ID", "");
  vi.stubEnv("PAYPAL_SECRET", "");
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  __resetStateForTests();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

const post = (query: Record<string, string>, body: unknown, ip = nextIp()) =>
  processRequest({ method: "POST", query, body, ip, now: NOW });

const openHold = async (body = validBody(), ip = nextIp()) =>
  JSON.parse((await post({ action: "hold" }, body, ip)).body);

/** hold -> confirm, i.e. a guest who went all the way through PayPal. */
async function bookedRequest(body = validBody()) {
  const ip = nextIp();
  const held = await openHold(body, ip);
  const out = await post({ action: "confirm-hold" }, { holdToken: held.holdToken, orderId: held.orderId }, ip);
  return { held, out, json: JSON.parse(out.body) };
}

/** Pull the decide token Ben would tap out of the logged `requested` event. */
function decideTokenFromLogs(): string {
  const notify = logged('"event":"requested"')[0];
  expect(notify, "requested event was logged").toBeTruthy();
  const m = notify.match(/hotel-booking\?t=([A-Za-z0-9_.-]+)/);
  expect(m, "decideUrl carried a token").toBeTruthy();
  return m![1];
}

// ---------------------------------------------------------------------------

describe("a request cannot exist without money behind it", () => {
  it("rejects the old no-payment create endpoint", async () => {
    const out = await post({}, validBody());
    expect(out.status).toBe(400);
    expect(JSON.parse(out.body).error).toBe("hold_required");
  });

  it("sends nothing and notifies nobody when only the hold was opened", async () => {
    captureLogs();
    const held = await openHold();
    expect(held.ok).toBe(true);
    expect(held.holdToken).toBeTruthy();
    // The guest walked away at the PayPal step.
    expect(logged("EMAIL")).toHaveLength(0);
    expect(logged('"event":"requested"')).toHaveLength(0);
  });

  it("validates the form BEFORE touching the provider", async () => {
    captureLogs();
    const out = await post({ action: "hold" }, { ...validBody(), guests: 99 });
    expect(out.status).toBe(400);
    expect(JSON.parse(out.body).error).toBe("invalid_guests");
    expect(logged("HOLD (simulated mode) would authorize")).toHaveLength(0);
  });

  it("creates nothing when the authorization fails", async () => {
    const held = await openHold();
    captureLogs();
    // An order id that does not belong to this signed hold token.
    const out = await post({ action: "confirm-hold" }, { holdToken: held.holdToken, orderId: "SIMORDER-someone-else" });
    expect(out.status).toBe(402);
    expect(JSON.parse(out.body).error).toBe("hold_not_authorized");
    expect(logged("EMAIL")).toHaveLength(0);
    expect(logged('"event":"requested"')).toHaveLength(0);
  });

  it("refuses an expired hold token", async () => {
    const stale = signToken(
      {
        typ: "hold",
        nonce: "n",
        ref: "SH-0818-AAAA",
        room: "garden-bungalow",
        checkIn: "2026-09-01",
        checkOut: "2026-09-04",
        guests: 2,
        name: "Slow Guest",
        email: "slow@example.com",
        lang: "en",
        exp: NOW - 1,
      },
      SECRET,
    );
    const out = await post({ action: "confirm-hold" }, { holdToken: stale, orderId: "SIMORDER-n" });
    expect(out.status).toBe(410);
    expect(JSON.parse(out.body).error).toBe("hold_expired");
  });

  it("refuses a decide token used as a hold token", async () => {
    const wrongTyp = signToken(
      {
        typ: "decide",
        ref: "SH-0818-BBBB",
        room: "garden-bungalow",
        checkIn: "2026-09-01",
        checkOut: "2026-09-04",
        guests: 2,
        name: "X",
        email: "x@example.com",
        lang: "en",
        exp: NOW + 86_400_000,
      },
      SECRET,
    );
    const out = await post({ action: "confirm-hold" }, { holdToken: wrongTyp, orderId: "SIMORDER-x" });
    expect(out.status).toBe(400);
    expect(JSON.parse(out.body).error).toBe("hold_invalid");
  });
});

describe("the authorization id travels with the request", () => {
  it("bakes the auth id into the decide token and mirrors it to the audit log", async () => {
    captureLogs();
    const { json } = await bookedRequest();
    expect(json.ok).toBe(true);

    const notify = logged('"event":"requested"')[0];
    const event = JSON.parse(notify.slice(notify.indexOf("{")));
    expect(event.holdAuthId).toMatch(/^SIMAUTH-/);
    expect(event.holdAmount).toBe(HOLD_AMOUNT);
    expect(event.holdCurrency).toBe(HOLD_CURRENCY);
    expect(event.holdProvider).toBe("simulated");
    expect(event.holdSimulated).toBe(true);

    const v = verifyToken(decideTokenFromLogs(), SECRET, NOW);
    expect(v.ok).toBe(true);
    if (v.ok) {
      expect(v.payload.typ).toBe("decide");
      expect(v.payload.auth).toBe(event.holdAuthId);
      expect(v.payload.holdSim).toBe(true);
    }
  });

  it("shows Ben what the money will do before he taps", async () => {
    captureLogs();
    await bookedRequest();
    const token = decideTokenFromLogs();
    const page = await processRequest({ method: "GET", query: { t: token }, body: {}, ip: nextIp(), now: NOW });
    expect(page.status).toBe(200);
    expect(page.body).toContain("฿1,000 held");
    expect(page.body).toContain("credits it against their bill");
    expect(page.body).toContain("simulated - no real money");
  });
});

describe("approve captures", () => {
  it("charges the hold, then emails the guest the prepaid wording", async () => {
    captureLogs();
    await bookedRequest();
    const token = decideTokenFromLogs();

    const out = await post({ t: token, action: "approve" }, {});
    expect(out.status).toBe(200);
    expect(logged("HOLD (simulated mode) captured")).toHaveLength(1);
    expect(out.body).toContain("฿1,000 charged");
    expect(out.body).toContain("guest emailed");

    const email = logged("EMAIL (log-only mode)").at(-1)!;
    expect(email).toContain("฿1,000 has been charged");
    expect(email).toContain("comes straight off your bill");
    expect(email).not.toContain("Nothing has been charged");

    const decided = logged('"event":"approved"')[0];
    expect(JSON.parse(decided.slice(decided.indexOf("{"))).holdOutcome).toBe("captured");
  });

  it("captures exactly once when Ben taps twice", async () => {
    captureLogs();
    await bookedRequest();
    const token = decideTokenFromLogs();

    await post({ t: token, action: "approve" }, {});
    await post({ t: token, action: "approve" }, {});

    // The n8n status check is unavailable here (fails open), so this is the
    // provider-level guard doing the work: the second capture is a no-op.
    expect(logged("HOLD (simulated mode) captured")).toHaveLength(1);
    expect(logged("HOLD (simulated mode) capture skipped - already captured")).toHaveLength(1);
  });

  it("never double-charges once the status webhook reports a decision", async () => {
    captureLogs();
    await bookedRequest();
    const token = decideTokenFromLogs();
    await post({ t: token, action: "approve" }, {});

    vi.stubEnv("HOTEL_NOTIFY_URL", "https://n8n.example/hotel");
    vi.stubEnv("HOTEL_NOTIFY_TOKEN", "tok");
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ status: "approved", at: "2026-08-18T05:00:00.000Z" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const again = await post({ t: token, action: "approve" }, {});
    expect(again.status).toBe(200);
    expect(again.body).toContain("Already");
    expect(logged("HOLD (simulated mode) captured")).toHaveLength(1);
    fetchSpy.mockRestore();
  });

  it("tells Ben the truth when the hold has expired: nothing charged, nobody emailed", async () => {
    captureLogs();
    await bookedRequest();
    const token = decideTokenFromLogs();
    const v = verifyToken(token, SECRET, NOW);
    expect(v.ok).toBe(true);
    if (v.ok) __setSimulatedHoldState(v.payload.auth!, "expired");

    const emailsBefore = logged("EMAIL (log-only mode)").length;
    const out = await post({ t: token, action: "approve" }, {});
    expect(out.status).toBe(200);
    expect(out.body).toContain("Could not charge the hold");
    expect(out.body).toContain("has expired");
    expect(out.body).toContain("not</strong> been emailed");
    expect(out.body).not.toContain("guest emailed");
    expect(logged("EMAIL (log-only mode)")).toHaveLength(emailsBefore);

    const failure = logged('"event":"capture_failed"')[0];
    expect(failure).toBeTruthy();
    expect(JSON.parse(failure.slice(failure.indexOf("{"))).holdErrorCode).toBe("expired");
  });

  it("lets Ben approve anyway after an expired hold, with honest no-payment wording", async () => {
    captureLogs();
    await bookedRequest();
    const token = decideTokenFromLogs();
    const v = verifyToken(token, SECRET, NOW);
    if (v.ok) __setSimulatedHoldState(v.payload.auth!, "expired");

    const out = await post({ t: token, action: "approve" }, { nopay: "1" });
    expect(out.status).toBe(200);
    expect(out.body).toContain("guest emailed");
    expect(out.body).toContain("No payment taken");

    const email = logged("EMAIL (log-only mode)").at(-1)!;
    expect(email).toContain("Nothing has been charged");
    expect(email).not.toContain("has been charged</strong>");
  });
});

describe("decline voids", () => {
  it("releases the hold, then emails the guest that the money never moved", async () => {
    captureLogs();
    await bookedRequest();
    const token = decideTokenFromLogs();

    const out = await post({ t: token, action: "decline" }, { alternative: "Mermaid Room, same dates" });
    expect(out.status).toBe(200);
    expect(logged("HOLD (simulated mode) voided")).toHaveLength(1);
    expect(logged("HOLD (simulated mode) captured")).toHaveLength(0);
    expect(out.body).toContain("฿1,000 released");

    const email = logged("EMAIL (log-only mode)").at(-1)!;
    expect(email).toContain("hold has been released");
    expect(email).toContain("never took the money");
    expect(email).toContain("Mermaid Room, same dates");

    const decided = logged('"event":"declined"')[0];
    expect(JSON.parse(decided.slice(decided.indexOf("{"))).holdOutcome).toBe("voided");
  });

  it("refuses to send a decline email when the money was already taken", async () => {
    captureLogs();
    await bookedRequest();
    const token = decideTokenFromLogs();
    const v = verifyToken(token, SECRET, NOW);
    if (v.ok) __setSimulatedHoldState(v.payload.auth!, "captured");

    const emailsBefore = logged("EMAIL (log-only mode)").length;
    const out = await post({ t: token, action: "decline" }, {});
    expect(out.status).toBe(200);
    expect(out.body).toContain("Could not release the hold");
    expect(out.body).toContain("already charged");
    expect(logged("EMAIL (log-only mode)")).toHaveLength(emailsBefore);
    expect(logged('"event":"void_failed"')).toHaveLength(1);
    // and no "approve anyway" escape hatch on a decline
    expect(out.body).not.toContain("Approve anyway");
  });
});

describe("requests made before deposits existed still decide cleanly", () => {
  const legacyToken = () =>
    signToken(
      {
        typ: "decide",
        ref: "SH-0801-LEG1",
        room: "divers-dorm",
        checkIn: "2026-09-01",
        checkOut: "2026-09-03",
        guests: 1,
        name: "Legacy Guest",
        email: "legacy@example.com",
        lang: "en",
        exp: NOW + 86_400_000,
      },
      SECRET,
    );

  it("approves with no capture and no prepaid claim", async () => {
    captureLogs();
    const out = await post({ t: legacyToken(), action: "approve" }, {});
    expect(out.status).toBe(200);
    expect(out.body).toContain("guest emailed");
    expect(logged("HOLD (simulated mode) captured")).toHaveLength(0);
    const email = logged("EMAIL (log-only mode)").at(-1)!;
    expect(email).toContain("Nothing has been charged");
  });

  it("declines with no void and no released claim", async () => {
    captureLogs();
    const out = await post({ t: legacyToken(), action: "decline" }, {});
    expect(out.status).toBe(200);
    const email = logged("EMAIL (log-only mode)").at(-1)!;
    expect(email).not.toContain("hold has been released");
  });

  it("says plainly on the decision page that there is no hold", async () => {
    const page = await processRequest({
      method: "GET",
      query: { t: legacyToken() },
      body: {},
      ip: nextIp(),
      now: NOW,
    });
    expect(page.body).toContain("No payment hold on this request");
  });
});

describe("simulated mode is visible, not silent", () => {
  it("flags itself on the config endpoint", async () => {
    const out = await processRequest({
      method: "GET",
      query: { action: "payment-config" },
      body: {},
      ip: nextIp(),
      now: NOW,
    });
    expect(out.status).toBe(200);
    const cfg = JSON.parse(out.body);
    expect(cfg.provider).toBe("simulated");
    expect(cfg.simulated).toBe(true);
    expect(cfg.clientId).toBeUndefined();
    expect(cfg.amount).toBe(1000);
    expect(cfg.currency).toBe("THB");
  });

  it("flags itself on both hold responses", async () => {
    const { held, json } = await bookedRequest();
    expect(held.simulated).toBe(true);
    expect(held.holdMode).toBe("simulated");
    expect(held.orderId).toMatch(/^SIMORDER-/);
    expect(json.holdMode).toBe("simulated");
  });

  it("logs every money step it would have taken", async () => {
    captureLogs();
    await bookedRequest();
    expect(logged("HOLD (simulated mode) would authorize")).toHaveLength(1);
    expect(logged("HOLD (simulated mode) authorized")).toHaveLength(1);
    const authorized = logged("HOLD (simulated mode) authorized")[0];
    expect(authorized).toContain('"amount":"1000.00"');
    expect(authorized).toContain('"currency":"THB"');
  });

  it("switches to the real provider the moment credentials appear", () => {
    expect(getHoldProvider().name).toBe("simulated");
    vi.stubEnv("PAYPAL_CLIENT_ID", "test-client-id");
    vi.stubEnv("PAYPAL_SECRET", "test-secret-value");
    const live = getHoldProvider();
    expect(live.name).toBe("paypal");
    expect(live.simulated).toBe(false);
    expect(live.clientId).toBe("test-client-id");
    expect(live.env).toBe("sandbox");
    vi.stubEnv("PAYPAL_ENV", "live");
    expect(getHoldProvider().env).toBe("live");
  });
});

// PayPal answers a doomed capture with a 422 and an `issue` string. Reading it
// wrong is how a guest ends up double-charged or told a lie, so the mapping is
// pinned here rather than discovered in production.
describe("PayPal error classification", () => {
  const cases: [string, string, string][] = [
    ["already captured", "AUTHORIZATION_ALREADY_CAPTURED", "already_captured"],
    ["expired", "AUTHORIZATION_EXPIRED", "expired"],
    ["voided", "AUTHORIZATION_VOIDED", "voided"],
    ["declined", "INSTRUMENT_DECLINED", "declined"],
    ["unapproved order", "ORDER_NOT_APPROVED", "not_approved"],
    ["anything else", "INTERNAL_SERVER_ERROR", "provider_error"],
  ];

  it.each(cases)("maps %s", (_label, issue, code) => {
    expect(
      classifyPaypalError(422, { name: "UNPROCESSABLE_ENTITY", details: [{ issue, description: "d" }] }).code,
    ).toBe(code);
  });

  it("survives a body that is not the documented shape", () => {
    expect(classifyPaypalError(500, "<html>gateway timeout</html>").code).toBe("provider_error");
    expect(classifyPaypalError(500, undefined).message).toContain("status 500");
  });
});
