import { Head } from "vite-react-ssg";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://siamscuba.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const SUPPORTED_LANGS = ["en", "he", "es", "fr"] as const;

export interface BreadcrumbItem {
  name: string;
  path?: string; // Absolute URL or path. Last item should omit path.
}

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  breadcrumbs?: BreadcrumbItem[];
}

function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.path ? { item: it.path.startsWith("http") ? it.path : `${SITE_URL}${it.path}` } : {}),
    })),
  };
}

const Seo = ({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  publishedTime,
  modifiedTime,
  author,
  noindex,
  jsonLd,
  breadcrumbs,
}: SeoProps) => {
  const { pathname } = useLocation();
  const url = canonical || `${SITE_URL}${pathname === "/" ? "" : pathname}`;

  const ldEntries: Record<string, unknown>[] = [];
  if (jsonLd) {
    if (Array.isArray(jsonLd)) ldEntries.push(...jsonLd);
    else ldEntries.push(jsonLd);
  }
  if (breadcrumbs && breadcrumbs.length > 0) {
    ldEntries.push(buildBreadcrumbSchema(breadcrumbs));
  }

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={url} />

      {/* hreflang — site is available in 4 languages at the same URL via in-app i18n */}
      <link rel="alternate" hrefLang="x-default" href={url} />
      {SUPPORTED_LANGS.map((lang) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Siam Scuba" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@siamscuba" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta name="author" content={author} />}

      {ldEntries.map((entry, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Head>
  );
};

export default Seo;
