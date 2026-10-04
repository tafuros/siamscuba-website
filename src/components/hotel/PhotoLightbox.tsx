import { useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipe } from "@/hooks/useSwipe";

/**
 * Fullscreen photo viewer shared by the room cards and the property gallery.
 *
 * Deliberately NOT a Radix Dialog: Radix renders through a portal, and portals
 * are invisible to the SSG prerender (a trap this repo has hit before). It only
 * mounts after a tap anyway, so a plain conditional overlay is all it needs.
 */

export interface LightboxPhoto {
  src: string;
  alt: string;
}

interface PhotoLightboxProps {
  photos: LightboxPhoto[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  rtl?: boolean;
  labels: { title: string; close: string; prev: string; next: string };
}

const PhotoLightbox = ({ photos, index, onIndex, onClose, rtl = false, labels }: PhotoLightboxProps) => {
  const count = photos.length;
  const step = useCallback((delta: number) => onIndex((index + delta + count) % count), [index, count, onIndex]);
  const { handlers } = useSwipe((dir) => step(dir), rtl);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") step(rtl ? 1 : -1);
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
  }, [onClose, step, rtl]);

  const active = photos[index];
  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={labels.title}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#041c2e]/92 p-4 backdrop-blur-md"
      onClick={onClose}
      {...handlers}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={labels.close}
        className="absolute end-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/25"
      >
        <X className="h-5 w-5" />
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label={labels.prev}
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
            aria-label={labels.next}
            className="absolute end-2 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/25 sm:end-6"
          >
            <ChevronRight className="h-6 w-6 rtl:rotate-180" />
          </button>
        </>
      )}

      <figure className="max-h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img
          src={active.src}
          alt={active.alt}
          className="mx-auto max-h-[78vh] w-auto rounded-2xl object-contain shadow-2xl"
        />
        <figcaption className="mt-3 text-center text-sm text-white/70">
          {active.alt}
          {count > 1 && <span className="ms-2 tabular-nums text-white/45">{index + 1} / {count}</span>}
        </figcaption>
      </figure>
    </div>
  );
};

export default PhotoLightbox;
