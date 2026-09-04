/**
 * Tic-Tac-Toe — ren spillmotor uten database og uten nettverk.
 *
 * ToSom: lavterskel minspill som isbrytere. Ingen poeng, ingen serier.
 * Serveren er alltid fasit — klienten sender kun trekk, aldri tilstand.
 */

/** Cellenhet: X (spiller A), O (spiller B), eller tom. */
export type TTTCell = 'X' | 'O' | null;

/** Brett: 9 celler, indekser 0–8 (venstre-til-høyre, topp-til-bunn). */
export type TTBoard = TTTCell[];

/** Hvem spiller. */
export type TTPlayer = 'A' | 'B';

/** Spilltilstand — lagres som Json i GameSession.state. */
export interface TTTState {
  board: TTBoard;
  turn: TTPlayer;
  winner: TTPlayer | 'draw' | null;
}

/** Vinnerlinjer: 3 rader, 3 kolonner, 2 diagonaler. */
const WIN_LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Oppretter et nytt spill. Spiller A starter alltid (X).
 */
export function createGame(startPlayer: TTPlayer = 'A'): TTTState {
  return {
    board: Array(9).fill(null),
    turn: startPlayer,
    winner: null,
  };
}

/**
 * Utfører et trekk. Kaster på ugyldig trekk.
 *
 * @param state  Gjeldende tilstand (må ikke være slutt)
 * @param cell   Celleindeks 0–8
 * @param player Hvem som spiller (må matche state.turn)
 * @returns Ny tilstand (immutable — endrer ikke innngangen)
 *
 * @throws Error «Spillet er over» | «Ikke din tur» | «Celle er opptatt» | «Ugyldig celle»
 */
export function makeMove(
  state: TTTState,
  cell: number,
  player: TTPlayer,
): TTTState {
  if (state.winner !== null) {
    throw new Error('Spillet er over');
  }
  if (state.turn !== player) {
    throw new Error('Ikke din tur');
  }
  if (cell < 0 || cell > 8) {
    throw new Error('Ugyldig celle');
  }
  if (state.board[cell] !== null) {
    throw new Error('Celle er opptatt');
  }

  const mark: TTTCell = player === 'A' ? 'X' : 'O';
  const board = [...state.board];
  board[cell] = mark;

  // Sjekk vinner
  let winner: TTPlayer | 'draw' | null = null;
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a] === 'X' ? 'A' : 'B';
      break;
    }
  }

  // Sjekk uavgjort (alle celler opptatt, ingen vinner)
  if (winner === null && board.every((cell) => cell !== null)) {
    winner = 'draw';
  }

  return {
    board,
    turn: winner !== null ? state.turn : player === 'A' ? 'B' : 'A',
    winner,
  };
}

/** Er spillet ferdig? */
export function isGameOver(state: TTTState): boolean {
  return state.winner !== null;
}

/** Hvilken vinnerlinje er det? (For UI-markering) */
export function getWinningLine(state: TTTState): [number, number, number] | null {
  if (state.winner === null || state.winner === 'draw') return null;
  const mark = state.winner === 'A' ? 'X' : 'O';
  for (const [a, b, c] of WIN_LINES) {
    if (state.board[a] === mark && state.board[b] === mark && state.board[c] === mark) {
      return [a, b, c];
    }
  }
  return null;
}