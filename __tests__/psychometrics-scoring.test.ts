// __tests__/psychometrics-scoring.test.ts — FORSKNINGSMOTOR F-2
//
// Test av skåringsfunksjonene i lib/psychometrics/scoring.ts med kjente
// inn- og utverdier, inkludert reverserte items (BFI-10).

import {
  scoreBigFive,
  scoreAttachment,
  scoreValues,
  scoreEmotionRegulation,
  scoreCommunication,
  scoreAll,
} from '@/lib/psychometrics/scoring';
import { BFI10, ATTACHMENT, PVQ10, ERQ6, COMMUNICATION } from '@/lib/psychometrics/instruments';

describe('psychometrics/scoring', () => {
  /* ─── BFI-10 ─── */

  describe('scoreBigFive', () => {
    it('rekner gjennomsnitt per trekk', () => {
      const answers: Record<string, number> = {};
      // Alle 5 → alle trekk med ikke-reverserte items = 5
      for (const i of BFI10) answers[i.id] = 5;
      const s = scoreBigFive(answers);
      expect(s.agreeableness).toBe(5);
      expect(s.openness).toBe(5);
      expect(s.conscientiousness).toBe(5);
      expect(s.neuroticism).toBe(5);
    });

    it('håndterer reverserte items (bfi1 er reversert)', () => {
      const bfi1 = BFI10.find((i) => i.id === 'bfi1')!;
      const bfi7 = BFI10.find((i) => i.id === 'bfi7')!;
      expect(bfi1.reversed).toBe(true);
      expect(bfi7.reversed).toBe(false);

      // bfi1 = 1 (reversert → 5), bfi7 = 5 → extraversion = 5
      const high = { bfi1: 1, bfi7: 5 };
      expect(scoreBigFive(high).extraversion).toBe(5);

      // bfi1 = 5 (reversert → 1), bfi7 = 1 → extraversion = 1
      const low = { bfi1: 5, bfi7: 1 };
      expect(scoreBigFive(low).extraversion).toBe(1);
    });

    it('blander reversert og ikke-reversert riktig', () => {
      // bfi1 = 2 (reversert → 4), bfi7 = 3 → (4+3)/2 = 3.5
      const s = scoreBigFive({ bfi1: 2, bfi7: 3 });
      expect(s.extraversion).toBe(3.5);
    });

    it('behandler manglende svar som nøytralt (3)', () => {
      // Kun bfi1 = 1 (reversert → 5), bfi7 mangler (3) → (5+3)/2 = 4
      const s = scoreBigFive({ bfi1: 1 });
      expect(s.extraversion).toBe(4);
    });
  });

  /* ─── Tilknytning ─── */

  describe('scoreAttachment', () => {
    const allAns = (v: number): Record<string, number> => {
      const a: Record<string, number> = {};
      for (const i of ATTACHMENT) a[i.id] = v;
      return a;
    };

    it('begge akser lave → secure', () => {
      const s = scoreAttachment(allAns(1));
      expect(s.anxiety).toBe(1);
      expect(s.avoidance).toBe(1);
      expect(s.style).toBe('secure');
    });

    it('angst høy, unnvikelse lav → anxious', () => {
      const a: Record<string, number> = {};
      for (const i of ATTACHMENT) {
        a[i.id] = i.trait === 'attachment_anxiety' ? 5 : 1;
      }
      const s = scoreAttachment(a);
      expect(s.anxiety).toBe(5);
      expect(s.avoidance).toBe(1);
      expect(s.style).toBe('anxious');
    });

    it('angst lav, unnvikelse høy → avoidant', () => {
      const a: Record<string, number> = {};
      for (const i of ATTACHMENT) {
        a[i.id] = i.trait === 'attachment_avoidance' ? 5 : 1;
      }
      const s = scoreAttachment(a);
      expect(s.style).toBe('avoidant');
    });

    it('begge akser høye → fearful', () => {
      const s = scoreAttachment(allAns(5));
      expect(s.anxiety).toBe(5);
      expect(s.avoidance).toBe(5);
      expect(s.style).toBe('fearful');
    });
  });

  /* ─── Verdier (PVQ-10) ─── */

  describe('scoreValues', () => {
    it('gir ett verdi per Schwartz-verdi', () => {
      const a: Record<string, number> = {};
      for (const i of PVQ10) a[i.id] = 4;
      const p = scoreValues(a);
      // benevolence har to items (pvq1, pvq10) → begge 4 → 4
      expect(p.benevolence).toBe(4);
      // security har to items (pvq4, pvq6) → 4
      expect(p.security).toBe(4);
      expect(p.power).toBe(4);
    });
  });

  /* ─── Emosjonsregulering (ERQ-6) ─── */

  describe('scoreEmotionRegulation', () => {
    it('skiller reappraisal og suppression', () => {
      const a: Record<string, number> = {};
      for (const i of ERQ6) {
        a[i.id] = i.trait === 'reappraisal' ? 5 : 2;
      }
      const s = scoreEmotionRegulation(a);
      expect(s.reappraisal).toBe(5);
      expect(s.suppression).toBe(2);
    });
  });

  /* ─── Kommunikasjon ─── */

  describe('scoreCommunication', () => {
    it('gir ett verdi per kommunikasjonstrekk', () => {
      const a: Record<string, number> = {};
      for (const i of COMMUNICATION) a[i.id] = 4;
      const s = scoreCommunication(a);
      expect(s.repair).toBe(4);
      expect(s.bids).toBe(4);
      expect(s.listening).toBe(4);
    });
  });

  /* ─── scoreAll ─── */

  describe('scoreAll', () => {
    it('returnerer alle fem skårer i ett objekt', () => {
      const a: Record<string, number> = {};
      for (const i of [...BFI10, ...ATTACHMENT, ...PVQ10, ...ERQ6, ...COMMUNICATION]) {
        a[i.id] = 3;
      }
      const s = scoreAll(a);
      expect(s.bigFive).toBeDefined();
      expect(s.values).toBeDefined();
      expect(s.emotionRegulation).toBeDefined();
      expect(s.communication).toBeDefined();
      // Alle 3.0: begge akser er >= 3.0 → 'fearful' (terskel er >= 3.0, ikke > 3.0)
      expect(s.attachment.style).toBe('fearful');
    });
  });
});