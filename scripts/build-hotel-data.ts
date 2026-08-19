// Builds api/_hotel-data.json - the room map + hotel info + email templates the
// hotel booking engine (api/hotel-booking.ts) reads at runtime. The file is
// committed and shipped to the Vercel function via vercel.json ->
// functions["api/hotel-booking.ts"].includeFiles.
//
// SINGLE SOURCE OF TRUTH: src/data/hotel.ts. This script derives everything
// room/hotel-shaped from it; the email templates below are the only content
// authored here. Re-run after ANY change to HOTEL_ROOMS / HOTEL_INFO / the
// per-night strings:  bun scripts/build-hotel-data.ts
// A unit test (src/test/hotel-data-sync.test.ts) fails CI when the committed
// JSON drifts from src/data/hotel.ts, so forgetting to re-run cannot ship.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  HOTEL_COPY,
  HOTEL_INFO,
  HOTEL_LANGS,
  HOTEL_ROOMS,
  HOTEL_WHATSAPP_NUMBER,
  hotelUrl,
} from "../src/data/hotel";
import type { Language } from "../src/i18n/translations";

// ---------------------------------------------------------------------------
// Rooms + hotel info (derived - never edit the JSON by hand)
// ---------------------------------------------------------------------------

const rooms = Object.fromEntries(
  HOTEL_ROOMS.map((r) => [
    r.slug,
    {
      name: r.name,
      price: r.pricePerNight,
      priceUnit: r.priceUnit ?? "night",
      sleeps: r.sleeps,
      soldOut: r.soldOut === true,
    },
  ]),
);

const hotel = {
  name: HOTEL_INFO.name,
  address: HOTEL_INFO.address,
  area: HOTEL_INFO.area,
  checkIn: HOTEL_INFO.checkIn,
  checkOut: HOTEL_INFO.checkOut,
  mapsUrl: HOTEL_INFO.mapsUrl,
  whatsapp: HOTEL_WHATSAPP_NUMBER,
  siteUrl: Object.fromEntries(HOTEL_LANGS.map((l) => [l, hotelUrl(l)])),
};

// Small per-language strings the engine composes into template variables.
const strings = Object.fromEntries(
  HOTEL_LANGS.map((l) => [
    l,
    {
      perNight: HOTEL_COPY[l].perNight,
      perBed: HOTEL_COPY[l].perBed,
      nightOne: { en: "1 night", he: "לילה אחד", es: "1 noche", fr: "1 nuit" }[l],
      nightMany: { en: "{n} nights", he: "{n} לילות", es: "{n} noches", fr: "{n} nuits" }[l],
      guestsWord: { en: "guests", he: "אורחים", es: "huéspedes", fr: "personnes" }[l],
    },
  ]),
);

// ---------------------------------------------------------------------------
// Email templates - 3 kinds x 4 languages
// ---------------------------------------------------------------------------
// Template syntax (rendered by api/hotel-booking.ts):
//   {{key}}                 - HTML-escaped interpolation
//   {{#key}} ... {{/key}}   - section kept only when `key` is non-empty
// Variables provided by the engine: name, ref, roomName, checkIn, checkOut,
// nightsLabel, guests, guestsWord, priceLine, checkInTime, checkOutTime,
// address, mapsUrl, registerUrl, waLink, hotelUrl, alternative, holdAmount.
//
// Three of them are SECTION SWITCHES - never print them, only wrap with them:
//   prepaid    the 1,000 THB hold was captured on approve (final email)
//   noPrepaid  it was not - legacy request, or approved after the hold lapsed
//   released   the hold was released on decline (decline email)
// Exactly one of prepaid / noPrepaid is set on every final email, so the money
// paragraph is always true. {{prepaid}} and {{released}} also carry the amount,
// so they can be printed inside their own section.

type Tpl = { subject: string; html: string };

const BRAND = "#072a45";
const BLUE = "#0b4a8f";
const MUTED = "#5b7386";

/**
 * The reference, as its own highlighted band - table-based so Outlook and the
 * mobile clients render the border, and dir="ltr" so the code never mirrors
 * inside the Hebrew (RTL) mail.
 */
function refBand(lang: Language): string {
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:26px 0 0;border-collapse:separate;">` +
    `<tr><td align="center" style="border:1.5px solid #cfe0ee;border-radius:14px;background:#f2f7fb;padding:14px 18px;">` +
    `<div style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">` +
    `${HOTEL_COPY[lang].bookRefLabel}</div>` +
    `<div dir="ltr" style="font-family:'SF Mono',Menlo,Consolas,'Courier New',monospace;font-size:24px;font-weight:700;` +
    `letter-spacing:0.16em;color:${BRAND};white-space:nowrap;">{{ref}}</div>` +
    `</td></tr></table>`
  );
}

/** Shared shell so all 12 emails look like one family. */
function shell(lang: Language, inner: string): string {
  const dir = lang === "he" ? ' dir="rtl"' : "";
  const align = lang === "he" ? "right" : "left";
  return (
    `<div${dir} style="margin:0;padding:24px 12px;background:#f2f7fb;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;text-align:${align};">` +
    `<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:18px;padding:28px 26px;color:${BRAND};">` +
    `<p style="margin:0 0 2px;font-size:19px;font-weight:700;">Siam Hotel &amp; Hostel</p>` +
    `<p style="margin:0 0 22px;font-size:12px;color:${MUTED};">Sairee Beach · Koh Tao</p>` +
    inner +
    refBand(lang) +
    `</div></div>`
  );
}

/** The booking summary box reused by all three emails. */
function summaryBox(extra = ""): string {
  return (
    `<div style="margin:16px 0;padding:14px 16px;background:#f2f7fb;border-radius:12px;font-size:14px;line-height:1.7;">` +
    `<strong>{{roomName}}</strong><br/>` +
    `{{checkIn}} &rarr; {{checkOut}} ({{nightsLabel}})<br/>` +
    `{{guests}} {{guestsWord}}` +
    extra +
    `</div>`
  );
}

function button(href: string, label: string, color = BLUE): string {
  return (
    `<p style="margin:20px 0;"><a href="${href}" ` +
    `style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;` +
    `padding:12px 26px;border-radius:999px;font-size:14px;font-weight:600;">${label}</a></p>`
  );
}

const P = 'style="margin:0 0 12px;font-size:14px;line-height:1.65;"';
const SMALL = `style="margin:0 0 8px;font-size:13px;line-height:1.6;color:${MUTED};"`;

/**
 * The final email's money paragraph, in exactly one of two truths: the hold was
 * captured (a PREPAYMENT credited against the bill - never call it a separate
 * refundable deposit), or no money was taken at all.
 */
function paidBlock(prepaid: string, noPrepaid: string): string {
  return (
    `{{#prepaid}}<div style="margin:16px 0;padding:14px 16px;background:#eafaf1;border-radius:12px;font-size:14px;line-height:1.65;">${prepaid}</div>{{/prepaid}}` +
    `{{#noPrepaid}}<div style="margin:16px 0;padding:14px 16px;background:#f2f7fb;border-radius:12px;font-size:14px;line-height:1.65;">${noPrepaid}</div>{{/noPrepaid}}`
  );
}

/** The decline email's "your money never moved" paragraph. */
function releasedBlock(text: string): string {
  return `{{#released}}<div style="margin:16px 0;padding:14px 16px;background:#eafaf1;border-radius:12px;font-size:14px;line-height:1.65;">${text}</div>{{/released}}`;
}

const provisional: Record<Language, Tpl> = {
  en: {
    subject: "We got your request - Siam Hotel & Hostel · {{ref}}",
    html: shell(
      "en",
      `<p ${P}>Hi {{name}},</p>` +
        `<p ${P}>Thanks for your request - here is what we have down:</p>` +
        summaryBox() +
        `<p ${P}>We check availability personally at reception, so your final answer usually lands in this inbox within a few hours.</p>` +
        `<p ${P}><strong>{{holdAmount}} is being held on your card - not charged.</strong> If we confirm the room, we take it then and it comes off your bill. If we cannot, the hold is released and you pay nothing.</p>` +
        `<p ${P}>See you on the island,<br/>Siam Hotel &amp; Hostel</p>`,
    ),
  },
  he: {
    subject: "קיבלנו את הבקשה שלך - סיאם מלון והוסטל · {{ref}}",
    html: shell(
      "he",
      `<p ${P}>היי {{name}},</p>` +
        `<p ${P}>תודה על הבקשה - זה מה שרשמנו:</p>` +
        summaryBox() +
        `<p ${P}>אנחנו בודקים זמינות באופן אישי בקבלה, כך שתשובה סופית מגיעה למייל הזה בדרך כלל תוך כמה שעות.</p>` +
        `<p ${P}><strong>{{holdAmount}} מוקפאים בכרטיס שלכם - לא נגבו.</strong> אם נאשר את החדר, נגבה אותם אז והם יירדו מהחשבון. אם לא נוכל, ההקפאה משוחררת ולא תשלמו כלום.</p>` +
        `<p ${P}>נתראה באי,<br/>סיאם מלון והוסטל</p>`,
    ),
  },
  es: {
    subject: "Recibimos tu solicitud - Siam Hotel & Hostel · {{ref}}",
    html: shell(
      "es",
      `<p ${P}>Hola {{name}}:</p>` +
        `<p ${P}>Gracias por tu solicitud; esto es lo que anotamos:</p>` +
        summaryBox() +
        `<p ${P}>Comprobamos la disponibilidad personalmente en recepción, así que la respuesta final suele llegar a este correo en unas horas.</p>` +
        `<p ${P}><strong>{{holdAmount}} quedan retenidos en tu tarjeta, no cobrados.</strong> Si confirmamos la habitación, los cobramos entonces y se descuentan de tu cuenta. Si no podemos, la retención se libera y no pagas nada.</p>` +
        `<p ${P}>Nos vemos en la isla,<br/>Siam Hotel &amp; Hostel</p>`,
    ),
  },
  fr: {
    subject: "Nous avons bien reçu votre demande - Siam Hotel & Hostel · {{ref}}",
    html: shell(
      "fr",
      `<p ${P}>Bonjour {{name}},</p>` +
        `<p ${P}>Merci pour votre demande - voici ce que nous avons noté :</p>` +
        summaryBox() +
        `<p ${P}>Nous vérifions la disponibilité personnellement à la réception ; la réponse définitive arrive généralement dans cette boîte mail en quelques heures.</p>` +
        `<p ${P}><strong>{{holdAmount}} sont bloqués sur votre carte, pas débités.</strong> Si nous confirmons la chambre, nous les prélevons à ce moment-là et ils sont déduits de votre note. Sinon, le blocage est levé et vous ne payez rien.</p>` +
        `<p ${P}>À bientôt sur l'île,<br/>Siam Hotel &amp; Hostel</p>`,
    ),
  },
};

const finalTpl: Record<Language, Tpl> = {
  en: {
    subject: "Confirmed - {{roomName}}, {{checkIn}} · {{ref}}",
    html: shell(
      "en",
      `<p ${P}>Hi {{name}}, good news - your room is confirmed!</p>` +
        summaryBox(`{{#priceLine}}<br/>{{priceLine}}{{/priceLine}}`) +
        `<p ${P}>Check-in from <strong>{{checkInTime}}</strong> · check-out by <strong>{{checkOutTime}}</strong>.</p>` +
        `<p ${P}>{{address}}</p>` +
        `<p ${P}><a href="{{mapsUrl}}" style="color:${BLUE};">Open in Google Maps</a></p>` +
        paidBlock(
          `<strong>{{prepaid}} has been charged</strong> - the hold we placed when you asked for the room. It is not a separate deposit: it comes straight off your bill, and you settle the remainder at reception.`,
          `Nothing has been charged for this booking - the full amount is due at reception.`,
        ) +
        `<p ${SMALL}>Good to know: the remainder is paid at reception - cash, or card with a 3.5% fee. A separate 3,000 THB security deposit is taken at check-in and returned when you leave. Free pier pickup - tell us your ferry and we will come get you. Reception is open until 21:00.</p>` +
        button("{{registerUrl}}", "Complete your registration") +
        `<p ${SMALL}>Two minutes, and it makes your check-in much quicker.</p>` +
        `<p ${P}>See you soon,<br/>Siam Hotel &amp; Hostel</p>`,
    ),
  },
  he: {
    subject: "מאושר - {{roomName}}, {{checkIn}} · {{ref}}",
    html: shell(
      "he",
      `<p ${P}>היי {{name}}, חדשות טובות - החדר שלך מאושר!</p>` +
        summaryBox(`{{#priceLine}}<br/>{{priceLine}}{{/priceLine}}`) +
        `<p ${P}>צ'ק-אין החל מ-<strong>{{checkInTime}}</strong> · צ'ק-אאוט עד <strong>{{checkOutTime}}</strong>.</p>` +
        `<p ${P}>{{address}}</p>` +
        `<p ${P}><a href="{{mapsUrl}}" style="color:${BLUE};">פתיחה במפות גוגל</a></p>` +
        paidBlock(
          `<strong>{{prepaid}} נגבו</strong> - אלה הכספים שהוקפאו כשביקשתם את החדר. זה לא פיקדון נפרד: הסכום יורד ישירות מהחשבון שלכם, ואת היתרה תשלמו בקבלה.`,
          `לא נגבה שום תשלום על ההזמנה הזו - הסכום המלא ישולם בקבלה.`,
        ) +
        `<p ${SMALL}>טוב לדעת: את היתרה משלמים בקבלה - מזומן, או כרטיס אשראי בתוספת 3.5%. בנוסף, בצ'ק-אין נגבה פיקדון ביטחון נפרד של 3,000 באט שמוחזר ביציאה. איסוף חינם מהמזח - ספרו לנו באיזו מעבורת אתם מגיעים ונבוא לאסוף. הקבלה פתוחה עד 21:00.</p>` +
        button("{{registerUrl}}", "השלמת הרשמה") +
        `<p ${SMALL}>שתי דקות, וזה מקצר מאוד את הצ'ק-אין.</p>` +
        `<p ${P}>נתראה בקרוב,<br/>סיאם מלון והוסטל</p>`,
    ),
  },
  es: {
    subject: "Confirmado - {{roomName}}, {{checkIn}} · {{ref}}",
    html: shell(
      "es",
      `<p ${P}>Hola {{name}}: buenas noticias, ¡tu habitación está confirmada!</p>` +
        summaryBox(`{{#priceLine}}<br/>{{priceLine}}{{/priceLine}}`) +
        `<p ${P}>Check-in a partir de las <strong>{{checkInTime}}</strong> · check-out hasta las <strong>{{checkOutTime}}</strong>.</p>` +
        `<p ${P}>{{address}}</p>` +
        `<p ${P}><a href="{{mapsUrl}}" style="color:${BLUE};">Abrir en Google Maps</a></p>` +
        paidBlock(
          `<strong>Se han cobrado {{prepaid}}</strong>, la retención que hicimos al pedir la habitación. No es un depósito aparte: se descuenta directamente de tu cuenta y el resto lo pagas en recepción.`,
          `No se ha cobrado nada por esta reserva: el importe completo se paga en recepción.`,
        ) +
        `<p ${SMALL}>A tener en cuenta: el resto se paga en recepción - efectivo, o tarjeta con un 3,5% de recargo. Aparte, al hacer el check-in se toma un depósito de seguridad de 3.000 THB que se devuelve al salir. Recogida gratuita en el muelle - dinos en qué ferry llegas y te recogemos. La recepción abre hasta las 21:00.</p>` +
        button("{{registerUrl}}", "Completa tu registro") +
        `<p ${SMALL}>Dos minutos, y tu check-in será mucho más rápido.</p>` +
        `<p ${P}>Hasta pronto,<br/>Siam Hotel &amp; Hostel</p>`,
    ),
  },
  fr: {
    subject: "Confirmé - {{roomName}}, {{checkIn}} · {{ref}}",
    html: shell(
      "fr",
      `<p ${P}>Bonjour {{name}}, bonne nouvelle - votre chambre est confirmée !</p>` +
        summaryBox(`{{#priceLine}}<br/>{{priceLine}}{{/priceLine}}`) +
        `<p ${P}>Check-in à partir de <strong>{{checkInTime}}</strong> · check-out jusqu'à <strong>{{checkOutTime}}</strong>.</p>` +
        `<p ${P}>{{address}}</p>` +
        `<p ${P}><a href="{{mapsUrl}}" style="color:${BLUE};">Ouvrir dans Google Maps</a></p>` +
        paidBlock(
          `<strong>{{prepaid}} ont été débités</strong> : c'est le blocage effectué lors de votre demande. Ce n'est pas une caution à part - le montant est déduit directement de votre note, et vous réglez le solde à la réception.`,
          `Rien n'a été débité pour cette réservation : la totalité est à régler à la réception.`,
        ) +
        `<p ${SMALL}>Bon à savoir : le solde se règle à la réception - en espèces, ou par carte avec 3,5 % de frais. Par ailleurs, une caution de 3 000 THB est demandée à l'arrivée et restituée à votre départ. Transfert gratuit depuis le port - dites-nous par quel ferry vous arrivez et nous viendrons vous chercher. La réception est ouverte jusqu'à 21h00.</p>` +
        button("{{registerUrl}}", "Complétez votre enregistrement") +
        `<p ${SMALL}>Deux minutes, et votre check-in sera bien plus rapide.</p>` +
        `<p ${P}>À très vite,<br/>Siam Hotel &amp; Hostel</p>`,
    ),
  },
};

const decline: Record<Language, Tpl> = {
  en: {
    subject: "About your request - Siam Hotel & Hostel · {{ref}}",
    html: shell(
      "en",
      `<p ${P}>Hi {{name}},</p>` +
        `<p ${P}>Thank you so much for wanting to stay with us. We have checked at reception, and unfortunately <strong>{{roomName}}</strong> is not available for {{checkIn}} - {{checkOut}}.</p>` +
        releasedBlock(
          `<strong>Your {{released}} hold has been released</strong> - we never took the money. Depending on your bank it can take a few days to disappear from your statement.`,
        ) +
        `{{#alternative}}<div style="margin:16px 0;padding:14px 16px;background:#f2f7fb;border-radius:12px;font-size:14px;line-height:1.65;">What we can offer instead: {{alternative}}</div>{{/alternative}}` +
        `<p ${P}>Other dates, or a different room, may well work - message us on WhatsApp and we will find you something:</p>` +
        button("{{waLink}}", "Chat on WhatsApp", "#1da851") +
        `<p ${SMALL}>Or pick different dates or another room here: <a href="{{hotelUrl}}" style="color:${BLUE};">{{hotelUrl}}</a></p>` +
        `<p ${P}>Hope to host you soon,<br/>Siam Hotel &amp; Hostel</p>`,
    ),
  },
  he: {
    subject: "לגבי הבקשה שלך - סיאם מלון והוסטל · {{ref}}",
    html: shell(
      "he",
      `<p ${P}>היי {{name}},</p>` +
        `<p ${P}>תודה רבה שרציתם להתארח אצלנו. בדקנו בקבלה, ולצערנו <strong>{{roomName}}</strong> לא זמין בתאריכים {{checkIn}} - {{checkOut}}.</p>` +
        releasedBlock(
          `<strong>ההקפאה של {{released}} שוחררה</strong> - הכסף מעולם לא נגבה. תלוי בבנק שלכם, זה יכול לקחת כמה ימים עד שזה נעלם מהדף.`,
        ) +
        `{{#alternative}}<div style="margin:16px 0;padding:14px 16px;background:#f2f7fb;border-radius:12px;font-size:14px;line-height:1.65;">מה שכן נוכל להציע: {{alternative}}</div>{{/alternative}}` +
        `<p ${P}>בתאריכים אחרים, או בחדר אחר, סביר שכן נוכל לארח - כתבו לנו בוואטסאפ ונמצא לכם משהו:</p>` +
        button("{{waLink}}", "לצ'אט בוואטסאפ", "#1da851") +
        `<p ${SMALL}>או בחרו תאריכים אחרים או חדר אחר כאן: <a href="{{hotelUrl}}" style="color:${BLUE};">{{hotelUrl}}</a></p>` +
        `<p ${P}>מקווים לארח אתכם בקרוב,<br/>סיאם מלון והוסטל</p>`,
    ),
  },
  es: {
    subject: "Sobre tu solicitud - Siam Hotel & Hostel · {{ref}}",
    html: shell(
      "es",
      `<p ${P}>Hola {{name}}:</p>` +
        `<p ${P}>Muchas gracias por querer alojarte con nosotros. Lo hemos comprobado en recepción y, por desgracia, <strong>{{roomName}}</strong> no está disponible del {{checkIn}} al {{checkOut}}.</p>` +
        releasedBlock(
          `<strong>La retención de {{released}} ha sido liberada</strong>: nunca llegamos a cobrar el dinero. Según tu banco, puede tardar unos días en desaparecer del extracto.`,
        ) +
        `{{#alternative}}<div style="margin:16px 0;padding:14px 16px;background:#f2f7fb;border-radius:12px;font-size:14px;line-height:1.65;">Lo que sí podemos ofrecerte: {{alternative}}</div>{{/alternative}}` +
        `<p ${P}>Con otras fechas, o con otra habitación, es muy probable que sí podamos - escríbenos por WhatsApp y te buscamos algo:</p>` +
        button("{{waLink}}", "Chatear por WhatsApp", "#1da851") +
        `<p ${SMALL}>O elige otras fechas u otra habitación aquí: <a href="{{hotelUrl}}" style="color:${BLUE};">{{hotelUrl}}</a></p>` +
        `<p ${P}>Esperamos recibirte pronto,<br/>Siam Hotel &amp; Hostel</p>`,
    ),
  },
  fr: {
    subject: "À propos de votre demande - Siam Hotel & Hostel · {{ref}}",
    html: shell(
      "fr",
      `<p ${P}>Bonjour {{name}},</p>` +
        `<p ${P}>Merci beaucoup d'avoir voulu séjourner chez nous. Nous avons vérifié à la réception et, malheureusement, <strong>{{roomName}}</strong> n'est pas disponible du {{checkIn}} au {{checkOut}}.</p>` +
        releasedBlock(
          `<strong>Le blocage de {{released}} a été levé</strong> : l'argent n'a jamais été prélevé. Selon votre banque, il peut mettre quelques jours à disparaître de votre relevé.`,
        ) +
        `{{#alternative}}<div style="margin:16px 0;padding:14px 16px;background:#f2f7fb;border-radius:12px;font-size:14px;line-height:1.65;">Ce que nous pouvons proposer à la place : {{alternative}}</div>{{/alternative}}` +
        `<p ${P}>À d'autres dates, ou dans une autre chambre, ce sera sans doute possible - écrivez-nous sur WhatsApp et nous vous trouverons quelque chose :</p>` +
        button("{{waLink}}", "Discuter sur WhatsApp", "#1da851") +
        `<p ${SMALL}>Ou choisissez d'autres dates ou une autre chambre ici : <a href="{{hotelUrl}}" style="color:${BLUE};">{{hotelUrl}}</a></p>` +
        `<p ${P}>Au plaisir de vous accueillir,<br/>Siam Hotel &amp; Hostel</p>`,
    ),
  },
};

// ---------------------------------------------------------------------------

const data = {
  _note:
    "GENERATED FILE - keep in sync with src/data/hotel.ts. Regenerate with: bun scripts/build-hotel-data.ts. " +
    "Read at runtime by api/hotel-booking.ts (shipped via vercel.json includeFiles). Do not edit by hand.",
  hotel,
  rooms,
  strings,
  emails: { provisional, final: finalTpl, decline },
};

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../api/_hotel-data.json");
writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n");
console.log(`wrote ${Object.keys(rooms).length} rooms + 3x4 email templates → ${OUT}`);
