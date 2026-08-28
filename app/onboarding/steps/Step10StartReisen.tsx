/**
 * Tosom — Steg 10: Start reisen (Premium rebuild 2026 — Fase 4)
 * - Bokmål (Nynorsk→Bokmål-konvertering)
 * 
 * Den siste sida av onboarding. Bruker OnboardingSlide-wrapper med:
 * - Hjarte-ikon og roleg CTA-melding
 * - PremiumCTAButton med loading-state
 * - Back-knapp som returnerer til Oppsummering (steg 11)
 */

'use client';

import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';

interface Props {
  step: number;
  goToStep: (s: number) => void;
  loading: boolean;
  /** Kalla av OnboardingFlow for å starte lagring + match */
  onStart: () => Promise<void>;
}

export default function Step10StartReisen({ step, goToStep, loading, onStart }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <OnboardingSlide
      title="Start reisen"
      subtitle="Du er klar. Vi matcher deg rolig og presist — basert på det du har delt."
      guidingText="Nå er det bare å trykke på «Start reisen» så finner vi din match."
      slideIndex={12}
      totalSlides={13}
      accentColor={OB.section.summary}
    >
      {/* Hjarte-ikon og intro */}
      <div className="text-center space-y-4 mb-8">
        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{
          background: 'rgba(212, 175, 55, 0.15)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.15)',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Én match, hver lørdag. Ingen sveiping, ingen press.
        </p>
      </div>

      {/* Back-knapp */}
      <div className="mb-6">
        <BackButton onClick={() => goToStep(step - 1)} />
      </div>

      {/* CTA med loading-state */}
      <PremiumCTAButton
        onClick={onStart}
        label={loading ? 'Starter... finn din match' : 'Start reisen'}
        disabled={loading}
        isLoading={loading}
        fullWidth
      />

      {/* Trust text */}
      <p className="text-center text-xs mt-6" style={{ color: 'rgba(255, 255, 255, 0.3)', lineHeight: 1.6 }}>
        Du kan endre svarene dine i venterommet frem til fredag 23:59.
        Etter at reisen har startet (lørdag), låses profilen din for denne reisen.
      </p>
    </OnboardingSlide>
  );
}