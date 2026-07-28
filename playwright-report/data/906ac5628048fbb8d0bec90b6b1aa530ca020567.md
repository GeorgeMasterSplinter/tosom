# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/onboarding.spec.ts >> Onboarding Flow (13-stegs) >> skal kunna fullføre heile 13-stegs onboarding-flyten
- Location: e2e/tests/onboarding.spec.ts:246:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /fortset/i })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('button', { name: /fortset/i })

```

```yaml
- banner:
  - link "ToSom":
    - /url: /
  - button "Åpne meny":
    - img
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
- button "🤐 Jeg vil ikke si"
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
  189 |     // Skall no vere på steg 2 (Livssituasjon)
  190 |     await expect(page.locator('[name="workType"]')).toBeVisible({ timeout: 3000 });
  191 | 
  192 |     // Fyll inn responsibilities (≥10 teikn for validering)
  193 |     const resp = page.locator('textarea[name="responsibilities"]');
  194 |     if (await resp.count() > 0) {
  195 |       await resp.fill('Jeg har to barn som bor hos meg helga og hverda.');
  196 |       await expect(resp).toHaveValue('Jeg har to barn som bor hos meg helga og hverda.');
  197 |     }
  198 | 
  199 |     // Klikk "Fortsett"
  200 |     nextBtn = page.getByRole('button', { name: /fortset/i });
  201 |     await nextBtn.click();
  202 | 
  203 |     // Skall flytta til steg 3 (Tilknytning)
  204 |     await expect(page.locator('[name="safetyNeed"]')).toBeVisible({ timeout: 3000 });
  205 |   });
  206 | 
  207 |   // -------------------------------------------------------------------------
  208 |   // Back-navigasjon
  209 |   // -------------------------------------------------------------------------
  210 | 
  211 |   test('skal kunna tilbake med BackButton på steg 1', async ({ page }) => {
  212 |     await page.goto('/onboarding');
  213 | 
  214 |     // Gå til steg 1 (Personlighet)
  215 |     let nextBtn = page.getByRole('button', { name: /fortset/i });
  216 |     await expect(nextBtn).toBeVisible();
  217 |     await nextBtn.first().click();
  218 | 
  219 |     await expect(page.locator('[name="selfDesc"]')).toBeVisible({ timeout: 3000 });
  220 | 
  221 |     // Fyll selfDesc (for å unngå validering)
  222 |     const selfDesc = page.locator('textarea[name="selfDesc"]');
  223 |     if (await selfDesc.count() > 0) {
  224 |       await selfDesc.fill('Jeg er en rolig person som liker gode samtaler.');
  225 |     }
  226 | 
  227 |     // Gå vidare til steg 2 og tilbake
  228 |     nextBtn = page.getByRole('button', { name: /fortset/i });
  229 |     await nextBtn.click();
  230 | 
  231 |     await expect(page.locator('[name="workType"]')).toBeVisible({ timeout: 3000 });
  232 | 
  233 |     // Klikk BackButton
  234 |     const backBtn = page.getByRole('button', { name: /tilbake/i });
  235 |     await expect(backBtn).toBeVisible();
  236 |     await backBtn.click();
  237 | 
  238 |     // Skall tilbake til steg 1
  239 |     await expect(page.locator('[name="selfDesc"]')).toBeVisible({ timeout: 3000 });
  240 |   });
  241 | 
  242 |   // -------------------------------------------------------------------------
  243 |   // Steg 3-12: Gjennomfør heile flyten (komplett flow)
  244 |   // -------------------------------------------------------------------------
  245 | 
  246 |   test('skal kunna fullføre heile 13-stegs onboarding-flyten', async ({ page }) => {
  247 |     await page.goto('/onboarding');
  248 | 
  249 |     const testData = {
  250 |       // Steg 0: Grunnprofil
  251 |       name: 'Testbruker',
  252 |       age: '30',
  253 |       gender: 'mann',
  254 |       seeking: 'kvinne',
  255 |       
  256 |       // Steg 1: Personlighet
  257 |       selfDesc: 'Jeg er en rolig og balansert person som verdsetter dype samtaler og ærlighet.',
  258 |       energyGiver: 'Gode konversationer, natur, kreativt arbeid.',
  259 |       energyDrainer: 'Store folkemengder, konflikt, uvissighet.',
  260 |       
  261 |       // Steg 2: Livssituasjon
  262 |       responsibilities: 'Jeg har to barn som bor hos meg helga og hverda.',
  263 |     };
  264 | 
  265 |     // === STEG 0: Grunnprofil ===
  266 |     await page.goto('/onboarding');
  267 | 
  268 |     const nameInput = page.locator('input[name="identityName"]');
  269 |     if (await nameInput.count() > 0) {
  270 |       await nameInput.fill(testData.name);
  271 |     }
  272 | 
  273 |     const ageInput = page.locator('input[name="age"]');
  274 |     if (await ageInput.count() > 0) {
  275 |       await ageInput.fill(testData.age);
  276 |     }
  277 | 
  278 |     const genderSelect = page.locator('select[name="gender"]');
  279 |     if (await genderSelect.count() > 0) {
  280 |       await genderSelect.selectOption(testData.gender);
  281 |     }
  282 | 
  283 |     const seekingSelect = page.locator('select[name="seekingGender"]');
  284 |     if (await seekingSelect.count() > 0) {
  285 |       await seekingSelect.selectOption(testData.seeking);
  286 |     }
  287 | 
  288 |     let nextBtn = page.getByRole('button', { name: /fortset/i });
> 289 |     await expect(nextBtn).toBeVisible();
      |                           ^ Error: expect(locator).toBeVisible() failed
  290 |     await nextBtn.click();
  291 | 
  292 |     // === STEG 1: Personlighet & identitet ===
  293 |     await expect(page.locator('[name="selfDesc"]')).toBeVisible({ timeout: 3000 });
  294 | 
  295 |     const selfDesc = page.locator('textarea[name="selfDesc"]');
  296 |     if (await selfDesc.count() > 0) {
  297 |       await selfDesc.fill(testData.selfDesc);
  298 |     }
  299 | 
  300 |     const energyGiver = page.locator('textarea[name="energyGiver"]');
  301 |     if (await energyGiver.count() > 0) {
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
```