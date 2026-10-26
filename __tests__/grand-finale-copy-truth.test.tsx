/**
 * GRAND FINALE COPY REVIEW (26.10.2026) — målrettede truth-guards
 *
 * Komplementerer free-beta-truth.test.tsx (FB-01…FB-20). Fanger bare
 * KLART uønskede, konkrete formuleringer i aktiv, offentlig copy —
 * ikke vanlige norske ord. Redaksjonell vurdering skjer i
 * docs/GRAND-FINALE-COPY-REVIEW-v1.0.md.
 *
 * Guards:
 *  GF-01: ingen «vitenskapelig matching» / «vitenskapelig bevist»-claim
 *  GF-02: ingen klinisk-test-/diagnose-claim (negasjon er tillatt:
 *         «ikke et klinisk skjema» skal fortsette å være OK)
 *  GF-03: ingen «matchgaranti» i offentlig copy
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

/**
 * Fjerner kodekommentarer slik at guards kun måler aktiv copy.
 * `//` regnes som kommentar kun når den starter linjen eller følger
 * hvitrom (slår ikke feil på «https://» i strenger).
 */
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

/** Offentlige, brukerrettede sider (samme sett som free-beta-truth). */
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

describe('GF-01: ingen vitenskapelig-matching-claim i offentlig copy', () => {
  const patterns = [/vitenskapelig matching/i, /vitenskapelig bevist/i, /vitenskapelig beviser/i];
  for (const rel of publicPageFiles()) {
    test(`${rel} inneholder ingen vitenskapelig-claim`, () => {
      const src = stripComments(read(rel));
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`${rel} inneholder ${p}`);
      }
    });
  }
});

describe('GF-02: ingen klinisk-test-/diagnose-claim i offentlig copy', () => {
  // Positiv bruk av «klinisk» som avgrensning er tillatt, f.eks.
  // «ikke et standardisert eller klinisk personlighetsskjema».
  const patterns = [
    /klinisk diagnose/i,
    /klinisk vurdering/i,
    /klinisk instrument/i,
  ];
  for (const rel of publicPageFiles()) {
    test(`${rel} inneholder ingen klinisk-claim`, () => {
      const src = stripComments(read(rel));
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`${rel} inneholder ${p}`);
      }
    });
  }
});

describe('GF-03: ingen matchgaranti i offentlig copy', () => {
  const pattern = /matchgaranti/i;
  for (const rel of publicPageFiles()) {
    test(`${rel} inneholder ingen matchgaranti`, () => {
      const src = stripComments(read(rel));
      if (pattern.test(src)) throw new Error(`${rel} inneholder ${pattern}`);
    });
  }
});
