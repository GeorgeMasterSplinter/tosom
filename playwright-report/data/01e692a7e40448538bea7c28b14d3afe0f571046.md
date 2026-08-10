# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/onboarding.spec.ts >> Onboarding Flow (13-stegs) >> skal visa riktig progress-prosent
- Location: e2e/tests/onboarding.spec.ts:397:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[style*="color: rgba(255, 255, 255, 0.3)"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[style*="color: rgba(255, 255, 255, 0.3)"]')

```

```yaml
- paragraph: Fortsett i ditt eget tempo.
- text: Steg 1 av 13
- heading "Grunnprofil" [level=1]
- paragraph: La oss starte rolig. Vi vil gjerne bli litt kjent med deg — på en måte som føles trygg og ekte.
- paragraph: Dette er starten på reisen din. Vi holder det enkelt.
- heading "IDENTITET OG SØK" [level=2]
- paragraph: Dette hjelper oss å forstå hvem du er og hvem du ønsker å møte.
- text: Hva vil du at vi skal kalle deg? *
- paragraph: Skriv f.eks. Kalla meg Sofia, Jonas eller Lia
- textbox "Navn eller kallenavn"
- text: 0/50 Alder *
- paragraph: Skriv alderen din (må være minst 23)
- textbox "25"
- text: 0/3 Ditt kjønn *
- paragraph: Velg det som passer best for deg
- button "👨 Mann"
- button "👩 Kvinne"
- button "🏳️‍🌈 Ikke-binær"
- button "🌊 Genderfluid"
- text: Hvem søker du? *
- paragraph: Velg hvem du ønsker å møte
- button "👨 Mann"
- button "👩 Kvinne"
- button "💫 Alle kjønn"
- button "💜 Kjemisk tiltrekning"
- heading "BOSTED OG AVSTAND" [level=2]
- paragraph: Vi bruker dette til å finne noen som faktisk passer deg.
- text: Bosted *
- paragraph: Skriv f.eks. Asker, Bergen eller Stavanger
- textbox "Hvor bor du?"
- text: 0/100 Maks avstand *
- slider: "50"
- text: 50 km Min alder *
- textbox "23"
- text: 2/3 Maks alder *
- textbox "40"
- text: 2/3
- heading "LIVSTIL" [level=2]
- paragraph: Litt om deg og hvordan du lever livet. (Valgfritt)
- text: Høyde (cm)
- textbox "178"
- text: 0/3 Kroppstype
- paragraph: Velg det som passer best for deg
- button "🏃 Slank"
- button "🧍 Gjennomsnittlig"
- button "💪 Atletisk"
- button "🦍 Kraftig"
- button "🌸 Myk"
- text: Din hverdag
- paragraph: Velg det som passer best for deg
- button "🏔️ Aktiv"
- button "🌿 Rolig"
- button "⚖️ Balansert"
- button "🧭 Eventyrlysten"
- button "🏠 Hjemmekjær"
- text: Røyking / snus
- paragraph: Velg det som passer best
- button "🚭 Røyker/Snuser ikke"
- button "💨 Røyker av og til"
- button "🧢 Snuser"
- button "🚬 Røyker"
- text: Religion / livssyn
- paragraph: Velg det som passer best
- button "✝️ Kristen"
- button "⛪ Katolsk"
- button "🤔 Agnostiker"
- button "🔬 Ateist"
- button "☪️ Muslim"
- button "🔯 Jehovas vitne"
- button "🕉️ Hindu"
- button "✡️ Jødedom"
- button "☯️ Buddhist"
- button "🌙 Spirituell"
- button "✨ Annet"
- text: Barn?
- button "👶 Har barn"
- button "🧑 Har voksne barn"
- button "🌱 Har ikke barn"
- text: Ønsker du barn?
- button "💚 Ja"
- button "🤷 Usikker"
- button "❌ Nei"
- button "Fyll ut alle påkrevde felt" [disabled]
- paragraph: Svarene dine brukes kun til å bygge profilen din og finne en god match.
- paragraph: ToSom — der sanne møter skjer i ro og trygghet
- alert
```

# Test source

```ts
  302 |       await energyGiver.fill(testData.energyGiver);
  303 |     }
  304 | 
  305 |     nextBtn = page.getByRole('button', { name: /fortset/i });
  306 |     await nextBtn.click();
  307 | 
  308 |     // === STEG 2: Livssituasjon ===
  309 |     await expect(page.locator('[name="workType"]')).toBeVisible({ timeout: 3000 });
  310 | 
  311 |     const resp = page.locator('textarea[name="responsibilities"]');
  312 |     if (await resp.count() > 0) {
  313 |       await resp.fill(testData.responsibilities);
  314 |     }
  315 | 
  316 |     nextBtn = page.getByRole('button', { name: /fortset/i });
  317 |     await nextBtn.click();
  318 | 
  319 |     // === STEG 3-12: Fylle alle resterande steg (valfrie felt) ===
  320 |     for (let step = 3; step <= 12; step++) {
  321 |       const url = page.url();
  322 |       
  323 |       // Klikk "Fortsett" på kvart steg
  324 |       nextBtn = page.getByRole('button', { name: /fortset/i });
  325 |       if (await nextBtn.count() > 0) {
  326 |         await nextBtn.click();
  327 |         
  328 |         // Vent på neste side eller redirect
  329 |         await page.waitForTimeout(500);
  330 |       }
  331 | 
  332 |       // Sjekk om vi blei redirected til dashboard/matching
  333 |       const currentUrl = page.url();
  334 |       if (currentUrl.includes('/dashboard') || currentUrl.includes('/matching')) {
  335 |         break;
  336 |       }
  337 |     }
  338 | 
  339 |     // Final check: Skal ende på enten /dashboard eller /matching
  340 |     const finalUrl = page.url();
  341 |     expect(finalUrl).toMatch(/\/dashboard|\/matching/);
  342 |   });
  343 | 
  344 |   // -------------------------------------------------------------------------
  345 |   // Autosave (localStorage)
  346 |   // -------------------------------------------------------------------------
  347 | 
  348 |   test('skal autosave inndata til localStorage', async ({ page }) => {
  349 |     await page.goto('/onboarding');
  350 | 
  351 |     const nameInput = page.locator('input[name="identityName"]');
  352 |     if (await nameInput.count() > 0) {
  353 |       await nameInput.fill('AutosaveTest');
  354 |     }
  355 | 
  356 |     // Vent på autosave-debounce (400ms) + buffer
  357 |     await page.waitForTimeout(1000);
  358 | 
  359 |     // Sjekk localStorage for draft
  360 |     const savedData = await page.evaluate(() => {
  361 |       return localStorage.getItem('tosom_onboarding_draft');
  362 |     });
  363 | 
  364 |     expect(savedData).not.toBeNull();
  365 |     const parsed = JSON.parse(savedData ?? '{}');
  366 |     expect(parsed.identityName).toBe('AutosaveTest');
  367 |   });
  368 | 
  369 |   // -------------------------------------------------------------------------
  370 |   // Draft-restaurering (refresh)
  371 |   // -------------------------------------------------------------------------
  372 | 
  373 |   test('skal restaurera draft etter side-opprettning', async ({ page }) => {
  374 |     await page.goto('/onboarding');
  375 | 
  376 |     const nameInput = page.locator('input[name="identityName"]');
  377 |     if (await nameInput.count() > 0) {
  378 |       await nameInput.fill('DraftTest123');
  379 |     }
  380 | 
  381 |     // Vent på autosave
  382 |     await page.waitForTimeout(1000);
  383 | 
  384 |     // Oppfrisk side
  385 |     await page.reload();
  386 |     await page.waitForLoadState('networkidle');
  387 | 
  388 |     // Sjekk at verdien er restaurert frå localStorage
  389 |     const restoredValue = await nameInput.inputValue();
  390 |     expect(restoredValue).toBe('DraftTest123');
  391 |   });
  392 | 
  393 |   // -------------------------------------------------------------------------
  394 |   // Progress-bar oppdatering
  395 |   // -------------------------------------------------------------------------
  396 | 
  397 |   test('skal visa riktig progress-prosent', async ({ page }) => {
  398 |     await page.goto('/onboarding');
  399 | 
  400 |     // Steg 0: skal visa ~8% (1/13)
  401 |     const progressText = page.locator('[style*="color: rgba(255, 255, 255, 0.3)"]');
> 402 |     await expect(progressText).toBeVisible();
      |                                ^ Error: expect(locator).toBeVisible() failed
  403 |     
  404 |     // Søk etter "Du er X% ferdig" på norsk bokmål
  405 |     const firstP = page.locator('p').first();
  406 |     const pText = await firstP.textContent();
  407 |     expect(pText).toContain('%');
  408 |   });
  409 | 
  410 | });
```