/**
 * ToSom — OnboardingNav (Navigasjon)
 * Premium navigasjonsknapper for alle onboarding-sider.
 * Bruker design-tokens konsekvent.
 */

'use client';

import React from 'react';
import PremiumButton from '@/components/ui/PremiumButton';

interface OnboardingNavProps {
  onNext: () => void;
  onBack?: () => void;
  hasNext?: boolean;
  showBack?: boolean;
  nextLabel?: string;
  className?: string;
}

/* ====== Premium Tilbake-knapp — glassmorphism med gull-aksent ====== */

function PremiumBackButton({ onClick, children }: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="min-h-[64px] rounded-xl justify-center px-6 py-4 text-base font-semibold tracking-wide
        inline-flex items-center gap-2.5
        bg-white/[0.04] border border-white/[0.08]
        text-white/60 hover:text-white/80
        hover:border-[rgba(212,175,55,0.3)]
        backdrop-blur-sm
        shadow-md shadow-black/10
        transition-all duration-400 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-3"
      style={{ willChange: 'background-color, border-color' }}
    >
      {/* Premium SVG pil */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300"
      >
        <path
          d="M10 3L5 8L10 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </button>
  );
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
        <PremiumBackButton onClick={onBack}>
          Tilbake
        </PremiumBackButton>
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
