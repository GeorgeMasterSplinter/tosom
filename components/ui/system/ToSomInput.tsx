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

const focusStyles: React.CSSProperties = {
  borderColor: colors.gold,
  boxShadow: `0 0 20px rgba(212,175,55,0.35)`,
  background: 'rgba(255,255,255,0.07)',
};

const errorStyles: React.CSSProperties = {
  borderColor: colors.error,
  boxShadow: `0 0 12px rgba(255,77,77,0.25)`,
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomInput = forwardRef<HTMLInputElement, ToSomInputProps>(({
  label,
  error,
  className = '',
  style,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);

  const isError = !!error;
  const isActive = focused || !!props.value;

  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-sm font-medium mb-2 transition-colors duration-200"
          style={{
            color: isError ? colors.error : focused ? colors.gold : 'rgba(255,255,255,0.7)',
          }}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`${className} ${isError ? 'cursor-not-allowed' : ''}`}
        style={{
          ...baseInputStyles,
          ...(focused ? focusStyles : {}),
          ...(isError ? errorStyles : {}),
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
      {isError && (
        <p className="text-xs mt-1.5" style={{ color: colors.error }}>
          {error}
        </p>
      )}
    </div>
  );
});

ToSomInput.displayName = 'ToSomInput';
export default ToSomInput;