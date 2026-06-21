/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** When "on", mounts the entry-gate intro overlay. Unset/"off" = dormant. */
  readonly VITE_ENTRY_GATE?: "on" | "off";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
