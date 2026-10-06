// __tests__/psychometrics-scoring.test.ts — FORSKNINGSMOTOR F-2
//
// Test av skåringsfunksjonene i lib/psychometrics/scoring.ts med kjente
// inn- og utverdier, inkludert reverserte items (BFI-10).

import {
  scoreBigFive,
  scoreAttachment,
  scoreValues,
  scoreEmotionRegulation,
  scoreCommunication,
  scoreAll,
} from '@/lib/psychometrics/scoring';
import { BFI10, ATTACHMENT, PVQ10, ERQ6, COMMUNICATION, ALL_ITEMS } from '@/lib/psychometrics/instruments';
import { onboardingSetupSchema } from '@/lib/validation/onboarding-setup';

describe('psychometrics/scoring', () => {
  /* ─── BFI-10 ─── */

  describe('scoreBigFive', () => {
    it('rekner gjennomsnitt per trekk', () => {
      const answers: Record<string, number> = {};
      // Alle 5 → alle trekk med ikke-reverserte items = 5
      for (const i of BFI10) answers[i.id] = 5;
      const s = scoreBigFive(answers);
      expect(s.agreeableness).toBe(5);
      expect(s.openness).toBe(5);
      expect(s.conscientiousness).toBe(5);
      expect(s.neuroticism).toBe(5);
    });

    it('håndterer reverserte items (bfi1 er reversert)', () => {
      const bfi1 = BFI10.find((i) => i.id === 'bfi1')!;
      const bfi7 = BFI10.find((i) => i.id === 'bfi7')!;
      expect(bfi1.reversed).toBe(true);
      expect(bfi7.reversed).toBe(false);

      // bfi1 = 1 (reversert → 5), bfi7 = 5 → extraversion = 5
      const high = { bfi1: 1, bfi7: 5 };
      expect(scoreBigFive(high).extraversion).toBe(5);

      // bfi1 = 5 (reversert → 1), bfi7 = 1 → extraversion = 1
      const low = { bfi1: 5, bfi7: 1 };
      expect(scoreBigFive(low).extraversion).toBe(1);
    });

    it('blander reversert og ikke-reversert riktig', () => {
      // bfi1 = 2 (reversert → 4), bfi7 = 3 → (4+3)/2 = 3.5
      const s = scoreBigFive({ bfi1: 2, bfi7: 3 });
      expect(s.extraversion).toBe(3.5);
    });

    it('behandler manglende svar som nøytralt (3)', () => {
      // Kun bfi1 = 1 (reversert → 5), bfi7 mangler (3) → (5+3)/2 = 4
      const s = scoreBigFive({ bfi1: 1 });
      expect(s.extraversion).toBe(4);
    });
  });

  /* ─── Tilknytning ─── */

  describe('scoreAttachment', () => {
    const allAns = (v: number): Record<string, number> => {
      const a: Record<string, number> = {};
      for (const i of ATTACHMENT) a[i.id] = v;
      return a;
    };

    it('begge akser lave → secure', () => {
      const s = scoreAttachment(allAns(1));
      expect(s.anxiety).toBe(1);
      expect(s.avoidance).toBe(1);
      expect(s.style).toBe('secure');
    });

    it('angst høy, unnvikelse lav → anxious', () => {
      const a: Record<string, number> = {};
      for (const i of ATTACHMENT) {
        a[i.id] = i.trait === 'attachment_anxiety' ? 5 : 1;
      }
      const s = scoreAttachment(a);
      expect(s.anxiety).toBe(5);
      expect(s.avoidance).toBe(1);
      expect(s.style).toBe('anxious');
    });

    it('angst lav, unnvikelse høy → avoidant', () => {
      const a: Record<string, number> = {};
      for (const i of ATTACHMENT) {
        a[i.id] = i.trait === 'attachment_avoidance' ? 5 : 1;
      }
      const s = scoreAttachment(a);
      expect(s.style).toBe('avoidant');
    });

    it('begge akser høye → fearful', () => {
      const s = scoreAttachment(allAns(5));
      expect(s.anxiety).toBe(5);
      expect(s.avoidance).toBe(5);
      expect(s.style).toBe('fearful');
    });
  });

  /* ─── Verdier (PVQ-10) ─── */

  describe('scoreValues', () => {
    it('gir ett verdi per Schwartz-verdi', () => {
      const a: Record<string, number> = {};
      for (const i of PVQ10) a[i.id] = 4;
      const p = scoreValues(a);
      // benevolence har to items (pvq1, pvq10) → begge 4 → 4
      expect(p.benevolence).toBe(4);
      // security har to items (pvq4, pvq6) → 4
      expect(p.security).toBe(4);
      expect(p.power).toBe(4);
    });
  });

  /* ─── Emosjonsregulering (ERQ-6) ─── */

  describe('scoreEmotionRegulation', () => {
    it('skiller reappraisal og suppression', () => {
      const a: Record<string, number> = {};
      for (const i of ERQ6) {
        a[i.id] = i.trait === 'reappraisal' ? 5 : 2;
      }
      const s = scoreEmotionRegulation(a);
      expect(s.reappraisal).toBe(5);
      expect(s.suppression).toBe(2);
    });
  });

  /* ─── Kommunikasjon ─── */

  describe('scoreCommunication', () => {
    it('gir ett verdi per kommunikasjonstrekk', () => {
      const a: Record<string, number> = {};
      for (const i of COMMUNICATION) a[i.id] = 4;
      const s = scoreCommunication(a);
      expect(s.repair).toBe(4);
      expect(s.bids).toBe(4);
      expect(s.listening).toBe(4);
    });
  });

  /* ─── scoreAll ─── */

  describe('scoreAll', () => {
    it('returnerer alle fem skårer i ett objekt', () => {
      const a: Record<string, number> = {};
      for (const i of [...BFI10, ...ATTACHMENT, ...PVQ10, ...ERQ6, ...COMMUNICATION]) {
        a[i.id] = 3;
      }
      const s = scoreAll(a);
      expect(s.bigFive).toBeDefined();
      expect(s.values).toBeDefined();
      expect(s.emotionRegulation).toBeDefined();
      expect(s.communication).toBeDefined();
      // PL-08h: alle 3.0 er nøytral midtsone → 'secure', IKKE 'fearful'
      // (tersklene er strengt over 3.0).
      expect(s.attachment.style).toBe('secure');
    });

    it('PL-08j: scoreAll({}) gir ikke stil «fearful» (tomme svar er nøytrale)', () => {
      const s = scoreAll({});
      // Manglende items behandles som 3 (nøytral) → begge akser = 3.0
      // → ingen indikasjon på angst/unnvikelse → secure.
      expect(s.attachment.style).not.toBe('fearful');
      expect(s.attachment.style).toBe('secure');
    });
  });

  /* ─── PL-08g: Serveren er fasit — alle 44 items er påkrevd ─── */

  describe('onboardingSetupSchema (PL-08g)', () => {
    // Fullt, gyldig payload — samme form som /api/profile/setup mottar.
    function fullBody(): Record<string, unknown> {
      const psychometrics: Record<string, number> = {};
      ALL_ITEMS.forEach((item, i) => {
        psychometrics[item.id] = (i % 5) + 1;
      });
      return {
        basic: {
          identityName: 'Reprobruker', age: 30, gender: 'Kvinne', seekingGender: 'Mann',
          height: 170, bodyType: 'slank', lifestyle: 'aktiv', smoking: 'røyker ikke',
          religion: 'ateist', children: 'ingen', wantChildren: 'vet ikke',
          city: 'Bergen', postalCode: '5003', distancePref: 100, agePrefMin: 23, agePrefMax: 40,
        },
        personlighet: {
          selfDesc: 'Jeg liker natur, musikk og gode samtaler om livet.',
          energyGiver: 'venner og ro', energyDrainer: 'støy og kaos',
          pressureReact: 'blir rolig', quirk: 'mumler for meg selv',
        },
        livssituasjon: {
          workType: 'fulltid', housingType: 'leilighet', householdSize: '2 personer',
          economicStability: 'stabil', responsibilities: 'jobb og husdyr',
          dailyRoutine: 'regelrett med rom for improvisasjon',
        },
        tilknytning: {
          safetyNeed: 'at du er der', insecurityTrigger: 'når du blir stum',
          sadnessNeed: 'trygghet og ro', stressNeed: 'rom for meg selv',
          importantBoundary: 'respekt alltid',
        },
        kommunikasjon: { calmingHelp: 'berøring og ord', trigger: 'utrygghet', trustBuilder: 'trygghet over tid' },
        kjaerlighet: {
          loveGive: 'tid og oppmerksomhet', loveReceive: 'ord og berøring',
          closenessBuilder: 'åpen samtale', distanceCreator: 'arbeid og stress',
          smallThing: 'en kopp kaffe sammen',
        },
        livsstil: {
          highPriority: 'trygghet', lowPriority: 'status', goodEveryday: 'ro og god mat',
          desiredLifestyle: 'familieliv', undesiredLifestyle: 'konflikt',
        },
        relasjonsStil: { relationshipSeeking: 'fast parforhold', closenessNeed: 'middels', independenceBalance: 'balanse' },
        fremtid: {
          futureVision: 'et trygt hjem vi bygger sammen', dreamGoal: 'reise mye sammen',
          buildTogether: 'en familie', experienceAlone: 'naturen og fjellet',
          experienceTogether: 'god mat og musikk',
        },
        humor: {
          laughterTrigger: 'ironi', quirkyHabit: 'danser i kjøkkenet',
          guiltyPleasure: 'serier om natten', totallyYou: 'rolig og lojalt',
          partnerWouldLaugh: 'at jeg tar alt for langt på alvor',
        },
        grenser: {
          neverCrossBoundary: 'respekt', understandPartnersBoundaries: 'ja',
          limitations: 'trenger tid etter dag', partnerMustUnderstand: 'at trygghet er viktig for meg',
        },
        moden: {
          intimacySafety: 'jeg trenger å vite at det er trygt', comfortableWith: 'å dele følelser',
          boundary: 'fysisk press', nearerType: 'ord og berøring', needsTime: 'en pause nå og da',
        },
        preferanser: {
          politicsImportance: 3, religionImportance: 1, dietPreference: 'vegetar',
          sleepSchedule: 'fugl', pets: 'har en katte', travelFreq: 'par ganger i året',
          alcoholFreq: 'sjelden', ambitionLevel: 'målbevisst', structureSpontaneity: 'struktur',
          introExtrovert: 'introvert', attachmentStyle: 'sikre',
        },
        psychometrics,
      };
    }

    it('PL-08j: godkjenner payload med alle 44 items', () => {
      const result = onboardingSetupSchema.safeParse(fullBody());
      expect(result.success).toBe(true);
    });

    it('PL-08j: avviser payload med 43 av 44 items', () => {
      const body = fullBody();
      const psych = { ...(body.psychometrics as Record<string, number>) };
      // Fjern ett item (det siste i ALL_ITEMS).
      delete psych[ALL_ITEMS[ALL_ITEMS.length - 1].id];
      body.psychometrics = psych;
      const result = onboardingSetupSchema.safeParse(body);
      expect(result.success).toBe(false);
    });
  });
});