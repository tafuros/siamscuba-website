import Seo from "@/components/Seo";
import FunDiveLander from "@/components/landers/FunDiveLander";
import {
  FUN_DIVE_COPY,
  buildFunDiveJsonLd,
  funDiveHreflangAlternates,
  funDiveUrl,
} from "@/lib/funDiveCopy";

const LANG = "en" as const;

const FunDiveEnPage = () => {
  const copy = FUN_DIVE_COPY[LANG];
  return (
    <>
      <Seo
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical={funDiveUrl(LANG)}
        hreflangAlternates={funDiveHreflangAlternates()}
        jsonLd={buildFunDiveJsonLd(LANG)}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Fun Dives" }]}
      />
      <FunDiveLander lang={LANG} />
    </>
  );
};

export default FunDiveEnPage;
