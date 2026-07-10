import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Seo from "@/components/Seo";
import {
  trackGenerateLead,
  trackPurchase,
  trackBookingPayLater,
} from "@/utils/tracking";
import { getStoredUtm, getStoredGclid } from "@/utils/utm";

const LEAD_FORM_URL = "https://dash.siamscuba.com/dive/ben";
// Accept messages from the iframe (dash.*) AND from the same site under
// either apex or www. The dashboard currently posts with targetOrigin set
// to the apex; if a user lands on www the browser drops that message
// silently. The www entry below + the targetOrigin fix on the dashboard
// side together close that gap.
const ALLOWED_ORIGINS = [
  "https://dash.siamscuba.com",
  "https://siamscuba.com",
  "https://www.siamscuba.com",
];

const FunDiveBookingPage = () => {
  const [loaded, setLoaded] = useState(false);
  // Mount the iframe only after hydration. Its src depends on the query string
  // (?product/?date/utm_*/gclid), which the SSG HTML can't know - hydrating a
  // param-carrying ad click against the static param-less iframe was a React
  // prop mismatch, and React keeps the SERVER attribute on mismatch, silently
  // stripping attribution off the wizard URL. First client render now matches
  // the static HTML (spinner only), then the iframe mounts with the full src.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Auto-sized iframe height. The DiveOS wizard posts SIAM_BOOKING_HEIGHT on
  // every content-height change so we can grow the iframe to fit its content -
  // this kills the iOS Safari inner-scroll momentum trap (tall content used to
  // scroll INSIDE a fixed-height iframe). Null until the first message arrives;
  // the iframe falls back to a viewport-based height so it is never collapsed.
  const [reportedHeight, setReportedHeight] = useState<number | null>(null);
  const location = useLocation();

  // Forward booking context + attribution into the DiveOS wizard iframe.
  // - `product` + `date` let the wizard pre-select the trip & departure
  //   (e.g. ?product=SAILROCK&date=2026-06-22 from the Sail Rock lander).
  // - utm_* and gclid are forwarded for attribution. When the caller sets
  //   utm_passthrough=1 we also pull first-touch UTMs/gclid from sessionStorage
  //   (captured on the lander) so attribution survives the in-app navigation.
  // The DiveOS wizard reads these params (work done in parallel by the diveos
  // agent); we only deliver them on the iframe URL.
  const iframeSrc = useMemo(() => {
    const incoming = new URLSearchParams(location.search);
    const out = new URLSearchParams();

    const product = incoming.get("product");
    if (product) out.set("product", product);
    const date = incoming.get("date");
    if (date) out.set("date", date);

    // Explicit utm_* / gclid present on the incoming URL win.
    for (const [key, value] of incoming.entries()) {
      if (key.startsWith("utm_") && key !== "utm_passthrough" && value) {
        out.set(key, value);
      }
    }
    const incomingGclid = incoming.get("gclid");
    if (incomingGclid) out.set("gclid", incomingGclid);

    // Backfill from first-touch storage when asked, without clobbering explicit
    // values already set above.
    if (incoming.get("utm_passthrough") === "1") {
      const utm = getStoredUtm();
      const utmMap: Record<string, string | undefined> = {
        utm_source: utm.source,
        utm_medium: utm.medium,
        utm_campaign: utm.campaign,
        utm_content: utm.content,
        utm_term: utm.term,
      };
      for (const [key, value] of Object.entries(utmMap)) {
        if (value && !out.has(key)) out.set(key, value);
      }
      const storedGclid = getStoredGclid();
      if (storedGclid && !out.has("gclid")) out.set("gclid", storedGclid);
    }

    const qs = out.toString();
    return qs ? `${LEAD_FORM_URL}?${qs}` : LEAD_FORM_URL;
  }, [location.search]);
  // Fire the lead conversion at most once per page session, so a customer who
  // edits their contact details mid-wizard (re-emitting SIAM_BOOKING_LEAD)
  // doesn't double-count in Google Ads / Meta.
  const leadFiredRef = useRef(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        console.warn("[booking] rejected postMessage origin:", event.origin);
        return;
      }

      const data = event.data;
      if (!data || typeof data !== "object") return;

      // AUTO-SIZE: the wizard reports its content height so we can grow the
      // iframe to fit. Validate it's a finite positive number and clamp to a
      // sane range (a bogus 0 / NaN / huge value must never collapse or blow up
      // the layout). We update state inside this one stable listener; the
      // listener itself never depends on reportedHeight (see effect deps).
      // Contract: { type: "SIAM_BOOKING_HEIGHT", height: <px>, schemaVersion: 1 }
      if (data.type === "SIAM_BOOKING_HEIGHT") {
        const rawHeight = data.height;
        if (typeof rawHeight === "number" && Number.isFinite(rawHeight) && rawHeight > 0) {
          const clamped = Math.min(6000, Math.max(400, Math.round(rawHeight)));
          setReportedHeight(clamped);
        }
        return;
      }

      // CANONICAL CONTRACT (matches diveos customer-wizard emitter):
      // Lead:     { type: "SIAM_BOOKING_LEAD", product?, courseStartDate?, email?, phone?, schemaVersion: 1 }
      // Complete: { type: "SIAM_BOOKING_COMPLETE", bookingId?, value?, currency?, email?, phone?, lead?, schemaVersion: 1 }
      // All conversion fields are read from the TOP LEVEL of the message.
      //
      // ENHANCED CONVERSIONS: email + phone are passed through to the Google Ads
      // conversion (gtag user_data) so Google can hash + match the conversion to
      // the ad click. They are OPTIONAL here - if DiveOS hasn't added them yet we
      // simply fire the conversion without EC data (status quo). For email we
      // prefer top-level data.email, falling back to data.lead.email; same for
      // phone. They are read defensively because data.lead is a free-form blob.

      // Pull an enhanced-conversion identifier from top level, falling back to
      // the lead blob. Returns undefined when absent so EC is simply skipped.
      const ecString = (topKey: string, leadKey: string): string | undefined => {
        const top = (data as Record<string, unknown>)[topKey];
        if (typeof top === "string" && top.trim() !== "") return top;
        const fromLead = (data?.lead as Record<string, unknown> | undefined)?.[leadKey];
        if (typeof fromLead === "string" && fromLead.trim() !== "") return fromLead;
        return undefined;
      };
      const ecEmail = ecString("email", "email");
      const ecPhone = ecString("phone", "phone");

      if (data.type === "SIAM_BOOKING_LEAD") {
        console.log("Booking lead:", data);
        if (leadFiredRef.current) return;
        leadFiredRef.current = true;
        const product =
          typeof data.product === "string" ? data.product : undefined;
        const diveDate =
          typeof data.courseStartDate === "string"
            ? data.courseStartDate
            : undefined;
        trackGenerateLead({
          form_name: "booking_wizard",
          dive_date: diveDate,
          product,
          email: ecEmail,
          phone: ecPhone,
        });
      }

      if (data.type === "SIAM_BOOKING_COMPLETE") {
        console.log("Booking complete:", data);
        // Fire the conversion only. We intentionally do NOT navigate away: the
        // DiveOS wizard renders its own completion screen inside the iframe
        // (email-focused confirmation + in-wizard cert-photo upload), which is
        // the single source of truth for the confirmation message. Navigating
        // to a separate /booking-confirmed page produced a duplicate (and now
        // obsolete "WhatsApp your photos") confirmation, so it was removed.
        const rawValue = data.value;
        const numericValue =
          typeof rawValue === "number"
            ? rawValue
            : typeof rawValue === "string" && rawValue.trim() !== ""
              ? Number(rawValue)
              : undefined;
        const value =
          typeof numericValue === "number" && !Number.isNaN(numericValue)
            ? numericValue
            : undefined;
        const currency =
          typeof data.currency === "string" ? data.currency : undefined;
        const transactionId =
          typeof data.bookingId === "string"
            ? data.bookingId
            : `booking_${Date.now()}`;
        const product =
          typeof data?.lead?.product === "string"
            ? data.lead.product
            : undefined;
        // TWO-TIER purchase rule: a deposit-paid booking is a revenue Purchase;
        // a pay-on-arrival booking fires the lower-tier "Booking - Pay Later"
        // conversion WITHOUT a value (we haven't collected money yet).
        const paid = data?.lead?.depositPaid === true;
        if (paid) {
          trackPurchase({
            transaction_id: transactionId,
            value,
            currency,
            item_name: "Dive Booking",
            email: ecEmail,
            phone: ecPhone,
          });
        } else {
          trackBookingPayLater({
            transaction_id: transactionId,
            product,
            email: ecEmail,
            phone: ecPhone,
          });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-ocean-surface">
      <Seo
        title="Book a Fun Dive in Koh Tao – Guided Day Trips | Siam Scuba"
        description="Book a guided fun dive in Koh Tao with Siam Scuba: small groups, two custom dive boats, sites including Chumphon Pinnacle, Sail Rock, and Twins."
      />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="container mx-auto px-4 py-6 max-w-5xl"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="relative w-full rounded-xl overflow-hidden border border-border/50 shadow-lg bg-card">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {mounted && (
          <iframe
            src={iframeSrc}
            title="Siam Scuba Booking Form"
            className="block w-full border-0"
            // Auto-size to the wizard's reported content height so the iframe
            // never scrolls internally (the parent page scrolls instead - this
            // avoids the iOS Safari momentum-scroll trap). Before the first
            // SIAM_BOOKING_HEIGHT arrives - or if DiveOS hasn't deployed the
            // emitter yet - fall back to a viewport-based height so the iframe
            // is never collapsed.
            style={{
              // Once the wizard reports its true content height we honour it
              // exactly (down to a 400px safety floor that matches the clamp),
              // so short steps - e.g. the Accommodation yes/no - no longer leave
              // a tall white gap below the card. Before the first message we
              // fall back to a viewport height so the iframe is never collapsed.
              height: reportedHeight ? `${reportedHeight}px` : "calc(100vh - 100px)",
              minHeight: reportedHeight ? "400px" : "600px",
              width: "100%",
              border: 0,
            }}
            scrolling="no"
            allow="camera;microphone"
            loading="eager"
            onLoad={() => setLoaded(true)}
          />
          )}
          {/* Reserve the iframe's height pre-mount so the loader box doesn't collapse. */}
          {!mounted && <div style={{ height: "calc(100vh - 100px)", minHeight: "600px" }} />}
        </div>
      </motion.main>
    </div>
  );
};

export default FunDiveBookingPage;
