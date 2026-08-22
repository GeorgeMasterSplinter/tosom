'use client';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';
import { ScaleQuestion } from '@/components/onboarding/ScaleQuestion';
import { COMMUNICATION } from '@/lib/psychometrics/instruments';
interface Props { data: Record<string, unknown>; onChange: (f: string, v: unknown) => void; onBack: () => void; step: number; goToStep: (s: number) => void; onNext: () => void; }
export default function Step7HumorPersonlighet({ data, onChange, onBack, onNext }: Props) {
  return (
    <OnboardingSlide title="Kommunikasjon & tilpasning" subtitle="Hvordan møter du endring og avklaring i en relasjon?" guidingText="Slik dere kommuniserer, er like viktig som hva dere deler." slideIndex={8} totalSlides={13}
      accentColor={OB.section.personality}>
      {/* FORSKNINGSMOTOR F-5 — Kommunikasjon & tilpasning (humor-trinn erstattet) */}
      <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        Noen påstander om hvordan du reagerer. Svar det som kjennes mest riktig — det finnes ingen fasit.
      </p>
      <div className="space-y-3">
        {COMMUNICATION.map((item) => (
          <ScaleQuestion
            key={item.id}
            text={item.text}
            value={typeof data[item.id] === 'number' ? (data[item.id] as number) : null}
            onChange={(v) => onChange(item.id, v)}
          />
        ))}
      </div>
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.3)' }}>Det er ingen rette eller gale svar. Svarene dine hjelper oss å forstå deg bedre.</p>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={onNext} label="Fortsett til neste steg" fullWidth /></div>
    </OnboardingSlide>
  );
}