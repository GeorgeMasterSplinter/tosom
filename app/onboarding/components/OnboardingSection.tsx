/**
 * Tosom — OnboardingSection
 *
 * Rølig seksjonsoverskrift med subtil fargeidentitet.
 * Erstatter de tidligere gjevende gull-UPPERCASE-overskriftene.
 */

'use client';

import { OB, sectionColor } from '@/app/onboarding/theme';

interface OnboardingSectionProps {
  title: string;
  accentColor?: string;
  description?: string;
  children: React.ReactNode;
}

export function OnboardingSection({
  title,
  accentColor = OB.section.identity,
  description,
  children,
}: OnboardingSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-[5px] h-[5px] rounded-full"
          style={{ background: sectionColor(accentColor, 60) }}
        />
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: sectionColor(accentColor, 70) }}
        >
          {title}
        </span>
      </div>

      {description && (
        <p className="text-[14px] mb-5" style={{ color: OB.textSecondary }}>
          {description}
        </p>
      )}

      <div>{children}</div>
    </div>
  );
}