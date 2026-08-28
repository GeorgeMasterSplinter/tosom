/**
 * Tosom — Dashboard Layout (cleaned 2026)
 * 
 * Kun context-providers + navigasjon. Alt innhold styres av page.tsx.
 */

'use client';

import { DashboardProvider } from './context/DashboardContext';
import { NotificationProvider } from './context/NotificationContext';
// STEG 8.2: Koble inn DashboardNavBar for å vise navigasjon i dashboard-layout
import DashboardNavBar from './components/DashboardNavBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <DashboardProvider>
        <main className="min-h-screen w-full">
          {/* STEG 8.2: DashboardNavBar med Desktop + Mobile navigasjon */}
          <DashboardNavBar />
          {children}
        </main>
      </DashboardProvider>
    </NotificationProvider>
  );
}