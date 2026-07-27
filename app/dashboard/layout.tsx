/**
 * ToSom — Dashboard Layout (cleaned 2026)
 * 
 * Berre context-providers + navigasjon. Alt innhald styres av page.tsx.
 */

'use client';

import { DashboardProvider } from './context/DashboardContext';
import { NotificationProvider } from './context/NotificationContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <DashboardProvider>
        <main className="min-h-screen w-full">
          {children}
        </main>
      </DashboardProvider>
    </NotificationProvider>
  );
}
