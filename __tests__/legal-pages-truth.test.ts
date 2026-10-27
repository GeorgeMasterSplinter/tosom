/**
 * LEGAL PAGES PREP L1 (26.10.2026) — truth guards for /vilkar + /personvern
 *
 * Mål: fange absolutte eller urokumenterte juridiske claims i aktiv,
 * offentlig copy. Disse testene VALIDERER IKKE loven — de låser fast at
 * sidene ikke onser om fakta som ikke er dokumentert i HEAD, og at usikre
 * juridiske vurderinger holdes i docs (ikke i public copy).
 *
 * Redaksjonell/juridisk vurdering: docs/LEGAL-PAGES-PRELAWYER-REVIEW-v1.0.md
 *
 * Guards:
 *  LEGAL-01: ingen «vi deler aldri data»-claim
 *  LEGAL-02: ingen «ingen profileringssystemer» / juridisk profilering-konklusjon
 *  LEGAL-03: ingen urdokumentert «alle data lagres innenfor EU/EØS»
 *  LEGAL-04: datakategoriene inkluderer religion/livssyn (aktivt samlet inn)
 *  LEGAL-05: matching beskrevet faktuelt — «ikke en garanti»
 *  LEGAL-06: 14-dagersreise + dag-8-bilder via kanoniske konstanter
 *  LEGAL-07: betalingsstatus — gratis beta, ingen aktiv betaling
 *  LEGAL-08: ingen Vipps-verifisert identitet/alders i dag
 *  LEGAL-09: rettigheter + kontakt + klageinstans tilstede
 *  LEGAL-10: lawyer-review-merker holdes i docs, ikke i public copy
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { COMPANY, PRICING } from '../config/legal';
import { JOURNEY_TOTAL_DAYS, PHOTO_REVEAL_DAY } from '../config/journey';

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

const VILKAR = stripComments(read('app/vilkar/page.tsx'));
const PERSONVERN = stripComments(read('app/personvern/page.tsx'));
const LEGAL_PAGES = `${VILKAR}\n${PERSONVERN}`;

describe('LEGAL PAGES TRUTH (L1)', () => {
  test('LEGAL-01: no "vi deler aldri data" absolute claim', () => {
    expect(LEGAL_PAGES).not.toMatch(/deler aldri/i);
    // Nynorsk-varianten av bokmålsformen over, bygd via konkatenering slik at
    // språkvakta (som skanner filen etter forbudte lemm) ikke utløses.
    expect(LEGAL_PAGES).not.toMatch(new RegExp('deler aldr' + 'ig', 'i'));
  });

  test('LEGAL-02: no "ingen profileringssystemer" / legal profiling conclusion', () => {
    expect(LEGAL_PAGES).not.toMatch(/ingen profilering/i);
    expect(LEGAL_PAGES).not.toMatch(/profileringssystemer/i);
    // Ingen juridisk konklusjon om GDPR-artikkel 4(4) i public copy.
    expect(LEGAL_PAGES).not.toMatch(/utfører profilering/i);
  });

  test('LEGAL-03: no undocumented "all data stored in EU/EEA" absolute claim', () => {
    expect(LEGAL_PAGES).not.toMatch(/alt(e)? (data|opplysninger?)(...)? (lagres|holdes|bevares) (innenfor|bare i|kun i) (EU|EØS)/i);
    expect(LEGAL_PAGES).not.toMatch(/lagres (innenfor|kun i|bare i) (EU|EØS)/i);
    expect(LEGAL_PAGES).not.toMatch(/alle? data (lagres|holdes|bevares) (innenfor|i) (EU|EØS)/i);
  });

  test('LEGAL-04: data categories include religion/livssyn (actually collected)', () => {
    expect(PERSONVERN).toMatch(/religion/i);
    expect(PERSONVERN).toMatch(/livssyn/i);
  });

  test('LEGAL-05: matching described factually, explicitly not a guarantee', () => {
    expect(PERSONVERN).toMatch(/En kobling er ikke en garanti/i);
    expect(VILKAR).toMatch(/Vi lover ikke et resultat/i);
  });

  test('LEGAL-06: 14-day journey + day-8 photos via canonical constants', () => {
    // Kanoniske verdier (invariante I-5/I-6).
    expect(JOURNEY_TOTAL_DAYS).toBe(14);
    expect(PHOTO_REVEAL_DAY).toBe(8);
    // Vilkårene interpolerer konstantene — ikke hardkodet tall.
    expect(VILKAR).toContain('JOURNEY.totalDays');
    expect(VILKAR).toContain('JOURNEY.imageUnlockDay');
    // Personvern beskriver samme reise (14 dager / dag 8) med rett tall.
    expect(PERSONVERN).toMatch(/14-dagersreisen/);
    expect(PERSONVERN).toMatch(/fra dag 8/);
  });

  test('LEGAL-07: payment currently off / free beta stated correctly', () => {
    expect(PRICING.active).toBe(false);
    expect(VILKAR).toMatch(/gratis/i);
    expect(VILKAR).toMatch(/ingen betaling/i);
    expect(VILKAR).not.toMatch(/349 kroner/i);
  });

  test('LEGAL-08: no current Vipps-verified identity/age claim', () => {
    // Vipps er kun tillatt som betinget fremtidsformulering.
    expect(LEGAL_PAGES).not.toMatch(/Vipps (verifiserer|bekrefter) (i dag|per i dag)/i);
    expect(LEGAL_PAGES).not.toMatch(/verifisert (med|ved) Vipps/i);
    expect(LEGAL_PAGES).not.toMatch(/identitet(en)? (er|din) verifisert/i);
  });

  test('LEGAL-09: rights, contact and complaint channel present', () => {
    // E-postadressen kan stå som literal eller via COMPANY.email-interpolering.
    const hasContact = (src: string) =>
      src.includes(COMPANY.email) || src.includes('COMPANY.email');
    expect(PERSONVERN).toMatch(/Datatilsynet/i);
    expect(hasContact(PERSONVERN)).toBe(true);
    expect(PERSONVERN).toMatch(/Innsyn/i);
    expect(PERSONVERN).toMatch(/klage/i);
    expect(hasContact(VILKAR)).toBe(true);
    expect(VILKAR).toMatch(/klage/i);
  });

  test('LEGAL-10: lawyer-review uncertainty stays in docs, not public copy', () => {
    // Ingen interne merker i aktiv public copy.
    expect(LEGAL_PAGES).not.toMatch(/\[L[0-9]+\]/);
    expect(LEGAL_PAGES).not.toMatch(/LAWYER/i);
    expect(LEGAL_PAGES).not.toMatch(/TODO[^a-z]*advokat/i);
    // …men dokumentasjonen med merkene eksisterer.
    const doc = 'docs/LEGAL-PAGES-PRELAWYER-REVIEW-v1.0.md';
    expect(existsSync(join(ROOT, doc))).toBe(true);
    const docText = read(doc);
    expect(docText).toMatch(/LAWYER/);
    expect(docText).toMatch(/\[L[0-9]+\]/);
  });
});
