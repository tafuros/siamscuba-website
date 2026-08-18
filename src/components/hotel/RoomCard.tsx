import { useState } from "react";
import { ChevronLeft, ChevronRight, Users, ImageOff } from "lucide-react";
import type { Language } from "@/i18n/translations";
import { type HotelRoom, type HotelCopy, hotelWhatsAppLink } from "@/data/hotel";
import { trackWhatsAppClick } from "@/utils/tracking";

/**
 * One room = one liquid-glass card: photos, price, book. Nothing else.
 *
 * The card has three states and picks between them from the data alone:
 * - `images` empty  -> placeholder panel ("photos coming soon")
 * - `pricePerNight` null -> "price on request" instead of a number
 * - `soldOut` -> "fully booked" badge, and the Book button becomes an inert
 *   pill so guests don't open a WhatsApp inquiry for a blocked room
 * All disappear on their own the moment src/data/hotel.ts changes.
 */

interface RoomCardProps {
  room: HotelRoom;
  copy: HotelCopy;
  lang: Language;
}

const RoomCard = ({ room, copy, lang }: RoomCardProps) => {
  const [index, setIndex] = useState(0);
  const name = room.name[lang];
  const hasPhotos = room.images.length > 0;
  const multi = room.images.length > 1;
  const waHref = hotelWhatsAppLink(lang, name);

  const step = (delta: number) =>
    setIndex((i) => (i + delta + room.images.length) % room.images.length);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[26px] border border-white/70 bg-white/60 shadow-[0_12px_40px_-16px_rgba(7,42,69,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-18px_rgba(7,42,69,0.45)]">
      {/* Liquid-glass sheen: a single soft highlight across the top edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
      />

      {/* Photos */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#dceaf4]">
        {room.soldOut && (
          <span className="absolute start-3 top-3 z-10 rounded-full border border-white/40 bg-[#072a45]/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-md">
            {copy.fullyBooked}
          </span>
        )}
        {hasPhotos ? (
          <>
            {room.images.map((slug, i) => (
              <img
                key={slug}
                src={`/hotel/${slug}.webp`}
                srcSet={`/hotel/${slug}-800.webp 800w, /hotel/${slug}.webp 1600w`}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                alt={`${name} - Siam Hotel & Hostel, Koh Tao`}
                loading="lazy"
                decoding="async"
                width={1600}
                height={1200}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {multi && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={copy.galleryPrev}
                  className="absolute start-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/70 text-[#072a45] backdrop-blur-md transition hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={copy.galleryNext}
                  className="absolute end-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/70 text-[#072a45] backdrop-blur-md transition hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5 rtl:rotate-180" />
                </button>
                <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
                  {room.images.map((slug, i) => (
                    <span
                      key={slug}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === index ? "w-5 bg-white" : "w-1.5 bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          /* Placeholder state - styled, not broken-looking. */
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#cfe6f5] via-[#e7f2f9] to-[#f6efe2]">
            <div className="flex flex-col items-center gap-2 text-[#0b4a8f]/60">
              <ImageOff className="h-8 w-8" strokeWidth={1.5} />
              <span className="text-xs font-medium tracking-wide">{copy.photosSoon}</span>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight text-[#072a45]">{name}</h3>
          {room.sleeps != null && (
            <span className="mt-1 flex shrink-0 items-center gap-1 whitespace-nowrap text-xs text-[#072a45]/55">
              <Users className="h-3.5 w-3.5" />
              {copy.sleeps(room.sleeps)}
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-[#072a45]/70">{room.blurb[lang]}</p>

        <ul className="flex flex-wrap gap-1.5">
          {room.amenities.map((key) => (
            <li
              key={key}
              className="rounded-full border border-white/70 bg-white/60 px-2.5 py-1 text-[11px] font-medium text-[#0b4a8f] backdrop-blur-sm"
            >
              {copy.amenities[key]}
            </li>
          ))}
        </ul>

        {/* Price + the one action. */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="min-w-0">
            {room.pricePerNight != null ? (
              <>
                <span className="block text-[11px] uppercase tracking-wide text-[#072a45]/45">
                  {copy.priceFrom}
                </span>
                <span className="font-display text-2xl text-[#072a45]">
                  ฿{room.pricePerNight.toLocaleString()}
                  <span className="ms-1 font-body text-xs font-normal text-[#072a45]/50">
                    {room.priceUnit === "bed" ? copy.perBed : copy.perNight}
                  </span>
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-[#072a45]/50">{copy.priceOnRequest}</span>
            )}
          </div>

          {room.soldOut ? (
            <span className="shrink-0 whitespace-nowrap rounded-full border border-[#072a45]/15 bg-[#072a45]/5 px-6 py-2.5 text-sm font-semibold text-[#072a45]/45">
              {copy.fullyBooked}
            </span>
          ) : (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ location: `hotel-room-${room.slug}`, url: waHref })}
              className="shrink-0 rounded-full bg-[#0b4a8f] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(11,74,143,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0a3a6b]"
            >
              {copy.book}
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
