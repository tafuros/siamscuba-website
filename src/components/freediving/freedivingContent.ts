import type { Language } from "@/i18n/translations";

// Curated "Siam Freediving" catalogue. Source: kaizenfreediving.com - the Koh Tao
// freediving school (PADI Freediver + AIDA) that Siam Scuba resells. Prices are
// THB; "from" = lowest published (group rate). Leads funnel to WhatsApp/Nemo
// (no DiveOS freediving course slug yet - can add a category later like Similan).
//
// NOTE for Ben: confirm/adjust prices against your reseller rates before go-live.

export interface FreedivingCourse {
  id: string;
  price: number; // THB; "from" where group/private variants exist
  image: string;
  recommended?: boolean;
}

export const FREEDIVING_COURSES: FreedivingCourse[] = [
  { id: "discover", price: 3800, image: "/freediving/discover.jpg" },
  { id: "beginner", price: 8000, image: "/freediving/beginner.jpg", recommended: true },
  { id: "advanced", price: 10500, image: "/freediving/advanced.jpg" },
  { id: "instructor", price: 45000, image: "/freediving/instructor.jpg" },
  { id: "zerohero", price: 68000, image: "/freediving/zerohero.jpg" },
];

export interface FreedivingCourseText {
  name: string;
  who: string;
  meta: string;
  badge?: string;
  highlights: string[];
}

export interface FreedivingCopy {
  hero: { kicker: string; title: string; subtitle: string; note: string; cta: string };
  courses: {
    title: string;
    subtitle: string;
    from: string;
    perPerson: string;
    reserve: string;
    items: Record<string, FreedivingCourseText>;
  };
  included: { title: string; items: string[] };
  know: { title: string; items: string[] };
  booking: {
    title: string;
    subtitle: string;
    course: string;
    name: string;
    namePh: string;
    phone: string;
    phonePh: string;
    date: string;
    people: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    whatsapp: string;
  };
  back: string;
}

export const freedivingCopy: Record<Language, FreedivingCopy> = {
  en: {
    hero: {
      kicker: "Siam Freediving",
      title: "Freediving on Koh Tao",
      subtitle: "One breath, the deep blue - from your very first freedive to going pro, on Thailand's freediving island.",
      note: "Small groups · record-holding instructors · year-round on Koh Tao",
      cta: "See the courses",
    },
    courses: {
      title: "Find your course",
      subtitle: "From a one-day taster to a full instructor pathway - pick where you start.",
      from: "from",
      perPerson: "per person",
      reserve: "Enquire / book",
      items: {
        discover: {
          name: "Discover Freediving",
          who: "No experience · no certification",
          meta: "1 day · pool + open water",
          badge: "Try it",
          highlights: ["Breathing & safety theory", "Pool skills session", "First guided freedive", "All equipment provided"],
        },
        beginner: {
          name: "Beginner Freediver",
          who: "PADI Freediver / AIDA 2",
          meta: "3 days · depth 10-16m",
          badge: "Most popular",
          highlights: ["Certification: PADI Freediver or AIDA 2", "2 pool + 2 open-water sessions", "Max 3 students per instructor", "Gear, dive computer & manual"],
        },
        advanced: {
          name: "Advanced Freediver",
          who: "PADI Advanced / AIDA 3",
          meta: "3 days · depth 20-30m",
          badge: "Go deeper",
          highlights: ["Certification: AIDA 3 / PADI Advanced", "Static 2:30+ · dynamic 50m+", "Max 2 students per instructor", "Requires Freediver / AIDA 2"],
        },
        instructor: {
          name: "Freediving Instructor",
          who: "PADI Freediving Instructor",
          meta: "~2 weeks · go pro",
          badge: "Make it a career",
          highlights: ["Teach PADI freediving", "27m dive · 3:00 static · 60m dynamic", "Rescue & safety mastery", "Requires Master Freediver + EFR"],
        },
        zerohero: {
          name: "Zero to Hero",
          who: "Beginner → Instructor",
          meta: "2-4 months · full pathway",
          badge: "Zero to pro",
          highlights: ["Freediver → Advanced → Master → Instructor", "Unlimited pool & open-water training", "Assist on courses + mentorship", "Individual training plans"],
        },
      },
    },
    included: {
      title: "What's included",
      items: [
        "Internationally recognised certification (PADI / AIDA)",
        "All freediving gear incl. dive computer",
        "Online theory manual",
        "Small groups - max 2-3 students per instructor",
      ],
    },
    know: {
      title: "Good to know",
      items: [
        "On Koh Tao - pool sessions + open-water dives, metres from the beach",
        "Beginner from age 12; Advanced from 15; Instructor 18+",
        "A deposit holds your spot; balance paid on the island",
        "Run with Kaizen - a record-holding Koh Tao freediving school since 2014",
      ],
    },
    booking: {
      title: "Reserve your spot",
      subtitle: "Tell us the course and we'll lock in your dates on WhatsApp - no payment now.",
      course: "Course",
      name: "Name",
      namePh: "Your name",
      phone: "WhatsApp number",
      phonePh: "+66 ...",
      date: "Preferred start date",
      people: "People",
      submit: "Reserve my spot",
      sending: "Sending...",
      success: "Got it! 🐬 The Siam Freediving team will message you on WhatsApp shortly.",
      error: "Couldn't send that - please reach us on WhatsApp instead.",
      whatsapp: "Chat on WhatsApp",
    },
    back: "Back to Siam Scuba",
  },
  he: {
    hero: {
      kicker: "Siam Freediving",
      title: "צלילה חופשית בקוֹ טאו",
      subtitle: "נשימה אחת, הכחול העמוק - מהצלילה החופשית הראשונה ועד הסמכת מדריך, באי הצלילה החופשית של תאילנד.",
      note: "קבוצות קטנות · מדריכים שוברי שיאים · כל השנה בקוֹ טאו",
      cta: "לכל הקורסים",
    },
    courses: {
      title: "מצאו את הקורס שלכם",
      subtitle: "מטעימה של יום אחד ועד מסלול הסמכת מדריך - בחרו איפה מתחילים.",
      from: "החל מ-",
      perPerson: "לאדם",
      reserve: "לפרטים / הזמנה",
      items: {
        discover: {
          name: "Discover Freediving",
          who: "ללא ניסיון · ללא הסמכה",
          meta: "יום אחד · בריכה + מים פתוחים",
          badge: "טעימה",
          highlights: ["תיאוריית נשימה ובטיחות", "סשן מיומנויות בבריכה", "צלילה חופשית מודרכת ראשונה", "כל הציוד כלול"],
        },
        beginner: {
          name: "Beginner Freediver",
          who: "PADI Freediver / AIDA 2",
          meta: "3 ימים · עומק 10-16 מ'",
          badge: "הכי פופולרי",
          highlights: ["הסמכה: PADI Freediver או AIDA 2", "2 סשני בריכה + 2 מים פתוחים", "עד 3 תלמידים למדריך", "ציוד, מחשב צלילה וחוברת"],
        },
        advanced: {
          name: "Advanced Freediver",
          who: "PADI Advanced / AIDA 3",
          meta: "3 ימים · עומק 20-30 מ'",
          badge: "עמוק יותר",
          highlights: ["הסמכה: AIDA 3 / PADI Advanced", "סטטי 2:30+ · דינמי 50 מ'+", "עד 2 תלמידים למדריך", "דורש Freediver / AIDA 2"],
        },
        instructor: {
          name: "Freediving Instructor",
          who: "PADI Freediving Instructor",
          meta: "כשבועיים · הסמכה מקצועית",
          badge: "להפוך לקריירה",
          highlights: ["ללמד צלילה חופשית PADI", "צלילה 27 מ' · סטטי 3:00 · דינמי 60 מ'", "שליטה בחילוץ ובבטיחות", "דורש Master Freediver + EFR"],
        },
        zerohero: {
          name: "Zero to Hero",
          who: "ממתחילים ועד מדריך",
          meta: "2-4 חודשים · מסלול מלא",
          badge: "מאפס למקצוען",
          highlights: ["Freediver → Advanced → Master → Instructor", "אימוני בריכה ומים פתוחים ללא הגבלה", "סיוע בקורסים + ליווי אישי", "תוכניות אימון אישיות"],
        },
      },
    },
    included: {
      title: "מה כלול",
      items: [
        "הסמכה בינלאומית מוכרת (PADI / AIDA)",
        "כל ציוד הצלילה החופשית כולל מחשב צלילה",
        "חוברת תיאוריה אונליין",
        "קבוצות קטנות - עד 2-3 תלמידים למדריך",
      ],
    },
    know: {
      title: "כדאי לדעת",
      items: [
        "בקוֹ טאו - סשני בריכה + צלילות מים פתוחים, מטרים מהחוף",
        "מתחילים מגיל 12; Advanced מגיל 15; מדריך מגיל 18",
        "מקדמה שומרת לכם מקום; היתרה משולמת באי",
        "בשיתוף Kaizen - בית ספר שובר שיאים בקוֹ טאו מאז 2014",
      ],
    },
    booking: {
      title: "שריינו את מקומכם",
      subtitle: "ספרו לנו על הקורס ונסגור תאריכים בוואטסאפ - בלי תשלום עכשיו.",
      course: "קורס",
      name: "שם",
      namePh: "השם שלכם",
      phone: "מספר וואטסאפ",
      phonePh: "+66 ...",
      date: "תאריך התחלה מועדף",
      people: "אנשים",
      submit: "שריון מקום",
      sending: "שולח...",
      success: "קיבלנו! 🐬 צוות Siam Freediving יחזור אליכם בוואטסאפ בקרוב.",
      error: "לא הצלחנו לשלוח - דברו איתנו בוואטסאפ במקום.",
      whatsapp: "שיחה בוואטסאפ",
    },
    back: "חזרה ל-Siam Scuba",
  },
  es: {
    hero: {
      kicker: "Siam Freediving",
      title: "Apnea en Koh Tao",
      subtitle: "Una respiración, el azul profundo - desde tu primera apnea hasta hacerte profesional, en la isla de la apnea de Tailandia.",
      note: "Grupos pequeños · instructores plusmarquistas · todo el año en Koh Tao",
      cta: "Ver los cursos",
    },
    courses: {
      title: "Encuentra tu curso",
      subtitle: "Desde una toma de contacto de un día hasta la vía completa de instructor - elige por dónde empezar.",
      from: "desde",
      perPerson: "por persona",
      reserve: "Consultar / reservar",
      items: {
        discover: {
          name: "Discover Freediving",
          who: "Sin experiencia · sin certificación",
          meta: "1 día · piscina + mar",
          badge: "Pruébalo",
          highlights: ["Teoría de respiración y seguridad", "Sesión de piscina", "Primera apnea guiada", "Todo el equipo incluido"],
        },
        beginner: {
          name: "Beginner Freediver",
          who: "PADI Freediver / AIDA 2",
          meta: "3 días · profundidad 10-16m",
          badge: "El más popular",
          highlights: ["Certificación: PADI Freediver o AIDA 2", "2 sesiones de piscina + 2 en mar", "Máx. 3 alumnos por instructor", "Equipo, ordenador y manual"],
        },
        advanced: {
          name: "Advanced Freediver",
          who: "PADI Advanced / AIDA 3",
          meta: "3 días · profundidad 20-30m",
          badge: "Más profundo",
          highlights: ["Certificación: AIDA 3 / PADI Advanced", "Estática 2:30+ · dinámica 50m+", "Máx. 2 alumnos por instructor", "Requiere Freediver / AIDA 2"],
        },
        instructor: {
          name: "Freediving Instructor",
          who: "PADI Freediving Instructor",
          meta: "~2 semanas · hazte pro",
          badge: "Hazlo tu carrera",
          highlights: ["Enseña apnea PADI", "27m · estática 3:00 · dinámica 60m", "Dominio de rescate y seguridad", "Requiere Master Freediver + EFR"],
        },
        zerohero: {
          name: "Zero to Hero",
          who: "De principiante a instructor",
          meta: "2-4 meses · vía completa",
          badge: "De cero a pro",
          highlights: ["Freediver → Advanced → Master → Instructor", "Piscina y mar ilimitados", "Asiste en cursos + mentoría", "Planes de entrenamiento personalizados"],
        },
      },
    },
    included: {
      title: "Qué incluye",
      items: [
        "Certificación reconocida internacionalmente (PADI / AIDA)",
        "Todo el equipo de apnea incl. ordenador",
        "Manual de teoría online",
        "Grupos pequeños - máx. 2-3 alumnos por instructor",
      ],
    },
    know: {
      title: "Bueno saber",
      items: [
        "En Koh Tao - piscina + inmersiones en mar, a metros de la playa",
        "Beginner desde 12 años; Advanced desde 15; Instructor 18+",
        "Un depósito reserva tu plaza; el resto se paga en la isla",
        "Con Kaizen - escuela de apnea plusmarquista en Koh Tao desde 2014",
      ],
    },
    booking: {
      title: "Reserva tu plaza",
      subtitle: "Dinos el curso y aseguramos tus fechas por WhatsApp - sin pago ahora.",
      course: "Curso",
      name: "Nombre",
      namePh: "Tu nombre",
      phone: "Número de WhatsApp",
      phonePh: "+66 ...",
      date: "Fecha de inicio preferida",
      people: "Personas",
      submit: "Reservar mi plaza",
      sending: "Enviando...",
      success: "¡Recibido! 🐬 El equipo de Siam Freediving te escribirá por WhatsApp en breve.",
      error: "No pudimos enviarlo - escríbenos por WhatsApp.",
      whatsapp: "Chatear por WhatsApp",
    },
    back: "Volver a Siam Scuba",
  },
  fr: {
    hero: {
      kicker: "Siam Freediving",
      title: "Apnée à Koh Tao",
      subtitle: "Une respiration, le grand bleu - de votre toute première apnée jusqu'au niveau pro, sur l'île de l'apnée en Thaïlande.",
      note: "Petits groupes · moniteurs recordmen · toute l'année à Koh Tao",
      cta: "Voir les cours",
    },
    courses: {
      title: "Trouvez votre cours",
      subtitle: "D'une initiation d'une journée au parcours complet de moniteur - choisissez votre point de départ.",
      from: "à partir de",
      perPerson: "par personne",
      reserve: "Se renseigner / réserver",
      items: {
        discover: {
          name: "Discover Freediving",
          who: "Aucune expérience · sans brevet",
          meta: "1 jour · piscine + mer",
          badge: "Essayer",
          highlights: ["Théorie respiration & sécurité", "Séance en piscine", "Première apnée encadrée", "Tout l'équipement fourni"],
        },
        beginner: {
          name: "Beginner Freediver",
          who: "PADI Freediver / AIDA 2",
          meta: "3 jours · profondeur 10-16m",
          badge: "Le plus populaire",
          highlights: ["Brevet : PADI Freediver ou AIDA 2", "2 séances piscine + 2 en mer", "Max 3 élèves par moniteur", "Équipement, ordinateur & manuel"],
        },
        advanced: {
          name: "Advanced Freediver",
          who: "PADI Advanced / AIDA 3",
          meta: "3 jours · profondeur 20-30m",
          badge: "Plus profond",
          highlights: ["Brevet : AIDA 3 / PADI Advanced", "Statique 2:30+ · dynamique 50m+", "Max 2 élèves par moniteur", "Requiert Freediver / AIDA 2"],
        },
        instructor: {
          name: "Freediving Instructor",
          who: "PADI Freediving Instructor",
          meta: "~2 semaines · passez pro",
          badge: "En faire un métier",
          highlights: ["Enseignez l'apnée PADI", "27m · statique 3:00 · dynamique 60m", "Maîtrise sauvetage & sécurité", "Requiert Master Freediver + EFR"],
        },
        zerohero: {
          name: "Zero to Hero",
          who: "De débutant à moniteur",
          meta: "2-4 mois · parcours complet",
          badge: "De zéro à pro",
          highlights: ["Freediver → Advanced → Master → Instructor", "Piscine & mer en illimité", "Assistance sur les cours + mentorat", "Plans d'entraînement personnalisés"],
        },
      },
    },
    included: {
      title: "Ce qui est inclus",
      items: [
        "Brevet reconnu internationalement (PADI / AIDA)",
        "Tout l'équipement d'apnée, ordinateur inclus",
        "Manuel de théorie en ligne",
        "Petits groupes - max 2-3 élèves par moniteur",
      ],
    },
    know: {
      title: "Bon à savoir",
      items: [
        "À Koh Tao - séances piscine + plongées en mer, à quelques mètres de la plage",
        "Beginner dès 12 ans ; Advanced dès 15 ; Moniteur 18+",
        "Un acompte réserve votre place ; le solde se paie sur l'île",
        "Avec Kaizen - école d'apnée recordwoman à Koh Tao depuis 2014",
      ],
    },
    booking: {
      title: "Réservez votre place",
      subtitle: "Dites-nous le cours et nous bloquons vos dates sur WhatsApp - sans paiement maintenant.",
      course: "Cours",
      name: "Nom",
      namePh: "Votre nom",
      phone: "Numéro WhatsApp",
      phonePh: "+66 ...",
      date: "Date de début souhaitée",
      people: "Personnes",
      submit: "Réserver ma place",
      sending: "Envoi...",
      success: "Bien reçu ! 🐬 L'équipe Siam Freediving vous écrira sur WhatsApp sous peu.",
      error: "Échec de l'envoi - contactez-nous sur WhatsApp.",
      whatsapp: "Discuter sur WhatsApp",
    },
    back: "Retour à Siam Scuba",
  },
};
