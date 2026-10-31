/**
 * ToSom — LIVSSTIL-2026 (18.10): validering av den nye onboarding-seksjonen
 *
 * livsstil2026Schema (lib/validation/onboarding-setup.ts): alle felt er
 * valfrie; valg-felt må treffe gyldige option-verdier; viktighetsvalgene
 * (D-4) må være ett av de tre nivåene. Gammel payload uten seksjonen må
 * fortsatt godkjennes (bakoverkompatibilitet).
 */

import { validateOnboarding } from '@/lib/validation/onboarding-setup';
import { ALL_ITEMS } from '@/lib/psychometrics/instruments';

function fullPayload(overrides: Record<string, any> = {}): any {
  return {
    basic: {
      identityName: 'Testbruker',
      age: 30,
      gender: 'Kvinne',
      seekingGender: 'Mann',
      city: 'Bergen',
      postalCode: '5003',
      distancePref: 50,
      agePrefMin: 23,
      agePrefMax: 40,
    },
    personlighet: { selfDesc: 'Jeg liker natur, musikk og gode samtaler om livet.' },
    livssituasjon: {},
    tilknytning: {},
    kommunikasjon: {},
    kjaerlighet: {},
    livsstil: {},
    relasjonsStil: {},
    fremtid: {},
    humor: {},
    grenser: {},
    moden: {},
    preferanser: {},
    psychometrics: Object.fromEntries(ALL_ITEMS.map((item, i) => [item.id, (i % 5) + 1])),
    ...overrides,
  };
}

describe('validateOnboarding — livsstil2026', () => {
  it('aksepterer fullt sett med nye valg + viktighetsnivåer', () => {
    const result = validateOnboarding(
      fullPayload({
        livsstil2026: {
          arbeidsrytme: 'hybrid',
          arbeidsrytmeViktig: 'ma-stemme',
          bosted: 'forstad',
          bostedViktig: 'bor-stemme',
          reiser: 'fjell-bobil',
          reiserViktig: 'ma-stemme',
          dyr: 'hund',
          dyrViktig: 'ma-stemme',
          skjerm: 'moderat',
          skjermViktig: 'bor-stemme',
          bil: 'full-el',
          bilViktig: 'bor-stemme',
          kosthold: 'vegan',
          kostholdViktig: 'ma-stemme',
          klima: 'veldig-viktig',
          alkohol: 'sjelden',
          alkoholViktig: 'ikke-viktig',
          aktivitet: 'gym,lop-turer',
          aktivitetViktig: 'ma-stemme',
        },
      })
    );
    expect(result.success).toBe(true);
  });

  it('aksepterer tom seksjon og helt manglende seksjon (valgfri)', () => {
    expect(validateOnboarding(fullPayload({ livsstil2026: {} })).success).toBe(true);
    expect(validateOnboarding(fullPayload()).success).toBe(true);
  });

  it('avviser ugyldig verdi på valg-felt', () => {
    const result = validateOnboarding(
      fullPayload({ livsstil2026: { bil: 'spiser-mykke-mat' } })
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.map((e) => e.field)).toContain('livsstil2026.bil');
    }
  });

  it('O2 P1: kosthold er nå flervalg (kommaseparert) — godtar 1–2 token', () => {
    expect(validateOnboarding(fullPayload({ livsstil2026: { kosthold: 'vegan' } })).success).toBe(true);
    expect(validateOnboarding(fullPayload({ livsstil2026: { kosthold: 'vegetar,vegan' } })).success).toBe(true);
  });

  it('avviser ugyldig viktighetsnivå (D-4)', () => {
    const result = validateOnboarding(
      fullPayload({ livsstil2026: { bil: 'full-el', bilViktig: 'veldig-viktig' } })
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.map((e) => e.field)).toContain('livsstil2026.bilViktig');
    }
  });
});