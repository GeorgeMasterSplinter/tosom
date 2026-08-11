/**
 * ToSom ToSomTabs — System component
 * 
 * Horizontal tabs with gold underline animation.
 */

'use client';

import { FC, useState, useRef } from 'react';
import { colors, motion, spacing } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface TabItem {
  label: string;
  value: string;
}

interface ToSomTabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomTabs: FC<ToSomTabsProps> = ({ tabs, value, onChange }) => {
  const [indicatorRef, setIndicatorRef] = useState<HTMLElement | null>(null);

  const handleTabClick = (tabValue: string) => {
    onChange(tabValue);
  };

  return (
    <div className="relative" ref={(el) => setIndicatorRef(el as HTMLElement)}>
      <div
        className="flex gap-6 pb-0 overflow-x-auto"
        style={{ borderBottom: `1px solid rgba(255,255,255,0.10)` }}
      >
        {tabs.map((tab) => {
          const isActive = value === tab.value;
          return (
            <button
              key={tab.value}
              data-tab-value={tab.value}
              onClick={() => handleTabClick(tab.value)}
              className="relative pb-3 px-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
              style={{
                color: isActive ? colors.gold : 'rgba(255,255,255,0.65)',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {/* Underline indicator */}
      <div
        className="absolute bottom-0 h-[2px] bg-[#D4AF37] rounded-full"
        style={{
          transition: `left ${motion.durations.normal} ${motion.easings.spring}`,
        }}
        ref={(el) => {
          if (!el || !indicatorRef) return;
          const tabsContainer = indicatorRef.querySelector('div') as HTMLElement;
          if (!tabsContainer) return;
          const activeBtn = tabsContainer.querySelector(`[data-tab-value="${value}"]`) as HTMLElement;
          if (activeBtn) {
            el.style.width = `${activeBtn.offsetWidth}px`;
            el.style.left = `${activeBtn.offsetLeft}px`;
          }
        }}
      />
    </div>
  );
};

export default ToSomTabs;