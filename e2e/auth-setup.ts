/**
 * Playwright globalSetup for ToSom E2E-testar
 * Loggar inn som test-bruker via /dev-login og lagrar storageState
 * Denne filen køyrer EINASTEIN before alle test-projekt.
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

  const storageStatePath = path.resolve(authDir, 'user.json');

  // Start browser for auth-login
  const browser = await chromium.launch({ 
    headless: true,
  });
  
  // Lagar ein context med persistent state
  const context = await browser.newContext({
    storageState: undefined,
  });
  
  const page = await context.newPage();

  console.log('[auth-setup] Navigerer til /dev-login...');
  
  // Gå til dev-login side
  await page.goto('http://127.0.0.1:3000/dev-login', { 
    waitUntil: 'networkidle',
    timeout: 15000,
  });

  // Vent på at bruker-lista lastar (max 15s)
  try {
    await page.waitForResponse(
      res => 
        res.url().includes('/api/dev-login/users') && 
        res.status() === 200, 
      { timeout: 15000 }
    );
    console.log('[auth-setup] Bruker-lista lasta OK');
  } catch (err) {
    console.warn('[auth-setup] Advarsel: /api/dev-login/users responderte ikke innen 15s', err);
  }

  // Klikk på fyrste login-knapp
  const loginButtons = page.locator('button', { hasText: /Logg inn som/ });
  const buttonCount = await loginButtons.count();
  
  if (buttonCount > 0) {
    console.log(`[auth-setup] Finn ${buttonCount} login-knapper, klikkar fyrste...`);
    await loginButtons.first().click();
    
    // Vent på redirect til dashboard eller onboarding
    try {
      await page.waitForURL(/\/dashboard|\/onboarding/, { timeout: 15000 });
      console.log('[auth-setup] Redirect OK — URL:', page.url());
    } catch (err) {
      console.warn('[auth-setup] Advarsel: redirect tok lenger tid enn 15s');
    }
  } else {
    console.error('[auth-setup] FEIL: Ingen login-knapper funnet! Sjekk at DEV_LOGIN_ENABLED=true i .env.local');
    // Fortset likevel — test kan ha annan auth-mekanisme
  }

  // Lagrar authenticated state til JSON-fil
  const storageState = await context.storageState({ path: storageStatePath });
  console.log(`[auth-setup] StorageState lagda til ${storageStatePath}`);
  console.log(`[auth-setup] Cookies: ${storageState.cookies.length}, Origins: ${storageState.origins?.length || 0}`);

  await context.close();
  await browser.close();
}

export default globalSetup;