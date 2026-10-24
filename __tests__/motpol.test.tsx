/**
 * ACT MOTPOL — MOT-01–19 (automatisert del)
 *
 * Motpol-siden (/motpol) skal stå kun på PF/PH/OB/MC — ZERO EF/RC
 * (plan §6/§15). Denne testen binder copy, metadata, SEO, navigasjon og
 * CTA-flyt til de låste produktavgjørelsene D1–D7.
 *
 * Metodikke:
 * - Siden renderes med renderToStaticMarkup (node-omgivelser, som glasscard-testen).
 * - Copy-guards kjører på den renderede tekst (uten HTML-tagger), så de fanger
 *   det brukeren faktisk ser — ikke kodekommentarer.
 * - MOT-11 (bokmål): full språkvakt kjører i `npm run verify:lang` (CI).
 *   Her er en lettviktig undertest mot de høyrisiko-ordene.
 * - MOT-12/13/14 (mobil/keyboard/reduced motion): strukturert i denne testen,
 *   manuelt verifisert i ACT-rapporten.
 * - MOT-17/18/19: `npm run verify` → `npm run lint` → `npm run build` (sekvensiell, CI).
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { JOURNEY } from '@/config/legal';
import { ComparisonRows } from '@/components/motpol/ComparisonRows';

const ROOT = join(__dirname, '..');
function src(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

import MotpolPage from '@/app/motpol/page';

// Render én gang for alle copy-guards.
const HTML: string = renderToStaticMarkup(React.createElement(MotpolPage));
/** Brukervendt tekst: HTML-tagger fjernet. */
const TEXT: string = HTML.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
/** Kun hovedinnholdet — footeren inneholder eksisterende «Priser»-navigasjon. */
const MAIN_TEXT: string = HTML.split('<footer')[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

/** Splitt tekst i setninger for negasjon-sjekker (MOT-04/08). */
function sentences(t: string): string[] {
  return t
    .split(/(?<=[.?!:])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

describe('MOT-01 — /motpol renderes med H1 «Motpol»', () => {
  it('ruten og layouten finnes', () => {
    expect(existsSync(join(ROOT, 'app/motpol/page.tsx'))).toBe(true);
    expect(existsSync(join(ROOT, 'app/motpol/layout.tsx'))).toBe(true);
  });

  it('renderer en H1 med teksten «Motpol» og konsepttittelen', () => {
    expect(HTML).toMatch(/<h1[^>]*>[\s\S]*?Motpol[\s\S]*?<\/h1>/);
    expect(TEXT).toContain('Et annet svar på moderne dating.');
  });

  it('har nøyaktig én H1 (heading-hierarki, plan §19)', () => {
    const h1Count = (HTML.match(/<h1[\s>]/g) || []).length;
    expect(h1Count).toBe(1);
  });
});

describe('MOT-02 — canonical = https://www.tosom.no/motpol', () => {
  it('layoutet setter canonical /motpol (metadataBase gir host)', () => {
    const layout = src('app/motpol/layout.tsx');
    expect(layout).toContain('canonical: "/motpol"');
    const root = src('app/layout.tsx');
    expect(root).toContain('new URL("https://www.tosom.no")');
  });

  it('metadata-tittelen følger D5', () => {
    const layout = src('app/motpol/layout.tsx');
    expect(layout).toContain('Motpol – et annet svar på moderne dating | Tosom');
  });
});

describe('MOT-03 — indexable (index/follow, ikke noindex)', () => {
  it('layoutet er index+follow og ingen noindex i siden', () => {
    const layout = src('app/motpol/layout.tsx');
    expect(layout).toContain('index: true');
    expect(layout).toContain('follow: true');
    expect(layout).not.toContain('noindex');
    expect(src('app/motpol/page.tsx')).not.toContain('noindex');
  });

  it('robots blokkerer kun /admin og /api', () => {
    const robots = src('app/robots.ts');
    expect(robots).toContain('"/admin"');
    expect(robots).toContain('"/api"');
    expect(robots).not.toContain('/motpol');
  });

  it('/motpol ligger i sitemap som offentlig side', () => {
    const sitemap = src('app/sitemap.ts');
    expect(sitemap).toContain('"/motpol"');
    expect(sitemap).toMatch(/\/motpol",\s*priority:\s*0\.7/);
  });
});

describe('MOT-04 — ingen matchgaranti', () => {
  it('ingen «garanti»-påstand i teksten', () => {
    expect(TEXT.toLowerCase()).not.toContain('garanti');
  });

  it('ingen «lovet»-påstand i teksten', () => {
    expect(TEXT.toLowerCase()).not.toContain('lovet');
  });

  it('«hver uke» forekommer kun i negasjon (sannhetsmodell)', () => {
    const withUke = sentences(TEXT).filter((s) => s.toLowerCase().includes('hver uke'));
    expect(withUke.length).toBeGreaterThanOrEqual(1);
    for (const s of withUke) {
      expect(s.toLowerCase()).toContain('ikke');
    }
  });
});

describe('MOT-05 — 14-dagerscopy samsvarer med implementasjon (M-6)', () => {
  it('konfigen sier dag 15 / 30 dager (ingen drift mellom copy og engine)', () => {
    expect(JOURNEY.imageUnlockDay).toBe(15);
    expect(JOURNEY.totalDays).toBe(30);
  });

  it('siden sier «dag 15» og «de første 14 dagene»', () => {
    expect(TEXT).toContain('dag 15');
    expect(TEXT.toLowerCase()).toContain('de første 14 dagene');
  });
});

describe('MOT-06 — ingen udokumenterte «ingen AI»-garantier (deteksjons-påstander)', () => {
  it('påstår verken oppdagelse eller forhindreelse av AI-bruk', () => {
    const lower = TEXT.toLowerCase();
    expect(lower).not.toContain('oppdager');
    expect(lower).not.toContain('forhindrer');
    expect(lower).not.toContain('detekterer');
    // Ingen absolutt «INGEN AI»-banner
    expect(lower).not.toContain('ingen ai, ');
  });

  it('AI-linjen er den dokumenterte PF-setningen fra vilkårene', () => {
    expect(TEXT).toContain(
      'det finnes ingen AI som skriver meldinger, gir råd eller opptar som samtalepartner',
    );
  });
});

describe('MOT-07 — ingen falsk-profil-garanti', () => {
  it('påstår ikke at alle profiler er sanne eller at falske profiler er fraværende', () => {
    const lower = TEXT.toLowerCase();
    expect(lower).not.toContain('alle profiler er sanne');
    expect(lower).not.toContain('ingen falske');
    expect(lower).not.toContain('alle er verifisert');
    expect(lower).not.toContain('100% sanne');
  });

  it('beholder ærlighetslinjen (ingen plattform kan love sannhet)', () => {
    expect(TEXT).toContain('Vi kan ikke love at alle profiler er like sanne');
  });
});

describe('MOT-08 — ingen betaling/Vipps-copy (D2, PENDING A/B)', () => {
  it('ingen betalingsterminologi i teksten', () => {
    const lower = TEXT.toLowerCase();
    const funnet = ['vipps', 'abonnement', 'betaling', 'kroner', 'krone', 'gratis', '349', 'pris på', 'betale'].filter((w) => lower.includes(w));
    expect(funnet).toEqual([]);
  });

  it('«pris» forekommer kun i godkjente metaforiske kontekster (trade-off)', () => {
    const godkjent = (s: string) =>
      /reell pris|hva prisene er|og en pris|har også en pris/i.test(s);
    const prisSetninger = sentences(MAIN_TEXT).filter((s) => /pris/i.test(s));
    expect(prisSetninger.length).toBeGreaterThan(0);
    expect(prisSetninger).toEqual(prisSetninger.filter(godkjent));
  });
});

describe('MOT-09 — ZERO research claims / citations (v1)', () => {
  it('ingen forskningsreferanser i teksten', () => {
    const lower = TEXT.toLowerCase();
    const funnet = ['studie', 'studier', 'forskning', 'beviser', 'viser at', 'psykolog', 'doi', 'artikkel', 'forsker'].filter((w) => lower.includes(w));
    expect(funnet).toEqual([]);
  });

  it('ingen eksterne kilder/DOI-mønster i kildekoden', () => {
    const page = src('app/motpol/page.tsx');
    expect(page).not.toMatch(/10\.\d{4,9}\//); // DOI-mønster
  });
});

describe('MOT-10 — Tosom-brand korrekt (ikke ToSom/TOSOM)', () => {
  it('rendered tekst inneholder aldri «ToSom»/«TOSOM»', () => {
    expect(HTML).not.toContain('>ToSom');
    expect(TEXT).not.toMatch(/ToSom|TOSOM/);
  });

  it('metadata bruker «Tosom»', () => {
    const layout = src('app/motpol/layout.tsx');
    expect(layout).toContain('| Tosom');
    expect(layout).not.toMatch(/ToSom|TOSOM/);
  });
});

describe('MOT-11 - bokmaal (samme liste som CI verify:lang)', () => {
  // Parser NYNORSK_WORDS direkte fra scripts/verify-language.mjs - EN kilde.
  // Ingen nynorsk-literaler i denne filen: språkvakten skanner ogsa __tests__/.
  function nynorskWords(): string[] {
    const script = src('scripts/verify-language.mjs');
    const m = script.match(/const NYNORSK_WORDS = \[([\s\S]*?)\];/);
    expect(m).not.toBeNull();
    const raw = m ? m[1].match(/"([^"]+)"/g) : null;
    const words = (raw || []).map((w) => w.slice(1, -1));
    expect(words.length).toBeGreaterThan(100);
    return words;
  }

  it('rendered tekst er bokmaal (word-boundary, som CI)', () => {
    const words = nynorskWords();
    const pattern = new RegExp('\\b(' + words.join('|') + ')\\b', 'gi');
    const m = TEXT.match(pattern);
    expect(m).toBeNull();
  });
});

describe('MOT-12 — mobil (strukturert del; 360px manuell i ACT-rapport)', () => {
  it('siden bruker ingen faste pikselbredder (kun max- som øvre grense)', () => {
    const page = src('app/motpol/page.tsx');
    // max-w-[...px] er tillatt (skallegrense), fast w-[...px]/min-w er ikke
    expect(page).not.toMatch(/(^|\s)w-\[\d{3,}px\]/);
    expect(page).not.toMatch(/min-w-\[\d{3,}px\]/);
  });

  it('sammenligningen er mobil-først (1 kolonne → 2 på md)', () => {
    const cmp = renderToStaticMarkup(
      React.createElement(ComparisonRows, {
        rows: [{ standard: 'A', tosom: 'B' }],
      }),
    );
    expect(cmp).toContain('grid-cols-1');
    expect(cmp).toContain('md:grid-cols-2');
  });
});

describe('MOT-13 — keyboard/focus (strukturert del; manuell pass i ACT-rapport)', () => {
  it('all navigasjon går gjennom fokusert <a>-elementer (ingen onClick-navigasjon)', () => {
    const page = src('app/motpol/page.tsx');
    expect(page).not.toContain('onClick');
    expect(HTML).toContain('href="/register"');
  });

  it('heading-hierarkiet er H1 → H2 → H3 (ingen hopp)', () => {
    const order = HTML.match(/<h[1-6][\s>]/g) || [];
    let prev = 0;
    for (const h of order) {
      const level = Number(h[2]);
      expect(level).toBeLessThanOrEqual(prev + 1);
      prev = level;
    }
  });
});

describe('MOT-14 — prefers-reduced-motion (strukturert del; manuell pass i ACT-rapport)', () => {
  it('siden legger til ingen keyframes eller animation', () => {
    const page = src('app/motpol/page.tsx');
    expect(page).not.toContain('@keyframes');
    expect(page).not.toMatch(/animation:/);
  });

  it('ComparisonRows har ingen animasjon eller hover-avhengighet', () => {
    const cmp = renderToStaticMarkup(
      React.createElement(ComparisonRows, {
        rows: [{ standard: 'A', tosom: 'B' }],
      }),
    );
    expect(cmp).not.toContain('animate-');
    expect(cmp).not.toContain('hover:');
    expect(cmp).not.toContain('transition');
  });
});

describe('MOT-15 — interne lenker er gyldige', () => {
  it('alle interne hrefs på siden reslver til eksisterende ruter', () => {
    const hrefs = Array.from(HTML.matchAll(/href="(\/[^"#?]*)"/g)).map((m) => m[1]);
    expect(hrefs.length).toBeGreaterThan(0);
    const brotne = Array.from(new Set(hrefs)).filter((href) => {
      const routeDir = join(ROOT, 'app', ...href.split('/').filter(Boolean));
      return !(
        existsSync(join(routeDir, 'page.tsx')) || existsSync(join(routeDir, 'route.ts'))
      );
    });
    expect(brotne).toEqual([]);
  });

  it('motpol lenker til de godkjente destinasjonene (maks 7, plan §14)', () => {
    const page = src('app/motpol/page.tsx');
    for (const d of ['/register', '/metoder', '/reisen', '/slik-fungerer-det', '/trygghet', '/vilkar', '/hvorfor']) {
      expect(page).toContain(`"${d}"`);
    }
  });
});

describe('MOT-16 — CTA peker til etablert flyt (/register → /login)', () => {
  it('primær CTA «Start reisen» peker til /register', () => {
    expect(HTML).toMatch(/href="\/register"/);
    expect(TEXT).toContain('Start reisen');
  });

  it('/register-flytet er uendret (redirect til /login)', () => {
    const register = src('app/register/page.tsx');
    expect(register).toContain("redirect('/login')");
  });
});

describe('D1 — navigasjonsendringer (footer + kontekstuelle lenker)', () => {
  it('footer inneholder Motpol i den offentlige delen', () => {
    const footer = src('components/ui/layout/Footer.tsx');
    expect(footer).toMatch(/label:\s*'Motpol',\s*href:\s*'\/motpol'/);
  });

  it('/hvorfor lenker kontekstualt til /motpol', () => {
    const hvorfor = src('app/hvorfor/page.tsx');
    expect(hvorfor).toContain('href="/motpol"');
  });

  it('/slik-fungerer-det lenker kontekstualt til /motpol', () => {
    const sfd = src('app/slik-fungerer-det/page.tsx');
    expect(sfd).toContain('href="/motpol"');
  });

  it('hovedmenyen (UniversalMenu) er uendret — ingen Motpol i v1', () => {
    const menu = src('components/layout/UniversalMenu.tsx');
    expect(menu).not.toContain('/motpol');
  });

  it('landing-siden er uendret (D4: ingen teaser i v1)', () => {
    const landing = src('app/(landing)/page.tsx');
    expect(landing).not.toContain('/motpol');
  });
});

describe('D2 — sammenligningen har ingen betalingsrad', () => {
  it('_comparisonRows-dataen inneholder kun de 5 PF-radene_', () => {
    const page = src('app/motpol/page.tsx');
    const rad = (t: string) => (page.split(t).length - 1);
    for (const t of [
      'Mange profiler å vurdere',
      'Utseende før innhold',
      'Sveiping og øyeblikksvalg',
      'Flere parallelle samtaler',
      'Profilen er vitrine',
    ]) {
      expect(rad(t)).toBeGreaterThanOrEqual(1);
    }
    // Ingen betaling/Vipps i sammenligningsradene
    const cmpBlock = page.slice(page.indexOf('comparisonRows'));
    expect(cmpBlock).not.toMatch(/vipps|abonnement|betaling|kroner/i);
  });
});

describe('ComparisonRows — tilgjengelighet (plan §17/§19)', () => {
  const rows = [
    { standard: 'Mange profiler å vurdere', tosom: 'Én match om gangen' },
    { standard: 'Profilen er vitrine', tosom: 'Profilen er privat' },
  ];
  const cmp = renderToStaticMarkup(React.createElement(ComparisonRows, { rows }));

  it('er semantisk <dl> med <dt>/<dd> per celle', () => {
    expect(cmp).toContain('<dl');
    expect(cmp).toContain('<dt');
    expect(cmp).toContain('<dd');
    // én dt per celle (2 celler × 2 rader)
    expect((cmp.match(/<dt/g) || []).length).toBe(4);
  });

  it('har kontekstlabel (aria-label) og synlig/sr-etiketter', () => {
    expect(cmp).toContain('aria-label="Sammenligning:');
    expect(cmp).toContain('En vanlig modell');
    expect(cmp).toContain('Tosom');
  });

  it('er ikke avhengig av hover eller JS (renderes fullt statisk)', () => {
    expect(cmp).toContain('Mange profiler å vurdere');
    expect(cmp).toContain('Profilen er privat');
  });
});
