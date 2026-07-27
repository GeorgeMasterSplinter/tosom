/**
 * ToSom — OnboardingFlow (rebuild 2026)
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
  wantChildren: '', city: '', distancePref: 50, agePrefMin: 23, agePrefMax: 40,
  firstName: '', seeking: '', maxDistance: 50, minAge: 23, maxAge: 40, location: '',
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

   useEffect(() => {
     const draft = loadDraft();
     if (draft && Object.keys(draft).length > 0) {
       setData((prev) => ({ ...prev, ...draft }));
     }
   }, []);
  const [fadeKey, setFadeKey] = useState(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autosave med debounce (400ms) + vis "Sparar..."-indikator
  const [showSaving, setShowSaving] = useState(false);
  
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setShowSaving(true);
    saveTimerRef.current = setTimeout(() => {
      saveDraft(data);
      setShowSaving(false);
    }, 400);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [data]);

   // Rydd draft når reisen startar (allereie eksisterande useEffect)
  useEffect(() => {
    if (step > 11) {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    }
  }, [step]);

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
    { title: 'Relasjonsstil', subtitle: 'Hvordan søker du relasjon — og hvordan balanserer du selvstende med fellesskap?' },
    { title: 'Framtid & visjon', subtitle: 'Hva drømmer du om å bygge?' },
    { title: 'Lek, humor & personlighet', subtitle: 'De små detaljene som gjør deg til deg.' },
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
    'De små detaljene — som humor — forteller hvem du er.',
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
      const payload = {
        basic: {
          identityName: data.identityName, age: data.age, gender: data.gender,
          seekingGender: data.seekingGender, height: data.height, bodyType: data.bodyType,
          lifestyle: data.lifestyle, smoking: data.smoking, religion: data.religion,
          children: data.children, wantChildren: data.wantChildren, city: data.city,
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
        kommunikasjon: {
          commStyle: data.structureSpontaneity, conflictStyle: data.introExtrovert,
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
      };

      const profileRes = await fetch('/api/profile/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!profileRes.ok) {
        const errBody = await profileRes.text().catch(() => '');
        throw new Error('Kunne ikke lagre profil');
      }

      const profileData = await profileRes.json();
      const userId = profileData.userId || profileData.user?.id || '';

      if (!userId) {
        // Kall onComplete-callback om han er definert (frå AppShell)
        if (onComplete) {
          onComplete({
            id: '',
            name: data.identityName || 'Brukar',
            age: parseInt(data.age) || 25,
            bio: data.selfDesc || '',
            values: [data.highPriority || '', data.loveGive || '', data.futureVision || ''].filter(Boolean),
            interests: [data.humor ? 'Humor' : '', data.lifestyle || '', data.dreamGoal || ''].filter(Boolean),
            photos: [],
            readyForMatch: true,
          });
        }
        window.location.href = '/dashboard';
        return;
      }

      // Kall onComplete-callback om han er definert (frå AppShell)
      if (onComplete) {
        onComplete({
          id: userId,
          name: data.identityName || 'Brukar',
          age: parseInt(data.age) || 25,
          bio: data.selfDesc || '',
          values: [data.highPriority || '', data.loveGive || '', data.futureVision || ''].filter(Boolean),
          interests: [data.lifestyle || '', data.dreamGoal || ''].filter(Boolean),
          photos: [],
          readyForMatch: true,
        });
        return;
      }

      try {
        const matchRes = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        if (matchRes.ok) {
          window.location.href = `/matching?userId=${userId}`;
          return;
        }
      } catch { /* matching failed — fall through */ }

      window.location.href = '/dashboard';
    } catch (err) {
      setError('Kunne ikke lagre profilen din. Ver vennleg å prøv igjen.');
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
    >
      {/* Sparar-indikator */}
      {showSaving && !isLastStep && (
        <div className="absolute top-16 right-8 flex items-center gap-2 z-50">
          <svg className="animate-spin h-3 w-3" style={{ color: '#D4AF37' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs" style={{ color: 'rgba(212, 175, 55, 0.6)' }}>Sparar...</span>
        </div>
      )}

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