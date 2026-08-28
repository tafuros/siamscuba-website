/**
 * Generate a campaign-creation wizard form.
 *
 * Each invocation emits a self-contained HTML wizard at
 *   docs/screenshots/<slug>-campaign-wizard.html
 * and opens it in Chrome. Ben fills it, clicks "Generate brief", pastes back
 * the output. Claude then executes:
 *   - Library items: ask Ben for file paths
 *   - "יוצא לצלם": document the shoot list, wait
 *   - "צור עם AI": run the matching gen script, present results, await approval
 *
 * Usage:
 *   bun run scripts/generate-campaign-wizard.ts <slug> [campaign-name ...]
 *
 * Examples:
 *   bun run scripts/generate-campaign-wizard.ts 2026-w22-assets \
 *     SiamScuba_Search_DSD SiamScuba_Search_OWD SiamScuba_Search_FunDive
 *
 *   bun run scripts/generate-campaign-wizard.ts whaleshark-2026-q1 \
 *     SiamScuba_Search_FunDive
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const TEMPLATE_PATH = join(homedir(), ".claude/skills/triage-form/assets/template.html");
const OUT_DIR = join(import.meta.dir, "..", "docs", "screenshots");

const args = process.argv.slice(2);
const slug = args[0];
const targetCampaigns = args.slice(1);

if (!slug) {
  console.error("Usage: bun run scripts/generate-campaign-wizard.ts <slug> [campaign-name ...]");
  process.exit(1);
}

const template = readFileSync(TEMPLATE_PATH, "utf8");

// Asset source options - reused per asset slot.
const sourceOptions = (recommended?: string) => [
  { value: "library",  label: "מהמאגר שלי (Lightroom / Drive / Google Photos)" },
  { value: "shoot",    label: "<strong>יוצא לצלם</strong> - תבנה הכל וחכה לקבצים ממני", tag: "shoot", tagClass: "warn" },
  { value: "ai-gemini", label: "צור עם AI - Gemini / Nano Banana (Imagen) - לתמונות photo-realistic" },
  { value: "ai-flux",   label: "צור עם AI - fal.ai FLUX - לתמונות מעוצבות / סגנון אמנותי" },
  { value: "ai-video",  label: "צור עם AI - fal.ai Veo3 / Kling - לוידאו (יקר, רק כשמוצדק)", tag: "AI video", tagClass: "warn" },
  { value: "pexels",   label: "Pexels / Unsplash - סטוק חינמי (פחות מומלץ - נראה גנרי)" },
  { value: "skip",     label: "לא דרוש לקמפיין הזה" },
].map((o) => o.value === recommended ? { ...o, recommended: true, tag: o.tag || "מומלץ", tagClass: o.tagClass } : o);

const targetsContextLine = targetCampaigns.length
  ? `קמפיינים יעד: <code>${targetCampaigns.join("</code>, <code>")}</code>`
  : `קמפיין חדש (הגדר בשאלה 1)`;

const config = {
  title: `Campaign Wizard - ${slug}`,
  subtitle: "מה אנחנו צריכים בשביל הקמפיין הזה? לוגו, תמונות, וידאו, תקציב, קהל. סמן ולחץ Generate brief.",
  context:
    `<strong>${targetsContextLine}</strong><br />` +
    `אחרי שתסיים: לחץ Generate brief → Copy → הדבק בצ'אט. אני ארץ את העלאת הנכסים / יצירת ה-AI / המתנה לצילום בהתאם לבחירות שלך.`,
  outro:
    "Workflow לאחר: items 'מהמאגר' = אבקש ממך path, 'יוצא לצלם' = אבנה הכל וממתין, 'צור עם AI' = ארץ את הגנרציה ואציג לאישור.",
  questions: [
    {
      id: "scope",
      title: "סוג הבקשה",
      description: "האם זה קמפיין חדש או הוספת נכסים לקמפיין/ים קיימים?",
      type: "single",
      options: [
        { value: "new",     label: "<strong>קמפיין חדש</strong> - לבנות מאפס + להוסיף נכסים", recommended: !targetCampaigns.length, tag: !targetCampaigns.length ? "מומלץ" : undefined },
        { value: "assets",  label: "<strong>הוסף נכסים לקמפיין קיים</strong> - לוגו/תמונות/וידאו לקמפיינים שכבר חיים", recommended: !!targetCampaigns.length, tag: targetCampaigns.length ? "מומלץ" : undefined },
        { value: "edit",    label: "עריכת קמפיין קיים - שנה keywords/RSAs/budget/copy (לא נכסים)" },
      ],
    },
    {
      id: "basics",
      title: "פרטי קמפיין (רק אם 'חדש')",
      description: "השאר ריק אם בחרת בשאלה 1 'הוסף נכסים לקיים'.",
      subquestions: [
        {
          id: "basics_type",
          label: "סוג קמפיין",
          type: "single",
          options: [
            { value: "search",   label: "Search (טקסט בלבד + RSAs)", recommended: true, tag: "מומלץ" },
            { value: "pmax",     label: "Performance Max (דורש 5+ תמונות + לוגו)" },
            { value: "display",  label: "Display (banners)" },
            { value: "video",    label: "Video / YouTube" },
            { value: "demand",   label: "Demand Gen" },
          ],
        },
        {
          id: "basics_langs",
          label: "שפות (multi)",
          type: "multi",
          options: [
            { value: "en", label: "EN - אנגלית" },
            { value: "es", label: "ES - ספרדית" },
            { value: "he", label: "HE - עברית" },
            { value: "th", label: "TH - תאית" },
            { value: "fr", label: "FR - צרפתית" },
            { value: "de", label: "DE - גרמנית" },
          ],
        },
      ],
      notePlaceholder: "שם קמפיין מוצע + final URL + audience + insights",
    },
    {
      id: "budget",
      title: "תקציב יומי (THB)",
      description: "תקציב לכל קמפיין/שפה. נוכל לשנות בכל עת דרך scripts/sync-budgets.ts.",
      type: "single",
      options: [
        { value: "50",   label: "50 THB/day - דרישת מינימום בדיקה" },
        { value: "129",  label: "129 THB/day - test budget נוכחי", recommended: true, tag: "נוכחי" },
        { value: "200",  label: "200 THB/day - בינוני" },
        { value: "500",  label: "500 THB/day - תוקפני (התכנון המקורי)" },
        { value: "1000", label: "1,000 THB/day - גדול" },
        { value: "custom", label: "אחר - אכתוב בהערה" },
      ],
      notePlaceholder: "אם 'אחר' - כתוב את הסכום + הסבר",
    },
    {
      id: "asset_logo",
      title: "לוגו (1:1 + 4:1)",
      description: "Google Ads דורש לוגו ריבוע 1200x1200 + לוגו רחב 1200x300. תאריך תוקף סופי.",
      type: "single",
      options: sourceOptions("library"),
      notePlaceholder: "אם 'library' - איפה הקבצים? אם 'AI' - תיאור עיצובי לתת ל-AI? אם 'יוצא לצלם' - גרסת לוגו לעצב עם מי?",
    },
    {
      id: "asset_hero",
      title: "תמונת Hero (1.91:1, 1200x628)",
      description: "התמונה הראשית שמופיעה כ-Image Asset של הקמפיין. כיוון: לפי ה-Hero direction שסימנו בbrief המקורי.",
      type: "single",
      options: sourceOptions("library"),
      notePlaceholder: "תיאור התמונה הרצויה - subject, mood, location",
    },
    {
      id: "asset_square",
      title: "תמונה ריבוע (1:1, 1200x1200)",
      description: "וריאנט ריבוע של ה-hero או תמונה שונה - לפלייסמנטים מובייל ו-square.",
      type: "single",
      options: sourceOptions("library"),
      notePlaceholder: "אם נפרד מה-hero - תיאור התמונה",
    },
    {
      id: "asset_extensions",
      title: "Image extensions (5+ תמונות landscape)",
      description: "Google מבקש 5+ תמונות נכסים. בדרך כלל ערבוב של מקורות - חלק library + חלק AI + חלק shoot.",
      type: "multi",
      options: [
        { value: "library-5plus", label: "<strong>library</strong> - יש לי 5+ תמונות מהמאגר, אשלח שמות קבצים" },
        { value: "shoot-partial", label: "<strong>יוצא לצלם</strong> את החסר - אספק את הקיים, את החסר אצלם" },
        { value: "ai-fill",       label: "AI ימלא את החסר (Gemini/FLUX)" },
        { value: "stock-pexels",  label: "Pexels בלבד למה שאין לי" },
      ],
      notePlaceholder: "פירוט: איזה sites/scenes יש לי, איזה צריך לצלם, איזה AI?",
    },
    {
      id: "asset_video",
      title: "וידאו",
      description: "אופציונלי ל-Search, מומלץ ל-PMax/Video campaigns. אם 'AI video' - יקר (~$0.50-$2 לקליפ של 5-10s).",
      type: "single",
      options: sourceOptions("skip"),
      notePlaceholder: "אם וידאו - אורך, סגנון (talking head / underwater action / drone / testimonial), tone",
    },
    {
      id: "schedule",
      title: "תזמון",
      description: "מתי הקמפיין צריך להיות LIVE? אילולי הגעת לדדליין אנחנו לא מורידים את ה-paused.",
      type: "single",
      options: [
        { value: "asap",     label: "ASAP - ברגע שהנכסים מוכנים" },
        { value: "this-week", label: "השבוע" },
        { value: "next-week", label: "שבוע הבא" },
        { value: "season",   label: "בכפוף לעונה (whale shark, חגים, יום שני וכו')", tag: "specify", tagClass: "warn" },
        { value: "draft",    label: "טיוטה בלבד - לא להפעיל כעת", recommended: true, tag: "מומלץ ברוב המקרים", tagClass: "warn" },
      ],
      notePlaceholder: "תאריך/אירוע ספציפי",
    },
    {
      id: "approvals",
      title: "מה צריך אישור שלך לפני העלאה?",
      description: "ברירת מחדל: כל פריט AI שאני מייצר מוצג לך לפני שהוא מועלה. אבל אם רוצה אישור על עוד דברים סמן.",
      type: "multi",
      options: [
        { value: "approve-ai", label: "כל פריט AI - תמונה/וידאו לפני העלאה", recommended: true, tag: "ברירת מחדל" },
        { value: "approve-text", label: "כל שינוי טקסט (RSAs/headlines/descriptions) לפני שמירה" },
        { value: "approve-budget", label: "כל שינוי תקציב (מעל ערך X)" },
        { value: "approve-targeting", label: "שינויי targeting/geo/audience" },
        { value: "approve-go-live", label: "<strong>הפעלת הקמפיין מ-paused ל-enabled</strong>", recommended: true, tag: "חובה" },
      ],
      notePlaceholder: "אם אישור תקציב - מעל איזה ערך?",
    },
  ],
};

function escapeForScript(json: string): string {
  return json.replace(/<\/script/g, "<\\/script");
}

const html = template
  .replace(/__LANG__/g, "he")
  .replace(/__DIR__/g, "rtl")
  .replace(/__TITLE__/g, config.title)
  .replace("__CONFIG_JSON__", escapeForScript(JSON.stringify(config, null, 2)));

const outPath = join(OUT_DIR, `${slug}-campaign-wizard.html`);
writeFileSync(outPath, html, "utf8");
console.log(`wrote ${outPath}`);

// Auto-open in Chrome.
Bun.spawn(["open", "-a", "Google Chrome", `file://${outPath}`], { stdout: "ignore", stderr: "ignore" });
console.log(`opened in Chrome`);
