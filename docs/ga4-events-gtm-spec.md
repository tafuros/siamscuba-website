# GA4 conversion events via GTM - wiring spec (siamscuba.com)

Status: **container GTM-TN3SM66Q is BUILT AND PUBLISHED** (verified 2026-08-29 by
reading the live `gtm.js`: Google Tag for `G-5WHV1MM0DR`, 11 DLVs, 5 custom-event
predicates, 5 GA4 event tags with the param maps below). The clicklist in section
"GTM build steps" is therefore a RECORD of what was built, not an open task.

A follow-on defect - the gtag-shim double-fire - was found and fixed on
2026-08-29; see "Defect: the gtag-shim double-fire" below before touching any
tracking code. Companion to `docs/meta-pixel-gtm-spec.md`.

## The bug this fixes

GA4 property `G-5WHV1MM0DR` was showing **0 conversions** for every campaign even
though Google Ads itself logged 146 conversions / 19,705 THB (Jul 3-16). Root cause
is NOT Ads: the GA4 property simply never received the manual conversion events.

- `G-5WHV1MM0DR` is loaded ONLY through GTM container `GTM-TN3SM66Q`. There is no
  `gtag('config','G-5WHV1MM0DR')` anywhere on the page (index.html only configs the
  Ads account `AW-18357382437` - account 934-806-2676, Thai billing, which replaced
  the retired `AW-18050429438` on 2026-08-02).
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
| `purchase` | Booking COMPLETE with deposit paid (`SIAM_BOOKING_COMPLETE`, `depositPaid: true`) | `transaction_id`, `value`, `currency`, `item_name` | **Yes** |
| `booking_pay_later` | Booking COMPLETE, pay-on-arrival (`SIAM_BOOKING_COMPLETE`, `depositPaid: false`) | `transaction_id`, `product` | **Yes** |
| `generate_lead` | Contact details entered at wizard step 2 (`SIAM_BOOKING_LEAD`) - the form is NOT finished | `form_name`, `product`, `dive_date`, `currency` | **No** |
| `whatsapp_click` | Click-to-WhatsApp on any CTA | `location`, `url` | **No** |
| `whatsapp_fastpath_click` | Booking-page WhatsApp fast-path strip | `product`, `dive_date`, `url` | **No** |

### RULING (Ben, 2026-08-28): only a COMPLETED registration is a conversion

An earlier version of this doc told you to mark `generate_lead` and
`whatsapp_click` as Key Events too. **That was wrong** and Ben corrected it
during the GTM build.

A conversion is a **finished booking form** - nothing else. `generate_lead`
fires when someone types their phone number at step 2 and may still abandon;
`whatsapp_click` is a tap on a button. Both are useful signals and stay fully
collected - they are just not conversions.

This is not bookkeeping pedantry. GA4 Key Events can be imported into Google
Ads and fed to Smart Bidding. Make `whatsapp_click` a key event and the
algorithm optimises toward WhatsApp taps - plentiful and free - instead of
bookings, spending real budget on the cheap action. The Ads account is already
built correctly: Purchase + Pay-Later are Primary, Lead + WhatsApp are
Secondary (observation only, excluded from bidding). Keep GA4 consistent with
that.

All events also carry the UTM passthrough fields (`campaign_source`, `campaign_medium`,
`campaign_name`, `campaign_content`, `campaign_term`) when a stored UTM exists.

## Defect: the gtag-shim double-fire (found + fixed 2026-08-29)

**Symptom.** Every GA4 conversion was counted **twice**. GA4 property 527567742
recorded 2 x `whatsapp_fastpath_click` for Ben's single click on 2026-08-29, and
4 x `whatsapp_click` for two clicks on 2026-08-28.

**Cause.** `index.html` defines the standard shim:

```js
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
```

GTM's **gtag interop** turns an `arguments` push of `["event", name, params]`
into a GTM event literally named `name`. Verified live against the published
container:

```js
gtag('event','__probe_args_<ts>',{})
  -> google_tag_manager['GTM-TN3SM66Q'].dataLayer.get('event') === '__probe_args_<ts>'  // true
dataLayer.push({event:'__probe_obj_<ts>'})
  -> same                                                                              // true
```

So `gtag("event","purchase",…)` fires the **same** Custom Event trigger as
`dataLayer.push({event:"purchase"})`. `src/utils/tracking.ts` was doing both for
the same name, so each GA4 tag fired twice per user action.

> An earlier version of this doc (and a comment in `tracking.ts`) claimed on-page
> `gtag('event',…)` calls "only hit the Google Ads account". **That was wrong**
> and it is what allowed the duplicate to be written. Both push shapes reach GTM.

**Were the bare `gtag('event', <name>)` calls load-bearing?** No - checked before
deleting:

- **Google Ads:** a conversion is only recorded for an event carrying
  `send_to: AW-…/<label>`. Those are the *separate* `gtag("event","conversion",…)`
  calls, which were **not** touched. A bare `gtag("event","purchase",…)` with no
  `send_to` produces no Ads conversion.
- **GA4:** `G-5WHV1MM0DR` is not configured in the on-page gtag context
  (`index.html` configs only `AW-18357382437`), so the bare call never delivered
  a direct GA4 hit. Confirmed arithmetically: the observed count was exactly
  **2**, not 3 - i.e. two GTM trigger firings and no direct delivery.

**Fix (option A - delete the duplicates).** Removed the redundant bare
`gtag("event", <name>, …)` calls from `src/utils/tracking.ts`, keeping every
`send_to` conversion ping. Each event now reaches GTM by exactly one path,
`pushDataLayer()`.

De-duplicated: `whatsapp_click`, `whatsapp_fastpath_click`, `generate_lead`,
`purchase`, `booking_pay_later`, and `book_now_click` (the last had no GA4 tag,
so it was a latent rather than live double-count).

Option B (renaming the dataLayer events to a `ga4_*` namespace) was rejected: it
requires editing the 5 published GTM triggers, and Ben's Google account currently
has **no Tag Manager access at all**, so it could not be completed.

**Guard.** `src/test/ga4-datalayer.test.ts` now stubs `window.gtag` with the
*real* shim (`dataLayer.push(arguments)`) and asserts each event name reaches GTM
exactly once, plus that the Ads `send_to` pings survive. On the unfixed code those
tests fail with `expected 2 to be 1`.

**Rule going forward:** an event may reach the dataLayer by **one** path only. If
GTM has a tag for it, use `pushDataLayer()` and never also call
`gtag("event", <same name>, …)`. See the TRAP comment on `gtag()` in
`src/utils/tracking.ts`.

### Side notes from the same investigation

- Container predicates are exactly `gtm.js` + the 5 event names. There is **no**
  trigger on `conversion`, so the Ads pings cost no GA4 event. Never create one.
- `meta_event` has **0** occurrences in the live container - the Meta Pixel relay
  tags in `docs/meta-pixel-gtm-spec.md` are **not built**, so `fbq()` calls from
  `tracking.ts` currently go nowhere.
- `book_now_click` has no GA4 tag. If one is added, its DLV set is
  `location`, `product`, `url` + the campaign fields.
- Deleting the bare `purchase` gtag also removed the only `items[]` array in the
  codebase. It was inert (Ads-bound, and GA4's tag maps flat params), but GA4
  ecommerce/revenue reporting would need `items` reconstructed in the GTM tag.
- `whatsapp_fastpath_click` and `book_now_click` now carry the campaign fields on
  the dataLayer too (they previously only rode the deleted gtag call).

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

GA4 console -> Admin -> Events (or Key events). GA4 only lets you flag an event
AFTER it has arrived at least once, so this is a separate visit a few hours
later.

Toggle **Mark as key event** for exactly two events:
- `purchase`
- `booking_pay_later`

Leave `generate_lead`, `whatsapp_click` and `whatsapp_fastpath_click` OFF - see
the ruling above. They keep collecting either way.

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
