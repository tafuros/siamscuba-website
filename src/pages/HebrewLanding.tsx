import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, ArrowLeft } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackWhatsAppClick } from "@/utils/tracking";
import { buildWhatsAppLink } from "@/utils/whatsapp";

const HEBREW_WHATSAPP_HREF = buildWhatsAppLink({ offer: "general", lang: "he" });

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "צלילה בקוטאו - המדריך הישראלי השלם 2026",
  description:
    "המדריך השלם לצלילה בקוטאו לישראלים - מחירי קורסי PADI, תקציב לטיול, עונות הצלילה, ולמה ב-Siam Scuba העלות שקופה ויחס המדריך 1:4.",
  inLanguage: "he",
  datePublished: "2026-05-10T00:00:00+07:00",
  dateModified: "2026-05-10T00:00:00+07:00",
  author: { "@type": "Organization", name: "Siam Scuba" },
  publisher: {
    "@type": "Organization",
    name: "Siam Scuba",
    logo: { "@type": "ImageObject", url: "https://siamscuba.com/favicon.png" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://siamscuba.com/he" },
};

const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-24 mb-12">
    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">{title}</h2>
    <div className="space-y-3 text-foreground/85 leading-relaxed">{children}</div>
  </section>
);

const HebrewLanding = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background" dir="rtl" lang="he">
      <Seo
        title="צלילה בקוטאו | המדריך הישראלי המלא לקורסי PADI ב-Siam Scuba"
        description="מדריך הצלילה הישראלי לקוטאו - מחירי קורסי PADI מ-2,600 בת, יחס מדריך 1:4, ללא דמי קדימה, סירות צלילה פרטיות. ספרי PADI גם בעברית."
        ogType="article"
        jsonLd={articleSchema}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "צלילה בקוטאו" },
        ]}
      />
      <Navbar />

      <main className="pt-28 pb-16">
        {/* Hero */}
        <div className="relative overflow-hidden bg-ocean-deep">
          <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-accent text-accent-foreground mb-4">בעברית</Badge>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground leading-tight">
                צלילה בקוטאו - המדריך הישראלי המלא
              </h1>
              <p className="mt-4 text-primary-foreground/80 text-lg max-w-3xl mx-auto">
                המחירים האמיתיים, הקורסים הזמינים, התקציב המלא לטיול, ולמה Siam Scuba הוא מרכז הצלילה
                שאתם מחפשים. הכל בעברית, בלי שמאלי, בלי הפתעות.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                  <a
                    href={HEBREW_WHATSAPP_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick({ location: "hebrew_landing_hero", url: HEBREW_WHATSAPP_HREF })}
                  >
                    <MessageCircle className="h-5 w-5" />
                    דברו איתנו בוואטסאפ
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                  <a href="#mehirim">לחצו לראות מחירים</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Body */}
        <article className="container mx-auto px-4 max-w-3xl mt-12">
          {/* Mini ToC */}
          <nav aria-label="תוכן עניינים" className="mb-10 p-4 rounded-2xl bg-secondary/40">
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
              במדריך הזה
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
              <li><a href="#why-koh-tao" className="text-primary hover:underline">למה דווקא קוטאו?</a></li>
              <li><a href="#mehirim" className="text-primary hover:underline">מחירי הקורסים 2026</a></li>
              <li><a href="#takziv" className="text-primary hover:underline">תקציב לטיול</a></li>
              <li><a href="#living-costs" className="text-primary hover:underline">עלויות חיים בקוטאו</a></li>
              <li><a href="#season" className="text-primary hover:underline">העונה הטובה ביותר</a></li>
              <li><a href="#hidden-costs" className="text-primary hover:underline">עלויות נסתרות שכדאי לדעת</a></li>
              <li><a href="#why-us" className="text-primary hover:underline">למה Siam Scuba?</a></li>
              <li><a href="#booking" className="text-primary hover:underline">איך מזמינים</a></li>
            </ul>
          </nav>

          <Section id="why-koh-tao" title="למה דווקא קוטאו?">
            <p>
              קוטאו (Koh Tao) הוא אי קטן בים תאילנד שמוציא יותר תעודות PADI Open Water בכל שנה מכל מקום אחר
              בעולם. אם אתם ישראלים שמחפשים איפה לעשות כוכב ראשון או כוכב שני - יש סיכוי גבוה שכבר שמעתם על
              קוטאו ממישהו שחזר משם.
            </p>
            <p>
              שלוש סיבות עיקריות שהופכות את קוטאו לבחירה הטובה ביותר עבור צוללנים ישראלים:
            </p>
            <p>
              <strong>1. המחיר.</strong> קורס PADI Open Water אצלנו עולה 11,000 בת (כ-1,150 שקל). אותו קורס בקריביים
              עולה 600-900 דולר. באוסטרליה - 700+ דולר אוסטרלי. במצרים - 500-650 יורו. אותו תוכן, אותם תקנים, אותה
              תעודה בינלאומית - במחיר של חצי או שליש.
            </p>
            <p>
              <strong>2. התנאים.</strong> טמפרטורת המים 28-30 מעלות לאורך כל השנה - בלי חליפות עבות, בלי קור. הראות
              באתרי הצלילה מגיעה ל-20-30 מטר ביומיים טובים. אתרי הצלילה במרחק של 20-40 דקות בסירה מהחוף.
              אלמוגים, צבי ים, להקות ברקודות, ולפעמים לוויתני כריש (April-May).
            </p>
            <p>
              <strong>3. הקהילה.</strong> בקוטאו יש קהילה ישראלית מתמשכת - תמיד פוגשים ישראלים אחרים בקורס, בבר,
              במסעדה. זה לא טיול בודד - זו חוויה חברתית. וזה גם בעיה: ישראלים נוטים לבחור את מרכז הצלילה הראשון
              שהם רואים כי "כולם המליצו". אנחנו ממליצים להשוות לפני.
            </p>
          </Section>

          <Section id="mehirim" title="מחירי קורסי הצלילה ב-Siam Scuba (2026)">
            <p>
              המחירים שלמטה הם המחירים האמיתיים לשנת 2026. כולם כוללים את כל הציוד, הסירות, ההסמכה, ומסי המקום.
              שום הפתעות בקופה.
            </p>
            <ul className="space-y-2 mr-4 list-disc">
              <li>
                <strong>Discover Scuba Diving (טעימה):</strong> 2,600 בת. יום אחד, ללא הסמכה. אימון בבריכה ושתי
                צלילות בים. מתאים אם אתם לא בטוחים שאתם רוצים לצלול בכלל.
              </li>
              <li>
                <strong>PADI Bubble Maker (לילדים מגיל 8):</strong> 3,800 בת. צלילה בבריכה בלבד, בליווי מדריך PADI.
              </li>
              <li>
                <strong>Scuba Review (רענון לצוללנים מוסמכים):</strong> 2,500 בת. יום אחד עם 2 צלילות בים בליווי מדריך.
              </li>
              <li>
                <strong>PADI Open Water Diver (כוכב ראשון):</strong> 11,000 בת. 3 ימים, הסמכה לכל החיים, מקסימום 4
                תלמידים למדריך. מאפשר לכם לצלול עד עומק 18 מטר בכל מקום בעולם.
              </li>
              <li>
                <strong>PADI Advanced Open Water (כוכב שני):</strong> 10,000 בת. 2 ימים, 5 צלילות הרפתקאה כולל עומק
                וניווט. מעלה אתכם ל-30 מטר.
              </li>
              <li>
                <strong>PADI Rescue Diver (Rescue) + EFR:</strong> 16,500 בת (12,000 + 4,500). 4 ימים. הקורס שכל מי
                שעבר אותו אומר שהפך אותו לצוללן טוב יותר.
              </li>
              <li>
                <strong>Peak Performance Buoyancy (שיפור ציפה):</strong> 5,500 בת. יום אחד, 2 צלילות. השיפור הכי
                משמעותי בכישורי צלילה לכל הזמן.
              </li>
              <li>
                <strong>Wreck / Deep / Sidemount / DPV:</strong> 7,000-9,500 בת לכל קורס התמחות.
              </li>
              <li>
                <strong>PADI Divemaster:</strong> 38,500 בת. 4-8 שבועות, כולל תקופת הכשרה חינם. ההסמכה המקצועית
                הראשונה.
              </li>
              <li>
                <strong>PADI IDC (Instructor Course):</strong> מחיר לפי דרישה. אנחנו מרכז IDC עם 5 כוכבים, מה שמאפשר
                לכם לעשות את כל הדרך מ-Open Water ועד Instructor במקום אחד.
              </li>
            </ul>
            <p>
              <Link to="/blog/kokhav-rishon-koh-tao" className="text-primary hover:underline">
                לקריאה מעמיקה על הכוכב הראשון בקוטאו
              </Link>
              {" - "}
              המאמר המפורט שלנו עם הכל מ-A עד ת.
            </p>
          </Section>

          <Section id="takziv" title="תקציב לטיול הצלילה (כמה זה באמת עולה)">
            <p>
              עלות הקורס לבדה לא מספרת את הסיפור המלא. תהיו בקוטאו לפחות 3 ימים לקורס Open Water, יותר אם תמשיכו
              ל-Advanced. הנה תקציב יומי ריאלי:
            </p>
            <p>
              <strong>לינה:</strong> מיטה בהוסטל בחדר משותף - 250-450 בת ללילה. חדר פרטי עם מאוורר - 700-1,200 בת.
              חדר עם מזגן - 1,200-2,500 בת. חוף הדגן (Sairee) ומאי האד הם האזורים העיקריים. רוב הישראלים בוחרים
              באמצע הטווח.
            </p>
            <p>
              <strong>אוכל:</strong> צלחת אוכל תאילנדי ברחוב - 70-120 בת. ארוחה במסעדה לזרים - 250-450 בת. ארוחת
              ערב מסודרת - 400-700 בת. מים בבקבוק 1.5 ליטר - 20 בת.
            </p>
            <p>
              <strong>תחבורה באי:</strong> השכרת קטנוע 200-300 בת ליום (עם דלק). Songthaew (טנדר משותף) 100-200 בת
              לנסיעה.
            </p>
            <p>
              <strong>מעבורת מבנגקוק לקוטאו:</strong> 800-1,300 בת לכיוון. אנחנו ממליצים על Lomprayah או Songserm.
            </p>
            <p>
              <strong>טיסה מישראל:</strong> 700-1,500 דולר תלוי בעונה ומועד. הטיסות הזולות ביותר באמצע השבוע מחוץ
              לחגים.
            </p>
            <p>
              <strong>סיכום ל-4 ימים בקוטאו עם קורס Open Water:</strong> 17,000-25,000 בת באי (כ-1,800-2,650 שקל),
              ועוד הטיסה מישראל. סך הכל בערך 6,500-9,500 שקל לטיול שלם.
            </p>
          </Section>

          <Section id="living-costs" title="עלויות חיים אם אתם נשארים יותר זמן">
            <p>
              אם אתם מתכננים לעשות גם את ה-Advanced Open Water (יומיים נוספים) או Divemaster (4-8 שבועות), כדאי
              לדעת את עלויות החיים החודשיות:
            </p>
            <ul className="space-y-2 mr-4 list-disc">
              <li>
                <strong>סטודיו חודשי עם מאוורר:</strong> 8,000-15,000 בת לחודש. מתאים לחודש-חודשיים. רוב מתלמדי
                ה-Divemaster לוקחים את זה.
              </li>
              <li>
                <strong>חדר עם מזגן:</strong> 15,000-25,000 בת לחודש.
              </li>
              <li>
                <strong>אוכל:</strong> 8,000-15,000 בת לחודש - תלוי כמה תאכלו ברחוב לעומת מסעדות לזרים.
              </li>
              <li>
                <strong>בילויים ושתייה:</strong> 5,000-10,000 בת לחודש - חיי הלילה ב-Sairee פעילים אבל לא יקרים
                לעומת אירופה.
              </li>
            </ul>
            <p>
              <strong>סיכום ל-6 שבועות עם Divemaster:</strong> 80,000-120,000 בת (כ-8,500-12,800 שקל) - כולל הקורס,
              הלינה, האוכל, והבילויים. זה כנראה המסלול הזול ביותר בעולם להפיכת תחביב לקריירה.
            </p>
          </Section>

          <Section id="season" title="מתי הזמן הטוב ביותר לבוא?">
            <p>
              קוטאו צוללת כל השנה - היא לא יעד עונתי כמו הקריביים. אבל יש חודשים טובים יותר:
            </p>
            <p>
              <strong>פברואר עד מאי - העונה הטובה ביותר:</strong> ראות 20-30+ מטר, ים שטוח, אוויר 28-32 מעלות. עונת
              לוויתני הכריש בשיא ב-April-May.
            </p>
            <p>
              <strong>יוני עד ספטמבר - מצוין עם פחות תיירים:</strong> ראות 15-25 מטר, סופות אחר הצהריים מדי פעם,
              מחירים נמוכים יותר.
            </p>
            <p>
              <strong>אוקטובר עד אמצע דצמבר - עונת הגשמים:</strong> זו העונה שכל אחד מנסה להסתיר. גשם כבד, ים גלי
              באתרים בצפון, ראות יורדת ל-5-15 מטר בימים הגרועים. אנחנו צוללים כמעט כל יום (הסירות שלנו גדולות מספיק)
              אבל זה לא אותו דבר.
            </p>
            <p>
              <strong>אמצע דצמבר עד פברואר - העונה הגבוהה חוזרת:</strong> תנאים משתפרים מהר. עונת חגים - הזמינו לינה
              2-3 חודשים מראש.
            </p>
            <p>
              <strong>המלצה לישראלים:</strong> אם יש לכם גמישות, לכו על מרץ או אפריל. אם אתם באים בכל מקרה
              באוקטובר-נובמבר, תכננו 5-7 ימים באי כדי לתפוס את חלונות מזג האוויר הטובים.
            </p>
          </Section>

          <Section id="hidden-costs" title="עלויות נסתרות שכדאי לדעת לפני שאתם מזמינים מרכז אחר">
            <p>
              לא כל מרכז צלילה בקוטאו אומר את כל המחיר מראש. דברים שכדאי לבדוק לפני שאתם משלמים:
            </p>
            <ul className="space-y-2 mr-4 list-disc">
              <li>
                <strong>מחיר "מ-":</strong> חלק מהמרכזים מפרסמים "מ-9,500 בת" אבל זה מחיר בסיסי בלי חוברות PADI, בלי
                כרטיס הסמכה, או בלי מס. תמיד שאלו: מה המחיר הסופי שאני משלם, הכל כלול?
              </li>
              <li>
                <strong>חוברות PADI נפרדות:</strong> חומרי הלימוד הדיגיטליים עולים 2,500-3,000 בת אם הם בחשבון נפרד.
                אצלנו הם כלולים במחיר הקורס.
              </li>
              <li>
                <strong>תוספת על ציוד:</strong> ציוד ישן או התמחותי (סנפיר מתאים, מסכה עם מספר, מחשב צלילה אישי) יכול
                להוסיף 500-1,500 בת. כדאי לוודא לפני.
              </li>
              <li>
                <strong>תוספת דלק לסירה:</strong> כשמחירי הדלק עולים, חלק מהמרכזים מוסיפים 100-200 בת ביום. פחות נפוץ
                היום אבל עדיין קורה.
              </li>
              <li>
                <strong>גודל קבוצה:</strong> PADI מתיר עד 8 תלמידים למדריך. רוב המרכזים בקוטאו עובדים עם 6-8.
                אנחנו עם מקסימום 4. שאלו את הקבוצה הצפויה לפני שאתם משלמים.
              </li>
              <li>
                <strong>לחץ למכירה נוספת:</strong> אם המרכז דוחף אתכם להוסיף Specialty או צלילות בילוי במהלך
                ה-Open Water, זה דגל אדום. תסיימו את הקורס בקצב הנכון, התמחויות עושים אחרי.
              </li>
            </ul>
          </Section>

          <Section id="why-us" title="למה Siam Scuba?">
            <p>
              לא יחיד באי - אבל יש כמה דברים שמייחדים אותנו ואנחנו רוצים שתדעו עליהם לפני שתחליטו:
            </p>
            <p>
              <strong>יחס מדריך 1:4:</strong> מקסימום 4 תלמידים למדריך אחד. ללא יוצא מן הכלל. זה אומר שהמדריך באמת
              רואה כל אחד מכם מתחת למים, ולא מנסה לחלק את תשומת הלב על 8 אנשים.
            </p>
            <p>
              <strong>אין דמי קדימה:</strong> לא ביקשנו פיקדון מעולם. אתם מגיעים לקוטאו, מכירים את הצוות, רואים את
              הסירות והציוד, ורק אחר כך מתחייבים. אם משהו לא מסתדר עם הציפיות שלכם - אתם לא חייבים לנו כלום.
            </p>
            <p>
              <strong>שתי סירות צלילה פרטיות:</strong> Siam Explorer ו-Siam Pearl. סירות ייעודיות לצלילה (לא סירת
              דייגים מותאמת), עם מקום, צל, ומיכלים מלאים מראש. בעונה הגבוהה זה ההבדל בין יציאה בזמן לבין המתנה
              בלובי.
            </p>
            <p>
              <strong>5 כוכבים IDC Centre:</strong> זו הדרגה הגבוהה ביותר של PADI. אנחנו עוברים ביקורות תקופתיות,
              ואנחנו מאפשרים את כל הדרך מ-Open Water ועד מדריך באותו מקום.
            </p>
            <p>
              <strong>4.9 כוכבים ב-TripAdvisor (778 ביקורות):</strong> לא טענה - תוכלו לבדוק בעצמכם. הביקורות
              באמת מהאנשים שהיו פה.
            </p>
          </Section>

          <Section id="booking" title="איך מזמינים אצלנו">
            <p>
              שלחו לנו הודעה בוואטסאפ עם התאריכים שאתם מתכננים, כמה אתם בקבוצה, ואיזה קורס מעניין אתכם. אנחנו עונים
              בתוך שעה בשעות היום (שעון תאילנד).
            </p>
            <p>
              <strong>אין דמי קדימה.</strong> משלמים רק כשמגיעים לקוטאו, אחרי שראיתם את המקום. רוב הסטודנטים
              ישראלים מגיעים מהמעבורת ישר אלינו במאי האד, מתעדכנים, ומתחילים את הקורס למחרת בבוקר.
            </p>
            <p>
              <strong>אם אתם רוצים לחסוך יום באי:</strong> תקנו את חוברות ה-PADI אונליין מראש (eLearning). הקישור
              ניתן לאחר התיאום הראשוני. ככה תוכלו להתחיל את הצלילות מיום ההגעה.
            </p>
            <div className="mt-6 p-6 rounded-2xl bg-ocean-deep text-center">
              <p className="font-display text-xl font-semibold text-primary-foreground mb-2">
                מוכנים להזמין? שלחו הודעה בוואטסאפ
              </p>
              <p className="text-primary-foreground/70 text-sm mb-4">
                עונים בתוך שעה - גם בעברית
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full px-10 bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              >
                <a
                  href={HEBREW_WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ location: "hebrew_landing_footer", url: HEBREW_WHATSAPP_HREF })}
                >
                  <MessageCircle className="h-5 w-5" />
                  לפתיחת וואטסאפ
                </a>
              </Button>
            </div>
          </Section>

          {/* Cross-link to existing Hebrew content */}
          <Section id="more-hebrew" title="עוד מהמדריך הישראלי שלנו">
            <p>
              <Link to="/blog/kokhav-rishon-koh-tao" className="inline-flex items-center gap-2 text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" />
                כוכב ראשון בקוטאו - המדריך המלא לקורס Open Water בתאילנד
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              המאמר המפורט שלנו על הקורס Open Water - מה כולל, מה לארוז, איך מתכוננים, ומה לעשות אחרי. בעברית.
            </p>
          </Section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default HebrewLanding;
