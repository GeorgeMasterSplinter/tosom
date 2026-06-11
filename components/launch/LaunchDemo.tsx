"use client";

/** LaunchDemo.tsx — full test av LaunchFlow utan app-shell
 *  LF11–LF20 — test med dummy initialState, knappar for testing, state-logging,
 *  animasjonar, progress-simulering og integrasjon med NavigationShell */

import { useState, useCallback } from "react";
import type { LaunchState, LaunchStep } from "../../lib/launch/launchState";
import {
  initialLaunchState,
  nextStep,
  setMessage,
  setProgress,
} from "../../lib/launch/launchState";
import LaunchFlow from "./LaunchFlow";

/* ── Knapp-hjelp ── */
function TestButton({
  label,
  onClick,
  accent = false,
}: {
  label: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-xs rounded-xl border transition-colors ${
        accent
          ? "bg-emerald-100 border-emerald-200 text-emerald-800 hover:bg-emerald-200"
          : "bg-white border-[#e2e8f0] text-[#4A4A4A]/70 hover:bg-[#f8fafc]"
      }`}
    >
      {label}
    </button>
  );
}

/* ── Route-label hjelper ── */
const stepLabels: Record<LaunchStep, string> = {
  splash: "💫 Splash",
  loading: "🔄 Lasting",
  match_search: "🔍 Match-søking",
  journey_update: "🌿 Reise-oppdatering",
  done: "✨ Ferdig",
};

export default function LaunchDemo() {
  const [state, setState] = useState<LaunchState>(initialLaunchState());

  const handleStepChange = useCallback(
    (next: LaunchState) => {
      setState(next);
      console.log("[LaunchDemo] 📋 state:", next);
    },
    []
  );

  const handleManualStep = useCallback(
    (step: LaunchStep) => {
      setState((prev) => ({ ...prev, currentStep: step }));
      console.log("[LaunchDemo] 🎯 Gå til:", step);
    },
    []
  );

  const handleProgressSim = useCallback((value: number) => {
    setState((prev) => setProgress(prev, value));
    console.log("[LaunchDemo] 📊 progress →", value);
  }, []);

  const handleSetMessage = useCallback((msg: string) => {
    setState((prev) => setMessage(prev, msg));
    console.log("[LaunchDemo] 💬 melding →", msg);
  }, []);

  const handleLaunchComplete = useCallback(
    (route: string, params?: Record<string, any>) => {
      console.log("[LaunchDemo] 🚀 Launch complete →", route, params);
      alert(`Launch fullført! Gå til: ${route}`);
    },
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex flex-col items-center p-6">
      {/* Overskrift */}
      <h1 className="text-2xl font-semibold text-[#4A4A4A] mb-2">
        🚀 LaunchFlow Demo
      </h1>
      <p className="text-xs text-[#4A4A4A]/40 mb-8">
        LF11–LF20 — Test launch-flow utan app-shell
      </p>

      {/* LaunchFlow visning */}
      <div className="w-full max-w-md border border-[#e2e8f0] rounded-2xl shadow-lg overflow-hidden mb-6">
        <LaunchFlow
          onLaunchComplete={handleLaunchComplete}
          initialState={state}
        />
      </div>

      {/* Testknappar */}
      <div className="w-full max-w-md space-y-4">

        {/* LF13: Steg-knappar */}
        <div>
          <h3 className="text-xs font-medium text-[#4A4A4A]/50 mb-2">
            LF13 — Steg-knappar
          </h3>
          <div className="flex flex-wrap gap-2">
            <TestButton label="🌿 Start" onClick={() => handleManualStep("splash")} accent />
            <TestButton label="🔄 Loading" onClick={() => handleManualStep("loading")} />
            <TestButton label="🔍 Match-søking" onClick={() => handleManualStep("match_search")} />
            <TestButton label="🌿 Reise" onClick={() => handleManualStep("journey_update")} />
            <TestButton label="✨ Fullfør" onClick={() => handleManualStep("done")} />
          </div>
        </div>

        {/* LF16: Progress-test */}
        <div>
          <h3 className="text-xs font-medium text-[#4A4A4A]/50 mb-2">
            LF16 — Progress-test (0–100)
          </h3>
          <div className="flex flex-wrap gap-2">
            <TestButton label="0%" onClick={() => handleProgressSim(0)} />
            <TestButton label="25%" onClick={() => handleProgressSim(25)} />
            <TestButton label="50%" onClick={() => handleProgressSim(50)} />
            <TestButton label="75%" onClick={() => handleProgressSim(75)} />
            <TestButton label="100%" onClick={() => handleProgressSim(100)} />
          </div>
        </div>

        {/* Melding-test */}
        <div>
          <h3 className="text-xs font-medium text-[#4A4A4A]/50 mb-2">
            Melding-test
          </h3>
          <div className="flex flex-wrap gap-2">
            <TestButton
              label="💬 'Klar...'"
              onClick={() => handleSetMessage("Klar...")}
            />
            <TestButton
              label="💬 'Lurer...'"
              onClick={() => handleSetMessage("Lurer...")}
            />
            <TestButton
              label="💬 'Ferdig!'"
              onClick={() => handleSetMessage("Ferdig!")}
            />
          </div>
        </div>

        {/* LF17: Integrasjon med NavigationShell */}
        <div>
          <h3 className="text-xs font-medium text-[#4A4A4A]/50 mb-2">
            LF17 — Integrasjon med NavigationShell
          </h3>
          <div className="bg-white/80 rounded-xl p-4 text-xs space-y-1 text-[#4A4A4A]/60">
            <p>
              Når LaunchFlow er ferdig (step = "done"), kallar han{" "}
              <code className="bg-[#f1f5f9] px-1 rounded">onLaunchComplete</code> med:
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>
                Hvis onboarding ikke completed → <code className="bg-[#f1f5f9] px-1 rounded">goTo("onboarding")</code>
              </li>
              <li>
                Hvis onboarding completed → <code className="bg-[#f1f5f9] px-1 rounded">goTo("dashboard")</code>
              </li>
            </ul>
            <p className="mt-2 text-[#4A4A4A]/40">
              (Demo viser alert; i produksjon: kopla til NavigationShell sin nav-funksjon)
            </p>
          </div>
        </div>

        {/* LF18-19: Design-bekreftelse */}
        <div>
          <h3 className="text-xs font-medium text-[#4A4A4A]/50 mb-2">
            LF18–LF19 — Design-bekreftelse
          </h3>
          <div className="bg-white/80 rounded-xl p-4 text-xs text-[#4A4A4A]/60 space-y-1">
            <p>✅ LF18: Blå/grønne ro-tonar (gradient: blue-50 → emerald-50)</p>
            <p>✅ LF19: Samme font/farge som appen (#4A4A4A, rounded-xl, clean)</p>
            <p>✅ LF15: Fade-in mellom skjermar (0.4s ease-out)</p>
            <p>✅ LF15: Pulse på match-search (🔍 ping 2s infinite)</p>
          </div>
        </div>

        {/* LF14: Live state-logging */}
        <div>
          <h3 className="text-xs font-medium text-[#4A4A4A]/50 mb-2">
            LF14 — Live state-log
          </h3>
          <details className="bg-white/80 rounded-xl p-4 text-xs font-mono">
            <summary className="cursor-pointer text-[#4A4A4A]/50 hover:text-[#4A4A4A]/70">
              📋 current state
            </summary>
            <pre className="mt-2 text-[#4A4A4A]/60 whitespace-pre-wrap break-all">
              {JSON.stringify(
                {
                  step: state.currentStep,
                  stepLabel: stepLabels[state.currentStep],
                  progress: state.progress,
                  message: state.message || "(tom)",
                },
                null,
                2
              )}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
