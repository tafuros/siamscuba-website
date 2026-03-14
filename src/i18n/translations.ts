export type Language = "en" | "he" | "es" | "fr";

export const languageNames: Record<Language, string> = {
  en: "English",
  he: "עברית",
  es: "Español",
  fr: "Français",
};

export const languageFlags: Record<Language, string> = {
  en: "🇬🇧",
  he: "🇮🇱",
  es: "🇪🇸",
  fr: "🇫🇷",
};

// RTL languages
export const rtlLanguages: Language[] = ["he"];

type TranslationStrings = {
  // Navbar
  nav_courses: string;
  nav_fun_diving: string;
  nav_boats: string;
  nav_koh_tao_guide: string;
  nav_about: string;
  nav_book_now: string;

  // Hero
  hero_badge: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_subtitle: string;
  hero_explore: string;

  // Courses
  courses_label: string;
  courses_title: string;
  courses_basic: string;
  courses_basic_desc: string;
  courses_advanced: string;
  courses_advanced_desc: string;
  courses_pro: string;
  courses_pro_desc: string;
  courses_specialty: string;
  courses_specialty_desc: string;
  courses_most_popular: string;
  courses_book_now: string;
  courses_get_price: string;
  courses_more_details: string;

  // Course names
  course_dsd: string;
  course_ow: string;
  course_bubble: string;
  course_aow: string;
  course_rescue: string;
  course_efr: string;
  course_dm: string;
  course_idc: string;
  course_wreck: string;
  course_deep: string;
  course_dpv: string;
  course_sidemount: string;
  course_ppb: string;
  course_uw_photo: string;
  course_review: string;

  // Course highlights
  hl_review_refresh: string;
  hl_review_2dives: string;
  hl_review_instructor: string;
  hl_no_exp: string;
  hl_pool_ocean: string;
  hl_padi_instructor: string;
  hl_18m: string;
  hl_lifetime: string;
  hl_4_dives: string;
  hl_children: string;
  hl_fun_intro: string;
  hl_safe: string;
  hl_30m: string;
  hl_5_adventure: string;
  hl_deep_nav: string;
  hl_emergency: string;
  hl_rescue_tech: string;
  hl_stress: string;
  hl_cpr: string;
  hl_intl_cert: string;
  hl_life_saving: string;
  hl_lead: string;
  hl_career: string;
  hl_free_intern: string;
  hl_become_instructor: string;
  hl_full_training: string;
  hl_wrecks: string;
  hl_penetration: string;
  hl_specialty_cert: string;
  hl_beyond_18: string;
  hl_gas: string;
  hl_deep_plan: string;
  hl_dpv: string;
  hl_cover_ground: string;
  hl_unique: string;
  hl_streamline: string;
  hl_independent_gas: string;
  hl_advanced_config: string;
  hl_ppb_buoyancy: string;
  hl_ppb_air: string;
  hl_ppb_glide: string;
  hl_uw_10dives: string;
  hl_uw_1on1: string;
  hl_uw_padi_cert: string;

  // Duration
  dur_1_day: string;
  dur_2_days: string;
  dur_5_days: string;
  dur_3_4_days: string;
  dur_3_days: string;
  dur_2_5_days: string;
  dur_4_8_weeks: string;
  dur_varies: string;
  dur_2_3_days: string;

  // Fun Diving
  fun_label: string;
  fun_title: string;
  fun_subtitle: string;
  fun_sail_crown: string;
  fun_sail_title: string;
  fun_sail_desc: string;
  fun_sail_price: string;
  fun_sail_book: string;
  fun_sites: string;
  fun_sites_desc: string;
  fun_schedule: string;
  fun_schedule_desc: string;
  fun_personal: string;
  fun_personal_desc: string;
  fun_starting: string;
  fun_per_dive: string;
  fun_book: string;

  // Sail Rock Banner
  sail_banner_title: string;
  sail_banner_desc: string;
  sail_banner_cta: string;

  // Boats
  boats_label: string;
  boats_title: string;
  boats_subtitle: string;
  boats_built: string;
  boats_desc: string;
  boat_capacity: string;
  boat_shower: string;
  boat_coffee: string;
  boat_exits: string;
  boat_jackets: string;
  boat_compressor: string;
  boat_decks: string;
  boat_storage: string;

  // Why Choose Us
  why_label: string;
  why_title: string;
  why_safety: string;
  why_safety_desc: string;
  why_instructors: string;
  why_instructors_desc: string;
  why_location: string;
  why_location_desc: string;
  why_personal: string;
  why_personal_desc: string;

  // Blog
  blog_title: string;
  blog_subtitle: string;
  blog_view_all: string;

  // Booking CTA
  cta_title: string;
  cta_subtitle: string;
  cta_button: string;

  // Location
  loc_label: string;
  loc_title: string;
  loc_address: string;
  loc_open_maps: string;

  // Footer
  footer_desc: string;
  footer_contact: string;
  footer_links: string;
  footer_rights: string;

  // Search
  search_placeholder: string;
  search_no_results: string;

  // Share
  share_button: string;
  share_copied: string;
};

export const translations: Record<Language, TranslationStrings> = {
  en: {
    nav_courses: "Courses",
    nav_fun_diving: "Fun Diving",
    nav_boats: "The Boats",
    nav_koh_tao_guide: "Koh Tao Guide",
    nav_about: "About Us",
    nav_book_now: "Book Now",

    hero_badge: "Koh Tao, Thailand",
    hero_title_1: "Your Dive Adventure",
    hero_title_2: "Starts Here",
    hero_subtitle: "From your first breath underwater to professional-level training — we've got every step covered.",
    hero_explore: "Explore",

    courses_label: "PADI Courses",
    courses_title: "Start Your Journey",
    courses_basic: "Basic Courses",
    courses_basic_desc: "Perfect for beginners — take your first breath underwater or earn your first certification.",
    courses_advanced: "Advanced Courses",
    courses_advanced_desc: "Push your limits and explore deeper, further, and with more confidence.",
    courses_pro: "Professional Level",
    courses_pro_desc: "Turn your passion into a career with professional-level PADI training.",
    courses_specialty: "Specialty Courses",
    courses_specialty_desc: "Master specific skills and unlock new diving adventures.",
    courses_most_popular: "Most Popular",
    courses_book_now: "Book Now",
    courses_get_price: "Get Price",
    courses_more_details: "More Details",

    course_dsd: "Discover Scuba Diving",
    course_ow: "Open Water Diver",
    course_bubble: "Bubble Maker",
    course_aow: "Advanced Open Water",
    course_rescue: "Rescue Diver",
    course_efr: "Emergency First Response (EFR)",
    course_dm: "Divemaster",
    course_idc: "IDC (Instructor Course)",
    course_wreck: "Wreck Diving",
    course_deep: "Deep Diving",
    course_dpv: "Underwater Scooter (DPV)",
    course_sidemount: "Sidemount Diving",
    course_ppb: "Peak Performance Buoyancy",
    course_uw_photo: "UW Photography & Video",
    course_review: "Scuba Review",

    hl_no_exp: "No experience needed",
    hl_pool_ocean: "Pool + ocean dive",
    hl_padi_instructor: "PADI certified instructor",
    hl_18m: "Dive to 18m worldwide",
    hl_lifetime: "Lifetime certification",
    hl_4_dives: "4 open water dives",
    hl_children: "For children in pool",
    hl_fun_intro: "Fun introduction",
    hl_safe: "Safe & supervised",
    hl_30m: "Dive to 30m",
    hl_5_adventure: "5 adventure dives",
    hl_deep_nav: "Deep & navigation skills",
    hl_emergency: "Emergency management",
    hl_rescue_tech: "Rescue techniques",
    hl_stress: "Stress & panic handling",
    hl_cpr: "CPR & first aid",
    hl_intl_cert: "Internationally certified",
    hl_life_saving: "Life-saving skills",
    hl_lead: "Lead certified divers",
    hl_career: "Career in diving",
    hl_free_intern: "Free internship",
    hl_become_instructor: "Become a PADI Instructor",
    hl_full_training: "Full instructor training",
    hl_wrecks: "Explore sunken wrecks",
    hl_penetration: "Penetration techniques",
    hl_specialty_cert: "PADI specialty cert",
    hl_beyond_18: "Dive beyond 18m",
    hl_gas: "Gas management",
    hl_deep_plan: "Deep dive planning",
    hl_dpv: "Ride a DPV underwater",
    hl_cover_ground: "Cover more ground",
    hl_unique: "Unique experience",
    hl_streamline: "Improved streamlining",
    hl_independent_gas: "Independent gas supply",
    hl_advanced_config: "Advanced configuration",
    hl_ppb_buoyancy: "Master buoyancy control",
    hl_ppb_air: "Use less air",
    hl_ppb_glide: "Glide over reefs effortlessly",
    hl_uw_10dives: "10 dedicated photo dives",
    hl_uw_1on1: "1-on-1 instructor",
    hl_uw_padi_cert: "PADI UW Photo certification",
    hl_review_refresh: "Refresh your skills",
    hl_review_2dives: "2 open-water dives",
    hl_review_instructor: "Personal instructor guidance",

    dur_1_day: "1 day",
    dur_5_days: "5 days",
    dur_2_days: "2 days",
    dur_3_4_days: "3–4 days",
    dur_3_days: "3 days",
    dur_2_5_days: "2.5 days",
    dur_4_8_weeks: "4–8 weeks",
    dur_varies: "Varies",
    dur_2_3_days: "2–3 days",

    fun_label: "Certified Divers",
    fun_title: "Fun Diving",
    fun_subtitle: "Already certified? Join us for incredible dive sites around Koh Tao — whale sharks, barracudas, and pristine coral gardens await.",
    fun_sail_crown: "Crown Jewel of the Gulf",
    fun_sail_title: "Sail Rock (Hin Bai) — The Best Dive in the Gulf",
    fun_sail_desc: "A massive granite pinnacle teeming with life, featuring the famous vertical 'Chimney' and the highest chance to spot Whale Sharks.",
    fun_sail_price: "฿3,800",
    fun_sail_book: "Book Sail Rock",
    fun_sites: "20+ dive sites",
    fun_sites_desc: "Sail Rock, Chumphon, SW Pinnacle & more",
    fun_schedule: "Flexible schedules",
    fun_schedule_desc: "Morning, afternoon & night dives",
    fun_personal: "Personal attention",
    fun_personal_desc: "Experienced guides who know every site",
    fun_starting: "Starting from",
    fun_per_dive: "/ dive",
    fun_book: "Book Fun Dives",

    sail_banner_title: "We go to Sail Rock every 3 days!",
    sail_banner_desc: "The best dive site in the Gulf of Thailand — Whale Sharks, the Chimney & more",
    sail_banner_cta: "Book Sail Rock Trip",

    boats_label: "Our Fleet",
    boats_title: "The Boats",
    boats_subtitle: "Two custom dive boats — Supannakong & SawSiam — purpose-built for comfort, safety, and reaching Koh Tao's best sites.",
    boats_built: "Built for Divers",
    boats_desc: "Our boats are fully equipped for a comfortable and safe diving experience. Enjoy freshwater showers after your dive, grab a coffee with cookies and fresh pineapple, and relax across two spacious decks with dedicated equipment storage rooms.",
    boat_capacity: "Capacity: 60 divers + crew",
    boat_shower: "Freshwater shower",
    boat_coffee: "Coffee station with cookies & pineapple",
    boat_exits: "3 exit points",
    boat_jackets: "Life jackets on board",
    boat_compressor: "On-board compressor",
    boat_decks: "Two separate decks",
    boat_storage: "Equipment storage rooms",

    why_label: "Why Us",
    why_title: "Why Choose Siam Scuba",
    why_safety: "Safety First",
    why_safety_desc: "Meticulously maintained equipment, emergency oxygen on every dive, and strict safety protocols.",
    why_instructors: "Experienced Instructors",
    why_instructors_desc: "PADI-certified professionals with thousands of dives and a passion for teaching.",
    why_location: "Prime Location",
    why_location_desc: "Located on Sairee Beach — Koh Tao's main stretch — steps from restaurants, bars, and the pier.",
    why_personal: "Personal Touch",
    why_personal_desc: "We keep it personal — more attention, more fun, and better learning for every diver.",

    blog_title: "Koh Tao Guide",
    blog_subtitle: "Restaurants, beaches, activities & nightlife — everything you need to know about life on the island.",
    blog_view_all: "View All Articles",

    cta_title: "Ready to Dive In?",
    cta_subtitle: "Send us a message on WhatsApp and we'll get you booked in minutes. No deposit required — just show up and dive!",
    cta_button: "Chat on WhatsApp",

    loc_label: "Find Us",
    loc_title: "Our Location",
    loc_address: "Sairee Beach, Koh Tao, Thailand",
    loc_open_maps: "Open in Google Maps",

    footer_desc: "Professional PADI dive center on Koh Tao, Thailand. Small groups, big adventures.",
    footer_contact: "Contact",
    footer_links: "Quick Links",
    footer_rights: "All rights reserved.",
    search_placeholder: "Search courses, diving, boats...",
    search_no_results: "No results found.",
    share_button: "Share",
    share_copied: "Link copied!",
  },
  he: {
    nav_courses: "קורסים",
    nav_fun_diving: "צלילות כיף",
    nav_boats: "הסירות",
    nav_koh_tao_guide: "מדריך קוטאו",
    nav_about: "אודות",
    nav_book_now: "הזמן עכשיו",

    hero_badge: "קוטאו, תאילנד",
    hero_title_1: "הרפתקת הצלילה שלך",
    hero_title_2: "מתחילה כאן",
    hero_subtitle: "מהנשימה הראשונה מתחת למים ועד הכשרה מקצועית — אנחנו מלווים אותך בכל שלב.",
    hero_explore: "גלה",

    courses_label: "קורסי PADI",
    courses_title: "התחל את המסע שלך",
    courses_basic: "קורסים בסיסיים",
    courses_basic_desc: "מושלם למתחילים — קח את הנשימה הראשונה מתחת למים או קבל את ההסמכה הראשונה.",
    courses_advanced: "קורסים מתקדמים",
    courses_advanced_desc: "הרחב את הגבולות וחקור עמוק יותר, רחוק יותר ובביטחון רב יותר.",
    courses_pro: "רמה מקצועית",
    courses_pro_desc: "הפוך את התשוקה לקריירה עם הכשרת PADI מקצועית.",
    courses_specialty: "קורסי התמחות",
    courses_specialty_desc: "שלוט במיומנויות ספציפיות ופתח הרפתקאות צלילה חדשות.",
    courses_most_popular: "הכי פופולרי",
    courses_book_now: "הזמן עכשיו",
    courses_get_price: "קבל מחיר",
    courses_more_details: "פרטים נוספים",

    course_dsd: "גלה צלילה",
    course_ow: "צוללן מים פתוחים",
    course_bubble: "באבל מייקר",
    course_aow: "צוללן מים פתוחים מתקדם",
    course_rescue: "צוללן חילוץ",
    course_efr: "עזרה ראשונה (EFR)",
    course_dm: "דייבמאסטר",
    course_idc: "IDC (קורס מדריכים)",
    course_wreck: "צלילת ספינות טרופות",
    course_deep: "צלילה עמוקה",
    course_dpv: "קטנוע תת-ימי (DPV)",
    course_sidemount: "צלילת סיידמאונט",
    course_ppb: "שליטה מושלמת בציפה",
    course_uw_photo: "צילום תת-ימי ווידאו",
    course_review: "צלילת ריענון",

    hl_no_exp: "ללא ניסיון נדרש",
    hl_pool_ocean: "בריכה + צלילת ים",
    hl_padi_instructor: "מדריך PADI מוסמך",
    hl_18m: "צלול עד 18 מטר בכל העולם",
    hl_lifetime: "הסמכה לכל החיים",
    hl_4_dives: "4 צלילות מים פתוחים",
    hl_children: "לילדים בבריכה",
    hl_fun_intro: "הכרות כיפית",
    hl_safe: "בטוח ומפוקח",
    hl_30m: "צלול עד 30 מטר",
    hl_5_adventure: "5 צלילות הרפתקה",
    hl_deep_nav: "מיומנויות עומק וניווט",
    hl_emergency: "ניהול חירום",
    hl_rescue_tech: "טכניקות חילוץ",
    hl_stress: "טיפול בלחץ ופאניקה",
    hl_cpr: "החייאה ועזרה ראשונה",
    hl_intl_cert: "הסמכה בינלאומית",
    hl_life_saving: "מיומנויות הצלת חיים",
    hl_lead: "הובל צוללנים מוסמכים",
    hl_career: "קריירה בצלילה",
    hl_free_intern: "התמחות חינם",
    hl_become_instructor: "הפוך למדריך PADI",
    hl_full_training: "הכשרת מדריכים מלאה",
    hl_wrecks: "חקור ספינות טרופות",
    hl_penetration: "טכניקות חדירה",
    hl_specialty_cert: "הסמכת התמחות PADI",
    hl_beyond_18: "צלול מעבר ל-18 מטר",
    hl_gas: "ניהול גזים",
    hl_deep_plan: "תכנון צלילה עמוקה",
    hl_dpv: "רכב על DPV מתחת למים",
    hl_cover_ground: "כסה שטח רב יותר",
    hl_unique: "חוויה ייחודית",
    hl_streamline: "אירודינמיקה משופרת",
    hl_independent_gas: "אספקת גז עצמאית",
    hl_advanced_config: "תצורה מתקדמת",
    hl_ppb_buoyancy: "שליטה מושלמת בציפה",
    hl_ppb_air: "צריכת אוויר מופחתת",
    hl_ppb_glide: "גלישה חלקה מעל השוניות",
    hl_uw_10dives: "10 צלילות צילום ייעודיות",
    hl_uw_1on1: "מדריך אחד על אחד",
    hl_uw_padi_cert: "הסמכת PADI צילום תת-ימי",
    hl_review_refresh: "ריענון מיומנויות",
    hl_review_2dives: "2 צלילות במים פתוחים",
    hl_review_instructor: "ליווי מדריך אישי",

    dur_1_day: "יום אחד",
    dur_5_days: "5 ימים",
    dur_2_days: "יומיים",
    dur_3_4_days: "3–4 ימים",
    dur_3_days: "3 ימים",
    dur_2_5_days: "2.5 ימים",
    dur_4_8_weeks: "4–8 שבועות",
    dur_varies: "משתנה",
    dur_2_3_days: "2–3 ימים",

    fun_label: "צוללנים מוסמכים",
    fun_title: "צלילות כיף",
    fun_subtitle: "כבר מוסמך? הצטרף אלינו לאתרי צלילה מדהימים סביב קוטאו — כרישי לוויתן, ברקודות וגני אלמוגים מרהיבים מחכים.",
    fun_sail_crown: "פנינת המפרץ",
    fun_sail_title: "סייל רוק (הין באי) — הצלילה הטובה ביותר במפרץ",
    fun_sail_desc: "פסגת גרניט עצומה שופעת חיים, עם ה'ארובה' האנכית המפורסמת וסיכוי גבוה לפגוש כרישי לוויתן.",
    fun_sail_price: "฿3,800",
    fun_sail_book: "הזמן סייל רוק",
    fun_sites: "20+ אתרי צלילה",
    fun_sites_desc: "סייל רוק, צ'ומפון, SW פינאקל ועוד",
    fun_schedule: "לוח זמנים גמיש",
    fun_schedule_desc: "צלילות בוקר, צהריים ולילה",
    fun_personal: "תשומת לב אישית",
    fun_personal_desc: "מדריכים מנוסים שמכירים כל אתר",
    fun_starting: "החל מ-",
    fun_per_dive: "/ צלילה",
    fun_book: "הזמן צלילות כיף",

    sail_banner_title: "אנחנו יוצאים לסייל רוק כל 3 ימים!",
    sail_banner_desc: "אתר הצלילה הטוב ביותר במפרץ תאילנד — כרישי לוויתן, הארובה ועוד",
    sail_banner_cta: "הזמן טיול לסייל רוק",

    boats_label: "הצי שלנו",
    boats_title: "הסירות",
    boats_subtitle: "שתי סירות צלילה מותאמות — סופנקונג וסוסיאם — נבנו לנוחות, בטיחות והגעה לאתרים הטובים ביותר של קוטאו.",
    boats_built: "נבנו לצוללנים",
    boats_desc: "הסירות שלנו מצוידות במלואן לחוויית צלילה נוחה ובטוחה. תהנו ממקלחות מים מתוקים, קפה עם עוגיות ואננס טרי, ותירגעו על שני סיפונים מרווחים.",
    boat_capacity: "קיבולת: 60 צוללנים + צוות",
    boat_shower: "מקלחת מים מתוקים",
    boat_coffee: "עמדת קפה עם עוגיות ואננס",
    boat_exits: "3 נקודות יציאה",
    boat_jackets: "אפודות הצלה על הסירה",
    boat_compressor: "מדחס על הסירה",
    boat_decks: "שני סיפונים נפרדים",
    boat_storage: "חדרי אחסון ציוד",

    why_label: "למה אנחנו",
    why_title: "למה לבחור ב-Siam Scuba",
    why_safety: "בטיחות קודם",
    why_safety_desc: "ציוד מתוחזק בקפידה, חמצן חירום בכל צלילה, ופרוטוקולי בטיחות קפדניים.",
    why_instructors: "מדריכים מנוסים",
    why_instructors_desc: "אנשי מקצוע בעלי הסמכת PADI עם אלפי צלילות ותשוקה להוראה.",
    why_location: "מיקום מעולה",
    why_location_desc: "ממוקם בחוף סיירי — הרצועה הראשית של קוטאו — צעדים ממסעדות, ברים והמזח.",
    why_personal: "מגע אישי",
    why_personal_desc: "אנחנו שומרים על אישיות — יותר תשומת לב, יותר כיף ולמידה טובה יותר לכל צוללן.",

    blog_title: "מדריך קוטאו",
    blog_subtitle: "מסעדות, חופים, פעילויות וחיי לילה — כל מה שצריך לדעת על החיים באי.",
    blog_view_all: "הצג את כל הכתבות",

    cta_title: "מוכן לצלול?",
    cta_subtitle: "שלח לנו הודעה בוואטסאפ ונסדר לך הזמנה תוך דקות. ללא פיקדון — פשוט תגיע ותצלול!",
    cta_button: "צ'אט בוואטסאפ",

    loc_label: "מצא אותנו",
    loc_title: "המיקום שלנו",
    loc_address: "חוף סיירי, קוטאו, תאילנד",
    loc_open_maps: "פתח ב-Google Maps",

    footer_desc: "מרכז צלילה מקצועי PADI בקוטאו, תאילנד. קבוצות קטנות, הרפתקאות גדולות.",
    footer_contact: "יצירת קשר",
    footer_links: "קישורים מהירים",
    footer_rights: "כל הזכויות שמורות.",
    search_placeholder: "חפש קורסים, צלילה, סירות...",
    search_no_results: "לא נמצאו תוצאות.",
    share_button: "שתף",
    share_copied: "הקישור הועתק!",
  },
  es: {
    nav_courses: "Cursos",
    nav_fun_diving: "Buceo Recreativo",
    nav_boats: "Los Barcos",
    nav_koh_tao_guide: "Guía Koh Tao",
    nav_about: "Sobre Nosotros",
    nav_book_now: "Reservar",

    hero_badge: "Koh Tao, Tailandia",
    hero_title_1: "Tu Aventura de Buceo",
    hero_title_2: "Comienza Aquí",
    hero_subtitle: "Desde tu primera respiración bajo el agua hasta formación profesional — te acompañamos en cada paso.",
    hero_explore: "Explorar",

    courses_label: "Cursos PADI",
    courses_title: "Comienza Tu Viaje",
    courses_basic: "Cursos Básicos",
    courses_basic_desc: "Perfecto para principiantes — toma tu primera respiración bajo el agua u obtén tu primera certificación.",
    courses_advanced: "Cursos Avanzados",
    courses_advanced_desc: "Supera tus límites y explora más profundo, más lejos y con más confianza.",
    courses_pro: "Nivel Profesional",
    courses_pro_desc: "Convierte tu pasión en una carrera con formación profesional PADI.",
    courses_specialty: "Cursos de Especialidad",
    courses_specialty_desc: "Domina habilidades específicas y desbloquea nuevas aventuras de buceo.",
    courses_most_popular: "Más Popular",
    courses_book_now: "Reservar",
    courses_get_price: "Ver Precio",
    courses_more_details: "Más Detalles",

    course_dsd: "Descubre el Buceo",
    course_ow: "Open Water Diver",
    course_bubble: "Bubble Maker",
    course_aow: "Advanced Open Water",
    course_rescue: "Rescue Diver",
    course_efr: "Primeros Auxilios (EFR)",
    course_dm: "Divemaster",
    course_idc: "IDC (Curso de Instructor)",
    course_wreck: "Buceo en Pecios",
    course_deep: "Buceo Profundo",
    course_dpv: "Scooter Submarino (DPV)",
    course_sidemount: "Buceo Sidemount",
    course_ppb: "Flotabilidad Perfecta",
    course_uw_photo: "Fotografía y Video Submarino",
    course_review: "Repaso de Buceo",

    hl_no_exp: "Sin experiencia necesaria",
    hl_pool_ocean: "Piscina + buceo en mar",
    hl_padi_instructor: "Instructor certificado PADI",
    hl_18m: "Bucea hasta 18m en todo el mundo",
    hl_lifetime: "Certificación de por vida",
    hl_4_dives: "4 inmersiones en aguas abiertas",
    hl_children: "Para niños en piscina",
    hl_fun_intro: "Introducción divertida",
    hl_safe: "Seguro y supervisado",
    hl_30m: "Bucea hasta 30m",
    hl_5_adventure: "5 inmersiones de aventura",
    hl_deep_nav: "Habilidades de profundidad y navegación",
    hl_emergency: "Gestión de emergencias",
    hl_rescue_tech: "Técnicas de rescate",
    hl_stress: "Manejo de estrés y pánico",
    hl_cpr: "RCP y primeros auxilios",
    hl_intl_cert: "Certificación internacional",
    hl_life_saving: "Habilidades para salvar vidas",
    hl_lead: "Lidera buzos certificados",
    hl_career: "Carrera en buceo",
    hl_free_intern: "Pasantía gratuita",
    hl_become_instructor: "Conviértete en Instructor PADI",
    hl_full_training: "Formación completa de instructor",
    hl_wrecks: "Explora pecios hundidos",
    hl_penetration: "Técnicas de penetración",
    hl_specialty_cert: "Certificación de especialidad PADI",
    hl_beyond_18: "Bucea más allá de 18m",
    hl_gas: "Gestión de gases",
    hl_deep_plan: "Planificación de buceo profundo",
    hl_dpv: "Monta un DPV bajo el agua",
    hl_cover_ground: "Cubre más terreno",
    hl_unique: "Experiencia única",
    hl_streamline: "Hidrodinámica mejorada",
    hl_independent_gas: "Suministro de gas independiente",
    hl_advanced_config: "Configuración avanzada",
    hl_ppb_buoyancy: "Domina el control de flotabilidad",
    hl_ppb_air: "Usa menos aire",
    hl_ppb_glide: "Deslízate sobre los arrecifes",
    hl_uw_10dives: "10 inmersiones de foto dedicadas",
    hl_uw_1on1: "Instructor 1 a 1",
    hl_uw_padi_cert: "Certificación PADI Foto Submarina",
    hl_review_refresh: "Refresca tus habilidades",
    hl_review_2dives: "2 inmersiones en aguas abiertas",
    hl_review_instructor: "Instructor personal",

    dur_1_day: "1 día",
    dur_5_days: "5 días",
    dur_2_days: "2 días",
    dur_3_4_days: "3–4 días",
    dur_2_5_days: "2.5 días",
    dur_4_8_weeks: "4–8 semanas",
    dur_varies: "Variable",
    dur_2_3_days: "2–3 días",

    fun_label: "Buzos Certificados",
    fun_title: "Buceo Recreativo",
    fun_subtitle: "¿Ya estás certificado? Únete a nuestras increíbles inmersiones en Koh Tao — tiburones ballena, barracudas y jardines de coral prístinos te esperan.",
    fun_sail_crown: "Joya de la Corona del Golfo",
    fun_sail_title: "Sail Rock (Hin Bai) — La Mejor Inmersión del Golfo",
    fun_sail_desc: "Un enorme pináculo de granito rebosante de vida, con la famosa 'Chimenea' vertical y la mayor probabilidad de avistar Tiburones Ballena.",
    fun_sail_price: "฿3,800",
    fun_sail_book: "Reservar Sail Rock",
    fun_sites: "20+ sitios de buceo",
    fun_sites_desc: "Sail Rock, Chumphon, SW Pinnacle y más",
    fun_schedule: "Horarios flexibles",
    fun_schedule_desc: "Inmersiones de mañana, tarde y noche",
    fun_personal: "Atención personal",
    fun_personal_desc: "Guías experimentados que conocen cada sitio",
    fun_starting: "Desde",
    fun_per_dive: "/ inmersión",
    fun_book: "Reservar Inmersiones",

    sail_banner_title: "¡Vamos a Sail Rock cada 3 días!",
    sail_banner_desc: "El mejor sitio de buceo del Golfo de Tailandia — Tiburones Ballena, la Chimenea y más",
    sail_banner_cta: "Reservar Viaje a Sail Rock",

    boats_label: "Nuestra Flota",
    boats_title: "Los Barcos",
    boats_subtitle: "Dos barcos de buceo personalizados — Supannakong y SawSiam — diseñados para comodidad, seguridad y acceso a los mejores sitios.",
    boats_built: "Hechos para Buzos",
    boats_desc: "Nuestros barcos están totalmente equipados para una experiencia de buceo cómoda y segura. Disfruta de duchas de agua dulce, café con galletas y piña fresca, y relájate en dos amplias cubiertas.",
    boat_capacity: "Capacidad: 60 buzos + tripulación",
    boat_shower: "Ducha de agua dulce",
    boat_coffee: "Estación de café con galletas y piña",
    boat_exits: "3 puntos de salida",
    boat_jackets: "Chalecos salvavidas a bordo",
    boat_compressor: "Compresor a bordo",
    boat_decks: "Dos cubiertas separadas",
    boat_storage: "Salas de almacenamiento de equipo",

    why_label: "Por Qué Nosotros",
    why_title: "Por Qué Elegir Siam Scuba",
    why_safety: "Seguridad Primero",
    why_safety_desc: "Equipo meticulosamente mantenido, oxígeno de emergencia en cada inmersión y protocolos de seguridad estrictos.",
    why_instructors: "Instructores Experimentados",
    why_instructors_desc: "Profesionales certificados PADI con miles de inmersiones y pasión por la enseñanza.",
    why_location: "Ubicación Privilegiada",
    why_location_desc: "En Sairee Beach — la zona principal de Koh Tao — a pasos de restaurantes, bares y el muelle.",
    why_personal: "Toque Personal",
    why_personal_desc: "Lo mantenemos personal — más atención, más diversión y mejor aprendizaje para cada buzo.",

    blog_title: "Guía Koh Tao",
    blog_subtitle: "Restaurantes, playas, actividades y vida nocturna — todo lo que necesitas saber sobre la vida en la isla.",
    blog_view_all: "Ver Todos los Artículos",

    cta_title: "¿Listo para Sumergirte?",
    cta_subtitle: "Envíanos un mensaje por WhatsApp y te reservamos en minutos. Sin depósito — ¡solo ven y bucea!",
    cta_button: "Chat en WhatsApp",

    loc_label: "Encuéntranos",
    loc_title: "Nuestra Ubicación",
    loc_address: "Sairee Beach, Koh Tao, Tailandia",
    loc_open_maps: "Abrir en Google Maps",

    footer_desc: "Centro de buceo profesional PADI en Koh Tao, Tailandia. Grupos pequeños, grandes aventuras.",
    footer_contact: "Contacto",
    footer_links: "Enlaces Rápidos",
    footer_rights: "Todos los derechos reservados.",
    search_placeholder: "Buscar cursos, buceo, barcos...",
    search_no_results: "No se encontraron resultados.",
    share_button: "Compartir",
    share_copied: "¡Enlace copiado!",
  },
  fr: {
    nav_courses: "Cours",
    nav_fun_diving: "Plongée Loisir",
    nav_boats: "Les Bateaux",
    nav_koh_tao_guide: "Guide Koh Tao",
    nav_about: "À Propos",
    nav_book_now: "Réserver",

    hero_badge: "Koh Tao, Thaïlande",
    hero_title_1: "Votre Aventure de Plongée",
    hero_title_2: "Commence Ici",
    hero_subtitle: "De votre première respiration sous l'eau à la formation professionnelle — nous vous accompagnons à chaque étape.",
    hero_explore: "Explorer",

    courses_label: "Cours PADI",
    courses_title: "Commencez Votre Voyage",
    courses_basic: "Cours de Base",
    courses_basic_desc: "Parfait pour les débutants — prenez votre première respiration sous l'eau ou obtenez votre première certification.",
    courses_advanced: "Cours Avancés",
    courses_advanced_desc: "Repoussez vos limites et explorez plus profond, plus loin et avec plus de confiance.",
    courses_pro: "Niveau Professionnel",
    courses_pro_desc: "Transformez votre passion en carrière avec une formation PADI professionnelle.",
    courses_specialty: "Cours de Spécialité",
    courses_specialty_desc: "Maîtrisez des compétences spécifiques et débloquez de nouvelles aventures de plongée.",
    courses_most_popular: "Le Plus Populaire",
    courses_book_now: "Réserver",
    courses_get_price: "Voir le Prix",
    courses_more_details: "Plus de Détails",

    course_dsd: "Baptême de Plongée",
    course_ow: "Open Water Diver",
    course_bubble: "Bubble Maker",
    course_aow: "Advanced Open Water",
    course_rescue: "Rescue Diver",
    course_efr: "Premiers Secours (EFR)",
    course_dm: "Divemaster",
    course_idc: "IDC (Cours Instructeur)",
    course_wreck: "Plongée Épave",
    course_deep: "Plongée Profonde",
    course_dpv: "Scooter Sous-marin (DPV)",
    course_sidemount: "Plongée Sidemount",
    course_ppb: "Flottabilité Parfaite",
    course_uw_photo: "Photo et Vidéo Sous-marine",
    course_review: "Révision de Plongée",

    hl_no_exp: "Aucune expérience requise",
    hl_pool_ocean: "Piscine + plongée en mer",
    hl_padi_instructor: "Instructeur certifié PADI",
    hl_18m: "Plongez jusqu'à 18m partout dans le monde",
    hl_lifetime: "Certification à vie",
    hl_4_dives: "4 plongées en eau libre",
    hl_children: "Pour enfants en piscine",
    hl_fun_intro: "Introduction amusante",
    hl_safe: "Sûr et supervisé",
    hl_30m: "Plongez jusqu'à 30m",
    hl_5_adventure: "5 plongées aventure",
    hl_deep_nav: "Compétences en profondeur et navigation",
    hl_emergency: "Gestion des urgences",
    hl_rescue_tech: "Techniques de sauvetage",
    hl_stress: "Gestion du stress et de la panique",
    hl_cpr: "RCP et premiers secours",
    hl_intl_cert: "Certification internationale",
    hl_life_saving: "Compétences vitales",
    hl_lead: "Dirigez des plongeurs certifiés",
    hl_career: "Carrière en plongée",
    hl_free_intern: "Stage gratuit",
    hl_become_instructor: "Devenez Instructeur PADI",
    hl_full_training: "Formation complète d'instructeur",
    hl_wrecks: "Explorez les épaves",
    hl_penetration: "Techniques de pénétration",
    hl_specialty_cert: "Certification de spécialité PADI",
    hl_beyond_18: "Plongez au-delà de 18m",
    hl_gas: "Gestion des gaz",
    hl_deep_plan: "Planification de plongée profonde",
    hl_dpv: "Pilotez un DPV sous l'eau",
    hl_cover_ground: "Couvrez plus de terrain",
    hl_unique: "Expérience unique",
    hl_streamline: "Hydrodynamisme amélioré",
    hl_independent_gas: "Alimentation en gaz indépendante",
    hl_advanced_config: "Configuration avancée",
    hl_ppb_buoyancy: "Maîtrisez le contrôle de flottabilité",
    hl_ppb_air: "Consommez moins d'air",
    hl_ppb_glide: "Glissez au-dessus des récifs",
    hl_uw_10dives: "10 plongées photo dédiées",
    hl_uw_1on1: "Instructeur individuel",
    hl_uw_padi_cert: "Certification PADI Photo Sous-marine",
    hl_review_refresh: "Rafraîchissez vos compétences",
    hl_review_2dives: "2 plongées en eaux libres",
    hl_review_instructor: "Accompagnement instructeur",

    dur_1_day: "1 jour",
    dur_5_days: "5 jours",
    dur_2_days: "2 jours",
    dur_3_4_days: "3–4 jours",
    dur_2_5_days: "2,5 jours",
    dur_4_8_weeks: "4–8 semaines",
    dur_varies: "Variable",
    dur_2_3_days: "2–3 jours",

    fun_label: "Plongeurs Certifiés",
    fun_title: "Plongée Loisir",
    fun_subtitle: "Déjà certifié ? Rejoignez-nous pour des sites de plongée incroyables autour de Koh Tao — requins baleines, barracudas et jardins de corail vous attendent.",
    fun_sail_crown: "Joyau de la Couronne du Golfe",
    fun_sail_title: "Sail Rock (Hin Bai) — La Meilleure Plongée du Golfe",
    fun_sail_desc: "Un immense pinacle de granit grouillant de vie, avec la fameuse 'Cheminée' verticale et les meilleures chances de voir des Requins Baleines.",
    fun_sail_price: "฿3 800",
    fun_sail_book: "Réserver Sail Rock",
    fun_sites: "20+ sites de plongée",
    fun_sites_desc: "Sail Rock, Chumphon, SW Pinnacle et plus",
    fun_schedule: "Horaires flexibles",
    fun_schedule_desc: "Plongées matin, après-midi et nuit",
    fun_personal: "Attention personnelle",
    fun_personal_desc: "Guides expérimentés qui connaissent chaque site",
    fun_starting: "À partir de",
    fun_per_dive: "/ plongée",
    fun_book: "Réserver des Plongées",

    sail_banner_title: "Nous allons à Sail Rock tous les 3 jours !",
    sail_banner_desc: "Le meilleur site de plongée du Golfe de Thaïlande — Requins Baleines, la Cheminée et plus",
    sail_banner_cta: "Réserver Sail Rock",

    boats_label: "Notre Flotte",
    boats_title: "Les Bateaux",
    boats_subtitle: "Deux bateaux de plongée sur mesure — Supannakong et SawSiam — conçus pour le confort, la sécurité et l'accès aux meilleurs sites.",
    boats_built: "Conçus pour les Plongeurs",
    boats_desc: "Nos bateaux sont entièrement équipés pour une expérience de plongée confortable et sûre. Profitez de douches d'eau douce, de café avec biscuits et ananas frais, et détendez-vous sur deux ponts spacieux.",
    boat_capacity: "Capacité : 60 plongeurs + équipage",
    boat_shower: "Douche d'eau douce",
    boat_coffee: "Station café avec biscuits et ananas",
    boat_exits: "3 points de sortie",
    boat_jackets: "Gilets de sauvetage à bord",
    boat_compressor: "Compresseur à bord",
    boat_decks: "Deux ponts séparés",
    boat_storage: "Salles de stockage d'équipement",

    why_label: "Pourquoi Nous",
    why_title: "Pourquoi Choisir Siam Scuba",
    why_safety: "Sécurité Avant Tout",
    why_safety_desc: "Équipement méticuleusement entretenu, oxygène d'urgence à chaque plongée et protocoles de sécurité stricts.",
    why_instructors: "Instructeurs Expérimentés",
    why_instructors_desc: "Professionnels certifiés PADI avec des milliers de plongées et une passion pour l'enseignement.",
    why_location: "Emplacement Idéal",
    why_location_desc: "Situé sur Sairee Beach — la rue principale de Koh Tao — à deux pas des restaurants, bars et du quai.",
    why_personal: "Touche Personnelle",
    why_personal_desc: "Nous gardons les choses personnelles — plus d'attention, plus de plaisir et un meilleur apprentissage pour chaque plongeur.",

    blog_title: "Guide Koh Tao",
    blog_subtitle: "Restaurants, plages, activités et vie nocturne — tout ce que vous devez savoir sur la vie sur l'île.",
    blog_view_all: "Voir Tous les Articles",

    cta_title: "Prêt à Plonger ?",
    cta_subtitle: "Envoyez-nous un message sur WhatsApp et nous vous réservons en quelques minutes. Pas de dépôt — venez simplement plonger !",
    cta_button: "Chat sur WhatsApp",

    loc_label: "Trouvez-nous",
    loc_title: "Notre Emplacement",
    loc_address: "Sairee Beach, Koh Tao, Thaïlande",
    loc_open_maps: "Ouvrir dans Google Maps",

    footer_desc: "Centre de plongée professionnel PADI à Koh Tao, Thaïlande. Petits groupes, grandes aventures.",
    footer_contact: "Contact",
    footer_links: "Liens Rapides",
    footer_rights: "Tous droits réservés.",
    search_placeholder: "Rechercher cours, plongée, bateaux...",
    search_no_results: "Aucun résultat trouvé.",
    share_button: "Partager",
    share_copied: "Lien copié !",
  },
};
