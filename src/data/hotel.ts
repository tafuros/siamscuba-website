import type { Language } from "@/i18n/translations";

/**
 * SINGLE SOURCE OF TRUTH for /hotel (Siam Hotel & Hostel, Sairee Beach, Koh Tao).
 *
 * Everything the page renders - room list, prices, amenities, every string in
 * all four languages - lives here. The components read it and render; they hold
 * no copy of their own. That is deliberate: prices and room facts arrive from
 * Ben separately from the build, and a price change must never require touching
 * a component.
 *
 * PLACEHOLDER STATE (2026-08-16): every `pricePerNight` is null and renders as
 * "price on request". Fill the numbers in and the price UI switches itself on -
 * no component edit needed. Same for `HOTEL_INFO.address` / `checkIn` etc.
 */

// ---------------------------------------------------------------------------
// Property info
// ---------------------------------------------------------------------------

/**
 * The hotel currently shares the dive shop's WhatsApp line. If the property
 * gets its own number, changing it here changes every Book button on the page.
 *
 * NOTE: the prefilled messages below carry NO [ref:CODE] tag on purpose. Nemo's
 * n8n classifier routes on that tag and has no hotel branch yet, so an invented
 * code would land in a dead route; untagged messages fall through to the AI
 * bucket, which is the correct behaviour until a HOTEL node exists.
 */
export const HOTEL_WHATSAPP_NUMBER = "66825068898";

export const HOTEL_INFO = {
  name: "Siam Hotel & Hostel",
  /** TODO(ben): real street address. */
  address: null as string | null,
  area: "Sairee Beach, Koh Tao",
  /** TODO(ben): real check-in / check-out times. */
  checkIn: null as string | null,
  checkOut: null as string | null,
  /** TODO(ben): confirm - Google Maps place link for the property. */
  mapsUrl: null as string | null,
  instagram: null as string | null,
} as const;

// ---------------------------------------------------------------------------
// Rooms
// ---------------------------------------------------------------------------

export type AmenityKey =
  | "ac"
  | "fan"
  | "ensuite"
  | "tv"
  | "wifi"
  | "poolAccess"
  | "kingBed"
  | "twinBeds"
  | "bunkBeds"
  | "lockers"
  | "seatingArea"
  | "gardenView"
  | "desk";

export interface HotelRoom {
  slug: string;
  /**
   * Display order, cheapest tier first. A GUESS until Ben confirms the real
   * price ladder - once `pricePerNight` is filled the page sorts by price and
   * this only breaks ties.
   */
  order: number;
  /** Image basenames in /public/hotel (no extension). Empty = placeholder card. */
  images: string[];
  sleeps: number | null;
  amenities: AmenityKey[];
  /** THB per night. null renders as "price on request". */
  pricePerNight: number | null;
  name: Record<Language, string>;
  blurb: Record<Language, string>;
}

export const HOTEL_ROOMS: HotelRoom[] = [
  {
    slug: "hostel-dorm",
    order: 1,
    // TODO(ben): dorm photos. Card renders its placeholder state until then.
    images: [],
    sleeps: null,
    amenities: ["ac", "wifi", "lockers", "bunkBeds", "poolAccess"],
    pricePerNight: null,
    name: {
      en: "Hostel Dorm",
      he: "מיטה בחדר משותף",
      es: "Cama en Dormitorio",
      fr: "Lit en Dortoir",
    },
    blurb: {
      en: "A bed in our air-conditioned dorm - the cheapest way to stay on Sairee Beach, with the same pool and garden as every other guest.",
      he: "מיטה בחדר משותף ממוזג - הדרך הזולה ביותר לישון על חוף סיירי, עם אותה בריכה וגינה כמו כל שאר האורחים.",
      es: "Una cama en nuestro dormitorio con aire acondicionado: la forma más barata de alojarte en Sairee Beach, con la misma piscina y jardín que el resto de huéspedes.",
      fr: "Un lit dans notre dortoir climatisé - la façon la moins chère de séjourner à Sairee Beach, avec la même piscine et le même jardin que tous nos hôtes.",
    },
  },
  {
    slug: "standard-twin",
    order: 2,
    images: ["siam-hotel-koh-tao-standard-twin"],
    sleeps: 2,
    amenities: ["ac", "fan", "ensuite", "tv", "wifi", "twinBeds", "poolAccess"],
    pricePerNight: null,
    name: {
      en: "Standard Twin",
      he: "חדר טווין סטנדרט",
      es: "Habitación Twin Estándar",
      fr: "Chambre Twin Standard",
    },
    blurb: {
      en: "Two single beds, air conditioning and a private bathroom. Simple, cool and quiet - for divers who spend the day on a boat, not in the room.",
      he: "שתי מיטות יחיד, מיזוג אוויר ומקלחת פרטית. פשוט, קריר ושקט - לצוללים שמבלים את היום על הסירה, לא בחדר.",
      es: "Dos camas individuales, aire acondicionado y baño privado. Sencilla, fresca y tranquila: para buceadores que pasan el día en el barco, no en la habitación.",
      fr: "Deux lits simples, climatisation et salle de bain privée. Simple, fraîche et calme - pour les plongeurs qui passent la journée sur le bateau, pas dans la chambre.",
    },
  },
  {
    slug: "deluxe-twin",
    order: 3,
    images: ["siam-hotel-koh-tao-deluxe-twin", "siam-hotel-koh-tao-deluxe-twin-2"],
    sleeps: 2,
    amenities: ["ac", "ensuite", "tv", "wifi", "twinBeds", "desk", "gardenView", "poolAccess"],
    pricePerNight: null,
    name: {
      en: "Deluxe Twin",
      he: "חדר טווין דלוקס",
      es: "Habitación Twin Deluxe",
      fr: "Chambre Twin Deluxe",
    },
    blurb: {
      en: "Two beds with room to breathe: a long desk, a flat-screen TV and a window onto the palm garden.",
      he: "שתי מיטות עם מקום לנשום: שולחן ארוך, טלוויזיית מסך שטוח וחלון אל גינת הדקלים.",
      es: "Dos camas con espacio de sobra: escritorio largo, televisión de pantalla plana y ventana al jardín de palmeras.",
      fr: "Deux lits avec de l'espace : un long bureau, une télévision à écran plat et une fenêtre sur le jardin de palmiers.",
    },
  },
  {
    slug: "deluxe-double",
    order: 4,
    images: ["siam-hotel-koh-tao-deluxe-double", "siam-hotel-koh-tao-deluxe-double-2"],
    sleeps: 2,
    amenities: ["ac", "ensuite", "tv", "wifi", "kingBed", "seatingArea", "poolAccess"],
    pricePerNight: null,
    name: {
      en: "Deluxe Double",
      he: "חדר זוגי דלוקס",
      es: "Habitación Doble Deluxe",
      fr: "Chambre Double Deluxe",
    },
    blurb: {
      en: "A king bed, a carved Thai daybed by the window and space to unpack properly. Our most comfortable room for two.",
      he: "מיטה זוגית רחבה, ספת עץ תאילנדית מגולפת ליד החלון ומקום אמיתי לפרוק את התיק. החדר הכי נוח שלנו לזוג.",
      es: "Cama king, un diván tailandés tallado junto a la ventana y espacio para deshacer la maleta de verdad. Nuestra habitación más cómoda para dos.",
      fr: "Un lit king, une méridienne thaïe sculptée près de la fenêtre et de la place pour vraiment défaire ses valises. Notre chambre la plus confortable pour deux.",
    },
  },
  {
    slug: "superior-double",
    order: 5,
    images: ["siam-hotel-koh-tao-superior-double"],
    sleeps: 2,
    amenities: ["ac", "ensuite", "tv", "wifi", "kingBed", "seatingArea", "poolAccess"],
    pricePerNight: null,
    name: {
      en: "Superior Double",
      he: "חדר זוגי סופיריור",
      es: "Habitación Doble Superior",
      fr: "Chambre Double Supérieure",
    },
    blurb: {
      en: "King bed, teak furniture and an armchair corner by a full-height window. Bright from morning, cool all afternoon.",
      he: "מיטה זוגית, ריהוט טיק ופינת ישיבה מול חלון גבוה. מואר מהבוקר, קריר כל אחר הצהריים.",
      es: "Cama king, muebles de teca y un rincón con sillones junto a un ventanal. Luminosa desde la mañana, fresca toda la tarde.",
      fr: "Lit king, mobilier en teck et un coin fauteuils devant une fenêtre pleine hauteur. Lumineuse dès le matin, fraîche tout l'après-midi.",
    },
  },
];

/** Cheapest tier first. Rooms with a real price sort by it; the rest keep `order`. */
export const sortedRooms = () =>
  [...HOTEL_ROOMS].sort((a, b) => {
    if (a.pricePerNight != null && b.pricePerNight != null) {
      return a.pricePerNight - b.pricePerNight;
    }
    return a.order - b.order;
  });

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------

export interface HotelCopy {
  seoTitle: string;
  seoDescription: string;
  breadcrumb: string;
  navRooms: string;
  navGallery: string;
  navFind: string;
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroWhatsapp: string;
  perks: string[];
  roomsTitle: string;
  roomsSubtitle: string;
  priceFrom: string;
  perNight: string;
  priceOnRequest: string;
  sleeps: (n: number) => string;
  book: string;
  photosSoon: string;
  amenities: Record<AmenityKey, string>;
  galleryTitle: string;
  gallerySubtitle: string;
  galleryClose: string;
  galleryPrev: string;
  galleryNext: string;
  diveTitle: string;
  diveBody: string;
  diveCta: string;
  findTitle: string;
  findBody: string;
  findCta: string;
  contactTitle: string;
  contactBody: string;
  footerTagline: string;
  footerDiveLink: string;
  detailsSoon: string;
}

const AMENITIES_EN: Record<AmenityKey, string> = {
  ac: "Air conditioning",
  fan: "Ceiling fan",
  ensuite: "Private bathroom",
  tv: "TV",
  wifi: "Free Wi-Fi",
  poolAccess: "Pool access",
  kingBed: "King bed",
  twinBeds: "2 single beds",
  bunkBeds: "Bunk beds",
  lockers: "Lockers",
  seatingArea: "Seating area",
  gardenView: "Garden view",
  desk: "Work desk",
};

export const HOTEL_COPY: Record<Language, HotelCopy> = {
  en: {
    seoTitle: "Siam Hotel & Hostel - Rooms & Dorms on Sairee Beach, Koh Tao",
    seoDescription:
      "Rooms, dorm beds and a palm-garden pool on Sairee Beach, Koh Tao. Air-conditioned private rooms and budget dorms, steps from the sea - book direct on WhatsApp.",
    breadcrumb: "Hotel",
    navRooms: "Rooms",
    navGallery: "Gallery",
    navFind: "Find us",
    heroKicker: "Sairee Beach · Koh Tao",
    heroTitle: "Sleep where you dive",
    heroSubtitle:
      "Private rooms and dorm beds around a palm-garden pool, a short walk from the sea.",
    heroCta: "See rooms",
    heroWhatsapp: "Book on WhatsApp",
    perks: ["Garden pool", "Air conditioning", "Free Wi-Fi", "Sairee Beach", "Thai massage"],
    roomsTitle: "Rooms",
    roomsSubtitle: "Pick a room, tap book. We answer on WhatsApp.",
    priceFrom: "From",
    perNight: "/ night",
    priceOnRequest: "Price on request",
    sleeps: (n) => `Sleeps ${n}`,
    book: "Book",
    photosSoon: "Photos coming soon",
    amenities: AMENITIES_EN,
    galleryTitle: "The place",
    gallerySubtitle: "Pool, garden and the beach at the end of the road.",
    galleryClose: "Close",
    galleryPrev: "Previous",
    galleryNext: "Next",
    diveTitle: "Diving with Siam Scuba",
    diveBody:
      "We are the hotel of a PADI 5-star dive centre. Stay with us and dive with our instructors - courses, fun dives and daily boats on Koh Tao.",
    diveCta: "Go to Siam Scuba",
    findTitle: "Find us",
    findBody: "Sairee Beach, Koh Tao, Thailand.",
    findCta: "Open in Maps",
    contactTitle: "Questions?",
    contactBody: "Message us on WhatsApp - we usually reply within the hour.",
    footerTagline: "Rooms, dorms and a pool on Sairee Beach, Koh Tao.",
    footerDiveLink: "Siam Scuba diving",
    detailsSoon: "Details coming soon",
  },

  he: {
    seoTitle: "סיאם מלון והוסטל - חדרים ומיטות בחוף סיירי, קוטאו",
    seoDescription:
      "חדרים, מיטות בחדר משותף ובריכה בגינת דקלים על חוף סיירי בקוטאו. חדרים פרטיים ממוזגים והוסטל בתקציב נמוך, דקות הליכה מהים - הזמנה ישירה בוואטסאפ.",
    breadcrumb: "מלון",
    navRooms: "חדרים",
    navGallery: "גלריה",
    navFind: "איך מגיעים",
    heroKicker: "חוף סיירי · קוטאו",
    heroTitle: "לישון במקום שבו צוללים",
    heroSubtitle: "חדרים פרטיים ומיטות בחדר משותף סביב בריכה בגינת דקלים, הליכה קצרה מהים.",
    heroCta: "לחדרים",
    heroWhatsapp: "הזמנה בוואטסאפ",
    perks: ["בריכה בגינה", "מיזוג אוויר", "Wi-Fi חופשי", "חוף סיירי", "עיסוי תאילנדי"],
    roomsTitle: "החדרים",
    roomsSubtitle: "בוחרים חדר, לוחצים להזמנה. עונים בוואטסאפ.",
    priceFrom: "החל מ-",
    perNight: "/ לילה",
    priceOnRequest: "מחיר לפי בקשה",
    sleeps: (n) => `עד ${n} אורחים`,
    book: "להזמנה",
    photosSoon: "תמונות בקרוב",
    amenities: {
      ac: "מיזוג אוויר",
      fan: "מאוורר תקרה",
      ensuite: "מקלחת פרטית",
      tv: "טלוויזיה",
      wifi: "Wi-Fi חופשי",
      poolAccess: "גישה לבריכה",
      kingBed: "מיטה זוגית",
      twinBeds: "2 מיטות יחיד",
      bunkBeds: "מיטות קומתיים",
      lockers: "לוקרים",
      seatingArea: "פינת ישיבה",
      gardenView: "נוף לגינה",
      desk: "שולחן עבודה",
    },
    galleryTitle: "המקום",
    gallerySubtitle: "בריכה, גינה והחוף בסוף הרחוב.",
    galleryClose: "סגירה",
    galleryPrev: "הקודם",
    galleryNext: "הבא",
    diveTitle: "צוללים עם סיאם סקובה",
    diveBody:
      "אנחנו המלון של מרכז צלילה PADI 5 כוכבים. ישנים אצלנו וצוללים עם המדריכים שלנו - קורסים, צלילות כיף וסירות יומיות בקוטאו.",
    diveCta: "לאתר סיאם סקובה",
    findTitle: "איך מגיעים",
    findBody: "חוף סיירי, קוטאו, תאילנד.",
    findCta: "פתיחה במפות",
    contactTitle: "שאלות?",
    contactBody: "כתבו לנו בוואטסאפ - בדרך כלל עונים תוך שעה.",
    footerTagline: "חדרים, הוסטל ובריכה על חוף סיירי בקוטאו.",
    footerDiveLink: "צלילה עם סיאם סקובה",
    detailsSoon: "פרטים בקרוב",
  },

  es: {
    seoTitle: "Siam Hotel & Hostel - Habitaciones y Dormitorios en Sairee Beach, Koh Tao",
    seoDescription:
      "Habitaciones, camas en dormitorio y piscina entre palmeras en Sairee Beach, Koh Tao. Habitaciones privadas con aire acondicionado y dormitorios económicos, a pasos del mar - reserva directa por WhatsApp.",
    breadcrumb: "Hotel",
    navRooms: "Habitaciones",
    navGallery: "Galería",
    navFind: "Cómo llegar",
    heroKicker: "Sairee Beach · Koh Tao",
    heroTitle: "Duerme donde buceas",
    heroSubtitle:
      "Habitaciones privadas y camas en dormitorio alrededor de una piscina entre palmeras, a un paseo del mar.",
    heroCta: "Ver habitaciones",
    heroWhatsapp: "Reservar por WhatsApp",
    perks: ["Piscina", "Aire acondicionado", "Wi-Fi gratis", "Sairee Beach", "Masaje tailandés"],
    roomsTitle: "Habitaciones",
    roomsSubtitle: "Elige habitación y pulsa reservar. Respondemos por WhatsApp.",
    priceFrom: "Desde",
    perNight: "/ noche",
    priceOnRequest: "Precio a consultar",
    sleeps: (n) => `Para ${n} personas`,
    book: "Reservar",
    photosSoon: "Fotos muy pronto",
    amenities: {
      ac: "Aire acondicionado",
      fan: "Ventilador de techo",
      ensuite: "Baño privado",
      tv: "TV",
      wifi: "Wi-Fi gratis",
      poolAccess: "Acceso a la piscina",
      kingBed: "Cama king",
      twinBeds: "2 camas individuales",
      bunkBeds: "Literas",
      lockers: "Taquillas",
      seatingArea: "Zona de estar",
      gardenView: "Vista al jardín",
      desk: "Escritorio",
    },
    galleryTitle: "El lugar",
    gallerySubtitle: "Piscina, jardín y la playa al final de la calle.",
    galleryClose: "Cerrar",
    galleryPrev: "Anterior",
    galleryNext: "Siguiente",
    diveTitle: "Bucea con Siam Scuba",
    diveBody:
      "Somos el hotel de un centro de buceo PADI 5 estrellas. Alójate con nosotros y bucea con nuestros instructores: cursos, inmersiones y barcos diarios en Koh Tao.",
    diveCta: "Ir a Siam Scuba",
    findTitle: "Cómo llegar",
    findBody: "Sairee Beach, Koh Tao, Tailandia.",
    findCta: "Abrir en Maps",
    contactTitle: "¿Dudas?",
    contactBody: "Escríbenos por WhatsApp: solemos responder en menos de una hora.",
    footerTagline: "Habitaciones, dormitorios y piscina en Sairee Beach, Koh Tao.",
    footerDiveLink: "Buceo con Siam Scuba",
    detailsSoon: "Detalles muy pronto",
  },

  fr: {
    seoTitle: "Siam Hotel & Hostel - Chambres et Dortoirs à Sairee Beach, Koh Tao",
    seoDescription:
      "Chambres, lits en dortoir et piscine dans un jardin de palmiers à Sairee Beach, Koh Tao. Chambres privées climatisées et dortoirs économiques, à deux pas de la mer - réservation directe sur WhatsApp.",
    breadcrumb: "Hôtel",
    navRooms: "Chambres",
    navGallery: "Galerie",
    navFind: "Nous trouver",
    heroKicker: "Sairee Beach · Koh Tao",
    heroTitle: "Dormez là où vous plongez",
    heroSubtitle:
      "Chambres privées et lits en dortoir autour d'une piscine dans un jardin de palmiers, à quelques pas de la mer.",
    heroCta: "Voir les chambres",
    heroWhatsapp: "Réserver sur WhatsApp",
    perks: ["Piscine", "Climatisation", "Wi-Fi gratuit", "Sairee Beach", "Massage thaï"],
    roomsTitle: "Chambres",
    roomsSubtitle: "Choisissez une chambre, appuyez sur réserver. On répond sur WhatsApp.",
    priceFrom: "À partir de",
    perNight: "/ nuit",
    priceOnRequest: "Prix sur demande",
    sleeps: (n) => `Pour ${n} personnes`,
    book: "Réserver",
    photosSoon: "Photos bientôt",
    amenities: {
      ac: "Climatisation",
      fan: "Ventilateur de plafond",
      ensuite: "Salle de bain privée",
      tv: "TV",
      wifi: "Wi-Fi gratuit",
      poolAccess: "Accès à la piscine",
      kingBed: "Lit king",
      twinBeds: "2 lits simples",
      bunkBeds: "Lits superposés",
      lockers: "Casiers",
      seatingArea: "Coin salon",
      gardenView: "Vue sur le jardin",
      desk: "Bureau",
    },
    galleryTitle: "Le lieu",
    gallerySubtitle: "La piscine, le jardin et la plage au bout de la rue.",
    galleryClose: "Fermer",
    galleryPrev: "Précédent",
    galleryNext: "Suivant",
    diveTitle: "Plongez avec Siam Scuba",
    diveBody:
      "Nous sommes l'hôtel d'un centre de plongée PADI 5 étoiles. Dormez chez nous et plongez avec nos instructeurs : cours, plongées loisir et bateaux quotidiens à Koh Tao.",
    diveCta: "Aller sur Siam Scuba",
    findTitle: "Nous trouver",
    findBody: "Sairee Beach, Koh Tao, Thaïlande.",
    findCta: "Ouvrir dans Maps",
    contactTitle: "Des questions ?",
    contactBody: "Écrivez-nous sur WhatsApp - nous répondons généralement dans l'heure.",
    footerTagline: "Chambres, dortoirs et piscine à Sairee Beach, Koh Tao.",
    footerDiveLink: "Plongée avec Siam Scuba",
    detailsSoon: "Détails bientôt",
  },
};

// ---------------------------------------------------------------------------
// Gallery (non-room photos, in display order)
// ---------------------------------------------------------------------------

export interface GalleryPhoto {
  slug: string;
  alt: Record<Language, string>;
}

export const HOTEL_GALLERY: GalleryPhoto[] = [
  {
    slug: "siam-hotel-koh-tao-pool",
    alt: {
      en: "Swimming pool surrounded by palms at Siam Hotel & Hostel, Koh Tao",
      he: "בריכת השחייה מוקפת דקלים בסיאם מלון והוסטל, קוטאו",
      es: "Piscina rodeada de palmeras en Siam Hotel & Hostel, Koh Tao",
      fr: "Piscine entourée de palmiers au Siam Hotel & Hostel, Koh Tao",
    },
  },
  {
    slug: "siam-hotel-koh-tao-pool-bar",
    alt: {
      en: "Swim-up pool bar with green stools",
      he: "בר בריכה עם שרפרפים ירוקים",
      es: "Bar en la piscina con taburetes verdes",
      fr: "Bar de piscine avec tabourets verts",
    },
  },
  {
    slug: "siam-hotel-koh-tao-rooftop-terrace",
    alt: {
      en: "Rooftop sun terrace with sea view loungers",
      he: "מרפסת גג שטופת שמש עם מיטות שיזוף ונוף לים",
      es: "Terraza en la azotea con tumbonas y vistas al mar",
      fr: "Terrasse sur le toit avec transats et vue sur la mer",
    },
  },
  {
    slug: "siam-hotel-koh-tao-sairee-beach-palm",
    alt: {
      en: "Leaning palm and longtail boats on Sairee Beach, Koh Tao",
      he: "דקל נטוי וסירות לונגטייל בחוף סיירי, קוטאו",
      es: "Palmera inclinada y barcos longtail en Sairee Beach, Koh Tao",
      fr: "Palmier penché et bateaux longtail sur Sairee Beach, Koh Tao",
    },
  },
  {
    slug: "siam-hotel-koh-tao-beach-lounge",
    alt: {
      en: "Beach lounge with bean bags at golden hour",
      he: "פינת ישיבה על החוף עם פופים בשעת הזהב",
      es: "Zona chill en la playa con pufs a la hora dorada",
      fr: "Salon de plage avec poufs à l'heure dorée",
    },
  },
  {
    slug: "siam-hotel-koh-tao-beach-restaurant-view",
    alt: {
      en: "Beachfront restaurant table looking out to sea",
      he: "שולחן במסעדה שעל החוף עם מבט לים",
      es: "Mesa del restaurante frente al mar",
      fr: "Table du restaurant en bord de mer",
    },
  },
  {
    slug: "siam-hotel-koh-tao-thai-massage",
    alt: {
      en: "Thai massage room with mattresses and silk cushions",
      he: "חדר עיסוי תאילנדי עם מזרנים וכריות משי",
      es: "Sala de masaje tailandés con colchonetas y cojines de seda",
      fr: "Salle de massage thaï avec matelas et coussins en soie",
    },
  },
  {
    slug: "siam-hotel-koh-tao-sunset-longtail-boats",
    alt: {
      en: "Sunset over Sairee Beach with longtail boats",
      he: "שקיעה מעל חוף סיירי עם סירות לונגטייל",
      es: "Atardecer en Sairee Beach con barcos longtail",
      fr: "Coucher de soleil sur Sairee Beach avec des bateaux longtail",
    },
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const WA_MESSAGE: Record<Language, (room?: string) => string> = {
  en: (room) =>
    room
      ? `Hi Siam Hotel & Hostel! I'd like to book the ${room}. Do you have availability?`
      : "Hi Siam Hotel & Hostel! I'd like to ask about a room in Koh Tao.",
  he: (room) =>
    room
      ? `היי סיאם מלון והוסטל! אשמח להזמין ${room}. יש זמינות?`
      : "היי סיאם מלון והוסטל! אשמח לקבל פרטים על חדר בקוטאו.",
  es: (room) =>
    room
      ? `¡Hola Siam Hotel & Hostel! Me gustaría reservar la ${room}. ¿Tienen disponibilidad?`
      : "¡Hola Siam Hotel & Hostel! Quisiera información sobre una habitación en Koh Tao.",
  fr: (room) =>
    room
      ? `Bonjour Siam Hotel & Hostel ! Je souhaite réserver la ${room}. Avez-vous des disponibilités ?`
      : "Bonjour Siam Hotel & Hostel ! Je voudrais des informations sur une chambre à Koh Tao.",
};

export function hotelWhatsAppLink(lang: Language, roomName?: string): string {
  const text = WA_MESSAGE[lang](roomName);
  return `https://wa.me/${HOTEL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const HOTEL_LANGS: Language[] = ["en", "he", "es", "fr"];

export const hotelPath = (lang: Language) => (lang === "en" ? "/hotel" : `/${lang}/hotel`);

export const hotelUrl = (lang: Language) => `https://siamscuba.com${hotelPath(lang)}`;

/**
 * Where the "back to the dive site" links point, per language.
 *
 * NOT `/${lang}`: there is no /fr route - "/" is the multilingual homepage and
 * doubles as the French destination (see LOCALE_FAMILIES in
 * src/lib/localeRoutes.ts). Hardcoding the prefix shipped a dead /fr link that
 * `bun run check:links` caught before it reached a preview.
 */
export const diveSiteHomePath = (lang: Language) =>
  lang === "he" ? "/he" : lang === "es" ? "/es" : "/";

/**
 * Reciprocal hreflang cluster for the four hotel URLs. Built here rather than
 * per page so a page cannot drift out of the cluster (Google drops the whole
 * annotation when it is not reciprocal - see src/lib/localeRoutes.ts).
 */
export const hotelHreflangAlternates = () =>
  Object.fromEntries(HOTEL_LANGS.map((l) => [l, hotelUrl(l)])) as Record<Language, string>;

/**
 * schema.org Hotel for the property. Fields we do not have yet (address,
 * check-in/out, price range) are omitted rather than guessed - Google treats a
 * wrong address as a much worse signal than a missing one, and they fill
 * themselves in from HOTEL_INFO the moment the real values land.
 */
export function buildHotelSchema(lang: Language) {
  const copy = HOTEL_COPY[lang];
  const prices = HOTEL_ROOMS.map((r) => r.pricePerNight).filter((p): p is number => p != null);

  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: HOTEL_INFO.name,
    description: copy.seoDescription,
    url: hotelUrl(lang),
    inLanguage: lang,
    image: [
      "https://siamscuba.com/hotel/siam-hotel-koh-tao-palm-sunset.webp",
      "https://siamscuba.com/hotel/siam-hotel-koh-tao-pool.webp",
      "https://siamscuba.com/hotel/siam-hotel-koh-tao-rooftop-terrace.webp",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Koh Tao",
      addressRegion: "Surat Thani",
      addressCountry: "TH",
      ...(HOTEL_INFO.address ? { streetAddress: HOTEL_INFO.address } : {}),
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Swimming pool", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
    ],
    ...(HOTEL_INFO.checkIn ? { checkinTime: HOTEL_INFO.checkIn } : {}),
    ...(HOTEL_INFO.checkOut ? { checkoutTime: HOTEL_INFO.checkOut } : {}),
    ...(prices.length
      ? {
          priceRange: `฿${Math.min(...prices).toLocaleString()} - ฿${Math.max(...prices).toLocaleString()}`,
        }
      : {}),
    containedInPlace: { "@type": "Place", name: "Sairee Beach, Koh Tao" },
  };
}
