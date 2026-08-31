import { useCurrency } from "@/lib/CurrencyContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { formatBaht } from "@/lib/currency";

const LOCALE_BY_LANG: Record<string, string> = {
  en: "en-US",
  he: "he-IL",
  es: "es-ES",
  fr: "fr-FR",
};

type PriceProps = {
  /** The real price, in Thai Baht. Always rendered. */
  thb: number;
  /**
   * Where the estimate goes. "block" puts it on its own line under the Baht
   * figure (price tags, cards); "inline" keeps it on the same line (tight rows,
   * table cells). Defaults to block.
   */
  estimate?: "block" | "inline" | "none";
  className?: string;
  /** Extra classes for the estimate line only. */
  estimateClassName?: string;
};

/**
 * A price tag: the Baht amount, plus an indicative conversion when the visitor
 * has picked another currency.
 *
 * THE BAHT FIGURE IS NEVER REPLACED. This component cannot render a foreign
 * amount on its own - see the rule at the top of src/lib/currency.ts. What the
 * visitor picks changes what is shown BESIDE the price, never the price.
 *
 * Renders nothing but Baht when: the visitor is on THB (the default, so most
 * first visits), rates failed to load, or this currency has no rate. That is
 * deliberate - a price tag with no estimate is correct; one with a broken
 * estimate is not.
 *
 * Digit grouping follows the READING language, not the currency: a French page
 * writes ฿12 000, a Spanish one ฿12.000. Those conventions are already used in
 * the hand-written copy around it, so a tag that ignored them would look wrong
 * on the page even while being numerically right.
 */
const Price = ({ thb, estimate = "block", className, estimateClassName }: PriceProps) => {
  const { language } = useLanguage();
  const { convert } = useCurrency();

  const locale = LOCALE_BY_LANG[language] ?? "en-US";
  const baht = formatBaht(thb, locale);
  const approx = estimate === "none" ? null : convert(thb);

  if (!approx) return <span className={className}>{baht}</span>;

  if (estimate === "inline") {
    return (
      <span className={className}>
        {baht}{" "}
        <span className={estimateClassName ?? "text-[0.8em] font-normal opacity-60"}>
          {approx}
        </span>
      </span>
    );
  }

  return (
    <span className={className}>
      {baht}
      <span
        className={
          estimateClassName ?? "block text-[0.7em] font-normal leading-tight opacity-60"
        }
      >
        {approx}
      </span>
    </span>
  );
};

/**
 * Just the estimate line, for the surfaces whose Baht figure is already laid
 * out in a way `Price` would disturb - the hotel room card (which slots a
 * per-night / per-bed unit between the number and the estimate) and the Phuket
 * and Similan trip cards (whose "THB" suffix is styled as part of the heading).
 *
 * Renders nothing when there is nothing honest to say, so it is safe to drop
 * next to any Baht figure. The Baht figure stays exactly where it was: this
 * component only ever ADDS a line.
 */
export const PriceEstimate = ({ thb, className }: { thb: number; className?: string }) => {
  const { convert } = useCurrency();
  const approx = convert(thb);
  if (!approx) return null;
  return <span className={className ?? "block text-xs opacity-60"}>{approx}</span>;
};

export default Price;
