/**
 * Popover — Floating content panel positioned relative to a trigger
 *
 * Usage:
 *   <Popover
 *     trigger={<button>Click me</button>}
 *     content={<p>Popover content here</p>}
 *   />
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface PopoverProps {
  /** Trigger element */
  trigger: React.ReactNode;
  /** Content inside popover */
  content: React.ReactNode;
  /** Position relative to trigger */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Alignment */
  alignment?: 'start' | 'center' | 'end';
  /** Offset from trigger */
  offset?: number;
  /** Custom class */
  className?: string;
}

const positionMap: Record<NonNullable<PopoverProps['position']>, { container: string; arrow: string }> = {
  top: {
    container: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-t border-r bg-ts-glass/90',
  },
  bottom: {
    container: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 border-b border-l bg-ts-glass/90',
  },
  left: {
    container: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'right-full top-1/2 translate-y-1/2 rotate-45 border-t border-r bg-ts-glass/90',
  },
  right: {
    container: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'left-full top-1/2 -translate-y-1/2 -rotate-45 border-b border-l bg-ts-glass/90',
  },
};

const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  position = 'bottom',
  alignment = 'center',
  offset = 8,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const triggerEl = triggerRef.current;
      const popoverEl = popoverRef.current;

      if (
        (triggerEl && triggerEl.contains(e.target as Node)) ||
        (popoverEl && popoverEl.contains(e.target as Node))
      ) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const posStyle = positionMap[position];

  return (
    <div ref={triggerRef} className="relative inline-block">
      {/* Trigger */}
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      {/* Popover */}
      {open && (
        <div
          ref={popoverRef}
          className={`
            absolute
            z-ts-popover
            min-w-[200px]
            max-w-[320px]
            rounded-xl
            border border-white/8
            bg-white/[0.04]
            backdrop-blur-xl
            shadow-[0_4px_20px_rgba(0,0,0,0.4)]
            p-4
            animate-fadeIn
            ${posStyle.container}
            ${className}
          `}
          style={{ [position === 'top' || position === 'bottom' ? 'top' : 'left']: offset }}
        >
          {/* Arrow */}
          <div
            className={`
              w-3 h-3
              absolute
              ${posStyle.arrow}
            `}
          />
          {content}
        </div>
      )}
    </div>
  );
};

Popover.displayName = 'Popover';
export default Popover;