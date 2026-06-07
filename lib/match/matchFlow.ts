// ToSom MatchFlow-API – match-tilstandsovergangar
// Ingen sideeffektar, ingen Date.now, ingen IO.
// TODO: Kople til backend for faktisk match-logikk.
// TODO: Her skal vi bruke ekte tidsstempel for 48-timars vindauket.

export type MatchState =
  | "idle"
  | "ready_for_match"
  | "searching"
  | "matched"
  | "in_journey"
  | "completed";

export interface MatchContext {
  userId: string;
  currentMatchId?: string;
  currentMatchState: MatchState;
  searchStartedAt?: string;
  matchStartedAt?: string;
  journeyEndsAt?: string;
}

// Initial kontekst for ein ny brukar
function createInitialContext(userId: string): MatchContext {
  return {
    userId,
    currentMatchState: "idle",
  };
}

// MF5 — requestMatch: brukar trykker "Ferdig – søk match"
function requestMatch(ctx: MatchContext): MatchContext {
  // TODO: Her skal vi kople til faktisk backend-status for match.
  return {
    ...ctx,
    currentMatchState: "ready_for_match",
  };
}

// MF6 — startSearchWindow: systemet starter 48-timars søk
function startSearchWindow(ctx: MatchContext): MatchContext {
  // TODO: Her skal vi bruke ekte tidsstempel for 48-timars vindauket.
  return {
    ...ctx,
    currentMatchState: "searching",
    searchStartedAt: "2025-01-01T00:00:00Z", // placeholder
  };
}

// MF7 — startMatch: ein match er funnen
function startMatch(ctx: MatchContext): MatchContext {
  // TODO: currentMatchId skal komme frå backend.
  return {
    ...ctx,
    currentMatchState: "matched",
    currentMatchId: "dummy-match-001",
    matchStartedAt: "2025-01-02T00:00:00Z", // placeholder
  };
}

// MF8 — startJourney: begge har akseptert match
function startJourney(ctx: MatchContext): MatchContext {
  // TODO: journeyEndsAt skal bereknast frå matchStartedAt + 30 dagar.
  return {
    ...ctx,
    currentMatchState: "in_journey",
    journeyEndsAt: "2025-01-31T00:00:00Z", // placeholder
  };
}

// MF9 — completeJourney: 30 dagar er over
function completeJourney(ctx: MatchContext): MatchContext {
  return {
    ...ctx,
    currentMatchState: "completed",
    currentMatchId: undefined,
    journeyEndsAt: undefined,
  };
}

// Hjelpefunksjonar for visning

export const matchFlowAPI = {
  createInitialContext,
  requestMatch,
  startSearchWindow,
  startMatch,
  startJourney,
  completeJourney,

  // Visningshjelpear: tekst til kvar tilstand
  getMatchStateLabel(state: MatchState): string {
    const labels: Record<MatchState, string> = {
      idle: "Ikkje starta",
      ready_for_match: "Klar for match",
      searching: "Leitar etter ein match",
      matched: "Du har ein match!",
      in_journey: "Du er i ei 30-dagars reise",
      completed: "Reisa er ferdig – du kan starte ein ny match",
    };
    return labels[state];
  },

  getMatchStateDescription(state: MatchState): string {
    const descs: Record<MatchState, string> = {
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
    return descs[state];
  },

  canStartMatch(state: MatchState): boolean {
    return state === "idle" || state === "completed";
  },
};
