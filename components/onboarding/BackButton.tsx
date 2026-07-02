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
      className="w-full py-5 px-8 rounded-xl font-light tracking-wide bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 shadow-md shadow-black/10 transition-all duration-300"
    >
      ← Tilbake
    </button>
  );
}
