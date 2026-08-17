/**
 * Tosom — Onboarding Layout (Unified Premium)
 * Felles layout for alle onboarding-sider.
 * UniversalMenu rendres automatisk via root-layout.
 */

'use client';

import { color } from '@/config/design-tokens';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen w-full py-8 md:py-12" style={{ background: color.bg.primary }}>
      {/* Main Content */}
      <div className="mx-auto max-w-[720px] px-4 md:px-0">
        {children}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p
          className="text-xs"
          style={{ color: 'rgba(255, 255, 255, 0.3)' }}
        >
          Tosom — der sanne møter skjer i ro og trygghet
        </p>
      </div>
    </div>
  );
}
