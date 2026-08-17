/**
 * Single source of truth for the brand mark as Google sees it.
 *
 * Before this file the Organization `logo` was spelled out in seven page files
 * and all seven pointed at `/favicon.png` - a 16px-first favicon doing duty as
 * a knowledge-panel logo - while the root `#organization` node in index.html
 * carried no `logo` at all. Three different answers to "what is the logo".
 *
 * `/logo-siam-scuba.png` is the dedicated artwork for this job: the full lockup
 * (mark + wordmark + "Scuba Dive Center") on a solid white ground, square, well
 * over Google's 112x112 minimum. Favicons stay separate on purpose - they are
 * the bare emblem, because the wordmark is mush below ~48px.
 *
 * Keep the literal in index.html's #organization node in sync with ORG_LOGO_URL.
 */
export const SITE_URL = "https://siamscuba.com";

export const ORG_LOGO_URL = `${SITE_URL}/logo-siam-scuba.png`;
export const ORG_LOGO_SIZE = 600;

/** The `logo` value for a schema.org Organization node. */
export const ORG_LOGO = {
  "@type": "ImageObject",
  url: ORG_LOGO_URL,
  width: ORG_LOGO_SIZE,
  height: ORG_LOGO_SIZE,
  caption: "Siam Scuba - Scuba Dive Center",
} as const;
