import { Fragment, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Plus } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { pathLanguage } from "@/i18n/LanguageContext";
import { FAQ_COPY, FAQ_LANGS, faqPath, faqSchema } from "@/data/faq";
import { buildWhatsAppLink, normalizeLang } from "@/utils/whatsapp";
import { trackWhatsAppClick } from "@/utils/tracking";
import type { Language } from "@/i18n/translations";

const SITE = "https://siamscuba.com";

/** Renders "[label](/path)" inside an answer as a router link. */
const RichText = ({ text }: { text: string }) => {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return <Fragment key={i}>{part}</Fragment>;
        return (
          <Link key={i} to={m[2]} className="font-medium text-primary underline underline-offset-4 hover:no-underline">
            {m[1]}
          </Link>
        );
      })}
    </>
  );
};

/**
 * /faq, /he/faq, /es/faq, /fr/faq - the site-wide FAQ (Ben, 2026-11-03).
 * One component for all four URLs; the language comes from the path prefix.
 */
const FaqPage = () => {
  const { pathname } = useLocation();
  const lang: Language = pathLanguage(pathname) ?? "en";
  const c = FAQ_COPY[lang];
  const rtl = lang === "he";
  const wa = buildWhatsAppLink({ topic: "general", lang: normalizeLang(lang) });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const alternates = Object.fromEntries(FAQ_LANGS.map((l) => [l, `${SITE}${faqPath(l)}`])) as Record<Language, string>;

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-background">
      <Seo
        title={c.seoTitle}
        description={c.seoDescription}
        canonical={`${SITE}${faqPath(lang)}`}
        hreflangAlternates={alternates}
        jsonLd={faqSchema(lang)}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: c.breadcrumb }]}
      />
      <Navbar />
      <main className="px-4 pb-20 pt-28 md:pt-32">
        <div className="mx-auto max-w-3xl">
          <header className="mb-10 text-center">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[.12em] text-primary">{c.eyebrow}</p>
            <h1 className="font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.08] text-foreground [text-wrap:balance]">
              {c.title}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">{c.sub}</p>
          </header>

          {/* Jump chips */}
          <nav aria-label={c.title} className="mb-12 flex flex-wrap justify-center gap-2">
            {c.groups.map((g, i) => (
              <a
                key={g.title}
                href={`#faq-${i}`}
                className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                {g.title}
              </a>
            ))}
          </nav>

          <div className="space-y-12">
            {c.groups.map((g, i) => (
              <section key={g.title} id={`faq-${i}`} className="scroll-mt-28">
                <h2 className="mb-3 font-display text-2xl font-semibold text-foreground">{g.title}</h2>
                <div className="divide-y divide-border/70 rounded-2xl border border-border/70 bg-card px-5 shadow-sm">
                  {g.items.map((f) => (
                    <details key={f.q} className="group">
                      <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                        {f.q}
                        <Plus
                          className="h-4 w-4 shrink-0 text-primary transition-transform duration-200 group-open:rotate-45"
                          aria-hidden="true"
                        />
                      </summary>
                      <p className="max-w-[62ch] pb-5 text-[16px] leading-[1.7] text-muted-foreground">
                        <RichText text={f.a} />
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-16 rounded-2xl bg-[#03152a] px-6 py-10 text-center text-white">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">{c.ctaTitle}</h2>
            <p className="mt-2 text-white/75">{c.ctaBody}</p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ location: "faq", url: wa })}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#0270B6] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#0286d8]"
            >
              <MessageCircle className="h-4 w-4" />
              {c.ctaButton}
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FaqPage;
