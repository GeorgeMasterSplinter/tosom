# Test Database — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0

---

## HVA ER TEST DATABASE?

Test-database er en isolert PostgreSQL-database som kjører uavhengig av din dev-database. Den brukes til:
- Testing uten å ødelegge dev-data
- E2E-tester
- Simulering av produksjonsmiljø
- Uavhengige migrations

---

## RASK START

### 1. Start test-database

```bash
docker-compose -f docker-compose.test.yml up -d
```

### 2. Vent til den er klar

```bash
docker exec -it tosom_test_db pg_isready -U tosom
```

### 3. Generer Prisma Client mot test-database

```bash
# Oppdater DATABASE_URL i .env.test
DATABASE_URL="postgresql://tosom:tosom@localhost:5433/tosom_test"

# Generer client
npx prisma generate

# Sync schema
npx prisma db push --schema prisma/schema.prisma
```

---

## MILJØVARIABLE

Kopier `.env.test` og oppdater DATABASE_URL:

```bash
cp .env.test .env.test.local
```

I `.env.test.local`:

```
DATABASE_URL="postgresql://tosom:tosom@localhost:5433/tosom_test"
DEV_LOGIN_ENABLED=true
NODE_ENV="test"
```

---

## PORT-FORSKJELL

| Miljø | Port | Database |
|-------|------|----------|
| Dev | 5432 | tosom_dev |
| Test | 5433 | tosom_test |
| Prod | 5432 (hostet) | tosom_prod |

**Viktig:** Test-db bruker port **5433** for å unngå konflikt med dev-db.

---

## BRUKSARKER

### E2E-tester

```bash
# Start test-db
docker-compose -f docker-compose.test.yml up -d

# Kjør e2e-tester
npx playwright test --project=test
```

### Manuell testing

```bash
# Koble til test-db
docker exec -it tosom_test_db psql -U tosom -d tosom_test

# Liste tabeller
\dt

# Se innhold
SELECT * FROM User;
```

### Reset test-database

```bash
# Destroy og recreate
docker-compose -f docker-compose.test.yml down -v
docker-compose -f docker-compose.test.yml up -d

# Slett og rebuild schema
docker exec -it tosom_test_db psql -U tosom -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npx prisma db push
```

---

## PRISMA CONFIG FOR TEST

Legg til i `prisma/schema.prisma` (valgfritt):

```prisma
datasource test_db {
  provider = "postgresql"
  url      = env("TEST_DATABASE_URL")
}
```

Da kan du kjøre:

```bash
npx prisma db push --schema prisma/schema.prisma --data-source-url $TEST_DATABASE_URL
```

---

## DOKKOMMANDOER

```bash
# Start
docker-compose -f docker-compose.test.yml up -d

# Stop
docker-compose -f docker-compose.test.yml down

# Fjern volumes (ødelegger alt data)
docker-compose -f docker-compose.test.yml down -v

# Logs
docker logs tosom_test_db

# Exec i container
docker exec -it tosom_test_db sh

# PostgreSQL shell
docker exec -it tosom_test_db psql -U tosom -d tosom_test

# Status
docker-compose -f docker-compose.test.yml ps
```

---

## FEILFINDING

### "connection refused på port 5433"
Sjekk at containeren kjører:
```bash
docker ps | grep test_db
```

### "database already exists"
Sjekk at databaseen eksisterer:
```bash
docker exec -it tosom_test_db psql -U tosom -c "\l"
```

### "permission denied for database"
Sjekk at brukeren har tilgang:
```bash
docker exec -it tosom_test_db psql -U tosom -c "SELECT * FROM pg_roles WHERE rolname='tosom';"
```

---

## SIKKERHET

- Test-database bruker samme passord som dev (tosom/tosom)
- Ingen produksjonsdata skal lagres her
- Volumes kan slettes uten risiko for produksjon

---

## HUSK

- Ikke glem å stoppe test-db når den ikke er i bruk
- `docker-compose -f docker-compose.test.yml down`