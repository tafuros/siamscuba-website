import { useParams, Link } from "react-router-dom";
import BookingLink from "@/components/BookingLink";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Gauge, GraduationCap, MessageCircle, Star, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedCourses from "@/components/RelatedCourses";
import BlogCard from "@/components/BlogCard";
import { findDiveSite } from "@/data/diveSites";
import { listedBlogPosts } from "@/data/blogPosts";

const SITE_URL = "https://siamscuba.com";

const StatItem = ({ icon: Icon, label, value }: { icon: typeof Waves; label: string; value: string }) => (
  <div className="flex-1 min-w-[7rem] py-3 px-1">
    <div className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider font-bold text-primary/80">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
    <div className="mt-1 text-base font-semibold text-foreground leading-tight" dir="auto">{value}</div>
  </div>
);

/** UI chrome for the Hebrew edition; the site text itself lives in diveSites.ts (`he`). */
const UI = {
  en: {
    depth: "Depth",
    level: "Level",
    difficulty: "Difficulty",
    bestFor: "Best for",
    allSites: "All dive sites",
    thingsToSee: "Things to see",
    gettingThere: "Getting there",
    fullDay: "Full-day trip",
    perDiver: "per diver",
    diveWithUs: "Dive this site with us",
    ctaTitle: (name: string) => `Dive ${name} with Siam Scuba`,
    ctaBody: "Small groups, private dive boats, and instructors who know every metre of this site.",
    ctaButton: "Book a fun dive",
    relatedReading: "Related reading",
    home: "Home",
    diveSites: "Dive Sites",
  },
  he: {
    depth: "עומק",
    level: "רמה",
    difficulty: "קושי",
    bestFor: "הכי מיוחד",
    allSites: "כל אתרי הצלילה",
    thingsToSee: "מה רואים שם",
    gettingThere: "איך מגיעים",
    fullDay: "יום צלילה מלא",
    perDiver: "לצולל",
    diveWithUs: "לצלול כאן איתנו",
    ctaTitle: (name: string) => `לצלול ב${name} עם סיאם סקובה`,
    ctaBody: "קבוצות קטנות, סירות צלילה פרטיות ומדריכים שמכירים כל מטר באתר.",
    ctaButton: "לפרטים ולהרשמה",
    relatedReading: "לקריאה נוספת",
    home: "דף הבית",
    diveSites: "אתרי צלילה",
  },
};

interface DiveSitePageProps {
  /** "he" renders the Hebrew edition at /he/dive-sites/<slug>. */
  lang?: "en" | "he";
}

const DiveSitePage = ({ lang = "en" }: DiveSitePageProps) => {
  const { siteSlug } = useParams<{ siteSlug: string }>();
  const found = findDiveSite(siteSlug);
  // The Hebrew route only exists for sites that carry a Hebrew edition.
  const site = lang === "he" && !found?.he ? undefined : found;
  const ui = UI[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [siteSlug]);

  if (!site) {
    return (
      <div className="min-h-screen bg-background">
        <Seo title="Dive site not found | Siam Scuba" description="The dive site you are looking for could not be found." noindex />
        <Navbar />
        <div className="pt-36 pb-20 px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Dive site not found</h1>
          <Link to="/dive-sites" className="text-primary mt-4 inline-block hover:underline">
            <ArrowLeft className="h-[1.05em] w-[1.05em] rtl:rotate-180" aria-hidden="true" />{" "}
            Back to dive sites
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const he = lang === "he" ? site.he : undefined;
  const copy = {
    name: he?.name ?? site.name,
    localName: he?.localName ?? site.localName,
    excerpt: he?.excerpt ?? site.excerpt,
    level: he?.level ?? site.level,
    difficulty: he?.difficulty ?? site.difficulty,
    bestFor: he?.bestFor ?? site.bestFor,
    intro: he?.intro ?? site.intro,
    body: he?.body ?? site.body,
    gettingThere: he?.gettingThere ?? site.gettingThere,
    seasonNote: he ? he.seasonNote : site.seasonNote,
  };
  const enPath = `/dive-sites/${site.slug}`;
  const hePath = `/he/dive-sites/${site.slug}`;
  const url = `${SITE_URL}${lang === "he" ? hePath : enPath}`;
  const ogImage = `${SITE_URL}${site.photo}`;
  // Reciprocal hreflang, only when a Hebrew edition exists.
  const hreflang = site.he ? { en: `${SITE_URL}${enPath}`, he: `${SITE_URL}${hePath}` } : undefined;

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: he ? `${he.name} - אתר צלילה בקו טאו` : `${site.name} - Koh Tao Dive Site`,
    description: copy.excerpt,
    inLanguage: lang,
    image: ogImage,
    url,
    ...(site.coords
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: site.coords.lat,
            longitude: site.coords.lng,
          },
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressRegion: "Koh Tao",
      addressCountry: "TH",
    },
    isAccessibleForFree: false,
    touristType: "Scuba divers",
  };

  // The related posts are English-only, so the Hebrew edition does not list them.
  const relatedPosts = (he ? [] : site.relatedBlogSlugs ?? [])
    .map((slug) => listedBlogPosts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  const hasSeasonal = site.thingsToSee.some((c) => c.seasonal);

  return (
    <div className="min-h-screen bg-background" dir={lang === "he" ? "rtl" : "ltr"} lang={lang}>
      <Seo
        title={he ? he.seoTitle : `${site.name} - Koh Tao Dive Site Guide | Siam Scuba`}
        description={he ? he.seoDescription : site.excerpt.slice(0, 158)}
        canonical={url}
        hreflangAlternates={hreflang}
        ogType="article"
        ogImage={ogImage}
        jsonLd={placeSchema}
        breadcrumbs={[
          { name: ui.home, path: "/" },
          { name: ui.diveSites, path: "/dive-sites" },
          { name: copy.name },
        ]}
      />
      <Navbar />

      <main>
        {/* Hero */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img src={site.photo} alt={he ? `אתר הצלילה ${he.name}, קו טאו` : `${site.name} dive site, Koh Tao`} className="w-full h-full object-cover" fetchpriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-24 relative z-10 max-w-4xl pb-20">
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }}>
            <Link
              to="/dive-sites"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {ui.allSites}
            </Link>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">
              {copy.name}
            </h1>
            <p className="mt-2 text-muted-foreground font-medium">{copy.localName}</p>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap gap-x-2 gap-y-0 border-y border-primary/30 divide-x divide-border rtl:divide-x-reverse">
              <StatItem icon={Waves} label={ui.depth} value={site.depthRange} />
              <StatItem icon={GraduationCap} label={ui.level} value={copy.level} />
              <StatItem icon={Gauge} label={ui.difficulty} value={copy.difficulty} />
              <StatItem icon={Star} label={ui.bestFor} value={copy.bestFor} />
            </div>

            {/* Prose */}
            <p className="mt-8 text-lg text-foreground/90 leading-relaxed">{copy.intro}</p>
            {copy.body.map((p, i) => (
              <p key={i} className="mt-4 text-foreground/75 leading-relaxed">
                {p}
              </p>
            ))}

            {/* Things to see */}
            <h2 className="font-display text-2xl font-semibold text-foreground mt-10 mb-4">{ui.thingsToSee}</h2>
            <div className="flex flex-wrap gap-2">
              {site.thingsToSee.map((c, i) => (
                <span
                  key={c.label}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium border ${
                    c.seasonal
                      ? "border-accent/60 text-accent bg-accent/5"
                      : "border-border text-foreground/80 bg-secondary/40"
                  }`}
                >
                  {he?.thingsToSee[i] ?? c.label}
                  {c.seasonal && " *"}
                </span>
              ))}
            </div>

            {/* Getting there — site maps are intentionally hidden until we have a
                complete set of our own original maps (see diveSites.ts mapSvg/
                locatorSvg, kept for when we re-enable them). */}
            <div className="mt-12 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">{ui.gettingThere}</h2>
              <p className="text-foreground/75 leading-relaxed">{copy.gettingThere}</p>
              {site.tripPrice && (
                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                  <span className="text-sm font-medium text-foreground/80">{ui.fullDay}</span>
                  <span className="text-xl font-bold text-foreground" dir="auto">
                    {site.tripPrice}
                    <span className="ms-1.5 text-xs font-normal text-muted-foreground">{ui.perDiver}</span>
                  </span>
                </div>
              )}
            </div>

            {(hasSeasonal || copy.seasonNote) && copy.seasonNote && (
              <p className="mt-6 text-xs italic text-muted-foreground">{copy.seasonNote}</p>
            )}

            {/* Related courses */}
            {site.relatedCourses && site.relatedCourses.length > 0 && (
              <RelatedCourses slugs={site.relatedCourses} heading={ui.diveWithUs} />
            )}

            {/* End CTA */}
            <div className="mt-16 p-8 rounded-2xl bg-ocean-deep text-center">
              <h3 className="font-display text-2xl font-bold text-primary-foreground">{ui.ctaTitle(copy.name)}</h3>
              <p className="mt-2 text-primary-foreground/70">{ui.ctaBody}</p>
              <Button
                asChild
                size="lg"
                className="mt-6 rounded-full px-10 bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              >
                {he?.landerPath ? (
                  <Link to={he.landerPath}>
                    <MessageCircle className="h-5 w-5" />
                    {ui.ctaButton}
                  </Link>
                ) : (
                  <BookingLink to="/fun-dive-booking">
                    <MessageCircle className="h-5 w-5" />
                    {ui.ctaButton}
                  </BookingLink>
                )}
              </Button>
            </div>

            {/* Related reading */}
            {relatedPosts.length > 0 && (
              <section aria-labelledby="related-reading" className="mt-16">
                <h2 id="related-reading" className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  {ui.relatedReading}
                </h2>
                <div className={`grid gap-6 ${relatedPosts.length === 1 ? "grid-cols-1" : relatedPosts.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
                  {relatedPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DiveSitePage;
