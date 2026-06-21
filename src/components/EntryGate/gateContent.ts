import type { Language } from "@/i18n/translations";

// All copy for the entry-gate flow, keyed by the site's four languages.
// The WELCOME headline is the brand line and is rendered language-neutral
// (English) before a language is chosen; everything from Q1 onward reads from
// here in the language the visitor picked.

export type WhereKey = "kohTao" | "kohPhangan" | "similan";

export interface GateOption {
  key: string;
  label: string;
  sub: string;
}

export interface GateQuestion {
  title: string;
  options: GateOption[];
}

export interface GateCopy {
  /** Small line under the welcome headline (shown pre-language-pick in EN). */
  tagline: string;
  /** Tiny neutral prompt above the flag row. */
  chooseLanguage: string;
  back: string;
  where: GateQuestion;
  kohTao: GateQuestion;
  kohPhangan: GateQuestion;
  similan: GateQuestion;
}

export const WELCOME_HEADLINE = "Welcome to Siam Scuba Dive Center";

export const gateContent: Record<Language, GateCopy> = {
  en: {
    tagline: "Your dive adventure starts here",
    chooseLanguage: "Choose your language",
    back: "Back",
    where: {
      title: "Where do you want to dive?",
      options: [
        { key: "kohTao", label: "Koh Tao", sub: "Where it all begins" },
        { key: "kohPhangan", label: "Koh Phangan", sub: "Sail Rock & hidden reefs" },
        { key: "similan", label: "Similan & Phuket", sub: "Thailand's crown jewels" },
      ],
    },
    kohTao: {
      title: "Freediving or scuba diving?",
      options: [
        { key: "freediving", label: "Freediving", sub: "One breath, deep blue" },
        { key: "scuba", label: "Scuba diving", sub: "Tanks, reefs & courses" },
      ],
    },
    kohPhangan: {
      title: "Are you certified, or just starting out?",
      options: [
        { key: "licensed", label: "I'm certified", sub: "Take me to the dive sites" },
        { key: "beginner", label: "I'm a beginner", sub: "Start my diving journey" },
      ],
    },
    similan: {
      title: "Liveaboard safari or day trips?",
      options: [
        { key: "safari", label: "Liveaboard safari", sub: "Multi-day, full immersion" },
        { key: "dayDives", label: "Day trips", sub: "Out and back in a day" },
      ],
    },
  },
  he: {
    tagline: "הרפתקת הצלילה שלכם מתחילה כאן",
    chooseLanguage: "בחרו שפה",
    back: "חזרה",
    where: {
      title: "איפה תרצו לצלול?",
      options: [
        { key: "kohTao", label: "קוֹ טאו", sub: "כאן הכל מתחיל" },
        { key: "kohPhangan", label: "קוֹ פנגן", sub: "Sail Rock ושוניות נסתרות" },
        { key: "similan", label: "סימילן ופוקט", sub: "פניני הכתר של תאילנד" },
      ],
    },
    kohTao: {
      title: "צלילה חופשית או צלילת מיכלים?",
      options: [
        { key: "freediving", label: "צלילה חופשית", sub: "נשימה אחת, כחול עמוק" },
        { key: "scuba", label: "צלילת מיכלים", sub: "מיכלים, שוניות וקורסים" },
      ],
    },
    kohPhangan: {
      title: "יש לכם רישיון, או שאתם רק מתחילים?",
      options: [
        { key: "licensed", label: "יש לי רישיון", sub: "קחו אותי לאתרי הצלילה" },
        { key: "beginner", label: "אני מתחיל/ה", sub: "להתחיל את מסע הצלילה" },
      ],
    },
    similan: {
      title: "safari liveaboard או צלילות יומיות?",
      options: [
        { key: "safari", label: "safari liveaboard", sub: "כמה ימים, חוויה מלאה" },
        { key: "dayDives", label: "צלילות יומיות", sub: "יוצאים וחוזרים באותו יום" },
      ],
    },
  },
  es: {
    tagline: "Tu aventura de buceo empieza aquí",
    chooseLanguage: "Elige tu idioma",
    back: "Atrás",
    where: {
      title: "¿Dónde quieres bucear?",
      options: [
        { key: "kohTao", label: "Koh Tao", sub: "Donde todo empieza" },
        { key: "kohPhangan", label: "Koh Phangan", sub: "Sail Rock y arrecifes ocultos" },
        { key: "similan", label: "Similan y Phuket", sub: "Las joyas de Tailandia" },
      ],
    },
    kohTao: {
      title: "¿Apnea o buceo con botella?",
      options: [
        { key: "freediving", label: "Apnea", sub: "Una respiración, azul profundo" },
        { key: "scuba", label: "Buceo con botella", sub: "Botellas, arrecifes y cursos" },
      ],
    },
    kohPhangan: {
      title: "¿Tienes licencia o empiezas ahora?",
      options: [
        { key: "licensed", label: "Tengo licencia", sub: "Llévame a los puntos de buceo" },
        { key: "beginner", label: "Soy principiante", sub: "Empezar mi aventura" },
      ],
    },
    similan: {
      title: "¿Safari liveaboard o salidas de día?",
      options: [
        { key: "safari", label: "Safari liveaboard", sub: "Varios días, inmersión total" },
        { key: "dayDives", label: "Salidas de día", sub: "Ida y vuelta en el día" },
      ],
    },
  },
  fr: {
    tagline: "Votre aventure sous-marine commence ici",
    chooseLanguage: "Choisissez votre langue",
    back: "Retour",
    where: {
      title: "Où voulez-vous plonger ?",
      options: [
        { key: "kohTao", label: "Koh Tao", sub: "Là où tout commence" },
        { key: "kohPhangan", label: "Koh Phangan", sub: "Sail Rock et récifs cachés" },
        { key: "similan", label: "Similan & Phuket", sub: "Les joyaux de la Thaïlande" },
      ],
    },
    kohTao: {
      title: "Apnée ou plongée bouteille ?",
      options: [
        { key: "freediving", label: "Apnée", sub: "Une respiration, le grand bleu" },
        { key: "scuba", label: "Plongée bouteille", sub: "Bouteilles, récifs et cours" },
      ],
    },
    kohPhangan: {
      title: "Avez-vous un brevet, ou débutez-vous ?",
      options: [
        { key: "licensed", label: "J'ai un brevet", sub: "Emmenez-moi sur les sites" },
        { key: "beginner", label: "Je débute", sub: "Commencer mon aventure" },
      ],
    },
    similan: {
      title: "Safari liveaboard ou sorties à la journée ?",
      options: [
        { key: "safari", label: "Safari liveaboard", sub: "Plusieurs jours, immersion totale" },
        { key: "dayDives", label: "Sorties à la journée", sub: "Aller-retour dans la journée" },
      ],
    },
  },
};
