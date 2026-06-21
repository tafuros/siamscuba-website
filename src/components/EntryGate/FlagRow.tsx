import type { Language } from "@/i18n/translations";
import { languageNames } from "@/i18n/translations";

// Flags laid out left -> right. Each flag carries a vertical fade - fully opaque
// at the top, dissolving to 0 at the bottom - so the tiles melt into the deep
// water rather than sitting as hard rectangles. Each flag is a real <button>
// with an aria-label; hover/focus lifts it and removes the fade for clarity.

// Left -> right: IL, FR, ES, GB.
const ORDER: Language[] = ["he", "fr", "es", "en"];

// Top stays fully solid, bottom dissolves to 0 opacity -> the gradient effect.
const FADE = "linear-gradient(to bottom, #000 0%, #000 45%, rgba(0,0,0,0.4) 75%, transparent 100%)";

interface FlagRowProps {
  onPick: (lang: Language) => void;
}

const FlagRow = ({ onPick }: FlagRowProps) => {
  return (
    <div className="flex items-start justify-center gap-3 sm:gap-8" dir="ltr">
      {ORDER.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onPick(lang)}
          aria-label={languageNames[lang]}
          title={languageNames[lang]}
          className="group flex flex-col items-center gap-2 outline-none transition-transform duration-300 hover:-translate-y-1.5 focus-visible:-translate-y-1.5"
        >
          <span className="block h-12 w-[4.25rem] sm:h-16 sm:w-24">
            <img
              src={`/flags/${lang}.svg`}
              alt=""
              aria-hidden="true"
              loading="eager"
              className="h-full w-full rounded-xl object-cover drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)] transition-[filter] duration-300 group-hover:brightness-110"
              style={{ WebkitMaskImage: FADE, maskImage: FADE }}
            />
          </span>
          <span className="text-[11px] font-medium tracking-wide text-white/55 transition-colors group-hover:text-white group-focus-visible:text-white sm:text-xs">
            {languageNames[lang]}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FlagRow;
