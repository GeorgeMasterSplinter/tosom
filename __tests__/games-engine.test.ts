/**
 * Spillmotorer — enhetstester for Tic-Tac-Toe og Stein-Saks-Papir.
 *
 * Dekk: gyldige og ugyldige trekk, alle vinnerlinjer, uavgjort,
 * trekk utenfor tur, trekk etter at spillet er ferdig.
 */

import {
  createGame,
  makeMove,
  isGameOver,
  getWinningLine,
  type TTTState,
  type TTPlayer,
} from '@/lib/games/ticTacToe';
import {
  createGame as createRPS,
  submitChoice,
  isComplete,
  type RPSChoice,
  type RPSPlayer,
} from '@/lib/games/rps';

// ═══════════════════════════════════════════
// TIC-TAC-TOE
// ═══════════════════════════════════════════

describe('Tic-Tac-Toe motor', () => {
  describe('createGame', () => {
    it('starter med tomt brett og spiller A sin tur', () => {
      const state = createGame();
      expect(state.board).toHaveLength(9);
      expect(state.board.every((c) => c === null)).toBe(true);
      expect(state.turn).toBe('A');
      expect(state.winner).toBeNull();
    });

    it('kan starte med spiller B', () => {
      const state = createGame('B');
      expect(state.turn).toBe('B');
    });
  });

  describe('makeMove — gyldige trekk', () => {
    it('spiller A plasserer X', () => {
      const state = createGame();
      const next = makeMove(state, 4, 'A');
      expect(next.board[4]).toBe('X');
      expect(next.turn).toBe('B');
    });

    it('spiller B plasserer O', () => {
      const state = createGame();
      const afterA = makeMove(state, 0, 'A');
      const afterB = makeMove(afterA, 8, 'B');
      expect(afterB.board[8]).toBe('O');
      expect(afterB.turn).toBe('A');
    });
  });

  describe('makeMove — alle 8 vinnerlinjer', () => {
    const scenarios: { moves: [number, TTPlayer][]; winner: TTPlayer }[] = [
      { moves: [[0,'A'],[3,'B'],[1,'A'],[4,'B'],[2,'A']], winner: 'A' },
      { moves: [[3,'A'],[0,'B'],[4,'A'],[1,'B'],[5,'A']], winner: 'A' },
      { moves: [[6,'A'],[0,'B'],[7,'A'],[1,'B'],[8,'A']], winner: 'A' },
      { moves: [[0,'A'],[1,'B'],[3,'A'],[4,'B'],[6,'A']], winner: 'A' },
      { moves: [[1,'A'],[0,'B'],[4,'A'],[3,'B'],[7,'A']], winner: 'A' },
      { moves: [[2,'A'],[0,'B'],[5,'A'],[1,'B'],[8,'A']], winner: 'A' },
      { moves: [[0,'A'],[1,'B'],[4,'A'],[3,'B'],[8,'A']], winner: 'A' },
      { moves: [[2,'A'],[0,'B'],[4,'A'],[1,'B'],[6,'A']], winner: 'A' },
    ];

    for (const [i, { moves, winner }] of scenarios.entries()) {
      it(`vinnerlinje ${i + 1}`, () => {
        let state = createGame();
        for (const [cell, player] of moves) {
          state = makeMove(state, cell, player);
        }
        expect(state.winner).toBe(winner);
        expect(isGameOver(state)).toBe(true);
      });
    }
  });

  describe('makeMove — uavgjort', () => {
    it('alle celler opptatt uten vinnerlinje = draw', () => {
      let state = createGame();
      const moves: [number, TTPlayer][] = [
        [0,'A'],[1,'B'],[4,'A'],
        [3,'B'],[6,'A'],[2,'B'],
        [7,'A'],[8,'B'],[5,'A'],
      ];
      for (const [cell, player] of moves) {
        state = makeMove(state, cell, player);
      }
      expect(state.winner).toBe('draw');
      expect(isGameOver(state)).toBe(true);
    });
  });

  describe('makeMove — ugyldige trekk', () => {
    it('kaster på opptatt celle', () => {
      const state = createGame();
      const after = makeMove(state, 4, 'A');
      expect(() => makeMove(after, 4, 'B')).toThrow('Celle er opptatt');
    });

    it('kaster på feil tur', () => {
      const state = createGame();
      expect(() => makeMove(state, 0, 'B')).toThrow('Ikke din tur');
    });

    it('kaster på ugyldig celleindeks', () => {
      const state = createGame();
      expect(() => makeMove(state, 9, 'A')).toThrow('Ugyldig celle');
      expect(() => makeMove(state, -1, 'A')).toThrow('Ugyldig celle');
    });

    it('kaster etter spillet er over', () => {
      let state = createGame();
      state = makeMove(state, 0, 'A');
      state = makeMove(state, 3, 'B');
      state = makeMove(state, 1, 'A');
      state = makeMove(state, 4, 'B');
      state = makeMove(state, 2, 'A');
      expect(state.winner).toBe('A');
      expect(() => makeMove(state, 5, 'B')).toThrow('Spillet er over');
    });
  });

  describe('getWinningLine', () => {
    it('returnerer null før spillet er over', () => {
      const state = createGame();
      expect(getWinningLine(state)).toBeNull();
    });

    it('returnerer vinnerlinjen', () => {
      let state = createGame();
      state = makeMove(state, 0, 'A');
      state = makeMove(state, 3, 'B');
      state = makeMove(state, 1, 'A');
      state = makeMove(state, 4, 'B');
      state = makeMove(state, 2, 'A');
      expect(getWinningLine(state)).toEqual([0, 1, 2]);
    });

    it('returnerer null ved uavgjort', () => {
      let state = createGame();
      const moves: [number, TTPlayer][] = [
        [0,'A'],[1,'B'],[4,'A'],
        [3,'B'],[6,'A'],[2,'B'],
        [7,'A'],[8,'B'],[5,'A'],
      ];
      for (const [cell, player] of moves) {
        state = makeMove(state, cell, player);
      }
      expect(getWinningLine(state)).toBeNull();
    });
  });

  describe('immutability', () => {
    it('makeMove endrer ikke original state', () => {
      const state = createGame();
      const original = JSON.parse(JSON.stringify(state));
      makeMove(state, 4, 'A');
      expect(state).toEqual(original);
    });
  });
});
// ═══════════════════════════════════════════
// STEIN-SAKS-PAPIR
// ═══════════════════════════════════════════

describe('Stein-Saks-Papir motor', () => {
  describe('createGame', () => {
    it('starter med ingen valg og ingen vinner', () => {
      const state = createRPS();
      expect(state.choiceA).toBeNull();
      expect(state.choiceB).toBeNull();
      expect(state.winner).toBeNull();
    });
  });

  describe('submitChoice — alle 9 kombinasjoner', () => {
    const choices: RPSChoice[] = ['rock', 'paper', 'scissors'];
    const expected: Record<string, RPSPlayer | 'draw'> = {
      'rock-rock': 'draw',
      'rock-paper': 'B',
      'rock-scissors': 'A',
      'paper-rock': 'A',
      'paper-paper': 'draw',
      'paper-scissors': 'B',
      'scissors-rock': 'B',
      'scissors-paper': 'A',
      'scissors-scissors': 'draw',
    };

    for (const a of choices) {
      for (const b of choices) {
        it(`${a} vs ${b}`, () => {
          let state = createRPS();
          state = submitChoice(state, 'A', a);
          state = submitChoice(state, 'B', b);
          expect(state.winner).toBe(expected[`${a}-${b}`]);
          expect(isComplete(state)).toBe(true);
        });
      }
    }
  });

  describe('submitChoice — ordrekraftig', () => {
    it('fungerer uavhengig av rekkefølge', () => {
      let state = createRPS();
      state = submitChoice(state, 'B', 'paper');
      expect(state.choiceB).toBe('paper');
      expect(state.winner).toBeNull();
      state = submitChoice(state, 'A', 'rock');
      expect(state.winner).toBe('B');
    });
  });

  describe('submitChoice — ugyldige', () => {
    it('kaster ved dobbelt valg', () => {
      let state = createRPS();
      state = submitChoice(state, 'A', 'rock');
      expect(() => submitChoice(state, 'A', 'paper')).toThrow('Du har allerede valgt');
    });

    it('kaster etter spillet er over', () => {
      let state = createRPS();
      state = submitChoice(state, 'A', 'rock');
      state = submitChoice(state, 'B', 'scissors');
      expect(state.winner).toBe('A');
      expect(() => submitChoice(state, 'A', 'paper')).toThrow('Spillet er over');
    });

    it('kaster på ugyldig valg', () => {
      const state = createRPS();
      expect(() => submitChoice(state, 'A', 'lizard' as any)).toThrow('Ugyldig valg');
    });
  });

  describe('isComplete', () => {
    it('false mens bare én har valgt', () => {
      let state = createRPS();
      state = submitChoice(state, 'A', 'rock');
      expect(isComplete(state)).toBe(false);
    });

    it('true etter begge har valgt', () => {
      let state = createRPS();
      state = submitChoice(state, 'A', 'rock');
      state = submitChoice(state, 'B', 'paper');
      expect(isComplete(state)).toBe(true);
    });
  });

  describe('immutability', () => {
    it('submitChoice endrer ikke original state', () => {
      const state = createRPS();
      const original = JSON.parse(JSON.stringify(state));
      submitChoice(state, 'A', 'rock');
      expect(state).toEqual(original);
    });
  });
});
