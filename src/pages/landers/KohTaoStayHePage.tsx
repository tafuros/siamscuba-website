import Seo from "@/components/Seo";
import KohTaoStayLander from "@/components/landers/KohTaoStayLander";
import { STAY_PATH, STAY_SECTIONS } from "@/lib/kohTaoStay";

const SITE_URL = "https://siamscuba.com";
const CANONICAL = `${SITE_URL}${STAY_PATH}`;

const places = STAY_SECTIONS.flatMap((section) => section.places);

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "איפה לישון בקוטאו",
  url: CANONICAL,
  numberOfItems: places.length,
  itemListElement: places.map((place, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "LodgingBusiness",
      name: place.name,
      image: `${SITE_URL}${place.image}`,
      hasMap: place.mapUrl,
    },
  })),
};

const KohTaoStayHePage = () => (
  <>
    <Seo
      title="איפה לישון בקוטאו - מדריך מקומות לינה - Siam Scuba"
      description="איפה לישון בקוטאו? מדריך ויזואלי ל-11 מקומות לינה לפי אופי: פינות שקטות, לב סיירי, וילות פרימיום והאי נאנג יואן, עם מפה לכל מקום."
      canonical={CANONICAL}
      ogImage={`${SITE_URL}/koh-tao-stay/og-koh-tao-stay.jpg`}
      jsonLd={itemListJsonLd}
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "איפה לישון בקוטאו" }]}
    />
    <KohTaoStayLander />
  </>
);

export default KohTaoStayHePage;
