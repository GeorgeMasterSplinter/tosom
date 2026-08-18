/**
 * Tosom — Onboarding Layout (Unified Premium)
 * Felles layout for alle onboarding-sider.
 * UniversalMenu rendres automatisk via root-layout.
 */

'use client';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: `linear-gradient(180deg, #0B1520 0%, #121E2E 45%, #0B1520 100%)`,
        paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
      }}
    >
      {/* Main Content — responsiv kolonne: fyller bredden på telefon, vokser til 840px på laptop */}
      <div className="mx-auto w-full px-4 sm:px-6 md:max-w-[720px] lg:max-w-[820px] xl:max-w-[840px]">
        {children}
      </div>

      {/* Footer */}
      <div className="mt-14 text-center">
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
