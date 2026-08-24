import type { Offer } from "@/lib/landerCopy";

export const WHATSAPP_NUMBER = "66825068898";

/**
 * Languages the wa.me PREFILL supports. Wider than lander `Lang`: French
 * visitors used to be collapsed to English here, which meant Nemo never saw a
 * French phrase and every FR lead routed as English. Prefills carry FR now.
 */
export type PrefillLang = "en" | "es" | "he" | "fr";

// Topics select which prefilled WhatsApp message a CTA carries. They are NOT
// emitted into the message: the [ref:CODE] routing tag this list once appended
// was removed site-wide in 01510da (Ben, 2026-05-31) because the prefill is sent
// by the CUSTOMER, so the tag showed up as log-like junk in their own outgoing
// message. Nemo routes on the SENTENCE instead - see TOPIC_WORDS below.
export type WhatsAppTopic =
  | "general"
  | "dsd"
  | "owd"
  | "aow"
  | "rescue"
  | "dm"
  | "idc"
  | "fun-dive"
  | "koh-tao"
  | "refresher"
  // Legacy entry-gate branches. The gate no longer routes to WhatsApp (it is
  // scuba-only + lander-first since 2026-07-13), but these prefills are still
  // reachable from lander/nav CTAs, so the topics stay.
  | "kp-licensed"
  | "kp-beginner"
  | "similan-safari"
  | "similan-daytrip"
  | "conservation";

// Back-compat alias - callers passing the narrower Offer keep working.
export type WhatsAppOffer = Offer | "general";

/**
 * The one sentence shape every Nemo-bound prefill uses (Ben's template,
 * 2026-08-24). It reads as a normal human sentence, which is the whole point:
 * the ROUTING SIGNAL is the wording itself, so nothing machine-looking (bracket
 * tags, attribution lines) may ever be appended again.
 */
const PREFILL_FRAME: Record<PrefillLang, (topic: string) => string> = {
  en: (topic) => `Hi Nemo, I'm getting in touch about ${topic}. I'd love some more details.`,
  he: (topic) => `היי נמו, אני פונה לגבי ${topic}. אשמח לקבל פרטים נוספים`,
  es: (topic) => `Hola Nemo, me pongo en contacto por ${topic}. Me encantaría recibir más detalles.`,
  fr: (topic) => `Bonjour Nemo, je vous contacte concernant ${topic}. J'aimerais avoir plus de détails.`,
};

/**
 * THE ROUTING TABLE. Nemo matches leads on these words appearing in the
 * customer's message, so they must survive VERBATIM into the sentence above.
 *
 * Two traps, both load-bearing:
 *  - "Advanced Open Water" is tested BEFORE plain "Open Water". Shortening aow
 *    to anything that drops either word (e.g. "Advanced course") silently
 *    re-routes every advanced lead into the Open Water bucket.
 *  - PADI course names stay in Latin script in EVERY language, Hebrew included.
 *    Translating "Rescue Diver" would make that language unroutable.
 *
 * Editing any string here changes lead routing. Coordinate with the Nemo side.
 */
const TOPIC_WORDS: Record<Exclude<WhatsAppTopic, "conservation">, Record<PrefillLang, string>> = {
  general: {
    en: "diving in Koh Tao",
    he: "צלילה בקוטאו",
    es: "buceo en Koh Tao",
    fr: "la plongée à Koh Tao",
  },
  // The /koh-tao-diving lander is the same intent as general, so it carries the
  // same words on purpose - Nemo has one Koh Tao bucket, not two.
  "koh-tao": {
    en: "diving in Koh Tao",
    he: "צלילה בקוטאו",
    es: "buceo en Koh Tao",
    fr: "la plongée à Koh Tao",
  },
  dsd: {
    en: "a Discover Scuba dive",
    he: "צלילת היכרות",
    es: "un bautismo de buceo",
    fr: "un baptême de plongée",
  },
  owd: {
    en: "the Open Water course",
    he: "קורס Open Water",
    es: "el curso Open Water",
    fr: "le cours Open Water",
  },
  aow: {
    en: "the Advanced Open Water course",
    he: "קורס Advanced Open Water",
    es: "el curso Advanced Open Water",
    fr: "le cours Advanced Open Water",
  },
  rescue: {
    en: "the Rescue Diver course",
    he: "קורס Rescue Diver",
    es: "el curso Rescue Diver",
    fr: "le cours Rescue Diver",
  },
  dm: {
    en: "the Divemaster course",
    he: "קורס Divemaster",
    es: "el curso Divemaster",
    fr: "le cours Divemaster",
  },
  idc: {
    en: "the IDC instructor course",
    he: "קורס מדריכים IDC",
    es: "el curso de instructor IDC",
    fr: "le cours d'instructeur IDC",
  },
  "fun-dive": {
    en: "fun diving",
    he: "צלילות כיף",
    es: "buceo recreativo",
    fr: "la plongée loisir",
  },
  refresher: {
    en: "a refresher dive",
    he: "צלילת רענון",
    es: "un repaso",
    fr: "une remise à niveau",
  },
  // Legacy gate branches. Nemo has NO dedicated matcher for these four, so they
  // land in the default bucket - correct for now, but if a Koh Phangan or
  // Similan route is ever added, these are the words it should key on.
  "kp-licensed": {
    en: "diving in Koh Phangan - Sail Rock and the local reefs",
    he: "צלילה בקו פנגן - Sail Rock והשוניות המקומיות",
    es: "buceo en Koh Phangan - Sail Rock y los arrecifes",
    fr: "la plongée à Koh Phangan - Sail Rock et les récifs",
  },
  "kp-beginner": {
    en: "learning to dive in Koh Phangan",
    he: "התחלת צלילה בקו פנגן",
    es: "aprender a bucear en Koh Phangan",
    fr: "l'apprentissage de la plongée à Koh Phangan",
  },
  "similan-safari": {
    en: "a Similan Islands liveaboard safari",
    he: "ספארי לייב-אבורד לאיי סימילן",
    es: "un safari liveaboard a las Islas Similan",
    fr: "une croisière plongée aux îles Similan",
  },
  "similan-daytrip": {
    en: "Similan Islands day trips",
    he: "צלילות יומיות באיי סימילן",
    es: "salidas de día a las Islas Similan",
    fr: "des sorties à la journée aux îles Similan",
  },
};

/**
 * Conservation is deliberately NOT in the frame above. These enquiries go to
 * Paul's personal phone, not the shop line, so Nemo never sees them - greeting
 * a human by the bot's name would be plain wrong. Keep this wording human.
 */
const CONSERVATION_MESSAGES: Record<PrefillLang, string> = {
  en: "Hi! I found the conservation page on siamscuba.com - I'd like to know more about the conservation courses.",
  es: "¡Hola! He visto la página de conservación en siamscuba.com y me gustaría saber más sobre los cursos de conservación.",
  he: "היי! ראיתי את עמוד השימור הימי באתר siamscuba.com ואשמח לשמוע עוד על קורסי השימור.",
  fr: "Bonjour ! J'ai vu la page conservation sur siamscuba.com - j'aimerais en savoir plus sur les cours de conservation.",
};

const PATH_TO_TOPIC: { test: RegExp; topic: WhatsAppTopic }[] = [
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?open-water(-course)?(\/|$)/i, topic: "owd" },
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?advanced-open-water(\/|$)/i, topic: "aow" },
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?rescue-diver(\/|$)/i, topic: "rescue" },
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?divemaster(\/|$)/i, topic: "dm" },
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?idc(\/|$)/i, topic: "idc" },
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?discover-scuba(-diving)?(\/|$)/i, topic: "dsd" },
  { test: /^\/(en\/|es\/|he\/)?(courses\/)?scuba-review(\/|$)/i, topic: "refresher" },
  { test: /^\/(en\/|es\/|he\/|fr\/)?fun-dives?(\/|$)/i, topic: "fun-dive" },
  { test: /^\/(en\/|es\/|he\/)?koh-tao-diving(\/|$)/i, topic: "koh-tao" },
  { test: /^\/(en\/|es\/|he\/|fr\/)?conservation(\/|$)/i, topic: "conservation" },
];

export function topicFromPath(pathname: string): WhatsAppTopic {
  for (const { test, topic } of PATH_TO_TOPIC) {
    if (test.test(pathname)) return topic;
  }
  return "general";
}

export interface WhatsAppLinkOpts {
  /** Explicit topic. Overrides pathname-derived topic. */
  topic?: WhatsAppTopic;
  /** Legacy alias for topic, kept for callers that pass Offer values. */
  offer?: WhatsAppTopic;
  /** Pathname to derive topic from (used by global buttons). */
  pathname?: string;
  lang?: PrefillLang;
  /**
   * Send this conversation to a number OTHER than the shop line. Digits only,
   * country code first, no "+". Only pass this where a specific person owns the
   * enquiry end to end - see CONSERVATION_WHATSAPP_NUMBER. Everything else must
   * keep the default so it lands in the shop's shared inbox.
   */
  number?: string;
  /**
   * Name a specific conservation specialty in the prefill. Ignored unless the
   * resolved topic is "conservation" - it is not a general-purpose text
   * override, and the curated prefills stay curated.
   */
  courseName?: string;
}

/**
 * Paul's direct line. Conservation enquiries go to him rather than the shop
 * inbox: he owns the conservation programme and wrote the page's content
 * (Ben, 2026-08-07). A UK number, so it is deliberately NOT the +66 shop line.
 */
export const CONSERVATION_WHATSAPP_NUMBER = "447467160704";

/**
 * Per-course conservation enquiry, used by the specialty cards on
 * /conservation.
 *
 * These seven courses are NOT in the DiveOS catalogue - no product code, no
 * published price - so they cannot be booked through the wizard at all. The
 * enquiry IS the funnel, which is why the prefill names the course: it lands on
 * Paul's personal phone and he needs to know which one at a glance.
 *
 * The course name stays in English in every language. It is the certification's
 * registered name and what the card in the diver's hand will say - the same
 * rule conservationCopy.ts follows for the headings.
 */
const CONSERVATION_COURSE_MESSAGES: Record<PrefillLang, (course: string) => string> = {
  en: (c) =>
    `Hi! I found the conservation page on siamscuba.com - I'd like to know more about the ${c} course: price, dates and what it involves.`,
  es: (c) =>
    `¡Hola! He visto la página de conservación en siamscuba.com y me gustaría saber más sobre el curso ${c}: precio, fechas y en qué consiste.`,
  he: (c) =>
    `היי! ראיתי את עמוד השימור הימי באתר siamscuba.com ואשמח לשמוע עוד על הקורס ${c} - מחיר, תאריכים ומה הוא כולל.`,
  fr: (c) =>
    `Bonjour ! J'ai vu la page conservation sur siamscuba.com - j'aimerais en savoir plus sur le cours ${c} : prix, dates et ce qu'il comprend.`,
};

export function normalizeLang(lang: string | undefined): PrefillLang {
  if (lang === "es" || lang === "he" || lang === "fr") return lang;
  return "en";
}

export function buildWhatsAppLink(opts: WhatsAppLinkOpts = {}): string {
  const { topic, offer, pathname, lang = "en", number, courseName } = opts;
  const resolvedTopic: WhatsAppTopic =
    topic ?? offer ?? (pathname ? topicFromPath(pathname) : "general");
  // Ben, 2026-08-15: EVERY WhatsApp destination on the conservation pages goes
  // to Paul, not the shop inbox - he owns that programme end to end. Deciding
  // it from the topic (rather than at each call site) is what makes that true
  // for the global Navbar and floating buttons too: they derive their topic
  // from the pathname and never knew about Paul. An explicit `number` still
  // wins, so nothing that already passes one changes behaviour.
  const resolvedNumber =
    number ?? (resolvedTopic === "conservation" ? CONSERVATION_WHATSAPP_NUMBER : WHATSAPP_NUMBER);
  if (resolvedTopic === "conservation" && courseName) {
    const msg = CONSERVATION_COURSE_MESSAGES[lang](courseName);
    return `https://wa.me/${resolvedNumber}?text=${encodeURIComponent(msg)}`;
  }
  if (resolvedTopic === "conservation") {
    return `https://wa.me/${resolvedNumber}?text=${encodeURIComponent(CONSERVATION_MESSAGES[lang])}`;
  }
  // Human sentence only - no tag, no attribution line. The topic words inside
  // it ARE the routing signal Nemo reads; see TOPIC_WORDS.
  const text = PREFILL_FRAME[lang](TOPIC_WORDS[resolvedTopic][lang]);
  return `https://wa.me/${resolvedNumber}?text=${encodeURIComponent(text)}`;
}
