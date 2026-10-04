// Fun Dives lander copy - dedicated module for the redesigned /fun-dives
// campaign page (dark-premium design line). Kept separate from landerCopy.ts
// because this lander supports FRENCH in addition to en/es/he, and extending
// the shared Lang union would force FR copy onto every other offer.
//
// Strings are inlined (not in src/i18n/translations.ts) because campaign
// landers must render the AD's language regardless of any returning-visitor
// preference stored in localStorage.

import type { DiveLineIconName } from "@/components/icons/DiveLineIcons";

export type FunLang = "en" | "es" | "he" | "fr";

export interface FunFact {
  k: string;
  v: string;
  sub: string;
}

export interface FunSiteCard {
  /** Absolute /public path. */
  image: string;
  name: string;
  blurb: string;
  tag?: string;
  /**
   * DiveOS product the card books (wizard ?product=). Clarity 2026-10-02: the
   * site cards were the most-tapped thing on the lander and did nothing.
   */
  product: "FD" | "SAILROCK";
}

export interface FunWhyCard {
  icon: DiveLineIconName;
  title: string;
  body: string;
}

export interface FunFaqItem {
  q: string;
  a: string;
  /** Optional follow-up link rendered after the answer. */
  link?: { label: string; href: string };
}

export interface FunDiveCopy {
  seoTitle: string;
  seoDescription: string;
  badge: string;
  /** Two-line hero H1; h1b renders in the light-blue accent. */
  h1a: string;
  h1b: string;
  sub: string;
  priceNum: string;
  priceLine1: string;
  priceLine2: string;
  ctaBook: string;
  ctaWa: string;
  trustTaReviews: string;
  trustDivers: string;
  trustBoats: string;
  facts: FunFact[];
  sitesHeadline: string;
  sitesSub: string;
  sites: FunSiteCard[];
  sitesNote: string;
  whyHeadline: string;
  whySub: string;
  why: FunWhyCard[];
  reviewQuote: string;
  reviewSrc: string;
  faqHeadline: string;
  faq: FunFaqItem[];
  closingA: string;
  closingB: string;
  closingSub: string;
  stickyPriceLabel: string;
  stickyCta: string;
  waMessage: string;
}

const SITE_IMAGES = {
  chumphon: "/dive-sites/chumphon-pinnacle.webp",
  sailRock: "/dive-sites/sail-rock.webp",
  twins: "/dive-sites/twins.webp",
  whaleShark: "/blog/whale-shark-koh-tao.webp",
} as const;

const EN: FunDiveCopy = {
  seoTitle: "Fun Dives in Koh Tao - from 2,000 THB | Siam Scuba",
  seoDescription:
    "Certified divers - book guided fun dives in Koh Tao. Two dives 2,000 THB all-in, full-day Sail Rock 4,000 THB. Small groups, two custom boats.",
  badge: "For certified divers · PADI 5★ center",
  h1a: "Fun dives in Koh Tao,",
  h1b: "done properly.",
  sub: "2 guided boat dives at the Gulf's best sites - Chumphon Pinnacle, Sail Rock, Shark Island. Gear, guide and insurance included. Just show up with your card.",
  priceNum: "฿2,000",
  priceLine1: "2 dives · half-day",
  priceLine2: "everything included",
  ctaBook: "Book your dive day",
  ctaWa: "or ask us anything on WhatsApp",
  trustTaReviews: "796 TripAdvisor reviews",
  trustDivers: "Max 6 divers per guide",
  trustBoats: "2 own boats - no crowds",
  facts: [
    { k: "Price", v: "฿2,000", sub: "2 dives, all-in" },
    { k: "Departures", v: "AM / PM", sub: "daily, you pick" },
    { k: "Included", v: "Gear + guide", sub: "+ insurance + fruit" },
    { k: "Sail Rock", v: "฿4,000", sub: "full-day + meals" },
  ],
  sitesHeadline: "Where you'll dive",
  sitesSub: "We rotate sites daily by conditions - these are the regulars.",
  sites: [
    {
      image: SITE_IMAGES.chumphon,
      product: "FD",
      name: "Chumphon Pinnacle",
      blurb: "Barracuda schools, batfish - whale sharks in season.",
      tag: "Big fish",
    },
    {
      image: SITE_IMAGES.sailRock,
      product: "SAILROCK",
      name: "Sail Rock",
      blurb: "The famous chimney swim-through. Full-day trip.",
      tag: "Best in the Gulf",
    },
    {
      image: SITE_IMAGES.twins,
      product: "FD",
      name: "Twins",
      blurb: "Relaxed 12-18m, perfect warm-up dive.",
    },
    {
      image: SITE_IMAGES.whaleShark,
      product: "FD",
      name: "Whale sharks",
      blurb: "March-May and Sep-Oct around the pinnacles.",
      tag: "In season",
    },
  ],
  sitesNote: "+ Shark Island, White Rock, Southwest Pinnacle, Mango Bay and more",
  whyHeadline: "Why divers pick us",
  whySub: "And why they keep coming back.",
  why: [
    {
      icon: "boats",
      title: "Two custom dive boats",
      body: "No shared boats with other shops. Our divers only - leaves on time, never packed.",
    },
    {
      icon: "mask",
      title: "Max 6 per guide",
      body: "Real briefings, real attention. Your guide actually watches your air.",
    },
    {
      icon: "medal",
      title: "PADI 5★ · 43 years",
      body: "Certified dive center with instructors who've logged Koh Tao thousands of times.",
    },
  ],
  reviewQuote: "“Most repeat customers we've ever had.”",
  reviewSrc: "4.9 · 796 reviews on TripAdvisor",
  faqHeadline: "Quick answers",
  // Ben's answers, 2026-10-02 - the three most-tapped questions in Clarity.
  faq: [
    {
      q: "What if the weather cancels the dive?",
      a: "You get a full refund. We never run unsafe trips.",
    },
    {
      q: "Which licence do I need?",
      a: "Morning trips: certified to 18 m (Open Water) or higher, any agency. Afternoon trips: no licence needed - you can join on a Discover Scuba try-dive.",
    },
    {
      q: "Haven't dived in a few years?",
      a: "You're welcome to join - do a refresher dive first (฿2,500), then dive with confidence.",
      link: { label: "Book a refresher", href: "/fun-dive-booking?product=SR" },
    },
  ],
  closingA: "Two dives. Your day.",
  closingB: "฿2,000, all-in.",
  closingSub: "Book online in 2 minutes - or WhatsApp us your dates.",
  stickyPriceLabel: "2 dives all-in",
  stickyCta: "Book now",
  waMessage: "Hi Nemo, I'm getting in touch about fun diving. I'd love some more details.",
};

const ES: FunDiveCopy = {
  seoTitle: "Inmersiones Guiadas en Koh Tao - 2,000 THB | Siam Scuba",
  seoDescription:
    "Buceadores certificados: inmersiones guiadas en Koh Tao. Dos inmersiones por 2,000 THB todo incluido, Sail Rock 4,000 THB. Grupos pequeños, barcos propios.",
  badge: "Para buceadores certificados · Centro PADI 5★",
  h1a: "Buceo en Koh Tao,",
  h1b: "como debe ser.",
  sub: "2 inmersiones guiadas en barco en los mejores sitios del Golfo - Chumphon Pinnacle, Sail Rock, Shark Island. Equipo, guía y seguro incluidos. Solo trae tu certificación.",
  priceNum: "฿2,000",
  priceLine1: "2 inmersiones · medio día",
  priceLine2: "todo incluido",
  ctaBook: "Reserva tu día de buceo",
  ctaWa: "o pregúntanos por WhatsApp",
  trustTaReviews: "796 reseñas en TripAdvisor",
  trustDivers: "Máx. 6 buceadores por guía",
  trustBoats: "2 barcos propios - sin aglomeraciones",
  facts: [
    { k: "Precio", v: "฿2,000", sub: "2 inmersiones, todo incluido" },
    { k: "Salidas", v: "Mañana / Tarde", sub: "todos los días, tú eliges" },
    { k: "Incluido", v: "Equipo + guía", sub: "+ seguro + fruta" },
    { k: "Sail Rock", v: "฿4,000", sub: "día completo + comidas" },
  ],
  sitesHeadline: "Dónde bucearás",
  sitesSub: "Rotamos los sitios según las condiciones - estos son los habituales.",
  sites: [
    {
      image: SITE_IMAGES.chumphon,
      product: "FD",
      name: "Chumphon Pinnacle",
      blurb: "Bancos de barracudas, peces murciélago - tiburones ballena en temporada.",
      tag: "Peces grandes",
    },
    {
      image: SITE_IMAGES.sailRock,
      product: "SAILROCK",
      name: "Sail Rock",
      blurb: "La famosa chimenea vertical. Salida de día completo.",
      tag: "El mejor del Golfo",
    },
    {
      image: SITE_IMAGES.twins,
      product: "FD",
      name: "Twins",
      blurb: "12-18 m tranquilos, perfecto para volver al agua.",
    },
    {
      image: SITE_IMAGES.whaleShark,
      product: "FD",
      name: "Tiburones ballena",
      blurb: "Marzo-mayo y sept-oct alrededor de los pináculos.",
      tag: "En temporada",
    },
  ],
  sitesNote: "+ Shark Island, White Rock, Southwest Pinnacle, Mango Bay y más",
  whyHeadline: "Por qué los buceadores nos eligen",
  whySub: "Y por qué siempre vuelven.",
  why: [
    {
      icon: "boats",
      title: "Dos barcos de buceo propios",
      body: "No compartimos barco con otros centros. Solo nuestros buceadores - sale puntual, nunca abarrotado.",
    },
    {
      icon: "mask",
      title: "Máx. 6 por guía",
      body: "Briefings de verdad, atención de verdad. Tu guía realmente vigila tu aire.",
    },
    {
      icon: "medal",
      title: "PADI 5★ · 43 años",
      body: "Centro certificado con instructores que han buceado Koh Tao miles de veces.",
    },
  ],
  reviewQuote: "“Los clientes más fieles que hemos tenido jamás.”",
  reviewSrc: "4.9 · 796 reseñas en TripAdvisor",
  faqHeadline: "Respuestas rápidas",
  faq: [
    {
      q: "¿Y si el tiempo cancela la inmersión?",
      a: "Te devolvemos el importe completo. Nunca salimos si no es seguro.",
    },
    {
      q: "¿Qué certificación necesito?",
      a: "Salidas de mañana: certificación hasta 18 m (Open Water) o superior, de cualquier agencia. Por la tarde no hace falta: puedes venir con un bautismo (Discover Scuba).",
    },
    {
      q: "¿Hace años que no buceas?",
      a: "Puedes venir - haz antes una inmersión de repaso (฿2,500) y bucea con confianza.",
      link: { label: "Reservar el repaso", href: "/fun-dive-booking?product=SR" },
    },
  ],
  closingA: "Dos inmersiones. Tu día.",
  closingB: "฿2,000, todo incluido.",
  closingSub: "Reserva online en 2 minutos - o envíanos tus fechas por WhatsApp.",
  stickyPriceLabel: "2 inmersiones todo incluido",
  stickyCta: "Reservar",
  waMessage:
    "Hola Nemo, me pongo en contacto por buceo recreativo. Me encantaría recibir más detalles.",
};

const HE: FunDiveCopy = {
  seoTitle: "צלילות כיף בקוטאו - יציאות מודרכות מ-2,000 באט | סיאם סקובה",
  seoDescription:
    "צוללים מוסמכים - הזמינו צלילות מודרכות בקוטאו. שתי צלילות בוקר או צהריים ב-2,000 באט הכל כלול. יום שלם בסייל רוק 4,000 באט. קבוצות קטנות, שתי סירות פרטיות.",
  badge: "לצוללים מוסמכים · מרכז PADI 5★",
  h1a: "צלילות כיף בקוטאו,",
  h1b: "כמו שצריך.",
  sub: "2 צלילות מודרכות מהסירה באתרים הכי טובים במפרץ - צ'ומפון פינקל, סייל רוק, שארק איילנד. ציוד, מדריך וביטוח כלולים. רק תביאו את הכרטיס.",
  priceNum: "฿2,000",
  priceLine1: "2 צלילות · חצי יום",
  priceLine2: "הכל כלול",
  ctaBook: "להזמנת יום הצלילה",
  ctaWa: "או שאלו אותנו הכל בוואטסאפ",
  trustTaReviews: "796 ביקורות בטריפאדוויזור",
  trustDivers: "מקסימום 6 צוללים למדריך",
  trustBoats: "2 סירות פרטיות - בלי צפיפות",
  facts: [
    { k: "מחיר", v: "฿2,000", sub: "2 צלילות, הכל כלול" },
    { k: "יציאות", v: "בוקר / צהריים", sub: "כל יום, לבחירתכם" },
    { k: "כלול", v: "ציוד + מדריך", sub: "+ ביטוח + פירות" },
    { k: "סייל רוק", v: "฿4,000", sub: "יום שלם + ארוחות" },
  ],
  sitesHeadline: "איפה צוללים",
  sitesSub: "האתרים מתחלפים לפי התנאים - אלה הקבועים.",
  sites: [
    {
      image: SITE_IMAGES.chumphon,
      product: "FD",
      name: "צ'ומפון פינקל",
      blurb: "להקות ברקודות, באטפיש - כרישי לוויתן בעונה.",
      tag: "דגים גדולים",
    },
    {
      image: SITE_IMAGES.sailRock,
      product: "SAILROCK",
      name: "סייל רוק",
      blurb: "הארובה המפורסמת שאפשר לשחות דרכה. יציאה ליום שלם.",
      tag: "הכי טוב במפרץ",
    },
    {
      image: SITE_IMAGES.twins,
      product: "FD",
      name: "טווינס",
      blurb: "12-18 מ' רגועים, מושלם לחזרה למים.",
    },
    {
      image: SITE_IMAGES.whaleShark,
      product: "FD",
      name: "כרישי לוויתן",
      blurb: "מרץ-מאי וספטמבר-אוקטובר סביב הפינקלים.",
      tag: "בעונה",
    },
  ],
  sitesNote: "+ שארק איילנד, וייט רוק, סאות'ווסט פינקל, מנגו ביי ועוד",
  whyHeadline: "למה צוללים בוחרים בנו",
  whySub: "ולמה הם חוזרים שוב ושוב.",
  why: [
    {
      icon: "boats",
      title: "שתי סירות צלילה פרטיות",
      body: "בלי סירות משותפות עם מרכזים אחרים. רק הצוללים שלנו - יוצאים בזמן, אף פעם לא צפוף.",
    },
    {
      icon: "mask",
      title: "מקסימום 6 למדריך",
      body: "תדריכים אמיתיים, תשומת לב אמיתית. המדריך באמת עוקב אחרי האוויר שלכם.",
    },
    {
      icon: "medal",
      title: "PADI 5★ · 43 שנים",
      body: "מרכז מוסמך עם מדריכים שצללו את קוטאו אלפי פעמים.",
    },
  ],
  reviewQuote: "“הכי הרבה לקוחות חוזרים שהיו לנו אי פעם.”",
  reviewSrc: "4.9 · 796 ביקורות בטריפאדוויזור",
  faqHeadline: "תשובות מהירות",
  faq: [
    {
      q: "מה אם מזג האוויר מבטל את הצלילה?",
      a: "מקבלים החזר מלא. אנחנו אף פעם לא יוצאים כשלא בטוח.",
    },
    {
      q: "איזה רישיון צריך?",
      a: "לצלילות הבוקר: הסמכה ל-18 מטר (Open Water) ומעלה, מכל ארגון. בצלילות הצהריים אפשר להצטרף גם בלי רישיון - בצלילת היכרות.",
    },
    {
      q: "לא צללתם כמה שנים?",
      a: "בשמחה - עשו קודם צלילת ריענון (฿2,500), ואז צוללים בביטחון.",
      link: { label: "להרשמה לריענון", href: "/fun-dive-booking?product=SR" },
    },
  ],
  closingA: "שתי צלילות. היום שלכם.",
  closingB: "฿2,000, הכל כלול.",
  closingSub: "הזמינו אונליין ב-2 דקות - או שלחו לנו תאריכים בוואטסאפ.",
  stickyPriceLabel: "2 צלילות הכל כלול",
  stickyCta: "להזמנה",
  waMessage: "היי נמו, אני פונה לגבי צלילות כיף. אשמח לקבל פרטים נוספים",
};

const FR: FunDiveCopy = {
  seoTitle: "Plongées Fun à Koh Tao - dès 2 000 THB | Siam Scuba",
  seoDescription:
    "Plongeurs certifiés : plongées guidées à Koh Tao. Deux plongées pour 2 000 THB tout compris, Sail Rock 4 000 THB. Petits groupes, deux bateaux privés.",
  badge: "Pour plongeurs certifiés · Centre PADI 5★",
  h1a: "Plongées fun à Koh Tao,",
  h1b: "dans les règles de l'art.",
  sub: "2 plongées guidées en bateau sur les meilleurs sites du Golfe - Chumphon Pinnacle, Sail Rock, Shark Island. Équipement, guide et assurance inclus. Venez juste avec votre carte.",
  priceNum: "฿2,000",
  priceLine1: "2 plongées · demi-journée",
  priceLine2: "tout compris",
  ctaBook: "Réservez votre journée",
  ctaWa: "ou posez-nous vos questions sur WhatsApp",
  trustTaReviews: "796 avis TripAdvisor",
  trustDivers: "Max 6 plongeurs par guide",
  trustBoats: "2 bateaux privés - jamais bondés",
  facts: [
    { k: "Prix", v: "฿2,000", sub: "2 plongées, tout compris" },
    { k: "Départs", v: "Matin / Après-midi", sub: "tous les jours, au choix" },
    { k: "Inclus", v: "Équipement + guide", sub: "+ assurance + fruits" },
    { k: "Sail Rock", v: "฿4,000", sub: "journée complète + repas" },
  ],
  sitesHeadline: "Où vous plongerez",
  sitesSub: "Les sites tournent selon les conditions - voici les habitués.",
  sites: [
    {
      image: SITE_IMAGES.chumphon,
      product: "FD",
      name: "Chumphon Pinnacle",
      blurb: "Bancs de barracudas, platax - requins-baleines en saison.",
      tag: "Gros poissons",
    },
    {
      image: SITE_IMAGES.sailRock,
      product: "SAILROCK",
      name: "Sail Rock",
      blurb: "La célèbre cheminée traversante. Sortie à la journée.",
      tag: "Le meilleur du Golfe",
    },
    {
      image: SITE_IMAGES.twins,
      product: "FD",
      name: "Twins",
      blurb: "12-18 m tranquilles, parfait pour se remettre à l'eau.",
    },
    {
      image: SITE_IMAGES.whaleShark,
      product: "FD",
      name: "Requins-baleines",
      blurb: "Mars-mai et sept-oct autour des pinacles.",
      tag: "En saison",
    },
  ],
  sitesNote: "+ Shark Island, White Rock, Southwest Pinnacle, Mango Bay et plus",
  whyHeadline: "Pourquoi les plongeurs nous choisissent",
  whySub: "Et pourquoi ils reviennent.",
  why: [
    {
      icon: "boats",
      title: "Deux bateaux de plongée privés",
      body: "Pas de bateau partagé avec d'autres centres. Nos plongeurs uniquement - départ à l'heure, jamais surchargé.",
    },
    {
      icon: "mask",
      title: "Max 6 par guide",
      body: "De vrais briefings, une vraie attention. Votre guide surveille vraiment votre air.",
    },
    {
      icon: "medal",
      title: "PADI 5★ · 43 ans",
      body: "Centre certifié avec des instructeurs qui connaissent Koh Tao par cœur.",
    },
  ],
  reviewQuote: "“Le plus de clients fidèles que nous ayons jamais eus.”",
  reviewSrc: "4.9 · 796 avis sur TripAdvisor",
  faqHeadline: "Réponses rapides",
  faq: [
    {
      q: "Et si la météo annule la plongée ?",
      a: "Vous êtes remboursé intégralement. Nous ne sortons jamais si ce n'est pas sûr.",
    },
    {
      q: "Quel niveau faut-il ?",
      a: "Sorties du matin : niveau 18 m (Open Water) ou plus, toutes agences. L'après-midi, aucun niveau n'est requis : vous pouvez venir faire un baptême (Discover Scuba).",
    },
    {
      q: "Pas plongé depuis quelques années ?",
      a: "Bienvenue - faites d'abord une plongée de remise à niveau (฿2,500), puis plongez en confiance.",
      link: { label: "Réserver la remise à niveau", href: "/fun-dive-booking?product=SR" },
    },
  ],
  closingA: "Deux plongées. Votre journée.",
  closingB: "฿2,000, tout compris.",
  closingSub: "Réservez en ligne en 2 minutes - ou envoyez vos dates sur WhatsApp.",
  stickyPriceLabel: "2 plongées tout compris",
  stickyCta: "Réserver",
  waMessage:
    "Bonjour Nemo, je vous contacte concernant la plongée loisir. J'aimerais avoir plus de détails.",
};

export const FUN_DIVE_COPY: Record<FunLang, FunDiveCopy> = {
  en: EN,
  es: ES,
  he: HE,
  fr: FR,
};

// ── URLs / SEO helpers ───────────────────────────────────────────────────────

const SITE = "https://siamscuba.com";
const SLUG = "fun-dives";

export function funDiveUrl(lang: FunLang): string {
  return lang === "en" ? `${SITE}/${SLUG}` : `${SITE}/${lang}/${SLUG}`;
}

export function funDiveHreflangAlternates(): Record<FunLang, string> {
  return {
    en: funDiveUrl("en"),
    es: funDiveUrl("es"),
    he: funDiveUrl("he"),
    fr: funDiveUrl("fr"),
  };
}

export function buildFunDiveJsonLd(lang: FunLang): Record<string, unknown>[] {
  const copy = FUN_DIVE_COPY[lang];
  const url = funDiveUrl(lang);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${copy.h1a} ${copy.h1b}`,
      description: copy.seoDescription,
      url,
      provider: { "@type": "Organization", name: "Siam Scuba", "@id": `${SITE}/#organization` },
      areaServed: { "@type": "Place", name: "Koh Tao" },
      offers: {
        "@type": "Offer",
        price: "2000",
        priceCurrency: "THB",
        availability: "https://schema.org/InStock",
        url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: copy.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];
}
