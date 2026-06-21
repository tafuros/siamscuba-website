import { motion } from "framer-motion";
import type { Language } from "@/i18n/translations";
import { gateContent, WELCOME_HEADLINE } from "./gateContent";
import FlagRow from "./FlagRow";

interface WelcomeStepProps {
  onPickLanguage: (lang: Language) => void;
  reducedMotion?: boolean;
}

// First screen: the brand headline fades in after a brief bubble beat (~1.2s),
// then the tagline, then the language flags. Pre-language-pick copy is English.
const WelcomeStep = ({ onPickLanguage, reducedMotion = false }: WelcomeStepProps) => {
  const d = (delay: number) => (reducedMotion ? 0 : delay);

  return (
    <div className="flex w-full max-w-3xl flex-col items-center px-6 text-center">
      <motion.p
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: d(1.0) }}
        className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-ocean-light/80"
      >
        Koh Tao · Thailand
      </motion.p>

      <motion.h1
        initial={reducedMotion ? false : { opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.1, delay: d(1.2), ease: "easeOut" }}
        className="font-display text-3xl font-bold leading-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] sm:text-5xl md:text-6xl"
      >
        {WELCOME_HEADLINE}
      </motion.h1>

      <motion.p
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: d(1.9) }}
        className="mt-4 font-display text-base italic text-ocean-surface/85 sm:text-lg"
      >
        {gateContent.en.tagline}
      </motion.p>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: d(2.5) }}
        className="mt-12 flex flex-col items-center gap-5"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/55">
          {gateContent.en.chooseLanguage}
        </span>
        <FlagRow onPick={onPickLanguage} />
      </motion.div>
    </div>
  );
};

export default WelcomeStep;
