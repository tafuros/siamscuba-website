import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Compass, BookOpen, GraduationCap, Waves } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Served two ways:
 *  - client-side, via the `path: "*"` catch-all during SPA navigation
 *  - as a static page, via the `path: "404"` route which prerenders
 *    dist/404.html. Vercel serves that file (with a real 404 status) for any
 *    request matching no other file, so mistyped and stale URLs land here
 *    instead of on Vercel's raw text error page.
 */

const destinations = [
  {
    to: "/#courses",
    icon: GraduationCap,
    title: "PADI courses",
    body: "From your first breath underwater through to instructor.",
  },
  {
    to: "/fun-dives",
    icon: Waves,
    title: "Fun diving",
    body: "Already certified? Book a dive with us.",
  },
  {
    to: "/dive-sites",
    icon: Compass,
    title: "Dive sites",
    body: "The pinnacles, wrecks and bays around Koh Tao.",
  },
  {
    to: "/blog",
    icon: BookOpen,
    title: "Koh Tao guide",
    body: "Prices, seasons, beaches, food and getting around.",
  },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Page Not Found | Siam Scuba"
        description="That page does not exist. Find our PADI courses, fun diving, dive sites and Koh Tao guide instead."
        noindex
      />
      <Navbar />

      <main className="section-padding">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="font-display text-6xl font-bold text-primary/30 md:text-7xl">404</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground md:text-3xl">
            This page drifted off the map
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-foreground/70">
            The link may be old, or the address slightly off. Here is where most people were
            heading:
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {destinations.map(({ to, icon: Icon, title, body }) => {
              const inner = (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-start">
                    <span className="block font-semibold text-foreground">{title}</span>
                    <span className="mt-0.5 block text-sm text-foreground/70">{body}</span>
                  </span>
                </>
              );
              const cls =
                "flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-start " +
                "transition-colors hover:border-primary/40 hover:bg-primary/5";

              // Hash targets need a real anchor so the browser scrolls to the id.
              return to.includes("#") ? (
                <a key={to} href={to} className={cls}>
                  {inner}
                </a>
              ) : (
                <Link key={to} to={to} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>

          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to the homepage
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
