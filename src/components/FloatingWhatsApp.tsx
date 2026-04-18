import { motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "@/utils/tracking";

const WHATSAPP_URL = "https://wa.me/972528641581";

const FloatingWhatsApp = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => Math.sin(v * 0.01) * 8);

  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{ y, backgroundColor: '#25D366' }}
      className="fixed right-4 bottom-4 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors hover:opacity-90"
      aria-label="Chat with us on WhatsApp"
      onClick={() => trackWhatsAppClick({ location: "floating", url: WHATSAPP_URL })}
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </motion.a>
  );
};

export default FloatingWhatsApp;
