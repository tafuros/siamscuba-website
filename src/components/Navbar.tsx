import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/siam-logo.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SiteSearch from "@/components/SiteSearch";
import { useLanguage } from "@/i18n/LanguageContext";
import { trackWhatsAppClick } from "@/utils/tracking";

const WHATSAPP_URL = "https://wa.me/972528641581";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { label: t("nav_courses"), href: "#courses" },
    { label: t("nav_fun_diving"), href: "#fun-diving" },
    { label: t("nav_boats"), href: "#boats" },
    { label: t("nav_koh_tao_guide"), href: "/blog" },
    { label: t("nav_about"), href: "#about" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const location = useLocation();

  const handleNav = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/")) return;
    if (location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex flex-col items-center px-4">
        <div className="flex items-center justify-between w-full py-2">
          {/* Desktop left links */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.slice(0, 2).map((link) => {
              const glassClasses = "px-4 py-1.5 rounded-full text-sm font-semibold text-foreground backdrop-blur-md bg-white/15 border border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.3)] hover:bg-white/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-0.5 transition-all duration-200";
              return link.href.startsWith("/") ? (
                <Link key={link.href} to={link.href} className={glassClasses}>
                  {link.label}
                </Link>
              ) : (
                <button key={link.href} onClick={() => handleNav(link.href)} className={glassClasses}>
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Mobile hamburger (left side) */}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Centered Logo — navigates home from any page, scrolls to top on home */}
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center"
          >
            <img src={logo} alt="Siam Scuba" className="h-24 md:h-28 w-auto" />
          </Link>

          {/* Desktop right links */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.slice(2).map((link) => {
              const glassClasses = "px-4 py-1.5 rounded-full text-sm font-semibold text-foreground backdrop-blur-md bg-white/15 border border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.3)] hover:bg-white/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-0.5 transition-all duration-200";
              return link.href.startsWith("/") ? (
                <Link key={link.href} to={link.href} className={glassClasses}>
                  {link.label}
                </Link>
              ) : (
                <button key={link.href} onClick={() => handleNav(link.href)} className={glassClasses}>
                  {link.label}
                </button>
              );
            })}
            <SiteSearch />
            <LanguageSwitcher />
            <Button asChild size="sm" className="rounded-full px-6 bg-accent/80 backdrop-blur-md hover:bg-accent/95 text-accent-foreground border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5">
              <Link to="/fun-dive-booking">{t("nav_book_now")}</Link>
            </Button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ location: "navbar", url: WHATSAPP_URL })}
              className="rounded-full px-4 py-1.5 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1da851] shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-200"
            >
              WhatsApp
            </a>
          </div>

          {/* Mobile: language switcher + search */}
          <div className="md:hidden flex items-center gap-2">
            <SiteSearch />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-border">
          <div className="container mx-auto py-4 px-4 flex flex-col gap-3">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} className="text-left py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ) : (
                <button key={link.href} onClick={() => handleNav(link.href)} className="text-left py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  {link.label}
                </button>
              )
            )}
            <Button asChild className="rounded-full bg-accent/80 backdrop-blur-md hover:bg-accent/95 text-accent-foreground border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 mt-2">
              <Link to="/fun-dive-booking">{t("nav_book_now")}</Link>
            </Button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ location: "navbar", url: WHATSAPP_URL })}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white text-center bg-[#25D366] hover:bg-[#1da851] transition-all duration-200 mt-1"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
