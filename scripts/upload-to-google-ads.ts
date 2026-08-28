/**
 * DEPRECATED 2026-05-27.
 *
 * This Playwright path is non-functional. Two reasons discovered in testing:
 * 1. Google Ads has no /aw/bulkuploads endpoint for campaign creation - the
 *    web UI does not support bulk CSV/TSV import for new campaigns at all.
 * 2. Google's login flow detects Playwright-Chromium and refuses sign-in
 *    ("This browser or app may not be secure").
 *
 * Use scripts/create-campaigns.ts instead - it talks to the Google Ads API
 * directly via the google-ads-api npm package. See README.md (Path A) and
 * docs/google-ads-dev-token-application.md.
 *
 * Original docstring preserved below for archival.
 *
 * Drive Google Ads web UI via Playwright to upload combined-bulk.csv into
 * Tools -> Bulk actions -> Uploads, applying the changes paused.
 *
 * First run:
 *   bun add -d playwright
 *   bunx playwright install chromium
 *   bun run scripts/upload-to-google-ads.ts --login
 *   (browser opens; you log in to Google Ads manually; auth state saved
 *    to .secrets/google-ads-auth.json which is gitignored)
 *
 * Subsequent runs:
 *   bun run scripts/upload-to-google-ads.ts
 *
 * What it does:
 *   1. Loads saved auth state (or prompts you to log in on first run).
 *   2. Navigates to https://ads.google.com/aw/bulkuploads
 *   3. Uploads docs/campaigns/google-ads-2026-w22/combined-bulk.csv
 *   4. Waits for the preview screen, screenshots it.
 *   5. PAUSES for human review. You inspect the preview, then press Enter
 *      in the terminal to Apply, or Ctrl+C to abort.
 *   6. On Apply: clicks the "Apply changes" / "Process" button, waits for
 *      the success state, screenshots, exits.
 *
 * Status it ships campaigns in: Paused (per the CSV's "Campaign Status"
 * column = "Paused"). Verify in the UI before unpausing.
 *
 * Notes / known fragility:
 *   - Google Ads UI changes monthly; selectors below may need updating.
 *   - The bulk upload "Apply" button label varies: "Apply", "Process",
 *     or "Apply changes" - the script handles all three.
 *   - If 2FA prompts appear, the login step will pause for human input.
 *   - File picker is handled via setInputFiles on the hidden <input type=file>.
 *
 * If this script fails for UI reasons, fallback is Google Ads Editor
 * desktop app + the same TSV pack (see docs/campaigns/google-ads-2026-w22/README.md).
 */

import { chromium, type BrowserContext, type Page } from "playwright";
import { existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const ROOT = join(import.meta.dir, "..");
const AUTH_FILE = join(ROOT, ".secrets", "google-ads-auth.json");
const CSV_PATH = join(ROOT, "docs", "campaigns", "google-ads-2026-w22", "combined-bulk.csv");
const SCREENSHOT_DIR = join(ROOT, "docs", "campaigns", "google-ads-2026-w22", "screenshots");

mkdirSync(SCREENSHOT_DIR, { recursive: true });
mkdirSync(dirname(AUTH_FILE), { recursive: true });

const LOGIN_MODE = process.argv.includes("--login");

async function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

async function shot(page: Page, name: string) {
  const path = join(SCREENSHOT_DIR, `${Date.now()}-${name}.png`);
  await page.screenshot({ path, fullPage: true });
  console.log(`  screenshot: ${path}`);
}

async function loginFlow(): Promise<void> {
  console.log("Login mode. Opening Chromium...");
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://ads.google.com");
  console.log("\nLog in to Google Ads in the open browser window.");
  console.log("Make sure you are on the correct account (AW-18050429438 / Siam Scuba).");
  await prompt("Press Enter here once you see the Google Ads dashboard...");
  await context.storageState({ path: AUTH_FILE });
  console.log(`Auth state saved to ${AUTH_FILE}`);
  await browser.close();
}

async function uploadFlow(): Promise<void> {
  if (!existsSync(AUTH_FILE)) {
    console.error(`No auth file at ${AUTH_FILE}. Run with --login first.`);
    process.exit(1);
  }
  if (!existsSync(CSV_PATH)) {
    console.error(`No CSV at ${CSV_PATH}. Run scripts/generate-google-ads-bulk.ts first.`);
    process.exit(1);
  }

  console.log("Launching browser with saved auth...");
  const browser = await chromium.launch({ headless: false });
  const context: BrowserContext = await browser.newContext({ storageState: AUTH_FILE });
  const page = await context.newPage();

  console.log("Navigating to bulk uploads...");
  await page.goto("https://ads.google.com/aw/bulkuploads", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await shot(page, "01-bulk-uploads-page");

  console.log("Looking for the upload button / file input...");
  // Google Ads UI typically has a hidden <input type=file>. Try a few selectors.
  const fileInput = await page.$('input[type="file"]');
  if (!fileInput) {
    console.error("No file input found. Google Ads UI may have changed.");
    console.error("Screenshot saved. Manual fallback: drag CSV into the page yourself.");
    await prompt("Press Enter to keep browser open for manual review, Ctrl+C to abort...");
    return;
  }

  console.log(`Uploading ${CSV_PATH}...`);
  await fileInput.setInputFiles(CSV_PATH);
  await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
  await shot(page, "02-after-upload");

  console.log("\nPreview should now show what will be applied.");
  console.log("Inspect the browser window. Verify:");
  console.log("  - 3 campaigns (DSD / OWD / Fun Dive) all marked Paused");
  console.log("  - 9 ad groups");
  console.log("  - 88 keywords");
  console.log("  - 9 RSAs");
  console.log("  - 0 errors (warnings OK)");
  const decision = await prompt("\nType 'apply' to commit the changes, or 'abort' to cancel: ");

  if (decision.toLowerCase() !== "apply") {
    console.log("Aborted. No changes applied.");
    await browser.close();
    return;
  }

  console.log("Applying changes...");
  // Click "Apply" / "Process" / "Apply changes" - try each.
  const applyButton = await page.locator(
    'button:has-text("Apply changes"), button:has-text("Apply"), button:has-text("Process")'
  ).first();
  await applyButton.click();
  await page.waitForLoadState("networkidle", { timeout: 120000 }).catch(() => {});
  await shot(page, "03-after-apply");

  console.log("\nChanges applied. Verify in Google Ads Campaigns view:");
  console.log("  https://ads.google.com/aw/campaigns");
  await prompt("Press Enter to close the browser when done verifying...");
  await browser.close();
}

if (LOGIN_MODE) {
  await loginFlow();
} else {
  await uploadFlow();
}
