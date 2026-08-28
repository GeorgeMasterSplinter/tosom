/**
 * Playwright globalSetup for ToSom E2E-testar - DASHBOARD-bruker
 * Loggar inn som e2e.dashboard@tosom.no (onboardingComplete=true)
 * Denne filen køyrer berre for dashboard/journey/chat/match-testar.
 */
import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  // Sikre at output-dir eksisterer
  const authDir = path.resolve(__dirname, '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const storageStatePath = path.resolve(authDir, 'dashboard-user.json');

  // Start browser for auth-login
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('[dashboard-auth] Navigerer til /dev-login...');

  // Gå til dev-login side
  await page.goto('http://127.0.0.1:3000/dev-login', {
    waitUntil: 'networkidle',
    timeout: 30000,
  });

  // Vent på at brukar-lista lastar
  try {
    await page.waitForResponse(
      res => res.url().includes('/api/dev-login/users') && res.status() === 200,
      { timeout: 20000 }
    );
    console.log('[dashboard-auth] Brukar-lista lasta OK');
  } catch (err) {
    console.warn('[dashboard-auth] Advarsel: /api/dev-login/users responderte ikkje innan 20s');
  }

  // Klikk på dashboard-brukaren spesifikt (Test A — seeda med match + samtale)
  const dashboardButton = page.locator('button', { hasText: /Test A/ });
  if (await dashboardButton.count() > 0) {
    console.log('[dashboard-auth] Funnet Test A-brukar, klikkar...');
    await dashboardButton.click();

    // Vent på redirect til dashboard
    try {
      await page.waitForURL(/\/dashboard/, { timeout: 15000 });
      console.log('[dashboard-auth] Redirect til /dashboard OK — URL:', page.url());
    } catch {
      console.log('[dashboard-auth] Landet på:', page.url());
    }
  } else {
    // Fallback: klikk fyrste knapp
    const loginButtons = page.locator('button', { hasText: /Logg inn som/ });
    if (await loginButtons.count() > 0) {
      console.warn('[dashboard-auth] E2E Dashboard-brukar ikkje funnen, brukar fyrste...');
      await loginButtons.first().click();
    } else {
      console.error('[dashboard-auth] FEIL: Ingen login-knappar!');
    }
  }

  // Lagrar authenticated state
  const storageState = await context.storageState({ path: storageStatePath });
  console.log(`[dashboard-auth] StorageState lagda til ${storageStatePath}`);
  console.log(`[dashboard-auth] Cookies: ${storageState.cookies.length}, Origins: ${storageState.origins?.length || 0}`);

  await context.close();
  await browser.close();
}

export default globalSetup;