import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blogPosts";



const categoryColors: Record<string, string> = {
  Food: "bg-accent text-accent-foreground",
  Beaches: "bg-primary text-primary-foreground",
  Activities: "bg-ocean-deep text-primary-foreground",
  Nightlife: "bg-coral text-primary-foreground",
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-36 pb-20 px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Article not found</h1>
          <Link to="/blog" className="text-primary mt-4 inline-block hover:underline">
            ← Back to Koh Tao Guide
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <article className="container mx-auto px-4 -mt-24 relative z-10 max-w-3xl pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Guide
          </Link>

          <Badge className={`${categoryColors[post.category] || ""} mb-4`}>
            {post.category}
          </Badge>

          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="mt-10 space-y-8">
            {post.sections.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="text-foreground/80 leading-relaxed mb-3">
                    {p}
                  </p>
                ))}
                {section.mapLink && (
                  <a
                    href={section.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    View on Google Maps
                  </a>
                )}
                {section.image && (
                  <img
                    src={section.image}
                    alt={section.heading || ""}
                    className="rounded-lg w-full mt-4"
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-2xl bg-ocean-deep text-center">
            <h3 className="font-display text-2xl font-bold text-primary-foreground">
              Ready to Explore Koh Tao Underwater?
            </h3>
            <p className="mt-2 text-primary-foreground/70">
              Book a dive with Siam Scuba — beginners and certified divers welcome.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 rounded-full px-10 bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            >
              <Link to="/fun-dive-booking">
                <MessageCircle className="h-5 w-5" />
                Book a Dive
              </Link>
            </Button>
          </div>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
