/**
 * PLAIN NORWEGIAN FINAL — PLAIN-01…PLAIN-10 truth-guards
 *
 * Fanger bare konkrete, uønskede produkt- og matching-claim i aktiv,
 * offentlig copy. Stil/AI-tone vurderes manuelt
 * (docs/PLAIN-NORWEGIAN-COPY-FINAL-v1.0.md) — ikke i Jest.
 *
 * Guards:
 *  PLAIN-01: 0 aktive 30-dagers-reise-claim
 *  PLAIN-02: 0 dag-15-bilde-claim
 *  PLAIN-03: Metoder inneholder ikke «Gammelt tre, nye grener»
 *  PLAIN-04: ingen «vitenskapelig matching»-positivclaim
 *  PLAIN-05: ingen matchgaranti
 *  PLAIN-06: «fysisk tiltrekning» brukes ikke som scoring-input
 *  PLAIN-07: ingen offentlig «Vipps verifisert identitet/alder»-claim
 *  PLAIN-08: ingen garanti for at brukere «kjenner hverandre» ved dag 8
 *  PLAIN-09: ingen «mennesker er ikke skapt for å gå gjennom livet alene»
 *  PLAIN-10: ingen «de to som svinger sammen»-matchinglove
 *  PLAIN-11: Metoder-copy inneholder ikke rytme/melodi-metaforer
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

/** Offentlige, brukerrettede sider (samme sett som grand-finale-copy-truth). */
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

const FILES = publicPageFiles();

describe('PLAIN-01: 0 aktive 30-dagers-reise-claim i offentlig copy', () => {
  const patterns = [
    /30[-\s]dagers\s+(reise|kjærlighet|samtale)/i,
    /\b(reise|reiser|samtalen)\b[^.\n]{0,40}30[-\s]dager/i,
    /reise[^.\n]{0,40}varer (i )?30/i,
  ];
  for (const rel of FILES) {
    test(`${rel}: ingen 30-dagers-reise-claim`, () => {
      const src = stripComments(read(rel));
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`${rel} inneholder 30-dagers-reise-claim: ${p}`);
      }
    });
  }
});

describe('PLAIN-02: 0 dag-15-bilde-claim i offentlig copy', () => {
  const patterns = [
    /\bdag 15\b/i,
    /14 dager uten bilder/i,
    /første 14 dagene/i,
  ];
  for (const rel of FILES) {
    test(`${rel}: ingen dag-15-/14-uten-bilder-claim`, () => {
      const src = stripComments(read(rel));
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`${rel} inneholder ${p}`);
      }
    });
  }
});

describe('PLAIN-03: ingen «Gammelt tre, nye grener» i offentlig copy', () => {
  for (const rel of FILES) {
    test(`${rel}: ingen «Gammelt tre, nye grener»`, () => {
      const src = stripComments(read(rel));
      if (/gammelt tre/i.test(src)) throw new Error(`${rel} inneholder «gammelt tre»`);
    });
  }
});

describe('PLAIN-04: ingen vitenskapelig-matching-positivclaim i offentlig copy', () => {
  const patterns = [/vitenskapelig matching/i, /vitenskapelig bevist/i, /vitenskapelig beviser/i];
  for (const rel of FILES) {
    test(`${rel}: ingen vitenskapelig-matching-claim`, () => {
      const src = stripComments(read(rel));
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`${rel} inneholder ${p}`);
      }
    });
  }
});

describe('PLAIN-05: ingen matchgaranti i offentlig copy', () => {
  const patterns = [
    /matchgaranti/i,
    /vi lover (at |deg )?at? du får en match/i,
    /garanti for (en match|at du får en match|match)/i,
    /du får (alltid|garantert) en match/i,
  ];
  for (const rel of FILES) {
    test(`${rel}: ingen matchgaranti`, () => {
      const src = stripComments(read(rel));
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`${rel} inneholder ${p}`);
      }
    });
  }
});

describe('PLAIN-06: «fysisk tiltrekning» brukes ikke som scoring-input', () => {
  const patterns = [
    /måler (fysisk )?tiltrekning/i,
    /vi (beregner|kartlegger) (fysisk )?tiltrekning/i,
    /tiltrekning (tell(?:er|en|s)|som (vekt|input|poeng))/i,
  ];
  for (const rel of FILES) {
    test(`${rel}: ingen tiltrekning-scorings-claim`, () => {
      const src = stripComments(read(rel));
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`${rel} inneholder ${p}`);
      }
    });
  }
});

describe('PLAIN-07: ingen offentlig «Vipps verifisert identitet/alder»-claim', () => {
  const patterns = [
    /vipps[-\s]verifisert/i,
    /vipps (bekrefter|verifiserer)/i,
    /verifisert (identitet|alder)[^\n.]{0,60}vipps/i,
  ];
  for (const rel of FILES) {
    test(`${rel}: ingen Vipps-verifisert-claim`, () => {
      const src = stripComments(read(rel));
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`${rel} inneholder ${p}`);
      }
    });
  }
});

describe('PLAIN-08: ingen garanti for at brukere «kjenner hverandre» ved dag 8', () => {
  const patterns = [
    /kjenner dere hverandre som mennesker/i,
    /har dere (allerede )?lært å kjenne hverandre/i,
    /nå kjenner dere (hverandre|personen)/i,
    /lære hverandre å kjenne som mennesker/i,
  ];
  for (const rel of FILES) {
    test(`${rel}: ingen «kjenner hverandre»-garanti`, () => {
      const src = stripComments(read(rel));
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`${rel} inneholder ${p}`);
      }
    });
  }
});

describe('PLAIN-09: ingen «mennesker er ikke skapt for å gå gjennom livet alene»', () => {
  for (const rel of FILES) {
    test(`${rel}: ingen ensomhets-manifest`, () => {
      const src = stripComments(read(rel));
      if (/mennesker er ikke skapt for å gå gjennom livet alene/i.test(src)) {
        throw new Error(`${rel} inneholder ensomhets-manifest`);
      }
    });
  }
});

describe('PLAIN-10: ingen «de to som svinger sammen»-matchinglove', () => {
  const patterns = [/de to som svinger/i, /svinger sammen/i];
  for (const rel of FILES) {
    test(`${rel}: ingen resonans-svinging-claim`, () => {
      const src = stripComments(read(rel));
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`${rel} inneholder ${p}`);
      }
    });
  }
});

describe('PLAIN-11: aktiv Metoder-copy inneholder ikke rytme/melodi-metaforer', () => {
  // Scopet til Metoder-siden: «melodi» og «rytme» er vanlige norske ord
  // ellers — kun metaforbruken i matchforklaringen er uønsket.
  const rel = 'app/metoder/page.tsx';
  // «rytme» må være et selvstendig ord (metaforbruken «Alle har en rytme») —
  // konkrete sammennævningsfaktorer som «hverdagsrytme»/«livsrytme» i
  // praktisk resonans er tillatt produktfakt.
  const patterns = [
    /melodi/i,
    /\brytme(?:n)?\b/i,
    /riktig takt/i,
    /svinger sammen/i,
    /forsterker hverandre/i,
  ];
  test(`${rel}: ingen rytme/melodi/riktig-takt/svinge-metaforer`, () => {
    const src = stripComments(read(rel));
    for (const p of patterns) {
      if (p.test(src)) throw new Error(`${rel} inneholder metafore: ${p}`);
    }
  });
});