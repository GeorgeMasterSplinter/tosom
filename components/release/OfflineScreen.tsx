/** ToSom OfflineScreen
 *  RM4 — Viser når ingen nettforbindelse */

'use client';

import React from 'react';

interface OfflineScreenProps {
  onRetry?: () => void;
}

/** Dummy offline-deteksjon — bruk navigator.onLine i production */
function isOnline(): boolean {
  if (typeof navigator !== 'undefined') {
    return navigator.onLine;
  }
  return true;
}

export function OfflineScreen({ onRetry }: OfflineScreenProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background text-dark"
      role="alert"
      aria-live="assertive"
    >
      <div className="text-center space-y-6 p-8 max-w-md">
        <span className="text-7xl block" role="img" aria-label="antenna">📡</span>
        <h2 className="text-2xl font-semibold text-dark">Ingen nettforbindelse</h2>
        <p className="text-secondary leading-relaxed">
          Vi kan ikke koble til serveren. Sjekk tilkoblingen din og prøv igjen.
        </p>
        <button
          onClick={handleRetry}
          className="px-8 py-3 bg-gold text-white rounded-xl hover:opacity-90 transition-all duration-150 ease-out font-medium"
          aria-label="Prøv igjen"
          tabIndex={0}
        >
          Prøv igjen
        </button>
        <p className="text-xs text-gray-400">
          Status: {isOnline() ? 'tilkopla' : 'frakopla'}
        </p>
      </div>
    </div>
  );
}
