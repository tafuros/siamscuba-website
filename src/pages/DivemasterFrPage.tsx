import Seo from "@/components/Seo";
import DivemasterContent from "@/components/divemaster/DivemasterContent";
import { DM_COPY, DM_PRICE, divemasterHreflangAlternates, divemasterUrl } from "@/data/divemaster";

const LANG = "fr" as const;

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: DM_COPY[LANG].seoTitle,
  description: DM_COPY[LANG].seoDescription,
  inLanguage: LANG,
  url: divemasterUrl(LANG),
  educationalCredentialAwarded: "PADI Divemaster",
  provider: {
    "@type": "Organization",
    name: "Siam Scuba",
    url: "https://siamscuba.com",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "PADI 5 Star Instructor Development Center",
    },
  },
  offers: {
    "@type": "Offer",
    price: DM_PRICE,
    priceCurrency: "THB",
    category: "Paid",
    availability: "https://schema.org/InStock",
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Onsite",
    location: { "@type": "Place", name: "Siam Scuba, Koh Tao, Thailand" },
  },
};

const DivemasterFrPage = () => {
  const copy = DM_COPY[LANG];
  return (
    <>
      <Seo
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical={divemasterUrl(LANG)}
        hreflangAlternates={divemasterHreflangAlternates()}
        jsonLd={courseSchema}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: copy.breadcrumb }]}
      />
      <DivemasterContent lang={LANG} />
    </>
  );
};

export default DivemasterFrPage;
