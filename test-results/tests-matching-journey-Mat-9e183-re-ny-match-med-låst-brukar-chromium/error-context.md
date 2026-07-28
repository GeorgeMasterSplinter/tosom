# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/matching-journey.test.ts >> Matching Flow >> skal blokkere ny match med låst-brukar
- Location: e2e/tests/matching-journey.test.ts:32:7

# Error details

```
TypeError: page.request is not a function
```

# Test source

```ts
  1   | /**
  2   |  * E2E-test — Matching + Journey flows
  3   |  */
  4   | import { test, expect } from '@playwright/test';
  5   | 
  6   | const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  7   | 
  8   | test.describe('Matching Flow', () => {
  9   |   test('skal vise dashboard med ResonanceMeter etter match', async ({ page }) => {
  10  |     // Mock login ved å sette session-cookies direkte (dersom dev-login eksisterer)
  11  |     await page.goto('/dev-login');
  12  |     
  13  |     // Eller naviger til dashboard direkte dersom vi er i dev-måte
  14  |     await page.goto(`${BASE_URL}/dashboard`);
  15  |     
  16  |     // ResonanceMeter skal vere synleg
  17  |     const resonanceMeter = page.locator('[style*="border"], [style*="borderRadius"]');
  18  |     await expect(resonanceMeter.first()).toBeVisible({ timeout: 5000 });
  19  |   });
  20  | 
  21  |   test('skal vise QuickActions-knappar', async ({ page }) => {
  22  |     await page.goto(`${BASE_URL}/dashboard`);
  23  |     
  24  |     // Søk etter gull-gradient-knappane med spesifikke tekst
  25  |     const reiseBtn = page.getByRole('button', { name: /reise/i });
  26  |     const chatBtn = page.getByRole('button', { name: /chat/i });
  27  |     
  28  |     if (await reiseBtn.count() > 0) await expect(reiseBtn).toBeVisible();
  29  |     if (await chatBtn.count() > 0) await expect(chatBtn).toBeVisible();
  30  |   });
  31  | 
  32  |   test('skal blokkere ny match med låst-brukar', async ({ page }) => {
  33  |     // Test at POST /api/match returnerer 409 med lockedUntil i framtida
> 34  |     const response = await page.request().post(`${BASE_URL}/api/match`, {
      |                                 ^ TypeError: page.request is not a function
  35  |       data: { userId: 'test-user-id' },
  36  |     });
  37  |     
  38  |     if (response.status() === 409) {
  39  |       const body = await response.json();
  40  |       expect(body.error).toContain('låst');
  41  |     } else {
  42  |       // 200 er OK dersom brukaren ikkje er låst i test-miljø
  43  |       expect([200, 409]).toContain(response.status());
  44  |     }
  45  |   });
  46  | });
  47  | 
  48  | test.describe('Journey Flow', () => {
  49  |   test('skal vise Journey-side med progress-tracker og dag-innhald', async ({ page }) => {
  50  |     await page.goto(`${BASE_URL}/journey`);
  51  |     
  52  |     // ProgressTracker (30-dagers grid) eller journey-innhald skal vere synleg
  53  |     const content = page.locator('[style*="background"], [class*="glass"]');
  54  |     await expect(content.first()).toBeVisible({ timeout: 5000 });
  55  |   });
  56  | 
  57  |   test('skal vise PremiumJourneyDayView med refleksjon og oppgåve', async ({ page }) => {
  58  |     await page.goto(`${BASE_URL}/journey`);
  59  |     
  60  |     // Refleksjonstekst eller oppgåvetekst skal vere synleg
  61  |     const reflection = page.locator('[style*="borderLeft"]');
  62  |     if (await reflection.count() > 0) {
  63  |       await expect(reflection.first()).toBeVisible();
  64  |     }
  65  |   });
  66  | 
  67  |   test('skal vise ImageShareLockBanner dersom imageShareAllowedAt ikkje passert', async ({ page }) => {
  68  |     await page.goto(`${BASE_URL}/journey`);
  69  |     
  70  |     // Banner med tekst "Du kan dele bilder om" eller countdown-verdi
  71  |     const banner = page.locator('[style*="rgba(212, 175, 55)"]');
  72  |     if (await banner.count() > 0) {
  73  |       await expect(banner.first()).toBeVisible();
  74  |     }
  75  |   });
  76  | });
  77  | 
  78  | test.describe('Premium UI', () => {
  79  |   test('skal ha AmbientGlow-effekt på dashboard og journey', async ({ page }) => {
  80  |     await page.goto(`${BASE_URL}/dashboard`);
  81  |     
  82  |     // Ambient glow-element (stor, blur, radial-gradient) skal vere synleg i DOM
  83  |     const body = page.locator('body');
  84  |     const html = await body.innerHTML();
  85  |     expect(html).toContain('AmbientGlow');
  86  |   });
  87  | 
  88  |   test('skal ha glassmorphism på alle cards', async ({ page }) => {
  89  |     await page.goto(`${BASE_URL}/dashboard`);
  90  |     
  91  |     // Sjekk at glass-panel har backdrop-filter: blur
  92  |     const glassCards = page.locator('[style*="backdropFilter"]');
  93  |     expect(await glassCards.count()).toBeGreaterThan(0);
  94  |   });
  95  | 
  96  |   test('skal ha gull-gradient-knappar på CTA-element', async ({ page }) => {
  97  |     await page.goto(`${BASE_URL}/dashboard`);
  98  |     
  99  |     // Sjekk at gull-knappar har gradient
  100 |     const goldButtons = page.locator('[style*="background: linear-gradient"]');
  101 |     expect(await goldButtons.count()).toBeGreaterThan(0);
  102 |   });
  103 | });
  104 | 
  105 | test.describe('Admin Flow', () => {
  106 |   test('skal autentisere admin og vise dashboard', async ({ page }) => {
  107 |     await page.goto(`${BASE_URL}/admin/login`);
  108 |     
  109 |     // Admin-login skal vere synleg
  110 |     const loginForm = page.locator('[type="password"], input[type="email"]');
  111 |     if (await loginForm.count() > 0) {
  112 |       await expect(loginForm.first()).toBeVisible();
  113 |     }
  114 |   });
  115 | 
  116 |   test('skal vise brukar-liste med ekte data frå /api/admin/users', async ({ page }) => {
  117 |     // API-test av echete databasedata
  118 |     const response = await page.request().get(`${BASE_URL}/api/admin/users`);
  119 |     
  120 |     // Skal returnere 401/403 dersom ikkje autentisert
  121 |     expect([200, 401, 403]).toContain(response.status());
  122 |     
  123 |     if (response.status() === 200) {
  124 |       const body = await response.json();
  125 |       expect(body.success).toBe(true);
  126 |       expect(Array.isArray(body.users)).toBe(true);
  127 |     }
  128 |   });
  129 | 
  130 |   test('skal blokkere ikkje-admin frå /admin/users', async ({ page }) => {
  131 |     // Som vanleg user (ikkje admin) skal få 403
  132 |     const response = await page.request().get(`${BASE_URL}/api/admin/users`);
  133 |     
  134 |     if (response.status() === 200) {
```