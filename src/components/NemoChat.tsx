import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, MessageCircle, Sailboat, GraduationCap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildWhatsAppLink, normalizeLang } from "@/utils/whatsapp";
import {
  trackWhatsAppClick,
  trackChatOpen,
  trackChatEngaged,
  trackChatCtaClick,
  submitChatLead,
} from "@/utils/tracking";

type Msg = { role: "user" | "assistant"; content: string };

type Copy = {
  pill: string;
  title: string;
  sub: string;
  placeholder: string;
  wa: string;
  error: string;
  suggestions: { emoji: string; label: string }[];
  // Persistent CTA row
  ctaFunDive: string;
  ctaWhatsApp: string;
  ctaCourses: string;
  // Lead capture
  leadPrompt: string;
  leadCta: string;
  leadName: string;
  leadPhone: string;
  leadSubmit: string;
  leadSuccess: string;
  leadError: string;
  // Teaser bubble
  teaser: string;
  teaserKohTao: string;
};

const COPY: Record<string, Copy> = {
  en: {
    pill: "Ask Nemo",
    title: "Hey, I'm Nemo!",
    sub: "Ask me about diving in Koh Tao 🌊",
    placeholder: "Type your question...",
    wa: "Talk to a human on WhatsApp",
    error: "Sorry, I had a hiccup 🫧 Please try again or message us on WhatsApp.",
    suggestions: [
      { emoji: "🐠", label: "Can I dive with no experience?" },
      { emoji: "🤿", label: "I'm certified - I want to dive" },
      { emoji: "🌊", label: "Which dive sites do you go to?" },
      { emoji: "🔄", label: "I haven't dived in a while" },
    ],
    ctaFunDive: "Book a fun dive",
    ctaWhatsApp: "WhatsApp",
    ctaCourses: "See courses",
    leadPrompt: "Want us to hold a spot? Leave your name and WhatsApp number and the team will reach out.",
    leadCta: "Leave your WhatsApp number",
    leadName: "Your name",
    leadPhone: "WhatsApp number (e.g. +66...)",
    leadSubmit: "Send to the team",
    leadSuccess: "Got it! 🐠 The team will message you on WhatsApp shortly.",
    leadError: "Couldn't send that. Please try WhatsApp instead 🫧",
    teaser: "Diving in Koh Tao? I can help 🐠",
    teaserKohTao: "Diving Koh Tao? I can check dates 🤿",
  },
  he: {
    pill: "שאל את נמו",
    title: "היי, אני נמו!",
    sub: "שאלו אותי על צלילה בקוטאו 🌊",
    placeholder: "כתבו את השאלה...",
    wa: "לדבר עם נציג בוואטסאפ",
    error: "סליחה, הייתה תקלה קטנה 🫧 נסו שוב או כתבו לנו בוואטסאפ.",
    suggestions: [
      { emoji: "🐠", label: "אפשר לצלול בלי ניסיון?" },
      { emoji: "🤿", label: "יש לי רישיון ואני רוצה לצלול" },
      { emoji: "🌊", label: "באיזה אתרים יוצאים לצלול?" },
      { emoji: "🔄", label: "לא צללתי הרבה זמן" },
    ],
    ctaFunDive: "הזמנת צלילה",
    ctaWhatsApp: "וואטסאפ",
    ctaCourses: "קורסים",
    leadPrompt: "רוצים שנשמור לכם מקום? השאירו שם ומספר וואטסאפ והצוות יחזור אליכם.",
    leadCta: "השאירו מספר וואטסאפ",
    leadName: "השם שלכם",
    leadPhone: "מספר וואטסאפ (למשל +972...)",
    leadSubmit: "שליחה לצוות",
    leadSuccess: "קיבלנו! 🐠 הצוות יכתוב לכם בוואטסאפ בקרוב.",
    leadError: "לא הצלחנו לשלוח. נסו דרך וואטסאפ 🫧",
    teaser: "צוללים בקוטאו? אני אשמח לעזור 🐠",
    teaserKohTao: "צוללים בקוטאו? אני יכול לבדוק תאריכים 🤿",
  },
  es: {
    pill: "Pregunta a Nemo",
    title: "¡Hola, soy Nemo!",
    sub: "Pregúntame sobre bucear en Koh Tao 🌊",
    placeholder: "Escribe tu pregunta...",
    wa: "Habla con una persona por WhatsApp",
    error: "Lo siento, tuve un problemilla 🫧 Inténtalo de nuevo o escríbenos por WhatsApp.",
    suggestions: [
      { emoji: "🐠", label: "¿Puedo bucear sin experiencia?" },
      { emoji: "🤿", label: "Tengo licencia y quiero bucear" },
      { emoji: "🌊", label: "¿A qué sitios de buceo vais?" },
      { emoji: "🔄", label: "Hace tiempo que no buceo" },
    ],
    ctaFunDive: "Reserva una inmersión",
    ctaWhatsApp: "WhatsApp",
    ctaCourses: "Ver cursos",
    leadPrompt: "¿Quieres que te guardemos una plaza? Deja tu nombre y número de WhatsApp y el equipo te escribirá.",
    leadCta: "Deja tu número de WhatsApp",
    leadName: "Tu nombre",
    leadPhone: "Número de WhatsApp (p. ej. +34...)",
    leadSubmit: "Enviar al equipo",
    leadSuccess: "¡Listo! 🐠 El equipo te escribirá por WhatsApp en breve.",
    leadError: "No se pudo enviar. Prueba por WhatsApp 🫧",
    teaser: "¿Buceo en Koh Tao? Puedo ayudarte 🐠",
    teaserKohTao: "¿Buceo en Koh Tao? Puedo mirar fechas 🤿",
  },
};

// Per-route course hint for the lead payload, so a lead captured on a specific
// lander carries the right course tag for DiveOS + offline-conversion upload.
function courseFromPath(pathname: string): string | null {
  const p = pathname.toLowerCase();
  if (/open-water/.test(p)) return "open-water";
  if (/discover-scuba/.test(p)) return "discover-scuba";
  if (/fun-dive/.test(p)) return "fun-dive";
  if (/sail-rock/.test(p)) return "sail-rock";
  if (/koh-tao-diving/.test(p)) return "fun-dive";
  return null;
}

const TEASER_DISMISSED_KEY = "nemo_teaser_dismissed";

// One stable id per chat session, shared by the chat-log and the lead capture so
// DiveOS can link a conversation to the lead it produced (see chat-console
// contract). Persisted in sessionStorage so reopening the widget continues the
// same conversation row rather than starting a new one.
const CHAT_SESSION_KEY = "nemo_chat_session_id";
function randomId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 14)}`;
  }
}
function getChatSessionId(): string {
  try {
    const existing = sessionStorage.getItem(CHAT_SESSION_KEY);
    if (existing) return existing;
    const id = randomId();
    sessionStorage.setItem(CHAT_SESSION_KEY, id);
    return id;
  } catch {
    return randomId();
  }
}

// A few bubbles that rise inside the avatar tank (static config - no randomness).
const AVATAR_BUBBLES = [
  { left: "24%", size: 5, delay: 0 },
  { left: "50%", size: 7, delay: 0.9 },
  { left: "70%", size: 4, delay: 1.7 },
  { left: "38%", size: 6, delay: 2.5 },
  { left: "60%", size: 3, delay: 1.3 },
];

// Nemo in an ocean-blue "tank": the deep-blue gradient makes the yellow fish
// pop (complementary contrast), bubbles rise behind him, and he gently floats.
// `active` (true while awaiting a reply) makes him swim faster + bubbles speed up.
function NemoAvatar({
  size,
  active = false,
  className = "",
}: {
  size: number;
  active?: boolean;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const fish = size * 0.82;
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border-[3px] border-white/60 shadow-lg ${className}`}
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 50% 28%, hsl(192 90% 60%), hsl(204 84% 42%) 55%, hsl(210 82% 24%))",
      }}
    >
      {AVATAR_BUBBLES.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white/50"
          style={{ width: b.size, height: b.size, left: b.left, bottom: -6 }}
          animate={{ y: [0, -(size + 12)], opacity: [0, 0.7, 0] }}
          transition={{ duration: active ? 1.7 : 3.4, repeat: Infinity, delay: b.delay, ease: "easeOut" }}
        />
      ))}
      <span
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.35), transparent 55%)" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {broken ? (
          <span style={{ fontSize: size * 0.5 }} aria-hidden>🐠</span>
        ) : (
          <motion.img
            src="/nemo/nemo-avatar.webp"
            alt=""
            aria-hidden
            onError={() => setBroken(true)}
            style={{ width: fish, height: fish, objectFit: "contain" }}
            animate={
              active
                ? { y: [0, -size * 0.09, 0], rotate: [0, -7, 5, 0] }
                : { y: [0, -size * 0.05, 0], rotate: [0, -3, 3, 0] }
            }
            transition={{ duration: active ? 1.0 : 3.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </div>
  );
}

const NemoChat = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const copy = COPY[language] ?? COPY.en;
  const isRtl = language === "he";
  const isKohTao = /koh-tao-diving/.test(location.pathname);
  // On the Fun Dive booking page the form lives in a full-height DiveOS iframe
  // whose Next/Back buttons sit bottom-right - exactly where the Nemo pill
  // floats. Collapse Nemo to just the fish avatar (and suppress the teaser)
  // there so it never overlaps the form's action buttons on mobile.
  const isBooking = /fun-dive-booking/.test(location.pathname);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Teaser bubble (dismissible, once per session).
  const [showTeaser, setShowTeaser] = useState(false);

  // Lead-capture mini-form state.
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // Fired-once guards.
  const engagedRef = useRef(false);

  // Stable per-session id (lazy - only created once the visitor actually chats).
  const sessionIdRef = useRef<string | null>(null);
  const getSessionId = useCallback(() => {
    if (!sessionIdRef.current) sessionIdRef.current = getChatSessionId();
    return sessionIdRef.current;
  }, []);

  const waHref = buildWhatsAppLink({
    lang: normalizeLang(language),
    pathname: location.pathname,
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, showLeadForm]);

  // ── Teaser bubble trigger ──────────────────────────────────────────────────
  // Show a small, dismissible teaser after dwell time (or 50% scroll), once per
  // session. On koh-tao landers fire faster with koh-tao copy.
  useEffect(() => {
    if (open || isBooking) return;
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(TEASER_DISMISSED_KEY) === "1";
    } catch {
      /* sessionStorage unavailable - just skip the teaser */
    }
    if (dismissed) return;

    const dwellMs = isKohTao ? 5000 : 10000;
    let shown = false;
    const reveal = () => {
      if (shown || open) return;
      shown = true;
      setShowTeaser(true);
    };

    const timer = window.setTimeout(reveal, dwellMs);
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      if (scrolled >= document.documentElement.scrollHeight * 0.5) reveal();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, isKohTao, isBooking]);

  const dismissTeaser = useCallback(() => {
    setShowTeaser(false);
    try {
      sessionStorage.setItem(TEASER_DISMISSED_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const openChat = useCallback(
    (source: "pill" | "teaser") => {
      setOpen(true);
      trackChatOpen(source);
      // Opening from the teaser also retires it for the session.
      if (source === "teaser") dismissTeaser();
      else setShowTeaser(false);
    },
    [dismissTeaser],
  );

  // Lock page scroll while the chat is open so finger-drags move the chat (or
  // nothing) instead of the page behind it. The `top: -scrollY` trick keeps the
  // background visually in place (no jump) and is the iOS-Safari-safe approach -
  // plain `overflow:hidden` on body does not stop touch scrolling on iOS.
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      Object.assign(body.style, prev);
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || loading) return;

      // First user message of the session = engagement signal.
      if (!engagedRef.current) {
        engagedRef.current = true;
        trackChatEngaged();
      }

      const next = [...messages, { role: "user" as const, content: clean }];
      setMessages(next);
      setInput("");
      setLoading(true);

      // Lead form is opened ONLY by explicit user click on the nudge button
      // below - never auto-popped, so the conversation never feels pressured.

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next,
            lang: language,
            sessionId: getSessionId(),
            page: location.pathname,
          }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        setMessages((m) => [...m, { role: "assistant", content: data.reply || copy.error }]);
      } catch {
        setMessages((m) => [...m, { role: "assistant", content: copy.error }]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, language, copy.error, getSessionId, location.pathname],
  );

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? null;

  const submitLead = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (leadStatus === "sending") return;
      const phone = leadPhone.trim();
      if (!phone) return;
      setLeadStatus("sending");
      const result = await submitChatLead({
        phone,
        name: leadName.trim() || null,
        lang: normalizeLang(language),
        course: courseFromPath(location.pathname),
        message: lastUserMessage,
        sessionId: getSessionId(),
      });
      setLeadStatus(result.ok ? "sent" : "error");
    },
    [leadStatus, leadPhone, leadName, language, location.pathname, lastUserMessage, getSessionId],
  );

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* ── Floating pill trigger + teaser bubble ── */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
          >
            {/* Teaser bubble */}
            <AnimatePresence>
              {showTeaser && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 360, damping: 26 }}
                  className="relative max-w-[230px] rounded-2xl rounded-br-sm border border-border bg-white px-3 py-2.5 pe-7 text-[13px] font-semibold text-ocean-deep shadow-xl"
                >
                  <button
                    onClick={() => openChat("teaser")}
                    className="text-start"
                    aria-label={isKohTao ? copy.teaserKohTao : copy.teaser}
                  >
                    {isKohTao ? copy.teaserKohTao : copy.teaser}
                  </button>
                  <button
                    onClick={dismissTeaser}
                    aria-label="Dismiss"
                    className="absolute end-1.5 top-1.5 rounded-full p-0.5 text-muted-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => openChat("pill")}
              aria-label={copy.pill}
              className={
                isBooking
                  ? "rounded-full shadow-lg transition-shadow hover:shadow-xl"
                  : "flex items-center gap-2 rounded-full border border-border bg-white py-2 pl-2 pr-4 shadow-lg transition-shadow hover:shadow-xl"
              }
            >
              <NemoAvatar size={isBooking ? 48 : 40} />
              {!isBooking && <span className="text-sm font-bold text-ocean-deep">{copy.pill}</span>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed bottom-4 right-4 z-50 flex h-[min(560px,80dvh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[22px] border border-border bg-white shadow-2xl"
          >
            {/* header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-ocean-mid to-ocean-deep px-4 pb-4 pt-5 text-center text-white">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="absolute end-3 top-3 rounded-full p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <NemoAvatar size={84} active={loading} className="mx-auto" />
              <div className="mt-2 text-base font-extrabold">{copy.title}</div>
              <div className="text-xs text-white/90">{copy.sub}</div>
            </div>

            {/* Persistent CTA row - NOT LLM-dependent. Each fires its own event. */}
            <div className="grid grid-cols-3 gap-1.5 border-b border-border bg-secondary/30 px-2.5 py-2">
              <Link
                to="/fun-dive-booking"
                onClick={() => trackChatCtaClick("fun_dive")}
                className="flex flex-col items-center gap-1 rounded-lg border border-border bg-white px-1 py-1.5 text-center text-[11px] font-semibold leading-tight text-ocean-deep transition-colors hover:border-coral hover:bg-coral/5"
              >
                <Sailboat className="h-4 w-4 text-coral" />
                {copy.ctaFunDive}
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackChatCtaClick("whatsapp");
                  trackWhatsAppClick({ location: "nemo-chat-cta", url: waHref });
                }}
                className="flex flex-col items-center gap-1 rounded-lg border border-border bg-white px-1 py-1.5 text-center text-[11px] font-semibold leading-tight text-ocean-deep transition-colors hover:border-[#25D366] hover:bg-[#25D366]/5"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                {copy.ctaWhatsApp}
              </a>
              <a
                href="/#courses"
                onClick={() => trackChatCtaClick("courses")}
                className="flex flex-col items-center gap-1 rounded-lg border border-border bg-white px-1 py-1.5 text-center text-[11px] font-semibold leading-tight text-ocean-deep transition-colors hover:border-coral hover:bg-coral/5"
              >
                <GraduationCap className="h-4 w-4 text-coral" />
                {copy.ctaCourses}
              </a>
            </div>

            {/* body */}
            <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto overscroll-contain bg-gradient-to-b from-secondary/40 to-white px-3 py-3.5">
              {messages.length === 0 && (
                <div className="space-y-2">
                  {copy.suggestions.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => send(s.label)}
                      className="block w-full rounded-[13px] border border-border bg-white px-3 py-2.5 text-start text-[13px] font-semibold text-ocean-deep transition-colors hover:border-coral hover:bg-coral/5"
                    >
                      <span className="me-2">{s.emoji}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "ms-auto rounded-br-sm bg-ocean-mid text-white"
                      : "me-auto rounded-bl-sm border border-border bg-white text-foreground shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              ))}

              {loading && (
                <div className="me-auto flex gap-1 rounded-2xl rounded-bl-sm border border-border bg-white px-3 py-3 shadow-sm">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
                      animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                    />
                  ))}
                </div>
              )}

              {/* Lead-capture mini-form (inline, in the message stream) */}
              {showLeadForm && leadStatus !== "sent" && (
                <div className="me-auto w-[92%] rounded-2xl rounded-bl-sm border border-coral/40 bg-coral/5 p-3 shadow-sm">
                  <p className="mb-2 text-[12.5px] font-medium leading-snug text-ocean-deep">
                    {copy.leadPrompt}
                  </p>
                  <form onSubmit={submitLead} className="space-y-2">
                    <input
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder={copy.leadName}
                      aria-label={copy.leadName}
                      className="w-full rounded-lg border border-border bg-white px-2.5 py-2 text-[13px] text-foreground outline-none focus:border-coral"
                    />
                    <input
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder={copy.leadPhone}
                      aria-label={copy.leadPhone}
                      inputMode="tel"
                      className="w-full rounded-lg border border-border bg-white px-2.5 py-2 text-[13px] text-foreground outline-none focus:border-coral"
                    />
                    {leadStatus === "error" && (
                      <p className="text-[12px] font-medium text-red-600">{copy.leadError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={!leadPhone.trim() || leadStatus === "sending"}
                      className="w-full rounded-lg bg-coral py-2 text-[13px] font-bold text-white transition-opacity disabled:opacity-40"
                    >
                      {copy.leadSubmit}
                    </button>
                  </form>
                </div>
              )}

              {leadStatus === "sent" && (
                <div className="me-auto max-w-[85%] rounded-2xl rounded-bl-sm border border-coral/40 bg-coral/5 px-3 py-2 text-[13px] font-medium text-ocean-deep shadow-sm">
                  {copy.leadSuccess}
                </div>
              )}
            </div>

            {/* Soft lead-capture nudge (shown before the form auto-opens) */}
            {!showLeadForm && leadStatus === "idle" && messages.length > 0 && (
              <button
                onClick={() => setShowLeadForm(true)}
                className="mx-3 mb-1 rounded-[13px] border border-dashed border-coral/50 py-2 text-[12.5px] font-semibold text-coral transition-colors hover:bg-coral/5"
              >
                {copy.leadCta}
              </button>
            )}

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border bg-white p-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={copy.placeholder}
                aria-label={copy.placeholder}
                className="flex-1 bg-transparent px-2 py-2 text-sm text-foreground outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-coral text-white transition-opacity disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NemoChat;
