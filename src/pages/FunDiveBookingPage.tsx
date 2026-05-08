import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Seo from "@/components/Seo";
import { trackPurchase } from "@/utils/tracking";

const LEAD_FORM_URL = "https://dash.siamscuba.com/dive/ben";
const ALLOWED_ORIGINS = ["https://dash.siamscuba.com", "https://siamscuba.com"];

const FunDiveBookingPage = () => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        console.warn("[booking] rejected postMessage origin:", event.origin);
        return;
      }

      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "SIAM_BOOKING_COMPLETE") {
        console.log("Booking complete:", data.data);
        // Fire conversion before navigation so the ping is sent even if routing fails.
        const payload = (data.data ?? {}) as Record<string, unknown>;
        const rawValue = payload.value ?? payload.price ?? payload.amount;
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
          typeof payload.currency === "string" ? payload.currency : undefined;
        const transactionId =
          typeof payload.booking_id === "string"
            ? payload.booking_id
            : typeof payload.id === "string"
              ? payload.id
              : `booking_${Date.now()}`;
        trackPurchase({
          transaction_id: transactionId,
          value,
          currency,
          item_name: "Fun Dive Booking",
        });
        navigate("/booking-confirmed", { state: data.data });
      }

      if (data.type === "SIAM_BOOKING_STEP") {
        console.log("Booking step:", data.data);
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
            src={LEAD_FORM_URL}
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
