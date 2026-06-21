import Seo from "@/components/Seo";
import SailRockLander from "@/components/landers/SailRockLander";
import {
  LANDER_COPY,
  buildLanderJsonLd,
  landerHreflangAlternates,
  landerUrl,
} from "@/lib/landerCopy";

const OFFER = "sail-rock" as const;
const LANG = "he" as const;

const SailRockHePage = () => {
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
          { name: "צלילה בסייל רוק" },
        ]}
      />
      <SailRockLander lang={LANG} />
    </>
  );
};

export default SailRockHePage;
