// ═══════════════════════════════════════════
// ToSom — Journey Engine Unit Tests
// ═══════════════════════════════════════════
// Tests for phase transitions, photo lock, journey active/completed
//

import {
  getPhaseForDay,
  dayToPhase,
  isPhotosAllowed,
  isJourneyActive,
  isJourneyCompleted,
  getThemeForDay,
  JOURNEY_TOTAL_DAYS,
} from '@/lib/journey/engine';
import { JourneyPhase } from '@prisma/client';
import { MATCH_DELAY_HOURS } from '@/config/matching';
import { DIMENSION_WEIGHTS } from '@/lib/matching/unifiedScorer';

describe('Journey Engine', () => {
  // ── Faseoverganger (dag 7→8, 10→11, 12→13) ──

  describe('getPhaseForDay', () => {
    test('EARLY: dag 1 skal være EARLY', () => {
      expect(getPhaseForDay(1).phase).toBe(JourneyPhase.EARLY);
    });

    test('EARLY: dag 7 skal være EARLY (siste dag i fase 1)', () => {
      expect(getPhaseForDay(7).phase).toBe(JourneyPhase.EARLY);
    });

    test('BUILDING_TRUST: dag 8 skal være BUILDING_TRUST (første dag i fase 2)', () => {
      expect(getPhaseForDay(8).phase).toBe(JourneyPhase.BUILDING_TRUST);
    });

    test('BUILDING_TRUST: dag 10 skal være BUILDING_TRUST', () => {
      expect(getPhaseForDay(10).phase).toBe(JourneyPhase.BUILDING_TRUST);
    });

    test('DEEPER: dag 11 skal være DEEPER (første dag i fase 3)', () => {
      expect(getPhaseForDay(11).phase).toBe(JourneyPhase.DEEPER);
    });

    test('DEEPER: dag 12 skal være DEEPER', () => {
      expect(getPhaseForDay(12).phase).toBe(JourneyPhase.DEEPER);
    });

    test('CHECKIN: dag 13 skal være CHECKIN (første dag i fase 4)', () => {
      expect(getPhaseForDay(13).phase).toBe(JourneyPhase.CHECKIN);
    });

    test('CHECKIN: dag 14 skal være CHECKIN (siste dag)', () => {
      expect(getPhaseForDay(14).phase).toBe(JourneyPhase.CHECKIN);
    });

    test('Ukjent dag > 14 skal falle tilbake til CHECKIN', () => {
      expect(getPhaseForDay(15).phase).toBe(JourneyPhase.CHECKIN);
    });
  });

  // M-5: journeySync importerer dayToPhase — pin CHECKIN på dag 13-14.
  describe('dayToPhase (M-5: CHECKIN oppnåelig)', () => {
    test('dag 13-14 skal være CHECKIN', () => {
      for (const day of [13, 14]) {
        expect(dayToPhase(day)).toBe(JourneyPhase.CHECKIN);
      }
    });

    test('dag 11-12 skal være DEEPER (ikke CHECKIN)', () => {
      for (const day of [11, 12]) {
        expect(dayToPhase(day)).toBe(JourneyPhase.DEEPER);
      }
    });
  });

  // ── Bildesperre (før dag 8) ──

  describe('isPhotosAllowed', () => {
    test('dag 1: bilder IKKE tillatt', () => {
      expect(isPhotosAllowed(1)).toBe(false);
    });

    test('dag 7: bilder IKKE tillatt (siste dag i EARLY)', () => {
      expect(isPhotosAllowed(7)).toBe(false);
    });

    test('dag 8: bilder tillatt (første dag BUILDING_TRUST)', () => {
      expect(isPhotosAllowed(8)).toBe(true);
    });

    test('dag 14: bilder tillatt', () => {
      expect(isPhotosAllowed(14)).toBe(true);
    });
  });

  // ── Journey Active/Completed ──

  describe('isJourneyActive / isJourneyCompleted', () => {
    test('dag 1: aktiv, ikke fullført', () => {
      expect(isJourneyActive(1)).toBe(true);
      expect(isJourneyCompleted(1)).toBe(false);
    });

    test('dag 14: aktiv, ikke fullført', () => {
      expect(isJourneyActive(14)).toBe(true);
      expect(isJourneyCompleted(14)).toBe(false);
    });

    test('dag 15: IKKE aktiv, fullført', () => {
      expect(isJourneyActive(15)).toBe(false);
      expect(isJourneyCompleted(15)).toBe(true);
    });

    test('dag 0: IKKE aktiv', () => {
      expect(isJourneyActive(0)).toBe(false);
    });
  });

  // ── JOURNEY_TOTAL_DAYS ──

  describe('JOURNEY_TOTAL_DAYS', () => {
    test('skal være 14 dager', () => {
      expect(JOURNEY_TOTAL_DAYS).toBe(14);
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

    test('dag 8: fordypning', () => {
      expect(getThemeForDay(8)).toBe('fordypning');
    });

    test('dag 11: modning', () => {
      expect(getThemeForDay(11)).toBe('modning');
    });

    test('dag 14: integrasjon', () => {
      expect(getThemeForDay(14)).toBe('integrasjon');
    });
  });
});

// ── Matching Weights (F-8: 6 forskningsbaserte dimensjoner, §7) ──

describe('Matching Weights (DIMENSION_WEIGHTS)', () => {
  test('values vekt skal være 0.25', () => {
    expect(DIMENSION_WEIGHTS.values).toBe(0.25);
  });

  test('attachment vekt skal være 0.25', () => {
    expect(DIMENSION_WEIGHTS.attachment).toBe(0.25);
  });

  test('personality vekt skal være 0.15', () => {
    expect(DIMENSION_WEIGHTS.personality).toBe(0.15);
  });

  test('communication vekt skal være 0.15', () => {
    expect(DIMENSION_WEIGHTS.communication).toBe(0.15);
  });

  test('emotionRegulation vekt skal være 0.10', () => {
    expect(DIMENSION_WEIGHTS.emotionRegulation).toBe(0.10);
  });

  test('lifeSituation vekt skal være 0.10', () => {
    expect(DIMENSION_WEIGHTS.lifeSituation).toBe(0.10);
  });

  test('summen av alle vekter skal være 1.0', () => {
    const total = Object.values(DIMENSION_WEIGHTS).reduce((s, w) => s + w, 0);
    expect(total).toBeCloseTo(1.0, 5);
  });
});

// ── 24-timersregelen ──

describe('24-hour Match Delay Rule', () => {
  test('MATCH_DELAY_HOURS skal være 24', () => {
    expect(MATCH_DELAY_HOURS).toBe(24);
  });
});