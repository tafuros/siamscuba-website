// "Try diving or Open Water?" - the page the entry gate's "Complete beginner"
// answer leads to (Ben 2026-10-04, mockup C). The gate's most popular answer
// (~80 taps in 30 days) used to close onto the generic homepage.
//
// Built to move a beginner toward Open Water honestly: depth (12 m vs 18 m),
// a certification for life, four dives instead of one, two free nights. The
// try-dive is NOT credited toward Open Water (Ben 2026-10-04), so the page
// never implies it is. Room prices are left out on purpose - the hotel's
// published prices are still placeholders.

export type StartLang = "en" | "he" | "es" | "fr";

export interface StartRow {
  label: string;
  dsd: string;
  dsdSub?: string;
  ow: string;
  owSub?: string;
}

export interface StartDivingCopy {
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  h1: string;
  sub: string;
  gaugeDsd: string;
  gaugeOw: string;
  gaugeBand: string;
  gaugeCaptionDsd: string;
  gaugeCaptionOw: string;
  tableTitle: string;
  colDsd: string;
  colDsdSub: string;
  colOw: string;
  colOwSub: string;
  recommended: string;
  rows: StartRow[];
  opensTitle: string;
  opens: { title: string; body: string }[];
  recoKicker: string;
  recoTitle: string;
  recoPoints: string[];
  recoShort: string;
  ctaOw: string;
  ctaOwSub: string;
  ctaDsd: string;
  ctaDsdSub: string;
  ctaWa: string;
  waMessage: string;
  detailsOw: string;
  detailsDsd: string;
}

export const START_DIVING_COPY: Record<StartLang, StartDivingCopy> = {
  en: {
    seoTitle: "Discover Scuba vs Open Water in Koh Tao | Siam Scuba",
    seoDescription:
      "Never dived? Compare a Discover Scuba try-dive (฿2,600, 12 m) with the PADI Open Water course (฿12,000, 18 m, certified for life) on Koh Tao.",
    kicker: "Never dived before?",
    h1: "Try one dive, or become a diver?",
    sub: "Two ways to start on Koh Tao. Here is how they compare.",
    gaugeDsd: "Try dive",
    gaugeOw: "Open Water",
    gaugeBand: "Only with Open Water",
    gaugeCaptionDsd: "฿2,600 · 1 ocean dive",
    gaugeCaptionOw: "฿12,000 · 4 ocean dives",
    tableTitle: "Side by side",
    colDsd: "Try dive",
    colDsdSub: "Discover Scuba Diving",
    colOw: "Open Water",
    colOwSub: "PADI Open Water Diver",
    recommended: "Recommended",
    rows: [
      { label: "Price", dsd: "฿2,600", dsdSub: "+฿1,000 for a 2nd try dive", ow: "฿12,000", owSub: "฿2,000 deposit + ฿10,000 on arrival" },
      { label: "Time", dsd: "1 day", dsdSub: "10:30 - 16:00", ow: "2.5 days", owSub: "theory, pool, then the ocean" },
      { label: "Max depth", dsd: "12 m", ow: "18 m" },
      { label: "Ocean dives", dsd: "1", dsdSub: "2nd dive optional", ow: "4", owSub: "plus pool sessions and theory" },
      { label: "What you get", dsd: "An experience", dsdSub: "no certification", ow: "Certified for life", owSub: "PADI card, recognized worldwide" },
      { label: "Free stay", dsd: "Not included", ow: "2 nights", owSub: "included in the price" },
      { label: "Instructor", dsd: "Small groups", dsdSub: "an instructor by your side the whole dive", ow: "Max 4 students", owSub: "per instructor" },
      { label: "Price per ocean dive", dsd: "฿2,600", dsdSub: "+฿1,000 for a 2nd try dive", ow: "฿3,000", owSub: "then ฿1,000 per fun dive (2 for ฿2,000)" },
      { label: "What you can do next", dsd: "Another try-dive", dsdSub: "always with an instructor", ow: "Dive on your own terms", owSub: "fun dives every day · Sail Rock on Sundays · anywhere in the world" },
    ],
    opensTitle: "What Open Water opens up",
    opens: [
      { title: "Sail Rock day trip", body: "Sundays · 3 dives · ฿4,000" },
      { title: "Fun dives every day", body: "Morning or afternoon · 2 dives ฿2,000" },
      { title: "Dive anywhere", body: "Your PADI card is recognized worldwide" },
    ],
    recoKicker: "Our recommendation",
    recoTitle: "Have 2.5 days? Do Open Water.",
    recoPoints: [
      "4 ocean dives instead of 1, down to 18 m",
      "A PADI certification you keep for life",
      "2 nights' stay included",
      "After it, 2 fun dives cost ฿2,000",
    ],
    recoShort: "Short on time? The try-dive is a great first taste.",
    ctaOw: "Book Open Water",
    ctaOwSub: "฿2,000 deposit today",
    ctaDsd: "Book a try-dive",
    ctaDsdSub: "฿1,000 deposit today",
    ctaWa: "Not sure yet? Ask us on WhatsApp",
    waMessage: "Hi! I've never dived - should I do a try-dive or the Open Water course?",
    detailsOw: "Open Water course details",
    detailsDsd: "Try-dive details",
  },
  he: {
    seoTitle: "צלילת היכרות או כוכב ראשון בקוטאו? | Siam Scuba",
    seoDescription:
      "אף פעם לא צללתם? השוואה בין צלילת היכרות (2,600 באט, עד 12 מ') לבין קורס PADI Open Water - כוכב ראשון (12,000 באט, עד 18 מ', הסמכה לכל החיים) בקוטאו.",
    kicker: "אף פעם לא צללתם?",
    h1: "צלילה אחת לנסות, או להפוך לצוללים?",
    sub: "שתי דרכים להתחיל בקוטאו. ככה הן משתוות.",
    gaugeDsd: "צלילת היכרות",
    gaugeOw: "כוכב ראשון",
    gaugeBand: "רק עם כוכב ראשון",
    gaugeCaptionDsd: "2,600 באט · צלילה אחת בים",
    gaugeCaptionOw: "12,000 באט · 4 צלילות בים",
    tableTitle: "אחד ליד השני",
    colDsd: "צלילת היכרות",
    colDsdSub: "Discover Scuba Diving",
    colOw: "כוכב ראשון",
    colOwSub: "PADI Open Water Diver",
    recommended: "מומלץ",
    rows: [
      { label: "מחיר", dsd: "2,600 באט", dsdSub: "צלילה שנייה ב-1,000 באט", ow: "12,000 באט", owSub: "2,000 מקדמה + 10,000 כשמגיעים" },
      { label: "זמן", dsd: "יום אחד", dsdSub: "10:30 - 16:00", ow: "2.5 ימים", owSub: "תיאוריה, בריכה, ואז הים" },
      { label: "עומק מקסימלי", dsd: "12 מ'", ow: "18 מ'" },
      { label: "צלילות בים", dsd: "1", dsdSub: "צלילה שנייה אופציונלית", ow: "4", owSub: "ועוד תרגולי בריכה ותיאוריה" },
      { label: "מה מקבלים", dsd: "חוויה", dsdSub: "בלי הסמכה", ow: "הסמכה לכל החיים", owSub: "כרטיס PADI שמוכר בכל העולם" },
      { label: "לינה מתנה", dsd: "לא כלולה", ow: "2 לילות", owSub: "כלולים במחיר" },
      { label: "מדריך", dsd: "קבוצות קטנות", dsdSub: "מדריך לצידכם כל הצלילה", ow: "עד 4 תלמידים", owSub: "למדריך" },
      { label: "מחיר לצלילה בים", dsd: "2,600 באט", dsdSub: "ועוד 1,000 לצלילת היכרות שנייה", ow: "3,000 באט", owSub: "ואחר כך 1,000 לצלילת כיף (2 ב-2,000)" },
      { label: "מה אפשר אחר כך", dsd: "עוד צלילת היכרות", dsdSub: "תמיד עם מדריך", ow: "לצלול בתנאים שלכם", owSub: "צלילות כיף כל יום · סייל רוק בימי ראשון · בכל מקום בעולם" },
    ],
    opensTitle: "מה כוכב ראשון פותח לכם",
    opens: [
      { title: "יום בסייל רוק", body: "ימי ראשון · 3 צלילות · 4,000 באט" },
      { title: "צלילות כיף כל יום", body: "בוקר או צהריים · 2 צלילות ב-2,000 באט" },
      { title: "לצלול בכל מקום", body: "כרטיס PADI מוכר בכל העולם" },
    ],
    recoKicker: "ההמלצה שלנו",
    recoTitle: "יש לכם 2.5 ימים? עשו כוכב ראשון.",
    recoPoints: [
      "4 צלילות בים במקום אחת, עד 18 מטר",
      "הסמכת PADI שנשארת לכל החיים",
      "2 לילות לינה כלולים",
      "אחרי זה, 2 צלילות כיף ב-2,000 באט",
    ],
    recoShort: "אין הרבה זמן? צלילת היכרות היא טעימה ראשונה מצוינת.",
    ctaOw: "להזמנת כוכב ראשון",
    ctaOwSub: "2,000 באט מקדמה היום",
    ctaDsd: "להזמנת צלילת היכרות",
    ctaDsdSub: "1,000 באט מקדמה היום",
    ctaWa: "עוד מתלבטים? שאלו אותנו בוואטסאפ",
    waMessage: "היי! אף פעם לא צללתי - כדאי לי צלילת היכרות או כוכב ראשון?",
    detailsOw: "פרטי קורס כוכב ראשון",
    detailsDsd: "פרטי צלילת ההיכרות",
  },
  es: {
    seoTitle: "Bautismo o Open Water en Koh Tao | Siam Scuba",
    seoDescription:
      "¿Nunca has buceado? Compara un bautismo Discover Scuba (฿2,600, 12 m) con el curso PADI Open Water (฿12,000, 18 m, certificación de por vida) en Koh Tao.",
    kicker: "¿Nunca has buceado?",
    h1: "¿Probar una inmersión o convertirte en buceador?",
    sub: "Dos formas de empezar en Koh Tao. Así se comparan.",
    gaugeDsd: "Bautismo",
    gaugeOw: "Open Water",
    gaugeBand: "Solo con Open Water",
    gaugeCaptionDsd: "฿2,600 · 1 inmersión en el mar",
    gaugeCaptionOw: "฿12,000 · 4 inmersiones en el mar",
    tableTitle: "Lado a lado",
    colDsd: "Bautismo",
    colDsdSub: "Discover Scuba Diving",
    colOw: "Open Water",
    colOwSub: "PADI Open Water Diver",
    recommended: "Recomendado",
    rows: [
      { label: "Precio", dsd: "฿2,600", dsdSub: "+฿1,000 por un 2º bautismo", ow: "฿12,000", owSub: "฿2,000 de depósito + ฿10,000 al llegar" },
      { label: "Tiempo", dsd: "1 día", dsdSub: "10:30 - 16:00", ow: "2,5 días", owSub: "teoría, piscina y luego el mar" },
      { label: "Profundidad máx.", dsd: "12 m", ow: "18 m" },
      { label: "Inmersiones en el mar", dsd: "1", dsdSub: "2ª inmersión opcional", ow: "4", owSub: "más piscina y teoría" },
      { label: "Qué obtienes", dsd: "Una experiencia", dsdSub: "sin certificación", ow: "Certificado de por vida", owSub: "tarjeta PADI reconocida en todo el mundo" },
      { label: "Alojamiento gratis", dsd: "No incluido", ow: "2 noches", owSub: "incluidas en el precio" },
      { label: "Instructor", dsd: "Grupos pequeños", dsdSub: "un instructor a tu lado toda la inmersión", ow: "Máx. 4 alumnos", owSub: "por instructor" },
      { label: "Precio por inmersión", dsd: "฿2,600", dsdSub: "+฿1,000 por un 2º bautismo", ow: "฿3,000", owSub: "luego ฿1,000 por fun dive (2 por ฿2,000)" },
      { label: "Qué puedes hacer después", dsd: "Otro bautismo", dsdSub: "siempre con instructor", ow: "Bucear a tu manera", owSub: "fun dives todos los días · Sail Rock los domingos · en cualquier lugar" },
    ],
    opensTitle: "Lo que te abre el Open Water",
    opens: [
      { title: "Día en Sail Rock", body: "Domingos · 3 inmersiones · ฿4,000" },
      { title: "Fun dives cada día", body: "Mañana o tarde · 2 inmersiones ฿2,000" },
      { title: "Bucea donde quieras", body: "Tu tarjeta PADI vale en todo el mundo" },
    ],
    recoKicker: "Nuestra recomendación",
    recoTitle: "¿Tienes 2,5 días? Haz el Open Water.",
    recoPoints: [
      "4 inmersiones en vez de 1, hasta 18 m",
      "Una certificación PADI para toda la vida",
      "2 noches de alojamiento incluidas",
      "Después, 2 fun dives cuestan ฿2,000",
    ],
    recoShort: "¿Poco tiempo? El bautismo es una gran primera experiencia.",
    ctaOw: "Reservar Open Water",
    ctaOwSub: "฿2,000 de depósito hoy",
    ctaDsd: "Reservar un bautismo",
    ctaDsdSub: "฿1,000 de depósito hoy",
    ctaWa: "¿Aún dudas? Pregúntanos por WhatsApp",
    waMessage: "¡Hola! Nunca he buceado: ¿me conviene un bautismo o el curso Open Water?",
    detailsOw: "Detalles del curso Open Water",
    detailsDsd: "Detalles del bautismo",
  },
  fr: {
    seoTitle: "Baptême ou Open Water à Koh Tao ? | Siam Scuba",
    seoDescription:
      "Jamais plongé ? Comparez un baptême Discover Scuba (฿2,600, 12 m) et le cours PADI Open Water (฿12,000, 18 m, certification à vie) à Koh Tao.",
    kicker: "Jamais plongé ?",
    h1: "Essayer une plongée, ou devenir plongeur ?",
    sub: "Deux façons de commencer à Koh Tao. Voici comment elles se comparent.",
    gaugeDsd: "Baptême",
    gaugeOw: "Open Water",
    gaugeBand: "Seulement avec l'Open Water",
    gaugeCaptionDsd: "฿2,600 · 1 plongée en mer",
    gaugeCaptionOw: "฿12,000 · 4 plongées en mer",
    tableTitle: "Côte à côte",
    colDsd: "Baptême",
    colDsdSub: "Discover Scuba Diving",
    colOw: "Open Water",
    colOwSub: "PADI Open Water Diver",
    recommended: "Recommandé",
    rows: [
      { label: "Prix", dsd: "฿2,600", dsdSub: "+฿1,000 pour un 2e baptême", ow: "฿12,000", owSub: "฿2,000 d'acompte + ฿10,000 à l'arrivée" },
      { label: "Durée", dsd: "1 jour", dsdSub: "10:30 - 16:00", ow: "2,5 jours", owSub: "théorie, piscine, puis la mer" },
      { label: "Profondeur max", dsd: "12 m", ow: "18 m" },
      { label: "Plongées en mer", dsd: "1", dsdSub: "2e plongée en option", ow: "4", owSub: "plus piscine et théorie" },
      { label: "Ce que vous obtenez", dsd: "Une expérience", dsdSub: "sans certification", ow: "Certifié à vie", owSub: "carte PADI reconnue dans le monde entier" },
      { label: "Logement offert", dsd: "Non inclus", ow: "2 nuits", owSub: "incluses dans le prix" },
      { label: "Instructeur", dsd: "Petits groupes", dsdSub: "un instructeur à vos côtés toute la plongée", ow: "Max 4 élèves", owSub: "par instructeur" },
      { label: "Prix par plongée", dsd: "฿2,600", dsdSub: "+฿1,000 pour un 2e baptême", ow: "฿3,000", owSub: "puis ฿1,000 par plongée fun (2 pour ฿2,000)" },
      { label: "Et après", dsd: "Un autre baptême", dsdSub: "toujours avec un instructeur", ow: "Plonger à votre rythme", owSub: "plongées fun tous les jours · Sail Rock le dimanche · partout dans le monde" },
    ],
    opensTitle: "Ce que l'Open Water vous ouvre",
    opens: [
      { title: "Journée à Sail Rock", body: "Dimanche · 3 plongées · ฿4,000" },
      { title: "Plongées fun tous les jours", body: "Matin ou après-midi · 2 plongées ฿2,000" },
      { title: "Plongez partout", body: "Votre carte PADI est reconnue partout" },
    ],
    recoKicker: "Notre conseil",
    recoTitle: "Vous avez 2,5 jours ? Faites l'Open Water.",
    recoPoints: [
      "4 plongées en mer au lieu d'1, jusqu'à 18 m",
      "Une certification PADI pour la vie",
      "2 nuits de logement incluses",
      "Ensuite, 2 plongées fun coûtent ฿2,000",
    ],
    recoShort: "Peu de temps ? Le baptême est une super première approche.",
    ctaOw: "Réserver l'Open Water",
    ctaOwSub: "฿2,000 d'acompte aujourd'hui",
    ctaDsd: "Réserver un baptême",
    ctaDsdSub: "฿1,000 d'acompte aujourd'hui",
    ctaWa: "Pas encore sûr ? Écrivez-nous sur WhatsApp",
    waMessage: "Bonjour ! Je n'ai jamais plongé : baptême ou cours Open Water ?",
    detailsOw: "Détails du cours Open Water",
    detailsDsd: "Détails du baptême",
  },
};

export const START_DIVING_PATH: Record<StartLang, string> = {
  en: "/discover-scuba-vs-open-water",
  he: "/he/discover-scuba-vs-open-water",
  es: "/es/discover-scuba-vs-open-water",
  fr: "/fr/discover-scuba-vs-open-water",
};
