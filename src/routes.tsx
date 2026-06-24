import type { RouteRecord } from "vite-react-ssg";
import App from "./App";
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
        path: "privacy-policy",
        lazy: lazyDefault(() => import("./pages/PrivacyPolicy")),
        entry: "src/pages/PrivacyPolicy.tsx",
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
        path: "koh-tao-diving",
        lazy: lazyDefault(() => import("./pages/landers/KohTaoEnPage")),
        entry: "src/pages/landers/KohTaoEnPage.tsx",
      },
      {
        path: "es/koh-tao-diving",
        lazy: lazyDefault(() => import("./pages/landers/KohTaoEsPage")),
        entry: "src/pages/landers/KohTaoEsPage.tsx",
      },
      {
        path: "he/koh-tao-diving",
        lazy: lazyDefault(() => import("./pages/landers/KohTaoHePage")),
        entry: "src/pages/landers/KohTaoHePage.tsx",
      },
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
      {
        path: "freediving",
        lazy: lazyDefault(() => import("./pages/SiamFreedivingPage")),
        entry: "src/pages/SiamFreedivingPage.tsx",
      },
      {
        path: "accessibility",
        lazy: lazyDefault(() => import("./pages/Accessibility")),
        entry: "src/pages/Accessibility.tsx",
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
