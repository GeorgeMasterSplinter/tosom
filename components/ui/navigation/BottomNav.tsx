/**
 * BottomNav — Mobile bottom navigation bar
 *
 * Features:
 * - Fixed to bottom
 * - Glassmorphism background
 * - Icon + label items with gold active state
 * - Safe area padding for notched devices
 *
 * Usage:
 *   <BottomNav
 *     items={[
 *       { href: '/home', label: 'Home', icon: <HomeIcon /> },
 *       { href: '/matches', label: 'Matches', icon: <MatchIcon />, badge: 3 },
 *     ]}
 *   />
 */

import React from 'react';

export interface BottomNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number | string;
  disabled?: boolean;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  /** Active item key (for non-link usage) */
  activeKey?: string;
  /** On item click handler */
  onItemClick?: (item: BottomNavItem, key: string) => void;
  /** Custom class */
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({
  items,
  activeKey,
  onItemClick,
  className = '',
}) => {
  const getKey = (item: BottomNavItem, index: number) =>
    item.href || `item-${index}`;

  const isActive = (item: BottomNavItem, index: number) => {
    if (activeKey) return getKey(item, index) === activeKey;
    return item.active;
  };

  return (
    <nav
      className={`
        fixed
        bottom-0
        left-0
        right-0
        z-ts-sticky
        h-16
        flex
        items-center
        justify-around
        px-2
        bg-ts-glass/90
        backdrop-blur-xl
        border-t border-white/8
        safe-area-pb-4
        ${className}
      `}
    >
      {items.map((item, i) => {
        const active = isActive(item, i);
        const key = getKey(item, i);

        const content = (
          <>
            <span
              className={`
                w-6 h-6 flex-shrink-0
                transition-colors
                ${
                  item.disabled
                    ? 'text-ts-text-subtle opacity-40'
                    : active
                    ? 'text-ts-gold'
                    : 'text-ts-text-muted group-hover:text-ts-text'
                }
              `}
            >
              {item.icon}
            </span>
            <span
              className={`
                text-[10px] font-medium
                ${
                  active
                    ? 'text-ts-gold'
                    : 'text-ts-text-muted group-hover:text-ts-text'
                }
              `}
            >
              {item.label}
            </span>
            {item.badge && (
              <span className="absolute -top-0.5 right-0 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-ts-error text-white">
                {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </>
        );

        if (item.disabled || !item.href) {
          return (
            <button
              key={i}
              type="button"
              className={`
                relative
                flex flex-col items-center justify-center
                flex-1
                py-1
                text-ts-text-subtle
                opacity-40
                cursor-not-allowed
              `}
              disabled
            >
              {content}
            </button>
          );
        }

        return (
          <a
            key={i}
            href={item.href}
            onClick={(e) => {
              onItemClick?.(item, key);
            }}
            className={`
              relative
              flex flex-col items-center justify-center
              flex-1
              py-1
              group
              transition-colors
              ${
                active
                  ? 'text-ts-gold'
                  : 'text-ts-text-muted hover:text-ts-text'
              }
            `}
          >
            {content}
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-ts-gold rounded-b-full" />
            )}
          </a>
        );
      })}
    </nav>
  );
};

BottomNav.displayName = 'BottomNav';
export default BottomNav;