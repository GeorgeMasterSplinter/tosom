"use client";

/** MatchSearchScreen.tsx — match-søkeskjerm med pulse-animasjon
 *  LF7 — emoji 🔍, pulse-animasjon, etter 2-3s → nextStep()
 *  LF15 — pulse-test
 *  LF18-19 — same blå/grønne ro-tonar */

import { useEffect, useState } from "react";
import type { LaunchState } from "../../lib/launch/launchState";
import { nextStep } from "../../lib/launch/launchState";

interface MatchSearchScreenProps {
  state: LaunchState;
  onStepChange: (state: LaunchState) => void;
}

export default function MatchSearchScreen({ state, onStepChange }: MatchSearchScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const autoTimer = setTimeout(() => {
      onStepChange(nextStep(state));
    }, 2500);
    return () => clearTimeout(autoTimer);
  }, [state, onStepChange]);

  return (
    <div
      className={`flex flex-col items-center justify-center h-full text-center space-y-8 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-7xl animate-[ping_2s_infinite]">🔍</div>
      <div>
        <h2 className="text-xl font-medium text-[#4A4A4A] mb-2">
          Vi leter etter ein match for deg…
        </h2>
        <p className="text-xs text-[#4A4A4A]/50">
          Analyserer preferansar, verdiar og reise
        </p>
      </div>
    </div>
  );
}
