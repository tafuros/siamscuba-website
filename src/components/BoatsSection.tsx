import { motion } from "framer-motion";
import { Anchor, Shield, Users, Droplets, Coffee, Ship, LifeBuoy, Wind, DoorOpen, Package } from "lucide-react";
import boatImg from "@/assets/siam-boat.png";
import { useLanguage } from "@/i18n/LanguageContext";

const BoatsSection = () => {
  const { t } = useLanguage();

  const facilities = [
    { icon: Users, label: t("boat_capacity") },
    { icon: Droplets, label: t("boat_shower") },
    { icon: Coffee, label: t("boat_coffee") },
    { icon: DoorOpen, label: t("boat_exits") },
    { icon: LifeBuoy, label: t("boat_jackets") },
    { icon: Wind, label: t("boat_compressor") },
    { icon: Ship, label: t("boat_decks") },
    { icon: Package, label: t("boat_storage") },
  ];

  return (
    <section id="boats" className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-2">{t("boats_label")}</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">{t("boats_title")}</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{t("boats_subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden shadow-xl">
            <img src={boatImg} alt="Siam Scuba dive boat at Koh Tao" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">{t("boats_built")}</h3>
            <p className="text-muted-foreground mb-8">{t("boats_desc")}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {facilities.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BoatsSection;
