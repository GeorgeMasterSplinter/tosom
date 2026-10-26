/**
 * ACT P1A — FREE BETA TRUTH GUARDS (FB-01…FB-19)
 *
 * Hele det offentlige Tosom skal beskrive den samme virkeligheten:
 *  - Tosom er gratis for de 5 000 første PERSONENE (kvoten i koden teller
 *    personer, ikke reiser: én atomisk claim ved kø-inngang, beholdes gjennom
 *    new_journey — se lib/payment/freeQuota.ts)
 *  - 349 kr + Vipps er PLANLAGT fremtidig pris — ikke en betaling som
 *    kreves nå
 *  - Ingen Vipps-verifisert identitet/alder-claims før funksjonaliteten
 *    finnes og er verifisert
 *  - Ingen refundgaranti, ingen abonnementspåstand, ingen matchgaranti
 *  - Queue/onboarding krever ikke betaling
 *
 * Metodikke: renderToStaticMarkup på offentlige sider (det brukeren faktisk
 * ser) + source-guards (fs-lesing) på kvotelogikk, config, e-postmaler og
 * sider der statisk render ikke fanger alt (f.eks. FAQ-akkordeon).
 *
 * Sannhetsgrunnlag: docs/PAYMENT-VIPPS-TRUTH-PLAN-v1.0.md (HEAD cd04d32) +
 * config/legal.ts PRICING (kanonisk priskilde) + Georges produktbeslutninger
 * D1–D7 (FREE BETA FIRST, PAID V1 LATER).
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

import { PRICING } from '@/config/legal';
import { isPaymentsEnabled } from '@/config/features';
import LandingPage from '@/app/(landing)/page';
import PriserPage from '@/app/priser/page';
import MotpolPage from '@/app/motpol/page';

// Render én gang for alle copy-guards.
const LANDING_TEXT = stripHtml(renderToStaticMarkup(React.createElement(LandingPage)));
const PRISER_TEXT = stripHtml(renderToStaticMarkup(React.createElement(PriserPage)));
const MOTPOL_TEXT = stripHtml(renderToStaticMarkup(React.createElement(MotpolPage)));

/**
 * Kvoten slik toLocaleString('nb-NO') skriver den: 5000 → «5 000».
 * Separator kan være vanlig mellomrom eller non-breaking space avhengig av
 * ICU-versjon — derfor begge.
 */
const KAP = /5[\s\u00A0\u202F]?000/;

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

/**
 * Offentlige sider i prod der truth-guards gjelder. /api og /admin er ikke
 * brukerrettet i denne forstand; /register/vipps er død placeholder (404 i
 * prod, PL-20) og hører med i P2 TECH CLEANUP.
 */
function publicPageFiles(): string[] {
  const dirs = new Set([
    '(landing)', 'motpol', 'hvorfor', 'slik-fungerer-det', 'reisen', 'metoder',
    'trygghet', 'priser', 'faq', 'vilkar', 'personvern', 'cookies', 'om-oss',
    'kontakt', 'tilgjengelighet', 'tips', 'blogg', 'samtykke', 'login',
    'register', 'betaling',
  ]);
  return listFiles('app').filter((rel) => {
    const segments = rel.split('/');
    if (segments.includes('api') || segments.includes('admin')) return false;
    if (rel.startsWith('app/register/vipps/')) return false;
    return segments.some((s) => dirs.has(s));
  });
}

/** Linjer med Vipps-claim må ha fremtidig merkemulighet, ikke nå-tid. */
const FUTURE_MARKER = /når|senere|plan|aktiver|kommer|ved lansering/i;

describe('ACT P1A — free beta truth (FB-01…FB-19)', () => {
  test('FB-01: «5 000 gratis reiser» = 0 aktive brukerrettede treff', () => {
    const pattern = /5[\s\u00A0\u202F]?000[^\n]{0,60}\breiser\b|\breiser\b[^\n]{0,60}gratis/i;
    const treff = publicPageFiles().filter((rel) => pattern.test(read(rel)));
    expect(treff).toEqual([]);
  });

  test('FB-02: godkjent «5 000 personer»-copy finnes på landing og /priser', () => {
    expect(LANDING_TEXT).toMatch(/5[\s\u00A0\u202F]?000[\s\S]{0,25}person/i);
    expect(PRISER_TEXT).toMatch(/5[\s\u00A0\u202F]?000[\s\S]{0,25}person/i);
  });

  test('FB-03: gratisperioden framstilles ikke med oppfunnet sluttdato', () => {
    const treff = publicPageFiles().filter((rel) =>
      /gratis[^\n.]{0,60}frem til|frem til[^\n.]{0,60}gratis/i.test(read(rel)),
    );
    expect(treff).toEqual([]);
    expect(LANDING_TEXT).not.toMatch(/gratis (frem til|til \d)/i);
    expect(PRISER_TEXT).not.toMatch(/gratis (frem til|til \d)/i);
  });

  test('FB-04: 349 framstilles ikke som betaling som kreves nå', () => {
    const markedSomPlan = (text: string, page: string) => {
      const re = /349/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        const before = text.slice(Math.max(0, m.index - 120), m.index);
        if (!/plan/i.test(before)) {
          throw new Error(`349 på ${page} er ikke markert som plan: "…${before}349"`);
        }
      }
    };
    markedSomPlan(LANDING_TEXT, 'landing');
    markedSomPlan(PRISER_TEXT, '/priser');
    expect(MOTPOL_TEXT).not.toContain('349');
    // Kjøpestart-siden (/betaling) viser ingen pris i det hele tatt i gratisbetaen
    expect(read('app/betaling/page.tsx')).not.toMatch(/\b349\b/);
    // Vilkar og FAQ refererer til prisen via PRICING med plan-merking
    expect(read('app/vilkar/page.tsx')).toMatch(/Senere er planen \$\{PRICING\.journeyPrice\}/);
    expect(read('app/faq/page.tsx')).toMatch(/Senere er planen/);
  });

  test('FB-05: /priser skiller gratis nå fra eventuell fremtidig pris', () => {
    expect(PRISER_TEXT).toMatch(/Gratis/i);
    expect(PRISER_TEXT).toMatch(KAP);
    expect(PRISER_TEXT).toContain('349');
    expect(PRISER_TEXT).toMatch(/Senere er planen/);
    expect(PRISER_TEXT).toMatch(/får bruke Tosom gratis/i);
  });

  test('FB-06: FAQ samsvarer med gratisbetaen', () => {
    const src = read('app/faq/page.tsx');
    expect(src).toMatch(/første personene får bruke Tosom gratis/);
    expect(src).toMatch(/PRICING\.freeUserCap/);
    expect(src).toMatch(/PRICING\.journeyPrice/);
    expect(src).toMatch(/Senere er planen/);
    expect(src).not.toMatch(/\breiser\b[^\n]{0,60}gratis/i);
  });

  test('FB-07: landing samsvarer med gratisbetaen', () => {
    expect(LANDING_TEXT).toMatch(KAP);
    expect(LANDING_TEXT).toMatch(/Gratis/i);
    expect(LANDING_TEXT).toMatch(/får bruke Tosom gratis/i);
    expect(LANDING_TEXT).not.toMatch(/\breiser\b[^\n.]{0,60}gratis/i);
  });

  test('FB-08: vilkår motsier ikke gratisflyt', () => {
    const src = read('app/vilkar/page.tsx');
    expect(src).toMatch(/gratis i dag/);
    expect(src).toMatch(/Senere er planen/);
    // Gratisbeta-sperren i angrerett-punktet er intakt:
    expect(src).toMatch(/Så lenge reisen er gratis, har dette punktet ingen økonomisk betydning/);
    expect(src).not.toMatch(/\breiser\b[^\n]{0,60}er gratis/i);
  });

  test('FB-09: ingen aktiv Vipps identity/age-garanti på offentlige sider', () => {
    const treff: string[] = [];
    for (const rel of publicPageFiles()) {
      read(rel).split('\n').forEach((line, i) => {
        const trimmed = line.trim();
        // Kodekommentarer er ikke brukerrettet copy
        if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('{/*')) return;
        if (/vipps/i.test(line) && !FUTURE_MARKER.test(line)) {
          treff.push(`${rel}:${i + 1}`);
        }
      });
    }
    expect(treff).toEqual([]);
  });

  test('FB-10: ingen refundgaranti introdusert på gratis-sidene', () => {
    for (const [text, page] of [
      [LANDING_TEXT, 'landing'],
      [PRISER_TEXT, '/priser'],
      [MOTPOL_TEXT, '/motpol'],
    ] as const) {
      if (/refusj|angrerett|refunder|pengene tilbake/i.test(text)) {
        throw new Error(`refund/angrerett-claim funnet på ${page}`);
      }
    }
  });

  test('FB-11: ingen abonnementspåstand som motsier faktisk/fremtidig modell', () => {
    const bareNegasjon = (text: string, page: string) => {
      const re = /[^.!?\n]*abonnement[^.!?\n]*/gi;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        if (!/ingen/i.test(m[0])) {
          throw new Error(`abonnement-påstand på ${page} er ikke negert: "${m[0].trim()}"`);
        }
      }
    };
    bareNegasjon(LANDING_TEXT, 'landing');
    bareNegasjon(PRISER_TEXT, '/priser');
  });

  test('FB-12: queue/onboarding krever ikke betaling', () => {
    const targets = [
      ...listFiles('app/onboarding'),
      ...listFiles('app/(auth)'),
      'app/matching/page.tsx',
      'app/betaling/page.tsx',
    ];
    const pattern = /må betale|betaling kreves|betal for å|kreves betal/i;
    const treff = targets.filter((rel) => pattern.test(read(rel)));
    expect(treff).toEqual([]);
  });

  test('FB-13: quota-konfig fortsatt 5000', () => {
    expect(PRICING.freeUserCap).toBe(5000);
  });

  test('FB-14: quota-logikk uendret (atomisk claim ved kø-inngang)', () => {
    const quota = read('lib/payment/freeQuota.ts');
    expect(quota).toMatch(/FREE_QUOTA_LIMIT = PRICING\.freeUserCap/);
    expect(quota).toMatch(/FREE_QUOTA_KEY = 'free_users'/);
    expect(quota).toMatch(/updateMany\(\{[\s\S]{0,120}used: \{ increment: 1 \}/);
    const queue = read('app/api/journey/queue/route.ts');
    expect(queue).toMatch(/isPaymentsEnabled\(\)/);
    expect(queue).toMatch(/claimFreeQuota/);
    expect(queue).toMatch(/releaseFreeQuota/);
  });

  test('FB-15: PAYMENTS_ENABLED fortsatt safe/off', () => {
    expect(isPaymentsEnabled()).toBe(false);
  });

  test('FB-16: PRICING canonical consistency — offentlige sider leser fra én kilde', () => {
    const files = [
      'app/(landing)/page.tsx',
      'app/priser/page.tsx',
      'app/priser/layout.tsx',
      'app/faq/page.tsx',
      'app/betaling/page.tsx',
      'app/vilkar/page.tsx',
    ];
    for (const rel of files) {
      const src = read(rel);
      if (/\b349\b/.test(src)) throw new Error(`${rel} inneholder hardkodet pris`);
      if (!/PRICING\.freeUserCap/.test(src)) throw new Error(`${rel} leser ikke kvoten fra PRICING`);
    }
    // Rendert innhold stemmer med config
    expect(LANDING_TEXT).toContain(String(PRICING.journeyPrice));
    expect(LANDING_TEXT).toMatch(KAP);
    expect(PRISER_TEXT).toContain(String(PRICING.journeyPrice));
    expect(PRISER_TEXT).toMatch(KAP);
  });

  test('FB-17: e-postmaler samsvarer med gratis beta', () => {
    const pattern = /\b349\b|vipps|betaling|abonnement|refusj|angrerett|gratis/i;
    const treff = listFiles('lib/email').filter((rel) => pattern.test(read(rel)));
    expect(treff).toEqual([]);
  });

  test('FB-18: motpol har ingen payment contradiction', () => {
    expect(MOTPOL_TEXT).not.toMatch(/gratis|349|abonnement|vipps|betaling|betale/i);
  });

  test('FB-19: ingen matchgaranti introdusert (gratis ≠ garantert reise)', () => {
    const patterns = [
      /matchgaranti/i,
      /(gratis|fri)[^.!?\n]{0,60}garanti/i,
      /garanti[^.!?\n]{0,60}(gratis|fri)/i,
    ];
    for (const [text, page] of [
      [LANDING_TEXT, 'landing'],
      [PRISER_TEXT, '/priser'],
    ] as const) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          throw new Error(`matchgaranti-claim på ${page} (pattern: ${pattern})`);
        }
      }
    }
  });

  test('FB-20 (J1.1): ingen stale 30-dagers journey-claims i aktiv brukerrettet copy', () => {
    // J1.1 truth-guard: fanger også definitiv norsk bøying («30 dagene»),
    // «tretti», «fire uker» og gammelt dag-15-bildeclaim. Måler KUN journey-sider
    // — IKKE personvern/cookies/retention/milestones som lovlig har 30-dagersfrister.
    const patterns = [
      /30 ?dag/i, // 30 dager / 30 dagene / 30 dags
      /tretti/i, // tretti dager
      /fire uker/i, // fire uker (28–30 dager) motsier 14-dagers reise
      /\bdag 15\b/i, // gammelt bilde-løft (dag 15) — nå dag 8
    ];
    const rendered: Array<[string, string]> = [
      [LANDING_TEXT, 'landing'],
      [MOTPOL_TEXT, '/motpol'],
      [PRISER_TEXT, '/priser'],
    ];
    for (const [text, page] of rendered) {
      for (const p of patterns) {
        if (p.test(text)) throw new Error(`stale journey-claim på ${page} (${p})`);
      }
    }
    const srcFiles = [
      'app/tips/page.tsx',
      'app/slik-fungerer-det/page.tsx',
      'app/metoder/page.tsx',
      'app/faq/page.tsx',
      'app/reisen/page.tsx',
      'app/reisen/avslutning/page.tsx',
      ...listFiles('app/hvorfor'),
      ...listFiles('app/trygghet'),
      ...listFiles('app/om-oss'),
    ];
    for (const rel of srcFiles) {
      const src = read(rel);
      for (const p of patterns) {
        if (p.test(src)) throw new Error(`stale journey-claim i ${rel} (${p})`);
      }
    }
  });
});
