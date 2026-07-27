/* ═══════════════════════════════════════════
   ToSom ActionGrid — Design System 1.1
   2x2 grid for handlingar i dashboard.
   Bruk glassmorphism-kort med ikoner.
   ═══════════════════════════════════════════ */

'use client';

import Link from 'next/link';
import { HTMLProps, forwardRef } from 'react';

export interface ActionItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface ActionGridProps extends HTMLProps<HTMLDivElement> {
  items: ActionItem[];
}

export const ActionGrid = forwardRef<HTMLDivElement, ActionGridProps>(
  ({ items, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`grid grid-cols-2 gap-4 ${className}`.trim()}
        {...props}
      >
        {items.map((item, i) => (
          <Link key={i} href={item.href} className="block w-full">
            <div
              className="w-full min-h-[60px] py-5 px-6 rounded-2xl text-lg font-medium flex items-center justify-start gap-4 transition-all duration-300 active:scale-95"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <div className="w-6 h-6 flex-shrink-0" style={{ color: '#D4AF37' }}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    );
  }
);

ActionGrid.displayName = 'ActionGrid';

export default ActionGrid;