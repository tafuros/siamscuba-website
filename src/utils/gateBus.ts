// Tiny event bus for reopening the entry gate from anywhere in the app
// (navbar compass, footer "Welcome menu"). EntryGate listens for this event
// and re-activates itself in place - no reload, works on any route.
export const OPEN_GATE_EVENT = "siam:open-gate";

export const openGate = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_GATE_EVENT));
};
