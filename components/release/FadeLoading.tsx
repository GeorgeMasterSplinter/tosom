/** ToSom FadeLoading
 *  RM8 / RM9 — Loading state med fade overgang (150–200ms) */

'use client';

import React, { useState, useEffect } from 'react';

interface FadeLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/** Viser loading med fade-ut og content med fade-in */
export function FadeLoading({ isLoading, children, fallback }: FadeLoadingProps) {
  const [visible, setVisible] = useState(!isLoading);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (isLoading && visible) {
      setFade(false);
      const t = setTimeout(() => {
        setVisible(false);
        setFade(true);
      }, 200);
      return () => clearTimeout(t);
    } else if (!isLoading && !visible) {
      setVisible(true);
      const t = setTimeout(() => setFade(true), 50);
      return () => clearTimeout(t);
    }
  }, [isLoading, visible]);

  return (
    <div
      className={`transition-opacity duration-[200ms] ease-out ${
        visible ? (fade ? 'opacity-100' : 'opacity-0') : 'opacity-0'
      }`}
    >
      {visible ? children : fallback || <LoadingSpinner />}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div
      className="flex items-center justify-center min-h-[200px]"
      role="status"
      aria-label="Laster inn..."
    >
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
