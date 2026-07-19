# GA4 conversion events via GTM - wiring spec (siamscuba.com)

Status: code side SHIPPED (branch `fix/ga4-conversion-events-datalayer`). GTM side
is this ~10-minute clicklist. Companion to `docs/meta-pixel-gtm-spec.md`.

## The bug this fixes

GA4 property `G-5WHV1MM0DR` was showing **0 conversions** for every campaign even
though Google Ads itself logged 146 conversions / 19,705 THB (Jul 3-16). Root cause
is NOT Ads: the GA4 property simply never received the manual conversion events.

- `G-5WHV1MM0DR` is loaded ONLY through GTM container `GTM-TN3SM66Q`. There is no
  `gtag('config','G-5WHV1MM0DR')` anywhere on the page (index.html only configs the
  Ads account `AW-18050429438`).
- Every conversion in `src/utils/tracking.ts` fired via `gtag('event', …)` which
  routes to the on-page Ads account, plus `send_to: AW-…` conversion pings. None of
  it reaches the GTM-loaded GA4 property.
- So GA4 only ever saw its own enhanced-measurement AUTOMATIC events (page_view,
  scroll, click, session_start, first_visit, user_engagement, form_start). Zero
  manual events -> zero keyEvents -> every DiveOS screen reading GA4 shows 0.

## The fix (already live in code)

The site now pushes each key conversion onto the dataLayer as a clean custom event
(via `pushDataLayer()` in `src/utils/tracking.ts`), the same convention the existing
`whatsapp_fastpath_click` event already uses. This is **additive**: the gtag() Ads
pings are untouched, so the 146 Ads conversions keep working - GA4 just finally gets
the events too, relayed by GTM GA4 Event tags.

### Event map (what the site now pushes)

| dataLayer event | Fires when | Key params | Mark as Key Event? |
|---|---|---|---|
| `generate_lead` | Booking-wizard submit, chat lead capture, course inquiry (same point as the Ads lead conversion) | `form_name`, `product`, `dive_date`, `currency` | **Yes** |
| `purchase` | Booking complete WITH deposit paid (same point as the Ads Purchase conversion) | `transaction_id`, `value`, `currency`, `item_name` | **Yes** |
| `booking_pay_later` | Booking complete, pay-on-arrival (mirrors Ads "Booking - Pay Later") | `transaction_id`, `product` | **Yes** |
| `whatsapp_click` | Click-to-WhatsApp on lander CTAs | `location`, `url` | **Yes** (contact conversion) |
| `whatsapp_fastpath_click` | Booking-page WhatsApp fast-path strip (already pushed pre-fix) | `product`, `dive_date`, `url` | Optional (signal) |

All events also carry the UTM passthrough fields (`campaign_source`, `campaign_medium`,
`campaign_name`, `campaign_content`, `campaign_term`) when a stored UTM exists.

## GTM build steps (~10 minutes)

Assumes a GA4 Configuration tag for `G-5WHV1MM0DR` already exists in the container
(it does - it is what emits the automatic events). If not, create one first
(Tag type: Google Tag, ID `G-5WHV1MM0DR`, trigger: Initialization - All Pages).

### 1. Variables (Data Layer Variables, version 2) - create these 11

| Variable name | Data layer variable name |
|---|---|
| DLV - form_name | form_name |
| DLV - product | product |
| DLV - dive_date | dive_date |
| DLV - currency | currency |
| DLV - value | value |
| DLV - transaction_id | transaction_id |
| DLV - item_name | item_name |
| DLV - location | location |
| DLV - url | url |
| DLV - campaign_source | campaign_source |
| DLV - campaign_medium | campaign_medium |

(`campaign_name/content/term` are optional - add only if you want them as event params.)

### 2. Triggers (Custom Event) - create these 5

| Trigger name | Event name (exact) |
|---|---|
| CE - generate_lead | generate_lead |
| CE - purchase | purchase |
| CE - booking_pay_later | booking_pay_later |
| CE - whatsapp_click | whatsapp_click |
| CE - whatsapp_fastpath_click | whatsapp_fastpath_click |

### 3. Tags - 5 GA4 Event tags

For each, Tag type = **Google Analytics: GA4 Event**, Configuration/Measurement ID =
`G-5WHV1MM0DR` (or select the existing GA4 Config tag), then:

| Tag name | Event Name | Event Parameters (name = {{Variable}}) | Trigger |
|---|---|---|---|
| GA4 - generate_lead | `generate_lead` | form_name={{DLV - form_name}}, product={{DLV - product}}, dive_date={{DLV - dive_date}}, currency={{DLV - currency}} | CE - generate_lead |
| GA4 - purchase | `purchase` | transaction_id={{DLV - transaction_id}}, value={{DLV - value}}, currency={{DLV - currency}}, item_name={{DLV - item_name}} | CE - purchase |
| GA4 - booking_pay_later | `booking_pay_later` | transaction_id={{DLV - transaction_id}}, product={{DLV - product}} | CE - booking_pay_later |
| GA4 - whatsapp_click | `whatsapp_click` | location={{DLV - location}}, url={{DLV - url}} | CE - whatsapp_click |
| GA4 - whatsapp_fastpath_click | `whatsapp_fastpath_click` | product={{DLV - product}}, dive_date={{DLV - dive_date}} | CE - whatsapp_fastpath_click |

### 4. Mark as Key Events in GA4 (not GTM)

GA4 console -> Admin -> Events (or Key events). After the first live hits arrive
(may take a few hours to appear), toggle **Mark as key event** for:
`generate_lead`, `purchase`, `booking_pay_later`, `whatsapp_click`.
(`whatsapp_fastpath_click` optional.)

Tip: `value`/`currency` on `purchase` make GA4 attribute revenue - keep those two
mapped exactly as named or the revenue column stays blank.

### 5. Preview + publish

Use GTM Preview (Tag Assistant), submit a test lead / WhatsApp click, confirm each
CE trigger fires its GA4 tag, then Submit/Publish the container. Verify in GA4
Realtime that `generate_lead` etc. show up.

## Downstream: DiveOS backend (flagged, not this repo's change)

`backend/src/lib/ga4.ts:163` in Dive-OS currently queries the GA4 Data API `conversions`
metric, which is deprecated in favor of `keyEvents`. Once GA4 starts receiving these
events and they are marked as Key Events, that query should switch `conversions` ->
`keyEvents`, then run a re-sync: `POST /api/insights/campaigns/sync?days=365`.
