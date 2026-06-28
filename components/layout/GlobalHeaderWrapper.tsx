/**
 * ToSom — Global Header Wrapper
 * 
 * Client component that wraps all pages with the global AppHeader.
 */

'use client';

import AppHeader from '@/components/ui/layout/AppHeader';

export default function GlobalHeaderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <div className="pt-[80px]">
        {children}
      </div>
    </>
  );
}