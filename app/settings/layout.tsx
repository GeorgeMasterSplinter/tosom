/**
 * Tosom — Settings Layout
 * Bruker samme DashboardNavBar som dashboard-siden.
 */

import DashboardNavBar from '@/app/dashboard/components/DashboardNavBar';

// TC-11: innstillinger (personlig data) — skal ikke indexeres.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full">
      <DashboardNavBar />
      {children}
    </main>
  );
}