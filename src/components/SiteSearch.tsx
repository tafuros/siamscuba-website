import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useLanguage } from "@/i18n/LanguageContext";

interface SearchItem {
  label: string;
  category: string;
  href: string;
}

const SiteSearch = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const items: SearchItem[] = [
    // Courses
    { label: t("course_dsd"), category: t("nav_courses"), href: "#courses" },
    { label: t("course_ow"), category: t("nav_courses"), href: "#courses" },
    { label: t("course_bubble"), category: t("nav_courses"), href: "#courses" },
    { label: t("course_aow"), category: t("nav_courses"), href: "#courses" },
    { label: t("course_rescue"), category: t("nav_courses"), href: "#courses" },
    { label: t("course_efr"), category: t("nav_courses"), href: "#courses" },
    { label: t("course_dm"), category: t("nav_courses"), href: "#courses" },
    { label: t("course_idc"), category: t("nav_courses"), href: "#courses" },
    { label: t("course_ppb"), category: t("courses_specialty"), href: "#courses" },
    { label: t("course_wreck"), category: t("courses_specialty"), href: "#courses" },
    { label: t("course_deep"), category: t("courses_specialty"), href: "#courses" },
    { label: t("course_dpv"), category: t("courses_specialty"), href: "#courses" },
    { label: t("course_sidemount"), category: t("courses_specialty"), href: "#courses" },
    // Fun Diving
    { label: t("nav_fun_diving"), category: t("nav_fun_diving"), href: "#fun-diving" },
    { label: "Sail Rock", category: t("nav_fun_diving"), href: "#fun-diving" },
    // (Boats / About left 2026-10-04 with their homepage sections.)
    { label: t("nav_dive_sites"), category: t("nav_dive_sites"), href: "/dive-sites" },
    // Blog
    { label: t("nav_koh_tao_guide"), category: "Blog", href: "/blog" },
  ];

  // Group items by category
  const grouped = items.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (href: string) => {
    setOpen(false);
    if (href.startsWith("/")) {
      navigate(href);
      return;
    }
    if (location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("search_placeholder") || "Search..."} />
        <CommandList>
          <CommandEmpty>{t("search_no_results") || "No results found."}</CommandEmpty>
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <CommandGroup key={category} heading={category}>
              {categoryItems.map((item) => (
                <CommandItem
                  key={item.label + item.href}
                  onSelect={() => handleSelect(item.href)}
                  className="cursor-pointer"
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SiteSearch;
