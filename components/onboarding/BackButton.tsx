/**
 * ToSom — BackButton
 * Felles Tilbake-knapp for alle onboarding-steg.
 */

'use client';

import React from 'react';

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-xl font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
    >
      Tilbake
    </button>
  );
}