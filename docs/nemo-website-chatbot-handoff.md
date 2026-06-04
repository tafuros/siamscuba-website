# Handoff: Website chatbot (Nemo) → unify with WhatsApp Nemo

**For:** the `nemo` agent (owner of the WhatsApp Nemo bot, `~/Projects/n8n-nemo`).
**From:** the `website` agent (`~/Projects/website`).
**Date:** 2026-06-04. **Status:** website chatbot is LIVE on siamscuba.com.

## Why this handoff
We just built and shipped an **in-page chatbot** on siamscuba.com ("Nemo"), powered by Claude Haiku. It already shares its knowledge base with your WhatsApp Nemo. Ben wants you to take ownership so the **two Nemos feel like one** - same persona, same prices, same answers - and to tighten the website bot's answers (currently too long / shows raw markdown). The KB plumbing is already unified; the remaining work is persona + answer quality + keeping them in sync.

## What is live now (website side)

**Architecture - Tier-1, no RAG:** the whole site KB is stuffed into a cached Claude system prompt. Model: `claude-haiku-4-5-20251001`.

| File | Role |
|---|---|
| `api/chat.ts` | Vercel serverless function `POST /api/chat`. **Self-contained** (see Vercel trap below). Contains the system prompt + `generateReply()`. |
| `api/_kb.json` | ~210 KB records, bundled with the function (via `vercel.json` → `functions.includeFiles`). |
| `scripts/lib/extract-kb.ts` | **SHARED extractor.** Returns `{source, text}[]` from site data (blog, dive sites, landers, i18n). |
| `scripts/build-chat-kb.ts` | Writes `api/_kb.json` (website). Runs on `bun run build` + `bun run chat:kb`. |
| `scripts/extract-content-for-nemo.ts` | Writes `/tmp/kb-content.json` (your WhatsApp bot). **Same extractor.** |
| `src/components/NemoChat.tsx` | The widget UI (floating pill, suggestion chips, WhatsApp handoff, RTL, en/he/es). Mounted globally in `src/App.tsx`. |
| `vite.config.ts` | Dev-only middleware serving `/api/chat` on :8080 (no `vercel dev` needed). |

**The integration point that already connects the two bots:** both Nemos derive their knowledge from the same source via `scripts/lib/extract-kb.ts`. Change site content → both bots update. Your `extract-content-for-nemo.ts` and the website's `build-chat-kb.ts` both call `extractKbRecords()`.

**Config / deploy:**
- `ANTHROPIC_API_KEY` is in Vercel **Production** (project `siam-website`, scope `benmosheavivis-projects`).
- Deploy = push to `main` → Vercel auto-deploy. Preview env is NOT used (prod-only env vars, matching the Supabase convention).
- WhatsApp number used by the handoff button: `66825068898` (see `src/utils/whatsapp.ts`, which also has the `[ref:CODE]` topic taxonomy your n8n classifier reads: general/dsd/owd/aow/rescue/dm/idc/fun-dive/refresher).

**Verified live:** EN + Hebrew answers, correct THB pricing (fixed a shekel-localization bug), dive-site grounding, off-topic guardrail.

## Vercel ESM trap (don't re-break this)
Root `package.json` is `"type": "module"`, so Vercel ships functions as raw ESM and does **not** bundle `_`-prefixed sibling files. Any `import ./_helper` or `import ./_data.json` → `ERR_MODULE_NOT_FOUND` at runtime (works locally under Vite, fails on Vercel). Keep `api/chat.ts` self-contained; load data via `fs` + `includeFiles`.

## Issues to fix (the actual ask)

### 1. Answers are too long and show raw markdown
Live screenshot: the opening answer dumps the whole course sheet, and `**bold**` / `-` bullets render literally because the bubble is plain text (`{m.content}` in `NemoChat.tsx`).
**Recommended fix (system prompt in `api/chat.ts`):**
- Hard cap: 2-3 short sentences for opening/簡 answers; no markdown, no bold, no bullet lists - plain conversational text.
- Always end with a short question to keep the conversation going ("Want me to check dates?").
- Give the price + the single most relevant hook, then invite the next message - don't list every inclusion unless asked.
- (Alternative to "no markdown": render markdown in the bubble with `react-markdown`. But for a chat tone, plain short text is better. Pick one - don't leave raw `**` showing.)

### 2. Focus the opening suggestion chips + their answers
Current chips (`COPY` in `NemoChat.tsx`, en/he/es): "Which course is right for me?", "How much does it cost?", "What will I see underwater?", "I want to book a dive".
Ben wants the **first-touch** experience tight: each suggested question should get a short, punchy answer that pulls the user deeper, not a wall of text. Treat these 3-4 questions as designed funnels (curiosity → price/value → book on WhatsApp).

### 3. Explore additional likely questions
e.g. "Do I need to know how to swim?", "Is it safe for kids / non-swimmers?", "How fit do I need to be?", "What's included?", "Where are you located / how do I get there?", "Can I dive if I wear glasses / have asthma?", "Best season?", "Do you speak Hebrew/Spanish?", "Payment / deposit?". Map these to short, on-brand answers and to the right WhatsApp `[ref:]` topic for warm-lead handoff.

## Suggested plan for you (nemo agent)
1. **Define ONE Nemo persona + answer style** (short, warm, funnel-oriented, no markdown) and write it as a single canonical system prompt. Mirror it into both surfaces: `api/chat.ts` (website) and your n8n Gemini prompt (WhatsApp).
2. **Unify the question taxonomy** with `src/utils/whatsapp.ts` topics so a website chat that escalates to WhatsApp carries intent.
3. **Tighten website answers** per issues #1-#3 above (edit `api/chat.ts` system prompt; optionally trim KB noise - the 68 `translations:*` records are UI strings, low value for Q&A).
4. **Keep them in sync:** document that site-content changes require `bun run chat:kb` (website) and your `extract-content-for-nemo.ts` re-run (WhatsApp). Consider a single shared regenerate step.
5. Coordinate with the `website` agent for any `NemoChat.tsx` UI change (chips copy, markdown rendering) and to deploy (push to `main`).

## Constraints
- House style: plain hyphen `-`, never em/en-dash (the website fn already strips them post-generation). Reply to Ben in English.
- Prices ALWAYS in THB (never localize currency). This bit Hebrew already.
- Test locally on :8080 before deploy; preview in browser; push to `main` to ship.
- Pending unrelated item: mascot art `public/nemo/nemo-avatar.png` (currently 🐠 emoji fallback) - the website agent is handling it.
