/**
 * The five red stars from the PADI 5 Star IDC lockup.
 *
 * Drawn rather than imaged: the supplied artwork (product 64192) must be used
 * as issued - never recoloured, cropped or stretched - so we do not slice it up
 * for UI. This is our own mark set in PADI's red (#E72129, sampled from that
 * artwork), which stays crisp at any size and costs no request.
 *
 * The vertical arrangement mirrors how the stars actually sit in the lockup:
 * a column running up the left edge, beside the mark rather than under it.
 */
interface PadiStarsProps {
  /** Tailwind size classes for one star. */
  className?: string;
  orientation?: "horizontal" | "vertical";
  /** Extra classes for the wrapper (positioning, self-alignment). */
  wrapperClassName?: string;
}

const PadiStars = ({
  className = "h-2.5 w-2.5",
  orientation = "horizontal",
  wrapperClassName = "",
}: PadiStarsProps) => (
  <span
    aria-hidden="true"
    className={`flex items-center ${
      orientation === "vertical" ? "flex-col gap-2.5 sm:gap-3" : "gap-[2px]"
    } ${wrapperClassName}`}
  >
    {[0, 1, 2, 3, 4].map((i) => (
      <svg key={i} viewBox="0 0 24 24" className={`${className} fill-[#E72129]`}>
        <path d="M12 .8l3.1 7.6 8.2.6-6.3 5.3 2 8-7-4.4-7 4.4 2-8L.7 9l8.2-.6z" />
      </svg>
    ))}
  </span>
);

export default PadiStars;
