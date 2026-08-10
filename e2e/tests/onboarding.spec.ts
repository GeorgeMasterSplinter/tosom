/**
 * E2E-test — Onboarding-flow (13-stegs versjon)
 * Testar at ein ny brukar kan fullføre heile onboarding-flyten utan feil.
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// =====================================================================
// Hjelpemethodar
// =====================================================================

/** Skriv verdi inn i eit TextAreaField med korrekt markering og focusing */
async function fillTextArea(page: Parameters<typeof page.locator>[0], label: string, value: string) {
  // Finn textarea med den gitte label-en (tekst over feltet)
  const textareas = page.locator('textarea');
  const labels = page.locator('label');
  
  for (let i = 0; i < await labels.count(); i++) {
    const labelText = await labels.nth(i).textContent() ?? '';
    if (labelText.includes(label)) {
      const textarea = textareas.nth(i);
      await textarea.click();
      await textarea.fill(value);
      await expect(textarea).toHaveValue(value);
      return;
    }
  }
  throw new Error(`Fann ikkje textarea med label: ${label}`);
}

/** Klikkar på ein PremiumButton (gull-knapp) med den gitte teksten */
async function clickPremiumButton(page: Parameters<typeof page.locator>[0], text: string) {
  const buttons = page.getByRole('button', { name: new RegExp(text, 'i') });
  await expect(buttons).toBeVisible();
  await buttons.first().click();
}

/** Klikkar på ein BackButton (tekst med "tilbake") */
async function clickBackButton(page: Parameters<typeof page.locator>[0]) {
  const backButtons = page.getByRole('button', { name: /tilbake/i });
  await expect(backButtons).toBeVisible();
  await backButtons.first().click();
}

// =====================================================================
// TESTAR
// =====================================================================

/**
 * TODO: Fikse onboarding-tester når dedikert auth-setup er på plass.
 * Problem: dev-login redirecterer alltid til /dashboard for brukere med onboardingComplete=true.
 * Løsning: Trenger egen auth-flow som navigerer til /onboarding og lagrer storageState derfra.
 */
test.describe.skip('Onboarding Flow (13-stegs)', () => {

  // -------------------------------------------------------------------------
  // Steg 0: Visning av onboarding
  // -------------------------------------------------------------------------
  
  test('skal vise onboarding med progressbar og steg-tittel', async ({ page }) => {
    await page.goto('/onboarding');
    
    // Progress-bar skal vere synleg
    const progressBar = page.locator('.rounded-full.overflow-hidden');
    await expect(progressBar).toBeVisible();
    
    // Steg-tittel (h1) skal vere synleg
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
    
    // Undertydning skal vere synleg
    const subtitle = page.locator('[style*="color: rgba(212, 175, 55)"]').first();
    await expect(subtitle).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // Steg 0 (første steg): Grunnprofil
  // -------------------------------------------------------------------------

  test('skal kunna fylle ut grunnprofil og gå vidare', async ({ page }) => {
    await page.goto('/onboarding');

    // === Fyll inn navn ===
    const nameInput = page.locator('input[name="identityName"]');
    if (await nameInput.count() > 0) {
      await nameInput.fill('Testbruker');
      await expect(nameInput).toHaveValue('Testbruker');
    }

    // === Fyll inn alder ===
    const ageInput = page.locator('input[name="age"]');
    if (await ageInput.count() > 0) {
      await ageInput.fill('30');
      await expect(ageInput).toHaveValue('30');
    }

    // === Vel kjønn ===
    const genderSelect = page.locator('select[name="gender"]');
    if (await genderSelect.count() > 0) {
      await genderSelect.selectOption('mann');
      await expect(genderSelect).toHaveValue('mann');
    }

    // === Vel søkjer ===
    const seekingSelect = page.locator('select[name="seekingGender"]');
    if (await seekingSelect.count() > 0) {
      await seekingSelect.selectOption('kvinne');
      await expect(seekingSelect).toHaveValue('kvinne');
    }

    // === Klikk "Fortsett" PremiumButton ===
    const nextBtn = page.getByRole('button', { name: /fortset/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.first().click();

    // Skal flytte til neste steg (Steg 1: Personlighet)
    await expect(page.locator('[name="selfDesc"]')).toBeVisible({ timeout: 3000 });
  });

  // -------------------------------------------------------------------------
  // Steg 1: Personlighet & identitet — med validering
  // -------------------------------------------------------------------------

  test('skal visa feilmelding ved tom selfDesc', async ({ page }) => {
    await page.goto('/onboarding');

    // Gå til steg 1 (Personlighet)
    const nextBtn = page.getByRole('button', { name: /fortset/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.first().click();

    // Vent på steg 1
    await expect(page.locator('[name="selfDesc"]')).toBeVisible({ timeout: 3000 });

    // Klikk "Fortsett" utan å fylla ut selfDesc (skal visa valideringsfeil)
    const submitBtn = page.getByRole('button', { name: /fortset/i });
    await submitBtn.click();

    // Skal visa error-message
    const errorMsg = page.locator('[style*="rgba(255, 77, 77)"]');
    await expect(errorMsg).toBeVisible({ timeout: 3000 });

    // Søk etter feilmeldingstekst på norsk bokmål
    const textContent = await errorMsg.textContent();
    expect(textContent).toContain('minst 10 tegn');
  });

  test('skal kunna gå vidare frå steg 1 med gyldig selfDesc', async ({ page }) => {
    await page.goto('/onboarding');

    // Gå til steg 1 (Personlighet)
    const nextBtn = page.getByRole('button', { name: /fortset/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.first().click();

    // Vent på steg 1
    await expect(page.locator('[name="selfDesc"]')).toBeVisible({ timeout: 3000 });

    // Fyll inn selfDesc med gyldig verdi (≥10 teikn)
    const selfDesc = page.locator('textarea[name="selfDesc"]');
    await selfDesc.fill('Jeg er en rolig person som liker gode samtaler.');
    await expect(selfDesc).toHaveValue('Jeg er en rolig person som liker gode samtaler.');

    // Klikk "Fortsett"
    const submitBtn = page.getByRole('button', { name: /fortset/i });
    await submitBtn.click();

    // Skal flytte til steg 2 (Livssituasjon)
    await expect(page.locator('[name="workType"]')).toBeVisible({ timeout: 3000 });
  });

  // -------------------------------------------------------------------------
  // Steg 2: Livssituasjon — med validering
  // -------------------------------------------------------------------------

  test('skal kunna gå vidare frå steg 2 med gyldig responsibilities', async ({ page }) => {
    await page.goto('/onboarding');

    // Gå til steg 1 → steg 2
    let nextBtn = page.getByRole('button', { name: /fortset/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.first().click();

    // Stig 1 → fyll selfDesc (validering)
    const selfDesc = page.locator('textarea[name="selfDesc"]');
    if (await selfDesc.count() > 0) {
      await selfDesc.fill('Jeg er en rolig person som liker gode samtaler.');
      nextBtn = page.getByRole('button', { name: /fortset/i });
      await nextBtn.click();
    }

    // Skall no vere på steg 2 (Livssituasjon)
    await expect(page.locator('[name="workType"]')).toBeVisible({ timeout: 3000 });

    // Fyll inn responsibilities (≥10 teikn for validering)
    const resp = page.locator('textarea[name="responsibilities"]');
    if (await resp.count() > 0) {
      await resp.fill('Jeg har to barn som bor hos meg helga og hverda.');
      await expect(resp).toHaveValue('Jeg har to barn som bor hos meg helga og hverda.');
    }

    // Klikk "Fortsett"
    nextBtn = page.getByRole('button', { name: /fortset/i });
    await nextBtn.click();

    // Skall flytta til steg 3 (Tilknytning)
    await expect(page.locator('[name="safetyNeed"]')).toBeVisible({ timeout: 3000 });
  });

  // -------------------------------------------------------------------------
  // Back-navigasjon
  // -------------------------------------------------------------------------

  test('skal kunna tilbake med BackButton på steg 1', async ({ page }) => {
    await page.goto('/onboarding');

    // Gå til steg 1 (Personlighet)
    let nextBtn = page.getByRole('button', { name: /fortset/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.first().click();

    await expect(page.locator('[name="selfDesc"]')).toBeVisible({ timeout: 3000 });

    // Fyll selfDesc (for å unngå validering)
    const selfDesc = page.locator('textarea[name="selfDesc"]');
    if (await selfDesc.count() > 0) {
      await selfDesc.fill('Jeg er en rolig person som liker gode samtaler.');
    }

    // Gå vidare til steg 2 og tilbake
    nextBtn = page.getByRole('button', { name: /fortset/i });
    await nextBtn.click();

    await expect(page.locator('[name="workType"]')).toBeVisible({ timeout: 3000 });

    // Klikk BackButton
    const backBtn = page.getByRole('button', { name: /tilbake/i });
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    // Skall tilbake til steg 1
    await expect(page.locator('[name="selfDesc"]')).toBeVisible({ timeout: 3000 });
  });

  // -------------------------------------------------------------------------
  // Steg 3-12: Gjennomfør heile flyten (komplett flow)
  // -------------------------------------------------------------------------

  test('skal kunna fullføre heile 13-stegs onboarding-flyten', async ({ page }) => {
    await page.goto('/onboarding');

    const testData = {
      // Steg 0: Grunnprofil
      name: 'Testbruker',
      age: '30',
      gender: 'mann',
      seeking: 'kvinne',
      
      // Steg 1: Personlighet
      selfDesc: 'Jeg er en rolig og balansert person som verdsetter dype samtaler og ærlighet.',
      energyGiver: 'Gode konversationer, natur, kreativt arbeid.',
      energyDrainer: 'Store folkemengder, konflikt, uvissighet.',
      
      // Steg 2: Livssituasjon
      responsibilities: 'Jeg har to barn som bor hos meg helga og hverda.',
    };

    // === STEG 0: Grunnprofil ===
    await page.goto('/onboarding');

    const nameInput = page.locator('input[name="identityName"]');
    if (await nameInput.count() > 0) {
      await nameInput.fill(testData.name);
    }

    const ageInput = page.locator('input[name="age"]');
    if (await ageInput.count() > 0) {
      await ageInput.fill(testData.age);
    }

    const genderSelect = page.locator('select[name="gender"]');
    if (await genderSelect.count() > 0) {
      await genderSelect.selectOption(testData.gender);
    }

    const seekingSelect = page.locator('select[name="seekingGender"]');
    if (await seekingSelect.count() > 0) {
      await seekingSelect.selectOption(testData.seeking);
    }

    let nextBtn = page.getByRole('button', { name: /fortset/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // === STEG 1: Personlighet & identitet ===
    await expect(page.locator('[name="selfDesc"]')).toBeVisible({ timeout: 3000 });

    const selfDesc = page.locator('textarea[name="selfDesc"]');
    if (await selfDesc.count() > 0) {
      await selfDesc.fill(testData.selfDesc);
    }

    const energyGiver = page.locator('textarea[name="energyGiver"]');
    if (await energyGiver.count() > 0) {
      await energyGiver.fill(testData.energyGiver);
    }

    nextBtn = page.getByRole('button', { name: /fortset/i });
    await nextBtn.click();

    // === STEG 2: Livssituasjon ===
    await expect(page.locator('[name="workType"]')).toBeVisible({ timeout: 3000 });

    const resp = page.locator('textarea[name="responsibilities"]');
    if (await resp.count() > 0) {
      await resp.fill(testData.responsibilities);
    }

    nextBtn = page.getByRole('button', { name: /fortset/i });
    await nextBtn.click();

    // === STEG 3-12: Fylle alle resterande steg (valfrie felt) ===
    for (let step = 3; step <= 12; step++) {
      const url = page.url();
      
      // Klikk "Fortsett" på kvart steg
      nextBtn = page.getByRole('button', { name: /fortset/i });
      if (await nextBtn.count() > 0) {
        await nextBtn.click();
        
        // Vent på neste side eller redirect
        await page.waitForTimeout(500);
      }

      // Sjekk om vi blei redirected til dashboard/matching
      const currentUrl = page.url();
      if (currentUrl.includes('/dashboard') || currentUrl.includes('/matching')) {
        break;
      }
    }

    // Final check: Skal ende på enten /dashboard eller /matching
    const finalUrl = page.url();
    expect(finalUrl).toMatch(/\/dashboard|\/matching/);
  });

  // -------------------------------------------------------------------------
  // Autosave (localStorage)
  // -------------------------------------------------------------------------

  test('skal autosave inndata til localStorage', async ({ page }) => {
    await page.goto('/onboarding');

    const nameInput = page.locator('input[name="identityName"]');
    if (await nameInput.count() > 0) {
      await nameInput.fill('AutosaveTest');
    }

    // Vent på autosave-debounce (400ms) + buffer
    await page.waitForTimeout(1000);

    // Sjekk localStorage for draft
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('tosom_onboarding_draft');
    });

    expect(savedData).not.toBeNull();
    const parsed = JSON.parse(savedData ?? '{}');
    expect(parsed.identityName).toBe('AutosaveTest');
  });

  // -------------------------------------------------------------------------
  // Draft-restaurering (refresh)
  // -------------------------------------------------------------------------

  test('skal restaurera draft etter side-opprettning', async ({ page }) => {
    await page.goto('/onboarding');

    const nameInput = page.locator('input[name="identityName"]');
    if (await nameInput.count() > 0) {
      await nameInput.fill('DraftTest123');
    }

    // Vent på autosave
    await page.waitForTimeout(1000);

    // Oppfrisk side
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Sjekk at verdien er restaurert frå localStorage
    const restoredValue = await nameInput.inputValue();
    expect(restoredValue).toBe('DraftTest123');
  });

  // -------------------------------------------------------------------------
  // Progress-bar oppdatering
  // -------------------------------------------------------------------------

  test('skal visa riktig progress-prosent', async ({ page }) => {
    await page.goto('/onboarding');

    // Steg 0: skal visa ~8% (1/13)
    const progressText = page.locator('[style*="color: rgba(255, 255, 255, 0.3)"]');
    await expect(progressText).toBeVisible();
    
    // Søk etter "Du er X% ferdig" på norsk bokmål
    const firstP = page.locator('p').first();
    const pText = await firstP.textContent();
    expect(pText).toContain('%');
  });

});