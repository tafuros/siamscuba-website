import PadiStars from "./PadiStars";

/**
 * The five PADI stars + a short label, used above the pro-level headings
 * (Go Pro, Divemaster). Ben, 2026-09-27: PADI is the name people recognise, so
 * this line is set large enough to read at a glance, not as a tiny eyebrow.
 *
 * `inline` renders it as a block <span> so it can sit INSIDE an <h1> - the
 * Divemaster lander does that, which puts "PADI Divemaster · Koh Tao" at the
 * start of the page's main heading, where Google weighs it most.
 */
interface PadiKickerProps {
  children: React.ReactNode;
  inline?: boolean;
  className?: string;
}

const PadiKicker = ({ children, inline = false, className = "" }: PadiKickerProps) => {
  const Tag = inline ? "span" : "p";
  return (
    <Tag
      className={`flex items-center gap-3 font-body text-base font-semibold uppercase leading-none tracking-[0.14em] text-[#7fb8cf] sm:gap-4 sm:text-xl ${className}`}
    >
      <PadiStars className="h-5 w-5 sm:h-6 sm:w-6" />
      <span>{children}</span>
    </Tag>
  );
};

export default PadiKicker;
