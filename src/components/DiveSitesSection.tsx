import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DiveSiteCard from "@/components/DiveSiteCard";
import { diveSites } from "@/data/diveSites";
import AmbientReviews from "@/components/AmbientReviews";

const DiveSitesSection = () => {
  const featured = diveSites.filter((s) => s.featured).slice(0, 3);

  return (
    <section id="dive-sites" className="section-padding relative overflow-hidden isolate">
      <AmbientReviews startIndex={4} count={3} />
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-2">
            Explore Koh Tao
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            The Dive Sites
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sheltered training bays, granite pinnacles and open-water giants - all within a short
            boat ride. Browse depth, difficulty and the marine life at each one.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((site, i) => (
            <motion.div
              key={site.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <DiveSiteCard site={site} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-8 gap-2 border-primary/30 hover:border-primary hover:bg-primary/5"
          >
            <Link to="/dive-sites">
              View all dive sites
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DiveSitesSection;
