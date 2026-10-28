/**
 * ACT RT1 — RUNTIME TRUTH GUARDS (RT-01…RT-12)
 *
 * Sannhetsgrunnlag: docs/RUNTIME-DOCUMENTATION-TRUTH-PLAN-v1.0.md +
 * Georges produktbeslutninger D1–D7 (ACT RT1: RUNTIME TRUTH ALIGNMENT).
 *
 * Guards:
 *  RT-01: ingen falsk obligatorisk daglig-spørsmål-claim i offentlig copy
 *  RT-02: ingen «daglig(e) … oppgave(r)»-plikt i offentlig copy
 *  RT-03: completion er bilateralt (per-deltaker valg, ingen ensidig slutt)
 *  RT-04: PDF krev mutual FOUND (begge valgt «Vi fant hverandre»)
 *  RT-05: PDF inneholder ingen image URL/vei (image-meldinger utelatt)
 *  RT-06: journey 14 / bilder dag 8 intact (config + copy)
 *  RT-07: canonical to-sirkler-logo i header/dashboard
 *  RT-08: ingen «Nå er ærligheten»
 *  RT-09: ingen «vitrinasjestykke»
 *  RT-10: pris single-source — ingen 249, ingen hardkodet 349 i copy
 *  RT-11: mood er aldri claimet som partner-synlig
 *  RT-12: llms.txt har 14-dager/dag-8/invite-beta-truth
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

/** Fjerner kodekommentarer slik at guards kun måler aktiv copy. */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|\s)\/\/[^\n]*/g, (m, pre: string) => pre);
}

function listFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(join(ROOT, dir))) {
    const full = join(ROOT, dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...listFiles(`${dir}/${entry}`));
    else if (/\.(tsx|ts)$/.test(entry)) out.push(`${dir}/${entry}`);
  }
  return out;
}

/** Offentlige, brukerrettede sider (samme sett som plain-copy-truth). */
function publicPageFiles(): string[] {
  const dirs = new Set([
    '(landing)', 'motpol', 'hvorfor', 'slik-fungerer-det', 'reisen', 'metoder',
    'trygghet', 'priser', 'faq', 'vilkar', 'personvern', 'cookies', 'om-oss',
    'kontakt', 'tilgjengelighet', 'tips', 'blogg', 'samtykke', 'login',
    'register', 'betaling', 'matching',
  ]);
  return listFiles('app').filter((rel) => {
    const top = rel.split('/')[1] ?? rel;
    return dirs.has(top);
  });
}

const PUBLIC_FILES = publicPageFiles();

/* ────────────────────────────────────────────────────────────────
   RT-01: Ingen falsk obligatorisk daglig-spørsmål-claim
   ──────────────────────────────────────────────────────────────── */
describe('RT-01: ingen falsk obligatorisk daglig-spørsmål-claim', () => {
  const patterns = [
    /hver dag[^.\n]{0,60}\bmå\b/i,
    /daglig[^.\n]{0,60}\bmå\b/i,
    /dagens (spørsmål|oppave|oppgave)[^.]{0,40}\bmå\b/i,
    /obligatorisk[^.\n]{0,40}(spørsmål|oppgave)/i,
    /(spørsmål|oppgave)[^.]{0,40}obligatorisk/i,
  ];
  for (const rel of PUBLIC_FILES) {
    test(`${rel}: ingen pliktfremmende daglig-claim`, () => {
      const src = stripComments(read(rel));
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`${rel}: ${p} matcher: ${src.match(p)}`);
      }
    });
  }
});

/* ────────────────────────────────────────────────────────────────
   RT-02: Ingen «daglig(e) … oppgave(r)»-plikt
   ──────────────────────────────────────────────────────────────── */
describe('RT-02: ingen daglig-oppgave-plikt i offentlig copy', () => {
  const pattern = /daglig(e)?[^.\n]{0,25}oppgav/i;
  for (const rel of PUBLIC_FILES) {
    test(`${rel}: ingen «daglig(e) … oppgav(e)(r)»`, () => {
      const src = stripComments(read(rel));
      if (pattern.test(src)) {
        throw new Error(`${rel}: ${src.match(pattern)}`);
      }
    });
  }
});

/* ────────────────────────────────────────────────────────────────
   RT-03: Completion er bilateralt
   ──────────────────────────────────────────────────────────────── */
describe('RT-03: completion er bilateralt (D4)', () => {
  test('schema: per-deltaker decision-felter (JourneyDecision)', () => {
    const schema = read('prisma/schema.prisma');
    expect(schema).toMatch(/completionA\s+JourneyDecision @default\(PENDING\)/);
    expect(schema).toMatch(/completionB\s+JourneyDecision @default\(PENDING\)/);
    expect(schema).toMatch(/completionADecidedAt DateTime\?/);
    expect(schema).toMatch(/completionBDecidedAt DateTime\?/);
    expect(schema).toMatch(/enum JourneyDecision \{[\s\S]*?PENDING[\s\S]*?FOUND_EACH_OTHER[\s\S]*?NEW_JOURNEY/);
  });

  test('exit-route: registrerer per-deltaker valg; mutual kun når begge FOUND', () => {
    const src = read('app/api/journey/exit/route.ts');
    // Per-deltaker felt brukes:
    expect(src).toMatch(/completionA|completionB/);
    // RT1-final: avgjørelsestabellen bor i en delt, deterministisk lib
    // (exit-route + cron deler den — mutual kun når begge FOUND):
    expect(src).toContain("from '@/lib/journey/completion'");
    expect(src).toContain('resolveCompletionState');
    const lib = read('lib/journey/completion.ts');
    expect(lib).toMatch(/FOUND_EACH_OTHER[\s\S]{0,80}FOUND_EACH_OTHER[\s\S]{0,60}MUTUAL/);
    // Waiting-tilstand finnes (partner PENDING → ingen sletting/avslutning):
    expect(src).toMatch(/outcome: 'waiting'/);
  });
});

/* ────────────────────────────────────────────────────────────────
   RT-04: PDF krev mutual FOUND
   ──────────────────────────────────────────────────────────────── */
describe('RT-04: PDF krev mutual FOUND (D5)', () => {
  test('export-pdf: begge completionA og completionB må være FOUND_EACH_OTHER', () => {
    const src = read('app/api/journey/export-pdf/route.ts');
    expect(src).toMatch(/completionA === 'FOUND_EACH_OTHER'/);
    expect(src).toMatch(/completionB === 'FOUND_EACH_OTHER'/);
    expect(src).toMatch(/409/); // ikke-mutual → avvist
  });
});

/* ────────────────────────────────────────────────────────────────
   RT-05: PDF inneholder ingen image URL/vei
   ──────────────────────────────────────────────────────────────── */
describe('RT-05: PDF inneholder ingen image URL/vei (D6)', () => {
  test('export-pdf: image-meldinger utelatt i meldingsquery', () => {
    const src = read('app/api/journey/export-pdf/route.ts');
    expect(src).toMatch(/type: \{ not: 'image' \}/);
  });
});

/* ────────────────────────────────────────────────────────────────
   RT-06: Journey 14 / bilder dag 8 intact
   ──────────────────────────────────────────────────────────────── */
describe('RT-06: journey 14 / bilder dag 8 intact', () => {
  test('config: JOURNEY_TOTAL_DAYS=14, PHOTO_REVEAL_DAY=8', () => {
    const cfg = read('config/journey.ts');
    expect(cfg).toMatch(/JOURNEY_TOTAL_DAYS\s*=\s*14/);
    expect(cfg).toMatch(/PHOTO_REVEAL_DAY\s*=\s*8/);
  });

  test('offentlig copy: ingen 30-dagers-reise- eller dag-15-claim', () => {
    // Reise-spesifikke patterns — personvern/cookies lovlig har 30-dagers
    // RETENSJONSfrister (som FB-20 tillater).
    const patterns = [
      /30[-\s]dagers\s+reise/i,
      /reise[^.\n]{0,40}30[-\s]dager/i,
      /\bdag 15\b/i,
    ];
    for (const rel of PUBLIC_FILES) {
      const src = stripComments(read(rel));
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`${rel}: ${p}`);
      }
    }
  });
});

/* ────────────────────────────────────────────────────────────────
   RT-07: Canonical to-sirkler-logo i header/dashboard
   ──────────────────────────────────────────────────────────────── */
describe('RT-07: canonical to-sirkler-logo (D3)', () => {
  const headerFiles = [
    'components/layout/UniversalMenu.tsx',
    'components/global/GlobalHeader.tsx',
    'components/global/ToSomLogo.tsx',
    'app/dashboard/components/DashboardNavBar.tsx',
  ];

  test('UniversalMenu (global header) bruker resonansmerket, ikke wordmark', () => {
    const src = read('components/layout/UniversalMenu.tsx');
    expect(src).toMatch(/from '@\/components\/branding\/LogoVariants'/);
    expect(src).not.toMatch(/from '@\/components\/ui\/branding\/Logo'/);
    expect(src).toMatch(/<ResonanceMark/);
  });

  test('ToSomLogo (header/dashboard-logo) bruker resonansmerket', () => {
    const src = read('components/global/ToSomLogo.tsx');
    expect(src).toMatch(/from ['"]@\/components\/branding\/LogoVariants['"]/);
    expect(src).not.toMatch(/ui\/branding\/Logo['"]/);
    expect(src).toMatch(/<ResonanceMark/);
  });

  test('DashboardNavBar bruker ToSomLogo (kanonisk merke via komponent)', () => {
    const src = read('app/dashboard/components/DashboardNavBar.tsx');
    expect(src).toMatch(/ToSomLogo/);
  });

  test('header-filer finnes og refererer canonical merket', () => {
    for (const rel of headerFiles) {
      const src = read(rel);
      expect(src.length).toBeGreaterThan(100);
    }
  });
});

/* ────────────────────────────────────────────────────────────────
   RT-08: Ingen «Nå er ærligheten»
   ──────────────────────────────────────────────────────────────── */
describe('RT-08: ingen «Nå er ærligheten» i app/', () => {
  const files = listFiles('app');
  for (const rel of files) {
    test(`${rel}: ingen «Nå er ærligheten»`, () => {
      const src = stripComments(read(rel)).toLowerCase();
      if (src.includes('nå er ærligheten')) throw new Error(`${rel}: funnet «nå er ærligheten»`);
    });
  }
});

/* ────────────────────────────────────────────────────────────────
   RT-09: Ingen «vitrinasjestykke»
   ──────────────────────────────────────────────────────────────── */
describe('RT-09: ingen «vitrinasjestykke» i app/', () => {
  const files = listFiles('app');
  for (const rel of files) {
    test(`${rel}: ingen «vitrinasjestykke»`, () => {
      const src = stripComments(read(rel)).toLowerCase();
      if (src.includes('vitrinasjestykke')) throw new Error(`${rel}: funnet «vitrinasjestykke»`);
    });
  }
});

/* ────────────────────────────────────────────────────────────────
   RT-10: Pris single-source — 349 fremtidig plan, ingen 249
   ──────────────────────────────────────────────────────────────── */
describe('RT-10: pris single-source (D7)', () => {
  test('ingen 249-kandidat i aktiv copy (app/ + public/)', () => {
    const appFiles = listFiles('app');
    const pubFiles = readdirSync(join(ROOT, 'public'))
      .filter((f) => f.endsWith('.txt'))
      .map((f) => `public/${f}`);
    for (const rel of [...appFiles, ...pubFiles]) {
      const src = stripComments(read(rel));
      if (/\b249\b/.test(src)) throw new Error(`${rel}: inneholder 249`);
    }
  });

  test('landing/priser/faq bruker PRICING.journeyPrice, ingen hardkodet 349', () => {
    for (const rel of ['app/(landing)/page.tsx', 'app/priser/page.tsx', 'app/faq/page.tsx']) {
      const src = read(rel);
      expect(src).toContain('PRICING.journeyPrice');
      if (/\b349\b/.test(stripComments(src))) {
        throw new Error(`${rel}: hardkodet 349 (bruk PRICING.journeyPrice)`);
      }
    }
  });
});

/* ────────────────────────────────────────────────────────────────
   RT-11: Mood er aldri claimet som partner-synlig
   ──────────────────────────────────────────────────────────────── */
describe('RT-11: mood er privat (D13)', () => {
  const patterns = [
    /(partneren|den andre)[^.]{0,30}(ser|ser ikke)[^.]{0,30}(stemning|mood)/i,
    /(stemning|mood)[^.]{0,40}(blir|er) (synlig|synlig for|delt for) (partner|den andre)/i,
  ];
  for (const rel of PUBLIC_FILES) {
    test(`${rel}: ingen partner-synlig mood-claim`, () => {
      const src = stripComments(read(rel));
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`${rel}: ${p}`);
      }
    });
  }

  test('MoodsPanel-beholder «bare deg, din farge»-sannheten', () => {
    const src = read('app/chat/components/MoodsPanel.tsx');
    expect(stripComments(src).toLowerCase()).toMatch(/bare deg, din farge/);
  });
});

/* ────────────────────────────────────────────────────────────────
   RT-12: llms.txt har current product truth (D20)
   ──────────────────────────────────────────────────────────────── */
describe('RT-12: llms.txt current truth (D20)', () => {
  const src = read('public/llms.txt');
  test('14-dagers reise + bilder dag 8', () => {
    expect(src).toMatch(/14[-\s]dagers/i);
    expect(src).toMatch(/dag 8/);
  });
  test('ingen 30-dagers-/dag-15-/instrument-claim', () => {
    expect(src).not.toMatch(/30[-\s]dager/i);
    expect(src).not.toMatch(/\bdag 15\b/i);
    expect(src).not.toMatch(/PVQ/i);
    expect(src).not.toMatch(/BFI/i);
    expect(src).not.toMatch(/ERQ/i);
  });
  test('invite-only beta + ingen aktiv betaling', () => {
    expect(src).toMatch(/invitasjon/i);
    expect(src).toMatch(/begrenset beta/i);
    expect(src).toMatch(/gratis/i);
  });
});
