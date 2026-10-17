/**
 * ToSom — LIVSSTIL-2026 (18.10): hverdagsvalg i livssituasjon-dimensjonen
 *
 * scoreLifeSituationCompat (lib/matching/dimensions.ts) utvidet med
 * preferences.livsstil2026 (D-2/D-4):
 * - mangler data → feltet hoppes over (legacy-profiler scorer som før)
 * - «ubestemt» behandles som manglende
 * - «ikke-viktig» hos én part utelater det gatede feltet (D-4)
 * - klima scorer ordinalt (100/75/50 etter trinn-forskjell)
 */

import { scoreLifeSituationCompat } from '@/lib/matching/dimensions';

const L2026 = (overrides: Record<string, string> = {}) => ({
  bil: 'full-el',
  bilViktig: 'bor-stemme',
  kosthold: 'fleksitar',
  kostholdViktig: 'bor-stemme',
  klima: 'viktig',
  alkohol: 'sjelden',
  alkoholViktig: 'ikke-viktig',
  aktivitet: 'gym,lop-turer',
  arbeidsrytme: 'hybrid',
  bosted: 'forstad',
  reiser: 'fjell-bobil',
  dyr: 'hund',
  dyrViktig: 'bor-stemme',
  skjerm: 'moderat',
  ...overrides,
});

const prof = (l2026?: Record<string, string>, ekstra: Record<string, unknown> = {}) => ({
  lifestyle: { ...ekstra },
  preferences: l2026 ? { livsstil2026: l2026 } : null,
});

describe('scoreLifeSituationCompat — livsstil2026 (D-2/D-4)', () => {
  it('identiske 2026-valg gir full uttelling (100)', () => {
    const s = scoreLifeSituationCompat(prof(L2026()), prof(L2026()));
    expect(s).toBe(100);
  });

  it('legacy-profiler uten preferences scorer nøyaktig som før (ingen endring)', () => {
    // Kun smoking-feltet: konflikt → 0 (uavhengig av ny kode)
    expect(
      scoreLifeSituationCompat(
        { lifestyle: { smoking: 'Roker' } },
        { lifestyle: { smoking: 'Roker-av-og-til' } }
      )
    ).toBe(0);
    // Ingen data i det hele tatt → nøytral 50
    expect(scoreLifeSituationCompat({}, {})).toBe(50);
  });

  it('klima scorer ordinalt: trinn-forskjell 0/1/2 → 100/75/50', () => {
    expect(scoreLifeSituationCompat(prof({ klima: 'veldig-viktig' }), prof({ klima: 'viktig' }))).toBe(75);
    expect(
      scoreLifeSituationCompat(prof({ klima: 'veldig-viktig' }), prof({ klima: 'ikke-stor-sak' }))
    ).toBe(50);
    expect(scoreLifeSituationCompat(prof({ klima: 'viktig' }), prof({ klima: 'viktig' }))).toBe(100);
  });

  it('D-4: «ikke-viktig» hos ÉN part utelater det gatede feltet', () => {
    // Vegan vs spiser kjøtt ville ellers gi 0 — men A bryr seg ikke.
    const a = prof({ kosthold: 'vegan', kostholdViktig: 'ikke-viktig' });
    const b = prof({ kosthold: 'spiser-koett', kostholdViktig: 'ma-stemme' });
    expect(scoreLifeSituationCompat(a, b)).toBe(50); // feltet utelates → nøytral
  });

  it('D-4 (utvidet): «ikke-viktig» hos ÉN part utelater også bosted/arbeidsrytme/skjerm/aktivitet/reiser', () => {
    // Konflikt i alle 5 utvidede felt, men A bryr seg om ingen av dem.
    const a = prof(L2026({
      bosted: 'sentrum', bostedViktig: 'ikke-viktig',
      arbeidsrytme: 'skift', arbeidsrytmeViktig: 'ikke-viktig',
      skjerm: 'mye', skjermViktig: 'ikke-viktig',
      reiser: 'fjell-bobil', reiserViktig: 'ikke-viktig',
      aktivitet: 'gym', aktivitetViktig: 'ikke-viktig',
    }));
    const b = prof(L2026({
      bosted: 'land',
      arbeidsrytme: 'kontorbundet',
      skjerm: 'vil-skru-ned',
      reiser: 'lite-reising',
      aktivitet: 'lite',
    }));
    // Alle 5 felt er gated ut → bare de uavhengige 2026-feltene (bil/kosthold/
    // klima/alkohol/dyr fra fixturen) scorer — og de stemmer → 100
    expect(scoreLifeSituationCompat(a, b)).toBe(100);
  });

  it('D-4: uten «ikke-viktig» straffer ulikt kosthold', () => {
    const a = prof({ kosthold: 'vegan', kostholdViktig: 'ma-stemme' });
    const b = prof({ kosthold: 'spiser-koett', kostholdViktig: 'bor-stemme' });
    expect(scoreLifeSituationCompat(a, b)).toBe(0);
  });

  it('«ubestemt» behandles som manglende (hoppes over, ikke straff)', () => {
    expect(
      scoreLifeSituationCompat(prof({ bosted: 'ubestemt' }), prof({ bosted: 'sentrum' }))
    ).toBe(50);
  });

  it('aktivitet (flervalg) scorer Jaccard: delvis overlap gir mellomting', () => {
    // {gym,lop-turer} vs {gym} → 1/2 = 50
    expect(
      scoreLifeSituationCompat(prof({ aktivitet: 'gym,lop-turer' }), prof({ aktivitet: 'gym' }))
    ).toBe(50);
  });

  it('ny data blandes med eksisterende data i samme vektede sum', () => {
    // wantChildren (vekt 0.4) stemmer + alle 2026-valg stemmer → 100
    const a = prof(L2026(), { wantChildren: 'Ja' });
    const b = prof(L2026(), { wantChildren: 'Ja' });
    expect(scoreLifeSituationCompat(a, b)).toBe(100);
    // wantChildren motsetning (0, vekt 0.4) + 2026-valg stemmer (100, vekt 0.46 —
    // alkohol utelates via «ikke-viktig» i fixturen) → (0*0.4 + 100*0.46)/0.86 ≈ 53
    const s = scoreLifeSituationCompat(
      prof(L2026(), { wantChildren: 'Ja' }),
      prof(L2026(), { wantChildren: 'Nei' })
    );
    expect(s).toBeGreaterThanOrEqual(52);
    expect(s).toBeLessThanOrEqual(54);
  });
});