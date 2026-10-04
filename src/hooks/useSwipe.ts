import { useRef } from "react";

/**
 * Horizontal swipe for photo carousels. Returns touch handlers to spread on the
 * element. `onSwipe(1)` means "next", `onSwipe(-1)` "previous" - already
 * flipped for right-to-left pages, where the next photo comes from the left.
 *
 * Clarity 2026-10-02: the hotel room photos took 1,325 taps on their small
 * arrows (88% of all taps on /he/hotel). On a phone people expect to swipe.
 */
export function useSwipe(onSwipe: (dir: 1 | -1) => void, rtl = false, threshold = 40) {
  const start = useRef<{ x: number; y: number } | null>(null);
  // Set when the gesture was a swipe, so a click handler on the same element
  // (e.g. "tap opens fullscreen") can ignore the click the browser sends after it.
  const swiped = useRef(false);

  return {
    swiped,
    handlers: {
      onTouchStart: (e: React.TouchEvent) => {
        const t = e.touches[0];
        start.current = { x: t.clientX, y: t.clientY };
        swiped.current = false;
      },
      onTouchEnd: (e: React.TouchEvent) => {
        const s = start.current;
        start.current = null;
        if (!s) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - s.x;
        const dy = t.clientY - s.y;
        // Mostly horizontal and long enough - otherwise it was a scroll or a tap.
        if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        swiped.current = true;
        const leftward = dx < 0;
        onSwipe(leftward !== rtl ? 1 : -1);
      },
    },
  };
}
