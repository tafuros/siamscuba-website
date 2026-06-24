# siamscuba.com → Cloudflare Consolidation - Migration Plan

_Drafted 2026-06-24. Goal: consolidate the Siam Scuba public site's infrastructure onto Cloudflare (DNS + hosting), matching the rest of the Tafuros stack (Bar's site, Koh Tao, Shiluv all on Cloudflare). Part of the umbrella consolidation (`~/.claude/plans/floofy-beaming-meteor.md`)._

---

## Verified current state (2026-06-24)

| Layer | Where it is today | Notes |
|---|---|---|
| **Registrar** | **WebNIC** (`webnic.cc`), via reseller **cmnicesolutions** (Chiang Mai host) | Expiry 2027-02-23. Nameserver changes likely go through the reseller/host panel, not WebNIC directly. |
| **DNS (nameservers)** | `ns3` / `ns4.cmnicesolutions.com` (old DirectAdmin server, IP `27.254.82.135`) | **DNS is NOT on Vercel** - the old host's zone has manual A records pointing the site to Vercel. |
| **Website** | **Vercel** (A → `216.198.79.1`, `64.29.17.1`, vercel-dns) | React/Vite SSG. |
| **Email** | **cmnicesolutions DirectAdmin** (`MX → mail.siamscuba.com → 27.254.82.135`, 5 POP accounts) | ⚠️ **Business email lives on the old host. Must be preserved.** |
| **Backend fn 1** | `api/chat.ts` on Vercel - Nemo chatbot (Node runtime: `node:fs` KB read, `@anthropic-ai/sdk`, DiveOS lead capture) | Portable to Workers with rework. |
| **Backend fn 2** | `api/pulse.ts` on Vercel - Google Ads pulse (`google-ads-api`, **gRPC + Node**) | ❌ **Cannot run on Cloudflare Workers.** Feeds the Tafuros Ops MCP / morning briefing. |

### Records that MUST survive any DNS move (break-the-business list)
_Verified via dig against the authoritative NS, 2026-06-24 (security agent Phase 1 prep)._
- **MX** `10 mail.siamscuba.com` + **A** `mail / smtp / pop .siamscuba.com → 27.254.82.135` → email
- **SPF TXT** `v=spf1 a mx ip4:27.254.82.135 ip4:27.254.40.111 ~all` → email deliverability _(live record has `ip4:27.254.82.135` duplicated - clean to one when re-entering, keep semantics)_
- **DMARC TXT** `_dmarc.siamscuba.com → v=DMARC1; p=none;` → email auth
- ⚠️ **DKIM TXT** - exists but the **selector is unknown** (dig couldn't find it; DirectAdmin usually uses `x._domainkey`). **MUST be recovered from the DirectAdmin zone export before cutover** - a missing DKIM = mail silently lands in spam. **Hard prerequisite.**
- **3× Google site-verification TXT** → Google Search Console + Google Ads
- **A** `siamscuba.com → 216.198.79.1` (Vercel) + **CNAME** `www → ...vercel-dns-017.com` → website. _NB: only ONE Vercel apex IP is live - `64.29.17.1` is NOT in the zone, do not re-add it._
- ⚠️ **A** `dash.siamscuba.com → 168.144.133.169` → **DiveOS app (different host!)**. Not Vercel, not the mail server. Must be carried to Cloudflare or DiveOS goes dark.
- ftp.siamscuba.com A → 27.254.82.135 (host services)
- DNSSEC: **unsigned** at registry (good - no DS record to remove before cutover). Domain status: **`ok` / unlocked** (no registrar lock blocking an NS change).

---

## ✅ Complete zone - authoritative import checklist (from DirectAdmin export, 2026-06-24)
> Every record below MUST exist in Cloudflare, verified, BEFORE the nameserver flip. `siamscuba.com` is the DNS root for the whole Siam Scuba stack - several records point to **other Tafuros services**, not the website.

| Name | Type | Value | Owner / purpose |
|---|---|---|---|
| `@` | A | `216.198.79.1` | Website (Vercel) ★ |
| `www` | CNAME | `9f7cdaae944599ba.vercel-dns-017.com` | Website (Vercel) ★ |
| `beta` | A | `168.144.133.169` | Beta app |
| `dash` | A | `168.144.133.169` | **DiveOS** ★ (cross-project) |
| `nemo` | A | `152.42.198.227` | **Nemo bot** ★ (cross-project) |
| `shirts` | A | `143.198.91.205` | **T-shirt store** ★ (cross-project) |
| `ftp` | A | `27.254.82.135` | Old host |
| `mail` | A | `27.254.82.135` | Inbound mail server ★ |
| `smtp` | A | `27.254.82.135` | Mail ★ |
| `pop` | A | `27.254.82.135` | Mail ★ |
| `@` | MX | `10 mail` | Inbound email ★ |
| `send` | MX | `10 feedback-smtp.ap-northeast-1.amazonses.com` | Resend/SES bounce ★ |
| `resend._domainkey` | TXT | `p=MIGfMA0GCSqG…IDAQAB` (full key from export) | **DKIM** ★ (Resend deliverability) |
| `send` | TXT | `v=spf1 include:amazonses.com ~all` | Resend send-domain SPF ★ |
| `@` | TXT | `v=spf1 a mx ip4:27.254.82.135 ip4:27.254.40.111 ~all` | Email SPF ★ _(dedupe the doubled ip4)_ |
| `_dmarc` | TXT | `v=DMARC1; p=none;` | Email auth ★ |
| `@` | TXT | `google-site-verification=qZDWonCEmdfWk_A1jPy7LmUk2Rpfds9R3JQNYU4Kovw` | GSC/Ads ★ |
| `@` | TXT | `google-site-verification=wFhu_6NxmK2HxlpDuCukGx8rndF9hVqDlwV_jRnCc_g` | GSC/Ads ★ |
| `@` | TXT | `google-site-verification=xvlaXcgT0FZGk7p0ubwQFwxr7_yC4KEUfIfI66-zLc.` | GSC/Ads ★ |
| `_lovable` | TXT | `lovable_verify=37b3b227…2fb0` | Lovable (removable post-decouple) |
| `_lovable.www` | TXT | `lovable_verify=6db1c79cb4e32bfc…f0547` | Lovable (removable post-decouple) |

**Cross-project impact:** this DNS move touches DiveOS (`dash`), Nemo (`nemo`), and the t-shirt store (`shirts`). Notify those agents before cutover. **Email = inbound via DirectAdmin (`mail`), outbound transactional via Resend/SES (`send` + `resend._domainkey` DKIM).**

## Guiding principles
1. **One change at a time.** Each phase is independently valuable and independently reversible.
2. **Never break email or GSC verification.** Full record inventory before any cutover.
3. **Test on a preview URL before every cutover.** Keep the old path alive as instant rollback (revert nameservers / keep Vercel deployment) until verified.
4. **Plan in text, get Ben's sign-off per phase.** Ben's manual steps are flagged 🟧 and sent to him exactly when due.

---

## Phase 1 - Move DNS to Cloudflare _(website stays on Vercel)_ - ✅ DONE 2026-06-24
> Cutover complete. Nameservers changed at cmnicesolutions (WebNIC reseller) to `clint.ns.cloudflare.com` / `gabriella.ns.cloudflare.com`; propagated near-instantly. All 19 records (9 A · 1 CNAME · 2 MX · 7 TXT, Lovable TXT intentionally dropped) verified live via public resolvers: website (200), dash/nemo/shirts/beta, MX/mail/smtp/pop, SPF/DMARC/DKIM, 3× Google verification. All records DNS-only (no proxy). Pending: Ben's live send/receive email test. Optional tidy: dedupe the doubled `ip4:27.254.82.135` in apex SPF.

> This is the literal "move the domain to Cloudflare" Ben asked for. High consolidation value, **no code change**, fully reversible. Website + email keep working untouched - we just change *who answers DNS*.

1. **Inventory** the full cmnicesolutions DNS zone (export every record). 🟧 _Ben: DirectAdmin DNS access (panel at `27.254.82.135:2222`) or ask the host for a zone export._
2. Add `siamscuba.com` to the **Tafuros Cloudflare account**; let Cloudflare auto-scan/import records.
3. **Manually verify** every record from the break-the-business list imported correctly (MX, SPF, the 3 verifications, A/www). Fix any Cloudflare missed.
4. (Optional) Lower TTLs a day before to speed propagation.
5. 🟧 **Ben: change nameservers** at the registrar/reseller (WebNIC via cmnicesolutions) to the two Cloudflare nameservers CF assigns.
6. Verify propagation (`dig NS`), then confirm: site loads, **send+receive a test email**, GSC still verified.
- **Risk:** low-medium. **Rollback:** revert nameservers to ns3/ns4.cmnicesolutions.

---

## Phase 2 - Migrate hosting Vercel → Cloudflare Pages _(website)_
> Only start once Phase 1 is stable. Now that Cloudflare owns DNS, repointing the site is a one-line DNS change.

1. Translate `vercel.json` → Cloudflare equivalents:
   - SPA rewrite `/((?!api/).*) → /index.html` → `_redirects` / `_routes.json`
   - `redirects` (contact-us, divemaster, /nemo WhatsApp links) → `_redirects`
   - cache `headers` (hero/assets/fonts immutable) → `_headers`
   - `cleanUrls` / `trailingSlash` → CF Pages settings
2. **Port `api/chat.ts`** → Cloudflare Pages Function (`functions/api/chat.ts`):
   - Rewrite Node `(req,res)` handler → Workers `fetch` handler.
   - Replace `node:fs` KB read with a bundled JSON import (Workers have no fs).
   - `@anthropic-ai/sdk` works on Workers (fetch-based). Keep DiveOS lead-capture call.
   - Keep the same dev-middleware reuse so `bun run dev` still works locally.
3. Set up **GitHub → Cloudflare Pages** build (`bun run build`, output `dist/`).
4. 🟧 **Ben: add env vars/secrets** to Cloudflare (ANTHROPIC_API_KEY, LEAD_CAPTURE_TOKEN/VITE_LEAD_TOKEN, DIVEOS_API_BASE).
5. Test thoroughly on the `*.pages.dev` preview: routes, chatbot, redirects, GTM/GA/Ads tags fire.
6. Repoint `siamscuba.com` DNS (in Cloudflare) from Vercel → CF Pages.
- **Risk:** medium. **Rollback:** repoint DNS back to Vercel (deployment kept live until verified).

---

## Phase 3 - Decide `api/pulse.ts` (the blocker)
> `google-ads-api` needs gRPC → won't run on Cloudflare Workers. Pick one:

- **Option A - Rewrite to Google Ads REST API** (Worker-compatible). Cleanest end state, most work (manual OAuth refresh-token flow). 
- **Option B - Hybrid: keep `pulse.ts` as a tiny 1-function Vercel project.** Fastest; leaves a sliver on Vercel. The MCP just points at the Vercel URL.
- **Option C - Move pulse to a small Node host** (e.g. alongside DiveOS).
- **Recommendation:** Option B first (unblocks the migration immediately), then Option A later if we want zero Vercel footprint.

---

## Phase 4 - Image SEO renames _(separate project, do AFTER migration)_
> See "Now or after?" below. Rename `public/` + `src/assets/` images to descriptive kebab-case SEO names, add 301 redirects for old image URLs, update all code refs + `og-image` + sitemap.

---

## Agent division

| Phase / piece | Lead agent | Supporting |
|---|---|---|
| Plan ownership, cross-cutting infra | **main / orchestrator** | - |
| DNS inventory, nameserver cutover, email/MX preservation, registrar transfer | **security** (owns DNS/secrets, cross-project) | website |
| `vercel.json` → CF config, `api/chat.ts` port, CF Pages build, image renames (code) | **website** (me) | uses `cloudflare` / `wrangler` / `workers-best-practices` skills |
| `pulse.ts` rewrite (Google Ads REST) + GSC/Ads verification post-cutover | **marketing** (owns Google Ads + GSC) | diveos |
| Verify chatbot's DiveOS lead-capture + pulse→MCP/briefing still work | **diveos** | website |

---

## 🟧 Ben's manual steps (sent to you exactly when due)
1. **Identify + access** the registrar/reseller panel (WebNIC via cmnicesolutions) - or confirm you want me to contact the Thai host for you.
2. **Cloudflare account**: confirm which Tafuros CF account to add the domain to.
3. **DirectAdmin DNS access** (or host zone export) for Phase 1 inventory.
4. **Change nameservers** to Cloudflare's (Phase 1 cutover).
5. **Add env vars/secrets** in Cloudflare (Phase 2).
6. **Decide email**: keep email on cmnicesolutions (just preserve MX - default) vs. migrate email too (bigger scope).
7. (Optional, later) **Registrar transfer** WebNIC → Cloudflare Registrar: unlock domain + get EPP/auth code.

_Credentials from the hosting PDF are NOT stored in this file - they stay with Ben._
