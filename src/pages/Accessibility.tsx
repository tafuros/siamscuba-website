import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Accessibility statement (הצהרת נגישות) for IL תקנות שוויון זכויות לאנשים עם
 * מוגבלות (התאמות נגישות לשירות), תשע"ג-2013, conforming to IS 5568 / WCAG 2.0 AA.
 * Bilingual via the in-app language context (HE / EN; es+fr fall back to EN).
 */

const COORDINATOR = {
  email: "benmosheavivi@gmail.com",
  phone: "+66-82-506-8898",
};

const Accessibility = () => {
  const { language, isRTL } = useLanguage();
  const he = language === "he";

  const content = he
    ? {
        seoTitle: "הצהרת נגישות | Siam Scuba",
        seoDesc:
          "הצהרת הנגישות של אתר Siam Scuba בהתאם לתקן הישראלי 5568 (WCAG 2.0 AA) ותקנות שוויון זכויות לאנשים עם מוגבלות.",
        orgName: "סיאם סקובה (Siam Scuba)",
        coordinatorName: "בן משה אביבי",
        address: "מעגל השלום 13, ראשון לציון, ישראל",
        lastReviewed: "2 ביוני 2026",
        title: "הצהרת נגישות",
        updated: "עודכן לאחרונה:",
        commitmentH: "המחויבות שלנו",
        commitmentP:
          "רואה חשיבות עליונה בהנגשת שירותיה הדיגיטליים לכלל האנשים, לרבות אנשים עם מוגבלות, מתוך אמונה בזכותו של כל אדם לשוויון, כבוד והשתתפות מלאה. אנו פועלים להנגשת האתר ולשיפורו המתמיד.",
        levelH: "רמת הנגישות באתר",
        levelP: (
          <>
            האתר הונגש בהתאם לתקן הישראלי <strong>ת"י 5568</strong> ברמת התאמה <strong>AA</strong>, המבוסס על הנחיות{" "}
            <strong>WCAG 2.0</strong> של ארגון W3C, ובהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות),
            תשע"ג-2013.
          </>
        ),
        didH: "מה הונגש",
        did: [
          "ניווט מלא באמצעות מקלדת וסימון ברור של הפוקוס.",
          "תאימות לקוראי מסך (תוויות, תפקידים ומבנה כותרות תקין).",
          "ניגודיות צבעים תקינה וטקסט הניתן להגדלה עד 140% ללא אובדן תוכן.",
          "תמיכה מלאה בכיווניות עברית (RTL) ובהעדפת \"צמצום תנועה\" של מערכת ההפעלה.",
          "תפריט נגישות ייעודי (הכפתור בפינת המסך): הגדלת טקסט, ניגודיות גבוהה, הדגשת קישורים ועצירת אנימציות.",
        ],
        limitH: "הסתייגויות ידועות",
        limitP:
          "אנו ממשיכים לשפר את נגישות האתר באופן שוטף. אם נתקלתם ברכיב שאינו נגיש, נשמח שתעדכנו אותנו ונפעל לתקנו בהקדם.",
        contactH: "פנייה בנושאי נגישות",
        contactP: "בכל שאלה, בקשה או דיווח על בעיית נגישות ניתן לפנות אל רכז הנגישות:",
        labelCoordinator: "רכז/ת נגישות:",
        labelEmail: 'דוא"ל:',
        labelPhone: "טלפון:",
        labelAddress: "כתובת:",
      }
    : {
        seoTitle: "Accessibility Statement | Siam Scuba",
        seoDesc:
          "Siam Scuba website accessibility statement, conforming to Israeli Standard IS 5568 (WCAG 2.0 AA).",
        orgName: "Siam Scuba",
        coordinatorName: "Ben Moshe Avivi",
        address: "Ma'agal HaShalom St 13, Rishon LeZion, Israel",
        lastReviewed: "June 2, 2026",
        title: "Accessibility Statement",
        updated: "Last updated:",
        commitmentH: "Our commitment",
        commitmentP:
          "is committed to making its digital services accessible to everyone, including people with disabilities, in the belief that every person has the right to equality, dignity and full participation. We work continuously to improve the accessibility of this site.",
        levelH: "Conformance level",
        levelP: (
          <>
            This site has been made accessible in accordance with <strong>Israeli Standard IS 5568</strong> at
            conformance level <strong>AA</strong>, based on the W3C <strong>WCAG 2.0</strong> guidelines, and in line
            with the Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 2013.
          </>
        ),
        didH: "What has been made accessible",
        did: [
          "Full keyboard navigation with a clear, visible focus indicator.",
          "Screen-reader compatibility (labels, roles and a correct heading structure).",
          "Sufficient colour contrast and text resizable up to 140% without loss of content.",
          'Full RTL/LTR support and respect for the operating system\'s "reduce motion" preference.',
          "A dedicated accessibility menu (the button in the corner): text resize, high contrast, link highlighting and stop animations.",
        ],
        limitH: "Known limitations",
        limitP:
          "We continue to improve the site's accessibility. If you encounter a component that is not accessible, please let us know and we will address it promptly.",
        contactH: "Accessibility contact",
        contactP: "For any question, request or report of an accessibility issue, please contact our accessibility coordinator:",
        labelCoordinator: "Accessibility coordinator:",
        labelEmail: "Email:",
        labelPhone: "Phone:",
        labelAddress: "Address:",
      };

  return (
    <div className="min-h-screen">
      <Seo title={content.seoTitle} description={content.seoDesc} />
      <Navbar />
      <div className="container mx-auto px-4 pt-36 pb-16 max-w-3xl" dir={isRTL ? "rtl" : "ltr"}>
        <article className="text-foreground/80 leading-relaxed">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{content.title}</h1>
          <p className="text-muted-foreground text-sm mb-8">
            {content.updated} {content.lastReviewed}
          </p>

          <section className="mb-7">
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">{content.commitmentH}</h2>
            <p>
              <strong>{content.orgName}</strong> {content.commitmentP}
            </p>
          </section>

          <section className="mb-7">
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">{content.levelH}</h2>
            <p>{content.levelP}</p>
          </section>

          <section className="mb-7">
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">{content.didH}</h2>
            <ul className="list-disc space-y-1 ps-5">
              {content.did.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-7">
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">{content.limitH}</h2>
            <p>{content.limitP}</p>
          </section>

          <section className="mb-7">
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">{content.contactH}</h2>
            <p className="mb-2">{content.contactP}</p>
            <ul className="space-y-1">
              <li>
                <strong>{content.labelCoordinator}</strong> {content.coordinatorName}
              </li>
              <li>
                <strong>{content.labelEmail}</strong>{" "}
                <a className="text-primary underline underline-offset-2" href={`mailto:${COORDINATOR.email}`}>
                  {COORDINATOR.email}
                </a>
              </li>
              <li>
                <strong>{content.labelPhone}</strong>{" "}
                <a className="text-primary underline underline-offset-2" href={`tel:${COORDINATOR.phone}`} dir="ltr">
                  {COORDINATOR.phone}
                </a>
              </li>
              <li>
                <strong>{content.labelAddress}</strong> {content.address}
              </li>
            </ul>
          </section>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default Accessibility;
