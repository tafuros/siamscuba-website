// Paid-campaign landing-page copy. One dict per (offer, language).
// EN is the master draft; ES + HE are first-cut translations and flagged
// for native review before launch (see Phase 0 in the plan).
//
// Strings are intentionally inlined here (not in src/i18n/translations.ts)
// because campaign landers must render the AD's language regardless of any
// returning-visitor preference stored in localStorage.

export type Offer = "dsd" | "owd" | "fun-dive";
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

export interface UspTile {
  icon: "shield" | "users" | "boat" | "calendar" | "award" | "heart";
  // When set, the tile renders this brand badge image instead of the lucide icon.
  badge?: "padi5star";
  title: string;
  body: string;
}

export interface LanderCopy {
  seoTitle: string;
  seoDescription: string;
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
}

// ---------- DSD (Discover Scuba Diving) ----------

const DSD_EN: LanderCopy = {
  seoTitle: "Discover Scuba Diving in Koh Tao – Two Dives 3,600 THB | Siam Scuba",
  seoDescription:
    "Try scuba diving in Koh Tao — 2 dives 3,600 THB, all gear and PADI instructor included. Or 1 dive 2,600 THB. Small groups, two custom boats, no certification needed.",
  heroBadge: "PADI Discover Scuba Diving",
  heroH1: "Try scuba diving in Koh Tao — 2 dives, 3,600 THB",
  heroSubhead:
    "No certification needed. A PADI instructor takes you from your first breath underwater to two real ocean dives on Koh Tao's reefs — all in one day. Want just one dive? 2,600 THB.",
  ctaPrimary: "Chat on WhatsApp",
  ctaSecondary: "Or send a quick message",
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
    { time: "Dive 2", label: "Just enjoy — no skills, max 12m" },
    { time: "16:00", label: "Activity ends" },
  ],
  ctaStripHeadline: "Ready to take the first breath?",
  ctaStripSubhead: "Tell us your dates on WhatsApp — usually we reply within minutes.",
  faqHeadline: "Frequently asked",
  faqItems: [
    {
      q: "Do I need to know how to swim?",
      a: "You should be comfortable in water and able to float on your back. Olympic swimming is not required.",
    },
    {
      q: "What's the minimum age?",
      a: "10 years old. Kids 8-9 can do the Bubble Maker program — ask us on WhatsApp.",
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
      a: "Yes — your DSD pool session counts toward your first confined-water dive if you continue with us within 6 months.",
    },
  ],
  closingCtaHeadline: "Two dives, one day, 3,600 THB.",
  closingCtaSubhead: "Or one dive for 2,600 THB. WhatsApp us — we'll find you a slot this week.",
};

const DSD_ES: LanderCopy = {
  seoTitle: "Discover Scuba Diving en Koh Tao – Dos Inmersiones 3,600 THB | Siam Scuba",
  seoDescription:
    "Prueba el buceo en Koh Tao — 2 inmersiones 3,600 THB, equipo e instructor PADI incluidos. O 1 inmersión 2,600 THB. Grupos pequeños, dos barcos propios, sin certificación previa.",
  heroBadge: "PADI Discover Scuba Diving",
  heroH1: "Prueba el buceo en Koh Tao — 2 inmersiones, 3,600 THB",
  heroSubhead:
    "Sin certificación previa. Un instructor PADI te lleva desde tu primera respiración bajo el agua hasta dos inmersiones reales en los arrecifes de Koh Tao, todo en un día. ¿Solo una inmersión? 2,600 THB.",
  ctaPrimary: "Chatea por WhatsApp",
  ctaSecondary: "O envíanos un mensaje rápido",
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
    { time: "Inmersión 2", label: "Solo disfrutar — sin habilidades, hasta 12m" },
    { time: "16:00", label: "Fin de la actividad" },
  ],
  ctaStripHeadline: "¿Listo para la primera respiración?",
  ctaStripSubhead: "Cuéntanos tus fechas por WhatsApp — solemos responder en minutos.",
  faqHeadline: "Preguntas frecuentes",
  faqItems: [
    {
      q: "¿Necesito saber nadar?",
      a: "Debes sentirte cómodo en el agua y poder flotar boca arriba. No hace falta nadar como un olímpico.",
    },
    {
      q: "¿Cuál es la edad mínima?",
      a: "10 años. Niños de 8-9 pueden hacer el programa Bubble Maker — pregúntanos por WhatsApp.",
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
      a: "Sí — la sesión de piscina cuenta como tu primera inmersión confinada si continúas con nosotros en 6 meses.",
    },
  ],
  closingCtaHeadline: "Dos inmersiones, un día, 3,600 THB.",
  closingCtaSubhead: "O una inmersión por 2,600 THB. Escríbenos por WhatsApp — te buscamos hueco esta semana.",
};

const DSD_HE: LanderCopy = {
  seoTitle: "צלילת היכרות בקוטאו – שתי צלילות ב-3,600 THB | סיאם סקובה",
  seoDescription:
    "תנסו צלילה בקוטאו — 2 צלילות ב-3,600 THB, כל הציוד ומדריך PADI כלולים. או צלילה אחת ב-2,600 THB. קבוצות קטנות, שתי סירות פרטיות, ללא הסמכה קודמת.",
  heroBadge: "PADI Discover Scuba Diving",
  heroH1: "צלילת היכרות בקוטאו — שתי צלילות, 3,600 THB",
  heroSubhead:
    "ללא הסמכה קודמת. מדריך PADI לוקח אתכם מהנשימה הראשונה מתחת למים עד שתי צלילות אמיתיות בשונית של קוטאו — הכל ביום אחד. רוצים רק צלילה אחת? 2,600 THB.",
  ctaPrimary: "שיחה ב-WhatsApp",
  ctaSecondary: "או שלחו הודעה מהירה",
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
    { time: "צלילה 2", label: "פשוט נהנים — בלי תרגילים, עומק עד 12 מ׳" },
    { time: "16:00", label: "סיום הפעילות" },
  ],
  ctaStripHeadline: "מוכנים לנשימה הראשונה?",
  ctaStripSubhead: "כתבו לנו ב-WhatsApp את התאריכים — בדרך כלל אנחנו עונים תוך דקות.",
  faqHeadline: "שאלות נפוצות",
  faqItems: [
    {
      q: "צריך לדעת לשחות?",
      a: "אתם צריכים להרגיש בנוח במים ולהיות מסוגלים לצוף על הגב. לא צריך לשחות כמו אלוף אולימפי.",
    },
    {
      q: "מה גיל המינימום?",
      a: "גיל 10. ילדים בני 8-9 יכולים לעשות את תוכנית Bubble Maker — שאלו אותנו ב-WhatsApp.",
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
      a: "כן — מפגש הבריכה נחשב לצלילת התרגול הראשונה אם תמשיכו איתנו תוך 6 חודשים.",
    },
  ],
  closingCtaHeadline: "שתי צלילות, יום אחד, 3,600 THB.",
  closingCtaSubhead: "או צלילה אחת ב-2,600 THB. כתבו לנו ב-WhatsApp — נמצא לכם משבצת השבוע.",
};

// ---------- OWD (PADI Open Water Diver) ----------

const OWD_EN: LanderCopy = {
  seoTitle: "PADI Open Water Course in Koh Tao – 12,000 THB Lifelong Cert | Siam Scuba",
  seoDescription:
    "Get PADI certified in 2.5 days on Koh Tao. Small groups (max 4), classroom + pool + four ocean dives, 2 nights' accommodation included. Lifelong certification.",
  heroBadge: "PADI Open Water Diver",
  heroH1: "Get PADI certified in Koh Tao — 2.5 days, 12,000 THB, lifelong",
  heroSubhead:
    "Theory online and in our classroom, pool practice, then four real ocean dives — all in 2.5 days. You leave with a PADI card you can dive on anywhere in the world, forever.",
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
      "2 nights' accommodation — free",
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
    { time: "Day 2", label: "Theory, then boat — sea drills and a dive to 12m, second dive at 14:00, back by 16:00" },
    { time: "Day 3", label: "06:00 dawn dive to 18m · 10:00 final dive · certified by 11:00 🎉" },
  ],
  ctaStripHeadline: "Start your course this week",
  ctaStripSubhead: "Send your travel dates on WhatsApp and we'll find a start day that fits.",
  faqHeadline: "Frequently asked",
  faqItems: [
    {
      q: "Do I need to know how to swim?",
      a: "Yes — you need to be able to swim 200m unaided and float for 10 minutes. Stroke doesn't matter.",
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
      a: "Minimum 10 (Junior Open Water — limited to 12m). 15+ for the full Open Water Diver cert.",
    },
    {
      q: "Can I add Advanced after?",
      a: "Yes, and we discount it heavily if you book together. Ask on WhatsApp.",
    },
  ],
  closingCtaHeadline: "PADI cert. 2.5 days. 12,000 THB.",
  closingCtaSubhead: "Two nights' accommodation included. WhatsApp us your dates — we start courses every day.",
};

const OWD_ES: LanderCopy = {
  seoTitle: "Curso PADI Open Water en Koh Tao – Certificación de por Vida 12,000 THB | Siam Scuba",
  seoDescription:
    "Sácate el PADI en 2,5 días en Koh Tao. Grupos pequeños (máx. 4), teoría + piscina + cuatro inmersiones, 2 noches de alojamiento incluidas. Certificación de por vida.",
  heroBadge: "PADI Open Water Diver",
  heroH1: "Certifícate PADI en Koh Tao — 2,5 días, 12,000 THB, de por vida",
  heroSubhead:
    "Teoría online y en nuestra aula, prácticas en piscina y cuatro inmersiones reales en el mar — todo en 2,5 días. Te vas con una tarjeta PADI válida en cualquier centro del mundo, para siempre.",
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
      "2 noches de alojamiento — gratis",
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
    { time: "Día 2", label: "Teoría y barco — prácticas en el mar e inmersión a 12m, segunda inmersión a las 14:00, vuelta a las 16:00" },
    { time: "Día 3", label: "06:00 inmersión al amanecer a 18m · 10:00 última inmersión · certificado a las 11:00 🎉" },
  ],
  ctaStripHeadline: "Empieza tu curso esta semana",
  ctaStripSubhead: "Envía tus fechas por WhatsApp y te buscamos un día de inicio que encaje.",
  faqHeadline: "Preguntas frecuentes",
  faqItems: [
    {
      q: "¿Necesito saber nadar?",
      a: "Sí — debes nadar 200m sin ayuda y flotar 10 minutos. El estilo no importa.",
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
  closingCtaSubhead: "2 noches de alojamiento incluidas. WhatsApp con tus fechas — abrimos cursos cada día.",
};

const OWD_HE: LanderCopy = {
  seoTitle: "קורס PADI Open Water בקוטאו – הסמכה לכל החיים ב-12,000 THB | סיאם סקובה",
  seoDescription:
    "תוסמכו ל-PADI ב-2.5 ימים בקוטאו. קבוצות קטנות (מקס׳ 4), תיאוריה + בריכה + ארבע צלילות בים, 2 לילות לינה כלולים. הסמכה לכל החיים.",
  heroBadge: "PADI Open Water Diver",
  heroH1: "הסמכת PADI בקוטאו — 2.5 ימים, 12,000 THB, לכל החיים",
  heroSubhead:
    "לימוד עיוני אונליין + שיעור במועדון, תרגול בבריכה, ואז ארבע צלילות אמיתיות בים — הכל ב-2.5 ימים. יוצאים עם כרטיס PADI שצוללים איתו בכל מקום בעולם, לכל החיים.",
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
    { time: "יום 2", label: "תיאוריה, ואז סירה — תרגול בים וצלילה עד 12 מ׳, צלילה שנייה ב-14:00, חזרה ב-16:00" },
    { time: "יום 3", label: "06:00 צלילת שחר עד 18 מ׳ · 10:00 צלילה אחרונה · מוסמכים ב-11:00 🎉" },
  ],
  ctaStripHeadline: "התחילו את הקורס השבוע",
  ctaStripSubhead: "שלחו תאריכי טיול ב-WhatsApp ונמצא יום פתיחה שמתאים.",
  faqHeadline: "שאלות נפוצות",
  faqItems: [
    {
      q: "צריך לדעת לשחות?",
      a: "כן — צריך לשחות 200 מטר ללא עזרה ולצוף 10 דקות. הסגנון לא משנה.",
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
  closingCtaSubhead: "2 לילות לינה כלולים. WhatsApp עם התאריכים — פותחים קורסים כל יום.",
};

// ---------- Fun Dive ----------

const FUN_EN: LanderCopy = {
  seoTitle: "Fun Dives in Koh Tao – Guided Day Trips from 2,000 THB | Siam Scuba",
  seoDescription:
    "Certified divers — book guided fun dives in Koh Tao. Two morning or afternoon dives 2,000 THB. Full-day Sail Rock 3,800 THB. Small groups, two custom boats.",
  heroBadge: "For certified divers",
  heroH1: "Fun dives in Koh Tao — small groups, custom boats, from 2,000 THB",
  heroSubhead:
    "You're already certified. Pick your day, pick your sites — Chumphon Pinnacle, Sail Rock, Twins, Shark Island. We handle the boat, the gear, the guide.",
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
    price: "2,000 / 3,800 THB",
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
  socialProofHeadline: "Trusted by 778 reviewers on TripAdvisor — 5.0 stars.",
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
      blurb: "Wall dive on the south side. Reef sharks, turtles, anemones — usually our second dive.",
    },
    {
      name: "Hin Wong Pinnacle",
      blurb: "Quieter site, great viz on flat days. Best for photographers.",
    },
    {
      name: "Southwest Pinnacle",
      blurb: "A cluster of pinnacles dropping to 28m. Big schools, groupers, whale sharks in season — quieter than Chumphon.",
    },
    {
      name: "White Rock",
      blurb: "Koh Tao's biggest reef and a local favourite. Easy terrain, tons of fish, great for a relaxed dive or a night dive.",
    },
    {
      name: "Mango Bay",
      blurb: "Shallow, calm bay on the north coast. Healthy hard coral and macro life — perfect for easy, long, low-current dives.",
    },
  ],
  ctaStripHeadline: "Pick your dive day",
  ctaStripSubhead: "Book online or send dates on WhatsApp — we'll confirm the same day.",
  faqHeadline: "Frequently asked",
  faqItems: [
    {
      q: "Which certifications do you accept?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS — anything mainstream. Bring your card or have a digital copy ready.",
    },
    {
      q: "I haven't dived in 2+ years. Should I do a refresher?",
      a: "Yes. We offer a quick refresher (Scuba Review) for 2,500 THB — two skills sessions plus a shallow dive. Saves you skipping the first fun dive in confusion.",
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
  closingCtaSubhead: "Tap below to book — or WhatsApp us your preferred dates.",
};

const FUN_ES: LanderCopy = {
  seoTitle: "Inmersiones Guiadas en Koh Tao – Desde 2,000 THB | Siam Scuba",
  seoDescription:
    "Buceadores certificados — reserva inmersiones guiadas en Koh Tao. Dos inmersiones mañana o tarde 2,000 THB. Día completo Sail Rock 3,800 THB. Grupos pequeños, barcos propios.",
  heroBadge: "Para buceadores certificados",
  heroH1: "Buceo en Koh Tao — grupos pequeños, barcos propios, desde 2,000 THB",
  heroSubhead:
    "Ya estás certificado. Elige el día, elige los sitios — Chumphon Pinnacle, Sail Rock, Twins, Shark Island. Nosotros nos ocupamos del barco, el equipo y el guía.",
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
    price: "2,000 / 3,800 THB",
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
  socialProofSubhead: "Los clientes que más repiten. Vuelven una y otra vez — ya verás por qué.",
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
      blurb: "Pared en la cara sur. Tiburones de arrecife, tortugas, anémonas — suele ser nuestra segunda inmersión.",
    },
    {
      name: "Hin Wong Pinnacle",
      blurb: "Sitio más tranquilo, gran visibilidad en días planos. El favorito de los fotógrafos.",
    },
    {
      name: "Southwest Pinnacle",
      blurb: "Conjunto de pináculos que baja a 28m. Grandes bancos, meros y tiburones ballena en temporada — más tranquilo que Chumphon.",
    },
    {
      name: "White Rock",
      blurb: "El arrecife más grande de Koh Tao y un clásico local. Terreno fácil, muchísimos peces, ideal para una inmersión relajada o nocturna.",
    },
    {
      name: "Mango Bay",
      blurb: "Bahía poco profunda y tranquila en la costa norte. Coral duro sano y vida macro — perfecta para inmersiones largas y sin corriente.",
    },
  ],
  ctaStripHeadline: "Elige tu día de buceo",
  ctaStripSubhead: "Reserva online o envíanos fechas por WhatsApp — confirmamos el mismo día.",
  faqHeadline: "Preguntas frecuentes",
  faqItems: [
    {
      q: "¿Qué certificaciones aceptan?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS — todo lo mayoritario. Trae la tarjeta o ten una copia digital.",
    },
    {
      q: "Llevo 2+ años sin bucear. ¿Debo hacer un repaso?",
      a: "Sí. Ofrecemos un Scuba Review rápido por 2,500 THB — dos sesiones de habilidades más una inmersión poco profunda. Mejor que perderse la primera inmersión.",
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
  closingCtaSubhead: "Pulsa abajo para reservar — o escríbenos por WhatsApp con tus fechas.",
};

const FUN_HE: LanderCopy = {
  seoTitle: "צלילות פאן בקוטאו – יציאות יומיות מ-2,000 THB | סיאם סקובה",
  seoDescription:
    "צוללים מוסמכים — הזמינו צלילות פאן מודרכות בקוטאו. שתי צלילות בוקר או אחרי הצהריים ב-2,000 THB. יום שלם ב-Sail Rock ב-3,800 THB. קבוצות קטנות, סירות פרטיות.",
  heroBadge: "לצוללים מוסמכים",
  heroH1: "צלילות פאן בקוטאו — קבוצות קטנות, סירות פרטיות, מ-2,000 THB",
  heroSubhead:
    "כבר מוסמכים. בחרו יום, בחרו אתרים — Chumphon Pinnacle, Sail Rock, Twins, Shark Island. אנחנו מטפלים בסירה, בציוד ובמדריך.",
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
    price: "2,000 / 3,800 THB",
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
  socialProofSubhead: "הכי הרבה לקוחות חוזרים שאי פעם היו לנו. הם חוזרים שוב ושוב — אתם תראו למה.",
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
      blurb: "צלילת קיר בצד הדרומי. כרישי שונית, צבים, שושנות — בדרך כלל הצלילה השנייה שלנו.",
    },
    {
      name: "Hin Wong Pinnacle",
      blurb: "אתר שקט יותר, ראות מצוינת בימים שטוחים. אהוב על צלמים.",
    },
    {
      name: "Southwest Pinnacle",
      blurb: "אשכול טבעות שיורד ל-28 מטר. להקות גדולות, דקרים, וכריש לוויתן בעונה — שקט יותר מ-Chumphon.",
    },
    {
      name: "White Rock",
      blurb: "השונית הגדולה בקוטאו ואהובה על המקומיים. שטח קל, המון דגים, מצוין לצלילה רגועה או לצלילת לילה.",
    },
    {
      name: "Mango Bay",
      blurb: "מפרץ רדוד ושקט בצפון האי. אלמוגים קשים בריאים וחיי מאקרו — מושלם לצלילות ארוכות בלי זרם.",
    },
  ],
  ctaStripHeadline: "בחרו יום צלילה",
  ctaStripSubhead: "הזמינו אונליין או שלחו תאריכים ב-WhatsApp — נאשר באותו יום.",
  faqHeadline: "שאלות נפוצות",
  faqItems: [
    {
      q: "אילו הסמכות אתם מקבלים?",
      a: "PADI, SSI, NAUI, BSAC, RAID, CMAS — כל מה שמרכזי. הביאו את הכרטיס או צילום דיגיטלי.",
    },
    {
      q: "לא צללתי 2+ שנים. כדאי לעשות רענון?",
      a: "כן. יש לנו Scuba Review מהיר ב-2,500 THB — שני מפגשי תרגול וצלילה רדודה. עדיף מאשר להפסיד את הצלילה הראשונה בבלבול.",
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
  closingCtaSubhead: "לחצו למטה להזמנה — או WhatsApp עם התאריכים המועדפים.",
};

export const LANDER_COPY: Record<Offer, Record<Lang, LanderCopy>> = {
  dsd: { en: DSD_EN, es: DSD_ES, he: DSD_HE },
  owd: { en: OWD_EN, es: OWD_ES, he: OWD_HE },
  "fun-dive": { en: FUN_EN, es: FUN_ES, he: FUN_HE },
};

const SITE = "https://siamscuba.com";

const SLUGS: Record<Offer, string> = {
  dsd: "discover-scuba-diving",
  owd: "open-water-course",
  "fun-dive": "fun-dives",
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

// JSON-LD pricing — uses the lower tier as the headline price (with availability/options
// detailed in copy). Schema.org Offer expects a single number per Offer.
const PRICES: Record<Offer, { price: string; currency: string; duration: string }> = {
  dsd: { price: "2600", currency: "THB", duration: "P1D" },
  owd: { price: "12000", currency: "THB", duration: "P2DT12H" },
  "fun-dive": { price: "2000", currency: "THB", duration: "PT4H" },
};

export function buildLanderJsonLd(offer: Offer, lang: Lang): Record<string, unknown> {
  const copy = LANDER_COPY[offer][lang];
  const url = landerUrl(offer, lang);
  const meta = PRICES[offer];

  if (offer === "fun-dive") {
    return {
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
    };
  }

  return {
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
}
