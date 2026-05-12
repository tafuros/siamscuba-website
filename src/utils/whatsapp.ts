import type { Lang, Offer } from "@/lib/landerCopy";
import { getStoredUtm } from "@/utils/utm";

export const WHATSAPP_NUMBER = "972528641581";

// Topics map to the [ref:CODE] tag appended to every prefilled WhatsApp
// message. n8n's Nemo bot reads the tag and routes to the matching S-node
// or AI bucket. See build-workflow.js in n8n-nemo for the classifier side.
export type WhatsAppTopic =
  | "general"
  | "dsd"
  | "owd"
  | "aow"
  | "rescue"
  | "dm"
  | "idc"
  | "fun-dive"
  | "refresher";

// Back-compat alias — callers passing the narrower Offer keep working.
export type WhatsAppOffer = Offer | "general";

const PREFILLED_MESSAGES: Record<WhatsAppTopic, Record<Lang, string>> = {
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
  aow: {
    en: "Hi Siam Scuba! I'd like to know more about the PADI Advanced Open Water course (10,000 THB).",
    es: "¡Hola Siam Scuba! Me gustaría saber más sobre el curso PADI Advanced Open Water (10,000 THB).",
    he: "היי סיאם סקובה! אני רוצה לקבל מידע על קורס PADI Advanced Open Water (10,000 THB).",
  },
  rescue: {
    en: "Hi Siam Scuba! I'm interested in the PADI Rescue Diver course (10,000 THB). What are the prerequisites?",
    es: "¡Hola Siam Scuba! Me interesa el curso PADI Rescue Diver (10,000 THB). ¿Cuáles son los requisitos?",
    he: "היי סיאם סקובה! אני מעוניין/ת בקורס PADI Rescue Diver (10,000 THB). מה תנאי הקבלה?",
  },
  dm: {
    en: "Hi Siam Scuba! I'd like to know more about the PADI Divemaster internship (38,500 THB).",
    es: "¡Hola Siam Scuba! Me gustaría saber más sobre el internado PADI Divemaster (38,500 THB).",
    he: "היי סיאם סקובה! אני רוצה לקבל מידע על תוכנית ה-PADI Divemaster (38,500 THB).",
  },
  idc: {
    en: "Hi Siam Scuba! I'm interested in the PADI Instructor Development Course (IDC).",
    es: "¡Hola Siam Scuba! Me interesa el PADI Instructor Development Course (IDC).",
    he: "היי סיאם סקובה! אני מעוניין/ת ב-PADI Instructor Development Course (IDC).",
  },
  "fun-dive": {
    en: "Hi Siam Scuba! I'd like to book a guided fun dive. What's available this week?",
    es: "¡Hola Siam Scuba! Quisiera reservar una inmersión guiada. ¿Qué tienen disponible esta semana?",
    he: "היי סיאם סקובה! אני רוצה להזמין צלילת בילוי מודרכת. מה פנוי השבוע?",
  },
  refresher: {
    en: "Hi Siam Scuba! I haven't dived in a while — I'd like info on a refresher (PADI ReActivate).",
    es: "¡Hola Siam Scuba! Hace tiempo que no buceo — quisiera información sobre un refresher (PADI ReActivate).",
    he: "היי סיאם סקובה! לא צללתי הרבה זמן — אשמח לקבל מידע על ריענון (PADI ReActivate).",
  },
};

// Maps URL pathname to the WhatsApp topic. Used by global WhatsApp buttons
// (Navbar, FloatingWhatsApp) to derive the right prefill + tag from the
// current page the visitor is on.
const PATH_TO_TOPIC: { test: RegExp; topic: WhatsAppTopic }[] = [
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?open-water(-course)?(\/|$)/i, topic: "owd" },
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?advanced-open-water(\/|$)/i, topic: "aow" },
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?rescue-diver(\/|$)/i, topic: "rescue" },
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?divemaster(\/|$)/i, topic: "dm" },
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?idc(\/|$)/i, topic: "idc" },
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?discover-scuba(-diving)?(\/|$)/i, topic: "dsd" },
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?scuba-review(\/|$)/i, topic: "refresher" },
  { test: /^\/(en\/|es\/|he\/)?fun-dives?(\/|$)/i, topic: "fun-dive" },
];

export function topicFromPath(pathname: string): WhatsAppTopic {
  for (const { test, topic } of PATH_TO_TOPIC) {
    if (test.test(pathname)) return topic;
  }
  return "general";
}

export interface WhatsAppLinkOpts {
  /** Explicit topic. Overrides pathname-derived topic. */
  topic?: WhatsAppTopic;
  /** Legacy alias for topic, kept for callers that pass Offer values. */
  offer?: WhatsAppTopic;
  /** Pathname to derive topic from (used by global buttons). */
  pathname?: string;
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
  const { topic, offer, pathname, lang = "en", appendUtm = true } = opts;
  const resolvedTopic: WhatsAppTopic =
    topic ?? offer ?? (pathname ? topicFromPath(pathname) : "general");
  let text = PREFILLED_MESSAGES[resolvedTopic][lang];
  if (appendUtm) {
    const utm = getStoredUtm();
    if (utm.source) {
      const tag = `${utm.source}/${utm.medium ?? "?"}${utm.campaign ? "/" + utm.campaign : ""}`;
      text += `\n\n— ${tag}`;
    }
  }
  // Page tag — read by n8n Nemo classifier. Keep on its own line at the end.
  text += `\n\n[ref:${resolvedTopic}]`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
