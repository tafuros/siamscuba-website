# Meta Pixel via GTM - wiring spec (siamscuba.com)

Status: code side SHIPPED (branch feat/meta-pixel-spine). GTM side BLOCKED on the
Pixel ID - the nemo agent is confirming the Siam Scuba Meta Business pixel/dataset.
Once the ID exists, this doc is a 10-minute GTM session.

Parent plan: Creative/Documents/campaign-plans/meta-foundation-spec-2026-07-12.md (section 1).

## How the site emits Meta events (already live in code)

There is NO hard-coded pixel snippet and there must never be one - GTM container
`GTM-TN3SM66Q` (already in index.html) owns the Meta Pixel. The site pushes two
kinds of dataLayer messages:

1. `ads_consent_granted` - pushed by `src/components/CookieConsent.tsx` when the
   visitor accepts cookies, and on mount for returning visitors who accepted
   before. Fires exactly once per page load, never for decliners. This is the
   consent gate: the Meta base tag triggers on it, so the pixel only ever loads
   with ad consent (mirrors the Google Consent Mode v2 behavior already on the site).

2. `meta_event` - pushed by the `fbq()` wrapper in `src/utils/tracking.ts` for
   every tracked action. Shape:

   ```js
   {
     event: "meta_event",
     meta_event_type: "track" | "trackCustom",
     meta_event_name: "ViewContent",        // Meta standard or custom event name
     meta_event_params: { ... },            // event params object
     meta_event_id: "uuid"                  // for future CAPI dedup (phase 2)
   }
   ```

### Event map (what fires where)

| meta_event_name | type | Fires when | Key params |
|---|---|---|---|
| PageView | track | Every route change incl. first paint (RouteTracker in App.tsx) | - |
| ViewContent | track | Campaign-lander mount: /open-water-course, /fun-dives, /discover-scuba-diving, /advanced-open-water-course, /koh-tao-diving, /sail-rock-diving + their /es /he /fr variants | content_name = course slug (e.g. "open-water-course"), content_category, value?, currency |
| Lead | track | Booking-wizard submit (SIAM_BOOKING_LEAD postMessage on /fun-dive-booking - the same point that fires the Google Ads lead conversion), chat lead capture, course inquiry | form_name, content_name, currency |
| Purchase | track | Booking complete WITH deposit paid (same point as the Google Ads Purchase conversion) | value, currency, content_name |
| Schedule | track | Booking complete, pay-on-arrival (mirrors Google "Booking - Pay Later") | content_name |
| Contact | track | Any click-to-WhatsApp click: lander CTAs (trackWhatsAppClick) AND the booking-page fast-path strip (trackWhatsAppFastPathClick) | location, content_name? |
| ChatOpen / ChatEngaged / ChatCtaClick | trackCustom | Nemo chat engagement signals | source / cta |

Notes:
- The requested "/discover-scuba" page is live at route `/discover-scuba-diving`.
- The GA-side `whatsapp_fastpath_click` dataLayer event still fires unchanged
  (GA4/Clarity use it); Meta-side the same click now also emits Contact through
  `meta_event`, so ONE Contact trigger covers all WhatsApp clicks - no extra
  trigger on `whatsapp_fastpath_click` is needed.
- Every `meta_event` carries a `meta_event_id` UUID. The relay tag passes it as
  `eventID`, which makes the phase-2 server-side CAPI dedup trivial.

## GTM build steps (do once the Pixel ID arrives)

Only 2 tags, 2 triggers, 4 variables. The relay tag forwards ALL current and
future events - adding a new Meta event later needs zero GTM work.

### 1. Variables (Data Layer Variables, version 2)

| Variable name | Data layer variable name |
|---|---|
| DLV - meta_event_type | meta_event_type |
| DLV - meta_event_name | meta_event_name |
| DLV - meta_event_params | meta_event_params |
| DLV - meta_event_id | meta_event_id |

### 2. Triggers (Custom Event)

| Trigger name | Event name |
|---|---|
| CE - ads_consent_granted | ads_consent_granted |
| CE - meta_event | meta_event |

### 3. Tag 1: "Meta Pixel - Base" (Custom HTML)

Trigger: `CE - ads_consent_granted`. Replace `PIXEL_ID_HERE`:

```html
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'PIXEL_ID_HERE');
fbq('track', 'PageView');
</script>
```

The `fbq('track','PageView')` here covers the LANDING page view (the code-level
PageView push happens before consent resolves and is intentionally dropped -
see sequencing below). Subsequent SPA route changes come from the relay tag.

### 4. Tag 2: "Meta Pixel - Event Relay" (Custom HTML)

Trigger: `CE - meta_event`:

```html
<script>
(function() {
  if (!window.fbq) return; // no consent -> no pixel -> drop silently
  window.fbq(
    {{DLV - meta_event_type}},
    {{DLV - meta_event_name}},
    {{DLV - meta_event_params}} || {},
    { eventID: {{DLV - meta_event_id}} }
  );
})();
</script>
```

Sequencing guarantee (why PageView never double-counts):
- The first-paint `meta_event` PageView (RouteTracker mount) is ALWAYS pushed
  before `ads_consent_granted` (CookieConsent mount runs after, and banner
  accept is later still). GTM processes the dataLayer queue in order, so when
  the relay handles that first PageView, `window.fbq` does not exist yet and
  it drops - the base tag then fires the landing PageView exactly once.
- Subsequent SPA route changes relay one PageView each (fbq exists by then).
- Decliners: `ads_consent_granted` never fires, `fbq` never exists, all
  `meta_event` pushes drop silently. Zero Meta tracking without consent.

### 5. Publish + verify

1. GTM Preview mode on siamscuba.com: accept cookies, confirm "Meta Pixel - Base"
   fires once, then navigate to /open-water-course and confirm the relay fires
   ViewContent with content_name "open-water-course".
2. Meta Events Manager -> Test Events (browser tab): confirm PageView,
   ViewContent, Contact (click a WhatsApp CTA), Lead (submit the booking wizard
   with a test lead).
3. Meta Pixel Helper extension as a second opinion.
4. Publish the GTM container. Do NOT start spend until Events Manager shows the
   events as verified/active (gate condition in the meta foundation spec).

## Explicitly out of scope here

- CAPI / server-side GTM: phase 2, only after the browser pixel is verified.
  The eventID plumbing is already in place for it.
- Advanced Matching (email/phone to Meta): not enabled. Decide separately -
  Google enhanced conversions already cover match quality on the Google side.
