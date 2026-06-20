// ToSom MatchFlow-API – match-tilstandsovergangar
// Ingen sideeffektar, ingen Date.now, ingen IO.

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

function createInitialContext(userId: string): MatchContext {
  return {
    userId,
    currentMatchState: "idle",
  };
}

function requestMatch(ctx: MatchContext): MatchContext {
  return {
    ...ctx,
    currentMatchState: "ready_for_match",
  };
}

function startSearchWindow(ctx: MatchContext): MatchContext {
  return {
    ...ctx,
    currentMatchState: "searching",
    searchStartedAt: "2025-01-01T00:00:00Z",
  };
}

function startMatch(ctx: MatchContext): MatchContext {
  return {
    ...ctx,
    currentMatchState: "matched",
    currentMatchId: "dummy-match-001",
    matchStartedAt: "2025-01-02T00:00:00Z",
  };
}

function startJourney(ctx: MatchContext): MatchContext {
  return {
    ...ctx,
    currentMatchState: "in_journey",
    journeyEndsAt: "2025-01-31T00:00:00Z",
  };
}

function completeJourney(ctx: MatchContext): MatchContext {
  return {
    ...ctx,
    currentMatchState: "completed",
    currentMatchId: undefined,
    journeyEndsAt: undefined,
  };
}

export const matchFlowAPI = {
  createInitialContext,
  requestMatch,
  startSearchWindow,
  startMatch,
  startJourney,
  completeJourney,

  getMatchStateLabel(state: MatchState): string {
    const labels: Record<MatchState, string> = {
      idle: "Ikke startet",
      ready_for_match: "Klar for match",
      searching: "Leter etter en match",
      matched: "Du har en match!",
      in_journey: "Du er i en 30-dagers reise",
      completed: "Reisen er ferdig – du kan starte en ny match",
    };
    return labels[state];
  },

  getMatchStateDescription(state: MatchState): string {
    const descs: Record<MatchState, string> = {
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
    return descs[state];
  },

  canStartMatch(state: MatchState): boolean {
    return state === "idle" || state === "completed";
  },
};
