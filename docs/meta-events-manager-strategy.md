# Meta Events Manager - Data Source Strategy for Siam Scuba

Date: 2026-06-03
Scope: Research and recommendations only. Nothing in this doc has been connected, installed, or changed on any live system. It evaluates the five data-source options Meta offers in Events Manager ("Connect a new data source": Web, App, Offline, CRM, Messaging) for Siam Scuba's specific funnel.

---

## 0. TL;DR

- Siam Scuba's funnel is WhatsApp-first, so the single most relevant data source is **Messaging** (connect WhatsApp business-chat events to the dataset), and the single highest-ROI move is to start running **click-to-WhatsApp (CTWA) ads** with that messaging signal feeding optimization.
- **Web** (Pixel + Conversions API on siamscuba.com) is the second priority - the existing pixel/dataset "Siam Scuba - Nemo" (ID 1311274604282581) currently shows "Never received events", so it is effectively not installed. Fixing it unlocks retargeting and ROI measurement, but it only matters once Meta ads are actually running.
- **Offline** and **CRM** are low priority at Siam Scuba's scale and carry real consent/privacy obligations (Thailand PDPA + GDPR for EU customers). Defer.
- **App** - skip entirely. There is no Siam Scuba mobile app.
- **THE DEPENDENCY:** every one of these data sources is an optimization input for Meta (Facebook/Instagram) ad campaigns. Siam Scuba currently runs **Google Ads**, and it is not confirmed they run Meta ads at all. If no Meta ad is running, connecting these data sources produces dashboards but **zero customer-acquisition benefit**. The prerequisite for all of it is: launch at least one Meta campaign (recommended: a click-to-WhatsApp campaign).

---

## 1. What a "data source / dataset" actually is

Meta has merged what used to be separate objects (web Pixel, app SDK events, offline conversions, and messaging activity) into a single **dataset**. A dataset groups event data from different customer touchpoints - website events from the Meta Pixel, server-side events from the Conversions API (CAPI), app activity, offline/CRM conversions, and messaging events from Messenger / Instagram / WhatsApp - into one place that the ad system reads from. ([Madgicx, 2025](https://madgicx.com/blog/facebook-events-manager); [LeadEnforce, 2025](https://leadenforce.com/blog/meta-datasets-explained-how-event-tracking-works-in-events-manager))

The purpose of any connected data source is to **teach Meta's ad delivery system who converts**, so it can (a) find more people like them and (b) report what the ads actually produced. Without a live ad campaign consuming that signal, the data source is just a log.

As of **May 14, 2025**, Meta retired the standalone Offline Conversions API; all offline data now flows through the unified Conversions API. ([AdAmigo, 2025](https://www.adamigo.ai/blog/meta-conversions-api-offline-data-sync)) This matters for the Offline/CRM sections below.

---

## 2. Per-source analysis

### 2A. Web (Meta Pixel + Conversions API) - PRIORITY 2

**What it does.** A browser-side Pixel and a server-side CAPI stream send siamscuba.com events (PageView, ViewContent on a course page, Lead, InitiateCheckout, Purchase/booking) to the dataset. Meta uses these to build retargeting audiences and to optimize campaigns for the event you care about.

**Concrete Siam Scuba use case.**
- Someone reads the Open Water course page (12,000 THB) but doesn't message. The Pixel records a `ViewContent` on that page. You can then run a low-cost retargeting ad to everyone who viewed a course page in the last 30 days - on Instagram, where dive content performs well visually.
- When a visitor clicks the WhatsApp button, fire a `Contact`/`Lead` event. When DiveOS confirms a booking, fire `Purchase` with the value (e.g. 12,000 THB). Now Meta can optimize for "people likely to book", not just "people likely to click".

**Realistic benefit.** Retargeting warm course-page visitors is one of the cheapest sources of bookings; measurement lets you compute real ROAS instead of guessing. But the benefit is **conditional on running Meta ads** - the Pixel alone changes nothing.

**Setup effort/cost (Vite + Supabase site).** Free. Medium effort:
- The base Pixel is a script snippet - on a React + Vite SPA you must fire `PageView` on route change (not just first load), and fire custom events from the WhatsApp-click handler and from the booking-confirmation path. Note: the existing vercel.json SPA rewrites must stay intact (see project memory) so client routes resolve.
- CAPI (server-side) is the durable half - because iOS/Safari/ad-blockers eat ~20-40% of browser Pixel events, and Meta's 2025-2026 attribution weights server signals more heavily. ([HackMD, 2025](https://hackmd.io/@agrowthagency/rJ-4LYD7be)) Meta now offers a **free one-click CAPI** path for some setups, no developer required. ([PPC.land, 2025](https://ppc.land/metas-free-one-click-conversions-api-is-now-live-no-developer-needed/)) For a Supabase site, the clean route is a Supabase Edge Function that POSTs server events to the CAPI endpoint - reuses the n8n/Edge infra already in play.
- **Current blocker:** dataset "Siam Scuba - Nemo" (1311274604282581) shows "Never received events", confirming the Pixel is not firing. This must be fixed before any web optimization is possible.

**Honest verdict.** Worth doing, but second to Messaging, and pointless until a Meta campaign is live.

---

### 2B. App - SKIP

Siam Scuba has no native iOS/Android app. The App data source (Facebook SDK / app events) is irrelevant. No further analysis. The WhatsApp bot ("Nemo") is **not** an app in this sense - it is covered under Messaging.

---

### 2C. Offline - PRIORITY 4 (low)

**What it does.** Upload conversions that happened off-Meta and off-web - in-person at the shop, walk-ins, phone bookings, cash payments - so Meta can attribute them back to ad views/clicks and learn from them. Post-May-2025 this is uploaded through the unified CAPI rather than the old Offline Conversions API. ([AdAmigo, 2025](https://www.adamigo.ai/blog/meta-conversions-api-offline-data-sync))

**Concrete Siam Scuba use case.** A diver sees an Instagram ad, doesn't click, then walks into the Koh Tao shop a week later and books an Advanced course (11,000 THB) paid in cash. Uploading that booking (hashed email/phone + value + time) lets Meta credit the ad and optimize toward people who convert offline too.

**Realistic benefit.** Real but marginal at this scale. Offline matching needs decent volume to move delivery, and Siam Scuba's "offline" bookings are a minority of an already WhatsApp-dominated funnel. The matched-rate also depends on capturing clean email/phone at point of sale, which a dive shop often doesn't.

**Setup effort/cost.** Free to upload, but **operationally heavy**: you need a disciplined export from DiveOS (hashed customer PII + value + timestamp), recurring uploads, and the consent/privacy work in section 3. Effort is medium-high for low payoff.

**Honest verdict.** Defer. Re-evaluate only after Messaging + Web are live and producing volume.

---

### 2D. CRM - PRIORITY 4 (low), overlaps Offline

**What it does.** Connect a CRM / customer list as a data source - either to upload **leads** (people who enquired) for measurement and optimization, or to upload a **customer list** to build Custom Audiences and from them **Lookalike Audiences** (Meta finds new people statistically similar to your past customers).

**Concrete Siam Scuba use case.**
- Lookalike: export the list of past course customers from DiveOS, upload as a (hashed) Custom Audience, then ask Meta for a 1-3% Lookalike in Israel + key English-speaking markets - prospecting for new Israeli divers who resemble past ones.
- Suppression: upload current/active customers and **exclude** them from prospecting ads so budget isn't wasted re-targeting people already booked.

**Realistic benefit.** Lookalikes can be strong for prospecting - but they need a seed list of meaningful size (Meta wants hundreds-plus matched records to build a quality Lookalike) and a live prospecting campaign to feed. At Siam Scuba's current scale and with messaging as the dominant channel, the messaging-signal Lookalike (built automatically from CTWA conversions) will usually beat a manually maintained CRM upload, with far less effort and lower privacy exposure.

**Setup effort/cost.** Free to upload; effort medium. The heavier cost is **legal/consent** (section 3), because you are uploading identifiable customer PII.

**Honest verdict.** Defer. If you later want Lookalikes, prefer the ones Meta derives from CTWA/web conversion events over hand-uploaded CRM lists - lower compliance burden, comparable quality.

---

### 2E. Messaging - PRIORITY 1 (highest relevance)

**What it does.** Connects business-chat events from **WhatsApp / Messenger / Instagram** into the dataset via CAPI for business messaging, so Meta can optimize **click-to-message ads** not just for "started a conversation" but for what happens *inside* the chat - lead qualified, booking made, purchase value. ([WhatsApp Business, 2025](https://whatsappbusiness.com/blog/conversions-api-messaging/); [AiSensy, 2025](https://m.aisensy.com/blog/meta-conversion-api-click-to-whatsapp-ads/))

**How it optimizes ads (the important part).**
- A **click-to-WhatsApp (CTWA)** ad sends the tap straight into a WhatsApp chat (with the new business number +66825068898). Without messaging CAPI, Meta only knows a conversation *started* - a black box after that.
- With messaging CAPI, you send events back from the chat: `Lead` when Nemo qualifies an enquiry, `Purchase` (with value, e.g. 12,000 THB) when a course is booked. Meta then optimizes delivery toward people likely to **message AND convert**, and reports ROAS on actual bookings rather than conversations started. ([WhatsApp Business, 2025](https://whatsappbusiness.com/blog/conversions-api-messaging/); [Reach.tools, 2025](https://reach.tools/mastering-whatsapp-conversions-in-meta-advertising/))
- Meta's own framing: it eliminates the "black box" between ad click and final conversion, and its 2025-2026 attribution updates increased the weight given to these server-side messaging signals. ([WhatsApp Business, 2025](https://whatsappbusiness.com/blog/conversions-api-messaging/))

**Event structure** (for whoever implements it): server events use `action_source: "business_messaging"` and `messaging_channel: "whatsapp"`, with standard `event_name` like `Lead` or `Purchase`, `event_time`, and value. Validate via Events Manager → Test Events, selecting the messaging channel. ([Kommo, 2025](https://www.kommo.com/support/messenger-apps/capi-how-to-set-it-up/); [Datahash, 2025](https://www.datahash.com/docs/whatsapp-capi/step-2-set-whatsapp-capi-as-data-destination/))

**Does it conflict with the Cloud API / Nemo / the freshly-unbanned number?**
- **No conflict - it is complementary.** Nemo runs on the WhatsApp **Cloud API** (Meta-hosted) via n8n. Messaging CAPI is a *separate* outbound stream of conversion events to Events Manager. The same n8n flow that powers Nemo is the natural place to emit the CAPI `Lead`/`Purchase` events when a chat reaches those milestones - one webhook step, reusing the credentials pattern already in the project.
- **Number caution:** the business number was recently unbanned/migrated (now on +66825068898, per project memory). CTWA ads will drive a spike of inbound first-time conversations. Two practical cautions: (1) make sure the number's WhatsApp Business Account messaging limits / quality rating can absorb the new inbound volume before scaling spend, and (2) Nemo must handle cold inbound leads gracefully from day one, because a CTWA ad sends strangers, not existing contacts. Start spend low and ramp.

**Setup effort/cost.** Free (CAPI usage is free; you pay only for the ads). Effort medium - the moving parts are: a CTWA ad (built in Ads Manager), the WhatsApp number connected to the dataset/page, and the n8n step that posts `Lead`/`Purchase` to messaging CAPI. The ad can run *before* CAPI (optimizing for "conversation started"); adding CAPI later upgrades it to optimize for real bookings.

**Honest verdict.** This is the best-fit data source for Siam Scuba's funnel. Do it first.

---

## 3. Privacy / consent reality (Offline + CRM, and to a lesser degree Web)

This is the part that makes Offline/CRM less attractive than they look on paper.

- **Hashing is not a free pass.** Meta hashes name/email/phone before matching, but the data is **collected before hashing**, and that collection is what needs a lawful basis. A German DPA ruled that uploading customer lists without consent was unlawful, and that hashing does not anonymize data when matching is still possible. ([iubenda](https://www.iubenda.com/en/help/23965-facebook-custom-audience-gdpr-how-to-be-compliant/); [EDRi](https://edri.org/our-work/facebook-custom-audience-illegal-without-explicit-user-consent/))
- **GDPR (EU customers).** Siam Scuba serves English speakers including EU residents. For those, the shop is the **data Controller** and Meta is the **Processor**; uploading their PII for Custom Audiences generally requires **explicit consent** and disclosure in a privacy policy. ([Facebook Custom Audience Terms](https://www.facebook.com/legal/terms/customaudience); [AdAmigo](https://www.adamigo.ai/blog/custom-audiences-vs-lookalike-audiences-gdpr-impact)) Meta now pauses campaigns and restricts tools that violate these permission requirements.
- **Thailand PDPA.** Thailand's PDPA broadly mirrors GDPR principles - lawful basis / consent for collecting and processing personal data, with the shop as the responsible party. ([Cookiebot, PDPA](https://www.cookiebot.com/en/thailand-pdpa/)) Uploading Thai/walk-in customer PII to Meta sits squarely inside PDPA scope.
- **Web pixel consent.** Even the Web Pixel needs a consent/cookie banner on siamscuba.com for EU visitors (Meta Consent Mode / signals). ([Secure Privacy, 2025](https://secureprivacy.ai/blog/meta-consent-mode-explained-2025))

**Implication.** Offline and CRM uploads require: a consent mechanism at point of data capture (booking form / DiveOS), a privacy-policy line authorizing Meta sharing, and recurring hygiene. For a small dive shop, that compliance overhead outweighs the marginal optimization gain right now. Messaging and Web-conversion events carry a lighter (though non-zero) burden because they ride first-party interactions the customer initiated, and the Lookalikes Meta derives from them avoid bulk PII upload entirely.

---

## 4. The key dependency: are they even running Meta ads?

**Every data source above is an input to Meta ad optimization.** Today Siam Scuba runs **Google Ads**; running Meta (FB/IG) ads is **not confirmed**. This is the load-bearing fact:

- If no Meta campaign is live, connecting Web/Offline/CRM/Messaging gives you reporting dashboards and **no new customers**. Optimization needs a campaign to optimize.
- **Prerequisite:** a Meta Business account + ad account in good standing, a payment method, the Facebook Page connected, and at least one live campaign. (The recent WhatsApp number un-ban is a reminder to keep the Business/WABA standing clean before scaling spend.)

**Is click-to-WhatsApp advertising a strong fit for a Koh Tao dive shop targeting Israeli travelers? Yes - it is close to an ideal fit:**
- The funnel is already WhatsApp-driven, so CTWA removes friction: tap ad → land in chat → Nemo qualifies → book. No landing page, no form drop-off.
- Instagram/Facebook are highly visual - dive/underwater photo and video content is exactly what stops the scroll, and Siam Scuba produces this (UW photo/video, photographer course).
- Israeli travelers are heavy WhatsApp users and an identifiable, targetable audience (Hebrew-language creative, interest + travel targeting, lookalikes off past customers).
- Higher-ticket offerings (Open Water 12,000, photographer course 37,000 THB) justify a customer-acquisition cost that supports paid prospecting.
- CTWA + messaging CAPI gives a measurable closed loop: spend in → conversations → bookings → ROAS, which Google Search Ads alone can't give for a chat-closed sale.

**Honest caveat:** CTWA works best when someone (Nemo + a human fallback) answers fast and in the right language. Slow or robotic chat handling will burn ad spend. Nemo's readiness is part of the prerequisite, not a nice-to-have.

---

## 5. Prioritized recommendation

| # | Move | What it unlocks | Effort | Depends on |
|---|------|-----------------|--------|------------|
| 1 | **Launch one click-to-WhatsApp (CTWA) campaign** to +66825068898, small budget, Hebrew + English creative using existing dive video | Real Meta customer acquisition into the existing WhatsApp funnel | Medium (creative + Ads Manager + ad account in good standing) | Meta ad account live; Nemo answers cold leads |
| 2 | **Connect Messaging CAPI** (WhatsApp business-chat events via the n8n/Nemo flow: `Lead`, `Purchase` w/ value) | Upgrades the CTWA campaign from "optimize for conversations" to "optimize for actual bookings" + true ROAS | Medium (one n8n step + dataset/page link) | #1 running; Nemo flow |
| 3 | **Fix + install Web Pixel + CAPI on siamscuba.com** (route-change PageView, WhatsApp-click `Lead`, booking `Purchase`; server events via Supabase Edge Fn) | Retargeting course-page visitors on IG; web ROI measurement; dataset stops showing "Never received events" | Medium (SPA event wiring + Edge Fn; keep vercel.json rewrites) | Meta ads live to make retargeting useful |
| - | **Offline** | Marginal attribution of walk-in/cash bookings | Med-high + consent | Skip for now |
| - | **CRM / customer-list Lookalikes** | Prospecting audiences | Med + heavy consent | Skip; prefer CTWA-derived lookalikes later |
| - | **App** | n/a | - | Skip - no app |

**Expected impact.**
- #1 directly drives customer acquisition by feeding the channel that already converts best (WhatsApp), with measurable cost-per-conversation.
- #2 sharpens campaign precision the most for the least effort - it points Meta at people who actually *book*, not just chat, and gives honest ROAS. This is the highest-precision-per-hour move.
- #3 adds a cheap retargeting layer and proper web measurement, but its payoff is gated on ads already running.

**What to skip:** App (no app), Offline and CRM uploads (low marginal value, real PDPA/GDPR consent overhead at this scale). Revisit CRM lookalikes only after the messaging loop is producing volume - and even then prefer Meta-derived lookalikes from CTWA conversions over bulk PII uploads.

**Single highest-ROI move:** stand up **one click-to-WhatsApp campaign** (move #1). It is the only move that produces new customers on its own; the data sources (Messaging CAPI, Web Pixel) are multipliers that make that campaign smarter and measurable.

**Realistic "start here" first step (this week):**
1. Confirm a Meta ad account + Facebook Page in good standing and the WhatsApp number +66825068898 is properly connected as a messaging channel in Events Manager.
2. Build **one** CTWA ad in Ads Manager - small daily budget, optimize for "conversations", Hebrew + English variants, best existing dive video as creative, targeting Israeli + English-speaking travelers interested in Thailand/diving.
3. Confirm Nemo handles a cold inbound lead end-to-end before pushing spend.
Then, once conversations flow, add Messaging CAPI (move #2) to optimize for bookings, and fix the web Pixel/CAPI (move #3) for retargeting.

---

## Sources

- [Madgicx - Facebook Events Manager (2025)](https://madgicx.com/blog/facebook-events-manager)
- [LeadEnforce - Meta Datasets Explained (2025)](https://leadenforce.com/blog/meta-datasets-explained-how-event-tracking-works-in-events-manager)
- [AdAmigo - Meta Conversions API for Offline Data Sync (2025; Offline API retired 2025-05-14)](https://www.adamigo.ai/blog/meta-conversions-api-offline-data-sync)
- [HackMD - Meta Events Manager Guide 2025: Tracking, CAPI, Optimization](https://hackmd.io/@agrowthagency/rJ-4LYD7be)
- [PPC.land - Meta's free one-click Conversions API is now live (2025)](https://ppc.land/metas-free-one-click-conversions-api-is-now-live-no-developer-needed/)
- [WhatsApp Business - Conversions API for messaging (2025)](https://whatsappbusiness.com/blog/conversions-api-messaging/)
- [AiSensy - Meta Conversion API for Click to WhatsApp Ads (2025)](https://m.aisensy.com/blog/meta-conversion-api-click-to-whatsapp-ads/)
- [Reach.tools - Mastering WhatsApp Conversions in Meta Advertising (2025)](https://reach.tools/mastering-whatsapp-conversions-in-meta-advertising/)
- [Kommo - Set up Meta Conversions API (CAPI)](https://www.kommo.com/support/messenger-apps/capi-how-to-set-it-up/)
- [Datahash - Setup WhatsApp CAPI as Data Destination](https://www.datahash.com/docs/whatsapp-capi/step-2-set-whatsapp-capi-as-data-destination/)
- [Facebook - Customer List Custom Audiences Terms](https://www.facebook.com/legal/terms/customaudience)
- [AdAmigo - Custom Audiences vs Lookalike Audiences: GDPR Impact](https://www.adamigo.ai/blog/custom-audiences-vs-lookalike-audiences-gdpr-impact)
- [iubenda - Facebook Custom Audience and the GDPR](https://www.iubenda.com/en/help/23965-facebook-custom-audience-gdpr-how-to-be-compliant/)
- [EDRi - Facebook Custom Audience illegal without explicit user consent](https://edri.org/our-work/facebook-custom-audience-illegal-without-explicit-user-consent/)
- [Cookiebot - PDPA Thailand](https://www.cookiebot.com/en/thailand-pdpa/)
- [Secure Privacy - Meta Consent Mode Explained 2025](https://secureprivacy.ai/blog/meta-consent-mode-explained-2025)
