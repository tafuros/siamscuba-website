import type { Language } from "@/i18n/translations";

/**
 * Real course pages (Ben 2026-10-04, mockup A).
 *
 * Until now /open-water, /discover-scuba and /scuba-review rendered the WHOLE
 * homepage with the course popup auto-opened on top. Clarity, 30 days to
 * 2026-10-02: on /open-water the popup's close X took 28 taps against 3 on
 * "Book now", and after closing it only 13% of visitors reached a quarter of
 * the page. Now the course IS the page.
 *
 * Long content (what's included, the plan, payment terms) still comes from
 * src/i18n/courseDetails.ts in all four languages, so the popup and the page
 * can never disagree. This file holds only what the page adds: the headline
 * numbers, the hero photo, three short answers and the next step.
 */

export type CoursePageSlug = "open-water" | "discover-scuba" | "scuba-review";

type L<T> = Record<Language, T>;

export interface CoursePageData {
  slug: CoursePageSlug;
  /** Key into courseDetails[lang]. */
  dialogKey: string;
  /** DiveOS wizard product code (?product=). */
  product: string;
  priceThb: number;
  depositThb: number;
  /** Paid on arrival. null when the page should not split the price. */
  balanceThb: number | null;
  /** Small line under the price (e.g. the optional 2nd try-dive). */
  priceNote?: L<string>;
  heroImage: string;
  /** One-line promise under the H1. */
  tagline: L<string>;
  /** Four headline facts: [value, label]. */
  facts: L<[string, string][]>;
  faq: L<{ q: string; a: string }[]>;
  /** Show the free-stay card (Open Water's 2 nights). */
  freeStay?: L<{ title: string; body: string }>;
  next: { href: string; title: L<string>; body: L<string>; cta: L<string> };
}

export const COURSE_PAGE_UI: L<{
  badge: string;
  deposit: (amount: string) => string;
  onArrival: (amount: string) => string;
  book: string;
  whatsapp: string;
  included: string;
  notIncluded: string;
  plan: string;
  bring: string;
  payment: string;
  goodToKnow: string;
  diversSay: string;
  reviews: string;
  nextStep: string;
  stickyToday: (amount: string) => string;
  waMessage: (course: string) => string;
}> = {
  en: {
    badge: "PADI 5★ IDC center · Koh Tao",
    deposit: (a) => `${a} deposit online`,
    onArrival: (a) => `${a} on arrival`,
    book: "Book now",
    whatsapp: "Ask us on WhatsApp",
    included: "What's included",
    notIncluded: "Not included",
    plan: "The plan",
    bring: "What to bring",
    payment: "Payment and changes",
    goodToKnow: "Good to know",
    diversSay: "Divers say",
    reviews: "reviews",
    nextStep: "Next step",
    stickyToday: (a) => `${a} today · rest on arrival`,
    waMessage: (c) => `Hi! I'm interested in the ${c}. Could you tell me about the next dates?`,
  },
  he: {
    badge: "מרכז PADI 5★ IDC · קוטאו",
    deposit: (a) => `${a} מקדמה אונליין`,
    onArrival: (a) => `${a} כשמגיעים`,
    book: "להזמנה",
    whatsapp: "לשאול אותנו בוואטסאפ",
    included: "מה כלול",
    notIncluded: "לא כלול",
    plan: "התוכנית",
    bring: "מה להביא",
    payment: "תשלום ושינויים",
    goodToKnow: "טוב לדעת",
    diversSay: "מה צוללים אומרים",
    reviews: "ביקורות",
    nextStep: "הצעד הבא",
    stickyToday: (a) => `${a} היום · היתרה כשמגיעים`,
    waMessage: (c) => `היי! אני מתעניין/ת ב-${c}. אפשר לשמוע על התאריכים הקרובים?`,
  },
  es: {
    badge: "Centro PADI 5★ IDC · Koh Tao",
    deposit: (a) => `${a} de depósito online`,
    onArrival: (a) => `${a} al llegar`,
    book: "Reservar",
    whatsapp: "Pregúntanos por WhatsApp",
    included: "Qué incluye",
    notIncluded: "No incluye",
    plan: "El plan",
    bring: "Qué traer",
    payment: "Pago y cambios",
    goodToKnow: "Bueno saber",
    diversSay: "Lo que dicen los buceadores",
    reviews: "reseñas",
    nextStep: "Siguiente paso",
    stickyToday: (a) => `${a} hoy · el resto al llegar`,
    waMessage: (c) => `¡Hola! Me interesa el ${c}. ¿Me contáis las próximas fechas?`,
  },
  fr: {
    badge: "Centre PADI 5★ IDC · Koh Tao",
    deposit: (a) => `${a} d'acompte en ligne`,
    onArrival: (a) => `${a} à l'arrivée`,
    book: "Réserver",
    whatsapp: "Écrivez-nous sur WhatsApp",
    included: "Ce qui est inclus",
    notIncluded: "Non inclus",
    plan: "Le programme",
    bring: "À apporter",
    payment: "Paiement et changements",
    goodToKnow: "Bon à savoir",
    diversSay: "Ce que disent les plongeurs",
    reviews: "avis",
    nextStep: "Étape suivante",
    stickyToday: (a) => `${a} aujourd'hui · le reste à l'arrivée`,
    waMessage: (c) => `Bonjour ! Le ${c} m'intéresse. Pouvez-vous me donner les prochaines dates ?`,
  },
};

export const COURSE_PAGES: Record<CoursePageSlug, CoursePageData> = {
  "open-water": {
    slug: "open-water",
    dialogKey: "Open Water Diver",
    product: "OW",
    priceThb: 12000,
    depositThb: 2000,
    balanceThb: 10000,
    heroImage: "/blog/open-water-course-koh-tao.jpg",
    tagline: {
      en: "Become a certified diver in 2.5 days. A lifetime PADI certification, recognized worldwide.",
      he: "הופכים לצוללים מוסמכים ב-2.5 ימים. הסמכת PADI לכל החיים, מוכרת בכל העולם.",
      es: "Certifícate como buceador en 2,5 días. Una certificación PADI de por vida, reconocida en todo el mundo.",
      fr: "Devenez plongeur certifié en 2,5 jours. Une certification PADI à vie, reconnue dans le monde entier.",
    },
    facts: {
      en: [["2.5 days", "Duration"], ["18 m", "Max depth"], ["Max 4", "Per instructor"], ["2 nights", "Free stay"]],
      he: [["2.5 ימים", "משך"], ["18 מ'", "עומק מקסימלי"], ["עד 4", "למדריך"], ["2 לילות", "לינה מתנה"]],
      es: [["2,5 días", "Duración"], ["18 m", "Profundidad máx."], ["Máx. 4", "Por instructor"], ["2 noches", "Alojamiento gratis"]],
      fr: [["2,5 jours", "Durée"], ["18 m", "Profondeur max"], ["Max 4", "Par instructeur"], ["2 nuits", "Logement offert"]],
    },
    faq: {
      en: [
        { q: "Do I need any experience?", a: "No. You start with theory and the pool, then go into the ocean with your instructor." },
        { q: "What do I pay now?", a: "A ฿2,000 deposit online. The other ฿10,000 when you arrive." },
        { q: "What if I can't finish here?", a: "You can complete the course anywhere in the world within 12 months." },
      ],
      he: [
        { q: "צריך ניסיון קודם?", a: "לא. מתחילים בתיאוריה ובבריכה, ואז יוצאים לים עם המדריך." },
        { q: "כמה משלמים עכשיו?", a: "מקדמה של 2,000 באט אונליין. את 10,000 הבאט הנותרים משלמים כשמגיעים." },
        { q: "ומה אם לא מספיקים לסיים כאן?", a: "אפשר להשלים את הקורס בכל מקום בעולם תוך 12 חודשים." },
      ],
      es: [
        { q: "¿Necesito experiencia?", a: "No. Empiezas con teoría y piscina, y luego vas al mar con tu instructor." },
        { q: "¿Cuánto pago ahora?", a: "Un depósito de ฿2,000 online. Los otros ฿10,000 al llegar." },
        { q: "¿Y si no puedo terminarlo aquí?", a: "Puedes completar el curso en cualquier lugar del mundo en 12 meses." },
      ],
      fr: [
        { q: "Faut-il de l'expérience ?", a: "Non. Vous commencez par la théorie et la piscine, puis vous allez en mer avec votre instructeur." },
        { q: "Combien je paie maintenant ?", a: "Un acompte de ฿2,000 en ligne. Les ฿10,000 restants à l'arrivée." },
        { q: "Et si je ne peux pas finir ici ?", a: "Vous pouvez terminer le cours n'importe où dans le monde dans les 12 mois." },
      ],
    },
    freeStay: {
      en: { title: "2 nights on us", body: "Stay with us while you train - it's included in the ฿12,000. Add Advanced Open Water and it becomes 4 free nights." },
      he: { title: "2 לילות עלינו", body: "לנים אצלנו בזמן הקורס - זה כלול ב-12,000 הבאט. מוסיפים כוכב שני וזה הופך ל-4 לילות מתנה." },
      es: { title: "2 noches invitamos nosotros", body: "Quédate con nosotros mientras te formas: está incluido en los ฿12,000. Añade el Advanced Open Water y son 4 noches gratis." },
      fr: { title: "2 nuits offertes", body: "Logez chez nous pendant la formation : c'est inclus dans les ฿12,000. Ajoutez l'Advanced Open Water et ce sont 4 nuits offertes." },
    },
    next: {
      href: "/advanced-open-water-course",
      title: { en: "Advanced Open Water", he: "Advanced Open Water (כוכב שני)", es: "Advanced Open Water", fr: "Advanced Open Water" },
      body: {
        en: "1.5 days · 5 dives · down to 30 m · ฿11,000. Book both courses: 4 free nights.",
        he: "1.5 ימים · 5 צלילות · עד 30 מטר · 11,000 באט. מזמינים את שני הקורסים: 4 לילות מתנה.",
        es: "1,5 días · 5 inmersiones · hasta 30 m · ฿11,000. Reserva los dos cursos: 4 noches gratis.",
        fr: "1,5 jour · 5 plongées · jusqu'à 30 m · ฿11,000. Réservez les deux cours : 4 nuits offertes.",
      },
      cta: { en: "See Advanced", he: "לכוכב שני", es: "Ver Advanced", fr: "Voir l'Advanced" },
    },
  },

  "discover-scuba": {
    slug: "discover-scuba",
    dialogKey: "Discover Scuba Diving",
    product: "DSD",
    priceThb: 2600,
    depositThb: 1000,
    balanceThb: 1600,
    priceNote: {
      en: "Add a 2nd dive at another site for ฿1,000",
      he: "צלילה שנייה באתר אחר ב-1,000 באט נוספים",
      es: "Añade una 2ª inmersión en otro sitio por ฿1,000",
      fr: "Ajoutez une 2e plongée sur un autre site pour ฿1,000",
    },
    heroImage: "/blog/scuba-diver-coral-reef-koh-tao.webp",
    tagline: {
      en: "Your first dive, with no experience at all. Small groups, with your instructor by your side the whole way.",
      he: "הצלילה הראשונה שלכם, בלי שום ניסיון. קבוצות קטנות, והמדריך לצידכם כל הדרך.",
      es: "Tu primera inmersión, sin ninguna experiencia. Grupos pequeños, con tu instructor a tu lado todo el tiempo.",
      fr: "Votre première plongée, sans aucune expérience. Petits groupes, avec votre instructeur à vos côtés tout du long.",
    },
    facts: {
      en: [["1 day", "10:30 - 16:00"], ["12 m", "Max depth"], ["1 dive", "+1 optional"], ["Small groups", "Instructor"]],
      he: [["יום אחד", "10:30 - 16:00"], ["12 מ'", "עומק מקסימלי"], ["צלילה 1", "+1 אופציונלית"], ["קבוצות קטנות", "מדריך"]],
      es: [["1 día", "10:30 - 16:00"], ["12 m", "Profundidad máx."], ["1 inmersión", "+1 opcional"], ["Grupos pequeños", "Instructor"]],
      fr: [["1 jour", "10:30 - 16:00"], ["12 m", "Profondeur max"], ["1 plongée", "+1 en option"], ["Petits groupes", "Instructeur"]],
    },
    faq: {
      en: [
        { q: "Do I need any experience?", a: "No. Your instructor teaches you four basic skills in shallow water first, and stays by your side the whole dive." },
        { q: "What do I pay now?", a: "A ฿1,000 deposit online, deducted on the day. The rest at the club." },
        { q: "Loved it - what next?", a: "The PADI Open Water course: 2.5 days, four ocean dives and a certification for life." },
      ],
      he: [
        { q: "צריך ניסיון קודם?", a: "לא. המדריך מלמד ארבעה תרגילים בסיסיים במים רדודים, ונשאר לצידכם כל הצלילה." },
        { q: "כמה משלמים עכשיו?", a: "מקדמה של 1,000 באט אונליין, שמתקזזת ביום הצלילה. את השאר משלמים במועדון." },
        { q: "אהבתי - מה הלאה?", a: "קורס PADI Open Water (כוכב ראשון): 2.5 ימים, ארבע צלילות בים והסמכה לכל החיים." },
      ],
      es: [
        { q: "¿Necesito experiencia?", a: "No. Tu instructor te enseña cuatro habilidades básicas en aguas poco profundas y está a tu lado toda la inmersión." },
        { q: "¿Cuánto pago ahora?", a: "Un depósito de ฿1,000 online, que se descuenta el día. El resto en el club." },
        { q: "Me encantó, ¿y ahora?", a: "El curso PADI Open Water: 2,5 días, cuatro inmersiones en el mar y una certificación de por vida." },
      ],
      fr: [
        { q: "Faut-il de l'expérience ?", a: "Non. Votre instructeur vous apprend d'abord quatre exercices simples en eau peu profonde, et reste à vos côtés toute la plongée." },
        { q: "Combien je paie maintenant ?", a: "Un acompte de ฿1,000 en ligne, déduit le jour même. Le reste au club." },
        { q: "J'ai adoré, et après ?", a: "Le cours PADI Open Water : 2,5 jours, quatre plongées en mer et une certification à vie." },
      ],
    },
    next: {
      href: "/discover-scuba-vs-open-water",
      title: {
        en: "Try dive or Open Water?",
        he: "צלילת ניסיון או כוכב ראשון?",
        es: "¿Bautismo u Open Water?",
        fr: "Baptême ou Open Water ?",
      },
      body: {
        en: "See the two side by side: depth, time, price and what each one gives you.",
        he: "השוואה אחד ליד השני: עומק, זמן, מחיר ומה כל אחד נותן לכם.",
        es: "Compáralos lado a lado: profundidad, tiempo, precio y lo que te da cada uno.",
        fr: "Comparez-les côte à côte : profondeur, durée, prix et ce que chacun vous apporte.",
      },
      cta: { en: "Compare", he: "להשוואה", es: "Comparar", fr: "Comparer" },
    },
  },

  "scuba-review": {
    slug: "scuba-review",
    dialogKey: "Scuba Review",
    product: "SR",
    priceThb: 2500,
    depositThb: 1000,
    balanceThb: 1500,
    heroImage: "/blog/bannerfish-coral-reef-koh-tao.webp",
    tagline: {
      en: "Haven't dived in a while? Get your confidence back in one day, with an instructor by your side.",
      he: "לא צללתם זמן מה? מחזירים את הביטחון ביום אחד, עם מדריך לצידכם.",
      es: "¿Hace tiempo que no buceas? Recupera la confianza en un día, con un instructor a tu lado.",
      fr: "Pas plongé depuis un moment ? Retrouvez confiance en une journée, avec un instructeur à vos côtés.",
    },
    facts: {
      en: [["1 day", "10:30 - 16:00"], ["2 dives", "In the ocean"], ["Instructor", "By your side"], ["All gear", "Included"]],
      he: [["יום אחד", "10:30 - 16:00"], ["2 צלילות", "בים"], ["מדריך", "לצידכם"], ["כל הציוד", "כלול"]],
      es: [["1 día", "10:30 - 16:00"], ["2 inmersiones", "En el mar"], ["Instructor", "A tu lado"], ["Todo el equipo", "Incluido"]],
      fr: [["1 jour", "10:30 - 16:00"], ["2 plongées", "En mer"], ["Instructeur", "À vos côtés"], ["Tout l'équipement", "Inclus"]],
    },
    faq: {
      en: [
        { q: "Who is it for?", a: "Any certified diver who hasn't dived in over 6 months, or anyone who wants to feel sure again before fun dives or Advanced." },
        { q: "What do I pay now?", a: "A ฿1,000 deposit online. The rest at the club." },
        { q: "And after it?", a: "Join our fun dives - two dives for ฿2,000, every morning and afternoon." },
      ],
      he: [
        { q: "למי זה מתאים?", a: "לכל צולל מוסמך שלא צלל יותר מחצי שנה, או למי שרוצה להרגיש בטוח שוב לפני צלילות כיף או כוכב שני." },
        { q: "כמה משלמים עכשיו?", a: "מקדמה של 1,000 באט אונליין. את השאר משלמים במועדון." },
        { q: "ואחרי זה?", a: "מצטרפים לצלילות הכיף שלנו - שתי צלילות ב-2,000 באט, כל בוקר וכל צהריים." },
      ],
      es: [
        { q: "¿Para quién es?", a: "Para cualquier buceador certificado que lleve más de 6 meses sin bucear, o que quiera sentirse seguro antes de los fun dives o del Advanced." },
        { q: "¿Cuánto pago ahora?", a: "Un depósito de ฿1,000 online. El resto en el club." },
        { q: "¿Y después?", a: "Únete a nuestros fun dives: dos inmersiones por ฿2,000, cada mañana y cada tarde." },
      ],
      fr: [
        { q: "Pour qui ?", a: "Pour tout plongeur certifié qui n'a pas plongé depuis plus de 6 mois, ou qui veut se sentir à l'aise avant les plongées fun ou l'Advanced." },
        { q: "Combien je paie maintenant ?", a: "Un acompte de ฿1,000 en ligne. Le reste au club." },
        { q: "Et ensuite ?", a: "Rejoignez nos plongées fun : deux plongées pour ฿2,000, chaque matin et chaque après-midi." },
      ],
    },
    next: {
      href: "/fun-dives",
      title: { en: "Fun dives", he: "צלילות כיף", es: "Fun dives", fr: "Plongées fun" },
      body: {
        en: "Two guided boat dives for ฿2,000, morning or afternoon, every day.",
        he: "שתי צלילות מודרכות מהסירה ב-2,000 באט, בוקר או צהריים, כל יום.",
        es: "Dos inmersiones guiadas en barco por ฿2,000, mañana o tarde, todos los días.",
        fr: "Deux plongées guidées en bateau pour ฿2,000, matin ou après-midi, tous les jours.",
      },
      cta: { en: "See fun dives", he: "לצלילות הכיף", es: "Ver fun dives", fr: "Voir les plongées" },
    },
  },
};

// hasOwnProperty, not `in`: "constructor" or "toString" are valid URL slugs and
// would otherwise match Object.prototype (a trap this repo has hit before).
export const isCoursePageSlug = (slug: string): slug is CoursePageSlug =>
  Object.prototype.hasOwnProperty.call(COURSE_PAGES, slug);
