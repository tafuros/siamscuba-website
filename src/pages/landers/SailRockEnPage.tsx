import Seo from "@/components/Seo";
import SailRockLander from "@/components/landers/SailRockLander";
import {
  LANDER_COPY,
  buildLanderJsonLd,
  landerHreflangAlternates,
  landerUrl,
} from "@/lib/landerCopy";

const OFFER = "sail-rock" as const;
const LANG = "en" as const;

const SailRockEnPage = () => {
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
          { name: "Home", path: "/" },
          { name: "Sail Rock Diving" },
        ]}
      />
      <SailRockLander lang={LANG} />
    </>
  );
};

export default SailRockEnPage;
