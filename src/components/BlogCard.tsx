import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/spotlight-card";
import type { BlogPost } from "@/data/blogPosts";
import { useLanguage } from "@/i18n/LanguageContext";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "hero";
}

const categoryColors: Record<string, string> = {
  Diving: "bg-ocean-deep text-primary-foreground",
  Food: "bg-accent text-accent-foreground",
  Beaches: "bg-primary text-primary-foreground",
  Activities: "bg-ocean-deep text-primary-foreground",
  Nightlife: "bg-coral text-primary-foreground",
};

const BlogCard = ({ post, variant = "default" }: BlogCardProps) => {
  const { t } = useLanguage();
  const isHero = variant === "hero";

  const categoryMap: Record<string, string> = {
    Diving: t("blog_cat_diving"),
    Food: t("blog_cat_food"),
    Beaches: t("blog_cat_beaches"),
    Activities: t("blog_cat_activities"),
    Nightlife: t("blog_cat_nightlife"),
  };

  return (
    <Link to={`/blog/${post.slug}`} className="block h-full">
      <GlowCard glowColor="blue" customSize className="h-full !p-0 !gap-0 !grid-rows-[1fr] !shadow-none">
        <Card className="overflow-hidden group cursor-pointer border-0 bg-transparent shadow-none hover:shadow-none transition-all duration-300 h-full">
          <div className={`overflow-hidden ${isHero ? "aspect-[16/9] lg:aspect-[16/10]" : "aspect-[16/10]"}`}>
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <CardContent className={isHero ? "p-6 lg:p-8" : "p-5"}>
            <Badge className={`${categoryColors[post.category] || ""} mb-3 text-xs`}>
              {categoryMap[post.category] || post.category}
            </Badge>
            <h3
              className={`font-display font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors ${
                isHero ? "text-2xl lg:text-3xl" : "text-lg"
              }`}
            >
              {post.title}
            </h3>
            <p
              className={`text-muted-foreground ${
                isHero ? "text-base lg:text-lg line-clamp-3" : "text-sm line-clamp-2"
              }`}
            >
              {post.excerpt}
            </p>
          </CardContent>
        </Card>
      </GlowCard>
    </Link>
  );
};

export default BlogCard;
