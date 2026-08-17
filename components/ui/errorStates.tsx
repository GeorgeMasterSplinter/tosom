/**
 * Tosom 4.0 — Error States System
 *
 * 6 error state variants with calm, helpful microcopy.
 *
 * Usage:
 *   import { ErrorState, type ErrorVariant } from '@/components/ui/errorStates'
 */

import React from 'react';

/* ── Error Variants ── */
export type ErrorVariant =
  | 'networkError'
  | 'offline'
  | 'permissionDenied'
  | 'aiUnavailable'
  | 'formValidation'
  | 'general';

export interface ErrorStateProps {
  variant?: ErrorVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/* ── Variant Map ── */
const variantMap: Record<ErrorVariant, { title: string; description: string; icon: string; color: string }> = {
  networkError: {
    title: 'Kunne ikke koble til',
    description: 'Nettverket ditt virker ikke som det skal. Sjekk tilkoblingen og prøv igjen.',
    icon: '🌐',
    color: '#FF4D4D',
  },
  offline: {
    title: 'Du er frakoblet',
    description: 'Tosom trenger internet for you to work. Koble til WiFi eller mobil data.',
    icon: '📡',
    color: '#FF9F43',
  },
  permissionDenied: {
    title: 'Tilgang avslått',
    description: 'Du har ikke tillatelse til dette. Kontakt eieren eller sjekk innstillingene.',
    icon: '🔒',
    color: '#FF6B6B',
  },
  aiUnavailable: {
    title: 'AI er utilgjengelig',
    description: 'Tosom AI er midlertidig nede. Prøv igjen senere — vi er her når du trenger oss.',
    icon: '🤖',
    color: '#C084FC',
  },
  formValidation: {
    title: 'Kan ikke lagre',
    description: 'Noen felter er ikke fylt ut riktig. Sjekk og prøv igjen.',
    icon: '📝',
    color: '#FF9F43',
  },
  general: {
    title: 'Noe gikk galt',
    description: 'Vi encountered en uventet feil. Vi jobber med det. Beklager ulempen.',
    icon: '💔',
    color: '#FF4D4D',
  },
};

/* ── Shimmer Effect ── */
const Shimmer: React.FC<{ color: string }> = ({ color }) => (
  <div className="absolute inset-0 overflow-hidden rounded-3xl">
    <div
      className="absolute inset-0 animate-shimmer"
      style={{
        background: `linear-gradient(90deg, transparent, ${color}15, transparent)`,
        backgroundSize: '200% 100%',
      }}
    />
  </div>
);

/* ── ErrorIcon ── */
const ErrorIcon: React.FC<{ icon: string; color: string }> = ({ icon, color }) => (
  <div className="relative w-32 h-32 mx-auto mb-6">
    <Shimmer color={color} />
    <div
      className="relative w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-white/[0.04] to-transparent rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/8"
      style={{ borderColor: `${color}30` }}
    >
      <span className="text-5xl">{icon}</span>
    </div>
  </div>
);

/* ── ErrorState Component ── */
const ErrorState: React.FC<ErrorStateProps> = ({
  variant = 'general',
  title,
  description,
  actionLabel = 'Pr\u00F8v igjen',
  onAction,
  className = '',
}) => {
  const v = variantMap[variant];
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <ErrorIcon icon={v.icon} color={v.color} />
      <h3 className="text-white font-semibold text-lg text-center mb-2">{title || v.title}</h3>
      <p className="text-white/50 text-sm text-center max-w-xs leading-relaxed mb-6">{description || v.description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="bg-white/[0.04] border border-white/8 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-white/[0.08] active:scale-[0.97] transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

/* ── Pre-built Error States ── */
export const NetworkError = (props: Omit<ErrorStateProps, 'variant'>) => (
  <ErrorState variant="networkError" {...props} />
);

export const OfflineError = (props: Omit<ErrorStateProps, 'variant'>) => (
  <ErrorState variant="offline" {...props} />
);

export const PermissionDeniedError = (props: Omit<ErrorStateProps, 'variant'>) => (
  <ErrorState variant="permissionDenied" {...props} />
);

export const AIUnavailableError = (props: Omit<ErrorStateProps, 'variant'>) => (
  <ErrorState variant="aiUnavailable" {...props} />
);

export const FormValidationError = (props: Omit<ErrorStateProps, 'variant'>) => (
  <ErrorState variant="formValidation" {...props} />
);

export { ErrorState };
export default ErrorState;