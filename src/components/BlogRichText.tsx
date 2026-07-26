import { type ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * Minimal inline markup for blog paragraphs.
 *
 * Blog content lives as plain strings in `src/data/blogPosts.ts`, which meant a
 * paragraph could never contain a link. Rather than pulling in a markdown
 * renderer (and its XSS surface) we support exactly two inline forms:
 *
 *   [label](https://example.com)  -> external anchor (new tab, nofollow)
 *   [label](/courses)             -> internal react-router Link
 *   **bold**                      -> <strong>
 *
 * Anything else is rendered as literal text, so existing posts are unaffected.
 */

// Only absolute http(s), root-relative, mailto: and tel: targets are allowed.
// This deliberately excludes javascript: and data: URLs.
const INLINE_RE = /\[([^\]\n]+)\]\(((?:https?:\/\/|\/|mailto:|tel:)[^)\s]+)\)|\*\*([^*\n]+)\*\*/g;

const LINK_CLASS =
  "font-medium text-primary underline decoration-primary/40 decoration-2 underline-offset-2 " +
  "transition-colors hover:text-primary/80 hover:decoration-primary";

export function renderInline(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  INLINE_RE.lastIndex = 0;
  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));

    const [full, label, href, bold] = match;

    if (bold !== undefined) {
      nodes.push(
        <strong key={key++} className="font-semibold text-foreground">
          {bold}
        </strong>,
      );
    } else if (href.startsWith("/")) {
      nodes.push(
        <Link key={key++} to={href} className={LINK_CLASS}>
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={LINK_CLASS}
        >
          {label}
        </a>,
      );
    }

    cursor = match.index + full.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  // Plain string when there was no markup at all - keeps the DOM identical for
  // every pre-existing post.
  return nodes.length === 1 && typeof nodes[0] === "string" ? nodes[0] : <>{nodes}</>;
}

/** A row of call-to-action pills rendered under a section. */
export function SectionLinks({
  links,
}: {
  links: { label: string; url: string }[];
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {links.map((link, i) => {
        const internal = link.url.startsWith("/");
        const cls =
          "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold " +
          "transition-colors " +
          (i === 0
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border border-primary/30 text-primary hover:bg-primary/10");
        return internal ? (
          <Link key={i} to={link.url} className={cls}>
            {link.label}
          </Link>
        ) : (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={cls}
          >
            {link.label}
          </a>
        );
      })}
    </div>
  );
}

/** A compact, scrollable data table (fares, prices, comparisons). */
export function SectionTable({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: string[][];
  caption?: string;
}) {
  return (
    <figure className="mt-6">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="bg-muted/60">
              {head.map((cell, i) => (
                <th
                  key={i}
                  scope="col"
                  className={
                    "px-4 py-3 font-display text-xs uppercase tracking-wider text-muted-foreground " +
                    (i === 0 ? "text-start" : "text-end")
                  }
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="border-t border-border/70">
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className={
                      "px-4 py-3 " +
                      (c === 0
                        ? "text-start text-foreground/90"
                        : "text-end font-semibold text-foreground whitespace-nowrap")
                    }
                  >
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
