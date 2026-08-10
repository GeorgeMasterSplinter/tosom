# ToSom Rollback-strategi

## 1. Formål
Dokumentet beskriver rollback-prosessar for ToSom-produksjon ved deploy-feil eller kritiske problem.

## 2. Rollback av Docker-image

### Ved deploy-feil (app ikkje startar)
```bash
# Finn forrige fungerande image tag
docker images registry.tosom.no/tosom --format '{{.Repository}}:{{.Tag}}' | grep -v prod | tail -1

# Forrige image tag (f.eks. git commit hash)
PREV_TAG=$(docker images registry.tosom.no/tosom --format '{{.Repository}}:{{.Tag}}' | grep -v prod | tail -1)

# Stopp ny container
docker stop tosom-app || true

# Start forrige versjon
docker run -d --name tosom-app \
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
  ${PREV_TAG}

# Verifiser
curl https://api.tosom.no/api/system/health
```

### Ved AI/feature-feil (uten deploy-endring)
```bash
# Stopp container
docker stop tosom-app || true

# Start med forrige AI-key eller deaktiver AI
docker run -d --name tosom-app \
  -e DATABASE_URL="${DATABASE_URL}" \
  -e NEXTAUTH_SECRET="${NEXTAUTH_SECRET}" \
  -e NEXTAUTH_URL="https://tosom.no" \
  -e AI_API_KEY="" \
  -e LOG_LEVEL="info" \
  -e NODE_ENV="production" \
  -e TOSOM_ENV="production" \
  -e API_BASE_URL="https://api.tosom.no" \
  -e FRONTEND_BASE_URL="https://tosom.no" \
  -p 3000:3000 \
  registry.tosom.no/tosom:prod
```

## 3. Rollback av DB (ved migrasjonsfeil)

### VIKTIG: DB-rollback er farleg og bør unngåast!

### Alternativ 1: Bruk prisma migrate refresh (test)
```bash
# Berre i staging/pre-prod!
npx prisma migrate refresh --force
```

### Alternativ 2: Restaurer frå backup
```bash
# 1. Finn siste backup FEIL migrasjon
ls /backups/daily/

# 2. Restore backup
bash scripts/backup/dbRestore.sh /backups/daily/tosom_prod_TIMESTAMP.sql.gz

# 3. Verifiser
psql -h prod-db -U tosom_prod -d tosom_prod -c 'SELECT count(*) FROM users;'
```

### Alternativ 3: Rull tilbake migrasjon (kun viss migrations er simple)
```bash
# Sjekk forrige migration
npx prisma migrate resolve --applied <neste-migrasjon-navn>

# eller
npx prisma migrate reset --skip-seed
```

## 4. Rollback av config

### Ved feil i miljøvariablar
```bash
# 1. Korrigere .env.prod
nano /opt/tosom/.env.prod

# 2. Restart container
docker stop tosom-app
docker start tosom-app

# 3. Verifiser
curl https://api.tosom.no/api/system/health
```

### Ved feil i prod-config.json
```bash
# 1. Kopier forrige versjon
cp /opt/tosom/deploy/prod-config.json.bak /opt/tosom/deploy/prod-config.json

# 2. Restart
docker restart tosom-app
```

## 5. Rollback av cache

### Ved problem med cache
```bash
# Tøm cache
docker exec tosom-app rm -rf /opt/tosom/.next/cache

# Eller restart container
docker restart tosom-app
```

## 6. Rollback-sjekkliste

| Steg | Handling | Status |
|--|--|--|
| 1 | Identifiser problem | |
| 2 | Vel rollback-strategi (image/DB/config/cache) | |
| 3 | Utfør rollback | |
| 4 | Verifiser healthcheck | |
| 5 | Verifiser smoke tests | |
| 6 | Overvak i 30 min | |
| 7 | Dokumenter i incident log | |

## 7. ROLLBACK_STATUS

| Felt | Verdi |
|--|--|
| LAST_ROLLBACK | false |
| Sist rollback | |
| Årsak | |
| Utført av | |

Set `LAST_ROLLBACK = true` når rollback er gjennomført og verifisert.
