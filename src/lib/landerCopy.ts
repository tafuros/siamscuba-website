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
      title: "Max 4 students per instructor",
      body: "Real attention, real safety. Not a 12-person cattle dive.",
    },
    {
      icon: "boat",
      title: "Two custom dive boats",
      body: "We don't share boats with other shops, so the schedule actually runs on time.",
    },
    {
      icon: "shield",
      title: "PADI 5-Star Center",
      body: "Same standards as the biggest shops on the island, with a fraction of the people.",
    },
  ],
  pricingHeadline: "What's included",
  pricing: {
    price: "2,600 / 3,600 THB",
    perWhat: "1 dive / 2 dives, all in",
    includes: [
      "Full day with a PADI instructor",
      "All scuba gear (mask, fins, wetsuit, BCD, regulator)",
      "Confined-water training session",
      "1 or 2 ocean dives on the reef (your choice)",
      "Boat trip with snacks and water",
      "PADI Discover Scuba Diving certificate",
    ],
    excludes: ["Pickup from your hotel", "Underwater photos (add-on available)"],
  },
  socialProofHeadline: "778 reviews. 4.9 stars on TripAdvisor.",
  socialProofSubhead: "What divers say after their first day under the surface with us.",
  whatYouDoHeadline: "Your day, hour by hour",
  whatYouDoSubhead:
    "We keep groups small so the schedule actually runs on time. You're back at the shop by late afternoon, in time for sunset on the beach.",
  schedule: [
    { time: "08:00", label: "Welcome, paperwork, intro briefing" },
    { time: "09:00", label: "Confined-water skills in shallow, calm water" },
    { time: "11:00", label: "Boat to a shallow reef site (Hin Wong, White Rock)" },
    { time: "12:30", label: "Open-water dive(s) — 1 or 2 dives on the reef" },
    { time: "14:30", label: "Back to the shop, debrief, certificate" },
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
      title: "Máximo 4 alumnos por instructor",
      body: "Atención real, seguridad real. No una inmersión masiva de 12 personas.",
    },
    {
      icon: "boat",
      title: "Dos barcos de buceo propios",
      body: "No compartimos barco con otras tiendas, así que el horario se cumple.",
    },
    {
      icon: "shield",
      title: "Centro PADI 5 estrellas",
      body: "Los mismos estándares que las grandes tiendas, con mucha menos gente.",
    },
  ],
  pricingHeadline: "Qué incluye",
  pricing: {
    price: "2,600 / 3,600 THB",
    perWhat: "1 inmersión / 2 inmersiones, todo incluido",
    includes: [
      "Día completo con instructor PADI",
      "Equipo completo (máscara, aletas, traje, chaleco, regulador)",
      "Sesión en aguas confinadas",
      "1 o 2 inmersiones en el arrecife (tú eliges)",
      "Salida en barco con snacks y agua",
      "Certificado PADI Discover Scuba Diving",
    ],
    excludes: ["Recogida en hotel", "Fotos subacuáticas (servicio extra)"],
  },
  socialProofHeadline: "778 reseñas. 4,9 estrellas en TripAdvisor.",
  socialProofSubhead: "Lo que dicen los buceadores después de su primer día bajo el agua con nosotros.",
  whatYouDoHeadline: "Tu día, hora por hora",
  whatYouDoSubhead:
    "Mantenemos grupos pequeños para cumplir el horario. Estarás de vuelta a media tarde, a tiempo para el atardecer.",
  schedule: [
    { time: "08:00", label: "Bienvenida, papeleo, briefing" },
    { time: "09:00", label: "Prácticas en aguas confinadas y poco profundas" },
    { time: "11:00", label: "Barco a un arrecife poco profundo (Hin Wong, White Rock)" },
    { time: "12:30", label: "Inmersión(es) en el mar — 1 o 2 inmersiones en el arrecife" },
    { time: "14:30", label: "Vuelta a la tienda, debrief, certificado" },
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
      title: "מקסימום 4 חניכים לכל מדריך",
      body: "תשומת לב אמיתית. לא צלילה המונית של 12 אנשים.",
    },
    {
      icon: "boat",
      title: "שתי סירות צלילה פרטיות",
      body: "אנחנו לא חולקים סירה עם חנויות אחרות, אז הלו״ז עובד בזמן.",
    },
    {
      icon: "shield",
      title: "מרכז PADI 5 כוכבים",
      body: "אותם סטנדרטים של החנויות הגדולות, עם הרבה פחות אנשים.",
    },
  ],
  pricingHeadline: "מה כלול",
  pricing: {
    price: "2,600 / 3,600 THB",
    perWhat: "צלילה אחת / שתי צלילות, הכל כלול",
    includes: [
      "יום שלם עם מדריך PADI",
      "כל ציוד הצלילה (מסכה, סנפירים, חליפה, מצוף, רגולטור)",
      "תרגול מיומנויות במים רדודים",
      "1 או 2 צלילות בשונית (לבחירתכם)",
      "סירה עם חטיפים ומים",
      "תעודת PADI Discover Scuba Diving",
    ],
    excludes: ["איסוף מהמלון", "תמונות מתחת למים (תוספת בתשלום)"],
  },
  socialProofHeadline: "778 ביקורות. 4.9 כוכבים ב-TripAdvisor.",
  socialProofSubhead: "מה צוללים אומרים אחרי היום הראשון שלהם איתנו מתחת למים.",
  whatYouDoHeadline: "היום שלכם, שעה אחר שעה",
  whatYouDoSubhead:
    "אנחנו שומרים על קבוצות קטנות כדי שהלו״ז ייסגר בזמן. אתם חוזרים אחרי הצהריים, בזמן לשקיעה על החוף.",
  schedule: [
    { time: "08:00", label: "קבלת פנים, ניירת, תדריך" },
    { time: "09:00", label: "תרגול מיומנויות במים רדודים" },
    { time: "11:00", label: "סירה לאתר שונית רדוד (Hin Wong, White Rock)" },
    { time: "12:30", label: "צלילות בים — 1 או 2 צלילות בשונית" },
    { time: "14:30", label: "חזרה לחנות, סיכום, תעודה" },
  ],
  ctaStripHeadline: "מוכנים לנשימה הראשונה?",
  ctaStripSubhead: "כתבו לנו ב-WhatsApp את התאריכים — בדרך כלל אנחנו עונים תוך דקות.",
  faqHeadline: "שאלות נפוצות",
  faqItems: [
    {
      q: "צריך לדעת לשחות?",
      a: "אתם צריכים להרגיש בנוח במים ולהיות מסוגלים לצוף על הגב. שחיית אולימפיאדה לא נדרשת.",
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
  seoTitle: "PADI Open Water Course in Koh Tao – 11,000 THB Lifelong Cert | Siam Scuba",
  seoDescription:
    "Get PADI certified in 3-4 days on Koh Tao. Small groups (max 4), two custom boats, instructor-led classroom + pool + four ocean dives. Lifelong certification.",
  heroBadge: "PADI Open Water Diver",
  heroH1: "Get PADI certified in Koh Tao — 3-4 days, 11,000 THB, lifelong",
  heroSubhead:
    "Theory in the morning, pool in the afternoon, four real ocean dives over the next two days. You leave with a card you can dive on anywhere in the world, forever.",
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
    price: "11,000 THB",
    perWhat: "per person, all in",
    includes: [
      "PADI eLearning + printed dive log",
      "Personal instructor for all sessions",
      "All gear, all dives, all materials",
      "Pool / confined-water session",
      "4 open-water dives at Koh Tao's best sites",
      "PADI certification fee",
    ],
    excludes: ["Hotel pickup", "Accommodation (we recommend partner hostels with discount)", "Photos / video"],
  },
  socialProofHeadline: "Most-reviewed PADI shop on Koh Tao with 4.9 stars.",
  socialProofSubhead: "778 reviews and counting. Read what graduates say about their certification week.",
  whatYouDoHeadline: "Your 3-4 day path to certification",
  whatYouDoSubhead:
    "Day 1 is theory and pool. Days 2-3 are four real ocean dives. You can finish in 3 if you start eLearning before you arrive.",
  schedule: [
    { time: "Day 1 AM", label: "Welcome, theory review, knowledge quizzes" },
    { time: "Day 1 PM", label: "Confined-water skills (mask clear, regulator recovery, buoyancy)" },
    { time: "Day 2 AM", label: "Open-water dives 1 + 2 — buoyancy and basic skills at depth" },
    { time: "Day 2 PM", label: "Theory wrap-up, dive planning" },
    { time: "Day 3 AM", label: "Open-water dives 3 + 4 — navigation, deeper site, exam" },
    { time: "Day 3 PM", label: "Debrief, PADI card application, celebration" },
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
      a: "Yes, we strongly recommend it. PADI eLearning is included in the price; finish it on the plane and you can certify in 3 days.",
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
  closingCtaHeadline: "PADI cert. 3-4 days. 11,000 THB.",
  closingCtaSubhead: "WhatsApp us your dates — we'll start your course this week.",
};

const OWD_ES: LanderCopy = {
  seoTitle: "Curso PADI Open Water en Koh Tao – Certificación de por Vida 11,000 THB | Siam Scuba",
  seoDescription:
    "Sácate el PADI en 3-4 días en Koh Tao. Grupos pequeños (máx. 4), dos barcos propios, teoría + piscina + cuatro inmersiones. Certificación válida de por vida.",
  heroBadge: "PADI Open Water Diver",
  heroH1: "Certifícate PADI en Koh Tao — 3-4 días, 11,000 THB, de por vida",
  heroSubhead:
    "Teoría por la mañana, piscina por la tarde, cuatro inmersiones reales los siguientes días. Te vas con una tarjeta válida en cualquier centro del mundo, para siempre.",
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
    price: "11,000 THB",
    perWhat: "por persona, todo incluido",
    includes: [
      "PADI eLearning + bitácora impresa",
      "Instructor personal en todas las sesiones",
      "Equipo, inmersiones y material completo",
      "Sesión en piscina / aguas confinadas",
      "4 inmersiones en los mejores sitios de Koh Tao",
      "Tasa de certificación PADI",
    ],
    excludes: ["Recogida en hotel", "Alojamiento (tenemos hostales asociados con descuento)", "Fotos / vídeo"],
  },
  socialProofHeadline: "El centro PADI con más reseñas en Koh Tao y 4,9 estrellas.",
  socialProofSubhead: "778 reseñas y subiendo. Lee lo que dicen los graduados de su semana de certificación.",
  whatYouDoHeadline: "Tu camino a la certificación en 3-4 días",
  whatYouDoSubhead:
    "Día 1 teoría y piscina. Días 2-3 cuatro inmersiones reales. Puedes terminar en 3 si haces el eLearning antes de llegar.",
  schedule: [
    { time: "Día 1 AM", label: "Bienvenida, repaso de teoría, cuestionarios" },
    { time: "Día 1 PM", label: "Aguas confinadas (vaciado de máscara, recuperación de regulador, flotabilidad)" },
    { time: "Día 2 AM", label: "Inmersiones 1 y 2 — flotabilidad y habilidades básicas" },
    { time: "Día 2 PM", label: "Cierre de teoría, planificación de inmersiones" },
    { time: "Día 3 AM", label: "Inmersiones 3 y 4 — navegación, sitio profundo, examen" },
    { time: "Día 3 PM", label: "Debrief, solicitud de la tarjeta PADI, celebración" },
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
      a: "Sí, lo recomendamos. El eLearning de PADI va incluido; termínalo en el avión y puedes certificarte en 3 días.",
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
  closingCtaHeadline: "Cert PADI. 3-4 días. 11,000 THB.",
  closingCtaSubhead: "WhatsApp con tus fechas — empezamos esta semana.",
};

const OWD_HE: LanderCopy = {
  seoTitle: "קורס PADI Open Water בקוטאו – הסמכה לכל החיים ב-11,000 THB | סיאם סקובה",
  seoDescription:
    "תוסמכו ל-PADI ב-3-4 ימים בקוטאו. קבוצות קטנות (מקס׳ 4), שתי סירות פרטיות, תיאוריה + בריכה + ארבע צלילות בים. הסמכה לכל החיים.",
  heroBadge: "PADI Open Water Diver",
  heroH1: "הסמכה ל-PADI בקוטאו — 3-4 ימים, 11,000 THB, לכל החיים",
  heroSubhead:
    "תיאוריה בבוקר, בריכה בצהריים, ארבע צלילות אמיתיות בים בימיים הבאים. יוצאים עם כרטיס שצוללים איתו בכל מקום בעולם, לתמיד.",
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
    price: "11,000 THB",
    perWhat: "לאדם, הכל כלול",
    includes: [
      "PADI eLearning + יומן צלילה מודפס",
      "מדריך אישי בכל המפגשים",
      "ציוד מלא, כל הצלילות, כל החומרים",
      "מפגש בריכה / מים רדודים",
      "4 צלילות באתרים הכי טובים של קוטאו",
      "אגרת הסמכה של PADI",
    ],
    excludes: ["איסוף מהמלון", "לינה (יש לנו הוסטלים שותפים עם הנחה)", "תמונות / וידאו"],
  },
  socialProofHeadline: "חנות ה-PADI הכי מדורגת בקוטאו עם 4.9 כוכבים.",
  socialProofSubhead: "778 ביקורות וזה ממשיך. קראו מה בוגרים אומרים על שבוע ההסמכה שלהם.",
  whatYouDoHeadline: "הדרך שלכם להסמכה תוך 3-4 ימים",
  whatYouDoSubhead:
    "יום 1 תיאוריה ובריכה. ימים 2-3 ארבע צלילות בים. אפשר לסיים תוך 3 ימים אם עושים את ה-eLearning לפני ההגעה.",
  schedule: [
    { time: "יום 1 בוקר", label: "קבלת פנים, חזרה על תיאוריה, מבחנים" },
    { time: "יום 1 צהריים", label: "תרגול במים רדודים (פינוי מסכה, החזרת רגולטור, ציפה)" },
    { time: "יום 2 בוקר", label: "צלילות 1 ו-2 — ציפה ומיומנויות בסיסיות בעומק" },
    { time: "יום 2 צהריים", label: "סיכום תיאוריה, תכנון צלילות" },
    { time: "יום 3 בוקר", label: "צלילות 3 ו-4 — ניווט, אתר עמוק יותר, מבחן" },
    { time: "יום 3 צהריים", label: "סיכום, בקשת כרטיס PADI, חגיגה" },
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
      a: "כן, מומלץ מאוד. ה-eLearning של PADI כלול במחיר; תסיימו במטוס ותוסמכו ב-3 ימים.",
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
  closingCtaHeadline: "הסמכת PADI. 3-4 ימים. 11,000 THB.",
  closingCtaSubhead: "WhatsApp עם התאריכים — מתחילים השבוע.",
};

// ---------- Fun Dive ----------

const FUN_EN: LanderCopy = {
  seoTitle: "Fun Dives in Koh Tao – Guided Day Trips from 1,800 THB | Siam Scuba",
  seoDescription:
    "Certified divers — book guided fun dives in Koh Tao. Two morning or afternoon dives 1,800 THB. Full-day Sail Rock 3,800 THB. Small groups, two custom boats.",
  heroBadge: "For certified divers",
  heroH1: "Fun dives in Koh Tao — small groups, custom boats, from 1,800 THB",
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
    price: "1,800 / 3,800 THB",
    perWhat: "2-tank half-day / Sail Rock full-day",
    includes: [
      "2 dives with a dive guide",
      "All gear (BCD, regulator, mask, fins, wetsuit)",
      "Custom dive boat with tea, coffee, fruit",
      "Tanks and weights",
      "Surface interval snacks",
    ],
    excludes: ["Hotel pickup", "GoPro rental", "Underwater photos package"],
  },
  socialProofHeadline: "Trusted by 778 reviewers on TripAdvisor — 4.9 stars.",
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
  closingCtaHeadline: "Two dives, your day, 1,800 THB.",
  closingCtaSubhead: "Tap below to book — or WhatsApp us your preferred dates.",
};

const FUN_ES: LanderCopy = {
  seoTitle: "Inmersiones Guiadas en Koh Tao – Desde 1,800 THB | Siam Scuba",
  seoDescription:
    "Buceadores certificados — reserva inmersiones guiadas en Koh Tao. Dos inmersiones mañana o tarde 1,800 THB. Día completo Sail Rock 3,800 THB. Grupos pequeños, barcos propios.",
  heroBadge: "Para buceadores certificados",
  heroH1: "Buceo en Koh Tao — grupos pequeños, barcos propios, desde 1,800 THB",
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
    price: "1,800 / 3,800 THB",
    perWhat: "2 inmersiones medio día / Sail Rock día completo",
    includes: [
      "2 inmersiones con guía",
      "Equipo completo (chaleco, regulador, máscara, aletas, traje)",
      "Barco propio con té, café, fruta",
      "Botellas y plomos",
      "Snacks en el intervalo",
    ],
    excludes: ["Recogida en hotel", "Alquiler de GoPro", "Pack de fotos subacuáticas"],
  },
  socialProofHeadline: "778 reseñas en TripAdvisor con 4,9 estrellas.",
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
  closingCtaHeadline: "Dos inmersiones, tu día, 1,800 THB.",
  closingCtaSubhead: "Pulsa abajo para reservar — o escríbenos por WhatsApp con tus fechas.",
};

const FUN_HE: LanderCopy = {
  seoTitle: "צלילות פאן בקוטאו – יציאות יומיות מ-1,800 THB | סיאם סקובה",
  seoDescription:
    "צוללים מוסמכים — הזמינו צלילות פאן מודרכות בקוטאו. שתי צלילות בוקר או אחרי הצהריים ב-1,800 THB. יום שלם ב-Sail Rock ב-3,800 THB. קבוצות קטנות, סירות פרטיות.",
  heroBadge: "לצוללים מוסמכים",
  heroH1: "צלילות פאן בקוטאו — קבוצות קטנות, סירות פרטיות, מ-1,800 THB",
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
    price: "1,800 / 3,800 THB",
    perWhat: "2 צלילות חצי יום / Sail Rock יום שלם",
    includes: [
      "2 צלילות עם מדריך",
      "ציוד מלא (מצוף, רגולטור, מסכה, סנפירים, חליפה)",
      "סירת צלילה פרטית עם תה, קפה ופירות",
      "בלוני אוויר ומשקולות",
      "חטיפים בהפסקה בין הצלילות",
    ],
    excludes: ["איסוף מהמלון", "השכרת GoPro", "חבילת תמונות מתחת למים"],
  },
  socialProofHeadline: "778 ביקורות ב-TripAdvisor עם 4.9 כוכבים.",
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
  closingCtaHeadline: "שתי צלילות, היום שלכם, 1,800 THB.",
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
  owd: { price: "11000", currency: "THB", duration: "P3D" },
  "fun-dive": { price: "1800", currency: "THB", duration: "PT4H" },
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
