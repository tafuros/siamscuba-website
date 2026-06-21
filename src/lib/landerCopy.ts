// Paid-campaign landing-page copy. One dict per (offer, language).
// EN is the master draft; ES + HE are first-cut translations and flagged
// for native review before launch (see Phase 0 in the plan).
//
// Strings are intentionally inlined here (not in src/i18n/translations.ts)
// because campaign landers must render the AD's language regardless of any
// returning-visitor preference stored in localStorage.

// Sail Rock feature-card photos that live under src/assets (Vite hashes these).
// The other two card photos live in /public/dive-sites and are referenced by
// absolute path below.
import sailRockChimney from "@/assets/sail-rock-chimney.webp";
import siamBoat from "@/assets/siam-boat.webp";

export type Offer = "dsd" | "owd" | "aow" | "fun-dive" | "koh-tao" | "sail-rock";
export type Lang = "en" | "es" | "he";

export interface FaqItem {
  q: string;
  a: string;
}

export interface ScheduleStep {
  time: string;
  label: string;
}

export interface DiveSite {
  name: string;
  blurb: string;
}

export interface PricingDetail {
  price: string;
  perWhat: string;
  includes: string[];
  excludes: string[];
}

/**
 * Photo-fade feature card (Sail Rock lander). The image is masked 100%->0%
 * opacity downward over a dark scrim; title + body sit at the bottom in white.
 * `image` is an absolute /public path OR an imported asset URL.
 */
export interface FeatureCard {
  image: string;
  title: string;
  body: string;
}

export interface UspTile {
  icon: "shield" | "users" | "boat" | "calendar" | "award" | "heart";
  // When set, the tile renders this brand badge image instead of the lucide icon.
  badge?: "padi5star";
  // When set, the tile renders this colorful emoji instead of the monochrome
  // lucide icon (used by the koh-tao conquest lander). `badge` still wins.
  emoji?: string;
  title: string;
  body: string;
}

export interface LanderCopy {
  seoTitle: string;
  seoDescription: string;
  /**
   * Optional hero background image (absolute path under /public). When set, the
   * lander renders it behind the hero gradient instead of the plain gradient.
   * Used by the koh-tao conquest lander; existing landers leave it unset.
   */
  heroImage?: string;
  heroBadge: string;
  heroH1: string;
  heroSubhead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  uspHeadline: string;
  uspTiles: UspTile[];
  pricingHeadline: string;
  pricing: PricingDetail;
  socialProofHeadline: string;
  socialProofSubhead: string;
  whatYouDoHeadline: string;
  whatYouDoSubhead: string;
  schedule?: ScheduleStep[];
  diveSites?: DiveSite[];
  ctaStripHeadline: string;
  ctaStripSubhead: string;
  faqHeadline: string;
  faqItems: FaqItem[];
  closingCtaHeadline: string;
  closingCtaSubhead: string;

  // ── Sail Rock lander extras (optional; only the dedicated SailRockLander
  //    component reads these — the shared CampaignLander ignores them). ──
  /** Pill/eyebrow above the hero H1 (e.g. "The Best Dive in the Gulf"). */
  heroEyebrow?: string;
  /** Star-rating line, e.g. social-proof under the hero. */
  ratingsLine?: string;
  /** Photo-fade "why it's unmissable" feature cards. */
  featureCards?: FeatureCard[];
  /** Label above the upcoming-departures strip. */
  departuresLabel?: string;
  /** "NEXT BOAT" pill text on the next departure. */
  nextBoatLabel?: string;
  /** Reserve CTA on the departures strip. */
  reserveCta?: string;
  /** "Next boat: {date}" prefix under the hero CTA. */
  nextBoatPrefix?: string;
  /** "Secure your spot for {date}" prefix under the pricing CTA. */
  securePrefix?: string;
  /** Optional add-on line under the price (e.g. "+ ฿500 photo package"). */
  pricingAddon?: string;
  /** Day-on-the-boat timeline (Sail Rock). */
  dayTimelineHeadline?: string;
  dayTimeline?: ScheduleStep[];
  /** Closing-section headline templated with the next boat date. */
  closingDateHeadline?: string;
}

// ---------- DSD (Discover Scuba Diving) ----------

const DSD_EN: LanderCopy = {
  seoTitle: "Discover Scuba Diving in Koh Tao - Two Dives 3,600 THB | Siam Scuba",
  seoDescription:
    "Try scuba diving in Koh Tao - 2 dives 3,600 THB, all gear and PADI instructor included. Or 1 dive 2,600 THB. Small groups, two custom boats, no certification needed.",
  heroBadge: "PADI Discover Scuba Diving",
  heroH1: "Try scuba diving in Koh Tao - 2 dives, 3,600 THB",
  heroSubhead:
    "No certification needed. A PADI instructor takes you from your first breath underwater to two real ocean dives on Koh Tao's reefs - all in one day. Want just one dive? 2,600 THB.",
  ctaPrimary: "Book your Discover Scuba day",
  ctaSecondary: "Or chat on WhatsApp",
  uspHeadline: "Why try diving with Siam Scuba",
  uspTiles: [
    {
      icon: "users",
      title: "Max 2 students per instructor",
      body: "Real attention, real safety. Not a 12-person cattle dive.",
    },
    {
      icon: "boat",
      title: "Two custom dive boats",
      body: "We don't share boats with other shops, so the schedule actually runs on time.",
    },
    {
      icon: "shield",
      badge: "padi5star",
      title: "PADI 5-Star Center",
      body: "Same standards as the biggest shops on the island, with a fraction of the people.",
    },
  ],
  pricingHeadline: "What's included",
  pricing: {
    price: "2,600 / 3,600 THB",
    perWhat: "1 dive / 2 dives, all in",
    includes: [
      "Full day with a PADI instructor (English, Spanish, Hebrew spoken)",
      "All scuba gear (mask, fins, wetsuit, BCD, weights, regulator, 12L tank)",
      "Confined-water training session",
      "1 or 2 ocean dives on the reef (your choice)",
      "Boat snacks: fresh fruit, cookies, tea, coffee, water",
      "Dive insurance",
      "PADI Discover Scuba Diving certificate",
    ],
    excludes: [
      "Hotel pickup",
      "Accommodation (add 500 THB / night)",
      "Photos & video (add 1,300-2,000 THB)",
    ],
  },
  socialProofHeadline: "778 reviews. 5.0 stars on TripAdvisor.",
  socialProofSubhead: "What divers say after their first day under the surface with us.",
  whatYouDoHeadline: "Your day, hour by hour",
  whatYouDoSubhead:
    "We keep groups small so the schedule actually runs on time. You're back at the shop by late afternoon, in time for sunset on the beach.",
  schedule: [
    { time: "Day before", label: "Register at the shop by 18:00" },
    { time: "10:30", label: "Briefing, gear intro, expectations and safety" },
    { time: "Dive 1", label: "4 basic skills in shallow water, then descend to max 12m" },
    { time: "Dive 2", label: "Just enjoy - no skills, max 12m" },
    { time: "16:00", label: "Activity ends" },
  ],
  ctaStripHeadline: "Ready to take the first breath?",
  ctaStripSubhead: "Tell us your dates on WhatsApp - usually we reply within minutes.",
  faqHeadline: "Frequently asked",
  faqItems: [
    {
      q: "Do I need to know how to swim?",
      a: "You should be comfortable in water and able to float on your back. Olympic swimming is not required.",
    },
    {
      q: "What's the minimum age?",
      a: "10 years old. Kids 8-9 can do the Bubble Maker program - ask us on WhatsApp.",
    },
    {
      q: "What if I have asthma / heart condition / pregnancy?",
      a: "We need a doctor's clearance for some conditions. Send us your situation on WhatsApp and we'll tell you what's required.",
    },
    {
      q: "How deep will I go?",
      a: "Discover Scuba Diving is limited to 12 meters. The first dive is usually shallower (5-8m).",
    },
    {
      q: "Can this count toward Open Water certification later?",
      a: "Yes - your DSD dives count toward your first confined-water dive if you continue with us within 6 months.",
    },
  ],
  closingCtaHeadline: "Two dives, one day, 3,600 THB.",
  closingCtaSubhead: "Or one dive for 2,600 THB. WhatsApp us - we'll find you a slot this week.",
};

const DSD_ES: LanderCopy = {
  seoTitle: "Discover Scuba Diving en Koh Tao - Dos Inmersiones 3,600 THB | Siam Scuba",
  seoDescription:
    "Prueba el buceo en Koh Tao - 2 inmersiones 3,600 THB, equipo e instructor PADI incluidos. O 1 inmersión 2,600 THB. Grupos pequeños, dos barcos propios, sin certificación previa.",
  heroBadge: "PADI Discover Scuba Diving",
  heroH1: "Prueba el buceo en Koh Tao - 2 inmersiones, 3,600 THB",
  heroSubhead:
    "Sin certificación previa. Un instructor PADI te lleva desde tu primera respiración bajo el agua hasta dos inmersiones reales en los arrecifes de Koh Tao, todo en un día. ¿Solo una inmersión? 2,600 THB.",
  ctaPrimary: "Reserva tu día de buceo",
  ctaSecondary: "O chatea por WhatsApp",
  uspHeadline: "Por qué bucear con Siam Scuba",
  uspTiles: [
    {
      icon: "users",
      title: "Máximo 2 alumnos por instructor",
      body: "Atención real, seguridad real. No una inmersión masiva de 12 personas.",
    },
    {
      icon: "boat",
      title: "Dos barcos de buceo propios",
      body: "No compartimos barco con otras tiendas, así que el horario se cumple.",
    },
    {
      icon: "shield",
      badge: "padi5star",
      title: "Centro PADI 5 estrellas",
      body: "Los mismos estándares que las grandes tiendas, con mucha menos gente.",
    },
  ],
  pricingHeadline: "Qué incluye",
  pricing: {
    price: "2,600 / 3,600 THB",
    perWhat: "1 inmersión / 2 inmersiones, todo incluido",
    includes: [
      "Día completo con instructor PADI (hablamos español)",
      "Equipo completo (máscara, aletas, traje, chaleco, plomos, regulador, botella de 12 L)",
      "Sesión en aguas confinadas",
      "1 o 2 inmersiones en el arrecife (tú eliges)",
      "Tentempiés en el barco: fruta fresca, galletas, té, café y agua",
      "Seguro de buceo",
      "Certificado PADI Discover Scuba Diving",
    ],
    excludes: [
      "Recogida en hotel",
      "Alojamiento (+500 THB/noche)",
      "Fotos y vídeo (+1.300-2.000 THB)",
    ],
  },
  socialProofHeadline: "778 reseñas. 5,0 estrellas en TripAdvisor.",
  socialProofSubhead: "Lo que dicen los buceadores después de su primer día bajo el agua con nosotros.",
  whatYouDoHeadline: "Tu día, hora por hora",
  whatYouDoSubhead:
    "Mantenemos grupos pequeños para cumplir el horario. Estarás de vuelta a media tarde, a tiempo para el atardecer.",
  schedule: [
    { time: "Día antes", label: "Regístrate en la tienda antes de las 18:00" },
    { time: "10:30", label: "Briefing, presentación del equipo, expectativas y seguridad" },
    { time: "Inmersión 1", label: "4 habilidades básicas en aguas poco profundas, luego hasta 12m" },
    { time: "Inmersión 2", label: "Solo disfrutar - sin habilidades, hasta 12m" },
    { time: "16:00", label: "Fin de la actividad" },
  ],
  ctaStripHeadline: "¿Listo para la primera respiración?",
  ctaStripSubhead: "Cuéntanos tus fechas por WhatsApp - solemos responder en minutos.",
  faqHeadline: "Preguntas frecuentes",
  faqItems: [
    {
      q: "¿Necesito saber nadar?",
      a: "Debes sentirte cómodo en el agua y poder flotar boca arriba. No hace falta nadar como un olímpico.",
    },
    {
      q: "¿Cuál es la edad mínima?",
      a: "10 años. Niños de 8-9 pueden hacer el programa Bubble Maker - pregúntanos por WhatsApp.",
    },
    {
      q: "¿Y si tengo asma / problemas cardíacos / embarazo?",
      a: "Algunas condiciones requieren autorización médica. Cuéntanos tu caso por WhatsApp y te diremos qué necesitas.",
    },
    {
      q: "¿A qué profundidad bajaré?",
      a: "El Discover Scuba Diving está limitado a 12 metros. La primera inmersión suele ser más superficial (5-8m).",
    },
    {
      q: "¿Cuenta para la certificación Open Water más adelante?",
      a: "Sí - tus inmersiones de DSD cuentan como tu primera inmersión confinada si continúas con nosotros en 6 meses.",
    },
  ],
  closingCtaHeadline: "Dos inmersiones, un día, 3,600 THB.",
  closingCtaSubhead: "O una inmersión por 2,600 THB. Escríbenos por WhatsApp - te buscamos hueco esta semana.",
};

const DSD_HE: LanderCopy = {
  seoTitle: "צלילת היכרות בקוטאו - שתי צלילות ב-3,600 THB | סיאם סקובה",
  seoDescription:
    "תנסו צלילה בקוטאו - 2 צלילות ב-3,600 THB, כל הציוד ומדריך PADI כלולים. או צלילה אחת ב-2,600 THB. קבוצות קטנות, שתי סירות פרטיות, ללא הסמכה קודמת.",
  heroBadge: "PADI Discover Scuba Diving",
  heroH1: "צלילת היכרות בקוטאו - שתי צלילות, 3,600 THB",
  heroSubhead:
    "ללא הסמכה קודמת. מדריך PADI לוקח אתכם מהנשימה הראשונה מתחת למים עד שתי צלילות אמיתיות בשונית של קוטאו - הכל ביום אחד. רוצים רק צלילה אחת? 2,600 THB.",
  ctaPrimary: "הזמינו צלילת היכרות",
  ctaSecondary: "או דברו איתנו ב-WhatsApp",
  uspHeadline: "למה לצלול איתנו",
  uspTiles: [
    {
      icon: "users",
      title: "מקסימום 2 חניכים לכל מדריך",
      body: "תשומת לב אמיתית. לא צלילה המונית של 12 אנשים.",
    },
    {
      icon: "boat",
      title: "שתי סירות צלילה פרטיות",
      body: "אנחנו לא חולקים סירה עם חנויות אחרות, אז הלו״ז באמת עומד בזמנים.",
    },
    {
      icon: "shield",
      badge: "padi5star",
      title: "מרכז PADI 5 כוכבים",
      body: "אותם סטנדרטים של החנויות הגדולות, עם הרבה פחות אנשים.",
    },
  ],
  pricingHeadline: "מה כלול",
  pricing: {
    price: "2,600 / 3,600 THB",
    perWhat: "צלילה אחת / שתי צלילות, הכל כלול",
    includes: [
      "יום שלם עם מדריך PADI דובר עברית",
      "כל ציוד הצלילה (מסכה, סנפירים, חליפה, מאזן ציפה, משקולות, רגולטור, מיכל אוויר 12 ליטר)",
      "תרגול מיומנויות במים רדודים",
      "1 או 2 צלילות בשונית (לבחירתכם)",
      "נשנושים בסירה: פירות טריים, עוגיות, תה, קפה ומים",
      "ביטוח צלילה",
      "תעודת PADI Discover Scuba Diving",
    ],
    excludes: [
      "איסוף מהמלון",
      "לינה (תוספת 500 THB ללילה)",
      "צילום ותמונות (תוספת 1,300-2,000 THB)",
    ],
  },
  socialProofHeadline: "778 ביקורות. 5.0 כוכבים ב-TripAdvisor.",
  socialProofSubhead: "מה שצוללים מספרים אחרי היום הראשון שלהם מתחת למים.",
  whatYouDoHeadline: "היום שלכם, שעה אחר שעה",
  whatYouDoSubhead:
    "אנחנו שומרים על קבוצות קטנות כדי שהכל ירוץ בזמן. אתם חוזרים אחרי הצהריים, בזמן לשקיעה על החוף.",
  schedule: [
    { time: "יום לפני", label: "רישום במועדון עד 18:00" },
    { time: "10:30", label: "תדריך, היכרות עם הציוד, תיאום ציפיות ובטיחות" },
    { time: "צלילה 1", label: "4 תרגילים בסיסיים במים רדודים, ואז צלילה לעומק עד 12 מ׳" },
    { time: "צלילה 2", label: "פשוט נהנים - בלי תרגילים, עומק עד 12 מ׳" },
    { time: "16:00", label: "סיום הפעילות" },
  ],
  ctaStripHeadline: "מוכנים לנשימה הראשונה?",
  ctaStripSubhead: "כתבו לנו ב-WhatsApp את התאריכים - בדרך כלל אנחנו עונים תוך דקות.",
  faqHeadline: "שאלות נפוצות",
  faqItems: [
    {
      q: "צריך לדעת לשחות?",
      a: "אתם צריכים להרגיש בנוח במים ולהיות מסוגלים לצוף על הגב. לא צריך לשחות כמו אלוף אולימפי.",
    },
    {
      q: "מה גיל המינימום?",
      a: "גיל 10. ילדים בני 8-9 יכולים לעשות את תוכנית Bubble Maker - שאלו אותנו ב-WhatsApp.",
    },
    {
      q: "מה אם יש לי אסטמה / מחלת לב / הריון?",
      a: "חלק מהמצבים דורשים אישור רופא. ספרו לנו את המצב ב-WhatsApp ונעדכן אתכם מה נדרש.",
    },
    {
      q: "לאיזה עומק נצלול?",
      a: "צלילת היכרות מוגבלת ל-12 מטרים. הצלילה הראשונה בדרך כלל רדודה יותר (5-8 מטרים).",
    },
    {
      q: "זה ייחשב להסמכת Open Water בהמשך?",
      a: "כן - צלילות ההיכרות נחשבות לצלילת התרגול הראשונה אם תמשיכו איתנו תוך 6 חודשים.",
    },
  ],
  closingCtaHeadline: "שתי צלילות, יום אחד, 3,600 THB.",
  closingCtaSubhead: "או צלילה אחת ב-2,600 THB. כתבו לנו ב-WhatsApp - נמצא לכם משבצת השבוע.",
};

// ---------- OWD (PADI Open Water Diver) ----------

const OWD_EN: LanderCopy = {
  seoTitle: "PADI Open Water Course in Koh Tao - 12,000 THB Lifelong Cert | Siam Scuba",
  seoDescription:
    "Get PADI certified in 2.5 days on Koh Tao. Small groups (max 4), classroom + pool + four ocean dives, 2 nights' accommodation included. Lifelong certification.",
  heroBadge: "PADI Open Water Diver",
  heroH1: "Get PADI certified in Koh Tao - 2.5 days, 12,000 THB, lifelong",
  heroSubhead:
    "Theory online and in our classroom, pool practice, then four real ocean dives - all in 2.5 days. You leave with a PADI card you can dive on anywhere in the world, forever.",
  ctaPrimary: "Chat on WhatsApp",
  ctaSecondary: "Ask about dates and discounts",
  uspHeadline: "Why certify with Siam Scuba",
  uspTiles: [
    {
      icon: "users",
      title: "Max 4 students per instructor",
      body: "More water time, more skills practice, less waiting around.",
    },
    {
      icon: "calendar",
      title: "Flexible start, any day",
      body: "We start new courses every day, so you don't have to plan your trip around our schedule.",
    },
    {
      icon: "award",
      title: "Lifelong PADI certification",
      body: "Recognized at every dive shop on Earth. Yours forever, no renewals.",
    },
  ],
  pricingHeadline: "What's included",
  pricing: {
    price: "12,000 THB",
    perWhat: "per person, all in",
    includes: [
      "PADI eLearning + classroom theory at our club",
      "English-speaking PADI instructor for every session",
      "All gear, all dives, all materials",
      "Pool / confined-water session",
      "4 open-water dives at Koh Tao's best sites",
      "Dive insurance",
      "Boat refreshments: fruit, cookies, tea, coffee, water",
      "2 nights' accommodation - free",
      "PADI certification fee",
    ],
    excludes: [
      "Meals",
      "Hotel / dive-center transfer",
      "Underwater photos & video (add-on)",
      "Private instructor (add-on)",
    ],
  },
  socialProofHeadline: "Most-reviewed PADI shop on Koh Tao with 5.0 stars.",
  socialProofSubhead: "778 reviews and counting. Read what graduates say about their certification week.",
  whatYouDoHeadline: "Your 2.5-day path to certification",
  whatYouDoSubhead:
    "Day 1 is theory and pool. Days 2-3 are four real ocean dives, with a short final morning. Start the eLearning before you arrive and the classroom part flies by.",
  schedule: [
    { time: "Day 1", label: "09:00 theory at the club · 11:00 pool practice" },
    { time: "Day 2", label: "Theory, then boat - sea drills and a dive to 12m, second dive at 14:00, back by 16:00" },
    { time: "Day 3", label: "06:00 dawn dive to 18m · 10:00 final dive · certified by 11:00 🎉" },
  ],
  ctaStripHeadline: "Start your course this week",
  ctaStripSubhead: "Send your travel dates on WhatsApp and we'll find a start day that fits.",
  faqHeadline: "Frequently asked",
  faqItems: [
    {
      q: "Do I need to know how to swim?",
      a: "Yes - you need to be able to swim 200m unaided and float for 10 minutes. Stroke doesn't matter.",
    },
    {
      q: "Can I do the theory before I arrive?",
      a: "Yes. We combine PADI eLearning with a classroom session at our club. Start the eLearning before you land and the classroom part is quick. The full course is 2.5 days.",
    },
    {
      q: "What's the maximum depth?",
      a: "18 meters. Your final dive is usually at 17-18m on a wreck or pinnacle site.",
    },
    {
      q: "What if I fail an exam or skill?",
      a: "You repeat it. Your instructor is paid to get you through, not to fail you. Re-attempts are included.",
    },
    {
      q: "Is there an age limit?",
      a: "Minimum 10 (Junior Open Water - limited to 12m). 15+ for the full Open Water Diver cert.",
    },
    {
      q: "Can I add Advanced after?",
      a: "Yes, and we discount it heavily if you book together. Ask on WhatsApp.",
    },
  ],
  closingCtaHeadline: "PADI cert. 2.5 days. 12,000 THB.",
  closingCtaSubhead: "Two nights' accommodation included. WhatsApp us your dates - we start courses every day.",
};

const OWD_ES: LanderCopy = {
  seoTitle: "Curso PADI Open Water en Koh Tao - Certificación de por Vida 12,000 THB | Siam Scuba",
  seoDescription:
    "Sácate el PADI en 2,5 días en Koh Tao. Grupos pequeños (máx. 4), teoría + piscina + cuatro inmersiones, 2 noches de alojamiento incluidas. Certificación de por vida.",
  heroBadge: "PADI Open Water Diver",
  heroH1: "Certifícate PADI en Koh Tao - 2,5 días, 12,000 THB, de por vida",
  heroSubhead:
    "Teoría online y en nuestra aula, prácticas en piscina y cuatro inmersiones reales en el mar - todo en 2,5 días. Te vas con una tarjeta PADI válida en cualquier centro del mundo, para siempre.",
  ctaPrimary: "Chatea por WhatsApp",
  ctaSecondary: "Pregunta por fechas y descuentos",
  uspHeadline: "Por qué certificarte con Siam Scuba",
  uspTiles: [
    {
      icon: "users",
      title: "Máximo 4 alumnos por instructor",
      body: "Más tiempo bajo el agua, más práctica, menos esperas.",
    },
    {
      icon: "calendar",
      title: "Empieza cualquier día",
      body: "Abrimos cursos nuevos a diario, no tienes que planear tu viaje alrededor de nosotros.",
    },
    {
      icon: "award",
      title: "Certificación PADI de por vida",
      body: "Reconocida en todos los centros del mundo. Tuya para siempre, sin renovaciones.",
    },
  ],
  pricingHeadline: "Qué incluye",
  pricing: {
    price: "12,000 THB",
    perWhat: "por persona, todo incluido",
    includes: [
      "Teoría online + clase en nuestro club",
      "Instructor PADI de habla inglesa en cada sesión",
      "Equipo profesional, inmersiones y material completo",
      "Sesión en piscina / aguas confinadas",
      "4 inmersiones en los mejores sitios de Koh Tao",
      "Seguro de buceo",
      "Tentempiés en el barco: fruta, galletas, té, café y agua",
      "2 noches de alojamiento - gratis",
      "Tasa de certificación PADI",
    ],
    excludes: [
      "Comidas",
      "Traslado al centro de buceo",
      "Fotos / vídeo submarino (extra)",
      "Instructor privado (extra)",
    ],
  },
  socialProofHeadline: "El centro PADI con más reseñas en Koh Tao y 5,0 estrellas.",
  socialProofSubhead: "778 reseñas y subiendo. Lee lo que dicen los graduados de su semana de certificación.",
  whatYouDoHeadline: "Tu camino a la certificación en 2,5 días",
  whatYouDoSubhead:
    "Día 1 teoría y piscina. Días 2-3 cuatro inmersiones reales, con una última mañana corta. Empieza el eLearning antes de llegar y la parte teórica será pan comido.",
  schedule: [
    { time: "Día 1", label: "09:00 teoría en el club · 11:00 prácticas en piscina" },
    { time: "Día 2", label: "Teoría y barco - prácticas en el mar e inmersión a 12m, segunda inmersión a las 14:00, vuelta a las 16:00" },
    { time: "Día 3", label: "06:00 inmersión al amanecer a 18m · 10:00 última inmersión · certificado a las 11:00 🎉" },
  ],
  ctaStripHeadline: "Empieza tu curso esta semana",
  ctaStripSubhead: "Envía tus fechas por WhatsApp y te buscamos un día de inicio que encaje.",
  faqHeadline: "Preguntas frecuentes",
  faqItems: [
    {
      q: "¿Necesito saber nadar?",
      a: "Sí - debes nadar 200m sin ayuda y flotar 10 minutos. El estilo no importa.",
    },
    {
      q: "¿Puedo hacer la teoría antes de llegar?",
      a: "Sí. Combinamos el eLearning de PADI con una clase en el club. Si empiezas el eLearning antes de llegar, la parte teórica será rápida. El curso completo dura 2,5 días.",
    },
    {
      q: "¿Cuál es la profundidad máxima?",
      a: "18 metros. La última inmersión suele ser a 17-18m en un pecio o pináculo.",
    },
    {
      q: "¿Y si suspendo un examen o una habilidad?",
      a: "Lo repites. Tu instructor está para sacarte el curso, no para suspenderte. Los re-intentos están incluidos.",
    },
    {
      q: "¿Hay edad mínima?",
      a: "10 años para el Junior Open Water (máx. 12m). 15+ para el Open Water Diver completo.",
    },
    {
      q: "¿Puedo añadir el Advanced después?",
      a: "Sí, y con descuento importante si lo reservas junto. Pregúntanos por WhatsApp.",
    },
  ],
  closingCtaHeadline: "Cert PADI. 2,5 días. 12,000 THB.",
  closingCtaSubhead: "2 noches de alojamiento incluidas. WhatsApp con tus fechas - abrimos cursos cada día.",
};

const OWD_HE: LanderCopy = {
  seoTitle: "קורס PADI Open Water בקוטאו - הסמכה לכל החיים ב-12,000 THB | סיאם סקובה",
  seoDescription:
    "תוסמכו ל-PADI ב-2.5 ימים בקוטאו. קבוצות קטנות (מקס׳ 4), תיאוריה + בריכה + ארבע צלילות בים, 2 לילות לינה כלולים. הסמכה לכל החיים.",
  heroBadge: "PADI כוכב ראשון - Open Water Diver",
  heroH1: "כוכב ראשון ב-2.5 ימים בקו-טאו, 12,000 THB, לכל החיים",
  heroSubhead:
    "לימוד עיוני אונליין + שיעור במועדון, תרגול בבריכה, ואז ארבע צלילות אמיתיות בים - הכל ב-2.5 ימים. יוצאים עם כרטיס PADI שצוללים איתו בכל מקום בעולם, לכל החיים.",
  ctaPrimary: "שיחה ב-WhatsApp",
  ctaSecondary: "שאלו על תאריכים והנחות",
  uspHeadline: "למה להסמיך איתנו",
  uspTiles: [
    {
      icon: "users",
      title: "מקסימום 4 חניכים למדריך",
      body: "יותר זמן מתחת למים, יותר תרגול, פחות המתנה.",
    },
    {
      icon: "calendar",
      title: "מתחילים בכל יום",
      body: "אנחנו פותחים קורסים חדשים כל יום, אין צורך לתכנן טיול סביב הלו״ז שלנו.",
    },
    {
      icon: "award",
      title: "הסמכת PADI לכל החיים",
      body: "מוכרת בכל חנות צלילה בעולם. שלכם לתמיד, ללא חידושים.",
    },
  ],
  pricingHeadline: "מה כלול",
  pricing: {
    price: "12,000 THB",
    perWhat: "לאדם, הכל כלול",
    includes: [
      "לימוד עיוני אונליין + שיעור כיתה במועדון",
      "מדריכים ישראלים, דוברי עברית ואנגלית",
      "ציוד צלילה מלא ומקצועי, כל הצלילות והחומרים",
      "מפגש בריכה / מים רדודים",
      "4 צלילות באתרים הכי טובים של קוטאו",
      "ביטוח צלילה",
      "כיבוד על הסירה: פירות, עוגיות, תה, קפה ומים",
      "2 לילות במגורים שלנו - מתנה 🎁",
      "אגרת הסמכה של PADI",
    ],
    excludes: [
      "ארוחות",
      "הסעה למרכז הצלילה",
      "צילום מתחת למים (תוספת בתשלום)",
      "מדריך פרטי (תוספת בתשלום)",
    ],
  },
  socialProofHeadline: "חנות ה-PADI הכי מדורגת בקוטאו עם 5.0 כוכבים.",
  socialProofSubhead: "778 ביקורות וזה ממשיך. קראו מה בוגרים אומרים על שבוע ההסמכה שלהם.",
  whatYouDoHeadline: "הדרך שלכם להסמכה תוך 2.5 ימים",
  whatYouDoSubhead:
    "יום 1 תיאוריה ובריכה. ימים 2-3 ארבע צלילות בים, כשהבוקר האחרון קצר. שווה להתחיל את הלימוד האונליין לפני שמגיעים.",
  schedule: [
    { time: "יום 1", label: "09:00 תיאוריה במועדון · 11:00 תרגול בבריכה" },
    { time: "יום 2", label: "תיאוריה, ואז סירה - תרגול בים וצלילה עד 12 מ׳, צלילה שנייה ב-14:00, חזרה ב-16:00" },
    { time: "יום 3", label: "06:00 צלילת שחר עד 18 מ׳ · 10:00 צלילה אחרונה · מוסמכים ב-11:00 🎉" },
  ],
  ctaStripHeadline: "התחילו את הקורס השבוע",
  ctaStripSubhead: "שלחו תאריכי טיול ב-WhatsApp ונמצא יום פתיחה שמתאים.",
  faqHeadline: "שאלות נפוצות",
  faqItems: [
    {
      q: "צריך לדעת לשחות?",
      a: "כן - צריך לשחות 200 מטר ללא עזרה ולצוף 10 דקות. הסגנון לא משנה.",
    },
    {
      q: "אפשר לעשות את התיאוריה לפני שמגיעים?",
      a: "כן. אנחנו משלבים לימוד אונליין (eLearning) עם שיעור כיתה במועדון. אם תתחילו את ה-eLearning לפני ההגעה, חלק הכיתה יהיה קליל. הקורס כולו 2.5 ימים.",
    },
    {
      q: "מה העומק המקסימלי?",
      a: "18 מטרים. הצלילה האחרונה בדרך כלל ב-17-18 מטר על אתר עמוק או טבעת.",
    },
    {
      q: "מה אם נכשלים במבחן או במיומנות?",
      a: "חוזרים. המדריך כאן כדי להעביר אתכם, לא להכשיל. ניסיונות חוזרים כלולים.",
    },
    {
      q: "יש גיל מינימום?",
      a: "10 שנים ל-Junior Open Water (מקס׳ 12 מטר). 15+ לקורס המלא.",
    },
    {
      q: "אפשר להוסיף Advanced אחרי?",
      a: "כן, ובהנחה משמעותית אם מזמינים יחד. שאלו ב-WhatsApp.",
    },
  ],
  closingCtaHeadline: "הסמכת PADI. 2.5 ימים. 12,000 THB.",
  closingCtaSubhead: "2 לילות לינה כלולים. WhatsApp עם התאריכים - פותחים קורסים כל יום.",
};

// ---------- AOW (PADI Advanced Open Water Diver) ----------

const AOW_EN: LanderCopy = {
  seoTitle: "PADI Advanced Open Water Course in Koh Tao - 1.5 Days, 11,000 THB | Siam Scuba",
  seoDescription:
    "Level up with the PADI Advanced Open Water course on Koh Tao. 1.5 days, 5 adventure dives to 30m incl. deep, wreck, night and navigation. Small groups (max 4), 1 night accommodation included. 4.9 on Google (845), 5.0 on TripAdvisor (776).",
  heroBadge: "PADI Advanced Open Water Diver",
  heroH1: "Go Advanced in Koh Tao - 1.5 days, 5 dives, 11,000 THB",
  heroSubhead:
    "Already Open Water certified? Push to 30m with five adventure dives - deep, wreck, night, navigation and buoyancy. No exams, no theory, just diving. One night's accommodation included.",
  ctaPrimary: "Chat on WhatsApp",
  ctaSecondary: "Ask about dates and combos",
  uspHeadline: "Why go Advanced with Siam Scuba",
  uspTiles: [
    {
      icon: "users",
      title: "Max 4 students per instructor",
      body: "More water time, real coaching on your buoyancy and air, less waiting around.",
    },
    {
      icon: "boat",
      title: "Private boat + new gear",
      body: "We don't share boats with other shops, so the deep and night dives run on schedule with kit you can trust.",
    },
    {
      icon: "award",
      title: "Lifelong PADI certification",
      body: "Recognized at every dive shop on Earth. Yours forever, no renewals.",
    },
  ],
  pricingHeadline: "What's included",
  pricing: {
    price: "11,000 THB",
    perWhat: "per person, all in",
    includes: [
      "5 adventure dives: deep (30m), wreck, night, navigation, buoyancy/photo",
      "English, Spanish and Hebrew-speaking PADI instructors",
      "All gear, all dives, all materials",
      "1 night's accommodation at our club - free",
      "Dive insurance",
      "Boat snacks: pineapple, cookies, tea, coffee, water",
      "Club dive T-shirt",
      "International PADI Advanced certification",
    ],
    excludes: [
      "Meals",
      "Hotel / dive-center transfer",
      "Underwater photos & video (add-on)",
      "Private instructor (add-on)",
    ],
  },
  socialProofHeadline: "4.9 on Google (845) · 5.0 on TripAdvisor (776).",
  socialProofSubhead: "Read what divers say after going Advanced the Siam Scuba way.",
  whatYouDoHeadline: "Your 1.5-day path to Advanced",
  whatYouDoSubhead:
    "It's 100% practical - no exams, no classroom theory. Five dives across a day and a half, including a 30m deep dive and a night dive on the reef.",
  schedule: [
    { time: "Day 1", label: "10:00 meet at the club · 11:00 buoyancy dive · 14:00 navigation dive · 17:30 night dive" },
    { time: "Day 2", label: "06:00 early boat for deep dive (30m) + wreck dive · 10:00 final dive" },
    { time: "Day 2", label: "11:30 back to the club - certified & celebrating 🎉" },
  ],
  ctaStripHeadline: "Start your Advanced this week",
  ctaStripSubhead: "Send your travel dates on WhatsApp and we'll find a start day that fits.",
  faqHeadline: "Frequently asked",
  faqItems: [
    {
      q: "What do I need to start?",
      a: "An Open Water certification (PADI or equivalent). That's it - Advanced is the natural next step.",
    },
    {
      q: "Is there an exam or theory?",
      a: "No exams and no classroom theory. There's short knowledge reading per adventure dive, but the course is 100% in-water.",
    },
    {
      q: "What's the maximum depth?",
      a: "30 meters - that's the deep adventure dive. It's one of the highlights of the course.",
    },
    {
      q: "Do I have to pay a deposit to book?",
      a: "Yes - a 3,000 THB deposit secures your spot, and the balance is paid here on the island. Message us on WhatsApp and we'll arrange it in a minute.",
    },
    {
      q: "Can I do it straight after my Open Water?",
      a: "Yes, and that's the most popular way to do it. Book both together and we discount the combo - ask us on WhatsApp.",
    },
    {
      q: "How long does it take?",
      a: "1.5 days, five dives. You're certified by late morning on day two.",
    },
  ],
  closingCtaHeadline: "Advanced cert. 1.5 days. 11,000 THB.",
  closingCtaSubhead: "One night's accommodation included. WhatsApp us your dates - we start courses every day.",
};

const AOW_ES: LanderCopy = {
  seoTitle: "Curso PADI Advanced Open Water en Koh Tao - 1.5 Días, 11,000 THB | Siam Scuba",
  seoDescription:
    "Sube de nivel con el curso PADI Advanced Open Water en Koh Tao. 1.5 días, 5 inmersiones de aventura hasta 30m incl. profunda, pecio, nocturna y navegación. Grupos pequeños (máx. 4), 1 noche de alojamiento incluida. 4,9 en Google (845), 5,0 en TripAdvisor (776).",
  heroBadge: "PADI Advanced Open Water Diver",
  heroH1: "Sácate el Advanced en Koh Tao en Español!!! - 1.5 días, 5 inmersiones",
  heroSubhead:
    "¿Ya eres Open Water? Baja hasta 30m con cinco inmersiones de aventura - profunda, pecio, nocturna, navegación y flotabilidad. Sin exámenes, sin teoría, solo buceo. Una noche de alojamiento incluida.",
  ctaPrimary: "Chatea por WhatsApp",
  ctaSecondary: "Pregunta por fechas y combos",
  uspHeadline: "Por qué hacer el Advanced con Siam Scuba",
  uspTiles: [
    {
      icon: "users",
      title: "Máximo 4 alumnos por instructor",
      body: "Más tiempo bajo el agua, coaching real de flotabilidad y consumo de aire, menos esperas.",
    },
    {
      icon: "boat",
      title: "Barco propio + equipo nuevo",
      body: "No compartimos barco con otras tiendas, así que las inmersiones profunda y nocturna salen a tiempo y con equipo de confianza.",
    },
    {
      icon: "award",
      title: "Certificación PADI de por vida",
      body: "Reconocida en todos los centros del mundo. Tuya para siempre, sin renovaciones.",
    },
  ],
  pricingHeadline: "Qué incluye",
  pricing: {
    price: "11,000 THB",
    perWhat: "por persona, todo incluido",
    includes: [
      "5 inmersiones de aventura: profunda (30m), pecio, nocturna, navegación, flotabilidad/foto",
      "Instructores PADI que hablan inglés, español y hebreo",
      "Equipo profesional, inmersiones y material completo",
      "1 noche de alojamiento en nuestro club - gratis",
      "Seguro de buceo",
      "Tentempiés en el barco: piña, galletas, té, café y agua",
      "Camiseta de buceo del club",
      "Certificación internacional PADI Advanced",
    ],
    excludes: [
      "Comidas",
      "Traslado al centro de buceo",
      "Fotos / vídeo submarino (extra)",
      "Instructor privado (extra)",
    ],
  },
  socialProofHeadline: "4,9 en Google (845) · 5,0 en TripAdvisor (776).",
  socialProofSubhead: "Lee lo que dicen los buceadores tras hacer el Advanced al estilo Siam Scuba.",
  whatYouDoHeadline: "Tu camino al Advanced en 1.5 días",
  whatYouDoSubhead:
    "Es 100% práctico - sin exámenes ni teoría en aula. Cinco inmersiones en un día y medio, incluyendo una profunda a 30m y una nocturna en el arrecife.",
  schedule: [
    { time: "Día 1", label: "10:00 encuentro en el club · 11:00 inmersión de flotabilidad · 14:00 inmersión de navegación · 17:30 inmersión nocturna" },
    { time: "Día 2", label: "06:00 barco temprano para inmersión profunda (30m) + pecio · 10:00 última inmersión" },
    { time: "Día 2", label: "11:30 vuelta al club - certificado y celebrando 🎉" },
  ],
  ctaStripHeadline: "Empieza tu Advanced esta semana",
  ctaStripSubhead: "Envía tus fechas por WhatsApp y te buscamos un día de inicio que encaje.",
  faqHeadline: "Preguntas frecuentes",
  faqItems: [
    {
      q: "¿Qué necesito para empezar?",
      a: "Una certificación Open Water (PADI o equivalente). Nada más - el Advanced es el siguiente paso natural.",
    },
    {
      q: "¿Hay examen o teoría?",
      a: "Sin exámenes ni teoría en aula. Hay una breve lectura por inmersión de aventura, pero el curso es 100% en el agua.",
    },
    {
      q: "¿Cuál es la profundidad máxima?",
      a: "30 metros - esa es la inmersión profunda de aventura. Es uno de los momentos estrella del curso.",
    },
    {
      q: "¿Tengo que pagar un depósito para reservar?",
      a: "Sí - un depósito de 3,000 THB asegura tu plaza y el resto se paga aquí en la isla. Escríbenos por WhatsApp y lo arreglamos en un minuto.",
    },
    {
      q: "¿Puedo hacerlo justo después del Open Water?",
      a: "Sí, y es la forma más popular de hacerlo. Reserva ambos juntos y te descontamos el combo - pregúntanos por WhatsApp.",
    },
    {
      q: "¿Cuánto dura?",
      a: "1.5 días, cinco inmersiones. Estás certificado a media mañana del segundo día.",
    },
  ],
  closingCtaHeadline: "Cert Advanced. 1.5 días. 11,000 THB.",
  closingCtaSubhead: "Una noche de alojamiento incluida. WhatsApp con tus fechas - abrimos cursos cada día.",
};

const AOW_HE: LanderCopy = {
  seoTitle: "קורס PADI כוכב שני (Advanced Open Water) בקוטאו - יום וחצי, 11,000 THB | סיאם סקובה",
  seoDescription:
    "מעלים רמה עם קורס PADI כוכב שני (Advanced Open Water) בקוטאו. יום וחצי, 5 צלילות הרפתקה עד 30 מ׳ כולל עומק, ספינה טרופה, לילה וניווט. קבוצות קטנות (מקס׳ 4), לילה לינה כלול. 4.9 בגוגל (845), 5.0 בטריפאדוויזר (776).",
  heroBadge: "PADI כוכב שני - Advanced Open Water",
  heroH1: "כוכב שני בקוטאו בעברית!!! - יום וחצי, 5 צלילות, 11,000 THB",
  heroSubhead:
    "כבר מוסמכים Open Water? תרדו ל-30 מטר עם חמש צלילות הרפתקה - עומק, ספינה טרופה, לילה, ניווט וציפה. בלי מבחנים, בלי תיאוריה, רק צלילה. לילה לינה כלול.",
  ctaPrimary: "שיחה ב-WhatsApp",
  ctaSecondary: "שאלו על תאריכים וחבילות",
  uspHeadline: "למה לעשות כוכב שני איתנו",
  uspTiles: [
    {
      icon: "users",
      title: "מקסימום 4 חניכים למדריך",
      body: "יותר זמן מתחת למים, ליווי אמיתי על ציפה וצריכת אוויר, פחות המתנה.",
    },
    {
      icon: "boat",
      title: "סירה פרטית + ציוד חדש",
      body: "אנחנו לא חולקים סירה עם חנויות אחרות, אז צלילות העומק והלילה יוצאות בזמן ועם ציוד שאפשר לסמוך עליו.",
    },
    {
      icon: "award",
      title: "הסמכת PADI לכל החיים",
      body: "מוכרת בכל חנות צלילה בעולם. שלכם לתמיד, ללא חידושים.",
    },
  ],
  pricingHeadline: "מה כלול",
  pricing: {
    price: "11,000 THB",
    perWhat: "לאדם, הכל כלול",
    includes: [
      "5 צלילות הרפתקה: עומק (30 מ׳), ספינה טרופה, לילה, ניווט, ציפה/צילום",
      "מדריכים דוברי עברית, אנגלית וספרדית",
      "ציוד צלילה מלא ומקצועי, כל הצלילות והחומרים",
      "לילה לינה במועדון שלנו - מתנה 🎁",
      "ביטוח צלילה",
      "כיבוד על הסירה: אננס, עוגיות, תה, קפה ומים",
      "חולצת צלילה של המועדון",
      "הסמכת PADI כוכב שני (Advanced Open Water) בינלאומית",
    ],
    excludes: [
      "ארוחות",
      "הסעה למרכז הצלילה",
      "צילום מתחת למים (תוספת בתשלום)",
      "מדריך פרטי (תוספת בתשלום)",
    ],
  },
  socialProofHeadline: "4.9 בגוגל (845) · 5.0 בטריפאדוויזר (776).",
  socialProofSubhead: "קראו מה צוללים מספרים אחרי שעשו כוכב שני בדרך של סיאם סקובה.",
  whatYouDoHeadline: "הדרך שלכם לכוכב שני תוך יום וחצי",
  whatYouDoSubhead:
    "זה 100% מעשי - בלי מבחנים ובלי תיאוריה בכיתה. חמש צלילות לאורך יום וחצי, כולל צלילת עומק ל-30 מטר וצלילת לילה בשונית.",
  schedule: [
    { time: "יום 1", label: "10:00 מפגש במועדון · 11:00 צלילת ציפה · 14:00 צלילת ניווט · 17:30 צלילת לילה" },
    { time: "יום 2", label: "06:00 סירה מוקדמת לצלילת עומק (30 מ׳) + ספינה טרופה · 10:00 צלילה אחרונה" },
    { time: "יום 2", label: "11:30 חזרה למועדון - מוסמכים וחוגגים 🎉" },
  ],
  ctaStripHeadline: "התחילו את קורס כוכב שני השבוע",
  ctaStripSubhead: "שלחו תאריכי טיול ב-WhatsApp ונמצא יום פתיחה שמתאים.",
  faqHeadline: "שאלות נפוצות",
  faqItems: [
    {
      q: "מה צריך כדי להתחיל?",
      a: "הסמכת Open Water (PADI או שווה ערך). זהו - כוכב שני הוא הצעד הטבעי הבא.",
    },
    {
      q: "יש מבחן או תיאוריה?",
      a: "בלי מבחנים ובלי תיאוריה בכיתה. יש קריאת ידע קצרה לכל צלילת הרפתקה, אבל הקורס 100% במים.",
    },
    {
      q: "מה העומק המקסימלי?",
      a: "30 מטרים - זו צלילת העומק. אחד מרגעי השיא של הקורס.",
    },
    {
      q: "צריך לשלם מקדמה כדי להזמין?",
      a: "כן - מקדמה של 3,000 THB שומרת לכם מקום, והיתרה משולמת כאן באי. כתבו לנו ב-WhatsApp ונסדר את זה תוך דקה.",
    },
    {
      q: "אפשר לעשות מיד אחרי Open Water?",
      a: "כן, וזו הדרך הכי פופולרית. הזמינו את שניהם יחד ונעניק הנחה על החבילה - שאלו אותנו ב-WhatsApp.",
    },
    {
      q: "כמה זמן זה לוקח?",
      a: "יום וחצי, חמש צלילות. אתם מוסמכים עד אמצע הבוקר של היום השני.",
    },
  ],
  closingCtaHeadline: "הסמכת כוכב שני. יום וחצי. 11,000 THB.",
  closingCtaSubhead: "לילה לינה כלול. WhatsApp עם התאריכים - פותחים קורסים כל יום.",
};

// ---------- Fun Dive ----------

const FUN_EN: LanderCopy = {
  seoTitle: "Fun Dives in Koh Tao - Guided Day Trips from 2,000 THB | Siam Scuba",
  seoDescription:
    "Certified divers - book guided fun dives in Koh Tao. Two morning or afternoon dives 2,000 THB. Full-day Sail Rock 4,000 THB. Small groups, two custom boats.",
  heroBadge: "For certified divers",
  heroH1: "Fun dives in Koh Tao - small groups, custom boats, from 2,000 THB",
  heroSubhead:
    "You're already certified. Pick your day, pick your sites - Chumphon Pinnacle, Sail Rock, Twins, Shark Island. We handle the boat, the gear, the guide.",
  ctaPrimary: "Book a fun dive",
  ctaSecondary: "Or message us on WhatsApp",
  uspHeadline: "Why dive with us",
  uspTiles: [
    {
      icon: "boat",
      title: "Two custom dive boats",
      body: "We don't share with other shops. Boat fills with our divers, leaves on time.",
    },
    {
      icon: "users",
      title: "Max 6 divers per guide",
      body: "Real briefings, real attention to your air consumption. No herd diving.",
    },
    {
      icon: "calendar",
      title: "Morning OR afternoon trips",
      body: "Pick the half-day that fits your schedule. Sail Rock day-trips run weekly.",
    },
  ],
  pricingHeadline: "Pricing",
  pricing: {
    price: "2,000 / 4,000 THB",
    perWhat: "2-tank half-day / Sail Rock full-day",
    includes: [
      "2 guided dives with a pro dive guide",
      "All gear (BCD, regulator, mask, fins, wetsuit)",
      "Full air tank (180-200 bar), tanks and weights",
      "Fresh pineapple and drinks on the boat",
      "Dive insurance",
      "Sail Rock full-day: breakfast and lunch included",
    ],
    excludes: ["Hotel pickup", "GoPro rental", "Underwater photos (add 1,500 THB)"],
  },
  socialProofHeadline: "Trusted by 778 reviewers on TripAdvisor - 5.0 stars.",
  socialProofSubhead: "Most repeat customers we've ever had. They keep coming back, you'll see why.",
  whatYouDoHeadline: "Where we dive",
  whatYouDoSubhead:
    "We rotate sites based on weather and visibility. Some of our regular sites:",
  diveSites: [
    {
      name: "Chumphon Pinnacle",
      blurb: "Big-fish site. Whale shark sightings in season, schools of barracuda, batfish year-round.",
    },
    {
      name: "Sail Rock",
      blurb: "Best dive in the Gulf. 6m chimney swim-through, big schools, sometimes whale sharks. Full-day trip.",
    },
    {
      name: "Twins",
      blurb: "Two pinnacles, sandy bottom, easy 12-18m. Great for buoyancy work and macro spotting.",
    },
    {
      name: "Shark Island",
      blurb: "Wall dive on the south side. Reef sharks, turtles, anemones - usually our second dive.",
    },
    {
      name: "Hin Wong Pinnacle",
      blurb: "Quieter site, great viz on flat days. Best for photographers.",
    },
    {
      name: "Southwest Pinnacle",
      blurb: "A cluster of pinnacles dropping to 28m. Big schools, groupers, whale sharks in season - quieter than Chumphon.",
    },
    {
      name: "White Rock",
      blurb: "Koh Tao's biggest reef and a local favourite. Easy terrain, tons of fish, great for a relaxed dive or a night dive.",
    },
    {
      name: "Mango Bay",
      blurb: "Shallow, calm bay on the north coast. Healthy hard coral and macro life - perfect for easy, long, low-current dives.",
    },
  ],
  ctaStripHeadline: "Pick your dive day",
  ctaStripSubhead: "Book online or send dates on WhatsApp - we'll confirm the same day.",
  faqHeadline: "Frequently asked",
  faqItems: [
    {
      q: "Which certifications do you accept?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS - anything mainstream. Bring your card or have a digital copy ready.",
    },
    {
      q: "I haven't dived in 2+ years. Should I do a refresher?",
      a: "Yes. We offer a quick refresher (Scuba Review) for 2,500 THB - two skills sessions plus a shallow dive. Saves you skipping the first fun dive in confusion.",
    },
    {
      q: "Can I dive Sail Rock as my first dive of the trip?",
      a: "Possible but not ideal. Sail Rock is deeper (~22m) and currents can be strong. We recommend a half-day local trip first.",
    },
    {
      q: "What if the weather cancels the trip?",
      a: "Full refund or reschedule, your choice. We never push trips that aren't safe.",
    },
    {
      q: "Do you offer Nitrox?",
      a: "Yes, Nitrox add-on is 250 THB per dive if you're certified. We can certify you EANx in a day too.",
    },
  ],
  closingCtaHeadline: "Two dives, your day, 2,000 THB.",
  closingCtaSubhead: "Tap below to book - or WhatsApp us your preferred dates.",
};

const FUN_ES: LanderCopy = {
  seoTitle: "Inmersiones Guiadas en Koh Tao - Desde 2,000 THB | Siam Scuba",
  seoDescription:
    "Buceadores certificados - reserva inmersiones guiadas en Koh Tao. Dos inmersiones mañana o tarde 2,000 THB. Día completo Sail Rock 4,000 THB. Grupos pequeños, barcos propios.",
  heroBadge: "Para buceadores certificados",
  heroH1: "Buceo en Koh Tao - grupos pequeños, barcos propios, desde 2,000 THB",
  heroSubhead:
    "Ya estás certificado. Elige el día, elige los sitios - Chumphon Pinnacle, Sail Rock, Twins, Shark Island. Nosotros nos ocupamos del barco, el equipo y el guía.",
  ctaPrimary: "Reserva una inmersión",
  ctaSecondary: "O escríbenos por WhatsApp",
  uspHeadline: "Por qué bucear con nosotros",
  uspTiles: [
    {
      icon: "boat",
      title: "Dos barcos propios",
      body: "No compartimos con otros centros. El barco se llena con nuestros buceadores y sale a tiempo.",
    },
    {
      icon: "users",
      title: "Máx. 6 buceadores por guía",
      body: "Briefings reales, atención real a tu consumo de aire. Sin buceo en manada.",
    },
    {
      icon: "calendar",
      title: "Salidas de mañana O tarde",
      body: "Elige el medio día que te encaje. Salidas a Sail Rock semanales.",
    },
  ],
  pricingHeadline: "Precios",
  pricing: {
    price: "2,000 / 4,000 THB",
    perWhat: "2 inmersiones medio día / Sail Rock día completo",
    includes: [
      "2 inmersiones guiadas con guía profesional",
      "Equipo completo (chaleco, regulador, máscara, aletas, traje)",
      "Botella llena (180-200 bar), botellas y plomos",
      "Piña fresca y bebidas en el barco",
      "Seguro de buceo",
      "Día completo Sail Rock: desayuno y almuerzo incluidos",
    ],
    excludes: ["Recogida en hotel", "Alquiler de GoPro", "Fotos subacuáticas (+1.500 THB)"],
  },
  socialProofHeadline: "778 reseñas en TripAdvisor con 5,0 estrellas.",
  socialProofSubhead: "Los clientes que más repiten. Vuelven una y otra vez - ya verás por qué.",
  whatYouDoHeadline: "Dónde buceamos",
  whatYouDoSubhead: "Rotamos sitios según el tiempo y la visibilidad. Algunos de nuestros sitios habituales:",
  diveSites: [
    {
      name: "Chumphon Pinnacle",
      blurb: "Sitio de pez grande. Tiburones ballena en temporada, bancos de barracudas y peces murciélago todo el año.",
    },
    {
      name: "Sail Rock",
      blurb: "La mejor inmersión del Golfo. Chimenea de 6m, grandes bancos, a veces tiburones ballena. Salida de día completo.",
    },
    {
      name: "Twins",
      blurb: "Dos pináculos, fondo de arena, 12-18m. Perfecto para flotabilidad y macro.",
    },
    {
      name: "Shark Island",
      blurb: "Pared en la cara sur. Tiburones de arrecife, tortugas, anémonas - suele ser nuestra segunda inmersión.",
    },
    {
      name: "Hin Wong Pinnacle",
      blurb: "Sitio más tranquilo, gran visibilidad en días planos. El favorito de los fotógrafos.",
    },
    {
      name: "Southwest Pinnacle",
      blurb: "Conjunto de pináculos que baja a 28m. Grandes bancos, meros y tiburones ballena en temporada - más tranquilo que Chumphon.",
    },
    {
      name: "White Rock",
      blurb: "El arrecife más grande de Koh Tao y un clásico local. Terreno fácil, muchísimos peces, ideal para una inmersión relajada o nocturna.",
    },
    {
      name: "Mango Bay",
      blurb: "Bahía poco profunda y tranquila en la costa norte. Coral duro sano y vida macro - perfecta para inmersiones largas y sin corriente.",
    },
  ],
  ctaStripHeadline: "Elige tu día de buceo",
  ctaStripSubhead: "Reserva online o envíanos fechas por WhatsApp - confirmamos el mismo día.",
  faqHeadline: "Preguntas frecuentes",
  faqItems: [
    {
      q: "¿Qué certificaciones aceptan?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS - todo lo mayoritario. Trae la tarjeta o ten una copia digital.",
    },
    {
      q: "Llevo 2+ años sin bucear. ¿Debo hacer un repaso?",
      a: "Sí. Ofrecemos un Scuba Review rápido por 2,500 THB - dos sesiones de habilidades más una inmersión poco profunda. Mejor que perderse la primera inmersión.",
    },
    {
      q: "¿Puedo bucear Sail Rock como primera inmersión del viaje?",
      a: "Posible pero no ideal. Sail Rock es más profundo (~22m) y las corrientes pueden ser fuertes. Mejor una salida local primero.",
    },
    {
      q: "¿Y si el mal tiempo cancela la salida?",
      a: "Reembolso completo o cambio de fecha, tú eliges. Nunca forzamos salidas que no sean seguras.",
    },
    {
      q: "¿Ofrecen Nitrox?",
      a: "Sí, el suplemento Nitrox son 250 THB por inmersión si ya estás certificado. También podemos certificarte EANx en un día.",
    },
  ],
  closingCtaHeadline: "Dos inmersiones, tu día, 2,000 THB.",
  closingCtaSubhead: "Pulsa abajo para reservar - o escríbenos por WhatsApp con tus fechas.",
};

const FUN_HE: LanderCopy = {
  seoTitle: "צלילות פאן בקוטאו - יציאות יומיות מ-2,000 THB | סיאם סקובה",
  seoDescription:
    "צוללים מוסמכים - הזמינו צלילות פאן מודרכות בקוטאו. שתי צלילות בוקר או אחרי הצהריים ב-2,000 THB. יום שלם ב-Sail Rock ב-4,000 THB. קבוצות קטנות, סירות פרטיות.",
  heroBadge: "לצוללים מוסמכים",
  heroH1: "צלילות פאן בקוטאו - קבוצות קטנות, סירות פרטיות, מ-2,000 THB",
  heroSubhead:
    "כבר מוסמכים. בחרו יום, בחרו אתרים - Chumphon Pinnacle, Sail Rock, Twins, Shark Island. אנחנו מטפלים בסירה, בציוד ובמדריך.",
  ctaPrimary: "הזמינו צלילה",
  ctaSecondary: "או כתבו לנו ב-WhatsApp",
  uspHeadline: "למה לצלול איתנו",
  uspTiles: [
    {
      icon: "boat",
      title: "שתי סירות צלילה פרטיות",
      body: "אנחנו לא חולקים עם חנויות אחרות. הסירה מתמלאת בצוללים שלנו ויוצאת בזמן.",
    },
    {
      icon: "users",
      title: "מקסימום 6 צוללים למדריך",
      body: "תדריכים אמיתיים, תשומת לב אמיתית לצריכת האוויר. בלי צלילה בעדר.",
    },
    {
      icon: "calendar",
      title: "יציאות בוקר או אחרי צהריים",
      body: "בחרו את חצי היום שמתאים. יציאות ל-Sail Rock כל שבוע.",
    },
  ],
  pricingHeadline: "מחירים",
  pricing: {
    price: "2,000 / 4,000 THB",
    perWhat: "2 צלילות חצי יום / Sail Rock יום שלם",
    includes: [
      "2 צלילות מודרכות עם מדריך מקצועי",
      "ציוד צלילה מלא (מאזן ציפה, רגולטור, מסכה, סנפירים, חליפה)",
      "מיכל אוויר מלא (180-200 bar), בלונים ומשקולות",
      "אננס טרי ושתייה על הסירה",
      "ביטוח צלילה",
      "יום שלם ב-Sail Rock: ארוחת בוקר וצהריים כלולות",
    ],
    excludes: ["איסוף מהמלון", "השכרת GoPro", "תמונות מתחת למים (תוספת 1,500 THB)"],
  },
  socialProofHeadline: "778 ביקורות ב-TripAdvisor עם 5.0 כוכבים.",
  socialProofSubhead: "הכי הרבה לקוחות חוזרים שאי פעם היו לנו. הם חוזרים שוב ושוב - אתם תראו למה.",
  whatYouDoHeadline: "איפה אנחנו צוללים",
  whatYouDoSubhead: "מסובבים אתרים לפי מזג אוויר וראות. כמה מהאתרים הקבועים שלנו:",
  diveSites: [
    {
      name: "Chumphon Pinnacle",
      blurb: "אתר של דגים גדולים. כריש לוויתן בעונה, להקות ברקודות ודגי עטלף כל השנה.",
    },
    {
      name: "Sail Rock",
      blurb: "הצלילה הכי טובה במפרץ. מעבר ארובה של 6 מטר, להקות גדולות, לפעמים כריש לוויתן. יום שלם.",
    },
    {
      name: "Twins",
      blurb: "שתי טבעות, קרקעית חולית, 12-18 מטר. מעולה לציפה ולמאקרו.",
    },
    {
      name: "Shark Island",
      blurb: "צלילת קיר בצד הדרומי. כרישי שונית, צבים, שושנות - בדרך כלל הצלילה השנייה שלנו.",
    },
    {
      name: "Hin Wong Pinnacle",
      blurb: "אתר שקט יותר, ראות מצוינת בימים שטוחים. אהוב על צלמים.",
    },
    {
      name: "Southwest Pinnacle",
      blurb: "אשכול טבעות שיורד ל-28 מטר. להקות גדולות, דקרים, וכריש לוויתן בעונה - שקט יותר מ-Chumphon.",
    },
    {
      name: "White Rock",
      blurb: "השונית הגדולה בקוטאו ואהובה על המקומיים. שטח קל, המון דגים, מצוין לצלילה רגועה או לצלילת לילה.",
    },
    {
      name: "Mango Bay",
      blurb: "מפרץ רדוד ושקט בצפון האי. אלמוגים קשים בריאים וחיי מאקרו - מושלם לצלילות ארוכות בלי זרם.",
    },
  ],
  ctaStripHeadline: "בחרו יום צלילה",
  ctaStripSubhead: "הזמינו אונליין או שלחו תאריכים ב-WhatsApp - נאשר באותו יום.",
  faqHeadline: "שאלות נפוצות",
  faqItems: [
    {
      q: "אילו הסמכות אתם מקבלים?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS - כל מה שמרכזי. הביאו את הכרטיס או צילום דיגיטלי.",
    },
    {
      q: "לא צללתי 2+ שנים. כדאי לעשות רענון?",
      a: "כן. יש לנו Scuba Review מהיר ב-2,500 THB - שני מפגשי תרגול וצלילה רדודה. עדיף מאשר להפסיד את הצלילה הראשונה בבלבול.",
    },
    {
      q: "אפשר לצלול ב-Sail Rock כצלילה ראשונה של הטיול?",
      a: "אפשרי אבל לא אידיאלי. Sail Rock עמוק יותר (~22 מטר) והזרמים יכולים להיות חזקים. עדיף יציאה מקומית קודם.",
    },
    {
      q: "מה אם מזג אוויר מבטל את היציאה?",
      a: "החזר מלא או דחייה, לבחירתכם. אנחנו לא דוחפים יציאות שלא בטוחות.",
    },
    {
      q: "יש Nitrox?",
      a: "כן, תוספת Nitrox היא 250 THB לצלילה אם אתם מוסמכים. אנחנו גם יכולים להסמיך אתכם EANx ביום אחד.",
    },
  ],
  closingCtaHeadline: "שתי צלילות, היום שלכם, 2,000 THB.",
  closingCtaSubhead: "לחצו למטה להזמנה - או WhatsApp עם התאריכים המועדפים.",
};

// ---------- Koh Tao Diving (conquest / category campaign) ----------
// Landing page for competitor-conquest + category ad clicks. Sells "why Siam
// Scuba" hard against the big island shops. Audience is certified divers
// comparing shops, so the booking CTA reuses the fun-dive iframe flow.

const KOH_TAO_EN: LanderCopy = {
  seoTitle: "Koh Tao Diving, Done Right - Small Groups, Private Boat | Siam Scuba",
  seoDescription:
    "Dive Koh Tao with Siam Scuba: small groups (max 4 per instructor), our own private boat with new gear, PADI 5-Star Center, 4.9 on Google (845) and 5.0 on TripAdvisor (776). Reserve in minutes on WhatsApp.",
  // TODO: swap hero image when photographyAI boats/ shots are processed.
  heroImage: "/hero/turtle-1920.webp",
  heroBadge: "PADI 5-Star Dive Center · Koh Tao",
  heroH1: "Koh Tao Diving, Done Right",
  heroSubhead:
    "Small groups, our own private boat, and new gear - not a 20-person cattle dive on a shared boat. This is how diving on Koh Tao is supposed to feel.",
  ctaPrimary: "Book your dive",
  ctaSecondary: "Or chat on WhatsApp",
  uspHeadline: "Why Divers Choose Siam 🤿",
  uspTiles: [
    {
      icon: "users",
      emoji: "👥",
      title: "Small groups, max 4 per instructor",
      body: "Real attention and real safety. You're a diver, not a number on a packed boat.",
    },
    {
      icon: "boat",
      emoji: "🛥️",
      title: "Our own private boat + new gear",
      body: "We don't share boats with other shops. Modern, well-maintained equipment, and the schedule actually runs on time.",
    },
    {
      icon: "shield",
      badge: "padi5star",
      title: "PADI 5-Star Center",
      body: "Top PADI standards on Koh Tao, with a fraction of the crowd of the big factory shops.",
    },
    {
      icon: "award",
      emoji: "🌟",
      title: "4.9 Google · 5.0 TripAdvisor",
      body: "One of the most-reviewed dive shops on the island. Read why divers keep coming back.",
    },
    {
      icon: "heart",
      emoji: "🗣️",
      title: "Instructors in EN / ES / HE",
      body: "Brief, dive, and debrief in your own language - English, Spanish or Hebrew.",
    },
    {
      icon: "calendar",
      emoji: "✅",
      title: "Easy booking on WhatsApp",
      body: "Message us, pick your day, and a small deposit secures your spot. We reply within minutes.",
    },
  ],
  pricingHeadline: "Pricing",
  pricing: {
    price: "from 2,000 THB",
    perWhat: "2-tank half-day · Sail Rock full-day 4,000 THB",
    includes: [
      "Guided dives with a pro dive guide",
      "All gear (BCD, regulator, mask, fins, wetsuit) - new and well-maintained",
      "Full air tank (180-200 bar), tanks and weights",
      "Fresh fruit and drinks on our private boat",
      "Dive insurance",
      "Sail Rock full-day: breakfast and lunch included",
    ],
    excludes: ["Hotel pickup", "GoPro rental", "Underwater photos (add-on)"],
  },
  socialProofHeadline: "4.9 on Google (845) · 5.0 on TripAdvisor (776).",
  socialProofSubhead: "See what divers say after diving Koh Tao the Siam Scuba way.",
  whatYouDoHeadline: "The dives you came to Koh Tao for",
  whatYouDoSubhead:
    "We pick dive sites daily based on the weather ⛅, where visibility is best, and where the gentle giant was last spotted - Koh Tao's whale sharks.",
  diveSites: [
    {
      name: "Sail Rock",
      blurb: "The best dive in the Gulf. A 6m chimney swim-through, huge schools, and whale sharks in season. Full-day trip on our boat.",
    },
    {
      name: "Chumphon Pinnacle",
      blurb: "Koh Tao's big-fish site. Whale shark sightings in season, schools of barracuda and batfish year-round.",
    },
    {
      name: "Twins",
      blurb: "Two pinnacles on a sandy bottom, easy 12-18m. Great for buoyancy work and macro spotting.",
    },
    {
      name: "Shark Island",
      blurb: "Wall dive on the south side. Reef sharks, turtles and anemones - usually a relaxed second dive.",
    },
  ],
  ctaStripHeadline: "Dive Koh Tao the way it should be",
  ctaStripSubhead: "Pick your day and reserve your spot with a small deposit. We confirm the same day.",
  faqHeadline: "Frequently asked",
  faqItems: [
    {
      q: "Which certifications do you accept?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS - anything mainstream. Bring your card or have a digital copy ready.",
    },
    {
      q: "Do I really get a private boat and small group?",
      a: "Yes. We run our own boat and keep groups small (max 4 per instructor on courses), so you're never crammed onto a shared 20-diver trip.",
    },
    {
      q: "I haven't dived in 2+ years. Should I do a refresher?",
      a: "We recommend a quick refresher (Scuba Review). It's two skills sessions plus a shallow dive - far better than skipping your first fun dive confused.",
    },
    {
      q: "Do I have to pay a deposit to book?",
      a: "Yes - a small deposit secures your spot, and the balance is paid here on the island. Message us on WhatsApp and we'll arrange it in a minute.",
    },
    {
      q: "Can I see whale sharks?",
      a: "Whale sharks visit Sail Rock and Chumphon Pinnacle in season (roughly March-May and Sept-Oct). Sightings are never guaranteed, but those are your best bets.",
    },
  ],
  closingCtaHeadline: "Koh Tao diving, done right.",
  closingCtaSubhead: "Small groups, private boat. Reserve your dive with a small deposit - WhatsApp us your dates.",
};

const KOH_TAO_ES: LanderCopy = {
  seoTitle: "Buceo en Koh Tao en Español!!! - Grupos Pequeños, Barco Propio | Siam Scuba",
  seoDescription:
    "Bucea en Koh Tao con Siam Scuba: grupos pequeños (máx. 4 por instructor), barco propio con equipo nuevo, Centro PADI 5 estrellas, 4,9 en Google (845) y 5,0 en TripAdvisor (776). Reserva en minutos por WhatsApp.",
  // TODO: swap hero image when photographyAI boats/ shots are processed.
  heroImage: "/hero/turtle-1920.webp",
  heroBadge: "Centro PADI 5 estrellas · Koh Tao",
  heroH1: "Buceo en Koh Tao en Español!!!",
  heroSubhead:
    "Grupos pequeños, barco propio y equipo nuevo - no una inmersión masiva de 20 personas en un barco compartido. Así es como debería sentirse bucear en Koh Tao.",
  ctaPrimary: "Reserva tu inmersión",
  ctaSecondary: "O chatea por WhatsApp",
  uspHeadline: "Por qué los buceadores eligen Siam 🇪🇸",
  uspTiles: [
    {
      icon: "users",
      emoji: "👥",
      title: "Grupos pequeños, máx. 4 por instructor",
      body: "Atención y seguridad reales. Eres un buceador, no un número en un barco lleno.",
    },
    {
      icon: "boat",
      emoji: "🛥️",
      title: "Barco propio + equipo nuevo",
      body: "No compartimos barco con otras tiendas. Equipo moderno y cuidado, y el horario se cumple.",
    },
    {
      icon: "shield",
      badge: "padi5star",
      title: "Centro PADI 5 estrellas",
      body: "Los más altos estándares PADI en Koh Tao, con mucha menos gente que las grandes tiendas industriales.",
    },
    {
      icon: "award",
      emoji: "🌟",
      title: "4,9 Google · 5,0 TripAdvisor",
      body: "Una de las tiendas de buceo más reseñadas de la isla. Mira por qué los buceadores repiten.",
    },
    {
      icon: "heart",
      emoji: "🗣️",
      title: "Instructores en EN / ES / HE",
      body: "Briefing, inmersión y debriefing en tu idioma - inglés, español o hebreo.",
    },
    {
      icon: "calendar",
      emoji: "✅",
      title: "Reserva fácil por WhatsApp",
      body: "Escríbenos, elige tu día y un pequeño depósito asegura tu plaza. Respondemos en minutos.",
    },
  ],
  pricingHeadline: "Precios",
  pricing: {
    price: "desde 2,000 THB",
    perWhat: "2 inmersiones medio día · Sail Rock día completo 4,000 THB",
    includes: [
      "Inmersiones guiadas con guía profesional",
      "Equipo completo (chaleco, regulador, máscara, aletas, traje) - nuevo y cuidado",
      "Botella llena (180-200 bar), botellas y plomos",
      "Fruta fresca y bebidas en nuestro barco privado",
      "Seguro de buceo",
      "Día completo Sail Rock: desayuno y almuerzo incluidos",
    ],
    excludes: ["Recogida en hotel", "Alquiler de GoPro", "Fotos subacuáticas (extra)"],
  },
  socialProofHeadline: "4,9 en Google (845) · 5,0 en TripAdvisor (776).",
  socialProofSubhead: "Mira lo que dicen los buceadores tras bucear Koh Tao al estilo Siam Scuba.",
  whatYouDoHeadline: "Las inmersiones por las que viniste a Koh Tao",
  whatYouDoSubhead:
    "Elegimos los sitios cada día según el clima ⛅, dónde hay mejor visibilidad y dónde se vio por última vez al gigante gentil: los tiburones ballena de Koh Tao.",
  diveSites: [
    {
      name: "Sail Rock",
      blurb: "La mejor inmersión del Golfo. Chimenea de 6m, grandes bancos y tiburones ballena en temporada. Salida de día completo en nuestro barco.",
    },
    {
      name: "Chumphon Pinnacle",
      blurb: "El sitio de pez grande de Koh Tao. Tiburones ballena en temporada, bancos de barracudas y peces murciélago todo el año.",
    },
    {
      name: "Twins",
      blurb: "Dos pináculos sobre fondo de arena, fácil 12-18m. Perfecto para flotabilidad y macro.",
    },
    {
      name: "Shark Island",
      blurb: "Pared en la cara sur. Tiburones de arrecife, tortugas y anémonas - suele ser una segunda inmersión relajada.",
    },
  ],
  ctaStripHeadline: "Buceo en Koh Tao en Español!!!",
  ctaStripSubhead: "Elige tu día y reserva tu plaza con un pequeño depósito. Confirmamos el mismo día.",
  faqHeadline: "Preguntas frecuentes",
  faqItems: [
    {
      q: "¿Qué certificaciones aceptan?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS - todo lo mayoritario. Trae la tarjeta o ten una copia digital.",
    },
    {
      q: "¿De verdad tengo barco propio y grupo pequeño?",
      a: "Sí. Operamos nuestro propio barco y mantenemos grupos pequeños (máx. 4 por instructor en cursos), así que nunca vas apretado en una salida compartida de 20 buceadores.",
    },
    {
      q: "Llevo 2+ años sin bucear. ¿Debo hacer un repaso?",
      a: "Recomendamos un repaso rápido (Scuba Review): dos sesiones de habilidades más una inmersión poco profunda. Mucho mejor que perderse la primera inmersión.",
    },
    {
      q: "¿Tengo que pagar un depósito para reservar?",
      a: "Sí - un pequeño depósito asegura tu plaza y el resto se paga aquí en la isla. Escríbenos por WhatsApp y lo arreglamos en un minuto.",
    },
    {
      q: "¿Puedo ver tiburones ballena?",
      a: "Los tiburones ballena visitan Sail Rock y Chumphon Pinnacle en temporada (aprox. marzo-mayo y sept-oct). No se garantizan, pero son tu mejor opción.",
    },
  ],
  closingCtaHeadline: "Buceo en Koh Tao en Español!!!",
  closingCtaSubhead: "Grupos pequeños, barco propio. Reserva tu inmersión con un pequeño depósito - o escríbenos tus fechas por WhatsApp.",
};

const KOH_TAO_HE: LanderCopy = {
  seoTitle: "צלילות בקוטאו בעברית!!! - קבוצות קטנות, סירה פרטית | סיאם סקובה",
  seoDescription:
    "צוללים בקוטאו עם סיאם סקובה: קבוצות קטנות (מקס׳ 4 למדריך), סירה פרטית עם ציוד חדש, מרכז PADI 5 כוכבים, 4.9 בגוגל (845) ו-5.0 בטריפאדוויזר (776). הזמנה תוך דקות ב-WhatsApp.",
  // TODO: swap hero image when photographyAI boats/ shots are processed.
  heroImage: "/hero/turtle-1920.webp",
  heroBadge: "מרכז PADI 5 כוכבים · קוטאו",
  heroH1: "צלילות בקוטאו בעברית!!!",
  heroSubhead:
    "קבוצות קטנות, סירה פרטית של המועדון, וציוד חדש. ככה צלילה בקוטאו צריכה להראות.",
  ctaPrimary: "הזמינו צלילה",
  ctaSecondary: "או דברו איתנו ב-WhatsApp",
  uspHeadline: "למה צוללים בוחרים ב-Siam 🇮🇱",
  uspTiles: [
    {
      icon: "users",
      emoji: "👥",
      title: "קבוצות קטנות, מקס׳ 4 למדריך",
      body: "תשומת לב אמיתית ובטיחות אמיתית. אתם צוללים, לא מספר על סירה גדושה.",
    },
    {
      icon: "boat",
      emoji: "🛥️",
      title: "סירה פרטית משלנו + ציוד חדש",
      body: "אנחנו לא חולקים סירה עם חנויות אחרות. ציוד מודרני ומתוחזק, והלו״ז באמת עומד בזמנים.",
    },
    {
      icon: "shield",
      badge: "padi5star",
      title: "מרכז PADI 5 כוכבים",
      body: "הסטנדרטים הגבוהים של PADI בקוטאו, עם הרבה פחות עומס מחנויות הענק.",
    },
    {
      icon: "award",
      emoji: "🌟",
      title: "4.9 גוגל · 5.0 טריפאדוויזר",
      body: "אחת מחנויות הצלילה הכי מדורגות באי. תראו למה צוללים חוזרים אלינו שוב ושוב.",
    },
    {
      icon: "heart",
      emoji: "🗣️",
      title: "מדריכים באנגלית / ספרדית / עברית",
      body: "תדריך, צלילה ותחקיר בשפה שלכם - אנגלית, ספרדית או עברית.",
    },
    {
      icon: "calendar",
      emoji: "✅",
      title: "הזמנה קלה ב-WhatsApp",
      body: "כתבו לנו, בחרו יום, ומקדמה קטנה שומרת לכם מקום. אנחנו עונים תוך דקות.",
    },
  ],
  pricingHeadline: "מחירים",
  pricing: {
    price: "2,000 ฿ לשתי צלילות",
    perWhat: "2 צלילות חצי יום · Sail Rock יום שלם 4,000 ฿",
    includes: [
      "צלילות מודרכות עם מדריך מקצועי",
      "כל הציוד (מאזן ציפה, רגולטור, מסכה, סנפירים, חליפה) - חדש ומתוחזק",
      "מיכל אוויר מלא (180-200 bar), בלונים ומשקולות",
      "פירות טריים ושתייה על הסירה הפרטית שלנו",
      "ביטוח צלילה",
      "יום שלם ב-Sail Rock: ארוחת בוקר וצהריים כלולות",
    ],
    excludes: ["איסוף מהמלון", "השכרת GoPro", "תמונות מתחת למים (תוספת בתשלום)"],
  },
  socialProofHeadline: "4.9 בגוגל (845) · 5.0 בטריפאדוויזר (776).",
  socialProofSubhead: "תראו מה צוללים מספרים אחרי שצללו בקוטאו בדרך של סיאם סקובה.",
  whatYouDoHeadline: "הצלילות שבשבילן באתם לקוטאו",
  whatYouDoSubhead:
    "אנחנו בוחרים אתרים על בסיס יומי לפי מזג האוויר ⛅, איפה הראות הכי טובה, ואיפה ראו בפעם האחרונה את הענק העדין (כרישי הלוויתן של קוטאו)",
  diveSites: [
    {
      name: "Sail Rock",
      blurb: "הצלילה הכי טובה במפרץ. מעבר ארובה של 6 מטר, להקות ענק, וכריש לוויתן בעונה. יום שלם על הסירה שלנו.",
    },
    {
      name: "Chumphon Pinnacle",
      blurb: "אתר הדגים הגדולים של קוטאו. כריש לוויתן בעונה, להקות ברקודות ודגי עטלף כל השנה.",
    },
    {
      name: "Twins",
      blurb: "שתי טבעות על קרקעית חולית, 12-18 מטר קלילים. מעולה לתרגול ציפה ולמאקרו.",
    },
    {
      name: "Shark Island",
      blurb: "צלילת קיר בצד הדרומי. כרישי שונית, צבים ושושנות ים - בדרך כלל צלילה שנייה רגועה.",
    },
  ],
  ctaStripHeadline: "צלילות בקוטאו בעברית!!!",
  ctaStripSubhead: "בחרו יום ותשמרו מקום עם מקדמה קטנה. אנחנו מאשרים באותו יום.",
  faqHeadline: "שאלות נפוצות",
  faqItems: [
    {
      q: "אילו הסמכות אתם מקבלים?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS - כל מה שמרכזי. הביאו את הכרטיס או צילום דיגיטלי.",
    },
    {
      q: "באמת מקבלים סירה פרטית וקבוצה קטנה?",
      a: "כן. אנחנו מפעילים סירה משלנו ושומרים על קבוצות קטנות (מקס׳ 4 למדריך בקורסים), כך שאתם אף פעם לא נדחסים ליציאה משותפת של 20 צוללים.",
    },
    {
      q: "לא צללתי 2+ שנים. כדאי לעשות ריענון?",
      a: "אנחנו ממליצים על ריענון מהיר (Scuba Review): שני מפגשי תרגול וצלילה רדודה. הרבה יותר טוב מאשר להתבלבל בצלילה הראשונה.",
    },
    {
      q: "צריך לשלם מקדמה כדי להזמין?",
      a: "כן - מקדמה קטנה שומרת לכם מקום, והיתרה משולמת כאן באי. כתבו לנו ב-WhatsApp ונסדר את זה תוך דקה.",
    },
    {
      q: "אפשר לראות כרישי לוויתן?",
      a: "כרישי לוויתן מבקרים ב-Sail Rock וב-Chumphon Pinnacle בעונה (בערך מרץ-מאי וספטמבר-אוקטובר). אין הבטחה, אבל אלה הסיכויים הכי טובים.",
    },
  ],
  closingCtaHeadline: "צלילות בקוטאו בעברית!!!",
  closingCtaSubhead: "קבוצות קטנות, סירה פרטית. תשמרו מקום עם מקדמה קטנה - או שלחו לנו תאריכים ב-WhatsApp.",
};

// ---------- Sail Rock (Hin Bai) - full-day dive trip ----------
// Dedicated SailRockLander component (photo-fade cards + clickable departures
// strip), not the shared CampaignLander. Audience: certified divers. CTA routes
// through the /fun-dive-booking iframe so a paid deposit fires a valued ฿4,000
// Purchase (the DSD valueless-conversion fix).

const SAIL_ROCK_FEATURE_IMAGES = {
  whaleShark: "/dive-sites/chumphon-pinnacle.webp", // real whale shark
  chimney: sailRockChimney,
  fish: "/dive-sites/twins.webp", // divers + schooling fish + light rays
  boat: siamBoat, // our boat, Bongkotpetch
};

const SAIL_ROCK_EN: LanderCopy = {
  seoTitle: "Dive Sail Rock from Koh Tao - Full-Day Trip, 4,000 THB | Siam Scuba",
  seoDescription:
    "Dive Sail Rock (Hin Bai) - the best dive in the Gulf of Thailand. Full-day boat trip from Koh Tao: 3 dives (2x Sail Rock + Shark Island), whale shark chance, the famous Chimney swim-through. 4,000 THB all-in. Google 4.9 (845), TripAdvisor 5.0 (776).",
  heroBadge: "For certified divers",
  heroEyebrow: "The Best Dive in the Gulf of Thailand",
  heroH1: "Dive Sail Rock",
  heroSubhead:
    "Hin Bai - the legendary pinnacle. Whale shark territory, the famous vertical Chimney swim-through, and massive schools of fish. A full-day boat trip from Koh Tao, every 3 days.",
  ratingsLine: "★ Google 4.9 (845 reviews) · TripAdvisor 5.0 (776 reviews)",
  ctaPrimary: "Book the Sail Rock Trip",
  ctaSecondary: "Or message us on WhatsApp",
  nextBoatPrefix: "Next boat",
  securePrefix: "Secure your spot for",
  departuresLabel: "We sail every 3 days · upcoming departures",
  nextBoatLabel: "NEXT BOAT",
  reserveCta: "Reserve my spot",
  whatYouDoHeadline: "Why Sail Rock is unmissable",
  whatYouDoSubhead:
    "A 90-minute boat ride into open water rewards you with the richest marine life in the Gulf - and the single best chance in Thailand to swim with a whale shark.",
  featureCards: [
    {
      image: SAIL_ROCK_FEATURE_IMAGES.whaleShark,
      title: "Whale shark chance",
      body: "The Gulf's top spot to encounter the gentle giants - Sail Rock draws them in.",
    },
    {
      image: SAIL_ROCK_FEATURE_IMAGES.chimney,
      title: "The Chimney",
      body: "A thrilling vertical swim-through cutting down through the pinnacle - a signature dive.",
    },
    {
      image: SAIL_ROCK_FEATURE_IMAGES.fish,
      title: "Walls of fish",
      body: "Barracuda tornadoes, trevally, batfish and huge schools swirling around the rock.",
    },
    {
      image: SAIL_ROCK_FEATURE_IMAGES.boat,
      title: "3 dives in a day",
      body: "Two dives at Sail Rock plus a stop at Shark Island - a complete day on the water.",
    },
  ],
  uspHeadline: "",
  uspTiles: [],
  pricingHeadline: "",
  pricing: {
    price: "฿4,000",
    perWhat: "per person · full-day trip · 3 dives",
    includes: [
      "Full dive gear & tanks (180-200 bar)",
      "Private boat, experienced guides",
      "Breakfast + Thai lunch buffet on board",
      "Coffee, tea, fresh fruit, cookies",
      "Dive insurance included",
      "For certified divers",
    ],
    excludes: [],
  },
  pricingAddon: "+ ฿500 underwater photo package (optional)",
  socialProofHeadline: "4.9 on Google (845) · 5.0 on TripAdvisor (776).",
  socialProofSubhead: "See what divers say after a day on the Sail Rock boat with us.",
  dayTimelineHeadline: "Your day on the boat",
  dayTimeline: [
    { time: "07:30", label: "Depart Koh Tao - breakfast on board as we cruise to the pinnacle" },
    { time: "09:30", label: "Dive 1 - Sail Rock: the Chimney & the deep pinnacle walls" },
    { time: "11:30", label: "Dive 2 - Sail Rock: drift the schools, scan the blue for whale sharks" },
    { time: "13:00", label: "Thai lunch buffet & surface interval" },
    { time: "14:00", label: "Dive 3 - Shark Island: reef life & blacktip reef sharks" },
    { time: "15:30", label: "Back to Koh Tao" },
  ],
  ctaStripHeadline: "Pick your Sail Rock day",
  ctaStripSubhead: "Reserve a spot with a deposit - we confirm the same day.",
  faqHeadline: "Frequently asked",
  faqItems: [
    {
      q: "Which certifications do you accept?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS - anything mainstream. Bring your card or have a digital copy ready.",
    },
    {
      q: "How deep is Sail Rock?",
      a: "The pinnacle drops below 30m, but most of the dive is in the 12-22m range. It can have current, so a little recent experience helps.",
    },
    {
      q: "Will I actually see a whale shark?",
      a: "Sightings are never guaranteed, but Sail Rock is the single best whale-shark spot in the Gulf - peak chances are roughly March-May and Sept-Oct.",
    },
    {
      q: "Do I have to pay a deposit to book?",
      a: "Yes - a deposit secures your spot on the boat (spaces are limited), and the balance is paid here on the island.",
    },
    {
      q: "What's included for 4,000 THB?",
      a: "3 dives (2x Sail Rock + Shark Island), all gear and tanks, a private boat with experienced guides, breakfast, a Thai lunch buffet, drinks and dive insurance. Photos are an optional +500 THB.",
    },
  ],
  closingCtaHeadline: "The next boat leaves",
  closingDateHeadline: "The next boat leaves {date}",
  closingCtaSubhead:
    "Spots on the Sail Rock boat are limited and fill fast. Reserve yours now.",
};

const SAIL_ROCK_ES: LanderCopy = {
  seoTitle: "Bucea en Sail Rock desde Koh Tao - Día Completo, 4,000 THB | Siam Scuba",
  seoDescription:
    "Bucea en Sail Rock (Hin Bai) - la mejor inmersión del Golfo de Tailandia. Excursión de día completo desde Koh Tao: 3 inmersiones (2x Sail Rock + Shark Island), tiburón ballena y la famosa Chimenea. 4,000 THB todo incluido. Google 4,9 (845), TripAdvisor 5,0 (776).",
  heroBadge: "Para buceadores certificados",
  heroEyebrow: "La mejor inmersión del Golfo de Tailandia",
  heroH1: "Bucea en Sail Rock",
  heroSubhead:
    "Hin Bai - el pináculo legendario. Zona de tiburón ballena, la famosa Chimenea vertical y enormes bancos de peces. Excursión de día completo desde Koh Tao, cada 3 días.",
  ratingsLine: "★ Google 4,9 (845 reseñas) · TripAdvisor 5,0 (776 reseñas)",
  ctaPrimary: "Reserva la excursión a Sail Rock",
  ctaSecondary: "O escríbenos por WhatsApp",
  nextBoatPrefix: "Próximo barco",
  securePrefix: "Asegura tu plaza para el",
  departuresLabel: "Salimos cada 3 días · próximas salidas",
  nextBoatLabel: "PRÓXIMO BARCO",
  reserveCta: "Reserva mi plaza",
  whatYouDoHeadline: "Por qué Sail Rock es imperdible",
  whatYouDoSubhead:
    "90 minutos de barco mar adentro te recompensan con la vida marina más rica del Golfo - y la mejor oportunidad de Tailandia para nadar con un tiburón ballena.",
  featureCards: [
    {
      image: SAIL_ROCK_FEATURE_IMAGES.whaleShark,
      title: "Posible tiburón ballena",
      body: "El mejor punto del Golfo para encontrarte con los gigantes gentiles - Sail Rock los atrae.",
    },
    {
      image: SAIL_ROCK_FEATURE_IMAGES.chimney,
      title: "La Chimenea",
      body: "Un emocionante paso vertical que atraviesa el pináculo - una inmersión inolvidable.",
    },
    {
      image: SAIL_ROCK_FEATURE_IMAGES.fish,
      title: "Muros de peces",
      body: "Tornados de barracudas, jureles, peces murciélago y enormes bancos girando alrededor de la roca.",
    },
    {
      image: SAIL_ROCK_FEATURE_IMAGES.boat,
      title: "3 inmersiones en un día",
      body: "Dos inmersiones en Sail Rock y una parada en Shark Island - un día completo en el agua.",
    },
  ],
  uspHeadline: "",
  uspTiles: [],
  pricingHeadline: "",
  pricing: {
    price: "฿4,000",
    perWhat: "por persona · día completo · 3 inmersiones",
    includes: [
      "Equipo completo y botellas (180-200 bar)",
      "Barco privado, guías expertos",
      "Desayuno + buffet de almuerzo tailandés a bordo",
      "Café, té, fruta fresca y galletas",
      "Seguro de buceo incluido",
      "Para buceadores certificados",
    ],
    excludes: [],
  },
  pricingAddon: "+ ฿500 paquete de fotos submarinas (opcional)",
  socialProofHeadline: "4,9 en Google (845) · 5,0 en TripAdvisor (776).",
  socialProofSubhead: "Mira lo que dicen los buceadores tras un día en el barco de Sail Rock.",
  dayTimelineHeadline: "Tu día en el barco",
  dayTimeline: [
    { time: "07:30", label: "Salida de Koh Tao - desayuno a bordo mientras navegamos al pináculo" },
    { time: "09:30", label: "Inmersión 1 - Sail Rock: la Chimenea y las paredes profundas del pináculo" },
    { time: "11:30", label: "Inmersión 2 - Sail Rock: deriva entre los bancos, busca tiburones ballena en el azul" },
    { time: "13:00", label: "Buffet de almuerzo tailandés e intervalo en superficie" },
    { time: "14:00", label: "Inmersión 3 - Shark Island: vida de arrecife y tiburones de punta negra" },
    { time: "15:30", label: "Vuelta a Koh Tao" },
  ],
  ctaStripHeadline: "Elige tu día en Sail Rock",
  ctaStripSubhead: "Reserva tu plaza con un depósito - confirmamos el mismo día.",
  faqHeadline: "Preguntas frecuentes",
  faqItems: [
    {
      q: "¿Qué certificaciones aceptan?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS - todo lo mayoritario. Trae la tarjeta o ten una copia digital.",
    },
    {
      q: "¿Qué profundidad tiene Sail Rock?",
      a: "El pináculo baja de los 30m, pero la mayor parte de la inmersión está entre 12 y 22m. Puede haber corriente, así que algo de experiencia reciente ayuda.",
    },
    {
      q: "¿Veré de verdad un tiburón ballena?",
      a: "No se garantizan, pero Sail Rock es el mejor punto del Golfo para verlos - las mejores fechas son aprox. marzo-mayo y sept-oct.",
    },
    {
      q: "¿Tengo que pagar un depósito para reservar?",
      a: "Sí - un depósito asegura tu plaza en el barco (las plazas son limitadas) y el resto se paga aquí en la isla.",
    },
    {
      q: "¿Qué incluye por 4,000 THB?",
      a: "3 inmersiones (2x Sail Rock + Shark Island), todo el equipo y botellas, barco privado con guías expertos, desayuno, buffet de almuerzo tailandés, bebidas y seguro de buceo. Las fotos son +500 THB opcionales.",
    },
  ],
  closingCtaHeadline: "El próximo barco sale el",
  closingDateHeadline: "El próximo barco sale el {date}",
  closingCtaSubhead:
    "Las plazas en el barco de Sail Rock son limitadas y se llenan rápido. Reserva la tuya ahora.",
};

const SAIL_ROCK_HE: LanderCopy = {
  seoTitle: "צלילה בסייל רוק מקוטאו - יום שלם, 4,000 THB | סיאם סקובה",
  seoDescription:
    "צלילה בסייל רוק (הין באי) - הצלילה הכי טובה במפרץ תאילנד. טיול יום שלם מקוטאו: 3 צלילות (2x סייל רוק + שארק איילנד), סיכוי לכריש לוויתן וה\"ארובה\" המפורסמת. 4,000 THB הכל כלול. גוגל 4.9 (845), טריפאדוויזר 5.0 (776).",
  heroBadge: "לצוללים מוסמכים",
  heroEyebrow: "הצלילה הכי טובה במפרץ תאילנד",
  heroH1: "צלילה בסייל רוק",
  heroSubhead:
    "הין באי - הפינה האגדית. אזור כרישי הלוויתן, ה\"ארובה\" האנכית המפורסמת ולהקות ענק של דגים. טיול יום שלם מקוטאו, כל 3 ימים.",
  ratingsLine: "★ גוגל 4.9 (845 ביקורות) · טריפאדוויזר 5.0 (776 ביקורות)",
  ctaPrimary: "הזמינו את טיול סייל רוק",
  ctaSecondary: "או כתבו לנו ב-WhatsApp",
  nextBoatPrefix: "הסירה הבאה",
  securePrefix: "שריינו מקום ל-",
  departuresLabel: "יוצאים כל 3 ימים · יציאות קרובות",
  nextBoatLabel: "הסירה הבאה",
  reserveCta: "שריינו לי מקום",
  whatYouDoHeadline: "למה אסור לפספס את סייל רוק",
  whatYouDoSubhead:
    "90 דקות שיט אל הים הפתוח מתגמלות אתכם בחיים הימיים העשירים ביותר במפרץ - והסיכוי הכי טוב בתאילנד לשחות עם כריש לוויתן.",
  featureCards: [
    {
      image: SAIL_ROCK_FEATURE_IMAGES.whaleShark,
      title: "סיכוי לכריש לוויתן",
      body: "הנקודה הכי טובה במפרץ לפגוש את הענקים העדינים - סייל רוק מושך אותם.",
    },
    {
      image: SAIL_ROCK_FEATURE_IMAGES.chimney,
      title: "הארובה",
      body: "מעבר אנכי מרגש שחותך דרך הפינה - צלילת חתימה אמיתית.",
    },
    {
      image: SAIL_ROCK_FEATURE_IMAGES.fish,
      title: "קירות של דגים",
      body: "מערבולות ברקודה, טרוולי, דגי עטלף ולהקות ענק שמסתחררות סביב הסלע.",
    },
    {
      image: SAIL_ROCK_FEATURE_IMAGES.boat,
      title: "3 צלילות ביום",
      body: "שתי צלילות בסייל רוק ועצירה בשארק איילנד - יום שלם על המים.",
    },
  ],
  uspHeadline: "",
  uspTiles: [],
  pricingHeadline: "",
  pricing: {
    price: "฿4,000",
    perWhat: "לאדם · יום שלם · 3 צלילות",
    includes: [
      "ציוד צלילה מלא ובלונים (180-200 bar)",
      "סירה פרטית, מדריכים מנוסים",
      "ארוחת בוקר + בופה צהריים תאי על הסירה",
      "קפה, תה, פירות טריים ועוגיות",
      "ביטוח צלילה כלול",
      "לצוללים מוסמכים",
    ],
    excludes: [],
  },
  pricingAddon: "+ ฿500 חבילת תמונות מתחת למים (אופציונלי)",
  socialProofHeadline: "4.9 בגוגל (845) · 5.0 בטריפאדוויזר (776).",
  socialProofSubhead: "תראו מה צוללים מספרים אחרי יום על סירת סייל רוק איתנו.",
  dayTimelineHeadline: "היום שלכם על הסירה",
  dayTimeline: [
    { time: "07:30", label: "יציאה מקוטאו - ארוחת בוקר על הסירה בדרך לפינה" },
    { time: "09:30", label: "צלילה 1 - סייל רוק: הארובה וקירות הפינה העמוקים" },
    { time: "11:30", label: "צלילה 2 - סייל רוק: שייט עם הלהקות, סורקים את הכחול לכריש לוויתן" },
    { time: "13:00", label: "בופה צהריים תאי והפסקת פני שטח" },
    { time: "14:00", label: "צלילה 3 - שארק איילנד: חיי שונית וכרישי שונית שחורי-קצה" },
    { time: "15:30", label: "חזרה לקוטאו" },
  ],
  ctaStripHeadline: "בחרו את יום סייל רוק שלכם",
  ctaStripSubhead: "שריינו מקום עם מקדמה - אנחנו מאשרים באותו יום.",
  faqHeadline: "שאלות נפוצות",
  faqItems: [
    {
      q: "אילו הסמכות אתם מקבלים?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS - כל מה שמרכזי. הביאו את הכרטיס או צילום דיגיטלי.",
    },
    {
      q: "כמה עמוק סייל רוק?",
      a: "הפינה יורדת מתחת ל-30 מטר, אבל רוב הצלילה בטווח 12-22 מטר. יכול להיות זרם, אז קצת ניסיון עדכני עוזר.",
    },
    {
      q: "באמת אראה כריש לוויתן?",
      a: "אין הבטחה, אבל סייל רוק היא הנקודה הכי טובה במפרץ לכרישי לוויתן - הסיכויים הטובים ביותר בערך מרץ-מאי וספטמבר-אוקטובר.",
    },
    {
      q: "צריך לשלם מקדמה כדי להזמין?",
      a: "כן - מקדמה שומרת לכם מקום על הסירה (המקומות מוגבלים), והיתרה משולמת כאן באי.",
    },
    {
      q: "מה כלול ב-4,000 THB?",
      a: "3 צלילות (2x סייל רוק + שארק איילנד), כל הציוד והבלונים, סירה פרטית עם מדריכים מנוסים, ארוחת בוקר, בופה צהריים תאי, שתייה וביטוח צלילה. תמונות בתוספת 500 THB אופציונלית.",
    },
  ],
  closingCtaHeadline: "הסירה הבאה יוצאת ב-",
  closingDateHeadline: "הסירה הבאה יוצאת ב-{date}",
  closingCtaSubhead:
    "המקומות על סירת סייל רוק מוגבלים ומתמלאים מהר. שריינו את שלכם עכשיו.",
};

export const LANDER_COPY: Record<Offer, Record<Lang, LanderCopy>> = {
  dsd: { en: DSD_EN, es: DSD_ES, he: DSD_HE },
  owd: { en: OWD_EN, es: OWD_ES, he: OWD_HE },
  aow: { en: AOW_EN, es: AOW_ES, he: AOW_HE },
  "fun-dive": { en: FUN_EN, es: FUN_ES, he: FUN_HE },
  "koh-tao": { en: KOH_TAO_EN, es: KOH_TAO_ES, he: KOH_TAO_HE },
  "sail-rock": { en: SAIL_ROCK_EN, es: SAIL_ROCK_ES, he: SAIL_ROCK_HE },
};

const SITE = "https://siamscuba.com";

const SLUGS: Record<Offer, string> = {
  dsd: "discover-scuba-diving",
  owd: "open-water-course",
  aow: "advanced-open-water-course",
  "fun-dive": "fun-dives",
  "koh-tao": "koh-tao-diving",
  "sail-rock": "sail-rock-diving",
};

function langPrefix(lang: Lang): string {
  return lang === "en" ? "" : `/${lang}`;
}

export function landerUrl(offer: Offer, lang: Lang): string {
  return `${SITE}${langPrefix(lang)}/${SLUGS[offer]}`;
}

export function landerHreflangAlternates(offer: Offer): Partial<Record<Lang, string>> {
  return {
    en: landerUrl(offer, "en"),
    es: landerUrl(offer, "es"),
    he: landerUrl(offer, "he"),
  };
}

// JSON-LD pricing - uses the lower tier as the headline price (with availability/options
// detailed in copy). Schema.org Offer expects a single number per Offer.
const PRICES: Record<Offer, { price: string; currency: string; duration: string }> = {
  dsd: { price: "2600", currency: "THB", duration: "P1D" },
  owd: { price: "12000", currency: "THB", duration: "P2DT12H" },
  aow: { price: "11000", currency: "THB", duration: "P1DT12H" },
  "fun-dive": { price: "2000", currency: "THB", duration: "PT4H" },
  "koh-tao": { price: "2000", currency: "THB", duration: "PT4H" },
  "sail-rock": { price: "4000", currency: "THB", duration: "PT8H" },
};

function buildFaqJsonLd(offer: Offer, lang: Lang): Record<string, unknown> {
  const copy = LANDER_COPY[offer][lang];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function buildLanderJsonLd(offer: Offer, lang: Lang): Record<string, unknown>[] {
  const copy = LANDER_COPY[offer][lang];
  const url = landerUrl(offer, lang);
  const meta = PRICES[offer];

  const primary: Record<string, unknown> =
    offer === "fun-dive" || offer === "koh-tao" || offer === "sail-rock"
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: copy.heroH1,
          description: copy.seoDescription,
          url,
          provider: { "@type": "Organization", name: "Siam Scuba", "@id": `${SITE}/#organization` },
          areaServed: { "@type": "Place", name: "Koh Tao" },
          offers: {
            "@type": "Offer",
            price: meta.price,
            priceCurrency: meta.currency,
            availability: "https://schema.org/InStock",
            url,
          },
        }
      : {
          "@context": "https://schema.org",
          "@type": "Course",
          name: copy.heroH1,
          description: copy.seoDescription,
          url,
          provider: { "@type": "Organization", name: "Siam Scuba", "@id": `${SITE}/#organization` },
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "onsite",
            duration: meta.duration,
          },
          offers: {
            "@type": "Offer",
            price: meta.price,
            priceCurrency: meta.currency,
            availability: "https://schema.org/InStock",
            url,
          },
        };

  return [primary, buildFaqJsonLd(offer, lang)];
}
