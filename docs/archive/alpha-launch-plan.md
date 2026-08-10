# ToSom Alpha-lansering (A-1) — Lanseringsplan

## 1. Oversikt

| Feld        | Verdi                                              |
|-------------|---------------------------------------------------|
| Versjon     | A-1                                                |
| Dato        | $(date +%Y-%m-%d)                                 |
| Omfang      | 5–20 brukarar                                      |
| Mål         | Observasjon, feilfangst, trygghet, stabilitet     |
| Ingenting    | Ingen nye funksjoner, ingen markedsføring          |

## 2. Forutsetninger

```bash
# 1. Database (ren, utan testdata)
export DATABASE_URL="postgresql://tosom_alpha:password@localhost:5432/tosom_alpha"

# 2. Miljøvariabler
export TOSOM_ENV=alpha
export NODE_ENV=production
export LOG_LEVEL=warn
export ENABLE_AI_LOGGING=false
export ENABLE_AUDIT_LOG=true

# 3. Admin-konto
export ADMIN_EMAIL="admin@tosom.no"
export ADMIN_PASSWORD="AlphaTosom2026!"

# 4. Demo-brukarar
export DEMO_USERS=10
export DEMO_PASSWORD="DemoTosom2026!"
```

## 3. Oppstart

```bash
# 1. Kjør alpha-launch.sh
cd /home/george/tosom
bash scripts/alpha/alpha-launch.sh

# 2. Start server
npm run dev -p 3000
```

## 4. Tilgjengelege sider for brukarar

| Side        | URL           | Funksjon                           |
|-------------|---------------|-----------------------------------|
| Signup      | `/signup`     | Opprett konto                      |
| Login       | `/login`      | Magisk innloggingslenke            |
| Onboarding  | `/onboarding` | 11-stegs profil-opprettning        |
| Dashboard   | `/dashboard`  | Match-status, reise-status         |
| Chat        | `/chat`       | Guidet samtaler                   |
| Journey     | `/journey`    | 30-dagers reise                    |

## 5. Testscenarioer

### Scenario 1: Onboarding (alle brukarar)
- [ ] Brukar går gjennom all 11 steg
- [ ] Alle valideringar fungerer
- [ ] Progresjon lagast korrekt
- [ } Ingen feil i konsollen

### Scenario 2: Første match
- [ ] Brukar får én match etter 24t
- [ ] Match viser resonans-nivå
- [ ] Ingen dobbelt-match

### Scenario 3: Reise-start
- [ ] Dag 1-innhald lastast korrekt
- [ ] Refleksjonsspørsmål visast
- [ ] Oppgåver er tilgjengelege
- [ ] Systemmeldingar fungerer

### Scenario 4: Chat
- [ ] Meldingar sendast/mottakst
- [ ] Systemmeldingar visast
- [ ] Ingen feil ved samtidig bruk

## 6. Overvåking

### Aktiver observasjon (kvart 30. minutt)
```bash
npx tsx scripts/alpha/alphaMonitor.ts
```

### Innsamling av feedback (etter kvar sesjon)
```bash
npx tsx scripts/alpha/collectFeedback.ts
```

### Loggar å sjå på
```bash
# Feil i produksjon
grep "ERROR" /var/log/tosom.log | tail -50

# API-feil
grep "status 4[0-9][0-9]" /var/log/tosom.log | tail -50
grep "status 5[0-9][0-9]" /var/log/tosom.log | tail -50
```

### Kritiske mønstre å observere
- [ ] Dobbelt-match (brukar med >1 aktiv match)
- [ ] nextDayAt-feil (expired reiser)
- [ ] imageShareAllowedAt-feil (tidleg bildedeling)
- [ ] Manglande systemmeldingar i reise
- [ ] Auth-feil (banned/deleted brukarar)

## 7. Stabilisering-reglar

Kun følgjande feil skal rettast under A-1:

| Kategori      | Kvanfor |
|---------------|----------|
| Krasj          | Server/ frontend krasjar |
| Matchmotor     | Feil i 24t-regel, 30d-lås, resonans |
| Reise          | Feil i dag 1-30-innhald, refleksjon, oppgåve |
| Chat           | Meldingar fungerer ikkje |
| Auth           | Innlogging/utlogging fungerer ikkje |

**IKKE legg til:**
- Nye funksjonar
- UI-endringar som ikkje er feilretting
- Gamle features som ikkje var del av A-1

## 8. Feedback-skjema

For kvar brukar, fyll ut:

```json
{
  "email": "brukar@eksempel.no",
  "onboarding": "Kva tenker du om onboarding?",
  "match": "Kva tenker du om match?",
  "journey": "Kva tenker du om reise?",
  "chat": "Kva tenker du om chat?",
  "tone": "Rolan, varm, trygg? (ja/neit/neutral)",
  "visual": "Visuell ro? (ja/neit/neutral)",
  "suggestions": "Forslag:",
  "overall": 7
}
```

## 9. Avslutning

### Sjekkliste
- [ ] Alle testscenarioer gjennomførte
- [ ] Alle feil logga
- [ ] Feedback samla frå alle brukarar
- [ ] Kritiske feil retta
- [ ] Systemet stabil

### Deliverables
- `/tmp/alpha-metrics.json` — System-metrikk
- `/tmp/alpha-feedback.json` — Brukar-feedback
- `docs/alpha-a1-complete.md` — Denne rapporten

---

**Versjon: A-1**
**Status: KLAR FOR LANSERING**