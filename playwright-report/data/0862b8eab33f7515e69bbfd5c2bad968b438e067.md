# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/onboarding.spec.ts >> Onboarding Flow (13-stegs) >> skal vise onboarding med progressbar og steg-tittel
- Location: e2e/tests/onboarding.spec.ts:57:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.rounded-full.overflow-hidden')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.rounded-full.overflow-hidden')

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
  1   | /**
  2   |  * E2E-test — Onboarding-flow (13-stegs versjon)
  3   |  * Testar at ein ny brukar kan fullføre heile onboarding-flyten utan feil.
  4   |  */
  5   | 
  6   | import { test, expect } from '@playwright/test';
  7   | 
  8   | const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  9   | 
  10  | // =====================================================================
  11  | // Hjelpemethodar
  12  | // =====================================================================
  13  | 
  14  | /** Skriv verdi inn i eit TextAreaField med korrekt markering og focusing */
  15  | async function fillTextArea(page: Parameters<typeof page.locator>[0], label: string, value: string) {
  16  |   // Finn textarea med den gitte label-en (tekst over feltet)
  17  |   const textareas = page.locator('textarea');
  18  |   const labels = page.locator('label');
  19  |   
  20  |   for (let i = 0; i < await labels.count(); i++) {
  21  |     const labelText = await labels.nth(i).textContent() ?? '';
  22  |     if (labelText.includes(label)) {
  23  |       const textarea = textareas.nth(i);
  24  |       await textarea.click();
  25  |       await textarea.fill(value);
  26  |       await expect(textarea).toHaveValue(value);
  27  |       return;
  28  |     }
  29  |   }
  30  |   throw new Error(`Fann ikkje textarea med label: ${label}`);
  31  | }
  32  | 
  33  | /** Klikkar på ein PremiumButton (gull-knapp) med den gitte teksten */
  34  | async function clickPremiumButton(page: Parameters<typeof page.locator>[0], text: string) {
  35  |   const buttons = page.getByRole('button', { name: new RegExp(text, 'i') });
  36  |   await expect(buttons).toBeVisible();
  37  |   await buttons.first().click();
  38  | }
  39  | 
  40  | /** Klikkar på ein BackButton (tekst med "tilbake") */
  41  | async function clickBackButton(page: Parameters<typeof page.locator>[0]) {
  42  |   const backButtons = page.getByRole('button', { name: /tilbake/i });
  43  |   await expect(backButtons).toBeVisible();
  44  |   await backButtons.first().click();
  45  | }
  46  | 
  47  | // =====================================================================
  48  | // TESTAR
  49  | // =====================================================================
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
> 62  |     await expect(progressBar).toBeVisible();
      |                               ^ Error: expect(locator).toBeVisible() failed
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
  150 |     await expect(nextBtn).toBeVisible();
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
```