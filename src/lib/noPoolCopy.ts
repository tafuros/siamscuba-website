// Copy for /no-pool - the "we have no swimming pool, and that is the point"
// argument page.
//
// WHY THIS PAGE EXISTS
// Siam Scuba sits in the top price quartile on Koh Tao (Open Water 12,000 THB
// vs 9,900-11,000 elsewhere, most of them bundling free accommodation). Paid
// traffic cannot win that comparison on price, so this page moves the argument
// onto the one axis nobody else on the island claims: confined-water training
// happens in sheltered shallow SEA, not a pool. Master Divers also has no pool
// but never says so; Ban's advertises five pools; Big Blue and Roctopus sell
// pool training as a facility upgrade. The claim is unowned - so we take it.
//
// HOUSE RULE (see memory reference_siam_scuba_no_pool): Siam Scuba has NO pool.
// Never write "pool training" / "בבריכה" / "prácticas en piscina" as something
// we offer. The ONLY permitted use of the word is the explicit contrast below.

export type NoPoolLang = "en" | "es" | "he";

export interface ComparisonColumn {
  label: string;
  title: string;
  points: string[];
}

export interface Benefit {
  icon: "waves" | "scale" | "fish" | "heart";
  title: string;
  body: string;
}

export interface ProofPoint {
  icon: "award" | "boat" | "users" | "map";
  title: string;
  body: string;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export interface CourseLink {
  /** Internal path, language prefix included. */
  path: string;
  name: string;
  price: string;
  blurb: string;
  /** DiveOS wizard product code for the CTA preselect. */
  product: string;
}

export interface NoPoolCopy {
  seoTitle: string;
  seoDescription: string;

  heroEyebrow: string;
  heroH1: string;
  heroSubhead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /** Caption under the hero video slot. */
  videoCaption: string;

  comparisonHeadline: string;
  comparisonSubhead: string;
  pool: ComparisonColumn;
  sea: ComparisonColumn;

  socialProofHeadline: string;
  socialProofSubhead: string;

  benefitsHeadline: string;
  benefitsSubhead: string;
  benefits: Benefit[];

  standardsHeadline: string;
  standardsBody: string;
  standardsQuote: string;
  standardsQuoteAttribution: string;

  proofHeadline: string;
  proofPoints: ProofPoint[];

  coursesHeadline: string;
  coursesSubhead: string;
  courses: CourseLink[];
  coursesCta: string;

  faqHeadline: string;
  faq: FaqEntry[];

  closingHeadline: string;
  closingSubhead: string;
}

// ---------------------------------------------------------------- EN --------

const EN: NoPoolCopy = {
  seoTitle: "No Swimming Pool - We Teach You to Dive in the Sea | Siam Scuba Koh Tao",
  seoDescription:
    "Siam Scuba has no swimming pool. Your first breaths underwater happen in shallow, sheltered sea on a real reef - so your first proper dive is never a shock. PADI 5-Star, Koh Tao.",

  heroEyebrow: "What makes us different",
  heroH1: "We don't have a swimming pool. That's the point.",
  heroSubhead:
    "Most dive schools teach your first underwater skills in chlorinated water above a painted floor. We teach them in shallow, sheltered sea - real salt water, real reef, real fish, from your very first breath.",
  ctaPrimary: "Book your course",
  ctaSecondary: "Ask us on WhatsApp",
  videoCaption: "A first confined-water session at Sairee Beach - no pool, no chlorine.",

  comparisonHeadline: "Where you learn changes what you learn",
  comparisonSubhead:
    "Every entry-level diver has to complete a confined-water session before going to open water. Here is the difference between doing it in a pool and doing it here.",
  pool: {
    label: "The usual way",
    title: "A swimming pool",
    points: [
      "A flat concrete floor, painted blue, two metres down.",
      "Perfect visibility, no current, no surge, no life.",
      "Fresh water - which floats you differently from the sea, so your weighting has to be redone the moment you leave.",
      "You get comfortable in conditions you will never dive in again.",
      "Dive one is the first time everything changes at once: salt, depth, movement, and things swimming past your mask.",
    ],
  },
  sea: {
    label: "Our way",
    title: "Shallow, sheltered sea",
    points: [
      "A calm bay off Sairee Beach, sandy bottom, shallow enough to stand up in.",
      "Sheltered from swell - we pick the side of the island the weather is kind to that day.",
      "The same PADI skills, the same standards, the same instructor attention.",
      "Real salt water, so the buoyancy and weighting you learn are the ones you keep.",
      "By your first proper dive nothing about the environment is new. Only the depth.",
    ],
  },

  socialProofHeadline: "Most-reviewed PADI shop on Koh Tao, 5.0 stars.",
  socialProofSubhead:
    "778 reviews and counting - from people whose first breath underwater was on a reef.",

  benefitsHeadline: "Why this is better for you",
  benefitsSubhead:
    "This is not a facility we are missing. It is the reason our students look calm on dive one.",
  benefits: [
    {
      icon: "waves",
      title: "No shock on your first dive",
      body: "The hard part of learning to dive was never the skills - it is the environment. Learn in the sea and by dive one there is nothing left to adapt to.",
    },
    {
      icon: "scale",
      title: "Buoyancy that actually transfers",
      body: "Salt water floats you differently from fresh. Weighting learned in a pool has to be relearned in the sea. Yours is right the first time.",
    },
    {
      icon: "fish",
      title: "You are already seeing things",
      body: "Students routinely finish their first session having watched parrotfish, wrasse, sometimes a turtle. That is not a drill. That is the reason you came.",
    },
    {
      icon: "heart",
      title: "Confidence earned in the real place",
      body: "Comfort built in a pool is comfort in a pool. Comfort built in the sea comes with you - to your next dive, and to every dive after it.",
    },
  ],

  standardsHeadline: "Wait - is that allowed?",
  standardsBody:
    "Yes, and it is not a loophole. PADI's own definition of confined water is a swimming pool OR an open-water site that offers pool-like conditions. Koh Tao's sheltered bays are the textbook example: calm, clear and shallow enough to stand. The standards you are trained and assessed against are identical. Only the venue is better - and your certification card is exactly the same card, recognised at every dive centre on Earth, for life.",
  standardsQuote:
    "Confined water: a swimming pool or an open water site that offers swimming-pool-like conditions with respect to clarity, calmness and depth.",
  standardsQuoteAttribution: "PADI, definition of confined water",

  proofHeadline: "The rest of the setup",
  proofPoints: [
    {
      icon: "award",
      title: "PADI 5-Star Dive Centre",
      body: "The highest PADI rating for a dive centre, held on quality of training and service - not on how much concrete we own.",
    },
    {
      icon: "boat",
      title: "Two of our own dive boats",
      body: "We set our own schedule. No waiting for someone else's departure, no forty people on a shared boat, and if the weather turns we can simply move.",
    },
    {
      icon: "users",
      title: "Small groups",
      body: "Enough instructor attention that you are never queueing for your turn to practise a skill.",
    },
    {
      icon: "map",
      title: "On Sairee Beach",
      body: "Our training bay is a short walk from the shop. No transfer, no coach, no lost hour of your day.",
    },
  ],

  coursesHeadline: "Start in the sea",
  coursesSubhead: "Whichever way you begin, your first breath underwater is on a reef.",
  courses: [
    {
      path: "/discover-scuba-diving",
      name: "Discover Scuba Diving",
      price: "฿2,600",
      blurb: "One day, no certification and no experience needed. The easiest way to find out whether you love this.",
      product: "DSD",
    },
    {
      path: "/open-water-course",
      name: "PADI Open Water Diver",
      price: "฿12,000",
      blurb: "Your full certification in 2.5 days. Lifelong, recognised everywhere, two nights' accommodation included.",
      product: "OWD",
    },
    {
      path: "/fun-dives",
      name: "Fun dives",
      price: "฿2,000",
      blurb: "Already certified? Two guided dives on Koh Tao's best sites, all in.",
      product: "FUN",
    },
  ],
  coursesCta: "See details",

  faqHeadline: "Frequently asked",
  faq: [
    {
      q: "Isn't a pool safer?",
      a: "Safety comes from your instructor, the group size and the depth - not from concrete. Our confined-water site is shallow enough to stand up in, sheltered from swell, and the PADI standards applied are identical either way.",
    },
    {
      q: "What if the sea is rough that day?",
      a: "Then we don't use that bay. Koh Tao has sheltered water on one side of the island whatever the wind is doing, and with two of our own boats we can move to it. A pool cannot move - but a school with a pool has no reason to teach you how the sea behaves at all.",
    },
    {
      q: "Is the water cold?",
      a: "28-30°C year round. Warmer than most swimming pools, and you are in a wetsuit.",
    },
    {
      q: "I've never put my head underwater. Is this too much?",
      a: "That is most of our students on day one. The session is in shallow water you can stand up in, with a small group and an instructor beside you. Nobody is rushed.",
    },
    {
      q: "Do I need to be able to swim?",
      a: "For the Open Water course, yes - 200m unaided and a 10-minute float. Stroke and speed don't matter. Discover Scuba Diving has no swim test.",
    },
    {
      q: "Does my certification say anything different?",
      a: "No. It is the standard PADI card, valid at every dive centre in the world, and it never expires.",
    },
  ],

  closingHeadline: "Learn where you're going to dive.",
  closingSubhead:
    "Small groups, two of our own boats, PADI 5-Star, and not one drop of chlorine.",
};

// ---------------------------------------------------------------- ES --------

const ES: NoPoolCopy = {
  seoTitle: "Sin piscina - Aprendes a bucear en el mar | Siam Scuba Koh Tao",
  seoDescription:
    "Siam Scuba no tiene piscina. Tus primeras respiraciones bajo el agua son en mar poco profundo y resguardado, sobre arrecife real - así tu primera inmersión de verdad nunca es un shock. PADI 5 Estrellas, Koh Tao.",

  heroEyebrow: "Lo que nos hace diferentes",
  heroH1: "No tenemos piscina. Y es a propósito.",
  heroSubhead:
    "Casi todas las escuelas enseñan tus primeras habilidades bajo el agua en agua clorada sobre un suelo pintado. Nosotros las enseñamos en mar poco profundo y resguardado: agua salada real, arrecife real, peces reales, desde tu primera respiración.",
  ctaPrimary: "Reserva tu curso",
  ctaSecondary: "Escríbenos por WhatsApp",
  videoCaption: "Una primera sesión de aguas confinadas en Sairee Beach - sin piscina, sin cloro.",

  comparisonHeadline: "Dónde aprendes cambia lo que aprendes",
  comparisonSubhead:
    "Todo buceador principiante hace una sesión en aguas confinadas antes de ir a mar abierto. Esta es la diferencia entre hacerla en una piscina y hacerla aquí.",
  pool: {
    label: "Lo habitual",
    title: "Una piscina",
    points: [
      "Un suelo de hormigón plano, pintado de azul, a dos metros.",
      "Visibilidad perfecta, sin corriente, sin oleaje, sin vida.",
      "Agua dulce, que te flota distinto que el mar: el lastre hay que rehacerlo en cuanto sales de allí.",
      "Te acostumbras a unas condiciones en las que no vas a bucear nunca más.",
      "La primera inmersión es la primera vez que todo cambia a la vez: sal, profundidad, movimiento y cosas pasando junto a tu máscara.",
    ],
  },
  sea: {
    label: "Nuestra forma",
    title: "Mar poco profundo y resguardado",
    points: [
      "Una bahía tranquila en Sairee Beach, fondo de arena, con pie en el suelo.",
      "Resguardada del oleaje: elegimos el lado de la isla que el tiempo respeta ese día.",
      "Las mismas habilidades PADI, los mismos estándares, la misma atención del instructor.",
      "Agua salada real, así que la flotabilidad y el lastre que aprendes son los que te quedas.",
      "Al llegar a tu primera inmersión de verdad, nada del entorno es nuevo. Solo la profundidad.",
    ],
  },

  socialProofHeadline: "El centro PADI con más reseñas de Koh Tao, 5,0 estrellas.",
  socialProofSubhead:
    "778 reseñas y subiendo, de gente cuya primera respiración bajo el agua fue sobre un arrecife.",

  benefitsHeadline: "Por qué esto es mejor para ti",
  benefitsSubhead:
    "No es una instalación que nos falte. Es la razón por la que nuestros alumnos llegan tranquilos a la primera inmersión.",
  benefits: [
    {
      icon: "waves",
      title: "Sin shock en la primera inmersión",
      body: "Lo difícil de aprender a bucear nunca fueron las habilidades, sino el entorno. Aprende en el mar y para la primera inmersión ya no queda nada a lo que adaptarse.",
    },
    {
      icon: "scale",
      title: "Flotabilidad que sí te sirve",
      body: "El agua salada te flota distinto que la dulce. El lastre aprendido en piscina hay que reaprenderlo en el mar. El tuyo está bien a la primera.",
    },
    {
      icon: "fish",
      title: "Ya estás viendo cosas",
      body: "Es normal terminar la primera sesión habiendo visto peces loro, napoleones, a veces una tortuga. Eso no es un ejercicio: es justo a lo que viniste.",
    },
    {
      icon: "heart",
      title: "Confianza ganada en el sitio real",
      body: "La comodidad que se construye en una piscina se queda en la piscina. La que se construye en el mar se va contigo a la siguiente inmersión, y a todas las demás.",
    },
  ],

  standardsHeadline: "Espera, ¿eso está permitido?",
  standardsBody:
    "Sí, y no es ningún atajo. La propia definición de aguas confinadas de PADI es una piscina O un lugar de mar abierto con condiciones similares a las de una piscina. Las bahías resguardadas de Koh Tao son el ejemplo de manual: tranquilas, claras y con pie en el suelo. Los estándares con los que te formamos y evaluamos son idénticos. Solo el sitio es mejor, y tu certificación es exactamente la misma tarjeta, reconocida en todos los centros del mundo, de por vida.",
  standardsQuote:
    "Aguas confinadas: una piscina o un lugar de mar abierto que ofrece condiciones similares a las de una piscina en cuanto a claridad, calma y profundidad.",
  standardsQuoteAttribution: "PADI, definición de aguas confinadas",

  proofHeadline: "El resto del equipo",
  proofPoints: [
    {
      icon: "award",
      title: "Centro PADI 5 Estrellas",
      body: "La calificación PADI más alta para un centro de buceo, otorgada por calidad de formación y servicio, no por cuánto hormigón tienes.",
    },
    {
      icon: "boat",
      title: "Dos barcos propios",
      body: "Marcamos nuestro propio horario. Sin esperar la salida de otros, sin cuarenta personas en un barco compartido, y si el tiempo cambia simplemente nos movemos.",
    },
    {
      icon: "users",
      title: "Grupos pequeños",
      body: "Suficiente atención del instructor como para no hacer cola esperando tu turno de practicar.",
    },
    {
      icon: "map",
      title: "En Sairee Beach",
      body: "Nuestra bahía de formación está a un paseo corto del centro. Sin traslados ni furgonetas ni una hora perdida del día.",
    },
  ],

  coursesHeadline: "Empieza en el mar",
  coursesSubhead: "Empieces por donde empieces, tu primera respiración bajo el agua es sobre un arrecife.",
  courses: [
    {
      path: "/es/discover-scuba-diving",
      name: "Discover Scuba Diving",
      price: "฿2,600",
      blurb: "Un día, sin certificación y sin experiencia previa. La forma más fácil de descubrir si esto te engancha.",
      product: "DSD",
    },
    {
      path: "/es/open-water-course",
      name: "PADI Open Water Diver",
      price: "฿12,000",
      blurb: "Tu certificación completa en 2,5 días. De por vida, reconocida en todas partes, 2 noches de alojamiento incluidas.",
      product: "OWD",
    },
    {
      path: "/es/fun-dives",
      name: "Inmersiones guiadas",
      price: "฿2,000",
      blurb: "¿Ya certificado? Dos inmersiones guiadas en los mejores sitios de Koh Tao, todo incluido.",
      product: "FUN",
    },
  ],
  coursesCta: "Ver detalles",

  faqHeadline: "Preguntas frecuentes",
  faq: [
    {
      q: "¿No es más segura una piscina?",
      a: "La seguridad viene del instructor, del tamaño del grupo y de la profundidad, no del hormigón. Nuestro sitio de aguas confinadas tiene pie en el suelo, está resguardado del oleaje, y los estándares PADI que aplicamos son idénticos en ambos casos.",
    },
    {
      q: "¿Y si ese día el mar está movido?",
      a: "Entonces no usamos esa bahía. Koh Tao tiene agua resguardada en un lado de la isla haga el viento que haga, y con dos barcos propios podemos ir hasta ella. Una piscina no se mueve, pero una escuela con piscina tampoco tiene motivo para enseñarte cómo se comporta el mar.",
    },
    {
      q: "¿El agua está fría?",
      a: "28-30°C todo el año. Más caliente que la mayoría de las piscinas, y llevas traje de neopreno.",
    },
    {
      q: "Nunca he metido la cabeza bajo el agua. ¿Es demasiado?",
      a: "Es la situación de la mayoría de nuestros alumnos el primer día. La sesión es en agua donde haces pie, en grupo pequeño y con el instructor a tu lado. Nadie va con prisa.",
    },
    {
      q: "¿Necesito saber nadar?",
      a: "Para el curso Open Water sí: 200m sin ayuda y 10 minutos flotando. El estilo y la velocidad dan igual. El Discover Scuba Diving no tiene prueba de natación.",
    },
    {
      q: "¿Mi certificación dice algo distinto?",
      a: "No. Es la tarjeta PADI estándar, válida en cualquier centro de buceo del mundo, y no caduca nunca.",
    },
  ],

  closingHeadline: "Aprende donde vas a bucear.",
  closingSubhead:
    "Grupos pequeños, dos barcos propios, centro PADI 5 Estrellas y ni una gota de cloro.",
};

// ---------------------------------------------------------------- HE --------

const HE: NoPoolCopy = {
  seoTitle: "בלי בריכה - לומדים לצלול בים | סיאם סקובה קו טאו",
  seoDescription:
    "לסיאם סקובה אין בריכה. הנשימות הראשונות שלכם מתחת למים קורות בים רדוד ומוגן, מעל שונית אמיתית - כך שהצלילה האמיתית הראשונה אף פעם לא מפתיעה. PADI 5 כוכבים, קו טאו.",

  heroEyebrow: "מה שונה אצלנו",
  heroH1: "אין לנו בריכה. וזה בדיוק העניין.",
  heroSubhead:
    "רוב בתי הספר מלמדים את המיומנויות הראשונות שלכם מתחת למים במים מוכלרים מעל רצפה צבועה. אנחנו מלמדים אותן בים רדוד ומוגן - מים מלוחים אמיתיים, שונית אמיתית, דגים אמיתיים, מהנשימה הראשונה.",
  ctaPrimary: "להזמין קורס",
  ctaSecondary: "לדבר איתנו ב-WhatsApp",
  videoCaption: "מפגש מים רדודים ראשון בסיירי ביץ׳ - בלי בריכה, בלי כלור.",

  comparisonHeadline: "איפה שלומדים משנה את מה שלומדים",
  comparisonSubhead:
    "כל צולל מתחיל חייב מפגש במים רדודים ומוגנים לפני שיוצאים לים הפתוח. זה ההבדל בין לעשות אותו בבריכה לבין לעשות אותו כאן.",
  pool: {
    label: "הדרך הרגילה",
    title: "בריכת שחייה",
    points: [
      "רצפת בטון שטוחה, צבועה בכחול, שני מטר למטה.",
      "ראות מושלמת, בלי זרם, בלי גלים, בלי חיים.",
      "מים מתוקים - שמציפים אתכם אחרת מהים, ולכן את המשקולות צריך לכייל מחדש ברגע שיוצאים משם.",
      "אתם נעשים רגועים בתנאים שלא תצללו בהם שוב אף פעם.",
      "הצלילה הראשונה היא הפעם הראשונה שהכל משתנה בבת אחת: מלח, עומק, תנועה, ודברים ששוחים ליד המסכה.",
    ],
  },
  sea: {
    label: "הדרך שלנו",
    title: "ים רדוד ומוגן",
    points: [
      "מפרץ שקט בסיירי ביץ׳, קרקעית חול, רדוד מספיק כדי לעמוד.",
      "מוגן מגלים - אנחנו בוחרים את הצד של האי שמזג האוויר טוב אליו באותו יום.",
      "אותן מיומנויות PADI, אותם תקנים, אותה תשומת לב של המדריך.",
      "מים מלוחים אמיתיים, כך שהציפה והמשקולות שאתם לומדים הן אלה שנשארות איתכם.",
      "כשמגיעים לצלילה האמיתית הראשונה, שום דבר בסביבה אינו חדש. רק העומק.",
    ],
  },

  socialProofHeadline: "חנות ה-PADI הכי מדורגת בקו טאו, 5.0 כוכבים.",
  socialProofSubhead:
    "778 ביקורות וזה ממשיך - מאנשים שהנשימה הראשונה שלהם מתחת למים הייתה מעל שונית.",

  benefitsHeadline: "למה זה עדיף לכם",
  benefitsSubhead:
    "זה לא מתקן שחסר לנו. זו הסיבה שהחניכים שלנו נראים רגועים בצלילה הראשונה.",
  benefits: [
    {
      icon: "waves",
      title: "בלי הלם בצלילה הראשונה",
      body: "החלק הקשה בלימוד צלילה מעולם לא היה המיומנויות אלא הסביבה. אם לומדים בים, בצלילה הראשונה כבר לא נשאר למה להסתגל.",
    },
    {
      icon: "scale",
      title: "ציפה שבאמת עוברת איתכם",
      body: "מים מלוחים מציפים אחרת ממים מתוקים. כיול משקולות שנלמד בבריכה צריך ללמוד מחדש בים. אצלכם הוא נכון כבר בפעם הראשונה.",
    },
    {
      icon: "fish",
      title: "אתם כבר רואים דברים",
      body: "חניכים מסיימים את המפגש הראשון אחרי שראו דגי תוכי, נאפולאון, לפעמים צב. זה לא תרגיל - זו בדיוק הסיבה שבאתם.",
    },
    {
      icon: "heart",
      title: "ביטחון שנרכש במקום האמיתי",
      body: "נוחות שנבנית בבריכה נשארת בבריכה. נוחות שנבנית בים הולכת איתכם - לצלילה הבאה, ולכל אלה שאחריה.",
    },
  ],

  standardsHeadline: "רגע, זה בכלל מותר?",
  standardsBody:
    "כן, וזו לא פרצה. ההגדרה של PADI עצמה למים מוגנים היא בריכת שחייה או אתר בים פתוח שמציע תנאים דמויי בריכה. המפרצים המוגנים של קו טאו הם הדוגמה מספר הלימוד: שקטים, צלולים ורדודים מספיק כדי לעמוד. התקנים שלפיהם מאמנים ובוחנים אתכם זהים לחלוטין. רק המקום טוב יותר - וכרטיס ההסמכה שלכם הוא בדיוק אותו כרטיס, מוכר בכל מרכז צלילה בעולם, לכל החיים.",
  standardsQuote:
    "מים מוגנים: בריכת שחייה או אתר בים פתוח שמציע תנאים דמויי בריכה מבחינת צלילות המים, רוגע ועומק.",
  standardsQuoteAttribution: "PADI, הגדרת מים מוגנים",

  proofHeadline: "שאר המערך",
  proofPoints: [
    {
      icon: "award",
      title: "מרכז PADI 5 כוכבים",
      body: "הדירוג הגבוה ביותר של PADI למרכז צלילה, שניתן על איכות ההדרכה והשירות - לא על כמות הבטון שיש לך.",
    },
    {
      icon: "boat",
      title: "שתי סירות צלילה שלנו",
      body: "אנחנו קובעים את הלו״ז. בלי לחכות ליציאה של מישהו אחר, בלי ארבעים איש על סירה משותפת, ואם מזג האוויר משתנה פשוט זזים.",
    },
    {
      icon: "users",
      title: "קבוצות קטנות",
      body: "מספיק תשומת לב מהמדריך כדי שלא תחכו בתור לתרגל מיומנות.",
    },
    {
      icon: "map",
      title: "בסיירי ביץ׳",
      body: "מפרץ האימונים שלנו במרחק הליכה קצרה מהמועדון. בלי הסעה, בלי מיניבוס, בלי לאבד שעה מהיום.",
    },
  ],

  coursesHeadline: "מתחילים בים",
  coursesSubhead: "לא משנה איך תתחילו, הנשימה הראשונה שלכם מתחת למים היא מעל שונית.",
  courses: [
    {
      path: "/he/discover-scuba-diving",
      name: "Discover Scuba Diving",
      price: "฿2,600",
      blurb: "יום אחד, בלי הסמכה ובלי ניסיון קודם. הדרך הכי פשוטה לגלות אם אתם מתאהבים בזה.",
      product: "DSD",
    },
    {
      path: "/he/open-water-course",
      name: "PADI Open Water Diver",
      price: "฿12,000",
      blurb: "ההסמכה המלאה ב-2.5 ימים. לכל החיים, מוכרת בכל מקום, 2 לילות לינה כלולים.",
      product: "OWD",
    },
    {
      path: "/he/fun-dives",
      name: "צלילות כיף",
      price: "฿2,000",
      blurb: "כבר מוסמכים? שתי צלילות מודרכות באתרים הכי טובים של קו טאו, הכל כלול.",
      product: "FUN",
    },
  ],
  coursesCta: "לפרטים",

  faqHeadline: "שאלות נפוצות",
  faq: [
    {
      q: "בריכה זה לא יותר בטוח?",
      a: "הבטיחות מגיעה מהמדריך, מגודל הקבוצה ומהעומק - לא מהבטון. אתר המים המוגנים שלנו רדוד מספיק כדי לעמוד בו, מוגן מגלים, ותקני PADI שחלים עליו זהים בשני המקרים.",
    },
    {
      q: "ומה אם הים סוער באותו יום?",
      a: "אז לא משתמשים במפרץ הזה. לקו טאו יש מים מוגנים בצד אחד של האי בכל מצב רוח, ועם שתי סירות משלנו אנחנו יכולים להגיע לשם. בריכה לא זזה - אבל לבית ספר עם בריכה גם אין סיבה ללמד אתכם איך הים מתנהג.",
    },
    {
      q: "המים קרים?",
      a: "28-30 מעלות כל השנה. חם יותר מרוב הבריכות, ואתם בחליפה.",
    },
    {
      q: "מעולם לא הכנסתי את הראש למים. זה יותר מדי בשבילי?",
      a: "זה המצב של רוב החניכים שלנו ביום הראשון. המפגש הוא במים שאפשר לעמוד בהם, בקבוצה קטנה ועם מדריך לידכם. אף אחד לא ממהר.",
    },
    {
      q: "צריך לדעת לשחות?",
      a: "לקורס Open Water כן - 200 מטר ללא עזרה ו-10 דקות ציפה. הסגנון והמהירות לא משנים. ל-Discover Scuba Diving אין מבחן שחייה.",
    },
    {
      q: "ההסמכה שלי אומרת משהו אחר?",
      a: "לא. זה כרטיס ה-PADI הסטנדרטי, תקף בכל מרכז צלילה בעולם, והוא לא פג אף פעם.",
    },
  ],

  closingHeadline: "תלמדו במקום שבו תצללו.",
  closingSubhead:
    "קבוצות קטנות, שתי סירות משלנו, מרכז PADI 5 כוכבים, ואפס כלור.",
};

export const NO_POOL_COPY: Record<NoPoolLang, NoPoolCopy> = { en: EN, es: ES, he: HE };

const SITE = "https://siamscuba.com";

export function noPoolUrl(lang: NoPoolLang): string {
  return lang === "en" ? `${SITE}/no-pool` : `${SITE}/${lang}/no-pool`;
}

export function noPoolHreflangAlternates(): Record<NoPoolLang, string> {
  return { en: noPoolUrl("en"), es: noPoolUrl("es"), he: noPoolUrl("he") };
}

export function buildNoPoolJsonLd(lang: NoPoolLang): Record<string, unknown>[] {
  const copy = NO_POOL_COPY[lang];
  return [
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
