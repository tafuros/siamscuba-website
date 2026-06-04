// Vercel serverless function: POST /api/chat
// Body: { messages: [{role, content}], lang?: "en"|"he"|"es"|"fr" }
// Returns: { reply: string }
// The /api/ path is excluded from the SPA rewrite in vercel.json.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateReply, type ChatMessage } from "./_core";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {};
    const messages = (body.messages ?? []) as ChatMessage[];
    const lang = typeof body.lang === "string" ? body.lang : "en";

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages required" });
    }

    const reply = await generateReply(messages, lang);
    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error("[api/chat]", err?.message || err);
    const status = err?.message === "ANTHROPIC_API_KEY is not set" ? 503 : 500;
    return res.status(status).json({ error: "chat_failed" });
  }
}
