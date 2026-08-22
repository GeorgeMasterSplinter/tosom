/**
 * FORSKNINGSMOTOR F-7 — test for de seks dimensjonsfunksjonene.
 *
 * Må inneholde en test på at engstelig + unnvikende gir lav score
 * (hele poenget med endringen), i tråd med §8 i FORSKNINGSMOTOR-v1.0.md.
 */

import {
  scoreAttachmentCompat,
  scorePersonalityCompat,
  scoreValueCompat,
  scoreEmotionRegCompat,
  scoreCommunicationCompat,
  scoreLifeSituationCompat,
} from '@/lib/matching/dimensions';
import type {
  AttachmentScores,
  BigFiveScores,
  ValueProfile,
  ERScores,
  CommScores,
} from '@/lib/psychometrics/scoring';

const att = (
  anxiety: number,
  avoidance: number,
  style: AttachmentScores['style']
): AttachmentScores => ({ anxiety, avoidance, style });

const bigFive = (o: Partial<BigFiveScores> = {}): BigFiveScores => ({
  openness: 3,
  conscientiousness: 3,
  extraversion: 3,
  agreeableness: 3,
  neuroticism: 3,
  ...o,
});

describe('scoreAttachmentCompat (§8)', () => {
  // Hele poenget: engstelig + unnvikende er det best dokumenterte negative mønsteret.
  it('gir lav score for engstelig + unnvikende', () => {
    const anxious = att(4, 2, 'anxious');
    const avoidant = att(2, 4, 'avoidant');
    expect(scoreAttachmentCompat(anxious, avoidant)).toBe(25);
    // Og uordnet: avoidant + anxious skal gi samme lave score.
    expect(scoreAttachmentCompat(avoidant, anxious)).toBe(25);
  });

  it('gir 100 for trygg + trygg', () => {
    expect(scoreAttachmentCompat(att(2, 2, 'secure'), att(2, 2, 'secure'))).toBe(100);
  });

  it('gir 75 for trygg + engstelig og trygg + unnvikende', () => {
    const secure = att(2, 2, 'secure');
    expect(scoreAttachmentCompat(secure, att(4, 2, 'anxious'))).toBe(75);
    expect(scoreAttachmentCompat(secure, att(2, 4, 'avoidant'))).toBe(75);
  });

  it('gir lavere for engstelig+engstelig (45) og unnvikende+unnvikende (40)', () => {
    expect(scoreAttachmentCompat(att(4, 2, 'anxious'), att(4, 2, 'anxious'))).toBe(45);
    expect(scoreAttachmentCompat(att(2, 4, 'avoidant'), att(2, 4, 'avoidant'))).toBe(40);
  });
});

describe('scorePersonalityCompat (§8)', () => {
  it('straffer to sterkt nevrotiske (ikke full uttelling)', () => {
    const highN = bigFive({ neuroticism: 5 });
    const lowN = bigFive({ neuroticism: 2 });
    // To høye nevrotisisme skal score lavere enn en høy + en lav.
    const bothHigh = scorePersonalityCompat(highN, highN);
    const mixed = scorePersonalityCompat(highN, lowN);
    expect(bothHigh).toBeLessThan(mixed);
  });

  it('belønner høye medmenneskelighet hos begge', () => {
    const ag = bigFive({ agreeableness: 5 });
    const lowAg = bigFive({ agreeableness: 2 });
    expect(scorePersonalityCompat(ag, ag)).toBeGreaterThan(scorePersonalityCompat(ag, lowAg));
  });

  it('belønner likhet i planmessighet', () => {
    const con = bigFive({ conscientiousness: 4 });
    const lowCon = bigFive({ conscientiousness: 1 });
    expect(scorePersonalityCompat(con, bigFive({ conscientiousness: 4 }))).toBeGreaterThan(
      scorePersonalityCompat(con, lowCon)
    );
  });
});

describe('scoreValueCompat (§8 — korrelasjon)', () => {
  it('gir høyt når to profiler har samme formasjon', () => {
    const a: ValueProfile = { security: 5, benevolence: 4, stimulation: 2, power: 3 };
    const b: ValueProfile = { security: 5, benevolence: 5, stimulation: 1, power: 3 };
    expect(scoreValueCompat(a, b)).toBeGreaterThan(80);
  });

  it('gir lavt når to profiler har motsatt formasjon', () => {
    const a: ValueProfile = { security: 5, stimulation: 1, power: 5 };
    const b: ValueProfile = { security: 1, stimulation: 5, power: 1 };
    expect(scoreValueCompat(a, b)).toBeLessThan(30);
  });

  it('gir nøytralt når ingen felles akser', () => {
    expect(scoreValueCompat({ a: 3 }, { b: 3 })).toBe(50);
  });
});

describe('scoreEmotionRegCompat (§8)', () => {
  it('belønner høy reappraisal hos begge', () => {
    const good: ERScores = { reappraisal: 5, suppression: 2 };
    const bad: ERScores = { reappraisal: 2, suppression: 2 };
    expect(scoreEmotionRegCompat(good, good)).toBeGreaterThan(scoreEmotionRegCompat(bad, bad));
  });

  it('straffer høy undertrykking hos begge', () => {
    const sup: ERScores = { reappraisal: 3, suppression: 5 };
    const lowSup: ERScores = { reappraisal: 3, suppression: 2 };
    expect(scoreEmotionRegCompat(sup, sup)).toBeLessThan(scoreEmotionRegCompat(lowSup, lowSup));
  });
});

describe('scoreCommunicationCompat', () => {
  it('gir høyt for like kommunikasjonstrekk', () => {
    const a: CommScores = { repair: 5, bids: 4, listening: 4 };
    const b: CommScores = { repair: 5, bids: 4, listening: 4 };
    expect(scoreCommunicationCompat(a, b)).toBe(100);
  });

  it('gir lavt for motsatte trekke', () => {
    const a: CommScores = { repair: 5, bids: 5, listening: 5 };
    const b: CommScores = { repair: 1, bids: 1, listening: 1 };
    expect(scoreCommunicationCompat(a, b)).toBe(0);
  });
});

describe('scoreLifeSituationCompat', () => {
  it('belønner samsvarende vilje til barn', () => {
    const a = { wantChildren: 'ja', children: 'nei', smoking: 'nei' };
    const b = { wantChildren: 'ja', children: 'nei', smoking: 'nei' };
    expect(scoreLifeSituationCompat(a, b)).toBe(100);
  });

  it('straffer motsatt vilje til barn sterkt', () => {
    const a = { wantChildren: 'ja', smoking: 'nei' };
    const b = { wantChildren: 'nei', smoking: 'nei' };
    // wantChildren er vektet 0.4 — motsatt skal gi lav score.
    expect(scoreLifeSituationCompat(a, b)).toBeLessThan(60);
  });

  it('gir nøytralt uten felles praktiske data', () => {
    expect(scoreLifeSituationCompat({}, {})).toBe(50);
  });

  it('tolter data i lifestyle-Json-objekt', () => {
    const a = { lifestyle: { wantChildren: 'ja', smoking: 'nei' } };
    const b = { wantChildren: 'ja', smoking: 'nei' };
    expect(scoreLifeSituationCompat(a, b)).toBe(100);
  });
});