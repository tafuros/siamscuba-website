import type { Language } from "@/i18n/translations";

// Curated "Siam Similans" catalogue. Source: smiledolphin.com - the operator
// (Smile Dolphin Diving Co., Ltd.) that runs our Similan liveaboard safaris.
// They run a 3-boat fleet (MV Raga, MV Gentle Giant, MV Aqua) over a few set
// routes; our edge is curation - we surface only the recommended trips so the
// customer isn't overwhelmed.
//
// NOTE for Ben: "fromPrice" = the lowest published cabin rate (THB per diver)
// from Smile Dolphin. Confirm/adjust against your reseller rates before go-live.

export type SimilanCourse = "similan-safari" | "similan-daytrip";

export interface SimilanTrip {
  id: string;
  course: SimilanCourse;
  fromPrice: number; // THB per diver, lowest cabin "from"
  image: string;
  recommended?: boolean;
}

// Neutral facts; per-language wording lives in `similanCopy[lang].trips.items[id]`.
export const SIMILAN_TRIPS: SimilanTrip[] = [
  { id: "similan", course: "similan-safari", fromPrice: 29000, image: "/similan/sites/koh-bon.jpg", recommended: true },
  { id: "andaman", course: "similan-safari", fromPrice: 44000, image: "/similan/sites/richelieu.jpg" },
  { id: "south", course: "similan-safari", fromPrice: 22000, image: "/similan/sites/koh-tachai.jpg" },
];

export interface SimilanBoat {
  id: string;
  image: string;
}

export const SIMILAN_BOATS: SimilanBoat[] = [
  { id: "raga", image: "/similan/raga.jpg" },
  { id: "gentle", image: "/similan/gentle-giant.jpg" },
  { id: "aqua", image: "/similan/aqua.png" },
];

export interface SimilanSite {
  key: string;
  image: string;
}

// Representative imagery (not the literal sites) - manta, reef, wreck etc.
export const SIMILAN_SITES: SimilanSite[] = [
  { key: "kohBon", image: "/similan/sites/koh-bon.jpg" },
  { key: "richelieu", image: "/similan/sites/richelieu.jpg" },
  { key: "kohTachai", image: "/similan/sites/koh-tachai.jpg" },
  { key: "elephant", image: "/similan/sites/elephant.jpg" },
  { key: "boonsoong", image: "/similan/sites/boonsoong.jpg" },
];

export interface SimilanTripText {
  name: string;
  meta: string;
  route: string;
  badge?: string;
}

export interface SimilanCopy {
  hero: { kicker: string; title: string; subtitle: string; season: string; cta: string; sitesCta: string };
  trips: {
    title: string;
    subtitle: string;
    from: string;
    perDiver: string;
    reserve: string;
    items: Record<string, SimilanTripText>;
  };
  boats: { title: string; subtitle: string; items: Record<string, { name: string; tagline: string }> };
  sites: {
    title: string;
    subtitle: string;
    close: string;
    items: Record<string, { name: string; desc: string }>;
  };
  included: { title: string; items: string[] };
  know: { title: string; items: string[] };
  booking: {
    title: string;
    subtitle: string;
    trip: string;
    boat: string;
    anyBoat: string;
    name: string;
    namePh: string;
    phone: string;
    phonePh: string;
    date: string;
    divers: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    whatsapp: string;
  };
  back: string;
}

export const similanCopy: Record<Language, SimilanCopy> = {
  en: {
    hero: {
      kicker: "Siam Similans",
      title: "The Similan Islands",
      subtitle: "Thailand's crown jewels - liveaboard safaris to the Andaman's best dive sites, aboard a hand-picked fleet.",
      season: "Similan season: 15 Oct - 15 May. Reserve your spot for the 2026/27 season now.",
      cta: "See the trips",
      sitesCta: "Explore the dive sites",
    },
    trips: {
      title: "Choose your liveaboard",
      subtitle: "A hand-picked few - the trips we send our divers on again and again.",
      from: "from",
      perDiver: "per diver",
      reserve: "Reserve this trip",
      items: {
        similan: {
          name: "Similan & Richelieu Rock",
          meta: "5 days · 4 nights · 14 dives",
          route: "Similan Islands → Koh Bon → Koh Tachai → Richelieu Rock",
          badge: "Most popular",
        },
        andaman: {
          name: "Best of the Andaman",
          meta: "7 days · 6 nights · 22 dives",
          route: "Similan, Richelieu, Koh Haa, Hin Daeng & more",
          badge: "Signature trip",
        },
        south: {
          name: "South Andaman",
          meta: "4 days · 3 nights · 11 dives",
          route: "Koh Phi Phi, Koh Haa & King Cruiser Wreck",
          badge: "Shoulder season",
        },
      },
    },
    boats: {
      title: "Our fleet",
      subtitle: "Three boats, three styles - all running the same world-class routes.",
      items: {
        raga: { name: "MV Raga", tagline: "Luxury flagship · 28 guests · renovated 2024" },
        gentle: { name: "MV Gentle Giant", tagline: "Classic wooden expedition · 20 guests · best value" },
        aqua: { name: "MV Aqua", tagline: "Free Nitrox · 24 guests · most versatile" },
      },
    },
    sites: {
      title: "Andaman dive sites",
      subtitle: "The legendary sites you'll explore on these trips.",
      close: "Close",
      items: {
        richelieu: { name: "Richelieu Rock", desc: "Thailand's most famous dive - whale sharks, seahorses and a riot of macro life on a horseshoe pinnacle." },
        kohBon: { name: "Koh Bon", desc: "A manta ray cleaning station - ridge and wall diving for pelagics." },
        kohTachai: { name: "Koh Tachai", desc: "A current-swept pinnacle drawing schooling fish and big pelagics." },
        elephant: { name: "Elephant Head Rock", desc: "Iconic Similan granite boulders, swim-throughs and arches." },
        boonsoong: { name: "Boonsoong Wreck", desc: "A tin-dredger wreck off Khao Lak, packed with macro critters." },
      },
    },
    included: {
      title: "What's included",
      items: [
        "Free hotel transfers from Khao Lak & Phuket",
        "Full-board meals, snacks & drinks on board",
        "Tanks, weights & divemaster guiding",
        "Wi-Fi on board (free Nitrox on MV Aqua)",
      ],
    },
    know: {
      title: "Good to know",
      items: [
        "Open Water minimum; Advanced or 20+ dives recommended for Richelieu Rock",
        "Departures from Tab Lamu Pier (Phuket / Khao Lak area)",
        "National park fees & gear rental not included",
        "Book now, pay later - reserve your spot with no upfront payment",
      ],
    },
    booking: {
      title: "Reserve your place",
      subtitle: "Tell us the trip and we'll lock in your spot on WhatsApp - no payment now.",
      trip: "Trip",
      boat: "Preferred boat",
      anyBoat: "Any boat",
      name: "Name",
      namePh: "Your name",
      phone: "WhatsApp number",
      phonePh: "+66 ...",
      date: "Preferred date",
      divers: "Divers",
      submit: "Reserve my spot",
      sending: "Sending...",
      success: "Got it! 🐠 The Siam Similans team will message you on WhatsApp shortly.",
      error: "Couldn't send that - please reach us on WhatsApp instead.",
      whatsapp: "Chat on WhatsApp",
    },
    back: "Back to Siam Scuba",
  },
  he: {
    hero: {
      kicker: "Siam Similans",
      title: "איי הסימילן",
      subtitle: "פניני הכתר של תאילנד - safari liveaboard לאתרי הצלילה הטובים באנדמן, עם צי סירות נבחר.",
      season: "עונת הסימילן: 15 באוקטובר - 15 במאי. שריינו מקום לעונת 2026/27 כבר עכשיו.",
      cta: "לכל הטיולים",
      sitesCta: "לאתרי הצלילה",
    },
    trips: {
      title: "בחרו את ה-liveaboard שלכם",
      subtitle: "מבחר קטן ומוקפד - הטיולים שאנחנו שולחים אליהם צוללים שוב ושוב.",
      from: "החל מ-",
      perDiver: "לצולל",
      reserve: "שריון הטיול",
      items: {
        similan: {
          name: "Similan & Richelieu Rock",
          meta: "5 ימים · 4 לילות · 14 צלילות",
          route: "Similan → Koh Bon → Koh Tachai → Richelieu Rock",
          badge: "הכי פופולרי",
        },
        andaman: {
          name: "Best of the Andaman",
          meta: "7 ימים · 6 לילות · 22 צלילות",
          route: "Similan, Richelieu, Koh Haa, Hin Daeng ועוד",
          badge: "טיול הדגל",
        },
        south: {
          name: "South Andaman",
          meta: "4 ימים · 3 לילות · 11 צלילות",
          route: "Koh Phi Phi, Koh Haa & King Cruiser Wreck",
          badge: "תחילת/סוף עונה",
        },
      },
    },
    boats: {
      title: "הצי שלנו",
      subtitle: "שלוש סירות, שלושה סגנונות - כולן באותם מסלולים ברמה עולמית.",
      items: {
        raga: { name: "MV Raga", tagline: "ספינת הדגל היוקרתית · 28 אורחים · שופצה 2024" },
        gentle: { name: "MV Gentle Giant", tagline: "ספינת עץ קלאסית · 20 אורחים · הכי משתלם" },
        aqua: { name: "MV Aqua", tagline: "Nitrox חינם · 24 אורחים · הכי גמישה" },
      },
    },
    sites: {
      title: "אתרי הצלילה באנדמן",
      subtitle: "האתרים האגדיים שתחקרו בטיולים האלה.",
      close: "סגירה",
      items: {
        richelieu: { name: "Richelieu Rock", desc: "הצלילה המפורסמת בתאילנד - כרישי לוויתן, סוסוני ים ושלל חיי מאקרו על פינקל בצורת פרסה." },
        kohBon: { name: "Koh Bon", desc: "תחנת ניקוי של מנטות - צלילת רכס וקיר לפלאגים." },
        kohTachai: { name: "Koh Tachai", desc: "פינקל עם זרמים שמושך להקות דגים ופלאגים גדולים." },
        elephant: { name: "Elephant Head Rock", desc: "סלעי גרניט אייקוניים של סימילן, מעברים וקשתות." },
        boonsoong: { name: "Boonsoong Wreck", desc: "הריסת ספינת כרייה ליד קאו לאק, מלאה ביצורי מאקרו." },
      },
    },
    included: {
      title: "מה כלול",
      items: [
        "הסעות חינם ממלונות בקאו לאק ופוקט",
        "ארוחות מלאות, חטיפים ושתייה על הסירה",
        "מיכלים, משקולות וליווי דייבמאסטר",
        "Wi-Fi על הסירה (Nitrox חינם ב-MV Aqua)",
      ],
    },
    know: {
      title: "כדאי לדעת",
      items: [
        "רישיון Open Water לפחות; מומלצות Advanced או 20+ צלילות ל-Richelieu Rock",
        "יציאה מרציף Tab Lamu (אזור פוקט / קאו לאק)",
        "דמי כניסה לפארק הלאומי והשכרת ציוד אינם כלולים",
        "הזמינו עכשיו, שלמו אחר כך - שריון מקום ללא תשלום מראש",
      ],
    },
    booking: {
      title: "שריינו את מקומכם",
      subtitle: "ספרו לנו על הטיול ונסגור לכם מקום בוואטסאפ - בלי תשלום עכשיו.",
      trip: "טיול",
      boat: "סירה מועדפת",
      anyBoat: "כל סירה",
      name: "שם",
      namePh: "השם שלכם",
      phone: "מספר וואטסאפ",
      phonePh: "+66 ...",
      date: "תאריך מועדף",
      divers: "צוללים",
      submit: "שריון מקום",
      sending: "שולח...",
      success: "קיבלנו! 🐠 צוות Siam Similans יחזור אליכם בוואטסאפ בקרוב.",
      error: "לא הצלחנו לשלוח - דברו איתנו בוואטסאפ במקום.",
      whatsapp: "שיחה בוואטסאפ",
    },
    back: "חזרה ל-Siam Scuba",
  },
  es: {
    hero: {
      kicker: "Siam Similans",
      title: "Las Islas Similan",
      subtitle: "Las joyas de Tailandia - safaris liveaboard a los mejores puntos del Andamán, con una flota seleccionada.",
      season: "Temporada Similan: 15 oct - 15 may. Reserva tu plaza para la temporada 2026/27 ahora.",
      cta: "Ver los viajes",
      sitesCta: "Ver los puntos de buceo",
    },
    trips: {
      title: "Elige tu liveaboard",
      subtitle: "Una selección reducida - los viajes a los que enviamos a nuestros buceadores una y otra vez.",
      from: "desde",
      perDiver: "por buceador",
      reserve: "Reservar este viaje",
      items: {
        similan: {
          name: "Similan & Richelieu Rock",
          meta: "5 días · 4 noches · 14 inmersiones",
          route: "Similan → Koh Bon → Koh Tachai → Richelieu Rock",
          badge: "El más popular",
        },
        andaman: {
          name: "Best of the Andaman",
          meta: "7 días · 6 noches · 22 inmersiones",
          route: "Similan, Richelieu, Koh Haa, Hin Daeng y más",
          badge: "Viaje estrella",
        },
        south: {
          name: "South Andaman",
          meta: "4 días · 3 noches · 11 inmersiones",
          route: "Koh Phi Phi, Koh Haa y King Cruiser Wreck",
          badge: "Temporada baja",
        },
      },
    },
    boats: {
      title: "Nuestra flota",
      subtitle: "Tres barcos, tres estilos - todos en las mismas rutas de primer nivel.",
      items: {
        raga: { name: "MV Raga", tagline: "Buque insignia de lujo · 28 huéspedes · renovado 2024" },
        gentle: { name: "MV Gentle Giant", tagline: "Barco de madera clásico · 20 huéspedes · mejor precio" },
        aqua: { name: "MV Aqua", tagline: "Nitrox gratis · 24 huéspedes · el más versátil" },
      },
    },
    sites: {
      title: "Puntos de buceo del Andamán",
      subtitle: "Los sitios legendarios que explorarás en estos viajes.",
      close: "Cerrar",
      items: {
        richelieu: { name: "Richelieu Rock", desc: "La inmersión más famosa de Tailandia - tiburones ballena, caballitos de mar y vida macro en un pináculo en herradura." },
        kohBon: { name: "Koh Bon", desc: "Estación de limpieza de mantas - pared y cresta para pelágicos." },
        kohTachai: { name: "Koh Tachai", desc: "Pináculo con corrientes que atrae bancos de peces y grandes pelágicos." },
        elephant: { name: "Elephant Head Rock", desc: "Icónicos bloques de granito de Similan, pasos y arcos." },
        boonsoong: { name: "Boonsoong Wreck", desc: "Pecio de una draga frente a Khao Lak, lleno de vida macro." },
      },
    },
    included: {
      title: "Qué incluye",
      items: [
        "Traslados gratis desde hoteles de Khao Lak y Phuket",
        "Pensión completa, snacks y bebidas a bordo",
        "Botellas, plomos y guía divemaster",
        "Wi-Fi a bordo (Nitrox gratis en el MV Aqua)",
      ],
    },
    know: {
      title: "Bueno saber",
      items: [
        "Mínimo Open Water; Advanced o 20+ inmersiones recomendadas para Richelieu Rock",
        "Salidas desde el muelle de Tab Lamu (zona de Phuket / Khao Lak)",
        "Tasas del parque nacional y alquiler de equipo no incluidos",
        "Reserva ahora, paga después - asegura tu plaza sin pago inicial",
      ],
    },
    booking: {
      title: "Reserva tu plaza",
      subtitle: "Dinos el viaje y te aseguramos la plaza por WhatsApp - sin pago ahora.",
      trip: "Viaje",
      boat: "Barco preferido",
      anyBoat: "Cualquier barco",
      name: "Nombre",
      namePh: "Tu nombre",
      phone: "Número de WhatsApp",
      phonePh: "+66 ...",
      date: "Fecha preferida",
      divers: "Buceadores",
      submit: "Reservar mi plaza",
      sending: "Enviando...",
      success: "¡Recibido! 🐠 El equipo de Siam Similans te escribirá por WhatsApp en breve.",
      error: "No pudimos enviarlo - escríbenos por WhatsApp.",
      whatsapp: "Chatear por WhatsApp",
    },
    back: "Volver a Siam Scuba",
  },
  fr: {
    hero: {
      kicker: "Siam Similans",
      title: "Les Îles Similan",
      subtitle: "Les joyaux de la Thaïlande - safaris liveaboard vers les meilleurs sites de l'Andaman, à bord d'une flotte sélectionnée.",
      season: "Saison Similan : 15 oct - 15 mai. Réservez votre place pour la saison 2026/27 dès maintenant.",
      cta: "Voir les voyages",
      sitesCta: "Voir les sites de plongée",
    },
    trips: {
      title: "Choisissez votre liveaboard",
      subtitle: "Une sélection resserrée - les voyages où nous envoyons nos plongeurs encore et encore.",
      from: "à partir de",
      perDiver: "par plongeur",
      reserve: "Réserver ce voyage",
      items: {
        similan: {
          name: "Similan & Richelieu Rock",
          meta: "5 jours · 4 nuits · 14 plongées",
          route: "Similan → Koh Bon → Koh Tachai → Richelieu Rock",
          badge: "Le plus populaire",
        },
        andaman: {
          name: "Best of the Andaman",
          meta: "7 jours · 6 nuits · 22 plongées",
          route: "Similan, Richelieu, Koh Haa, Hin Daeng et plus",
          badge: "Voyage signature",
        },
        south: {
          name: "South Andaman",
          meta: "4 jours · 3 nuits · 11 plongées",
          route: "Koh Phi Phi, Koh Haa et King Cruiser Wreck",
          badge: "Hors-saison",
        },
      },
    },
    boats: {
      title: "Notre flotte",
      subtitle: "Trois bateaux, trois styles - tous sur les mêmes itinéraires d'exception.",
      items: {
        raga: { name: "MV Raga", tagline: "Navire amiral de luxe · 28 invités · rénové 2024" },
        gentle: { name: "MV Gentle Giant", tagline: "Bateau en bois classique · 20 invités · meilleur prix" },
        aqua: { name: "MV Aqua", tagline: "Nitrox gratuit · 24 invités · le plus polyvalent" },
      },
    },
    sites: {
      title: "Sites de plongée de l'Andaman",
      subtitle: "Les sites légendaires que vous explorerez lors de ces voyages.",
      close: "Fermer",
      items: {
        richelieu: { name: "Richelieu Rock", desc: "La plongée la plus célèbre de Thaïlande - requins-baleines, hippocampes et vie macro sur un pinacle en fer à cheval." },
        kohBon: { name: "Koh Bon", desc: "Station de nettoyage de raies mantas - tombant et crête pour pélagiques." },
        kohTachai: { name: "Koh Tachai", desc: "Pinacle balayé par les courants attirant bancs et grands pélagiques." },
        elephant: { name: "Elephant Head Rock", desc: "Blocs de granit emblématiques des Similan, passages et arches." },
        boonsoong: { name: "Boonsoong Wreck", desc: "Épave d'une drague au large de Khao Lak, pleine de vie macro." },
      },
    },
    included: {
      title: "Ce qui est inclus",
      items: [
        "Transferts gratuits depuis les hôtels de Khao Lak et Phuket",
        "Pension complète, snacks et boissons à bord",
        "Blocs, plombs et guide divemaster",
        "Wi-Fi à bord (Nitrox gratuit sur le MV Aqua)",
      ],
    },
    know: {
      title: "Bon à savoir",
      items: [
        "Niveau Open Water minimum ; Advanced ou 20+ plongées recommandées pour Richelieu Rock",
        "Départs du quai de Tab Lamu (région de Phuket / Khao Lak)",
        "Frais de parc national et location de matériel non inclus",
        "Réservez maintenant, payez plus tard - place garantie sans acompte",
      ],
    },
    booking: {
      title: "Réservez votre place",
      subtitle: "Dites-nous le voyage et nous bloquons votre place sur WhatsApp - sans paiement maintenant.",
      trip: "Voyage",
      boat: "Bateau préféré",
      anyBoat: "N'importe quel bateau",
      name: "Nom",
      namePh: "Votre nom",
      phone: "Numéro WhatsApp",
      phonePh: "+66 ...",
      date: "Date souhaitée",
      divers: "Plongeurs",
      submit: "Réserver ma place",
      sending: "Envoi...",
      success: "Bien reçu ! 🐠 L'équipe Siam Similans vous écrira sur WhatsApp sous peu.",
      error: "Échec de l'envoi - contactez-nous sur WhatsApp.",
      whatsapp: "Discuter sur WhatsApp",
    },
    back: "Retour à Siam Scuba",
  },
};
