import { motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { trackWhatsAppClick } from "@/utils/tracking";
import { buildWhatsAppLink, normalizeLang } from "@/utils/whatsapp";

const FloatingWhatsApp = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => Math.sin(v * 0.01) * 8);
  const { language } = useLanguage();
  const location = useLocation();
  const whatsappHref = buildWhatsAppLink({
    lang: normalizeLang(language),
    pathname: location.pathname,
  });

  return (
    <motion.a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      style={{ y, backgroundColor: '#25D366' }}
      className="fixed right-4 bottom-4 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors hover:opacity-90"
      aria-label="Chat with us on WhatsApp"
      onClick={() => trackWhatsAppClick({ location: "floating", url: whatsappHref })}
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </motion.a>
  );
};

export default FloatingWhatsApp;
