// Dive-site content for the dedicated /dive-sites section.
//
// Mirrors the blogPosts.ts pattern (data-as-TS, rendered by pages, fed into the
// sitemap + getStaticPaths). Prose, stats and "things to see" lists are our own
// original copy, ported from the Siam Scuba printed Dive Guide. The schematic
// maps + locators are our own original SVG art (imported ?raw and inlined so
// they inherit the page font and scale responsively).
//
// To add a site: drop a photo at public/dive-sites/<slug>.webp, draw a map +
// locator SVG under src/assets/dive-maps/, and append a DiveSite object. The
// hub, routing, sitemap and JSON-LD all scale off this array automatically.

import twinsMap from "@/assets/dive-maps/twins-map.svg?raw";
import twinsLocator from "@/assets/dive-maps/twins-locator.svg?raw";
import chumphonMap from "@/assets/dive-maps/chumphon-pinnacle-map.svg?raw";
import chumphonLocator from "@/assets/dive-maps/chumphon-pinnacle-locator.svg?raw";
import sailRockMap from "@/assets/dive-maps/sail-rock-map.svg?raw";
import sailRockLocator from "@/assets/dive-maps/sail-rock-locator.svg?raw";

export interface ThingToSee {
  label: string;
  /** Highlighted as a seasonal / "if you're lucky" sighting (gold chip). */
  seasonal?: boolean;
}

export interface DiveSite {
  slug: string;
  /** Display name, e.g. "Chumphon Pinnacle". */
  name: string;
  /** Local / Thai name + bearing, e.g. "Hin Bai · between Koh Tao & Koh Phangan". */
  localName: string;
  /** One-line summary for cards + meta description. */
  excerpt: string;
  depthRange: string; // e.g. "5 - 40 m"
  level: string; // certification level, e.g. "Advanced"
  difficulty: string; // e.g. "Easy"
  bestFor: string; // headline draw, e.g. "Big schools & The Chimney"
  /** Lead paragraph (larger, lighter). */
  intro: string;
  /** Body paragraphs. */
  body: string[];
  thingsToSee: ThingToSee[];
  gettingThere: string;
  /** Footnote shown when any seasonal sighting is listed (e.g. whale-shark months). */
  seasonNote?: string;
  /** Path under public/, e.g. "/dive-sites/sail-rock.webp". */
  photo: string;
  /** Raw SVG markup, inlined into the DOM. */
  mapSvg: string;
  locatorSvg: string;
  /** GeoCoordinates for Place JSON-LD. */
  coords?: { lat: number; lng: number };
  /** Cross-links — course slugs (see courseSlugMap.ts). */
  relatedCourses?: string[];
  /** Cross-links — blog post slugs (see blogPosts.ts). */
  relatedBlogSlugs?: string[];
  /** Featured on the homepage section + hub hero row. */
  featured?: boolean;
}

export const diveSites: DiveSite[] = [
  {
    slug: "twins",
    name: "Twins",
    localName: "Koh Nang Yuan · Gulf of Thailand",
    excerpt:
      "Shallow, sheltered and easy to navigate — the dive site where most divers on Koh Tao take their first breaths underwater.",
    depthRange: "5 - 19 m",
    level: "Open Water",
    difficulty: "Easy",
    bestFor: "First dives & training",
    intro:
      "Tucked against the western shoulder of Koh Nang Yuan, Twins is the dive site most people on Koh Tao remember first. Two main rock pinnacles rise from a pale sand floor, with a third, smaller mound sitting a little deeper to the south. The open sand between them gives the site its name - and makes it almost impossible to get lost.",
    body: [
      "Shallow, sheltered and rarely troubled by strong current, Twins is a natural classroom: it is where many divers on the island take their first breaths underwater. Hard corals and anemones blanket the rock while fusiliers and snapper sweep overhead. Look closer and the site rewards you - blue-spotted stingrays settle into the sand, moray eels watch from the cracks, and on a calm morning a green turtle may drift through on its way to the next bay.",
    ],
    thingsToSee: [
      { label: "Hard corals" },
      { label: "Anemonefish" },
      { label: "Blue-spotted stingray" },
      { label: "Moray eels" },
      { label: "Fusiliers & snapper" },
      { label: "Christmas tree worms" },
      { label: "Yellow boxfish" },
      { label: "Nudibranchs" },
      { label: "Green turtle", seasonal: true },
    ],
    gettingThere:
      "About 10 minutes by boat from Mae Haad. A sheltered site that is diveable in almost any conditions, year-round.",
    seasonNote: "Seasonal sightings are never guaranteed - that is part of the magic.",
    photo: "/dive-sites/twins.webp",
    mapSvg: twinsMap,
    locatorSvg: twinsLocator,
    coords: { lat: 10.1225, lng: 99.8065 },
    relatedCourses: ["open-water", "advanced-open-water"],
    relatedBlogSlugs: ["koh-tao-dive-sites-guide", "padi-open-water-koh-tao-what-to-expect"],
    featured: true,
  },
  {
    slug: "chumphon-pinnacle",
    name: "Chumphon Pinnacle",
    localName: "Chumphon Pinnacle · 11 km NW of Koh Tao",
    excerpt:
      "The most celebrated dive in the Gulf of Thailand - a granite tower wrapped in soft coral, and a whale-shark magnet in season.",
    depthRange: "14 - 36 m",
    level: "Advanced",
    difficulty: "Advanced",
    bestFor: "Whale sharks*",
    intro:
      "Eleven kilometres off the north-west tip of Koh Tao, a single granite tower climbs out of the blue to within fourteen metres of the surface. This is Chumphon Pinnacle - the most celebrated dive in the Gulf of Thailand, and on its day, one of the most alive.",
    body: [
      "The main pinnacle is ringed by a scatter of smaller satellite rocks, their ledges and grooves upholstered in soft coral, sea whips, gorgonian fans and barrel sponges. Anemone gardens glow on the south-eastern side, home to pink anemonefish. Groupers hang in the current shadows while batfish and trevally patrol the open water. From March to May, and again from September to October, the site draws the visitor every diver hopes for - the whale shark, the largest fish in the sea, cruising slow circles around the rock.",
    ],
    thingsToSee: [
      { label: "Granite topography" },
      { label: "Soft corals & sea whips" },
      { label: "Gorgonian fans" },
      { label: "Barrel sponges" },
      { label: "Pink anemonefish" },
      { label: "Groupers" },
      { label: "Bigeye trevally" },
      { label: "Batfish" },
      { label: "Whale shark", seasonal: true },
    ],
    gettingThere:
      "A 45-minute boat ride north-west of the island. Current can be strong - a good buoyancy level and an Advanced certification are recommended.",
    seasonNote:
      "*Whale sharks are seasonal and never guaranteed - best chances are March-May and September-October.",
    photo: "/dive-sites/chumphon-pinnacle.webp",
    mapSvg: chumphonMap,
    locatorSvg: chumphonLocator,
    coords: { lat: 10.1797, lng: 99.7486 },
    relatedCourses: ["advanced-open-water", "deep-diving"],
    relatedBlogSlugs: [
      "koh-tao-dive-sites-guide",
      "padi-advanced-open-water-koh-tao",
      "best-time-to-dive-koh-tao",
    ],
    featured: true,
  },
  {
    slug: "sail-rock",
    name: "Sail Rock",
    localName: "Hin Bai · between Koh Tao & Koh Phangan",
    excerpt:
      "The Gulf of Thailand's signature pinnacle dive - towering schools of barracuda and trevally, and the famous vertical swim-through, The Chimney.",
    depthRange: "5 - 40 m",
    level: "Advanced",
    difficulty: "Advanced",
    bestFor: "Big schools & The Chimney",
    intro:
      "Sail Rock - Hin Bai to Thai boat crews - is the one pinnacle that breaks the surface. It stands alone in open water between Koh Tao and Koh Phangan: a lump of granite barely the size of a fishing boat above the waterline, and a cathedral beneath it.",
    body: [
      "Its walls drop almost vertically to around thirty metres before the seabed slopes away into the dark. Because it sits far from any reef, Sail Rock works like a magnet - chevron barracuda wind into slow tornadoes, bigeye trevally hunt in shimmering walls, and snapper and fusiliers crowd every ledge. The site's signature is The Chimney, a vertical swim-through that swallows divers at eighteen metres and releases them, blinking, into the light at six.",
    ],
    thingsToSee: [
      { label: "The Chimney" },
      { label: "Chevron barracuda" },
      { label: "Bigeye trevally" },
      { label: "Snapper & fusiliers" },
      { label: "Pink anemonefish" },
      { label: "Groupers" },
      { label: "Stonefish" },
      { label: "Whale shark", seasonal: true },
    ],
    gettingThere:
      "Reached on a full-day trip from Koh Tao. The Chimney swim-through calls for confident buoyancy and is best kept for experienced divers.",
    seasonNote: "Whale sharks are seasonal and never guaranteed.",
    photo: "/dive-sites/sail-rock.webp",
    mapSvg: sailRockMap,
    locatorSvg: sailRockLocator,
    coords: { lat: 9.9667, lng: 99.9667 },
    relatedCourses: ["advanced-open-water", "deep-diving"],
    relatedBlogSlugs: ["koh-tao-dive-sites-guide", "best-time-to-dive-koh-tao"],
    featured: true,
  },
];

export const findDiveSite = (slug?: string): DiveSite | undefined =>
  diveSites.find((s) => s.slug === slug);
