/** Tosom FallbackScreen
 *  RM3 — Viser når en feil oppstår */

'use client';

import React from 'react';

interface FallbackScreenProps {
  onRetry?: () => void;
  title?: string;
  message?: string;
}

export function FallbackScreen({
  onRetry,
  title = 'Noe gikk galt',
  message = 'Vi klarte ikke å laste inn innholdet. Prøv igjen.',
}: FallbackScreenProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background text-dark"
      role="alert"
      aria-live="assertive"
    >
      <div className="text-center space-y-6 p-8 max-w-md">
        <span className="text-7xl block" role="img" aria-label="nope">🫥</span>
        <h2 className="text-2xl font-semibold text-dark">{title}</h2>
        <p className="text-secondary leading-relaxed">{message}</p>
        <button
          onClick={onRetry}
          className="px-8 py-3 bg-gold text-white rounded-xl hover:opacity-90 transition-all duration-150 ease-out font-medium"
          aria-label="Prøv igjen"
        >
          Prøv igjen
        </button>
      </div>
    </div>
  );
}
