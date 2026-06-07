"use client";

import { matchFlowAPI, type MatchState } from "../../lib/match/matchFlow";

/** MatchFlowPreview – viser kva fase brukaren er i
 *  TODO: Her skal vi kople til faktisk backend-status for match.
 *  TODO: Her skal vi bruke ekte tidsstempel for 48-timars vindauket. */

const stateLabels: Record<MatchState, string> = {
  idle: "Ikkje starta",
  ready_for_match: "Klar for match",
  searching: "Leitar etter ein match",
  matched: "Du har ein match!",
  in_journey: "I ei 30-dagars reise",
  completed: "Reisa er ferdig",
};

const stateDescriptions: Record<MatchState, string> = {
  idle: "Du har ikkje starta matchprosessen ennå.",
  ready_for_match:
    "Finn match når du er klar. Du kan trykke knappen for å starte.",
  searching:
    "Vi leitar etter ein match til deg. Dette tek typisk opptil 48 timar.",
  matched: "Gratulerer! Du har fått ein match. Aksepter for å starte reisa.",
  in_journey:
    "Du er i ein 30-dagars reise med din match. Når den er over kan du starte på nytt.",
  completed:
    "Denne matchen er ferdig. Du kan starte ein ny reise når du er klar.",
};

export default function MatchFlowPreview({
  matchState,
}: {
  matchState?: MatchState;
}) {
  // MF34 — Dummy-kontekst (hardt kodda for no)
  // TODO: Denne skal komme frå backend seinare.
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
        Systemmelding: Når du trykkjer “Finn match”, startar vi eit 48-timars
        vindauge der vi finn éin person til deg.
      </p>
    </div>
  );
}
