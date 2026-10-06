import type { Language } from "@/i18n/translations";
import type { CourseDetail } from "@/i18n/courseDetails";

/**
 * SINGLE SOURCE OF TRUTH for the Divemaster course: the /divemaster-course
 * lander (en/he/es/fr) AND the Divemaster detail dialog on the homepage course
 * card (built from this file by `divemasterCourseDetail`, so the two can never
 * drift apart).
 *
 * Copy from Ben, 2026-09-25 (Hebrew source, translated to en/es/fr). His
 * rulings on the two open points:
 *   - length is 16-35 days, depending on the candidate's pace (replaced the
 *     old "4-8 weeks" everywhere it appeared);
 *   - accommodation and food are the candidate's own cost - a monthly room on
 *     the island runs about 8,000-15,000 THB. Do NOT promise free housing.
 *
 * Prices here must match the homepage course cards (CoursesSection.tsx):
 * Divemaster 40,000 (raised from 38,500 by Ben on 2026-09-27), Rescue 11,000, EFR 5,000.
 */

export const DM_PRICE = 40000;

export const DM_LANGS: Language[] = ["en", "he", "es", "fr"];

export const divemasterPath = (lang: Language) =>
  lang === "en" ? "/divemaster-course" : `/${lang}/divemaster-course`;

export const divemasterUrl = (lang: Language) => `https://siamscuba.com${divemasterPath(lang)}`;

export const divemasterHreflangAlternates = () =>
  Object.fromEntries(DM_LANGS.map((l) => [l, divemasterUrl(l)])) as Record<Language, string>;

export interface DmLearn {
  title: string;
  body: string;
}

export interface DmCopy {
  seoTitle: string;
  seoDescription: string;
  breadcrumb: string;
  kicker: string;
  heroTitle: string;
  heroSub: string;
  internship: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /** Dive-computer readout strip under the hero. */
  readout: { price: string; length: string; lengthNote: string; dives: string; age: string };
  ladderTitle: string;
  ladder: { ow: string; aow: string; rescue: string; dm: string; idc: string };
  youAreHere: string;
  priceTitle: string;
  priceBody: string;
  priceCompare: string;
  stayTitle: string;
  stayBody: string;
  reqTitle: string;
  reqs: string[];
  reqNote: string;
  learnTitle: string;
  learns: DmLearn[];
  waterTestsNote: string;
  waterTests: { value: string; label: string }[];
  dayTitle: string;
  day: { time: string; body: string }[];
  /** Condensed from Paul's DMT behaviours (2026-10-06). */
  expectTitle: string;
  expectLede: string;
  expects: DmLearn[];
  expectMotto: string;
  nextTitle: string;
  /** Mentions of "IDC" in these strings render as links to the IDC info. */
  nextBody: string;
  workTitle: string;
  workPlaces: string[];
  idcLinkLabel: string;
  closingTitle: string;
  closingBody: string;
  /** Short labels used in the homepage dialog. */
  dialog: {
    header: string;
    whatTitle: string;
    stay: string;
    pageLink: string;
  };
}

export const DM_COPY: Record<Language, DmCopy> = {
  he: {
    seoTitle: "קורס דייבמאסטר בקו טאו - PADI Divemaster | סיאם סקובה",
    seoDescription:
      "קורס PADI Divemaster בקו טאו: התמחות של 16-35 יום בתוך הצוות, במרכז PADI 5 Star IDC. 40,000 באט כולל ההתמחות ודמי ההסמכה של PADI.",
    breadcrumb: "קורס דייבמאסטר",
    kicker: "PADI Divemaster · קו טאו",
    heroTitle: "הדרגה המקצועית הראשונה שלך בצלילה",
    heroSub:
      "Divemaster (DM) הוא הדרגה המקצועית הראשונה של PADI. בסוף הקורס אפשר להוביל צוללים מוסמכים בצלילות מודרכות, לעזור למדריכים בקורסים ולעבוד כאיש מקצוע במרכזי צלילה בכל העולם.",
    internship:
      "זה לא קורס כיתה רגיל אלא התמחות (Internship): אתה הופך לחלק מהצוות ולומד מהמדריכים תוך כדי עבודה.",
    ctaPrimary: "לדבר איתנו על דייבמאסטר",
    ctaSecondary: "תנאי קבלה",
    readout: {
      price: "מחיר",
      length: "משך",
      lengthNote: "ימים, לפי הקצב שלך",
      dives: "צלילות לפחות",
      age: "גיל",
    },
    ladderTitle: "איפה זה במסלול",
    ladder: { ow: "Open Water", aow: "Advanced", rescue: "Rescue + EFR", dm: "Divemaster", idc: "IDC" },
    youAreHere: "אתה כאן",
    priceTitle: "מחיר אחד, הכל בפנים",
    priceBody:
      "המחיר כולל את כל ההכשרה, החומרים, הצלילות, תקופת ההתמחות ודמי ההסמכה של PADI. אצלנו לא משלמים בנפרד על ההתמחות.",
    priceCompare: "בקריביים או באוסטרליה גובים על זה בדרך כלל עוד 2,000-3,000 דולר.",
    stayTitle: "לינה ואוכל",
    stayBody: "הלינה והאוכל בזמן ההכשרה על חשבונך. חדר חודשי באי עולה בערך 8,000-15,000 THB.",
    reqTitle: "תנאי קבלה",
    reqs: [
      "Rescue Diver (או מקביל מארגון אחר)",
      "EFR (עזרה ראשונה) מ-24 החודשים האחרונים",
      "לפחות 40 צלילות רשומות",
      "גיל 18 ומעלה",
    ],
    reqNote: "אם עוד אין לך Rescue ו-EFR, אפשר לעשות אותם אצלנו קודם: Rescue ב-11,000 ו-EFR ב-5,000 THB.",
    learnTitle: "מה לומדים",
    learns: [
      { title: "תיאוריה", body: "פיזיקה, פיזיולוגיה, ציוד, סביבה ותורת הצלילה" },
      { title: "24 מיומנויות הבסיס", body: "24 מיומנויות הבסיס של PADI ברמת הדגמה של מדריך" },
      { title: "עזרה בקורסים", body: "עזרה בקורסי Open Water ובקורסים אחרים" },
      { title: "הובלת צלילות", body: "הובלת צלילות בהשגחה באתרים המוכרים באי" },
      { title: "חירום ומיפוי", body: "תרחישי חירום ומיפוי אתר צלילה" },
    ],
    waterTestsNote: "מבחני מים. לא צריך להיות ספורטאי, מתאמנים לזה בהדרגה.",
    waterTests: [
      { value: "400 מ'", label: "שחייה" },
      { value: "800 מ'", label: "שנורקל" },
      { value: "100 מ'", label: "גרירת צולל \"מחוסר הכרה\"" },
      { value: "15 דק'", label: "ציפה במקום" },
    ],
    dayTitle: "יום טיפוסי",
    day: [
      { time: "בוקר", body: "יוצאים בסירה, עוזרים לתלמידים עם הציוד ובצלילה ועושים סיכום בדרך חזרה." },
      { time: "אחר הצהריים", body: "צלילה שנייה, שיעור תיאוריה או תרגול מעשי." },
      { time: "ערב", body: "ממלאים יומן צלילות ולומדים." },
    ],
    expectTitle: "מה אנחנו מצפים מהמתלמדים שלנו",
    expectLede:
      "לצד מדריך, התפקיד שלכם הוא ללמוד, לצפות ולעזור. זו ההזדמנות לראות סגנונות הדרכה שונים ולצמוח לאנשי מקצוע בצלילה.",
    expects: [
      { title: "לומדים, לא מלמדים", body: "לא מסבירים מיומנויות, לא מתקנים תלמידים ולא נותנים עצות - אלא אם המדריך ביקש. מידע סותר מבלבל תלמידים." },
      { title: "נשארים עם הקבוצה", body: "הקשב על המדריך ועל התלמידים. את התרגול של המיומנויות שלכם עושים בזמן אחר." },
      { title: "המדריך מוביל", body: "פועלים לפי ההנחיות שלו. אם יש אי-הסכמה - מדברים איתו אחר כך, אף פעם לא מול התלמידים." },
      { title: "שואלים ברגע הנכון", body: "שאלות מבורכות. אלא אם מדובר בבטיחות, שומרים אותן לזמן שבו המדריך לא באמצע הדרכה." },
      { title: "מוכנים ובזמן", body: "מגיעים מוכנים, עם הציוד מסודר, ויודעים מה התפקיד שלכם לפני שהצלילה מתחילה." },
      { title: "בטיחות ומקצועיות", body: "עוזרים ביוזמה בלי להשתלט, ואף פעם לא חורגים מההכשרה שלכם או מהנחיית המדריך." },
    ],
    expectMotto: "אתם כאן כדי ללמוד ולעזור - לא כדי ללמד.",
    nextTitle: "מה אחרי",
    nextBody:
      "הרבה ממשיכים ישר לקורס מדריכים (IDC). אנחנו מרכז PADI 5 Star IDC, אז אפשר להגיע ממתחיל ועד מדריך באותו מקום ועם אותם מדריכים.",
    workTitle: "יש עבודה ל-DM ב:",
    workPlaces: ["דרום-מזרח אסיה", "ים סוף", "המלדיביים", "הקריביים", "אוסטרליה"],
    idcLinkLabel: "מידע על IDC",
    closingTitle: "מוכן להפוך את הצלילה למקצוע?",
    closingBody:
      "ספר לנו כמה צלילות יש לך ומתי אתה יכול להגיע. אם חסרים לך Rescue או EFR, נשבץ אותם לפני תחילת ההתמחות.",
    dialog: {
      header: "🤿 קורס Divemaster",
      whatTitle: "מה זה",
      stay: "לינה ואוכל בזמן ההכשרה (חדר חודשי בכ-8,000-15,000 THB)",
      pageLink: "לעמוד הקורס המלא",
    },
  },

  en: {
    seoTitle: "PADI Divemaster Course Koh Tao - Pro Internship | Siam Scuba",
    seoDescription:
      "PADI Divemaster on Koh Tao: a 16-35 day internship inside our team at a PADI 5 Star IDC centre. 40,000 THB with the internship and PADI fees included.",
    breadcrumb: "Divemaster Course",
    kicker: "PADI Divemaster · Koh Tao",
    heroTitle: "Your first professional rating in diving",
    heroSub:
      "Divemaster (DM) is PADI's first professional rating. Once certified you can lead certified divers on guided dives, assist instructors on courses and work as a dive professional at dive centres anywhere in the world.",
    internship:
      "It isn't a classroom course. It's an internship: you become part of the team and learn from the instructors on the job.",
    ctaPrimary: "Talk to us about Divemaster",
    ctaSecondary: "Entry requirements",
    readout: {
      price: "Price",
      length: "Length",
      lengthNote: "days, at your own pace",
      dives: "dives minimum",
      age: "Age",
    },
    ladderTitle: "Where it sits on the route",
    ladder: { ow: "Open Water", aow: "Advanced", rescue: "Rescue + EFR", dm: "Divemaster", idc: "IDC" },
    youAreHere: "You are here",
    priceTitle: "One price, everything in",
    priceBody:
      "The price covers all the training, materials, dives, the internship period and your PADI certification fee. With us you don't pay separately for the internship.",
    priceCompare: "In the Caribbean or Australia that usually costs another 2,000-3,000 USD.",
    stayTitle: "Accommodation and food",
    stayBody:
      "Accommodation and food during the training are on you. A monthly room on the island costs about 8,000-15,000 THB.",
    reqTitle: "Entry requirements",
    reqs: [
      "Rescue Diver (or the equivalent from another agency)",
      "EFR (first aid) within the last 24 months",
      "At least 40 logged dives",
      "Age 18 or over",
    ],
    reqNote:
      "No Rescue or EFR yet? You can do them with us first: Rescue for 11,000 THB and EFR for 5,000 THB.",
    learnTitle: "What you learn",
    learns: [
      { title: "Theory", body: "Physics, physiology, equipment, the environment and dive theory" },
      { title: "The 24 core skills", body: "PADI's 24 core skills, at instructor demonstration quality" },
      { title: "Assisting on courses", body: "Assisting on Open Water and other courses" },
      { title: "Leading dives", body: "Leading supervised dives on the island's well-known sites" },
      { title: "Emergencies and mapping", body: "Emergency scenarios and mapping a dive site" },
    ],
    waterTestsNote: "Water skills tests. You don't need to be an athlete - you train up to them gradually.",
    waterTests: [
      { value: "400 m", label: "swim" },
      { value: "800 m", label: "snorkel" },
      { value: "100 m", label: "tow of an \"unconscious\" diver" },
      { value: "15 min", label: "treading water" },
    ],
    dayTitle: "A typical day",
    day: [
      { time: "Morning", body: "Out on the boat: help students with their gear and on the dive, then debrief on the way back." },
      { time: "Afternoon", body: "A second dive, a theory session or hands-on practice." },
      { time: "Evening", body: "Fill in your dive log and study." },
    ],
    expectTitle: "What we expect from our trainees",
    expectLede:
      "Next to an instructor, your job is to learn, observe and assist. It's your chance to see different teaching styles and grow into a dive professional.",
    expects: [
      { title: "Learn, don't teach", body: "Don't explain skills, correct students or give advice unless the instructor asks you to. Conflicting information confuses students." },
      { title: "Stay with the class", body: "Keep your attention on the instructor and the students. Your own skills practice comes at another time." },
      { title: "The instructor leads", body: "Follow their direction. If you disagree, talk to them afterwards - never in front of students." },
      { title: "Ask at the right moment", body: "Questions are encouraged. Unless it's about safety, save them for when the instructor isn't teaching." },
      { title: "Ready and on time", body: "Arrive prepared, with your gear sorted, and know your role before the dive starts." },
      { title: "Safety and professionalism", body: "Help proactively without taking over, and never step beyond your training or the instructor's direction." },
    ],
    expectMotto: "You're here to learn and assist - not to teach.",
    nextTitle: "What comes after",
    nextBody:
      "Many go straight on to the instructor course (IDC). We are a PADI 5 Star IDC centre, so you can go from beginner to instructor in one place, with the same instructors.",
    workTitle: "There's Divemaster work in:",
    workPlaces: ["Southeast Asia", "The Red Sea", "The Maldives", "The Caribbean", "Australia"],
    idcLinkLabel: "About the IDC",
    closingTitle: "Ready to make diving your job?",
    closingBody:
      "Tell us how many dives you have and when you can come. If you still need Rescue or EFR, we'll fit them in before your internship starts.",
    dialog: {
      header: "🤿 Divemaster Course",
      whatTitle: "What it is",
      stay: "Accommodation and food during the training (a monthly room is about 8,000-15,000 THB)",
      pageLink: "Full course page",
    },
  },

  es: {
    seoTitle: "Curso PADI Divemaster en Koh Tao - Prácticas pro | Siam Scuba",
    seoDescription:
      "PADI Divemaster en Koh Tao: prácticas de 16-35 días dentro de nuestro equipo en un centro PADI 5 Star IDC. 40.000 THB con prácticas y tasas PADI incluidas.",
    breadcrumb: "Curso Divemaster",
    kicker: "PADI Divemaster · Koh Tao",
    heroTitle: "Tu primer nivel profesional en el buceo",
    heroSub:
      "El Divemaster (DM) es el primer nivel profesional de PADI. Al terminar puedes guiar a buceadores certificados, ayudar a los instructores en los cursos y trabajar como profesional en centros de buceo de todo el mundo.",
    internship:
      "No es un curso de aula. Son unas prácticas (internship): entras a formar parte del equipo y aprendes de los instructores mientras trabajas.",
    ctaPrimary: "Habla con nosotros del Divemaster",
    ctaSecondary: "Requisitos",
    readout: {
      price: "Precio",
      length: "Duración",
      lengthNote: "días, a tu ritmo",
      dives: "inmersiones mínimo",
      age: "Edad",
    },
    ladderTitle: "Dónde encaja en la ruta",
    ladder: { ow: "Open Water", aow: "Advanced", rescue: "Rescue + EFR", dm: "Divemaster", idc: "IDC" },
    youAreHere: "Estás aquí",
    priceTitle: "Un precio, todo incluido",
    priceBody:
      "El precio incluye toda la formación, los materiales, las inmersiones, el periodo de prácticas y la tasa de certificación de PADI. Con nosotros las prácticas no se pagan aparte.",
    priceCompare: "En el Caribe o en Australia eso suele costar otros 2.000-3.000 USD.",
    stayTitle: "Alojamiento y comida",
    stayBody:
      "El alojamiento y la comida durante la formación corren por tu cuenta. Una habitación mensual en la isla cuesta unos 8.000-15.000 THB.",
    reqTitle: "Requisitos",
    reqs: [
      "Rescue Diver (o equivalente de otra agencia)",
      "EFR (primeros auxilios) de los últimos 24 meses",
      "Al menos 40 inmersiones registradas",
      "18 años o más",
    ],
    reqNote:
      "¿Aún no tienes Rescue ni EFR? Puedes hacerlos antes con nosotros: Rescue por 11.000 THB y EFR por 5.000 THB.",
    learnTitle: "Qué aprendes",
    learns: [
      { title: "Teoría", body: "Física, fisiología, equipo, medio ambiente y teoría del buceo" },
      { title: "Las 24 habilidades básicas", body: "Las 24 habilidades básicas de PADI con calidad de demostración de instructor" },
      { title: "Ayudar en los cursos", body: "Ayudar en cursos Open Water y otros cursos" },
      { title: "Guiar inmersiones", body: "Guiar inmersiones supervisadas en los sitios conocidos de la isla" },
      { title: "Emergencias y mapeo", body: "Escenarios de emergencia y mapeo de un sitio de buceo" },
    ],
    waterTestsNote: "Pruebas en el agua. No hace falta ser atleta: te preparas para ellas poco a poco.",
    waterTests: [
      { value: "400 m", label: "nado" },
      { value: "800 m", label: "snorkel" },
      { value: "100 m", label: "remolque de un buceador \"inconsciente\"" },
      { value: "15 min", label: "flotación en el sitio" },
    ],
    dayTitle: "Un día típico",
    day: [
      { time: "Mañana", body: "Salida en barco: ayudas a los alumnos con el equipo y en la inmersión, y hacéis el debriefing a la vuelta." },
      { time: "Tarde", body: "Una segunda inmersión, una clase de teoría o práctica." },
      { time: "Noche", body: "Rellenas tu diario de inmersiones y estudias." },
    ],
    expectTitle: "Lo que esperamos de nuestros trainees",
    expectLede:
      "Junto a un instructor, tu trabajo es aprender, observar y ayudar. Es tu oportunidad de ver distintos estilos de enseñanza y crecer como profesional del buceo.",
    expects: [
      { title: "Aprende, no enseñes", body: "No expliques habilidades, no corrijas alumnos ni des consejos salvo que el instructor te lo pida. La información contradictoria confunde." },
      { title: "Quédate con la clase", body: "Mantén la atención en el instructor y los alumnos. Tu propia práctica va en otro momento." },
      { title: "El instructor dirige", body: "Sigue sus indicaciones. Si no estás de acuerdo, háblalo después - nunca delante de los alumnos." },
      { title: "Pregunta en el momento justo", body: "Las preguntas son bienvenidas. Salvo que sea de seguridad, guárdalas para cuando el instructor no esté enseñando." },
      { title: "Preparado y puntual", body: "Llega preparado, con tu equipo listo, y conoce tu papel antes de empezar la inmersión." },
      { title: "Seguridad y profesionalidad", body: "Ayuda con iniciativa sin tomar el control, y nunca vayas más allá de tu formación o de lo que indique el instructor." },
    ],
    expectMotto: "Estás aquí para aprender y ayudar - no para enseñar.",
    nextTitle: "Y después",
    nextBody:
      "Muchos siguen directamente con el curso de instructor (IDC). Somos un centro PADI 5 Star IDC, así que puedes pasar de principiante a instructor en el mismo lugar y con los mismos instructores.",
    workTitle: "Hay trabajo para Divemasters en:",
    workPlaces: ["El Sudeste Asiático", "El mar Rojo", "Las Maldivas", "El Caribe", "Australia"],
    idcLinkLabel: "Sobre el IDC",
    closingTitle: "¿Listo para convertir el buceo en tu trabajo?",
    closingBody:
      "Dinos cuántas inmersiones tienes y cuándo puedes venir. Si te falta el Rescue o el EFR, los encajamos antes de que empiecen tus prácticas.",
    dialog: {
      header: "🤿 Curso Divemaster",
      whatTitle: "Qué es",
      stay: "Alojamiento y comida durante la formación (una habitación mensual cuesta unos 8.000-15.000 THB)",
      pageLink: "Página completa del curso",
    },
  },

  fr: {
    seoTitle: "Cours PADI Divemaster à Koh Tao - Stage pro | Siam Scuba",
    seoDescription:
      "PADI Divemaster à Koh Tao : un stage de 16 à 35 jours au sein de notre équipe, dans un centre PADI 5 Star IDC. 40 000 THB, stage et frais PADI inclus.",
    breadcrumb: "Cours Divemaster",
    kicker: "PADI Divemaster · Koh Tao",
    heroTitle: "Votre premier niveau professionnel en plongée",
    heroSub:
      "Le Divemaster (DM) est le premier niveau professionnel PADI. Une fois certifié, vous pouvez guider des plongeurs brevetés, assister les instructeurs pendant les cours et travailler comme professionnel dans des centres de plongée partout dans le monde.",
    internship:
      "Ce n'est pas un cours en salle mais un stage (internship) : vous faites partie de l'équipe et vous apprenez auprès des instructeurs, sur le terrain.",
    ctaPrimary: "Parlez-nous du Divemaster",
    ctaSecondary: "Conditions d'accès",
    readout: {
      price: "Prix",
      length: "Durée",
      lengthNote: "jours, à votre rythme",
      dives: "plongées minimum",
      age: "Âge",
    },
    ladderTitle: "Sa place dans le parcours",
    ladder: { ow: "Open Water", aow: "Advanced", rescue: "Rescue + EFR", dm: "Divemaster", idc: "IDC" },
    youAreHere: "Vous êtes ici",
    priceTitle: "Un seul prix, tout compris",
    priceBody:
      "Le prix couvre toute la formation, le matériel pédagogique, les plongées, la période de stage et les frais de certification PADI. Chez nous, le stage ne se paie pas en plus.",
    priceCompare: "Dans les Caraïbes ou en Australie, cela coûte en général 2 000 à 3 000 USD de plus.",
    stayTitle: "Logement et repas",
    stayBody:
      "Le logement et les repas pendant la formation sont à votre charge. Une chambre au mois sur l'île coûte environ 8 000 à 15 000 THB.",
    reqTitle: "Conditions d'accès",
    reqs: [
      "Rescue Diver (ou équivalent d'une autre agence)",
      "EFR (premiers secours) de moins de 24 mois",
      "Au moins 40 plongées enregistrées",
      "18 ans ou plus",
    ],
    reqNote:
      "Pas encore de Rescue ni d'EFR ? Vous pouvez les passer chez nous avant : Rescue à 11 000 THB et EFR à 5 000 THB.",
    learnTitle: "Ce que vous apprenez",
    learns: [
      { title: "Théorie", body: "Physique, physiologie, équipement, environnement et théorie de la plongée" },
      { title: "Les 24 compétences de base", body: "Les 24 compétences de base PADI, au niveau démonstration d'instructeur" },
      { title: "Assister les cours", body: "Assister les cours Open Water et d'autres cours" },
      { title: "Guider des plongées", body: "Guider des plongées supervisées sur les sites connus de l'île" },
      { title: "Urgences et cartographie", body: "Scénarios d'urgence et cartographie d'un site de plongée" },
    ],
    waterTestsNote: "Épreuves aquatiques. Pas besoin d'être un athlète : on s'y prépare progressivement.",
    waterTests: [
      { value: "400 m", label: "nage" },
      { value: "800 m", label: "PMT" },
      { value: "100 m", label: "remorquage d'un plongeur \"inconscient\"" },
      { value: "15 min", label: "sustentation sur place" },
    ],
    dayTitle: "Une journée type",
    day: [
      { time: "Matin", body: "Sortie en bateau : vous aidez les élèves avec leur équipement et pendant la plongée, puis débriefing sur le retour." },
      { time: "Après-midi", body: "Une deuxième plongée, un cours de théorie ou de la pratique." },
      { time: "Soir", body: "Vous remplissez votre carnet de plongée et vous révisez." },
    ],
    expectTitle: "Ce que nous attendons de nos stagiaires",
    expectLede:
      "Aux côtés d'un instructeur, votre rôle est d'apprendre, d'observer et d'aider. C'est l'occasion de découvrir différents styles d'enseignement et de devenir un professionnel de la plongée.",
    expects: [
      { title: "Apprendre, pas enseigner", body: "N'expliquez pas les exercices, ne corrigez pas les élèves et ne donnez pas de conseils sauf si l'instructeur vous le demande. Des infos contradictoires embrouillent les élèves." },
      { title: "Rester avec le groupe", body: "Gardez votre attention sur l'instructeur et les élèves. Votre propre entraînement se fait à un autre moment." },
      { title: "L'instructeur dirige", body: "Suivez ses consignes. En cas de désaccord, parlez-lui après - jamais devant les élèves." },
      { title: "Poser ses questions au bon moment", body: "Les questions sont bienvenues. Sauf pour la sécurité, gardez-les pour quand l'instructeur n'est pas en train d'enseigner." },
      { title: "Prêt et à l'heure", body: "Arrivez préparé, matériel en ordre, en connaissant votre rôle avant le début de la plongée." },
      { title: "Sécurité et professionnalisme", body: "Aidez avec initiative sans prendre le contrôle, et ne dépassez jamais votre formation ni les consignes de l'instructeur." },
    ],
    expectMotto: "Vous êtes là pour apprendre et aider - pas pour enseigner.",
    nextTitle: "Et après",
    nextBody:
      "Beaucoup enchaînent directement avec le cours d'instructeur (IDC). Nous sommes un centre PADI 5 Star IDC : vous pouvez passer de débutant à instructeur au même endroit, avec les mêmes instructeurs.",
    workTitle: "Il y a du travail de Divemaster en :",
    workPlaces: ["Asie du Sud-Est", "Mer Rouge", "Maldives", "Caraïbes", "Australie"],
    idcLinkLabel: "À propos de l'IDC",
    closingTitle: "Prêt à faire de la plongée votre métier ?",
    closingBody:
      "Dites-nous combien de plongées vous avez et quand vous pouvez venir. S'il vous manque le Rescue ou l'EFR, nous les plaçons avant le début de votre stage.",
    dialog: {
      header: "🤿 Cours Divemaster",
      whatTitle: "Ce que c'est",
      stay: "Logement et repas pendant la formation (une chambre au mois coûte environ 8 000 à 15 000 THB)",
      pageLink: "Page complète du cours",
    },
  },
};

/** "Water skills tests: 400 m swim, ... You don't need to be an athlete ..." */
function waterTestsLine(c: DmCopy) {
  const [head, ...rest] = c.waterTestsNote.split(". ");
  const list = c.waterTests.map((w) => `${w.value} ${w.label}`).join(", ");
  return `${head}: ${list}. ${rest.join(". ")}`;
}

/**
 * The homepage course-dialog entry, derived from the lander copy above so the
 * dialog and the page always say the same thing.
 */
export function divemasterCourseDetail(lang: Language): CourseDetail {
  const c = DM_COPY[lang];
  return {
    header: c.dialog.header,
    intro: c.heroSub,
    structure: [c.internship],
    prerequisites: c.reqs,
    extras: [c.reqNote],
    learns: [
      ...c.learns.map((l) => l.body),
      waterTestsLine(c),
    ],
    schedule: c.day.map((d) => ({ time: d.time, description: d.body })),
    included: [c.priceBody, c.priceCompare],
    notIncluded: [c.dialog.stay],
    price: "40,000 THB",
    nextStep: c.nextBody,
    pageLink: { label: c.dialog.pageLink, href: divemasterPath(lang) },
  };
}
