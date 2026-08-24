/**
 * ToSom — Regresjon: grenser-selectfelt (steg 8a) mot /api/profile/setup-skjemaet
 *
 * Steg 8a (Step8Grenser.tsx) sender korte option-verdier fra select-grid
 * (f.eks. «respekt», «lar»). Skjemaet krevde tidligere minst 10 tegn
 * (optStr(300, 10)) på begge select-feltene, så 6 av 9 mulige valg ga 400
 * på steg 13 («Start reisen») og blokkerte veien til venterommet.
 */

import { validateOnboarding } from '@/lib/validation/onboarding-setup';

// Nøyaktig option-verdiene i Step8Grenser.tsx (select-grid)
const NEVER_CROSS_OPTIONS = ['respekt', 'tid-aleine', 'venner', 'selvstende', 'sandhet'];
const UNDERSTAND_OPTIONS = ['lyttar', 'observerer', 'sporar', 'lar'];

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
    ...overrides,
  };
}

describe('validateOnboarding — grenser-selectfelt (steg 8a)', () => {
  it('aksepterer de korte option-verdiene fra select-grid', () => {
    const result = validateOnboarding(
      fullPayload({
        grenser: {
          neverCrossBoundary: 'respekt',
          understandPartnersBoundaries: 'lar',
          limitations: 'Jeg trenger tid alene',
          partnerMustUnderstand: 'at ro og trygghet er viktig for meg',
        },
      })
    );
    expect(result.success).toBe(true);
  });

  it('aksepterer alle option-verdier i begge select-felt', () => {
    for (const v of NEVER_CROSS_OPTIONS) {
      const result = validateOnboarding(fullPayload({ grenser: { neverCrossBoundary: v } }));
      expect(result.success).toBe(true);
    }
    for (const v of UNDERSTAND_OPTIONS) {
      const result = validateOnboarding(
        fullPayload({ grenser: { understandPartnersBoundaries: v } })
      );
      expect(result.success).toBe(true);
    }
  });

  it('tomme verdier går fortsatt gjennom (optional-kontrakten bevart)', () => {
    const result = validateOnboarding(
      fullPayload({ grenser: { neverCrossBoundary: '', understandPartnersBoundaries: '' } })
    );
    expect(result.success).toBe(true);
  });

  it('fritekst-feltet partnerMustUnderstand krever fortsatt minst 10 tegn', () => {
    const result = validateOnboarding(fullPayload({ grenser: { partnerMustUnderstand: 'kort' } }));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.map((e) => e.field)).toContain('grenser.partnerMustUnderstand');
    }
  });
});
