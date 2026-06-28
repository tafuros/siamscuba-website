import { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/translations";
import gateLogo from "@/assets/siam-logo.webp";
import { buildWhatsAppLink, normalizeLang } from "@/utils/whatsapp";
import { gateContent, type WhereKey } from "./gateContent";
import {
  gateReducer,
  initialGateState,
  resolveAction,
} from "./gateMachine";
import Seascape from "./Seascape";
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

  const close = () => {
    // Drop the pre-paint cover (index.html) so the homepage / destination shows.
    if (typeof document !== "undefined") document.getElementById("gate-preload-cover")?.remove();
    setActive(false);
  };

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
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 85% at 86% -8%, rgba(255,250,232,0.5) 0%, rgba(176,224,255,0.28) 30%, transparent 60%), linear-gradient(to bottom, #1f73ab 0%, #2f8cc4 34%, #6fc0e8 54%, #2b87bf 60%, #15659c 74%, #0c4f80 100%)",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Siam Scuba welcome"
    >
      {/* The solid dark background above appears instantly - it covers the live
          homepage the moment the gate mounts. Only the SCENE below rises in over
          it (no flash of the production site), which also reads as "something is
          about to happen". */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Seascape reducedMotion={prefersReduced} />

      {/* Soft vignette for depth - light so the bright scene stays bright */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 150px 40px rgba(3,28,52,0.30)" }}
        aria-hidden="true"
      />

      <div className="relative z-[1] flex min-h-[100dvh] w-full flex-col">
        {/* Top bar - Back from the language step onward, kept out of the content
            flow so it never overlaps the cards. */}
        <div className="relative flex shrink-0 items-center justify-center px-5 pt-4 pb-1">
          {state.step !== "welcome" && (
            <button
              type="button"
              onClick={() => dispatch({ type: "BACK" })}
              className="absolute top-4 ltr:left-5 rtl:right-5 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-md transition-colors hover:bg-white/15"
            >
              <span aria-hidden="true">{isRTL ? "→" : "←"}</span>
              {copy.back}
            </button>
          )}
          <img
            src={gateLogo}
            alt="Siam Scuba"
            draggable={false}
            className={`gate-logo${state.step === "welcome" ? "" : " gate-logo--compact"}`}
          />
        </div>
        <div className="flex flex-1 items-center justify-center overflow-y-auto px-2 pb-[32vh]">
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
                artByKey={state.where === "kohTao" ? { freediving: "freediver", scuba: "scuba" } : undefined}
              />
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default EntryGate;
