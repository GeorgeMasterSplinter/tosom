/**
 * ToSom ToSomForm — System component
 * 
 * Form wrapper for Input/TextArea/Select with error summary and loading state.
 */

'use client';

import { FC, FormEvent } from 'react';
import { spacing, colors, motion } from '@/design/tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomFormProps {
  onSubmit: (data: Record<string, any>) => void;
  children?: React.ReactNode;
  loading?: boolean;
  error?: string;
  submitLabel?: string;
  className?: string;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomForm: FC<ToSomFormProps> = ({
  onSubmit,
  children,
  loading = false,
  error,
  submitLabel = 'Submit',
  className = '',
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    // Collect all form inputs
    const formData = new FormData(e.target as HTMLFormElement);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => { data[key] = value; });
    onSubmit(data);
  };

  return (
    <form
      className={`tosom-form ${className}`}
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${spacing['md']}`,
      }}
    >
      {/* Error summary */}
      {error && (
        <div
          className="rounded-xl p-4"
          style={{
            background: 'rgba(255,77,77,0.10)',
            border: '1px solid rgba(255,77,77,0.25)',
          }}
        >
          <p className="flex items-center gap-2" style={{ color: colors.error, fontSize: '14px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Children */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing['sm']}` }}>
        {children}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-200"
        style={{
          background: loading ? 'rgba(255,255,255,0.15)' : 'rgba(212,175,55,0.15)',
          border: `1px solid ${loading ? 'rgba(255,255,255,0.10)' : 'rgba(212,175,55,0.25)'}`,
          color: loading ? 'rgba(255,255,255,0.4)' : colors.gold,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Laster inn...' : submitLabel}
      </button>
    </form>
  );
};

export default ToSomForm;