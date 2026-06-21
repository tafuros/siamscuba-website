import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
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
        // Fire conversion before navigation so the ping is sent even if routing fails.
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
        navigate("/booking-confirmed", { state: data.lead ?? null });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

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

          <iframe
            src={iframeSrc}
            title="Siam Scuba Booking Form"
            className="w-full border-0"
            style={{ height: "calc(100vh - 100px)", minHeight: "600px" }}
            allow="camera;microphone"
            loading="eager"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </motion.main>
    </div>
  );
};

export default FunDiveBookingPage;
