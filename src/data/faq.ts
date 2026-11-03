import type { Language } from "@/i18n/translations";

/**
 * Site-wide FAQ (/faq, /he/faq, /es/faq, /fr/faq) - Ben, 2026-11-03.
 *
 * Every answer restates a fact the site already publishes (public/api/info.json,
 * courseDetails, the course and Divemaster pages, the schedule board). No new
 * numbers live here: when a price changes, change it at the source AND here
 * (prices are pulled from the same constants where one exists).
 *
 * Answers may contain [label](/path) links; FaqPage renders them as router
 * links and the FAQPage JSON-LD strips them to plain text.
 */

import { DM_PRICE } from "@/data/divemaster";

export const FAQ_LANGS: Language[] = ["en", "he", "es", "fr"];
export const faqPath = (lang: Language) => (lang === "en" ? "/faq" : `/${lang}/faq`);

export interface FaqEntry {
  q: string;
  a: string;
}
export interface FaqGroup {
  title: string;
  items: FaqEntry[];
}
export interface FaqCopy {
  seoTitle: string;
  seoDescription: string;
  breadcrumb: string;
  eyebrow: string;
  title: string;
  sub: string;
  groups: FaqGroup[];
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
}

const dm = (locale: string) => DM_PRICE.toLocaleString(locale);

export const FAQ_COPY: Record<Language, FaqCopy> = {
  en: {
    seoTitle: "Diving in Koh Tao - FAQ: Prices, Courses, Booking | Siam Scuba",
    seoDescription:
      "Answers to the questions we get every day: course prices, what's included, deposits, fun dive times, Sail Rock, accommodation and getting to Koh Tao.",
    breadcrumb: "FAQ",
    eyebrow: "Siam Scuba · Koh Tao",
    title: "Frequently asked questions",
    sub: "The questions we answer every day on WhatsApp, in one place.",
    groups: [
      {
        title: "Getting started",
        items: [
          {
            q: "I've never dived. Where do I start?",
            a: "Two ways in. [Discover Scuba Diving](/discover-scuba) is a one-day try dive to 12 m with no certification, from 2,600 THB. [Open Water](/open-water) is the full PADI course: 2.5 days, 12,000 THB, and you're certified for life to dive to 18 m anywhere in the world. Not sure? [Compare the two](/discover-scuba-vs-open-water).",
          },
          {
            q: "Do I need to be a strong swimmer?",
            a: "No. You need to be comfortable in the water. For Open Water there's a simple test: float for 10 minutes and swim 200 m (or 300 m with mask, fins and snorkel), at any pace.",
          },
          {
            q: "What's the minimum age?",
            a: "10 years old for scuba courses. Kids aged 8 and up can try the Bubble Maker, our first taste of scuba for children.",
          },
          {
            q: "I have a medical condition. Can I dive?",
            a: "Everyone fills in a medical declaration before diving, and some conditions need a doctor's clearance. Message us on WhatsApp with your situation - and if you need a doctor's sign-off, get it at home before you fly.",
          },
        ],
      },
      {
        title: "Courses and prices",
        items: [
          {
            q: "What does the Open Water course include?",
            a: "12,000 THB for 4 ocean dives, theory and a pool session, full equipment, dive insurance, the PADI certification card and 2 nights of accommodation at our club. Max 4 students per instructor.",
          },
          {
            q: "What comes after Open Water?",
            a: "[Advanced Open Water](/advanced-open-water-course): 1.5 days, 5 dives including deep and navigation, certified to 30 m - 11,000 THB with 1 night of accommodation. Then [Rescue Diver](/rescue-diver) (11,000 THB) with [EFR](/efr) first aid (5,000 THB).",
          },
          {
            q: "Can I go pro with you?",
            a: `Yes - we're a PADI 5 Star IDC centre. The [Divemaster](/divemaster-course) internship is 21-42 days for ${dm("en-US")} THB, and the [IDC](/go-pro) runs on set dates through the year with Course Director Bob Murphy, ending at the PADI Instructor Examination on Koh Tao.`,
          },
          {
            q: "I haven't dived in a while. What should I do?",
            a: "Book a Scuba Review: a skills refresh with an instructor plus 2 ocean dives for 2,500 THB, or a pool-only refresh for 1,500 THB.",
          },
        ],
      },
      {
        title: "Fun dives",
        items: [
          {
            q: "When do the boats go out, and how much is it?",
            a: "Every day. Morning trip: meet 05:50, back around 11:00. Afternoon trip: meet 11:00, back around 16:00. Each trip is 2 dives for 2,000 THB with full equipment and dive insurance. [See the fun dives](/fun-dives).",
          },
          {
            q: "When is the Sail Rock trip?",
            a: "Every Sunday: meet 06:30, back at 16:00. 3 dives (2 at Sail Rock, 1 at Shark Island), breakfast and a Thai buffet lunch on board, 4,000 THB. The trip sails with a minimum of 10 divers - if it doesn't fill, you get a full refund.",
          },
          {
            q: "Do you do night dives?",
            a: "Yes, for certified divers: one guided dive on a Koh Tao reef, 1,300 THB including a dive light. We meet 45 minutes before sunset.",
          },
        ],
      },
      {
        title: "Booking and payment",
        items: [
          {
            q: "How do I book, and is there a deposit?",
            a: "Book online or message us on WhatsApp. Open Water takes a 2,000 THB deposit online and the 10,000 THB balance on the day; a Discover Scuba takes 1,000 THB. Deposits are non-refundable, but you can reschedule up to 12 hours before.",
          },
          {
            q: "What if I stop a course halfway?",
            a: "There's no refund for a course you stop, for any reason. On Open Water you can finish the course anywhere in the world within 12 months.",
          },
        ],
      },
      {
        title: "Staying on Koh Tao",
        items: [
          {
            q: "Where are you, and how do I get to Koh Tao?",
            a: "We're on Sairee Beach. Ferries (Lomprayah, Songserm, Seatran) arrive at Mae Haad pier from Chumphon on the mainland, or from Koh Samui and Koh Phangan. The closest airports are Koh Samui and Chumphon.",
          },
          {
            q: "Do you have accommodation?",
            a: "Yes, at the club on Sairee Beach. Open Water includes 2 nights and Advanced 1 night. [See the rooms](/hotel).",
          },
          {
            q: "What languages do you teach in?",
            a: "English, Hebrew, Thai, Spanish, French and German.",
          },
          {
            q: "When is the best time to dive Koh Tao?",
            a: "We dive all year, weather permitting. Read our [month-by-month guide](/blog/best-time-to-dive-koh-tao).",
          },
        ],
      },
    ],
    ctaTitle: "Didn't find your question?",
    ctaBody: "Ask us on WhatsApp - we usually reply within minutes.",
    ctaButton: "Ask on WhatsApp",
  },

  he: {
    seoTitle: "שאלות נפוצות - צלילה בקו טאו: מחירים, קורסים והזמנה | סיאם סקובה",
    seoDescription:
      "תשובות לשאלות שאנחנו מקבלים כל יום: מחירי קורסים, מה כלול, מקדמות, שעות צלילות הכיף, Sail Rock, לינה ואיך מגיעים לקו טאו.",
    breadcrumb: "שאלות נפוצות",
    eyebrow: "סיאם סקובה · קו טאו",
    title: "שאלות נפוצות",
    sub: "השאלות שאנחנו עונים עליהן כל יום בוואטסאפ, במקום אחד.",
    groups: [
      {
        title: "מתחילים",
        items: [
          {
            q: "אף פעם לא צללתי. מאיפה מתחילים?",
            a: "יש שתי דרכים. [צלילת היכרות](/he/discover-scuba) היא יום אחד, צלילה עד 12 מטר בלי הסמכה, מ-2,600 באט. [Open Water](/he/open-water) הוא קורס PADI המלא: 2.5 ימים, 12,000 באט, והסמכה לכל החיים לצלול עד 18 מטר בכל העולם. לא בטוחים? [השוואה בין השניים](/he/discover-scuba-vs-open-water).",
          },
          {
            q: "צריך לדעת לשחות טוב?",
            a: "לא. צריך להרגיש בנוח במים. בקורס Open Water יש מבחן פשוט: ציפה של 10 דקות ושחייה של 200 מטר (או 300 מטר עם מסכה, סנפירים ושנורקל), בכל קצב.",
          },
          {
            q: "מאיזה גיל אפשר לצלול?",
            a: "מגיל 10 לקורסי צלילה. ילדים מגיל 8 יכולים לנסות Bubble Maker, טעימה ראשונה מצלילה שמיועדת לילדים.",
          },
          {
            q: "יש לי בעיה רפואית. אפשר לצלול?",
            a: "כל צולל ממלא הצהרה רפואית לפני הצלילה, ובחלק מהמצבים צריך אישור רופא. שלחו לנו בוואטסאפ את המצב שלכם - ואם צריך אישור רופא, כדאי לסדר אותו בבית לפני הטיסה.",
          },
        ],
      },
      {
        title: "קורסים ומחירים",
        items: [
          {
            q: "מה כלול בקורס Open Water?",
            a: "12,000 באט כוללים 4 צלילות בים, תיאוריה ותרגול בבריכה, ציוד מלא, ביטוח צלילה, כרטיס הסמכה של PADI ו-2 לילות לינה במועדון שלנו. עד 4 תלמידים למדריך.",
          },
          {
            q: "מה אחרי Open Water?",
            a: "[Advanced Open Water](/he/advanced-open-water-course): יום וחצי, 5 צלילות כולל צלילת עומק וניווט, הסמכה עד 30 מטר - 11,000 באט כולל לילה אחד של לינה. אחריו Rescue Diver (11,000 באט) עם קורס עזרה ראשונה EFR (5,000 באט).",
          },
          {
            q: "אפשר להפוך אצלכם לאיש מקצוע?",
            a: `כן - אנחנו מרכז PADI 5 Star IDC. ההתמחות של [דייבמאסטר](/he/divemaster-course) נמשכת 21-42 יום ועולה ${dm("en-US")} באט, ו[קורס המדריכים IDC](/he/go-pro) נפתח במועדים קבועים במהלך השנה עם הקורס דירקטור בוב מרפי ומסתיים במבחן המדריכים של PADI בקו טאו.`,
          },
          {
            q: "לא צללתי הרבה זמן. מה כדאי לעשות?",
            a: "Scuba Review: רענון מיומנויות עם מדריך ועוד 2 צלילות בים ב-2,500 באט, או רענון בבריכה בלבד ב-1,500 באט.",
          },
        ],
      },
      {
        title: "צלילות כיף",
        items: [
          {
            q: "מתי הסירות יוצאות וכמה זה עולה?",
            a: "כל יום. יציאת בוקר: נפגשים ב-05:50, חוזרים בסביבות 11:00. יציאת צהריים: נפגשים ב-11:00, חוזרים בסביבות 16:00. כל יציאה היא 2 צלילות ב-2,000 באט, כולל ציוד מלא וביטוח צלילה. [לצלילות הכיף](/he/fun-dives).",
          },
          {
            q: "מתי יוצא הטיול ל-Sail Rock?",
            a: "כל יום ראשון: נפגשים ב-06:30, חוזרים ב-16:00. 3 צלילות (2 ב-Sail Rock ואחת ב-Shark Island), ארוחת בוקר ובופה תאילנדי לצהריים על הסירה, 4,000 באט. היציאה מתקיימת עם 10 צוללים לפחות - אם היא לא מתמלאת, מקבלים החזר מלא.",
          },
          {
            q: "יש צלילות לילה?",
            a: "כן, לצוללים מוסמכים: צלילה מודרכת אחת על שונית בקו טאו, 1,300 באט כולל פנס. נפגשים 45 דקות לפני השקיעה.",
          },
        ],
      },
      {
        title: "הזמנה ותשלום",
        items: [
          {
            q: "איך מזמינים, ויש מקדמה?",
            a: "מזמינים באתר או בוואטסאפ. ב-Open Water משלמים מקדמה של 2,000 באט באתר ואת היתרה, 10,000 באט, ביום הקורס. בצלילת היכרות המקדמה היא 1,000 באט. המקדמה לא מוחזרת, אבל אפשר לשנות מועד עד 12 שעות לפני.",
          },
          {
            q: "מה קורה אם מפסיקים קורס באמצע?",
            a: "אין החזר על קורס שהופסק, מכל סיבה. את קורס ה-Open Water אפשר להשלים בכל מקום בעולם תוך 12 חודשים.",
          },
        ],
      },
      {
        title: "השהות בקו טאו",
        items: [
          {
            q: "איפה אתם ואיך מגיעים לקו טאו?",
            a: "אנחנו בחוף Sairee. המעבורות (Lomprayah, Songserm, Seatran) מגיעות לרציף Mae Haad מצ'ומפון שביבשה, או מקו סמוי וקו פנגן. שדות התעופה הקרובים הם קו סמוי וצ'ומפון.",
          },
          {
            q: "יש אצלכם לינה?",
            a: "כן, במועדון שלנו בחוף Sairee. קורס Open Water כולל 2 לילות ו-Advanced לילה אחד. [לחדרים](/he/hotel).",
          },
          {
            q: "באילו שפות מלמדים?",
            a: "אנגלית, עברית, תאילנדית, ספרדית, צרפתית וגרמנית.",
          },
          {
            q: "מתי הכי טוב לצלול בקו טאו?",
            a: "צוללים כל השנה, בהתאם למזג האוויר. [המדריך חודש אחר חודש](/blog/best-time-to-dive-koh-tao) (באנגלית).",
          },
        ],
      },
    ],
    ctaTitle: "לא מצאתם את השאלה שלכם?",
    ctaBody: "שאלו אותנו בוואטסאפ - בדרך כלל עונים תוך דקות.",
    ctaButton: "לשאול בוואטסאפ",
  },

  es: {
    seoTitle: "Bucear en Koh Tao - Preguntas frecuentes: precios, cursos, reservas | Siam Scuba",
    seoDescription:
      "Respuestas a lo que nos preguntan cada día: precios de los cursos, qué incluyen, depósitos, horarios de las inmersiones, Sail Rock, alojamiento y cómo llegar a Koh Tao.",
    breadcrumb: "Preguntas frecuentes",
    eyebrow: "Siam Scuba · Koh Tao",
    title: "Preguntas frecuentes",
    sub: "Lo que respondemos cada día por WhatsApp, en un solo sitio.",
    groups: [
      {
        title: "Para empezar",
        items: [
          {
            q: "Nunca he buceado. ¿Por dónde empiezo?",
            a: "Hay dos caminos. [Discover Scuba Diving](/es/discover-scuba) es un bautismo de un día hasta 12 m, sin certificación, desde 2.600 THB. [Open Water](/es/open-water) es el curso PADI completo: 2,5 días, 12.000 THB, y quedas certificado de por vida para bucear hasta 18 m en cualquier parte del mundo. ¿Dudas? [Compara los dos](/es/discover-scuba-vs-open-water).",
          },
          {
            q: "¿Tengo que nadar muy bien?",
            a: "No. Tienes que sentirte cómodo en el agua. Para el Open Water hay una prueba sencilla: flotar 10 minutos y nadar 200 m (o 300 m con máscara, aletas y tubo), a tu ritmo.",
          },
          {
            q: "¿Cuál es la edad mínima?",
            a: "10 años para los cursos de buceo. Los niños desde 8 años pueden probar el Bubble Maker, un primer contacto con el buceo pensado para ellos.",
          },
          {
            q: "Tengo una condición médica. ¿Puedo bucear?",
            a: "Todos rellenan una declaración médica antes de bucear, y algunas condiciones necesitan el visto bueno de un médico. Escríbenos por WhatsApp con tu caso, y si necesitas la firma de un médico, consíguela en casa antes de volar.",
          },
        ],
      },
      {
        title: "Cursos y precios",
        items: [
          {
            q: "¿Qué incluye el curso Open Water?",
            a: "12.000 THB por 4 inmersiones en el mar, teoría y una sesión en piscina, equipo completo, seguro de buceo, la tarjeta de certificación PADI y 2 noches de alojamiento en nuestro club. Máximo 4 alumnos por instructor.",
          },
          {
            q: "¿Qué viene después del Open Water?",
            a: "[Advanced Open Water](/es/advanced-open-water-course): 1,5 días, 5 inmersiones incluidas la profunda y la de navegación, certificado hasta 30 m - 11.000 THB con 1 noche de alojamiento. Después, Rescue Diver (11.000 THB) con el curso de primeros auxilios EFR (5.000 THB).",
          },
          {
            q: "¿Puedo hacerme profesional con vosotros?",
            a: `Sí, somos un centro PADI 5 Star IDC. Las prácticas de [Divemaster](/es/divemaster-course) duran 21-42 días por ${dm("es-ES")} THB, y el [IDC](/es/go-pro) se imparte en fechas fijas durante el año con el Course Director Bob Murphy y termina con el examen de instructor de PADI en Koh Tao.`,
          },
          {
            q: "Hace tiempo que no buceo. ¿Qué hago?",
            a: "Reserva un Scuba Review: repaso de habilidades con un instructor y 2 inmersiones en el mar por 2.500 THB, o solo en piscina por 1.500 THB.",
          },
        ],
      },
      {
        title: "Inmersiones recreativas",
        items: [
          {
            q: "¿Cuándo salen los barcos y cuánto cuesta?",
            a: "Todos los días. Salida de mañana: quedamos a las 05:50 y volvemos sobre las 11:00. Salida de tarde: quedamos a las 11:00 y volvemos sobre las 16:00. Cada salida son 2 inmersiones por 2.000 THB con equipo completo y seguro de buceo. [Ver las inmersiones](/es/fun-dives).",
          },
          {
            q: "¿Cuándo es la salida a Sail Rock?",
            a: "Todos los domingos: quedamos a las 06:30 y volvemos a las 16:00. 3 inmersiones (2 en Sail Rock y 1 en Shark Island), desayuno y bufé tailandés de almuerzo a bordo, 4.000 THB. Sale con un mínimo de 10 buceadores; si no se llena, te devolvemos todo.",
          },
          {
            q: "¿Hacéis inmersiones nocturnas?",
            a: "Sí, para buceadores certificados: una inmersión guiada en un arrecife de Koh Tao, 1.300 THB con linterna incluida. Quedamos 45 minutos antes de la puesta de sol.",
          },
        ],
      },
      {
        title: "Reservas y pagos",
        items: [
          {
            q: "¿Cómo reservo? ¿Hay depósito?",
            a: "Reserva online o escríbenos por WhatsApp. El Open Water lleva un depósito de 2.000 THB online y los 10.000 THB restantes el día del curso; el Discover Scuba, 1.000 THB. Los depósitos no se devuelven, pero puedes cambiar la fecha hasta 12 horas antes.",
          },
          {
            q: "¿Y si dejo un curso a medias?",
            a: "No hay reembolso por un curso que dejas, sea cual sea el motivo. El Open Water lo puedes terminar en cualquier parte del mundo en un plazo de 12 meses.",
          },
        ],
      },
      {
        title: "Tu estancia en Koh Tao",
        items: [
          {
            q: "¿Dónde estáis y cómo llego a Koh Tao?",
            a: "Estamos en la playa de Sairee. Los ferris (Lomprayah, Songserm, Seatran) llegan al muelle de Mae Haad desde Chumphon, en el continente, o desde Koh Samui y Koh Phangan. Los aeropuertos más cercanos son Koh Samui y Chumphon.",
          },
          {
            q: "¿Tenéis alojamiento?",
            a: "Sí, en el club en la playa de Sairee. El Open Water incluye 2 noches y el Advanced 1 noche. [Ver las habitaciones](/es/hotel).",
          },
          {
            q: "¿En qué idiomas enseñáis?",
            a: "Inglés, hebreo, tailandés, español, francés y alemán.",
          },
          {
            q: "¿Cuál es la mejor época para bucear en Koh Tao?",
            a: "Buceamos todo el año, si el tiempo lo permite. Lee nuestra [guía mes a mes](/blog/best-time-to-dive-koh-tao) (en inglés).",
          },
        ],
      },
    ],
    ctaTitle: "¿No encuentras tu pregunta?",
    ctaBody: "Pregúntanos por WhatsApp: normalmente respondemos en minutos.",
    ctaButton: "Preguntar por WhatsApp",
  },

  fr: {
    seoTitle: "Plonger à Koh Tao - FAQ : prix, cours, réservation | Siam Scuba",
    seoDescription:
      "Les réponses aux questions qu'on nous pose chaque jour : prix des cours, ce qui est inclus, acomptes, horaires des plongées, Sail Rock, logement et accès à Koh Tao.",
    breadcrumb: "FAQ",
    eyebrow: "Siam Scuba · Koh Tao",
    title: "Questions fréquentes",
    sub: "Les questions auxquelles nous répondons chaque jour sur WhatsApp, au même endroit.",
    groups: [
      {
        title: "Pour commencer",
        items: [
          {
            q: "Je n'ai jamais plongé. Par où commencer ?",
            a: "Deux options. Le [Discover Scuba Diving](/discover-scuba) est un baptême d'une journée jusqu'à 12 m, sans certification, à partir de 2 600 THB. L'[Open Water](/open-water) est le cours PADI complet : 2,5 jours, 12 000 THB, et vous êtes certifié à vie pour plonger jusqu'à 18 m partout dans le monde. Vous hésitez ? [Comparez les deux](/fr/discover-scuba-vs-open-water).",
          },
          {
            q: "Faut-il être bon nageur ?",
            a: "Non. Il faut être à l'aise dans l'eau. Pour l'Open Water, il y a un test simple : 10 minutes de flottaison et 200 m de nage (ou 300 m avec masque, palmes et tuba), à votre rythme.",
          },
          {
            q: "Quel est l'âge minimum ?",
            a: "10 ans pour les cours de plongée. Les enfants dès 8 ans peuvent essayer le Bubble Maker, une première découverte de la plongée pensée pour eux.",
          },
          {
            q: "J'ai un problème de santé. Puis-je plonger ?",
            a: "Chacun remplit une déclaration médicale avant de plonger, et certaines conditions demandent l'accord d'un médecin. Écrivez-nous sur WhatsApp avec votre situation - et s'il faut un certificat médical, faites-le chez vous avant de partir.",
          },
        ],
      },
      {
        title: "Cours et prix",
        items: [
          {
            q: "Que comprend le cours Open Water ?",
            a: "12 000 THB pour 4 plongées en mer, la théorie et une séance en piscine, l'équipement complet, l'assurance plongée, la carte de certification PADI et 2 nuits de logement dans notre club. 4 élèves maximum par instructeur.",
          },
          {
            q: "Et après l'Open Water ?",
            a: "L'[Advanced Open Water](/advanced-open-water-course) : 1,5 jour, 5 plongées dont la profonde et l'orientation, certifié jusqu'à 30 m - 11 000 THB avec 1 nuit de logement. Ensuite, le [Rescue Diver](/rescue-diver) (11 000 THB) avec les premiers secours [EFR](/efr) (5 000 THB).",
          },
          {
            q: "Puis-je devenir professionnel chez vous ?",
            a: `Oui, nous sommes un centre PADI 5 Star IDC. Le stage [Divemaster](/fr/divemaster-course) dure 21 à 42 jours pour ${dm("fr-FR")} THB, et l'[IDC](/fr/go-pro) a lieu à dates fixes dans l'année avec le Course Director Bob Murphy, jusqu'à l'examen d'instructeur PADI à Koh Tao.`,
          },
          {
            q: "Je n'ai pas plongé depuis longtemps. Que faire ?",
            a: "Réservez un Scuba Review : une révision des compétences avec un instructeur et 2 plongées en mer pour 2 500 THB, ou seulement en piscine pour 1 500 THB.",
          },
        ],
      },
      {
        title: "Plongées loisir",
        items: [
          {
            q: "Quand partent les bateaux, et combien ça coûte ?",
            a: "Tous les jours. Sortie du matin : rendez-vous à 05h50, retour vers 11h00. Sortie de l'après-midi : rendez-vous à 11h00, retour vers 16h00. Chaque sortie, c'est 2 plongées pour 2 000 THB, équipement complet et assurance compris. [Voir les plongées](/fr/fun-dives).",
          },
          {
            q: "Quand a lieu la sortie à Sail Rock ?",
            a: "Tous les dimanches : rendez-vous à 06h30, retour à 16h00. 3 plongées (2 à Sail Rock, 1 à Shark Island), petit-déjeuner et buffet thaï à bord, 4 000 THB. La sortie part avec 10 plongeurs minimum ; si elle n'est pas complète, remboursement intégral.",
          },
          {
            q: "Faites-vous des plongées de nuit ?",
            a: "Oui, pour les plongeurs certifiés : une plongée guidée sur un récif de Koh Tao, 1 300 THB lampe comprise. Rendez-vous 45 minutes avant le coucher du soleil.",
          },
        ],
      },
      {
        title: "Réservation et paiement",
        items: [
          {
            q: "Comment réserver ? Y a-t-il un acompte ?",
            a: "Réservez en ligne ou écrivez-nous sur WhatsApp. L'Open Water demande un acompte de 2 000 THB en ligne et le solde de 10 000 THB le jour même ; le Discover Scuba, 1 000 THB. L'acompte n'est pas remboursable, mais vous pouvez changer de date jusqu'à 12 heures avant.",
          },
          {
            q: "Et si j'arrête un cours en cours de route ?",
            a: "Aucun remboursement pour un cours interrompu, quelle qu'en soit la raison. L'Open Water peut être terminé n'importe où dans le monde dans les 12 mois.",
          },
        ],
      },
      {
        title: "Votre séjour à Koh Tao",
        items: [
          {
            q: "Où êtes-vous, et comment venir à Koh Tao ?",
            a: "Nous sommes sur la plage de Sairee. Les ferries (Lomprayah, Songserm, Seatran) arrivent au port de Mae Haad depuis Chumphon, sur le continent, ou depuis Koh Samui et Koh Phangan. Les aéroports les plus proches sont Koh Samui et Chumphon.",
          },
          {
            q: "Avez-vous un hébergement ?",
            a: "Oui, au club sur la plage de Sairee. L'Open Water comprend 2 nuits et l'Advanced 1 nuit. [Voir les chambres](/fr/hotel).",
          },
          {
            q: "Dans quelles langues enseignez-vous ?",
            a: "Anglais, hébreu, thaï, espagnol, français et allemand.",
          },
          {
            q: "Quelle est la meilleure période pour plonger à Koh Tao ?",
            a: "Nous plongeons toute l'année, si la météo le permet. Lisez notre [guide mois par mois](/blog/best-time-to-dive-koh-tao) (en anglais).",
          },
        ],
      },
    ],
    ctaTitle: "Vous n'avez pas trouvé votre question ?",
    ctaBody: "Demandez-nous sur WhatsApp : nous répondons en général en quelques minutes.",
    ctaButton: "Demander sur WhatsApp",
  },
};

/** Strip [label](/path) links to their label - for JSON-LD and plain text. */
export const faqPlain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

export function faqSchema(lang: Language) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: FAQ_COPY[lang].groups.flatMap((g) =>
      g.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: faqPlain(f.a) },
      })),
    ),
  };
}
