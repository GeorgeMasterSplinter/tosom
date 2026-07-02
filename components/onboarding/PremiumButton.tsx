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
      className="w-full py-5 px-8 rounded-xl font-light tracking-wide text-center text-[#0B1520] bg-[#D4AF37] shadow-lg shadow-black/20 hover:bg-[rgba(212,175,55,0.85)] hover:shadow-[0_0_24px_rgba(212,175,55,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
