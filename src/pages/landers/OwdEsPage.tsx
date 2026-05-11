import Seo from "@/components/Seo";
import CampaignLander from "@/components/landers/CampaignLander";
import {
  LANDER_COPY,
  buildLanderJsonLd,
  landerHreflangAlternates,
  landerUrl,
} from "@/lib/landerCopy";

const OFFER = "owd" as const;
const LANG = "es" as const;

const OwdEsPage = () => {
  const copy = LANDER_COPY[OFFER][LANG];
  return (
    <>
      <Seo
        title={copy.seoTitle}
        description={copy.seoDescription}
        noindex
        canonical={landerUrl(OFFER, LANG)}
        hreflangAlternates={landerHreflangAlternates(OFFER)}
        jsonLd={buildLanderJsonLd(OFFER, LANG)}
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Curso PADI Open Water" },
        ]}
      />
      <CampaignLander offer={OFFER} lang={LANG} />
    </>
  );
};

export default OwdEsPage;
