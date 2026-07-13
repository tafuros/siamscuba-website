import type { Language } from "@/i18n/translations";

// All copy for the entry-gate flow, keyed by the site's four languages.
// The WELCOME headline is the brand line and is rendered language-neutral
// (English) before a language is chosen; everything from Q1 onward reads from
// here in the language the visitor picked.
//
// The gate is SCUBA-ONLY and intent-first (2026-07-13): language -> level ->
// location -> destination. The old location-first funnel (Koh Tao / Koh Phangan
// / Similan as Q1, with a freediving branch and two WhatsApp exits) scattered
// visitors instead of qualifying them; freediving is no longer sold.

/** What the visitor is here to do - the first real question. */
export type LevelKey = "beginner" | "funDives" | "training";
/** Where they want to do it - only asked when it actually changes the answer. */
export type LocationKey = "kohTao" | "kohPhangan" | "similan";

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
  /** Unobtrusive "skip the intro and go straight to the site" affordance. */
  skip: string;
  level: GateQuestion;
  location: GateQuestion;
}

export const WELCOME_HEADLINE = "Welcome to Siam Scuba Dive Center";
// Split into visual lines for the headline.
export const WELCOME_LINES = ["Welcome to", "Siam Scuba"];

export const gateContent: Record<Language, GateCopy> = {
  en: {
    tagline: "Your dive adventure starts here",
    chooseLanguage: "Choose your language",
    back: "Back",
    skip: "Skip",
    level: {
      title: "What's your diving level?",
      options: [
        {
          key: "beginner",
          label: "Complete beginner",
          sub: "I've never dived - I want to try it",
        },
        {
          key: "funDives",
          label: "I'm certified - fun dives",
          sub: "Just take me diving",
        },
        {
          key: "training",
          label: "I'm certified - keep training",
          sub: "Take me to the next level",
        },
      ],
    },
    location: {
      title: "Where do you want to dive?",
      options: [
        { key: "kohTao", label: "Koh Tao", sub: "Where it all begins" },
        { key: "kohPhangan", label: "Koh Phangan", sub: "Sail Rock & hidden reefs" },
        { key: "similan", label: "Similan & Phuket", sub: "Thailand's crown jewels" },
      ],
    },
  },
  he: {
    tagline: "הרפתקת הצלילה שלכם מתחילה כאן",
    chooseLanguage: "בחרו שפה",
    back: "חזרה",
    skip: "דלג",
    level: {
      title: "מה רמת ההכשרה שלכם?",
      options: [
        {
          key: "beginner",
          label: "מתחיל/ה לגמרי",
          sub: "לא צללתי מעולם - רוצה לגלות",
        },
        {
          key: "funDives",
          label: "יש לי רישיון - צלילות כיף",
          sub: "פשוט קחו אותי לצלול",
        },
        {
          key: "training",
          label: "יש לי רישיון - להמשיך הכשרה",
          sub: "קחו אותי לשלב הבא",
        },
      ],
    },
    location: {
      title: "איפה תרצו לצלול?",
      options: [
        { key: "kohTao", label: "קוֹ טאו", sub: "כאן הכל מתחיל" },
        { key: "kohPhangan", label: "קוֹ פנגן", sub: "Sail Rock ושוניות נסתרות" },
        { key: "similan", label: "סימילן ופוקט", sub: "פניני הכתר של תאילנד" },
      ],
    },
  },
  es: {
    tagline: "Tu aventura de buceo empieza aquí",
    chooseLanguage: "Elige tu idioma",
    back: "Atrás",
    skip: "Omitir",
    level: {
      title: "¿Cuál es tu nivel de buceo?",
      options: [
        {
          key: "beginner",
          label: "Principiante total",
          sub: "Nunca he buceado - quiero probarlo",
        },
        {
          key: "funDives",
          label: "Tengo licencia - buceo recreativo",
          sub: "Llévame a bucear",
        },
        {
          key: "training",
          label: "Tengo licencia - seguir formándome",
          sub: "Llévame al siguiente nivel",
        },
      ],
    },
    location: {
      title: "¿Dónde quieres bucear?",
      options: [
        { key: "kohTao", label: "Koh Tao", sub: "Donde todo empieza" },
        { key: "kohPhangan", label: "Koh Phangan", sub: "Sail Rock y arrecifes ocultos" },
        { key: "similan", label: "Similan y Phuket", sub: "Las joyas de Tailandia" },
      ],
    },
  },
  fr: {
    tagline: "Votre aventure sous-marine commence ici",
    chooseLanguage: "Choisissez votre langue",
    back: "Retour",
    skip: "Passer",
    level: {
      title: "Quel est votre niveau de plongée ?",
      options: [
        {
          key: "beginner",
          label: "Grand débutant",
          sub: "Je n'ai jamais plongé - je veux essayer",
        },
        {
          key: "funDives",
          label: "J'ai un brevet - plongées loisir",
          sub: "Emmenez-moi plonger",
        },
        {
          key: "training",
          label: "J'ai un brevet - continuer ma formation",
          sub: "Passez-moi au niveau suivant",
        },
      ],
    },
    location: {
      title: "Où voulez-vous plonger ?",
      options: [
        { key: "kohTao", label: "Koh Tao", sub: "Là où tout commence" },
        { key: "kohPhangan", label: "Koh Phangan", sub: "Sail Rock et récifs cachés" },
        { key: "similan", label: "Similan & Phuket", sub: "Les joyaux de la Thaïlande" },
      ],
    },
  },
};
