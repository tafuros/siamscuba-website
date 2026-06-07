import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import AmbientReviews from "@/components/AmbientReviews";

const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/U3JzU7fcJsdqVR768?g_st=ic";
const EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.!2d99.8228!3d10.0956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSiam+Scuba!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth";

const LocationSection = () => {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-background relative overflow-hidden isolate">
      <AmbientReviews startIndex={7} count={3} />
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-2">{t("loc_label")}</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">{t("loc_title")}</h2>
          <p className="text-muted-foreground mt-2">{t("loc_address")}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-border/50 shadow-lg">
            <iframe src={EMBED_URL} width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Siam Scuba Location - Sairee Beach, Koh Tao" />
          </div>
          <div className="text-center mt-6">
            <Button asChild className="rounded-full">
              <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                {t("loc_open_maps")}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LocationSection;
