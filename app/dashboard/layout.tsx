/**
 * ToSom Dashboard 1.0 — Dashboard Layout
 * Granitt for hele Dashboardet.
 * Rolig, premium layout uten unodvendige effekter.
 * 100% context-drevet — ingen prop-drilling.
 */

'use client';

import { DashboardNavBar } from './components/DashboardNavBar';
import { DashboardTopCard } from './components/DashboardTopCard';
import { DashboardDailyStep } from './components/DashboardDailyStep';
import { DashboardConversation } from './components/DashboardConversation';
import { DashboardJourneyProgress } from './components/DashboardJourneyProgress';
import { DashboardSafety } from './components/DashboardSafety';
import { DashboardProfileCard } from './components/DashboardProfileCard';
import { DashboardSettingsPanel } from './components/DashboardSettingsPanel';
import { NotificationContainer } from './components/NotificationContainer';
import { DashboardProvider } from './context/DashboardContext';
import { NotificationProvider } from './context/NotificationContext';
import { DashboardEventProvider } from './context/DashboardEventProvider';
import { SettingsProvider } from './context/SettingsContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <NotificationProvider>
        <DashboardProvider>
          <DashboardEventProvider>
            <main className="min-h-screen bg-[#0B0F14] text-white">
              {/* Navbar */}
              <DashboardNavBar />

              <div className="mx-auto max-w-5xl px-6 lg:px-8 py-20 md:py-32">
                {/* Profil-kort (øverst) */}
                <DashboardProfileCard />

                {/* Dashboard-komponenter — alle context-drevet */}
                <div className="space-y-10 md:space-y-14">
                  <DashboardTopCard />
                  <DashboardDailyStep />
                  <DashboardConversation />
                  <DashboardJourneyProgress />
                  <DashboardSafety />
                </div>

                {/* Children — for utvidelse */}
                {children}
              </div>
            </main>
            <NotificationContainer />
            <DashboardSettingsPanel />
          </DashboardEventProvider>
        </DashboardProvider>
      </NotificationProvider>
    </SettingsProvider>
  );
}