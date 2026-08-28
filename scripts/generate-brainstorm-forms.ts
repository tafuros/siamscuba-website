/**
 * Generate 3 brainstorm triage-forms (DSD/OWD/Fun) for the 2026-W22 launch.
 *
 * Uses the global triage-form skill template at:
 *   ~/.claude/skills/triage-form/assets/template.html
 *
 * Output: docs/screenshots/campaign-{dsd,owd,fun}-creative-brief-triage.html
 * Run:    bun run scripts/generate-brainstorm-forms.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const TEMPLATE_PATH = join(homedir(), ".claude/skills/triage-form/assets/template.html");
const OUT_DIR = join(import.meta.dir, "..", "docs", "screenshots");

const template = readFileSync(TEMPLATE_PATH, "utf8");

type Option = {
  value: string;
  label: string;
  recommended?: boolean;
  tag?: string;
  tagClass?: "warn";
};

type Question = {
  id: string;
  title: string;
  description?: string;
  type?: "single" | "multi";
  options: Option[];
  note?: boolean;
  notePlaceholder?: string;
};

type Config = {
  title: string;
  subtitle: string;
  context?: string;
  outro?: string;
  questions: Question[];
};

type Campaign = "DSD" | "OWD" | "Fun";

// Recommended defaults per campaign - tuned to each audience.
const RECS: Record<Campaign, Record<string, string[]>> = {
  DSD: {
    tone:        ["casual-fun"],
    hero:        ["first-breath"],
    shortlist:   ["instructor-action", "trainees-underwater", "gear-closeup", "customer-smile", "boats"],
    source:      ["library", "ai-imagen"],
    video:       ["short-loop"],
    "video-dir": ["instructor-talking", "boat-boarding"],
    logo:        ["square", "wide"],
    urgency:     ["book-today-dive-tomorrow"],
    locale:      ["same-image-overlay"],
  },
  OWD: {
    tone:        ["expert-safety"],
    hero:        ["instructor-closeup"],
    shortlist:   ["instructor-action", "trainees-underwater", "boats", "gear-closeup", "customer-smile", "reef-life"],
    source:      ["library", "padi-partner"],
    video:       ["story-15-30"],
    "video-dir": ["instructor-talking", "underwater-action", "customer-testimonial"],
    logo:        ["square", "wide"],
    urgency:     ["book-today-dive-tomorrow"],
    locale:      ["same-image-overlay"],
  },
  Fun: {
    tone:        ["adventure-thrill"],
    hero:        ["underwater-wide"],
    shortlist:   ["sail-rock", "chumphon", "twins", "whale-shark", "reef-life", "boats"],
    source:      ["library", "ai-imagen"],
    video:       ["short-loop"],
    "video-dir": ["underwater-action", "drone-establishing"],
    logo:        ["square", "wide"],
    urgency:     ["season-driven"],
    locale:      ["same-image-overlay"],
  },
};

const META: Record<Campaign, { slug: string; nameHe: string; lander: string; price: string; hookHe: string }> = {
  DSD: {
    slug: "dsd",
    nameHe: "צלילת היכרות (DSD)",
    lander: "/discover-scuba-diving + /es/ + /he/",
    price: "2,600 THB ל-1 צלילה / 3,600 THB ל-2",
    hookHe: "ללא ניסיון צלילה - יום שלם עם מדריך PADI, מים רדודים ו-1-2 צלילות בים. הקהל = תייר ראשון, רגשי, מחפש 'חוויה'.",
  },
  OWD: {
    slug: "owd",
    nameHe: "קורס Open Water (OWD)",
    lander: "/open-water-course + /es/ + /he/",
    price: "11,000 THB - 4 ימי קורס",
    hookHe: "הסמכה בינלאומית ב-4 ימים. הקהל = מטייל מתוכנן, יותר committed, רוצה לראות מקצועיות + ביטחון. PADI 5-star IDC.",
  },
  Fun: {
    slug: "fun",
    nameHe: "Fun Dive (צוללים מוסמכים)",
    lander: "/fun-dives + /es/ + /he/",
    price: "1,800 THB (2-tank) | 3,800 THB (סייל רוק יום שלם)",
    hookHe: "צוללים מוסמכים שכבר יודעים מה הם רוצים: אתרים, כריש לוויתן, סירה איכותית. הוויזואל צריך לעשות WOW.",
  },
};

function withRec(campaign: Campaign, qid: string, opts: Omit<Option, "recommended">[]): Option[] {
  const recs = RECS[campaign][qid] || [];
  return opts.map((o) => (recs.includes(o.value) ? { ...o, recommended: true, tag: "מומלץ" } : o));
}

function buildConfig(campaign: Campaign): Config {
  const m = META[campaign];
  return {
    title: `תכנון קמפיין ${m.nameHe} - תכנים ויזואליים`,
    subtitle: "סיעור מוחות לפני העלאה ל-Google Ads: לוגו, תמונות, וידאו, וטון",
    context:
      `<strong>${m.nameHe}</strong> · תקציב 500 THB/יום × 7 ימים · ` +
      `לאנדרים: <code>${m.lander}</code> · מחיר: ${m.price}<br />` +
      `<em>${m.hookHe}</em>`,
    outro:
      "אחרי שתסיים את שלושת הטפסים, הדבק את הפלט בצ'אט. אני אבנה רשימת קניות של נכסים (תמונות / וידאו / לוגו) ואז נמשיך ל-Playwright upload לקמפיינים.",
    questions: [
      {
        id: "tone",
        title: "טון ומיצוב",
        description: "איזו הרגשה הקמפיין צריך לשדר? משפיע על בחירת תמונות, גוון צבעים, ועל ה-RSA שיוצג עם התמונה.",
        type: "single",
        options: withRec(campaign, "tone", [
          { value: "casual-fun",       label: "כיפי וחברתי - 'בוא תיהנה'" },
          { value: "expert-safety",    label: "מקצועי ובטוח - 'מדריך PADI, IDC center'" },
          { value: "budget-led",       label: "מבוסס מחיר - 'הכי משתלם בקוטאו'" },
          { value: "adventure-thrill", label: "הרפתקני - 'תראה דברים שלא ראית'" },
          { value: "premium-personal", label: "פרימיום אישי - 'קבוצות קטנות, יחס VIP'" },
        ]),
      },
      {
        id: "hero",
        title: "כיוון התמונה הראשית (Hero Image)",
        description: "התמונה שתופיע ב-Image Asset הראשי ובכל הלאנדרים. צריך להחליט על סוג אחד.",
        type: "single",
        options: withRec(campaign, "hero", [
          { value: "instructor-closeup", label: "מדריך פנים מקרוב - אמינות וקשר עין" },
          { value: "first-breath",       label: "רגע הנשימה הראשונה - תלמיד מופתע / שמח" },
          { value: "underwater-wide",    label: "צילום תת-מימי רחב - שונית, שמש, צבעים" },
          { value: "boat-deck",          label: "סגנון חיים על הסיפון - חברה צוחקת" },
          { value: "reef-marine-life",   label: "חיי שונית / כריש לוויתן / צב" },
        ]),
      },
      {
        id: "shortlist",
        title: "Image shortlist - אילו 5+ תמונות אנחנו צריכים?",
        description: "סמן כל מה שצריך לקמפיין. Google מבקש 5+ תמונות נכסים (1200×628 / 1200×1200) - נחתוך מאוחר יותר ל-5 הסופיות.",
        type: "multi",
        options: withRec(campaign, "shortlist", [
          { value: "boats",                label: "הסירות שלנו (deck shot, פנים, רחב)" },
          { value: "instructor-action",    label: "מדריך בפעולה (מסביר, מצביע, מחייך)" },
          { value: "trainees-underwater",  label: "תלמידים במים (mask clearing, regulator practice)" },
          { value: "gear-closeup",         label: "ציוד מקרוב (מסכה, BCD, רגולטור, סנפירים)" },
          { value: "sail-rock",            label: "סייל רוק - הסלע מבחוץ / מבפנים" },
          { value: "chumphon",             label: "Chumphon Pinnacle - schooling fish, סלעים" },
          { value: "twins",                label: "The Twins - מערכת הסלעים הכפולה" },
          { value: "reef-life",            label: "חיי שונית כלליים - דגים, אלמוגים" },
          { value: "whale-shark",          label: "כריש לוויתן - תמונה חזקה לעונת מרץ-מאי" },
          { value: "customer-smile",       label: "תייר מחייך אחרי צלילה - testimonial-style" },
        ]),
      },
      {
        id: "source",
        title: "מקור התמונות",
        description: "מאיפה נשיג את התמונות שסימנת? סמן את כל המקורות הרלוונטיים.",
        type: "multi",
        options: withRec(campaign, "source", [
          { value: "library",        label: "מהמאגר הקיים שלנו (Lightroom / Google Photos / Drive)" },
          { value: "new-shoot",      label: "צילום חדש - צריך להזמין צלם / לצלם בעצמנו" },
          { value: "ai-imagen",      label: "AI - Imagen / Gemini / Nano Banana (gen-hero-extension.sh)" },
          { value: "pexels-unsplash", label: "Pexels / Unsplash - תמונות סטוק חינמיות" },
          { value: "padi-partner",   label: "PADI / מדריך / Pro - חומר שותפים" },
        ]),
      },
      {
        id: "video",
        title: "האם לכלול וידאו?",
        description: "Google Ads ב-Search לא דורש וידאו, אבל וידאו מעלה ביצועים ומאפשר PMax בעתיד.",
        type: "single",
        options: withRec(campaign, "video", [
          { value: "story-15-30",  label: "כן - וידאו 15-30 שניות (story format)" },
          { value: "short-loop",   label: "כן - לופ קצר 6-10 שניות (hero loop)" },
          { value: "not-week-1",   label: "לא ב-week-1 - מתחילים רק עם תמונות" },
          { value: "decide-day-3", label: "להחליט ב-day 3 על סמך ביצועים" },
        ]),
      },
      {
        id: "video-dir",
        title: "כיוון הוידאו (אם בחרת לכלול)",
        description: "אם סימנת 'כן' ב-Q5, מה סוג התוכן? אפשר לבחור כמה.",
        type: "multi",
        options: withRec(campaign, "video-dir", [
          { value: "instructor-talking",  label: "מדריך מדבר למצלמה (אמינות, talking head)" },
          { value: "underwater-action",   label: "אקשן תת-מימי (צלילה, schooling fish, drama)" },
          { value: "boat-boarding",       label: "עלייה לסירה, יציאה לים (lifestyle)" },
          { value: "customer-testimonial", label: "תייר מספר על החוויה (UGC style)" },
          { value: "drone-establishing",  label: "צילום רחפן - establishing shot של קוטאו / סייל רוק" },
        ]),
      },
      {
        id: "logo",
        title: "וריאנטים של לוגו שיש לנו (או צריך)",
        description: "Google Ads דורש לוגו ב-2 פורמטים: ריבוע 1:1 (1200×1200 מינ') ורחב 4:1 (1200×300 מינ'). סמן מה מוכן.",
        type: "multi",
        options: withRec(campaign, "logo", [
          { value: "square",    label: "ריבוע 1:1 (1200×1200) - מוכן" },
          { value: "wide",      label: "רחב 4:1 (1200×300) - מוכן" },
          { value: "need-design", label: "אין לוגו תקני - צריך עיצוב חדש", tag: "חוסר", tagClass: "warn" },
        ]),
      },
      {
        id: "urgency",
        title: "Urgency hook - האם דחיפות בקמפיין?",
        description: "Promo / לחץ לפעולה. אופציונלי ב-week-1, אבל מעלה CTR.",
        type: "single",
        options: withRec(campaign, "urgency", [
          { value: "percent-discount",         label: "% הנחה ל-7 ימי קמפיין (למשל 'חסוך 15% השבוע')" },
          { value: "book-today-dive-tomorrow", label: "'הזמן היום, צלול מחר' - כבר ב-copy שלנו" },
          { value: "season-driven",            label: "מבוסס עונה - 'עונת כריש לוויתן 2026'" },
          { value: "no-urgency",               label: "אין urgency hook - רק value prop" },
        ]),
      },
      {
        id: "locale",
        title: "אסטרטגיית לוקליזציה (EN / ES / HE)",
        description: "אותה תמונה ל-3 השפות, או תמונה שונה לכל אחת?",
        type: "single",
        options: withRec(campaign, "locale", [
          { value: "same-image-overlay", label: "אותה תמונה + טקסט מקומי בכותרת/תיאור (זול, מהיר)" },
          { value: "different-per-lang", label: "תמונה שונה לכל שפה (יקר יותר, יותר מותאם)" },
          { value: "text-first",         label: "טקסט בלבד עכשיו, תמונה אחר כך (week-2)" },
        ]),
      },
    ],
  };
}

function escapeForScript(json: string): string {
  // Avoid breaking the embedding <script type="application/json"> block.
  return json.replace(/<\/script/g, "<\\/script");
}

function buildHtml(campaign: Campaign): string {
  const config = buildConfig(campaign);
  return template
    .replace(/__LANG__/g, "he")
    .replace(/__DIR__/g, "rtl")
    .replace(/__TITLE__/g, config.title)
    .replace("__CONFIG_JSON__", escapeForScript(JSON.stringify(config, null, 2)));
}

for (const campaign of ["DSD", "OWD", "Fun"] as Campaign[]) {
  const slug = META[campaign].slug;
  const outPath = join(OUT_DIR, `campaign-${slug}-creative-brief-triage.html`);
  writeFileSync(outPath, buildHtml(campaign), "utf8");
  console.log(`wrote ${outPath}`);
}
