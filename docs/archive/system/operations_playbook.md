# ToSom — Operations Playbook (v2026)

> **DEL 7 av full system audit.**  
> Hvordan administrere, overvåke og reagere på feil i drift.

---

## 1. SYSTEMHELSE — HVORDAN LESE AV TO SOM

### 1.1 Helseoversikt (Rask sjekk)

```
┌──────────────────────────────────────────────────────────────┐
│ TRINN 1: /admin/system/status                                │
│ ├─ Health banner: OK 🟢 | DEGRADERT 🟡 | NED 🔴              │
│ ├─ Services: DB, Pusher, Matching, Journey, Chat, Auth       │
│ └─ Latency: DB-ping, API-avg, API-P95                        │
├──────────────────────────────────────────────────────────────┤
│ TRINN 2: /admin/logs                                         │
│ ├─ Filter: ERROR-nivå                                        │
│ ├─ Sorter: new nhất først                                    │
│ └─ Grupper etter modul (matching, journey, chat, auth)       │
├──────────────────────────────────────────────────────────────┤
│ TRINN 3: /admin/users                                         │
│ └─ Sjekk om brukere er påvirket                               │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 Helse-metrikker og trerskler

| Mål | ✅ OK | 🟡 Advarsel | 🔴 Kritisk | Handle |
|-----|-------|-------------|------------|--------|
| **DB-tilkobling** | PING < 50ms | 50–200ms | > 200ms eller timeout | Sjekk PostgreSQL, rebytt connection pool |
| **API P95-latency** | < 1s | 1–3s | > 3s | Sjekk slow routes i `/admin/system/status` |
| **CPU-load (load1)** | < 0.7 | 0.7–1.5 | > 1.5 | Skaler horisontalt, sjekk CPU-intensive operasjoner |
| **Memory-usage** | < 65% | 65–85% | > 85% | Restart Node-prosess, sjekk memory leaks |
| **Feil-rate/time** | < 5 | 5–20 | > 20 | Analyser feilmønster i logs |
| **Pusher-connections** | Stable | Flakky | Ned | Sjekk Pusher dashboard |
| **Matching-cron** | Rente daglig | Forsinket > 1t | Ikke kjørt > 6t | Manuel kjør matching, sjekk cron scheduler |

---

## 2. FEILHÅNDTERING — KATEGORIER OG REAKSJONER

### 2.1 Feilkategorier

| Kategori | Eksempel | Hvor logges | Reaksjonstid |
|----------|---------|-------------|-------------|
| **Database** | `P2024: Too many connections`, `P2025: Connection timeout` | SystemLog (ERROR) | < 15 min |
| **Matching** | `Dealbreaker check failed`, `Scoring error` | SystemLog + console | < 1 time |
| **Chat** | `Pusher trigger failed`, `Message create failed` | SystemLog (hvis trackError brukt) | < 30 min |
| **Auth** | `Session expired`, `JWT decode failed` | Console (ingen trackError ennå) | < 1 time |
| **Journey** | `Day advancement failed`, `Phase transition error` | SystemLog + console | < 4 timer |
| **Infrastruktur** | Memory OOM, Disk full, Process crash | Console + PM2/systemd | < 15 min |

### 2.2 Playbook: Database-nedetid

```
SYMPTOMER:
- /admin/system/status viser DB = 🔴
- API-ruter returnerer 500 med Prisma-feil
- Nye matcher blir ikke opprettet

TRUSIING:
1. Gå til /admin/system/status → sjekk DB-status og latency
2. Gå til /admin/logs → filter på module="database" eller "prisma"
3. Sjekk PostgreSQL-prosess: docker logs <db-container> eller psql-kompatibilitet

REPARASJON:
4. Hvis connection pool er full: øk PRISMA_DATABASE_POOL_SIZE
5. Hvis DB ikke svarer: restart database container
6. Hvis disk er full: rens gamle logs (SystemLog.tabell > 90 dager)

VERIFIKASJON:
7. /admin/system/status viser DB = 🟢
8. Test matching manuelt for en bruker
9. Sjekk at cron-jobs fungerer igjen
```

### 2.3 Playbook: Matching-cron stopper

```
SYMPTOMER:
- Brukere får ingen nye matcher
- /admin/system/status viser lastMatch = gammel timestamp (> 24h)
- SystemLog har matching-relaterte ERRORer

TRUSIING:
1. Gå til /admin/system/status → sjekk cron.lastMatch
2. Gå til /admin/logs → filter module="matching"
3. Identifiser feilmelding (dealbreaker-feil? DB-timeout? Pool tom?)

REPARASJON:
4. Fiks underliggende årsak (se Feilkategorier)
5. Manuel kjør: POST /api/match/route for påvirkede brukere
6. Eller kjør matching-cron manuelt

VERIFIKASJON:
7. Bekreft at bruker A og B mottar matcher
8. Sjekk cron kjøres igjen neste dag (00:00)
```

### 2.4 Playbook: Chat/Pusher-nedetid

```
SYMPTOMER:
- Meldinger leveres ikke i sanntid
- Typing-indikatorer fungerer ikke
- Brukere må manuell refresh for å se nye meldinger

TRUSIING:
1. Sjekk Pusher dashboard (pusher.com) → sjekk app-status
2. Verifiser Pusher-kredensialer (.env: PUSHER_APP_KEY, PUSHER_SECRET)
3. Sjekk /admin/logs for "Pusher" relaterte feil

REPARASJON:
4. Hvis Pusher er ned: vent på utbedring fra Pusher (fallback: polling fungerer ikke i dagens kodebase)
5. Hvis kredensialer er ugyldige: oppdater .env og restart
6. Hvis rate-limit: øk kanal-grense i Pusher

VERIFIKASJON:
7. Test chat mellom testA og testB
8. Bekreft at meldinger ankommer innen 2 sekunder
```

### 2.5 Playbook: Høy feil-rate (> 20/time)

```
TRUSIING:
1. /admin/logs → sorter på ERROR, se nyeste først
2. Grupper feilmeldingene etter type (database? matching? auth?)
3. Identifiser pattern: én rute? én modul? systemisk?

REPARASJON:
4a. EN RUTE: fikser rute-spesifikk bug → deploy fix
4b. ÉN MODUL: isolation problemet → disable modul om nødvendig
4c. SYSTEMISKT: sjekk DB/infrastruktur → se Playbook ovenfor
4d. UIDENTIFISERT: aktiver MAINTENANCE_ENABLED=true, varsle brukere

VERIFIKASJON:
5. Feil-rate synker til < 5/time innen 30 minutter
```

---

## 3. CRON-JOBBLER

### 3.1 Oversikt

| Cron | Hyppighet | Oppgave | Logges i SystemLog? |
|------|-----------|---------|---------------------|
| `matching-cron` | Daglig 00:00 | Kjør matching for alle matchable brukere | ✅ Ja (trackError) |
| `journey-cron` | Daglig 08:00 | Avancer dager i aktive reiser, sjekk fase-endringer | ✅ Ja (trackError) |
| Cleanup? | Ukjent | Rense gamle data, utløpte tokens | ⚠️ Uklar |

### 3.2 Manuel Kjøring

**Matching (for en enkelt bruker):**
```bash
# Via API:
curl -X POST http://localhost:3000/api/match \
  -H "Cookie: authjs.session-token=XXX"

# Eller via direkte kall til matching-engine i kodebase
```

**Journey advancement:**
```bash
# Journey-cron kjøres daglig kl. 08:00
# Manuel trigger finnes ikke ennå (bør implementeres)
```

---

## 4. ENVIRONMENT VARIABLES — KRITISKE VARIABLER

| Variabel | Formål | Required? | Default (hvis ingen) | Sikkerhet |
|----------|--------|-----------|---------------------|-----------|
| `DATABASE_URL` | PostgreSQL-tilkobling | ✅ Ja | - | Høyt (inneholder passord) |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | NextAuth JWT-signering | ✅ Ja | - | Kritisk |
| `JWT_SECRET` | Admin-token signing | ⚠️ Anbefalt | `'dev-secret'` ⚠️ | Kritisk |
| `PUSHER_APP_KEY` | Pusher WebSocket | ✅ Ja | - | Høyt |
| `PUSHER_SECRET` | Pusher signering | ✅ Ja | - | Kritisk |
| `DEV_LOGIN_ENABLED` | Dev-login tilgang | ❌ Nei | `false` | Må være `false` i prod! |
| `MAINTENANCE_ENABLED` | Maintenance mode | ❌ Nei | `false` | - |
| `NEXT_PUBLIC_APP_URL` | App-base URL | ⚠️ Anbefalt | - | Lavt |

---

## 5. DEPLOYMENT & ROLLEBACK

### 5.1 Deploy-checkliste (fra `deploy/DEPLOYMENT-CHECKLIST.md`)

```
FOR DEPLOY:
□ Environment variables er oppdatert (.env)
□ Database migrasjoner kjørt (prisma db push/migrate)
□ Build passer (npm run build / npx tsc --noEmit = 0 errors)
□ Health endpoint svarer (GET /api/system/health → 200)
□ Dev-login deaktivert (DEV_LOGIN_ENABLED=false)

ETTER DEPLOY:
□ Sjekk /admin/system/status (alle services OK)
□ Test login med test-bruker
□ Test matching for én bruker
□ Verifiser Pusher-tilkobling
□ Sjekk SystemLog for nye feil i første 30 min
```

### 5.2 Rollback

```
HVIS NOE FEILER ETTER DEPLOY:
1. Aktiver MAINTENANCE_ENABLED=true (beskytter brukere)
2. Rollback til forrige git-commit eller Docker-image
3. Varsle teamet om problemet
4. Analyser feilen i /admin/logs
5. Deploy fix + fjern maintenance mode
```

---

## 6. DATA-ADMINISTRASJON

### 6.1 Database-størrelse og opprydding

| Tabell | Vekter raskt? | Rense-strategi |
|--------|--------------|----------------|
| `SystemLog` | ✅ Ja (hver feil/advarsel) | Arkiverer > 90 dager |
| `Message` | ✅ Ja (all chat) | Soft-delete (`deletedAt`) for gamle konversasjoner |
| `PerformanceMetric` | ⚠️ Moderat | Aggregerer til daglig, sletter raw > 30 dager |
| `AIRequestLog` | ⚠️ Moderat | Arkiverer > 60 dager |

### 6.2 Manuel DB-vedlikehold

```sql
-- Rens gamle SystemLog-entry (> 90 dager)
DELETE FROM "SystemLog" WHERE "createdAt" < NOW() - INTERVAL '90 days';

-- Rens utløpte tokens
DELETE FROM "MagicLinkToken" WHERE "expiresAt" < NOW();
DELETE FROM "PasswordResetToken" WHERE "expiresAt" < NOW();
DELETE FROM "PhoneVerification" WHERE "expiresAt" < NOW();

-- Sjekk orphanned data (matcher uten konversasjon)
SELECT m.* FROM "Match" m
LEFT JOIN "Conversation" c ON c."matchId" = m.id
WHERE c.id IS NULL AND m.status != 'expired';
```

---

## 7. MONITORING & ALERTING (NÅVÆRENDE VS ANBEFALET)

### 7.1 Nåværende State

| Funksjon | Implementert? | Kvalitet |
|----------|--------------|----------|
| System health endpoint | ✅ `/api/system/health` | God |
| Error logging til DB | ✅ `trackError()` → SystemLog | God |
| Warning logging til DB | ✅ `trackWarn()` → SystemLog | God |
| Console logging | ✅ Alle nivåer | Grunnleggende |
| Proaktiv alerting (email/Slack) | ❌ Nei | Mangler helt |
| API-latency auto-innsamling | ⚠️ Delvis | Mangler automatisk samling |
| Uptime monitoring | ❌ Nei | Mangler |

### 7.2 Anbefalt Monitoring-Stack

| Verktøy | Formål | Prioritet |
|---------|--------|-----------|
| **UptimeRobot / Healthchecks.io** | External uptime monitoring (5 min checks) | Høy |
| **Grafana + Prometheus** | Metrikker, latency, custom dashboards | Mellom |
| **Sentry / Bugsnag** | Error tracking med stack traces og grouping | Høy |
| **Slack webhook** | Alerting ved kritiske feil | Høy |

---

## 8. QUICK REFERENCE — VANLIGE KOMMANDOER

```bash
# Kjør TypeScript-validering
npx tsc --noEmit

# Kjør ESLint
npm run lint

# Bygg for produksjon
npm run build

# Start development server
npm run dev

# Kjør Prisma-migrasjoner
npx prisma generate && npx prisma db push

# Sjekk DB-tilkobling
npx prisma db pull --print

# Rens node_modules og reinstall
rm -rf node_modules .next && npm install

# Docker-compose (hvis brukt)
docker compose up -d
docker compose logs -f

# Manuel health-check curl
curl http://localhost:3000/api/system/health
```

---

*Dokument generert som del av full system audit & hardening plan (DEL 7).*