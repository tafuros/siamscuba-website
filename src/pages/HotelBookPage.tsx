import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import Seo from "@/components/Seo";
import type { Language } from "@/i18n/translations";
import { HOTEL_INFO, HOTEL_ROOMS, hotelPath, hotelWhatsAppLink } from "@/data/hotel";

/**
 * /hotel/book - registration completion for APPROVED bookings (stage 3 of the
 * two-stage booking flow). The final-confirmation email links here with
 * ?ref=<guest-token>.
 *
 * Token handling is CLIENT-SIDE ONLY: vite-react-ssg prerenders the shell, so
 * the query string is read in an effect after hydration. The payload half of
 * the token is decoded locally for DISPLAY only - verification happens
 * server-side in api/hotel-booking.ts when the form is submitted
 * (POST ?action=register). noindex: these URLs are personal.
 */

interface GuestPayload {
  typ: string;
  ref: string;
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  lang: Language;
}

function decodePayload(token: string): GuestPayload | null {
  try {
    const b64 = token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(
      new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))),
    ) as GuestPayload;
    if (json?.typ !== "guest" || !json.ref || !json.room) return null;
    return json;
  } catch {
    return null;
  }
}

interface BookPageCopy {
  title: string;
  subtitle: string;
  summaryTitle: string;
  nights: (n: number) => string;
  guests: (n: number) => string;
  arrivalTime: string;
  ferry: string;
  nationality: string;
  requests: string;
  submit: string;
  sending: string;
  doneTitle: string;
  doneBody: string;
  invalidTitle: string;
  invalidBody: string;
  error: string;
  backToHotel: string;
  whatsapp: string;
}

const COPY: Record<Language, BookPageCopy> = {
  en: {
    title: "Complete your registration",
    subtitle: "Your room is confirmed - these details make check-in quicker.",
    summaryTitle: "Your stay",
    nights: (n) => `${n} ${n === 1 ? "night" : "nights"}`,
    guests: (n) => `${n} ${n === 1 ? "guest" : "guests"}`,
    arrivalTime: "Approximate arrival time",
    ferry: "Ferry / boat you arrive on (if known)",
    nationality: "Nationality",
    requests: "Special requests (optional)",
    submit: "Complete registration",
    sending: "Sending...",
    doneTitle: "You're all set!",
    doneBody:
      "Thanks - we have everything we need. A reminder for check-in: a 3,000 THB deposit is taken at the desk (returned at check-out), and reception is open until 21:00. See you on Sairee Beach!",
    invalidTitle: "This link is not valid anymore",
    invalidBody:
      "The registration link may have expired or is incomplete. No worries - message us on WhatsApp and we will sort it out.",
    error: "Something went wrong - please try again, or message us on WhatsApp.",
    backToHotel: "Back to the hotel page",
    whatsapp: "Chat on WhatsApp",
  },
  he: {
    title: "השלמת הרשמה",
    subtitle: "החדר שלך מאושר - הפרטים האלה מקצרים את הצ'ק-אין.",
    summaryTitle: "השהות שלך",
    nights: (n) => (n === 1 ? "לילה אחד" : `${n} לילות`),
    guests: (n) => (n === 1 ? "אורח אחד" : `${n} אורחים`),
    arrivalTime: "שעת הגעה משוערת",
    ferry: "המעבורת שבה אתם מגיעים (אם ידוע)",
    nationality: "אזרחות",
    requests: "בקשות מיוחדות (לא חובה)",
    submit: "השלמת הרשמה",
    sending: "שולח...",
    doneTitle: "הכל מוכן!",
    doneBody:
      "תודה - יש לנו את כל מה שצריך. תזכורת לצ'ק-אין: בקבלה נגבה פיקדון של 3,000 באט (מוחזר בצ'ק-אאוט), והקבלה פתוחה עד 21:00. נתראה בחוף סיירי!",
    invalidTitle: "הקישור כבר לא בתוקף",
    invalidBody: "קישור ההרשמה פג או חלקי. לא נורא - כתבו לנו בוואטסאפ ונסדר את זה.",
    error: "משהו השתבש - נסו שוב, או כתבו לנו בוואטסאפ.",
    backToHotel: "חזרה לעמוד המלון",
    whatsapp: "לצ'אט בוואטסאפ",
  },
  es: {
    title: "Completa tu registro",
    subtitle: "Tu habitación está confirmada; estos datos agilizan el check-in.",
    summaryTitle: "Tu estancia",
    nights: (n) => `${n} ${n === 1 ? "noche" : "noches"}`,
    guests: (n) => `${n} ${n === 1 ? "huésped" : "huéspedes"}`,
    arrivalTime: "Hora aproximada de llegada",
    ferry: "Ferry / barco en el que llegas (si lo sabes)",
    nationality: "Nacionalidad",
    requests: "Peticiones especiales (opcional)",
    submit: "Completar registro",
    sending: "Enviando...",
    doneTitle: "¡Todo listo!",
    doneBody:
      "Gracias, ya tenemos todo lo necesario. Un recordatorio para el check-in: en recepción se toma un depósito de 3.000 THB (se devuelve al hacer el check-out) y la recepción abre hasta las 21:00. ¡Nos vemos en Sairee Beach!",
    invalidTitle: "Este enlace ya no es válido",
    invalidBody:
      "El enlace de registro puede haber caducado o estar incompleto. No pasa nada: escríbenos por WhatsApp y lo resolvemos.",
    error: "Algo salió mal - inténtalo de nuevo o escríbenos por WhatsApp.",
    backToHotel: "Volver a la página del hotel",
    whatsapp: "Chatear por WhatsApp",
  },
  fr: {
    title: "Complétez votre enregistrement",
    subtitle: "Votre chambre est confirmée - ces détails accélèrent le check-in.",
    summaryTitle: "Votre séjour",
    nights: (n) => `${n} ${n === 1 ? "nuit" : "nuits"}`,
    guests: (n) => `${n} ${n === 1 ? "personne" : "personnes"}`,
    arrivalTime: "Heure d'arrivée approximative",
    ferry: "Ferry / bateau d'arrivée (si connu)",
    nationality: "Nationalité",
    requests: "Demandes particulières (facultatif)",
    submit: "Terminer l'enregistrement",
    sending: "Envoi...",
    doneTitle: "Tout est prêt !",
    doneBody:
      "Merci - nous avons tout ce qu'il nous faut. Petit rappel pour le check-in : une caution de 3 000 THB est demandée à la réception (rendue au check-out), et la réception est ouverte jusqu'à 21h00. À bientôt sur Sairee Beach !",
    invalidTitle: "Ce lien n'est plus valide",
    invalidBody:
      "Le lien d'enregistrement a peut-être expiré ou est incomplet. Pas de souci - écrivez-nous sur WhatsApp et nous arrangerons cela.",
    error: "Un problème est survenu - réessayez, ou écrivez-nous sur WhatsApp.",
    backToHotel: "Retour à la page de l'hôtel",
    whatsapp: "Discuter sur WhatsApp",
  },
};

const FIELD =
  "w-full rounded-xl border border-[#d5e2ec] bg-white/80 px-3.5 py-2.5 text-sm text-[#072a45] outline-none transition focus:border-[#0b4a8f]/60 focus:bg-white";
const LABEL = "mb-1 block text-xs font-medium text-[#072a45]/60";
const DAY_MS = 86_400_000;

type Status = "loading" | "invalid" | "form" | "sending" | "done" | "error";

const HotelBookPage = () => {
  const [token, setToken] = useState("");
  const [payload, setPayload] = useState<GuestPayload | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("ref") ?? "";
    const p = t ? decodePayload(t) : null;
    setToken(t);
    setPayload(p);
    setStatus(p ? "form" : "invalid");
  }, []);

  const lang: Language = payload?.lang && payload.lang in COPY ? payload.lang : "en";
  const copy = COPY[lang];
  const room = payload ? HOTEL_ROOMS.find((r) => r.slug === payload.room) : undefined;
  const nights = payload
    ? Math.max(
        1,
        Math.round(
          (Date.parse(`${payload.checkOut}T00:00:00Z`) - Date.parse(`${payload.checkIn}T00:00:00Z`)) /
            DAY_MS,
        ),
      )
    : 0;
  const waHref = hotelWhatsAppLink(lang);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/hotel-booking?action=register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          details: {
            arrivalTime: form.get("arrivalTime"),
            ferry: form.get("ferry"),
            nationality: form.get("nationality"),
            requests: form.get("requests"),
          },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? `status ${res.status}`);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const whatsappFallback = (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1da851]"
    >
      <MessageCircle className="h-4 w-4" />
      {copy.whatsapp}
    </a>
  );

  return (
    <>
      <Seo
        title={`${copy.title} - ${HOTEL_INFO.name}`}
        description={copy.subtitle}
        canonical="https://siamscuba.com/hotel/book"
        noindex
      />
      <div
        dir={lang === "he" ? "rtl" : "ltr"}
        className="min-h-screen bg-[#f2f7fb] px-4 py-10 font-body text-[#072a45] antialiased"
        style={{
          backgroundImage:
            "radial-gradient(1200px 600px at 15% -5%, rgba(31,168,221,0.16), transparent 60%), radial-gradient(900px 500px at 95% 15%, rgba(246,239,226,0.9), transparent 55%)",
        }}
      >
        <div className="mx-auto max-w-md">
          <img
            src="/hotel/siam-hotel-hostel-logo.png"
            alt={HOTEL_INFO.name}
            width={456}
            height={420}
            className="mx-auto mb-6 h-16 w-auto"
          />

          <div className="rounded-[26px] border border-white/70 bg-white/70 p-6 shadow-[0_12px_40px_-16px_rgba(7,42,69,0.35)] backdrop-blur-xl">
            {status === "loading" && (
              <p className="py-8 text-center text-sm text-[#072a45]/50">…</p>
            )}

            {status === "invalid" && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <h1 className="font-display text-2xl">{copy.invalidTitle}</h1>
                <p className="text-sm leading-relaxed text-[#072a45]/70">{copy.invalidBody}</p>
                {whatsappFallback}
                <a href={hotelPath(lang)} className="text-sm font-medium text-[#0b4a8f] hover:underline">
                  {copy.backToHotel}
                </a>
              </div>
            )}

            {status === "done" && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" strokeWidth={1.5} />
                <h1 className="font-display text-2xl">{copy.doneTitle}</h1>
                <p className="text-sm leading-relaxed text-[#072a45]/70">{copy.doneBody}</p>
                <a href={hotelPath(lang)} className="text-sm font-medium text-[#0b4a8f] hover:underline">
                  {copy.backToHotel}
                </a>
              </div>
            )}

            {(status === "form" || status === "sending" || status === "error") && payload && (
              <>
                <h1 className="font-display text-2xl leading-tight">{copy.title}</h1>
                <p className="mt-1 text-sm text-[#072a45]/60">{copy.subtitle}</p>

                <div className="mt-5 rounded-2xl bg-[#f2f7fb] px-4 py-3.5 text-sm leading-relaxed">
                  <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#072a45]/45">
                    {copy.summaryTitle}
                  </p>
                  <p className="font-semibold">{room?.name[lang] ?? payload.room}</p>
                  <p className="text-[#072a45]/70">
                    {payload.checkIn} → {payload.checkOut} · {copy.nights(nights)} ·{" "}
                    {copy.guests(payload.guests)}
                  </p>
                  <p className="text-xs text-[#072a45]/45">Ref {payload.ref}</p>
                </div>

                <form onSubmit={submit} className="mt-5 flex flex-col gap-3.5">
                  <div>
                    <label htmlFor="arrivalTime" className={LABEL}>
                      {copy.arrivalTime}
                    </label>
                    <input id="arrivalTime" name="arrivalTime" type="text" maxLength={100} className={FIELD} />
                  </div>
                  <div>
                    <label htmlFor="ferry" className={LABEL}>
                      {copy.ferry}
                    </label>
                    <input id="ferry" name="ferry" type="text" maxLength={100} className={FIELD} />
                  </div>
                  <div>
                    <label htmlFor="nationality" className={LABEL}>
                      {copy.nationality}
                    </label>
                    <input id="nationality" name="nationality" type="text" maxLength={100} className={FIELD} />
                  </div>
                  <div>
                    <label htmlFor="requests" className={LABEL}>
                      {copy.requests}
                    </label>
                    <textarea id="requests" name="requests" rows={3} maxLength={500} className={FIELD} />
                  </div>

                  {status === "error" && (
                    <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                      {copy.error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="mt-1 rounded-full bg-[#0b4a8f] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(11,74,143,0.9)] transition hover:bg-[#0a3a6b] disabled:opacity-60"
                  >
                    {status === "sending" ? copy.sending : copy.submit}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HotelBookPage;
