import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Waves, Gauge, GraduationCap } from "lucide-react";
import type { DiveSite } from "@/data/diveSites";

interface DiveSiteCardProps {
  site: DiveSite;
  variant?: "default" | "hero";
}

const DiveSiteCard = ({ site, variant = "default" }: DiveSiteCardProps) => {
  const isHero = variant === "hero";

  return (
    <Link to={`/dive-sites/${site.slug}`} className="block h-full">
      <GlowCard glowColor="blue" customSize className="h-full !p-0 !gap-0 !grid-rows-[1fr] !shadow-none">
        <Card className="overflow-hidden group cursor-pointer border-0 bg-transparent shadow-none hover:shadow-none transition-all duration-300 h-full">
          <div className={`relative overflow-hidden ${isHero ? "aspect-[16/9] lg:aspect-[16/10]" : "aspect-[16/10]"}`}>
            <img
              src={site.photo}
              alt={`${site.name} dive site, Koh Tao`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <span className="absolute top-3 left-3 rounded-full bg-ocean-deep/85 text-primary-foreground text-xs font-semibold px-3 py-1 backdrop-blur-sm">
              {site.depthRange}
            </span>
          </div>
          <CardContent className={isHero ? "p-6 lg:p-8" : "p-5"}>
            <h3
              className={`font-display font-semibold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors ${
                isHero ? "text-2xl lg:text-3xl" : "text-lg"
              }`}
            >
              {site.name}
            </h3>
            <p className="text-xs text-muted-foreground/80 mb-3">{site.localName}</p>
            <p className={`text-muted-foreground ${isHero ? "text-base line-clamp-3" : "text-sm line-clamp-2"}`}>
              {site.excerpt}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-foreground/70">
              <span className="inline-flex items-center gap-1">
                <Waves className="h-3.5 w-3.5 text-primary" />
                {site.depthRange}
              </span>
              <span className="inline-flex items-center gap-1">
                <Gauge className="h-3.5 w-3.5 text-primary" />
                {site.difficulty}
              </span>
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                {site.level}
              </span>
            </div>
          </CardContent>
        </Card>
      </GlowCard>
    </Link>
  );
};

export default DiveSiteCard;
