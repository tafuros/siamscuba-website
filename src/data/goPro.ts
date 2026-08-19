import type { Language } from "@/i18n/translations";

/**
 * SINGLE SOURCE OF TRUTH for the Go Pro cluster: the /go-pro page, the fifth
 * entry-gate card and the homepage banner.
 *
 * Ben, 2026-08-16: Divemaster and IDC are SEPARATE courses with separate
 * prerequisites - they are not two halves of one product - but a candidate can
 * book them back to back. So the page presents two tracks plus a combined
 * option, rather than one blurred "go pro" journey.
 */

// ---------------------------------------------------------------------------
// Instructor Examination schedule
// ---------------------------------------------------------------------------

/**
 * The year THESE dates belong to. The day numbers are pinned to weekdays, so
 * they do not carry over - April 7th is a Tuesday one year and not the next.
 *
 * This is why `nextInstructorExam` returns null instead of rolling into an
 * invented next year: publishing a wrong exam date on the homepage is worse
 * than publishing none, on the exact page where we claim to be professionals.
 * When the year turns, replace the table and bump this constant.
 */
export const IE_SCHEDULE_YEAR = 2026;

export interface IeEntry {
  /** 1-12 */
  month: number;
  /** Day of month the 2-day theory refresher starts. */
  prepDay: number;
  /** Day of month the IDC itself starts. */
  idcDay: number;
  /** Day of month the PADI Instructor Examination starts. */
  examDay: number;
  /** Set when a stage starts in the PREVIOUS month (December's prep is in Nov). */
  prepMonthOffset?: number;
}

/**
 * Transcribed from the IDC course detail (src/i18n/courseDetails.ts), confirmed
 * current by Ben on 2026-08-16. There is no exam January-March; the season runs
 * April to December.
 */
export const IE_SCHEDULE: IeEntry[] = [
  { month: 4, prepDay: 4, idcDay: 7, examDay: 21 },
  { month: 5, prepDay: 2, idcDay: 5, examDay: 19 },
  { month: 6, prepDay: 6, idcDay: 9, examDay: 23 },
  { month: 7, prepDay: 4, idcDay: 7, examDay: 21 },
  { month: 8, prepDay: 1, idcDay: 4, examDay: 18 },
  { month: 9, prepDay: 5, idcDay: 8, examDay: 22 },
  { month: 10, prepDay: 3, idcDay: 6, examDay: 20 },
  { month: 11, prepDay: 7, idcDay: 10, examDay: 24 },
  // December's refresher starts on 28 November.
  { month: 12, prepDay: 28, idcDay: 1, examDay: 15, prepMonthOffset: -1 },
];

export interface NextExam {
  entry: IeEntry;
  examDate: Date;
  idcDate: Date;
  /** Whole days from `from` to the exam. 0 = today. */
  daysAway: number;
}

/**
 * The next Instructor Examination on or after `from`, or null when the season
 * is over and next year's dates are not published yet.
 *
 * `from` is injected rather than read from the clock so this stays a pure
 * function - the components pass a date they created after mount (see below),
 * and the tests pass fixed ones.
 */
export function nextInstructorExam(from: Date, year = IE_SCHEDULE_YEAR): NextExam | null {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = startOfDay(from);

  for (const entry of IE_SCHEDULE) {
    const examDate = new Date(year, entry.month - 1, entry.examDay);
    if (examDate < today) continue;
    const idcDate = new Date(year, entry.month - 1 + (entry.prepMonthOffset ?? 0), entry.idcDay);
    const daysAway = Math.round((examDate.getTime() - today.getTime()) / 86_400_000);
    return { entry, examDate, idcDate, daysAway };
  }
  return null;
}

/** Month name in the visitor's language, for the calendar rows. */
export function monthName(month: number, lang: Language, style: "short" | "long" = "short") {
  const locale = lang === "he" ? "he-IL" : lang === "es" ? "es-ES" : lang === "fr" ? "fr-FR" : "en-GB";
  return new Date(IE_SCHEDULE_YEAR, month - 1, 1).toLocaleDateString(locale, { month: style });
}

/** "18 August" in the visitor's language. */
export function formatExamDate(date: Date, lang: Language) {
  const locale = lang === "he" ? "he-IL" : lang === "es" ? "es-ES" : lang === "fr" ? "fr-FR" : "en-GB";
  return date.toLocaleDateString(locale, { day: "numeric", month: "long" });
}

// ---------------------------------------------------------------------------
// Tracks
// ---------------------------------------------------------------------------

export type TrackKey = "divemaster" | "idc" | "combined";

export interface GoProTrack {
  key: TrackKey;
  /** Course dialog to deep-link into for the full detail (SLUG_TO_COURSE keys). */
  courseSlug: string | null;
  /** No prices published - Ben, 2026-08-16: enquire only. */
  name: Record<Language, string>;
  forWho: Record<Language, string>;
  duration: Record<Language, string>;
  points: Record<Language, string[]>;
}

export const GO_PRO_TRACKS: GoProTrack[] = [
  {
    key: "divemaster",
    courseSlug: "divemaster",
    name: { en: "Divemaster", he: "דייבמאסטר", es: "Divemaster", fr: "Divemaster" },
    forWho: {
      en: "You're a Rescue Diver and you want to work in diving.",
      he: "יש לך Rescue Diver ואתה רוצה לעבוד בצלילה.",
      es: "Eres Rescue Diver y quieres trabajar en el buceo.",
      fr: "Vous êtes Rescue Diver et vous voulez travailler dans la plongée.",
    },
    duration: { en: "4-8 weeks", he: "4-8 שבועות", es: "4-8 semanas", fr: "4-8 semaines" },
    points: {
      en: ["The first professional rating", "Guide certified divers", "Free internship with us"],
      he: ["הדרגה המקצועית הראשונה", "להוביל צוללים מוסמכים", "התמחות חינם אצלנו"],
      es: ["El primer nivel profesional", "Guía a buceadores certificados", "Prácticas gratuitas con nosotros"],
      fr: ["Le premier niveau professionnel", "Guider des plongeurs certifiés", "Stage gratuit chez nous"],
    },
  },
  {
    key: "idc",
    courseSlug: "idc",
    name: {
      en: "IDC - Instructor Development Course",
      he: "IDC - קורס מדריכים",
      es: "IDC - Curso de Instructor",
      fr: "IDC - Cours d'Instructeur",
    },
    forWho: {
      en: "You already hold Divemaster and you want to teach.",
      he: "יש לך כבר דייבמאסטר ואתה רוצה ללמד.",
      es: "Ya tienes el Divemaster y quieres enseñar.",
      fr: "Vous avez déjà le Divemaster et vous voulez enseigner.",
    },
    duration: { en: "2 weeks + exam", he: "שבועיים + מבחן", es: "2 semanas + examen", fr: "2 semaines + examen" },
    points: {
      en: [
        "Timed to finish right before the monthly IE",
        "2 days of theory refresher before we start",
        "Taught at a PADI 5 Star IDC centre",
      ],
      he: [
        "מתוזמן להסתיים בדיוק לפני מבחן ההסמכה החודשי",
        "יומיים רענון תאוריה לפני שמתחילים",
        "נלמד במרכז PADI 5 Star IDC",
      ],
      es: [
        "Programado para terminar justo antes del IE mensual",
        "2 días de repaso teórico antes de empezar",
        "Impartido en un centro PADI 5 Star IDC",
      ],
      fr: [
        "Programmé pour finir juste avant l'IE mensuel",
        "2 jours de révision théorique avant de commencer",
        "Enseigné dans un centre PADI 5 Star IDC",
      ],
    },
  },
  {
    key: "combined",
    courseSlug: null,
    name: {
      en: "Divemaster → Instructor, back to back",
      he: "דייבמאסטר → מדריך, ברצף",
      es: "Divemaster → Instructor, seguidos",
      fr: "Divemaster → Instructeur, à la suite",
    },
    forWho: {
      en: "You want the whole route in one trip, without going home in between.",
      he: "רוצה את כל המסלול בנסיעה אחת, בלי לחזור הביתה באמצע.",
      es: "Quieres la ruta completa en un solo viaje, sin volver a casa entre medias.",
      fr: "Vous voulez tout le parcours en un seul voyage, sans rentrer entre les deux.",
    },
    duration: { en: "3-4 months", he: "3-4 חודשים", es: "3-4 meses", fr: "3-4 mois" },
    points: {
      en: [
        "Two separate courses, one continuous plan",
        "We schedule your Divemaster to land on an IDC start",
        "One conversation, one timeline",
      ],
      he: [
        "שני קורסים נפרדים, תוכנית אחת רציפה",
        "נתזמן את הדייבמאסטר כך שייפול על תחילת IDC",
        "שיחה אחת, לוח זמנים אחד",
      ],
      es: [
        "Dos cursos separados, un plan continuo",
        "Programamos tu Divemaster para que enlace con un IDC",
        "Una conversación, un calendario",
      ],
      fr: [
        "Deux cours distincts, un plan continu",
        "Nous calons votre Divemaster sur un début d'IDC",
        "Une conversation, un calendrier",
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------

export interface GoProCopy {
  seoTitle: string;
  seoDescription: string;
  breadcrumb: string;
  /** Gate card + banner eyebrow. */
  kicker: string;
  gateLabel: string;
  gateSub: string;
  heroTitle: string;
  heroSub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  credential: string;
  credentialSub: string;
  tracksTitle: string;
  tracksSub: string;
  forWhoLabel: string;
  durationLabel: string;
  trackCta: string;
  detailCta: string;
  calendarTitle: string;
  calendarSub: string;
  nextIe: string;
  /** n = whole days until the exam. */
  inDays: (n: number) => string;
  seasonOver: string;
  colMonth: string;
  colIdc: string;
  colExam: string;
  priceNote: string;
  closingTitle: string;
  closingBody: string;
  backToSite: string;
}

export const GO_PRO_COPY: Record<Language, GoProCopy> = {
  en: {
    seoTitle: "Go Pro on Koh Tao - PADI Divemaster & IDC | Siam Scuba",
    seoDescription:
      "Become a PADI professional at a 5 Star Instructor Development Center on Koh Tao. Divemaster and IDC, with the monthly Instructor Examination dates. Talk to an instructor.",
    breadcrumb: "Go Pro",
    kicker: "Go Pro · IDC + DM",
    gateLabel: "Become a PADI Instructor",
    gateSub: "Divemaster & IDC training on Koh Tao",
    heroTitle: "Become a PADI Instructor",
    heroSub:
      "Koh Tao certifies more dive professionals than anywhere else in the world. We are one of its 5 Star Instructor Development Centers.",
    ctaPrimary: "Talk to an instructor",
    ctaSecondary: "See exam dates",
    credential: "PADI 5 Star Instructor Development Center",
    credentialSub: "The rating PADI gives centres authorised to train new instructors.",
    tracksTitle: "Two courses, one route",
    tracksSub:
      "Divemaster and the IDC are separate certifications with separate prerequisites. Take one, or book them back to back and become the complete professional in one visit.",
    forWhoLabel: "Who it's for",
    durationLabel: "Length",
    trackCta: "Ask about this",
    detailCta: "Full course detail",
    calendarTitle: "Instructor Examination dates",
    calendarSub:
      "The IE is run by PADI, not by us, on fixed dates each month. Our IDC is timed to finish right before it.",
    nextIe: "Next Instructor Exam",
    inDays: (n) => (n === 0 ? "today" : n === 1 ? "tomorrow" : `in ${n} days`),
    seasonOver: "This year's exam season has finished - message us for next year's dates.",
    colMonth: "Month",
    colIdc: "IDC starts",
    colExam: "Exam",
    priceNote: "Course fees depend on the route and your certifications - ask and we'll price it for you.",
    closingTitle: "Not sure which one you need?",
    closingBody:
      "Tell us what you're certified as and how long you have. We'll tell you honestly which route fits - and if the timing doesn't work this season, we'll say so.",
    backToSite: "Back to Siam Scuba",
  },

  he: {
    seoTitle: "להפוך למקצוען בקוטאו - PADI דייבמאסטר ו-IDC | סיאם סקובה",
    seoDescription:
      "להפוך למקצוען PADI במרכז 5 Star Instructor Development Center בקוטאו. דייבמאסטר ו-IDC, כולל תאריכי מבחני ההסמכה החודשיים. דברו עם מדריך.",
    breadcrumb: "מסלול מקצועי",
    kicker: "Go Pro · IDC + DM",
    gateLabel: "להפוך למדריך PADI",
    gateSub: "הכשרת דייבמאסטר ו-IDC בקוטאו",
    heroTitle: "להפוך למדריך PADI",
    heroSub:
      "בקוטאו מוסמכים יותר אנשי מקצוע בצלילה מכל מקום אחר בעולם. אנחנו אחד ממרכזי ה-5 Star Instructor Development Center שבה.",
    ctaPrimary: "לדבר עם מדריך",
    ctaSecondary: "לתאריכי המבחנים",
    credential: "PADI 5 Star Instructor Development Center",
    credentialSub: "הדירוג ש-PADI נותנת למרכזים המורשים להכשיר מדריכים חדשים.",
    tracksTitle: "שני קורסים, מסלול אחד",
    tracksSub:
      "דייבמאסטר ו-IDC הם הסמכות נפרדות עם תנאי קבלה נפרדים. אפשר לעשות אחד מהם, או להירשם לשניהם ברצף ולהפוך למקצוען השלם בביקור אחד.",
    forWhoLabel: "למי זה מתאים",
    durationLabel: "משך",
    trackCta: "לשאול על זה",
    detailCta: "פרטי הקורס המלאים",
    calendarTitle: "תאריכי מבחני ההסמכה",
    calendarSub:
      "מבחן ההסמכה (IE) מנוהל על ידי PADI ולא על ידינו, בתאריכים קבועים בכל חודש. ה-IDC שלנו מתוזמן להסתיים בדיוק לפניו.",
    nextIe: "מבחן ההסמכה הבא",
    inDays: (n) => (n === 0 ? "היום" : n === 1 ? "מחר" : `בעוד ${n} ימים`),
    seasonOver: "עונת המבחנים השנה הסתיימה - כתבו לנו לתאריכים של השנה הבאה.",
    colMonth: "חודש",
    colIdc: "תחילת IDC",
    colExam: "מבחן",
    priceNote: "מחיר הקורס תלוי במסלול ובהסמכות שלכם - שאלו ונתמחר עבורכם.",
    closingTitle: "לא בטוחים מה מתאים לכם?",
    closingBody:
      "ספרו לנו מה ההסמכה שלכם וכמה זמן יש לכם. נגיד לכם בכנות איזה מסלול מתאים - ואם התזמון לא מסתדר העונה, נגיד גם את זה.",
    backToSite: "חזרה לסיאם סקובה",
  },

  es: {
    seoTitle: "Hazte profesional en Koh Tao - PADI Divemaster e IDC | Siam Scuba",
    seoDescription:
      "Conviértete en profesional PADI en un 5 Star Instructor Development Center de Koh Tao. Divemaster e IDC, con las fechas del Examen de Instructor mensual. Habla con un instructor.",
    breadcrumb: "Hazte profesional",
    kicker: "Go Pro · IDC + DM",
    gateLabel: "Conviértete en Instructor PADI",
    gateSub: "Formación Divemaster e IDC en Koh Tao",
    heroTitle: "Conviértete en Instructor PADI",
    heroSub:
      "En Koh Tao se certifican más profesionales del buceo que en ningún otro lugar del mundo. Somos uno de sus 5 Star Instructor Development Centers.",
    ctaPrimary: "Habla con un instructor",
    ctaSecondary: "Ver fechas de examen",
    credential: "PADI 5 Star Instructor Development Center",
    credentialSub: "La categoría que PADI da a los centros autorizados a formar nuevos instructores.",
    tracksTitle: "Dos cursos, una ruta",
    tracksSub:
      "El Divemaster y el IDC son certificaciones separadas con requisitos distintos. Haz uno, o resérvalos seguidos y conviértete en el profesional completo en una sola visita.",
    forWhoLabel: "Para quién es",
    durationLabel: "Duración",
    trackCta: "Preguntar por esto",
    detailCta: "Detalle completo del curso",
    calendarTitle: "Fechas del Examen de Instructor",
    calendarSub:
      "El IE lo organiza PADI, no nosotros, en fechas fijas cada mes. Nuestro IDC está programado para terminar justo antes.",
    nextIe: "Próximo Examen de Instructor",
    inDays: (n) => (n === 0 ? "hoy" : n === 1 ? "mañana" : `en ${n} días`),
    seasonOver: "La temporada de exámenes de este año ha terminado: escríbenos para las fechas del próximo.",
    colMonth: "Mes",
    colIdc: "Empieza el IDC",
    colExam: "Examen",
    priceNote: "El precio depende de la ruta y de tus certificaciones: pregúntanos y te lo calculamos.",
    closingTitle: "¿No sabes cuál necesitas?",
    closingBody:
      "Dinos qué titulación tienes y cuánto tiempo dispones. Te diremos con honestidad qué ruta encaja, y si las fechas no cuadran esta temporada, también te lo diremos.",
    backToSite: "Volver a Siam Scuba",
  },

  fr: {
    seoTitle: "Devenez pro à Koh Tao - PADI Divemaster et IDC | Siam Scuba",
    seoDescription:
      "Devenez professionnel PADI dans un 5 Star Instructor Development Center à Koh Tao. Divemaster et IDC, avec les dates de l'Examen d'Instructeur mensuel. Parlez à un instructeur.",
    breadcrumb: "Devenir pro",
    kicker: "Go Pro · IDC + DM",
    gateLabel: "Devenez Instructeur PADI",
    gateSub: "Formation Divemaster et IDC à Koh Tao",
    heroTitle: "Devenez Instructeur PADI",
    heroSub:
      "Koh Tao certifie plus de professionnels de la plongée que n'importe où au monde. Nous sommes l'un de ses 5 Star Instructor Development Centers.",
    ctaPrimary: "Parler à un instructeur",
    ctaSecondary: "Voir les dates d'examen",
    credential: "PADI 5 Star Instructor Development Center",
    credentialSub: "Le statut que PADI accorde aux centres autorisés à former de nouveaux instructeurs.",
    tracksTitle: "Deux cours, un parcours",
    tracksSub:
      "Le Divemaster et l'IDC sont deux certifications distinctes, avec des prérequis différents. Faites-en un, ou réservez-les à la suite et devenez le professionnel complet en une seule visite.",
    forWhoLabel: "Pour qui",
    durationLabel: "Durée",
    trackCta: "Poser une question",
    detailCta: "Détail complet du cours",
    calendarTitle: "Dates de l'Examen d'Instructeur",
    calendarSub:
      "L'IE est organisé par PADI, pas par nous, à dates fixes chaque mois. Notre IDC est calé pour se terminer juste avant.",
    nextIe: "Prochain Examen d'Instructeur",
    inDays: (n) => (n === 0 ? "aujourd'hui" : n === 1 ? "demain" : `dans ${n} jours`),
    seasonOver: "La saison d'examens de cette année est terminée - écrivez-nous pour les dates de l'an prochain.",
    colMonth: "Mois",
    colIdc: "Début de l'IDC",
    colExam: "Examen",
    priceNote: "Le tarif dépend du parcours et de vos brevets - demandez-nous et nous le chiffrons.",
    closingTitle: "Vous ne savez pas lequel choisir ?",
    closingBody:
      "Dites-nous vos brevets et le temps dont vous disposez. Nous vous dirons honnêtement quel parcours convient - et si le calendrier ne colle pas cette saison, nous le dirons aussi.",
    backToSite: "Retour à Siam Scuba",
  },
};

// ---------------------------------------------------------------------------
// Routing + links
// ---------------------------------------------------------------------------

export const GO_PRO_LANGS: Language[] = ["en", "he", "es", "fr"];

export const goProPath = (lang: Language) => (lang === "en" ? "/go-pro" : `/${lang}/go-pro`);

export const goProUrl = (lang: Language) => `https://siamscuba.com${goProPath(lang)}`;

export const goProHreflangAlternates = () =>
  Object.fromEntries(GO_PRO_LANGS.map((l) => [l, goProUrl(l)])) as Record<Language, string>;
