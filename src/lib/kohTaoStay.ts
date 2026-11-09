// Content of the Hebrew "where to sleep on Koh Tao" guide (/he/koh-tao-stay).
// Facts here come only from the marketing brief - no prices, ratings, amenities
// or distances, since the places did not supply or approve any.

export type StaySectionId = "quiet" | "center" | "premium" | "super_premium";

export interface StayPlace {
  name: string;
  /** Short line under the name. An area wherever the brief gives one. */
  label: string;
  image: string;
  alt: string;
  mapUrl: string;
  /** Digits only, international format. Only for places that gave a number. */
  whatsapp?: string;
  /** Who answers, when the place named a contact person. */
  whatsappContact?: string;
  badges?: string[];
}

export interface StaySection {
  id: StaySectionId;
  title: string;
  intro: string;
  places: StayPlace[];
}

export const STAY_PATH = "/he/koh-tao-stay";

const NOT_ON_BOOKING = "לא בבוקינג";

export const STAY_SECTIONS: StaySection[] = [
  {
    id: "quiet",
    title: "שקט",
    intro: "לישון בצד השקט של האי.",
    places: [
      {
        name: "Mountain Reef Beach Resort",
        label: "טנוטה",
        image: "/koh-tao-stay/tanote1-2.webp",
        alt: "חוף חול ובקתות על הסלעים ב-Mountain Reef Beach Resort",
        mapUrl: "https://maps.app.goo.gl/CDbhM6r3L2thkdxo8",
      },
      {
        name: "Lub d Koh Tao Tanote Bay",
        label: "טנוטה",
        image: "/koh-tao-stay/tanote2-1.webp",
        alt: "חדר עם מיטה זוגית וחלון לירוק ב-Lub d Koh Tao Tanote Bay",
        mapUrl: "https://maps.app.goo.gl/WfZKMDXj4VCWEGe19",
      },
      {
        name: "Tao Thong Villa",
        label: "סאי נואן",
        image: "/koh-tao-stay/sainuan-2.webp",
        alt: "בקתות על הגבעה מעל המים ב-Tao Thong Villa",
        mapUrl: "https://maps.app.goo.gl/o4WaEj4F2ZSLjC5YA",
      },
      {
        name: "KohTao Relax Freedom Beach Resort",
        label: "צ'אלוק",
        image: "/koh-tao-stay/relax-2.webp",
        alt: "שקיעה ורודה מעל הים בין עצי דקל ב-KohTao Relax Freedom Beach Resort",
        mapUrl: "https://maps.app.goo.gl/zZVesojTS3M7dcb17",
      },
      {
        name: "Emerald Gulf",
        label: "צ'אלוק",
        image: "/koh-tao-stay/emerald-1.webp",
        alt: "מבט מהאוויר על בקתות בין העצים ב-Emerald Gulf",
        mapUrl: "https://maps.app.goo.gl/Wi4mSJg46uVw4SMeA",
      },
      {
        name: "Hin Wong Apartments",
        label: "הין וונג",
        image: "/koh-tao-stay/hinwong-2.webp",
        alt: "מרפסת עם נוף לים ב-Hin Wong Apartments",
        mapUrl: "https://maps.app.goo.gl/epGpoRn29PMbSPkF9",
      },
    ],
  },
  {
    id: "center",
    title: "במרכז העניינים",
    intro: "סיירי רועשת, ויש מי שאוהבים לישון בדיוק באמצע של זה.",
    places: [
      {
        name: "Alfredo Resort",
        label: "סיירי",
        image: "/koh-tao-stay/alfredo-1.webp",
        alt: "בניין לבן עם מרפסות ושביל דשא ב-Alfredo Resort",
        mapUrl: "https://maps.app.goo.gl/ozq5hz4C2BgwKich8",
        whatsapp: "66987084374",
        badges: [NOT_ON_BOOKING],
      },
      {
        name: "Sairee Hut Resort",
        label: "סיירי",
        image: "/koh-tao-stay/saireehut-1.webp",
        alt: "מתחם Sairee Hut Resort מואר בערב",
        mapUrl: "https://maps.app.goo.gl/LmsBgYwLrsuMDpUL6",
      },
      {
        name: "Siam Paradise Hotel",
        label: "סיירי",
        image: "/koh-tao-stay/siamparadise-1.webp",
        alt: "חזית המלון Siam Paradise Hotel ביום בהיר",
        mapUrl: "https://maps.app.goo.gl/AG7PrN76xabMGAuP6",
        badges: ["המלון שלנו"],
      },
    ],
  },
  {
    id: "premium",
    title: "פרימיום",
    intro: "כשבא לפנק.",
    places: [
      {
        name: "Cape Shark Pool Villas",
        label: "וילות עם בריכה",
        image: "/koh-tao-stay/capeshark-1.webp",
        alt: "מבט מהאוויר על וילה עם בריכה מעל ים טורקיז ב-Cape Shark Pool Villas",
        mapUrl: "https://maps.app.goo.gl/gVEVEHHAoGCk4QL46",
        whatsapp: "66808828523",
        whatsappContact: "Caroline",
        badges: [NOT_ON_BOOKING],
      },
    ],
  },
  {
    id: "super_premium",
    title: "סופר פרימיום",
    intro: "לחופשה של פעם בחיים.",
    places: [
      {
        name: "Koh Nangyuan Resort",
        label: "האי נאנג יואן",
        image: "/koh-tao-stay/nangyuan-1.webp",
        alt: "בקתת עץ בין עצי דקל ב-Koh Nangyuan Resort",
        mapUrl: "https://maps.app.goo.gl/e5uV4R84WUPJReoaA",
      },
    ],
  },
];

// English on purpose: this reaches the place, and it is how they attribute the
// referral for commission. Must not be translated or reworded casually.
export const STAY_WHATSAPP_PREFILL =
  "Hi, I found you through Siam Scuba and I'd like to ask about staying with you.";

export function stayWhatsAppUrl(phone: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(STAY_WHATSAPP_PREFILL)}`;
}
