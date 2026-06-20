/* ═══════════════════════════════════════════
   ToSom — Analytics Provider (Plausible + Custom Events)
   ═══════════════════════════════════════════ */

"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Konfigurasjon — bytt til din Plausible domain eller Umami UUID     */
/* ------------------------------------------------------------------ */

const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || ""; // f.eks. "tosom.no"
const UMAAMI_SCRIPT_ID = process.env.NEXT_PUBLIC_UMAAMI_SCRIPT_ID || "";

/* ------------------------------------------------------------------ */
/*  Event interface                                                    */
/* ------------------------------------------------------------------ */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

/* ------------------------------------------------------------------ */
/*  Plausible helper                                                  */
/* ------------------------------------------------------------------ */

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options: { props?: Record<string, string | number>; callback?: () => void },
    ) => void;
    umami?: { track: (eventName: string, data?: Record<string, string | number>) => void };
  }
}

function trackPlausible(name: string, props?: Record<string, string | number>) {
  if (!ANALYTICS_ENABLED || !window.plausible) return;
  window.plausible(name, { props });
}

function trackUmami(name: string, props?: Record<string, string | number>) {
  if (!ANALYTICS_ENABLED || !window.umami) return;
  window.umami.track(name, props);
}

function trackCustom(name: string, props?: Record<string, string | number>) {
  if (!ANALYTICS_ENABLED) return;
  if (PLAUSIBLE_DOMAIN) {
    trackPlausible(name, props);
  } else if (UMAAMI_SCRIPT_ID) {
    trackUmami(name, props);
  } else {
    // Server-side fallback (POST to /api/analytics/track)
    void fetch(`/api/analytics/track?event=${encodeURIComponent(name)}`, {
      method: "POST",
      body: JSON.stringify({ properties: props, url: typeof window !== "undefined" ? window.location.href : "/" }),
      headers: { "Content-Type": "application/json" },
    }).catch(() => { /* Silently fail */ });
  }
}

/* ------------------------------------------------------------------ */
/*  Hook: track event eksplisitt                                       */
/* ------------------------------------------------------------------ */

export function useTrack() {
  return useCallback(function trackEvent(name: string, props?: Record<string, string | number>) {
    trackCustom(name, props);
  }, []);
}

/* ------------------------------------------------------------------ */
/*  Pageview-hook                                                      */
/* ------------------------------------------------------------------ */

function usePageview() {
  const pathname = usePathname();

  useEffect(() => {
    if (!ANALYTICS_ENABLED || !pathname) return;

    // Pageview on mount + route change
    if (PLAUSIBLE_DOMAIN) {
      trackPlausible("pageview");
    } else if (UMAAMI_SCRIPT_ID) {
      trackUmami("pageview");
    }
  }, [pathname]);
}

/* ------------------------------------------------------------------ */
/*  Preset events                                                     */
/* ------------------------------------------------------------------ */

export const analytics = {
  /** Track a pageview */
  pageview: () => trackCustom("pageview"),

  /** Track onboarding step completion */
  onboardingComplete: (step: string, completedAt: string) =>
    trackCustom("onboarding_complete", { step, completedAt }),

  /** Track match card view */
  matchCardView: (matchId: string, score: number) =>
    trackCustom("match_card_view", { matchId, score }),

  /** Track chat open */
  chatOpen: (conversationId: string) =>
    trackCustom("chat_open", { conversationId }),

  /** Track journey step open */
  journeyStepOpen: (stepId: string, stepTitle: string) =>
    trackCustom("journey_step_open", { stepId, stepTitle }),

  /** Track login */
  login: (method: string) => trackCustom("login", { method }),

  /** Track signup */
  signup: (method: string) => trackCustom("signup", { method }),

  /** Track profile edit */
  profileEdit: (fieldsModified: number) =>
    trackCustom("profile_edit", { fieldsModified }),

  /** Track match action */
  matchAction: (action: string, matchId: string) =>
    trackCustom("match_action", { action, matchId }),

  /** Track payment (when ready) */
  purchase: (amount: number, currency: string, itemId: string) =>
    trackCustom("purchase", { amount, currency, itemId }),
};

/* ------------------------------------------------------------------ */
/*  Client Provider component                                         */
/* ------------------------------------------------------------------ */

export function AnalyticsProvider() {
  usePageview();

  // Inject Plausible script
  useEffect(() => {
    if (!ANALYTICS_ENABLED || !PLAUSIBLE_DOMAIN) return;

    const script = document.createElement("script");
    script.src = `https://plausible.io/js/script.js`;
    script.setAttribute("data-domain", PLAUSIBLE_DOMAIN);
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [PLAUSIBLE_DOMAIN]);

  // Inject Umami script
  useEffect(() => {
    if (!ANALYTICS_ENABLED || !UMAAMI_SCRIPT_ID) return;

    const script = document.createElement("script");
    script.src = `https://cloud.umami.is/script.js`;
    script.setAttribute("data-website-id", UMAAMI_SCRIPT_ID);
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [UMAAMI_SCRIPT_ID]);

  return null;
}

export default AnalyticsProvider;