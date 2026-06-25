/**
 * ToSom ToSomToast — System component
 * 
 * Toast/notification with slide-in, auto-dismiss (5s).
 */

'use client';

import { FC, useEffect, useState } from 'react';
import { spacing, colors, motion } from '@/design/tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
type ToastVariant = 'success' | 'error' | 'info';

interface ToSomToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
  duration?: number;
}

/* ═══════════════════════════════════════════
   VARIANT STYLES
   ═══════════════════════════════════════════ */
const variantStyles: Record<ToastVariant, { bg: string; border: string; icon: string }> = {
  success: {
    bg: 'rgba(77,255,136,0.08)',
    border: 'rgba(77,255,136,0.25)',
    icon: '#4DFF88',
  },
  error: {
    bg: 'rgba(255,77,77,0.08)',
    border: 'rgba(255,77,77,0.25)',
    icon: '#FF4D4D',
  },
  info: {
    bg: 'rgba(212,175,55,0.08)',
    border: 'rgba(212,175,55,0.25)',
    icon: '#D4AF37',
  },
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomToast: FC<ToSomToastProps> = ({ message, variant = 'info', onClose, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);
  const vs = variantStyles[variant];

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  useEffect(() => {
    if (!visible && onClose) onClose();
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[1100] max-w-sm"
      style={{
        background: vs.bg,
        border: `1px solid ${vs.border}`,
        borderRadius: '16px',
        padding: `${spacing['md']} ${spacing['lg']}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        transform: 'translateY(0)',
        opacity: 1,
        transition: `all ${motion.durations.normal} ${motion.easings.smooth}`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: vs.icon, flexShrink: 0 }}>
            {variant === 'success' && <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
            {variant === 'error' && <><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>}
            {variant === 'info' && <><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>}
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px' }}>{message}</span>
        </div>
        {onClose && (
          <button
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onClick={() => setVisible(false)}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ToSomToast;