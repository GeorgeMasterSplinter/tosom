/**
 * ToSom Onboarding Step 1 — Personalia
 */

'use client';

import { useState } from 'react';
import { useOnboarding, validateStep } from '@/hooks/useOnboarding';
import { ToSomOnboardingLayout } from '@/components/ui5/system';
import { ToSomInput } from '@/components/ui5/system';
import { ToSomSelect } from '@/components/ui5/system';
import { ToSomForm } from '@/components/ui5/system';

const genders = [
  { label: 'Kvinne', value: 'kvinne' },
  { label: 'Mann', value: 'mann' },
  { label: 'Ikke-binær', value: 'ikkje-binær' },
  { label: 'Annet', value: 'annet' },
];

export default function OnboardingStep1() {
  const { data, updateField, nextStep } = useOnboarding();
  const [formError, setFormError] = useState('');

  const handleSubmit = (formData: Record<string, any>) => {
    // Update fields from form data
    updateField('name', formData.name || '');
    updateField('age', formData.age || '');
    updateField('gender', formData.gender || '');
    updateField('email', formData.email || '');
    updateField('location', formData.location || '');

    // Validate
    const errors = validateStep(1, {
      name: formData.name,
      age: formData.age,
      email: formData.email,
      gender: formData.gender,
      location: formData.location,
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
      activeStep={0}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'rgba(255,255,255,0.92)' }}>
          fortell oss litt om deg
        </h2>

        {formError && (
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,77,77,0.10)', border: '1px solid rgba(255,77,77,0.25)' }}>
            <p className="text-sm" style={{ color: '#FF4D4D' }}>{formError}</p>
          </div>
        )}

        <ToSomInput
          label="Navn"
          placeholder="Hva heter du?"
          value={data.name}
          onChange={(e: any) => updateField('name', e.target.value)}
        />

        <ToSomInput
          label="Alder"
          type="number"
          placeholder="Hva er din alder?"
          value={data.age}
          onChange={(e: any) => updateField('age', e.target.value)}
        />

        <ToSomSelect
          label="Kjønn"
          options={genders}
          value={data.gender}
          onChange={(v) => updateField('gender', v)}
        />

        <ToSomInput
          label="E-post"
          type="email"
          placeholder="din@epost.no"
          value={data.email}
          onChange={(e: any) => updateField('email', e.target.value)}
        />

        <ToSomInput
          label="Lokasjon"
          placeholder="Hvor bor du?"
          value={data.location}
          onChange={(e: any) => updateField('location', e.target.value)}
        />

        <ToSomForm
          onSubmit={handleSubmit}
          submitLabel="Neste →"
        />
      </div>
    </ToSomOnboardingLayout>
  );
}