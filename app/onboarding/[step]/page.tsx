/**
 * ToSom — Onboarding Dynamic Step Page (1-7)
 * Håndterer alle onboarding-steg med state-håndtering og validering.
 */

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import OnboardingLayout from '../layout';
import OnboardingCard from '@/components/onboarding/OnboardingCard';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import OnboardingNav from '@/components/onboarding/OnboardingNav';
import OnboardingInput from '@/components/onboarding/OnboardingInput';
import OnboardingSelect from '@/components/onboarding/OnboardingSelect';
import OnboardingSlider from '@/components/onboarding/OnboardingSlider';
import OnboardingTextarea from '@/components/onboarding/OnboardingTextarea';
import { color, spacing } from '@/config/design-tokens';

// Steg-data med felt for hvert steg (7 sider)
const stepData: Record<number, { title: string; subtitle?: string; guiding?: string }> = {
  1: { title: 'Velkommen til din reise' },
  2: { title: 'Hvem er du?', guiding: 'Velg det som passer deg. Alt er valgfritt.' },
  3: { title: 'Hverdag og livsstil', guiding: 'Dette hjelper oss å forstå hverdagen din.' },
  4: { title: 'Relasjonsstil', guiding: 'Ta deg tid. Svar så kort eller langt du ønsker.' },
  5: { title: 'Verdier og trygghet', guiding: 'Det som gir mening for deg — svar når det føles riktig.' },
  6: { title: 'Preferanser og kompatibilitet', guiding: 'Dine tanker om hva som matcher — ingen feil svar.' },
  7: { title: 'Oppsummering', guiding: 'Din profil er nesten klar' },
};

// Select-options
const genderOptions = [
  { value: 'man', label: 'Mand' },
  { value: 'woman', label: 'Kvinne' },
  { value: 'nonbinary', label: 'Ikke-binær' },
];

const seekingOptions = [
  { value: 'relationship', label: 'Et seriøst forhold' },
  { value: 'friendship', label: 'Dype venner' },
  { value: 'exploring', label: 'Utforsker hva som er mulig' },
];

const childrenOptions = [
  { value: 'none', label: 'Nei' },
  { value: 'yes', label: 'Ja' },
];

const wantsChildrenOptions = [
  { value: 'undecided', label: 'Er ikke bestemt ennå' },
  { value: 'open', label: 'Åpen for det' },
  { value: 'definitely', label: 'Absolutt ja' },
];

const loveLanguageOptions = [
  { value: 'words', label: 'Ord og bekreftelse' },
  { value: 'time', label: 'Kvalitetstid' },
  { value: 'gifts', label: 'Gaver og gestus' },
  { value: 'service', label: 'Gjørelser og hjelp' },
  { value: 'touch', label: 'Fysisk nærhet' },
];

const bodyTypeOptions = [
  { value: 'athletic', label: 'Athletisk' },
  { value: 'average', label: 'Gjennomsnittlig' },
  { value: 'muscular', label: 'Muskuløs' },
  { value: 'slim', label: 'Slank' },
];

const exerciseOptions = [
  { value: 'daily', label: 'Daglig' },
  { value: 'weekly', label: 'Ukentlig' },
  { value: 'rarely', label: 'Sjelden' },
];

const smokingOptions = [
  { value: 'never', label: 'Aldri' },
  { value: 'socially', label: 'Sosialt' },
  { value: 'regularly', label: 'Regelmessig' },
];

const alcoholOptions = [
  { value: 'never', label: 'Aldri' },
  { value: 'socially', label: 'Sosialt' },
  { value: 'often', label: 'Ofte' },
];

const sleepOptions = [
  { value: 'early', label: 'Tidlig på kvelden' },
  { value: 'normal', label: 'Normale tider' },
  { value: 'nightowl', label: 'Nattefugl' },
];

const religionOptions = [
  { value: 'christian', label: 'Kristen' },
  { value: 'other', label: 'Annen tro' },
  { value: 'agnostic', label: 'Agnostisk' },
  { value: 'atheist', label: 'Ateist' },
  { value: 'exploring', label: 'Utforsker' },
];

// SVG Icons for summary
const UserIcon = () => (
  <svg className="inline-block w-4 h-4 mr-2" style={{ color: 'rgba(212, 175, 55, 0.6)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="inline-block w-4 h-4 mr-2" style={{ color: 'rgba(212, 175, 55, 0.6)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="inline-block w-4 h-4 mr-2" style={{ color: 'rgba(212, 175, 55, 0.6)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="inline-block w-4 h-4 mr-2" style={{ color: 'rgba(212, 175, 55, 0.6)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

// Steg 1 — Introduksjon
function Step1Introduksjon({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-6">
      <p
        className="leading-relaxed"
        style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px', lineHeight: '1.6' }}
      >
        I en tid hvor hastighet har erstattet ro, velger du noe annerledes.
        <br /><br />
        ToSom tror på at de dypeste forbindelsene bygger på felles verdier, trygghet og tid.
        Ikke utseende, ikke swiping, ikke gaming.
        <br /><br />
        Denne reisen tar ca 10 minutter — men den kan endre hvordan du møter noen for livet.
      </p>
      <OnboardingNav onNext={onNext} showBack={false} nextLabel="Start" />
    </div>
  );
}

// Steg 2 — Grunnprofil (Valg-side)
function Step2Grunnprofil({ onNext, onBack, data }: { onNext: () => void; onBack: () => void; data: Record<string, string | number> }) {
  return (
    <div className="space-y-6">
      {/* Grupper: Identitet */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium" style={{ color: 'rgba(212, 175, 55, 0.5)' }}>Identitet</h4>
        <OnboardingInput label="Navn" name="name" value={data.name as string} onChange={() => {}} placeholder="Ditt fulle navn" />
        <OnboardingSlider label="Din alder" name="age" min={21} max={99} value={data.age as number} onChange={() => {}} unit="" />
        <OnboardingSelect label="Kjønn" name="gender" options={genderOptions} value={data.gender as string} onChange={() => {}} placeholder="Velg kjønn" />
      </div>

      {/* Grupper: Preferanser */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium" style={{ color: 'rgba(212, 175, 55, 0.5)' }}>Preferanser</h4>
        <OnboardingSlider label="Minste alder" name="minAge" min={21} max={90} value={data.minAge as number} onChange={() => {}} unit="" />
        <OnboardingSlider label="Maks alder" name="maxAge" min={22} max={99} value={data.maxAge as number} onChange={() => {}} unit="" />
        <OnboardingSelect label="Hva søker du?" name="seeking" options={seekingOptions} value={data.seeking as string} onChange={() => {}} placeholder="Velg..." />
      </div>

      <OnboardingNav onNext={onNext} onBack={onBack} nextLabel="Neste" />
    </div>
  );
}

// Steg 3 — Hverdag og livsstil (Slått sammen)
function Step3Hverdag({ onNext, onBack, data }: { onNext: () => void; onBack: () => void; data: Record<string, string | number> }) {
  return (
    <div className="space-y-6">
      {/* Grupper: Hverdag */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium" style={{ color: 'rgba(212, 175, 55, 0.5)' }}>Hverdag</h4>
        <OnboardingInput label="Bosted" name="location" value={data.location as string} onChange={() => {}} placeholder="Hvor bor du?" />
        <OnboardingSlider label="Maks avstand" name="maxDistance" min={1} max={200} value={data.maxDistance as number} onChange={() => {}} unit=" km" />
        <OnboardingInput label="Jobb / studier" name="work" value={data.work as string} onChange={() => {}} placeholder="Hva jobber du med?" />
      </div>

      {/* Grupper: Familie */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium" style={{ color: 'rgba(212, 175, 55, 0.5)' }}>Familie</h4>
        <OnboardingSelect label="Har du barn?" name="hasChildren" options={childrenOptions} value={data.hasChildren as string} onChange={() => {}} placeholder="Velg..." />
        <OnboardingSelect label="Ønsker du barn?" name="wantsChildren" options={wantsChildrenOptions} value={data.wantsChildren as string} onChange={() => {}} placeholder="Velg..." />
      </div>

      {/* Grupper: Livsstil */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium" style={{ color: 'rgba(212, 175, 55, 0.5)' }}>Livsstil</h4>
        <OnboardingInput label="Høyde" name="height" value={data.height as string} onChange={() => {}} placeholder="180 cm" />
        <OnboardingSelect label="Kroppstype" name="bodyType" options={bodyTypeOptions} value={data.bodyType as string} onChange={() => {}} placeholder="Velg..." />
        <OnboardingSelect label="Trening" name="exercise" options={exerciseOptions} value={data.exercise as string} onChange={() => {}} placeholder="Velg..." />
      </div>

      {/* Grupper: Vaner */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium" style={{ color: 'rgba(212, 175, 55, 0.5)' }}>Vaner</h4>
        <OnboardingSelect label="Røyking / snus" name="smoking" options={smokingOptions} value={data.smoking as string} onChange={() => {}} placeholder="Velg..." />
        <OnboardingSelect label="Alkohol" name="alcohol" options={alcoholOptions} value={data.alcohol as string} onChange={() => {}} placeholder="Velg..." />
        <OnboardingSelect label="Søvnvaner" name="sleep" options={sleepOptions} value={data.sleep as string} onChange={() => {}} placeholder="Velg..." />
        <OnboardingSelect label="Religion / livssyn" name="religion" options={religionOptions} value={data.religion as string} onChange={() => {}} placeholder="Velg..." />
      </div>

      <OnboardingNav onNext={onNext} onBack={onBack} nextLabel="Neste" />
    </div>
  );
}

// Steg 4 — Relasjonsstil (Skrive-side med mer luft)
function Step4Relasjonsstil({ onNext, onBack, data }: { onNext: () => void; onBack: () => void; data: Record<string, string | number> }) {
  return (
    <div className="space-y-6">
      <OnboardingTextarea label="Hvordan håndterer du konflikter?" name="conflictStyle" value={data.conflictStyle as string} onChange={() => {}} placeholder="Beskriv hvordan du vanligvis håndterer uenigheter..." maxLength={4000} />
      <OnboardingTextarea label="Hva får deg til å føle deg trygg?" name="safetyNeeds" value={data.safetyNeeds as string} onChange={() => {}} placeholder="Tenk på en relasjon hvor du har følt deg trygg. Hva gjorde den så spesiell?" maxLength={4000} />
      <OnboardingSelect label="Hvordan viser du kjærlighet?" name="loveLanguage" options={loveLanguageOptions} value={data.loveLanguage as string} onChange={() => {}} placeholder="Velg..." />
      <OnboardingSelect label="Hvordan liker du å motta kjærlighet?" name="receiveLove" options={loveLanguageOptions} value={data.receiveLove as string} onChange={() => {}} placeholder="Velg..." />
      <OnboardingTextarea label="Hva trenger du fra en partner i vanskelige situasjoner?" name="partnerSupport" value={data.partnerSupport as string} onChange={() => {}} placeholder="Beskriv hva som ville hjulpet deg..." maxLength={4000} />
      <OnboardingNav onNext={onNext} onBack={onBack} nextLabel="Neste" />
    </div>
  );
}

// Steg 5 — Verdier og trygghet (Skrive-side med mer luft)
function Step5Verdier({ onNext, onBack, data }: { onNext: () => void; onBack: () => void; data: Record<string, string | number> }) {
  return (
    <div className="space-y-6">
      <OnboardingTextarea label="Hva er viktig for deg i en relasjon?" name="importantValues" value={data.importantValues as string} onChange={() => {}} placeholder="Tenk på de verdiene som betyr mest..." maxLength={4000} />
      <OnboardingTextarea label="Hva gir deg ro i hverdagen?" name="dailyPeace" value={data.dailyPeace as string} onChange={() => {}} placeholder="Beskriv noe som gir deg ro og balanse..." maxLength={4000} />
      <OnboardingTextarea label="Hva ønsker du å bygge sammen med en partner?" name="buildTogether" value={data.buildTogether as string} onChange={() => {}} placeholder="Tenk på drømmen din om et felles liv..." maxLength={4000} />
      <OnboardingNav onNext={onNext} onBack={onBack} nextLabel="Neste" />
    </div>
  );
}

// Steg 6 — Preferanser og kompatibilitet (Skrive-side med mer luft)
function Step6Preferanser({ onNext, onBack, data }: { onNext: () => void; onBack: () => void; data: Record<string, string | number> }) {
  return (
    <div className="space-y-6">
      <OnboardingTextarea label="Hva tiltrekker deg?" name="attraction" value={data.attraction as string} onChange={() => {}} placeholder="Beskriv hva som skaper interesse mellom to voksne mennesker..." maxLength={4000} />
      <OnboardingTextarea label="Hva er dine 'deal breakers'?" name="dealbreakers" value={data.dealbreakers as string} onChange={() => {}} placeholder="Tenk på grensene dine — hva er viktig for deg å beskytte?" maxLength={4000} />
      <OnboardingTextarea label="Hva ønsker du å utforske i en relasjon?" name="explore" value={data.explore as string} onChange={() => {}} placeholder="Tenk på det ukjente — hva er noe du gjerne vil oppdage sammen med noen?" maxLength={4000} />
      <OnboardingTextarea label="Hva er dine langsiktige mål?" name="longterm" value={data.longterm as string} onChange={() => {}} placeholder="Hva ser du for deg om 5–10 år?" maxLength={4000} />
      <OnboardingNav onNext={onNext} onBack={onBack} nextLabel="Neste" />
    </div>
  );
}

// Steg 7 — Oppsummering (Premium gold variant)
function Step7Oppsummering({ onNext, data }: { onNext: () => void; data: Record<string, string | number> }) {
  return (
    <div className="space-y-8">
      <div className="rounded-xl p-6" style={{ background: 'rgba(212, 175, 55, 0.04)', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
        <h3 className="mb-4 text-base font-semibold" style={{ color: 'rgba(212, 175, 55, 0.8)' }}>Din profil</h3>
        <div className="space-y-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <p><UserIcon /><strong style={{ color: 'rgba(212, 175, 55, 0.6)' }}>Navn:</strong> {data.name || 'Ikke oppgitt'}</p>
          <p><CalendarIcon /><strong style={{ color: 'rgba(212, 175, 55, 0.6)' }}>Alder:</strong> {data.age || '—'} år</p>
          <p><strong style={{ color: 'rgba(212, 175, 55, 0.6)' }}>Aldersspann:</strong> {data.minAge || '—'}–{data.maxAge || '—'}</p>
          <p><LocationIcon /><strong style={{ color: 'rgba(212, 175, 55, 0.6)' }}>Bosted:</strong> {data.location || 'Ikke oppgitt'}</p>
          <p><BriefcaseIcon /><strong style={{ color: 'rgba(212, 175, 55, 0.6)' }}>Jobb:</strong> {data.work || 'Ikke oppgitt'}</p>
        </div>
      </div>
      
      <p className="text-center italic" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
        Dette er starten på reisen din. Du kan endre alt senere.
      </p>

      <OnboardingNav onNext={onNext} showBack={false} nextLabel="Fullfør onboarding" />
    </div>
  );
}

// Hovedkomponent for dynamisk steg-page
export default function OnboardingStepPage() {
  const params = useParams() as Record<string, string> | null;
  const router = useRouter();
  const stepNum = parseInt(params?.step || '1');
  
  const [stepData_, setStepData] = useState<Record<string, string | number>>({
    name: '',
    age: 30,
    minAge: 25,
    maxAge: 40,
    gender: '',
    seeking: '',
    location: '',
    maxDistance: 50,
    work: '',
    hasChildren: '',
    wantsChildren: '',
    conflictStyle: '',
    safetyNeeds: '',
    loveLanguage: '',
    receiveLove: '',
    partnerSupport: '',
    importantValues: '',
    dailyPeace: '',
    buildTogether: '',
    height: '',
    bodyType: '',
    exercise: '',
    smoking: '',
    alcohol: '',
    sleep: '',
    religion: '',
    attraction: '',
    dealbreakers: '',
    explore: '',
    longterm: '',
  });

  const currentStep = Math.max(1, Math.min(7, stepNum));
  const config = stepData[currentStep] || { title: 'Ukjent steg' };

  const handleNext = () => {
    if (currentStep < 7) {
      router.push(`/onboarding/${currentStep + 1}`);
    } else {
      console.log('Onboarding fullført:', stepData_);
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      router.push(`/onboarding/${currentStep - 1}`);
    }
  };

  // Render riktig innhold basert på steg
  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Introduksjon onNext={handleNext} />;
      case 2:
        return <Step2Grunnprofil onNext={handleNext} onBack={handleBack} data={stepData_} />;
      case 3:
        return <Step3Hverdag onNext={handleNext} onBack={handleBack} data={stepData_} />;
      case 4:
        return <Step4Relasjonsstil onNext={handleNext} onBack={handleBack} data={stepData_} />;
      case 5:
        return <Step5Verdier onNext={handleNext} onBack={handleBack} data={stepData_} />;
      case 6:
        return <Step6Preferanser onNext={handleNext} onBack={handleBack} data={stepData_} />;
      case 7:
        return <Step7Oppsummering onNext={handleNext} data={stepData_} />;
      default:
        return <div>Ukjent steg</div>;
    }
  };

  return (
    <OnboardingLayout>
      <OnboardingCard variant={currentStep === 7 ? 'gold' : 'default'}>
        <OnboardingHeader title={config.title} subtitle={config.subtitle} />
        {config.guiding && (
          <p className="mb-6 text-center italic text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            {config.guiding}
          </p>
        )}
        {renderContent()}
      </OnboardingCard>
    </OnboardingLayout>
  );
}