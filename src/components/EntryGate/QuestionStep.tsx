import { motion } from "framer-motion";
import type { GateQuestion } from "./gateContent";
import DiverArt, { type DiverArtType } from "./DiverArt";

interface QuestionStepProps {
  question: GateQuestion;
  onPick: (key: string) => void;
  reducedMotion?: boolean;
  /** Optional illustration per option key (e.g. Koh Tao freediving/scuba). */
  artByKey?: Record<string, DiverArtType>;
  /** Swap the first two options' vertical order on mobile (desktop unchanged). */
  swapOnMobile?: boolean;
}

// Per-card tint (2026-08-07). Every card keeps the identical frosted glass and
// blur; only the hue inside it shifts, so the set reads as one material at four
// temperatures rather than four different components. Classes live in gate.css.
// Keys not listed here fall back to the plain glass - which is what the location
// question wants.
const TONE_CLASS: Record<string, string> = {
  beginner: "gate-card--cyan",
  funDives: "gate-card--azure",
  training: "gate-card--indigo",
  conservation: "gate-card--aware",
};

// Desktop 2x2 placement, per Ben (2026-08-07):
//
//   [ conservation ] [ keep training ]
//   [ beginner     ] [ fun dives     ]
//
// DOM order stays the natural progression (beginner -> fun dives -> training ->
// conservation) because that is the right single-column order on a phone and the
// right tab order for a keyboard. Desktop position is CSS `order` only. The class
// strings are written out in full so Tailwind's JIT scanner can see them.
const DESKTOP_ORDER: Record<string, string> = {
  conservation: "sm:order-1",
  training: "sm:order-2",
  beginner: "sm:order-3",
  funDives: "sm:order-4",
};

const QuestionStep = ({ question, onPick, reducedMotion = false, artByKey, swapOnMobile = false }: QuestionStepProps) => {
  // 4 options sit as a 2x2; 3 stay in a single row; 2 split in half.
  const cols =
    question.options.length === 4
      ? "sm:grid-cols-2"
      : question.options.length >= 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2";
  const isQuad = question.options.length === 4;

  return (
    <div className={`w-full px-4 ${isQuad ? "max-w-2xl" : "max-w-3xl"}`}>
      <motion.h2
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gate-ink mb-7 text-center font-display text-2xl font-medium leading-[1.15] sm:text-4xl"
      >
        {question.title}
      </motion.h2>

      <div className={`grid grid-cols-1 gap-4 ${cols}`}>
        {question.options.map((opt, i) => {
          const art = artByKey?.[opt.key];
          // The tall portrait freediver sits to the LEFT of the text; others stack.
          const sideArt = art === "freediver";
          // Mobile reorder of the first two cards; desktop keeps DOM order.
          const swapClass = swapOnMobile
            ? i === 0
              ? "order-last sm:order-none"
              : i === 1
                ? "order-first sm:order-none"
                : ""
            : "";
          const orderClass = isQuad ? (DESKTOP_ORDER[opt.key] ?? "") : swapClass;
          const toneClass = TONE_CLASS[opt.key] ?? "";
          return (
            <motion.button
              key={opt.key}
              type="button"
              onClick={() => onPick(opt.key)}
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: reducedMotion ? 0 : 0.12 + i * 0.08 }}
              whileHover={reducedMotion ? undefined : { y: -4 }}
              dir={sideArt ? "ltr" : undefined}
              className={`gate-card group flex min-h-[8.5rem] items-center justify-center rounded-2xl p-6 text-center backdrop-blur-md outline-none transition-colors ${sideArt ? "gap-4" : "flex-col gap-2"} ${toneClass} ${orderClass}`}
            >
              {art && (
                <DiverArt
                  type={art}
                  className="shrink-0 text-ocean-light transition-colors group-hover:text-white"
                />
              )}
              <div className="flex flex-col items-center gap-1">
                {opt.eyebrow && (
                  <span className="gate-card-eyebrow mb-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.18em]">
                    {opt.eyebrow}
                  </span>
                )}
                <span className="gate-card-label font-display text-xl font-semibold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:text-2xl">
                  {opt.label}
                </span>
                <span className="text-sm font-medium text-white/85 drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)]">{opt.sub}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionStep;
