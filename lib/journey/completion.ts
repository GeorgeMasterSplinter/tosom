// lib/journey/completion.ts — Bilateral fullføring: deterministisk statmaskin
// (RT1-final: D8 «ACCOUNT != JOURNEY» + D9 «DECISION WINDOW» 72 t)
//
// Rente funksjoner — ingen prisma-/server-avhengigheter — slik at exit-route
// og cron deler nøyaktig samme avgjørelsestabell uten drift.
//
// Avgjørelsestabell (ord-uavhengig / deterministisk):
//   FOUND + FOUND            → MUTUAL      (reisen fullføres, PDF 24 t grace)
//   NEW   + noe bestemt      → NOT_MUTUAL  (reisen avsluttes, ingen PDF)
//   én FOUND + én PENDING    → WAITING     (venter på partneren)
//   PENDING + PENDING        → WAITING
//
// Beslutningsvinduet (produkregel: 72 timer etter dag 14, se
// config/journey.ts): når vinduet er utløpt og matchen fortsatt er aktiv,
// er den eneste umulige-å-gjenoppta tilstanden WAITING:
//   PENDING + PENDING  → NO_ACTION (reise lukket uten gjensidig resultat)
//   FOUND + PENDING    → NO_ACTION (NOT MUTUAL / NO_ACTION-ekvivalent)
//   (MUTUAL/NOT_MUTUAL avgjøres umiddelbart når det andre valget kommer,
//    så de kan ikke stå umuløst i vinduet.)
//
// Hard invariant (D8): JOURNEY END != ACCOUNT DELETION. Ingen av disse
// tilstandene utløser sletting av User-konto. Konto-sletting skjer kun
// gjennom eksplisitte account-deletion/safety/legal-fløyer.

import { COMPLETION_DECISION_WINDOW_MS } from "@/config/journey";

export type CompletionChoice = "PENDING" | "FOUND_EACH_OTHER" | "NEW_JOURNEY";

export type CompletionState = "WAITING" | "MUTUAL" | "NOT_MUTUAL";

/** Deterministisk, ord-uavhengig avgjørelsestabell (D4). */
export function resolveCompletionState(
  a: CompletionChoice,
  b: CompletionChoice,
): CompletionState {
  if (a === "FOUND_EACH_OTHER" && b === "FOUND_EACH_OTHER") return "MUTUAL";
  if (a === "PENDING" || b === "PENDING") return "WAITING";
  return "NOT_MUTUAL";
}

export interface DecisionWindowState {
  /** Er 72-timers-vinduet utløpt (målt fra reisen fullførte dag 14)? */
  expired: boolean;
  /** Nåværende bilateral tilstand. */
  state: CompletionState;
  /**
   * Hva cronen skal gjøre når matchen fortsatt er aktiv: avslutte reisen
   * med dette utfallet — eller null hvis ingenting skal gjøres (vinduet
   * er åpent, eller resultatet allerede er avgjort).
   *
   * Alltid 'no_action': reisen lukkes uten gjensidig resultat — D8:
   * JOURNEY DATA slettes, USER ACCOUNT / PROFILE / ONBOARDING beholdes.
   */
  cronOutcome: "no_action" | null;
}

/**
 * Vinduetilstand for en match som har fullført dag 14
 * (journeyProgress.endedAt = tidspunktet dag 14 ble fullført).
 */
export function decisionWindowState(
  day14At: Date,
  now: Date,
  completionA: CompletionChoice,
  completionB: CompletionChoice,
): DecisionWindowState {
  const state = resolveCompletionState(completionA, completionB);
  const expired =
    now.getTime() - day14At.getTime() >= COMPLETION_DECISION_WINDOW_MS;
  if (!expired) return { expired: false, state, cronOutcome: null };
  return {
    expired: true,
    state,
    cronOutcome: state === "WAITING" ? "no_action" : null,
  };
}