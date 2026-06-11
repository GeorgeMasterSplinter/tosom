# ToSom Produksjonsdeploy

## Deploy-prosess (manuell)

### 1. Bygg Docker-image
```bash
docker build -f deploy/docker/Dockerfile -t tosom:prod .
```

### 2. Push til container register
```bash
docker push registry.tosom.no/tosom:prod
```

### 3. SSH inn på server
```bash
ssh root@prod-server.tosom.no
```

### 4. Stopp eksisterande container
```bash
docker stop tosom-app || true
docker rm tosom-app || true
```

### 5. Trekk nytt image
```bash
docker pull registry.tosom.no/tosom:prod
```

### 6. Køyre migreringar
```bash
docker run --rm \
  -e DATABASE_URL="${DATABASE_URL}" \
  -e DIRECT_URL="${DIRECT_URL}" \
  registry.tosom.no/tosom:prod \
  npx prisma migrate deploy
```

### 7. Start container
```bash
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

### 8. Verifiser healthcheck
```bash
curl https://api.tosom.no/api/system/health
```

Forventa respons: `{"status":"ok","database":"connected"}`

### 9. Køy smoke tests mot prod
```bash
SMOKE_BASE_URL=https://api.tosom.no \
SMOKE_ADMIN_TOKEN="${ADMIN_TOKEN}" \
npx tsx scripts/smoke/smokeTest.ts
```

### 10. Overvåk observability i 30 min
- Sjå /admin/observability/metrics
- Sjå /admin/security/overview
- Ingen nye feil eller flagg

## Manual Deploy Commands — Oppsummering av 10 manuelle steg

Her er alle kommandoane du må køyre manuelt i produksjon:

### Steg 1: Bygg Docker-image
```bash
docker build -f deploy/docker/Dockerfile -t tosom:prod .
```

### Steg 2: Push til container register
```bash
docker push registry.tosom.no/tosom:prod
```

### Steg 3: SSH inn på server
```bash
ssh root@prod-server.tosom.no
```

### Steg 4: Stopp eksisterande container
```bash
docker stop tosom-app || true
docker rm tosom-app || true
```

### Steg 5: Trekk nytt image
```bash
docker pull registry.tosom.no/tosom:prod
```

### Steg 6: Køyre migreringar
```bash
docker run --rm \
  -e DATABASE_URL="${DATABASE_URL}" \
  -e DIRECT_URL="${DIRECT_URL}" \
  registry.tosom.no/tosom:prod \
  npx prisma migrate deploy
```

### Steg 7: Start container
```bash
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

### Steg 8: Verifiser healthcheck
```bash
curl https://api.tosom.no/api/system/health
```

### Steg 9: Køy smoke tests
```bash
SMOKE_BASE_URL=https://api.tosom.no \
SMOKE_ADMIN_TOKEN="${ADMIN_TOKEN}" \
npx tsx scripts/smoke/smokeTest.ts
```

### Steg 10: Overvåk observability i 30 min
- Sjå /admin/observability/metrics
- Sjå /admin/security/overview
- Ingen nye feil eller flagg

## Rollback

Ved deploy-feil:
```bash
# Start forrige versjon
docker stop tosom-app
docker run -d --name tosom-app \
  -e DATABASE_URL="${DATABASE_URL}" \
  registry.tosom.no/tosom:$(git log -1 --format=%h)
# Verifiser healthcheck
curl https://api.tosom.no/api/system/health
```
