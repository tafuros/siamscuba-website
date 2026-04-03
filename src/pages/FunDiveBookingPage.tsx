import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const LEAD_FORM_URL = "https://dash.siamscuba.com/lead-form?ref=ben";

const FunDiveBookingPage = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-ocean-surface">
      <motion.div
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
          {/* Loading spinner */}
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
      </motion.div>
    </div>
  );
};

export default FunDiveBookingPage;
