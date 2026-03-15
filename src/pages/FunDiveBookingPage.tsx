import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const LEAD_FORM_URL = "https://dash.siamscuba.com/lead-form?ref=ben";

const FunDiveBookingPage = () => {
  return (
    <div className="min-h-screen bg-ocean-surface">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="container mx-auto px-4 py-6 max-w-5xl"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="w-full rounded-xl overflow-hidden border border-white/10 shadow-lg bg-background/30 backdrop-blur-sm"
        >
          <iframe
            src={LEAD_FORM_URL}
            title="Siam Scuba Booking Form"
            className="w-full border-0"
            style={{ height: "calc(100vh - 100px)", minHeight: "600px" }}
            allow="camera;microphone"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FunDiveBookingPage;
