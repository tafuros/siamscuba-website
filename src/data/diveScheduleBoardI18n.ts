/**
 * Translations for the weekly dive board (2026-10-06, Ben: "switching the site
 * to Hebrew left the fun-dive block in English").
 *
 * diveScheduleBoard.ts stays the single English source of truth for every
 * FACT (times, prices, sites, min divers) and for the JSON-LD. This file only
 * swaps the WORDS, per language. Dive-site names are proper nouns and stay in
 * Latin script in every language, like on the dive-site pages.
 */
import type { Language } from "@/i18n/translations";
import { trips, type DayKey, type DiveLeg, type Trip, type TripId } from "./diveScheduleBoard";

type TripText = {
  name: string;
  tagline: string;
  level: string;
  meet?: string;
  boardMore?: string;
  footnote?: string;
  includes: string[];
  /** One free-text line per dive leg, same order as trip.divePlan. */
  legs?: (string | undefined)[];
};

type BoardUi = {
  title: string;
  hintMobile: string;
  hintDesktop: string;
  season: string;
  weather: string;
  today: string;
  dive: string;
  dives: string;
  meetLabel: string;
  backLabel: string;
  divesLabel: string;
  levelLabel: string;
  plan: string;
  included: string;
  perPerson: string;
  bookTrip: string;
  bookDay: (day: string, trip: string) => string;
  alsoEveryDay: string;
  diveN: (n: number) => string;
  refund: (min: number) => string;
  wreck: string;
  days: Record<DayKey, { label: string; short: string }>;
};

type NonEn = Exclude<Language, "en">;

const FUN_INCLUDES: Record<NonEn, string[]> = {
  he: [
    "2 צלילות מודרכות עם מדריך מקצועי",
    "ציוד צלילה מלא",
    "מיכל אוויר מלא (180-200 בר)",
    "אננס טרי על הסירה",
    "ביטוח צלילה",
    "אפשר להוסיף צילום",
  ],
  es: [
    "2 inmersiones guiadas con un instructor profesional",
    "Equipo de buceo completo",
    "Botella de aire llena (180-200 bar)",
    "Piña fresca en el barco",
    "Seguro de buceo",
    "Fotografía disponible como extra",
  ],
  fr: [
    "2 plongées guidées avec un instructeur professionnel",
    "Équipement de plongée complet",
    "Bloc d'air plein (180-200 bar)",
    "Ananas frais sur le bateau",
    "Assurance plongée",
    "Option photo disponible",
  ],
};

const TRIP_TEXT: Record<NonEn, Record<TripId, TripText>> = {
  he: {
    "morning-fun-dive": {
      name: "צלילת כיף {מודרכת} בוקר",
      tagline: "אחד הפינאקלים הגדולים עם אור ראשון, ואז אתר שני - חוזרים לפני הצהריים",
      level: "Open Water ומעלה - מומלץ Advanced לפינאקלים העמוקים",
      boardMore: "+ שונית או ספינה טבועה",
      footnote: "*יציאה לצ'ומפון מותנית ב-4 צוללים לפחות ותלויה במזג האוויר",
      includes: FUN_INCLUDES.he,
      legs: ["מה שתנאי הבוקר מעדיפים מבין השלושה", "נבחר ביום עצמו"],
    },
    "afternoon-fun-dive": {
      name: "צלילת כיף {מודרכת} צהריים",
      tagline: "שתי צלילות בשוניות סביב קוטאו - האתרים מתחלפים כל יום",
      level: "Open Water ומעלה",
      boardMore: "+ עוד שוניות סביב האי",
      includes: FUN_INCLUDES.he,
      legs: ["הסבב משתנה כל יום", "אתר שני, שנבחר לפי התנאים"],
    },
    "sail-rock-day-trip": {
      name: "יום בסייל רוק",
      tagline: "יום שלם על הסירה - שתי צלילות בסייל רוק ועוד שארק איילנד, ארוחות על הסירה",
      level: "Open Water ומעלה - מומלץ Advanced",
      includes: [
        "3 צלילות מודרכות",
        "ציוד צלילה מלא",
        "ארוחת בוקר על הסירה",
        "בופה תאילנדי לצהריים",
        "קפה, תה ועוגיות",
        "פירות טריים",
        "ביטוח צלילה",
      ],
    },
    "night-dive": {
      name: "צלילת לילה",
      tagline: "צלילה מודרכת אחת אחרי החשכה, כשהשונית מחליפה משמרת",
      level: "Open Water ומעלה",
      meet: "45 דקות לפני השקיעה",
      includes: ["צלילת לילה מודרכת עם מדריך מקצועי", "ציוד צלילה מלא", "פנס צלילה", "ביטוח צלילה"],
      legs: ["נבחר ביום עצמו"],
    },
    snorkeling: {
      name: "שנורקלינג",
      tagline: "מצטרפים לסירת הצלילה ורואים את השונית מפני המים",
      level: "לא צריך הסמכה",
      includes: ["ציוד שנורקלינג ומצוף", "שיט בסירה", "חטיפים ופירות טריים על הסירה"],
    },
  },
  es: {
    "morning-fun-dive": {
      name: "Fun Dive de mañana",
      tagline: "Uno de los grandes pináculos con la primera luz, luego un segundo sitio - de vuelta antes de comer",
      level: "Open Water o superior - Advanced recomendado para los pináculos profundos",
      boardMore: "+ un arrecife o pecio",
      footnote: "*Chumphon sale con un mínimo de 4 buceadores y según el tiempo",
      includes: FUN_INCLUDES.es,
      legs: ["el de los tres que mejor esté esa mañana", "elegido el mismo día"],
    },
    "afternoon-fun-dive": {
      name: "Fun Dive de tarde",
      tagline: "Dos inmersiones en los arrecifes de Koh Tao - los sitios cambian cada día",
      level: "Open Water o superior",
      boardMore: "+ más arrecifes de la isla",
      includes: FUN_INCLUDES.es,
      legs: ["la rotación cambia cada día", "un segundo sitio, según las condiciones"],
    },
    "sail-rock-day-trip": {
      name: "Día en Sail Rock",
      tagline: "Un día entero en el barco - dos inmersiones en Sail Rock y Shark Island, comidas a bordo",
      level: "Open Water o superior - Advanced recomendado",
      includes: [
        "3 inmersiones guiadas",
        "Equipo de buceo completo",
        "Desayuno en el barco",
        "Bufé tailandés al mediodía",
        "Café, té y galletas",
        "Fruta fresca",
        "Seguro de buceo",
      ],
    },
    "night-dive": {
      name: "Inmersión nocturna",
      tagline: "Una inmersión guiada de noche, cuando el arrecife cambia de turno",
      level: "Open Water o superior",
      meet: "45 minutos antes del atardecer",
      includes: [
        "1 inmersión nocturna guiada con un instructor profesional",
        "Equipo de buceo completo",
        "Linterna de buceo",
        "Seguro de buceo",
      ],
      legs: ["elegido el mismo día"],
    },
    snorkeling: {
      name: "Snorkel",
      tagline: "Súbete al barco de buceo y disfruta del arrecife desde la superficie",
      level: "No hace falta certificación",
      includes: ["Equipo de snorkel y flotador", "Paseo en barco", "Snacks y fruta fresca a bordo"],
    },
  },
  fr: {
    "morning-fun-dive": {
      name: "Fun Dive du matin",
      tagline: "Un des grands pinacles aux premières lueurs, puis un second site - retour avant le déjeuner",
      level: "Open Water et plus - Advanced conseillé pour les pinacles profonds",
      boardMore: "+ un récif ou une épave",
      footnote: "*Chumphon part avec 4 plongeurs minimum et selon la météo",
      includes: FUN_INCLUDES.fr,
      legs: ["celui des trois que les conditions du matin favorisent", "choisi le jour même"],
    },
    "afternoon-fun-dive": {
      name: "Fun Dive de l'après-midi",
      tagline: "Deux plongées sur les récifs autour de Koh Tao - les sites changent chaque jour",
      level: "Open Water et plus",
      boardMore: "+ d'autres récifs de l'île",
      includes: FUN_INCLUDES.fr,
      legs: ["la rotation change chaque jour", "un second site, choisi selon les conditions"],
    },
    "sail-rock-day-trip": {
      name: "Journée à Sail Rock",
      tagline: "Une journée entière sur le bateau - deux plongées à Sail Rock plus Shark Island, repas à bord",
      level: "Open Water et plus - Advanced conseillé",
      includes: [
        "3 plongées guidées",
        "Équipement de plongée complet",
        "Petit-déjeuner sur le bateau",
        "Buffet thaï le midi",
        "Café, thé et biscuits",
        "Fruits frais",
        "Assurance plongée",
      ],
    },
    "night-dive": {
      name: "Plongée de nuit",
      tagline: "Une plongée guidée à la nuit tombée, quand le récif change d'équipe",
      level: "Open Water et plus",
      meet: "45 minutes avant le coucher du soleil",
      includes: [
        "1 plongée de nuit guidée avec un instructeur professionnel",
        "Équipement de plongée complet",
        "Lampe de plongée",
        "Assurance plongée",
      ],
      legs: ["choisi le jour même"],
    },
    snorkeling: {
      name: "Snorkeling",
      tagline: "Montez sur le bateau de plongée et profitez du récif depuis la surface",
      level: "Aucune certification requise",
      includes: ["Équipement de snorkeling et bouée", "Sortie en bateau", "Snacks et fruits frais à bord"],
    },
  },
};

export const BOARD_UI: Record<Language, BoardUi> = {
  en: {
    title: "This week on the boat",
    hintMobile: "Pick a day, then tap a trip for times, sites, price and booking",
    hintDesktop: "Tap any trip for times, dive sites, what's included and the price",
    season: "The schedule runs year-round, weather permitting.",
    weather:
      "Dive sites shown are the usual plan for each day. Conditions on the morning can change them - the crew picks the best site on the day.",
    today: "Today",
    dive: "dive",
    dives: "dives",
    meetLabel: "Meet at the dive center",
    backLabel: "Back on the pier",
    divesLabel: "Dives",
    levelLabel: "Level",
    plan: "The plan",
    included: "What's included",
    perPerson: "/ person",
    bookTrip: "Book this trip",
    bookDay: (day, trip) => `Book ${day} · ${trip}`,
    alsoEveryDay: "Also every day",
    diveN: (n) => `Dive ${n}`,
    refund: (min) => `Sails with a minimum of ${min} divers. If the trip doesn't fill, you get a full refund.`,
    wreck: "wreck",
    days: {
      monday: { label: "Monday", short: "Mon" },
      tuesday: { label: "Tuesday", short: "Tue" },
      wednesday: { label: "Wednesday", short: "Wed" },
      thursday: { label: "Thursday", short: "Thu" },
      friday: { label: "Friday", short: "Fri" },
      saturday: { label: "Saturday", short: "Sat" },
      sunday: { label: "Sunday", short: "Sun" },
    },
  },
  he: {
    title: "השבוע על הסירה",
    hintMobile: "בחרו יום, ואז לחצו על יציאה לשעות, אתרים, מחיר והזמנה",
    hintDesktop: "לחצו על כל יציאה לשעות, אתרי צלילה, מה כלול והמחיר",
    season: "הלוח פועל כל השנה, בכפוף למזג האוויר.",
    weather: "האתרים המוצגים הם התוכנית הרגילה לכל יום. התנאים בבוקר יכולים לשנות אותם - הצוות בוחר את האתר הכי טוב ביום עצמו.",
    today: "היום",
    dive: "צלילה",
    dives: "צלילות",
    meetLabel: "מפגש במועדון",
    backLabel: "חזרה למזח",
    divesLabel: "צלילות",
    levelLabel: "רמה",
    plan: "התוכנית",
    included: "מה כלול",
    perPerson: "/ לאדם",
    bookTrip: "להזמנת היציאה",
    bookDay: (day, trip) => `הזמנה ל${day} · ${trip}`,
    alsoEveryDay: "וגם כל יום",
    diveN: (n) => `צלילה ${n}`,
    refund: (min) => `יוצאת עם ${min} צוללים לפחות. אם היציאה לא מתמלאת, מקבלים החזר מלא.`,
    wreck: "ספינה טבועה",
    days: {
      monday: { label: "יום שני", short: "ב'" },
      tuesday: { label: "יום שלישי", short: "ג'" },
      wednesday: { label: "יום רביעי", short: "ד'" },
      thursday: { label: "יום חמישי", short: "ה'" },
      friday: { label: "יום שישי", short: "ו'" },
      saturday: { label: "שבת", short: "ש'" },
      sunday: { label: "יום ראשון", short: "א'" },
    },
  },
  es: {
    title: "Esta semana en el barco",
    hintMobile: "Elige un día y toca una salida para ver horarios, sitios, precio y reserva",
    hintDesktop: "Toca cualquier salida para ver horarios, sitios de buceo, qué incluye y el precio",
    season: "El horario funciona todo el año, si el tiempo lo permite.",
    weather:
      "Los sitios que ves son el plan habitual de cada día. Las condiciones de la mañana pueden cambiarlos - la tripulación elige el mejor sitio el mismo día.",
    today: "Hoy",
    dive: "inmersión",
    dives: "inmersiones",
    meetLabel: "Encuentro en el centro",
    backLabel: "Vuelta al muelle",
    divesLabel: "Inmersiones",
    levelLabel: "Nivel",
    plan: "El plan",
    included: "Qué incluye",
    perPerson: "/ persona",
    bookTrip: "Reservar esta salida",
    bookDay: (day, trip) => `Reservar ${day} · ${trip}`,
    alsoEveryDay: "También cada día",
    diveN: (n) => `Inmersión ${n}`,
    refund: (min) => `Sale con un mínimo de ${min} buceadores. Si no se llena, te devolvemos todo.`,
    wreck: "pecio",
    days: {
      monday: { label: "Lunes", short: "Lun" },
      tuesday: { label: "Martes", short: "Mar" },
      wednesday: { label: "Miércoles", short: "Mié" },
      thursday: { label: "Jueves", short: "Jue" },
      friday: { label: "Viernes", short: "Vie" },
      saturday: { label: "Sábado", short: "Sáb" },
      sunday: { label: "Domingo", short: "Dom" },
    },
  },
  fr: {
    title: "Cette semaine sur le bateau",
    hintMobile: "Choisissez un jour, puis touchez une sortie pour les horaires, sites, prix et réservation",
    hintDesktop: "Touchez une sortie pour les horaires, les sites, ce qui est inclus et le prix",
    season: "Le planning tourne toute l'année, selon la météo.",
    weather:
      "Les sites affichés sont le plan habituel de chaque jour. Les conditions du matin peuvent les changer - l'équipage choisit le meilleur site le jour même.",
    today: "Aujourd'hui",
    dive: "plongée",
    dives: "plongées",
    meetLabel: "Rendez-vous au centre",
    backLabel: "Retour au ponton",
    divesLabel: "Plongées",
    levelLabel: "Niveau",
    plan: "Le programme",
    included: "Ce qui est inclus",
    perPerson: "/ personne",
    bookTrip: "Réserver cette sortie",
    bookDay: (day, trip) => `Réserver ${day} · ${trip}`,
    alsoEveryDay: "Aussi tous les jours",
    diveN: (n) => `Plongée ${n}`,
    refund: (min) => `Part avec ${min} plongeurs minimum. Si la sortie n'est pas complète, remboursement intégral.`,
    wreck: "épave",
    days: {
      monday: { label: "Lundi", short: "Lun" },
      tuesday: { label: "Mardi", short: "Mar" },
      wednesday: { label: "Mercredi", short: "Mer" },
      thursday: { label: "Jeudi", short: "Jeu" },
      friday: { label: "Vendredi", short: "Ven" },
      saturday: { label: "Samedi", short: "Sam" },
      sunday: { label: "Dimanche", short: "Dim" },
    },
  },
};

/**
 * A `{word}` inside a trip name renders as a small "(word)" - Israelis call fun
 * dives "מודרכות" (Ben 2026-10-06), so the Hebrew names carry it as a quiet
 * aside. plainTripName() gives the same text for plain-string contexts.
 */
export const plainTripName = (name: string) => name.replace(/\{([^}]+)\}/g, "($1)");

/** The trip with its words in `lang`; facts (times, prices, sites) untouched. */
export function localizeTrip(trip: Trip, lang: Language): Trip {
  if (lang === "en") return trip;
  const tx = TRIP_TEXT[lang][trip.id];
  const ui = BOARD_UI[lang];
  const leg = (l: DiveLeg, i: number): DiveLeg => ({
    ...l,
    label: ui.diveN(i + 1),
    freeText: l.freeText ? tx.legs?.[i] ?? l.freeText : undefined,
  });
  return {
    ...trip,
    name: tx.name,
    tagline: tx.tagline,
    level: tx.level,
    meet: tx.meet ?? trip.meet,
    boardMore: trip.boardMore ? tx.boardMore ?? trip.boardMore : undefined,
    footnote: trip.footnote ? tx.footnote ?? trip.footnote : undefined,
    includes: tx.includes,
    divePlan: trip.divePlan.map(leg),
  };
}

/** Every trip localized - handy for a component that renders them all. */
export function localizedTrips(lang: Language): Record<TripId, Trip> {
  return Object.fromEntries(
    (Object.keys(trips) as TripId[]).map((id) => [id, localizeTrip(trips[id], lang)]),
  ) as Record<TripId, Trip>;
}
