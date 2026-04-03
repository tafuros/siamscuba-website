import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FunDiveCalendar from "@/components/FunDiveCalendar";

const FunDiveBookingPage = () => {
  return (
    <div className="min-h-screen bg-ocean-surface">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="container mx-auto px-4 py-24 max-w-5xl"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Book Your Fun Dive
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Pick a date and time slot, then fill in your details.
        </p>

        <FunDiveCalendar />
      </motion.div>
    </div>
  );
};

export default FunDiveBookingPage;
