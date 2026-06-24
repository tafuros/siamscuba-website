import { useState } from "react";
import { submitChatLead } from "@/utils/tracking";
import type { Lang, LeadFormCopy } from "@/lib/landerCopy";

interface SailRockLeadFormProps {
  copy: LeadFormCopy;
  lang: Lang;
  /** Trip slug DiveOS maps to course SAILROCK. */
  course: string;
  /** Optional ISO date of the next departure, sent along as the requested dates. */
  nextIso?: string;
}

type Status = "idle" | "sending" | "sent" | "error";

const MIN_PHONE = 6;

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-white placeholder:text-white/40 outline-none transition-colors focus:border-accent focus:bg-white/[0.12]";

/**
 * Compact name + phone capture for the Sail Rock lander. POSTs to the DiveOS
 * public lead endpoint via submitChatLead (source: "lander", course: the trip
 * slug) so an interested visitor becomes an actionable Master Lead. Sits
 * alongside the WhatsApp / Book CTAs - it does not replace them.
 */
const SailRockLeadForm = ({ copy, lang, course, nextIso }: SailRockLeadFormProps) => {
  const isRtl = lang === "he";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (phone.trim().length < MIN_PHONE) {
      setStatus("error");
      return;
    }
    setStatus("sending");

    const result = await submitChatLead({
      source: "lander",
      course,
      phone: phone.trim(),
      name: name.trim() || null,
      lang,
      dates: nextIso ?? null,
      message: "Sail Rock lander - callback request",
      sessionId: null,
    });

    setStatus(result.ok ? "sent" : "error");
  };

  return (
    <form
      onSubmit={handleSubmit}
      dir={isRtl ? "rtl" : "ltr"}
      className="mx-auto w-full max-w-xl rounded-2xl bg-gradient-to-br from-ocean-surface to-ocean-deep p-6 text-white shadow-lg md:p-8"
    >
      <h3 className="text-xl font-extrabold md:text-2xl">{copy.title}</h3>
      <p className="mt-2 text-sm text-white/85">{copy.subtitle}</p>

      {status === "sent" ? (
        <p className="mt-6 rounded-xl border border-accent/40 bg-accent/15 px-5 py-6 text-center font-semibold text-white">
          {copy.success}
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/65">
                {copy.nameLabel}
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={copy.namePlaceholder}
                className={fieldClass}
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/65">
                {copy.phoneLabel}
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={copy.phonePlaceholder}
                className={fieldClass}
                autoComplete="tel"
                dir="ltr"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-xl bg-accent px-6 py-3.5 font-extrabold text-accent-foreground shadow-md transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {status === "sending" ? copy.sending : copy.submit}
          </button>

          {status === "error" && (
            <p className="text-center text-sm text-rose-200">{copy.error}</p>
          )}
        </div>
      )}
    </form>
  );
};

export default SailRockLeadForm;
