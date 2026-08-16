import Seo from "@/components/Seo";
import GoProContent from "@/components/goPro/GoProContent";
import { GO_PRO_COPY, goProHreflangAlternates, goProUrl } from "@/data/goPro";

const LANG = "he" as const;

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: GO_PRO_COPY[LANG].seoTitle,
  description: GO_PRO_COPY[LANG].seoDescription,
  inLanguage: LANG,
  isPartOf: { "@type": "WebSite", name: "Siam Scuba", url: "https://siamscuba.com" },
  about: { "@type": "Thing", name: "PADI professional dive training" },
  provider: {
    "@type": "Organization",
    name: "Siam Scuba",
    url: "https://siamscuba.com",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "PADI 5 Star Instructor Development Center",
    },
  },
};

const GoProHePage = () => {
  const copy = GO_PRO_COPY[LANG];
  return (
    <>
      <Seo
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical={goProUrl(LANG)}
        hreflangAlternates={goProHreflangAlternates()}
        jsonLd={pageSchema}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: copy.breadcrumb }]}
      />
      <GoProContent lang={LANG} />
    </>
  );
};

export default GoProHePage;
