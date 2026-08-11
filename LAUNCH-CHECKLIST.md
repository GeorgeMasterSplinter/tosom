# 🚀 ToSom — Launch Checklist

## Automatiserte sjekker (ALLEREDE BESTÅTT ✅)

### TypeScript & Build
- [x] `npx tsc --noEmit` → EXIT_CODE=0
- [x] `npx next build` → EXIT_CODE=0
- [x] `npx next lint` → No warnings or errors

### Matching-motor
- [x] `npx tsx scripts/verify-matching.ts` → ALLE 4 TESTER BESTÅTT

---

## Manuelle steg (MÅ KJØRES AV GEORGE)

### ⚠️ FORUTSETNING: DATABASEBACKUP
```bash
# Kjør backup FØR migrering!
npx tsx scripts/db/backup.ts
```

### 1. Prisma-migrering (deprecated modeller fjernet)
```bash
# Hvis DATABASE_URL er tilgjengelig lokalt:
npx prisma migrate dev --name remove_deprecated_models
npx prisma generate

# Hvis IKKE tilgjengelig lokalt, kjør på serveren:
# docker run --rm -e DATABASE_URL="..." -e DIRECT_URL="..." registry.tosom.no/tosom:prod npx prisma migrate deploy
```

### 2. Commit og push endringer
```bash
git add .
git commit -m "🚀 Pre-launch: stabilisering, språknormalisering, deprecated modeller fjernet"
git push origin main
```

### 3. Bygg og deploy
```bash
# Bygg Docker-image
docker build -f deploy/docker/Dockerfile -t tosom:prod .

# Push til register
docker push registry.tosom.no/tosom:prod

# SSH inn på server
ssh root@prod-server.tosom.no

# Stopp gammel container
docker stop tosom-app || true
docker rm tosom-app || true

# Trekk nytt image
docker pull registry.tosom.no/tosom:prod

# Kjør migreringer på prod
docker run --rm \
  -e DATABASE_URL="${DATABASE_URL}" \
  -e DIRECT_URL="${DIRECT_URL}" \
  registry.tosom.no/tosom:prod \
  npx prisma migrate deploy

# Start ny container
docker run -d \
  --name tosom-app \
  --restart unless-stopped \
  -e DATABASE_URL="${DATABASE_URL}" \
  -e NEXTAUTH_SECRET="${NEXTAUTH_SECRET}" \
  -e NEXTAUTH_URL="https://tosom.no" \
  -e AI_API_KEY="${AI_API_KEY}" \
  -e LOG_LEVEL="info" \
  -e NODE_ENV="production" \
  -e TOSOM_ENV="production" \
  -e API_BASE_URL="https://api.tosom.no" \
  -e FRONTEND_BASE_URL="https://tosom.no" \
  -p 3000:3000 \
  registry.tosom.no/tosom:prod
```

### 4. Verifiser healthcheck
```bash
curl https://api.tosom.no/api/system/health
# Forventet: {"status":"ok","database":"connected"}
```

### 5. Smoke tests (valgfritt)
```bash
SMOKE_BASE_URL=https://api.tosom.no \
SMOKE_ADMIN_TOKEN="${ADMIN_TOKEN}" \
npx tsx scripts/smoke/smokeTest.ts
```

### 6. Overvåk i 30 min
- Se /admin/observability/metrics
- Se /admin/security/overview
- Ingen nye feil eller flagg

---

## Rollback ved behov
```bash
docker stop tosom-app
docker run -d --name tosom-app \
  -e DATABASE_URL="${DATABASE_URL}" \
  registry.tosom.no/tosom:$(git log -1 --format=%h)
```

---

## Oppsummering av endringer i denne release

### Sikkerhet (Fase 1)
- Backdoor-ruter fjernet (super-login, dev-api/test)
- Rate limiting på alle sensitive endpointer
- CSP headers implementert
- Admin-autentisering forbedret

### API-stabilisering (Fase 2)
- Matching-ruter konsolidert til én kanonisk `/api/match`
- Dealbreaker fikset (gap >= 2 = automatisk avvisning)
- Deprecated scorer.ts fjernet
- Journey dag-diskrepans løst (30 dager, ikke 35)
- Database-modeller fjernet: MatchHistory, MatchQueue, MatchFeedback

### Polering (Fase 3)
- Root-nivå løsfiler arkivert til docs/archive/root-cleanup/
- app/vilkar → app/vilkår duplikat løst
- Språk normalisert til bokmål i alle 10 filer i lib/matching/

### Testing (Fase 4)
- TypeScript typecheck: ✅
- Next.js build: ✅
- ESLint: ✅
- Matching-motor verifisert: ✅ (scripts/verify-matching.ts)

### Pre-launch (Fase 5)
- deploy/README.md oppdatert til bokmål
- Migreringsinstruksjoner lagt til
- Docker/systemd konfigurasjon verifisert