/**
 * Playwright globalSetup for ToSom E2E-testar - ONBOARDING-bruker
 * Loggar inn som e2e.onboarding@tosom.no (onboardingComplete=false)
 * Denne filen køyrer berre for onboarding-testar.
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

  const storageStatePath = path.resolve(authDir, 'onboarding-user.json');

  // Start browser for auth-login
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('[onboarding-auth] Navigerer til /dev-login...');

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
    console.log('[onboarding-auth] Brukar-lista lasta OK');
  } catch (err) {
    console.warn('[onboarding-auth] Advarsel: /api/dev-login/users responderte ikkje innan 20s');
  }

  // Klikk på onboarding-brukaren spesifikt
  const onboardingButton = page.locator('button', { hasText: /E2E Onboarding/ });
  if (await onboardingButton.count() > 0) {
    console.log('[onboarding-auth] Funnet E2E Onboarding-brukar, klikkar...');
    await onboardingButton.click();

    // Vent på redirect til onboarding
    try {
      await page.waitForURL(/\/onboarding/, { timeout: 15000 });
      console.log('[onboarding-auth] Redirect til /onboarding OK — URL:', page.url());
    } catch {
      // Kan også lande på dashboard om dev-login redirect er hardkodet
      console.log('[onboarding-auth] Landet på:', page.url());
    }
  } else {
    // Fallback: klikk fyrste knapp
    const loginButtons = page.locator('button', { hasText: /Logg inn som/ });
    if (await loginButtons.count() > 0) {
      console.warn('[onboarding-auth] E2E Onboarding-brukar ikkje funnen, brukar fyrste...');
      await loginButtons.first().click();
    } else {
      console.error('[onboarding-auth] FEIL: Ingen login-knappar!');
    }
  }

  // Lagrar authenticated state
  const storageState = await context.storageState({ path: storageStatePath });
  console.log(`[onboarding-auth] StorageState lagda til ${storageStatePath}`);
  console.log(`[onboarding-auth] Cookies: ${storageState.cookies.length}, Origins: ${storageState.origins?.length || 0}`);

  await context.close();
  await browser.close();
}

export default globalSetup;