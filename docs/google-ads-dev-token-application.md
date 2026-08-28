# Google Ads developer token + OAuth setup - Siam Scuba

Get a developer token so `scripts/create-campaigns.ts` can talk to the Google Ads API and create the 3 paused Search campaigns programmatically. This same token unblocks future automation (budget tweaks, bid management, search-term cleanup, PMax expansion).

**Approval window**: aim for **Explorer Access** tier (launched Oct 2025) - typically auto-granted or approved within 24h, 2,880 mutations/day. Our entire campaign creation is ~150 mutations - well under the cap. If we ever scale past 2,880 ops/day, upgrade to Standard Access then (10+ business days).

---

## Step 1 - Create a new Manager (MCC) account

Developer tokens are tied to a Manager Account, not a regular Ads account. The account `666-778-4880` is an old abandoned one (not an MCC) and is slated for deletion. We need a fresh MCC.

- URL: https://ads.google.com/home/tools/manager-accounts/
- **Sign in with a Google account NOT currently linked to any Ads account.** Options:
  - `benmosheavivi@gmail.com` if it has no Ads attachment yet.
  - Or create a dedicated one: `siamscubaadsmgr@gmail.com` (~2 min).
- Name the MCC something like **"Siam Scuba MCC"**.
- After creation, the MCC has its own Customer ID in `xxx-xxx-xxxx` format. **Note it down** - you'll need it twice below.

### Step 1.1 - Link the operating account under the MCC

From the MCC dashboard:

1. **Accounts → Sub-account → "+" → "Link existing account"**
2. Enter Customer ID: **`977-785-8115`** (the active "Siam Scuba Diving 5 Star IDC Center")
3. Send request.
4. Switch to the operating account (`977-785-8115`) → Notifications → approve the link request.

The MCC now has visibility + control over the operating account. This is what the API needs.

---

## Step 2 - Apply for Explorer Access

From inside the MCC (top right account switcher confirms you're on the MCC, not the sub-account):

1. **Tools → API Center** (URL: https://ads.google.com/aw/apicenter)
2. Click **"Apply for Access"** / **"Apply for token"** depending on UI label.
3. Fill the form using the answers below. The form is short for Explorer Access; previous Basic/Standard application questions are skipped.

### Form answers (paste verbatim)

| Field | Answer |
|---|---|
| **Company name** | Lotus Siam Paradise Co., Ltd. (trade name: Siam Scuba) |
| **Company website** | https://siamscuba.com |
| **Manager Customer ID (MCC)** | *the MCC ID you noted in Step 1* |
| **Contact email** | benmosheavivi@gmail.com |
| **Country** | Thailand |
| **Industry** | Travel / Recreation - scuba diving |
| **Tool name** | Siam Scuba Campaign Orchestrator |
| **Will this tool manage your own accounts or clients?** | Own accounts only (single-advertiser, internal tool) |
| **Number of Ads accounts the tool will manage** | 1 (Customer ID `977-785-8115`) |
| **Estimated monthly spend** | $2,000-$5,000/month USD (10,500 THB/week current; scaling planned) |
| **Access level requested** | **Explorer Access** |

### Use-case description (paste verbatim into the long-form box)

> Siam Scuba is a PADI 5-Star dive shop in Koh Tao, Thailand. We operate a single Google Ads account (977-785-8115) and want to use the Google Ads API to:
>
> 1. Programmatically create and edit Search campaigns from a Git-versioned campaign spec, so campaign configuration is version-controlled alongside our website code.
> 2. Sync daily budgets and bid strategies between our internal dashboard and Google Ads (we run 7-day campaign pushes tied to seasonal demand).
> 3. Export search-terms reports and conversion data into our internal analytics so we can correlate ad spend with bookings completed in our booking platform.
> 4. Push negative keywords from our cleaned search-terms report back to Google Ads automatically.
>
> The tool is internal-use only, single-advertiser. We will not resell access. Read+write operations only on our own MCC. No mass-changes; rate-limited by design (well under the 2,880 ops/day Explorer Access cap). All campaign templates and code live in our Git repository at https://github.com/tafuros/website (private).

### Mutate operations the tool will use

If the form asks for entity types:

- `CampaignService` (create / update / pause / resume)
- `CampaignBudgetService` (budget tweaks)
- `AdGroupService` (create / update)
- `AdGroupCriterionService` (keywords, including negatives)
- `AdGroupAdService` (Responsive Search Ads)
- `SharedSetService` + `SharedCriterionService` + `CampaignSharedSetService` (negative keyword lists)
- `AssetService` + `CampaignAssetService` (sitelinks, callouts, structured snippets, later images)

Read-only services:
- `GoogleAdsService` (reporting / GAQL search queries)
- `SearchTermViewService` (search-term reports for negative keyword discovery)

### Submit

Click submit. With Explorer Access, you either:
- Get the token immediately on the API Center page, OR
- Receive an email confirmation; the token appears in API Center within 24h.

---

## Step 3 - OAuth 2.0 client credentials (one-time)

The developer token gets us past the gate; OAuth gets us per-user access. Both are needed.

### Step 3.1 - Google Cloud project

Either:
- **Reuse**: the existing `gen-lang-client-0772065432` ("siam website") project that already has the Gemini API enabled - just enable the Google Ads API in it too.
- **Or create new**: https://console.cloud.google.com/projectcreate, name "siam-ads-api" or similar.

### Step 3.2 - Enable Google Ads API

In the chosen project: APIs & Services → Library → search "Google Ads API" → Enable.

### Step 3.3 - Create OAuth 2.0 client credentials

APIs & Services → Credentials → **Create credentials → OAuth client ID**:

- Application type: **Desktop app**
- Name: "Siam Scuba Ads CLI"
- Create → download the JSON, but mainly note the **Client ID** and **Client Secret**.

If asked to configure the OAuth consent screen first:
- User type: **External**
- App name: "Siam Scuba Ads CLI"
- User support email: benmosheavivi@gmail.com
- Authorized domains: leave blank (Desktop app doesn't need them)
- Scopes: leave default for now; the helper script will request `https://www.googleapis.com/auth/adwords`
- Test users: add benmosheavivi@gmail.com (so login works without the app being "verified" by Google)

---

## Step 4 - Drop everything into `.env.local`

Once the developer token is in hand and OAuth credentials are created, paste these lines into `.env.local` at the project root (gitignored, don't commit):

```bash
GOOGLE_ADS_DEVELOPER_TOKEN=<from API Center>
GOOGLE_ADS_CLIENT_ID=<from Google Cloud Console>
GOOGLE_ADS_CLIENT_SECRET=<from Google Cloud Console>
GOOGLE_ADS_CUSTOMER_ID=9777858115           # operating account 977-785-8115, dashes stripped
GOOGLE_ADS_LOGIN_CUSTOMER_ID=<MCC ID, dashes stripped>
# refresh token comes from the helper script in Step 5
```

---

## Step 5 - Run the OAuth helper to get a refresh token

```bash
cd ~/Projects/website
bun run scripts/oauth-helper.ts
```

What happens:
1. Helper opens your browser to a Google consent URL.
2. You sign in with `siamscubadivep@gmail.com` (or whichever account has Ads access).
3. Grant the `adwords` scope.
4. You're redirected to a local URL the helper is listening on.
5. The helper exchanges the auth code for a refresh token and appends it to `.env.local` as `GOOGLE_ADS_REFRESH_TOKEN=...`.

---

## Step 6 - Run the campaign creator

```bash
# Sanity check first - prints the API payloads without sending
bun run scripts/create-campaigns.ts --dry-run

# Real run when ready
bun run scripts/create-campaigns.ts

# Verify what landed
bun run scripts/verify-campaigns.ts
```

Expected after a successful real run: 3 paused Search campaigns in the operating account, 9 ad groups, 88 keywords, 9 RSAs, 1 shared negative keyword list attached to all 3 campaigns, 4 sitelinks + 8 callouts + 2 structured snippets at account level linked to each campaign. The Spanish PMax campaign remains untouched.

---

## If Google rejects Explorer Access (very rare for accounts with spend history)

Common reasons + responses:

| Rejection reason | Response |
|---|---|
| "Use case unclear" | Re-submit with concrete numbers: "10,500 THB/week starting 2026-W22, scaling to ~150,000 THB/month by 2026-Q4" |
| "Not enough advertising history" | Won't apply to this account (96K impressions, 4.3K clicks across 2 months from the existing Spanish PMax campaign) |
| "Reseller suspected" | Emphasize single-advertiser, internal-use, no SaaS, no client billing |

Worst case fallback: drop down to Test Access (sandbox only, 15K ops/day) to develop against, while Explorer Access processes.
