import { Fragment, type ReactNode } from "react";

/**
 * Renders `text` with every standalone "IDC" turned into a highlighted,
 * clickable element (Ben, 2026-09-25: in the Divemaster copy, every IDC
 * mention should take the reader to the IDC information).
 *
 * `renderLink` decides what the click does - the homepage dialog swaps to the
 * IDC dialog in place, the lander links to the Go Pro page - so this component
 * only owns the splitting.
 */
const IDC_RE = /\b(IDC)\b/;

interface IdcLinkTextProps {
  text: string;
  renderLink: (label: string, key: number) => ReactNode;
}

const IdcLinkText = ({ text, renderLink }: IdcLinkTextProps) => {
  const parts = text.split(IDC_RE);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) =>
        part === "IDC" ? renderLink(part, i) : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
};

export default IdcLinkText;
