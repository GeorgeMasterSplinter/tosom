/**
 * ToSom ToSomInput — System component
 * 
 * Standard input field with glassmorphism, gold focus ring, error state.
 */

'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { radius, colors, shadows } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  warning?: string;
  variant?: 'default' | 'gold' | 'glass';
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
const baseInputStyles: React.CSSProperties = {
  borderRadius: radius.md,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.10)',
  color: colors.textPrimary,
  padding: '12px 16px',
  fontSize: '16px',
  transition: 'all 200ms ease-out',
  width: '100%',
  outline: 'none',
};

const baseInputStylesByVariant: Record<string, React.CSSProperties> = {
  default: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
  },
  gold: {
    background: 'rgba(212,175,55,0.04)',
    border: '1px solid rgba(212,175,55,0.18)',
  },
  glass: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
};

const focusStylesByVariant: Record<string, React.CSSProperties> = {
  default: {
    borderColor: colors.gold,
    boxShadow: `0 0 24px rgba(212,175,55,0.30)`,
    background: 'rgba(255,255,255,0.07)',
  },
  gold: {
    borderColor: '#E8C766',
    boxShadow: `0 0 32px rgba(212,175,55,0.40)`,
    background: 'rgba(212,175,55,0.06)',
  },
  glass: {
    borderColor: 'rgba(212,175,55,0.50)',
    boxShadow: `0 0 20px rgba(212,175,55,0.25)`,
    background: 'rgba(255,255,255,0.05)',
  },
};

const validationStyles = {
  error: {
    borderColor: colors.error,
    boxShadow: `0 0 16px rgba(255,77,77,0.25)`,
    background: 'rgba(255,77,77,0.04)',
  },
  success: {
    borderColor: colors.success,
    boxShadow: `0 0 16px rgba(77,255,136,0.20)`,
    background: 'rgba(77,255,136,0.03)',
  },
  warning: {
    borderColor: colors.warning,
    boxShadow: `0 0 16px rgba(255,184,77,0.20)`,
    background: 'rgba(255,184,77,0.03)',
  },
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomInput = forwardRef<HTMLInputElement, ToSomInputProps>(({
  label,
  error,
  success,
  warning,
  variant = 'default',
  className = '',
  style,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);

  const hasError = !!error;
  const hasSuccess = !!success;
  const hasWarning = !!warning;
  const isActive = focused || !!props.value;
  const activeVariant = hasError ? 'error' : hasSuccess ? 'success' : hasWarning ? 'warning' : variant;

  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-sm font-medium mb-2 transition-colors duration-200"
          style={{
            color: hasError ? colors.error 
              : hasSuccess ? colors.success 
              : hasWarning ? colors.warning 
              : focused ? '#D4AF37' 
              : 'rgba(255,255,255,0.7)',
          }}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`${className} ${hasError ? 'cursor-not-allowed' : ''}`}
        style={{
          ...baseInputStylesByVariant[variant],
          ...(focused ? focusStylesByVariant[activeVariant] : {}),
          ...(hasError ? validationStyles.error : {}),
          ...(hasSuccess ? validationStyles.success : {}),
          ...(hasWarning ? validationStyles.warning : {}),
          ...style,
        }}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {hasError && (
        <p className="text-xs mt-1.5" style={{ color: colors.error }}>
          ⚠ {error}
        </p>
      )}
      {hasSuccess && !hasError && (
        <p className="text-xs mt-1.5" style={{ color: colors.success }}>
          ✓ {success}
        </p>
      )}
      {hasWarning && !hasError && !hasSuccess && (
        <p className="text-xs mt-1.5" style={{ color: colors.warning }}>
          ⚡ {warning}
        </p>
      )}
    </div>
  );
});

ToSomInput.displayName = 'ToSomInput';
export default ToSomInput;