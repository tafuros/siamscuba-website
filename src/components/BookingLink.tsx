import { forwardRef, useEffect, useState } from "react";
import { Link, useLocation, type LinkProps } from "react-router-dom";
import { withAttribution } from "@/utils/bookingUrl";

export type BookingLinkProps = Omit<LinkProps, "to"> & {
  /** Internal destination path, optionally carrying its own query string. */
  to: string;
};

/**
 * A react-router <Link> for INTERNAL BOOKING CTAs that keeps ad attribution on
 * the URL.
 *
 * WHY. A visitor who middle-clicks or cmd-clicks "Book now" opens a new tab.
 * That tab starts with a fresh sessionStorage, and the destination page's own
 * URL carries nothing - so the visit lands unattributed, DiveOS reads a paid
 * ad click as organic, and the club pays a commission on a lead its own ad
 * spend already bought. Appending the params to the href closes that.
 *
 * Use it for BOOKING CTAs, not for general site navigation - attribution
 * should follow the funnel, not get smeared across every footer link.
 *
 * SSG HYDRATION TRAP (this is why the href is computed twice). Pages are
 * prerendered by vite-react-ssg, so the server has no query string and no
 * storage. If the first CLIENT render read either, React would see a prop
 * mismatch - and on mismatch React KEEPS THE SERVER ATTRIBUTE, silently
 * serving the unattributed href forever. So render the bare `to` first
 * (identical to the prerendered HTML), then upgrade it in an effect. Same
 * pattern, same reason, as components/BookNowLink.tsx.
 */
const BookingLink = forwardRef<HTMLAnchorElement, BookingLinkProps>(
  ({ to, children, ...rest }, ref) => {
    const location = useLocation();
    // Deterministic on the server and on the first client render: no query
    // string, no storage, so this is exactly `to`.
    const [href, setHref] = useState(to);

    useEffect(() => {
      setHref(withAttribution(to, location.search));
    }, [to, location.search]);

    return (
      <Link ref={ref} to={href} {...rest}>
        {children}
      </Link>
    );
  },
);

BookingLink.displayName = "BookingLink";

export default BookingLink;
