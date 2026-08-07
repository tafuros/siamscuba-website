import { motion } from "framer-motion";
import type { Language } from "@/i18n/translations";
import { gateContent, WELCOME_LINES } from "./gateContent";
import FlagRow from "./FlagRow";

interface WelcomeStepProps {
  onPickLanguage: (lang: Language) => void;
  reducedMotion?: boolean;
}

// First screen: the brand headline fades in after a brief bubble beat, then the
// tagline, then the language flags. Pre-language-pick copy is English.
//
// TIMING (compressed 2026-08-07): the flag row used to sit on a 2.5s delay + 0.7s
// fade, so the FIRST interactive element of the whole site appeared ~3.2s after
// the step mounted - and that mount is itself behind the lazy gate chunk. Visitors
// read it as "the flags are slow to load". The stagger is kept (it is the intended
// cinematic beat) but roughly halved, so the flags are actionable at ~1.9s.
const WelcomeStep = ({ onPickLanguage, reducedMotion = false }: WelcomeStepProps) => {
  const d = (delay: number) => (reducedMotion ? 0 : delay);

  return (
    <div className="flex w-full max-w-3xl flex-col items-center px-4 text-center sm:px-6">
      <motion.p
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: d(0.35) }}
        className="mb-3 text-xs font-medium uppercase tracking-[0.34em] text-white/85"
      >
        Koh Tao · Thailand
      </motion.p>

      <motion.h1
        initial={reducedMotion ? false : { opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.85, delay: d(0.55), ease: "easeOut" }}
        className="gate-ink font-display text-4xl font-medium leading-[1.1] sm:text-5xl md:text-6xl"
      >
        {WELCOME_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </motion.h1>

      <motion.p
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: d(1.0) }}
        className="mt-3 font-display text-base italic text-white/90 sm:text-lg"
      >
        {gateContent.en.tagline}
      </motion.p>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: d(1.35) }}
        className="mt-10 flex flex-col items-center gap-4"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/75">
          {gateContent.en.chooseLanguage}
        </span>
        <FlagRow onPick={onPickLanguage} />
      </motion.div>
    </div>
  );
};

export default WelcomeStep;
