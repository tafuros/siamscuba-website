import type { Lang, Offer } from "@/lib/landerCopy";
import { getStoredUtm } from "@/utils/utm";

export const WHATSAPP_NUMBER = "972528641581";

export type WhatsAppOffer = Offer | "general";

const PREFILLED_MESSAGES: Record<WhatsAppOffer, Record<Lang, string>> = {
  general: {
    en: "Hi Siam Scuba! I'd like to know more about diving in Koh Tao.",
    es: "¡Hola Siam Scuba! Me gustaría saber más sobre el buceo en Koh Tao.",
    he: "היי סיאם סקובה! אשמח לקבל מידע על צלילה בקוטאו.",
  },
  dsd: {
    en: "Hi Siam Scuba! I'm interested in Discover Scuba Diving (from 2,600 THB / 3,600 THB for 2 dives). Could you share availability?",
    es: "¡Hola Siam Scuba! Me interesa Discover Scuba Diving (desde 2,600 THB / 3,600 THB por 2 inmersiones). ¿Pueden compartir disponibilidad?",
    he: "היי סיאם סקובה! אני מעוניין/ת בחוויית Discover Scuba Diving (מ-2,600 THB / 3,600 THB ל-2 צלילות). תוכלו לשתף זמינות?",
  },
  owd: {
    en: "Hi Siam Scuba! I'd like to book the PADI Open Water course (11,000 THB). What dates are available?",
    es: "¡Hola Siam Scuba! Quisiera reservar el curso PADI Open Water (11,000 THB). ¿Qué fechas tienen disponibles?",
    he: "היי סיאם סקובה! אני רוצה להזמין קורס PADI Open Water (11,000 THB). אילו תאריכים פנויים?",
  },
  "fun-dive": {
    en: "Hi Siam Scuba! I'd like to book a guided fun dive. What's available this week?",
    es: "¡Hola Siam Scuba! Quisiera reservar una inmersión guiada. ¿Qué tienen disponible esta semana?",
    he: "היי סיאם סקובה! אני רוצה להזמין צלילת בילוי מודרכת. מה פנוי השבוע?",
  },
};

export interface WhatsAppLinkOpts {
  offer?: WhatsAppOffer;
  lang?: Lang;
  appendUtm?: boolean;
}

// Maps app-wide Language ("en" | "he" | "es" | "fr") down to lander Lang.
// French falls back to English; we don't have FR campaign assets.
export function normalizeLang(lang: string | undefined): Lang {
  if (lang === "es" || lang === "he") return lang;
  return "en";
}

export function buildWhatsAppLink(opts: WhatsAppLinkOpts = {}): string {
  const { offer = "general", lang = "en", appendUtm = true } = opts;
  let text = PREFILLED_MESSAGES[offer][lang];
  if (appendUtm) {
    const utm = getStoredUtm();
    if (utm.source) {
      const tag = `${utm.source}/${utm.medium ?? "?"}${utm.campaign ? "/" + utm.campaign : ""}`;
      text += `\n\n— ${tag}`;
    }
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
