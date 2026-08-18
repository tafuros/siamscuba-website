import { Link } from "react-router-dom";
import { MapPin, Waves, MessageCircle, ArrowRight, Info } from "lucide-react";
import type { Language } from "@/i18n/translations";
import {
  HOTEL_COPY,
  HOTEL_INFO,
  HOTEL_LANGS,
  diveSiteHomePath,
  hotelPath,
  hotelWhatsAppLink,
  sortedRooms,
} from "@/data/hotel";
import { trackWhatsAppClick } from "@/utils/tracking";
import RoomCard from "./RoomCard";
import HotelGallery from "./HotelGallery";
import PalmDecor from "./PalmDecor";

/**
 * The whole /hotel page, in one component, driven entirely by src/data/hotel.ts.
 *
 * It renders its OWN chrome (nav + footer) instead of the dive site's: the
 * hotel is a different brand with a different logo and a different call to
 * action, and dropping a guest looking for a bed into the dive shop's nav is
 * how you lose them. The only bridge is one deliberate cross-sell card.
 */

const LANG_LABELS: Record<Language, string> = {
  en: "EN",
  he: "עב",
  es: "ES",
  fr: "FR",
};

interface HotelContentProps {
  lang: Language;
}

const HotelContent = ({ lang }: HotelContentProps) => {
  const copy = HOTEL_COPY[lang];
  const rooms = sortedRooms();
  const rtl = lang === "he";
  const waHref = hotelWhatsAppLink(lang);

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className="min-h-screen overflow-x-hidden bg-[#f2f7fb] font-body text-[#072a45] antialiased"
      style={{
        backgroundImage:
          "radial-gradient(1200px 600px at 15% -5%, rgba(31,168,221,0.16), transparent 60%), radial-gradient(900px 500px at 95% 15%, rgba(246,239,226,0.9), transparent 55%)",
      }}
    >
      {/* ---------------------------------------------------------------- nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/55 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
          <a href="#top" className="flex shrink-0 items-center">
            <img
              src="/hotel/siam-hotel-hostel-logo.png"
              alt={HOTEL_INFO.name}
              width={456}
              height={420}
              className="h-11 w-auto sm:h-14"
            />
          </a>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="#rooms"
              className="hidden text-sm font-medium text-[#072a45]/75 transition hover:text-[#0b4a8f] sm:block"
            >
              {copy.navRooms}
            </a>
            <a
              href="#gallery"
              className="hidden text-sm font-medium text-[#072a45]/75 transition hover:text-[#0b4a8f] sm:block"
            >
              {copy.navGallery}
            </a>

            <div className="flex items-center gap-0.5 rounded-full border border-white/70 bg-white/60 p-0.5">
              {HOTEL_LANGS.map((l) => (
                <Link
                  key={l}
                  to={hotelPath(l)}
                  aria-current={l === lang ? "page" : undefined}
                  className={`rounded-full px-2 py-1 text-[11px] font-semibold transition ${
                    l === lang
                      ? "bg-[#0b4a8f] text-white"
                      : "text-[#072a45]/60 hover:text-[#0b4a8f]"
                  }`}
                >
                  {LANG_LABELS[l]}
                </Link>
              ))}
            </div>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ location: "hotel-nav", url: waHref })}
              className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1da851]"
            >
              WhatsApp
            </a>
          </div>
        </nav>
      </header>

      {/* -------------------------------------------------------------- hero */}
      <section id="top" className="relative flex min-h-[86svh] items-end overflow-hidden">
        <img
          src="/hotel/siam-hotel-koh-tao-palm-sunset-2000.webp"
          srcSet="/hotel/siam-hotel-koh-tao-palm-sunset-800.webp 800w, /hotel/siam-hotel-koh-tao-palm-sunset.webp 1600w, /hotel/siam-hotel-koh-tao-palm-sunset-2000.webp 2000w"
          sizes="100vw"
          alt="Sunset over Sairee Beach, Koh Tao, seen from Siam Hotel & Hostel"
          fetchPriority="high"
          width={2000}
          height={1321}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#041c2e]/90 via-[#041c2e]/35 to-[#041c2e]/25"
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:pb-24">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
            {copy.heroKicker}
          </p>
          <h1 className="font-display text-4xl leading-[1.05] text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {copy.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#rooms"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#072a45] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition hover:-translate-y-0.5"
            >
              {copy.heroCta}
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ location: "hotel-hero", url: waHref })}
              className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" />
              {copy.heroWhatsapp}
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- perks */}
      <section className="relative z-10 -mt-8">
        <div className="mx-auto max-w-6xl px-4">
          <ul className="flex flex-wrap justify-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-3 shadow-[0_10px_36px_-18px_rgba(7,42,69,0.5)] backdrop-blur-xl sm:gap-3">
            {copy.perks.map((perk) => (
              <li
                key={perk}
                className="rounded-full px-3 py-1 text-xs font-medium text-[#0b4a8f] sm:text-sm"
              >
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------- rooms */}
      <section id="rooms" className="relative scroll-mt-20 overflow-hidden py-16 sm:py-24">
        <PalmDecor corner="top-right" opacity={0.06} size={560} />
        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <header className="mb-10 max-w-2xl">
            <h2 className="font-display text-3xl text-[#072a45] sm:text-4xl">{copy.roomsTitle}</h2>
            <p className="mt-2 text-[#072a45]/60">{copy.roomsSubtitle}</p>
          </header>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.slug} room={room} copy={copy} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- good to know */}
      <section className="pb-4">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[26px] border border-white/70 bg-white/60 p-7 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-[#1fa8dd]">
              <Info className="h-5 w-5" />
              <h2 className="font-display text-xl text-[#072a45]">{copy.goodToKnowTitle}</h2>
            </div>
            <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {copy.goodToKnowItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#072a45]/70">
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1fa8dd]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- gallery */}
      <section id="gallery" className="relative scroll-mt-20 overflow-hidden py-16 sm:py-20">
        <PalmDecor corner="bottom-left" opacity={0.05} size={480} />
        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <header className="mb-8 max-w-2xl">
            <h2 className="font-display text-3xl text-[#072a45] sm:text-4xl">{copy.galleryTitle}</h2>
            <p className="mt-2 text-[#072a45]/60">{copy.gallerySubtitle}</p>
          </header>
          <HotelGallery copy={copy} lang={lang} />
        </div>
      </section>

      {/* -------------------------------------------------------- dive bridge */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/60 shadow-[0_14px_46px_-20px_rgba(7,42,69,0.5)] backdrop-blur-xl md:flex">
            <div className="relative md:w-2/5">
              <img
                src="/hero/turtle-1280.webp"
                alt="Green sea turtle on a Koh Tao reef"
                loading="lazy"
                decoding="async"
                className="h-56 w-full object-cover md:h-full"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-9 md:w-3/5">
              <div className="flex items-center gap-2 text-[#1fa8dd]">
                <Waves className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  PADI 5-Star
                </span>
              </div>
              <h2 className="font-display text-2xl text-[#072a45] sm:text-3xl">{copy.diveTitle}</h2>
              <p className="text-[#072a45]/70">{copy.diveBody}</p>
              <a
                href={diveSiteHomePath(lang)}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0b4a8f] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0a3a6b]"
              >
                {copy.diveCta}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- find + ask */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-2">
          <div className="rounded-[26px] border border-white/70 bg-white/60 p-7 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-[#1fa8dd]">
              <MapPin className="h-5 w-5" />
              <h2 className="font-display text-xl text-[#072a45]">{copy.findTitle}</h2>
            </div>
            <p className="text-[#072a45]/70">{copy.findBody}</p>
            {HOTEL_INFO.address && <p className="mt-1 text-[#072a45]/70">{HOTEL_INFO.address}</p>}
            {HOTEL_INFO.mapsUrl ? (
              <a
                href={HOTEL_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0b4a8f] hover:underline"
              >
                {copy.findCta}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </a>
            ) : (
              <p className="mt-4 text-sm text-[#072a45]/40">{copy.detailsSoon}</p>
            )}
          </div>

          <div className="rounded-[26px] border border-white/70 bg-white/60 p-7 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-[#1fa8dd]">
              <MessageCircle className="h-5 w-5" />
              <h2 className="font-display text-xl text-[#072a45]">{copy.contactTitle}</h2>
            </div>
            <p className="text-[#072a45]/70">{copy.contactBody}</p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ location: "hotel-contact", url: waHref })}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1da851]"
            >
              <MessageCircle className="h-4 w-4" />
              {copy.heroWhatsapp}
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ footer */}
      <footer className="relative overflow-hidden border-t border-white/50 bg-[#072a45] py-10 text-white/70">
        <PalmDecor corner="bottom-right" color="#ffffff" opacity={0.06} size={420} />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center">
          <img
            src="/hotel/siam-hotel-hostel-logo.png"
            alt={HOTEL_INFO.name}
            width={456}
            height={420}
            loading="lazy"
            className="h-16 w-auto"
          />
          <p className="text-sm">{copy.footerTagline}</p>
          <a href={diveSiteHomePath(lang)} className="text-sm text-white hover:underline">
            {copy.footerDiveLink}
          </a>
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {HOTEL_INFO.name} · {HOTEL_INFO.area}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HotelContent;
