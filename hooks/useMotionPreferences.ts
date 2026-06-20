/**
 * ToSom UI 4.6 — Motion Preferences Hook
 * Respects prefers-reduced-motion and provides safe motion tokens.
 */

import { useEffect, useState } from "react";

export function useMotionPreferences() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // SSR-safe: check only on client
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    // Firefox doesn't support change event, so we use addEventListener
    const handler = (e: MediaQueryListEvent | any) => {
      setPrefersReducedMotion(e.matches);
    };
    mq.addEventListener?.("change", handler);
    // Fallback for older browsers
    if (!mq.addEventListener) {
      mq.addListener?.(handler);
    }

    return () => {
      mq.removeEventListener?.("change", handler);
      mq.removeListener?.(handler);
    };
  }, []);

  return {
    prefersReducedMotion,
    /** Duration to use for animations (0 if reduced motion) */
    effectiveDuration: prefersReducedMotion ? 0 : undefined,
    /** Transition string to use (none if reduced motion) */
    effectiveTransition: prefersReducedMotion ? "none" : undefined,
  };
}

/** Motion-safe CSS class helper */
export function motionClassName(
  normalClass: string,
  reducedClass = "",
  prefersReducedMotion = false
): string {
  return prefersReducedMotion ? (reducedClass || "") : normalClass;
}
