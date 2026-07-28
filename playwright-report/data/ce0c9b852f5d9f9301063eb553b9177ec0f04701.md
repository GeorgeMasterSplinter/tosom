# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/onboarding.spec.ts >> Onboarding Flow (13-stegs) >> skal kunna gå vidare frå steg 1 med gyldig selfDesc
- Location: e2e/tests/onboarding.spec.ts:145:7

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
  50  | 
  51  | test.describe('Onboarding Flow (13-stegs)', () => {
  52  | 
  53  |   // -------------------------------------------------------------------------
  54  |   // Steg 0: Visning av onboarding
  55  |   // -------------------------------------------------------------------------
  56  |   
  57  |   test('skal vise onboarding med progressbar og steg-tittel', async ({ page }) => {
  58  |     await page.goto('/onboarding');
  59  |     
  60  |     // Progress-bar skal vere synleg
  61  |     const progressBar = page.locator('.rounded-full.overflow-hidden');
  62  |     await expect(progressBar).toBeVisible();
  63  |     
  64  |     // Steg-tittel (h1) skal vere synleg
  65  |     const title = page.locator('h1').first();
  66  |     await expect(title).toBeVisible();
  67  |     
  68  |     // Undertydning skal vere synleg
  69  |     const subtitle = page.locator('[style*="color: rgba(212, 175, 55)"]').first();
  70  |     await expect(subtitle).toBeVisible();
  71  |   });
  72  | 
  73  |   // -------------------------------------------------------------------------
  74  |   // Steg 0 (første steg): Grunnprofil
  75  |   // -------------------------------------------------------------------------
  76  | 
  77  |   test('skal kunna fylle ut grunnprofil og gå vidare', async ({ page }) => {
  78  |     await page.goto('/onboarding');
  79  | 
  80  |     // === Fyll inn navn ===
  81  |     const nameInput = page.locator('input[name="identityName"]');
  82  |     if (await nameInput.count() > 0) {
  83  |       await nameInput.fill('Testbruker');
  84  |       await expect(nameInput).toHaveValue('Testbruker');
  85  |     }
  86  | 
  87  |     // === Fyll inn alder ===
  88  |     const ageInput = page.locator('input[name="age"]');
  89  |     if (await ageInput.count() > 0) {
  90  |       await ageInput.fill('30');
  91  |       await expect(ageInput).toHaveValue('30');
  92  |     }
  93  | 
  94  |     // === Vel kjønn ===
  95  |     const genderSelect = page.locator('select[name="gender"]');
  96  |     if (await genderSelect.count() > 0) {
  97  |       await genderSelect.selectOption('mann');
  98  |       await expect(genderSelect).toHaveValue('mann');
  99  |     }
  100 | 
  101 |     // === Vel søkjer ===
  102 |     const seekingSelect = page.locator('select[name="seekingGender"]');
  103 |     if (await seekingSelect.count() > 0) {
  104 |       await seekingSelect.selectOption('kvinne');
  105 |       await expect(seekingSelect).toHaveValue('kvinne');
  106 |     }
  107 | 
  108 |     // === Klikk "Fortsett" PremiumButton ===
  109 |     const nextBtn = page.getByRole('button', { name: /fortset/i });
  110 |     await expect(nextBtn).toBeVisible();
  111 |     await nextBtn.first().click();
  112 | 
  113 |     // Skal flytte til neste steg (Steg 1: Personlighet)
  114 |     await expect(page.locator('[name="selfDesc"]')).toBeVisible({ timeout: 3000 });
  115 |   });
  116 | 
  117 |   // -------------------------------------------------------------------------
  118 |   // Steg 1: Personlighet & identitet — med validering
  119 |   // -------------------------------------------------------------------------
  120 | 
  121 |   test('skal visa feilmelding ved tom selfDesc', async ({ page }) => {
  122 |     await page.goto('/onboarding');
  123 | 
  124 |     // Gå til steg 1 (Personlighet)
  125 |     const nextBtn = page.getByRole('button', { name: /fortset/i });
  126 |     await expect(nextBtn).toBeVisible();
  127 |     await nextBtn.first().click();
  128 | 
  129 |     // Vent på steg 1
  130 |     await expect(page.locator('[name="selfDesc"]')).toBeVisible({ timeout: 3000 });
  131 | 
  132 |     // Klikk "Fortsett" utan å fylla ut selfDesc (skal visa valideringsfeil)
  133 |     const submitBtn = page.getByRole('button', { name: /fortset/i });
  134 |     await submitBtn.click();
  135 | 
  136 |     // Skal visa error-message
  137 |     const errorMsg = page.locator('[style*="rgba(255, 77, 77)"]');
  138 |     await expect(errorMsg).toBeVisible({ timeout: 3000 });
  139 | 
  140 |     // Søk etter feilmeldingstekst på norsk bokmål
  141 |     const textContent = await errorMsg.textContent();
  142 |     expect(textContent).toContain('minst 10 tegn');
  143 |   });
  144 | 
  145 |   test('skal kunna gå vidare frå steg 1 med gyldig selfDesc', async ({ page }) => {
  146 |     await page.goto('/onboarding');
  147 | 
  148 |     // Gå til steg 1 (Personlighet)
  149 |     const nextBtn = page.getByRole('button', { name: /fortset/i });
> 150 |     await expect(nextBtn).toBeVisible();
      |                           ^ Error: expect(locator).toBeVisible() failed
  151 |     await nextBtn.first().click();
  152 | 
  153 |     // Vent på steg 1
  154 |     await expect(page.locator('[name="selfDesc"]')).toBeVisible({ timeout: 3000 });
  155 | 
  156 |     // Fyll inn selfDesc med gyldig verdi (≥10 teikn)
  157 |     const selfDesc = page.locator('textarea[name="selfDesc"]');
  158 |     await selfDesc.fill('Jeg er en rolig person som liker gode samtaler.');
  159 |     await expect(selfDesc).toHaveValue('Jeg er en rolig person som liker gode samtaler.');
  160 | 
  161 |     // Klikk "Fortsett"
  162 |     const submitBtn = page.getByRole('button', { name: /fortset/i });
  163 |     await submitBtn.click();
  164 | 
  165 |     // Skal flytte til steg 2 (Livssituasjon)
  166 |     await expect(page.locator('[name="workType"]')).toBeVisible({ timeout: 3000 });
  167 |   });
  168 | 
  169 |   // -------------------------------------------------------------------------
  170 |   // Steg 2: Livssituasjon — med validering
  171 |   // -------------------------------------------------------------------------
  172 | 
  173 |   test('skal kunna gå vidare frå steg 2 med gyldig responsibilities', async ({ page }) => {
  174 |     await page.goto('/onboarding');
  175 | 
  176 |     // Gå til steg 1 → steg 2
  177 |     let nextBtn = page.getByRole('button', { name: /fortset/i });
  178 |     await expect(nextBtn).toBeVisible();
  179 |     await nextBtn.first().click();
  180 | 
  181 |     // Stig 1 → fyll selfDesc (validering)
  182 |     const selfDesc = page.locator('textarea[name="selfDesc"]');
  183 |     if (await selfDesc.count() > 0) {
  184 |       await selfDesc.fill('Jeg er en rolig person som liker gode samtaler.');
  185 |       nextBtn = page.getByRole('button', { name: /fortset/i });
  186 |       await nextBtn.click();
  187 |     }
  188 | 
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
```