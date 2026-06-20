/**
 * ModalV3 — Premium modal dialog with glassmorphism
 *
 * Usage:
 *   <ModalV3 open={show} onClose={() => setShow(false)}>
 *     <h3>Dialog Title</h3>
 *     <p>Content here</p>
 *   </ModalV3>
 */

import React, { useEffect, useCallback } from 'react';

export interface ModalV3Props {
  /** Whether modal is open */
  open: boolean;
  /** Close callback */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Whether to close on Escape key */
  closeOnEscape?: boolean;
  /** Custom class */
  className?: string;
  /** Children content */
  children: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
}

const sizeMap: Record<NonNullable<ModalV3Props['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[90vw] max-h-[90vh]',
};

const ModalV3: React.FC<ModalV3Props> = ({
  open,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  footer,
  className = '',
}) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-ts-modal flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className={`
          fixed inset-0
          bg-black/60
          backdrop-blur-sm
          transition-opacity
          duration-200
          ${closeOnOverlayClick ? 'cursor-pointer' : ''}
        `}
        onClick={closeOnOverlayClick ? handleClose : undefined}
      />

      {/* Modal */}
      <div
        className={`
          relative
          w-full
          ${sizeMap[size]}
          rounded-2xl
          border border-white/8
          bg-white/[0.04]
          backdrop-blur-xl
          shadow-[0_4px_20px_rgba(0,0,0,0.4)]
          animate-scaleIn
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header + close button */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="text-lg font-semibold text-ts-primary">{title}</h2>
            <button onClick={handleClose} className="p-2 text-ts-text-muted hover:text-ts-text transition-colors rounded-ts-md hover:bg-ts-glass" aria-label="Close">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className={`px-6 py-4 ${title ? '' : 'pt-6'}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-white/5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

ModalV3.displayName = 'ModalV3';
export default ModalV3;