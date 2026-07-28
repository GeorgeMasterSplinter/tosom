# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/matching-journey.test.ts >> Premium UI >> skal ha gull-gradient-knappar på CTA-element
- Location: e2e/tests/matching-journey.test.ts:96:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "ToSom" [ref=e4] [cursor=pointer]:
        - /url: /
      - button "Åpne meny" [ref=e5]
  - main [ref=e8]:
    - generic [ref=e10]:
      - generic [ref=e11]:
        - heading "God ettermiddag, Ane" [level=1] [ref=e12]
        - paragraph [ref=e13]: Ta deg tid. Her møter du partneren din, steg for steg.
      - generic [ref=e14]:
        - paragraph [ref=e15]: Handlinger
        - generic [ref=e16]:
          - link [ref=e17] [cursor=pointer]:
            - /url: /chat
            - button "Gå til samtalen" [ref=e18]
          - link [ref=e23] [cursor=pointer]:
            - /url: /onboarding
            - button "Oppdater profil" [ref=e24]
          - link [ref=e30] [cursor=pointer]:
            - /url: /settings
            - button "Innstillinger" [ref=e31]
      - generic [ref=e37]:
        - generic [ref=e38]:
          - paragraph [ref=e39]: Din profil
          - heading "Ane" [level=3] [ref=e40]
          - paragraph [ref=e41]: Profil fullført ✓
        - generic [ref=e47]:
          - generic [ref=e48]: 0%
          - generic [ref=e49]: Resonans
        - generic [ref=e50]:
          - paragraph [ref=e51]: Partner
          - heading "Erik" [level=3] [ref=e52]
          - paragraph [ref=e53]: Dag 7 av 30
      - generic [ref=e54]:
        - heading "Din reise — dag 7 av 30" [level=2] [ref=e55]
        - paragraph [ref=e56]: Hver dag gir en ny mulighet til å forstå deg selv og partneren din.
        - generic [ref=e57]:
          - generic [ref=e58] [cursor=pointer]: "1"
          - generic [ref=e60] [cursor=pointer]: "2"
          - generic [ref=e62] [cursor=pointer]: "3"
          - generic [ref=e64] [cursor=pointer]: "4"
          - generic [ref=e66] [cursor=pointer]: "5"
          - generic [ref=e68] [cursor=pointer]: "6"
          - generic [ref=e70] [cursor=pointer]: "7"
          - generic [ref=e72]: "8"
          - generic [ref=e74]: "9"
          - generic [ref=e76]: "10"
          - generic [ref=e78]: "11"
          - generic [ref=e80]: "12"
          - generic [ref=e82]: "13"
          - generic [ref=e84]:
            - generic [ref=e85]: "14"
            - generic [ref=e86]: ★
          - generic [ref=e88]: "15"
          - generic [ref=e90]: "16"
          - generic [ref=e92]: "17"
          - generic [ref=e94]: "18"
          - generic [ref=e96]: "19"
          - generic [ref=e98]: "20"
          - generic [ref=e100]: "21"
          - generic [ref=e102]: "22"
          - generic [ref=e104]: "23"
          - generic [ref=e106]: "24"
          - generic [ref=e108]: "25"
          - generic [ref=e110]: "26"
          - generic [ref=e112]: "27"
          - generic [ref=e114]: "28"
          - generic [ref=e116]: "29"
          - generic [ref=e118]: "30"
        - generic [ref=e120]:
          - paragraph [ref=e121]: Dagens refleksjon
          - paragraph [ref=e122]: "\"Tenk på en god samtale du har hatt. Hva gjorde den så spesiell?\""
        - button "Neste dag →" [ref=e123] [cursor=pointer]
  - button "Open Next.js Dev Tools" [ref=e129] [cursor=pointer]
  - alert [ref=e133]
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
  34  |     const response = await page.request().post(`${BASE_URL}/api/match`, {
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
> 101 |     expect(await goldButtons.count()).toBeGreaterThan(0);
      |                                       ^ Error: expect(received).toBeGreaterThan(expected)
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
  135 |       // Testmiljø kan ha ulike auth-reglar
  136 |       expect(response.headers()['content-type']).toContain('application/json');
  137 |     } else {
  138 |       expect([401, 403]).toContain(response.status());
  139 |     }
  140 |   });
  141 | });
  142 | 
  143 | test.describe('Vipps Auth Flow', () => {
  144 |   test('skal initiere Vipps- autorisasjon og motta authorizeUrl', async ({ page }) => {
  145 |     const response = await page.request().get(`${BASE_URL}/api/auth/vipps/authorize`);
  146 |     
  147 |     if (response.status() === 503) {
  148 |       // Vipps ikkje konfigurert i test-miljø — OK
  149 |       const body = await response.json();
  150 |       expect(body.error).toContain('ikkje konfigurert');
  151 |     } else {
  152 |       expect(response.status()).toBe(200);
  153 |       const body = await response.json();
  154 |       expect(body.authorizeUrl).toContain('vipps.no');
  155 |       expect(body.state).toBeTruthy();
  156 |     }
  157 |   });
  158 | 
  159 |   test('skal returnere authorizeUrl med korrekt state', async ({ page }) => {
  160 |     try {
  161 |       const response = await page.request().get(`${BASE_URL}/api/auth/vipps/authorize`);
  162 |       if (response.status() === 200) {
  163 |         const body = await response.json();
  164 |         expect(body.authorizeUrl).toContain('https://auth.vipps.no');
  165 |         expect(typeof body.state).toBe('string');
  166 |         expect(body.state.length).toBeGreaterThan(10);
  167 |       }
  168 |     } catch {
  169 |       // Fail silently dersom Vipps ikkje er konfigurert
  170 |     }
  171 |   });
  172 | });
  173 | 
  174 | test.describe('Guidede Spørsmål API', () => {
  175 |   test('skal returnere 10 kategorier med spørsmål-antall', async ({ page }) => {
  176 |     const response = await page.request().get(`${BASE_URL}/api/questions`);
  177 |     
  178 |     expect(response.status()).toBe(200);
  179 |     const body = await response.json();
  180 |     expect(body.success).toBe(true);
  181 |     expect(Array.isArray(body.categories)).toBe(true);
  182 |     expect(body.categories.length).toBeGreaterThan(0);
  183 |   });
  184 | 
  185 |   test('skal returnere spørsmål i ein kategori', async ({ page }) => {
  186 |     try {
  187 |       const response = await page.request().get(`${BASE_URL}/api/questions`);
  188 |       if (response.status() === 200) {
  189 |         const body = await response.json();
  190 |         const categoryId = body.categories?.[0]?.id;
  191 |         
  192 |         if (categoryId) {
  193 |           const catResponse = await page.request().get(`${BASE_URL}/api/questions?categoryId=${categoryId}`);
  194 |           expect(catResponse.status()).toBe(200);
  195 |           const catBody = await catResponse.json();
  196 |           expect(Array.isArray(catBody.questions)).toBe(true);
  197 |         }
  198 |       }
  199 |     } catch {
  200 |       // Fail silently
  201 |     }
```