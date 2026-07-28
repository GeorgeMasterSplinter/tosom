# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/onboarding.spec.ts >> Onboarding Flow (13-stegs) >> skal autosave inndata til localStorage
- Location: e2e/tests/onboarding.spec.ts:348:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "AutosaveTest"
Received: ""
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "ToSom" [ref=e4] [cursor=pointer]:
        - /url: /
      - button "Åpne meny" [ref=e5]
  - generic [ref=e8]:
    - generic [ref=e11]:
      - paragraph [ref=e13]: Fortsett i ditt eget tempo.
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]: Steg 1 av 13
          - heading "Grunnprofil" [level=1] [ref=e22]
          - paragraph [ref=e23]: La oss starte rolig. Vi vil gjerne bli litt kjent med deg — på en måte som føles trygg og ekte.
          - paragraph [ref=e24]: Dette er starten på reisen din. Vi holder det enkelt.
        - generic [ref=e26]:
          - generic [ref=e27]:
            - heading "IDENTITET OG SØK" [level=2] [ref=e29]
            - paragraph [ref=e30]: Dette hjelper oss å forstå hvem du er og hvem du ønsker å møte.
            - generic [ref=e31]:
              - generic [ref=e32]:
                - generic [ref=e33]: Hva vil du at vi skal kalle deg? *
                - paragraph [ref=e34]: Skriv f.eks. Kalla meg Sofia, Jonas eller Lia
                - textbox "Navn eller kallenavn" [ref=e35]
                - generic [ref=e36]: 0/50
              - generic [ref=e38]:
                - generic [ref=e39]: Alder *
                - paragraph [ref=e40]: Skriv alderen din (må være minst 23)
                - textbox "25" [ref=e41]
                - generic [ref=e42]: 0/3
              - generic [ref=e44]:
                - generic [ref=e45]: Ditt kjønn *
                - paragraph [ref=e46]: Velg det som passer best for deg
                - generic [ref=e47]:
                  - button "👨 Mann" [ref=e48]:
                    - generic [ref=e49]:
                      - text: 👨
                      - generic [ref=e50]: Mann
                  - button "👩 Kvinne" [ref=e51]:
                    - generic [ref=e52]:
                      - text: 👩
                      - generic [ref=e53]: Kvinne
                  - button "🏳️‍🌈 Ikke-binær" [ref=e54]:
                    - generic [ref=e55]:
                      - text: 🏳️‍🌈
                      - generic [ref=e56]: Ikke-binær
                  - button "🌊 Genderfluid" [ref=e57]:
                    - generic [ref=e58]:
                      - text: 🌊
                      - generic [ref=e59]: Genderfluid
                  - button "🤐 Jeg vil ikke si" [ref=e60]:
                    - generic [ref=e61]:
                      - text: 🤐
                      - generic [ref=e62]: Jeg vil ikke si
              - generic [ref=e63]:
                - generic [ref=e64]: Hvem søker du? *
                - paragraph [ref=e65]: Velg hvem du ønsker å møte
                - generic [ref=e66]:
                  - button "👨 Mann" [ref=e67]:
                    - generic [ref=e68]:
                      - text: 👨
                      - generic [ref=e69]: Mann
                  - button "👩 Kvinne" [ref=e70]:
                    - generic [ref=e71]:
                      - text: 👩
                      - generic [ref=e72]: Kvinne
                  - button "💫 Alle kjønn" [ref=e73]:
                    - generic [ref=e74]:
                      - text: 💫
                      - generic [ref=e75]: Alle kjønn
                  - button "💜 Kjemisk tiltrekning" [ref=e76]:
                    - generic [ref=e77]:
                      - text: 💜
                      - generic [ref=e78]: Kjemisk tiltrekning
          - generic [ref=e80]:
            - heading "BOSTED OG AVSTAND" [level=2] [ref=e82]
            - paragraph [ref=e83]: Vi bruker dette til å finne noen som faktisk passer deg.
            - generic [ref=e84]:
              - generic [ref=e85]:
                - generic [ref=e86]: Bosted *
                - paragraph [ref=e87]: Skriv f.eks. Asker, Bergen eller Stavanger
                - textbox "Hvor bor du?" [ref=e88]
                - generic [ref=e89]: 0/100
              - generic [ref=e91]:
                - generic [ref=e92]: Maks avstand *
                - generic [ref=e93]:
                  - slider [ref=e94] [cursor=pointer]: "50"
                  - generic [ref=e95]: 50 km
              - generic [ref=e96]:
                - generic [ref=e98]:
                  - generic [ref=e99]: Min alder *
                  - textbox "23" [ref=e100]
                  - generic [ref=e101]: 2/3
                - generic [ref=e104]:
                  - generic [ref=e105]: Maks alder *
                  - textbox "40" [ref=e106]
                  - generic [ref=e107]: 2/3
          - generic [ref=e110]:
            - heading "LIVSTIL" [level=2] [ref=e112]
            - paragraph [ref=e113]: Litt om deg og hvordan du lever livet. (Valgfritt)
            - generic [ref=e114]:
              - generic [ref=e115]:
                - generic [ref=e116]: Høyde (cm)
                - textbox "178" [ref=e117]
                - generic [ref=e118]: 0/3
              - generic [ref=e121]:
                - generic [ref=e122]: Kroppstype
                - paragraph [ref=e123]: Velg det som passer best for deg
                - generic [ref=e124]:
                  - button "🏃 Slank" [ref=e125]:
                    - generic [ref=e126]:
                      - text: 🏃
                      - generic [ref=e127]: Slank
                  - button "🧍 Gjennomsnittlig" [ref=e128]:
                    - generic [ref=e129]:
                      - text: 🧍
                      - generic [ref=e130]: Gjennomsnittlig
                  - button "💪 Atletisk" [ref=e131]:
                    - generic [ref=e132]:
                      - text: 💪
                      - generic [ref=e133]: Atletisk
                  - button "🦍 Kraftig" [ref=e134]:
                    - generic [ref=e135]:
                      - text: 🦍
                      - generic [ref=e136]: Kraftig
                  - button "🌸 Myk" [ref=e137]:
                    - generic [ref=e138]:
                      - text: 🌸
                      - generic [ref=e139]: Myk
              - generic [ref=e141]:
                - generic [ref=e142]: Din hverdag
                - paragraph [ref=e143]: Velg det som passer best for deg
                - generic [ref=e144]:
                  - button "🏔️ Aktiv" [ref=e145]:
                    - generic [ref=e146]:
                      - text: 🏔️
                      - generic [ref=e147]: Aktiv
                  - button "🌿 Rolig" [ref=e148]:
                    - generic [ref=e149]:
                      - text: 🌿
                      - generic [ref=e150]: Rolig
                  - button "⚖️ Balansert" [ref=e151]:
                    - generic [ref=e152]:
                      - text: ⚖️
                      - generic [ref=e153]: Balansert
                  - button "🧭 Eventyrlysten" [ref=e154]:
                    - generic [ref=e155]:
                      - text: 🧭
                      - generic [ref=e156]: Eventyrlysten
                  - button "🏠 Hjemmekjær" [ref=e157]:
                    - generic [ref=e158]:
                      - text: 🏠
                      - generic [ref=e159]: Hjemmekjær
              - generic [ref=e161]:
                - generic [ref=e162]: Røyking / snus
                - paragraph [ref=e163]: Velg det som passer best
                - generic [ref=e164]:
                  - button "🚭 Røyker/Snuser ikke" [ref=e165]:
                    - generic [ref=e166]:
                      - text: 🚭
                      - generic [ref=e167]: Røyker/Snuser ikke
                  - button "💨 Røyker av og til" [ref=e168]:
                    - generic [ref=e169]:
                      - text: 💨
                      - generic [ref=e170]: Røyker av og til
                  - button "🧢 Snuser" [ref=e171]:
                    - generic [ref=e172]:
                      - text: 🧢
                      - generic [ref=e173]: Snuser
                  - button "🚬 Røyker" [ref=e174]:
                    - generic [ref=e175]:
                      - text: 🚬
                      - generic [ref=e176]: Røyker
              - generic [ref=e178]:
                - generic [ref=e179]: Religion / livssyn
                - paragraph [ref=e180]: Velg det som passer best
                - generic [ref=e181]:
                  - button "✝️ Kristen" [ref=e182]:
                    - generic [ref=e183]:
                      - text: ✝️
                      - generic [ref=e184]: Kristen
                  - button "⛪ Katolsk" [ref=e185]:
                    - generic [ref=e186]:
                      - text: ⛪
                      - generic [ref=e187]: Katolsk
                  - button "🤔 Agnostiker" [ref=e188]:
                    - generic [ref=e189]:
                      - text: 🤔
                      - generic [ref=e190]: Agnostiker
                  - button "🔬 Ateist" [ref=e191]:
                    - generic [ref=e192]:
                      - text: 🔬
                      - generic [ref=e193]: Ateist
                  - button "☪️ Muslim" [ref=e194]:
                    - generic [ref=e195]:
                      - text: ☪️
                      - generic [ref=e196]: Muslim
                  - button "🔯 Jehovas vitne" [ref=e197]:
                    - generic [ref=e198]:
                      - text: 🔯
                      - generic [ref=e199]: Jehovas vitne
                  - button "🕉️ Hindu" [ref=e200]:
                    - generic [ref=e201]:
                      - text: 🕉️
                      - generic [ref=e202]: Hindu
                  - button "✡️ Jødedom" [ref=e203]:
                    - generic [ref=e204]:
                      - text: ✡️
                      - generic [ref=e205]: Jødedom
                  - button "☯️ Buddhist" [ref=e206]:
                    - generic [ref=e207]:
                      - text: ☯️
                      - generic [ref=e208]: Buddhist
                  - button "🌙 Spirituell" [ref=e209]:
                    - generic [ref=e210]:
                      - text: 🌙
                      - generic [ref=e211]: Spirituell
                  - button "✨ Annet" [ref=e212]:
                    - generic [ref=e213]:
                      - text: ✨
                      - generic [ref=e214]: Annet
              - generic [ref=e216]:
                - generic [ref=e217]: Barn?
                - generic [ref=e218]:
                  - button "👶 Har barn" [ref=e219]:
                    - generic [ref=e220]:
                      - text: 👶
                      - generic [ref=e221]: Har barn
                  - button "🧑 Har voksne barn" [ref=e222]:
                    - generic [ref=e223]:
                      - text: 🧑
                      - generic [ref=e224]: Har voksne barn
                  - button "🌱 Har ikke barn" [ref=e225]:
                    - generic [ref=e226]:
                      - text: 🌱
                      - generic [ref=e227]: Har ikke barn
              - generic [ref=e229]:
                - generic [ref=e230]: Ønsker du barn?
                - generic [ref=e231]:
                  - button "💚 Ja" [ref=e232]:
                    - generic [ref=e233]:
                      - text: 💚
                      - generic [ref=e234]: Ja
                  - button "🤷 Usikker" [ref=e235]:
                    - generic [ref=e236]:
                      - text: 🤷
                      - generic [ref=e237]: Usikker
                  - button "❌ Nei" [ref=e238]:
                    - generic [ref=e239]:
                      - text: ❌
                      - generic [ref=e240]: Nei
          - generic [ref=e241]:
            - button "Fyll ut alle påkrevde felt" [disabled] [ref=e243]
            - paragraph [ref=e244]: Svarene dine brukes kun til å bygge profilen din og finne en god match.
    - paragraph [ref=e246]: ToSom — der sanne møter skjer i ro og trygghet
  - button "Open Next.js Dev Tools" [ref=e252] [cursor=pointer]
  - alert [ref=e256]
```

# Test source

```ts
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
  289 |     await expect(nextBtn).toBeVisible();
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
> 366 |     expect(parsed.identityName).toBe('AutosaveTest');
      |                                 ^ Error: expect(received).toBe(expected) // Object.is equality
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
  402 |     await expect(progressText).toBeVisible();
  403 |     
  404 |     // Søk etter "Du er X% ferdig" på norsk bokmål
  405 |     const firstP = page.locator('p').first();
  406 |     const pText = await firstP.textContent();
  407 |     expect(pText).toContain('%');
  408 |   });
  409 | 
  410 | });
```