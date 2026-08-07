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
//
// 2026-08-07: a fourth option (conservation / PADI AWARE) joined Q1. It is an
// INTEREST, not a certification level, so the question was reworded from
// "What's your diving level?" to "What brings you to our ocean?" in all four
// languages - otherwise the conservation card does not answer the question it
// sits under. The `level` field name and the gate_level analytics param are
// unchanged, so historical GA4 data still lines up.

/** What the visitor is here to do - the first real question. */
export type LevelKey = "beginner" | "funDives" | "training" | "conservation";
/** Where they want to do it - only asked when it actually changes the answer. */
export type LocationKey = "kohTao" | "kohPhangan" | "similan";

export interface GateOption {
  key: string;
  label: string;
  sub: string;
  /**
   * Tiny caps pill above the label, naming the product family the card belongs
   * to (PADI AWARE, PADI COURSES, DAY TRIPS...). It should add information, not
   * repeat the label underneath it. Colour follows the card's tone.
   */
  eyebrow?: string;
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
      title: "What brings you to our ocean?",
      options: [
        {
          key: "beginner",
          label: "Complete beginner",
          sub: "I've never dived - I want to try it",
          eyebrow: "TRY DIVING",
        },
        {
          key: "funDives",
          label: "I'm certified - fun dives",
          sub: "Just take me diving",
          eyebrow: "DAY TRIPS",
        },
        {
          key: "training",
          label: "I'm certified - keep training",
          sub: "Take me to the next level",
          eyebrow: "PADI COURSES",
        },
        {
          key: "conservation",
          label: "Protect what you love",
          sub: "Conservation diving & PADI AWARE",
          eyebrow: "PADI AWARE",
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
      title: "מה מביא אתכם לאוקיינוס שלנו?",
      options: [
        {
          key: "beginner",
          label: "מתחיל/ה לגמרי",
          sub: "לא צללתי מעולם - רוצה לגלות",
          eyebrow: "צלילת ניסיון",
        },
        {
          key: "funDives",
          label: "יש לי רישיון - צלילות כיף",
          sub: "פשוט קחו אותי לצלול",
          eyebrow: "יציאות יומיות",
        },
        {
          key: "training",
          label: "יש לי רישיון - להמשיך הכשרה",
          sub: "קחו אותי לשלב הבא",
          eyebrow: "קורסי PADI",
        },
        {
          key: "conservation",
          label: "לשמור על מה שאוהבים",
          sub: "צלילות שימור ו-PADI AWARE",
          eyebrow: "PADI AWARE",
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
      title: "¿Qué te trae a nuestro océano?",
      options: [
        {
          key: "beginner",
          label: "Principiante total",
          sub: "Nunca he buceado - quiero probarlo",
          eyebrow: "BAUTISMO",
        },
        {
          key: "funDives",
          label: "Tengo licencia - buceo recreativo",
          sub: "Llévame a bucear",
          eyebrow: "SALIDAS DIARIAS",
        },
        {
          key: "training",
          label: "Tengo licencia - seguir formándome",
          sub: "Llévame al siguiente nivel",
          eyebrow: "CURSOS PADI",
        },
        {
          key: "conservation",
          label: "Protege lo que amas",
          sub: "Buceo de conservación y PADI AWARE",
          eyebrow: "PADI AWARE",
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
      title: "Qu'est-ce qui vous amène dans notre océan ?",
      options: [
        {
          key: "beginner",
          label: "Grand débutant",
          sub: "Je n'ai jamais plongé - je veux essayer",
          eyebrow: "BAPTÊME",
        },
        {
          key: "funDives",
          label: "J'ai un brevet - plongées loisir",
          sub: "Emmenez-moi plonger",
          eyebrow: "SORTIES DU JOUR",
        },
        {
          key: "training",
          label: "J'ai un brevet - continuer ma formation",
          sub: "Passez-moi au niveau suivant",
          eyebrow: "COURS PADI",
        },
        {
          key: "conservation",
          label: "Protéger ce que vous aimez",
          sub: "Plongée de conservation et PADI AWARE",
          eyebrow: "PADI AWARE",
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
