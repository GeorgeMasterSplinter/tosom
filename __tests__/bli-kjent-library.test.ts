/**
 * ACT BLI KJENT LIBRARY V2 — BQ-01 … BQ-15
 *
 * Biblioteket er redusert fra 240 (12×20) til 180 (12×15) spørsmål.
 * Disse vaktene låser den nye truth-claimen mot canonical source
 * (app/questions/data/questions.ts) og mot aktive runtime-filer.
 *
 * Metodikk: data-assertioner på questionCategories + renderToStaticMarkup
 * på /questions-siden + source-guards (fs-lesing) på panel, side og
 * offentlig copy. Testene er strukturelle — ikke språkpoliti.
 *
 * Sannhetsgrunnlag: docs/BLI-KJENT-INVENTORY-v2.0.md +
 * docs/BLI-KJENT-V2-EDITORIAL-REPORT.md (Library V2, 28.10.2026).
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

/** Brukervendt tekst: HTML-tagger fjernet, entity-encoding dekoddet. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ');
}

/** Alle .ts/.tsx-filer under en mappe, som relative stier. */
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

import {
  questionCategories,
  getRandomQuestion,
  getCategoriesWithCounts,
} from '@/app/questions/data/questions';
import QuestionsPage from '@/app/questions/page';

// Rendret én gang for alle copy-guards.
const QUESTIONS_PAGE_HTML = stripHtml(
  renderToStaticMarkup(React.createElement(QuestionsPage))
);

const ALL_QUESTIONS = questionCategories.flatMap((c) => c.questions);

describe('BLI KJENT LIBRARY V2 — struktur (BQ-01 … BQ-05, BQ-13 … BQ-15)', () => {
  test('BQ-01: nøyaktig 12 kategorier', () => {
    expect(questionCategories.length).toBe(12);
  });

  test('BQ-02: nøyaktig 15 spørsmål per kategori', () => {
    for (const c of questionCategories) {
      expect(c.questions.length).toBe(15);
    }
  });

  test('BQ-03: nøyaktig 180 spørsmål totalt', () => {
    expect(ALL_QUESTIONS.length).toBe(180);
  });

  test('BQ-04: ingen eksakte duplikate spørsmål', () => {
    const normalized = ALL_QUESTIONS.map((q) => q.trim().toLowerCase());
    expect(new Set(normalized).size).toBe(180);
  });

  test('BQ-05: kategori-ID-ene er unike', () => {
    const ids = questionCategories.map((c) => c.id);
    expect(new Set(ids).size).toBe(12);
  });

  test('BQ-13: ingen tomme kategorier eller spørsmål', () => {
    for (const c of questionCategories) {
      expect(c.name.trim().length).toBeGreaterThan(0);
      expect(c.questions.length).toBeGreaterThan(0);
      for (const q of c.questions) {
        expect(q.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('BQ-14: alle spørsmål er trimmede, ikke-tomme og spørsmål', () => {
    for (const c of questionCategories) {
      for (const q of c.questions) {
        expect(q).toBe(q.trim());
        expect(q.length).toBeGreaterThan(0);
        expect(q.endsWith('?')).toBe(true);
      }
    }
  });

  test('BQ-15: ingen tilnærmede duplikater oppstått ved omwriting', () => {
    // Normalisering: små bokstaver, kun bokstaver/sifre. Fanger duplikater
    // som bare skiller seg i interpunktering eller whitespace.
    const normalized = ALL_QUESTIONS.map((q) =>
      q.toLowerCase().replace(/[^a-z\u00e6\u00f8\u00e50-9]/g, '')
    );
    expect(new Set(normalized).size).toBe(180);
  });
});

describe('BLI KJENT LIBRARY V2 — innholdsguards (BQ-06 … BQ-07)', () => {
  test('BQ-06: ingen overgrep-ordlyd fra Q-108 i biblioteket', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q).not.toMatch(/overgrep/i);
    }
  });

  test('BQ-07: ingen «Nå er ærligheten»-artefakter i biblioteket', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q).not.toMatch(/nå er ærligheten/i);
    }
  });
});

describe('BLI KJENT LIBRARY V2 — truth-claims (BQ-08 … BQ-09)', () => {
  // Aktive filer der en «240 spørsmål»- eller «20 per kategori»-påstand
  // ville være en public/runtime truth-claim. Historiske audit-dokumenter
  // i docs/ er bevisst unntatt (de bevarende bildet på audit-tidspunktet).
  const activeFiles = [...listFiles('app'), 'public/llms.txt'];

  test('BQ-08: ingen aktive «240 spørsmål»-påstander', () => {
    for (const rel of activeFiles) {
      const src = read(rel);
      expect({ file: rel, match: /240\s*spørsmål/i.test(src) }).toEqual({
        file: rel,
        match: false,
      });
      expect({ file: rel, match: /12\s*[×x]\s*20/i.test(src) }).toEqual({
        file: rel,
        match: false,
      });
    }
  });

  test('BQ-09: ingen aktive «20 spørsmål per kategori»-påstander', () => {
    for (const rel of activeFiles) {
      const src = read(rel);
      expect({ file: rel, match: /20\s*spørsmål/i.test(src) }).toEqual({
        file: rel,
        match: false,
      });
    }
  });
});

describe('BLI KJENT LIBRARY V2 — runtime-forbruk (BQ-10 … BQ-12)', () => {
  test('BQ-10: /questions-siden render alle 12 kategorier med riktig data', () => {
    for (const c of questionCategories) {
      expect(QUESTIONS_PAGE_HTML).toContain(c.name);
    }
    // Én «15 spørsmål»-label per kategori, ingen «20 spørsmål».
    expect((QUESTIONS_PAGE_HTML.match(/15 spørsmål/g) || []).length).toBe(12);
    expect(QUESTIONS_PAGE_HTML).not.toContain('20 spørsmål');
  });

  test('BQ-11: BliKjentPanel forbruker canonical source', () => {
    const panel = read('app/chat/components/BliKjentPanel.tsx');
    expect(panel).toMatch(/from ['"]@\/app\/questions\/data\/questions['"]/);
    expect(panel).toMatch(/questionCategories/);
    // Panelet definerer ikke sitt eget hardkodete spørsmåls-array.
    expect(panel).not.toMatch(/:\s*string\[\]\s*=\s*\[/);
  });

  test('BQ-12: ingen runtime-avhengighet av fjernede indeks eller fast 20-tall', () => {
    const runtimeFiles = [
      'app/questions/data/questions.ts',
      'app/questions/page.tsx',
      'app/chat/components/BliKjentPanel.tsx',
    ];
    for (const rel of runtimeFiles) {
      const src = read(rel);
      expect({ file: rel, match: /questions\[\d+\]/.test(src) }).toEqual({
        file: rel,
        match: false,
      });
      expect({ file: rel, match: /slice\(0,\s*20\)/.test(src) }).toEqual({
        file: rel,
        match: false,
      });
      expect({ file: rel, match: /\.length\s*===?\s*20\b/.test(src) }).toEqual({
        file: rel,
        match: false,
      });
    }
    // Helperne baserer seg på data, ikke på faste tall.
    expect(getCategoriesWithCounts().length).toBe(12);
    for (const c of getCategoriesWithCounts()) {
      expect(c.count).toBe(15);
    }
    // Ukjent kategori gir null; kjent kategori gir alltid et spørsmål
    // (fallback til hele listen når historien dekker alt).
    expect(getRandomQuestion('finnes-ikke')).toBeNull();
    expect(
      getRandomQuestion('personlighet', questionCategories[0].questions)
    ).not.toBeNull();
  });
});

