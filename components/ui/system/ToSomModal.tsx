/**
 * Tosom ToSomModal — System component
 * 
 * Modal with glass panel, backdrop blur, smooth fade + scale motion.
 */

'use client';

import { FC, useEffect } from 'react';
import { spacing, colors, motion } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/* ═══════════════════════════════════════════
   SIZES
   ═══════════════════════════════════════════ */
const sizes: Record<string, string> = { sm: '400px', md: '560px', lg: '720px' };

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomModal: FC<ToSomModalProps> = ({ open, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6"
      style={{
        opacity: 1,
        transition: `opacity ${motion.durations.normal} ${motion.easings.smooth}`,
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg"
        style={{
          maxWidth: sizes[size],
          borderRadius: '24px',
          background: 'rgba(13,17,23,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          padding: '32px',
          transform: 'scale(1)',
          transition: `transform ${motion.durations.normal} ${motion.easings.spring}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>{title}</h2>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onClick={onClose}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ToSomModal;