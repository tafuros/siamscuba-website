import { useEffect, useReducer, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/translations";
import gateLogo from "@/assets/siam-logo.webp";
import { OPEN_GATE_EVENT } from "@/utils/gateBus";
import { trackGateAnswer } from "@/utils/tracking";

// Hero video lives in /public (streamed media, not Vite-imported) so the browser
// can range-request it. Poster (optimized, ~87KB) is the instant LCP paint and
// doubles as the reduced-motion still fallback. Mobile gets the lighter 720p mp4
// so iOS Safari (which can't use the webm) downloads ~0.7MB instead of ~1.75MB.
const GATE_HERO_POSTER = "/gate/gate-poster.jpg";
const GATE_HERO_WEBM = "/gate/gate-hero-1080.webm";
const GATE_HERO_MP4 = "/gate/gate-hero-1080.mp4";
const GATE_HERO_MP4_720 = "/gate/gate-hero-720.mp4";

// Returning-visitor memory: once the gate is passed, skip the intro for this
// long. Keep in sync with the same check in index.html's cover script so the
// pre-paint cover and the gate agree on whether to show.
const GATE_SEEN_KEY = "siam_gate_seen";
const GATE_SEEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
const gateSeenRecently = () => {
  try {
    const t = Number(localStorage.getItem(GATE_SEEN_KEY));
    return t > 0 && Date.now() - t < GATE_SEEN_TTL;
  } catch {
    return false;
  }
};
import { gateContent, type LevelKey, type LocationKey } from "./gateContent";
import {
  gateReducer,
  initialGateState,
  needsLocation,
  resolveAction,
} from "./gateMachine";
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
  // While we navigate from the gate to a separate lander (freediving / similan /
  // phuket), keep the gate backdrop up as a cover so the homepage ("/") never
  // flashes behind it during the lazy-route load. Cleared once the new route is
  // the active path (see the effect below).
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Only reveal the video once it is genuinely playing. Until then (and forever,
  // if iOS blocks autoplay - e.g. Private Browsing or Low Power Mode) the poster
  // still shows underneath, so the native play-button overlay is never visible.
  const [videoPlaying, setVideoPlaying] = useState(false);
  // Defer MOUNTING the <video> until the browser is idle (or ~2.5s). Mounted
  // eagerly it starts its 0.7-1.7MB download immediately and competes with the
  // poster + app bundle for first-load bandwidth on mobile - the poster covers
  // the scene until then, so nobody sees the difference except the waterfall.
  const [videoOn, setVideoOn] = useState(false);
  const [state, dispatch] = useReducer(gateReducer, initialGateState);
  // Was the index.html pre-React poster cover on screen when this activation
  // happened? If so the visitor is ALREADY looking at the exact poster the gate
  // renders - so the gate must appear instantly opaque (poster-to-poster,
  // seamless). Fading in over the cover shows the light gradient backdrop
  // through the semi-transparent scene for ~1s = a visible "milky" flicker.
  // On a manual reopen (no cover), the fade is what hides the live page - keep it.
  const coverPresentRef = useRef(false);

  // Client-only reveal: show on the homepage unless explicitly skipped (?gate=0)
  // or already seen recently (returning visitors skip the intro - see GATE_SEEN).
  // ?gate=1 forces the gate even for remembered visitors (mirrored in the
  // index.html cover script so the pre-paint cover agrees).
  useEffect(() => {
    if (pathname !== "/") return;
    const q = new URLSearchParams(window.location.search).get("gate");
    if (q === "0" || (q !== "1" && gateSeenRecently())) {
      // The index.html cover only paints when it too sees no recent visit, so on
      // a remembered skip there is normally nothing to remove - but clear it just
      // in case (e.g. flag written this session after the cover painted).
      document.getElementById("gate-preload-cover")?.remove();
      return;
    }
    coverPresentRef.current = !!document.getElementById("gate-preload-cover");
    setActive(true);
  }, [pathname]);

  // Reopen on demand from anywhere in the app (navbar compass, footer
  // "Welcome menu") - returning visitors otherwise have no way back to the
  // gate within the 7-day remember window.
  useEffect(() => {
    const reopen = () => {
      coverPresentRef.current = false; // live page beneath - fade in over it
      dispatch({ type: "RESET" });
      setLeaving(false);
      setActive(true);
    };
    window.addEventListener(OPEN_GATE_EVENT, reopen);
    return () => window.removeEventListener(OPEN_GATE_EVENT, reopen);
  }, []);

  // Once the gate has painted (two frames in), the pre-React cover beneath is
  // redundant - drop it right away instead of leaning on its 6s safety timeout.
  useEffect(() => {
    if (!active) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.getElementById("gate-preload-cover")?.remove();
      }),
    );
    return () => cancelAnimationFrame(id);
  }, [active]);

  // Once a "navigate" answer lands on its destination route, drop the cover.
  // The router only changes pathname after the lazy chunk has resolved, so by
  // this point the lander is mounted - fading the cover reveals it directly with
  // no intermediate homepage frame.
  useEffect(() => {
    if (!leaving || pathname === "/") return;
    const id = requestAnimationFrame(() => close());
    return () => cancelAnimationFrame(id);
  }, [leaving, pathname]);

  // Prefetch the lazy lander chunks once the location step is shown, so a
  // navigate answer commits near-instantly (shorter cover, snappier transition).
  // Only the "certified + fun dives" level navigates away, and only these three
  // pages are reachable from it.
  useEffect(() => {
    if (state.step !== "location" || state.level !== "funDives") return;
    import("@/pages/SiamSimilansPage").catch(() => {});
    // The fun-dive + Sail Rock landers are one page file per language.
    switch (language) {
      case "he":
        import("@/pages/landers/FunDiveHePage").catch(() => {});
        import("@/pages/landers/SailRockHePage").catch(() => {});
        break;
      case "es":
        import("@/pages/landers/FunDiveEsPage").catch(() => {});
        import("@/pages/landers/SailRockEsPage").catch(() => {});
        break;
      case "fr":
        import("@/pages/landers/FunDiveFrPage").catch(() => {});
        import("@/pages/landers/SailRockEnPage").catch(() => {});
        break;
      default:
        import("@/pages/landers/FunDiveEnPage").catch(() => {});
        import("@/pages/landers/SailRockEnPage").catch(() => {});
    }
  }, [state.step, state.level, language]);

  // Drive inline autoplay ourselves and only reveal the video once it is truly
  // playing. React sets the `muted` ATTRIBUTE but not the property, so iOS can
  // treat the video as unmuted and block autoplay; force the property + call
  // play(). If autoplay is allowed, "playing"/timeupdate flips videoPlaying and
  // the video fades in over the matching poster. If it is blocked (iOS Private
  // Browsing / Low Power Mode), videoPlaying stays false and the poster remains -
  // so the native play-button overlay never shows.
  // Idle-mount the video once the gate is up (see videoOn above).
  useEffect(() => {
    if (!active || prefersReduced || videoOn) return;
    const start = () => setVideoOn(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(start, 2000);
    return () => window.clearTimeout(t);
  }, [active, prefersReduced, videoOn]);

  useEffect(() => {
    if (!active || prefersReduced) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    const markPlaying = () => {
      if (!v.paused && v.currentTime > 0) setVideoPlaying(true);
    };
    const tryPlay = () => v.play().then(markPlaying).catch(() => {});
    tryPlay();
    v.addEventListener("playing", markPlaying);
    v.addEventListener("timeupdate", markPlaying);
    v.addEventListener("loadedmetadata", tryPlay, { once: true });
    return () => {
      v.removeEventListener("playing", markPlaying);
      v.removeEventListener("timeupdate", markPlaying);
      v.removeEventListener("loadedmetadata", tryPlay);
    };
  }, [active, prefersReduced, videoOn]);

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

  // The welcome screen (pre-language-pick) is always English/LTR (see
  // WelcomeStep). Keep the gate chrome - Skip button label + layout direction -
  // English/LTR too until the visitor actually picks a language; otherwise a
  // Hebrew-default browser renders "דלג" (and a mirrored bar) over the English
  // welcome step. Once a language is chosen, later steps follow it (already correct).
  const onWelcome = state.step === "welcome";
  const copy = gateContent[onWelcome ? "en" : language];
  const gateRTL = onWelcome ? false : isRTL;

  const close = () => {
    // Drop the pre-paint cover (index.html) so the homepage / destination shows.
    if (typeof document !== "undefined") document.getElementById("gate-preload-cover")?.remove();
    // Remember the visit so the intro is skipped on return (see gateSeenRecently).
    try {
      localStorage.setItem(GATE_SEEN_KEY, String(Date.now()));
    } catch {
      /* private mode / blocked storage - just show the gate again next time */
    }
    setActive(false);
  };

  const handlePickLanguage = (lang: Language) => {
    setLanguage(lang);
    dispatch({ type: "PICK_LANGUAGE" });
  };

  // Resolve a completed answer (level, and location when it was asked) to its
  // destination, report it, and commit.
  const commit = (level: LevelKey, location: LocationKey | null) => {
    const action = resolveAction(level, location, language);
    const destination = action.type === "navigate" ? action.path : "/";
    trackGateAnswer({ level, location, destination });

    if (action.type === "navigate") {
      // Keep the gate backdrop as a cover THROUGH the route change so "/" never
      // flashes behind it; the leaving-effect closes it once the lander mounts.
      setLeaving(true);
      navigate(action.path);
      return;
    }
    // "enter-site" just closes the gate onto the homepage that was always beneath.
    close();
  };

  const handlePickLevel = (level: LevelKey) => {
    // A total beginner only ever starts with us on Koh Tao - no location step,
    // and crucially they never see Similan (a certified-diver arena).
    if (!needsLocation(level)) {
      commit(level, null);
      return;
    }
    dispatch({ type: "PICK_LEVEL", level });
  };

  const handlePickLocation = (location: LocationKey) => {
    if (!state.level) return;
    commit(state.level, location);
  };

  return (
    <div
      dir={gateRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 85% at 86% -8%, rgba(255,250,232,0.5) 0%, rgba(176,224,255,0.28) 30%, transparent 60%), linear-gradient(to bottom, #1f73ab 0%, #2f8cc4 34%, #6fc0e8 54%, #2b87bf 60%, #15659c 74%, #0c4f80 100%)",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Siam Scuba welcome"
    >
      {/* The radial-gradient backdrop above appears instantly - it covers the
          live homepage the moment the gate mounts and serves as the anti-flash
          backdrop until the hero video's first frame paints. The SCENE below
          fades in over it (no flash of the production site). */}
      <motion.div
        initial={{ opacity: coverPresentRef.current ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute inset-0"
      >
        {/* Persistent over-under hero VIDEO background, mounted ONCE when the
            gate opens and shared across all steps (welcome -> where -> branch);
            it never unmounts or restarts between steps. Center-cover crop with a
            legibility scrim over it and under the content. Reduced-motion users
            get the poster still instead of the video. */}
        <div className="absolute inset-0" aria-hidden="true">
          {/* Poster still is always the base layer (instant, matches the pre-React
              cover). The video fades in over it only once it is actually playing,
              so iOS never shows a play-button overlay on a non-playing video. */}
          <img
            src={GATE_HERO_POSTER}
            alt=""
            draggable={false}
            className="gate-photo-bg"
          />
          {!prefersReduced && videoOn && (
            <video
              ref={videoRef}
              className="gate-photo-bg"
              style={{ opacity: videoPlaying ? 1 : 0, transition: "opacity 0.5s ease" }}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={GATE_HERO_POSTER}
            >
              {/* Small screens (most of our traffic): the lighter 720p mp4.
                  Listed first so phones - incl. iOS Safari, which skips the
                  webm - pick ~0.7MB instead of the 1.3-1.75MB desktop files. */}
              <source src={GATE_HERO_MP4_720} type="video/mp4" media="(max-width: 767px)" />
              <source src={GATE_HERO_WEBM} type="video/webm" />
              <source src={GATE_HERO_MP4} type="video/mp4" />
            </video>
          )}
          <div className="gate-photo-scrim" />
        </div>

      {/* Soft vignette for depth - light so the bright scene stays bright */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 150px 40px rgba(3,28,52,0.30)" }}
        aria-hidden="true"
      />

      {/* Hidden while leaving so only the video backdrop covers the route change
          to a lander - the question cards don't linger over the new page. */}
      {!leaving && (
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
              <span aria-hidden="true">{gateRTL ? "→" : "←"}</span>
              {copy.back}
            </button>
          )}
          <img
            src={gateLogo}
            alt="Siam Scuba"
            draggable={false}
            className={`gate-logo${state.step === "welcome" ? "" : " gate-logo--compact"}`}
          />
          {/* Always-available escape hatch: intent-driven visitors (esp. from
              ads) bypass the intro straight to the site instead of the quiz. */}
          <button
            type="button"
            onClick={close}
            className={`absolute top-4 ${gateRTL ? "left-5" : "right-5"} flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-md transition-colors hover:bg-white/15 hover:text-white`}
          >
            {copy.skip}
            <span aria-hidden="true">{gateRTL ? "←" : "→"}</span>
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center overflow-y-auto px-2 pb-[32vh]">
          {/* NO AnimatePresence here, deliberately. With mode="wait" (framer 12)
              the exiting welcome step never reported its exit as complete - it
              carries long staggered child entrance animations (delays to ~2.5s) -
              so the next step was never mounted and the gate dead-ended right
              after the language pick. Each step is a keyed motion.div that just
              fades itself IN on mount: no exit callback to hang on, no dead end.
              Remounting on `key` keeps the entrance animation per step. */}
          {state.step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex w-full justify-center"
            >
              <WelcomeStep onPickLanguage={handlePickLanguage} reducedMotion={prefersReduced} />
            </motion.div>
          )}

          {state.step === "level" && (
            <motion.div
              key="level"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex w-full justify-center"
            >
              <QuestionStep
                question={copy.level}
                onPick={(key) => handlePickLevel(key as LevelKey)}
                reducedMotion={prefersReduced}
              />
            </motion.div>
          )}

          {state.step === "location" && (
            <motion.div
              key="location"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex w-full justify-center"
            >
              <QuestionStep
                question={copy.location}
                onPick={(key) => handlePickLocation(key as LocationKey)}
                reducedMotion={prefersReduced}
              />
            </motion.div>
          )}
        </div>
      </div>
      )}
      </motion.div>
    </div>
  );
};

export default EntryGate;
