/**
 * ToSom — OnboardingCard (Premium Glassmorphism)
 * Hovedkort for alle onboarding-sider.
 * Bruker design-tokens konsekvent.
 */

'use client';

import { ReactNode } from 'react';
import { glassVariant, radius, spacing } from '@/config/design-tokens';

interface OnboardingCardProps {
  children: ReactNode;
  variant?: 'default' | 'gold';
  className?: string;
}

export default function OnboardingCard({ 
  children, 
  variant = 'default',
  className = ''
}: OnboardingCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 md:p-8 ${className}`}
      style={{
        borderRadius: `${radius.xl}px`,
        ...glassVariant(variant, 'medium'),
        padding: `0 ${spacing.xl}px`,
      }}
    >
      {children}
    </div>
  );
}