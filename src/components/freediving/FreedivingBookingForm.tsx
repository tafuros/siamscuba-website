import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { submitChatLead } from "@/utils/tracking";
import { buildWhatsAppLink, normalizeLang } from "@/utils/whatsapp";
import type { FreedivingCopy, FreedivingCourse, FreedivingCourseText } from "./freedivingContent";

interface FreedivingBookingFormProps {
  copy: FreedivingCopy;
  courses: FreedivingCourse[];
  courseText: Record<string, FreedivingCourseText>;
  selectedId: string;
  onSelect: (id: string) => void;
}

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white placeholder:text-white/35 outline-none transition-colors focus:border-ocean-light/70 focus:bg-white/[0.1]";

const FreedivingBookingForm = ({ copy, courses, courseText, selectedId, onSelect }: FreedivingBookingFormProps) => {
  const { language, isRTL } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(1);
  const [status, setStatus] = useState<Status>("idle");

  const selected = courses.find((c) => c.id === selectedId) ?? courses[0];
  const selectedName = courseText[selected.id]?.name ?? selected.id;

  // Freediving has no dedicated DiveOS course slug yet -> WhatsApp prefill uses
  // the generic Koh Tao freediving topic; the lead carries the course in `message`.
  const waLink = buildWhatsAppLink({ topic: "kt-freediving", lang: normalizeLang(language) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!phone.trim()) return;
    setStatus("sending");

    const parts = [`Siam Freediving - ${selectedName}`, `${people} ${copy.booking.people}`];
    if (date) parts.push(date);

    const result = await submitChatLead({
      phone: phone.trim(),
      name: name.trim() || null,
      lang: normalizeLang(language),
      course: null,
      dates: date || null,
      message: parts.join(" · "),
      sessionId: null,
    });

    setStatus(result.ok ? "sent" : "error");
  };

  return (
    <form
      onSubmit={handleSubmit}
      dir={isRTL ? "rtl" : "ltr"}
      className="mx-auto w-full max-w-xl rounded-3xl border border-white/12 bg-white/[0.04] p-6 backdrop-blur-md sm:p-8"
    >
      <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">{copy.booking.title}</h3>
      <p className="mt-2 text-sm text-ocean-surface/75">{copy.booking.subtitle}</p>

      {status === "sent" ? (
        <p className="mt-6 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-5 py-6 text-center text-emerald-100">
          {copy.booking.success}
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/55">
              {copy.booking.course}
            </span>
            <select value={selectedId} onChange={(e) => onSelect(e.target.value)} className={fieldClass}>
              {courses.map((c) => (
                <option key={c.id} value={c.id} className="bg-ocean-deep text-white">
                  {courseText[c.id]?.name ?? c.id}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.booking.name}
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={copy.booking.namePh}
                className={fieldClass}
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.booking.phone}
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={copy.booking.phonePh}
                className={fieldClass}
                autoComplete="tel"
                dir="ltr"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.booking.date}
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${fieldClass} [color-scheme:dark]`}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.booking.people}
              </span>
              <select value={people} onChange={(e) => setPeople(Number(e.target.value))} className={fieldClass}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n} className="bg-ocean-deep text-white">
                    {n}
                    {n === 6 ? "+" : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-xl bg-gradient-to-r from-ocean-mid to-ocean-light px-6 py-3.5 font-semibold text-ocean-deep shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {status === "sending" ? copy.booking.sending : copy.booking.submit}
          </button>

          {status === "error" && <p className="text-center text-sm text-rose-200">{copy.booking.error}</p>}

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-ocean-light/90 underline-offset-4 hover:underline"
          >
            {copy.booking.whatsapp}
          </a>
        </div>
      )}
    </form>
  );
};

export default FreedivingBookingForm;
