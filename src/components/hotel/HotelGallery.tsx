import { useCallback, useState } from "react";
import PhotoLightbox from "./PhotoLightbox";
import type { Language } from "@/i18n/translations";
import { HOTEL_GALLERY, type HotelCopy } from "@/data/hotel";

/**
 * Property gallery. The fullscreen viewer is PhotoLightbox, shared with the
 * room cards (swipe + keyboard + RTL), so both behave the same.
 */

interface HotelGalleryProps {
  copy: HotelCopy;
  lang: Language;
}

const HotelGallery = ({ copy, lang }: HotelGalleryProps) => {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

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

      {open != null && (
        <PhotoLightbox
          photos={HOTEL_GALLERY.map((p) => ({ src: `/hotel/${p.slug}.webp`, alt: p.alt[lang] }))}
          index={open}
          onIndex={setOpen}
          onClose={close}
          rtl={lang === "he"}
          labels={{ title: copy.galleryTitle, close: copy.galleryClose, prev: copy.galleryPrev, next: copy.galleryNext }}
        />
      )}
    </>
  );
};

export default HotelGallery;
