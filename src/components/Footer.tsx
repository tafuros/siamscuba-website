import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/siam-logo.png";
import padi from "@/assets/padi-logo.png";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

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
            <img src={logo} alt="Siam Scuba" className="h-10 w-auto mb-3" />
            <p className="text-sm text-background/50 mb-3">{t("footer_desc")}</p>
            <img src={padi} alt="PADI Dive Center" className="h-8 w-auto opacity-70" />
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-background mb-3">{t("footer_contact")}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Sairee Beach, Koh Tao</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +66 (0) 123 456 789</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> info@siamscuba.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-background mb-3">{t("footer_links")}</h4>
            <ul className="space-y-2 text-sm">
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
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-background/40">
          <span>© {new Date().getFullYear()} Siam Scuba. {t("footer_rights")}</span>
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
