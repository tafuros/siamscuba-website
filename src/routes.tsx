import type { RouteRecord } from "vite-react-ssg";
import App from "./App";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import Index from "./pages/Index";
import { blogPosts } from "./data/blogPosts";
import { diveSites } from "./data/diveSites";
import { SLUG_TO_COURSE } from "./lib/courseSlugMap";

// react-router data routers want { Component } from lazy().
// Our pages all use default exports, so wrap them.
const lazyDefault =
  <T extends { default: React.ComponentType<unknown> }>(importFn: () => Promise<T>) =>
  async () => {
    const m = await importFn();
    return { Component: m.default };
  };

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <App />,
    // Catches stale-deploy navigation failures (old tab + new deploy) and
    // auto-reloads once; see RouteErrorBoundary for the full story.
    errorElement: <RouteErrorBoundary />,
    entry: "src/App.tsx",
    children: [
      { index: true, element: <Index />, entry: "src/pages/Index.tsx" },
      {
        path: "privacy",
        lazy: lazyDefault(() => import("./pages/Privacy")),
        entry: "src/pages/Privacy.tsx",
      },
      {
        path: "terms",
        lazy: lazyDefault(() => import("./pages/Terms")),
        entry: "src/pages/Terms.tsx",
      },
      {
        path: "data-deletion",
        lazy: lazyDefault(() => import("./pages/DataDeletion")),
        entry: "src/pages/DataDeletion.tsx",
      },
      {
        path: "fun-dive-booking",
        lazy: lazyDefault(() => import("./pages/FunDiveBookingPage")),
        entry: "src/pages/FunDiveBookingPage.tsx",
      },
      {
        path: "blog",
        lazy: lazyDefault(() => import("./pages/BlogPage")),
        entry: "src/pages/BlogPage.tsx",
      },
      {
        path: "blog/:slug",
        lazy: lazyDefault(() => import("./pages/BlogPostPage")),
        entry: "src/pages/BlogPostPage.tsx",
        getStaticPaths: () => blogPosts.filter((p) => p.language !== "es").map((p) => `blog/${p.slug}`),
      },
      {
        path: "es/blog/:slug",
        lazy: lazyDefault(() => import("./pages/BlogPostPage")),
        entry: "src/pages/BlogPostPage.tsx",
        getStaticPaths: () => blogPosts.filter((p) => p.language === "es").map((p) => `es/blog/${p.slug}`),
      },
      {
        path: "dive-sites",
        lazy: lazyDefault(() => import("./pages/DiveSitesPage")),
        entry: "src/pages/DiveSitesPage.tsx",
      },
      {
        path: "dive-sites/:siteSlug",
        lazy: lazyDefault(() => import("./pages/DiveSitePage")),
        entry: "src/pages/DiveSitePage.tsx",
        getStaticPaths: () => diveSites.map((s) => `dive-sites/${s.slug}`),
      },
      {
        path: "he",
        lazy: lazyDefault(() => import("./pages/HebrewLanding")),
        entry: "src/pages/HebrewLanding.tsx",
      },
      // Spanish index. The /es/* sub-routes (landers + blog) shipped long
      // before this did, so /es itself fell through to :courseSlug and served
      // NotFound - the entry point of the language with the most traffic.
      {
        path: "es",
        lazy: lazyDefault(() => import("./pages/SpanishLanding")),
        entry: "src/pages/SpanishLanding.tsx",
      },
      {
        path: "ad",
        lazy: lazyDefault(() => import("./pages/AdPage")),
        entry: "src/pages/AdPage.tsx",
      },
      // Paid-campaign landers — must come BEFORE :courseSlug (which is a greedy
      // dynamic match). 5 offers × 3 languages.
      {
        path: "discover-scuba-diving",
        lazy: lazyDefault(() => import("./pages/landers/DsdEnPage")),
        entry: "src/pages/landers/DsdEnPage.tsx",
      },
      {
        path: "es/discover-scuba-diving",
        lazy: lazyDefault(() => import("./pages/landers/DsdEsPage")),
        entry: "src/pages/landers/DsdEsPage.tsx",
      },
      {
        path: "he/discover-scuba-diving",
        lazy: lazyDefault(() => import("./pages/landers/DsdHePage")),
        entry: "src/pages/landers/DsdHePage.tsx",
      },
      {
        path: "open-water-course",
        lazy: lazyDefault(() => import("./pages/landers/OwdEnPage")),
        entry: "src/pages/landers/OwdEnPage.tsx",
      },
      {
        path: "es/open-water-course",
        lazy: lazyDefault(() => import("./pages/landers/OwdEsPage")),
        entry: "src/pages/landers/OwdEsPage.tsx",
      },
      {
        path: "he/open-water-course",
        lazy: lazyDefault(() => import("./pages/landers/OwdHePage")),
        entry: "src/pages/landers/OwdHePage.tsx",
      },
      {
        path: "advanced-open-water-course",
        lazy: lazyDefault(() => import("./pages/landers/AowEnPage")),
        entry: "src/pages/landers/AowEnPage.tsx",
      },
      {
        path: "es/advanced-open-water-course",
        lazy: lazyDefault(() => import("./pages/landers/AowEsPage")),
        entry: "src/pages/landers/AowEsPage.tsx",
      },
      {
        path: "he/advanced-open-water-course",
        lazy: lazyDefault(() => import("./pages/landers/AowHePage")),
        entry: "src/pages/landers/AowHePage.tsx",
      },
      {
        path: "fun-dives",
        lazy: lazyDefault(() => import("./pages/landers/FunDiveEnPage")),
        entry: "src/pages/landers/FunDiveEnPage.tsx",
      },
      {
        path: "es/fun-dives",
        lazy: lazyDefault(() => import("./pages/landers/FunDiveEsPage")),
        entry: "src/pages/landers/FunDiveEsPage.tsx",
      },
      {
        path: "he/fun-dives",
        lazy: lazyDefault(() => import("./pages/landers/FunDiveHePage")),
        entry: "src/pages/landers/FunDiveHePage.tsx",
      },
      {
        path: "fr/fun-dives",
        lazy: lazyDefault(() => import("./pages/landers/FunDiveFrPage")),
        entry: "src/pages/landers/FunDiveFrPage.tsx",
      },
      // /koh-tao-diving (+ es/he) retired 2026-07-15 — consolidated into
      // /fun-dives. vercel.json 301s the old paths to the fun-dives twins so
      // their SEO equity + stray links flow to the live target.
      {
        path: "sail-rock-diving",
        lazy: lazyDefault(() => import("./pages/landers/SailRockEnPage")),
        entry: "src/pages/landers/SailRockEnPage.tsx",
      },
      {
        path: "es/sail-rock-diving",
        lazy: lazyDefault(() => import("./pages/landers/SailRockEsPage")),
        entry: "src/pages/landers/SailRockEsPage.tsx",
      },
      {
        path: "he/sail-rock-diving",
        lazy: lazyDefault(() => import("./pages/landers/SailRockHePage")),
        entry: "src/pages/landers/SailRockHePage.tsx",
      },
      {
        path: "similan",
        lazy: lazyDefault(() => import("./pages/SiamSimilansPage")),
        entry: "src/pages/SiamSimilansPage.tsx",
      },
      {
        path: "phuket-diving",
        lazy: lazyDefault(() => import("./pages/SiamPhuketPage")),
        entry: "src/pages/SiamPhuketPage.tsx",
      },
      // /freediving is retired (we no longer sell freediving). vercel.json 301s
      // it to "/" so the inbound links + accrued SEO signal are not thrown away.
      // Destination of the entry gate's fourth card (conservation / PADI AWARE).
      // Full en/he/es/fr cluster - the four paths are declared together in
      // LOCALE_FAMILIES (hreflang) and CONSERVATION_LANGS (gate routing).
      {
        path: "conservation",
        lazy: lazyDefault(() => import("./pages/ConservationPage")),
        entry: "src/pages/ConservationPage.tsx",
      },
      {
        path: "he/conservation",
        lazy: lazyDefault(() => import("./pages/ConservationHePage")),
        entry: "src/pages/ConservationHePage.tsx",
      },
      {
        path: "es/conservation",
        lazy: lazyDefault(() => import("./pages/ConservationEsPage")),
        entry: "src/pages/ConservationEsPage.tsx",
      },
      {
        path: "fr/conservation",
        lazy: lazyDefault(() => import("./pages/ConservationFrPage")),
        entry: "src/pages/ConservationFrPage.tsx",
      },
      // Go Pro (Divemaster + IDC) - destination of the entry gate's fifth card
      // and the homepage band. Full en/he/es/fr cluster, declared together in
      // LOCALE_FAMILIES so hreflang stays reciprocal.
      {
        path: "go-pro",
        lazy: lazyDefault(() => import("./pages/GoProPage")),
        entry: "src/pages/GoProPage.tsx",
      },
      {
        path: "he/go-pro",
        lazy: lazyDefault(() => import("./pages/GoProHePage")),
        entry: "src/pages/GoProHePage.tsx",
      },
      {
        path: "es/go-pro",
        lazy: lazyDefault(() => import("./pages/GoProEsPage")),
        entry: "src/pages/GoProEsPage.tsx",
      },
      {
        path: "fr/go-pro",
        lazy: lazyDefault(() => import("./pages/GoProFrPage")),
        entry: "src/pages/GoProFrPage.tsx",
      },
      // Siam Hotel & Hostel - the property's own mini-site. Standalone chrome
      // (its own nav + footer), full en/he/es/fr cluster declared together in
      // LOCALE_FAMILIES so hreflang stays reciprocal.
      {
        path: "hotel",
        lazy: lazyDefault(() => import("./pages/HotelPage")),
        entry: "src/pages/HotelPage.tsx",
      },
      {
        path: "he/hotel",
        lazy: lazyDefault(() => import("./pages/HotelHePage")),
        entry: "src/pages/HotelHePage.tsx",
      },
      {
        path: "es/hotel",
        lazy: lazyDefault(() => import("./pages/HotelEsPage")),
        entry: "src/pages/HotelEsPage.tsx",
      },
      {
        path: "fr/hotel",
        lazy: lazyDefault(() => import("./pages/HotelFrPage")),
        entry: "src/pages/HotelFrPage.tsx",
      },
      {
        path: "accessibility",
        lazy: lazyDefault(() => import("./pages/Accessibility")),
        entry: "src/pages/Accessibility.tsx",
      },
      // Prerenders to dist/404.html, which Vercel serves (with a real 404
      // status) for any path that matches no file. Without this the SPA
      // rewrite in vercel.json never produces the NotFound page and visitors
      // hitting an old or mistyped URL get Vercel's raw text error instead.
      // Must stay ABOVE :courseSlug, or "404" is swallowed as a course slug.
      {
        path: "404",
        lazy: lazyDefault(() => import("./pages/NotFound")),
        entry: "src/pages/NotFound.tsx",
      },
      {
        path: ":courseSlug",
        lazy: lazyDefault(() => import("./pages/CoursePage")),
        entry: "src/pages/CoursePage.tsx",
        getStaticPaths: () => Object.keys(SLUG_TO_COURSE),
      },
      {
        path: "*",
        lazy: lazyDefault(() => import("./pages/NotFound")),
        entry: "src/pages/NotFound.tsx",
      },
    ],
  },
];
