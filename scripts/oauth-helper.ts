/**
 * One-time OAuth 2.0 helper for Google Ads API.
 *
 * Reads GOOGLE_ADS_CLIENT_ID + GOOGLE_ADS_CLIENT_SECRET from .env.local,
 * opens the browser to Google's consent URL, listens on
 * http://localhost:8765/oauth-callback, exchanges the auth code for a
 * refresh token, and appends `GOOGLE_ADS_REFRESH_TOKEN=...` to .env.local.
 *
 * Prerequisites: see docs/google-ads-dev-token-application.md (Steps 1-4).
 *
 * Run: bun run scripts/oauth-helper.ts
 *
 * Idempotent: if GOOGLE_ADS_REFRESH_TOKEN is already in .env.local, the
 * script asks before overwriting.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const ROOT = join(import.meta.dir, "..");
const ENV_FILE = join(ROOT, ".env.local");
const SCOPE = "https://www.googleapis.com/auth/adwords";
const REDIRECT_PORT = 8765;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/oauth-callback`;

function readEnv(): Record<string, string> {
  if (!existsSync(ENV_FILE)) return {};
  const lines = readFileSync(ENV_FILE, "utf8").split("\n");
  const env: Record<string, string> = {};
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

function appendOrReplaceEnv(key: string, value: string) {
  let body = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8") : "";
  const re = new RegExp(`^\\s*${key}\\s*=.*$`, "m");
  const line = `${key}=${value}`;
  body = re.test(body) ? body.replace(re, line) : (body.endsWith("\n") || body === "" ? body + line + "\n" : body + "\n" + line + "\n");
  writeFileSync(ENV_FILE, body, "utf8");
}

async function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

const env = readEnv();
const clientId = env.GOOGLE_ADS_CLIENT_ID;
const clientSecret = env.GOOGLE_ADS_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("Missing GOOGLE_ADS_CLIENT_ID or GOOGLE_ADS_CLIENT_SECRET in .env.local.");
  console.error("See docs/google-ads-dev-token-application.md (Step 3) for how to create OAuth credentials.");
  process.exit(1);
}

if (env.GOOGLE_ADS_REFRESH_TOKEN) {
  const ans = await prompt(`A refresh token already exists in .env.local. Overwrite? [y/N] `);
  if (ans.toLowerCase() !== "y") {
    console.log("Aborted. Existing refresh token kept.");
    process.exit(0);
  }
}

const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.searchParams.set("client_id", clientId);
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", SCOPE);
authUrl.searchParams.set("access_type", "offline");
authUrl.searchParams.set("prompt", "consent"); // force refresh_token even if previously consented

console.log("\nOpen this URL in your browser if it doesn't open automatically:\n");
console.log(authUrl.toString());
console.log(`\nListening for the OAuth redirect on ${REDIRECT_URI} ...\n`);

// Auto-open in the default browser (macOS).
Bun.spawn(["open", authUrl.toString()], { stdout: "ignore", stderr: "ignore" });

let resolveCode: (code: string) => void = () => {};
const codePromise = new Promise<string>((res) => { resolveCode = res; });

const server = Bun.serve({
  port: REDIRECT_PORT,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname !== "/oauth-callback") {
      return new Response("Not found", { status: 404 });
    }
    const error = url.searchParams.get("error");
    if (error) {
      const desc = url.searchParams.get("error_description") ?? "";
      console.error(`OAuth error: ${error} ${desc}`);
      setTimeout(() => process.exit(1), 100);
      return new Response(`OAuth error: ${error} ${desc}`, { status: 400, headers: { "Content-Type": "text/plain" } });
    }
    const code = url.searchParams.get("code");
    if (!code) {
      return new Response("Missing code", { status: 400 });
    }
    resolveCode(code);
    return new Response(
      "<h2>Got the auth code. You can close this tab and return to the terminal.</h2>",
      { headers: { "Content-Type": "text/html" } }
    );
  },
});

const code = await codePromise;
server.stop();

console.log("Auth code received. Exchanging for refresh token...\n");

const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  }),
});

if (!tokenRes.ok) {
  const errBody = await tokenRes.text();
  console.error(`Token exchange failed (${tokenRes.status}): ${errBody}`);
  process.exit(1);
}

const tokenJson = await tokenRes.json() as { refresh_token?: string; access_token?: string };

if (!tokenJson.refresh_token) {
  console.error("Token endpoint returned no refresh_token. This usually means the user previously consented and Google did not re-issue one.");
  console.error("Either revoke the app in https://myaccount.google.com/permissions and retry, or pass prompt=consent (already set).");
  console.error("Full response:", tokenJson);
  process.exit(1);
}

appendOrReplaceEnv("GOOGLE_ADS_REFRESH_TOKEN", tokenJson.refresh_token);

console.log("Saved GOOGLE_ADS_REFRESH_TOKEN to .env.local.");
console.log("\nNext: bun run scripts/create-campaigns.ts --dry-run");
