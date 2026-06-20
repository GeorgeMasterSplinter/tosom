"use client";

/** LaunchFlow.tsx — hovedkomponent som styrer heile oppstarten
 *  LF9 — render rett skjerm basert på currentStep
 *  Når step = "done" → goTo("onboarding") eller "dashboard"
 *  LF18-19 — same blå/grønne ro-tonar, moden typografi */

import { useEffect, useState, useCallback } from "react";
import type { LaunchState } from "../../lib/launch/launchState";
import { initialLaunchState, nextStep } from "../../lib/launch/launchState";
import SplashScreen from "./SplashScreen";
import LoadingScreen from "./LoadingScreen";
import MatchSearchScreen from "./MatchSearchScreen";
import JourneyUpdateScreen from "./JourneyUpdateScreen";

/* ── Navigasjonsavhengigheit (valfritt) ── */
type NavigationFn = (route: string, params?: Record<string, any>) => void;

interface LaunchFlowProps {
  onLaunchComplete?: (route: string, params?: Record<string, any>) => void;
  nav?: NavigationFn;
  /** Tilsidesett initial tilstand (for testing) */
  initialState?: LaunchState;
}

export default function LaunchFlow({
  onLaunchComplete,
  nav,
  initialState,
}: LaunchFlowProps) {
  const [state, setState] = useState<LaunchState>(
    initialState ?? initialLaunchState()
  );

  const handleStepChange = useCallback(
    (next: LaunchState) => {
      setState(next);

      /* LF9: Når done → send brukaren vidare */
      if (next.currentStep === "done") {
        const route = "dashboard"; // kan utvidast med onboarding-sjekk
        const params: Record<string, any> = {};
        console.log("[LaunchFlow] ✅ Launch completed →", route, params);
        if (onLaunchComplete) onLaunchComplete(route, params);
        if (nav) nav(route, params);
      }
    },
    [onLaunchComplete, nav]
  );

  /* Berek bakgrrunngradient per steg */
  const bgGradient = (() => {
    switch (state.currentStep) {
      case "splash":
        return "from-blue-50 via-emerald-50/50 to-amber-50";
      case "loading":
        return "from-emerald-50 via-blue-50/30 to-teal-50";
      case "match_search":
        return "from-blue-50 via-purple-50/20 to-emerald-50";
      case "journey_update":
        return "from-emerald-50 via-teal-50/30 to-blue-50";
      case "done":
        return "from-emerald-100 to-blue-100";
    }
  })() as string;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} flex flex-col items-center justify-center p-6 transition-colors duration-700`}
    >
      <div className="w-full max-w-md">
        {/* LF15: Fade-in mellom skjermar */}
        <div
          key={state.currentStep}
          className="animate-[fadeIn_0.4s_ease-out]"
        >
          {state.currentStep === "splash" && (
            <SplashScreen state={state} onStepChange={handleStepChange} />
          )}
          {state.currentStep === "loading" && (
            <LoadingScreen state={state} onStepChange={handleStepChange} />
          )}
          {state.currentStep === "match_search" && (
            <MatchSearchScreen state={state} onStepChange={handleStepChange} />
          )}
          {state.currentStep === "journey_update" && (
            <JourneyUpdateScreen state={state} onStepChange={handleStepChange} />
          )}
          {state.currentStep === "done" && (
            <div className="text-center space-y-4">
              <div className="text-7xl">✨</div>
              <h2 className="text-xl font-medium text-[#4A4A4A]">
                Velkommen til ToSom
              </h2>
              <p className="text-xs text-[#4A4A4A]/50">
                Klart for å start reisen din
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
