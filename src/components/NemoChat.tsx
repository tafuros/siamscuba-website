import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildWhatsAppLink, normalizeLang } from "@/utils/whatsapp";
import { trackWhatsAppClick } from "@/utils/tracking";

type Msg = { role: "user" | "assistant"; content: string };

type Copy = {
  pill: string;
  title: string;
  sub: string;
  placeholder: string;
  wa: string;
  error: string;
  suggestions: { emoji: string; label: string }[];
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
  },
};

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
            src="/nemo/nemo-avatar.png"
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

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const waHref = buildWhatsAppLink({
    lang: normalizeLang(language),
    pathname: location.pathname,
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || loading) return;
      const next = [...messages, { role: "user" as const, content: clean }];
      setMessages(next);
      setInput("");
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next, lang: language }),
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
    [messages, loading, language, copy.error],
  );

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* ── Floating pill trigger ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => setOpen(true)}
            aria-label={copy.pill}
            className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-border bg-white py-2 pl-2 pr-4 shadow-lg transition-shadow hover:shadow-xl"
          >
            <NemoAvatar size={40} />
            <span className="text-sm font-bold text-ocean-deep">{copy.pill}</span>
          </motion.button>
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
            className="fixed bottom-4 right-4 z-40 flex h-[min(560px,80vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[22px] border border-border bg-white shadow-2xl"
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

            {/* body */}
            <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto bg-gradient-to-b from-secondary/40 to-white px-3 py-3.5">
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
            </div>

            {/* WhatsApp handoff */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ location: "nemo-chat", url: waHref })}
              className="mx-3 mb-2 flex items-center justify-center gap-2 rounded-[13px] bg-[#25D366] py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              {copy.wa}
            </a>

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
