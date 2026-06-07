import { MessageCircle, FileText } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

// Office WhatsApp for sending diving license + last dive record (logbook).
// This is the OPERATIONS number (Koh Tao office), intentionally distinct from
// the general marketing WhatsApp in src/utils/whatsapp.ts.
const OFFICE_WHATSAPP = "66825068898";
const PREFILL =
  "Hi, I just booked a fun dive - here are my license and last dive record.";

const waHref = `https://wa.me/${OFFICE_WHATSAPP}?text=${encodeURIComponent(PREFILL)}`;

interface FunDiveDocsNoticeProps {
  className?: string;
}

const FunDiveDocsNotice = ({ className = "" }: FunDiveDocsNoticeProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div
      className={`rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 text-left ${
        isRTL ? "rtl:text-right" : ""
      } ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground sm:text-base">
            {t("fundive_docs_title")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("fundive_docs_body")}
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1ebe5d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
          >
            <MessageCircle className="h-4 w-4" />
            {t("fundive_docs_button")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default FunDiveDocsNotice;
