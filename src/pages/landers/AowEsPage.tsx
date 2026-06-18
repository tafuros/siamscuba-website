import Seo from "@/components/Seo";
import CampaignLander from "@/components/landers/CampaignLander";
import {
  LANDER_COPY,
  buildLanderJsonLd,
  landerHreflangAlternates,
  landerUrl,
} from "@/lib/landerCopy";

const OFFER = "aow" as const;
const LANG = "es" as const;

const AowEsPage = () => {
  const copy = LANDER_COPY[OFFER][LANG];
  return (
    <>
      <Seo
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical={landerUrl(OFFER, LANG)}
        hreflangAlternates={landerHreflangAlternates(OFFER)}
        jsonLd={buildLanderJsonLd(OFFER, LANG)}
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Curso PADI Advanced Open Water" },
        ]}
      />
      <CampaignLander offer={OFFER} lang={LANG} />
    </>
  );
};

export default AowEsPage;
