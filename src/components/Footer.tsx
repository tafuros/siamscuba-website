import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import padi from "@/assets/padi-logo.png";

// Same fixed URL as the entry gate's logo (see EntryGate.tsx) - one cached download.
const logo = "/brand/siam-logo-lockup.webp";
import { useLanguage } from "@/i18n/LanguageContext";
import { openGate } from "@/utils/gateBus";
import { conservationPath } from "@/lib/conservationCopy";
import { languageGuidePath } from "@/lib/localeRoutes";

const Footer = () => {
  const { t, language } = useLanguage();
  const guidePath = languageGuidePath(language);

  const quickLinks = [
    { label: t("nav_courses"), id: "courses" },
    { label: t("nav_fun_diving"), id: "fun-diving" },
    { label: t("nav_boats"), id: "boats" },
    { label: t("nav_about"), id: "about" },
  ];

  return (
    <footer className="bg-foreground text-background/70 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            {/* Full lockup (mark + wordmark + "Scuba Dive Center"), so the footer
                carries the complete brand signature. Sized taller than the old
                square mark because the tagline line is unreadable below ~90px. */}
            <img src={logo} alt="Siam Scuba - Scuba Dive Center" width={486} height={600} loading="lazy" decoding="async" className="h-24 w-auto mb-3" />
            <p className="text-sm text-background/50 mb-3">{t("footer_desc")}</p>
            <img src={padi} alt="PADI Dive Center" className="h-8 w-auto opacity-70" />
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold text-background mb-3">{t("footer_contact")}</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://maps.app.goo.gl/U3JzU7fcJsdqVR768"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <MapPin className="h-4 w-4 text-primary" /> Sairee Beach, Koh Tao
                </a>
              </li>
              <li>
                <a
                  href="tel:+66825068898"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 text-primary" /> +66 82 506 8898
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@siamscuba.com"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 text-primary" /> info@siamscuba.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold text-background mb-3">{t("footer_links")}</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dive-sites" className="hover:text-primary transition-colors">
                  {t("nav_dive_sites")}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">
                  {t("nav_koh_tao_guide")}
                </Link>
              </li>
              {/* Site-wide entry point to /conservation. Without it the page is
                  reachable only from the entry gate, which leaves it orphaned
                  from the internal link graph the way the campaign landers are.
                  Points at the visitor's own language twin - all four exist. */}
              <li>
                <Link
                  to={conservationPath(language)}
                  className="hover:text-primary transition-colors"
                >
                  {t("nav_conservation")}
                </Link>
              </li>
              {/* The Hebrew and Spanish long-form guides (/he, /es). The
                  language switcher used to be the only way into them, by
                  hijacking the flag - it dropped a homepage reader into a
                  2,000-word article, so that stopped on 2026-08-30. Without
                  this link they would have no internal inbound link at all,
                  which is the orphaned-lander problem again. Rendered only for
                  a visitor already reading in that language: it is a guide
                  offered to its own audience, not a language control. */}
              {guidePath && (
                <li>
                  <Link to={guidePath} className="hover:text-primary transition-colors">
                    {t("nav_language_guide")}
                  </Link>
                </li>
              )}
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => document.querySelector(`#${link.id}`)?.scrollIntoView({ behavior: "smooth" })}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={openGate} className="hover:text-primary transition-colors">
                  {t("nav_welcome")}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/40">
          <span>© {new Date().getFullYear()} Siam Scuba. {t("footer_rights")}</span>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/accessibility" className="hover:text-primary transition-colors">{t("footer_accessibility")}</Link>
            <Link to="/data-deletion" className="hover:text-primary transition-colors">Data Deletion</Link>
          </nav>
        </div>

        <div className="mt-5 flex justify-center">
          <a
            href="https://tafuros.com/?ref=siamscuba"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-background/40 transition-colors hover:text-primary"
            aria-label="Built by Tafuros"
          >
            Built by Tafuros
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
