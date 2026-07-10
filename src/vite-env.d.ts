/// <reference types="vite/client" />

/** Build-day stamp (UTC yyyy-mm-dd) injected via `define` in vite.config.ts. */
declare const __SSG_BUILD_DATE__: string;

interface ImportMetaEnv {
  /** When "on", mounts the entry-gate intro overlay. Unset/"off" = dormant. */
  readonly VITE_ENTRY_GATE?: "on" | "off";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
