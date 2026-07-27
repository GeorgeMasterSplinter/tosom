/**
 * ToSom — OnboardingNav (Navigasjon)
 * Premium navigasjonsknapper for alle onboarding-sider.
 * Bruker design-tokens konsekvent.
 */

'use client';

import PremiumButton from '@/components/ui/PremiumButton';
import { color, radius } from '@/config/design-tokens';

interface OnboardingNavProps {
  onNext: () => void;
  onBack?: () => void;
  hasNext?: boolean;
  showBack?: boolean;
  nextLabel?: string;
  className?: string;
}

export default function OnboardingNav({
  onNext,
  onBack,
  hasNext = false,
  showBack = true,
  nextLabel = 'Neste',
  className = '',
}: OnboardingNavProps) {
  return (
    <div className={`mt-8 grid gap-4 md:grid-cols-2 ${className}`}>
      {showBack && onBack && (
        <PremiumButton
          variant="secondary"
          size="xl"
          className="min-h-[64px] rounded-xl justify-center px-6 py-4 text-base font-semibold"
          onClick={onBack}
        >
          Tilbake
        </PremiumButton>
      )}
      
      <PremiumButton
        variant="primary"
        size="xl"
        className={`min-h-[64px] rounded-xl justify-center px-6 py-4 text-base font-semibold ${!onBack ? 'md:col-span-1' : ''}`}
        onClick={onNext}
        disabled={hasNext}
      >
        {nextLabel}
      </PremiumButton>
    </div>
  );
}