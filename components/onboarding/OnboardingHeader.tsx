/**
 * ToSom — OnboardingHeader (Premium Header)
 * Rolig header for alle onboarding-sider.
 * Bruker design-tokens konsekvent.
 */

'use client';

import { typography, color } from '@/config/design-tokens';

interface OnboardingHeaderProps {
  title: string;
  subtitle?: string;
}

export default function OnboardingHeader({ title, subtitle }: OnboardingHeaderProps) {
  return (
    <div className="mb-6 text-center">
      <h1
        className="mb-3"
        style={{
          fontSize: `${typography.fontSize['2xl']}px`,
          fontWeight: typography.fontWeight.semibold,
          color: color.text.primary,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: `${typography.fontSize.lg}px`,
            lineHeight: typography.lineHeight.normal,
            color: color.text.secondary,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}