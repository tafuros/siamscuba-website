import padiOpenWaterCover from "@/assets/padi-open-water-cover.webp";

export interface BlogSection {
  heading?: string;
  paragraphs: string[];
  image?: string;
  mapLink?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: "Food" | "Beaches" | "Activities" | "Nightlife" | "Diving";
  excerpt: string;
  coverImage: string;
  date: string;
  sections: BlogSection[];
  tags?: string[];
  relatedCourses?: string[];
  relatedBlogSlugs?: string[];
  featured?: boolean;
  readingTime?: number;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "kokhav-rishon-koh-tao",
    title: "כוכב ראשון בקוטאו – המדריך המלא לקורס Open Water בתאילנד",
    category: "Diving",
    excerpt: "חולמים על כוכב ראשון בתאילנד? קוטאו היא בירת הצלילה של דרום-מזרח אסיה — ואצלנו תקבלו הסמכת PADI בקבוצות קטנות, מדריכים צמודים ושתי סירות צלילה פרטיות.",
    coverImage: "/kokhav-rishon-cover.jpg",
    date: "2026-03-29",
    sections: [
      {
        heading: "מה זה כוכב ראשון?",
        paragraphs: [
          "בעולם הצלילה הישראלי, 'כוכב ראשון' הוא השם שאנחנו נותנים לקורס Open Water Diver של PADI — ההסמכה הבינלאומית הראשונה שמאפשרת לכם לצלול עצמאית בכל מקום בעולם, עד עומק 18 מטר.",
          "הכינוי 'כוכב ראשון' מגיע מהמסורת הישראלית של דרגות צלילה, אבל ההסמכה עצמה היא PADI Open Water — המוכרת ביותר בעולם, עם למעלה מ-29 מיליון צוללנים מוסמכים.",
        ],
      },
      {
        heading: "למה לעשות כוכב ראשון דווקא בקוטאו?",
        paragraphs: [
          "קוטאו (Koh Tao) היא אחת מהמקומות הטובים בעולם לעשות כוכב ראשון — ולא בכדי. המים רדודים ושקופים, הנראות מגיעה לעשרות מטרים, הטמפרטורה עומדת על 28-30 מעלות לאורך כל השנה, ויש אלמוגים ודגים צבעוניים שמחכים לכם ממש מתחת לפני המים.",
          "בנוסף, קוטאו היא אחת הזולות ביותר בעולם לעשות קורס צלילה — בלי להתפשר על איכות. כאן תמצאו מדריכים מנוסים, ציוד מקצועי וסירות צלילה ייעודיות.",
        ],
      },
      {
        heading: "כוכב ראשון עם Siam Scuba — מה מיוחד אצלנו?",
        paragraphs: [
          "ב-Siam Scuba אנחנו עובדים בקבוצות קטנות של עד 4 תלמידים למדריך אחד. זה לא מקרי — זה מדיניות. אנחנו מאמינים שצלילה ראשונה צריכה להיות חוויה אישית, לא טיול קבוצתי של 12 אנשים.",
          "הקורס מתפרס על פני 3.5 ימים: לימוד תיאוריה (אפשר לסיים חלק ממנה אונליין לפני הנסיעה), תרגול בבריכה, ואז 4 צלילות בים הפתוח. בסיום תקבלו כרטיס הסמכה PADI שמוכר בכל מקום בעולם — לכל החיים.",
        ],
      },
      {
        heading: "מה כולל הקורס ומה המחיר?",
        paragraphs: [
          "קורס Open Water Diver ב-Siam Scuba עולה 11,000 בת (כ-1,100 שקל) וכולל: כל הציוד (מסכה, כנפיים, רגולטור, חליפה), ספרי לימוד PADI, 4 צלילות בים הפתוח, 2 צלילות בבריכה, מדריך אישי, כרטיס הסמכה בינלאומי, ומימון מלא לסירות הצלילה שלנו.",
          "אין הפתעות במחיר — מה שרואים זה מה שמשלמים. ניתן לרכוש את חוברות הלימוד של PADI אונליין מראש (eLearning) ולחסוך זמן יקר בקוטאו.",
        ],
      },
      {
        heading: "יום ראשון בקורס — מה קורה?",
        paragraphs: [
          "מגיעים לקליניקה שלנו ב-Mae Haad, ממלאים טפסים רפואיים קצרים, מכירים את המדריך שלכם ומתחילים עם הציוד. אחרי הצהריים יורדים לבריכה לתרגול ראשוני — שם לומדים לנשום מתחת למים, לפנות מסכה מים ועוד כישורי בסיס.",
          "ביום השני והשלישי יוצאים לים בסירות הצלילה שלנו — ה-Siam Explorer וה-Siam Pearl — לאתרי צלילה כמו Japanese Gardens ו-Twin Peaks, עם ריף אלמוגים מרהיב ושפע של חיים ימיים.",
        ],
      },
      {
        heading: "שאלות נפוצות",
        paragraphs: [
          "האם צריך ניסיון קודם? לא. הקורס מיועד לאנשים שמעולם לא צללו. אין צורך בניסיון שחייה מקצועי — מספיק שאתם מרגישים בנוח במים.",
          "מה גיל המינימום? 10 שנים לקורס Junior Open Water, 15 שנים לקורס הסטנדרטי.",
          "כמה זמן תקפה ההסמכה? ההסמכה תקפה לכל החיים. אין צורך בחידוש.",
          "אפשר להזמין מראש מישראל? כן — פנו אלינו בוואטסאפ ואנחנו נדאג לכל הפרטים לפני שתנחתו בקוטאו.",
        ],
      },
    ],
    tags: ["Hebrew", "PADI", "Open Water", "Beginner"],
    relatedCourses: ["open-water", "discover-scuba"],
    relatedBlogSlugs: ["padi-open-water-koh-tao-what-to-expect", "padi-vs-ssi-koh-tao"],
    readingTime: 8,
  },
  {
    slug: "best-restaurants-koh-tao",
    title: "Best Restaurants on Koh Tao",
    category: "Food",
    excerpt: "From beachfront Thai cuisine to international fusion — our hand-picked guide to the best places to eat on the island.",
    coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    date: "2026-02-15",
    sections: [
      {
        heading: "Thaita — Italian Restaurant",
        paragraphs: [
          "Craving authentic Italian on a tropical island? Thaita delivers with wood-fired pizzas, handmade pastas, and a wine list that rivals restaurants back in Europe. The setting is intimate and romantic — perfect for a date night.",
          "Their truffle pasta and margherita pizza are crowd favourites. Prices are higher than Thai food but absolutely worth it for the quality. Expect to spend around 300–500 THB per dish.",
        ],
      },
      {
        heading: "Café del Sol",
        paragraphs: [
          "A beloved Koh Tao institution, Café del Sol serves excellent brunch, fresh juices, and hearty meals that keep divers and travellers coming back every day. The vibe is relaxed and welcoming.",
          "Their smoothie bowls, avocado toast, and strong espresso are the perfect way to start or end a day on the island. Great for a leisurely breakfast or a post-dive refuel.",
        ],
      },
      {
        heading: "Blue Chair",
        paragraphs: [
          "Blue Chair is one of those places you stumble upon and instantly fall in love with. Cozy atmosphere, friendly staff, and a menu that blends Thai and international flavours beautifully.",
          "Whether you're after a fresh seafood dish, a perfectly grilled steak, or a creative cocktail — Blue Chair delivers every time. A must-visit on any Koh Tao trip.",
        ],
      },
      {
        heading: "Best Khao Soi on Koh Tao",
        paragraphs: [
          "If you're a fan of northern Thai cuisine, this spot serves the best khao soi on the island — rich, coconut-based curry broth with egg noodles, tender chicken, and crispy noodle topping.",
          "It's a simple, no-frills place where the food speaks for itself. Budget-friendly at around 80–150 THB per bowl. A hidden gem that the locals love.",
        ],
      },
      {
        heading: "Best Burger at the Viewpoint",
        paragraphs: [
          "Imagine biting into a juicy cheeseburger while overlooking one of the most stunning panoramic views on Koh Tao. This hilltop spot serves the best hamburgers and cheeseburgers on the island.",
          "The combination of amazing food and a breathtaking viewpoint makes this a truly unique dining experience. Worth the ride up the hill — make sure to go before sunset for the full experience.",
        ],
      },
    ],
    tags: ["Food", "Local"],
    relatedBlogSlugs: ["best-dishes-koh-tao", "things-to-do-besides-diving"],
    readingTime: 5,
  },
  {
    slug: "best-dishes-koh-tao",
    title: "The Tastiest Dishes on Koh Tao",
    category: "Food",
    excerpt: "From the best chocolate chip cookie to the most authentic khao soi — our guide to the single best version of each dish on the island.",
    coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    date: "2026-02-20",
    sections: [
      {
        heading: "Best Chocolate Chip Cookie on the Island",
        paragraphs: [
          "If you have a sweet tooth, this is a mandatory stop. Warm, gooey, perfectly baked — this chocolate chip cookie is the stuff of legend on Koh Tao. Crispy on the edges, soft in the middle, and loaded with real chocolate chips.",
          "Pair it with an iced latte and you've got the perfect afternoon treat. Once you try it, you'll be coming back every day.",
        ],
        mapLink: "https://maps.app.goo.gl/C1zqGfUyxWhU2Ckz9?g_st=ic",
      },
      {
        heading: "Best Samosa on the Island",
        paragraphs: [
          "Crispy on the outside, perfectly spiced on the inside — this place serves the best samosa on Koh Tao. Stuffed with a fragrant mix of potatoes, peas, and aromatic spices, each bite is pure comfort.",
          "Whether you grab one as a quick snack or order a plate to share, these samosas are addictive. Pair them with a tangy chutney and you're in heaven. A must-try street food gem on the island.",
        ],
        mapLink: "https://maps.app.goo.gl/XZN9bSzHdYYNXrDa8?g_st=ic",
      },
      {
        heading: "Best Massaman Chicken Curry on the Island",
        paragraphs: [
          "Rich, aromatic, and packed with flavour — this massaman curry is the real deal. Tender chicken, creamy coconut sauce, roasted peanuts, and soft potatoes, all simmered together in a fragrant blend of spices.",
          "It's the kind of dish that makes you close your eyes and savour every bite. Served with fluffy jasmine rice, it's comfort food at its finest. A must-try for anyone who loves Thai cuisine.",
        ],
        mapLink: "https://maps.app.goo.gl/6sj7H41kWYnofDVK7?g_st=ic",
      },
      {
        heading: "Best Khao Soi on the Island",
        paragraphs: [
          "The king of northern Thai cuisine, done to perfection on Koh Tao. Rich coconut curry broth, tender egg noodles, fall-apart chicken, topped with crispy fried noodles and a squeeze of lime.",
          "It's a simple, no-frills place where the food speaks for itself. Budget-friendly at around 80–150 THB per bowl. A hidden gem that the locals love.",
        ],
        mapLink: "https://maps.app.goo.gl/DDbiYNQXd7z5kLpv5?g_st=ic",
      },
    ],
    tags: ["Food", "Local"],
    relatedBlogSlugs: ["best-restaurants-koh-tao", "things-to-do-besides-diving"],
    readingTime: 5,
  },
  {
    slug: "top-beaches-viewpoints-koh-tao",
    title: "Top Beaches & Viewpoints on Koh Tao",
    category: "Beaches",
    excerpt: "Crystal-clear bays, dramatic cliff viewpoints, and hidden coves — discover Koh Tao's most beautiful spots above water.",
    coverImage: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80",
    date: "2026-03-01",
    sections: [
      {
        heading: "Tanote Bay",
        paragraphs: [
          "On the east coast of the island, Tanote Bay is a gorgeous crescent of sand flanked by giant boulders. The snorkeling right off the beach is excellent — you'll spot parrotfish, triggerfish, and sometimes small reef sharks.",
          "There's a famous cliff-jumping rock on the south side. The jump is about 8 metres — not for the faint-hearted but absolutely thrilling.",
        ],
      },
      {
        heading: "Freedom Beach",
        paragraphs: [
          "A small, secluded beach on the southwest coast accessible by a short jungle trail or longtail boat. It's rarely crowded and feels like your own private paradise.",
          "Bring snorkel gear — the reef just offshore is teeming with colourful fish and healthy coral.",
        ],
      },
      {
        heading: "John Suwan Viewpoint",
        paragraphs: [
          "A 20-minute hike from Chalok Baan Kao bay leads you to one of the most spectacular viewpoints in all of Thailand. From the top, you can see Shark Bay to the left and Chalok Bay to the right.",
          "Go early morning or late afternoon to avoid the midday heat. Bring water and wear proper shoes — the last section is a scramble over rocks.",
        ],
      },
      {
        heading: "Sairee Beach",
        paragraphs: [
          "The longest beach on Koh Tao stretches nearly 2 kilometres along the west coast. It's the social hub of the island — lined with bars, restaurants, and dive shops.",
          "The sunsets here are legendary. Grab a drink at one of the beach bars and watch the sky turn every shade of orange and pink.",
        ],
      },
    ],
    tags: ["Beaches", "Viewpoints", "Non-divers"],
    relatedCourses: ["discover-scuba"],
    relatedBlogSlugs: ["best-snorkeling-spots-non-divers", "things-to-do-besides-diving"],
    readingTime: 6,
  },
  {
    slug: "best-snorkeling-spots-non-divers",
    title: "Best Snorkeling Spots for Non-Divers",
    category: "Beaches",
    excerpt: "Don't have a dive cert? No problem — Koh Tao has world-class snorkeling right from the beach.",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    date: "2026-03-03",
    sections: [
      {
        heading: "Japanese Gardens",
        paragraphs: [
          "Located between Koh Tao and Koh Nang Yuan, Japanese Gardens is arguably the best snorkeling site in the Gulf of Thailand. The shallow reef (1–5 metres) is covered in beautiful hard and soft corals.",
          "You'll see clownfish, angelfish, pufferfish, and if you're lucky, a sea turtle cruising by. Accessible by longtail boat from Mae Haad (about 200 THB round trip).",
        ],
      },
      {
        heading: "Shark Bay (Thian Og Bay)",
        paragraphs: [
          "Despite the name, the sharks here are harmless blacktip reef sharks — usually juveniles about 1 metre long. They patrol the shallow sandy areas and are incredible to watch from the surface.",
          "The bay is accessible by a trail from the south of the island. There's a small entrance fee (100 THB) at the viewpoint resort above.",
        ],
      },
      {
        heading: "Mango Bay",
        paragraphs: [
          "On the north coast, Mango Bay offers excellent snorkeling over a rocky reef with great visibility. It's a favourite stop on snorkeling day trips.",
          "The coral is in great condition and you'll spot groupers, moray eels, and schools of fusiliers. Best visited on a calm day.",
        ],
      },
      {
        heading: "Aow Leuk",
        paragraphs: [
          "A beautiful east-coast bay with a gently sloping sandy bottom and healthy reef on both sides. It's one of the most beginner-friendly snorkeling spots.",
          "There's a small beach bar where you can rent gear and grab a cold drink between swims. Entry fee is usually 50 THB or free if you buy food/drinks.",
        ],
      },
    ],
    tags: ["Snorkeling", "Beaches", "Non-divers"],
    relatedCourses: ["discover-scuba", "open-water"],
    relatedBlogSlugs: ["top-beaches-viewpoints-koh-tao", "things-to-do-besides-diving"],
    readingTime: 5,
  },
  {
    slug: "things-to-do-besides-diving",
    title: "Things to Do on Koh Tao Besides Diving",
    category: "Activities",
    excerpt: "Rock climbing, jungle hikes, Muay Thai, cooking classes — Koh Tao has way more than just diving.",
    coverImage: new URL("../assets/koh-tao-real-viewpoint.webp", import.meta.url).href,
    date: "2026-02-28",
    sections: [
      {
        heading: "Rock Climbing",
        paragraphs: [
          "Koh Tao's granite boulders make it one of the best rock climbing destinations in Southeast Asia. Goodtime Adventures offers half-day and full-day climbing sessions for all levels.",
          "Routes range from beginner-friendly slabs to challenging overhangs. The views from the top of the boulders are spectacular — you can see across the entire island.",
        ],
      },
      {
        heading: "Muay Thai Training",
        paragraphs: [
          "Several gyms on the island offer drop-in Muay Thai classes for beginners and experienced fighters. Monsoon Gym and Island Muay Thai are the most popular.",
          "A single class costs around 400–500 THB. It's an incredible workout and a great way to experience authentic Thai culture.",
        ],
      },
      {
        heading: "Jungle Hiking",
        paragraphs: [
          "Rent a scooter and explore the island's interior trails. The road to Mango Bay viewpoint is an adventure in itself — steep, winding, and surrounded by jungle.",
          "For a proper hike, the trail from Chalok to Tanote Bay crosses the spine of the island with panoramic views. Allow 2–3 hours and bring plenty of water.",
        ],
      },
      {
        heading: "Thai Cooking Classes",
        paragraphs: [
          "Learn to make authentic pad thai, green curry, and mango sticky rice in a hands-on cooking class. Several places on Sairee road offer half-day sessions.",
          "You'll visit the local market to buy fresh ingredients, then cook 3–4 dishes that you get to eat. Classes run about 1,500 THB including all ingredients.",
        ],
      },
      {
        heading: "Yoga & Wellness",
        paragraphs: [
          "Koh Tao has a thriving yoga scene. Blue Aura Yoga and Shambhala offer daily classes in stunning open-air studios overlooking the ocean.",
          "Drop-in classes are around 300–400 THB. Many places also offer multi-day retreats combining yoga, meditation, and healthy eating.",
        ],
      },
    ],
    tags: ["Activities", "Non-divers"],
    relatedCourses: ["discover-scuba"],
    relatedBlogSlugs: ["top-beaches-viewpoints-koh-tao", "koh-tao-nightlife-guide"],
    readingTime: 6,
  },
  {
    slug: "koh-tao-nightlife-guide",
    title: "Koh Tao Nightlife Guide",
    category: "Nightlife",
    excerpt: "Beach parties, fire shows, reggae bars, and pool parties — here's how to make the most of Koh Tao after dark.",
    coverImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    date: "2026-03-05",
    sections: [
      {
        heading: "Sairee Beach Bar Scene",
        paragraphs: [
          "The main strip of Sairee Beach comes alive after sunset. Most bars offer happy hour from 17:00–19:00 with buy-one-get-one cocktails and cheap beer buckets.",
          "Fizz, Choppers, and MAYA Beach Club are the go-to spots for beachfront drinks with your feet in the sand.",
        ],
      },
      {
        heading: "Fire Shows",
        paragraphs: [
          "Almost every night, one of the beach bars hosts a free fire show. Talented performers spin flaming poi, jump through fire hoops, and breathe fire — all on the beach.",
          "The shows usually start around 21:00–22:00. Lotus Bar and Fizz are known for the most impressive performances.",
        ],
      },
      {
        heading: "Pool Parties",
        paragraphs: [
          "Several resorts host weekly pool parties with DJs, cocktails, and a festive atmosphere. Koh Tao Cabana and The Castle are the most popular.",
          "These usually kick off in the afternoon and run until late. Entry is free — you just pay for drinks.",
        ],
      },
      {
        heading: "Reggae & Chill Vibes",
        paragraphs: [
          "If you prefer a more laid-back evening, head to one of the reggae bars on the south end of Sairee. Live music, hammocks, and cold Chang beers.",
          "Castle Bar and Diza Bar are great for meeting other travellers in a relaxed setting. No cover charge, no pretension — just good vibes.",
        ],
      },
      {
        heading: "Late Night",
        paragraphs: [
          "The party usually migrates to Fishbowl and Saithong later in the evening — they stay open until 02:00 or later. These are the main 'club' venues on the island.",
          "Wednesday and Saturday tend to be the biggest nights. Watch out for the famous Koh Tao pub crawl — it's a wild ride.",
        ],
      },
    ],
    tags: ["Nightlife"],
    relatedBlogSlugs: ["best-restaurants-koh-tao", "things-to-do-besides-diving"],
    readingTime: 5,
  },
];

export const blogCategories = ["All", "Diving", "Food", "Beaches", "Activities", "Nightlife"] as const;

// ─── DIVING BLOG POSTS ───────────────────────────────────────────────────────
// These posts are written specifically to rank for high-value SEO keywords
// related to scuba diving on Koh Tao. Target keywords are embedded naturally
// in headings and body text.
// ─────────────────────────────────────────────────────────────────────────────
const divingBlogPosts: BlogPost[] = [
  {
    slug: "koh-tao-diving-cost-guide",
    title: "How Much Does Diving Cost in Koh Tao? The Honest 2026 Price Guide",
    category: "Diving",
    excerpt: "Real prices for every PADI course and dive package on Koh Tao - plus daily living costs and the hidden fees you should watch for at other shops.",
    coverImage: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=1200&q=80",
    date: "2026-05-09",
    sections: [
      {
        heading: "Why Koh Tao is the cheapest place in the world to learn to dive",
        paragraphs: [
          "Koh Tao certifies more PADI Open Water divers each year than anywhere else on the planet. The volume keeps prices low - but more importantly, the competition keeps them honest. A small Thai island packed with 50+ dive shops is the closest thing scuba has to a free market, and that's good news for your wallet.",
          "For comparison: a PADI Open Water course costs USD 600-900 in the Caribbean, AUD 700+ in Australia, and EUR 450-600 in Egypt. In Koh Tao the same internationally recognised certification - same PADI standards, same training, same lifetime card - costs ฿11,000 (about USD 320 / EUR 295 at current rates).",
          "Cheap doesn't mean low-quality here. The training agencies (PADI, SSI) audit the centres regularly, the dive sites are 20-40 minutes by boat from shore, and the warm water (28-30°C year-round) means you train without a thick wetsuit slowing you down. You're paying less because the shops are competing, not because corners are cut.",
        ],
      },
      {
        heading: "Honest price breakdown for every PADI course on Koh Tao",
        paragraphs: [
          "Here's what each course costs at Siam Scuba in 2026. Every price below includes all gear rental, boat trips, certification fees, and tax. No surcharges added at the shop.",
          "Discover Scuba Diving: ฿2,600 - One day, no certification. Pool training plus 1-2 ocean dives in calm water. Best if you're not sure you'll like diving.",
          "PADI Bubble Maker (kids 8+): ฿3,800 - Pool-based scuba intro for children, with a PADI instructor.",
          "Scuba Review (refresher): ฿2,500 - One day, 2 supervised ocean dives. For certified divers who haven't dived in a while.",
          "PADI Open Water Diver: ฿11,000 - 3 days, lifetime certification, max 4 students per instructor. Lets you dive anywhere in the world to 18m.",
          "PADI Advanced Open Water: ฿10,000 - 2 days, 5 dives including deep and navigation. Takes you to 30m.",
          "PADI Rescue Diver + EFR: ฿16,500 (฿12,000 + ฿4,500) - 4 days. The course most people say changes how they dive.",
          "Peak Performance Buoyancy: ฿5,500 - 1 day, 2 dives. The single biggest skill upgrade you can buy.",
          "Wreck Diver / Deep Diver / Sidemount / DPV: each runs ฿7,000-฿9,500 depending on dive count.",
          "PADI Divemaster: ฿38,500 - 4-8 weeks, includes a free internship period. Your first professional certification.",
          "PADI Underwater Photography & Videography: ฿37,000 - 5 days, 10 dives, 1-on-1 instruction.",
          "PADI IDC (Instructor Development Course): price on request. We're a 5 Star IDC Centre, so you can train all the way from Open Water to Instructor at the same shop.",
        ],
      },
      {
        heading: "Daily living costs while you're on the island",
        paragraphs: [
          "The course price isn't the whole story - you'll be on Koh Tao for at least 3 days for Open Water, longer for the pro track. Here's a realistic daily budget.",
          "Accommodation: hostel dorm beds run ฿250-฿450 per night. Mid-range fan rooms or simple bungalows are ฿700-฿1,200. Air-con private rooms are ฿1,200-฿2,500. Beachfront resorts go up from there. For Divemaster and IDC trainees who stay 4-8 weeks, monthly rentals at ฿8,000-฿15,000 are standard.",
          "Food: a plate of Thai street food (pad thai, rice with meat, noodle soup) is ฿70-฿120. A western meal at a beach restaurant is ฿250-฿450. A proper sit-down dinner runs ฿400-฿700. Local bottled water and snacks are cheap - ฿20 for a 1.5L bottle.",
          "Transport: the island is small. A scooter rental costs ฿200-฿300 per day with fuel. Songthaew (shared pickup-truck taxi) rides are ฿100-฿200 per trip. The ferry from Bangkok costs ฿800-฿1,300 one-way depending on the route (we recommend Lomprayah or Songserm).",
          "Other: drinks at a beach bar are ฿120-฿200 for a beer, ฿200-฿350 for cocktails. Marine park fees only apply at certain dive sites and they're typically included in the course price at most reputable shops.",
          "A reasonable daily budget if you're staying in mid-range: ฿1,500-฿2,500 per day all-in. Hostel dorm + street food: ฿700-฿1,000.",
        ],
      },
      {
        heading: "Hidden costs to watch for at OTHER dive shops",
        paragraphs: [
          "The advertised price isn't always the price you pay. A few practices to watch out for when you compare quotes from other Koh Tao dive centres:",
          "\"From\" pricing - some shops advertise \"from ฿9,500\" but that's a base figure that excludes the eLearning materials, certification card processing, or marine park fees. Always ask: what's the total I pay, all-in?",
          "PADI eLearning sold separately - the digital learning materials cost about ฿2,500-฿3,000 if billed to you separately. At most centres they're already included in the course price; some unbundle it to make the headline number look cheaper.",
          "Equipment surcharges - older or specialty gear (full-foot fins not fitting, prescription masks, dive computer rental) can add ฿500-฿1,500. Worth confirming before you arrive.",
          "Boat fuel surcharge - when fuel prices spike, some shops add a daily ฿100-฿200 fuel charge. Less common now, but still appears in quiet seasons.",
          "Open Water ratio creep - the PADI maximum is 8 students per instructor. Some shops run that maximum, which means less attention and slower pace. We cap it at 4 students per instructor, every course.",
          "Pressure to upsell - if your shop is pushing you into specialties or extra fun dives during your Open Water, that's a red flag. Finish the course at your own pace; specialties are best done after.",
        ],
      },
      {
        heading: "Total budget by goal: from try-dive to professional",
        paragraphs: [
          "Day tripper / try diving: ฿2,600 for the Discover Scuba dive + 1 night accommodation + meals = ฿4,000-฿5,500 total.",
          "Hobby diver in 4 days: ฿11,000 Open Water + 4 nights mid-range stay (฿4,000-฿6,000) + food (฿1,500-฿2,500) = ฿17,000-฿20,000 all-in. That's USD 480-570.",
          "Confident diver in 7 days: Open Water + Advanced Open Water + a couple of fun dives = ฿11,000 + ฿10,000 + ฿2,500 = ฿23,500 for courses. Plus 7 days accommodation/food: ฿28,000-฿35,000 total. Around USD 800-1,000.",
          "Pro pathway: ฿38,500 Divemaster + 6 weeks accommodation (฿15,000-฿25,000 monthly rental) + food (฿8,000-฿15,000 per month) = ฿80,000-฿120,000 over 6-8 weeks. Includes the free internship - you assist on student courses, which is the real-world experience that makes you employable.",
          "Total instructor pipeline (Open Water → Instructor): roughly ฿120,000-฿180,000 in course fees over 3-4 months. Possibly the cheapest route to a globally portable scuba instructor career on the planet.",
        ],
      },
      {
        heading: "Why we publish exact prices (and most don't)",
        paragraphs: [
          "Most Koh Tao dive shops keep their prices off their website on purpose - they want you to walk in, get the sales pitch, and feel committed before you hear a number. We do the opposite. Every course we run has a fixed, publicly listed price with no hidden fees.",
          "If you book with us, you pay no deposit - you arrive in Koh Tao first, meet the team, see the boats, see the gear, and only then commit. If something feels off when you visit, you owe us nothing. That's how confident we are that the price-quality combination is right.",
          "Compare a few shops if you want - you should. Just make sure you're comparing the same thing: PADI standards, instructor ratio, gear quality, what's actually included.",
        ],
      },
      {
        heading: "Ready to book? Here's how",
        paragraphs: [
          "Send us a WhatsApp message with your dates and which course you're interested in. We'll confirm availability within an hour during daytime hours (Thailand time).",
          "No deposit required - you only pay once you arrive on Koh Tao and have met our instructors. We're at Mae Haad pier, a 5-minute walk from the ferry dock. Most students drop their bags, come over, sign up, and start the course the next morning.",
          "If you're still narrowing down which course is right for you, two reads worth your time: our PADI vs SSI comparison and our walkthrough of what to expect on the Open Water course. Both linked below.",
        ],
      },
    ],
    tags: ["PADI", "Cost", "Beginner", "Pro"],
    relatedCourses: ["open-water", "advanced-open-water", "divemaster", "discover-scuba"],
    relatedBlogSlugs: ["padi-vs-ssi-koh-tao", "padi-open-water-koh-tao-what-to-expect"],
    featured: true,
    readingTime: 9,
  },
  {
    slug: "padi-advanced-open-water-koh-tao",
    title: "PADI Advanced Open Water on Koh Tao: The Complete 2-Day Course Guide",
    category: "Diving",
    excerpt: "Everything about the PADI Advanced Open Water course on Koh Tao - the 5 dives, the deeper sites you unlock, prerequisites, and whether to do it right after Open Water.",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    date: "2026-05-09",
    sections: [
      {
        heading: "What the Advanced Open Water cert actually does",
        paragraphs: [
          "The PADI Advanced Open Water (AOW) cert takes you from a max depth of 18m up to 30m, which is where most of Koh Tao's best dive sites actually live. Sail Rock, Chumphon Pinnacle, the deeper portions of HTMS Sattakut, Shark Island - all of them are below 18m for the most interesting parts. With just an Open Water cert, you can dive Koh Tao but you can't dive the iconic spots properly.",
          "AOW is also the gating prerequisite for everything that comes after. Wreck Diver, Deep Diver, Photography, Search and Recovery, Rescue Diver, Divemaster - none of those are open to you on an Open Water cert alone. If you're thinking about going pro, AOW is unavoidable. If you're a hobby diver, AOW is what makes Koh Tao worth coming back to.",
          "Lifetime certification, internationally recognized, no expiry. Same standards everywhere PADI operates.",
        ],
      },
      {
        heading: "The 5 adventure dives explained",
        paragraphs: [
          "AOW is structured as 5 adventure dives over 2 days. Two are mandatory, three are your pick.",
          "Mandatory dives: Deep Adventure (typically to 30m at Chumphon Pinnacle or Shark Island) and Underwater Navigation Adventure (compass work plus natural-feature navigation, usually at Twins or Japanese Gardens).",
          "Pick 3 from: Wreck Adventure (HTMS Sattakut), Peak Performance Buoyancy, Photography, Naturalist (fish ID), Search and Recovery, Night Diver, Drift, Boat Diver, Underwater Videographer. Each adventure dive counts toward the corresponding full specialty later, if you want to complete one.",
          "Most students pick Wreck + Peak Performance Buoyancy + Photography because they're the most useful for everyday diving. The Wreck Adventure on the HTMS Sattakut is the single most popular AOW dive on the island.",
        ],
      },
      {
        heading: "Best AOW dive sites on Koh Tao",
        paragraphs: [
          "Sail Rock - the legendary pinnacle 45 minutes north of Koh Tao. Whale shark hot spot in season (April-May peak). Schooling barracuda, batfish, jacks. Max depth 35m, AOW required to see most of it.",
          "Chumphon Pinnacle - submerged seamount 30 minutes north. Often used for the Deep Adventure dive. Bull sharks in winter, turtles year-round, schooling fusiliers.",
          "HTMS Sattakut - Thai Navy ship sunk as an artificial reef. Deck at 18m, props at 30m. Used for Wreck Adventure dive. Penetration not allowed on the Adventure dive itself, but you swim through swim-throughs.",
          "Shark Island - blacktip reef sharks year-round, especially at sunset. Sloping reef, 5-25m, picks up in the deep section.",
          "Twins / Japanese Gardens - shallow training sites used for Navigation Adventure, Buoyancy, Naturalist. Calm, easy to navigate, hard coral and damselfish.",
        ],
      },
      {
        heading: "Prerequisites and cost",
        paragraphs: [
          "You need a PADI Open Water certification (or recognized equivalent from another agency - SSI, NAUI, BSAC, etc. all qualify). No minimum logged dives required by PADI standards, though we recommend you have 5-10 dives under your belt for comfort.",
          "AOW at Siam Scuba is 10,000 THB. That includes all gear rental, 5 boat dives, dive computer rental, certification card processing, and tax. No surcharges for dive site access (Sail Rock has a small marine fee that's already included).",
          "2 days standard. Min age 12 for Junior AOW, 15 for full AOW (Junior gets a depth-restricted card that converts to full AOW automatically when they turn 15).",
        ],
      },
      {
        heading: "Should you do AOW right after Open Water?",
        paragraphs: [
          "For most people, yes. Three reasons.",
          "First, momentum. You've just spent 3 days getting comfortable underwater. Your buoyancy is starting to click, your gear feels normal, you're not fighting your mask anymore. Stopping for months and coming back later means rebuilding that comfort - usually you'll need a refresher dive at least.",
          "Second, depth confidence. The first time you go past 18m is psychologically different than the first time at 12m. Doing it under instructor supervision while AOW skills are fresh is the safer way to make that jump.",
          "Third, it unlocks the actually-good dive sites. Doing OW + AOW back-to-back over 5-6 days means you spend the second half of your trip diving the legendary sites instead of the training reefs. The cost difference (10,000 THB) is small relative to the value of doing AOW now vs. flying home and coming back later.",
          "When NOT to do AOW immediately: if you didn't enjoy Open Water and aren't sure diving is for you, take a break. Forcing AOW right after a rough OW course is how people end up with bad memories and never dive again.",
        ],
      },
      {
        heading: "What you'll learn that Open Water didn't cover",
        paragraphs: [
          "Underwater navigation - how to read a compass underwater, how to navigate by natural features (sand patterns, depth changes, sun angle), how to plan a dive with reciprocal headings.",
          "Deep diving theory - nitrogen narcosis (what it feels like, how to recognize it, what to do), gas planning at depth, ascent rate management, decompression considerations.",
          "Continued buoyancy refinement - if you opt for the Peak Performance Buoyancy adventure dive, you learn weight optimization, trim, and fin techniques that drop your air consumption noticeably.",
          "Specialty equipment exposure - if you do Wreck or Photography, you handle a reel/torch or a camera in a structured environment.",
        ],
      },
      {
        heading: "Booking and next steps",
        paragraphs: [
          "Same booking flow as Open Water. WhatsApp us with your dates, we confirm within an hour during daytime. No deposit required - you pay once you arrive on Koh Tao and meet the team.",
          "If you're considering OW + AOW together, mention it in the message. We can schedule them back-to-back so you finish in 5-6 days rather than spreading across two trips.",
          "Where AOW leads: Rescue Diver is the natural next step (most divers say it changes how they dive). Then Divemaster if you want to go pro. We have the full pathway in-house, same shop, same instructors.",
        ],
      },
    ],
    tags: ["PADI", "Advanced Open Water", "Intermediate"],
    relatedCourses: ["advanced-open-water", "wreck-diving", "deep-diving", "rescue-diver"],
    relatedBlogSlugs: ["padi-open-water-koh-tao-what-to-expect", "koh-tao-dive-sites-guide", "koh-tao-diving-cost-guide"],
    readingTime: 8,
  },
  {
    slug: "padi-idc-koh-tao",
    title: "PADI IDC on Koh Tao: How to Become a Scuba Instructor at a 5 Star IDC Centre",
    category: "Diving",
    excerpt: "The full walkthrough of the PADI Instructor Development Course on Koh Tao - prerequisites, the 10-day training arc, the IE exam, and what work as a PADI Instructor actually pays.",
    coverImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&q=80",
    date: "2026-05-09",
    sections: [
      {
        heading: "What the IDC actually is",
        paragraphs: [
          "The Instructor Development Course (IDC) is the course that turns Divemasters into Open Water Scuba Instructors (OWSI). It's the single biggest career step in the PADI system - going from \"professional diver\" to \"professional teacher of diving.\"",
          "Technically the IDC has two phases: Assistant Instructor (AI) and OWSI. Most people do them back-to-back, which is what \"the IDC\" usually refers to in casual conversation.",
          "The IDC ends with the Instructor Examination (IE), a 2-day exam run by an external PADI Examiner (not your IDC trainer). That separation is intentional - it keeps the certification standardized across all 6,500+ PADI dive centres.",
        ],
      },
      {
        heading: "Prerequisites",
        paragraphs: [
          "Active PADI Divemaster certification (or recognized equivalent). Must be in renewal-current status.",
          "100 logged dives minimum. Most candidates have 150-300 by the time they enroll.",
          "18+ years old.",
          "Active EFR Instructor certification - you need this to teach the EFR component of Rescue Diver to your future students. We bundle this into the IDC package as standard.",
          "Medical clearance signed by a doctor. The PADI medical form for instructor candidates is more thorough than the Open Water version.",
          "6 months minimum since you certified as a diver (i.e. since your Open Water cert was issued).",
        ],
      },
      {
        heading: "The IDC training structure (10 days)",
        paragraphs: [
          "Day 1-2: Standards review (the PADI Instructor Manual is your bible from now on), teaching philosophy, dive theory (physics, physiology, equipment, environment, RDP/eRDPML).",
          "Day 3-5: Confined water teaching presentations. You take the 24 fundamental skills you learned in Divemaster and teach them, broken down into demonstration speed for student understanding. You'll teach each skill multiple times under instructor critique.",
          "Day 6-7: Open water teaching presentations. Now you're running mock Open Water dives with your IDC peers playing the role of students. You critique each other, you adjust delivery based on feedback.",
          "Day 8-9: Rescue scenarios and mock IE. Full-day mock exams that mirror the actual IE format and intensity.",
          "Day 10: Final reviews, last-minute fixes, IE prep brief.",
        ],
      },
      {
        heading: "The IE - what to expect",
        paragraphs: [
          "The IE is a 2-day external exam run by a PADI Examiner. It happens at a regional venue (often on Koh Tao itself, sometimes in Phuket or Pattaya).",
          "5 sections: theory exams (5 written, you need 75% on each), skills demonstration (rescue scenarios + 5 random fundamental skills demonstrated to instructor standard), classroom presentation (you teach a 15-minute lesson on a topic drawn from a hat), confined water teaching (you teach 1 of 24 fundamental skills to students who play the role of beginners), open water teaching (you teach a fundamental skill in the ocean).",
          "Pass rate at well-prepped IDCs is 95%+. The 5% that fail typically fail one section, which can usually be retaken within 12 months without redoing the full IDC.",
          "We share our IE pass rate honestly - ask us when you inquire and we'll quote the most recent number, not a marketing figure.",
        ],
      },
      {
        heading: "Why Koh Tao is the best place for IDC",
        paragraphs: [
          "Volume of students. Koh Tao certifies more divers annually than anywhere else on the planet. That means during your IDC and the post-IDC \"specialty teaching\" period, you have access to real student populations to practice on. Other locations can have IDC candidates teaching mock students (each other) for weeks.",
          "5 Star IDC Centre status (PADI's highest rating). We're audited regularly and the rating reflects real operational quality, not just paying for the badge.",
          "Multiple boats running daily. No scheduling bottlenecks - if your IDC group needs to do open water teaching today, you go.",
          "Other instructors and Course Directors available for second opinions. The Koh Tao instructor community is large; you can shadow other instructors' classes during the post-IDC period for additional perspective.",
        ],
      },
      {
        heading: "Cost and what's included",
        paragraphs: [
          "IDC pricing is on request because it varies by package. The base course alone is one number; adding EFR Instructor (mandatory for the IE), MSDT prep (Master Scuba Diver Trainer), and specialty instructor ratings changes the figure. Get an exact number when you inquire by WhatsApp.",
          "What's included in the standard package: all training, all dives, IDC manuals, lunch on training days. EFR Instructor course included.",
          "What's billed separately: IE registration fees go directly to PADI (~USD 700-900 depending on currency rates). Accommodation and food on the island. Optional MSDT prep (5 specialty instructor ratings, can be done after the IDC).",
          "We run IDCs roughly monthly. If your timing is flexible, ask which intake has the smaller cohort - 2-3 candidates is the sweet spot for personal feedback.",
        ],
      },
      {
        heading: "Career outlook after passing",
        paragraphs: [
          "Entry-level instructor positions are widely available across SE Asia (Thailand, Indonesia, Philippines, Malaysia), the Caribbean (Belize, Roatan, Curacao), the Red Sea (Egypt, Jordan, Sudan), Australia (GBR centres), and the Maldives. Less common but possible: Fiji, Galapagos, Mediterranean.",
          "Compensation: most entry roles include free accommodation + commission per certified student. A new instructor in a busy centre earns roughly USD 800-1,500/month after housing - enough to live comfortably in tropical destinations, less than corporate work back home.",
          "Specialty Instructor track opens up after MSDT requirement (25 students certified across at least 5 specialties). MSDT lets you teach Wreck, Deep, Photography, etc. as paid specialty courses.",
          "Master Instructor / Course Director is a 5-10 year pathway from initial IE pass. Course Director status is selective - PADI runs CDTC training only annually and requires significant teaching history.",
          "Most instructors do this for 2-5 years and either move into management (dive centre operations, training facility), instructor training (Course Director track), or pivot to a non-diving career with the gap-year done. A smaller number stay teaching for life.",
        ],
      },
    ],
    tags: ["PADI", "IDC", "Instructor", "Pro"],
    relatedCourses: ["idc", "divemaster", "rescue-diver"],
    relatedBlogSlugs: ["padi-divemaster-koh-tao", "koh-tao-diving-cost-guide", "padi-vs-ssi-koh-tao"],
    readingTime: 10,
  },
  {
    slug: "best-time-to-dive-koh-tao",
    title: "When Is the Best Time to Dive Koh Tao? Month-by-Month Conditions and Wildlife Guide",
    category: "Diving",
    excerpt: "Honest month-by-month guide to diving conditions on Koh Tao - water temp, visibility, sea state, weather, and which months actually have the worst diving.",
    coverImage: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1200&q=80",
    date: "2026-05-09",
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "Koh Tao is divable year-round. It's not a seasonal destination like the Caribbean or the Red Sea where some months effectively shut down.",
          "Best months for conditions: February through May. Calm seas, 20-30m+ visibility, steady weather.",
          "Worst months: October through mid-December (monsoon season). Choppy seas on north-shore sites, rain windows, visibility drops to 5-15m on bad days.",
          "Year-round water temperature: 28-30°C. You don't need a thick wetsuit, ever. A 3mm shorty is plenty.",
          "Monthly weather is the single biggest factor that varies. Visibility varies but less dramatically than people expect.",
        ],
      },
      {
        heading: "February to May - peak conditions",
        paragraphs: [
          "Visibility 20-30m on most sites. Sea is glass-flat most days. Air temperature 28-32°C, low humidity by tropical standards.",
          "Whale shark season peaks April through May at Sail Rock and Chumphon Pinnacle. Sightings happen year-round but April-May has the highest hit rate.",
          "Highest tourist load - book accommodation 4-8 weeks ahead, especially around Songkran (Thai New Year, mid-April) and Easter.",
          "If you have flexibility, target March or April. Conditions are at their best, crowds are present but manageable, and the days are long enough for two-tank dive trips.",
        ],
      },
      {
        heading: "June to September - excellent diving, low crowds",
        paragraphs: [
          "Visibility 15-25m typically. Some afternoon thunderstorms, but they usually clear by morning - we run morning dives early specifically to avoid weather.",
          "Plankton blooms occasionally drop visibility for 1-2 days at a time. They're seasonal and unpredictable; you can have 30m visibility one day and 8m the next, then back to 25m.",
          "Sea state varies. Most days are good. Wind can pick up in late afternoon.",
          "Best balance of conditions and value. Accommodation prices drop noticeably. Course slots are easier to grab on short notice.",
          "Whale shark sightings continue, just with lower frequency than April-May.",
        ],
      },
      {
        heading: "October to mid-December - monsoon season",
        paragraphs: [
          "This is the season most blog posts gloss over. Heavy rain windows, especially in November when the monsoon peaks.",
          "Sea state: choppy on north-shore sites (Sail Rock, Chumphon Pinnacle). Some days they're undivable; we move to south-shore protected sites instead.",
          "Visibility: 5-15m on bad days, 15-25m on good days. Depends on rain runoff from the island and current direction.",
          "We dive every day except in extreme conditions. Our boats (Siam Explorer, Siam Pearl) are larger and sturdier than the small longtails most shops use, so we operate when smaller shops cancel.",
          "Many Koh Tao dive shops close for 2-3 weeks during peak monsoon (mid-November). We typically don't, but we sometimes shift schedules.",
        ],
      },
      {
        heading: "Mid-December to January - high season returns",
        paragraphs: [
          "Conditions improve rapidly through mid-December. By Christmas, most days are excellent again.",
          "Whale sharks possible but less reliable than the spring window.",
          "Holiday season drives heavy tourist demand. Book accommodation 2-3 months ahead for Christmas through New Year. Course slots fill up.",
          "Sea state varies through January as the trailing monsoon weather works through the region. By February, conditions are reliably calm.",
        ],
      },
      {
        heading: "Wildlife calendar",
        paragraphs: [
          "Whale sharks: April to May peak. Year-round possible at Sail Rock and Chumphon Pinnacle.",
          "Bull sharks: November to March (when they appear at Chumphon Pinnacle). Sightings are rare but real.",
          "Reef sharks (blacktip): year-round at Shark Island, especially at sunset.",
          "Schooling barracuda + jacks: year-round at Sail Rock and Chumphon Pinnacle. Best viewing on calm-current days.",
          "Turtles: year-round at most reef sites. Aow Leuk and Hin Wong are reliable spots.",
          "Spawning aggregations: variable, usually triggered by lunar cycle and water temp. Ask local instructors when you arrive - they track this.",
        ],
      },
      {
        heading: "What this means for booking",
        paragraphs: [
          "Maximum flexibility: target March or April. Best conditions, full wildlife calendar, and you'll get the most out of multi-day courses.",
          "If you're already coming October-November: still divable, just plan flexibility into your trip. A 7-day stay gives us multiple weather windows to work with; a 3-day rush trip during peak monsoon is a coin flip.",
          "Honest framing: a single bad-weather day on Koh Tao still has better conditions than most temperate dive sites on a good day. The water is warm, the marine life is rich, and even reduced visibility (10m) is plenty for training.",
          "Multi-day courses give us room to swap sites based on conditions. If Sail Rock is rough, we move to a south-shore reef. You won't notice unless you specifically asked for the rough-condition site.",
        ],
      },
    ],
    tags: ["Seasons", "Weather", "Wildlife"],
    relatedCourses: ["discover-scuba", "open-water", "advanced-open-water"],
    relatedBlogSlugs: ["koh-tao-dive-sites-guide", "koh-tao-diving-cost-guide", "padi-vs-ssi-koh-tao"],
    readingTime: 8,
  },
  {
    slug: "padi-open-water-koh-tao-complete-guide",
    title: "PADI Open Water Course on Koh Tao: The Complete 2026 Guide",
    category: "Diving",
    excerpt: "Comprehensive guide to the PADI Open Water Diver course on Koh Tao - what you actually learn, the 4 ocean dives, group size, gear, health requirements, and how to book without a deposit.",
    coverImage: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=1200&q=80",
    date: "2026-05-09",
    sections: [
      {
        heading: "What the Open Water cert actually unlocks",
        paragraphs: [
          "The PADI Open Water Diver certification is the entry-level recreational scuba certification. It's the most-issued scuba cert in history - over 29 million divers worldwide hold one.",
          "Lifetime certification, no expiration. You can dive 10 years from now without renewing or refreshing (we still recommend a refresher dive after long breaks, but it's not required for the card to remain valid).",
          "Worldwide recognition. PADI is recognized in roughly 135 countries. Other major agencies (SSI, NAUI, BSAC, SDI, RAID) all accept PADI Open Water as the equivalent prerequisite for their own Advanced courses.",
          "Lets you dive with a buddy to 18m without supervision. To go beyond 18m, you need the Advanced Open Water cert.",
          "Required prerequisite for AOW, Rescue Diver, EFR Primary Care, and the entire Pro track (Divemaster, Instructor).",
        ],
      },
      {
        heading: "The 4 components of the course",
        paragraphs: [
          "Theory: 5 modules covering physics, physiology, equipment, dive planning, and the underwater environment. You can do this as eLearning at home before you arrive (saves a day on the island), or in classroom sessions with us.",
          "Confined water sessions: 5 sets of skills practiced in a pool or shallow ocean area. Mask clearing, regulator recovery, alternate air source use, weight handling, neutral buoyancy basics. This is where you build the muscle memory.",
          "Open water dives: 4 dives in the ocean. You demonstrate the same skills you learned in confined water, plus you do a small navigation exercise.",
          "Final exam: 50 multiple-choice questions, 75% pass mark. If you fail one section you re-do that section only, not the full exam.",
        ],
      },
      {
        heading: "The 4 ocean dives - what you'll see",
        paragraphs: [
          "Dive 1: Twin Peaks or Japanese Gardens. 8-12m max depth. Calm reef, hard coral, damselfish, parrotfish, the occasional cuttlefish. You'll do basic skills (mask clear, regulator retrieval) on the bottom.",
          "Dive 2: White Rock or Aow Leuk. 12-15m max depth. More reef life, more variety. Often a turtle sighting.",
          "Dive 3: Same site as Dive 2 at deeper depth. 15-18m. You're getting comfortable with the depth and equalization rhythm now.",
          "Dive 4: Different site, full skill demonstration including the navigation exercise (swim out 30m and back using a compass).",
          "All 4 dives are on our boats - Siam Explorer or Siam Pearl. Surface intervals are spent on the boat, lunch is included on full-day dive trips.",
        ],
      },
      {
        heading: "How long it takes",
        paragraphs: [
          "Standard: 3 days on the island if you complete the eLearning theory component at home before you arrive (recommended).",
          "Slower track: 4 days on the island if you do all theory in person.",
          "Fastest: 2 days, but we don't recommend it. Rushing the course leaves you less comfortable in the water and makes the skills less automatic. The 2-day option is occasionally requested by tight-itinerary travellers; we only run it if the instructor judges the student ready.",
          "If you have time, 4 days at a relaxed pace is the most enjoyable. Most students do 3 days.",
        ],
      },
      {
        heading: "Group size matters more than people realize",
        paragraphs: [
          "PADI maximum is 8 students per instructor. That's the upper limit, not the standard.",
          "Industry common in Koh Tao: 6 to 8 students per instructor. With that ratio, the instructor can't watch everyone closely. Skills get rushed. Students who need extra help get less of it.",
          "Siam Scuba: maximum 4 students per instructor. No exceptions. Often 2-3 in a group during quieter periods.",
          "4:1 ratio means every student gets meaningful one-on-one skill correction time. Underwater, the instructor can actually see what each student is doing.",
          "From our data: students in 8:1 groups have a higher rate of failed skill demonstrations and need-more-time outcomes. We've kept 4:1 because we'd rather run more groups than rush a single one.",
        ],
      },
      {
        heading: "What gear is included",
        paragraphs: [
          "Mask, snorkel, full wetsuit (3mm shorty for warm season, 3/5mm full for cooler months), BCD (buoyancy control device), regulator with primary and alternate, fins, weights, tank.",
          "Dive computer for the open water portion. We use Suunto and Mares computers; we'll teach you to read it.",
          "All gear is rinsed and quality-checked daily. Tanks are visually and pressure-tested annually.",
          "If you have your own mask, bring it. A fitted mask is the single most useful piece of personal gear - rentals work fine but a mask that fits your face is more comfortable.",
          "Other personal gear (BCD, regulator, fins, computer) is fine to bring if you own it, but absolutely not required.",
        ],
      },
      {
        heading: "Health requirements",
        paragraphs: [
          "PADI Medical Statement is a 10-question yes/no form covering common conditions. You'll fill it out on Day 1.",
          "Any \"yes\" answer requires a doctor's signature before you can dive. You can get this in Koh Tao - a Thai dive medical exam costs 1,000-1,500 THB and takes about 30 minutes.",
          "Common conditions that need clearance: asthma (most asthmatics can dive with controlled medication, but they need a sign-off), ear surgery history, recent ear infections, heart conditions, pregnancy (no diving during pregnancy), severe allergies, anxiety/panic disorders, recent surgeries.",
          "We can't refund the course if you fail medical clearance after arriving. If you have any of the conditions above, get a dive medical at home before flying - it's the same form, costs about the same, and avoids surprises.",
          "Age minimum: 10 (Junior Open Water, depth-restricted to 12m), 15 (full Open Water, depth-limited to 18m).",
        ],
      },
      {
        heading: "Booking next steps",
        paragraphs: [
          "WhatsApp us with your dates, the names in your group (singles, couples, friends - tell us so we can plan grouping), and any concerns. We confirm within an hour during daytime hours (Thailand time).",
          "No deposit required. You arrive, you meet the team, you see the boats and the gear, and only then you commit. If something feels off, you owe us nothing.",
          "Pre-purchase the PADI eLearning if you want to save a day - tell us when you book and we'll send you the activation link.",
          "If you're flying in the day you start: we recommend not. Flying within 24 hours of diving is a no-go (decompression risk). Most students arrive on Koh Tao a day before the course starts.",
        ],
      },
    ],
    tags: ["PADI", "Open Water", "Beginner"],
    relatedCourses: ["open-water", "advanced-open-water", "discover-scuba"],
    relatedBlogSlugs: ["padi-vs-ssi-koh-tao", "koh-tao-diving-cost-guide", "padi-open-water-koh-tao-what-to-expect"],
    readingTime: 9,
  },
  {
    slug: "divemaster-koh-tao-internship-day-by-day",
    title: "What a PADI Divemaster Internship in Koh Tao Actually Looks Like (Week by Week)",
    category: "Diving",
    excerpt: "Detailed week-by-week walkthrough of the PADI Divemaster internship on Koh Tao - the training arc, the assist work, the lifestyle, and the realistic outcomes.",
    coverImage: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1200&q=80",
    date: "2026-05-09",
    sections: [
      {
        heading: "DM Internship vs DM Course",
        paragraphs: [
          "Calling it a \"course\" undersells it. A typical course is classroom learning over a few days. The PADI Divemaster is more like an apprenticeship - 4 to 8 weeks of structured theory, real assist work on student courses, water skills assessment, and a final exam arc.",
          "The minimum PADI Divemaster timeline is 4 weeks. We recommend 6 weeks. The extra 2 weeks let you assist on more student courses, which is where the real learning happens.",
          "At Siam Scuba, the free internship period is included in the course price. You aren't paying us extra to assist on student courses - that's the whole point. Some shops in other locations charge for it; we don't.",
          "Total cost at Siam Scuba: 38,500 THB for the course. Accommodation, food, and entertainment are separate.",
        ],
      },
      {
        heading: "Week 1-2 - Foundations",
        paragraphs: [
          "Theory crash course covers physics, physiology, equipment, dive theory, dive skills, and the underwater environment. The Divemaster Manual is a thick book - we work through it systematically with quizzes between sections.",
          "Water skills assessment: a 400m swim, an 800m snorkel, a 100m unconscious-diver tow, and a 15-minute tread. These aren't athletic tests - we work up to them. Most candidates pass after 1-2 attempts.",
          "Dive Skills demonstration. There are 24 fundamental PADI skills (mask removal, regulator recovery, weight handling, etc.) and you need to demonstrate each one to a teaching standard - that means slow, deliberate, easy to copy. Building demo speed is half the work of becoming a professional.",
          "First \"shadow shifts\" - you sit in on Open Water classroom sessions and quietly watch how instructors run the room. You're not assisting yet, just learning the rhythm.",
        ],
      },
      {
        heading: "Week 3-4 - Assisting on student courses",
        paragraphs: [
          "You start assisting Open Water and AOW students under instructor supervision. This is the inflection point of the internship - you stop being a diver who watches, and start being a professional who acts.",
          "Pre-dive: gear preparation, helping students with weight selection and BCD adjustment, briefings.",
          "In-water: shadow students during their skills, signal them to slow down or repeat as needed, watch for the kid who might be struggling, communicate with the instructor.",
          "Post-dive: debriefs, gear rinsing, log book signing, the reset for the next dive.",
          "Daily dives, often 2-3 per day. The pace is high but you build a deep familiarity with the dive sites and the typical student error patterns. By end of week 4 you can predict what an OW student will struggle with on a given dive before they even get in the water.",
        ],
      },
      {
        heading: "Week 5 - Leading certified divers",
        paragraphs: [
          "Mapping a dive site: you produce a full chart with depths, hazards, marine life points of interest, entry/exit, suggested route. You map either Twins, Japanese Gardens, or White Rock - all sites we run frequently.",
          "Mock dive briefings: you run a full briefing for a group of certified fun divers, then lead the dive. An instructor watches and gives feedback after.",
          "Search and recovery scenario: deploy a lift bag, find a target object, surface it.",
          "Deep Dive scenarios: simulating depth-related issues (narcosis recognition, gas planning).",
          "By this point you're getting feedback from multiple instructors - that's intentional. Different instructors have different teaching styles, and exposing you to several builds your judgment.",
        ],
      },
      {
        heading: "Week 6 - Final exams and graduation",
        paragraphs: [
          "Theory exams: 5 written sections (physics, physiology, equipment, RDP/eRDPML, environment). 75% pass on each.",
          "Skills final demonstration: 5 of the 24 fundamental skills picked at random.",
          "Internship hours documented: PADI requires you to log a minimum number of student-assist hours. Most candidates have well over the minimum by week 6.",
          "DM card application submitted to PADI. Card arrives 1-2 weeks after graduation, mailed to wherever you ask.",
          "Graduation typically involves dinner with the cohort and the instructor team. The Koh Tao DMT graduation is a tradition.",
        ],
      },
      {
        heading: "Life on the island as a DMT",
        paragraphs: [
          "Most DMTs share rooms or rent monthly studios. Range: 8,000-15,000 THB per month for fan-cooled basic accommodation, up to 25,000 THB for air-con private studios.",
          "Daily routine on training days: morning dives 8am-12pm, lunch and break, afternoon theory or skills 1pm-4pm, evening study and social time. Recovery time matters - diving twice a day for 6 weeks is physically demanding.",
          "Strong DMT community. There are typically 15-25 trainees on the island at any time, across multiple shops. Cohort mentality, group hangouts, shared accommodation strategies. The friendships people make during DM training tend to be the kind that last.",
          "Time off: most weekends are free. Nightlife is active in Sairee. Hiking and food are cheap. Some DMTs spend their weekends doing fun dives at sites they're not certified to lead yet, just to keep their interest in diving outside the work context.",
        ],
      },
      {
        heading: "What happens next",
        paragraphs: [
          "The most common pathway: continue straight to the Instructor Development Course (IDC) after Divemaster. Total cost from OW to OWSI is roughly 120,000-180,000 THB over 3-4 months, depending on package.",
          "Alternative: work as a Divemaster for 6-12 months first, save up, then do the IDC. This is what we recommend for candidates who want to be sure diving is the right career before investing in the instructor pathway.",
          "Job market for new Divemasters: roles are widely available across SE Asia, the Caribbean, the Red Sea, the Maldives, Australia, and the Mediterranean. Entry-level pay is modest (USD 600-1,000/month after housing) but living costs in tropical destinations are low.",
          "The free internship culture is unique to Koh Tao. Elsewhere (Caribbean, Australia), Divemaster internships often charge USD 2,000-3,000 on top of the course fee. Worth knowing as you compare options.",
        ],
      },
    ],
    tags: ["PADI", "Divemaster", "Pro", "Internship"],
    relatedCourses: ["divemaster", "rescue-diver", "idc"],
    relatedBlogSlugs: ["padi-divemaster-koh-tao", "padi-idc-koh-tao", "koh-tao-diving-cost-guide"],
    readingTime: 10,
  },
  {
    slug: "padi-vs-ssi-koh-tao",
    title: "PADI vs SSI on Koh Tao — Which Course Should You Choose?",
    category: "Diving",
    excerpt: "Thinking about getting your dive certification on Koh Tao? Here's an honest comparison of PADI and SSI so you can make the right choice.",
    coverImage: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80",
    date: "2026-03-10",
    sections: [
      {
        heading: "PADI vs SSI — Does It Actually Matter?",
        paragraphs: [
          "One of the most common questions we get from new divers on Koh Tao is: 'Should I do PADI or SSI?' The honest answer is that both are internationally recognised, respected certifications — and any dive centre around the world will accept either one.",
          "That said, there are real differences in how the courses are structured, how the materials are delivered, and how they feel as a student. This guide breaks it all down so you can choose what's right for you.",
        ],
      },
      {
        heading: "The PADI Open Water Course",
        paragraphs: [
          "PADI (Professional Association of Diving Instructors) is the world's largest dive training organisation, certifying over 1 million divers every year. Their Open Water Diver course is the most recognised beginner certification on the planet.",
          "The PADI course consists of three parts: knowledge development (theory), confined water dives (in a pool or shallow bay), and open water dives (four dives in the ocean). On Koh Tao, the full Open Water course typically takes 3–4 days.",
          "One key thing to know: PADI materials (the printed or digital manual) are an additional cost on top of your course fee — usually around 800–1,000 THB extra. At Siam Scuba, we include everything in one transparent price so there are no surprises.",
        ],
      },
      {
        heading: "The SSI Open Water Course",
        paragraphs: [
          "SSI (Scuba Schools International) is the second-largest dive training agency in the world and is particularly popular in Europe and Asia. Their Open Water Diver course covers the same skills as PADI and results in an equivalent lifetime certification.",
          "One practical advantage of SSI is that their digital training materials are typically included in the course price — no hidden fees. The SSI MyDiveGuide app lets you access your certification card and log dives digitally.",
          "On Koh Tao, SSI courses are offered by several of the larger dive centres including Big Blue Diving.",
        ],
      },
      {
        heading: "Which Certification Is Accepted Worldwide?",
        paragraphs: [
          "Both PADI and SSI certifications are accepted at dive centres all over the world — from the Red Sea to the Great Barrier Reef, the Maldives to Bali. You will never be turned away because of your certification agency.",
          "What dive centres actually check when you show up to dive is your certification level (Open Water, Advanced, Rescue, etc.) and your log book. The agency — PADI or SSI — is largely irrelevant once you have your card.",
        ],
      },
      {
        heading: "Why Siam Scuba Teaches PADI",
        paragraphs: [
          "Siam Scuba is a PADI 5 Star IDC Centre — one of the highest PADI ratings awarded to dive operations. This means our instructors are trained to the highest PADI standard, and we can certify divers all the way from absolute beginner to PADI Instructor.",
          "PADI is a little more strict with their requirements and sequencing — and that's exactly why we chose them. They do this to enhance both your safety and your retention of critical skills and information. Every skill you learn builds on the previous one, so by the time you finish a course, you're not just certified — you're genuinely confident underwater.",
          "We also chose PADI because of its worldwide recognition, the depth of the training materials, and because our team has decades of combined PADI teaching experience. Our maximum student-to-instructor ratio is 4:1, which means you get far more personal attention than at larger operations.",
          "If you're still unsure, we're happy to chat. Just reach out via WhatsApp and our team will help you figure out the best course for your goals.",
        ],
      },
    ],
    tags: ["PADI", "SSI", "Beginner", "Open Water"],
    relatedCourses: ["open-water", "discover-scuba"],
    relatedBlogSlugs: ["padi-open-water-koh-tao-what-to-expect", "koh-tao-dive-sites-guide"],
    featured: true,
    readingTime: 8,
  },
  {
    slug: "koh-tao-dive-sites-guide",
    title: "Complete Guide to the Best Dive Sites on Koh Tao",
    category: "Diving",
    excerpt: "From the famous HTMS Sattakut wreck to the legendary Sail Rock — here's everything you need to know about diving on Koh Tao.",
    coverImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    date: "2026-03-15",
    sections: [
      {
        heading: "Why Koh Tao Is One of the Best Dive Destinations in Asia",
        paragraphs: [
          "Koh Tao — literally 'Turtle Island' — sits in the Gulf of Thailand and has been one of Southeast Asia's premier scuba diving destinations for over 30 years. The warm, clear waters (visibility often exceeding 20 metres), abundant marine life, and affordable prices make it the world's most popular place to get a dive certification.",
          "There are over 25 named dive sites around Koh Tao and the nearby islands, ranging from shallow reefs perfect for beginners to 30-metre deep walls and a large artificial wreck. Here's your guide to the best.",
        ],
      },
      {
        heading: "Sail Rock — The Best Dive Site in the Gulf of Thailand",
        paragraphs: [
          "Located halfway between Koh Tao and Koh Phangan, Sail Rock is widely considered the single best dive site in the Gulf of Thailand. A huge granite pinnacle rises from 40 metres below to just above the surface, surrounded by massive schools of fish.",
          "The 'chimney' — a vertical tunnel through the rock you can swim through — is one of the most thrilling experiences in Thai diving. Whale sharks are regularly spotted here between January and April. Expect strong currents and big pelagics. Recommended for Advanced Open Water divers or above.",
          "From Siam Scuba, Sail Rock day trips depart early morning and include two dives, equipment, and a surface interval snack.",
        ],
      },
      {
        heading: "HTMS Sattakut — Koh Tao's Wreck Dive",
        paragraphs: [
          "The HTMS Sattakut is a decommissioned US Navy vessel that was deliberately sunk in 2011 to create an artificial reef. At 56 metres long, it sits upright on the sandy bottom at 28–30 metres — making it accessible to Advanced Open Water divers.",
          "Marine life has colonised the wreck rapidly. Schools of glassfish, batfish, groupers, and occasional barracuda hover around the structure. The superstructure is penetrable by trained divers. A genuinely impressive dive even for experienced divers.",
        ],
      },
      {
        heading: "Japanese Gardens — Best for Beginners",
        paragraphs: [
          "Located in the shallow channel between Koh Tao and Koh Nang Yuan, Japanese Gardens is a sprawling coral garden at just 6–12 metres depth. It's the perfect dive for beginners, newly certified divers, and snorkellers.",
          "The site gets its name from the delicate hard corals that carpet the bottom like a manicured Japanese garden. You'll regularly spot clownfish in their anemones, pufferfish, blue-spotted stingrays, and — if you're lucky — hawksbill sea turtles.",
        ],
      },
      {
        heading: "Chumphon Pinnacle — For Advanced Divers",
        paragraphs: [
          "Chumphon Pinnacle is a cluster of submerged granite peaks dropping to 35 metres on the west side of Koh Tao. It's famous for large pelagic fish — giant grouper, chevron barracuda in massive schools, and frequent whale shark sightings.",
          "The current can be strong, making this a dive for Advanced Open Water certified divers and above. But the reward is some of the most dramatic marine life encounters in Thai waters.",
        ],
      },
      {
        heading: "White Rock — Fun Dive Favourite",
        paragraphs: [
          "White Rock is one of the most visited dive sites on Koh Tao — and for good reason. The site is a series of granite boulders at 5–20 metres, covered in coral and teeming with fish. It's suitable for all certification levels.",
          "Resident hawksbill turtles are almost guaranteed sightings here. The site is large enough to explore thoroughly on a 50-minute dive without repeating the same area. A go-to choice for fun dives from Siam Scuba.",
        ],
      },
    ],
    tags: ["Dive Sites", "Wrecks", "Sail Rock", "Advanced"],
    relatedCourses: ["advanced-open-water", "wreck-diving", "deep-diving"],
    relatedBlogSlugs: ["padi-vs-ssi-koh-tao", "padi-open-water-koh-tao-what-to-expect"],
    featured: true,
    readingTime: 9,
  },
  {
    slug: "padi-open-water-koh-tao-what-to-expect",
    title: "PADI Open Water Course on Koh Tao — What to Expect",
    category: "Diving",
    excerpt: "Never dived before? Here's exactly what happens during your PADI Open Water Diver course on Koh Tao — day by day.",
    coverImage: padiOpenWaterCover,
    date: "2026-03-20",
    sections: [
      {
        heading: "What Is the PADI Open Water Diver Course?",
        paragraphs: [
          "The PADI Open Water Diver certification is the world's most popular dive certification. It qualifies you to dive to 18 metres anywhere in the world, with any buddy, for the rest of your life. The certification never expires.",
          "On Koh Tao, the course typically takes 3 to 4 days and costs around 10,000–12,000 THB depending on the dive centre. At Siam Scuba, we keep groups to a maximum of 4 students per instructor — far fewer than the PADI maximum of 8 — so you get more time in the water and more personal coaching.",
        ],
      },
      {
        heading: "Day 1 — Theory and Pool",
        paragraphs: [
          "You'll start with theory: either through the PADI eLearning platform (which you can complete online before arriving on Koh Tao) or with your instructor using the PADI manual. The theory covers dive physics, equipment, hand signals, safety procedures, and dive planning.",
          "In the afternoon, you head to the pool or a shallow, protected bay for your first confined water dives. This is where you practice the core skills: clearing your mask, breathing from a regulator underwater, and hovering neutrally. Most students are surprised by how natural it feels within an hour.",
        ],
      },
      {
        heading: "Days 2–3 — Open Water Dives",
        paragraphs: [
          "The heart of the course is four open water dives in the ocean around Koh Tao. Each dive has specific skills to demonstrate — underwater navigation, buoyancy control, air sharing — but there's also plenty of time to simply explore the reef.",
          "Typical sites for Open Water training dives include Japanese Gardens and Koh Nang Yuan, both of which have stunning coral and marine life even at shallow depths. You'll almost certainly see reef fish, sea turtles, and perhaps a reef shark or stingray.",
          "Each dive lasts 40–50 minutes. Between dives you debrief with your instructor, review what you learned, and prepare for the next dive.",
        ],
      },
      {
        heading: "The Final Day — Skills Assessment and Certification",
        paragraphs: [
          "On the final day, your instructor completes your skills assessment and confirms that you've met all PADI requirements. At Siam Scuba, this often includes an additional fun dive as a reward — exploring a site without any skills to complete, just diving for pleasure.",
          "Your PADI certification card is issued digitally within 24 hours via the PADI app. You are now a certified Open Water Diver for life.",
        ],
      },
      {
        heading: "What to Bring and What to Expect",
        paragraphs: [
          "Siam Scuba provides all equipment — BCD, regulator, wetsuit, mask, fins, tank. You don't need to bring anything except sunscreen (reef-safe please), a swimsuit, and a towel.",
          "You do not need to know how to swim competitively, but you should be comfortable in the water. PADI requires a 10-minute float/swim and 200-metre swim test — your instructor will guide you through this on Day 1.",
          "Most people are surprised by how relaxed the pace is. Koh Tao's warm water (28–30°C year-round), excellent visibility, and friendly marine life make it the ideal place to learn. Our instructors are patient, experienced, and genuinely passionate about sharing the underwater world.",
        ],
      },
    ],
    tags: ["PADI", "Open Water", "Beginner"],
    relatedCourses: ["open-water", "discover-scuba"],
    relatedBlogSlugs: ["padi-vs-ssi-koh-tao", "kokhav-rishon-koh-tao"],
    readingTime: 7,
  },
  {
    slug: "padi-divemaster-koh-tao",
    title: "How to Become a PADI Divemaster on Koh Tao",
    category: "Diving",
    excerpt: "Thinking about turning your passion for diving into a career? Here's everything you need to know about the PADI Divemaster course on Koh Tao.",
    coverImage: "https://images.unsplash.com/photo-1682687218608-5e2522b04673?w=800&q=80",
    date: "2026-03-25",
    sections: [
      {
        heading: "What Is the PADI Divemaster Certification?",
        paragraphs: [
          "The PADI Divemaster (DM) is the first professional-level certification in the PADI system. It qualifies you to lead certified divers on guided dives, assist instructors with dive courses, and work as a professional at dive centres worldwide.",
          "For most people, the Divemaster course is the beginning of a life-changing career — or a gap year that turns into something much longer. Koh Tao is one of the most popular places in the world to complete a Divemaster because of the variety of dive sites, the warm water, and the large dive community.",
        ],
      },
      {
        heading: "Prerequisites for the PADI Divemaster Course",
        paragraphs: [
          "To enrol in a PADI Divemaster course, you need to be a certified PADI Rescue Diver (or equivalent from another agency), have completed Emergency First Response (EFR) training within the last 24 months, have a minimum of 40 logged dives, and be at least 18 years old.",
          "Most students complete Open Water → Advanced → Rescue → Divemaster in sequence over several months. Some people do the entire journey on Koh Tao, spending 2–3 months on the island.",
        ],
      },
      {
        heading: "How Long Does the Divemaster Course Take?",
        paragraphs: [
          "At Siam Scuba, the PADI Divemaster program takes approximately 4 to 8 weeks, depending on your diving experience when you arrive and how many dives you log during the program.",
          "The course involves daily diving — typically 2 dives in the morning and theory or skill practice in the afternoon. By the end you'll have accumulated significant underwater hours, strong buoyancy skills, and hands-on experience assisting with student courses.",
        ],
      },
      {
        heading: "What Does the Divemaster Course Include?",
        paragraphs: [
          "The PADI Divemaster course at Siam Scuba covers: dive theory (physics, physiology, equipment, environment, dive skills and environment), water skills assessments, assisting with Open Water and other courses, supervised dive leading on Koh Tao's most popular sites, emergency scenario training, and dive site mapping.",
          "We include a free internship period where you assist on student courses under close instructor supervision — giving you real professional experience before you qualify.",
        ],
      },
      {
        heading: "Career Opportunities After PADI Divemaster",
        paragraphs: [
          "A PADI Divemaster card opens doors at dive centres across Asia, the Caribbean, the Red Sea, Australia, and beyond. Most entry-level positions offer free accommodation, free diving, and a basic salary or commission structure.",
          "Many Divemasters continue to the PADI Instructor Development Course (IDC) — the next step in the professional pathway. As a PADI 5 Star IDC Centre, Siam Scuba can take you all the way from Divemaster through to PADI Instructor without changing dive centres.",
          "If you're considering a Divemaster course on Koh Tao, reach out to our team — we're happy to discuss your timeline, budget, and diving background to help you plan the best path forward.",
        ],
      },
    ],
    tags: ["PADI", "Divemaster", "Pro"],
    relatedCourses: ["divemaster", "rescue-diver"],
    relatedBlogSlugs: ["padi-vs-ssi-koh-tao", "koh-tao-dive-sites-guide"],
    readingTime: 8,
  },
];

// Prepend diving posts so they appear first (most relevant to the business)
blogPosts.unshift(...divingBlogPosts);
