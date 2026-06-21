import { motion } from "framer-motion";
import type { GateQuestion } from "./gateContent";

interface QuestionStepProps {
  question: GateQuestion;
  onPick: (key: string) => void;
  reducedMotion?: boolean;
}

const QuestionStep = ({ question, onPick, reducedMotion = false }: QuestionStepProps) => {
  const cols = question.options.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className="w-full max-w-3xl px-4">
      <motion.h2
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center font-display text-2xl font-semibold text-white sm:text-4xl"
      >
        {question.title}
      </motion.h2>

      <div className={`grid grid-cols-1 gap-4 ${cols}`}>
        {question.options.map((opt, i) => (
          <motion.button
            key={opt.key}
            type="button"
            onClick={() => onPick(opt.key)}
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: reducedMotion ? 0 : 0.12 + i * 0.08 }}
            whileHover={reducedMotion ? undefined : { y: -4 }}
            className="group flex min-h-[8.5rem] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/[0.07] p-6 text-center backdrop-blur-md outline-none transition-colors hover:border-ocean-light/70 hover:bg-white/[0.13] focus-visible:border-ocean-light/70 focus-visible:bg-white/[0.13]"
          >
            <span className="font-display text-xl font-semibold text-white sm:text-2xl">
              {opt.label}
            </span>
            <span className="text-sm text-ocean-surface/80">{opt.sub}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuestionStep;
