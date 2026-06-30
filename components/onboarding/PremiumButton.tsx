/**
 * ToSom — PremiumButton
 * Felles gull-gradient-knapp for alle onboarding-steg.
 */

'use client';

import React from 'react';

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function PremiumButton({ children, onClick, disabled }: PremiumButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 rounded-xl font-medium text-black bg-gradient-to-r from-yellow-300 to-yellow-200 shadow-md shadow-yellow-300/30 hover:shadow-yellow-300/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}