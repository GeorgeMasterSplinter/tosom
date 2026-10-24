/**
 * ToSom — PERSONALITY V2 (ACT F2 SIMPLIFIED): SIMP-01 … SIMP-15
 *
 * Mål: fjerne BFI-10 avhengigheten og erstatte den med 15 egne, hverdagslige
 * Tosom-spørsmål (produktinstrument — ikke et psykologisk testinstrument).
 *
 * Testmetodikk:
 *  - Enhetstester mot lib/psychometrics + lib/matching (ren, deterministisk).
 *  - Source-guards (fs-lesing av produktfilene) som fanger BFI-kopiering,
 *    klinisk språk og bodyType-inferanse i aktiv kode — ikke i docs/.
 *  - DB-assertjonen for SIMP-07 (versjon lagres i Profile) ligger i
 *    __tests__/profile-setup-save.test.ts (kjører mot ekte DB).
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { unifiedScore, DIMENSION_WEIGHTS } from '@/lib/matching/unifiedScorer';
import { scorePersonalityCompat } from '@/lib/matching/dimensions';
import { scorePersonality, scoreAll } from '@/lib/psychometrics/scoring';
import {
  TOSOM_PERSONALITY,
  ALL_ITEMS,
} from '@/lib/psychometrics/instruments';
import type { ProfileData } from '@/lib/matching/types';

const ROOT = join(__dirname, '..');

/** Les alle .ts/.tsx-filene (unntatt tester) under ett (relativt) katalogtre. */
function readAllSource(dirRel: string): string {
  const base = join(ROOT, dirRel);
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) {
        walk(full);
      } else if (/\.(ts|tsx)$/.test(entry) && !/\.test\.(ts|tsx)$/.test(entry)) {
        out.push(readFileSync(full, 'utf8'));
      }
    }
  };
  walk(base);
  return out.join('\n');
}

/** Produktflater som ikke må inneholde BFI-10-itemtekster (SIMP-03). */
const PRODUCT_SOURCE = [
  'lib/psychometrics',
  'lib/matching',
  'lib/validation',
  'lib/profile',
  'components/onboarding',
  'app/onboarding',
  'app/metoder',
].map(readAllSource).join('\n');

/** De 10 gamle BFI-10-norsk-tekstene (frossen referanse fra v1). */
const LEGACY_BFI_TEXTS = [
  'Jeg er stille og reservert.',
  'Jeg stoler lett på andre.',
  'Jeg er nysgjerrig på mange ting.',
  'Jeg har et aktivt fantasi-liv.',
  'Jeg fullfører alltid det jeg starter.',
  'Jeg er grundig og systematisk i det jeg gjør.',
  'Jeg er den som får folk til å le på en fest.',
  'Jeg har en tilgivende natur.',
  'Jeg blir lett oppbrakt.',
  'Jeg tenner lett på ting.',
];

/** Miniprofiler for scoring-tester. */
function makeProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    userId: 'pv2-test',
    firstName: 'Test',
    lastName: 'Person',
    age: 30,
    bio: null,
    interests: [],
    matchTags: [],
    personality: { traits: ['open', 'calm'] },
    lifeSituation: { values: ['family', 'nature'] },
    relationshipStyle: 'gradual',
    communication: { style: 'direct' },
    futureVision: { goals: ['family', 'growth'] },
    boundaries: { preferredDistance: 'slow-pace' },
    emotionalNeeds: { needs: ['depth', 'trust'] },
    lifeRhythm: 'morning',
    maturityLevel: 5,
    securityLevel: 'secure',
    lifestyle: null,
    intimacy: null,
    preferences: null,
    ...overrides,
  };
}

const BF = (over: Partial<Record<string, number>> = {}) => ({
  openness: 3,
  conscientiousness: 3,
  extraversion: 3,
  agreeableness: 3,
  neuroticism: 3,
  ...over,
});

describe('SIMP-01 — 0 aktive BFI-10-user-facing items', () => {
  it('det aktive onboarding-settet (ALL_ITEMS) inneholder ingen bfi*-items', () => {
    for (const item of ALL_ITEMS) {
      expect(item.id.startsWith('bfi')).toBe(false);
    }
  });

  it('ingen bfi*-id i aktive produktflater', () => {
    expect(PRODUCT_SOURCE).not.toMatch(/\bbfi\d+\b/);
  });
});

describe('SIMP-02 — 15 nye Tosom-items', () => {
  it('TOSOM_PERSONALITY har nøyaktig 15 items med unike p1–p15-id-er', () => {
    expect(TOSOM_PERSONALITY).toHaveLength(15);
    const ids = TOSOM_PERSONALITY.map((i) => i.id);
    expect(new Set(ids).size).toBe(15);
    for (let n = 1; n <= 15; n++) {
      expect(ids).toContain(`p${n}`);
    }
  });

  it('alle 15 er en del av det aktive onboarding-settet', () => {
    const allIds = new Set(ALL_ITEMS.map((i) => i.id));
    for (const item of TOSOM_PERSONALITY) {
      expect(allIds.has(item.id)).toBe(true);
    }
  });

  it('3 items per hvert av de 5 brede områdene', () => {
    for (const trait of ['extraversion', 'agreeableness', 'conscientiousness', 'neuroticism', 'openness']) {
      expect(TOSOM_PERSONALITY.filter((i) => i.trait === trait)).toHaveLength(3);
    }
  });
describe('SIMP-03 — ingen near-verbatim gammel BFI-copy i aktiv flyt', () => {
  it('ingen av de 10 gamle BFI-10-tekstene finnes i produktkoden', () => {
    for (const text of LEGACY_BFI_TEXTS) {
      expect(PRODUCT_SOURCE).not.toContain(text);
    }
  });
});

describe('SIMP-04 — ingen kliniske spørsmål', () => {
  const KLINISKE_TERMER = [
    'depresjon', 'depressjon', 'angst', 'panikk', 'traume', 'traumer',
    'psyke', 'psykisk sykdom', 'diagnose', 'diagnostikk', 'klinisk',
    'personlighetsforstyrrelse', 'selvskading', 'selvmord', 'avhengighet',
    'sykdom',
  ];

  it('ingen V2-item inneholder klinisk/psykisk-helse-språk', () => {
    for (const item of TOSOM_PERSONALITY) {
      const lower = item.text.toLowerCase();
      for (const term of KLINISKE_TERMER) {
        expect(lower).not.toContain(term);
      }
    }
  });
});

describe('SIMP-05 — ingen bodyType-inferanse', () => {
  it('matching-motoren refererer ikke til bodyType', () => {
    const matchingSource = readAllSource('lib/matching');
    expect(matchingSource).not.toContain('bodyType');
  });

  it('personlighetsskåringen refererer ikke til kropp/utseende', () => {
    const scoringSource = readAllSource('lib/psychometrics');
    expect(scoringSource).not.toMatch(/bodyType|kropp|utseende|attraktiv/i);
  });
});

describe('SIMP-06 — MISSING ≠ NEUTRAL (missing ≠ 3 ≠ «Både og»)', () => {
  it('scorePersonality: ett manglende svar gir null — ingen skår beregnes', () => {
    const a: Record<string, number> = {};
    for (const item of TOSOM_PERSONALITY) a[item.id] = 5;
    delete a.p1;
    expect(scorePersonality(a)).toBeNull();
  });

  it('scoreAll: ufullstendig personlighets-sett gir bigFive = null', () => {
    expect(scoreAll({}).bigFive).toBeNull();
  });

  it('profiler uten bigFive gir ikke en 3-basert personlighetsskor i matching', () => {
    // Uten bigFive (eller uten V2-merke) brukes ordoverlapp-fallback;
    // ingen personlighetstags i det hele tatt → nøytralt 50 — IKKE 3-basert.
    const a = makeProfile({ personality: null });
    const b = makeProfile({ personality: null });
    expect(unifiedScore(a, b).breakdown.personality).toBe(50);
  });
});

describe('SIMP-07 — V2-versjon lagres', () => {
  it('setup-ruten skriver personalityModelVersion=2 kun ved fullstendig V2-sett', () => {
    const route = readFileSync(join(ROOT, 'app/api/profile/setup/route.ts'), 'utf8');
    // bigFive skrives kun når scorePersonality returnerte ikke-null …
    expect(route).toContain('bigFive: psychScores?.bigFive ? (psychScores.bigFive as any) : undefined');
    // … og versjon 2 settes på samme betingelse (ikke ellers).
    expect(route).toContain('personalityModelVersion: psychScores?.bigFive ? 2 : undefined');
  });

  it('scoreAll gir beregnet bigFive for fullstendig V2-sett (forutsetningen for lagring)', () => {
    const a: Record<string, number> = {};
    for (const item of TOSOM_PERSONALITY) a[item.id] = 4;
    expect(scorePersonality(a)).not.toBeNull();
    expect(scoreAll(a).bigFive).not.toBeNull();
  });
});

describe('SIMP-08 — v1 og v2 sammenlignes ikke som samme modell', () => {
  const v1ish = BF({ extraversion: 1, neuroticism: 5, conscientiousness: 1 });

  it('v1↔v1 (uten V2-merke): personlighet bruker fallback, ikke V2-komponenten', () => {
    const a = makeProfile({ bigFive: v1ish, personality: { traits: ['open', 'calm'] } });
    const b = makeProfile({ bigFive: v1ish, personality: { traits: ['open', 'calm'] } });
    const r = unifiedScore(a, b);
    expect(r.breakdown.personality).toBe(100); // identiske ord → ordoverlapp
    // … og dette er ANNET enn hva V2-komponenten ville gitt for disse skårene.
    expect(scorePersonalityCompat(v1ish, v1ish)).not.toBe(100);
  });

  it('v1↔v2: personlighet bruker fallback (ingen crosswalk)', () => {
    const a = makeProfile({ bigFive: v1ish, personality: { traits: ['open', 'calm'] } });
    const b = makeProfile({ bigFive: v1ish, personalityModelVersion: 2, personality: { traits: ['open', 'calm'] } });
    const r = unifiedScore(a, b);
    expect(r.breakdown.personality).toBe(100); // ordoverlapp
    expect(scorePersonalityCompat(v1ish, v1ish)).not.toBe(100);
  });
});

describe('SIMP-09 — aktiv reise avbrytes ikke', () => {
  it('scoring er ren: samme profiler gir alltid samme resultat (ingen sideeffekter)', () => {
    const a = makeProfile({ bigFive: BF(), personalityModelVersion: 2 });
    const b = makeProfile({ bigFive: BF({ extraversion: 4 }), personalityModelVersion: 2 });
    const r1 = unifiedScore(a, b);
    const r2 = unifiedScore(a, b);
    expect(r2.score).toBe(r1.score);
    expect(r2.breakdown).toEqual(r1.breakdown);
  });

  it('motoren rører ikke journey-tilstand (ingen journey-referanser i scoring)', () => {
    const matchingSource = readAllSource('lib/matching');
    expect(matchingSource).not.toMatch(/journeyProgress|journeyDay|endedAt/i);
  });

  it('legacy-par (v1, aktiv reise) scorer fortsatt trygt med fallback', () => {
    const a = makeProfile({ bigFive: BF(), personality: { traits: ['open', 'calm'] } });
    const b = makeProfile({ personality: { traits: ['open', 'calm'] } });
    const r = unifiedScore(a, b);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });
});

describe('SIMP-10 — V2-personlighet brukes når begge har gyldig V2', () => {
  it('begge med personalityModelVersion=2 → V2-komponenten (scorePersonalityCompat)', () => {
    const a = BF({ extraversion: 1 });
    const b = BF({ extraversion: 5 });
    const pa = makeProfile({ bigFive: a, personalityModelVersion: 2 });
    const pb = makeProfile({ bigFive: b, personalityModelVersion: 2 });
    expect(unifiedScore(pa, pb).breakdown.personality).toBe(scorePersonalityCompat(a, b));
  });

  it('V2-komponenten belønner likhet i planmessighet (atferd bevart fra v1-motoren)', () => {
    const like = BF({ conscientiousness: 4 });
    const ulik = BF({ conscientiousness: 1 });
    const rUlik = unifiedScore(
      makeProfile({ bigFive: like, personalityModelVersion: 2 }),
      makeProfile({ bigFive: ulik, personalityModelVersion: 2 }),
    );
    const rLike = unifiedScore(
      makeProfile({ bigFive: like, personalityModelVersion: 2 }),
      makeProfile({ bigFive: like, personalityModelVersion: 2 }),
    );
    expect(rLike.breakdown.personality).toBeGreaterThan(rUlik.breakdown.personality);
  });
});

describe('SIMP-11 — fallback er deterministisk', () => {
  it('v1↔v1 gir deterministisk fallback uten funnet-verdi', () => {
    const a1 = makeProfile({ personality: { traits: ['open', 'calm'] } });
    const a2 = makeProfile({ personality: { traits: ['open', 'calm'] } });
    const r1 = unifiedScore(a1, a2);
    const r2 = unifiedScore(a1, a2);
    expect(r2.breakdown.personality).toBe(r1.breakdown.personality);
    expect(r1.breakdown.personality).toBe(100); // identiske ord
  });

  it('ingen personlighetstags → nøytralt 50 (ikke en funnet skår)', () => {
    const c = makeProfile({ personality: null });
    const d = makeProfile({ personality: null });
    expect(unifiedScore(c, d).breakdown.personality).toBe(50);
  });
});

describe('SIMP-12 — scoring er bounded (0–100)', () => {
  it('fuzz: tilfeldige V2-skor, versjoner og tags holder seg innenfor [0,100]', () => {
    // Deterministisk pseudo-random (LCG) — ikke Date.now/Random.
    let seed = 20261024;
    const rnd = (): number => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    for (let i = 0; i < 500; i++) {
      const v = (): number => 1 + Math.floor(rnd() * 5); // 1..5
      const bfA = BF({ openness: v(), conscientiousness: v(), extraversion: v(), agreeableness: v(), neuroticism: v() });
      const bfB = BF({ openness: v(), conscientiousness: v(), extraversion: v(), agreeableness: v(), neuroticism: v() });
      const va = rnd() > 0.5 ? 2 : (rnd() > 0.5 ? null : 1);
      const vb = rnd() > 0.5 ? 2 : (rnd() > 0.5 ? null : 1);
      const pa = makeProfile({ bigFive: bfA, personalityModelVersion: va as 2 | null });
      const pb = makeProfile({ bigFive: bfB, personalityModelVersion: vb as 2 | null });
      const r = unifiedScore(pa, pb);
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
      for (const key of Object.keys(r.breakdown) as Array<keyof typeof r.breakdown>) {
        expect(r.breakdown[key]).toBeGreaterThanOrEqual(0);
        expect(r.breakdown[key]).toBeLessThanOrEqual(100);
      }
    }
  });

  it('vektene summerer fortsatt til 1.0 (ingen skjul rekalibrering)', () => {
    const wSum = Object.values(DIMENSION_WEIGHTS).reduce((s, w) => s + w, 0);
    expect(wSum).toBeCloseTo(1.0, 4);
  });
});

describe('SIMP-13 — Metoder beskriver modellen ærlig', () => {
  const metoder = readFileSync(join(ROOT, 'app/metoder/page.tsx'), 'utf8');

  it('beskriver V2 som egne spørsmål inspirert av Big Five-rammeverket', () => {
    expect(metoder).toContain('Tosoms egne spørsmål inspirert av brede personlighetstrekk fra Big Five-rammeverket');
    expect(metoder).toContain('ikke et standardisert eller klinisk personlighetsskjema');
  });

  it('beskriver resultatet som et begrenset kompatibilitetssignal', () => {
    expect(metoder).toContain('begrenset kompatibilitetssignal');
    expect(metoder).toContain('ikke som en vurdering av hvem du er');
  });
});

describe('SIMP-14 — ingen BFI-10-validitetspåstand', () => {
  const metoder = readFileSync(join(ROOT, 'app/metoder/page.tsx'), 'utf8');

  it('ingen BFI-navn i Metoder-siden (aktiv copy)', () => {
    expect(metoder).not.toMatch(/BFI-?10/i);
  });

  it('ingen validitetspåstand for personlighetssettet', () => {
    expect(metoder).not.toMatch(/validert Big Five/i);
    expect(metoder).not.toMatch(/validert personlighet/i);
    expect(metoder).not.toMatch(/personlighetstest/i);
  });
});

describe('SIMP-15 — full/cheap matching consistency beholdes', () => {
  it('cheap/dealbreaker-laget refererer ikke til personlighet (kan bryte ingen ekvivalens)', () => {
    const cheap = readFileSync(join(ROOT, 'lib/matching/cheapFeatures.ts'), 'utf8');
    const deal = readFileSync(join(ROOT, 'lib/matching/dealbreaker.ts'), 'utf8');
    for (const src of [cheap, deal]) {
      expect(src).not.toContain('bigFive');
      expect(src).not.toContain('personalityModelVersion');
    }
  });
});
});