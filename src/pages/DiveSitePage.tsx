import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Waves, Gauge, GraduationCap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedCourses from "@/components/RelatedCourses";
import BlogCard from "@/components/BlogCard";
import { findDiveSite } from "@/data/diveSites";
import { blogPosts } from "@/data/blogPosts";

const SITE_URL = "https://siamscuba.com";

const StatItem = ({ icon: Icon, label, value }: { icon: typeof Waves; label: string; value: string }) => (
  <div className="flex-1 min-w-[7rem] py-3 px-1">
    <div className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider font-bold text-primary/80">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
    <div className="mt-1 text-base font-semibold text-foreground leading-tight">{value}</div>
  </div>
);

const DiveSitePage = () => {
  const { siteSlug } = useParams<{ siteSlug: string }>();
  const site = findDiveSite(siteSlug);

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
            ← Back to dive sites
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const url = `${SITE_URL}/dive-sites/${site.slug}`;
  const ogImage = `${SITE_URL}${site.photo}`;

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: `${site.name} - Koh Tao Dive Site`,
    description: site.excerpt,
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

  const relatedPosts = (site.relatedBlogSlugs ?? [])
    .map((slug) => blogPosts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  const hasSeasonal = site.thingsToSee.some((c) => c.seasonal);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${site.name} - Koh Tao Dive Site Guide | Siam Scuba`}
        description={site.excerpt.slice(0, 158)}
        ogType="article"
        ogImage={ogImage}
        jsonLd={placeSchema}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Dive Sites", path: "/dive-sites" },
          { name: site.name },
        ]}
      />
      <Navbar />

      <main>
        {/* Hero */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img src={site.photo} alt={`${site.name} dive site, Koh Tao`} className="w-full h-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-24 relative z-10 max-w-4xl pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              to="/dive-sites"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              All dive sites
            </Link>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">
              {site.name}
            </h1>
            <p className="mt-2 text-muted-foreground font-medium">{site.localName}</p>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap gap-x-2 gap-y-0 border-y border-primary/30 divide-x divide-border">
              <StatItem icon={Waves} label="Depth" value={site.depthRange} />
              <StatItem icon={GraduationCap} label="Level" value={site.level} />
              <StatItem icon={Gauge} label="Difficulty" value={site.difficulty} />
              <StatItem icon={Star} label="Best for" value={site.bestFor} />
            </div>

            {/* Prose */}
            <p className="mt-8 text-lg text-foreground/90 leading-relaxed">{site.intro}</p>
            {site.body.map((p, i) => (
              <p key={i} className="mt-4 text-foreground/75 leading-relaxed">
                {p}
              </p>
            ))}

            {/* Things to see */}
            <h2 className="font-display text-2xl font-semibold text-foreground mt-10 mb-4">Things to see</h2>
            <div className="flex flex-wrap gap-2">
              {site.thingsToSee.map((c) => (
                <span
                  key={c.label}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium border ${
                    c.seasonal
                      ? "border-accent/60 text-accent bg-accent/5"
                      : "border-border text-foreground/80 bg-secondary/40"
                  }`}
                >
                  {c.label}
                  {c.seasonal && " *"}
                </span>
              ))}
            </div>

            {/* Getting there — site maps are intentionally hidden until we have a
                complete set of our own original maps (see diveSites.ts mapSvg/
                locatorSvg, kept for when we re-enable them). */}
            <div className="mt-12 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Getting there</h2>
              <p className="text-foreground/75 leading-relaxed">{site.gettingThere}</p>
            </div>

            {(hasSeasonal || site.seasonNote) && site.seasonNote && (
              <p className="mt-6 text-xs italic text-muted-foreground">{site.seasonNote}</p>
            )}

            {/* Related courses */}
            {site.relatedCourses && site.relatedCourses.length > 0 && (
              <RelatedCourses slugs={site.relatedCourses} heading="Dive this site with us" />
            )}

            {/* End CTA */}
            <div className="mt-16 p-8 rounded-2xl bg-ocean-deep text-center">
              <h3 className="font-display text-2xl font-bold text-primary-foreground">Dive {site.name} with Siam Scuba</h3>
              <p className="mt-2 text-primary-foreground/70">
                Small groups, private dive boats, and instructors who know every metre of this site.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 rounded-full px-10 bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              >
                <Link to="/fun-dive-booking">
                  <MessageCircle className="h-5 w-5" />
                  Book a fun dive
                </Link>
              </Button>
            </div>

            {/* Related reading */}
            {relatedPosts.length > 0 && (
              <section aria-labelledby="related-reading" className="mt-16">
                <h2 id="related-reading" className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  Related reading
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
