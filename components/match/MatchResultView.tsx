"use client";

import { systemMessagesAPI } from "../../lib/system/systemMessages";
import type { MatchState } from "@/lib/journey/engine";

interface MatchResultViewProps {
  matchState: MatchState;
  onStartJourney?: () => void;
  onClose?: () => void;
}

const matchEmoji = "💫";

const MatchResultView = ({
  matchState,
  onStartJourney,
  onClose,
}: MatchResultViewProps) => {
  const systemMsg = systemMessagesAPI.getMessageForEvent("match_found");
  const showStartButton = matchState === "matched";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="text-5xl">{matchEmoji}</div>
          <h2 className="text-xl font-medium text-[#4A4A4A]">
            Du har fått en match
          </h2>
          <p className="text-sm text-[#4A4A4A]/60">
            Ta deres tid. Reisen starter når dere begge er klare.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#4A4A4A]/[0.03] rounded-xl p-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200/60 to-emerald-200/60 flex items-center justify-center text-lg font-medium text-[#4A4A4A]/80">
            P
          </div>
          <div>
            <p className="text-sm font-medium text-[#4A4A4A]">Person A</p>
            <p className="text-xs text-[#4A4A4A]/50">
              Dere er matchet basert på verdier og relasjonsstil.
            </p>
          </div>
        </div>

        <div className="bg-blue-50/60 border border-blue-100/50 rounded-xl px-4 py-3">
          <p className="text-xs text-blue-800/80">
            <span className="font-medium">{systemMsg.title}</span>{" "}
            {systemMsg.body}
          </p>
        </div>

        {showStartButton && (
          <button
            onClick={onStartJourney}
            className="w-full py-3 text-sm rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors font-medium"
          >
            Start reisen
          </button>
        )}

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