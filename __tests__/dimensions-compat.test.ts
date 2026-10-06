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

  it('flervalg: full overlap gir 100 (uavhengig av rekkefølge)', () => {
    const a = { smoking: 'Roker,Snuser' };
    const b = { smoking: 'Snuser,Roker' };
    expect(scoreLifeSituationCompat(a, b)).toBe(100);
  });

  it('flervalg: delvis overlap gir Jaccard-mellomverdi', () => {
    // a har 2 valg, b har 1 av dem → 1/2 = 50 (røyk er den eneste dimensjonen).
    // PL-27: eksemplet var religion — religion er ikke lenger et samsvarskrav.
    const a = { smoking: 'Roker,Snuser' };
    const b = { smoking: 'Snuser' };
    expect(scoreLifeSituationCompat(a, b)).toBe(50);
  });

  it('flervalg: ingen felles valg gir 0', () => {
    const a = { smoking: 'Roker,Snuser' };
    const b = { smoking: 'Nei' };
    expect(scoreLifeSituationCompat(a, b)).toBe(0);
  });

  it('flervalg: vekter blanding av fullt og delvis samsvar', () => {
    // wantChildren (0.4) fullt samsvar + smoking (0.2) halv overlap:
    // (1.0*0.4 + 0.5*0.2) / 0.6 = 83.33 → 83
    const a = { wantChildren: 'ja', smoking: 'Roker,Snuser' };
    const b = { wantChildren: 'ja', smoking: 'Snuser' };
    expect(scoreLifeSituationCompat(a, b)).toBe(83);
  });

  // PL-27 (Georges beslutning 06.10): Ulik tro gjør ikke en match mindre
  // kompatibel. Religion inngår ikke i livssituasjonsscoren — verken som
  // pluss for lik tro eller trekk for ulik. (Erstatter testen som krevde
  // 100 for lik og 0 for ulik religion.)
  describe('religion er ikke et samsvarskrav (PL-27)', () => {
    const base = { wantChildren: 'ja', smoking: 'nei' };

    it('lik og ulik religion gir samme score', () => {
      const a = { ...base, deepProfileData: { religion: 'kristen' } };
      const lik = { ...base, deepProfileData: { religion: 'kristen' } };
      const ulik = { ...base, deepProfileData: { religion: 'muslim' } };
      expect(scoreLifeSituationCompat(a, lik)).toBe(scoreLifeSituationCompat(a, ulik));
    });

    it('fire valg mot ett gir samme score som ingen religion', () => {
      const a = { ...base, deepProfileData: { religion: 'kristen,muslim,spirituell,annet' } };
      const b = { ...base, deepProfileData: { religion: 'buddhist' } };
      expect(scoreLifeSituationCompat(a, b)).toBe(scoreLifeSituationCompat(base, base));
    });

    it('religion alene gir nøytral 50 (ingen praktiske data)', () => {
      const a = { deepProfileData: { religion: 'ateist' } };
      const b = { deepProfileData: { religion: 'kristen' } };
      expect(scoreLifeSituationCompat(a, b)).toBe(50);
    });
  });

  // PL-28: «Åpen for bonusfamilie» — pluss når partneren har barn fra før.
  describe('åpen for bonusfamilie (PL-28)', () => {
    it('gir pluss når partneren har barn fra før', () => {
      const apen = { wantChildren: 'nei,bonusfamilie', children: 'har-ikke-barn', smoking: 'nei' };
      const harBarn = { wantChildren: 'nei', children: 'har-barn', smoking: 'nei' };
      const lukket = { wantChildren: 'nei', children: 'har-ikke-barn', smoking: 'nei' };
      expect(scoreLifeSituationCompat(apen, harBarn)).toBeGreaterThan(
        scoreLifeSituationCompat(lukket, harBarn)
      );
    });

    it('gjelder begge veier og gis bare én gang', () => {
      const apen = { wantChildren: 'nei,bonusfamilie', children: 'har-ikke-barn' };
      const harBarn = { wantChildren: 'nei', children: 'har-små-barn' };
      expect(scoreLifeSituationCompat(apen, harBarn)).toBe(scoreLifeSituationCompat(harBarn, apen));
    });

    it('gir ingen pluss når partneren ikke har barn', () => {
      const apen = { wantChildren: 'nei,bonusfamilie', children: 'har-ikke-barn' };
      const utenBarn = { wantChildren: 'nei', children: 'har-ikke-barn' };
      const lukket = { wantChildren: 'nei', children: 'har-ikke-barn' };
      expect(scoreLifeSituationCompat(apen, utenBarn)).toBe(scoreLifeSituationCompat(lukket, utenBarn));
    });

    it('bonusfamilie telles ikke som barneønske i samsvaret', () => {
      // «nei,bonusfamilie» mot «nei» er like ønsker — samme som «nei» mot «nei».
      const a = { wantChildren: 'nei,bonusfamilie' };
      const b = { wantChildren: 'nei' };
      expect(scoreLifeSituationCompat(a, b)).toBe(scoreLifeSituationCompat({ wantChildren: 'nei' }, b));
    });

    it('kun bonusfamilie (uten ja/nei/usikker) hopper over barneønsket uten straff', () => {
      const a = { wantChildren: 'bonusfamilie', smoking: 'nei' };
      const b = { wantChildren: 'ja', smoking: 'nei' };
      expect(scoreLifeSituationCompat(a, b)).toBe(100);
    });

    it('aldri over 100', () => {
      const a = { wantChildren: 'ja,bonusfamilie', children: 'har-barn', smoking: 'nei' };
      const b = { wantChildren: 'ja', children: 'har-barn', smoking: 'nei' };
      expect(scoreLifeSituationCompat(a, b)).toBe(100);
    });
  });
});