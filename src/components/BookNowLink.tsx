import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { buildBookingUrl } from "@/utils/bookingUrl";
import { trackBookNowClick } from "@/utils/tracking";

interface BookNowLinkProps {
  /** Analytics label for the CTA slot, e.g. "no_pool_hero". */
  location: string;
  /** Wizard product preselect (e.g. "OWD", "DSD", "FUN"). */
  product?: string;
  /** Departure date preselect (ISO), for date-based offers. */
  date?: string;
  className?: string;
  children: ReactNode;
}

/**
 * The one way a landing page hands a visitor to the DiveOS booking wizard.
 *
 * The wizard is on ANOTHER HOST (dash.siamscuba.com), so it cannot read this
 * site's sessionStorage - every utm_* and the gclid have to travel on the URL
 * or attribution dies at this exact click.
 *
 * SSG HYDRATION TRAP (this is why the href is computed twice):
 * pages are prerendered by vite-react-ssg, so the server has no query string
 * and no sessionStorage. If the first CLIENT render read either, React would
 * see a prop mismatch - and on mismatch React KEEPS THE SERVER ATTRIBUTE,
 * silently serving an unattributed href. Same bug class that once stripped
 * attribution off the booking iframe (see pages/FunDiveBookingPage.tsx).
 *
 * So: render the static, storage-free href first (matching the prerendered
 * HTML), then upgrade it in an effect. onClick recomputes once more from the
 * live URL, which closes the sliver of time before the effect runs and means a
 * very fast click can never leak an unattributed URL.
 */
const BookNowLink = ({
  location: slot,
  product,
  date,
  className,
  children,
}: BookNowLinkProps) => {
  const routerLocation = useLocation();
  const anchorRef = useRef<HTMLAnchorElement>(null);

  // Deterministic on both server and first client render: no query string, no
  // sessionStorage. Only the build-time product/date preselect.
  const staticHref = buildBookingUrl("", { product, date, includeStored: false });
  const [href, setHref] = useState(staticHref);

  useEffect(() => {
    setHref(buildBookingUrl(routerLocation.search, { product, date }));
  }, [routerLocation.search, product, date]);

  const handleClick = () => {
    const fresh = buildBookingUrl(window.location.search, { product, date });
    // Rewrite the href in place before the browser follows it, so the
    // navigation uses the freshest attribution even pre-hydration.
    if (anchorRef.current) anchorRef.current.href = fresh;
    trackBookNowClick({ location: slot, product, url: fresh });
  };

  return (
    <a ref={anchorRef} href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default BookNowLink;
