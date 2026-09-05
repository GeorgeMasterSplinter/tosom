/**
 * Stein-Saks-Papir — ren spillmotor uten database og uten nettverk.
 *
 * Samtidig spill: begge spilleren velger, så serveren avgjør.
 * Ingen tur-begrep — begge kan sende sitt valg i hvilken som helst rekkefølge.
 */

/** Tilgjengelige valg. */
export type RPSChoice = 'rock' | 'paper' | 'scissors';

/** Hvem spiller. */
export type RPSPlayer = 'A' | 'B';

/** Spilltilstand — lagres som Json i GameSession.state. */
export interface RPSState {
  choiceA: RPSChoice | null;
  choiceB: RPSChoice | null;
  winner: RPSPlayer | 'draw' | null;
}

/**
 * Oppretter et nytt RPS-spill. Begge må velge før resultat.
 */
export function createGame(): RPSState {
  return {
    choiceA: null,
    choiceB: null,
    winner: null,
  };
}

/**
 * Sender et valg for en av spillerene.
 *
 * Når begge har sendt sitt valg, løses spillet automatisk.
 * Kaster på ugyldig inndata.
 *
 * @param state    Gjeldende tilstand
 * @param player   Hvem som sender valget
 * @param choice   Valget
 * @returns Ny tilstand (immutable)
 *
 * @throws Error «Spillet er over» | «Du har allerede valgt» | «Ugyldig valg»
 */
export function submitChoice(
  state: RPSState,
  player: RPSPlayer,
  choice: RPSChoice,
): RPSState {
  if (state.winner !== null) {
    throw new Error('Spillet er over');
  }
  if (!['rock', 'paper', 'scissors'].includes(choice)) {
    throw new Error('Ugyldig valg');
  }

  let choiceA = state.choiceA;
  let choiceB = state.choiceB;

  if (player === 'A') {
    if (choiceA !== null) {
      throw new Error('Du har allerede valgt');
    }
    choiceA = choice;
  } else {
    if (choiceB !== null) {
      throw new Error('Du har allerede valgt');
    }
    choiceB = choice;
  }

  // Løs når begge har sendt
  let winner: RPSPlayer | 'draw' | null = null;
  if (choiceA !== null && choiceB !== null) {
    const result = resolve(choiceA, choiceB);
    if (result === 'draw') {
      // Liké: reset — ny runde, spillet fortsetter
      return { choiceA: null, choiceB: null, winner: null };
    }
    winner = result;
  }

  return { choiceA, choiceB, winner };
}

/**
 * Avgjør vinneren basert på klassiske regler.
 * rock > scissors, scissors > paper, paper > rock.
 */
function resolve(a: RPSChoice, b: RPSChoice): RPSPlayer | 'draw' {
  if (a === b) return 'draw';
  if (a === 'rock' && b === 'scissors') return 'A';
  if (a === 'scissors' && b === 'paper') return 'A';
  if (a === 'paper' && b === 'rock') return 'A';
  return 'B';
}

/** Er spillet ferdig? */
export function isComplete(state: RPSState): boolean {
  return state.winner !== null;
}

/** Er begge valgene sendt, men ikke løst ennå? (Burde ikke forekomme.) */
export function isPendingReveal(state: RPSState): boolean {
  return state.choiceA !== null && state.choiceB !== null && state.winner === null;
}