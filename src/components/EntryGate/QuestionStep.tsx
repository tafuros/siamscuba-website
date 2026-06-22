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

const QuestionStep = ({ question, onPick, reducedMotion = false, artByKey, swapOnMobile = false }: QuestionStepProps) => {
  const cols = question.options.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className="w-full max-w-3xl px-4">
      <motion.h2
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gate-title-line mb-8 text-center font-display text-2xl font-semibold sm:text-4xl"
      >
        {question.title}
      </motion.h2>

      <div className={`grid grid-cols-1 gap-4 ${cols}`}>
        {question.options.map((opt, i) => {
          const art = artByKey?.[opt.key];
          // The tall portrait freediver sits to the LEFT of the text; others stack.
          const sideArt = art === "freediver";
          // Mobile reorder of the first two cards; desktop keeps DOM order.
          const orderClass = swapOnMobile
            ? i === 0
              ? "order-last sm:order-none"
              : i === 1
                ? "order-first sm:order-none"
                : ""
            : "";
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
              className={`group flex min-h-[8.5rem] items-center justify-center rounded-2xl border border-white/15 bg-white/[0.07] p-6 text-center backdrop-blur-md outline-none transition-colors hover:border-ocean-light/70 hover:bg-white/[0.13] focus-visible:border-ocean-light/70 focus-visible:bg-white/[0.13] ${sideArt ? "gap-4" : "flex-col gap-2"} ${orderClass}`}
            >
              {art && (
                <DiverArt
                  type={art}
                  className="shrink-0 text-ocean-light transition-colors group-hover:text-white"
                />
              )}
              <div className="flex flex-col items-center gap-1">
                <span className="font-display text-xl font-semibold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:text-2xl">
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
