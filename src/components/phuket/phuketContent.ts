import type { Language } from "@/i18n/translations";
import type { WhatsAppTopic } from "@/utils/whatsapp";

// "Diving from Phuket" - the day-dives split (Similan/Phuket branch -> day dives).
// Source: Ben's product sheets (Phuket day-trip operator we resell).
// Prices are THB per person. leadCourse = the DiveOS course tag posted with the
// lead (existing valid slugs, so no DiveOS deploy needed); waTopic = WhatsApp
// fallback prefill.

export interface PhuketProduct {
  id: string;
  leadCourse: string;
  waTopic: WhatsAppTopic;
  price: number; // THB per person
  recommended?: boolean;
}

export const PHUKET_PRODUCTS: PhuketProduct[] = [
  { id: "guided", leadCourse: "fun-dive", waTopic: "fun-dive", price: 4300, recommended: true },
  { id: "discover", leadCourse: "discover-scuba", waTopic: "dsd", price: 5700 },
  { id: "refresher", leadCourse: "fun-dive", waTopic: "refresher", price: 5700 },
  { id: "course", leadCourse: "open-water", waTopic: "owd", price: 15900 },
];

export interface PhuketProductText {
  name: string;
  who: string;
  meta: string;
  badge?: string;
  highlights: string[];
}

export interface PhuketCopy {
  hero: { kicker: string; title: string; subtitle: string; note: string; cta: string };
  products: {
    title: string;
    subtitle: string;
    perPerson: string;
    reserve: string;
    items: Record<string, PhuketProductText>;
  };
  included: { title: string; items: string[] };
  know: { title: string; items: string[] };
  booking: {
    title: string;
    subtitle: string;
    product: string;
    name: string;
    namePh: string;
    phone: string;
    phonePh: string;
    date: string;
    divers: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    whatsapp: string;
  };
  back: string;
}

export const phuketCopy: Record<Language, PhuketCopy> = {
  en: {
    hero: {
      kicker: "Siam Scuba · Phuket",
      title: "Diving from Phuket",
      subtitle: "Day trips on the Andaman coast - from your first breath underwater to guided dives for certified divers.",
      note: "Day diving from Phuket year-round - best visibility November to April.",
      cta: "See the day trips",
    },
    products: {
      title: "Pick your day",
      subtitle: "Four simple options - whether it's your first time or your hundredth dive.",
      perPerson: "per person",
      reserve: "Reserve this day",
      items: {
        guided: {
          name: "Guided Fun Dives",
          who: "Certified divers",
          meta: "1 day · 3 dives · 50-55 min each",
          badge: "Most popular",
          highlights: ["3 guided boat dives", "12L tank & weights", "Breakfast & lunch on board", "Round-trip hotel transfers"],
        },
        discover: {
          name: "Discover Scuba Diving",
          who: "No experience needed",
          meta: "1 day · 2 dives · to 9m",
          badge: "Try diving",
          highlights: ["2 intro dives up to 50 min", "Full equipment & coaching", "Buffet breakfast & lunch", "Round-trip hotel transfers"],
        },
        refresher: {
          name: "Refresher Day",
          who: "Rusty certified divers",
          meta: "1 day · 3 dives · skills refresh",
          badge: "Back in the water",
          highlights: ["Skills & theory refresh in-water", "3 guided dives", "12L tank & weights", "Breakfast & lunch on board"],
        },
        course: {
          name: "Open Water Course",
          who: "Get certified",
          meta: "3 days · 4 open-water dives · to 18m",
          badge: "Get your license",
          highlights: ["International Open Water certification", "4 open-water dives up to 50 min", "Learn with a dive computer", "Transfers & meals included"],
        },
      },
    },
    included: {
      title: "What's included",
      items: [
        "Round-trip hotel transfers (Kata, Karon, Rawai, Patong, Kamala, Chalong)",
        "Full dive equipment - regulator, BCD, fins, wetsuit, mask",
        "Breakfast & lunch on board",
        "Snacks, fruit & soft drinks",
      ],
    },
    know: {
      title: "Good to know",
      items: [
        "Pickup 07:00-08:00; return afternoon/evening depending on the dive sites",
        "Transfers from other areas available for a small surcharge",
        "Optional extras: dive computer, dive insurance, photo package",
        "Book now, pay later - reserve with no upfront payment",
      ],
    },
    booking: {
      title: "Reserve your place",
      subtitle: "Tell us which day and we'll lock it in on WhatsApp - no payment now.",
      product: "Day trip",
      name: "Name",
      namePh: "Your name",
      phone: "WhatsApp number",
      phonePh: "+66 ...",
      date: "Preferred date",
      divers: "People",
      submit: "Reserve my spot",
      sending: "Sending...",
      success: "Got it! 🐠 The team will message you on WhatsApp shortly.",
      error: "Couldn't send that - please reach us on WhatsApp instead.",
      whatsapp: "Chat on WhatsApp",
    },
    back: "Back to Siam Scuba",
  },
  he: {
    hero: {
      kicker: "Siam Scuba · פוקט",
      title: "צלילות מפוקט",
      subtitle: "טיולי יום בחוף האנדמן - מהנשימה הראשונה מתחת למים ועד צלילות מודרכות למוסמכים.",
      note: "צלילות יום מפוקט כל השנה - הניראות הטובה ביותר בין נובמבר לאפריל.",
      cta: "לכל טיולי היום",
    },
    products: {
      title: "בחרו את היום שלכם",
      subtitle: "ארבע אפשרויות פשוטות - בין אם זו הפעם הראשונה או הצלילה המאה.",
      perPerson: "לאדם",
      reserve: "שריון היום",
      items: {
        guided: {
          name: "צלילות מודרכות למוסמכים",
          who: "צוללים מוסמכים",
          meta: "יום אחד · 3 צלילות · 50-55 דק' כל אחת",
          badge: "הכי פופולרי",
          highlights: ["3 צלילות סירה מודרכות", "מיכל 12 ליטר ומשקולות", "ארוחת בוקר וצהריים על הסירה", "הסעות הלוך-חזור מהמלון"],
        },
        discover: {
          name: "צלילות היכרות",
          who: "לא נדרש ניסיון",
          meta: "יום אחד · 2 צלילות · עד 9 מ'",
          badge: "לנסות לצלול",
          highlights: ["2 צלילות היכרות עד 50 דק'", "ציוד מלא וליווי צמוד", "בופה בוקר וצהריים", "הסעות הלוך-חזור מהמלון"],
        },
        refresher: {
          name: "צלילות ריענון משולבות",
          who: "צוללים מוסמכים שלא צללו מזמן",
          meta: "יום אחד · 3 צלילות · ריענון מיומנויות",
          badge: "חזרה למים",
          highlights: ["ריענון מיומנויות ותיאוריה במים", "3 צלילות מודרכות", "מיכל 12 ליטר ומשקולות", "ארוחת בוקר וצהריים על הסירה"],
        },
        course: {
          name: "קורס Open Water (כוכב ראשון)",
          who: "להוציא רישיון",
          meta: "3 ימים · 4 צלילות · עד 18 מ'",
          badge: "להוציא רישיון",
          highlights: ["תעודת Open Water בינלאומית", "4 צלילות מים פתוחים עד 50 דק'", "לימוד עם מחשב צלילה", "הסעות וארוחות כלולות"],
        },
      },
    },
    included: {
      title: "מה כלול",
      items: [
        "הסעות הלוך-חזור מהמלון (Kata, Karon, Rawai, Patong, Kamala, Chalong)",
        "ציוד צלילה מלא - מערכת נשימה, מאזן, סנפירים, חליפה, מסכה",
        "ארוחת בוקר וצהריים על הסירה",
        "נישנושים, פירות ושתייה קלה",
      ],
    },
    know: {
      title: "כדאי לדעת",
      items: [
        "איסוף 07:00-08:00; חזרה אחר הצהריים/ערב לפי אתרי הצלילה",
        "הסעות מאזורים אחרים בתוספת תשלום קטנה",
        "תוספות אופציונליות: מחשב צלילה, ביטוח צלילה, חבילת תמונות",
        "הזמינו עכשיו, שלמו אחר כך - שריון ללא תשלום מראש",
      ],
    },
    booking: {
      title: "שריינו את מקומכם",
      subtitle: "ספרו לנו איזה יום ונסגור לכם בוואטסאפ - בלי תשלום עכשיו.",
      product: "טיול יום",
      name: "שם",
      namePh: "השם שלכם",
      phone: "מספר וואטסאפ",
      phonePh: "+66 ...",
      date: "תאריך מועדף",
      divers: "אנשים",
      submit: "שריון מקום",
      sending: "שולח...",
      success: "קיבלנו! 🐠 הצוות יחזור אליכם בוואטסאפ בקרוב.",
      error: "לא הצלחנו לשלוח - דברו איתנו בוואטסאפ במקום.",
      whatsapp: "שיחה בוואטסאפ",
    },
    back: "חזרה ל-Siam Scuba",
  },
  es: {
    hero: {
      kicker: "Siam Scuba · Phuket",
      title: "Buceo desde Phuket",
      subtitle: "Salidas de día en la costa del Andamán - desde tu primera respiración bajo el agua hasta inmersiones guiadas para buceadores certificados.",
      note: "Buceo de día desde Phuket todo el año - mejor visibilidad de noviembre a abril.",
      cta: "Ver las salidas",
    },
    products: {
      title: "Elige tu día",
      subtitle: "Cuatro opciones sencillas - sea tu primera vez o tu inmersión número cien.",
      perPerson: "por persona",
      reserve: "Reservar este día",
      items: {
        guided: {
          name: "Inmersiones guiadas",
          who: "Buceadores certificados",
          meta: "1 día · 3 inmersiones · 50-55 min cada una",
          badge: "El más popular",
          highlights: ["3 inmersiones guiadas desde barco", "Botella de 12L y plomos", "Desayuno y almuerzo a bordo", "Traslados de ida y vuelta"],
        },
        discover: {
          name: "Discover Scuba Diving",
          who: "Sin experiencia",
          meta: "1 día · 2 inmersiones · hasta 9m",
          badge: "Prueba el buceo",
          highlights: ["2 inmersiones de iniciación hasta 50 min", "Equipo completo y acompañamiento", "Desayuno y almuerzo buffet", "Traslados de ida y vuelta"],
        },
        refresher: {
          name: "Día de repaso",
          who: "Certificados sin práctica reciente",
          meta: "1 día · 3 inmersiones · repaso de skills",
          badge: "De vuelta al agua",
          highlights: ["Repaso de skills y teoría en el agua", "3 inmersiones guiadas", "Botella de 12L y plomos", "Desayuno y almuerzo a bordo"],
        },
        course: {
          name: "Curso Open Water",
          who: "Sácate el título",
          meta: "3 días · 4 inmersiones · hasta 18m",
          badge: "Sácate la licencia",
          highlights: ["Certificación Open Water internacional", "4 inmersiones en mar abierto hasta 50 min", "Aprende con ordenador de buceo", "Traslados y comidas incluidos"],
        },
      },
    },
    included: {
      title: "Qué incluye",
      items: [
        "Traslados de ida y vuelta (Kata, Karon, Rawai, Patong, Kamala, Chalong)",
        "Equipo de buceo completo - regulador, jacket, aletas, traje, máscara",
        "Desayuno y almuerzo a bordo",
        "Snacks, fruta y refrescos",
      ],
    },
    know: {
      title: "Bueno saber",
      items: [
        "Recogida 07:00-08:00; regreso por la tarde/noche según los puntos de buceo",
        "Traslados desde otras zonas con un pequeño suplemento",
        "Extras opcionales: ordenador de buceo, seguro, paquete de fotos",
        "Reserva ahora, paga después - sin pago inicial",
      ],
    },
    booking: {
      title: "Reserva tu plaza",
      subtitle: "Dinos qué día y te lo aseguramos por WhatsApp - sin pago ahora.",
      product: "Salida",
      name: "Nombre",
      namePh: "Tu nombre",
      phone: "Número de WhatsApp",
      phonePh: "+66 ...",
      date: "Fecha preferida",
      divers: "Personas",
      submit: "Reservar mi plaza",
      sending: "Enviando...",
      success: "¡Recibido! 🐠 El equipo te escribirá por WhatsApp en breve.",
      error: "No pudimos enviarlo - escríbenos por WhatsApp.",
      whatsapp: "Chatear por WhatsApp",
    },
    back: "Volver a Siam Scuba",
  },
  fr: {
    hero: {
      kicker: "Siam Scuba · Phuket",
      title: "Plonger depuis Phuket",
      subtitle: "Sorties à la journée sur la côte de l'Andaman - de votre première respiration sous l'eau aux plongées guidées pour brevetés.",
      note: "Plongée à la journée depuis Phuket toute l'année - meilleure visibilité de novembre à avril.",
      cta: "Voir les sorties",
    },
    products: {
      title: "Choisissez votre journée",
      subtitle: "Quatre options simples - que ce soit votre première fois ou votre centième plongée.",
      perPerson: "par personne",
      reserve: "Réserver cette journée",
      items: {
        guided: {
          name: "Plongées guidées",
          who: "Plongeurs brevetés",
          meta: "1 jour · 3 plongées · 50-55 min chacune",
          badge: "Le plus populaire",
          highlights: ["3 plongées guidées depuis le bateau", "Bloc 12L et plombs", "Petit-déjeuner et déjeuner à bord", "Transferts aller-retour"],
        },
        discover: {
          name: "Baptême de plongée",
          who: "Aucune expérience requise",
          meta: "1 jour · 2 plongées · jusqu'à 9m",
          badge: "Essayer la plongée",
          highlights: ["2 plongées d'initiation jusqu'à 50 min", "Équipement complet et encadrement", "Petit-déjeuner et déjeuner buffet", "Transferts aller-retour"],
        },
        refresher: {
          name: "Journée remise à niveau",
          who: "Brevetés peu pratiquants",
          meta: "1 jour · 3 plongées · remise à niveau",
          badge: "De retour à l'eau",
          highlights: ["Remise à niveau compétences et théorie", "3 plongées guidées", "Bloc 12L et plombs", "Petit-déjeuner et déjeuner à bord"],
        },
        course: {
          name: "Cours Open Water",
          who: "Obtenez votre brevet",
          meta: "3 jours · 4 plongées · jusqu'à 18m",
          badge: "Obtenez votre brevet",
          highlights: ["Certification Open Water internationale", "4 plongées en milieu naturel jusqu'à 50 min", "Apprentissage avec ordinateur de plongée", "Transferts et repas inclus"],
        },
      },
    },
    included: {
      title: "Ce qui est inclus",
      items: [
        "Transferts aller-retour (Kata, Karon, Rawai, Patong, Kamala, Chalong)",
        "Équipement complet - détendeur, gilet, palmes, combinaison, masque",
        "Petit-déjeuner et déjeuner à bord",
        "Snacks, fruits et boissons",
      ],
    },
    know: {
      title: "Bon à savoir",
      items: [
        "Prise en charge 07:00-08:00 ; retour l'après-midi/le soir selon les sites",
        "Transferts depuis d'autres zones moyennant un petit supplément",
        "Options : ordinateur de plongée, assurance, pack photos",
        "Réservez maintenant, payez plus tard - sans acompte",
      ],
    },
    booking: {
      title: "Réservez votre place",
      subtitle: "Dites-nous quelle journée et nous la bloquons sur WhatsApp - sans paiement maintenant.",
      product: "Sortie",
      name: "Nom",
      namePh: "Votre nom",
      phone: "Numéro WhatsApp",
      phonePh: "+66 ...",
      date: "Date souhaitée",
      divers: "Personnes",
      submit: "Réserver ma place",
      sending: "Envoi...",
      success: "Bien reçu ! 🐠 L'équipe vous écrira sur WhatsApp sous peu.",
      error: "Échec de l'envoi - contactez-nous sur WhatsApp.",
      whatsapp: "Discuter sur WhatsApp",
    },
    back: "Retour à Siam Scuba",
  },
};
