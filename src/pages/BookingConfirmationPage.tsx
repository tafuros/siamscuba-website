import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const BookingConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "Diver";

  return (
    <div className="min-h-screen bg-ocean-deep flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6"
        >
          <CheckCircle2 className="h-20 w-20 text-accent mx-auto" strokeWidth={1.5} />
        </motion.div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
          Hey {name}, You're on the list!
        </h1>
        <p className="text-primary-foreground/70 text-lg mb-2">
          Thank you, SIAM SCUBA.
        </p>
        <p className="text-primary-foreground/50 text-sm mb-8">
          We'll contact you shortly to confirm your dive.
        </p>

        <Button asChild variant="outline" className="rounded-full border-accent/50 text-accent hover:bg-accent/10">
          <Link to="/">
            ← Back to home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default BookingConfirmationPage;
