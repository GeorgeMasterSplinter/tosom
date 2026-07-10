/**
 * ToSom — OnboardingFlow (rebuild 2026)
 * 13-stegs flyt med nye steg: Livssituasjon, Relasjonsstil, Grenser.
 * Fase 4: Autosave + fade-transition.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { OnboardingLayout } from './OnboardingLayout';

import Step1Profile from './steps/Step1Profile';
import Step2Personlighet from './steps/Step2Personlighet';
import Step2Livssituasjon from './steps/Step2Livssituasjon';    // NY
import Step3Tilknytning from './steps/Step3Tilknytning';
import Step4Kjærlighetsspråk from './steps/Step4Kjærlighetsspråk';
import Step5LivsstilVerdier from './steps/Step5LivsstilVerdier';
import Step5Relasjonsstil from './steps/Step5Relasjonsstil';    // NY
import Step6FramtidVisjon from './steps/Step6FramtidVisjon';
import Step7HumorPersonlighet from './steps/Step7HumorPersonlighet';
import Step8Grenser from './steps/Step8Grenser';                // NY
import Step8ModenNysgjerrighet from './steps/Step8ModenNysgjerrighet';
import Step9Oppsummering from './steps/Step9Oppsummering';
import Step10StartReisen from './steps/Step10StartReisen';

const STORAGE_KEY = 'tosom_onboarding_draft';

interface ProfileData extends Record<string, unknown> {
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
  // Step 2 (Personlighet)
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
  // Step 2b (Livssituasjon) — NY
  workType: string;
  housingType: string;
  householdSize: string;
  economicStability: string;
  responsibilities: string;
  dailyRoutine: string;
  // Step 3
  safetyNeed: string;
  insecurityTrigger: string;
  sadnessNeed: string;
  stressNeed: string;
  importantBoundary: string;
  // Step 4
  loveGive: string;
  loveReceive: string;
  closenessBuilder: string;
  distanceCreator: string;
  smallThing: string;
  // Step 5 (Livsstil)
  highPriority: string;
  lowPriority: string;
  goodEveryday: string;
  desiredLifestyle: string;
  undesiredLifestyle: string;
  // Step 5b (Relasjonsstil) — NY
  relationshipSeeking: string;
  closenessNeed: string;
  independenceBalance: string;
  // Step 6
  futureVision: string;
  dreamGoal: string;
  buildTogether: string;
  experienceAlone: string;
  experienceTogether: string;
  // Step 7
  laughterTrigger: string;
  quirkyHabit: string;
  guiltyPleasure: string;
  totallyYou: string;
  partnerWouldLaugh: string;
  // Step 8 (Grenser) — NY
  neverCrossBoundary: string;
  understandPartnersBoundaries: string;
  limitations: string;
  partnerMustUnderstand: string;
  // Step 8b (ModenNysgjerrighet)
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
  // Livssituasjon — ny
  workType: '', housingType: '', householdSize: '', economicStability: '', responsibilities: '', dailyRoutine: '',
  safetyNeed: '', insecurityTrigger: '', sadnessNeed: '', stressNeed: '', importantBoundary: '',
  loveGive: '', loveReceive: '', closenessBuilder: '', distanceCreator: '', smallThing: '',
  highPriority: '', lowPriority: '', goodEveryday: '', desiredLifestyle: '', undesiredLifestyle: '',
  // Relasjonsstil — ny
  relationshipSeeking: '', closenessNeed: '', independenceBalance: '',
  futureVision: '', dreamGoal: '', buildTogether: '', experienceAlone: '', experienceTogether: '',
  laughterTrigger: '', quirkyHabit: '', guiltyPleasure: '', totallyYou: '', partnerWouldLaugh: '',
  // Grenser — ny
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

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<ProfileData>(() => ({ ...initialData, ...loadDraft() }));
  const [fadeKey, setFadeKey] = useState(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autosave med debounce (400ms)
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveDraft(data), 400);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [data]);

  // Rydd draft når reisen starter
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

  // === Save + Matching (for Step 13) ===
  const handleStartReisen = async () => {
    setSaving(true);
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
        livssituasjon: {                                                    // NY
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
        relasjonsStil: {                                                     // NY
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
        grenser: {                                                           // NY
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

      console.log("PROFILE SETUP: Starting...", { basic: { identityName: data.identityName, age: data.age } });
      const profileRes = await fetch('/api/profile/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!profileRes.ok) {
        const errBody = await profileRes.text().catch(() => '');
        console.error("PROFILE SETUP FAILED:", { status: profileRes.status, body: errBody });
        throw new Error('Kunne ikke lagre profil');
      }

      const profileData = await profileRes.json();
      console.log("PROFILE SETUP RESPONSE:", { status: profileRes.status, data: profileData });

      const userId = profileData.userId || profileData.user?.id || '';
      console.log("EXTRACTED userId:", { userId, profileDataKeys: Object.keys(profileData) });

      if (!userId) {
        console.log("REDIRECT: userId missing", { userId, profileData });
        window.location.href = '/dashboard';
        return;
      }

      try {
        console.log("API REQUEST: /api/match", { userId });
        const matchRes = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        console.log("MATCHING RESPONSE STATUS:", matchRes.status);
        if (matchRes.ok) {
          const matchData = await matchRes.json().catch(() => ({}));
          console.log("REDIRECT: matching success", { userId, matchResult: matchData });
          window.location.href = `/matching?userId=${userId}`;
          return;
        }
        const matchErrorText = await matchRes.text().catch(() => '');
        console.log("REDIRECT: matching non-OK", { userId, matchStatus: matchRes.status, matchBody: matchErrorText });
      } catch (err) {
        console.log("REDIRECT: matching exception", { userId, matchError: err instanceof Error ? err.message : String(err) });
      }

      console.log("REDIRECT: fallback to dashboard", { userId });
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    const baseProps = { data, onChange: setField };

    switch (step) {
      case 0:
        return <Step1Profile {...baseProps} onNext={() => goToStep(1)} />;
      case 1:
        return <Step2Personlighet {...baseProps} onBack={() => goToStep(0)} onNext={handleNext} />;
      case 2:
        return <Step2Livssituasjon {...baseProps} onBack={() => goToStep(1)} onNext={handleNext} />;  // NY
      case 3:
        return <Step3Tilknytning step={step} goToStep={goToStep} {...baseProps} onNext={handleNext} />;
      case 4:
        return <Step4Kjærlighetsspråk step={step} goToStep={goToStep} {...baseProps} onNext={handleNext} />;
      case 5:
        return <Step5LivsstilVerdier step={step} goToStep={goToStep} {...baseProps} onNext={handleNext} />;
      case 6:
        return <Step5Relasjonsstil {...baseProps} onBack={() => goToStep(5)} onNext={handleNext} />;  // NY
      case 7:
        return <Step6FramtidVisjon step={step} goToStep={goToStep} {...baseProps} onNext={handleNext} />;
      case 8:
        return <Step7HumorPersonlighet step={step} goToStep={goToStep} {...baseProps} onNext={handleNext} />;
      case 9:
        return <Step8Grenser {...baseProps} onBack={() => goToStep(8)} onNext={handleNext} />;  // NY
      case 10:
        return <Step8ModenNysgjerrighet step={step} goToStep={goToStep} {...baseProps} onNext={handleNext} />;
      case 11:
        return <Step9Oppsummering step={step} goToStep={goToStep} data={data} onNext={handleNext} onBack={() => goToStep(10)} />;
      case 12:
        return <Step10StartReisen step={step} goToStep={goToStep} loading={saving} />;
      default:
        return null;
    }
  };

  const handleNext = () => goToStep(step + 1);
  const handleBack = () => { if (step > 0) goToStep(step - 1); };

  // Steg-titler og introtekster (13 steg)
  const stepsMeta = [
    { title: 'Grunnprofil', subtitle: 'La oss starte rolig. Vi vil gjerne bli litt kjent med deg — på en måte som føles trygg og ekte.' },
    { title: 'Personlighet & identitet', subtitle: 'Fortell litt om hvem du er — uten filter.' },
    { title: 'Livssituasjon', subtitle: 'Kva jobbar du med, kva bur du i, og korleis ser kvardagen din ut?' },
    { title: 'Tilknytning & trygghet', subtitle: 'Dette hjelper oss å forstå hva du trenger for å føle deg trygg.' },
    { title: 'Kjærlighetsspråk & nærhet', subtitle: 'Hvordan viser og mottar du kjærlighet?' },
    { title: 'Livsstil & verdier', subtitle: 'Hva prioriterer du i hverdagen?' },
    { title: 'Relasjonsstil', subtitle: 'Korleie søker du relasjon — og korleis balanserer du sjølvstende med fellesskap?' },
    { title: 'Framtid & visjon', subtitle: 'Hva drømmer du om å bygge?' },
    { title: 'Lek, humor & personlighet', subtitle: 'De små detaljene som gjør deg til deg.' },
    { title: 'Grenser & behov', subtitle: 'Korleis ser du på grenser i ein relasjon — og kva treng du at partneren din forstår?' },
    { title: 'Moden nysgjerrighet', subtitle: 'Hva trenger du for å føle deg trygg i nærhet?' },
    { title: 'Oppsummering', subtitle: 'Se over det du har delt. Du kan endre alt senere.' },
    { title: 'Start reisen', subtitle: 'Du er klar. Vi matcher deg rolig og presist — basert på det du har delt.' },
  ];

  const guidingTexts = [
    "Vi starter med det grunnleggende, slik at vi kan bli litt kjent med deg.",
    "Personligheten din er det som gjør deg til deg.",
    "Livssituasjonen din gir oss ein viktig oversikt over kvardagen din.",
    "Tilknytningsmønsteret ditt sier mye om hvordan du møter andre mennesker.",
    "Hvordan du viser kjærlighet, er viktig for å finne noen som passer deg.",
    "Livsstilssvarene dine hjelper oss å finne noen som trives i hverdagen sammen med deg.",
    "Relasjonsstil forteller oss korleie du søker — og det er like viktig som verdier.",
    "Fremtidsønsker viser veien for hva dere kan bygge sammen.",
    "De små detaljene — som humor — forteller hvem du er.",
    "Grenser beskytten deg sjølv — og den du elsker. Del berre det du føler deg trygg med.",
    "Modne svar viser deg som person. Del det du er komfortabel med.",
    "Du har nesten kommet helt til ende. Se over det du har delt.",
    "Nå er det bare å trykke på \"Start reisen\" så finner vi din match.",
  ];

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

  return (
    <OnboardingLayout
      currentStep={step}
      totalSteps={totalSteps}
      title={currentStepData.title}
      subtitle={currentStepData.subtitle}
      guidingText={guidingTexts[step]}
      progressPercent={progressPercent}
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