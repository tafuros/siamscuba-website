import Seo from "@/components/Seo";
import HotelContent from "@/components/hotel/HotelContent";
import {
  HOTEL_COPY,
  buildHotelSchema,
  hotelHreflangAlternates,
  hotelUrl,
} from "@/data/hotel";

const LANG = "en" as const;

const HotelPage = () => {
  const copy = HOTEL_COPY[LANG];
  return (
    <>
      <Seo
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical={hotelUrl(LANG)}
        ogImage="https://siamscuba.com/hotel/siam-hotel-koh-tao-pool.webp"
        hreflangAlternates={hotelHreflangAlternates()}
        jsonLd={buildHotelSchema(LANG)}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: copy.breadcrumb }]}
      />
      <HotelContent lang={LANG} />
    </>
  );
};

export default HotelPage;
