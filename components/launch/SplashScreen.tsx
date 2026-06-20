"use client";

/** SplashScreen.tsx — førsteinntrykk av ToSom
 *  LF5 — fade-in animasjon, etter 1.5s → nextStep()
 *  LF18–LF19 — rolige blå/grønne toner, moden og varm typografi */

import { useEffect, useState } from "react";
import type { LaunchState } from "../../lib/launch/launchState";
import { nextStep } from "../../lib/launch/launchState";

interface SplashScreenProps {
  state: LaunchState;
  onStepChange: (state: LaunchState) => void;
}

export default function SplashScreen({ state, onStepChange }: SplashScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade-in
    const fadeTimer = setTimeout(() => setVisible(true), 50);
    // Auto-advance
    const autoTimer = setTimeout(() => {
      onStepChange(nextStep(state));
    }, 1500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(autoTimer);
    };
  }, [state, onStepChange]);

  return (
    <div
      className={`flex flex-col items-center justify-center h-full text-center space-y-8 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-7xl animate-pulse">💫</div>
      <div>
        <h1 className="text-3xl font-semibold text-[#4A4A4A] mb-3 tracking-tight">
          ToSom
        </h1>
        <p className="text-sm text-[#4A4A4A]/60 max-w-sm leading-relaxed">
          Rolige møter. Ekte forbindelser.
        </p>
      </div>
    </div>
  );
}
