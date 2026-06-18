'use client';

import { useState } from 'react';
import GlassPanel from '@/components/ui/GlassPanel';
import PremiumButton from '@/components/ui/PremiumButton';
import ProfileInput from '@/components/profile/ProfileInput';
import FadeIn from '@/components/ui/FadeIn';

interface ProfileFormValues {
  bio: string;
  values: string[];
  interests: string[];
}

interface ProfileFormProps {
  initialValues?: ProfileFormValues;
  onSave?: (values: ProfileFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const DEFAULT_VALUES = ['Ærlegheit', 'Trygghet', 'Vekst', 'Nyskaping', 'Empati'];
const DEFAULT_INTERESTS = ['Friluftsliv', 'Musikk', 'Lesing', 'Fotografi', 'Matlaging'];

export default function ProfileForm({
  initialValues,
  onSave,
  onCancel,
  submitLabel = 'Lagre og publisér',
}: ProfileFormProps) {
  const [bio, setBio] = useState(initialValues?.bio ?? '');
  const [selectedValues, setSelectedValues] = useState<string[]>(
    initialValues?.values ?? DEFAULT_VALUES.slice(0, 3)
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialValues?.interests ?? DEFAULT_INTERESTS.slice(0, 3)
  );
  const [saving, setSaving] = useState(false);

  const toggleValue = (val: string) => {
    setSelectedValues((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const toggleInterest = (int: string) => {
    setSelectedInterests((prev) =>
      prev.includes(int) ? prev.filter((i) => i !== int) : [...prev, int]
    );
  };

  const handleSubmit = async () => {
    setSaving(true);
    await onSave?.({ bio: bio.trim(), values: selectedValues, interests: selectedInterests });
    setSaving(false);
  };

  return (
    <FadeIn>
      <div className="flex flex-col gap-[var(--space-xl)]">

        {/* Om meg */}
        <GlassPanel className="flex flex-col gap-[var(--space-md)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">
            Om meg
          </h2>
          <ProfileInput
            label="Skriv om deg sjølv"
            value={bio}
            onChange={setBio}
            placeholder="Eg er opptatt av djupe samtalar og meningsfulle møte..."
            type="textarea"
            max={300}
            hint="Minst 21 tegn"
          />
        </GlassPanel>

        {/* Verdiar */}
        <GlassPanel className="flex flex-col gap-[var(--space-md)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">
            Verdiar
          </h2>
          <p className="text-sm text-[var(--color-muted)]">Vel minst 3 verdiar:</p>
          <div className="flex flex-wrap gap-[var(--space-xs)]">
            {DEFAULT_VALUES.map((val) => {
              const isSelected = selectedValues.includes(val);
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => toggleValue(val)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-out ${
                    isSelected
                      ? 'bg-[var(--color-gold)] text-[var(--color-bg)] border border-[var(--color-gold)]'
                      : 'bg-white/5 text-[var(--color-muted)] border border-white/10 hover:border-[var(--color-gold)]/30 hover:text-[var(--color-gold)]'
                  }`}
                >
                  {val} {isSelected ? '✓' : ''}
                </button>
              );
            })}
          </div>
          <span className="text-xs text-[var(--color-muted)]">
            {selectedValues.length} / 3 valde
          </span>
        </GlassPanel>

        {/* Interesser */}
        <GlassPanel className="flex flex-col gap-[var(--space-md)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">
            Interesser
          </h2>
          <p className="text-sm text-[var(--color-muted)]">Vel minst 3 interesser:</p>
          <div className="flex flex-wrap gap-[var(--space-xs)]">
            {DEFAULT_INTERESTS.map((int) => {
              const isSelected = selectedInterests.includes(int);
              return (
                <button
                  key={int}
                  type="button"
                  onClick={() => toggleInterest(int)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-out ${
                    isSelected
                      ? 'bg-[var(--color-gold)] text-[var(--color-bg)] border border-[var(--color-gold)]'
                      : 'bg-white/5 text-[var(--color-muted)] border border-white/10 hover:border-[var(--color-gold)]/30 hover:text-[var(--color-gold)]'
                  }`}
                >
                  {int} {isSelected ? '✓' : ''}
                </button>
              );
            })}
          </div>
          <span className="text-xs text-[var(--color-muted)]">
            {selectedInterests.length} / 3 valde
          </span>
        </GlassPanel>

        {/* Aksjonar */}
        <div className="flex flex-wrap gap-[var(--space-sm)]">
          <PremiumButton variant="primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Lagrar...' : submitLabel}
          </PremiumButton>
          {onCancel && (
            <PremiumButton variant="secondary" onClick={onCancel}>
              Avbryt
            </PremiumButton>
          )}
        </div>

      </div>
    </FadeIn>
  );
}