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
  - generic [ref=e3]:
    - generic [ref=e6]:
      - paragraph [ref=e8]: Fortsett i ditt eget tempo.
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]: Steg 1 av 13
          - heading "Grunnprofil" [level=1] [ref=e17]
          - paragraph [ref=e18]: La oss starte rolig. Vi vil gjerne bli litt kjent med deg — på en måte som føles trygg og ekte.
          - paragraph [ref=e19]: Dette er starten på reisen din. Vi holder det enkelt.
        - generic [ref=e21]:
          - generic [ref=e22]:
            - heading "IDENTITET OG SØK" [level=2] [ref=e24]
            - paragraph [ref=e25]: Dette hjelper oss å forstå hvem du er og hvem du ønsker å møte.
            - generic [ref=e26]:
              - generic [ref=e27]:
                - generic [ref=e28]: Hva vil du at vi skal kalle deg? *
                - paragraph [ref=e29]: Skriv f.eks. Kalla meg Sofia, Jonas eller Lia
                - textbox "Navn eller kallenavn" [ref=e30]
                - generic [ref=e31]: 0/50
              - generic [ref=e33]:
                - generic [ref=e34]: Alder *
                - paragraph [ref=e35]: Skriv alderen din (må være minst 23)
                - textbox "25" [ref=e36]
                - generic [ref=e37]: 0/3
              - generic [ref=e39]:
                - generic [ref=e40]: Ditt kjønn *
                - paragraph [ref=e41]: Velg det som passer best for deg
                - generic [ref=e42]:
                  - button "👨 Mann" [ref=e43]:
                    - generic [ref=e44]:
                      - text: 👨
                      - generic [ref=e45]: Mann
                  - button "👩 Kvinne" [ref=e46]:
                    - generic [ref=e47]:
                      - text: 👩
                      - generic [ref=e48]: Kvinne
                  - button "🏳️‍🌈 Ikke-binær" [ref=e49]:
                    - generic [ref=e50]:
                      - text: 🏳️‍🌈
                      - generic [ref=e51]: Ikke-binær
                  - button "🌊 Genderfluid" [ref=e52]:
                    - generic [ref=e53]:
                      - text: 🌊
                      - generic [ref=e54]: Genderfluid
              - generic [ref=e55]:
                - generic [ref=e56]: Hvem søker du? *
                - paragraph [ref=e57]: Velg hvem du ønsker å møte
                - generic [ref=e58]:
                  - button "👨 Mann" [ref=e59]:
                    - generic [ref=e60]:
                      - text: 👨
                      - generic [ref=e61]: Mann
                  - button "👩 Kvinne" [ref=e62]:
                    - generic [ref=e63]:
                      - text: 👩
                      - generic [ref=e64]: Kvinne
                  - button "💫 Alle kjønn" [ref=e65]:
                    - generic [ref=e66]:
                      - text: 💫
                      - generic [ref=e67]: Alle kjønn
                  - button "💜 Kjemisk tiltrekning" [ref=e68]:
                    - generic [ref=e69]:
                      - text: 💜
                      - generic [ref=e70]: Kjemisk tiltrekning
          - generic [ref=e72]:
            - heading "BOSTED OG AVSTAND" [level=2] [ref=e74]
            - paragraph [ref=e75]: Vi bruker dette til å finne noen som faktisk passer deg.
            - generic [ref=e76]:
              - generic [ref=e77]:
                - generic [ref=e78]: Bosted *
                - paragraph [ref=e79]: Skriv f.eks. Asker, Bergen eller Stavanger
                - textbox "Hvor bor du?" [ref=e80]
                - generic [ref=e81]: 0/100
              - generic [ref=e83]:
                - generic [ref=e84]: Maks avstand *
                - generic [ref=e85]:
                  - slider [ref=e86] [cursor=pointer]: "50"
                  - generic [ref=e87]: 50 km
              - generic [ref=e88]:
                - generic [ref=e90]:
                  - generic [ref=e91]: Min alder *
                  - textbox "23" [ref=e92]
                  - generic [ref=e93]: 2/3
                - generic [ref=e96]:
                  - generic [ref=e97]: Maks alder *
                  - textbox "40" [ref=e98]
                  - generic [ref=e99]: 2/3
          - generic [ref=e102]:
            - heading "LIVSTIL" [level=2] [ref=e104]
            - paragraph [ref=e105]: Litt om deg og hvordan du lever livet. (Valgfritt)
            - generic [ref=e106]:
              - generic [ref=e107]:
                - generic [ref=e108]: Høyde (cm)
                - textbox "178" [ref=e109]
                - generic [ref=e110]: 0/3
              - generic [ref=e113]:
                - generic [ref=e114]: Kroppstype
                - paragraph [ref=e115]: Velg det som passer best for deg
                - generic [ref=e116]:
                  - button "🏃 Slank" [ref=e117]:
                    - generic [ref=e118]:
                      - text: 🏃
                      - generic [ref=e119]: Slank
                  - button "🧍 Gjennomsnittlig" [ref=e120]:
                    - generic [ref=e121]:
                      - text: 🧍
                      - generic [ref=e122]: Gjennomsnittlig
                  - button "💪 Atletisk" [ref=e123]:
                    - generic [ref=e124]:
                      - text: 💪
                      - generic [ref=e125]: Atletisk
                  - button "🦍 Kraftig" [ref=e126]:
                    - generic [ref=e127]:
                      - text: 🦍
                      - generic [ref=e128]: Kraftig
                  - button "🌸 Myk" [ref=e129]:
                    - generic [ref=e130]:
                      - text: 🌸
                      - generic [ref=e131]: Myk
              - generic [ref=e133]:
                - generic [ref=e134]: Din hverdag
                - paragraph [ref=e135]: Velg det som passer best for deg
                - generic [ref=e136]:
                  - button "🏔️ Aktiv" [ref=e137]:
                    - generic [ref=e138]:
                      - text: 🏔️
                      - generic [ref=e139]: Aktiv
                  - button "🌿 Rolig" [ref=e140]:
                    - generic [ref=e141]:
                      - text: 🌿
                      - generic [ref=e142]: Rolig
                  - button "⚖️ Balansert" [ref=e143]:
                    - generic [ref=e144]:
                      - text: ⚖️
                      - generic [ref=e145]: Balansert
                  - button "🧭 Eventyrlysten" [ref=e146]:
                    - generic [ref=e147]:
                      - text: 🧭
                      - generic [ref=e148]: Eventyrlysten
                  - button "🏠 Hjemmekjær" [ref=e149]:
                    - generic [ref=e150]:
                      - text: 🏠
                      - generic [ref=e151]: Hjemmekjær
              - generic [ref=e153]:
                - generic [ref=e154]: Røyking / snus
                - paragraph [ref=e155]: Velg det som passer best
                - generic [ref=e156]:
                  - button "🚭 Røyker/Snuser ikke" [ref=e157]:
                    - generic [ref=e158]:
                      - text: 🚭
                      - generic [ref=e159]: Røyker/Snuser ikke
                  - button "💨 Røyker av og til" [ref=e160]:
                    - generic [ref=e161]:
                      - text: 💨
                      - generic [ref=e162]: Røyker av og til
                  - button "🧢 Snuser" [ref=e163]:
                    - generic [ref=e164]:
                      - text: 🧢
                      - generic [ref=e165]: Snuser
                  - button "🚬 Røyker" [ref=e166]:
                    - generic [ref=e167]:
                      - text: 🚬
                      - generic [ref=e168]: Røyker
              - generic [ref=e170]:
                - generic [ref=e171]: Religion / livssyn
                - paragraph [ref=e172]: Velg det som passer best
                - generic [ref=e173]:
                  - button "✝️ Kristen" [ref=e174]:
                    - generic [ref=e175]:
                      - text: ✝️
                      - generic [ref=e176]: Kristen
                  - button "⛪ Katolsk" [ref=e177]:
                    - generic [ref=e178]:
                      - text: ⛪
                      - generic [ref=e179]: Katolsk
                  - button "🤔 Agnostiker" [ref=e180]:
                    - generic [ref=e181]:
                      - text: 🤔
                      - generic [ref=e182]: Agnostiker
                  - button "🔬 Ateist" [ref=e183]:
                    - generic [ref=e184]:
                      - text: 🔬
                      - generic [ref=e185]: Ateist
                  - button "☪️ Muslim" [ref=e186]:
                    - generic [ref=e187]:
                      - text: ☪️
                      - generic [ref=e188]: Muslim
                  - button "🔯 Jehovas vitne" [ref=e189]:
                    - generic [ref=e190]:
                      - text: 🔯
                      - generic [ref=e191]: Jehovas vitne
                  - button "🕉️ Hindu" [ref=e192]:
                    - generic [ref=e193]:
                      - text: 🕉️
                      - generic [ref=e194]: Hindu
                  - button "✡️ Jødedom" [ref=e195]:
                    - generic [ref=e196]:
                      - text: ✡️
                      - generic [ref=e197]: Jødedom
                  - button "☯️ Buddhist" [ref=e198]:
                    - generic [ref=e199]:
                      - text: ☯️
                      - generic [ref=e200]: Buddhist
                  - button "🌙 Spirituell" [ref=e201]:
                    - generic [ref=e202]:
                      - text: 🌙
                      - generic [ref=e203]: Spirituell
                  - button "✨ Annet" [ref=e204]:
                    - generic [ref=e205]:
                      - text: ✨
                      - generic [ref=e206]: Annet
              - generic [ref=e208]:
                - generic [ref=e209]: Barn?
                - generic [ref=e210]:
                  - button "👶 Har barn" [ref=e211]:
                    - generic [ref=e212]:
                      - text: 👶
                      - generic [ref=e213]: Har barn
                  - button "🧑 Har voksne barn" [ref=e214]:
                    - generic [ref=e215]:
                      - text: 🧑
                      - generic [ref=e216]: Har voksne barn
                  - button "🌱 Har ikke barn" [ref=e217]:
                    - generic [ref=e218]:
                      - text: 🌱
                      - generic [ref=e219]: Har ikke barn
              - generic [ref=e221]:
                - generic [ref=e222]: Ønsker du barn?
                - generic [ref=e223]:
                  - button "💚 Ja" [ref=e224]:
                    - generic [ref=e225]:
                      - text: 💚
                      - generic [ref=e226]: Ja
                  - button "🤷 Usikker" [ref=e227]:
                    - generic [ref=e228]:
                      - text: 🤷
                      - generic [ref=e229]: Usikker
                  - button "❌ Nei" [ref=e230]:
                    - generic [ref=e231]:
                      - text: ❌
                      - generic [ref=e232]: Nei
          - generic [ref=e233]:
            - button "Fyll ut alle påkrevde felt" [disabled] [ref=e235]
            - paragraph [ref=e236]: Svarene dine brukes kun til å bygge profilen din og finne en god match.
    - paragraph [ref=e238]: ToSom — der sanne møter skjer i ro og trygghet
  - button "Open Next.js Dev Tools" [ref=e244] [cursor=pointer]
  - alert [ref=e248]
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