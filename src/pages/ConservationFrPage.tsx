import Seo from "@/components/Seo";
import ConservationContent from "@/components/ConservationContent";
import { ORG_LOGO } from "@/lib/brand";
import {
  CONSERVATION_COPY,
  conservationUrl,
  conservationHreflangAlternates,
} from "@/lib/conservationCopy";

const LANG = "fr" as const;

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: CONSERVATION_COPY[LANG].seoTitle,
  description: CONSERVATION_COPY[LANG].seoDescription,
  inLanguage: LANG,
  isPartOf: { "@type": "WebSite", name: "Siam Scuba", url: "https://siamscuba.com" },
  about: { "@type": "Thing", name: "Marine conservation" },
  publisher: {
    "@type": "Organization",
    name: "Siam Scuba",
    logo: ORG_LOGO,
  },
};

const ConservationFrPage = () => {
  const copy = CONSERVATION_COPY[LANG];
  return (
    <>
      <Seo
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical={conservationUrl(LANG)}
        ogImage="https://siamscuba.com/conservation/divers-sunbeams-koh-tao.webp"
        hreflangAlternates={conservationHreflangAlternates()}
        jsonLd={pageSchema}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: copy.breadcrumb }]}
      />
      <ConservationContent lang={LANG} />
    </>
  );
};

export default ConservationFrPage;
