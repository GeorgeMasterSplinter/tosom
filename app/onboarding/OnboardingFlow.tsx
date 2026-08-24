/**
 * Tosom — OnboardingFlow (rebuild 2026)
 * 13-stegs flyt med nye steg: Livssituasjon, Relasjonsstil, Grenser.
 * Fasе 4: Autosave + fade-transition.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { OnboardingLayout } from './OnboardingLayout';

import Step1Profile from './steps/Step1Profile';
import Step2Personlighet from './steps/Step2Personlighet';
import Step2Livssituasjon from './steps/Step2Livssituasjon';
import Step3Tilknytning from './steps/Step3Tilknytning';
import Step4Kjærlighetsspråk from './steps/Step4Kjærlighetsspråk';
import Step5LivsstilVerdier from './steps/Step5LivsstilVerdier';
import Step5Relasjonsstil from './steps/Step5Relasjonsstil';
import Step6FramtidVisjon from './steps/Step6FramtidVisjon';
import Step7HumorPersonlighet from './steps/Step7HumorPersonlighet';
import Step8Grenser from './steps/Step8Grenser';
import Step8ModenNysgjerrighet from './steps/Step8ModenNysgjerrighet';
import Step9Oppsummering from './steps/Step9Oppsummering';
import Step10StartReisen from './steps/Step10StartReisen';
import { ALL_ITEMS } from '@/lib/psychometrics/instruments';
import type { UserProfile } from "../../lib/profile/userProfile";

const STORAGE_KEY = 'tosom_onboarding_draft';

/**
 * Profil-datastruktur for heile 13-stegs onboarding.
 * Alle felt er valfrie — brukaren kan hoppe over spørsmål.
 */
interface ProfileData extends Record<string, unknown> {
  // Steg 1: Grunnprofil
  identityName: string;
  age: string;
  gender: string;
  seekingGender: string;
  height: string;
  bodyType: string;
  lifestyle: string;
  smoking: string;
  religion: string;
  children: string;
  wantChildren: string;
  city: string;
  distancePref: number;
  agePrefMin: number;
  agePrefMax: number;
  // Legacy support for Step1
  firstName: string;
  seeking: string;
  maxDistance: number;
  minAge: number;
  maxAge: number;
  location: string;
  politicsImportance: number;
  religionImportance: number;
  dietPreference: string;
  sleepSchedule: string;
  pets: string;
  travelFreq: string;
  alcoholFreq: string;
  ambitionLevel: string;
  structureSpontaneity: string;
  introExtrovert: string;
  attachmentStyle: string;
  // Steg 2a: Personlighet
  selfDesc: string;
  energyGiver: string;
  energyDrainer: string;
  pressureReact: string;
  quirk: string;
  bestSelf: string;
  energy: string;
  drains: string;
  pressure: string;
  habits: string;
  // Steg 2b: Livssituasjon
  workType: string;
  housingType: string;
  householdSize: string;
  economicStability: string;
  responsibilities: string;
  dailyRoutine: string;
  // Steg 3: Tilknytning
  safetyNeed: string;
  insecurityTrigger: string;
  sadnessNeed: string;
  stressNeed: string;
  importantBoundary: string;
  // Steg 4: Kjærlighetsspråk
  loveGive: string;
  loveReceive: string;
  closenessBuilder: string;
  distanceCreator: string;
  smallThing: string;
  // Steg 5a: Livsstil & verdier
  highPriority: string;
  lowPriority: string;
  goodEveryday: string;
  desiredLifestyle: string;
  undesiredLifestyle: string;
  // Steg 5b: Relasjonsstil
  relationshipSeeking: string;
  closenessNeed: string;
  independenceBalance: string;
  // Steg 6: Framtid & visjon
  futureVision: string;
  dreamGoal: string;
  buildTogether: string;
  experienceAlone: string;
  experienceTogether: string;
  // Steg 7: Humor & personlighet
  laughterTrigger: string;
  quirkyHabit: string;
  guiltyPleasure: string;
  totallyYou: string;
  partnerWouldLaugh: string;
  // Steg 8a: Grenser
  neverCrossBoundary: string;
  understandPartnersBoundaries: string;
  limitations: string;
  partnerMustUnderstand: string;
  // Steg 8b: Moden nysgjerrighet
  intimacySafety: string;
  comfortableWith: string;
  boundary: string;
  nearerType: string;
  needsTime: string;
}

const initialData: ProfileData = {
  identityName: '', age: '', gender: '', seekingGender: '', height: '',
  bodyType: '', lifestyle: '', smoking: '', religion: '', children: '',
  wantChildren: '', city: '', distancePref: 50, agePrefMin: 21, agePrefMax: 40,
  firstName: '', seeking: '', maxDistance: 50, minAge: 21, maxAge: 40, location: '',
  politicsImportance: 5, religionImportance: 5, dietPreference: '',
  sleepSchedule: '', pets: '', travelFreq: '', alcoholFreq: '',
  ambitionLevel: '', structureSpontaneity: '', introExtrovert: '',
  attachmentStyle: '',
  selfDesc: '', energyGiver: '', energyDrainer: '', pressureReact: '', quirk: '',
  bestSelf: '', energy: '', drains: '', pressure: '', habits: '',
  workType: '', housingType: '', householdSize: '', economicStability: '', responsibilities: '', dailyRoutine: '',
  safetyNeed: '', insecurityTrigger: '', sadnessNeed: '', stressNeed: '', importantBoundary: '',
  loveGive: '', loveReceive: '', closenessBuilder: '', distanceCreator: '', smallThing: '',
  highPriority: '', lowPriority: '', goodEveryday: '', desiredLifestyle: '', undesiredLifestyle: '',
  relationshipSeeking: '', closenessNeed: '', independenceBalance: '',
  futureVision: '', dreamGoal: '', buildTogether: '', experienceAlone: '', experienceTogether: '',
  laughterTrigger: '', quirkyHabit: '', guiltyPleasure: '', totallyYou: '', partnerWouldLaugh: '',
  neverCrossBoundary: '', understandPartnersBoundaries: '', limitations: '', partnerMustUnderstand: '',
  intimacySafety: '', comfortableWith: '', boundary: '', nearerType: '', needsTime: '',
};

function loadDraft(): Partial<ProfileData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch { /* ignore */ }
  return {};
}

function saveDraft(data: ProfileData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

// B2.2 — Server-side autosave: POST ved stegbytte (debounced, ikke-blokkerende)
async function saveDraftToServer(step: number, data: ProfileData): Promise<void> {
  try {
    await fetch('/api/onboarding/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step, data }),
    });
  } catch (err) {
    // Ikke-blokkerende: feiler lagringen skal brukeren likevel komme videre
    console.warn('[onboarding] Server-autosave feilet:', err);
  }
}

// B2.2 — Hent draft fra serveren ved oppstart (serveren er sannheten)
async function loadDraftFromServer(): Promise<{ data: Partial<ProfileData>; step: number } | null> {
  try {
    const res = await fetch('/api/onboarding/draft');
    if (!res.ok) return null;
    const result = await res.json();
    if (result.data && typeof result.data === 'object') {
      return { data: result.data, step: result.step ?? 0 };
    }
  } catch { /* ignore */ }
  return null;
}

// WP2 — Prefill fra fullførte profiler (én kilde for init-tilstand,
// serveren mappet via /api/onboarding/prefill → lib/profile/toOnboardingData)
async function loadPrefill(): Promise<{ data: Partial<ProfileData>; step: number } | null> {
  try {
    const res = await fetch('/api/onboarding/prefill');
    if (!res.ok) return null;
    const result = await res.json();
    if (result.data && typeof result.data === 'object') {
      return { data: result.data, step: typeof result.step === 'number' ? result.step : 0 };
    }
  } catch { /* ignore */ }
  return null;
}

/** Norske feltnavn for valideringsfeil fra /api/profile/setup */
const FIELD_LABELS: Record<string, string> = {
  'basic.identityName': 'Navn',
  'basic.age': 'Alder',
  'basic.gender': 'Kjønn',
  'basic.seekingGender': 'Hvem du søker',
  'basic.city': 'Sted',
  'basic.postalCode': 'Postnummer',
  'basic.distancePref': 'Maks avstand',
  'basic.agePrefMin': 'Min alder',
  'basic.agePrefMax': 'Maks alder',
  'personlighet.selfDesc': 'Om deg selv',
};

/**
 * Gjør serverens feilsvar om til noe brukeren faktisk kan handle på.
 * Ved 400 lister vi felt og årsak, slik at hun vet hva som må rettes
 * og på hvilket steg — i stedet for en generisk «prøv igjen».
 */
function formatSetupError(status: number, body: string): string {
  if (status === 401) {
    return 'Du er ikke lenger innlogget. Logg inn på nytt — svarene dine er lagret.';
  }

  try {
    const parsed = JSON.parse(body);
    const details = parsed?.details;
    if (Array.isArray(details) && details.length > 0) {
      const lines = details
        .slice(0, 5)
        .map((d: { field?: string; message?: string }) => {
          const label = FIELD_LABELS[d.field ?? ''] ?? d.field ?? 'Ukjent felt';
          return `${label}: ${d.message ?? 'ugyldig verdi'}`;
        });
      const rest = details.length > 5 ? ` (+${details.length - 5} til)` : '';
      return `Noe mangler i profilen din — ${lines.join('. ')}${rest}. Gå tilbake og rett det, så prøver vi igjen.`;
    }
    if (parsed?.error) return String(parsed.error);
  } catch {
    /* ikke JSON — fall gjennom til generisk melding */
  }

  return 'Kunne ikke lagre profilen din. Vennligst prøv igjen.';
}

interface OnboardingFlowProps {
  onComplete?: (profile: UserProfile) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
   // Flytt localStorage-henting til useEffect for å unngå HydrationMismatch
   // SSR ser alltid tomme felt — klientet hentar lagrede data etter mount
   const [data, setData] = useState<ProfileData>(() => ({ ...initialData }));

   // WP2: Init-tilstand (én kilde): server-draft (pågående utkast) >
   // prefill (fullførte profiler, redigeringsøkt) > localStorage (hurtigbuffer)
   useEffect(() => {
     async function init() {
       const [serverDraft, prefill] = await Promise.all([
         loadDraftFromServer(),
         loadPrefill(),
       ]);
       // 1) Pågående utkast vinner — brukerens nyeste tilstand
       if (serverDraft && Object.keys(serverDraft.data).length > 0) {
         setData((prev) => ({ ...prev, ...serverDraft.data }));
         if (serverDraft.step > 0) setStep(serverDraft.step);
         return;
       }
       // 2) Fullførte profiler pre-fylles
       if (prefill && prefill.data && Object.keys(prefill.data).length > 0) {
         setData((prev) => ({ ...prev, ...prefill.data }));
         if (prefill.step > 0) setStep(prefill.step);
         return;
       }
       // 3) Fallback til localStorage
       const localDraft = loadDraft();
       if (localDraft && Object.keys(localDraft).length > 0) {
         setData((prev) => ({ ...prev, ...localDraft }));
       }
     }
     init();
   }, []);
  const [fadeKey, setFadeKey] = useState(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autosave med debounce (400ms) + vis "Lagrer..."-indikator
  const [showSaving, setShowSaving] = useState(false);
  
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setShowSaving(true);
    saveTimerRef.current = setTimeout(() => {
      saveDraft(data); // localStorage som hurtigbuffer
      setShowSaving(false);
    }, 400);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [data]);

  // B2.2: Server-side autosave ved stegbytte (ikke-blokkerende)
  useEffect(() => {
    if (step > 0) {
      saveDraftToServer(step, data);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // WP2: Draft-rydding skjer ved VELLYKKET «Start reisen» (handleStartReisen) —
  // ikke ved å nå siste steg som tidligere (da gikk lokal buffer tapt selv
  // om innsending feilet, f.eks. nettverksfeil).

  const setField = (field: string, value: unknown) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const goToStep = useCallback((s: number) => {
    setStep(s);
    setFadeKey((k) => k + 1);
  }, []);

  // === Navigasjon (definert tidleg for å unngå reference-feil) ===
  const handleNext = () => goToStep(step + 1);
  const handleBack = () => { if (step > 0) goToStep(step - 1); };

  // === Steg-titlar og intro-tekstar (bokmål-korrekt) ===
  const stepsMeta = [
    { title: 'Grunnprofil', subtitle: 'La oss starte rolig. Vi vil gjerne bli litt kjent med deg — på en måte som føles trygg og ekte.' },
    { title: 'Personlighet & identitet', subtitle: 'Fortell litt om hvem du er — uten filter.' },
    { title: 'Livssituasjon', subtitle: 'Hva jobber du med, hva bor du i, og hvordan ser hverdagen din ut?' },
    { title: 'Tilknytning & trygghet', subtitle: 'Dette hjelper oss å forstå hva du trenger for å føle deg trygg.' },
    { title: 'Kjærlighetsspråk & nærhet', subtitle: 'Hvordan viser og mottar du kjærlighet?' },
    { title: 'Livsstil & verdier', subtitle: 'Hva prioriterer du i hverdagen?' },
    { title: 'Relasjonsstil', subtitle: 'Hvordan søker du relasjon — og hvordan balanserer du selvstendighet med fellesskap?' },
    { title: 'Framtid & visjon', subtitle: 'Hva drømmer du om å bygge?' },
    { title: 'Kommunikasjon & tilpasning', subtitle: 'Hvordan møter du endring og avklaring i en relasjon?' },
    { title: 'Grenser & behov', subtitle: 'Hvordan ser du på grenser i en relasjon — og hva trenger du at partneren din forstår?' },
    { title: 'Moden nysgjerrighet', subtitle: 'Hva trenger du for å føle deg trygg i nærhet?' },
    { title: 'Oppsummering', subtitle: 'Se over det du har delt. Du kan endre alt senere.' },
    { title: 'Start reisen', subtitle: 'Du er klar. Vi matcher deg rolig og presist — basert på det du har delt.' },
  ];

  const guidingTexts = [
    '',  // Steg 0 har eigen header i Step1Profile — ingen duplikat-guiding
    'Personligheten din er det som gjør deg til deg.',
    'Livssituasjonen din gir oss en viktig oversikt over hverdagen din.',
    'Tilknytningsmønsteret ditt sier mye om hvordan du møter andre mennesker.',
    'Hvordan du viser kjærlighet, er viktig for å finne noen som passer deg.',
    'Livsstilssvarene dine hjelper oss å finne noen som trives i hverdagen sammen med deg.',
    'Relasjonsstil forteller oss hvordan du søker — og det er like viktig som verdier.',
    'Fremtidsønsker viser veien for hva dere kan bygge sammen.',
    'Slik dere kommuniserer, er like viktig som hva dere deler.',
    'Grenser beskytter deg selv — og den du elsker. Del bare det du føler deg trygg med.',
    'Modne svar viser hvem du er. Del det du er komfortabel med.',
    'Du har nesten kommet helt til ende. Se over det du har delt.',
    'Nå er det bare å trykke på «Start reisen» så finner vi din match.',
  ];

  // === Steg-renderer ===
  const renderStep = () => {
    const baseProps = { data, onChange: setField };

    switch (step) {
      case 0:
        return <Step1Profile {...baseProps} onNext={handleNext} />;
      case 1:
        return <Step2Personlighet {...baseProps} onBack={handleBack} onNext={handleNext} />;
      case 2:
        return <Step2Livssituasjon {...baseProps} onBack={handleBack} onNext={handleNext} />;
      case 3:
        return <Step3Tilknytning step={step} goToStep={goToStep} onBack={handleBack} {...baseProps} onNext={handleNext} />;
      case 4:
        return <Step4Kjærlighetsspråk step={step} goToStep={goToStep} onBack={handleBack} {...baseProps} onNext={handleNext} />;
      case 5:
        return <Step5LivsstilVerdier step={step} goToStep={goToStep} onBack={handleBack} {...baseProps} onNext={handleNext} />;
      case 6:
        return <Step5Relasjonsstil {...baseProps} onBack={handleBack} onNext={handleNext} />;
      case 7:
        return <Step6FramtidVisjon step={step} goToStep={goToStep} onBack={handleBack} {...baseProps} onNext={handleNext} />;
      case 8:
        return <Step7HumorPersonlighet step={step} goToStep={goToStep} onBack={handleBack} {...baseProps} onNext={handleNext} />;
      case 9:
        return <Step8Grenser {...baseProps} onBack={handleBack} onNext={handleNext} />;
      case 10:
        return <Step8ModenNysgjerrighet step={step} goToStep={goToStep} onBack={handleBack} {...baseProps} onNext={handleNext} />;
      case 11:
        return <Step9Oppsummering step={step} goToStep={goToStep} data={data} onNext={handleNext} />;
      case 12:
        return <Step10StartReisen step={step} goToStep={goToStep} loading={saving} onStart={handleStartReisen} />;
      default:
        return null;
    }
  };

  // === Save + Matching (trigga frå Step10StartReisen) ===
  const handleStartReisen = async () => {
    setSaving(true);
    setError(null);
    try {
      // FORSKNINGSMOTOR F-6: Samle de 44 rå skalasvarene (1–5) etter item-id.
      // Kun verdier som faktisk er tall sendes — ubesvarte items utelates
      // (scoring.ts behandler manglende som nøytrale).
      const psychometrics: Record<string, number> = {};
      for (const item of ALL_ITEMS) {
        const v = data[item.id];
        if (typeof v === 'number' && v >= 1 && v <= 5) {
          psychometrics[item.id] = v;
        }
      }

      const payload = {
        basic: {
          identityName: data.identityName, age: data.age, gender: data.gender,
          seekingGender: data.seekingGender, height: data.height, bodyType: data.bodyType,
          lifestyle: data.lifestyle, smoking: data.smoking, religion: data.religion,
          children: data.children, wantChildren: data.wantChildren, city: data.city,
          // FIX: postalCode kreves av basicProfileSchema (lib/validation/onboarding-setup.ts)
          // men ble aldri sendt — ga 400 på /api/profile/setup hver gang.
          postalCode: data.postalCode,
          distancePref: data.distancePref, agePrefMin: data.agePrefMin, agePrefMax: data.agePrefMax,
        },
        personlighet: {
          selfDesc: data.selfDesc, energyGiver: data.energyGiver, energyDrainer: data.energyDrainer,
          pressureReact: data.pressureReact, quirk: data.quirk,
        },
        livssituasjon: {
          workType: data.workType, housingType: data.housingType,
          householdSize: data.householdSize, economicStability: data.economicStability,
          responsibilities: data.responsibilities, dailyRoutine: data.dailyRoutine,
        },
        tilknytning: {
          safetyNeed: data.safetyNeed, insecurityTrigger: data.insecurityTrigger,
          sadnessNeed: data.sadnessNeed, stressNeed: data.stressNeed, importantBoundary: data.importantBoundary,
        },
        // STEG 7.2 FIX: Fjernet commStyle/conflictStyle (duplisert med structureSpontaneity/introExtrovert i preferanser).
        // Bruker nå kanoniske feltnavn fra preferanserSchema.
        kommunikasjon: {
          calmingHelp: data.comfortableWith, trigger: data.insecurityTrigger, trustBuilder: data.safetyNeed,
        },
        kjaerlighet: {
          loveGive: data.loveGive, loveReceive: data.loveReceive, closenessBuilder: data.closenessBuilder,
          distanceCreator: data.distanceCreator, smallThing: data.smallThing,
        },
        livsstil: {
          highPriority: data.highPriority, lowPriority: data.lowPriority, goodEveryday: data.goodEveryday,
          desiredLifestyle: data.desiredLifestyle, undesiredLifestyle: data.undesiredLifestyle,
        },
        relasjonsStil: {
          relationshipSeeking: data.relationshipSeeking, closenessNeed: data.closenessNeed,
          independenceBalance: data.independenceBalance,
        },
        fremtid: {
          futureVision: data.futureVision, dreamGoal: data.dreamGoal, buildTogether: data.buildTogether,
          experienceAlone: data.experienceAlone, experienceTogether: data.experienceTogether,
        },
        humor: {
          laughterTrigger: data.laughterTrigger, quirkyHabit: data.quirkyHabit, guiltyPleasure: data.guiltyPleasure,
          totallyYou: data.totallyYou, partnerWouldLaugh: data.partnerWouldLaugh,
        },
        grenser: {
          neverCrossBoundary: data.neverCrossBoundary, understandPartnersBoundaries: data.understandPartnersBoundaries,
          limitations: data.limitations, partnerMustUnderstand: data.partnerMustUnderstand,
        },
        moden: {
          intimacySafety: data.intimacySafety, comfortableWith: data.comfortableWith, boundary: data.boundary,
          nearerType: data.nearerType, needsTime: data.needsTime,
        },
        preferanser: {
          politicsImportance: data.politicsImportance, religionImportance: data.religionImportance,
          dietPreference: data.dietPreference, sleepSchedule: data.sleepSchedule, pets: data.pets,
          travelFreq: data.travelFreq, alcoholFreq: data.alcoholFreq, ambitionLevel: data.ambitionLevel,
          structureSpontaneity: data.structureSpontaneity, introExtrovert: data.introExtrovert,
          attachmentStyle: data.attachmentStyle,
        },
        // FORSKNINGSMOTOR F-6: Rå psykometriske svar (1–5 per item)
        psychometrics,
      };

      const profileRes = await fetch('/api/profile/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!profileRes.ok) {
        // Serveren svarer { error, details: [{ field, message }] } ved 400.
        // Tidligere ble svaret lest og kastet — brukeren fikk kun «prøv igjen»,
        // og å prøve igjen med samme data hjalp aldri. Nå vises årsaken.
        const errBody = await profileRes.text().catch(() => '');
        throw new Error(formatSetupError(profileRes.status, errBody));
      }

      const profileData = await profileRes.json();
      const userId = profileData.userId || profileData.user?.id || '';

      // WP2: Profilen er lagret — rydd draft (server + lokal buffer) for at
      // neste onboarding-omgang starter rent. Fire-and-forget: bruker skal
      // ikke vente på rydding, og ryddingsfeil skal ikke blokkere suksessen.
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch { /* ignore */ }
      fetch('/api/onboarding/draft', { method: 'DELETE' }).catch(() => {});

      if (!userId) {
        // Kall onComplete-callback om han er definert (frå AppShell)
        if (onComplete) {
          onComplete({
            id: '',
            name: data.identityName || 'Bruker',
            age: parseInt(data.age) || 25,
            bio: data.selfDesc || '',
            values: [data.highPriority || '', data.loveGive || '', data.futureVision || ''].filter(Boolean),
            interests: [data.humor ? 'Humor' : '', data.lifestyle || '', data.dreamGoal || ''].filter(Boolean),
            photos: [],
            readyForMatch: true,
          });
        }
        window.location.href = '/matching';
        return;
      }

      // Kall onComplete-callback om han er definert (frå AppShell)
      if (onComplete) {
        onComplete({
          id: userId,
          name: data.identityName || 'Bruker',
          age: parseInt(data.age) || 25,
          bio: data.selfDesc || '',
          values: [data.highPriority || '', data.loveGive || '', data.futureVision || ''].filter(Boolean),
          interests: [data.lifestyle || '', data.dreamGoal || ''].filter(Boolean),
          photos: [],
          readyForMatch: true,
        });
        return;
      }

      // B5 — «Start reisen» setter kø, ikke umiddelbar matching
      // Invariant I-3: valg om å delta, ikke om hvem
      try {
        await fetch('/api/journey/queue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch { /* kø-feil — redirect allikevel */ }

      window.location.href = '/matching';
    } catch (err) {
      // Behold den konkrete årsaken fra formatSetupError — ikke overskriv
      // den med en generisk tekst. Nettverksfeil har ingen melding å vise,
      // og faller derfor tilbake til den rolige standardteksten.
      const message = err instanceof Error && err.message
        ? err.message
        : 'Kunne ikke lagre profilen din. Vennligst prøv igjen.';
      setError(message);
      setSaving(false);
    }
  };

  // Vis feilmelding på siste steg
  const showErrorOnLastStep = error && step === 12;

  const currentStepData = stepsMeta[step];
  const isLastStep = step === 12;
  const isFirstStep = step === 0;
  const totalSteps = 13;
  const progressPercent = Math.round(((step + 1) / totalSteps) * 100);

  // === SSR-safe animation injection ===
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes tosomFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    styleEl.setAttribute('data-tosom-animations', 'true');
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Pass error til layout for vising på siste steg
  const layoutError = step === 12 && error ? error : null;

  return (
    <OnboardingLayout
      currentStep={step}
      totalSteps={totalSteps}
      progressPercent={progressPercent}
      error={layoutError}
      isSaving={showSaving}
    >
      <div
        key={fadeKey}
        className="transition-opacity duration-300 ease-out"
        style={{ opacity: 0, animation: 'tosomFadeIn 0.3s ease-out forwards' }}
      >
        {renderStep()}
      </div>
    </OnboardingLayout>
  );
}