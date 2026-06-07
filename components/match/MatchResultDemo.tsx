"use client";

/** MatchResultDemo — test MatchResultView utan dashboard
 *  MR11 — opprett demo-komponent
 *  MR12 — dummy matchContext
 *  MR13 — koble systemmeldinger
 *  MR14–MR15 — callbacks
 *  MR16 — knapp for å åpne/lukke modal
 *  MR17 — knapp for å simulere matchState-endring
 *  MR18 — fallback-visning
 *  MR19 — konsistent språk (bokmål, varmt, rolig, kort)
 *  MR20 — ferdigstilling */

import { useState } from "react";
import MatchResultView from "./MatchResultView";
import type { MatchState } from "../../lib/journey/journeyStateEngine";

/* MR12 — Dummy matchState (starter som "matched") */
type DemoState = "matched" | "in_journey" | null;

export default function MatchResultDemo() {
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<DemoState>("matched");

  /* MR14 — onStartJourney */
  const handleStart = () => {
    console.log("Start journey");
    setState("in_journey");
  };

  /* MR15 — onClose */
  const handleClose = () => {
    console.log("Close match result");
    setVisible(false);
  };

  return (
    <div className="max-w-md mx-auto p-8">
      {/* MR16 — Åpne/lukk modal */}
      <button
        onClick={() => setVisible((v) => !v)}
        className="px-4 py-2 text-sm rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
      >
        {visible ? "Skjul matchresultat" : "Vis matchresultat"}
      </button>

      {/* MR17 — MatchState-bytte */}
      {visible && (
        <div className="mt-4 bg-white/60 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <p className="text-xs font-medium text-[#4A4A4A]">Demo-kontroll</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setState("matched")}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
            >
              Matched
            </button>
            <button
              onClick={() => setState("in_journey")}
              className="text-xs px-3 py-1.5 rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
            >
              In journey
            </button>
          </div>
        </div>
      )}

      {/* MR18 — Fallback-visning */}
      {visible && state === null && (
        <p className="mt-4 text-center text-sm text-[#4A4A4A]/50">
          Ingen aktiv match.
        </p>
      )}

      {/* MR13 + MR16 — MatchResultView */}
      {visible && state && state !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <MatchResultView
            matchState={state as MatchState}
            onStartJourney={handleStart}
            onClose={handleClose}
          />
        </div>
      )}
    </div>
  );
}
