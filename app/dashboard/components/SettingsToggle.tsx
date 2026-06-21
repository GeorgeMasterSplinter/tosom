/**
 * ToSom Dashboard 2.0 — SettingsToggle
 * Premium toggle-komponent for innstillinger.
 */

'use client';

import { FC } from 'react';

interface SettingsToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const SettingsToggle: FC<SettingsToggleProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center justify-between py-3 animate-fadeIn">
      <span className="text-gray-200 text-sm">{label}</span>
      <div
        onClick={() => onChange(!value)}
        className={`
          w-12 h-6 rounded-full cursor-pointer transition-all
          ${value ? 'bg-[#D4AF37]' : 'bg-gray-600'}
        `}
        role="switch"
        tabIndex={0}
        aria-checked={value}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onChange(!value);
          }
        }}
      >
        <div
          className={`
            w-5 h-5 bg-white rounded-full transition-all
            ${value ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </div>
    </div>
  );
};

export default SettingsToggle;