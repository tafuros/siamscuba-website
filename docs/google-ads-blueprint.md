# Google Ads Campaign Blueprint - Siam Scuba (2026-W22 launch)

Companion to `~/.claude/plans/glimmering-percolating-pebble.md` (code) and `~/.claude/plans/tranquil-seeking-scott.md` (campaign source). This doc is the Google-side execution sheet. Meta is parked until Business Verification clears.

---

## 0. Status snapshot (audited 2026-05-24)

| Piece | State |
|---|---|
| 9 landers wired in `src/routes.tsx` | SHIPPED |
| Lander copy EN/ES/HE | SHIPPED (ES + HE flagged "first-cut translation", native review still recommended) |
| UTM capture (`src/utils/utm.ts`) + first-touch sessionStorage | SHIPPED |
| `buildWhatsAppLink` with per-language messages + UTM passthrough | SHIPPED |
| gtag + fbq paired in `src/utils/tracking.ts` | SHIPPED |
| Lead event from booking iframe (`SIAM_BOOKING_STEP`) | SHIPPED |
| Landers in sitemap | **OFF** (commented out in `scripts/generate-sitemap.ts:46-48`, noindex'd at the page) — by design; restore at launch |
| **Google Ads conversion labels** | **MISSING for lead + WhatsApp click**. Only `Booking Confirmed` (`9d1fCLb625gcEP7jjp9D`) exists. |
| Meta Pixel ID | Placeholder (`YOUR_PIXEL_ID` ×2 in `index.html`) — Google-first means we can defer |

---

## 1. Account setup — Ben actions in Google Ads UI

Account: **AW-18050429438**. Do these in order. Each conversion action's resulting **label** comes back as a snippet like `send_to: AW-18050429438/abc123XYZ` — paste the label part into the table at the bottom of this doc; I'll wire them in `src/utils/tracking.ts`.

### 1.1 Create conversion actions (3 total — one exists, two new)

| # | Conversion name | Category | Counting | Value | Click-thru / View-thru window | Status |
|---|---|---|---|---|---|---|
| 1 | Booking Confirmed | Purchase | One | Use different values per conversion (THB, from `value`) | 30d / 1d | EXISTS — label `9d1fCLb625gcEP7jjp9D` |
| 2 | Lead — Booking Form Submitted | Submit lead form | One | No value (or 100 THB synthetic) | 30d / 1d | **CREATE** |
| 3 | WhatsApp Click | Contact | One | No value (or 50 THB synthetic) | 7d / 1d | **CREATE** |

Tagging method for #2 and #3 = **Use Google tag** + event snippet (we already load `gtag.js` via `AW-18050429438`). Event name we'll fire: `generate_lead` for #2, `whatsapp_click` for #3 (already fired by `tracking.ts`).

After creation, paste labels at bottom of doc, I wire them in code.

### 1.2 Conversion goal grouping

- Primary goal: `Lead — Booking Form Submitted` + `Booking Confirmed`
- Secondary (engagement, not bid-on at first): `WhatsApp Click`

Bid strategy for the first 3 days will be **Maximize Conversions** (no tCPA) so the auction can learn. Switch to **tCPA** on Day 4 once we have ≥30 conversions across the account.

### 1.3 Account-level final URL suffix

```
utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}
```

Set in Google Ads → Admin → Tracking → Final URL suffix. Our `captureUtmFromUrl()` picks this up automatically.

---

## 2. Campaign structure

3 Search campaigns. NO Performance Max in week-1 (creative volume too low for PMax to learn fast under 7-day spend cap). Revisit PMax on day 8 after we have winning RSAs to feed it.

```
Account: Siam Scuba (AW-18050429438)
├── Campaign: SiamScuba_Search_DSD            (500 THB/day)
│   ├── Ad group: DSD_EN  → /discover-scuba-diving
│   ├── Ad group: DSD_ES  → /es/discover-scuba-diving
│   └── Ad group: DSD_HE  → /he/discover-scuba-diving
├── Campaign: SiamScuba_Search_OWD            (500 THB/day)
│   ├── Ad group: OWD_EN  → /open-water-course
│   ├── Ad group: OWD_ES  → /es/open-water-course
│   └── Ad group: OWD_HE  → /he/open-water-course
└── Campaign: SiamScuba_Search_FunDive        (500 THB/day)
    ├── Ad group: FUN_EN  → /fun-dives
    ├── Ad group: FUN_ES  → /es/fun-dives
    └── Ad group: FUN_HE  → /he/fun-dives
```

Total: 1,500 THB/day × 7 days = **10,500 THB** Google side. Meta side (10,500 THB) parked until Business Verification clears. If Meta stays blocked through week-1, reallocate Meta budget into a Google PMax campaign for week-2.

### Campaign-level settings (apply to all 3)

| Setting | Value |
|---|---|
| Network | Search only — **Display Network OFF**, **Search Partners ON** (low-cost upside) |
| Locations | See §3 per ad-group language |
| Languages | English / Spanish / Hebrew (matched to ad group, but Google ignores language targeting for Search — kept for reporting) |
| Bid strategy | Maximize Conversions (days 1-3) → tCPA (day 4+) |
| Daily budget | 500 THB |
| Start/End | Hard end after 7 days, no auto-extension |
| Ad rotation | Optimize |
| Ad schedule | All day (Koh Tao tourists check WhatsApp at odd hours) |
| Device | All — no bid adjustment week-1 |
| Tracking template | (inherited from account-level final URL suffix) |

---

## 3. Geo + audience per language

| Lang | Geo (location targeting) | Notes |
|---|---|---|
| EN | (a) Koh Tao + 50 km radius (people physically there, "presence")<br>(b) Thailand + Singapore + Malaysia + Australia + UK + US + Germany + Netherlands ("interest or presence") | Two location groups. Inside the campaign, create them as separate locations and let bidding allocate. |
| ES | Spain, Mexico, Argentina, Colombia, Chile (interest or presence) | "interest or presence" so people researching pre-trip in their home country still qualify |
| HE | Israel (interest or presence) | Add Thailand-presence as a second location for Israelis already in country |

Audience signals (Observation, not Targeting — for reporting only):
- In-market: Travel → Scuba & Snorkeling
- In-market: Travel → Thailand
- Affinity: Adventure Travelers
- Custom segment: people who searched any of our brand or competitor terms

---

## 4. Keywords

Match-type policy: start with **Phrase** + a handful of **Exact** for brand/transactional terms. **No Broad** in week-1 — Broad needs a strong conversion signal to behave, and we'll have under 30 conversions for the first few days.

### 4.1 DSD_EN (`/discover-scuba-diving`)

**Phrase:**
- "discover scuba diving koh tao"
- "try scuba diving koh tao"
- "try diving thailand"
- "scuba lesson koh tao"
- "first time scuba koh tao"
- "intro dive koh tao"
- "dsd koh tao"
- "scuba diving for beginners thailand"
- "snorkel and scuba koh tao"
- "padi discover scuba"

**Exact:**
- [discover scuba diving koh tao]
- [try diving koh tao]
- [dsd koh tao price]

### 4.2 DSD_ES (`/es/discover-scuba-diving`)

**Phrase:**
- "bautismo de buceo koh tao"
- "bautismo de buceo tailandia"
- "primera vez buceo koh tao"
- "discover scuba koh tao"
- "buceo principiantes tailandia"
- "iniciacion buceo koh tao"
- "probar buceo tailandia"
- "padi discover scuba español"
- "curso introduccion buceo tailandia"

**Exact:**
- [bautismo de buceo koh tao]
- [discover scuba koh tao]

### 4.3 DSD_HE (`/he/discover-scuba-diving`)

**Phrase:**
- "צלילת היכרות קוסמוי"
- "צלילת היכרות תאילנד"
- "צלילה ראשונה תאילנד"
- "DSD קוסמוי"
- "ניסיון צלילה קוסמוי"
- "צלילה למתחילים תאילנד"
- "PADI צלילת היכרות"

**Exact:**
- [צלילת היכרות קוסמוי]
- [צלילת היכרות תאילנד]

### 4.4 OWD_EN (`/open-water-course`)

**Phrase:**
- "padi open water koh tao"
- "open water course koh tao"
- "open water diver koh tao"
- "scuba certification koh tao"
- "learn to scuba dive thailand"
- "padi course thailand"
- "owd koh tao"
- "scuba diving course koh tao"
- "padi open water price"
- "scuba license koh tao"

**Exact:**
- [padi open water koh tao]
- [open water course koh tao]
- [owd koh tao]

### 4.5 OWD_ES (`/es/open-water-course`)

**Phrase:**
- "curso open water koh tao"
- "curso PADI tailandia"
- "certificacion buceo koh tao"
- "curso buceo tailandia"
- "curso buceo koh tao"
- "PADI open water tailandia"
- "sacarse el titulo de buceo tailandia"

**Exact:**
- [curso open water koh tao]
- [PADI open water tailandia]

### 4.6 OWD_HE (`/he/open-water-course`)

**Phrase:**
- "קורס צלילה קוסמוי"
- "קורס PADI תאילנד"
- "קורס אופן ווטר"
- "כוכב 1 תאילנד"
- "קורס צלילה תאילנד"
- "קורס צלילה כוכב ראשון"

**Exact:**
- [קורס צלילה קוסמוי]
- [קורס PADI תאילנד]

### 4.7 FUN_EN (`/fun-dives`)

**Phrase:**
- "fun dive koh tao"
- "scuba diving koh tao"
- "sail rock dive trip"
- "chumphon pinnacle dive"
- "two tank dive koh tao"
- "boat dive koh tao"
- "certified diver koh tao"
- "dive sites koh tao"
- "padi 5 star koh tao"

**Exact:**
- [fun dive koh tao]
- [sail rock koh tao]

### 4.8 FUN_ES (`/es/fun-dives`)

**Phrase:**
- "buceo koh tao"
- "inmersiones koh tao"
- "sail rock buceo"
- "buceo certificados tailandia"
- "centros de buceo koh tao"
- "salida de buceo koh tao"

**Exact:**
- [buceo koh tao]
- [sail rock buceo]

### 4.9 FUN_HE (`/he/fun-dives`)

**Phrase:**
- "צלילה בקוסמוי"
- "צלילות קוסמוי"
- "סייל רוק צלילה"
- "צלילה תאילנד מוסמכים"
- "מרכז צלילה קוסמוי"

**Exact:**
- [צלילה בקוסמוי]
- [סייל רוק]

---

## 5. Negative keywords (account-level shared list "Siam Scuba — Always Negative")

```
free
job
jobs
career
careers
salary
hiring
hire me
instructor course
instructor exam
divemaster course
divemaster jobs
internship
work in koh tao
visa
ipad
review
forum
reddit
wiki
wikipedia
death
accident
shark attack
news
youtube
tiktok
download
pdf
manual
quiz
test answers
```

Apply to all 3 campaigns. Add new negatives daily from the Search Terms report (Day 1-7).

---

## 6. Responsive Search Ad copy (3 RSAs per ad group preferred — start with 1, add 2 more by Day 3)

Below: master RSA per ad group. 15 headlines, 4 descriptions, 2 final URL paths. Keep at least 5 headlines pinned only as Position 1 candidates, the rest unpinned for Google to mix.

### 6.1 DSD_EN — `/discover-scuba-diving`

**Headlines (15):**
1. Discover Scuba Diving in Koh Tao
2. Try Diving — 2 Dives 3,600 THB
3. PADI 5-Star Center, Koh Tao
4. No Certification Needed
5. Max 4 Students Per Instructor
6. Two Private Dive Boats
7. WhatsApp Us — Reply in Minutes
8. Full Day With a PADI Instructor
9. From First Breath to 2 Ocean Dives
10. Real Reef, Not a Pool
11. Small Groups, Big Smiles
12. Book Today — Dive Tomorrow
13. 778 Reviews, 4.9 on TripAdvisor
14. Lunch + Boat + All Gear Included
15. Try Scuba on Your Koh Tao Trip

**Descriptions (4):**
- Spend the day with a PADI instructor — confined-water training plus 1 or 2 real ocean dives on Koh Tao's reefs. All gear included.
- Two custom dive boats, max 4 students per instructor. Schedule actually runs on time. Reply on WhatsApp usually within minutes.
- 2,600 THB for 1 dive or 3,600 THB for 2 dives — full-day program, gear, instructor, PADI certificate. No experience needed.
- Built for first-timers. If you can float on your back, you can do this. Book today, dive tomorrow.

### 6.2 DSD_ES — `/es/discover-scuba-diving`

**Headlines (15):**
1. Bautismo de Buceo en Koh Tao
2. Prueba el Buceo — 2 Inmersiones
3. 3,600 THB Día Completo
4. Centro PADI 5 Estrellas
5. Sin Certificación Previa
6. Máximo 4 Alumnos por Instructor
7. Dos Barcos Propios de Buceo
8. WhatsApp — Respondemos Rápido
9. Día Completo con Instructor PADI
10. Primera Respiración Bajo el Agua
11. Arrecifes Reales, No Piscina
12. Grupos Pequeños, Buen Rollo
13. 778 Reseñas en TripAdvisor
14. Equipo + Barco + Comida Incluidos
15. Reserva Hoy — Bucea Mañana

**Descriptions (4):**
- Día completo con un instructor PADI: prácticas en aguas confinadas y 1 o 2 inmersiones reales en los arrecifes de Koh Tao. Equipo incluido.
- Dos barcos propios, máximo 4 alumnos por instructor. El horario se cumple. Solemos responder en WhatsApp en minutos.
- 2,600 THB por 1 inmersión o 3,600 THB por 2 — día completo, equipo, instructor, certificado PADI. Sin experiencia.
- Diseñado para principiantes. Si flotas boca arriba, puedes hacerlo. Reserva hoy y bucea mañana.

### 6.3 DSD_HE — `/he/discover-scuba-diving`

**Headlines (15):**
1. צלילת היכרות בקוסמוי
2. שתי צלילות ב-3,600 THB
3. מרכז PADI 5 כוכבים
4. ללא הסמכה מוקדמת
5. עד 4 תלמידים למדריך
6. שתי סירות צלילה פרטיות
7. WhatsApp — תשובה בדקות
8. יום שלם עם מדריך PADI
9. מהנשימה הראשונה לים אמיתי
10. שונית אמיתית לא בריכה
11. קבוצות קטנות, חוויה גדולה
12. הזמינו היום, צוללים מחר
13. 778 ביקורות ב-TripAdvisor
14. ציוד ארוחה וסירה כלולים
15. בעברית, על הספוט בקוסמוי

**Descriptions (4):**
- יום שלם עם מדריך PADI: אימון במים רדודים ו-1 או 2 צלילות אמיתיות בשונית. כל הציוד כלול.
- שתי סירות פרטיות, עד 4 תלמידים למדריך. הלו"ז אמיתי. בדרך כלל עונים ב-WhatsApp בדקות.
- 2,600 THB לצלילה או 3,600 THB לשתיים — יום שלם, ציוד, מדריך, תעודת PADI. בלי ניסיון קודם.
- בנוי למתחילים. אם אתם צפים על הגב — אתם יכולים. בעברית, על הספוט.

### 6.4 OWD_EN — `/open-water-course`

**Headlines (15):**
1. PADI Open Water in Koh Tao
2. Get Certified in 4 Days
3. 11,000 THB All-Inclusive
4. PADI 5-Star Instructor Dev Center
5. Small Groups, Real Attention
6. Two Private Dive Boats
7. WhatsApp Us — Reply in Minutes
8. Theory + Pool + 4 Ocean Dives
9. Certified For Life, Worldwide
10. 778 Reviews on TripAdvisor
11. eLearning Before You Arrive
12. Koh Tao — Best Place to Learn
13. Free Re-Take If You Need It
14. Book the Course, We'll Plan Dates
15. Sail Rock Trip On Us — Ask How

**Descriptions (4):**
- The PADI Open Water Diver course in 4 days: theory, pool training, 4 reef dives. Certified for life, dive anywhere in the world.
- 11,000 THB — books, gear, instructor, boat, certification. Small groups, max 4 students. Two private boats.
- Koh Tao is the cheapest, calmest place on earth to learn. eLearning before you fly so the in-water days are 100% focused.
- WhatsApp us your travel dates — we'll plan the 4-day schedule around them. Reply usually within minutes.

### 6.5 OWD_ES — `/es/open-water-course`

**Headlines (15):**
1. Curso PADI Open Water Koh Tao
2. Certifícate en 4 Días
3. 11,000 THB Todo Incluido
4. Centro PADI 5 Estrellas IDC
5. Grupos Pequeños, Atención Real
6. Dos Barcos Propios
7. WhatsApp — Respondemos Rápido
8. Teoría + Piscina + 4 Inmersiones
9. Certificación Mundial de por Vida
10. 778 Reseñas en TripAdvisor
11. eLearning Antes de Llegar
12. Koh Tao — El Mejor Lugar
13. Repetición Gratis Si Hace Falta
14. Reserva Curso, Cuadramos Fechas
15. En Español, Con Instructor PADI

**Descriptions (4):**
- Curso PADI Open Water Diver en 4 días: teoría, piscina, 4 inmersiones en el arrecife. Certificación mundial de por vida.
- 11,000 THB — libros, equipo, instructor, barco, certificación. Grupos pequeños, máx. 4 alumnos. Dos barcos propios.
- Koh Tao es el sitio más barato y tranquilo del mundo para aprender. eLearning antes de llegar para que los días en agua rindan al máximo.
- Escríbenos por WhatsApp con tus fechas — cuadramos el curso de 4 días contigo. Respondemos en minutos.

### 6.6 OWD_HE — `/he/open-water-course`

**Headlines (15):**
1. קורס PADI Open Water קוסמוי
2. הסמכה ב-4 ימים
3. 11,000 THB הכל כלול
4. מרכז PADI 5 כוכבים IDC
5. קבוצות קטנות, יחס אישי
6. שתי סירות פרטיות
7. WhatsApp — תשובה בדקות
8. תיאוריה + בריכה + 4 צלילות
9. הסמכה בינלאומית לכל החיים
10. 778 ביקורות ב-TripAdvisor
11. לימוד עצמי לפני שמגיעים
12. קוסמוי — המקום ללמוד
13. חזרה חינם אם צריך
14. הזמינו קורס, נסגור תאריכים
15. בעברית, עם מדריך PADI

**Descriptions (4):**
- קורס PADI Open Water Diver ב-4 ימים: תיאוריה, בריכה, 4 צלילות. הסמכה בינלאומית לכל החיים.
- 11,000 THB — ספרים, ציוד, מדריך, סירה, הסמכה. קבוצות קטנות, עד 4 תלמידים. שתי סירות פרטיות.
- קוסמוי הוא המקום הזול והרגוע בעולם ללמוד. eLearning לפני שמגיעים כדי לנצל כל יום במים.
- שלחו ב-WhatsApp תאריכי הטיול ונסגור איתכם את 4 הימים. תשובה בדקות.

### 6.7 FUN_EN — `/fun-dives`

**Headlines (15):**
1. Fun Diving in Koh Tao
2. Sail Rock Full-Day — 3,800 THB
3. Two-Tank Boat Dive — 1,800 THB
4. Chumphon Pinnacle & The Twins
5. PADI 5-Star, Koh Tao
6. Small Groups, Two Private Boats
7. WhatsApp Us — Reply in Minutes
8. Whale Sharks at Sail Rock
9. Morning or Afternoon Boat Dives
10. 778 Reviews on TripAdvisor
11. All Gear Included
12. Book Today — Dive Tomorrow
13. Online Booking, No Deposit
14. Certified Divers Welcome
15. Best Dive Sites on the Island

**Descriptions (4):**
- Two-tank morning or afternoon dives at 1,800 THB. Sail Rock full-day with chance of whale sharks at 3,800 THB. All gear in.
- Two private boats, small groups, schedule actually runs on time. PADI 5-Star Center in Koh Tao.
- Pick your dive sites — Chumphon Pinnacle, Sail Rock, The Twins, White Rock and more. Book online, no deposit.
- WhatsApp us your dates or book directly — we'll get you on a boat usually within 24 hours.

### 6.8 FUN_ES — `/es/fun-dives`

**Headlines (15):**
1. Buceo en Koh Tao
2. Sail Rock Día Completo — 3,800
3. 2 Inmersiones Barco — 1,800 THB
4. Chumphon Pinnacle y The Twins
5. Centro PADI 5 Estrellas
6. Grupos Pequeños, 2 Barcos Propios
7. WhatsApp — Respondemos Rápido
8. Tiburones Ballena en Sail Rock
9. Inmersiones Mañana o Tarde
10. 778 Reseñas en TripAdvisor
11. Equipo Incluido
12. Reserva Hoy — Bucea Mañana
13. Reserva Online, Sin Depósito
14. Buceadores Certificados
15. Los Mejores Sitios de la Isla

**Descriptions (4):**
- Dos inmersiones de mañana o tarde por 1,800 THB. Sail Rock día completo con posibles tiburones ballena por 3,800 THB. Equipo incluido.
- Dos barcos propios, grupos pequeños, horario que se cumple. Centro PADI 5 Estrellas en Koh Tao.
- Elige los sitios — Chumphon Pinnacle, Sail Rock, The Twins, White Rock. Reserva online sin depósito.
- WhatsApp con tus fechas o reserva directo — solemos meterte en un barco en 24 horas.

### 6.9 FUN_HE — `/he/fun-dives`

**Headlines (15):**
1. צלילות בקוסמוי
2. סייל רוק יום שלם — 3,800
3. שתי צלילות סירה — 1,800 THB
4. Chumphon Pinnacle ו-The Twins
5. מרכז PADI 5 כוכבים
6. קבוצות קטנות, 2 סירות פרטיות
7. WhatsApp — תשובה בדקות
8. כרישי לוויתן בסייל רוק
9. צלילות בוקר או צהריים
10. 778 ביקורות ב-TripAdvisor
11. ציוד כלול
12. הזמינו היום, צוללים מחר
13. הזמנה אונליין, ללא פיקדון
14. למוסמכים בלבד
15. אתרי הצלילה הכי טובים באי

**Descriptions (4):**
- שתי צלילות בוקר או צהריים ב-1,800 THB. סייל רוק יום שלם עם סיכוי לכרישי לוויתן ב-3,800 THB. ציוד כלול.
- שתי סירות פרטיות, קבוצות קטנות, לו"ז אמיתי. מרכז PADI 5 כוכבים בקוסמוי.
- אתם בוחרים אתר — Chumphon Pinnacle, Sail Rock, The Twins, White Rock. הזמנה אונליין ללא פיקדון.
- שלחו ב-WhatsApp תאריכים או הזמינו ישיר — בדרך כלל מעלים אתכם לסירה בתוך 24 שעות.

---

## 7. Sitelinks, callouts, structured snippets (campaign-level)

### 7.1 Sitelinks (4, EN — replicate per language)
| Sitelink | URL | Description line 1 | Description line 2 |
|---|---|---|---|
| Our 2 Dive Boats | `/about` | Two custom boats, small groups | We don't share boats with other shops |
| Meet the Team | `/about` | PADI instructors with 10+ yrs | Multilingual: EN / ES / HE / TH |
| Dive Sites We Cover | `/dive-sites` | Sail Rock, Chumphon, Twins | Whale shark season Mar–May |
| Real Reviews | `/about#reviews` | 778 reviews, 4.9 on TripAdvisor | First-time divers welcome |

### 7.2 Callouts (8)
- Free re-take guarantee
- No deposit required
- Two private dive boats
- Max 4 students per instructor
- PADI 5-Star Center
- WhatsApp in EN / ES / HE
- Same-day booking
- All gear included

### 7.3 Structured snippets
- Type: **Courses** → Discover Scuba, Open Water, Advanced Open Water, Rescue Diver, Divemaster
- Type: **Service catalog** → Fun Dives, Sail Rock Trip, Night Dives, Private Guide

---

## 8. Launch checklist

### Pre-launch (Day 0, before any campaign goes live)
- [ ] Ben creates conversion actions #2 + #3 in Google Ads UI; paste labels at bottom of doc
- [ ] I wire the labels into `src/utils/tracking.ts` and re-deploy
- [ ] Verify `whatsapp_click` and `generate_lead` fire as Google Ads conversions in Tag Assistant (live preview, on `/discover-scuba-diving?utm_source=test`)
- [ ] Restore lander URLs in `scripts/generate-sitemap.ts` (uncomment lines 46-48 block); push
- [ ] Spot-check the 9 landers render correctly in EN/ES/HE on mobile + desktop
- [ ] Confirm FloatingWhatsApp + Navbar WhatsApp buttons fire `trackWhatsAppClick` (audit didn't verify these)
- [ ] Ben names the launch date — coordinate with Nemo phone cutover (per memory `project_nemo_phone_strategy`)
- [ ] Optional: discount/urgency hook decision — if yes, add to all 27 RSAs in §6 before publishing
- [ ] Optional: creative (image extensions) — minimum 5 horizontal photos of boats / Sail Rock / instructor in action

### Build (Day 0-1)
- [ ] Create the account-level shared negative list (§5)
- [ ] Create the 3 campaigns with settings from §2
- [ ] Create the 9 ad groups, each with keywords from §4 and 1 RSA from §6
- [ ] Attach sitelinks/callouts/snippets from §7 at campaign level
- [ ] Stage but **do not publish** — wait until conversion actions are firing

### Launch (Day 1)
- [ ] Verify conversions tab shows "Recording" status for all 3 actions
- [ ] Publish campaigns staggered 4-6 hours apart (DSD → FUN → OWD) to spread the learning-phase budget burn
- [ ] Set a Google Ads alert on each campaign for "Daily budget consumed before 12pm" — early-spend = high-intent traffic, raise budget

### Monitor (Day 2-7)
- [ ] Daily: Search Terms report → add negatives, promote high-converting terms to Exact
- [ ] Day 3: add RSA #2 + #3 per ad group based on top headlines from RSA #1 asset performance
- [ ] Day 4: switch from Maximize Conversions → tCPA (target = current average CPA)
- [ ] Day 5: pause any ad group with CPA > 2× campaign average AND ≥ 5 conversions
- [ ] Day 7: full report — cost/lead, cost/booking, ROAS by language, top search terms

### Post-flight (Day 8)
- [ ] Decide: extend, scale, or pivot to PMax with winning RSAs as asset groups
- [ ] If Meta unblocks during the week, port creative + structure into Meta side per `tranquil-seeking-scott.md` Phase 4

---

## 9. Verification — end-to-end conversion flow

Run before publishing campaigns:

1. Open Chrome DevTools, install [Google Tag Assistant Companion](https://tagassistant.google.com/) extension
2. Visit `http://localhost:8080/discover-scuba-diving?utm_source=test&utm_medium=cpc&utm_campaign=qa&utm_content=manual&utm_term=keyword_test`
3. Check sessionStorage → `siam_utm` populated
4. Tag Assistant should show `page_view` + `view_item` firing to `AW-18050429438`
5. Click "Chat on WhatsApp" — Tag Assistant shows `whatsapp_click` + (once label wired) `conversion` to `AW-18050429438/<wa-label>`
6. Open `/fun-dive-booking?utm_passthrough=1` → submit a booking form → Tag Assistant shows `generate_lead` + `conversion` to `AW-18050429438/<lead-label>`
7. Verify wa.me destination URL contains the UTM string in the encoded message (this is how we attribute WhatsApp leads after they leave the site)

---

## 10. Conversion labels — PASTE WHEN READY

| Action | gtag event name | Label (paste here after creating in Google Ads UI) |
|---|---|---|
| Booking Confirmed | `purchase` | `9d1fCLb625gcEP7jjp9D` ✅ already wired |
| Lead — Form Submitted | `generate_lead` | `_______________` |
| WhatsApp Click | `whatsapp_click` | `_______________` |

Once filled in, I edit `src/utils/tracking.ts` to attach `send_to: AW-18050429438/<label>` to the two events, then we ship.
