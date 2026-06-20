/**
 * Label — Small label, caption, or tag text
 *
 * Usage:
 *   <Label>Required field</Label>
 *   <Label variant="gold">Premium</Label>
 */

import React from 'react';

export interface LabelProps {
  children: React.ReactNode;
  /** Visual variant */
  variant?: 'default' | 'gold' | 'muted' | 'success' | 'error' | 'warning';
  /** Whether to show as an inline badge/tag */
  badge?: boolean;
  /** Uppercase the text */
  uppercase?: boolean;
  /** Custom class */
  className?: string;
}

const variantMap: Record<NonNullable<LabelProps['variant']>, string> = {
  default: 'text-ts-text-secondary',
  gold: 'text-ts-gold',
  muted: 'text-ts-text-subtle',
  success: 'text-ts-success',
  error: 'text-ts-error',
  warning: 'text-ts-warning',
};

const badgeVariantMap: Record<NonNullable<LabelProps['variant']>, string> = {
  default: 'bg-ts-glass text-ts-text-secondary border-ts-glass',
  gold: 'bg-ts-gold-soft text-ts-gold border-ts-gold/20',
  muted: 'bg-ts-glass text-ts-text-subtle border-ts-glass',
  success: 'bg-ts-success/10 text-ts-success border-ts-success/20',
  error: 'bg-ts-error/10 text-ts-error border-ts-error/20',
  warning: 'bg-ts-warning/10 text-ts-warning border-ts-warning/20',
};

const Label: React.FC<LabelProps> = ({
  children,
  variant = 'default',
  badge = false,
  uppercase = false,
  className = '',
}) => {
  if (badge) {
    return (
      <span
        className={`
          inline-flex
          items-center
          px-2 py-0.5
          text-xs
          font-medium
          border
          ${badgeVariantMap[variant]}
          ${uppercase ? 'uppercase tracking-wider' : ''}
          ${className}
        `}
      >
        {children}
      </span>
    );
  }

  return (
    <label
      className={`
        ${variantMap[variant]}
        text-xs
        font-medium
        ${uppercase ? 'uppercase tracking-wider' : ''}
        ${className}
      `}
    >
      {children}
    </label>
  );
};

Label.displayName = 'Label';
export default Label;