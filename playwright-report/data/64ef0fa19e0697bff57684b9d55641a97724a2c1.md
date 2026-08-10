# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/onboarding.spec.ts >> Onboarding Flow (13-stegs) >> skal restaurera draft etter side-opprettning
- Location: e2e/tests/onboarding.spec.ts:373:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.inputValue: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[name="identityName"]')

```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - generic [ref=f1e3]:
    - generic [ref=f1e6]:
      - paragraph [ref=f1e8]: Fortsett i ditt eget tempo.
      - generic [ref=f1e13]:
        - generic [ref=f1e14]:
          - generic [ref=f1e15]: Steg 1 av 13
          - heading "Grunnprofil" [level=1] [ref=f1e17]
          - paragraph [ref=f1e18]: La oss starte rolig. Vi vil gjerne bli litt kjent med deg — på en måte som føles trygg og ekte.
          - paragraph [ref=f1e19]: Dette er starten på reisen din. Vi holder det enkelt.
        - generic [ref=f1e21]:
          - generic [ref=f1e22]:
            - heading "IDENTITET OG SØK" [level=2] [ref=f1e24]
            - paragraph [ref=f1e25]: Dette hjelper oss å forstå hvem du er og hvem du ønsker å møte.
            - generic [ref=f1e26]:
              - generic [ref=f1e27]:
                - generic [ref=f1e28]: Hva vil du at vi skal kalle deg? *
                - paragraph [ref=f1e29]: Skriv f.eks. Kalla meg Sofia, Jonas eller Lia
                - textbox "Navn eller kallenavn" [ref=f1e30]
                - generic [ref=f1e31]: 0/50
              - generic [ref=f1e33]:
                - generic [ref=f1e34]: Alder *
                - paragraph [ref=f1e35]: Skriv alderen din (må være minst 23)
                - textbox "25" [ref=f1e36]
                - generic [ref=f1e37]: 0/3
              - generic [ref=f1e39]:
                - generic [ref=f1e40]: Ditt kjønn *
                - paragraph [ref=f1e41]: Velg det som passer best for deg
                - generic [ref=f1e42]:
                  - button "👨 Mann" [ref=f1e43]:
                    - generic [ref=f1e44]:
                      - text: 👨
                      - generic [ref=f1e45]: Mann
                  - button "👩 Kvinne" [ref=f1e46]:
                    - generic [ref=f1e47]:
                      - text: 👩
                      - generic [ref=f1e48]: Kvinne
                  - button "🏳️‍🌈 Ikke-binær" [ref=f1e49]:
                    - generic [ref=f1e50]:
                      - text: 🏳️‍🌈
                      - generic [ref=f1e51]: Ikke-binær
                  - button "🌊 Genderfluid" [ref=f1e52]:
                    - generic [ref=f1e53]:
                      - text: 🌊
                      - generic [ref=f1e54]: Genderfluid
              - generic [ref=f1e55]:
                - generic [ref=f1e56]: Hvem søker du? *
                - paragraph [ref=f1e57]: Velg hvem du ønsker å møte
                - generic [ref=f1e58]:
                  - button "👨 Mann" [ref=f1e59]:
                    - generic [ref=f1e60]:
                      - text: 👨
                      - generic [ref=f1e61]: Mann
                  - button "👩 Kvinne" [ref=f1e62]:
                    - generic [ref=f1e63]:
                      - text: 👩
                      - generic [ref=f1e64]: Kvinne
                  - button "💫 Alle kjønn" [ref=f1e65]:
                    - generic [ref=f1e66]:
                      - text: 💫
                      - generic [ref=f1e67]: Alle kjønn
                  - button "💜 Kjemisk tiltrekning" [ref=f1e68]:
                    - generic [ref=f1e69]:
                      - text: 💜
                      - generic [ref=f1e70]: Kjemisk tiltrekning
          - generic [ref=f1e72]:
            - heading "BOSTED OG AVSTAND" [level=2] [ref=f1e74]
            - paragraph [ref=f1e75]: Vi bruker dette til å finne noen som faktisk passer deg.
            - generic [ref=f1e76]:
              - generic [ref=f1e77]:
                - generic [ref=f1e78]: Bosted *
                - paragraph [ref=f1e79]: Skriv f.eks. Asker, Bergen eller Stavanger
                - textbox "Hvor bor du?" [ref=f1e80]
                - generic [ref=f1e81]: 0/100
              - generic [ref=f1e83]:
                - generic [ref=f1e84]: Maks avstand *
                - generic [ref=f1e85]:
                  - slider [ref=f1e86] [cursor=pointer]: "50"
                  - generic [ref=f1e87]: 50 km
              - generic [ref=f1e88]:
                - generic [ref=f1e90]:
                  - generic [ref=f1e91]: Min alder *
                  - textbox "23" [ref=f1e92]
                  - generic [ref=f1e93]: 2/3
                - generic [ref=f1e96]:
                  - generic [ref=f1e97]: Maks alder *
                  - textbox "40" [ref=f1e98]
                  - generic [ref=f1e99]: 2/3
          - generic [ref=f1e102]:
            - heading "LIVSTIL" [level=2] [ref=f1e104]
            - paragraph [ref=f1e105]: Litt om deg og hvordan du lever livet. (Valgfritt)
            - generic [ref=f1e106]:
              - generic [ref=f1e107]:
                - generic [ref=f1e108]: Høyde (cm)
                - textbox "178" [ref=f1e109]
                - generic [ref=f1e110]: 0/3
              - generic [ref=f1e113]:
                - generic [ref=f1e114]: Kroppstype
                - paragraph [ref=f1e115]: Velg det som passer best for deg
                - generic [ref=f1e116]:
                  - button "🏃 Slank" [ref=f1e117]:
                    - generic [ref=f1e118]:
                      - text: 🏃
                      - generic [ref=f1e119]: Slank
                  - button "🧍 Gjennomsnittlig" [ref=f1e120]:
                    - generic [ref=f1e121]:
                      - text: 🧍
                      - generic [ref=f1e122]: Gjennomsnittlig
                  - button "💪 Atletisk" [ref=f1e123]:
                    - generic [ref=f1e124]:
                      - text: 💪
                      - generic [ref=f1e125]: Atletisk
                  - button "🦍 Kraftig" [ref=f1e126]:
                    - generic [ref=f1e127]:
                      - text: 🦍
                      - generic [ref=f1e128]: Kraftig
                  - button "🌸 Myk" [ref=f1e129]:
                    - generic [ref=f1e130]:
                      - text: 🌸
                      - generic [ref=f1e131]: Myk
              - generic [ref=f1e133]:
                - generic [ref=f1e134]: Din hverdag
                - paragraph [ref=f1e135]: Velg det som passer best for deg
                - generic [ref=f1e136]:
                  - button "🏔️ Aktiv" [ref=f1e137]:
                    - generic [ref=f1e138]:
                      - text: 🏔️
                      - generic [ref=f1e139]: Aktiv
                  - button "🌿 Rolig" [ref=f1e140]:
                    - generic [ref=f1e141]:
                      - text: 🌿
                      - generic [ref=f1e142]: Rolig
                  - button "⚖️ Balansert" [ref=f1e143]:
                    - generic [ref=f1e144]:
                      - text: ⚖️
                      - generic [ref=f1e145]: Balansert
                  - button "🧭 Eventyrlysten" [ref=f1e146]:
                    - generic [ref=f1e147]:
                      - text: 🧭
                      - generic [ref=f1e148]: Eventyrlysten
                  - button "🏠 Hjemmekjær" [ref=f1e149]:
                    - generic [ref=f1e150]:
                      - text: 🏠
                      - generic [ref=f1e151]: Hjemmekjær
              - generic [ref=f1e153]:
                - generic [ref=f1e154]: Røyking / snus
                - paragraph [ref=f1e155]: Velg det som passer best
                - generic [ref=f1e156]:
                  - button "🚭 Røyker/Snuser ikke" [ref=f1e157]:
                    - generic [ref=f1e158]:
                      - text: 🚭
                      - generic [ref=f1e159]: Røyker/Snuser ikke
                  - button "💨 Røyker av og til" [ref=f1e160]:
                    - generic [ref=f1e161]:
                      - text: 💨
                      - generic [ref=f1e162]: Røyker av og til
                  - button "🧢 Snuser" [ref=f1e163]:
                    - generic [ref=f1e164]:
                      - text: 🧢
                      - generic [ref=f1e165]: Snuser
                  - button "🚬 Røyker" [ref=f1e166]:
                    - generic [ref=f1e167]:
                      - text: 🚬
                      - generic [ref=f1e168]: Røyker
              - generic [ref=f1e170]:
                - generic [ref=f1e171]: Religion / livssyn
                - paragraph [ref=f1e172]: Velg det som passer best
                - generic [ref=f1e173]:
                  - button "✝️ Kristen" [ref=f1e174]:
                    - generic [ref=f1e175]:
                      - text: ✝️
                      - generic [ref=f1e176]: Kristen
                  - button "⛪ Katolsk" [ref=f1e177]:
                    - generic [ref=f1e178]:
                      - text: ⛪
                      - generic [ref=f1e179]: Katolsk
                  - button "🤔 Agnostiker" [ref=f1e180]:
                    - generic [ref=f1e181]:
                      - text: 🤔
                      - generic [ref=f1e182]: Agnostiker
                  - button "🔬 Ateist" [ref=f1e183]:
                    - generic [ref=f1e184]:
                      - text: 🔬
                      - generic [ref=f1e185]: Ateist
                  - button "☪️ Muslim" [ref=f1e186]:
                    - generic [ref=f1e187]:
                      - text: ☪️
                      - generic [ref=f1e188]: Muslim
                  - button "🔯 Jehovas vitne" [ref=f1e189]:
                    - generic [ref=f1e190]:
                      - text: 🔯
                      - generic [ref=f1e191]: Jehovas vitne
                  - button "🕉️ Hindu" [ref=f1e192]:
                    - generic [ref=f1e193]:
                      - text: 🕉️
                      - generic [ref=f1e194]: Hindu
                  - button "✡️ Jødedom" [ref=f1e195]:
                    - generic [ref=f1e196]:
                      - text: ✡️
                      - generic [ref=f1e197]: Jødedom
                  - button "☯️ Buddhist" [ref=f1e198]:
                    - generic [ref=f1e199]:
                      - text: ☯️
                      - generic [ref=f1e200]: Buddhist
                  - button "🌙 Spirituell" [ref=f1e201]:
                    - generic [ref=f1e202]:
                      - text: 🌙
                      - generic [ref=f1e203]: Spirituell
                  - button "✨ Annet" [ref=f1e204]:
                    - generic [ref=f1e205]:
                      - text: ✨
                      - generic [ref=f1e206]: Annet
              - generic [ref=f1e208]:
                - generic [ref=f1e209]: Barn?
                - generic [ref=f1e210]:
                  - button "👶 Har barn" [ref=f1e211]:
                    - generic [ref=f1e212]:
                      - text: 👶
                      - generic [ref=f1e213]: Har barn
                  - button "🧑 Har voksne barn" [ref=f1e214]:
                    - generic [ref=f1e215]:
                      - text: 🧑
                      - generic [ref=f1e216]: Har voksne barn
                  - button "🌱 Har ikke barn" [ref=f1e217]:
                    - generic [ref=f1e218]:
                      - text: 🌱
                      - generic [ref=f1e219]: Har ikke barn
              - generic [ref=f1e221]:
                - generic [ref=f1e222]: Ønsker du barn?
                - generic [ref=f1e223]:
                  - button "💚 Ja" [ref=f1e224]:
                    - generic [ref=f1e225]:
                      - text: 💚
                      - generic [ref=f1e226]: Ja
                  - button "🤷 Usikker" [ref=f1e227]:
                    - generic [ref=f1e228]:
                      - text: 🤷
                      - generic [ref=f1e229]: Usikker
                  - button "❌ Nei" [ref=f1e230]:
                    - generic [ref=f1e231]:
                      - text: ❌
                      - generic [ref=f1e232]: Nei
          - generic [ref=f1e233]:
            - button "Fyll ut alle påkrevde felt" [disabled] [ref=f1e235]
            - paragraph [ref=f1e236]: Svarene dine brukes kun til å bygge profilen din og finne en god match.
    - paragraph [ref=f1e238]: ToSom — der sanne møter skjer i ro og trygghet
  - button "Open Next.js Dev Tools" [ref=f1e244] [cursor=pointer]
  - alert [ref=f1e248]
```

# Test source

```ts
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
> 389 |     const restoredValue = await nameInput.inputValue();
      |                                           ^ Error: locator.inputValue: Test timeout of 60000ms exceeded.
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