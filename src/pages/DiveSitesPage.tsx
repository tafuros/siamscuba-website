import { useEffect } from "react";
import { motion } from "framer-motion";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiveSiteCard from "@/components/DiveSiteCard";
import { diveSites } from "@/data/diveSites";

const SITE_URL = "https://siamscuba.com";

const DiveSitesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Koh Tao Dive Sites",
    description:
      "The dive sites of Koh Tao and the Gulf of Thailand, with depth, difficulty, marine life and site maps.",
    itemListElement: diveSites.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${SITE_URL}/dive-sites/${s.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Koh Tao Dive Sites - Maps, Depths & Marine Life | Siam Scuba"
        description="A guide to the best dive sites around Koh Tao and the Gulf of Thailand - Twins, Chumphon Pinnacle and Sail Rock. Depth, difficulty, marine life, site maps and how to dive each one with Siam Scuba."
        jsonLd={itemListSchema}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Dive Sites" },
        ]}
      />
      <Navbar />
      <main className="pt-36 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 max-w-3xl mx-auto"
          >
            <p className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">
              Gulf of Thailand
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground">
              Koh Tao Dive Sites
            </h1>
            <p className="mt-5 text-muted-foreground text-lg">
              From sheltered training bays to the open-water pinnacles that draw whale sharks,
              Koh Tao packs world-class diving into a short boat ride. Explore each site - depth,
              difficulty and the marine life you'll meet down there - then dive it with us.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diveSites.map((site, i) => (
              <motion.div
                key={site.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <DiveSiteCard site={site} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DiveSitesPage;
