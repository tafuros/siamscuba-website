import type { RouteRecord } from "vite-react-ssg";
import App from "./App";
import Index from "./pages/Index";
import { blogPosts } from "./data/blogPosts";
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
        path: "booking-confirmed",
        lazy: lazyDefault(() => import("./pages/BookingConfirmed")),
        entry: "src/pages/BookingConfirmed.tsx",
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
        path: "he",
        lazy: lazyDefault(() => import("./pages/HebrewLanding")),
        entry: "src/pages/HebrewLanding.tsx",
      },
      {
        path: "ad",
        lazy: lazyDefault(() => import("./pages/AdPage")),
        entry: "src/pages/AdPage.tsx",
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
