# Google Ads campaign pack - 2026-W22 launch

Source of truth: `scripts/campaign-data.ts` (typed) + `docs/google-ads-blueprint.md` (strategy).
Regenerate the TSV/CSV pack: `bun run scripts/generate-google-ads-bulk.ts`.

**Target account**: Customer ID `977-785-8115` ("Siam Scuba Diving 5 Star IDC Center"). Conversion tag `AW-18050429438` is the Google Tag (used by `gtag.js` for conversion tracking) - separate identifier, do not confuse with the Customer ID. **MCC (Manager) ID**: see Step 1 of `docs/google-ads-dev-token-application.md`.

**Campaigns ship paused** - blueprint §8 launch checklist (verify Tag Assistant, spot-check landers, name launch date) must complete before unpausing.

---

## Path A (current) - Google Ads API automation

Used end-to-end for campaign creation. Three scripts:

```bash
bun run scripts/oauth-helper.ts                   # one-time after token approval
bun run scripts/create-campaigns.ts --dry-run     # sanity check (no API calls)
bun run scripts/create-campaigns.ts               # live create
bun run scripts/verify-campaigns.ts               # diff against expected
```

Setup details: `docs/google-ads-dev-token-application.md` (MCC creation, Explorer Access application, OAuth credentials, env vars).

The TSV/CSV pack below is still emitted as a reference + fallback (Path B). The API path reads the same typed data via `scripts/campaign-data.ts`.

---

## Path B (fallback) - Google Ads Editor desktop

Use only if Path A fails for an account-specific reason (e.g., token rejected). Editor is installed via `brew install --cask google-ads-editor`. Import the TSVs one by one via Edit -> Make multiple changes per the table below.

---

## Import order

Do these in Editor in this order. Each step is "Account-level navigation -> action -> paste -> Process".

| # | File | Editor location | Action |
|---|---|---|---|
| 1 | `01-campaigns.tsv` | Campaigns tab | Make multiple changes -> "Add/update multiple campaigns" -> paste -> Process |
| 2 | `02-ad-groups.tsv` | Ad groups tab | Make multiple changes -> "Add/update multiple ad groups" -> paste -> Process |
| 3 | `03-keywords.tsv` | Keywords tab | Make multiple changes -> "Add/update multiple keywords" -> paste -> Process |
| 4 | `04-negative-keywords-shared-list.tsv` | Shared library -> Negative keyword lists | Create list "Siam Scuba - Always Negative" first, then Make multiple changes -> paste -> apply to all 3 campaigns |
| 5 | `05-rsas.tsv` | Ads & assets -> Ads tab | Make multiple changes -> "Add/update multiple ads" -> paste -> Process |
| 6 | `06-assets.tsv` | Ads & assets -> Assets | Manual entry (sitelinks/callouts/snippets are easier to enter individually); reference file is for copy-paste of each row's text |

After import, in Editor: **Post -> Check changes -> Post changes** to push to the live account.

---

## What's in each file

### 01-campaigns.tsv
3 campaigns, all Paused, Search network only, Maximize Conversions, 500 THB/day. Locations are set to `see-§3-blueprint` because Editor handles geo through a separate UI - apply per blueprint §3 after import (Koh Tao + radius for EN, Spain/LATAM for ES, Israel for HE).

### 02-ad-groups.tsv
9 ad groups (3 per campaign), default max CPC = 10 THB placeholder (Maximize Conversions ignores it but Editor requires a value). Final URL is set per blueprint §2.

### 03-keywords.tsv
76 keywords total: phrase + exact. No broad in week-1 per blueprint §4.

### 04-negative-keywords-shared-list.tsv
32 always-negative terms (jobs, instructor courses, free, news, etc.). Apply the shared list to all 3 campaigns after import.

### 05-rsas.tsv
9 RSAs (one per ad group), 15 headlines + 4 descriptions + path1/path2 each. All under Google's character limits (validated). Plan: add RSA #2 and #3 per ad group on Day 3 from top-performing assets - blueprint §8.

### 06-assets.tsv
Reference text for sitelinks (4), callouts (8), structured snippets (Courses, Service catalog). Add at campaign level for all 3 campaigns.

---

## After import - blueprint §8 launch checklist

Pre-launch items still pending (cannot be done in Editor):
- [ ] Verify `whatsapp_click` + `generate_lead` fire as Google Ads conversions in Tag Assistant on a `?utm_source=test` URL
- [ ] Spot-check 9 landers render correctly in EN/ES/HE on mobile + desktop
- [ ] Confirm FloatingWhatsApp + Navbar WhatsApp buttons fire `trackWhatsAppClick`
- [ ] Name launch date - coordinate with Nemo phone cutover
- [ ] Optional: discount/urgency hook (add to all 27 future RSAs before publishing more)
- [ ] Optional: image extensions - 5 horizontal photos of boats / Sail Rock / instructor in action

Launch (Day 1):
- [ ] Verify Conversions tab shows "Recording" for all 3 actions (Booking Confirmed, Lead, WhatsApp Click)
- [ ] Stagger campaign publish 4-6 hours apart: DSD -> FUN -> OWD
- [ ] Set "daily budget consumed before 12pm" alert per campaign
