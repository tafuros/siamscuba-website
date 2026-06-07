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
          const { generateReply, rateLimited, clientIp, checkPayload } =
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

          const reply = await generateReply(
            body.messages ?? [],
            body.lang ?? "en",
            env.ANTHROPIC_API_KEY,
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

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
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
