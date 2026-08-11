/**
 * ToSom — Steg 9: Oppsummering (Premium rebuild 2026 — Fase 4)
 * 
 * Menneskeleselig oppsummering av hele profilen, gruppert i seksjoner med gull-rammer.
 */

'use client';

import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';

interface Props {
  data: Record<string, unknown>;
  onNext: () => void;
  step: number;
  goToStep: (s: number) => void;
}

const val = (f: string, fb = '—') => (d: Record<string, unknown>) => {
  const v = d[f];
  return v !== undefined && v !== null ? String(v) : fb;
};
const num = (f: string, fb = 0) => (d: Record<string, unknown>) => {
  const v = d[f];
  return v !== undefined && v !== null ? Number(v) : fb;
};

export default function Step9Oppsummering({ data, onNext, goToStep }: Props) {
  // Helper-funksjon for å gjere felt synlege bare dersom dei har verdi
  const Field = ({ label, value, showIf }: { label: string; value: string; showIf?: boolean }) => {
    if (showIf && !value) return null;
    return (
      <div className="flex justify-between">
        <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{label}</span>
        <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{value || '—'}</span>
      </div>
    );
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.2)' }}>
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#D4AF37' }}>{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );

  const getName = val('identityName');
  const getAge = val('age');
  const getHeight = val('height');
  const getDistance = num('distancePref', 50);
  const getMinAge = num('minAge', 23);
  const getMaxAge = num('maxAge', 40);

  return (
    <OnboardingSlide
      title="Oppsummering"
      subtitle="Se over det du har delt. Du kan endre alt senere."
       guidingText="Dette er hele profilen din — rolig, trygg og komplett."
      slideIndex={11}
      totalSlides={13}
    >
      <div className="space-y-6">
        {/* Grunnprofil */}
        <Section title="Grunnprofil">
          <Field label="Navn" value={getName(data)} />
          <Field label="Alder" value={getAge(data) !== '—' ? `${getAge(data)} år` : '—'} />
          <Field label="Kjønn" value={val('gender')(data)} />
          <Field label="Søker" value={val('seekingGender')(data)} />
          <Field label="Bosted" value={val('city')(data)} />
          <Field label="Høyde" value={getHeight(data) !== '—' ? `${getHeight(data)} cm` : '—'} showIf />
          <Field label="Kroppstype" value={val('bodyType')(data)} showIf />
          <Field label="Livsstil" value={val('lifestyle')(data)} showIf />
          <Field label="Røyking/snus" value={val('smoking')(data)} showIf />
          <Field label="Barn" value={val('children')(data)} showIf />
          <Field label="Ønsker barn" value={val('wantChildren')(data)} showIf />
        </Section>

        {/* Livsstil & verdier */}
        <Section title="Livsstil & verdier">
          <Field label="Høgaste prioritet" value={val('highPriority')(data)} showIf />
          <Field label="God hverdag" value={val('goodEveryday')(data)} showIf />
           <Field label="Ønsket livsstil" value={val('desiredLifestyle')(data)} showIf />
        </Section>

        {/* Avstand & alder */}
        <Section title="Avstand & alderspref">
          <Field label="Maks avstand" value={`${getDistance(data)} km`} />
          <Field label="Aldersintervall" value={`${getMinAge(data)}–${getMaxAge(data)} år`} />
        </Section>

        {/* Personlighet */}
        <Section title="Personlighet">
          <Field label="Om deg" value={val('selfDesc')(data)} showIf />
          <Field label="Gir deg energi" value={val('energyGiver')(data)} showIf />
          <Field label="Tappar energi" value={val('energyDrainer')(data)} showIf />
          <Field label="Under press" value={val('pressureReact')(data)} showIf />
          <Field label="Quirk" value={val('quirk')(data)} showIf />
        </Section>

        {/* Livssituasjon */}
        <Section title="Livssituasjon">
          <Field label="Arbeid" value={val('workType')(data)} showIf />
          <Field label="Boetype" value={val('housingType')(data)} showIf />
          <Field label="Hushaldning" value={val('householdSize')(data)} showIf />
          <Field label="Økonomi" value={val('economicStability')(data)} showIf />
          <Field label="Ansvar" value={val('responsibilities')(data)} showIf />
           <Field label="Hverdagsrutine" value={val('dailyRoutine')(data)} showIf />
        </Section>

        {/* Tilknytning */}
        <Section title="Tilknytning & trygghet">
          <Field label="Trygghet" value={val('safetyNeed')(data)} showIf />
           <Field label="Usikkerhetsutløser" value={val('insecurityTrigger')(data)} showIf />
           <Field label="Når du er lei" value={val('sadnessNeed')(data)} showIf />
           <Field label="Når du er stresset" value={val('stressNeed')(data)} showIf />
          <Field label="Viktig grense" value={val('importantBoundary')(data)} showIf />
        </Section>

        {/* Kjærlighetsspråk */}
        <Section title="Kjærlighetsspråk & nærhet">
          <Field label="Viser kjærlighet" value={val('loveGive')(data)} showIf />
          <Field label="Mottar kjærlighet" value={val('loveReceive')(data)} showIf />
          <Field label="Byggjer nærheit" value={val('closenessBuilder')(data)} showIf />
          <Field label="Skaper avstand" value={val('distanceCreator')(data)} showIf />
           <Field label="Liten ting som betyr mye" value={val('smallThing')(data)} showIf />
        </Section>

        {/* Relasjonsstil */}
        <Section title="Relasjonsstil">
          <Field label="Søker" value={val('relationshipSeeking')(data)} showIf />
          <Field label="Nærheitsbehov" value={val('closenessNeed')(data)} showIf />
           <Field label="Selvstend vs fellesskap" value={val('independenceBalance')(data)} showIf />
        </Section>

        {/* Framtid */}
        <Section title="Framtid og visjon">
          <Field label="Din framtidvisjon" value={val('futureVision')(data)} showIf />
          <Field label="Din største drøm" value={val('dreamGoal')(data)} showIf />
          <Field label="Bygge saman" value={val('buildTogether')(data)} showIf />
          <Field label="Oppleve aleine" value={val('experienceAlone')(data)} showIf />
          <Field label="Oppleve saman" value={val('experienceTogether')(data)} showIf />
        </Section>

        {/* Humor */}
        <Section title="Humor & personlighet">
          <Field label="Får deg til å le" value={val('laughterTrigger')(data)} showIf />
          <Field label="Quirky vane" value={val('quirkyHabit')(data)} showIf />
          <Field label="Guilty pleasure" value={val('guiltyPleasure')(data)} showIf />
          <Field label="Helt deg" value={val('totallyYou')(data)} showIf />
          <Field label="Partneren ville le av" value={val('partnerWouldLaugh')(data)} showIf />
        </Section>

        {/* Grenser */}
        <Section title="Grenser & behov">
          <Field label="Aldri krysse" value={val('neverCrossBoundary')(data)} showIf />
           <Field label="Forstå partnerens grenser" value={val('understandPartnersBoundaries')(data)} showIf />
           <Field label="Dine avgrensninger" value={val('limitations')(data)} showIf />
          <Field label="Partner må forstå" value={val('partnerMustUnderstand')(data)} showIf />
        </Section>

        {/* Moden nysgjerrighet */}
        <Section title="Moden nysgjerrighet">
          <Field label="Intimitet trygg" value={val('intimacySafety')(data)} showIf />
          <Field label="Komfortabel med" value={val('comfortableWith')(data)} showIf />
          <Field label="Personleg grense" value={val('boundary')(data)} showIf />
          <Field label="Nærheitstype" value={val('nearerType')(data)} showIf />
          <Field label="Treng tid til" value={val('needsTime')(data)} showIf />
        </Section>

        {/* CTA */}
        <div className="mt-8 space-y-4">
           <p className="text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
            Du har fullført hele profilen din! Nå er det klart for matching.
          </p>
          <BackButton onClick={() => goToStep(10)} />
          <PremiumCTAButton onClick={onNext} label="Start reisen din" fullWidth />
        </div>
      </div>
    </OnboardingSlide>
  );
}