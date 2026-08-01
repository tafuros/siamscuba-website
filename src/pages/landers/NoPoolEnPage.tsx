import Seo from "@/components/Seo";
import NoPoolLander from "@/components/landers/NoPoolLander";
import {
  NO_POOL_COPY,
  buildNoPoolJsonLd,
  noPoolHreflangAlternates,
  noPoolUrl,
} from "@/lib/noPoolCopy";

const LANG = "en" as const;

const NoPoolEnPage = () => {
  const copy = NO_POOL_COPY[LANG];
  return (
    <>
      <Seo
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical={noPoolUrl(LANG)}
        hreflangAlternates={noPoolHreflangAlternates()}
        jsonLd={buildNoPoolJsonLd(LANG)}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: copy.heroH1 }]}
      />
      <NoPoolLander lang={LANG} />
    </>
  );
};

export default NoPoolEnPage;
