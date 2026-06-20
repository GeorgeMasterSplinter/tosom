/**
 * Drawer — Slide-in drawer panel with glassmorphism
 *
 * Usage:
 *   <Drawer open={open} onClose={handleClose} placement="right">
 *     <h3>Drawer Title</h3>
 *     <p>Content</p>
 *   </Drawer>
 */

import React, { useEffect, useCallback } from 'react';

export interface DrawerProps {
  /** Whether drawer is open */
  open: boolean;
  /** Close callback */
  onClose: () => void;
  /** Drawer placement */
  placement?: 'left' | 'right' | 'top' | 'bottom';
  /** Drawer size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Title */
  title?: string;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Custom class */
  className?: string;
  /** Children content */
  children: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
}

const placementMap: Record<NonNullable<DrawerProps['placement']>, string> = {
  left: 'inset-y-0 left-0',
  right: 'inset-y-0 right-0',
  top: 'inset-x-0 top-0',
  bottom: 'inset-x-0 bottom-0',
};

const translationMap: Record<NonNullable<DrawerProps['placement']>, string> = {
  left: '-translate-x-full',
  right: 'translate-x-full',
  top: '-translate-y-full',
  bottom: 'translate-y-full',
};

const sizeMap: Record<NonNullable<DrawerProps['size']>, string> = {
  sm: 'w-80',
  md: 'w-96',
  lg: 'w-[500px]',
  xl: 'w-[700px]',
  full: 'w-full',
};

const sizeMapVertical: Record<NonNullable<DrawerProps['size']>, string> = {
  sm: 'h-48',
  md: 'h-64',
  lg: 'h-[400px]',
  xl: 'h-[500px]',
  full: 'h-full',
};

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  placement = 'right',
  size = 'md',
  title,
  closeOnOverlayClick = true,
  children,
  footer,
  className = '',
}) => {
  const isVertical = placement === 'left' || placement === 'right';

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = isVertical ? sizeMap[size] : sizeMapVertical[size];

  return (
    <div className="fixed inset-0 z-ts-drawer flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? handleClose : undefined}
      />

      {/* Drawer Panel */}
      <div
        className={`
          fixed
          ${placementMap[placement]}
          ${sizeClass}
          ${isVertical ? 'h-full' : 'w-full'}
          bg-ts-glass/90
          backdrop-blur-xl
          border-white/8
          ${placement === 'left' ? 'border-r' : placement === 'right' ? 'border-l' : placement === 'top' ? 'border-b' : 'border-t'}
          shadow-[0_4px_20px_rgba(0,0,0,0.4)]
          transition-transform
          duration-300
          ease-out
          ${open ? 'translate-x-0 translate-y-0' : translationMap[placement]}
          ${className}
          flex
          flex-col
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            {title && (
              <h2 className="text-lg font-semibold text-ts-primary">{title}</h2>
            )}
            <button
              onClick={handleClose}
              className="p-2 text-ts-text-muted hover:text-ts-text transition-colors rounded-ts-md hover:bg-ts-glass"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
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

Drawer.displayName = 'Drawer';
export default Drawer;