import Seo from "@/components/Seo";
import FunDiveLander from "@/components/landers/FunDiveLander";
import {
  FUN_DIVE_COPY,
  buildFunDiveJsonLd,
  funDiveHreflangAlternates,
  funDiveUrl,
} from "@/lib/funDiveCopy";

const LANG = "fr" as const;

const FunDiveFrPage = () => {
  const copy = FUN_DIVE_COPY[LANG];
  return (
    <>
      <Seo
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical={funDiveUrl(LANG)}
        hreflangAlternates={funDiveHreflangAlternates()}
        jsonLd={buildFunDiveJsonLd(LANG)}
        breadcrumbs={[{ name: "Accueil", path: "/" }, { name: "Plongées Fun" }]}
      />
      <FunDiveLander lang={LANG} />
    </>
  );
};

export default FunDiveFrPage;
