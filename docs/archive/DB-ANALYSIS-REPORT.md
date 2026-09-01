# Database-analyse — ToSom

**Status:** 🟢 STABIL  
**Sist verifisert:** 2026-07-10  
**Versjon:** dfdfa29 (main)

---

## 1. Database-stack

| Komponent | Verdi | Status |
|-----------|-------|--------|
| PostgreSQL | 15 | ✅ installert |
| PSQL CLI | `/usr/bin/psql` | ✅ tilgjengeleg |
| Docker | v29.5.3 | ✅ installert |
| Docker Compose | v5.1.4 | ✅ installert |
| Container `tosom_dev_db` | PostgreSQL 15.18 | ✅ **KØYRER** |
| Port binding | `0.0.0.0:5432→5432/tcp` | ✅ mottak port 5432 |

## 2. Docker-container detaljer

| Miljøvariabel | Verdi |
|--------------|-------|
| POSTGRES_USER | `tosom` |
| POSTGRES_PASSWORD | `tosom` |
| POSTGRES_DB | `tosom_dev` |

**Container:** `tosom_dev_db` — køyrer på port 5432.

## 3. .env-problemet (Fiksa)

| Fil | DATABASE_URL | Status |
|-----|-------------|--------|
| **Opphavleg `.env`** | `postgresql://postgres:devpass@localhost:5433/tosom_dev` | ❌ **FEIL** — port 5433 ikke eksisterer + feil credentials |
| **Oppdatert `.env`** | `postgresql://tosom:tosom@localhost:5432/tosom_dev` | ✅ **OK** |

## 4. Prisma-verifikasjon

| Sjekk | Resultat | Status |
|-------|----------|--------|
| `prisma db pull` | Introspecterte 29 modellar | ✅ PASS |
| `prisma generate` | Client generert (v5.22.0) | ✅ PASS |
| Port-test 5432 | Connection succeeded! | ✅ PASS |
| Port-test 5433 | Connection refused | ❌ (ikke brukt) |

## 5. Dev-server

| Sjekk | Resultat | Status |
|-------|----------|--------|
| HTTP localhost:3000 | 200 OK | ✅ PASS |
| pg_isready localhost:5432 | accepting connections | ✅ PASS |
| API-ruter /api/journey/[id] | "Unauthorized" (autentisert flow) | ✅ PASS (ikke 500) |
| Dev-login API | Redirect + session-cookie | ✅ PASS |

## 6. Test-data i database

| Bruker | Email | onboardingComplete | deepProfileComplete | Match | JourneyProgress |
|--------|-------|-------------------|-------------------|-------|-----------------|
| test-user-1 | test1@tosom.no | ✅ true | ❌ false | ✅ active mot user-2 | ❌ ingen |
| test-user-2 | test2@tosom.no | ❌ false | ❌ false | ✅ active mot user-1 | ❌ ingen |
| test-user-3 | test3@tosom.no | ❌ false | ❌ false | ❌ ingen | ❌ ingen |

## 7. Konklusjon

### Hva som var gale:
1. **Feil port** i `.env` (5433 → skulle vore 5432)
2. **Feil credentials** i `.env` (postgres/devpass → skulle vore tosom/tosom)

### Hva som er fiksa:
- ✅ `.env` oppdatert med korrekt DATABASE_URL og DIRECT_URL
- ✅ Prisma db pull funksjonerte mot Docker-containeren
- ✅ Prisma Client generert
- ✅ Dev-server køyr på port 3000
- ✅ PostgreSQL mottak connections på port 5432
- ✅ API-ruter responsar uten 500-feil

### Om onboarding-flow:
- `/dashboard` returnerar 307 redirect (ikke 500 — positivt)
- `/onboarding` lastar korrekt (200 OK)
- `/api/journey/[id]` krev autentisering (401 for uautentisert) — funksjonelt
- **Ingen 500-feil observert** — alt fungerer på backend-nivå

### Test-data-status:
- `test-user-1` har full onboarding og aktiv match mot `test-user-2`
- Ingen har JourneyProgress i databasen no (nye brukere treng å starte reise)

---

## Oppsummering

**ToSom bruker to database-miljø:**

| Miljø | Database URL | Bruk |
|-------|-------------|------|
| **Development** | `postgresql://tosom:tosom@localhost:5432/tosom_dev` | Lokal Docker Dev-db |
| **Production** | `postgres://...@db.prisma.io:5432/postgres` | Prisma/PlanetScale Cloud |

**Systemet er STABILT og klar for vidareutvikling.**