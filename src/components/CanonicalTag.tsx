import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://siamscuba.com";

const CanonicalTag = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const url = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);

    return () => {
      link?.remove();
    };
  }, [pathname]);

  return null;
};

export default CanonicalTag;
