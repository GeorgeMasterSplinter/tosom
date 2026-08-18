/**
 * Tosom — Settings Layout
 * Bruker samme DashboardNavBar som dashboard-siden.
 */

'use client';

import DashboardNavBar from '@/app/dashboard/components/DashboardNavBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full">
      <DashboardNavBar />
      {children}
    </main>
  );
}