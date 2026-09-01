# E2E Testing — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0

---

## OVERSIKT

ToSom har no en full E2E-testpakke med Playwright som tester de tre viktigaste flowane:
1. **Onboarding** — Bruker kan opprette profil
2. **Match** — Bruker kan motta og akseptere match
3. **Chat** — Bruker kan sende og motta meldinger

---

## INSTALLASJON

```bash
# Instalar Playwright
npm install -D @playwright/test
npx playwright install

# Instalar Chromium-browsar (valfritt, Playwright tek seg av dette)
npx playwright install chromium
```

---

## KJØRING

### Lokal kjøring
```bash
# Kjør alle tester
npx playwright test

# Kjør en spesifikk test
npx playwright test e2e/tests/onboarding.spec.ts

# Kjør i headed mode (se testen live)
npx playwright test --headed

# Køy i debug modus
npx playwright test --debug
```

### Produsrasjon/Testmiljø
```bash
# Med test-database
docker-compose -f docker-compose.test.yml up -d
npx playwright test

# Uten test-database (bare UI-tester)
npx playwright test
```

---

## PROSJEKTSTRUKTUR

```
e2e/
├── fixtures/
│   └── test-users.ts      # Testbrukarar og helper-funksjonar
├── tests/
│   ├── onboarding.spec.ts  # Onboarding-flow tester
│   ├── match.spec.ts       # Match-flow tester
│   └── chat.spec.ts        # Chat-flow tester
├── videos/                 # Test-video (generert automatisk)
└── screenshots/            # Test-skjermbilete (generert automatisk)
```

---

## TESTBRUKARAR

| ID | Email | Rolle | Beskrivelse |
|----|-------|-------|--|----|
| `test-user-1` | test1@tosom.no | USER | Standard testbrukar |
| `test-user-2` | test2@tosom.no | USER | Standard testbrukar |
| `test-admin` | admin@tosom.no | ADMIN | Admin-testbrukar |

---

## TESTAR-OVERSIKT

### Onboarding-tester (6 tester)
| Test | Beskrivelse |
|------|----|-----|
| Vise onboarding | Ny bruker ser onboarding-side |
| Starte onboarding | Kan logge inn via dev-login |
| Steg-indikator | Ser steg-framsteg |
| Fylle ut profil | Kan skrive namn og info |
| Navigere steg | Kan gå mellom steg |
| Feilmelding | Ser feil ved ugyldig inndata |

### Match-tester (6 tester)
| Test | Beskrivelse |
|------|----|----|
| Match-status | Ser match-status på dashboard |
| Vent-melding | Ser "vent på match" |
| Navigere match | Kan gå til match-side |
| Match-explanation | Ser forklaring på match |
| Avise match | Kan avise match |
| Akseptere match | Kan akseptere match |

### Chat-tester (8 tester)
| Test | Beskrivelse |
|------|----|----|
| Vise chat | Ser chat-side |
| Tom-chat | Ser tom-chat-melding |
| Skrive melding | Kan skrive i input |
| Send melding | Kan sende melding |
| Egne meldinger | Ser egne meldinger til høyre |
| Mottatte meldinger | Ser mottatte meldinger til venstre |
| Typing-indikator | Ser typing-indikator |
| Tidstempler | Ser melding-tid |

**Totalt: 20 tester**

---

## FEILFINDING

### "Web server failed."
Start lokal server manuelt:
```bash
npm run dev
npx playwright test
```

### "Test timed out"
Øk timeout i playwright.config.ts:
```typescript
timeout: 90_000  // 90 sekund
```

### "Element not found"
Sjekk at UI har data-testid-attribute:
```html
<button data-testid="next-button">Neste</button>
```

### "Page redirected unexpectedly"
Sjekk at NEXTAUTH_URL er riktig i miljøvariablane

---

## CI-INTEGRASJON

Testane kjører automatisk i GitHub Actions ved PR og push:

```yaml
# I .github/workflows/ci.yml
- name: Run E2E tests
  run: npx playwright test
```

---

## BEST PRACTICES

1. **Bruk data-testid** for stabile selektorar
2. **Ikke stole på CSS-klasser** (desse kan endre seg)
3 **Bruk waitForURL etter redirect**
4. **Bruk expect().toBeVisible() for synlege element**
5. **Bruk expect().toHaveValue() for input-felt**
6. **Alltid cleanup mellom tester**

---

## EKSEMPEL-PARA

```bash
# Køy en test med video
npx playwright test onboarding --project=chromium --debug

# Export test-report
npx playwright show-report

# Kjøy alle tester i parallel
npx playwright test --workers=4
```

---

## HUSK

- Testane krev at appen kjør på localhost:3000
- Dev-login må være aktivert (DEV_LOGIN_ENABLED=true)
- Test-database må være oppsett for full funksjonalitet