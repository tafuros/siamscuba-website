import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import BookingLink from "@/components/BookingLink";

const BOOKING_PATH = "/fun-dive-booking";

const FloatingBookNow = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => Math.sin(v * 0.01) * 8);

  // Mobile-only conversion FAB. Pinned top-right (just below the navbar) so it
  // stays reachable without covering the course cards mid-screen.
  // One event, one dataLayer path (reference_gtag_shim_double_fire):
  // BookingLink fires book_now_click itself, like every other booking CTA.

  return (
    <motion.div
      style={{ y }}
      className="fixed right-4 top-24 z-40 md:hidden"
    >
      {/* No perpetual ping - a constantly pulsing ring competes with the content
          for attention. The solid FAB + ring is visible enough on its own. */}
      <BookingLink
        to={BOOKING_PATH}
        trackLocation="floating"
        aria-label="Book your dive now"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/30 transition-colors hover:bg-primary/90"
      >
        <CalendarPlus className="h-6 w-6" />
      </BookingLink>
    </motion.div>
  );
};

export default FloatingBookNow;
