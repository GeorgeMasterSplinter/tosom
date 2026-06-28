'use client';

import { Logo } from '@/components/ui/branding/Logo';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: '#0B1520' }}
    >
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <Logo size="xl" colorVariant="gold" />
        </div>
        {children}
      </div>
    </div>
  );
}