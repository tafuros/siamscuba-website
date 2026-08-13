/**
 * Assert the emitted JS chunk graph is acyclic.
 *
 * WHY THIS EXISTS
 * ---------------
 * A hand-rolled `manualChunks` splitter in vite.config.ts produced a circular
 * chunk graph in production for months:
 *
 *   vendor <-> react-vendor,  vendor <-> radix,  vendor <-> router
 *
 * In a circular ESM graph the browser must evaluate one side before the other.
 * Whichever top-level `const` binding is touched before its own chunk body has
 * run throws "Cannot access 'X' before initialization" - which Microsoft
 * Clarity recorded on 11.76% of erroring production sessions. It is
 * load-order dependent, so it never reproduced reliably in local review and
 * never failed a build: Rollup emits circular chunks without complaint.
 *
 * Nothing else in the toolchain catches this, so it gets its own gate. Run it
 * after `bun run build`.
 */
import fs from "node:fs";
import path from "node:path";

const assetsDir = path.resolve(process.argv[2] ?? "dist/assets");

if (!fs.existsSync(assetsDir)) {
  console.error(`[chunk-cycles] no such directory: ${assetsDir} - run \`bun run build\` first.`);
  process.exit(1);
}

const files = fs.readdirSync(assetsDir).filter((f) => f.endsWith(".js"));
if (files.length === 0) {
  console.error(`[chunk-cycles] no .js chunks in ${assetsDir} - did the build succeed?`);
  process.exit(1);
}

// Static `import ... from "./chunk.js"` / `export ... from "./chunk.js"` edges.
// Dynamic `import("./chunk.js")` is deliberately NOT an edge: it is deferred,
// so it cannot participate in a top-level evaluation-order deadlock.
const STATIC_EDGE = /(?:^|[^.\w])(?:from|import)\s*["']\.\/([A-Za-z0-9_.-]+\.js)["']/g;

const graph = new Map<string, Set<string>>();
for (const file of files) {
  const source = fs.readFileSync(path.join(assetsDir, file), "utf8");
  const deps = new Set<string>();
  for (const match of source.matchAll(STATIC_EDGE)) deps.add(match[1]);
  graph.set(file, deps);
}

const UNVISITED = 0;
const ON_STACK = 1;
const DONE = 2;
const state = new Map<string, number>();
const cycles = new Set<string>();

const visit = (node: string, stack: string[]): void => {
  if (state.get(node) === ON_STACK) {
    cycles.add([...stack.slice(stack.indexOf(node)), node].join(" -> "));
    return;
  }
  if (state.get(node) === DONE) return;

  state.set(node, ON_STACK);
  stack.push(node);
  for (const dep of graph.get(node) ?? []) {
    if (graph.has(dep)) visit(dep, stack);
  }
  stack.pop();
  state.set(node, DONE);
};

for (const file of graph.keys()) {
  if ((state.get(file) ?? UNVISITED) === UNVISITED) visit(file, []);
}

if (cycles.size > 0) {
  console.error(
    `[chunk-cycles] ${cycles.size} circular chunk dependenc${cycles.size === 1 ? "y" : "ies"} in ${assetsDir}:`,
  );
  for (const cycle of cycles) console.error(`  ${cycle}`);
  console.error(
    "\nThis ships 'Cannot access X before initialization' to real users.\n" +
      "Almost always caused by a manualChunks() bucket that splits a library\n" +
      "away from its own transitive dependencies. Fix the split, or drop\n" +
      "manualChunks entirely - Rollup's default chunking is acyclic.",
  );
  process.exit(1);
}

console.log(`[chunk-cycles] no circular chunk dependencies (${files.length} chunks scanned).`);
