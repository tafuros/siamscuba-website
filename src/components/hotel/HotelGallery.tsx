import { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Language } from "@/i18n/translations";
import { HOTEL_GALLERY, type HotelCopy } from "@/data/hotel";

/**
 * Property gallery + lightbox.
 *
 * Deliberately NOT a Radix Dialog: Radix renders through a portal, and portals
 * are invisible to the SSG prerender, so the markup would vanish from the
 * static HTML (a trap this repo has hit before). A plain conditional overlay
 * prerenders fine and needs no dependency.
 */

interface HotelGalleryProps {
  copy: HotelCopy;
  lang: Language;
}

const HotelGallery = ({ copy, lang }: HotelGalleryProps) => {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpen((i) => (i == null ? i : (i + delta + HOTEL_GALLERY.length) % HOTEL_GALLERY.length)),
    []
  );

  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    // Lock the body while the overlay is up, and restore whatever was there
    // before (not a hardcoded ""), so we cannot clobber another lock.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close, step]);

  const active = open == null ? null : HOTEL_GALLERY[open];

  return (
    <>
      <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        {HOTEL_GALLERY.map((photo, i) => (
          <button
            key={photo.slug}
            type="button"
            onClick={() => setOpen(i)}
            className="mb-3 block w-full overflow-hidden rounded-2xl border border-white/60 shadow-[0_8px_28px_-14px_rgba(7,42,69,0.4)] transition-transform duration-300 hover:-translate-y-1 sm:mb-4"
          >
            <img
              src={`/hotel/${photo.slug}-800.webp`}
              alt={photo.alt[lang]}
              loading="lazy"
              decoding="async"
              className="w-full object-cover"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.galleryTitle}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#041c2e]/90 p-4 backdrop-blur-md"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label={copy.galleryClose}
            className="absolute end-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/25"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label={copy.galleryPrev}
            className="absolute start-2 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/25 sm:start-6"
          >
            <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label={copy.galleryNext}
            className="absolute end-2 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/25 sm:end-6"
          >
            <ChevronRight className="h-6 w-6 rtl:rotate-180" />
          </button>

          <figure className="max-h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={`/hotel/${active.slug}.webp`}
              alt={active.alt[lang]}
              className="mx-auto max-h-[78vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="mt-3 text-center text-sm text-white/70">
              {active.alt[lang]}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
};

export default HotelGallery;
