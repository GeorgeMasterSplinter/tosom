/** ToSom BrandProvider
 *  BR5 — Legg fargar og typografi i React context
 *  Eksporterer: useBrandColors(), useBrandTypography() */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { brandColors } from '@/lib/branding/colors';
import { brandTypography } from '@/lib/branding/typography';

interface BrandContextValue {
  colors: typeof brandColors;
  typography: typeof brandTypography;
}

const BrandContext = createContext<BrandContextValue | null>(null);

/** Hook for å henta brand-fargar */
export function useBrandColors() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrandColors must be used within BrandProvider');
  return ctx.colors;
}

/** Hook for å henta brand-typografi */
export function useBrandTypography() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrandTypography must be used within BrandProvider');
  return ctx.typography;
}

interface BrandProviderProps {
  children: ReactNode;
}

export function BrandProvider({ children }: BrandProviderProps) {
  return (
    <BrandContext.Provider value={{ colors: brandColors, typography: brandTypography }}>
      {children}
    </BrandContext.Provider>
  );
}
