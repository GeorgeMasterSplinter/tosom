"use client";

import { matchFlowAPI, type MatchState } from "../../lib/match/matchFlow";

const stateLabels: Record<MatchState, string> = {
  idle: "Ikke startet",
  ready_for_match: "Klar for match",
  searching: "Leter etter en match",
  matched: "Du har fått en match!",
  in_journey: "I en 30-dagers reise",
  completed: "Reisen er ferdig",
};

const stateDescriptions: Record<MatchState, string> = {
  idle: "Du har ikke startet matchprosessen ennå.",
  ready_for_match:
    "Finn match når du er klar. Du kan trykke knappen for å starte.",
  searching:
    "Vi leter etter en match til deg. Dette tar typisk opptil 48 timer.",
  matched: "Gratulerer! Du har fått en match. Aksepter å starte reisen.",
  in_journey:
    "Du er i en 30-dagers reise med din match. Når den er over kan du starte på nytt.",
  completed:
    "Denne matchen er ferdig. Du kan starte en ny reise når du er klar.",
};

export default function MatchFlowPreview({
  matchState,
}: {
  matchState?: MatchState;
}) {
  const state = matchState ?? "in_journey";

  return (
    <div className="bg-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] rounded-xl p-3 space-y-1">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#E7EEF4]" />
        <span className="text-xs font-medium text-[#2F3A45]">
          {stateLabels[state]}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-[#4A4A4A]">
        {stateDescriptions[state]}
      </p>
      <div className="h-px bg-black/5" />
      <p className="text-xs leading-relaxed text-[#4A4A4A]">
        {matchFlowAPI.getMatchStateDescription(state)}
      </p>
      <p className="text-xs text-[#4A4A4A]">
        Systemmelding: Når du trykker Finn match, starter vi et 48-timers
        vindu der vi finner en person til deg.
      </p>
    </div>
  );
}
