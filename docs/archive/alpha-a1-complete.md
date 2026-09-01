# ToSom Alpha-lansering (A-1) — Komplett rapport

## 📊 Oversikt

| Feld        | Verdi                          |
|-------------|--------------------------------|
| Versjon     | A-1                            |
| Dato        | 2026-06-20                     |
| Omfang      | 5–20 brukere                  |
| Status      | ✅ KLAR FOR LANSERING           |
| Mål         | Observasjon, feilfangst, trygghet, stabilitet |

## ✅ Gjort

### 1. Forberedelser
- [x] Alpha-database oppsett (via DATABASE_URL)
- [x] Miljøvariabler for produksjonsmodus
- [x] Admin-konto script oppretta (`scripts/alpha/createAdmin.ts`)
- [x] Debug-logger deaktivert (`LOG_LEVEL=warn`)

### 2. Brukarutvelgelse
- [x] Demo-bruker script oppretta (`scripts/alpha/createDemoUsers.ts`)
- [x] Konfigurert for 5–20 brukere
- [x] Kun nødvendige sider tilgjengelege:
  - `/signup`
  - `/login`
  - `/onboarding`
  - `/dashboard`
  - `/chat`
  - `/journey`

### 3. Testscenarioer
- [x] Onboarding-test (11 steg)
- [x] Match-test (24t-regel, 30d-lås)
- [x] Reise-test (dag 1-30, refleksjon, oppgåve)
- [x] Chat-test (systemmeldingar, resonans)

### 4. Logging og overvåking
- [x] Observasjons-script (`scripts/alpha/alphaMonitor.ts`)
  - Dobbel-match deteksjon
  - nextDayAt-feil deteksjon
  - imageShareAllowedAt-feil deteksjon
  - Manglende systemmeldingar deteksjon
  - Auth-feil deteksjon
  - System health-rapport
- [x] Feedback-script (`scripts/alpha/collectFeedback.ts`)
  - Onboarding-feedback
  - Match-feedback
  - Reise-feedback
  - Chat-feedback
  - Tone & visual-feedback
  - Overall score (1-10)

### 5. Stabilisering
- [x] Kritiske feil retta (RC-1)
- [x] Ingen nye funksjonar lagt til
- [x] Kun feilrettingar

### 6. Build & Typecheck
- [x] Typecheck: EXIT:0 (ingen feil)
- [x] Build: PASS (Next.js)
- [x] Alle ruter genererte korrekt

## 📦 Deliverables

### Skript
| Fil                                    | Funksjon                     |
|----------------------------------------|------------------------------|
| `scripts/alpha/alpha-launch.sh`        | Hoved-lanseringsscript       |
| `scripts/alpha/createAdmin.ts`         | Admin-konto oppretting       |
| `scripts/alpha/createDemoUsers.ts`     | Demo-bruker oppretting       |
| `scripts/alpha/alphaMonitor.ts`        | System-observasjon           |
| `scripts/alpha/collectFeedback.ts`     | Bruker-feedback innsamling   |

### Dokumentasjon
| Fil                                  | Funksjon                  |
|--------------------------------------|---------------------------|
| `docs/alpha-launch-plan.md`         | Lanseringsplan            |
| `docs/alpha-a1-complete.md`         | Denne rapporten           |

### Konfigurasjon
| Fil              | Funksjon                  |
|------------------|---------------------------|
| `.env.alpha`     | Alpha-miljøvariabler      |
| `/tmp/alpha-metrics.json` | System-metrikk |
| `/tmp/alpha-feedback.json` | Bruker-feedback |

## 📈 Forventede metrikk

### System-helse
- Feil-rate: < 5%
- p95-latens: < 2000ms
- Ingen HTTP 500-feil

### Bruker-erfarening
- Onboarding: Fullført > 80%
- Match-opplevelse: positiv > 70%
- Reise-opplevelse: rolig/trygg > 80%
- Chat-opplevelse: fungerande > 90%
- Tone: rolig/varm/trygg > 75%
- Visuell: ro/trygg > 75%

## 🚀 Lansering

### Start alpha-lansering
```bash
# 1. Sett miljøvariabler
export TOSOM_ENV=alpha
export DATABASE_URL="postgresql://tosom_alpha:password@localhost:5432/tosom_alpha"
export ADMIN_EMAIL="admin@tosom.no"
export ADMIN_PASSWORD="AlphaTosom2026!"
export DEMO_USERS=10
export DEMO_PASSWORD="DemoTosom2026!"

# 2. Kjør lansering
bash scripts/alpha/alpha-launch.sh

# 3. Start server
npm run dev -p 3000
```

### Observasjon under test
```bash
# Kvart 30. minutt
npx tsx scripts/alpha/alphaMonitor.ts

# Etter hver sesjon
npx tsx scripts/alpha/collectFeedback.ts
```

## ⚠️ Viktig

### Under A-1:
- ✅ Observer uten å gripe inn
- ✅ Logg alle feil
- ✅ Samle feedback
- ✅ Rett KUN kritiske feil
- ❌ IKKE legg til nye funksjonar
- ❌ IKKE gjør UI-endringer
- ❌ IKKE marknadsfør

### Kritiske feil som må rettast:
- Krasj (server/frontend)
- Feil i matchmotor
- Feil i reise
- Feil i chat
- Feil i auth

## 📝 Feedback-samling

### Sjekkliste for hver bruker
- [ ] Gikk gjennom onboarding
- [ ] Fekk første match
- [ ] Starta reisen
- [ ] Brukte chatten
- [ ] Feedback gjeven

### Feedback-skjema
```json
{
  "email": "bruker@eksempel.no",
  "onboarding": "...",
  "match": "...",
  "journey": "...",
  "chat": "...",
  "tone": "ja/neit/neutral",
  "visual": "ja/neit/neutral",
  "suggestions": "...",
  "overall": 7
}
```

## ✅ Avslutning

### A-1 COMPLETE
- [x] Alle forberedelser gjort
- [x] Alle skript oppretta
- [x] Alle dokumentasjon skrive
- [x] Build & typecheck pass
- [x] Klar for lansering

### Versjon: A-1
### Status: ✅ KLAR FOR LANSERING
### Næste steg: Start alpha-test med 5-20 brukere

---

**ToSom Alpha-lansering A-1 er komplett og klar for bruk.**