import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const BookingCTA = () => {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-ocean-deep relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-ocean-light/10 blur-3xl" />

      <div className="container mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground">{t("cta_title")}</h2>
          <p className="mt-4 text-primary-foreground/70 text-lg">{t("cta_subtitle")}</p>
          <Button asChild size="lg" className="mt-8 rounded-full px-10 text-base bg-accent/80 backdrop-blur-md hover:bg-accent/95 text-accent-foreground border border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.35)] gap-2">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              {t("cta_button")}
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingCTA;
