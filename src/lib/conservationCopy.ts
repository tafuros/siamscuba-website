import type { Language } from "@/i18n/translations";
import { hreflangAlternatesFor } from "@/lib/localeRoutes";

// Copy for /conservation and its three localized twins.
//
// Strings are inlined here rather than in src/i18n/translations.ts for the same
// reason the campaign landers inline theirs: each URL must render ITS OWN
// language regardless of a returning visitor's stored preference, because the
// entry gate routes straight to the matching path.
//
// Source text is our instructor Paul's, near-verbatim in English (2026-08-07);
// he/es/fr are translations of it. Two rules held throughout:
//   - NO PRICES anywhere. They are not published elsewhere on the site and a
//     second source of truth would drift.
//   - PADI course NAMES stay in English in every language. They are the
//     certification's registered name and what the card in the visitor's hand
//     will say; only the payoff line and the body are translated.

export type ConservationLang = Language;

export interface ConservationLearn {
  short: string;
  long: string;
  /**
   * Shown in the popover when the card is opened.
   *
   * Ben watched Clarity recordings of visitors tapping these cards, which are
   * not links and did nothing. The tap is curiosity, not booking intent, so
   * sending it to the booking form would misread it - the card answers instead,
   * and sells only by naming the specialty that covers the subject.
   */
  detail: string;
}

export interface ConservationSpecialty {
  /** PADI course name - intentionally untranslated. */
  name: string;
  payoff: string;
  body: string;
  note?: string;
}

export interface ConservationLandBlock {
  title: string;
  body: string;
  list?: string[];
}

export interface ConservationCopy {
  seoTitle: string;
  seoDescription: string;
  breadcrumb: string;

  heroEyebrow: string;
  heroTitle: string;
  heroLede: string;
  motto: string;
  ctaAsk: string;
  ctaSeeSpecialties: string;

  whyEyebrow: string;
  whyTitleA: string;
  whyTitleB: string;
  whyBody: string;
  learn: ConservationLearn[];
  /** Hint on the learn cards that there is more behind the tap. */
  learnMore: string;

  bandQuote: string;

  specEyebrow: string;
  specTitle: string;
  specLede: string;
  specialties: ConservationSpecialty[];
  /**
   * CTA on each specialty card. These seven courses are not in the DiveOS
   * catalogue, so there is nothing to book - the enquiry is the funnel.
   */
  ctaAskCourse: string;

  landEyebrow: string;
  landTitle: string;
  landLede: string;
  land: ConservationLandBlock[];

  /**
   * The Friday beach cleanup. Facts are Ben's (15.08): every Friday 17:30, meet
   * at the dive centre, clean the main beach at sunset, free, stay as long as
   * you like, tell Paul you are coming.
   *
   * Deliberately says NOTHING about what to bring - Ben has not answered that
   * yet and inventing "gloves provided" is the kind of small fiction that turns
   * into a disappointed visitor standing on a beach.
   */
  cleanup: {
    eyebrow: string;
    title: string;
    body: string;
    when: string;
    where: string;
    cost: string;
    stay: string;
    /** What to bring (Ben, 15.08). Deliberately warm, not logistical. */
    bring: string;
    cta: string;
  };

  closeTitle: string;
  closeBody: string;
  closeMotto: string;
  ctaWhatsApp: string;
  ctaCourses: string;

  /** Alt text, per language - the real image-SEO lever. */
  alt: {
    hero: string;
    turtle: string;
    aware: string;
    debris: string;
    ray: string;
    coral: string;
    naturalist: string;
    fish: string;
    buoyancy: string;
  };
}

/** Image paths are language-independent; alt text is not. */
export const CONSERVATION_IMAGES = {
  hero: "/conservation/divers-sunbeams-koh-tao.webp",
  turtle: "/conservation/green-sea-turtle-koh-tao.webp",
  aware: "/conservation/divers-ascending-koh-tao.webp",
  debris: "/conservation/diver-underwater-camera-reef-koh-tao.webp",
  ray: "/conservation/blue-spotted-stingray-koh-tao.webp",
  coral: "/conservation/jellyfish-coral-reef-koh-tao.webp",
  naturalist: "/conservation/nudibranch-macro-koh-tao.webp",
  fish: "/conservation/clownfish-anemone-koh-tao.webp",
  buoyancy: "/conservation/diver-neutral-buoyancy-koh-tao.webp",
} as const;

/** Which specialty uses which image, in render order. */
export const SPECIALTY_IMAGE_KEYS = [
  "aware",
  "debris",
  "ray",
  "coral",
  "naturalist",
  "fish",
  "buoyancy",
] as const;

export const CONSERVATION_COPY: Record<ConservationLang, ConservationCopy> = {
  en: {
    seoTitle: "Conservation Diving on Koh Tao | PADI AWARE with Siam Scuba",
    seoDescription:
      "Conservation is not a single course at Siam Scuba - it is how we dive. PADI AWARE, Dive Against Debris, Shark & Ray Conservation, Coral Reef Conservation, Underwater Naturalist, Fish ID and Peak Performance Buoyancy on Koh Tao.",
    breadcrumb: "Conservation",

    heroEyebrow: "Conservation at Siam Scuba",
    heroTitle: "Protect what you love",
    heroLede:
      "Conservation isn't a single course here - it's part of who we are. Every diver has the power to protect the underwater world, whether you're taking your first breaths underwater, sharpening your skills, or simply passing through Koh Tao.",
    motto: "Learn. Dive. Protect.",
    ctaAsk: "Ask us about a conservation course",
    ctaSeeSpecialties: "See the specialties",

    whyEyebrow: "Why learn conservation with Siam Scuba",
    whyTitleA: "Lots of dive centres teach conservation courses.",
    whyTitleB: "We live them.",
    whyBody:
      "Our instructors don't simply teach from manuals - they apply sustainable diving practices on every dive and expect every student to dive responsibly from day one. The goal isn't to certify divers. It's to create divers who become ambassadors for the ocean.",
    learn: [
      {
        short: "Marine life",
        long: "Responsible interaction with the animals you meet",
        detail:
          "Most reef damage is accidental and well-meant - a hand on a turtle's shell, a photo taken too close, a cleaning station interrupted. You'll learn the distances that keep an encounter calm, and the behaviours that mean you are too close.",
      },
      {
        short: "Technique",
        long: "Environmentally friendly diving from the first minute",
        detail:
          "Environmentally friendly diving is a set of habits, not a rule sheet: how you enter, where your gauges sit, how you turn. We build them from your first breath, so they are automatic long before you are near fragile coral.",
      },
      {
        short: "Buoyancy",
        long: "The control that keeps fins and gauges off the coral",
        detail:
          "A diver who can hover cannot break anything - which makes buoyancy the single most protective skill there is. It also keeps you calmer and uses noticeably less air. It is the whole subject of Peak Performance Buoyancy.",
      },
      {
        short: "Reef health",
        long: "Reading the difference between a healthy and a stressed reef",
        detail:
          "A reef under stress says so before it dies: bleaching, algae gaining ground, missing grazers, broken structure. Once you can read those signs you stop seeing 'nice coral' and start seeing a system.",
      },
      {
        short: "Footprint",
        long: "Practical ways to cut your own environmental impact",
        detail:
          "The dive is a few hours - the rest of the trip is the bigger number. Reef-safe sunscreen, refusing single-use plastic on the boat, how you rinse and store gear, what you buy on the island.",
      },
      {
        short: "Afterwards",
        long: "How divers keep contributing long after certification",
        detail:
          "The certification card is not the point. Divers who keep going log debris surveys, join cleanups and choose dive shops by how they actually operate. Dive Against Debris is the easiest place to start.",
      },
    ],
    learnMore: "Tap to read more",

    bandQuote: "The best divers don't just explore the ocean - they protect it.",

    specEyebrow: "Conservation specialties",
    specTitle: "Practical diving skills, married to marine science",
    specLede:
      "Each of these gives you the knowledge to better understand - and actively protect - the underwater world. Message us for dates and pricing; we'll tell you honestly which one fits where you are as a diver.",
    specialties: [
      {
        name: "PADI AWARE Specialty",
        payoff: "Become part of the solution",
        body: "Conservation starts with informed divers. Learn about today's biggest marine conservation challenges and discover how your everyday actions can help protect marine life.",
        note: "Every certification also supports the PADI AWARE Foundation's global projects - protecting vulnerable species, removing marine debris and expanding marine protected areas.",
      },
      {
        name: "Dive Against Debris®",
        payoff: "Every dive can make a difference",
        body: "Finish a dive knowing you left the reef cleaner than you found it. You'll remove marine debris while contributing to one of the world's largest underwater citizen-science databases.",
        note: "Every piece of rubbish removed makes an immediate difference. You are not just cleaning the reef - you are helping protect its future.",
      },
      {
        name: "AWARE Shark & Ray Conservation",
        payoff: "Protect ocean icons",
        body: "Sharks and rays are among the ocean's most important and most threatened animals. Discover why they are essential to healthy marine ecosystems, what they are up against, and how divers are helping protect them.",
        note: "This course turns a shark encounter into a conservation experience.",
      },
      {
        name: "Coral Reef Conservation",
        payoff: "Understanding the ocean's rainforests",
        body: "Coral reefs support almost 25% of all marine life while covering less than 1% of the ocean floor. Learn how reefs function, why they are under pressure from climate change and human activity, and what we can do about it.",
      },
      {
        name: "Underwater Naturalist",
        payoff: "See more than ever before",
        body: "The reef comes alive when you understand what you are looking at. Learn to identify marine life, recognise behaviours, and read the relationships between species and their environment.",
      },
      {
        name: "Fish Identification",
        payoff: "Know the fish. Understand the reef.",
        body: "Fish are more than colourful photo opportunities - each species has a role in keeping a reef healthy. Learn straightforward identification techniques and the biodiversity behind them.",
      },
      {
        name: "Peak Performance Buoyancy",
        payoff: "The ultimate conservation skill",
        body: "Precise buoyancy reduces accidental contact with coral, protects fragile habitats, and lets you observe wildlife without disturbing it. You'll also use less air and feel far more relaxed underwater.",
        note: "Better buoyancy means better diving - and healthier reefs.",
      },
    ],
    ctaAskCourse: "Ask about this course",

    landEyebrow: "Sustainability beyond diving",
    landTitle: "Conservation starts on land",
    landLede:
      "Protecting the ocean doesn't stop when we leave the water. We keep changing how the shop runs so we lead by example rather than by poster.",
    land: [
      {
        title: "Paperless operations",
        body: "We're moving towards fully digital training materials, registrations and administration to cut unnecessary paper out of the shop.",
      },
      {
        title: "Responsible waste management",
        body: "We minimise waste, recycle wherever possible, and keep reviewing our operations to reduce single-use plastics and unnecessary packaging.",
      },
      {
        title: "Sustainable diving practices",
        body: "Every instructor is committed to techniques that minimise environmental impact:",
        list: [
          "Perfect buoyancy before approaching reefs",
          "Never touching, standing on or collecting marine life",
          "Respectful wildlife interactions",
          "Secure equipment to prevent accidental reef damage",
          "Responsible dive planning and reef awareness",
          "Leading by example on every dive",
        ],
      },
      {
        title: "Conservation through education",
        body: "Every course is an opportunity to inspire. Whether you're learning to dive or completing an advanced specialty, conservation is part of the experience rather than a module bolted onto it.",
      },
    ],
    cleanup: {
      eyebrow:
        "Every Friday",
      title:
        "We clean the beach at sunset",
      body:
        "Conservation is not only something we teach underwater. Every Friday we walk the main beach and clean it as the sun goes down - divers, non-divers, anyone staying on the island. Come for ten minutes or stay until it is dark.",
      when:
        "Fridays, 17:30",
      where:
        "Meet at the dive centre",
      cost:
        "Free, open to everyone",
      stay:
        "Stay as long as you like",
      bring:
        "Bring yourself, good energy and a smile - that is the whole kit list.",
      cta:
        "Tell Paul you are coming",
    },

    closeTitle: "Join us in protecting Koh Tao",
    closeBody:
      "The ocean gives us unforgettable days, every day. Together we can give something back - whether you're earning your first certification, adding a specialty, or simply choosing a dive centre that shares your values.",
    closeMotto: "Dive with purpose. Learn with passion. Protect what you love.",
    ctaWhatsApp: "Talk to us on WhatsApp",
    ctaCourses: "Browse all our courses",

    alt: {
      hero: "Divers silhouetted against sunbeams and rising bubbles in the water at Koh Tao",
      turtle: "Green sea turtle resting on the sand beside the reef at Koh Tao",
      aware: "Two scuba divers ascending towards the sunlight above Koh Tao",
      debris: "Scuba diver working close to an anemone-covered reef at Koh Tao",
      ray: "Blue-spotted stingray resting on the reef at Koh Tao",
      coral: "Jellyfish drifting past a coral reef wall with reef fish at Koh Tao",
      naturalist: "Close-up of a brightly coloured nudibranch sea slug on the reef at Koh Tao",
      fish: "Clownfish sheltering in a sea anemone on the sand at Koh Tao",
      buoyancy: "Scuba diver hovering horizontally in mid-water with neutral buoyancy at Koh Tao",
    },
  },

  he: {
    seoTitle: "צלילות שימור בקוֹ טאו | PADI AWARE עם Siam Scuba",
    seoDescription:
      "שימור ימי הוא לא קורס אחד ב-Siam Scuba - זו הדרך שבה אנחנו צוללים. PADI AWARE, Dive Against Debris, שימור כרישים וטריגונים, שימור שוניות אלמוגים, Underwater Naturalist, זיהוי דגים וציפה מושלמת בקוֹ טאו.",
    breadcrumb: "שימור ימי",

    heroEyebrow: "שימור ימי ב-Siam Scuba",
    heroTitle: "לשמור על מה שאוהבים",
    heroLede:
      "שימור ימי הוא לא עוד קורס אצלנו - הוא חלק ממי שאנחנו. לכל צולל יש את הכוח להגן על העולם התת-ימי, בין אם אתם לוקחים את הנשימות הראשונות שלכם מתחת למים, משפרים מיומנויות, או פשוט עוברים דרך קוֹ טאו.",
    motto: "ללמוד. לצלול. לשמור.",
    ctaAsk: "דברו איתנו על קורס שימור",
    ctaSeeSpecialties: "לכל ההתמחויות",

    whyEyebrow: "למה ללמוד שימור ימי אצלנו",
    whyTitleA: "הרבה מרכזי צלילה מלמדים קורסי שימור.",
    whyTitleB: "אנחנו חיים אותם.",
    whyBody:
      "המדריכים שלנו לא רק מלמדים מהספר - הם מיישמים צלילה בת-קיימא בכל צלילה, ומצפים מכל תלמיד לצלול באחריות מהיום הראשון. המטרה היא לא להסמיך צוללים. המטרה היא ליצור צוללים שהופכים לשגרירים של האוקיינוס.",
    learn: [
      {
        short: "חיים בים",
        long: "אינטראקציה אחראית עם בעלי החיים שתפגשו",
        detail:
          "רוב הנזק לשונית נגרם בטעות ומתוך כוונה טובה - יד על שריון של צב, תמונה מקרוב מדי, תחנת ניקוי שהופרעה. תלמדו את המרחקים ששומרים על מפגש רגוע, ואת הסימנים שאומרים שאתם קרובים מדי.",
      },
      {
        short: "טכניקה",
        long: "צלילה ידידותית לסביבה כבר מהדקה הראשונה",
        detail:
          "צלילה ידידותית לסביבה היא אוסף הרגלים, לא דף חוקים: איך נכנסים למים, איפה יושבים המדים, איך מסתובבים. אנחנו בונים אותם מהנשימה הראשונה, כדי שיהיו אוטומטיים הרבה לפני שתתקרבו לאלמוג שביר.",
      },
      {
        short: "ציפה",
        long: "השליטה ששומרת על סנפירים ומדים הרחק מהאלמוגים",
        detail:
          "צולל שיודע לרחף לא יכול לשבור כלום - ולכן ציפה היא המיומנות המגינה ביותר שיש. היא גם משאירה אתכם רגועים יותר וצורכת פחות אוויר. זה כל הנושא של Peak Performance Buoyancy.",
      },
      {
        short: "בריאות השונית",
        long: "לזהות את ההבדל בין שונית בריאה לשונית במצוקה",
        detail:
          "שונית במצוקה מסמנת את זה לפני שהיא מתה: הלבנה, אצות שמשתלטות, דגי מרעה שנעלמו, מבנה שבור. ברגע שתדעו לקרוא את הסימנים, תפסיקו לראות 'אלמוג יפה' ותתחילו לראות מערכת.",
      },
      {
        short: "טביעת רגל",
        long: "דרכים מעשיות לצמצם את ההשפעה הסביבתית שלכם",
        detail:
          "הצלילה היא כמה שעות - שאר הטיול הוא המספר הגדול. קרם הגנה ידידותי לשונית, ויתור על פלסטיק חד-פעמי בסירה, איך שוטפים ומאחסנים ציוד, ומה קונים באי.",
      },
      {
        short: "אחר כך",
        long: "איך צוללים ממשיכים לתרום הרבה אחרי ההסמכה",
        detail:
          "תעודת ההסמכה היא לא המטרה. צוללים שממשיכים מתעדים סקרי פסולת, מצטרפים לניקויים, ובוחרים מרכזי צלילה לפי איך שהם באמת פועלים. Dive Against Debris היא הדרך הקלה להתחיל.",
      },
    ],
    learnMore: "הקישו לפרטים",

    bandQuote: "הצוללים הטובים לא רק חוקרים את האוקיינוס - הם שומרים עליו.",

    specEyebrow: "התמחויות שימור",
    specTitle: "מיומנויות צלילה מעשיות, יחד עם מדעי הים",
    specLede:
      "כל אחת מאלה נותנת לכם את הידע להבין טוב יותר - ולהגן באופן פעיל - על העולם התת-ימי. כתבו לנו לתאריכים ומחירים; נגיד לכם בכנות איזו מהן מתאימה לאיפה שאתם נמצאים כצוללים.",
    specialties: [
      {
        name: "PADI AWARE Specialty",
        payoff: "להיות חלק מהפתרון",
        body: "שימור מתחיל בצוללים מודעים. תלמדו על אתגרי השימור הימי הגדולים של ימינו ותגלו איך הפעולות היומיומיות שלכם יכולות לעזור להגן על החיים בים.",
        note: "כל הסמכה גם תומכת בפרויקטים הגלובליים של קרן PADI AWARE - הגנה על מינים בסכנה, פינוי פסולת ימית והרחבת שמורות ימיות.",
      },
      {
        name: "Dive Against Debris®",
        payoff: "כל צלילה יכולה לעשות שינוי",
        body: "לסיים צלילה בידיעה שהשארתם את השונית נקייה יותר משמצאתם אותה. תפנו פסולת ימית ובמקביל תתרמו לאחד ממאגרי מדע האזרח התת-ימיים הגדולים בעולם.",
        note: "כל פיסת זבל שמפונה עושה הבדל מיידי. אתם לא רק מנקים את השונית - אתם עוזרים להגן על העתיד שלה.",
      },
      {
        name: "AWARE Shark & Ray Conservation",
        payoff: "להגן על סמלי האוקיינוס",
        body: "כרישים וטריגונים הם מהחיות החשובות והמאוימות ביותר באוקיינוס. תגלו למה הם חיוניים למערכות אקולוגיות בריאות, מול מה הם ניצבים, ואיך צוללים בעולם עוזרים להגן עליהם.",
        note: "הקורס הזה הופך מפגש עם כריש לחוויית שימור.",
      },
      {
        name: "Coral Reef Conservation",
        payoff: "להבין את יערות הגשם של האוקיינוס",
        body: "שוניות אלמוגים מקיימות כמעט 25% מכלל החיים בים, על פחות מ-1% משטח קרקעית האוקיינוס. תלמדו איך שונית עובדת, למה היא נמצאת בלחץ גובר משינויי אקלים ומפעילות אדם, ומה אפשר לעשות בנידון.",
      },
      {
        name: "Underwater Naturalist",
        payoff: "לראות יותר מאי פעם",
        body: "השונית קמה לתחייה כשמבינים על מה מסתכלים. תלמדו לזהות חיים בים, לזהות התנהגויות, ולקרוא את מערכות היחסים בין המינים לסביבה שלהם.",
      },
      {
        name: "Fish Identification",
        payoff: "להכיר את הדגים. להבין את השונית.",
        body: "דגים הם הרבה יותר מהזדמנות לצילום צבעוני - לכל מין יש תפקיד בשמירה על שונית בריאה. תלמדו שיטות זיהוי פשוטות ואת המגוון הביולוגי שמאחוריהן.",
      },
      {
        name: "Peak Performance Buoyancy",
        payoff: "מיומנות השימור האולטימטיבית",
        body: "ציפה מדויקת מפחיתה מגע מקרי באלמוגים, מגנה על בתי גידול שבירים, ומאפשרת לכם להתבונן בחיות בלי להפריע להן. בנוסף תצרכו פחות אוויר ותרגישו הרבה יותר רגועים מתחת למים.",
        note: "ציפה טובה יותר פירושה צלילה טובה יותר - ושוניות בריאות יותר.",
      },
    ],
    ctaAskCourse: "שאלו על הקורס",

    landEyebrow: "קיימות מעבר לצלילה",
    landTitle: "השימור מתחיל על היבשה",
    landLede:
      "ההגנה על האוקיינוס לא נעצרת כשיוצאים מהמים. אנחנו כל הזמן משנים את הדרך שבה החנות פועלת, כדי להוביל בדוגמה אישית ולא בפוסטר.",
    land: [
      {
        title: "תפעול ללא נייר",
        body: "אנחנו עוברים לחומרי לימוד, הרשמות וניהול דיגיטליים לגמרי, כדי להוציא נייר מיותר מהחנות.",
      },
      {
        title: "ניהול פסולת אחראי",
        body: "אנחנו מצמצמים פסולת, ממחזרים היכן שאפשר, ובוחנים כל הזמן את התפעול שלנו כדי להפחית פלסטיק חד-פעמי ואריזות מיותרות.",
      },
      {
        title: "צלילה בת-קיימא",
        body: "כל מדריך מחויב לטכניקות שממזערות פגיעה בסביבה:",
        list: [
          "ציפה מושלמת עוד לפני ההתקרבות לשונית",
          "לא לגעת, לא לדרוך ולא לאסוף חיים מהים",
          "מפגשים מכבדים עם בעלי חיים",
          "ציוד מאובטח כדי למנוע פגיעה מקרית בשונית",
          "תכנון צלילה אחראי ומודעות לשונית",
          "להוביל בדוגמה אישית בכל צלילה",
        ],
      },
      {
        title: "שימור דרך חינוך",
        body: "כל קורס הוא הזדמנות להשפיע. בין אם אתם לומדים לצלול או משלימים התמחות מתקדמת, השימור הוא חלק מהחוויה ולא מודול שהודבק אליה.",
      },
    ],
    cleanup: {
      eyebrow:
        "כל יום שישי",
      title:
        "מנקים את החוף בשקיעה",
      body:
        "שימור הוא לא רק משהו שמלמדים מתחת למים. כל יום שישי אנחנו עוברים על החוף המרכזי ומנקים אותו בזמן שהשמש שוקעת - צוללים, לא-צוללים, כל מי שנמצא באי. אפשר לבוא לעשר דקות ואפשר להישאר עד שיחשיך.",
      when:
        "ימי שישי, 17:30",
      where:
        "נפגשים במועדון הצלילה",
      cost:
        "בחינם, פתוח לכולם",
      stay:
        "נשארים כמה שרוצים",
      bring:
        "תביאו את עצמכם, אנרגיה טובה וחיוך - זו כל רשימת הציוד.",
      cta:
        "עדכנו את פול שאתם מגיעים",
    },

    closeTitle: "בואו לשמור איתנו על קוֹ טאו",
    closeBody:
      "האוקיינוס נותן לנו ימים בלתי נשכחים, כל יום. ביחד אנחנו יכולים להחזיר משהו - בין אם אתם עושים את ההסמכה הראשונה שלכם, מוסיפים התמחות, או פשוט בוחרים מרכז צלילה שחולק את הערכים שלכם.",
    closeMotto: "לצלול במטרה. ללמוד בתשוקה. לשמור על מה שאוהבים.",
    ctaWhatsApp: "דברו איתנו בוואטסאפ",
    ctaCourses: "לכל הקורסים שלנו",

    alt: {
      hero: "צוללים בצללית מול קרני שמש ובועות עולות במים בקוֹ טאו",
      turtle: "צב ים ירוק נח על החול לצד השונית בקוֹ טאו",
      aware: "שני צוללים עולים לכיוון אור השמש מעל קוֹ טאו",
      debris: "צולל עובד בסמוך לשונית מכוסת שושנות ים בקוֹ טאו",
      ray: "טריגון מנוקד כחול נח על השונית בקוֹ טאו",
      coral: "מדוזה חולפת על פני קיר שונית אלמוגים עם דגי שונית בקוֹ טאו",
      naturalist: "תקריב של חשופית ים צבעונית על השונית בקוֹ טאו",
      fish: "דג ליצן מסתתר בשושנת ים על החול בקוֹ טאו",
      buoyancy: "צולל מרחף אופקית באמצע המים בציפה ניטרלית בקוֹ טאו",
    },
  },

  es: {
    seoTitle: "Buceo de Conservación en Koh Tao | PADI AWARE con Siam Scuba",
    seoDescription:
      "La conservación no es un curso más en Siam Scuba - es cómo buceamos. PADI AWARE, Dive Against Debris, Shark & Ray Conservation, Coral Reef Conservation, Underwater Naturalist, identificación de peces y Peak Performance Buoyancy en Koh Tao.",
    breadcrumb: "Conservación",

    heroEyebrow: "Conservación en Siam Scuba",
    heroTitle: "Protege lo que amas",
    heroLede:
      "Aquí la conservación no es un curso suelto - es parte de quiénes somos. Cada buceador tiene el poder de proteger el mundo submarino, tanto si das tus primeras respiraciones bajo el agua, como si estás afinando tus habilidades o simplemente estás de paso por Koh Tao.",
    motto: "Aprende. Bucea. Protege.",
    ctaAsk: "Pregúntanos por un curso de conservación",
    ctaSeeSpecialties: "Ver las especialidades",

    whyEyebrow: "Por qué aprender conservación con Siam Scuba",
    whyTitleA: "Muchos centros de buceo enseñan cursos de conservación.",
    whyTitleB: "Nosotros los vivimos.",
    whyBody:
      "Nuestros instructores no se limitan a enseñar del manual - aplican prácticas de buceo sostenible en cada inmersión y esperan que cada alumno bucee de forma responsable desde el primer día. El objetivo no es certificar buceadores. Es crear buceadores que se conviertan en embajadores del océano.",
    learn: [
      {
        short: "Vida marina",
        long: "Interacción responsable con los animales que encuentres",
        detail:
          "La mayor parte del daño al arrecife es accidental y bienintencionado: una mano sobre el caparazón de una tortuga, una foto demasiado cerca, una estación de limpieza interrumpida. Aprenderás las distancias que mantienen el encuentro tranquilo y las señales de que estás demasiado cerca.",
      },
      {
        short: "Técnica",
        long: "Buceo respetuoso con el medio desde el primer minuto",
        detail:
          "Bucear de forma respetuosa es un conjunto de hábitos, no una hoja de normas: cómo entras, dónde llevas los manómetros, cómo giras. Los construimos desde tu primera respiración, para que sean automáticos mucho antes de acercarte a coral frágil.",
      },
      {
        short: "Flotabilidad",
        long: "El control que mantiene aletas y manómetros lejos del coral",
        detail:
          "Un buceador que sabe mantenerse suspendido no puede romper nada, y por eso la flotabilidad es la habilidad que más protege. También te mantiene más tranquilo y consume bastante menos aire. Es el tema completo de Peak Performance Buoyancy.",
      },
      {
        short: "Salud del arrecife",
        long: "Distinguir un arrecife sano de uno bajo estrés",
        detail:
          "Un arrecife bajo estrés lo avisa antes de morir: blanqueamiento, algas ganando terreno, herbívoros ausentes, estructura rota. Cuando sabes leer esas señales dejas de ver 'coral bonito' y empiezas a ver un sistema.",
      },
      {
        short: "Huella",
        long: "Formas prácticas de reducir tu propio impacto ambiental",
        detail:
          "La inmersión son unas horas; el resto del viaje es la cifra grande. Protector solar seguro para el arrecife, rechazar plástico de un solo uso en el barco, cómo enjuagas y guardas el equipo, qué compras en la isla.",
      },
      {
        short: "Después",
        long: "Cómo los buceadores siguen aportando mucho después del curso",
        detail:
          "El certificado no es el objetivo. Quienes siguen buceando registran residuos, se unen a limpiezas y eligen centro según cómo trabaja de verdad. Dive Against Debris es la forma más fácil de empezar.",
      },
    ],
    learnMore: "Toca para saber más",

    bandQuote: "Los mejores buceadores no solo exploran el océano - lo protegen.",

    specEyebrow: "Especialidades de conservación",
    specTitle: "Habilidades prácticas de buceo, unidas a la ciencia marina",
    specLede:
      "Cada una te da el conocimiento para entender mejor - y proteger activamente - el mundo submarino. Escríbenos para fechas y precios; te diremos con honestidad cuál encaja con tu nivel actual.",
    specialties: [
      {
        name: "PADI AWARE Specialty",
        payoff: "Forma parte de la solución",
        body: "La conservación empieza con buceadores informados. Aprende cuáles son hoy los mayores retos de la conservación marina y descubre cómo tus acciones cotidianas pueden ayudar a proteger la vida marina.",
        note: "Cada certificación apoya además los proyectos globales de la Fundación PADI AWARE - proteger especies vulnerables, retirar residuos marinos y ampliar áreas marinas protegidas.",
      },
      {
        name: "Dive Against Debris®",
        payoff: "Cada inmersión puede marcar la diferencia",
        body: "Termina una inmersión sabiendo que dejaste el arrecife más limpio de como lo encontraste. Retirarás residuos marinos mientras contribuyes a una de las mayores bases de datos de ciencia ciudadana submarina del mundo.",
        note: "Cada residuo retirado marca una diferencia inmediata. No solo estás limpiando el arrecife - estás ayudando a proteger su futuro.",
      },
      {
        name: "AWARE Shark & Ray Conservation",
        payoff: "Protege a los iconos del océano",
        body: "Los tiburones y las rayas están entre los animales más importantes y más amenazados del océano. Descubre por qué son esenciales para unos ecosistemas marinos sanos, a qué se enfrentan y cómo los buceadores están ayudando a protegerlos.",
        note: "Este curso convierte un encuentro con un tiburón en una experiencia de conservación.",
      },
      {
        name: "Coral Reef Conservation",
        payoff: "Entender las selvas del océano",
        body: "Los arrecifes de coral sostienen casi el 25% de toda la vida marina ocupando menos del 1% del fondo oceánico. Aprende cómo funcionan, por qué están bajo presión por el cambio climático y la actividad humana, y qué podemos hacer al respecto.",
      },
      {
        name: "Underwater Naturalist",
        payoff: "Ver más que nunca",
        body: "El arrecife cobra vida cuando entiendes lo que estás mirando. Aprende a identificar vida marina, reconocer comportamientos y leer las relaciones entre las especies y su entorno.",
      },
      {
        name: "Fish Identification",
        payoff: "Conoce los peces. Entiende el arrecife.",
        body: "Los peces son mucho más que una foto bonita - cada especie cumple un papel en mantener sano el arrecife. Aprende técnicas sencillas de identificación y la biodiversidad que hay detrás.",
      },
      {
        name: "Peak Performance Buoyancy",
        payoff: "La habilidad de conservación definitiva",
        body: "Una flotabilidad precisa reduce el contacto accidental con el coral, protege hábitats frágiles y te permite observar la fauna sin molestarla. Además consumirás menos aire y te sentirás mucho más relajado bajo el agua.",
        note: "Mejor flotabilidad significa mejor buceo - y arrecifes más sanos.",
      },
    ],
    ctaAskCourse: "Pregunta por este curso",

    landEyebrow: "Sostenibilidad más allá del buceo",
    landTitle: "La conservación empieza en tierra",
    landLede:
      "Proteger el océano no se acaba al salir del agua. Seguimos cambiando cómo funciona el centro para predicar con el ejemplo y no con un cartel.",
    land: [
      {
        title: "Operaciones sin papel",
        body: "Estamos pasando a materiales de formación, inscripciones y administración totalmente digitales para sacar el papel innecesario del centro.",
      },
      {
        title: "Gestión responsable de residuos",
        body: "Minimizamos residuos, reciclamos siempre que es posible y revisamos continuamente nuestras operaciones para reducir plásticos de un solo uso y embalajes innecesarios.",
      },
      {
        title: "Prácticas de buceo sostenible",
        body: "Cada instructor se compromete con técnicas que minimizan el impacto ambiental:",
        list: [
          "Flotabilidad perfecta antes de acercarse al arrecife",
          "Nunca tocar, pisar ni recoger vida marina",
          "Interacciones respetuosas con la fauna",
          "Equipo bien sujeto para evitar daños accidentales al arrecife",
          "Planificación responsable y conciencia del arrecife",
          "Predicar con el ejemplo en cada inmersión",
        ],
      },
      {
        title: "Conservación a través de la educación",
        body: "Cada curso es una oportunidad para inspirar. Tanto si estás aprendiendo a bucear como si completas una especialidad avanzada, la conservación forma parte de la experiencia y no es un módulo añadido.",
      },
    ],
    cleanup: {
      eyebrow:
        "Cada viernes",
      title:
        "Limpiamos la playa al atardecer",
      body:
        "La conservación no es solo algo que enseñamos bajo el agua. Cada viernes recorremos la playa principal y la limpiamos mientras se pone el sol - buceadores, no buceadores, cualquiera que esté en la isla. Ven diez minutos o quédate hasta que anochezca.",
      when:
        "Viernes, 17:30",
      where:
        "Quedamos en el centro de buceo",
      cost:
        "Gratis, abierto a todos",
      stay:
        "Quédate el tiempo que quieras",
      bring:
        "Trae tus ganas, buena energía y una sonrisa - esa es toda la lista de equipo.",
      cta:
        "Avisa a Paul de que vienes",
    },

    closeTitle: "Únete a nosotros para proteger Koh Tao",
    closeBody:
      "El océano nos regala días inolvidables, cada día. Juntos podemos devolver algo - tanto si estás sacando tu primera certificación, añadiendo una especialidad o simplemente eligiendo un centro que comparte tus valores.",
    closeMotto: "Bucea con propósito. Aprende con pasión. Protege lo que amas.",
    ctaWhatsApp: "Habla con nosotros por WhatsApp",
    ctaCourses: "Ver todos nuestros cursos",

    alt: {
      hero: "Buceadores en contraluz entre rayos de sol y burbujas ascendentes en Koh Tao",
      turtle: "Tortuga verde descansando en la arena junto al arrecife en Koh Tao",
      aware: "Dos buceadores ascendiendo hacia la luz del sol en Koh Tao",
      debris: "Buceador trabajando junto a un arrecife cubierto de anémonas en Koh Tao",
      ray: "Raya de puntos azules descansando sobre el arrecife en Koh Tao",
      coral: "Medusa pasando junto a una pared de coral con peces de arrecife en Koh Tao",
      naturalist: "Primer plano de un nudibranquio de colores vivos sobre el arrecife en Koh Tao",
      fish: "Pez payaso refugiado en una anémona sobre la arena en Koh Tao",
      buoyancy: "Buceador suspendido en horizontal a media agua con flotabilidad neutra en Koh Tao",
    },
  },

  fr: {
    seoTitle: "Plongée de Conservation à Koh Tao | PADI AWARE avec Siam Scuba",
    seoDescription:
      "La conservation n'est pas un cours de plus chez Siam Scuba - c'est notre façon de plonger. PADI AWARE, Dive Against Debris, Shark & Ray Conservation, Coral Reef Conservation, Underwater Naturalist, identification des poissons et Peak Performance Buoyancy à Koh Tao.",
    breadcrumb: "Conservation",

    heroEyebrow: "La conservation chez Siam Scuba",
    heroTitle: "Protéger ce que vous aimez",
    heroLede:
      "Ici, la conservation n'est pas un cours isolé - elle fait partie de ce que nous sommes. Chaque plongeur a le pouvoir de protéger le monde sous-marin, que vous preniez vos premières respirations sous l'eau, que vous perfectionniez vos compétences ou que vous soyez simplement de passage à Koh Tao.",
    motto: "Apprendre. Plonger. Protéger.",
    ctaAsk: "Parlez-nous d'un cours de conservation",
    ctaSeeSpecialties: "Voir les spécialités",

    whyEyebrow: "Pourquoi apprendre la conservation chez Siam Scuba",
    whyTitleA: "Beaucoup de centres enseignent des cours de conservation.",
    whyTitleB: "Nous les vivons.",
    whyBody:
      "Nos instructeurs ne se contentent pas d'enseigner d'après le manuel - ils appliquent des pratiques de plongée durable à chaque plongée et attendent de chaque élève qu'il plonge de manière responsable dès le premier jour. L'objectif n'est pas de certifier des plongeurs. C'est de créer des plongeurs qui deviennent des ambassadeurs de l'océan.",
    learn: [
      {
        short: "Vie marine",
        long: "Une interaction responsable avec les animaux rencontrés",
        detail:
          "L'essentiel des dégâts sur le récif est accidentel et bien intentionné : une main sur la carapace d'une tortue, une photo prise de trop près, une station de nettoyage interrompue. Vous apprendrez les distances qui gardent la rencontre calme, et les signes qui disent que vous êtes trop près.",
      },
      {
        short: "Technique",
        long: "Une plongée respectueuse de l'environnement dès la première minute",
        detail:
          "Plonger proprement, ce sont des habitudes, pas une liste de règles : comment vous entrez, où sont vos manomètres, comment vous tournez. Nous les construisons dès la première respiration, pour qu'elles soient automatiques bien avant le corail fragile.",
      },
      {
        short: "Flottabilité",
        long: "Le contrôle qui garde palmes et manomètres loin du corail",
        detail:
          "Un plongeur capable de rester en suspension ne casse rien : la flottabilité est donc la compétence la plus protectrice qui soit. Elle vous garde aussi plus détendu et consomme nettement moins d'air. C'est tout le sujet du Peak Performance Buoyancy.",
      },
      {
        short: "Santé du récif",
        long: "Distinguer un récif en bonne santé d'un récif en souffrance",
        detail:
          "Un récif en souffrance le dit avant de mourir : blanchissement, algues qui gagnent, brouteurs absents, structure cassée. Dès que vous savez lire ces signes, vous ne voyez plus du joli corail mais un système.",
      },
      {
        short: "Empreinte",
        long: "Des moyens concrets de réduire votre impact environnemental",
        detail:
          "La plongée dure quelques heures ; le reste du voyage pèse bien plus. Crème solaire sans danger pour le récif, refus du plastique jetable sur le bateau, rinçage et rangement du matériel, ce que vous achetez sur l'île.",
      },
      {
        short: "Ensuite",
        long: "Comment les plongeurs continuent d'agir bien après la certification",
        detail:
          "La carte de certification n'est pas le but. Ceux qui continuent recensent les déchets, rejoignent des nettoyages et choisissent leur centre selon sa façon de travailler. Dive Against Debris est le point de départ le plus simple.",
      },
    ],
    learnMore: "Touchez pour en savoir plus",

    bandQuote: "Les meilleurs plongeurs ne font pas qu'explorer l'océan - ils le protègent.",

    specEyebrow: "Spécialités de conservation",
    specTitle: "Des compétences concrètes, associées aux sciences marines",
    specLede:
      "Chacune vous donne les clés pour mieux comprendre - et protéger activement - le monde sous-marin. Écrivez-nous pour les dates et les tarifs ; nous vous dirons honnêtement laquelle correspond à votre niveau.",
    specialties: [
      {
        name: "PADI AWARE Specialty",
        payoff: "Faites partie de la solution",
        body: "La conservation commence par des plongeurs informés. Découvrez les grands enjeux actuels de la conservation marine et comment vos gestes quotidiens peuvent aider à protéger la vie marine.",
        note: "Chaque certification soutient aussi les projets mondiaux de la Fondation PADI AWARE - protéger les espèces vulnérables, retirer les déchets marins et étendre les aires marines protégées.",
      },
      {
        name: "Dive Against Debris®",
        payoff: "Chaque plongée peut faire la différence",
        body: "Terminez une plongée en sachant que vous avez laissé le récif plus propre que vous ne l'avez trouvé. Vous retirerez des déchets marins tout en contribuant à l'une des plus grandes bases de données de science participative sous-marine au monde.",
        note: "Chaque déchet retiré fait une différence immédiate. Vous ne nettoyez pas seulement le récif - vous aidez à protéger son avenir.",
      },
      {
        name: "AWARE Shark & Ray Conservation",
        payoff: "Protéger les icônes de l'océan",
        body: "Les requins et les raies comptent parmi les animaux les plus importants et les plus menacés de l'océan. Découvrez pourquoi ils sont essentiels à des écosystèmes marins sains, ce qui les menace, et comment les plongeurs contribuent à les protéger.",
        note: "Ce cours transforme une rencontre avec un requin en expérience de conservation.",
      },
      {
        name: "Coral Reef Conservation",
        payoff: "Comprendre les forêts tropicales de l'océan",
        body: "Les récifs coralliens abritent près de 25% de la vie marine sur moins de 1% des fonds océaniques. Apprenez comment fonctionne un récif, pourquoi il subit la pression du changement climatique et des activités humaines, et ce que nous pouvons y faire.",
      },
      {
        name: "Underwater Naturalist",
        payoff: "Voir plus que jamais",
        body: "Le récif prend vie quand on comprend ce que l'on regarde. Apprenez à identifier la vie marine, à reconnaître les comportements et à lire les relations entre les espèces et leur milieu.",
      },
      {
        name: "Fish Identification",
        payoff: "Connaître les poissons. Comprendre le récif.",
        body: "Les poissons sont bien plus qu'une jolie photo - chaque espèce joue un rôle dans la santé du récif. Apprenez des techniques d'identification simples et la biodiversité qui se cache derrière.",
      },
      {
        name: "Peak Performance Buoyancy",
        payoff: "La compétence de conservation par excellence",
        body: "Une flottabilité précise réduit les contacts accidentels avec le corail, protège les habitats fragiles et vous permet d'observer la faune sans la déranger. Vous consommerez aussi moins d'air et serez bien plus détendu sous l'eau.",
        note: "Une meilleure flottabilité, c'est une meilleure plongée - et des récifs en meilleure santé.",
      },
    ],
    ctaAskCourse: "Renseignez-vous sur ce cours",

    landEyebrow: "La durabilité au-delà de la plongée",
    landTitle: "La conservation commence à terre",
    landLede:
      "Protéger l'océan ne s'arrête pas quand on sort de l'eau. Nous faisons évoluer en permanence le fonctionnement du centre pour montrer l'exemple plutôt que d'afficher une affiche.",
    land: [
      {
        title: "Fonctionnement sans papier",
        body: "Nous passons à des supports de formation, des inscriptions et une administration entièrement numériques pour sortir le papier inutile du centre.",
      },
      {
        title: "Gestion responsable des déchets",
        body: "Nous réduisons les déchets, recyclons dès que possible et réexaminons sans cesse notre fonctionnement pour limiter le plastique à usage unique et les emballages superflus.",
      },
      {
        title: "Pratiques de plongée durable",
        body: "Chaque instructeur s'engage sur des techniques qui minimisent l'impact environnemental :",
        list: [
          "Une flottabilité parfaite avant d'approcher le récif",
          "Ne jamais toucher, piétiner ni prélever la vie marine",
          "Des interactions respectueuses avec la faune",
          "Un équipement bien fixé pour éviter d'abîmer le récif",
          "Une planification responsable et une vraie conscience du récif",
          "Montrer l'exemple à chaque plongée",
        ],
      },
      {
        title: "La conservation par l'éducation",
        body: "Chaque cours est une occasion d'inspirer. Que vous appreniez à plonger ou que vous complétiez une spécialité avancée, la conservation fait partie de l'expérience et n'est pas un module ajouté après coup.",
      },
    ],
    cleanup: {
      eyebrow:
        "Chaque vendredi",
      title:
        "On nettoie la plage au coucher du soleil",
      body:
        "La conservation n'est pas seulement ce que nous enseignons sous l'eau. Chaque vendredi, nous parcourons la plage principale et la nettoyons pendant que le soleil se couche - plongeurs, non-plongeurs, toute personne de passage sur l'île. Venez dix minutes ou restez jusqu'à la nuit.",
      when:
        "Vendredis, 17h30",
      where:
        "Rendez-vous au centre de plongée",
      cost:
        "Gratuit, ouvert à tous",
      stay:
        "Restez aussi longtemps que vous voulez",
      bring:
        "Venez comme vous êtes, avec de la bonne énergie et le sourire - c'est toute la liste.",
      cta:
        "Dites à Paul que vous venez",
    },

    closeTitle: "Rejoignez-nous pour protéger Koh Tao",
    closeBody:
      "L'océan nous offre des journées inoubliables, chaque jour. Ensemble, nous pouvons lui rendre quelque chose - que vous passiez votre première certification, ajoutiez une spécialité ou choisissiez simplement un centre qui partage vos valeurs.",
    closeMotto: "Plongez avec un but. Apprenez avec passion. Protégez ce que vous aimez.",
    ctaWhatsApp: "Écrivez-nous sur WhatsApp",
    ctaCourses: "Voir tous nos cours",

    alt: {
      hero: "Plongeurs en contre-jour parmi les rayons de soleil et les bulles à Koh Tao",
      turtle: "Tortue verte au repos sur le sable près du récif à Koh Tao",
      aware: "Deux plongeurs remontant vers la lumière du soleil à Koh Tao",
      debris: "Plongeur au travail près d'un récif couvert d'anémones à Koh Tao",
      ray: "Raie à points bleus posée sur le récif à Koh Tao",
      coral: "Méduse passant devant un tombant corallien avec des poissons de récif à Koh Tao",
      naturalist: "Gros plan d'un nudibranche aux couleurs vives sur le récif à Koh Tao",
      fish: "Poisson-clown abrité dans une anémone sur le sable à Koh Tao",
      buoyancy: "Plongeur en suspension horizontale entre deux eaux en flottabilité neutre à Koh Tao",
    },
  },
};

/** The path that serves the conservation page in `lang`. */
export function conservationPath(lang: ConservationLang): string {
  return lang === "en" ? "/conservation" : `/${lang}/conservation`;
}

export function conservationUrl(lang: ConservationLang): string {
  return `https://siamscuba.com${conservationPath(lang)}`;
}

/**
 * Derived from LOCALE_FAMILIES so the cluster stays reciprocal by construction -
 * see the long note in localeRoutes.ts about why hand-written alternates get
 * silently discarded by Google.
 */
export function conservationHreflangAlternates() {
  return hreflangAlternatesFor("/conservation");
}
