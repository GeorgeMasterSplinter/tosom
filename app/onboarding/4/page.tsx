/**
 * ToSom Onboarding Step 4 — Personlighet
 */

'use client';

import { useState } from 'react';
import { useOnboarding, validateStep } from '@/hooks/useOnboarding';
import { ToSomOnboardingLayout } from '@/components/ui/system';
import { ToSomSelect } from '@/components/ui/system';
import { ToSomTextArea } from '@/components/ui/system';
import { ToSomForm } from '@/components/ui/system';
import { ToSomBadge } from '@/components/ui/system';

const personalityTypes = [
  { label: 'MBTI – INTJ', value: 'mbti-intj' },
  { label: 'MBTI – INTP', value: 'mbti-intp' },
  { label: 'MBTI – ENFJ', value: 'mbti-enfj' },
  { label: 'MBTI – INFJ', value: 'mbti-infj' },
  { label: 'MBTI – ENFP', value: 'mbti-enfp' },
  { label: 'MBTI – ISFJ', value: 'mbti-isfj' },
  { label: 'Big Five – Åpen', value: 'bigfive-aapen' },
  { label: 'Big Five – Samvittighetsfull', value: 'bigfive-samvittighetsfull' },
  { label: 'Big Five – Ekstrovert', value: 'bigfive-ekstrovert' },
  { label: 'Big Five – Empatisk', value: 'bigfive-emпатisk' },
];

const ALL_TRAITS = [
  'Empatisk', 'Analytisk', 'Kreativ', 'Drivende', 'Rolig',
  'Sjarmerende', 'Autentisk', 'Moden', 'Reflekterende', 'Leder',
];

export default function OnboardingStep4() {
  const { data, updateField, prevStep, nextStep } = useOnboarding();
  const [formError, setFormError] = useState('');
  const [localTraits, setLocalTraits] = useState<string[]>(data.traits || []);

  const handleTraitToggle = (trait: string) => {
    const updated = localTraits.includes(trait)
      ? localTraits.filter(t => t !== trait)
      : [...localTraits, trait];
    setLocalTraits(updated);
    updateField('traits', updated);
  };

  const handleSubmit = (formData: Record<string, any>) => {
    updateField('personalityType', formData.personalityType || '');
    updateField('strengths', formData.strengths || '');
    updateField('weaknesses', formData.weaknesses || '');

    const errors = validateStep(4, {
      personalityType: formData.personalityType,
      traits: localTraits,
    });

    if (errors.length > 0) {
      setFormError(errors[0].message);
      return;
    }
    setFormError('');
    nextStep();
  };

  return (
    <ToSomOnboardingLayout
      steps={[
        { label: 'Personalia' },
        { label: 'Preferanser' },
        { label: 'Relasjon' },
        { label: 'Personlighet' },
        { label: 'Oppsummering' },
      ]}
      activeStep={3}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'rgba(255,255,255,0.92)' }}>
          hvem er du?
        </h2>

        {formError && (
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,77,77,0.10)', border: '1px solid rgba(255,77,77,0.25)' }}>
            <p className="text-sm" style={{ color: '#FF4D4D' }}>{formError}</p>
          </div>
        )}

        <ToSomSelect label="Personlighetstype" options={personalityTypes} value={data.personalityType} onChange={(v) => updateField('personalityType', v)} />

        <div className="space-y-3">
          <label className="block text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Velg minst 3 trekk ({localTraits.length}/3)
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_TRAITS.map((trait) => {
              const isSelected = localTraits.includes(trait);
              return (
                <button
                  key={trait}
                  onClick={() => handleTraitToggle(trait)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    background: isSelected ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isSelected ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: isSelected ? '#D4AF37' : 'rgba(255,255,255,0.7)',
                  }}
                >
                  {trait}
                </button>
              );
            })}
          </div>
        </div>

        <ToSomTextArea label="Dine styrker" placeholder="Hva føler du er dine største styrker?" value={data.strengths} onChange={(e: any) => updateField('strengths', e.target.value)} />
        <ToSomTextArea label="Svakheter (valgfritt)" placeholder="Hva jobber du med å utvikle deg?" value={data.weaknesses} onChange={(e: any) => updateField('weaknesses', e.target.value)} />

        <div className="flex gap-3">
          <button className="flex-1 py-4 px-6 rounded-2xl font-semibold" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.7)' }} onClick={prevStep}>
            ← Tilbake
          </button>
          <ToSomForm onSubmit={handleSubmit} submitLabel="Neste →" />
        </div>
      </div>
    </ToSomOnboardingLayout>
  );
}