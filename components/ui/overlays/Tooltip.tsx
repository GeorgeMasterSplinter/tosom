/**
 * Tooltip — Gold-themed tooltip with glassmorphism
 *
 * Usage:
 *   <Tooltip content="Helpful tip">
 *     <button>Hover me</button>
 *   </Tooltip>
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface TooltipProps {
  /** Trigger element */
  trigger: React.ReactNode;
  /** Tooltip text */
  content: string;
  /** Position */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing (ms) */
  delay?: number;
  /** Custom class */
  className?: string;
}

const positionMap: Record<NonNullable<TooltipProps['position']>, { container: string; arrow: string }> = {
  top: {
    container: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
  },
  bottom: {
    container: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
  },
  left: {
    container: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'right-full top-1/2 translate-y-1/2 rotate-45',
  },
  right: {
    container: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'left-full top-1/2 -translate-y-1/2 -rotate-45',
  },
};

const Tooltip: React.FC<TooltipProps> = ({
  trigger,
  content,
  position = 'top',
  delay = 200,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setVisible(true);
    }, delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const posStyle = positionMap[position];

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block"
    >
      {trigger}

      {visible && (
        <div
          className={`
            absolute
            z-ts-tooltip
            px-3 py-1.5
            text-sm
            font-medium
            text-ts-gold
            rounded-ts-md
            border border-ts-gold/20
            bg-ts-gold-soft/90
            backdrop-blur-xl
            shadow-[0_4px_20px_rgba(0,0,0,0.4)]
            animate-fadeIn
            ${posStyle.container}
            ${className}
          `}
        >
          {/* Arrow */}
          <div
            className={`
              w-2 h-2
              absolute
              ${posStyle.arrow}
              border-r border-b
              border-ts-gold/20
              bg-ts-gold-soft/90
            `}
          />
          {content}
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';
export default Tooltip;