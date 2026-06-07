"use client";

/** LoadingScreen.tsx — lasteskjerm med spinner og progress
 *  LF6 — spinner, "Laster…", progress-bar (dummy), etter 1-2s → nextStep()
 *  LF18-19 — same blå/grønne ro-tonar, moden typografi */

import { useEffect, useState } from "react";
import type { LaunchState } from "../../lib/launch/launchState";
import { nextStep, setProgress } from "../../lib/launch/launchState";

interface LoadingScreenProps {
  state: LaunchState;
  onStepChange: (state: LaunchState) => void;
}

export default function LoadingScreen({ state, onStepChange }: LoadingScreenProps) {
  const [progress, setProgressLocal] = useState(0);

  useEffect(() => {
    // Simuler progress 0 → 100
    const start = Date.now();
    const duration = 1800; // 1.8s
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgressLocal(p);
      if (elapsed >= duration) clearInterval(timer);
    }, 50);

    // Auto-advance etter 1.5s
    const autoTimer = setTimeout(() => {
      onStepChange(setProgress(nextStep(state), 100));
    }, 1500);

    return () => {
      clearInterval(timer);
      clearTimeout(autoTimer);
    };
  }, [state, onStepChange]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-[#e2e8f0] rounded-full" />
        <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin" />
      </div>

      {/* Tekst */}
      <div>
        <h2 className="text-xl font-medium text-[#4A4A4A] mb-2">
          Laster…
        </h2>
        <p className="text-xs text-[#4A4A4A]/50">
          Forbereder ToSom-oppdaginga di
        </p>
      </div>

      {/* Progress-bar */}
      <div className="w-64 h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
