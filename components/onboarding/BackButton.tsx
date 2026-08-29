/**
 * Tosom — BackButton (Premium)
 * Felles Tilbake-knapp for alle onboarding-steg.
 * Glassmorphism med gull-aksent ved hover/fokus.
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
      data-testid="ob-back"
      className="w-full py-5 px-8 rounded-xl font-light tracking-wide
        bg-white/[0.04] border border-white/[0.08]
        text-white/60 hover:text-white/80
        hover:border-[rgba(212,175,55,0.3)]
        backdrop-blur-sm
        shadow-md shadow-black/10
        transition-all duration-400 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-3"
      style={{ willChange: 'background-color, border-color' }}
    >
      <span className="flex items-center justify-center gap-2">
        {/* Premium pil-ikon (SVG) */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:-translate-x-0.5"
        >
          <path
            d="M10 3L5 8L10 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Tilbake</span>
      </span>
    </button>
  );
}
