import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { Link } from "react-router-dom";

const BOOKING_PATH = "/fun-dive-booking";

const FloatingBookNow = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => Math.sin(v * 0.01) * 8);

  // Mobile-only conversion FAB. Stack order from bottom: WhatsApp -> Instagram -> Book Now.
  const handleClick = () => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "book_now_click", {
        event_category: "engagement",
        event_label: "floating",
      });
    }
  };

  return (
    <motion.div
      style={{ y }}
      className="fixed right-4 bottom-36 z-40 md:hidden"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-primary/40 animate-ping"
      />
      <Link
        to={BOOKING_PATH}
        onClick={handleClick}
        aria-label="Book your dive now"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/30 transition-colors hover:bg-primary/90"
      >
        <CalendarPlus className="h-6 w-6" />
      </Link>
    </motion.div>
  );
};

export default FloatingBookNow;
