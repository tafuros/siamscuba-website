import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// Dev-only: serve POST /api/chat from the same handler Vercel uses in prod,
// so the chat widget works on `vite` (port 8080) without `vercel dev`.
function nemoChatDevApi(env: Record<string, string>): Plugin {
  return {
    name: "nemo-chat-dev-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          return res.end(JSON.stringify({ error: "Method not allowed" }));
        }
        try {
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
          const { generateReply, logConversation, rateLimited, clientIp, checkPayload } =
            await server.ssrLoadModule("/api/chat.ts");

          // Mirror the prod abuse guards so dev behaves like the Vercel handler.
          if (rateLimited(clientIp(req))) {
            res.statusCode = 429;
            res.setHeader("Retry-After", "30");
            return res.end(JSON.stringify({ error: "rate_limited" }));
          }
          const payloadError = checkPayload(body.messages ?? []);
          if (payloadError) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: payloadError }));
          }

          // Pass the shared lead token from the loaded env so the KB overlay +
          // conversation logging can reach DiveOS during local testing too.
          const leadToken = env.LEAD_CAPTURE_TOKEN || env.VITE_LEAD_TOKEN || undefined;
          const reply = await generateReply(
            body.messages ?? [],
            body.lang ?? "en",
            env.ANTHROPIC_API_KEY,
            leadToken,
          );
          // Persist BEFORE responding (mirrors the prod handler): a post-response
          // await is unreliable on Vercel where the instance can freeze once the
          // body is flushed. logConversation is time-boxed + error-swallowed.
          await logConversation(
            {
              sessionId: typeof body.sessionId === "string" ? body.sessionId : null,
              messages: [...(body.messages ?? []), { role: "assistant", content: reply }],
              lang: body.lang ?? "en",
              page: typeof body.page === "string" ? body.page : null,
            },
            leadToken,
          );
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ reply }));
        } catch (err: any) {
          console.error("[dev /api/chat]", err?.message || err);
          res.statusCode = err?.message === "ANTHROPIC_API_KEY is not set" ? 503 : 500;
          res.end(JSON.stringify({ error: "chat_failed" }));
        }
      });
    },
  };
}

// Dev-only: serve GET /api/pulse from the same handler logic Vercel uses in
// prod, so the Google Ads pulse can be verified on `vite` (port 8080) without
// `vercel dev`. Reuses getPulse from api/pulse.ts; auth mirrors the prod guard.
function googleAdsPulseDevApi(env: Record<string, string>): Plugin {
  return {
    name: "google-ads-pulse-dev-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/pulse", async (req, res) => {
        if (req.method !== "GET") {
          res.statusCode = 405;
          return res.end(JSON.stringify({ error: "method_not_allowed" }));
        }
        try {
          const secret = env.PULSE_READ_SECRET;
          if (!secret) {
            res.statusCode = 503;
            return res.end(JSON.stringify({ error: "pulse_not_configured" }));
          }
          const got = req.headers["x-pulse-secret"];
          const provided = Array.isArray(got) ? got[0] : got;
          if (provided !== secret) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ error: "unauthorized" }));
          }
          const { getPulse } = await server.ssrLoadModule("/api/pulse.ts");
          const pulse = await getPulse(env);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(pulse));
        } catch (err: any) {
          const msg = err?.message || String(err);
          console.error("[dev /api/pulse]", msg);
          res.statusCode = msg.startsWith("missing_creds:") ? 503 : 502;
          res.end(
            JSON.stringify({
              error: msg.startsWith("missing_creds:")
                ? "pulse_not_configured"
                : "pulse_upstream_failed",
            }),
          );
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  // Build-day stamp (UTC yyyy-mm-dd), baked identically into the SSG bundle and
  // the client bundle. Time-rolling UI (Sail Rock departures) renders its FIRST
  // pass from this stamp so client hydration always matches the SSG HTML, then
  // refreshes to the real "today" in an effect. See src/lib/sailRockDates.ts.
  define: {
    __SSG_BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && nemoChatDevApi(env),
    mode === "development" && googleAdsPulseDevApi(env),
    ViteImageOptimizer({
      png: { quality: 80, compressionLevel: 9 },
      jpeg: { quality: 78, mozjpeg: true },
      jpg: { quality: 78, mozjpeg: true },
      webp: { quality: 82 },
      svg: {
        multipass: true,
        plugins: [
          { name: "preset-default", params: { overrides: { removeViewBox: false } } },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-router")) return "router";
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/scheduler/")
          ) {
            return "react-vendor";
          }
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("framer-motion") || id.includes("motion-")) return "framer";
          if (id.includes("@tanstack")) return "tanstack";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("date-fns")) return "date";
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          return "vendor";
        },
      },
    },
  },
  };
});
