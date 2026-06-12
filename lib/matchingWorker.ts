/* ------ In-memory matching worker ------ */

interface PendingMatch {
  startTime: number;
  resolved: boolean;
  matchId: string | null;
}

const pendingMatches = new Map<string, PendingMatch>();

/* ------ Hjelpefunksjon: generer fake matchId ------ */

function generateFakeMatchId(): string {
  return `match-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

/* ------ Start matching-prosess for ein brukar ------ */

export function startMatching(userId: string): void {
  // Allereie i kø eller ferdig? Avvis double-start
  if (pendingMatches.has(userId)) return;

  pendingMatches.set(userId, {
    startTime: Date.now(),
    resolved: false,
    matchId: null,
  });

  // Random timer mellom 5 og 10 sekund
  const delay = 5000 + Math.random() * 5000;

  setTimeout(() => {
    const match = pendingMatches.get(userId);
    if (!match || match.resolved) return;

    // Sett status til "matched"
    match.resolved = true;
    match.matchId = generateFakeMatchId();
  }, delay);
}

/* ------ Sjekk matching-status for ein brukar ------ */

export function getMatchingStatus(userId: string): {
  status: "pending" | "matched" | "no_match";
  matchId: string | null;
  updatedAt: string;
} {
  const match = pendingMatches.get(userId);

  if (match) {
    if (match.resolved) {
      return {
        status: "matched",
        matchId: match.matchId,
        updatedAt: new Date().toISOString(),
      };
    }
    return {
      status: "pending",
      matchId: null,
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    status: "no_match",
    matchId: null,
    updatedAt: new Date().toISOString(),
  };
}

/* ------ Hentar alle aktive pending-matchingar (for test/debug) ------ */

export function getPendingCount(): number {
  let count = 0;
  pendingMatches.forEach((m) => {
    if (!m.resolved) count++;
  });
  return count;
}
