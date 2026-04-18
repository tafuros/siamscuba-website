import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { trackPurchase } from "@/utils/tracking";

const BookingConfirmed = () => {
  useEffect(() => {
    trackPurchase({
      transaction_id: `booking_${Date.now()}`,
      item_name: "Fun Dive Booking",
    });
  }, []);
  const location = useLocation();
  const bookingData = location.state as Record<string, string> | null;

  return (
    <div className="min-h-screen bg-ocean-surface flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-card rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center border border-border/50"
      >
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your booking. We'll be in touch shortly with all the details.
        </p>

        {bookingData?.fullName && (
          <p className="text-sm text-muted-foreground mb-6">
            See you soon, <span className="font-semibold text-foreground">{bookingData.fullName}</span>!
          </p>
        )}

        <Button asChild className="w-full">
          <Link to="/">Back to Home</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default BookingConfirmed;
