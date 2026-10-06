/**
 * ToSom — PL-27 / PL-28: religion med opptil fire valg og «Åpen for bonusfamilie»
 *
 * PL-27 (Georges beslutning 06.10): religion / livssyn tillater opptil fire
 * valg. Mange har røtter i flere tradisjoner. Serveren er fasit: fem eller
 * flere valg avvises.
 *
 * PL-28: «Ønsker du barn?» har fått verdien «Bonusfamilie». Skjemaet er
 * fritekst (optStr), så verdien — alene eller i flervalg — skal gå gjennom.
 */

import { validateOnboarding } from '@/lib/validation/onboarding-setup';
import { ALL_ITEMS } from '@/lib/psychometrics/instruments';

function fullPayload(basic: Record<string, unknown> = {}): any {
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
      ...basic,
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
  };
}

describe('PL-27: religion / livssyn — opptil fire valg', () => {
  it('aksepterer ett valg', () => {
    expect(validateOnboarding(fullPayload({ religion: 'Kristen' })).success).toBe(true);
  });

  it('aksepterer fire valg', () => {
    const result = validateOnboarding(
      fullPayload({ religion: 'Kristen,Muslim,Spirituell,Annet' })
    );
    expect(result.success).toBe(true);
  });

  it('avviser fem valg med rolig melding på religion-feltet', () => {
    const result = validateOnboarding(
      fullPayload({ religion: 'Kristen,Muslim,Spirituell,Annet,Buddhist' })
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      const feil = result.errors.find((e) => e.field === 'basic.religion');
      expect(feil?.message).toBe('Du kan velge opptil fire under religion og livssyn.');
    }
  });

  it('tom religion går fortsatt gjennom (feltet er valgfritt)', () => {
    expect(validateOnboarding(fullPayload({ religion: '' })).success).toBe(true);
  });
});

describe('PL-28: «Åpen for bonusfamilie» i «Ønsker du barn?»', () => {
  it('aksepterer bonusfamilie alene', () => {
    expect(validateOnboarding(fullPayload({ wantChildren: 'Bonusfamilie' })).success).toBe(true);
  });

  it('aksepterer bonusfamilie sammen med «Nei»', () => {
    expect(validateOnboarding(fullPayload({ wantChildren: 'Nei,Bonusfamilie' })).success).toBe(true);
  });
});
