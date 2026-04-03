import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import FunDiveBookingForm from "@/components/FunDiveBookingForm";

const SLOTS = [
  { type: "morning", label: "Morning", time: "6:20" },
  { type: "afternoon", label: "Afternoon", time: "11:00" },
  { type: "night", label: "Night", time: "17:30" },
] as const;

const FunDiveBookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const date = searchParams.get("date");
  const slotType = searchParams.get("slot");
  const slotInfo = SLOTS.find((s) => s.type === slotType);

  // If missing params, redirect to home fun-diving section
  if (!date || !slotInfo) {
    return (
      <div className="min-h-screen bg-ocean-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No dive slot selected.</p>
          <Link to="/#fun-diving" className="text-primary underline">
            ← Choose a slot from the calendar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-surface">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="container mx-auto px-4 py-6 max-w-lg"
      >
        <Link
          to="/#fun-diving"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to calendar
        </Link>

        <div className="bg-card rounded-xl border border-border/50 shadow-lg p-6">
          <FunDiveBookingForm
            date={date}
            slotLabel={slotInfo.label}
            slotTime={slotInfo.time}
            onSuccess={() => navigate("/")}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default FunDiveBookingPage;
