/**
 * ToSom — Global Setup Wrapper (STEG 12.3)
 *
 * Kjøper BOTH auth-dashboard-setup og auth-onboarding-setup
 * slik at begge storageState-filene eksisterer før tester starter.
 */

import { FullConfig } from '@playwright/test';
import dashboardSetup from './auth-dashboard-setup';
import onboardingSetup from './auth-onboarding-setup';

async function globalSetup(config: FullConfig) {
  // Først: opprett dashboard-user state
  await dashboardSetup(config);
  // Deretter: opprett onboarding-user state
  await onboardingSetup(config);
}

export default globalSetup;