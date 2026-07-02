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
      <header className="relative z-50 mb-10">
        <AppHeader />
      </header>
      <div className="pt-[80px]">
        {children}
      </div>
    </>
  );
}