"use client";

/** MatchResultView — skjerm når brukar får ein match
 *  MR1 — plassering: components/match/
 *  MR2 — props: matchContext, onStartJourney, onClose
 *  MR3 — layout: overlay, bg-white/80, backdrop-blur, rounded-2xl, shadow-xl, max-w-md, p-8, space-y-6
 *  MR4 — innhold: ikon, tittel, undertekst
 *  MR5 — partner-preview
 *  MR6 — systemmelding frå systemMessagesAPI
 *  MR7 — knapp "Start reisen" (kun synleg når matchState = "matched")
 *  MR8 — knapp "Lukk"
 *  MR9 — rolige fargar: kvit, gråtonar, myk blå/grønn aksent
 *  MR10 — ingen interaktiv logikk */

import { systemMessagesAPI } from "../../lib/system/systemMessages";
import type { MatchState } from "../../lib/journey/journeyStateEngine";

/* -------------- */
/*  MR2 — Props   */
/* -------------- */

interface MatchResultViewProps {
  matchState: MatchState;
  onStartJourney?: () => void;
  onClose?: () => void;
}

/* ---------------------------- */
/*  MR4 — Ikon og fargar       */
/* ---------------------------- */

const matchEmoji = "💫";

const MatchResultView = ({
  matchState,
  onStartJourney,
  onClose,
}: MatchResultViewProps) => {
  /* MR6 — systemmelding for "match_found" */
  const systemMsg = systemMessagesAPI.getMessageForEvent("match_found");

  /* MR10 — Kun visning */
  const showStartButton = matchState === "matched";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* MR4 — Ikon + tittel + undertekst */}
        <div className="text-center space-y-3">
          <div className="text-5xl">{matchEmoji}</div>
          <h2 className="text-xl font-medium text-[#4A4A4A]">
            Du har fått ein match
          </h2>
          <p className="text-sm text-[#4A4A4A]/60">
            Ta dere tid. Reisen startar når de begge er klare.
          </p>
        </div>

        {/* MR5 — Partner-preview */}
        <div className="flex items-center gap-3 bg-[#4A4A4A]/[0.03] rounded-xl p-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200/60 to-emerald-200/60 flex items-center justify-center text-lg font-medium text-[#4A4A4A]/80">
            P
          </div>
          <div>
            <p className="text-sm font-medium text-[#4A4A4A]">Person A</p>
            <p className="text-xs text-[#4A4A4A]/50">
              Dere er matcha basert på verdiar og relasjonsstil.
            </p>
          </div>
        </div>

        {/* MR6 — Systemmelding */}
        <div className="bg-blue-50/60 border border-blue-100/50 rounded-xl px-4 py-3">
          <p className="text-xs text-blue-800/80">
            <span className="font-medium">{systemMsg.title}</span>{" "}
            {systemMsg.body}
          </p>
        </div>

        {/* MR7 — Start-reisen-knapp */}
        {showStartButton && (
          <button
            onClick={onStartJourney}
            className="w-full py-3 text-sm rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors font-medium"
          >
            Start reisen
          </button>
        )}

        {/* MR8 — Lukk-knapp */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-full py-3 text-sm rounded-xl bg-[#4A4A4A]/[0.05] text-[#4A4A4A]/60 hover:bg-[#4A4A4A]/[0.1] transition-colors"
          >
            Lukk
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchResultView;
