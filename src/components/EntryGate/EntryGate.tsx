import { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/translations";
import { buildWhatsAppLink, normalizeLang } from "@/utils/whatsapp";
import { gateContent, type WhereKey } from "./gateContent";
import {
  gateReducer,
  initialGateState,
  resolveAction,
} from "./gateMachine";
import GateBubbles from "./GateBubbles";
import GodRays from "./GodRays";
import WelcomeStep from "./WelcomeStep";
import QuestionStep from "./QuestionStep";
import "./gate.css";

// The premium "gate" intro overlay. Rendered only on "/" and only client-side
// (the CookieConsent pattern): initial render is null, so the SSG'd homepage HTML
// is untouched and crawlers never see the gate. Mounting is additionally guarded
// by the VITE_ENTRY_GATE build flag in App.tsx, so this whole tree is dormant in
// production until that flag is flipped on.

const EntryGate = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, isRTL } = useLanguage();
  const prefersReduced = useReducedMotion() ?? false;

  const [active, setActive] = useState(false);
  const [state, dispatch] = useReducer(gateReducer, initialGateState);

  // Client-only reveal: show on the homepage unless explicitly skipped (?gate=0).
  useEffect(() => {
    if (pathname !== "/") return;
    const skip = new URLSearchParams(window.location.search).get("gate") === "0";
    if (!skip) setActive(true);
  }, [pathname]);

  // Lock body scroll while the gate is up.
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  if (!active) return null;

  const copy = gateContent[language];

  const close = () => setActive(false);

  const handlePickLanguage = (lang: Language) => {
    setLanguage(lang);
    dispatch({ type: "PICK_LANGUAGE" });
  };

  const handlePickWhere = (where: WhereKey) => {
    dispatch({ type: "PICK_WHERE", where });
  };

  const handleFinalAnswer = (answerKey: string) => {
    if (!state.where) return;
    const action = resolveAction(state.where, answerKey);
    if (action.type === "whatsapp") {
      const url = buildWhatsAppLink({ topic: action.topic, lang: normalizeLang(language) });
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (action.type === "navigate") {
      navigate(action.path);
    }
    // "enter-site" just closes the gate onto the homepage that was always beneath.
    close();
  };

  const branchQuestion = state.where ? copy[state.where] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 0%, #0a3a66 0%, #08315a 38%, #051f3a 72%, #03152a 100%)",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Siam Scuba welcome"
    >
      <GodRays reducedMotion={prefersReduced} />
      <GateBubbles reducedMotion={prefersReduced} />

      {/* Soft vignette for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 240px 60px rgba(0,0,0,0.55)" }}
        aria-hidden="true"
      />

      {/* Back control (not on the first screen) */}
      {state.step !== "welcome" && (
        <button
          type="button"
          onClick={() => dispatch({ type: "BACK" })}
          className={`absolute top-5 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-md transition-colors hover:bg-white/15 ${
            isRTL ? "right-5" : "left-5"
          }`}
        >
          <span aria-hidden="true">{isRTL ? "→" : "←"}</span>
          {copy.back}
        </button>
      )}

      <div className="relative z-[1] flex max-h-[100dvh] w-full items-center justify-center overflow-y-auto py-16">
        <AnimatePresence mode="wait">
          {state.step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
              className="flex w-full justify-center"
            >
              <WelcomeStep onPickLanguage={handlePickLanguage} reducedMotion={prefersReduced} />
            </motion.div>
          )}

          {state.step === "where" && (
            <motion.div
              key="where"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              className="flex w-full justify-center"
            >
              <QuestionStep
                question={copy.where}
                onPick={(key) => handlePickWhere(key as WhereKey)}
                reducedMotion={prefersReduced}
              />
            </motion.div>
          )}

          {state.step === "branch" && branchQuestion && (
            <motion.div
              key={`branch-${state.where}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              className="flex w-full justify-center"
            >
              <QuestionStep
                question={branchQuestion}
                onPick={handleFinalAnswer}
                reducedMotion={prefersReduced}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EntryGate;
