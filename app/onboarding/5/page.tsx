/**
 * ToSom Onboarding Step 5 — Oppsummering
 */

'use client';

import { useOnboarding } from '@/hooks/useOnboarding';
import { ToSomOnboardingLayout } from '@/components/ui5/system';
import { ToSomProfileCard } from '@/components/ui5/system';
import { ToSomButton } from '@/components/ui5/system';

const getLabel = (options: { value: string; label: string }[], val: string) => {
  const found = options.find(o => o.value === val);
  return found?.label || val || '—';
};

export default function OnboardingStep5() {
  const { data, prevStep } = useOnboarding();

  const lookingForOptions = [
    { label: 'Kvinne', value: 'kvinne' },
    { label: 'Mann', value: 'mann' },
    { label: 'Begge', value: 'begge' },
  ];
  const relationshipTypes = [
    { label: 'Seriøs', value: 'seriøs' },
    { label: 'Uforpliktende', value: 'uforpliktende' },
    { label: 'Åpen', value: 'åpen' },
  ];
  const educationLevels = [
    { label: 'Grunnskole', value: 'grunnskole' },
    { label: 'VGS', value: 'vg' },
    { label: 'Bakalauriat', value: 'bachelor' },
    { label: 'Master', value: 'master' },
    { label: 'PhD', value: 'phd' },
  ];
  const eliteSinglesTypes = [
    { label: 'Akademisk', value: 'akademisk' },
    { label: 'Karrierefokusert', value: 'karriere' },
    { label: 'Ambisiøs', value: 'ambisiøs' },
    { label: 'Tradisjonell', value: 'tradisjonell' },
  ];

  return (
    <ToSomOnboardingLayout
      steps={[
        { label: 'Personalia' },
        { label: 'Preferanser' },
        { label: 'Relasjon' },
        { label: 'Personlighet' },
        { label: 'Oppsummering' },
      ]}
      activeStep={4}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'rgba(255,255,255,0.92)' }}>
          din oppsummering
        </h2>

        <ToSomProfileCard
          avatarUrl=""
          name={data.name || '—'}
          age={parseInt(data.age) || 0}
          location={data.location || '—'}
          badges={[
            { label: getLabel(eliteSinglesTypes, data.eliteSinglesType) },
            { label: getLabel(educationLevels, data.educationLevel) },
            { label: getLabel(relationshipTypes, data.relationshipType) },
          ]}
          about={`Ser etter ${getLabel(lookingForOptions, data.lookingFor)}. Livsstil: ${getLabel([], data.lifestyle)}. Trekk: ${(data.traits || []).join(', ') || '—'}`}
        />

        {/* Data summary table */}
        <div className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span>Kommunikasjonsstil</span>
            <span style={{ color: 'rgba(255,255,255,0.92)' }}>{getLabel([], data.communicationStyle)}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span>Kjærlighetsspråk</span>
            <span style={{ color: 'rgba(255,255,255,0.92)' }}>{getLabel([], data.loveLanguage)}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span>Karrierefokus</span>
            <span style={{ color: 'rgba(255,255,255,0.92)' }}>{getLabel([], data.careerFocus)}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span>Ambisjonsnivå</span>
            <span style={{ color: 'rgba(255,255,255,0.92)' }}>{getLabel([], data.ambitionLevel)}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span>Personlighetstype</span>
            <span style={{ color: 'rgba(255,255,255,0.92)' }}>{getLabel([], data.personalityType)}</span>
          </div>
        </div>

        <button
          className="w-full py-8 text-2xl font-bold rounded-3xl"
          style={{ background: '#D4AF37', color: '#0B0E11', boxShadow: '0 0 40px rgba(212,175,55,0.30)' }}
          onClick={() => {}}
        >
          Fullfør profil →
        </button>

        <button className="w-full py-4 px-6 rounded-2xl font-semibold" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }} onClick={prevStep}>
          ← Tilbake
        </button>
      </div>
    </ToSomOnboardingLayout>
  );
}