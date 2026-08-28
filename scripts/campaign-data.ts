/**
 * Source-of-truth campaign data for the 2026-W22 Siam Scuba paid launch.
 *
 * Imported by both:
 *   - scripts/generate-google-ads-bulk.ts (TSV/CSV emitter for Google Ads Editor)
 *   - scripts/create-campaigns.ts         (Google Ads API live mutator)
 *
 * Strategy + character limits documented in docs/google-ads-blueprint.md.
 */

export const ORIGIN = "https://siamscuba.com";

// ---------- Campaign + ad-group structure (blueprint §2) ----------

export type AdGroupSpec = {
  campaign: string;
  adGroup: string;
  lang: "EN" | "ES" | "HE";
  finalUrl: string;
};

export const CAMPAIGNS = [
  { name: "SiamScuba_Search_DSD", dailyBudgetThb: 65 },
  { name: "SiamScuba_Search_OWD", dailyBudgetThb: 65 },
  { name: "SiamScuba_Search_FunDive", dailyBudgetThb: 65 },
] as const;

export const AD_GROUPS: AdGroupSpec[] = [
  { campaign: "SiamScuba_Search_DSD",     adGroup: "DSD_EN", lang: "EN", finalUrl: `${ORIGIN}/discover-scuba-diving` },
  { campaign: "SiamScuba_Search_DSD",     adGroup: "DSD_ES", lang: "ES", finalUrl: `${ORIGIN}/es/discover-scuba-diving` },
  { campaign: "SiamScuba_Search_DSD",     adGroup: "DSD_HE", lang: "HE", finalUrl: `${ORIGIN}/he/discover-scuba-diving` },
  { campaign: "SiamScuba_Search_OWD",     adGroup: "OWD_EN", lang: "EN", finalUrl: `${ORIGIN}/open-water-course` },
  { campaign: "SiamScuba_Search_OWD",     adGroup: "OWD_ES", lang: "ES", finalUrl: `${ORIGIN}/es/open-water-course` },
  { campaign: "SiamScuba_Search_OWD",     adGroup: "OWD_HE", lang: "HE", finalUrl: `${ORIGIN}/he/open-water-course` },
  { campaign: "SiamScuba_Search_FunDive", adGroup: "FUN_EN", lang: "EN", finalUrl: `${ORIGIN}/fun-dives` },
  { campaign: "SiamScuba_Search_FunDive", adGroup: "FUN_ES", lang: "ES", finalUrl: `${ORIGIN}/es/fun-dives` },
  { campaign: "SiamScuba_Search_FunDive", adGroup: "FUN_HE", lang: "HE", finalUrl: `${ORIGIN}/he/fun-dives` },
];

// ---------- Keywords (blueprint §4) ----------

export type KwSet = { phrase: string[]; exact: string[] };

export const KEYWORDS: Record<string, KwSet> = {
  DSD_EN: {
    phrase: [
      "discover scuba diving koh tao",
      "try scuba diving koh tao",
      "try diving thailand",
      "scuba lesson koh tao",
      "first time scuba koh tao",
      "intro dive koh tao",
      "dsd koh tao",
      "scuba diving for beginners thailand",
      "snorkel and scuba koh tao",
      "padi discover scuba",
    ],
    exact: [
      "discover scuba diving koh tao",
      "try diving koh tao",
      "dsd koh tao price",
    ],
  },
  DSD_ES: {
    phrase: [
      "bautismo de buceo koh tao",
      "bautismo de buceo tailandia",
      "primera vez buceo koh tao",
      "discover scuba koh tao",
      "buceo principiantes tailandia",
      "iniciacion buceo koh tao",
      "probar buceo tailandia",
      "padi discover scuba español",
      "curso introduccion buceo tailandia",
    ],
    exact: [
      "bautismo de buceo koh tao",
      "discover scuba koh tao",
    ],
  },
  DSD_HE: {
    phrase: [
      "צלילת היכרות קוטאו",
      "צלילת היכרות תאילנד",
      "צלילה ראשונה תאילנד",
      "DSD קוטאו",
      "ניסיון צלילה קוטאו",
      "צלילה למתחילים תאילנד",
      "PADI צלילת היכרות",
    ],
    exact: [
      "צלילת היכרות קוטאו",
      "צלילת היכרות תאילנד",
    ],
  },
  OWD_EN: {
    phrase: [
      "padi open water koh tao",
      "open water course koh tao",
      "open water diver koh tao",
      "scuba certification koh tao",
      "learn to scuba dive thailand",
      "padi course thailand",
      "owd koh tao",
      "scuba diving course koh tao",
      "padi open water price",
      "scuba license koh tao",
    ],
    exact: [
      "padi open water koh tao",
      "open water course koh tao",
      "owd koh tao",
    ],
  },
  OWD_ES: {
    phrase: [
      "curso open water koh tao",
      "curso PADI tailandia",
      "certificacion buceo koh tao",
      "curso buceo tailandia",
      "curso buceo koh tao",
      "PADI open water tailandia",
      "sacarse el titulo de buceo tailandia",
    ],
    exact: [
      "curso open water koh tao",
      "PADI open water tailandia",
    ],
  },
  OWD_HE: {
    phrase: [
      "קורס צלילה קוטאו",
      "קורס PADI תאילנד",
      "קורס אופן ווטר",
      "כוכב 1 תאילנד",
      "קורס צלילה תאילנד",
      "קורס צלילה כוכב ראשון",
    ],
    exact: [
      "קורס צלילה קוטאו",
      "קורס PADI תאילנד",
    ],
  },
  FUN_EN: {
    phrase: [
      "fun dive koh tao",
      "scuba diving koh tao",
      "sail rock dive trip",
      "chumphon pinnacle dive",
      "two tank dive koh tao",
      "boat dive koh tao",
      "certified diver koh tao",
      "dive sites koh tao",
      "padi 5 star koh tao",
    ],
    exact: [
      "fun dive koh tao",
      "sail rock koh tao",
    ],
  },
  FUN_ES: {
    phrase: [
      "buceo koh tao",
      "inmersiones koh tao",
      "sail rock buceo",
      "buceo certificados tailandia",
      "centros de buceo koh tao",
      "salida de buceo koh tao",
    ],
    exact: [
      "buceo koh tao",
      "sail rock buceo",
    ],
  },
  FUN_HE: {
    phrase: [
      "צלילה בקוטאו",
      "צלילות קוטאו",
      "סייל רוק צלילה",
      "צלילה תאילנד מוסמכים",
      "מרכז צלילה קוטאו",
    ],
    exact: [
      "צלילה בקוטאו",
      "סייל רוק",
    ],
  },
};

// ---------- Negative keywords (blueprint §5) ----------

export const NEGATIVE_SHARED_SET_NAME = "Siam Scuba - Always Negative";

export const NEGATIVES = [
  "free", "job", "jobs", "career", "careers", "salary", "hiring", "hire me",
  "instructor course", "instructor exam", "divemaster course", "divemaster jobs",
  "internship", "work in koh tao", "visa", "ipad", "review", "forum", "reddit",
  "wiki", "wikipedia", "death", "accident", "shark attack", "news", "youtube",
  "tiktok", "download", "pdf", "manual", "quiz", "test answers",
];

// ---------- Responsive search ads (blueprint §6) ----------

export type RSA = {
  adGroup: string;
  headlines: string[];      // up to 15
  descriptions: string[];   // up to 4
  path1?: string;
  path2?: string;
};

export const RSAS: RSA[] = [
  {
    adGroup: "DSD_EN",
    headlines: [
      "Discover Scuba Diving Koh Tao",
      "Try Diving - 2 Dives 3,600 THB",
      "PADI 5-Star Center, Koh Tao",
      "No Certification Needed",
      "Max 2 Students Per Instructor",
      "Two Private Dive Boats",
      "WhatsApp Us - Reply in Minutes",
      "Full Day With PADI Instructor",
      "First Breath to 2 Ocean Dives",
      "Real Reef, Not a Pool",
      "Small Groups, Big Smiles",
      "Book Today - Dive Tomorrow",
      "778 Reviews, 5.0 TripAdvisor",
      "Lunch, Boat, Gear Included",
      "Try Scuba on Your Koh Tao Trip",
    ],
    descriptions: [
      "Day with a PADI instructor: pool training plus 1 or 2 ocean dives. All gear included.",
      "Two private boats, max 2 students per instructor. WhatsApp reply usually in minutes.",
      "2,600 THB for 1 dive or 3,600 THB for 2. Full day, gear, instructor, PADI certificate.",
      "Built for first-timers. If you float on your back, you can do this. Book today.",
    ],
    path1: "discover", path2: "scuba",
  },
  {
    adGroup: "DSD_ES",
    headlines: [
      "Bautismo de Buceo Koh Tao",
      "Prueba el Buceo en Koh Tao",
      "3,600 THB Dia Completo",
      "Centro PADI 5 Estrellas",
      "Sin Certificacion Previa",
      "Max 2 Alumnos por Instructor",
      "Dos Barcos Propios de Buceo",
      "WhatsApp - Respondemos Rapido",
      "Dia Completo con PADI",
      "Primera Respiracion Bajo Agua",
      "Arrecifes Reales, No Piscina",
      "Grupos Pequenos, Buen Rollo",
      "778 Resenas en TripAdvisor",
      "Equipo Barco y Comida",
      "Reserva Hoy - Bucea Manana",
    ],
    descriptions: [
      "Dia con instructor PADI: practicas y 1-2 inmersiones en arrecifes. Equipo incluido.",
      "Dos barcos propios, max 2 alumnos por instructor. Respondemos WhatsApp en minutos.",
      "2,600 THB por 1 inmersion o 3,600 THB por 2. Dia completo, equipo, instructor, PADI.",
      "Para principiantes. Si flotas boca arriba, puedes hacerlo. Reserva hoy.",
    ],
    path1: "buceo", path2: "koh-tao",
  },
  {
    adGroup: "DSD_HE",
    headlines: [
      "צלילת היכרות בקוטאו",
      "שתי צלילות ב-3,600 THB",
      "מרכז PADI 5 כוכבים",
      "ללא הסמכה מוקדמת",
      "עד 2 תלמידים למדריך",
      "שתי סירות צלילה פרטיות",
      "WhatsApp - תשובה בדקות",
      "יום שלם עם מדריך PADI",
      "מהנשימה הראשונה לים אמיתי",
      "שונית אמיתית לא בריכה",
      "קבוצות קטנות חוויה גדולה",
      "הזמינו היום צוללים מחר",
      "778 ביקורות ב-TripAdvisor",
      "ציוד ארוחה וסירה כלולים",
      "בעברית על הספוט בקוטאו",
    ],
    descriptions: [
      "יום שלם עם מדריך PADI: אימון במים רדודים ו-1 או 2 צלילות אמיתיות בשונית. כל הציוד כלול.",
      "שתי סירות פרטיות, עד 2 תלמידים למדריך. הלוז אמיתי. בדרך כלל עונים ב-WhatsApp בדקות.",
      "2,600 THB לצלילה או 3,600 THB לשתיים - יום שלם, ציוד, מדריך, תעודת PADI. בלי ניסיון קודם.",
      "בנוי למתחילים. אם אתם צפים על הגב - אתם יכולים. בעברית, על הספוט.",
    ],
    path1: "צלילת-היכרות", path2: "קוטאו",
  },
  {
    adGroup: "OWD_EN",
    headlines: [
      "PADI Open Water in Koh Tao",
      "Get Certified in 2.5 Days",
      "12,000 THB All-Inclusive",
      "PADI 5-Star IDC Center",
      "Small Groups, Real Attention",
      "Two Private Dive Boats",
      "WhatsApp Us - Reply in Minutes",
      "Theory, Pool, 4 Ocean Dives",
      "Certified For Life, Worldwide",
      "778 Reviews on TripAdvisor",
      "eLearning Before You Arrive",
      "Koh Tao - Best Place to Learn",
      "Free Re-Take If You Need It",
      "Book Course, We Plan Dates",
      "Sail Rock Trip On Us, Ask How",
    ],
    descriptions: [
      "PADI Open Water in 2.5 days: theory, pool, 4 reef dives. Certified for life, worldwide.",
      "12,000 THB: books, gear, instructor, boat, certification. Small groups, two boats.",
      "Koh Tao is the calmest place to learn. eLearning before you arrive saves water time.",
      "WhatsApp us your travel dates. We plan the 2.5-day schedule around them.",
    ],
    path1: "open-water", path2: "padi",
  },
  {
    adGroup: "OWD_ES",
    headlines: [
      "Curso PADI Open Water Koh Tao",
      "Certificate en 2.5 Dias",
      "12,000 THB Todo Incluido",
      "Centro PADI 5 Estrellas IDC",
      "Grupos Pequenos, Atencion Real",
      "Dos Barcos Propios",
      "WhatsApp - Respondemos Rapido",
      "Teoria, Piscina, 4 Inmersiones",
      "Titulo Mundial de por Vida",
      "778 Resenas en TripAdvisor",
      "eLearning Antes de Llegar",
      "Koh Tao - El Mejor Lugar",
      "Repeticion Gratis Garantizada",
      "Reserva, Cuadramos Fechas",
      "En Espanol con Instructor PADI",
    ],
    descriptions: [
      "Curso PADI Open Water en 2.5 dias: teoria, piscina, 4 inmersiones. Titulo internacional.",
      "12,000 THB: libros, equipo, instructor, barco, certificacion. Grupos max 4 alumnos.",
      "Koh Tao es el lugar mas tranquilo para aprender. eLearning antes de llegar al agua.",
      "Escribenos por WhatsApp tus fechas y cuadramos el curso. Respuesta en minutos.",
    ],
    path1: "open-water", path2: "espanol",
  },
  {
    adGroup: "OWD_HE",
    headlines: [
      "קורס PADI Open Water קוטאו",
      "הסמכה ב-2.5 ימים",
      "12,000 THB הכל כלול",
      "מרכז PADI 5 כוכבים IDC",
      "קבוצות קטנות, יחס אישי",
      "שתי סירות פרטיות",
      "WhatsApp - תשובה בדקות",
      "תיאוריה בריכה ו-4 צלילות",
      "הסמכה בינלאומית לכל החיים",
      "778 ביקורות ב-TripAdvisor",
      "לימוד עצמי לפני שמגיעים",
      "קוטאו - המקום ללמוד",
      "חזרה חינם אם צריך",
      "הזמינו קורס נסגור תאריכים",
      "בעברית עם מדריך PADI",
    ],
    descriptions: [
      "קורס PADI Open Water ב-2.5 ימים: תיאוריה, בריכה, 4 צלילות. הסמכה בינלאומית לכל החיים.",
      "12,000 THB - ספרים, ציוד, מדריך, סירה, הסמכה. עד 4 תלמידים. שתי סירות פרטיות.",
      "קוטאו הוא המקום הזול והרגוע בעולם ללמוד. eLearning לפני שמגיעים כדי לנצל כל יום במים.",
      "שלחו ב-WhatsApp תאריכי הטיול ונסגור איתכם את הקורס. תשובה בדקות.",
    ],
    path1: "קורס-צלילה", path2: "קוטאו",
  },
  {
    adGroup: "FUN_EN",
    headlines: [
      "Fun Diving in Koh Tao",
      "Sail Rock Full-Day 3,800 THB",
      "Two-Tank Boat Dive 2,000 THB",
      "Chumphon Pinnacle & Twins",
      "PADI 5-Star, Koh Tao",
      "Small Groups, Two Boats",
      "WhatsApp Us - Reply in Minutes",
      "Whale Sharks at Sail Rock",
      "Morning or Afternoon Boats",
      "778 Reviews on TripAdvisor",
      "All Gear Included",
      "Book Today - Dive Tomorrow",
      "Online Booking, No Deposit",
      "Certified Divers Welcome",
      "Best Dive Sites on the Island",
    ],
    descriptions: [
      "Two-tank morning/afternoon dives 2,000 THB. Sail Rock full-day 3,800 THB. All gear in.",
      "Two private boats, small groups, schedule on time. PADI 5-Star in Koh Tao.",
      "Pick your sites: Chumphon Pinnacle, Sail Rock, Twins, White Rock. Book online, no deposit.",
      "WhatsApp us your dates or book direct. We get you on a boat usually within 24 hours.",
    ],
    path1: "fun-dives", path2: "koh-tao",
  },
  {
    adGroup: "FUN_ES",
    headlines: [
      "Buceo en Koh Tao",
      "Sail Rock Dia Completo - 3,800",
      "2 Inmersiones Barco 2,000 THB",
      "Chumphon Pinnacle y The Twins",
      "Centro PADI 5 Estrellas",
      "Grupos Pequenos, 2 Barcos",
      "WhatsApp - Respondemos Rapido",
      "Tiburones Ballena Sail Rock",
      "Inmersiones Manana o Tarde",
      "778 Resenas en TripAdvisor",
      "Equipo Incluido",
      "Reserva Hoy - Bucea Manana",
      "Reserva Online, Sin Deposito",
      "Buceadores Certificados",
      "Los Mejores Sitios de la Isla",
    ],
    descriptions: [
      "Dos inmersiones manana/tarde 2,000 THB. Sail Rock dia completo 3,800 THB. Equipo incluido.",
      "Dos barcos propios, grupos pequenos, horario real. Centro PADI 5 Estrellas Koh Tao.",
      "Elige los sitios: Chumphon, Sail Rock, Twins, White Rock. Reserva online sin deposito.",
      "WhatsApp con tus fechas o reserva directo. Solemos meterte en barco en 24 horas.",
    ],
    path1: "buceo", path2: "koh-tao",
  },
  {
    adGroup: "FUN_HE",
    headlines: [
      "צלילות בקוטאו",
      "סייל רוק יום שלם - 3,800",
      "שתי צלילות סירה - 2,000 THB",
      "Chumphon Pinnacle ו-The Twins",
      "מרכז PADI 5 כוכבים",
      "קבוצות קטנות, 2 סירות פרטיות",
      "WhatsApp - תשובה בדקות",
      "כרישי לוויתן בסייל רוק",
      "צלילות בוקר או צהריים",
      "778 ביקורות ב-TripAdvisor",
      "ציוד כלול",
      "הזמינו היום צוללים מחר",
      "הזמנה אונליין ללא פיקדון",
      "למוסמכים בלבד",
      "אתרי הצלילה הכי טובים באי",
    ],
    descriptions: [
      "שתי צלילות בוקר או צהריים 2,000 THB. סייל רוק יום שלם 3,800 THB. ציוד כלול.",
      "שתי סירות פרטיות, קבוצות קטנות, לוז אמיתי. מרכז PADI 5 כוכבים בקוטאו.",
      "בוחרים אתר: Chumphon, Sail Rock, Twins, White Rock. הזמנה אונליין ללא פיקדון.",
      "שלחו ב-WhatsApp תאריכים או הזמינו ישיר. מעלים אתכם לסירה בתוך 24 שעות.",
    ],
    path1: "צלילות", path2: "קוטאו",
  },
];

// ---------- Sitelinks / callouts / structured snippets (blueprint §7) ----------

export type Sitelink = { text: string; url: string; d1: string; d2: string };

export const SITELINKS: Sitelink[] = [
  { text: "Our 2 Dive Boats",    url: `${ORIGIN}/about`,           d1: "Two custom boats, small groups",   d2: "Not shared with other shops" },
  { text: "Meet the Team",       url: `${ORIGIN}/about`,           d1: "PADI instructors with 10+ yrs",    d2: "Multilingual: EN / ES / HE / TH" },
  { text: "Dive Sites We Cover", url: `${ORIGIN}/dive-sites`,      d1: "Sail Rock, Chumphon, Twins",       d2: "Whale shark season Mar-May" },
  { text: "Real Reviews",        url: `${ORIGIN}/about#reviews`,   d1: "778 reviews, 5.0 on TripAdvisor",  d2: "First-time divers welcome" },
];

export const CALLOUTS = [
  "Free re-take guarantee",
  "No deposit required",
  "Two private dive boats",
  "Small groups guaranteed",
  "PADI 5-Star Center",
  "WhatsApp in EN / ES / HE",
  "Same-day booking",
  "All gear included",
];

export const SNIPPET_COURSES = ["Discover Scuba", "Open Water", "Advanced Open Water", "Rescue Diver", "Divemaster"];
export const SNIPPET_SERVICES = ["Fun Dives", "Sail Rock Trip", "Night Dives", "Private Guide"];
