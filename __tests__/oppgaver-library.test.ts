/**
 * ACT OPPGAVER LIBRARY V2 — OT-01 … OT-18
 *
 * Biblioteket er holdt på 9 kategorier × 15 oppgaver = 135 totalt, men
 * innholdet er gjennomsyret (V2). Disse vaktene låser strukturen, saniteten
 * og runtime-forbruket mot canonical source (app/chat/data/tasks.ts) og mot
 * det aktive chat-panelet (OppgaverPanel.tsx).
 *
 * Metodikk: data-assertioner på taskCategories + fs-lesing på panelet.
 * Testene er strukturelle — ikke generelt språkpoliti.
 *
 * Sannhetsgrunnlag: docs/OPPGAVER-INVENTORY-v2.0.md +
 * docs/OPPGAVER-V2-EDITORIAL-REPORT.md (Library V2, 29.10.2026).
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { taskCategories } from '@/app/chat/data/tasks';

const ROOT = join(__dirname, '..');

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

const ALL_TASKS = taskCategories.flatMap((c) => c.tasks);
const PANEL = 'app/chat/components/OppgaverPanel.tsx';
const SOURCE = 'app/chat/data/tasks.ts';

describe('OPPGAVER LIBRARY V2 — struktur (OT-01 … OT-05)', () => {
  test('OT-01: nøyaktig 9 kategorier', () => {
    expect(taskCategories.length).toBe(9);
  });

  test('OT-02: nøyaktig 15 oppgaver per kategori', () => {
    for (const c of taskCategories) {
      expect(c.tasks.length).toBe(15);
    }
  });

  test('OT-03: nøyaktig 135 oppgaver totalt', () => {
    expect(ALL_TASKS.length).toBe(135);
  });

  test('OT-04: ingen eksakte duplikate oppgaver', () => {
    const normalized = ALL_TASKS.map((t) => t.trim().toLowerCase());
    expect(new Set(normalized).size).toBe(135);
  });

  test('OT-05: kategori-ID-ene er unike', () => {
    const ids = taskCategories.map((c) => c.id);
    expect(new Set(ids).size).toBe(9);
  });
});

describe('OPPGAVER LIBRARY V2 — sanitet (OT-06 … OT-13)', () => {
  test('OT-06: ingen «fetish»-oppgave', () => {
    for (const t of ALL_TASKS) {
      expect(t).not.toMatch(/fetish/i);
    }
  });

  test('OT-07: ingen TASK-108-artefakter (Landsby / Stum di / Dance Monkey)', () => {
    for (const t of ALL_TASKS) {
      expect(t).not.toMatch(/Landsby|Stum di|Dance Monkey/i);
    }
  });

  test('OT-08: ingen «tynn pels»', () => {
    for (const t of ALL_TASKS) {
      expect(t).not.toMatch(/tynn pels/i);
    }
  });

  test('OT-09: ingen «festet stemning»', () => {
    for (const t of ALL_TASKS) {
      expect(t).not.toMatch(/festet stemning/i);
    }
  });

  test('OT-10: ingen ødelagt «enrett/toretter»', () => {
    for (const t of ALL_TASKS) {
      expect(t).not.toMatch(/enrett|toretter/i);
    }
  });

  test('OT-11: ingen «Refrengets»', () => {
    for (const t of ALL_TASKS) {
      expect(t).not.toMatch(/Refrengets/i);
    }
  });

  test('OT-12: ingen oppgave som omgår foto-dag-8 med eksplisitt utseende-avsløring', () => {
    // Smal vakt: flagg bare oppgaver som direkte ber om å beskrive egen fysisk
    // utforming (utseende/hår/klær/kropp/tatoveringer) slik at fotokonseptet
    // undergraves. «Velg en genser», «velg lys» osv. er kos-valg, ikke
    // utseende-beskrivelse, og må ikke trigge.
    const appearanceDisclosure =
      /beskriv (ditt|din) (utseende|fysikk|kropp|hår|utstyrt)|hvordan ser du ut|ser du ut (som|ut)|beskriv (ditt|din) (hår|klær|kropp|tatoveringer)|fortell meg hvordan du ser ut/i;
    for (const t of ALL_TASKS) {
      expect({ task: t, match: appearanceDisclosure.test(t) }).toEqual({
        task: t,
        match: false,
      });
    }
  });

  test('OT-13: ingen tomme oppgaver eller tomme kategorier', () => {
    for (const c of taskCategories) {
      expect(c.id.trim().length).toBeGreaterThan(0);
      expect(c.name.trim().length).toBeGreaterThan(0);
      expect(c.tasks.length).toBeGreaterThan(0);
      for (const t of c.tasks) {
        expect(t).toBe(t.trim());
        expect(t.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe('OPPGAVER LIBRARY V2 — runtime-forbruk (OT-14 … OT-18)', () => {
  const panelSrc = read(PANEL);
  const sourceSrc = read(SOURCE);

  test('OT-14: OppgaverPanel forbruker canonical source (ingen eget hardkodet array)', () => {
    expect(panelSrc).toMatch(/from\s+['"]@\/app\/chat\/data\/tasks['"]/);
    expect(panelSrc).toMatch(/taskCategories/);
    // Panelet definerer ikke sitt eget hardkodete oppgave-array.
    expect(panelSrc).not.toMatch(/:\s*string\[\]\s*=\s*\[/);
  });

  test('OT-15: ingen hardkodet indeks eller fast 15-tall i runtime-logikk', () => {
    // «9 × 15 = 135» i kommentarer er en ærlig count og tillatt; det vi vakter
    // er logikk som er avhengig av et fast tall eller en hardkodet indeks.
    for (const src of [sourceSrc, panelSrc]) {
      expect(src).not.toMatch(/tasks\[\d+\]/);
      expect(src).not.toMatch(/\.slice\(0,\s*15\)/);
      expect(src).not.toMatch(/\.length\s*===?\s*15\b/);
    }
  });

  test('OT-16: alle kategorier er tilgjengelige (id, navn, ikon, farge, oppgaver)', () => {
    for (const c of taskCategories) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.icon).toBeTruthy();
      expect(c.color).toBeTruthy();
      expect(c.tasks.length).toBe(15);
    }
  });

  test('OT-17: oppgaver sendes som metadata.source = "oppgave"', () => {
    expect(panelSrc).toMatch(/source:\s*['"]oppgave['"]/);
  });

  test('OT-18: ingen matching-avhengighet i oppgavekilden', () => {
    expect(sourceSrc).not.toMatch(/from\s+['"].*match/i);
    // tasks.ts er ren data — ingen imports i det hele tatt.
    expect(sourceSrc).not.toMatch(/^import\b/m);
  });
});