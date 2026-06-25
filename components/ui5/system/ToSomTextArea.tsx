/**
 * ToSom ToSomTextArea — System component
 * 
 * Text area with glassmorphism, gold focus ring, auto-resize.
 */

'use client';

import { forwardRef, TextareaHTMLAttributes, useEffect, useRef, useState } from 'react';
import { radius, colors } from '@/design/tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomTextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> {
  label?: string;
  error?: string;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  rows?: number;
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
const baseStyles: React.CSSProperties = {
  borderRadius: radius.lg,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.10)',
  color: colors.textPrimary,
  padding: '12px 16px',
  fontSize: '16px',
  transition: 'all 200ms ease-out',
  width: '100%',
  outline: 'none',
  resize: 'none',
  lineHeight: '1.65',
};

const focusStyles: React.CSSProperties = {
  borderColor: colors.gold,
  boxShadow: '0 0 20px rgba(212,175,55,0.35)',
  background: 'rgba(255,255,255,0.07)',
};

const errorStyles: React.CSSProperties = {
  borderColor: colors.error,
  boxShadow: '0 0 12px rgba(255,77,77,0.25)',
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomTextArea = forwardRef<HTMLTextAreaElement, ToSomTextAreaProps>(({
  label,
  error,
  autoResize = true,
  minRows = 3,
  maxRows = 10,
  className = '',
  style,
  onFocus,
  onBlur,
  rows = minRows,
  ...props
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  const isError = !!error;

  useEffect(() => {
    if (!autoResize || !textareaRef.current) return;

    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const minHeight = minRows * 24;
    const maxHeight = maxRows * 24;
    textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
  }, [props.value, autoResize, minRows, maxRows]);

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
      <textarea
        ref={autoResize ? textareaRef : ref}
        className={className}
        rows={autoResize ? minRows : rows}
        style={{
          ...baseStyles,
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

ToSomTextArea.displayName = 'ToSomTextArea';
export default ToSomTextArea;