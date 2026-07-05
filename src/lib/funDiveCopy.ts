// Fun Dives lander copy - dedicated module for the redesigned /fun-dives
// campaign page (dark-premium design line). Kept separate from landerCopy.ts
// because this lander supports FRENCH in addition to en/es/he, and extending
// the shared Lang union would force FR copy onto every other offer.
//
// Strings are inlined (not in src/i18n/translations.ts) because campaign
// landers must render the AD's language regardless of any returning-visitor
// preference stored in localStorage.

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
}

export interface FunWhyCard {
  emoji: string;
  title: string;
  body: string;
}

export interface FunFaqItem {
  q: string;
  a: string;
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
  seoTitle: "Fun Dives in Koh Tao - Guided Day Trips from 2,000 THB | Siam Scuba",
  seoDescription:
    "Certified divers - book guided fun dives in Koh Tao. Two morning or afternoon dives 2,000 THB all-in. Full-day Sail Rock 4,000 THB. Small groups, two custom boats.",
  badge: "🤿 For certified divers · PADI 5★ center",
  h1a: "Fun dives in Koh Tao,",
  h1b: "done properly.",
  sub: "2 guided boat dives at the Gulf's best sites - Chumphon Pinnacle, Sail Rock, Shark Island. Gear, guide and insurance included. Just show up with your card.",
  priceNum: "฿2,000",
  priceLine1: "2 dives · half-day",
  priceLine2: "everything included",
  ctaBook: "Book your dive day",
  ctaWa: "or ask us anything on WhatsApp",
  trustTaReviews: "778 TripAdvisor reviews",
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
      name: "Chumphon Pinnacle",
      blurb: "Barracuda schools, batfish - whale sharks in season.",
      tag: "Big fish",
    },
    {
      image: SITE_IMAGES.sailRock,
      name: "Sail Rock",
      blurb: "The famous chimney swim-through. Full-day trip.",
      tag: "Best in the Gulf",
    },
    {
      image: SITE_IMAGES.twins,
      name: "Twins",
      blurb: "Relaxed 12-18m, perfect warm-up dive.",
    },
    {
      image: SITE_IMAGES.whaleShark,
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
      emoji: "🚤",
      title: "Two custom dive boats",
      body: "No shared boats with other shops. Our divers only - leaves on time, never packed.",
    },
    {
      emoji: "🤿",
      title: "Max 6 per guide",
      body: "Real briefings, real attention. Your guide actually watches your air.",
    },
    {
      emoji: "🏅",
      title: "PADI 5★ · 43 years",
      body: "Certified dive center with instructors who've logged Koh Tao thousands of times.",
    },
  ],
  reviewQuote: "“Most repeat customers we've ever had.”",
  reviewSrc: "5.0 · 778 reviews on TripAdvisor",
  faqHeadline: "Quick answers",
  faq: [
    {
      q: "Which certifications do you accept?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS - anything mainstream. A digital copy of your card is fine.",
    },
    {
      q: "Haven't dived in 2+ years?",
      a: "Do a quick refresher (฿2,500) - two skill sessions plus a shallow dive, then join the fun dives with confidence.",
    },
    {
      q: "What if weather cancels the trip?",
      a: "Full refund or reschedule - your choice. We never run unsafe trips.",
    },
  ],
  closingA: "Two dives. Your day.",
  closingB: "฿2,000, all-in.",
  closingSub: "Book online in 2 minutes - or WhatsApp us your dates.",
  stickyPriceLabel: "2 dives all-in",
  stickyCta: "Book now",
  waMessage: "Hi Siam Scuba! I'd like to book a guided fun dive. What's available this week?",
};

const ES: FunDiveCopy = {
  seoTitle: "Inmersiones Guiadas en Koh Tao - Desde 2,000 THB | Siam Scuba",
  seoDescription:
    "Buceadores certificados - reserva inmersiones guiadas en Koh Tao. Dos inmersiones mañana o tarde por 2,000 THB todo incluido. Día completo en Sail Rock 4,000 THB. Grupos pequeños, barcos propios.",
  badge: "🤿 Para buceadores certificados · Centro PADI 5★",
  h1a: "Buceo en Koh Tao,",
  h1b: "como debe ser.",
  sub: "2 inmersiones guiadas en barco en los mejores sitios del Golfo - Chumphon Pinnacle, Sail Rock, Shark Island. Equipo, guía y seguro incluidos. Solo trae tu certificación.",
  priceNum: "฿2,000",
  priceLine1: "2 inmersiones · medio día",
  priceLine2: "todo incluido",
  ctaBook: "Reserva tu día de buceo",
  ctaWa: "o pregúntanos por WhatsApp",
  trustTaReviews: "778 reseñas en TripAdvisor",
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
      name: "Chumphon Pinnacle",
      blurb: "Bancos de barracudas, peces murciélago - tiburones ballena en temporada.",
      tag: "Peces grandes",
    },
    {
      image: SITE_IMAGES.sailRock,
      name: "Sail Rock",
      blurb: "La famosa chimenea vertical. Salida de día completo.",
      tag: "El mejor del Golfo",
    },
    {
      image: SITE_IMAGES.twins,
      name: "Twins",
      blurb: "12-18 m tranquilos, perfecto para volver al agua.",
    },
    {
      image: SITE_IMAGES.whaleShark,
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
      emoji: "🚤",
      title: "Dos barcos de buceo propios",
      body: "No compartimos barco con otros centros. Solo nuestros buceadores - sale puntual, nunca abarrotado.",
    },
    {
      emoji: "🤿",
      title: "Máx. 6 por guía",
      body: "Briefings de verdad, atención de verdad. Tu guía realmente vigila tu aire.",
    },
    {
      emoji: "🏅",
      title: "PADI 5★ · 43 años",
      body: "Centro certificado con instructores que han buceado Koh Tao miles de veces.",
    },
  ],
  reviewQuote: "“Los clientes más fieles que hemos tenido jamás.”",
  reviewSrc: "5.0 · 778 reseñas en TripAdvisor",
  faqHeadline: "Respuestas rápidas",
  faq: [
    {
      q: "¿Qué certificaciones aceptáis?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS - cualquiera reconocida. Vale una copia digital de tu tarjeta.",
    },
    {
      q: "¿Más de 2 años sin bucear?",
      a: "Haz un refresher rápido (฿2,500) - dos sesiones de habilidades más una inmersión poco profunda, y únete a los fun dives con confianza.",
    },
    {
      q: "¿Y si el tiempo cancela la salida?",
      a: "Reembolso completo o cambio de fecha - tú eliges. Nunca salimos si no es seguro.",
    },
  ],
  closingA: "Dos inmersiones. Tu día.",
  closingB: "฿2,000, todo incluido.",
  closingSub: "Reserva online en 2 minutos - o envíanos tus fechas por WhatsApp.",
  stickyPriceLabel: "2 inmersiones todo incluido",
  stickyCta: "Reservar",
  waMessage:
    "¡Hola Siam Scuba! Quisiera reservar una inmersión guiada. ¿Qué tienen disponible esta semana?",
};

const HE: FunDiveCopy = {
  seoTitle: "צלילות כיף בקוטאו - יציאות מודרכות מ-2,000 באט | סיאם סקובה",
  seoDescription:
    "צוללים מוסמכים - הזמינו צלילות מודרכות בקוטאו. שתי צלילות בוקר או צהריים ב-2,000 באט הכל כלול. יום שלם בסייל רוק 4,000 באט. קבוצות קטנות, שתי סירות פרטיות.",
  badge: "🤿 לצוללים מוסמכים · מרכז PADI 5★",
  h1a: "צלילות כיף בקוטאו,",
  h1b: "כמו שצריך.",
  sub: "2 צלילות מודרכות מהסירה באתרים הכי טובים במפרץ - צ'ומפון פינקל, סייל רוק, שארק איילנד. ציוד, מדריך וביטוח כלולים. רק תביאו את הכרטיס.",
  priceNum: "฿2,000",
  priceLine1: "2 צלילות · חצי יום",
  priceLine2: "הכל כלול",
  ctaBook: "להזמנת יום הצלילה",
  ctaWa: "או שאלו אותנו הכל בוואטסאפ",
  trustTaReviews: "778 ביקורות בטריפאדוויזור",
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
      name: "צ'ומפון פינקל",
      blurb: "להקות ברקודות, באטפיש - כרישי לוויתן בעונה.",
      tag: "דגים גדולים",
    },
    {
      image: SITE_IMAGES.sailRock,
      name: "סייל רוק",
      blurb: "הארובה המפורסמת שאפשר לשחות דרכה. יציאה ליום שלם.",
      tag: "הכי טוב במפרץ",
    },
    {
      image: SITE_IMAGES.twins,
      name: "טווינס",
      blurb: "12-18 מ' רגועים, מושלם לחזרה למים.",
    },
    {
      image: SITE_IMAGES.whaleShark,
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
      emoji: "🚤",
      title: "שתי סירות צלילה פרטיות",
      body: "בלי סירות משותפות עם מרכזים אחרים. רק הצוללים שלנו - יוצאים בזמן, אף פעם לא צפוף.",
    },
    {
      emoji: "🤿",
      title: "מקסימום 6 למדריך",
      body: "תדריכים אמיתיים, תשומת לב אמיתית. המדריך באמת עוקב אחרי האוויר שלכם.",
    },
    {
      emoji: "🏅",
      title: "PADI 5★ · 43 שנים",
      body: "מרכז מוסמך עם מדריכים שצללו את קוטאו אלפי פעמים.",
    },
  ],
  reviewQuote: "“הכי הרבה לקוחות חוזרים שהיו לנו אי פעם.”",
  reviewSrc: "5.0 · 778 ביקורות בטריפאדוויזור",
  faqHeadline: "תשובות מהירות",
  faq: [
    {
      q: "אילו הסמכות אתם מקבלים?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS - כל הסמכה מוכרת. עותק דיגיטלי של הכרטיס מספיק.",
    },
    {
      q: "לא צללתם יותר משנתיים?",
      a: "עשו ריענון מהיר (฿2,500) - שני תרגולי מיומנויות וצלילה רדודה, ואז הצטרפו לצלילות בביטחון.",
    },
    {
      q: "מה אם מזג האוויר מבטל את היציאה?",
      a: "החזר מלא או דחייה - לבחירתכם. אנחנו אף פעם לא יוצאים כשלא בטוח.",
    },
  ],
  closingA: "שתי צלילות. היום שלכם.",
  closingB: "฿2,000, הכל כלול.",
  closingSub: "הזמינו אונליין ב-2 דקות - או שלחו לנו תאריכים בוואטסאפ.",
  stickyPriceLabel: "2 צלילות הכל כלול",
  stickyCta: "להזמנה",
  waMessage: "היי סיאם סקובה! אני רוצה להזמין צלילת בילוי מודרכת. מה פנוי השבוע?",
};

const FR: FunDiveCopy = {
  seoTitle: "Plongées Fun à Koh Tao - Sorties Guidées dès 2 000 THB | Siam Scuba",
  seoDescription:
    "Plongeurs certifiés - réservez vos plongées guidées à Koh Tao. Deux plongées matin ou après-midi pour 2 000 THB tout compris. Journée complète à Sail Rock 4 000 THB. Petits groupes, deux bateaux privés.",
  badge: "🤿 Pour plongeurs certifiés · Centre PADI 5★",
  h1a: "Plongées fun à Koh Tao,",
  h1b: "dans les règles de l'art.",
  sub: "2 plongées guidées en bateau sur les meilleurs sites du Golfe - Chumphon Pinnacle, Sail Rock, Shark Island. Équipement, guide et assurance inclus. Venez juste avec votre carte.",
  priceNum: "฿2,000",
  priceLine1: "2 plongées · demi-journée",
  priceLine2: "tout compris",
  ctaBook: "Réservez votre journée",
  ctaWa: "ou posez-nous vos questions sur WhatsApp",
  trustTaReviews: "778 avis TripAdvisor",
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
      name: "Chumphon Pinnacle",
      blurb: "Bancs de barracudas, platax - requins-baleines en saison.",
      tag: "Gros poissons",
    },
    {
      image: SITE_IMAGES.sailRock,
      name: "Sail Rock",
      blurb: "La célèbre cheminée traversante. Sortie à la journée.",
      tag: "Le meilleur du Golfe",
    },
    {
      image: SITE_IMAGES.twins,
      name: "Twins",
      blurb: "12-18 m tranquilles, parfait pour se remettre à l'eau.",
    },
    {
      image: SITE_IMAGES.whaleShark,
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
      emoji: "🚤",
      title: "Deux bateaux de plongée privés",
      body: "Pas de bateau partagé avec d'autres centres. Nos plongeurs uniquement - départ à l'heure, jamais surchargé.",
    },
    {
      emoji: "🤿",
      title: "Max 6 par guide",
      body: "De vrais briefings, une vraie attention. Votre guide surveille vraiment votre air.",
    },
    {
      emoji: "🏅",
      title: "PADI 5★ · 43 ans",
      body: "Centre certifié avec des instructeurs qui connaissent Koh Tao par cœur.",
    },
  ],
  reviewQuote: "“Le plus de clients fidèles que nous ayons jamais eus.”",
  reviewSrc: "5.0 · 778 avis sur TripAdvisor",
  faqHeadline: "Réponses rapides",
  faq: [
    {
      q: "Quelles certifications acceptez-vous ?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS - toutes les principales. Une copie numérique de votre carte suffit.",
    },
    {
      q: "Vous n'avez pas plongé depuis plus de 2 ans ?",
      a: "Faites un rapide refresher (฿2,500) - deux sessions de révision plus une plongée peu profonde, puis rejoignez les fun dives en confiance.",
    },
    {
      q: "Et si la météo annule la sortie ?",
      a: "Remboursement intégral ou report - à vous de choisir. Nous ne sortons jamais si ce n'est pas sûr.",
    },
  ],
  closingA: "Deux plongées. Votre journée.",
  closingB: "฿2,000, tout compris.",
  closingSub: "Réservez en ligne en 2 minutes - ou envoyez vos dates sur WhatsApp.",
  stickyPriceLabel: "2 plongées tout compris",
  stickyCta: "Réserver",
  waMessage:
    "Bonjour Siam Scuba ! Je souhaite réserver une plongée fun guidée. Quelles sont les disponibilités cette semaine ?",
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
