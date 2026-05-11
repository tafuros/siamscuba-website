import Seo from "@/components/Seo";
import CampaignLander from "@/components/landers/CampaignLander";
import {
  LANDER_COPY,
  buildLanderJsonLd,
  landerHreflangAlternates,
  landerUrl,
} from "@/lib/landerCopy";

const OFFER = "fun-dive" as const;
const LANG = "es" as const;

const FunDiveEsPage = () => {
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
          { name: "Inmersiones Guiadas" },
        ]}
      />
      <CampaignLander offer={OFFER} lang={LANG} />
    </>
  );
};

export default FunDiveEsPage;
