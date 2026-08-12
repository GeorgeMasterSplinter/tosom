// ═══════════════════════════════════════════
// ToSom — Journey Engine Unit Tests
// ═══════════════════════════════════════════
// Tests for phase transitions, photo lock, journey active/completed
//

import {
  getPhaseForDay,
  isPhotosAllowed,
  isJourneyActive,
  isJourneyCompleted,
  getThemeForDay,
  JOURNEY_TOTAL_DAYS,
} from '@/lib/journey/engine';
import { JourneyPhase } from '@prisma/client';
import { MATCH_DELAY_HOURS } from '@/config/matching';
import { MATCH_WEIGHTS } from '@/config/matching';

describe('Journey Engine', () => {
  // ── Faseoverganger (dag 14→15, 21→22, 25→26) ──

  describe('getPhaseForDay', () => {
    test('EARLY: dag 1 skal være EARLY', () => {
      expect(getPhaseForDay(1).phase).toBe(JourneyPhase.EARLY);
    });

    test('EARLY: dag 14 skal være EARLY (siste dag i fase 1)', () => {
      expect(getPhaseForDay(14).phase).toBe(JourneyPhase.EARLY);
    });

    test('BUILDING_TRUST: dag 15 skal være BUILDING_TRUST (første dag i fase 2)', () => {
      expect(getPhaseForDay(15).phase).toBe(JourneyPhase.BUILDING_TRUST);
    });

    test('BUILDING_TRUST: dag 21 skal være BUILDING_TRUST', () => {
      expect(getPhaseForDay(21).phase).toBe(JourneyPhase.BUILDING_TRUST);
    });

    test('DEEPER: dag 22 skal være DEEPER (første dag i fase 3)', () => {
      expect(getPhaseForDay(22).phase).toBe(JourneyPhase.DEEPER);
    });

    test('DEEPER: dag 25 skal være DEEPER', () => {
      expect(getPhaseForDay(25).phase).toBe(JourneyPhase.DEEPER);
    });

    test('CHECKIN: dag 26 skal være CHECKIN (første dag i fase 4)', () => {
      expect(getPhaseForDay(26).phase).toBe(JourneyPhase.CHECKIN);
    });

    test('CHECKIN: dag 30 skal være CHECKIN (siste dag)', () => {
      expect(getPhaseForDay(30).phase).toBe(JourneyPhase.CHECKIN);
    });

    test('Ukjent dag > 30 skal falle tilbake til CHECKIN', () => {
      expect(getPhaseForDay(31).phase).toBe(JourneyPhase.CHECKIN);
    });
  });

  // ── Bildesperre (før dag 14) ──

  describe('isPhotosAllowed', () => {
    test('dag 1: bilder IKKE tillatt', () => {
      expect(isPhotosAllowed(1)).toBe(false);
    });

    test('dag 14: bilder IKKE tillatt (siste dag i EARLY)', () => {
      expect(isPhotosAllowed(14)).toBe(false);
    });

    test('dag 15: bilder tillatt (første dag BUILDING_TRUST)', () => {
      expect(isPhotosAllowed(15)).toBe(true);
    });

    test('dag 30: bilder tillatt', () => {
      expect(isPhotosAllowed(30)).toBe(true);
    });
  });

  // ── Journey Active/Completed ──

  describe('isJourneyActive / isJourneyCompleted', () => {
    test('dag 1: aktiv, ikke fullført', () => {
      expect(isJourneyActive(1)).toBe(true);
      expect(isJourneyCompleted(1)).toBe(false);
    });

    test('dag 30: aktiv, ikke fullført', () => {
      expect(isJourneyActive(30)).toBe(true);
      expect(isJourneyCompleted(30)).toBe(false);
    });

    test('dag 31: IKKE aktiv, fullført', () => {
      expect(isJourneyActive(31)).toBe(false);
      expect(isJourneyCompleted(31)).toBe(true);
    });

    test('dag 0: IKKE aktiv', () => {
      expect(isJourneyActive(0)).toBe(false);
    });
  });

  // ── JOURNEY_TOTAL_DAYS ──

  describe('JOURNEY_TOTAL_DAYS', () => {
    test('skal være 30 dager', () => {
      expect(JOURNEY_TOTAL_DAYS).toBe(30);
    });
  });

  // ── Theme ranges ──

  describe('getThemeForDay', () => {
    test('dag 1: intro', () => {
      expect(getThemeForDay(1)).toBe('intro');
    });

    test('dag 6: trygghet', () => {
      expect(getThemeForDay(6)).toBe('trygghet');
    });

    test('dag 13: fordydning', () => {
      expect(getThemeForDay(13)).toBe('fordypning');
    });

    test('dag 21: modning', () => {
      expect(getThemeForDay(21)).toBe('modning');
    });

    test('dag 27: integrasjon', () => {
      expect(getThemeForDay(27)).toBe('integrasjon');
    });
  });
});

// ── Matching Weights ──

describe('Matching Weights', () => {
  test('base vekt skal være 0.35', () => {
    expect(MATCH_WEIGHTS.base).toBe(0.35);
  });

  test('resonance vekt skal være 0.25', () => {
    expect(MATCH_WEIGHTS.resonance).toBe(0.25);
  });

  test('semantic vekt skal være 0.20', () => {
    expect(MATCH_WEIGHTS.semantic).toBe(0.20);
  });

  test('intimacy vekt skal være 0.10', () => {
    expect(MATCH_WEIGHTS.intimacy).toBe(0.10);
  });

  test('future vekt skal være 0.10', () => {
    expect(MATCH_WEIGHTS.future).toBe(0.10);
  });

  test('summen av alle vekter skal være 1.0', () => {
    const total =
      MATCH_WEIGHTS.base +
      MATCH_WEIGHTS.resonance +
      MATCH_WEIGHTS.semantic +
      MATCH_WEIGHTS.intimacy +
      MATCH_WEIGHTS.future;
    expect(total).toBeCloseTo(1.0, 5);
  });
});

// ── 24-timersregelen ──

describe('24-hour Match Delay Rule', () => {
  test('MATCH_DELAY_HOURS skal være 24', () => {
    expect(MATCH_DELAY_HOURS).toBe(24);
  });
});