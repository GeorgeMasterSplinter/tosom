"use client";

/** JourneyUpdateScreen.tsx — reiseoppdateringsskjerm
 *  LF8 — emoji 🌿, "Oppdaterer reisen din…", etter 1-2s → nextStep()
 *  LF18-19 — same blå/grønne ro-tonar */

import { useEffect, useState } from "react";
import type { LaunchState } from "../../lib/launch/launchState";
import { nextStep } from "../../lib/launch/launchState";

interface JourneyUpdateScreenProps {
  state: LaunchState;
  onStepChange: (state: LaunchState) => void;
}

export default function JourneyUpdateScreen({ state, onStepChange }: JourneyUpdateScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const autoTimer = setTimeout(() => {
      onStepChange(nextStep(state));
    }, 1500);
    return () => clearTimeout(autoTimer);
  }, [state, onStepChange]);

  return (
    <div
      className={`flex flex-col items-center justify-center h-full text-center space-y-8 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-7xl">🌿</div>
      <div>
        <h2 className="text-xl font-medium text-[#4A4A4A] mb-2">
          Oppdaterer reisen din…
        </h2>
        <p className="text-xs text-[#4A4A4A]/50">
          Tilpasser innhald og forslag
        </p>
      </div>
    </div>
  );
}
